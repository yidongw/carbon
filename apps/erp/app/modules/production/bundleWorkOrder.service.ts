import type { Database } from "@carbon/database";
import {
  localizeStyleColorNameByName,
  localizeVariantAttributeLabel
} from "@carbon/database/style-reference";
import type { BundleTicketLabel } from "@carbon/documents/pdf";
import { MES_URL } from "@carbon/env";
import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveVariantByValuesKey } from "~/modules/items/itemAttribute.service";
import { getBundleJobCuttingOperationIdsToDelete } from "~/modules/items/styleMethod.service";
import {
  getJobVariantQuantities,
  jobVariantQuantitiesToTable
} from "~/modules/production/jobVariantQuantity.service";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { getMasterCuttingOperationId } from "./masterWorkOrder.service";
import { insertJob } from "./production.service";

type VariantsQuantityRow = Record<string, string | number | boolean>;
type VariantsQuantityTable = {
  variantTable?: VariantsQuantityRow[];
};

/** Drop the `<prefix>_` from an internal id (e.g. `mwo_RWARP…` -> `RWARP…`). */
function stripIdPrefix(id: string): string {
  const underscore = id.indexOf("_");
  return underscore >= 0 ? id.slice(underscore + 1) : id;
}

/**
 * The shortest prefix of `id` (after its `<prefix>_`) that no id in `others`
 * shares — starting at 4 chars and growing by one on each collision. Used to
 * disambiguate a bundle's descriptive id across masters.
 */
function shortestDistinctIdPrefix(id: string, others: string[]): string {
  const sid = stripIdPrefix(id);
  const otherSids = others.map(stripIdPrefix);
  let length = 4;
  while (
    length < sid.length &&
    otherSids.some((other) => other.slice(0, length) === sid.slice(0, length))
  ) {
    length++;
  }
  return sid.slice(0, length);
}

/** One cutting cell → one bundle. Identity is valuesKey (attribute combo). */
type CuttingCell = {
  valuesKey: string;
  attributeLabel: string;
  quantity: number;
  configuration: VariantsQuantityTable;
};

export type BundleWorkOrder = NonNullable<
  Awaited<ReturnType<typeof getBundleWorkOrders>>["data"]
>[number];

/** All bundle work orders belonging to a master work order (ordered by sequence). */
export async function getBundleWorkOrders(
  client: SupabaseClient<Database>,
  masterWorkOrderId: string,
  companyId: string
) {
  return client
    .from("bundleWorkOrders")
    .select("*")
    .eq("masterWorkOrderId", masterWorkOrderId)
    .eq("companyId", companyId)
    .order("sequence", { ascending: true });
}

/**
 * Paginated list of bundle work orders. Company-wide for the list page, or
 * scoped to a single master via `masterWorkOrderId` (the Master WO detail tab).
 */
export async function getBundleWorkOrdersList(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: {
    search: string | null;
    masterWorkOrderId?: string;
  } & Partial<GenericQueryFilters>
) {
  let query = client
    .from("bundleWorkOrders")
    .select("*", { count: "exact" })
    .eq("companyId", companyId);

  if (args?.masterWorkOrderId) {
    query = query.eq("masterWorkOrderId", args.masterWorkOrderId);
  }

  if (args?.search) {
    query = query.or(
      `itemName.ilike.%${args.search}%,attributeLabel.ilike.%${args.search}%,jobReadableId.ilike.%${args.search}%,valuesKey.ilike.%${args.search}%`
    );
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "createdAt", ascending: false }
    ]);
  }

  return query;
}

export async function getBundleWorkOrder(
  client: SupabaseClient<Database>,
  id: string,
  companyId: string
) {
  return client
    .from("bundleWorkOrders")
    .select("*")
    .eq("id", id)
    .eq("companyId", companyId)
    .single();
}

/**
 * Build printable garment tickets for the given bundle work orders. Mirrors the
 * print-job resolver (`buildBundleTicketItem`) so the on-screen QR / label
 * routes and the ProxyBox print pipeline produce identical tickets. Enriches
 * each bundle with its master's totals (total cut / total bundles), the order
 * customer, and the current operation's work center.
 */
