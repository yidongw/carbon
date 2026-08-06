import type { Database } from "@carbon/database";
import type { BundleTicketLabel } from "@carbon/documents/pdf";
import { MES_URL } from "@carbon/env";
import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveVariantItemId } from "~/modules/items/itemAttribute.service";
import { getBundleJobCuttingOperationIdsToDelete } from "~/modules/items/styleMethod.service";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { getMasterCuttingOperationId } from "./masterWorkOrder.service";
import { insertJob } from "./production.service";

type ConfigRow = Record<string, string | number | boolean>;
type ConfigTable = {
  configTable?: ConfigRow[];
  configTablePrimaryKeys?: string[];
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

/** One color/size cutting cell → one bundle. */
type CuttingCell = {
  colorCode: string | null;
  sizeCode: string | null;
  quantity: number;
  configuration: ConfigTable;
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
      `itemName.ilike.%${args.search}%,colorCode.ilike.%${args.search}%,jobReadableId.ilike.%${args.search}%`
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
  ids: string[]
): Promise<BundleTicketLabel[]> {
  if (ids.length === 0) return [];

  const { data: bundles } = await client
    .from("bundleWorkOrders")
    .select(
      "id, jobId, masterWorkOrderId, sequence, colorCode, colorName, sizeCode, quantity, jobReadableId, readableIdWithRevision, itemName"
    )
    .eq("companyId", companyId)
    .in("id", ids);

  if (!bundles || bundles.length === 0) return [];

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

        return {
          id: bundle.id!,
          readableId: bundle.jobReadableId ?? bundle.id!,
          bundleUrl: `${MES_URL ?? ""}/x/bundle/${bundle.id}`,
          styleReadableId:
            bundle.readableIdWithRevision ||
            bundle.itemName ||
            bundle.jobReadableId ||
            "",
          colorName: bundle.colorName ?? bundle.colorCode ?? null,
          sizeCode: bundle.sizeCode ?? null,
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
 * then wrapped by the bundle work order carrying the color/size identity.
 */
export async function insertBundleWorkOrder(
  client: SupabaseClient<Database>,
  input: {
    masterWorkOrderId: string;
    itemId: string;
    quantity: number;
    sequence?: number;
    colorCode?: string | null;
    sizeCode?: string | null;
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
  // The child job is the bundle's execution backing; the bundle -> master link
  // is carried by bundleWorkOrder.masterWorkOrderId (the job table has no
  // parentJobId column), so we don't set one here. Prefer the variant SKU
  // itemId (resolved by color/size) when variants exist; colorCode/sizeCode
  // remain on the bundle row for display/compat. Bundles stay unconfigured so
  // production reporting shows a plain quantity.
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
      colorCode: input.colorCode ?? null,
      sizeCode: input.sizeCode ?? null,
      companyId: input.companyId,
      createdBy: input.createdBy
    })
    .select("id, jobId")
    .single();
}

/**
 * Turn one reported cutting config table into individual color/size cells —
 * one cell (→ one bundle) per (primary option × row) with quantity > 0.
 *
 * The config table is a matrix: the primary list param's options are the
 * quantity columns (`configTablePrimaryKeys`), the other list param is a
 * descriptor column on each row. We identify which param is primary by
 * matching the quantity-column keys against each param's list options, so the
 * color/size mapping is correct regardless of parameter order.
 */
function extractCuttingCells(
  configuration: unknown,
  colorParam: { key: string; listOptions: string[] | null } | undefined,
  sizeParam: { key: string; listOptions: string[] | null } | undefined
): CuttingCell[] {
  const cfg = (configuration ?? null) as ConfigTable | null;
  const table = cfg?.configTable;
  const primaryKeys = cfg?.configTablePrimaryKeys ?? [];
  if (!Array.isArray(table) || primaryKeys.length === 0) return [];

  const sizeOptions = new Set(sizeParam?.listOptions ?? []);
  // Primary = the param whose options are the quantity columns; otherwise the
  // primary column is treated as color (the `else` branch below).
  const sizeIsPrimary =
    sizeOptions.size > 0 && primaryKeys.every((k) => sizeOptions.has(k));

  const cells: CuttingCell[] = [];
  for (const row of table) {
    // Descriptor columns = everything that isn't a quantity column.
    const descriptors = Object.fromEntries(
      Object.entries(row).filter(([k]) => !primaryKeys.includes(k))
    );
    for (const key of primaryKeys) {
      const quantity = Number(row[key]) || 0;
      if (quantity <= 0) continue;

      let colorCode: string | null;
      let sizeCode: string | null;
      if (sizeIsPrimary) {
        sizeCode = key;
        colorCode = colorParam
          ? String(row[colorParam.key] ?? "") || null
          : null;
      } else {
        colorCode = key;
        sizeCode = sizeParam ? String(row[sizeParam.key] ?? "") || null : null;
      }

      cells.push({
        colorCode,
        sizeCode,
        quantity,
        // The bundle carries a single-cell config table for its own reporting.
        configuration: {
          configTable: [{ ...descriptors, [key]: quantity }],
          configTablePrimaryKeys: [key]
        }
      });
    }
  }
  return cells;
}

export type CuttingSplitBundle = {
  // Present = update this existing bundle's quantity; absent = create a new one.
  id?: string | null;
  // Source cut split row this bundle is materialized from (new bundles only).
  splitRowId?: string | null;
  colorCode: string | null;
  sizeCode: string | null;
  quantity: number;
};

// A pending cut split row (un-bundled) — Split Batch prefills one bundle per row.
export type MasterSplitRow = {
  id: string;
  colorCode: string | null;
  colorName: string | null;
  sizeCode: string | null;
  quantity: number;
};

export type ExistingBundle = {
  id: string;
  jobReadableId: string;
  colorCode: string | null;
  colorName: string | null;
  sizeCode: string | null;
  quantity: number;
  reportedQuantity: number;
};

export type CuttingSplitCell = {
  colorCode: string | null;
  colorName: string | null;
  sizeCode: string | null;
  // Total reported cut for this color/size — the cap: bundles for this cell
  // (existing + new) can't sum beyond what was actually cut.
  cut: number;
};

export type CuttingSplitProposal = {
  masterDisplayId: string | null;
  // The master's config-param axes (order colors/sizes for the add buttons).
  colorAxis: string[];
  sizeAxis: string[];
  // One entry per configured color/size cell with a reported cut.
  cells: CuttingSplitCell[];
  // Bundles already created for this master — editable in the split modal.
  existingBundles: ExistingBundle[];
  // Pending cut rows (not yet bundled) — the split modal prefills one bundle per
  // row. Empty for cuts reported before split rows were captured (falls back to
  // an aggregate cell prefill).
  splitRows: MasterSplitRow[];
};

function cellKey(colorCode: string | null, sizeCode: string | null): string {
  return `${colorCode ?? ""}|${sizeCode ?? ""}`;
}

/**
 * The proposed bundle split for a Master Work Order, as a color/size matrix
 * matching the master's config-param plan. Each configured cell carries a
 * suggested quantity and a cap of (reported cut − already bundled), so the split
 * can't create more than was actually cut for any color/size.
 */
export async function getCuttingSplitProposal(
  client: SupabaseClient<Database>,
  masterWorkOrderId: string,
  companyId: string
): Promise<CuttingSplitProposal> {
  const empty: CuttingSplitProposal = {
    masterDisplayId: null,
    colorAxis: [],
    sizeAxis: [],
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

  const params = await client
    .from("configurationParameter")
    .select("key, listOptions")
    .eq("itemId", itemId)
    .eq("companyId", companyId)
    .in("key", ["color", "size"]);
  const colorParam = params.data?.find((p) => p.key === "color");
  const sizeParam = params.data?.find((p) => p.key === "size");

  // Planned quantity per color/size cell (the config-param matrix).
  const plannedCells = extractCuttingCells(
    job.data?.configuration,
    colorParam,
    sizeParam
  );

  // Cut quantity per cell from the master's cutting reports.
  const cuttingOperationId = await getMasterCuttingOperationId(
    client,
    jobId,
    companyId
  );
  const cutByCell = new Map<string, number>();
  // Cut reported as a bare quantity with no color/size config table carries no
  // per-cell breakdown; accumulate it here and spread it over the plan below.
  let aggregateOnlyCut = 0;
  if (cuttingOperationId) {
    const cuts = await client
      .from("productionQuantity")
      .select("quantity, configuration")
      .eq("jobOperationId", cuttingOperationId)
      .eq("companyId", companyId)
      .eq("type", "Production")
      .is("invalidatedAt", null);
    for (const row of cuts.data ?? []) {
      const rowCells = extractCuttingCells(
        row.configuration,
        colorParam,
        sizeParam
      );
      if (rowCells.length === 0) {
        aggregateOnlyCut += Number(row.quantity) || 0;
        continue;
      }
      for (const cell of rowCells) {
        const k = cellKey(cell.colorCode, cell.sizeCode);
        cutByCell.set(k, (cutByCell.get(k) ?? 0) + cell.quantity);
      }
    }
  }

  // Attribute aggregate-only cut (no per-cell config) to the planned cells so it
  // is still splittable: fill each cell up to its plan, in config-param order.
  if (aggregateOnlyCut > 0) {
    for (const cell of plannedCells) {
      if (aggregateOnlyCut <= 0) break;
      const k = cellKey(cell.colorCode, cell.sizeCode);
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
    // Aggregate cut beyond the total plan (over-cut, or no plan to map onto) has
    // no color/size to attribute to, so it's capped at plan and left out of the
    // split. Surface it rather than dropping silently.
    if (aggregateOnlyCut > 0) {
      console.warn(
        `getCuttingSplitProposal: ${aggregateOnlyCut} aggregate cut unit(s) for master ${masterWorkOrderId} exceed the plan and are not splittable.`
      );
    }
  }

  // Existing bundles (for display) + already-bundled quantity per cell.
  const existing = await getBundleWorkOrders(
    client,
    masterWorkOrderId,
    companyId
  );
  // Display names for color codes (localized), so the split modal can show the
  // color name instead of the bare code.
  const styleColors = await client
    .from("styleColor")
    .select("colorCode, colorName")
    .eq("companyId", companyId);
  const colorNameByCode = new Map<string, string>();
  for (const c of styleColors.data ?? []) {
    if (c.colorCode)
      colorNameByCode.set(c.colorCode, c.colorName ?? c.colorCode);
  }
  const colorName = (code: string | null) =>
    code ? (colorNameByCode.get(code) ?? code) : null;

  const existingBundles: ExistingBundle[] = (existing.data ?? []).map((b) => ({
    id: b.id ?? "",
    jobReadableId: b.jobReadableId ?? "",
    colorCode: b.colorCode ?? null,
    colorName: colorName(b.colorCode ?? null),
    sizeCode: b.sizeCode ?? null,
    quantity: b.quantity ?? 0,
    reportedQuantity: b.reportedQuantity ?? 0
  }));

  const cells: CuttingSplitCell[] = [];
  const colorPresent = new Set<string>();
  const sizePresent = new Set<string>();
  for (const cell of plannedCells) {
    const k = cellKey(cell.colorCode, cell.sizeCode);
    const cut = cutByCell.get(k) ?? 0;
    if (cut <= 0) continue;
    cells.push({
      colorCode: cell.colorCode,
      colorName: colorName(cell.colorCode),
      sizeCode: cell.sizeCode,
      cut
    });
    if (cell.colorCode) colorPresent.add(cell.colorCode);
    if (cell.sizeCode) sizePresent.add(cell.sizeCode);
  }

  const orderAxis = (present: Set<string>, options: string[] | null) =>
    options && options.length > 0
      ? options.filter((o) => present.has(o))
      : [...present];

  // Pending cut rows (not yet materialized into a bundle) — the split modal
  // prefills one bundle per row.
  const pending = await (client as SupabaseClient<any>)
    .from("masterWorkOrderSplitRow")
    .select("id, colorCode, sizeCode, quantity")
    .eq("masterWorkOrderId", masterWorkOrderId)
    .eq("companyId", companyId)
    .is("bundleWorkOrderId", null)
    .order("createdAt", { ascending: true });
  const splitRows: MasterSplitRow[] = (pending.data ?? []).map(
    (r: {
      id: string;
      colorCode: string | null;
      sizeCode: string | null;
      quantity: number | null;
    }) => ({
      id: r.id,
      colorCode: r.colorCode ?? null,
      colorName: colorName(r.colorCode ?? null),
      sizeCode: r.sizeCode ?? null,
      quantity: Number(r.quantity ?? 0)
    })
  );

  return {
    masterDisplayId,
    colorAxis: orderAxis(colorPresent, colorParam?.listOptions ?? null),
    sizeAxis: orderAxis(sizePresent, sizeParam?.listOptions ?? null),
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
    const jobReadableId = [
      styleReadableId,
      bundle.colorCode ?? "NA",
      bundle.sizeCode ?? "NA",
      masterToken,
      String(sequence).padStart(2, "0")
    ].join("-");
    return {
      kind: "create" as const,
      bundle,
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

    const resolved = await resolveVariantItemId(client, {
      parentItemId: itemId,
      companyId: input.companyId,
      colorCode: op.bundle.colorCode,
      sizeCode: op.bundle.sizeCode
    });
    const inserted = await insertBundleWorkOrder(client, {
      masterWorkOrderId: input.masterWorkOrderId,
      itemId: resolved.data,
      quantity: op.quantity,
      sequence: op.sequence,
      colorCode: op.bundle.colorCode,
      sizeCode: op.bundle.sizeCode,
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
      colorCode: string | null;
      sizeCode: string | null;
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
    rows.map((r) => ({
      masterWorkOrderId: input.masterWorkOrderId,
      companyId: input.companyId,
      productionQuantityReportId: input.productionQuantityReportId,
      colorCode: r.colorCode,
      sizeCode: r.sizeCode,
      quantity: Number(r.quantity) || 0,
      createdBy: input.createdBy
    }))
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
