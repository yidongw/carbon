import type { Database, Json } from "@carbon/database";
import type { Kysely, KyselyDatabase } from "@carbon/database/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  isStyleCuttingOperation,
  splitGarmentJobItems
} from "~/modules/items/styleMethod.service";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import {
  getJobVariantQuantities,
  jobVariantQuantitiesToTable
} from "./jobVariantQuantity.service";
import type { deadlineTypes } from "./production.models";
import { insertJob } from "./production.service";
import { computeVariantTableRemaining } from "./variantTable";

export type MasterCuttingProgress = {
  jobId: string;
  itemId: string | null;
  cuttingOperationId: string | null;
  reported: number;
  remaining: number;
  // Remaining planned quantity per variant combo (for the read-only modal).
  remainingConfiguration: unknown;
};

/**
 * Per master work order: how much of the plan has been cut (the cutting
 * operation's completed quantity) and what remains, plus the remaining
 * quantity per variant combo. Batched for a page of masters.
 */
export async function getMasterCuttingProgress(
  client: SupabaseClient<Database>,
  masters: {
    id: string | null;
    jobId: string | null;
    itemId: string | null;
    quantity: number | null;
  }[],
  companyId: string
): Promise<Record<string, MasterCuttingProgress>> {
  const result: Record<string, MasterCuttingProgress> = {};
  const jobIds = masters
    .map((m) => m.jobId)
    .filter((id): id is string => Boolean(id));
  if (jobIds.length === 0) return result;

  const [ops, makeMethods] = await Promise.all([
    client
      .from("jobOperation")
      .select(
        "id, jobId, tags, customFields, order, quantityComplete, jobMakeMethodId"
      )
      .in("jobId", jobIds)
      .eq("companyId", companyId)
      .order("order", { ascending: true }),
    client
      .from("jobMakeMethod")
      .select("id, parentMaterialId")
      .in("jobId", jobIds)
      .eq("companyId", companyId)
  ]);

  // Nested sub-assembly make methods — their ops (e.g. dyeing) are fabric prep,
  // never the style's cutting op, even when re-sequenced ahead of it.
  const nestedMakeMethodIds = new Set(
    (makeMethods.data ?? [])
      .filter((mm) => mm.parentMaterialId != null)
      .map((mm) => mm.id)
  );

  const opsByJob = new Map<string, NonNullable<typeof ops.data>>();
  for (const op of ops.data ?? []) {
    if (!op.jobId) continue;
    const list = opsByJob.get(op.jobId);
    if (list) list.push(op);
    else opsByJob.set(op.jobId, [op]);
  }

  // Planned Style qty lives on jobVariantQuantity (not job.configuration).
  const planConfigByJob = new Map<string, Json>();
  await Promise.all(
    jobIds.map(async (jobId) => {
      const planned = await getJobVariantQuantities(client, jobId, companyId);
      if (planned.data.length > 0) {
        planConfigByJob.set(
          jobId,
          jobVariantQuantitiesToTable(planned.data) as unknown as Json
        );
      }
    })
  );

  // Resolve the cutting operation per job (tagged cutting, else first-in-BOP).
  const cuttingOpByJob = new Map<
    string,
    { id: string; quantityComplete: number }
  >();
  for (const [jobId, jobOps] of opsByJob) {
    const rootOps = jobOps.filter(
      (op) =>
        !op.jobMakeMethodId || !nestedMakeMethodIds.has(op.jobMakeMethodId)
    );
    const cutting =
      rootOps.find((op) =>
        isStyleCuttingOperation({
          tags: op.tags ?? [],
          customFields: op.customFields
        })
      ) ??
      rootOps[0] ??
      jobOps[0];
    if (cutting) {
      cuttingOpByJob.set(jobId, {
        id: cutting.id,
        quantityComplete: Number(cutting.quantityComplete) || 0
      });
    }
  }

  // Reported cutting config tables, grouped by cutting operation.
  const cuttingOpIds = [...cuttingOpByJob.values()].map((c) => c.id);
  const reportedVariantQuantitiesByOp = new Map<string, Json[]>();
  if (cuttingOpIds.length > 0) {
    const pq = await client
      .from("productionQuantity")
      .select("jobOperationId, variantQuantities")
      .in("jobOperationId", cuttingOpIds)
      .eq("companyId", companyId)
      .eq("type", "Production")
      .is("invalidatedAt", null);
    for (const row of pq.data ?? []) {
      if (!row.jobOperationId) continue;
      const list = reportedVariantQuantitiesByOp.get(row.jobOperationId);
      if (list) list.push(row.variantQuantities);
      else
        reportedVariantQuantitiesByOp.set(row.jobOperationId, [
          row.variantQuantities
        ]);
    }
  }

  for (const master of masters) {
    if (!master.id || !master.jobId) continue;
    const cuttingOp = cuttingOpByJob.get(master.jobId);
    const reported = cuttingOp?.quantityComplete ?? 0;
    const plan = master.quantity ?? 0;
    const remaining = Math.max(0, plan - reported);
    const planConfig = planConfigByJob.get(master.jobId) ?? null;
    const remainingConfiguration = cuttingOp
      ? computeVariantTableRemaining(
          planConfig,
          reportedVariantQuantitiesByOp.get(cuttingOp.id) ?? []
        )
      : { variantTable: [] };

    result[master.id] = {
      jobId: master.jobId,
      itemId: master.itemId,
      cuttingOperationId: cuttingOp?.id ?? null,
      reported,
      remaining,
      remainingConfiguration
    };
  }

  return result;
}