export async function getBundleTicketLabels(
  client: SupabaseClient<Database>,
  companyId: string,
  ids: string[],
  // Localize printed attribute values (Blue -> 蓝色) and names (Color -> 颜色).
  // Optional so non-localized callers keep the English/base labels.
  opts?: {
    locale?: string;
    translateAttributeName?: (name: string) => string;
  }
): Promise<BundleTicketLabel[]> {
  if (ids.length === 0) return [];

  const { data: bundles } = await client
    .from("bundleWorkOrders")
    .select(
      "id, jobId, itemId, masterWorkOrderId, sequence, quantity, jobReadableId, readableIdWithRevision, itemName, attributeValues, attributeLabel, valuesKey"
    )
    .eq("companyId", companyId)
    .in("id", ids);

  if (!bundles || bundles.length === 0) return [];

  const locale = opts?.locale;
  const translateAttributeName =
    opts?.translateAttributeName ?? ((name: string) => name);

  // 款号 is the PARENT style's readable id — the bundle's job item is a variant
  // SKU, so resolve its parent through itemVariant.
  const variantItemIds = [
    ...new Set(
      bundles
        .map((b) => (b as { itemId?: string | null }).itemId)
        .filter((v): v is string => Boolean(v))
    )
  ];
  const parentReadableByVariant = new Map<string, string>();
  if (variantItemIds.length > 0) {
    const { data: variants } = await client
      .from("itemVariant")
      .select(
        "variantItemId, parent:item!itemVariant_parentItemId_fkey(readableIdWithRevision)"
      )
      .eq("companyId", companyId)
      .in("variantItemId", variantItemIds);
    for (const v of variants ?? []) {
      const rid = (
        v.parent as { readableIdWithRevision?: string | null } | null
      )?.readableIdWithRevision;
      if (rid) parentReadableByVariant.set(v.variantItemId, rid);
    }
  }

  // Preserve the caller's requested order.
  const byId = new Map(bundles.map((b) => [b.id, b]));

  const labels = await Promise.all(
    ids
      .map((id) => byId.get(id))
      .filter((b): b is NonNullable<typeof b> => Boolean(b))
      .map(async (bundle): Promise<BundleTicketLabel> => {
        const [totalCut, totalBundles, customerName, workCenterName] =
          await Promise.all([
            bundleMasterTotalCut(client, bundle.masterWorkOrderId),
            bundleTotalBundles(client, bundle.masterWorkOrderId),
            bundleCustomer(client, bundle.jobId, bundle.masterWorkOrderId),
            bundleCurrentWorkCenter(client, bundle.jobId)
          ]);

        const attributeLabel =
          (bundle as { attributeLabel?: string | null }).attributeLabel ?? null;
        const attributeValues =
          (bundle as { attributeValues?: Record<string, string> })
            .attributeValues ?? {};
        const attributeLines = Object.entries(attributeValues)
          .filter(([, v]) => v != null && String(v).length > 0)
          .map(([name, value]) => ({
            name: translateAttributeName(name),
            value:
              localizeStyleColorNameByName(String(value), locale) ??
              String(value)
          }));

        const variantItemId = (bundle as { itemId?: string | null }).itemId;

        return {
          id: bundle.id!,
          readableId: bundle.jobReadableId ?? bundle.id!,
          bundleUrl: `${MES_URL ?? ""}/x/bundle/${bundle.id}`,
          styleReadableId:
            (variantItemId
              ? parentReadableByVariant.get(variantItemId)
              : undefined) ||
            bundle.readableIdWithRevision ||
            bundle.itemName ||
            bundle.jobReadableId ||
            "",
          attributeLines:
            attributeLines.length > 0
              ? attributeLines
              : attributeLabel
                ? [
                    {
                      name: translateAttributeName("Attributes"),
                      value: localizeVariantAttributeLabel(
                        attributeLabel,
                        locale
                      )
                    }
                  ]
                : [],
          attributeLabel,
          quantity: bundle.quantity ?? 0,
          sequence: bundle.sequence ?? null,
          totalBundles,
          totalCut,
          customerName,
          workCenterName
        };
      })
  );

  return labels;
}

