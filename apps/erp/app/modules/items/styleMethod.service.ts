import type { Database, Json } from "@carbon/database";
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
