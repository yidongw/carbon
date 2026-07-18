import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getParentJobNonCuttingOperationIdsToDelete,
  isStyleCuttingOperation
} from "~/modules/items/styleMethod.service";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { computeConfigRemaining } from "./jobConfiguration";
import { deadlineTypes } from "./production.models";
import { insertJob } from "./production.service";

export type MasterCuttingProgress = {
  jobId: string;
  itemId: string | null;
  cuttingOperationId: string | null;
  reported: number;
  remaining: number;
  // Remaining planned quantity per color/size cell (for the read-only modal).
  remainingConfiguration: unknown;
};

/**
 * Per master work order: how much of the plan has been cut (the cutting
 * operation's completed quantity) and what remains, plus the remaining
 * quantity per color/size cell. Batched for a page of masters.
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

  const [ops, jobs] = await Promise.all([
    client
      .from("jobOperation")
      .select("id, jobId, tags, customFields, order, quantityComplete")
      .in("jobId", jobIds)
      .eq("companyId", companyId)
      .order("order", { ascending: true }),
    client
      .from("job")
      .select("id, configuration")
      .in("id", jobIds)
      .eq("companyId", companyId)
  ]);

  const opsByJob = new Map<string, NonNullable<typeof ops.data>>();
  for (const op of ops.data ?? []) {
    if (!op.jobId) continue;
    const list = opsByJob.get(op.jobId);
    if (list) list.push(op);
    else opsByJob.set(op.jobId, [op]);
  }
  const configByJob = new Map<string, Json>();
  for (const job of jobs.data ?? []) configByJob.set(job.id, job.configuration);

  // Resolve the cutting operation per job (tagged cutting, else first-in-BOP).
  const cuttingOpByJob = new Map<
    string,
    { id: string; quantityComplete: number }
  >();
  for (const [jobId, jobOps] of opsByJob) {
    const cutting =
      jobOps.find((op) =>
        isStyleCuttingOperation({
          tags: op.tags ?? [],
          customFields: op.customFields
        })
      ) ?? jobOps[0];
    if (cutting) {
      cuttingOpByJob.set(jobId, {
        id: cutting.id,
        quantityComplete: Number(cutting.quantityComplete) || 0
      });
    }
  }

  // Reported cutting config tables, grouped by cutting operation.
  const cuttingOpIds = [...cuttingOpByJob.values()].map((c) => c.id);
  const reportedConfigsByOp = new Map<string, Json[]>();
  if (cuttingOpIds.length > 0) {
    const pq = await client
      .from("productionQuantity")
      .select("jobOperationId, configuration")
      .in("jobOperationId", cuttingOpIds)
      .eq("companyId", companyId)
      .eq("type", "Production")
      .is("invalidatedAt", null);
    for (const row of pq.data ?? []) {
      if (!row.jobOperationId) continue;
      const list = reportedConfigsByOp.get(row.jobOperationId);
      if (list) list.push(row.configuration);
      else reportedConfigsByOp.set(row.jobOperationId, [row.configuration]);
    }
  }

  for (const master of masters) {
    if (!master.id || !master.jobId) continue;
    const cuttingOp = cuttingOpByJob.get(master.jobId);
    const reported = cuttingOp?.quantityComplete ?? 0;
    const plan = master.quantity ?? 0;
    const remaining = Math.max(0, plan - reported);
    const planConfig = configByJob.get(master.jobId) ?? null;
    const remainingConfiguration = cuttingOp
      ? computeConfigRemaining(
          planConfig,
          reportedConfigsByOp.get(cuttingOp.id) ?? []
        )
      : { configTable: [], configTablePrimaryKeys: [] };

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
  colorCode: string | null;
  colorName: string | null;
  sizeCode: string | null;
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
  lastReportedAt: string | null;
};

export type MasterProcess = {
  description: string;
  /** True for the master's cutting process (style-identified), so the UI can
   * show a translated "Cutting" label instead of the raw description. */
  isCutting: boolean;
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
    .select("id, description, quantityComplete, assignee, tags, customFields")
    .eq("jobId", masterJobId)
    .eq("companyId", companyId)
    .order("order", { ascending: true });
  if (masterOps.error) return [];

  // Identify the cutting operation the same way getMasterCuttingOperationId does
  // — the style-tagged op, else the first (lowest-order) op. Master jobs aren't
  // always tag/styleStage-stamped, so the tag check alone misses them.
  const masterOpsData = masterOps.data ?? [];
  const cuttingOpId =
    masterOpsData.find((op) =>
      isStyleCuttingOperation({
        tags: op.tags ?? [],
        customFields: op.customFields
      })
    )?.id ??
    masterOpsData[0]?.id ??
    null;

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
    if (cuttingOpId && op.id === cuttingOpId) {
      process.isCutting = true;
    }
  }

  const bundles = await client
    .from("bundleWorkOrders")
    .select(
      "id, jobId, jobReadableId, colorCode, colorName, sizeCode, status, quantity, reportedQuantity, assignee, assignedAt, lastReportedAt"
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
    // Reported comes from the bundle operation's completed count (the stored
    // bundleWorkOrder.reportedQuantity isn't maintained), so it reflects the
    // actual production reports filed against the bundle.
    const reported = Number(op.quantityComplete ?? 0);
    process.bundleCount += 1;
    process.reportedQuantity += reported;
    process.bundles.push({
      bundleWorkOrderId: bundle.id ?? "",
      jobReadableId: bundle.jobReadableId ?? "",
      colorCode: bundle.colorCode,
      colorName: bundle.colorName ?? null,
      sizeCode: bundle.sizeCode,
      operationStatus: op.status ?? null,
      quantity,
      reportedQuantity: reported,
      remainingQuantity: Math.max(0, quantity - reported),
      assignee: bundle.assignee,
      assignedAt: bundle.assignedAt,
      lastReportedAt: bundle.lastReportedAt
    });
  }

  return order.map((d) => byDescription.get(d)!);
}