async function bundleMasterTotalCut(
  client: SupabaseClient<Database>,
  masterWorkOrderId: string | null
): Promise<number | null> {
  if (!masterWorkOrderId) return null;
  const { data: master } = await client
    .from("masterWorkOrder")
    .select("jobId")
    .eq("id", masterWorkOrderId)
    .maybeSingle();
  if (!master?.jobId) return null;
  const { data: job } = await client
    .from("job")
    .select("quantity")
    .eq("id", master.jobId)
    .maybeSingle();
  return job?.quantity ?? null;
}

async function bundleTotalBundles(
  client: SupabaseClient<Database>,
  masterWorkOrderId: string | null
): Promise<number | null> {
  if (!masterWorkOrderId) return null;
  const { count } = await client
    .from("bundleWorkOrder")
    .select("id", { count: "exact", head: true })
    .eq("masterWorkOrderId", masterWorkOrderId);
  return count ?? null;
}

async function bundleCustomer(
  client: SupabaseClient<Database>,
  bundleJobId: string | null,
  masterWorkOrderId: string | null
): Promise<string | null> {
  const jobIds: string[] = [];
  if (bundleJobId) jobIds.push(bundleJobId);
  if (masterWorkOrderId) {
    const { data: master } = await client
      .from("masterWorkOrder")
      .select("jobId")
      .eq("id", masterWorkOrderId)
      .maybeSingle();
    if (master?.jobId) jobIds.push(master.jobId);
  }
  for (const jobId of jobIds) {
    const { data: job } = await client
      .from("job")
      .select("customer(name)")
      .eq("id", jobId)
      .maybeSingle();
    const name = (job?.customer as { name?: string } | null)?.name;
    if (name) return name;
  }
  return null;
}

async function bundleCurrentWorkCenter(
  client: SupabaseClient<Database>,
  bundleJobId: string | null
): Promise<string | null> {
  if (!bundleJobId) return null;
  const { data: op } = await client
    .from("jobOperation")
    .select("workCenter(name)")
    .eq("jobId", bundleJobId)
    .neq("status", "Done")
    .not("workCenterId", "is", null)
    .order("order", { ascending: true })
    .limit(1)
    .maybeSingle();
  return (op?.workCenter as { name?: string } | null)?.name ?? null;
}

/**
 * Process reports (Production / Rework / Scrap) filed against a bundle's backing
 * job, across all of its operations. Reuses the existing `productionQuantity`
 * data (a "process report" line), filtered by job via the operation join.
 */
export async function getBundleProcessReports(
  client: SupabaseClient<Database>,
  jobId: string,
  companyId: string
) {
  return client
    .from("productionQuantity")
    .select(
      "id, quantity, type, createdAt, jobOperation!inner(description, jobId), scrapReason(name)"
    )
    .eq("jobOperation.jobId", jobId)
    .eq("companyId", companyId)
    .is("invalidatedAt", null)
    .order("createdAt", { ascending: false });
}

/**
 * Create a bundle work order under a master. A child job (parentJobId = the
 * master's backing job) is created through `insertJob` for downstream execution,
 * then wrapped by the bundle work order carrying the variant identity.
 */
