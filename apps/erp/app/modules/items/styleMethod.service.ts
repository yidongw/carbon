import type { Database, Json } from "@carbon/database";
import type { Kysely, KyselyDatabase } from "@carbon/database/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export const STYLE_CUTTING_PROCESS_TAG = "style:cutting-process";
export const STYLE_CUTTING_OPERATION_TAG = "style:cutting-operation";
export const STYLE_SYSTEM_OPERATION_TAG = "style:system-operation";

type StyleOperationLike = {
  id?: string;
  processId?: string | null;
  order?: number | null;
  tags?: string[] | null;
  customFields?: Json | null;
};

function getStyleStage(customFields: Json | null | undefined) {
  if (!customFields || typeof customFields !== "object") return null;
  const styleStage = (customFields as Record<string, unknown>).styleStage;
  return typeof styleStage === "string" ? styleStage : null;
}

export function isStyleCuttingOperation(operation: StyleOperationLike) {
  const tags = operation.tags ?? [];
  return (
    tags.includes(STYLE_CUTTING_OPERATION_TAG) ||
    getStyleStage(operation.customFields) === "cutting"
  );
}

export function isStyleSystemOwnedOperation(operation: StyleOperationLike) {
  const tags = operation.tags ?? [];
  if (tags.includes(STYLE_SYSTEM_OPERATION_TAG)) return true;
  if (!operation.customFields || typeof operation.customFields !== "object") {
    return false;
  }

  return (
    (operation.customFields as Record<string, unknown>).styleSystemOwned ===
    true
  );
}

export function isStyleCuttingOperationFirst(operations: StyleOperationLike[]) {
  if (operations.length === 0) return true;

  const cuttingOperation = operations.find((operation) =>
    isStyleCuttingOperation(operation)
  );
  if (!cuttingOperation) return true;

  const cuttingOrder = cuttingOperation.order ?? 0;
  const firstOrder = operations.reduce(
    (lowest, operation) => Math.min(lowest, operation.order ?? 0),
    Number.POSITIVE_INFINITY
  );

  return cuttingOrder <= firstOrder;
}

export function buildStyleCuttingMethodOperation(args: {
  makeMethodId: string;
  processId: string;
  companyId: string;
  createdBy: string;
  order?: number;
}) {
  return {
    makeMethodId: args.makeMethodId,
    processId: args.processId,
    companyId: args.companyId,
    createdBy: args.createdBy,
    order: args.order ?? 0,
    operationOrder: "After Previous" as const,
    operationType: "Inside" as const,
    description: "Cutting",
    setupUnit: "Minutes/Piece" as const,
    setupTime: 0,
    laborUnit: "Minutes/Piece" as const,
    laborTime: 0,
    machineUnit: "Minutes/Piece" as const,
    machineTime: 0,
    insideUnitCost: 0,
    tags: [STYLE_CUTTING_OPERATION_TAG, STYLE_SYSTEM_OPERATION_TAG],
    customFields: {
      styleStage: "cutting",
      styleSystemOwned: true
    }
  };
}

export function getBundleJobCuttingOperationIdsToDelete(args: {
  operations: Array<
    Required<Pick<StyleOperationLike, "id">> & StyleOperationLike
  >;
  cuttingProcessId?: string | null;
}) {
  const tagged = args.operations
    .filter((operation) => isStyleCuttingOperation(operation))
    .map((operation) => operation.id);
  if (tagged.length > 0) return tagged;

  if (args.cuttingProcessId) {
    const byProcess = args.operations
      .filter((operation) => operation.processId === args.cuttingProcessId)
      .map((operation) => operation.id);
    if (byProcess.length > 0) return byProcess;
  }

  const firstOperation = [...args.operations]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .find(Boolean);

  return firstOperation ? [firstOperation.id] : [];
}

export function getParentJobNonCuttingOperationIdsToDelete(args: {
  operations: Array<
    Required<Pick<StyleOperationLike, "id">> & StyleOperationLike
  >;
}) {
  const cuttingIds = args.operations
    .filter((operation) => isStyleCuttingOperation(operation))
    .map((operation) => operation.id);

  if (cuttingIds.length > 0) {
    return args.operations
      .map((operation) => operation.id)
      .filter((id) => !cuttingIds.includes(id));
  }

  const firstOperation = [...args.operations]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .find(Boolean);

  if (!firstOperation) return [];

  return args.operations
    .map((operation) => operation.id)
    .filter((id) => id !== firstOperation.id);
}