export type MasterProcessBundle = {
  bundleWorkOrderId: string;
  jobReadableId: string;
  attributeLabel: string | null;
  attributeValues: Record<string, string> | null;
  /**
   * The bundle's *operation* status for this process (Todo / In Progress /
   * Done …), not the bundle work order's own lifecycle status — this row
   * represents progress on one operation, so it mirrors the operations tab.
   */
  operationStatus: string | null;
  quantity: number;
  reportedQuantity: number;
  remainingQuantity: number;
  assignee: string | null;
  assignedAt: string | null;
};

export type MasterProcess = {
  description: string;
  /** True for the master's cutting process (style-identified), so the UI can
   * show a translated "Cutting" label instead of the raw description. */
  isCutting: boolean;
  /** Inside / Outside / Inside and Outside — from the master job operation. */
  operationType: string | null;
  /** readableId of the item this process makes (the Style for the style's own
   * ops; the sub-assembly, e.g. finished fabric, for nested prep ops). */
  itemReadableId: string | null;
  /** When the master job operation was assigned. */
  assignedAt: string | null;
  bundleCount: number;
  quantity: number;
  reportedQuantity: number;
  /**
   * The master job operation's own assignee (e.g. cutting). Bundle-sourced
   * processes have no single master-owned assignee — their assignees live on
   * `bundles[]` and are shown as a stacked group instead.
   */
  assignee: string | null;
  bundles: MasterProcessBundle[];
};

/**
 * The Master Work Order's processes: one row per distinct operation, taken from
 * the master job's own operations (so they show even before any bundle exists),
 * with the plan quantity, and each bundle (assignee, reported/remaining
 * quantity, timestamps, status) rolled up as expandable children.
 */