export async function insertBundleWorkOrder(
  client: SupabaseClient<Database>,
  input: {
    masterWorkOrderId: string;
    itemId: string;
    quantity: number;
    sequence?: number;
    cuttingProcessId?: string | null;
    /**
     * Descriptive id for the backing job (e.g. NE-BK-2XL-07). Used as the job's
     * readable jobId so the bundle's id *is* that label — the whole app reads it
     * via the bundleWorkOrders view's jobReadableId.
     */
    jobReadableId?: string;
    companyId: string;
    createdBy: string;
  }
) {
  // The child job is the bundle's execution backing; identity is the variant
  // SKU itemId. Do not persist colorCode/sizeCode — labels come from the child
  // item (readableId/name) via the bundleWorkOrders view.
  const job = await insertJob(client, {
    itemId: input.itemId,
    quantity: input.quantity,
    companyId: input.companyId,
    createdBy: input.createdBy,
    // Give the backing job the bundle's descriptive readable id (NE-BK-2XL-07)
    // instead of an auto J-number, so the bundle's job id *is* that label.
    jobId: input.jobReadableId,
    // Bundles are cut from an already-released master and go straight to the
    // floor — skip the Draft stage and create them released (Ready). This also
    // lets the production-event trigger auto-advance them to In Progress.
    status: "Ready"
  });

  if (job.error || !job.data) {
    return { data: null, error: job.error };
  }

  // Bundle jobs don't cut — cutting is done once on the master. Drop the cutting
  // operation(s) that get-method copied from the style method so the bundle only
  // carries the downstream (sew/finish) processes.
  const bundleOps = await client
    .from("jobOperation")
    .select("id, processId, order, tags, customFields")
    .eq("jobId", job.data.id)
    .eq("companyId", input.companyId);
  if (bundleOps.data && bundleOps.data.length > 0) {
    const cuttingIds = getBundleJobCuttingOperationIdsToDelete({
      operations: bundleOps.data,
      cuttingProcessId: input.cuttingProcessId ?? null
    });
    if (cuttingIds.length > 0) {
      await client
        .from("jobOperation")
        .delete()
        .in("id", cuttingIds)
        .eq("companyId", input.companyId);
    }
  }

  return client
    .from("bundleWorkOrder")
    .insert({
      masterWorkOrderId: input.masterWorkOrderId,
      jobId: job.data.id,
      sequence: input.sequence ?? 1,
      companyId: input.companyId,
      createdBy: input.createdBy
    })
    .select("id, jobId")
    .single();
}

/**
 * Turn one reported cutting config table into individual attribute-combo cells —
 * one cell (→ one bundle) per non-zero quantity. Combo-only: each row is
 * `{ valuesKey, Quantities }`.
 */
function extractCuttingCells(configuration: unknown): CuttingCell[] {
  const cfg = (configuration ?? null) as VariantsQuantityTable | null;
  const table = cfg?.variantTable;
  if (!Array.isArray(table)) return [];

  const toCell = (
    valuesKey: string,
    quantity: number,
    configuration: VariantsQuantityTable
  ): CuttingCell => {
    const parts = valuesKey.split("|").filter(Boolean);
    return {
      valuesKey,
      attributeLabel: parts.join(" · ") || valuesKey,
      quantity,
      configuration
    };
  };

  const cells: CuttingCell[] = [];
  for (const row of table) {
    const valuesKey = String(row.valuesKey ?? "").trim();
    if (!valuesKey) continue;
    const quantity = Number(row.Quantities) || 0;
    if (quantity <= 0) continue;
    const label = String(row.label ?? "").trim();
    const cell = toCell(valuesKey, quantity, {
      variantTable: [
        {
          valuesKey,
          Quantities: quantity,
          ...(label ? { label } : {})
        }
      ]
    });
    if (label) cell.attributeLabel = label;
    cells.push(cell);
  }
  return cells;
}

export type CuttingSplitBundle = {
  // Present = update this existing bundle's quantity; absent = create a new one.
  id?: string | null;
  // Source cut split row this bundle is materialized from (new bundles only).
  splitRowId?: string | null;
  valuesKey: string | null;
  quantity: number;
};

// A pending cut split row (un-bundled) — Split Batch prefills one bundle per row.
export type MasterSplitRow = {
  id: string;
  valuesKey: string;
  attributeLabel: string;
  quantity: number;
};

export type ExistingBundle = {
  id: string;
  jobReadableId: string;
  valuesKey: string | null;
  attributeLabel: string | null;
  quantity: number;
  reportedQuantity: number;
};

export type CuttingSplitCell = {
  valuesKey: string;
  attributeLabel: string;
  // Total reported cut for this combo — the cap: bundles for this cell
  // (existing + new) can't sum beyond what was actually cut.
  cut: number;
};