// ---------------------------------------------------------------------------
// Nesting-aware garment job split
//
// A garment Style method explodes into a job as a tree of jobMakeMethods:
// the root (parentMaterialId NULL) is the Style itself; each Make-to-Order
// material (e.g. finished fabric 成品布) hangs a nested jobMakeMethod off the
// jobMaterial that consumes it, carrying that sub-assembly's own operations
// (e.g. an outside 印染/dyeing op) and materials (e.g. greige 胚布).
//
// The Master WO does the batch (cutting); Bundle WOs do the per-variant
// downstream (sewing). We route EVERY operation AND material to exactly one
// side ("home"), so nothing is done — or consumed — twice:
//   - a fabric-prep op/material is produced before its consumer runs, so it
//     goes wherever its consuming operation goes (default: cutting → master);
//   - the Style's own ops split at cutting (cutting & the fabric it needs →
//     master; sewing/finishing → bundle).
// This both fixes sequencing (印染 runs on the master, before cutting) and the
// pre-existing double-consumption bug (fabric backflushed once, on the master).
// ---------------------------------------------------------------------------

type GarmentHome = "master" | "bundle";

type GarmentOperationRow = StyleOperationLike & {
  id: string;
  jobMakeMethodId?: string | null;
};
type GarmentMaterialRow = {
  id: string;
  jobMakeMethodId?: string | null;
  jobOperationId?: string | null;
};
type GarmentMakeMethodRow = {
  id: string;
  parentMaterialId?: string | null;
};

// Identify the cutting operation(s) among a job's root operations, using only
// RELIABLE signals: (1) the style cutting tag / customFields.styleStage (carried
// onto the job by get-method), or (2) an explicitly threaded cuttingProcessId.
// There is deliberately NO "lowest-order root op" fallback — guessing silently
// mislabels cutting when it isn't order-first, which is exactly how cutting used
// to leak into bundles. When neither signal resolves, this returns an empty set
// and the caller (classifyGarmentJobItems) fails loudly rather than mis-splitting.
function resolveCuttingOperationIds(
  rootOperations: GarmentOperationRow[],
  cuttingProcessId?: string | null
): Set<string> {
  const tagged = rootOperations
    .filter((operation) => isStyleCuttingOperation(operation))
    .map((operation) => operation.id);
  if (tagged.length > 0) return new Set(tagged);

  if (cuttingProcessId) {
    const byProcess = rootOperations
      .filter((operation) => operation.processId === cuttingProcessId)
      .map((operation) => operation.id);
    if (byProcess.length > 0) return new Set(byProcess);
  }

  return new Set();
}

/**
 * Classify every jobOperation and jobMaterial of a garment job as belonging to
 * the master (cutting + fabric prep) or a bundle (downstream). Nested
 * sub-assembly items follow the operation that consumes their product; a
 * root-method material with no explicit consuming operation defaults to the
 * cutting operation (→ master). Pure + memoized, with cycle guards.
 */