export async function getMasterProcessBreakdown(
  client: SupabaseClient<Database>,
  masterWorkOrderId: string,
  companyId: string
): Promise<MasterProcess[]> {
  // The canonical process list comes from the master job's own operations, so a
  // freshly-created master work order shows its processes before it's split into
  // bundles.
  const master = await client
    .from("masterWorkOrder")
    .select("jobId")
    .eq("id", masterWorkOrderId)
    .eq("companyId", companyId)
    .single();
  if (master.error || !master.data?.jobId) return [];

  const masterJobId = master.data.jobId;
  const masterJob = await client
    .from("job")
    .select("quantity")
    .eq("id", masterJobId)
    .single();
  const masterQuantity = Number(masterJob.data?.quantity ?? 0);

  const masterOps = await client
    .from("jobOperation")
    .select(
      "id, description, quantityComplete, assignee, assignedAt, operationType, tags, customFields, jobMakeMethodId"
    )
    .eq("jobId", masterJobId)
    .eq("companyId", companyId)
    .order("order", { ascending: true });
  if (masterOps.error) return [];

  // Identify the cutting operation the same way getMasterCuttingOperationId does
  // — the style-tagged op, else the first (lowest-order) ROOT-method op. Master
  // jobs aren't always tag/styleStage-stamped, and nested sub-assembly prep
  // (e.g. dyeing) can be re-sequenced ahead of cutting, so restrict the
  // first-op fallback to root operations or a prep op would be mislabelled.
  const masterOpsData = masterOps.data ?? [];
  const nestedIds = await getNestedMakeMethodIds(
    client,
    masterJobId,
    companyId
  );
  const isRootOp = (op: { jobMakeMethodId?: string | null }) =>
    !op.jobMakeMethodId || !nestedIds.has(op.jobMakeMethodId);
  const rootMasterOps = masterOpsData.filter(isRootOp);
  const cuttingOpId =
    rootMasterOps.find((op) =>
      isStyleCuttingOperation({
        tags: op.tags ?? [],
        customFields: op.customFields
      })
    )?.id ??
    rootMasterOps[0]?.id ??
    masterOpsData[0]?.id ??
    null;

  // Map each operation's make method → the item it makes, for the item column.
  const makeMethodItems = await client
    .from("jobMakeMethod")
    .select("id, itemId")
    .eq("jobId", masterJobId)
    .eq("companyId", companyId);
  const itemIdByMakeMethod = new Map(
    (makeMethodItems.data ?? []).map((mm) => [mm.id, mm.itemId])
  );
  const itemIds = [
    ...new Set(
      [...itemIdByMakeMethod.values()].filter((id): id is string => !!id)
    )
  ];
  const readableByItemId = new Map<string, string>();
  if (itemIds.length) {
    const items = await client
      .from("item")
      .select("id, readableId")
      .in("id", itemIds)
      .eq("companyId", companyId);
    for (const it of items.data ?? []) {
      readableByItemId.set(it.id, it.readableId ?? "");
    }
  }
  const itemReadableForOp = (op: { jobMakeMethodId?: string | null }) => {
    const itemId = op.jobMakeMethodId
      ? itemIdByMakeMethod.get(op.jobMakeMethodId)
      : null;
    return itemId ? (readableByItemId.get(itemId) ?? null) : null;
  };

  // Preserve operation order; seed each process from the master job's plan.
  const order: string[] = [];
  const byDescription = new Map<string, MasterProcess>();
  const ensureProcess = (description: string): MasterProcess => {
    let process = byDescription.get(description);
    if (!process) {
      order.push(description);
      process = {
        description,
        isCutting: false,
        operationType: null,
        itemReadableId: null,
        assignedAt: null,
        bundleCount: 0,
        quantity: masterQuantity,
        reportedQuantity: 0,
        assignee: null,
        bundles: []
      };
      byDescription.set(description, process);
    }
    return process;
  };
  for (const op of masterOpsData) {
    // The master reports its own operation(s) directly (e.g. cutting), so seed
    // the process's reported quantity from the master op's completed count.
    const process = ensureProcess(op.description ?? "—");
    process.reportedQuantity += Number(op.quantityComplete ?? 0);
    if (op.assignee) process.assignee = op.assignee;
    if (op.operationType) process.operationType = op.operationType;
    if (!process.itemReadableId) {
      process.itemReadableId = itemReadableForOp(op);
    }
    if (op.assignedAt) process.assignedAt = op.assignedAt;
    if (cuttingOpId && op.id === cuttingOpId) {
      process.isCutting = true;
    }
  }

  const bundles = await client
    .from("bundleWorkOrders")
    .select(
      "id, jobId, jobReadableId, attributeLabel, attributeValues, status, quantity, assignee, assignedAt"
    )
    .eq("masterWorkOrderId", masterWorkOrderId)
    .eq("companyId", companyId)
    .order("sequence", { ascending: true });

  const jobIds = (bundles.data ?? [])
    .map((b) => b.jobId)
    .filter(Boolean) as string[];
  const ops = jobIds.length
    ? await client
        .from("jobOperation")
        .select("jobId, description, quantityComplete, status")
        .in("jobId", jobIds)
        .eq("companyId", companyId)
        .order("order", { ascending: true })
    : null;
  if (ops?.error) return order.map((d) => byDescription.get(d)!);

  for (const op of ops?.data ?? []) {
    const description = op.description ?? "—";
    const bundle = (bundles.data ?? []).find((b) => b.jobId === op.jobId);
    if (!bundle) continue;

    const process = ensureProcess(description);
    const quantity = Number(bundle.quantity ?? 0);
    // Reported = the bundle operation's completed count: the real, per-process
    // production reported against the bundle.
    const reported = Number(op.quantityComplete ?? 0);
    process.bundleCount += 1;
    process.reportedQuantity += reported;
    process.bundles.push({
      bundleWorkOrderId: bundle.id ?? "",
      jobReadableId: bundle.jobReadableId ?? "",
      attributeLabel: bundle.attributeLabel ?? null,
      attributeValues:
        (bundle.attributeValues as Record<string, string> | null) ?? null,
      operationStatus: op.status ?? null,
      quantity,
      reportedQuantity: reported,
      remainingQuantity: Math.max(0, quantity - reported),
      assignee: bundle.assignee,
      assignedAt: bundle.assignedAt
    });
  }

  return order.map((d) => byDescription.get(d)!);
}