export type CuttingSplitProposal = {
  masterDisplayId: string | null;
  // One entry per configured attribute combo with a reported cut.
  cells: CuttingSplitCell[];
  // Bundles already created for this master — editable in the split modal.
  existingBundles: ExistingBundle[];
  // Pending cut rows (not yet bundled) — the split modal prefills one bundle per
  // row. Empty for cuts reported before split rows were captured (falls back to
  // an aggregate cell prefill).
  splitRows: MasterSplitRow[];
};

function cellKey(valuesKey: string | null | undefined): string {
  return (valuesKey ?? "").trim();
}

/**
 * The proposed bundle split for a Master Work Order: one cell per attribute
 * combo (valuesKey) in the master's plan. Each configured cell carries a
 * suggested quantity and a cap of (reported cut − already bundled), so the split
 * can't create more than was actually cut for any combo.
 */
export async function getCuttingSplitProposal(
  client: SupabaseClient<Database>,
  masterWorkOrderId: string,
  companyId: string
): Promise<CuttingSplitProposal> {
  const empty: CuttingSplitProposal = {
    masterDisplayId: null,
    cells: [],
    existingBundles: [],
    splitRows: []
  };

  const master = await client
    .from("masterWorkOrder")
    .select("id, jobId")
    .eq("id", masterWorkOrderId)
    .eq("companyId", companyId)
    .maybeSingle();
  if (master.error || !master.data?.jobId) return empty;
  const jobId = master.data.jobId;

  const job = await client
    .from("job")
    .select("jobId, itemId, configuration")
    .eq("id", jobId)
    .eq("companyId", companyId)
    .single();
  const masterDisplayId = job.data?.jobId ?? null;
  const itemId = job.data?.itemId;
  if (!itemId) return { ...empty, masterDisplayId };

  const plannedQty = await getJobVariantQuantities(client, jobId, companyId);
  const plannedCells = extractCuttingCells(
    jobVariantQuantitiesToTable(plannedQty.data ?? [])
  );

  const cuttingOperationId = await getMasterCuttingOperationId(
    client,
    jobId,
    companyId
  );
  const cutByCell = new Map<string, number>();
  let aggregateOnlyCut = 0;
  if (cuttingOperationId) {
    const cuts = await client
      .from("productionQuantity")
      .select("quantity, variantQuantities")
      .eq("jobOperationId", cuttingOperationId)
      .eq("companyId", companyId)
      .eq("type", "Production")
      .is("invalidatedAt", null);
    for (const row of cuts.data ?? []) {
      const rowCells = extractCuttingCells(row.variantQuantities);
      if (rowCells.length === 0) {
        aggregateOnlyCut += Number(row.quantity) || 0;
        continue;
      }
      for (const cell of rowCells) {
        const k = cellKey(cell.valuesKey);
        cutByCell.set(k, (cutByCell.get(k) ?? 0) + cell.quantity);
      }
    }
  }

  if (aggregateOnlyCut > 0) {
    for (const cell of plannedCells) {
      if (aggregateOnlyCut <= 0) break;
      const k = cellKey(cell.valuesKey);
      const already = cutByCell.get(k) ?? 0;
      const add = Math.min(
        Math.max(0, cell.quantity - already),
        aggregateOnlyCut
      );
      if (add > 0) {
        cutByCell.set(k, already + add);
        aggregateOnlyCut -= add;
      }
    }
    if (aggregateOnlyCut > 0) {
      console.warn(
        `getCuttingSplitProposal: ${aggregateOnlyCut} aggregate cut unit(s) for master ${masterWorkOrderId} exceed the plan and are not splittable.`
      );
    }
  }

  const existing = await getBundleWorkOrders(
    client,
    masterWorkOrderId,
    companyId
  );

  const existingBundles: ExistingBundle[] = (existing.data ?? []).map((b) => {
    const row = b as {
      id?: string;
      jobReadableId?: string | null;
      valuesKey?: string | null;
      attributeLabel?: string | null;
      quantity?: number | null;
      reportedQuantity?: number | null;
    };
    return {
      id: row.id ?? "",
      jobReadableId: row.jobReadableId ?? "",
      valuesKey: row.valuesKey ?? null,
      attributeLabel: row.attributeLabel ?? row.valuesKey ?? null,
      quantity: row.quantity ?? 0,
      reportedQuantity: row.reportedQuantity ?? 0
    };
  });

  const cells: CuttingSplitCell[] = [];
  for (const cell of plannedCells) {
    const k = cellKey(cell.valuesKey);
    const cut = cutByCell.get(k) ?? 0;
    if (cut <= 0) continue;
    cells.push({
      valuesKey: cell.valuesKey,
      attributeLabel: cell.attributeLabel,
      cut
    });
  }

  const pending = await (client as SupabaseClient<any>)
    .from("masterWorkOrderSplitRow")
    .select("id, valuesKey, quantity")
    .eq("masterWorkOrderId", masterWorkOrderId)
    .eq("companyId", companyId)
    .is("bundleWorkOrderId", null)
    .order("createdAt", { ascending: true });
  const splitRows: MasterSplitRow[] = (pending.data ?? []).map(
    (r: { id: string; valuesKey: string | null; quantity: number | null }) => {
      // valuesKey is the source of truth (backfilled + always written).
      const valuesKey = String(r.valuesKey ?? "").trim();
      return {
        id: r.id,
        valuesKey,
        attributeLabel: valuesKey.replace(/\|/g, " · ") || valuesKey,
        quantity: Number(r.quantity ?? 0)
      };
    }
  );

  return {
    masterDisplayId,
    cells,
    existingBundles,
    splitRows
  };
}