export function classifyGarmentJobItems(args: {
  operations: GarmentOperationRow[];
  materials: GarmentMaterialRow[];
  makeMethods: GarmentMakeMethodRow[];
  cuttingProcessId?: string | null;
}): {
  operationHome: Map<string, GarmentHome>;
  materialHome: Map<string, GarmentHome>;
  nestedMakeMethodHome: Map<string, GarmentHome>;
} {
  const mmById = new Map(args.makeMethods.map((m) => [m.id, m]));
  const matById = new Map(args.materials.map((m) => [m.id, m]));
  const opById = new Map(args.operations.map((o) => [o.id, o]));

  const isNestedMethod = (mmId: string | null | undefined) => {
    if (!mmId) return false;
    const mm = mmById.get(mmId);
    return !!mm && mm.parentMaterialId != null;
  };
  const isRootOperation = (op: GarmentOperationRow) =>
    !isNestedMethod(op.jobMakeMethodId);

  const rootOps = args.operations.filter(isRootOperation);
  const cuttingIds = resolveCuttingOperationIds(rootOps, args.cuttingProcessId);

  // Fail loudly rather than guess. If the job has root operations but none can be
  // identified as cutting (no style cutting tag/styleStage AND no matching
  // cuttingProcessId), any home split would be arbitrary — cutting could end up on
  // the bundles or sewing on the master. Surface it so the style method gets fixed
  // (scaffold the cutting op) instead of silently producing a wrong split.
  if (rootOps.length > 0 && cuttingIds.size === 0) {
    throw new Error(
      "Unable to identify the cutting operation for this garment job: no operation carries the style cutting tag/styleStage and no cuttingProcessId matched. Ensure the Style method has a cutting operation scaffolded."
    );
  }

  const opHome = new Map<string, GarmentHome>();
  const mmHome = new Map<string, GarmentHome>();
  const opInProgress = new Set<string>();
  const mmInProgress = new Set<string>();

  function homeOfOperation(op: GarmentOperationRow): GarmentHome {
    const cached = opHome.get(op.id);
    if (cached) return cached;
    if (opInProgress.has(op.id)) return "master"; // cycle guard
    opInProgress.add(op.id);
    const home: GarmentHome = isRootOperation(op)
      ? cuttingIds.has(op.id)
        ? "master"
        : "bundle"
      : homeOfMakeMethod(op.jobMakeMethodId as string);
    opInProgress.delete(op.id);
    opHome.set(op.id, home);
    return home;
  }

  function homeOfMaterial(mat: GarmentMaterialRow | undefined): GarmentHome {
    if (!mat) return "master";
    if (isNestedMethod(mat.jobMakeMethodId)) {
      return homeOfMakeMethod(mat.jobMakeMethodId as string);
    }
    // Root-method (Style BOM) material: follow the operation that consumes it,
    // so a material the BOM author assigned to a bundle-side operation (e.g. a
    // trim consumed at sewing) is consumed on the bundle, while a material
    // assigned to cutting — or not assigned to any operation — defaults to the
    // master. get-method preserves this link via methodMaterial.methodOperationId
    // (see migration 20260821140521_preserve-root-material-operation-link).
    const consumer = mat.jobOperationId
      ? opById.get(mat.jobOperationId)
      : undefined;
    return consumer ? homeOfOperation(consumer) : "master";
  }

  function homeOfMakeMethod(mmId: string): GarmentHome {
    const cached = mmHome.get(mmId);
    if (cached) return cached;
    if (mmInProgress.has(mmId)) return "master"; // cycle guard
    mmInProgress.add(mmId);
    const mm = mmById.get(mmId);
    const home: GarmentHome =
      !mm || mm.parentMaterialId == null
        ? "master"
        : homeOfMaterial(matById.get(mm.parentMaterialId));
    mmInProgress.delete(mmId);
    mmHome.set(mmId, home);
    return home;
  }

  const operationHome = new Map<string, GarmentHome>();
  for (const op of args.operations)
    operationHome.set(op.id, homeOfOperation(op));

  const materialHome = new Map<string, GarmentHome>();
  for (const mat of args.materials)
    materialHome.set(mat.id, homeOfMaterial(mat));

  const nestedMakeMethodHome = new Map<string, GarmentHome>();
  for (const mm of args.makeMethods) {
    if (mm.parentMaterialId != null) {
      nestedMakeMethodHome.set(mm.id, homeOfMakeMethod(mm.id));
    }
  }

  return { operationHome, materialHome, nestedMakeMethodHome };
}

/**
 * Compute a corrected sequential `order` for a job's operations so that a nested
 * sub-assembly's operations run BEFORE the operation that consumes the
 * sub-assembly's product. get-method copies each `methodOperation.order`
 * verbatim per make method, so a nested op (e.g. an outside 印染/dyeing op on
 * finished fabric) keeps its own local order and can land AFTER the cutting op
 * that consumes the fabric — which is physically wrong (you dye before you cut).
 *
 * Emits, for each root operation in order, first the ops of every sub-assembly
 * consumed by it (deepest first), then the operation itself; leftovers append at
 * the end. Returns opId → new zero-based order. Pure + cycle-guarded.
 */
