import { serve } from "https://deno.land/std@0.175.0/http/server.ts";
import { z } from "npm:zod@^3.24.1";

import { DB, getConnectionPool, getDatabaseClient } from "../lib/database.ts";

import { Transaction } from "kysely";
import { corsHeaders } from "../lib/headers.ts";
import { getJobMethodTree, JobMethodTreeItem } from "../lib/methods.ts";
import { requirePermissions } from "../lib/supabase.ts";

const pool = getConnectionPool(1);
const db = getDatabaseClient<DB>(pool);

const payloadValidator = z.object({
  type: z.enum(["jobMakeMethodRequirements", "jobRequirements"]),
  id: z.string(),
  companyId: z.string(),
  userId: z.string(),
});

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const payload = await req.json();

  try {
    const { type, id, companyId, userId } = payloadValidator.parse(payload);

    console.log({
      function: "recalculate",
      type,
      id,
      companyId,
      userId,
    });

    const client = await requirePermissions(req, companyId, userId, { update: "production" });

    switch (type) {
      case "jobMakeMethodRequirements": {
        const jobMakeMethodId = id;

        const [jobMakeMethod] = await Promise.all([
          client
            .from("jobMakeMethod")
            .select("*")
            .eq("id", jobMakeMethodId)
            .single(),
        ]);

        if (jobMakeMethod.error) {
          throw new Error(
            `Failed to get job makeMethod: ${jobMakeMethod.error.message}`
          );
        }

        let parentQuantity = 1;
        if (jobMakeMethod.data.parentMaterialId) {
          const jobMaterial = await client
            .from("jobMaterial")
            .select("*")
            .eq("id", jobMakeMethod.data.parentMaterialId)
            .single();
          if (jobMaterial.data?.methodType !== "Make to Order") {
            return new Response(JSON.stringify({ success: true }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            });
          }

          if (jobMaterial.error) {
            throw new Error(
              `Failed to get job material: ${jobMaterial.error.message}`
            );
          }

          if (!jobMaterial.data) {
            throw new Error(
              `Job material not found for id: ${jobMakeMethod.data.parentMaterialId}`
            );
          }

          if (jobMaterial.data.methodType !== "Make to Order") {
            console.log(
              `Job material ${jobMakeMethod.data.parentMaterialId} is not a 'Make' type. Skipping recalculation.`
            );
            return new Response(JSON.stringify({ success: true }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            });
          }

          parentQuantity =
            jobMaterial.data.estimatedQuantity ?? jobMaterial.data.quantity;
        } else {
          const job = await client
            .from("job")
            .select("*")
            .eq("id", jobMakeMethod.data.jobId)
            .single();
          if (job.error) {
            throw new Error(`Failed to get job: ${job.error.message}`);
          }
          parentQuantity = job.data.productionQuantity ?? 1;
        }

        const jobMethodTrees = await getJobMethodTree(
          client,
          jobMakeMethod.data.id,
          jobMakeMethod.data.parentMaterialId
        );

        if (jobMethodTrees.error) {
          throw new Error(
            `Failed to get method tree: ${jobMethodTrees.error.message}`
          );
        }

        const jobMethodTree = jobMethodTrees.data?.[0] as JobMethodTreeItem;
        if (!jobMethodTree) {
          throw new Error("Method tree not found");
        }

        // Same per-color durability as jobRequirements: if this recompute walks
        // a master's root make method, its color-scoped root materials must stay
        // scaled by plannedQtyForScope, not collapse to the job quantity. Null
        // for non-master jobs / sub-make-methods → original behavior.
        const variantCtx = await loadVariantScalingContext(
          client,
          jobMakeMethod.data.jobId,
          companyId
        );

        await db.transaction().execute(async (trx) => {
          await updateJobQuantities(trx, jobMethodTree, parentQuantity, {
            parentIsRoot: false,
            variantCtx,
          });
        });

        break;
      }
      case "jobRequirements": {
        const jobId = id;
        const [job, jobMakeMethod] = await Promise.all([
          client.from("job").select("*").eq("id", jobId).single(),
          client
            .from("jobMakeMethod")
            .select("*")
            .eq("jobId", jobId)
            .is("parentMaterialId", null)
            .single(),
        ]);

        if (jobMakeMethod.error) {
          throw new Error(
            `Failed to get job make method: ${jobMakeMethod.error.message}`
          );
        }

        const [jobMethodTrees] = await Promise.all([
          getJobMethodTree(client, jobMakeMethod.data.id),
        ]);

        if (jobMethodTrees.error) {
          throw new Error(
            `Failed to get method tree: ${jobMethodTrees.error.message}`
          );
        }

        const jobMethodTree = jobMethodTrees.data?.[0] as JobMethodTreeItem;
        if (!jobMethodTree) {
          throw new Error("Method tree not found");
        }

        // Per-color BOM (Apply on Variants) durability: a garment master
        // cutting job carries jobVariantQuantity rows (the per-color plan). Its
        // color-scoped root materials must stay scaled by each color's planned
        // qty (matching get-method) instead of collapsing to
        // perUnit × job.quantity. A bundle/plain job has no jobVariantQuantity
        // → null context → quantities computed exactly as before.
        const variantCtx = await loadVariantScalingContext(
          client,
          jobId,
          companyId
        );

        await db.transaction().execute(async (trx) => {
          // Use job.quantity as the root's target quantity (not productionQuantity)
          // The item's scrap percentage will be applied within updateJobQuantities
          await updateJobQuantities(
            trx,
            jobMethodTree,
            job.data?.quantity ?? 1,
            { parentIsRoot: false, variantCtx }
          );
        });

        break;
      }

      default:
        throw new Error(`Invalid type  ${type}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify(err), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

type VariantScalingContext = {
  /** Summed planned qty of every planned variant whose attributes ⊇ the scope. */
  plannedQtyForScope: (applyOn: string[]) => number;
  /** jobMaterial.id → its per-color scope (attribute value ids), [] if unscoped. */
  scopeById: Map<string, string[]>;
};

// Build the per-color scaling context for a job, or null when the job is not a
// garment master (no jobVariantQuantity rows). Mirrors the setup get-method uses
// so the two agree on how a master's color-scoped materials scale.
const loadVariantScalingContext = async (
  client: Awaited<ReturnType<typeof requirePermissions>>,
  jobId: string,
  companyId: string
): Promise<VariantScalingContext | null> => {
  const jvq = await client
    .from("jobVariantQuantity")
    .select("variantItemId, quantity")
    .eq("jobId", jobId)
    .eq("companyId", companyId);
  const jvqRows = (jvq.data ?? []) as Array<{
    variantItemId: string;
    quantity: number;
  }>;
  if (jvqRows.length === 0) return null;

  const variantIds = [
    ...new Set(jvqRows.map((r) => r.variantItemId).filter(Boolean)),
  ];
  const variants = variantIds.length
    ? await client
        .from("itemVariant")
        .select("variantItemId, itemVariantAttribute(attributeValueId)")
        .in("variantItemId", variantIds)
        .eq("companyId", companyId)
    : { data: [] };
  const valuesByVariant = new Map<string, Set<string>>();
  for (const v of (variants.data ?? []) as Array<{
    variantItemId: string;
    itemVariantAttribute: Array<{ attributeValueId: string }>;
  }>) {
    valuesByVariant.set(
      v.variantItemId,
      new Set((v.itemVariantAttribute ?? []).map((a) => a.attributeValueId))
    );
  }
  const variantPlans = jvqRows.map((r) => ({
    valueIds: valuesByVariant.get(r.variantItemId) ?? new Set<string>(),
    quantity: Number(r.quantity) || 0,
  }));
  const plannedQtyForScope = (applyOn: string[]): number =>
    variantPlans.reduce(
      (sum, p) =>
        applyOn.every((id) => p.valueIds.has(id)) ? sum + p.quantity : sum,
      0
    );

  const materials = await client
    .from("jobMaterial")
    .select("id, applyOnVariantValueIds")
    .eq("jobId", jobId)
    .eq("companyId", companyId);
  const scopeById = new Map<string, string[]>();
  for (const m of (materials.data ?? []) as Array<{
    id: string;
    applyOnVariantValueIds: unknown;
  }>) {
    scopeById.set(
      m.id,
      Array.isArray(m.applyOnVariantValueIds)
        ? (m.applyOnVariantValueIds as string[])
        : []
    );
  }

  return { plannedQtyForScope, scopeById };
};

const updateJobQuantities = async (
  trx: Transaction<DB>,
  tree: JobMethodTreeItem,
  parentEstimatedQuantity: number = 1,
  opts?: { parentIsRoot?: boolean; variantCtx?: VariantScalingContext | null }
) => {
  // Master per-color scaling: when this node is a DIRECT child of the root (a
  // top-level style BOM line) on a master job, and it carries a per-color scope,
  // scale it by that color's planned qty instead of the whole job quantity —
  // mirroring get-method. Shared lines (empty scope) and non-master jobs (no
  // variantCtx) fall through to the original job-quantity math untouched.
  let effectiveParentQuantity = parentEstimatedQuantity;
  if (opts?.parentIsRoot && opts.variantCtx && !tree.data.isRoot) {
    const scope = opts.variantCtx.scopeById.get(tree.id) ?? [];
    if (scope.length > 0) {
      effectiveParentQuantity = opts.variantCtx.plannedQtyForScope(scope);
    }
  }

  // Target quantity for this node:
  // - For root: targetQuantity = parentEstimatedQuantity (which is productionQuantity from job)
  // - For children: targetQuantity = effectiveParentQuantity * quantity (quantity per parent)
  const targetQuantity = tree.data.isRoot
    ? parentEstimatedQuantity
    : tree.data.quantity * effectiveParentQuantity;

  // Get scrap percentage from jobMaterial (stored at job creation time)
  // Fall back to itemReplenishment if not stored
  let scrapPercentage = 0;
  if (tree.data.methodType === "Make to Order") {
    const jobMaterial = await trx
      .selectFrom("jobMaterial")
      .select("itemScrapPercentage")
      .where("id", "=", tree.id)
      .executeTakeFirst();

    if (
      jobMaterial?.itemScrapPercentage != null &&
      jobMaterial.itemScrapPercentage > 0
    ) {
      scrapPercentage = Number(jobMaterial.itemScrapPercentage);
    } else {
      // Fall back to itemReplenishment
      const itemReplenishment = await trx
        .selectFrom("itemReplenishment")
        .select("scrapPercentage")
        .where("itemId", "=", tree.data.itemId)
        .executeTakeFirst();
      scrapPercentage = Number(itemReplenishment?.scrapPercentage ?? 0);
    }
  }

  // Calculate scrap and estimated quantities
  // scrapQuantity = portion attributable to scrap (only for Make parts)
  // totalWithScrap = target + scrap allowance (what we need to make/procure)
  // estimatedQuantity: For Make = good quantity (without scrap), For Buy/Pick = total
  const scrapQuantity =
    tree.data.methodType === "Make to Order" ? targetQuantity * scrapPercentage : 0;
  const totalWithScrap = Math.ceil(targetQuantity + scrapQuantity);
  // For Make: estimatedQuantity is good quantity (without scrap)
  // For Buy/Pick: estimatedQuantity = total (but scrap is 0, so same as target)
  const estimatedQuantity =
    tree.data.methodType === "Make to Order" ? targetQuantity : totalWithScrap;

  // Update jobMaterial with scrap and estimated quantities
  await trx
    .updateTable("jobMaterial")
    .set({
      scrapQuantity: scrapQuantity,
      estimatedQuantity: estimatedQuantity,
    })
    .where("id", "=", tree.id)
    .execute();

  if (tree.data.jobMaterialMakeMethodId) {
    const [jobMakeMethod] = await Promise.all([
      trx
        .selectFrom("jobMakeMethod")
        .select(["trackedEntityId", "requiresSerialTracking"])
        .where("id", "=", tree.data.jobMaterialMakeMethodId)
        .executeTakeFirst(),
      trx
        .updateTable("jobMakeMethod")
        .set({ quantityPerParent: tree.data.quantity })
        .where("id", "=", tree.data.jobMaterialMakeMethodId)
        .execute(),
      trx
        .updateTable("jobOperation")
        .set({
          targetQuantity: targetQuantity,
          operationQuantity: totalWithScrap,
        })
        .where("jobMakeMethodId", "=", tree.data.jobMaterialMakeMethodId)
        .where("reworkId", "is", null)
        .execute(),
    ]);

    if (jobMakeMethod?.trackedEntityId) {
      await trx
        .updateTable("trackedEntity")
        .set({
          quantity: jobMakeMethod.requiresSerialTracking ? 1 : totalWithScrap,
        })
        .where("id", "=", jobMakeMethod.trackedEntityId)
        .execute();
    }
  }

  // Recursively update children with this node's total (estimated + scrap)
  // Children use the total for their target calculation to properly cascade scrap
  if (tree.children) {
    for (const child of tree.children) {
      await updateJobQuantities(trx, child, totalWithScrap, {
        parentIsRoot: tree.data.isRoot,
        variantCtx: opts?.variantCtx ?? null,
      });
    }
  }
};