/**
 * Save a reviewed/edited split: create new bundles (rows without an id, quantity
 * > 0) and update the quantity of existing bundles (rows with an id). Bundle
 * numbers continue the master's existing sequence.
 */
export async function saveBundleSplit(
  client: SupabaseClient<Database>,
  input: {
    masterWorkOrderId: string;
    companyId: string;
    createdBy: string;
    bundles: CuttingSplitBundle[];
  }
): Promise<{
  data: { created: number; updated: number };
  error: Error | null;
}> {
  const master = await client
    .from("masterWorkOrder")
    .select("id, jobId")
    .eq("id", input.masterWorkOrderId)
    .eq("companyId", input.companyId)
    .maybeSingle();
  if (master.error)
    return { data: { created: 0, updated: 0 }, error: master.error };
  if (!master.data?.jobId) {
    return {
      data: { created: 0, updated: 0 },
      error: new Error("Master work order not found")
    };
  }
  const jobId = master.data.jobId;

  const cuttingOperationId = await getMasterCuttingOperationId(
    client,
    jobId,
    input.companyId
  );
  let cuttingProcessId: string | null = null;
  if (cuttingOperationId) {
    const cuttingOp = await client
      .from("jobOperation")
      .select("processId")
      .eq("id", cuttingOperationId)
      .eq("companyId", input.companyId)
      .single();
    cuttingProcessId = cuttingOp.data?.processId ?? null;
  }

  const job = await client
    .from("job")
    .select("itemId, jobId, item(readableId)")
    .eq("id", jobId)
    .eq("companyId", input.companyId)
    .single();
  if (job.error || !job.data?.itemId) {
    return {
      data: { created: 0, updated: 0 },
      error: job.error ?? new Error("Master job not found")
    };
  }
  const itemId = job.data.itemId;
  const styleReadableId =
    (job.data.item as { readableId?: string } | null)?.readableId ??
    job.data.jobId ??
    "BWO";

  // A short token from the master's internal id disambiguates bundle ids across
  // masters (the descriptive label repeats per-master, but a bundle's id is its
  // backing job's readable id, which is unique per company). Take the shortest
  // prefix that's distinct from every other master, growing it on collision.
  const otherMasters = await client
    .from("masterWorkOrder")
    .select("id")
    .eq("companyId", input.companyId)
    .neq("id", input.masterWorkOrderId);
  const masterToken = shortestDistinctIdPrefix(
    input.masterWorkOrderId,
    (otherMasters.data ?? []).map((m) => m.id)
  );

  const existing = await getBundleWorkOrders(
    client,
    input.masterWorkOrderId,
    input.companyId
  );
  const bundleJobById = new Map(
    (existing.data ?? []).map((b) => [b.id, b.jobId])
  );
  // Assign sequence numbers up front so concurrent creation can't race the
  // counter, then run every bundle's work in parallel. Each bundle targets a
  // distinct backing job, and per-bundle job creation (the get-method +
  // recalculate edge functions) dominates the wall-clock, so serializing them
  // in a loop was the main cost.
  let sequence = existing.data?.length ?? 0;
  const planned = input.bundles.map((bundle) => {
    const quantity = Number(bundle.quantity) || 0;
    if (bundle.id) {
      return { kind: "update" as const, bundle, quantity };
    }
    if (quantity <= 0) {
      return { kind: "skip" as const };
    }
    sequence += 1;
    // The bundle's descriptive id (also used as its backing job's readable id).
    const valuesKey = bundle.valuesKey?.trim() ?? "";
    const jobReadableId = [
      styleReadableId,
      valuesKey.replace(/\|/g, "-") || "NA",
      masterToken,
      String(sequence).padStart(2, "0")
    ].join("-");
    return {
      kind: "create" as const,
      bundle: { ...bundle, valuesKey },
      quantity,
      sequence,
      jobReadableId
    };
  });

  const processOp = async (op: (typeof planned)[number]) => {
    if (op.kind === "skip") {
      return { created: 0, updated: 0, error: null as Error | null };
    }

    if (op.kind === "update") {
      // Update an existing bundle's target quantity — it lives on the backing
      // job (the bundleWorkOrders view reads job.quantity); the bundle row
      // itself carries no quantity/configuration to update.
      const backingJobId = op.bundle.id
        ? bundleJobById.get(op.bundle.id)
        : null;
      if (!backingJobId) return { created: 0, updated: 0, error: null };
      const jobUpdate = await client
        .from("job")
        .update({
          quantity: op.quantity,
          updatedBy: input.createdBy,
          updatedAt: new Date().toISOString()
        })
        .eq("id", backingJobId)
        .eq("companyId", input.companyId);
      if (jobUpdate.error) {
        return { created: 0, updated: 0, error: jobUpdate.error };
      }
      return { created: 0, updated: 1, error: null };
    }

    const valuesKey = op.bundle.valuesKey?.trim() ?? "";
    if (!valuesKey) {
      return {
        created: 0,
        updated: 0,
        error: new Error("Bundle is missing attribute combo (valuesKey)")
      };
    }
    const resolved = await resolveVariantByValuesKey(client, {
      parentItemId: itemId,
      companyId: input.companyId,
      valuesKey
    });
    if (resolved.error) {
      return { created: 0, updated: 0, error: resolved.error };
    }
    if (!resolved.data || resolved.data === itemId) {
      return {
        created: 0,
        updated: 0,
        error: new Error(
          `No variant SKU exists for ${valuesKey.replace(/\|/g, " / ")}`
        )
      };
    }
    const inserted = await insertBundleWorkOrder(client, {
      masterWorkOrderId: input.masterWorkOrderId,
      itemId: resolved.data,
      quantity: op.quantity,
      sequence: op.sequence,
      cuttingProcessId,
      jobReadableId: op.jobReadableId,
      companyId: input.companyId,
      createdBy: input.createdBy
    });
    if (inserted.error || !inserted.data) {
      return { created: 0, updated: 0, error: inserted.error };
    }

    // Materialize the source cut split row onto this bundle.
    if (op.bundle.splitRowId) {
      await (client as SupabaseClient<any>)
        .from("masterWorkOrderSplitRow")
        .update({
          bundleWorkOrderId: inserted.data.id,
          updatedBy: input.createdBy,
          updatedAt: new Date().toISOString()
        })
        .eq("id", op.bundle.splitRowId)
        .eq("companyId", input.companyId);
    }
    return { created: 1, updated: 0, error: null };
  };

  // Cap concurrency so a large split doesn't fire dozens of edge-function
  // invocations at once.
  const CONCURRENCY = 8;
  let created = 0;
  let updated = 0;
  let firstError: Error | null = null;
  for (let i = 0; i < planned.length; i += CONCURRENCY) {
    const chunk = planned.slice(i, i + CONCURRENCY);
    const results = await Promise.all(chunk.map(processOp));
    for (const r of results) {
      created += r.created;
      updated += r.updated;
      if (r.error && !firstError) firstError = r.error;
    }
  }

  return { data: { created, updated }, error: firstError };
}