export function sequenceGarmentJobOperations(args: {
  operations: GarmentOperationRow[];
  materials: GarmentMaterialRow[];
  makeMethods: GarmentMakeMethodRow[];
  cuttingProcessId?: string | null;
}): Map<string, number> {
  const opById = new Map(args.operations.map((o) => [o.id, o]));
  const mmById = new Map(args.makeMethods.map((m) => [m.id, m]));
  const matById = new Map(args.materials.map((m) => [m.id, m]));

  const isNestedMethod = (mmId: string | null | undefined) => {
    if (!mmId) return false;
    const mm = mmById.get(mmId);
    return !!mm && mm.parentMaterialId != null;
  };

  const byOrder = (a: GarmentOperationRow, b: GarmentOperationRow) =>
    (a.order ?? 0) - (b.order ?? 0);

  const rootOps = args.operations
    .filter((o) => !isNestedMethod(o.jobMakeMethodId))
    .sort(byOrder);
  const cuttingIds = resolveCuttingOperationIds(rootOps, args.cuttingProcessId);
  const defaultConsumerId =
    [...cuttingIds].find((id) => opById.has(id)) ?? rootOps[0]?.id;

  // Operations grouped by make method, each in local order.
  const opsByMethod = new Map<string, GarmentOperationRow[]>();
  for (const o of args.operations) {
    if (!o.jobMakeMethodId) continue;
    const arr = opsByMethod.get(o.jobMakeMethodId) ?? [];
    arr.push(o);
    opsByMethod.set(o.jobMakeMethodId, arr);
  }
  for (const arr of opsByMethod.values()) arr.sort(byOrder);

  // Nested make methods (with kept ops) grouped by the op that consumes them.
  const nestedByConsumer = new Map<string, string[]>();
  for (const mm of args.makeMethods) {
    if (mm.parentMaterialId == null) continue;
    if (!opsByMethod.has(mm.id)) continue;
    const parentMat = matById.get(mm.parentMaterialId);
    const linked = parentMat?.jobOperationId;
    const consumerId =
      linked && opById.has(linked) ? linked : defaultConsumerId;
    if (!consumerId) continue;
    const arr = nestedByConsumer.get(consumerId) ?? [];
    arr.push(mm.id);
    nestedByConsumer.set(consumerId, arr);
  }

  const result: string[] = [];
  const seen = new Set<string>();
  const inProgress = new Set<string>();
  const emitConsumedBy = (opId: string) => {
    for (const mmId of nestedByConsumer.get(opId) ?? []) {
      for (const o of opsByMethod.get(mmId) ?? []) {
        if (seen.has(o.id) || inProgress.has(o.id)) continue;
        inProgress.add(o.id);
        emitConsumedBy(o.id); // deeper sub-assemblies first
        inProgress.delete(o.id);
        if (!seen.has(o.id)) {
          seen.add(o.id);
          result.push(o.id);
        }
      }
    }
  };
  for (const c of rootOps) {
    emitConsumedBy(c.id);
    if (!seen.has(c.id)) {
      seen.add(c.id);
      result.push(c.id);
    }
  }
  // Anything not reached (orphans) appends at the end, in `order` order so the
  // result is deterministic regardless of the input array's order.
  for (const o of [...args.operations].sort(byOrder)) {
    if (!seen.has(o.id)) {
      seen.add(o.id);
      result.push(o.id);
    }
  }

  const orderMap = new Map<string, number>();
  result.forEach((id, index) => {
    orderMap.set(id, index);
  });
  return orderMap;
}

/**
 * Load a garment backing job's method tree, classify every operation/material,
 * and delete everything whose home is the OTHER side. Then re-sequence the
 * surviving operations so nested fabric-prep ops run before their consumer
 * (e.g. 印染 before Cutting). Used by both the create paths
 * (insertMasterWorkOrder / insertBundleWorkOrder) and the get-method re-apply
 * path. No-op for jobs with no operations.
 */