/**
 * Ids of a job's NESTED make methods (a sub-assembly hangs off a parent
 * jobMaterial, so `parentMaterialId` is non-null). Used to exclude sub-assembly
 * operations (e.g. fabric dyeing) from cutting detection — those are fabric prep,
 * never the style's own cutting step.
 */
async function getNestedMakeMethodIds(
  client: SupabaseClient<Database>,
  jobId: string,
  companyId: string
): Promise<Set<string>> {
  const makeMethods = await client
    .from("jobMakeMethod")
    .select("id, parentMaterialId")
    .eq("jobId", jobId)
    .eq("companyId", companyId);
  return new Set(
    (makeMethods.data ?? [])
      .filter((mm) => mm.parentMaterialId != null)
      .map((mm) => mm.id)
  );
}

/**
 * The jobOperation a Master Work Order's cutting is reported against — the
 * operation tagged as style cutting, falling back to the first ROOT-method
 * operation. Nested sub-assembly ops (e.g. an outside dyeing op that now runs
 * before cutting on the master) are excluded, so re-sequencing fabric prep ahead
 * of cutting can't make a prep op masquerade as the cutting op.
 */
export async function getMasterCuttingOperationId(
  client: SupabaseClient<Database>,
  jobId: string,
  companyId: string
): Promise<string | null> {
  const operations = await client
    .from("jobOperation")
    .select("id, tags, customFields, order, jobMakeMethodId")
    .eq("jobId", jobId)
    .eq("companyId", companyId)
    .order("order", { ascending: true });
  if (operations.error || !operations.data?.length) return null;

  const nestedIds = await getNestedMakeMethodIds(client, jobId, companyId);
  const rootOps = operations.data.filter(
    (op) => !op.jobMakeMethodId || !nestedIds.has(op.jobMakeMethodId)
  );

  const cutting = rootOps.find((op) =>
    isStyleCuttingOperation({
      tags: op.tags ?? [],
      customFields: op.customFields
    })
  );
  return cutting?.id ?? rootOps[0]?.id ?? operations.data[0]?.id ?? null;
}

/**
 * If `jobOperationId` is a Master Work Order's cutting operation, return that
 * master's id — used to open Split Batch right after a cutting report. Returns
 * null for any other job/operation. Mirrors the master-cutting check in
 * `storeMasterCuttingSplitRows`.
 */