/**
 * Replace a cutting report's still-pending cut split rows with its current rows.
 * Already-materialized rows (linked to a bundle) are left alone, so re-reporting
 * only rewrites what hasn't been bundled yet. Called after a master WO cutting
 * production report is saved.
 */
export async function replaceMasterCuttingSplitRows(
  client: SupabaseClient<Database>,
  input: {
    masterWorkOrderId: string;
    productionQuantityReportId: string;
    companyId: string;
    createdBy: string;
    rows: {
      valuesKey?: string | null;
      quantity: number;
    }[];
  }
): Promise<{ error: Error | null }> {
  const c = client as SupabaseClient<any>;
  const del = await c
    .from("masterWorkOrderSplitRow")
    .delete()
    .eq("companyId", input.companyId)
    .eq("productionQuantityReportId", input.productionQuantityReportId)
    .is("bundleWorkOrderId", null);
  if (del.error) return { error: del.error };

  const rows = input.rows.filter((r) => (Number(r.quantity) || 0) > 0);
  if (rows.length === 0) return { error: null };

  const insert = await c.from("masterWorkOrderSplitRow").insert(
    rows.map((r) => {
      const valuesKey = (r.valuesKey && String(r.valuesKey).trim()) || "";
      return {
        masterWorkOrderId: input.masterWorkOrderId,
        companyId: input.companyId,
        productionQuantityReportId: input.productionQuantityReportId,
        valuesKey: valuesKey || null,
        quantity: Number(r.quantity) || 0,
        createdBy: input.createdBy
      };
    })
  );
  return { error: insert.error };
}