/**
 * The jobOperation a Master Work Order's cutting is reported against — the
 * operation tagged as style cutting, falling back to the first operation.
 */
export async function getMasterCuttingOperationId(
  client: SupabaseClient<Database>,
  jobId: string,
  companyId: string
): Promise<string | null> {
  const operations = await client
    .from("jobOperation")
    .select("id, tags, customFields, order")
    .eq("jobId", jobId)
    .eq("companyId", companyId)
    .order("order", { ascending: true });
  if (operations.error || !operations.data?.length) return null;
  const cutting = operations.data.find((op) =>
    isStyleCuttingOperation({
      tags: op.tags ?? [],
      customFields: op.customFields
    })
  );
  return cutting?.id ?? operations.data[0]?.id ?? null;
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
  input: {
    itemId: string;
    quantity: number;
    companyId: string;
    createdBy: string;
    locationId?: string;
    dueDate?: string;
    deadlineType?: (typeof deadlineTypes)[number];
    configuration?: Record<string, unknown>;
    colorSize?: Database["public"]["Tables"]["masterWorkOrder"]["Insert"]["colorSize"];
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

  // A master work order only cuts — sew/finish are done on the bundles — so drop
  // the non-cutting operations that get-method copied from the style method, so
  // the master job carries only the cutting operation.
  const masterOps = await client
    .from("jobOperation")
    .select("id, processId, order, tags, customFields")
    .eq("jobId", job.data.id)
    .eq("companyId", input.companyId);
  if (masterOps.data && masterOps.data.length > 0) {
    const nonCuttingIds = getParentJobNonCuttingOperationIdsToDelete({
      operations: masterOps.data
    });
    if (nonCuttingIds.length > 0) {
      await client
        .from("jobOperation")
        .delete()
        .in("id", nonCuttingIds)
        .eq("companyId", input.companyId);
    }
  }

  const masterWorkOrder = await client
    .from("masterWorkOrder")
    .insert({
      jobId: job.data.id,
      companyId: input.companyId,
      createdBy: input.createdBy,
      colorSize: input.colorSize ?? null
    })
    .select("id, jobId")
    .single();

  return masterWorkOrder;
}