export async function getMasterCuttingReportSplitTarget(
  client: SupabaseClient<Database>,
  jobId: string,
  jobOperationId: string,
  companyId: string
): Promise<string | null> {
  const master = await client
    .from("masterWorkOrder")
    .select("id")
    .eq("jobId", jobId)
    .eq("companyId", companyId)
    .maybeSingle();
  if (!master.data?.id) return null;
  const cuttingOpId = await getMasterCuttingOperationId(
    client,
    jobId,
    companyId
  );
  if (!cuttingOpId || cuttingOpId !== jobOperationId) return null;
  return master.data.id;
}

/**
 * True when this job backs a Master Work Order. Master jobs must not be
 * completed / received to inventory — stock lands on bundle (child) jobs.
 */
export async function isMasterWorkOrderJob(
  client: SupabaseClient<Database>,
  jobId: string
): Promise<boolean> {
  const master = await client
    .from("masterWorkOrder")
    .select("id")
    .eq("jobId", jobId)
    .maybeSingle();
  return !!master.data?.id;
}

export type MasterWorkOrder = NonNullable<
  Awaited<ReturnType<typeof getMasterWorkOrders>>["data"]
>[number];

/**
 * Paginated list of master work orders, joined to their backing job + style item
 * via the `masterWorkOrders` view. Mirrors the `getJobs` pattern so the list UI
 * reuses the generic query-filter machinery.
 */
export async function getMasterWorkOrders(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: { search: string | null } & GenericQueryFilters
) {
  let query = client
    .from("masterWorkOrders")
    .select("*", { count: "exact" })
    .eq("companyId", companyId);

  if (args?.search) {
    query = query.or(
      `jobReadableId.ilike.%${args.search}%,itemName.ilike.%${args.search}%,readableIdWithRevision.ilike.%${args.search}%`
    );
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "createdAt", ascending: false }
    ]);
  }

  return query;
}

export async function getMasterWorkOrder(
  client: SupabaseClient<Database>,
  id: string,
  companyId: string
) {
  return client
    .from("masterWorkOrders")
    .select("*")
    .eq("id", id)
    .eq("companyId", companyId)
    .single();
}

/**
 * Create a master work order for a Style item. The backing job is created
 * through the existing `insertJob` path (get-method + recalculate), and the
 * master work order row wraps it 1:1.
 */
export async function insertMasterWorkOrder(
  client: SupabaseClient<Database>,
  // Kysely connection so the garment split runs atomically (see
  // splitGarmentJobItems); pass `getDatabaseClient()` from the route.
  db: Kysely<KyselyDatabase>,
  input: {
    itemId: string;
    quantity: number;
    companyId: string;
    createdBy: string;
    locationId?: string;
    dueDate?: string;
    deadlineType?: (typeof deadlineTypes)[number];
    configuration?: Record<string, unknown>;
  }
) {
  const job = await insertJob(client, {
    itemId: input.itemId,
    quantity: input.quantity,
    companyId: input.companyId,
    createdBy: input.createdBy,
    locationId: input.locationId,
    dueDate: input.dueDate,
    deadlineType: input.deadlineType,
    configuration: input.configuration
  });

  if (job.error || !job.data) {
    return { data: null, error: job.error };
  }

  // A master work order does the batch (cutting) plus any fabric prep that must
  // happen before cutting (e.g. an outside dyeing op on the finished fabric, and
  // the fabric/greige it consumes). Route every operation AND material by "home":
  // the master keeps cutting + everything consumed at/before it; sew/finish and
  // their inputs drop to the bundles. Materials follow their consuming op, so
  // fabric stays on the master and is removed from bundles (no double consumption).
  const split = await splitGarmentJobItems(client, {
    jobId: job.data.id,
    companyId: input.companyId,
    role: "master",
    db
  });
  if (split.error) {
    return { data: null, error: split.error };
  }

  const masterWorkOrder = await client
    .from("masterWorkOrder")
    .insert({
      jobId: job.data.id,
      companyId: input.companyId,
      createdBy: input.createdBy
    })
    .select("id, jobId")
    .single();

  return masterWorkOrder;
}