/**
 * After production is reported against a Bundle Work Order's job, cache the
 * bundle's reported quantity + last-reported timestamp on the bundle row, and
 * auto-complete the bundle's job once the reported quantity reaches the target.
 * No-op when the job isn't a bundle.
 */
export async function recordBundleProductionReport(
  client: SupabaseClient<Database>,
  input: {
    jobId: string;
    companyId: string;
    createdBy: string;
    lines: { type: string; quantity: number }[];
  }
): Promise<{ error: Error | null }> {
  const bundle = await client
    .from("bundleWorkOrder")
    .select("id, reportedQuantity")
    .eq("jobId", input.jobId)
    .eq("companyId", input.companyId)
    .maybeSingle();
  if (bundle.error) return { error: bundle.error };
  if (!bundle.data) return { error: null };

  const producedDelta = input.lines
    .filter((line) => line.type === "Production")
    .reduce((sum, line) => sum + (line.quantity || 0), 0);

  const nowIso = new Date().toISOString();
  const reportedQuantity = (bundle.data.reportedQuantity ?? 0) + producedDelta;

  const update = await client
    .from("bundleWorkOrder")
    .update({
      reportedQuantity,
      lastReportedAt: nowIso,
      updatedBy: input.createdBy,
      updatedAt: nowIso
    })
    .eq("id", bundle.data.id);
  if (update.error) return { error: update.error };

  // Auto-complete the bundle's job once the reported quantity reaches the target.
  const job = await client
    .from("job")
    .select("quantity, status")
    .eq("id", input.jobId)
    .single();
  const target = job.data?.quantity ?? 0;
  if (
    producedDelta > 0 &&
    target > 0 &&
    reportedQuantity >= target &&
    job.data?.status !== "Completed"
  ) {
    await client
      .from("job")
      .update({
        status: "Completed",
        completedDate: nowIso,
        updatedBy: input.createdBy
      })
      .eq("id", input.jobId)
      .eq("companyId", input.companyId);
  }

  return { error: null };
}