export async function splitGarmentJobItems(
  client: SupabaseClient<Database>,
  args: {
    jobId: string;
    companyId: string;
    role: GarmentHome;
    cuttingProcessId?: string | null;
    // When provided (the create paths, where a failed split would otherwise
    // leave an orphaned job), the deletes + order updates run in ONE Kysely
    // transaction so the split is all-or-nothing. Reads always use `client`.
    db?: Kysely<KyselyDatabase>;
  }
): Promise<{ error: Error | null }> {
  const [ops, mats, mms] = await Promise.all([
    client
      .from("jobOperation")
      .select("id, processId, order, tags, customFields, jobMakeMethodId")
      .eq("jobId", args.jobId)
      .eq("companyId", args.companyId),
    client
      .from("jobMaterial")
      .select("id, jobMakeMethodId, jobOperationId")
      .eq("jobId", args.jobId)
      .eq("companyId", args.companyId),
    client
      .from("jobMakeMethod")
      .select("id, parentMaterialId")
      .eq("jobId", args.jobId)
      .eq("companyId", args.companyId)
  ]);
  if (ops.error) return { error: new Error(ops.error.message) };
  if (mats.error) return { error: new Error(mats.error.message) };
  if (mms.error) return { error: new Error(mms.error.message) };
  if (!ops.data?.length) return { error: null };

  let classified;
  try {
    classified = classifyGarmentJobItems({
      operations: ops.data,
      materials: mats.data ?? [],
      makeMethods: mms.data ?? [],
      cuttingProcessId: args.cuttingProcessId ?? null
    });
  } catch (err) {
    // classifyGarmentJobItems throws when cutting can't be identified. Surface it
    // as an error (aborts the create / re-apply) rather than mis-splitting the job.
    const message = err instanceof Error ? err.message : String(err);
    return { error: new Error(`${message} (job ${args.jobId})`) };
  }
  const { operationHome, materialHome, nestedMakeMethodHome } = classified;

  // Plan the writes. Delete everything whose home is the OTHER side. Deleting a
  // nested make method cascades its own operations + materials; deleting an
  // operation cascades the materials it consumes. Order matters: nested methods
  // → operations → materials.
  const nestedMethodIds = (mms.data ?? [])
    .filter(
      (mm) =>
        mm.parentMaterialId != null &&
        nestedMakeMethodHome.get(mm.id) !== args.role
    )
    .map((mm) => mm.id);
  const opIds = ops.data
    .filter((op) => operationHome.get(op.id) !== args.role)
    .map((op) => op.id);
  const matIds = (mats.data ?? [])
    .filter((mat) => materialHome.get(mat.id) !== args.role)
    .map((mat) => mat.id);

  // Re-sequence the surviving operations so nested fabric-prep runs before the
  // op that consumes it (e.g. 印染 before Cutting). Only rows whose order
  // actually changed are written.
  const keptOps = ops.data.filter(
    (op) => operationHome.get(op.id) === args.role
  );
  const deletedMaterialIds = new Set(matIds);
  const orderMap = sequenceGarmentJobOperations({
    operations: keptOps,
    materials: (mats.data ?? []).filter((m) => !deletedMaterialIds.has(m.id)),
    makeMethods: (mms.data ?? []).filter(
      (mm) => !nestedMethodIds.includes(mm.id)
    ),
    cuttingProcessId: args.cuttingProcessId ?? null
  });
  const orderUpdates: { id: string; next: number }[] = [];
  for (const op of keptOps) {
    const next = orderMap.get(op.id);
    if (next == null || next === (op.order ?? 0)) continue;
    orderUpdates.push({ id: op.id, next });
  }

  // Apply the plan. With a Kysely connection, run it in ONE transaction so a
  // mid-way failure can't leave a half-split job (create paths). Without one,
  // fall back to sequential PostgREST calls (get-method re-apply path).
  if (args.db) {
    try {
      await args.db.transaction().execute(async (trx) => {
        if (nestedMethodIds.length) {
          await trx
            .deleteFrom("jobMakeMethod")
            .where("id", "in", nestedMethodIds)
            .where("companyId", "=", args.companyId)
            .execute();
        }
        if (opIds.length) {
          await trx
            .deleteFrom("jobOperation")
            .where("id", "in", opIds)
            .where("companyId", "=", args.companyId)
            .execute();
        }
        if (matIds.length) {
          await trx
            .deleteFrom("jobMaterial")
            .where("id", "in", matIds)
            .where("companyId", "=", args.companyId)
            .execute();
        }
        for (const { id, next } of orderUpdates) {
          await trx
            .updateTable("jobOperation")
            .set({ order: next })
            .where("id", "=", id)
            .where("companyId", "=", args.companyId)
            .execute();
        }
      });
    } catch (err) {
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
    return { error: null };
  }

  if (nestedMethodIds.length) {
    const del = await client
      .from("jobMakeMethod")
      .delete()
      .in("id", nestedMethodIds)
      .eq("companyId", args.companyId);
    if (del.error) return { error: new Error(del.error.message) };
  }
  if (opIds.length) {
    const del = await client
      .from("jobOperation")
      .delete()
      .in("id", opIds)
      .eq("companyId", args.companyId);
    if (del.error) return { error: new Error(del.error.message) };
  }
  if (matIds.length) {
    const del = await client
      .from("jobMaterial")
      .delete()
      .in("id", matIds)
      .eq("companyId", args.companyId);
    if (del.error) return { error: new Error(del.error.message) };
  }
  for (const { id, next } of orderUpdates) {
    const upd = await client
      .from("jobOperation")
      .update({ order: next })
      .eq("id", id)
      .eq("companyId", args.companyId);
    if (upd.error) return { error: new Error(upd.error.message) };
  }

  return { error: null };
}

/**
 * Bundle jobs are keyed by variant SKU `itemId`, but the Style BOP lives on the
 * parent Style. Resolve that parent for get-method; non-variant items pass through.
 */
export async function resolveStyleMethodItemId(
  client: SupabaseClient<Database>,
  args: { itemId: string; companyId: string }
): Promise<string> {
  const { data } = await client
    .from("itemVariant")
    .select("parentItemId")
    .eq("variantItemId", args.itemId)
    .eq("companyId", args.companyId)
    .maybeSingle();
  return data?.parentItemId ?? args.itemId;
}

/**
 * The `processId` of a Style's cutting operation, read from the Style method
 * (`methodOperation`), where the cutting tag / `customFields.styleStage` always
 * survives (unlike jobOperations, which get-method may have created before those
 * markers were carried across). Thread this into `splitGarmentJobItems` so the
 * split can pin cutting by process even when a job's own tags are missing.
 * Returns null when the style has no scaffolded cutting operation.
 */
export async function getStyleCuttingProcessId(
  client: SupabaseClient<Database>,
  args: { itemId: string; companyId: string }
): Promise<string | null> {
  const methodItemId = await resolveStyleMethodItemId(client, args);
  const makeMethod = await client
    .from("makeMethod")
    .select("id")
    .eq("itemId", methodItemId)
    .eq("companyId", args.companyId)
    .order("createdAt", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (makeMethod.error || !makeMethod.data?.id) return null;

  const operations = await (client as SupabaseClient<any>)
    .from("methodOperation")
    .select("processId, tags, customFields, order")
    .eq("makeMethodId", makeMethod.data.id)
    .order("order", { ascending: true });
  if (operations.error || !operations.data?.length) return null;

  const cutting = operations.data.find((operation: any) =>
    isStyleCuttingOperation(operation)
  );
  return cutting?.processId ?? null;
}

/**
 * After get-method on a Master/Bundle WO backing job, re-apply the garment split:
 * master keeps cutting only; bundle drops cutting. No-op for ordinary jobs.
 * Call this when the masterWorkOrder / bundleWorkOrder row already exists
 * (e.g. Get Method), not during initial create before that row is inserted.
 */
export async function applyGarmentJobOperationFilter(
  client: SupabaseClient<Database>,
  args: {
    jobId: string;
    companyId: string;
    cuttingProcessId?: string | null;
  }
): Promise<{ error: Error | null }> {
  const master = await client
    .from("masterWorkOrder")
    .select("id")
    .eq("jobId", args.jobId)
    .eq("companyId", args.companyId)
    .maybeSingle();
  if (master.data?.id) {
    return splitGarmentJobItems(client, {
      jobId: args.jobId,
      companyId: args.companyId,
      role: "master",
      cuttingProcessId: args.cuttingProcessId ?? null
    });
  }

  const bundle = await client
    .from("bundleWorkOrder")
    .select("id")
    .eq("jobId", args.jobId)
    .eq("companyId", args.companyId)
    .maybeSingle();
  if (bundle.data?.id) {
    return splitGarmentJobItems(client, {
      jobId: args.jobId,
      companyId: args.companyId,
      role: "bundle",
      cuttingProcessId: args.cuttingProcessId ?? null
    });
  }

  return { error: null };
}

export async function ensureStyleRootMakeMethod(
  client: SupabaseClient<Database>,
  args: {
    itemId: string;
    companyId: string;
    userId: string;
  }
) {
  const makeMethod = await client
    .from("makeMethod")
    .select("id")
    .eq("itemId", args.itemId)
    .eq("companyId", args.companyId)
    .order("createdAt", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (makeMethod.error) return { data: null, error: makeMethod.error };
  if (makeMethod.data?.id) {
    return { data: { id: makeMethod.data.id }, error: null };
  }

  return client
    .from("makeMethod")
    .insert({
      itemId: args.itemId,
      companyId: args.companyId,
      createdBy: args.userId
    })
    .select("id")
    .single();
}

export async function ensureStyleCuttingProcess(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    userId: string;
  }
) {
  const processClient = client as SupabaseClient<any>;
  const existing = await processClient
    .from("process")
    .select("id, name, tags")
    .eq("companyId", args.companyId)
    .contains("tags", [STYLE_CUTTING_PROCESS_TAG])
    .limit(1)
    .maybeSingle();

  if (existing.error) return { data: null, error: existing.error };
  if (existing.data?.id) {
    return {
      data: { id: existing.data.id, name: existing.data.name as string },
      error: null
    };
  }

  const byName = await processClient
    .from("process")
    .select("id, name, tags")
    .eq("companyId", args.companyId)
    .in("name", ["Cutting", "裁剪"])
    .order("createdAt", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (byName.error) return { data: null, error: byName.error };
  if (byName.data?.id) {
    const tags = Array.from(
      new Set([...(byName.data.tags ?? []), STYLE_CUTTING_PROCESS_TAG])
    );
    const updated = await processClient
      .from("process")
      .update({ tags, updatedBy: args.userId })
      .eq("id", byName.data.id);

    if (updated.error) return { data: null, error: updated.error };

    return {
      data: { id: byName.data.id, name: byName.data.name as string },
      error: null
    };
  }

  return processClient
    .from("process")
    .insert({
      name: "Cutting",
      processType: "Inside",
      defaultStandardFactor: "Minutes/Piece",
      completeAllOnScan: false,
      tags: [STYLE_CUTTING_PROCESS_TAG],
      companyId: args.companyId,
      createdBy: args.userId
    })
    .select("id, name")
    .single();
}

export async function ensureStyleCuttingOperation(
  client: SupabaseClient<Database>,
  args: {
    makeMethodId: string;
    companyId: string;
    userId: string;
  }
) {
  const process = await ensureStyleCuttingProcess(client, args);
  if (process.error || !process.data?.id) {
    return { data: null, error: process.error };
  }

  const operationClient = client as SupabaseClient<any>;
  const operations = await operationClient
    .from("methodOperation")
    .select("id, processId, order, tags, customFields")
    .eq("makeMethodId", args.makeMethodId)
    .order("order", { ascending: true });

  if (operations.error) return { data: null, error: operations.error };

  const existingCutting = (operations.data ?? []).find((operation: any) =>
    isStyleCuttingOperation(operation)
  );
  if (existingCutting?.id) {
    return { data: { id: existingCutting.id }, error: null };
  }

  const firstOperation = (operations.data ?? [])[0];
  if (firstOperation?.processId === process.data.id) {
    const tags = Array.from(
      new Set([
        ...(firstOperation.tags ?? []),
        STYLE_CUTTING_OPERATION_TAG,
        STYLE_SYSTEM_OPERATION_TAG
      ])
    );
    const customFields = {
      ...(typeof firstOperation.customFields === "object" &&
      firstOperation.customFields
        ? firstOperation.customFields
        : {}),
      styleStage: "cutting",
      styleSystemOwned: true
    };

    const updated = await operationClient
      .from("methodOperation")
      .update({
        tags,
        customFields,
        updatedBy: args.userId
      })
      .eq("id", firstOperation.id)
      .select("id")
      .single();

    if (updated.error) return { data: null, error: updated.error };
    return updated;
  }

  const insert = await operationClient
    .from("methodOperation")
    .insert(
      buildStyleCuttingMethodOperation({
        makeMethodId: args.makeMethodId,
        processId: process.data.id,
        companyId: args.companyId,
        createdBy: args.userId,
        order:
          firstOperation && typeof firstOperation.order === "number"
            ? firstOperation.order - 1
            : 0
      })
    )
    .select("id")
    .single();

  if (insert.error) return { data: null, error: insert.error };
  return insert;
}

export async function ensureStyleMethodScaffold(
  client: SupabaseClient<Database>,
  args: {
    itemId: string;
    companyId: string;
    userId: string;
  }
) {
  const makeMethod = await ensureStyleRootMakeMethod(client, args);
  if (makeMethod.error || !makeMethod.data?.id) return makeMethod;

  const cutting = await ensureStyleCuttingOperation(client, {
    makeMethodId: makeMethod.data.id,
    companyId: args.companyId,
    userId: args.userId
  });
  if (cutting.error) return { data: null, error: cutting.error };

  return {
    data: {
      makeMethodId: makeMethod.data.id,
      cuttingOperationId: cutting.data?.id ?? null
    },
    error: null
  };
}
