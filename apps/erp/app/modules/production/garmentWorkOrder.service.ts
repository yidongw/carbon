import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getParentJobNonCuttingOperationIdsToDelete,
  isStyleCuttingOperation
} from "../items/styleMethod.service";

type StyleOperationRow = {
  id: string;
  order: number | null;
  tags: string[] | null;
  customFields: Json | null;
};

export type GarmentWorkOrderContext = {
  isStyle: boolean;
  kind: "master" | "bundle" | null;
  masterWorkOrderId: string | null;
  bundleWorkOrderId: string | null;
  bundleNumber: string | null;
};

export async function ensureMasterWorkOrder(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
    colorSize?: Json | null;
  }
) {
  const existing = await client
    .from("masterWorkOrder")
    .select("id")
    .eq("companyId", args.companyId)
    .eq("jobId", args.jobId)
    .maybeSingle();

  if (existing.error) return { data: null, error: existing.error };
  if (existing.data?.id) return { data: existing.data, error: null };

  return client
    .from("masterWorkOrder")
    .insert({
      companyId: args.companyId,
      jobId: args.jobId,
      colorSize: args.colorSize ?? null
    })
    .select("id")
    .single();
}

export async function upsertBundleWorkOrder(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
    masterWorkOrderId: string;
    bundleId?: string | null;
    bundleSequence: number;
    bundleNumber: string;
    colorCode: string;
    sizeCode?: string | null;
  }
) {
  const existing = await client
    .from("bundleWorkOrder")
    .select("id")
    .eq("companyId", args.companyId)
    .eq("jobId", args.jobId)
    .maybeSingle();

  if (existing.error) return { data: null, error: existing.error };

  if (existing.data?.id) {
    return client
      .from("bundleWorkOrder")
      .update({
        masterWorkOrderId: args.masterWorkOrderId,
        bundleId: args.bundleId ?? null,
        bundleSequence: args.bundleSequence,
        bundleNumber: args.bundleNumber,
        colorCode: args.colorCode,
        sizeCode: args.sizeCode ?? null
      })
      .eq("id", existing.data.id)
      .select("id")
      .single();
  }

  return client
    .from("bundleWorkOrder")
    .insert({
      companyId: args.companyId,
      jobId: args.jobId,
      masterWorkOrderId: args.masterWorkOrderId,
      bundleId: args.bundleId ?? null,
      bundleSequence: args.bundleSequence,
      bundleNumber: args.bundleNumber,
      colorCode: args.colorCode,
      sizeCode: args.sizeCode ?? null
    })
    .select("id")
    .single();
}

export async function getGarmentWorkOrderContext(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
  }
): Promise<{ data: GarmentWorkOrderContext; error: Error | null }> {
  const base = await client
    .from("job")
    .select("id, parentJobId, ...item(itemType:type)")
    .eq("companyId", args.companyId)
    .eq("id", args.jobId)
    .single();

  if (base.error) {
    return {
      data: {
        isStyle: false,
        kind: null,
        masterWorkOrderId: null,
        bundleWorkOrderId: null,
        bundleNumber: null
      },
      error: new Error(base.error.message)
    };
  }

  if (base.data?.itemType !== "Style") {
    return {
      data: {
        isStyle: false,
        kind: null,
        masterWorkOrderId: null,
        bundleWorkOrderId: null,
        bundleNumber: null
      },
      error: null
    };
  }

  const [master, bundle] = await Promise.all([
    client
      .from("masterWorkOrder")
      .select("id")
      .eq("companyId", args.companyId)
      .eq("jobId", args.jobId)
      .maybeSingle(),
    client
      .from("bundleWorkOrder")
      .select("id, masterWorkOrderId, bundleNumber")
      .eq("companyId", args.companyId)
      .eq("jobId", args.jobId)
      .maybeSingle()
  ]);

  if (master.error) {
    return {
      data: {
        isStyle: true,
        kind: null,
        masterWorkOrderId: null,
        bundleWorkOrderId: null,
        bundleNumber: null
      },
      error: new Error(master.error.message)
    };
  }

  if (bundle.error) {
    return {
      data: {
        isStyle: true,
        kind: null,
        masterWorkOrderId: null,
        bundleWorkOrderId: null,
        bundleNumber: null
      },
      error: new Error(bundle.error.message)
    };
  }

  if (bundle.data?.id) {
    return {
      data: {
        isStyle: true,
        kind: "bundle",
        masterWorkOrderId: bundle.data.masterWorkOrderId,
        bundleWorkOrderId: bundle.data.id,
        bundleNumber: bundle.data.bundleNumber
      },
      error: null
    };
  }

  if (master.data?.id || !base.data.parentJobId) {
    return {
      data: {
        isStyle: true,
        kind: "master",
        masterWorkOrderId: master.data?.id ?? null,
        bundleWorkOrderId: null,
        bundleNumber: null
      },
      error: null
    };
  }

  return {
    data: {
      isStyle: true,
      kind: null,
      masterWorkOrderId: null,
      bundleWorkOrderId: null,
      bundleNumber: null
    },
    error: null
  };
}

export async function pruneStyleParentJobToCuttingOnly(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    userId: string;
    jobId: string;
  }
) {
  const operations = await client
    .from("jobOperation")
    .select("id, order, tags, customFields")
    .eq("companyId", args.companyId)
    .eq("jobId", args.jobId)
    .order("order", { ascending: true });

  if (operations.error) return { data: null, error: operations.error };

  const operationIds = getParentJobNonCuttingOperationIdsToDelete({
    operations: (operations.data ?? []) as Array<
      Required<Pick<StyleOperationRow, "id">> & StyleOperationRow
    >
  });

  if (operationIds.length === 0) {
    return { data: { deletedOperationIds: [] }, error: null };
  }

  const { deleteJobOperation, recalculateJobOperationDependencies } =
    await import("./production.service");

  for (const operationId of operationIds) {
    const deleted = await deleteJobOperation(client, operationId);
    if (deleted.error) return deleted;
  }

  const recalc = await recalculateJobOperationDependencies(client, {
    jobId: args.jobId,
    companyId: args.companyId,
    userId: args.userId
  });
  if (recalc.error) return recalc;

  return { data: { deletedOperationIds: operationIds }, error: null };
}

export function getVisibleStyleParentOperationIds(
  operations: StyleOperationRow[]
) {
  const cuttingIds = operations
    .filter((operation) => isStyleCuttingOperation(operation))
    .map((operation) => operation.id);

  if (cuttingIds.length > 0) return cuttingIds;

  const firstOperation = [...operations]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .find(Boolean);

  return firstOperation ? [firstOperation.id] : [];
}

export async function getVisibleJobOperationIds(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
  }
) {
  const context = await getGarmentWorkOrderContext(client, args);
  if (context.error) {
    return { data: null, error: context.error };
  }

  if (context.data.kind !== "master") {
    return { data: null, error: null };
  }

  const operations = await client
    .from("jobOperation")
    .select("id, order, tags, customFields")
    .eq("companyId", args.companyId)
    .eq("jobId", args.jobId)
    .order("order", { ascending: true });

  if (operations.error) {
    return { data: null, error: new Error(operations.error.message) };
  }

  return {
    data: getVisibleStyleParentOperationIds(
      (operations.data ?? []) as StyleOperationRow[]
    ),
    error: null
  };
}

export function filterOperationsByIds<T extends { id?: string | null }>(
  operations: T[],
  operationIds: string[] | null | undefined
) {
  if (!operationIds || operationIds.length === 0) {
    return operations;
  }

  const visible = new Set(operationIds);
  return operations.filter(
    (operation) => operation.id && visible.has(operation.id)
  );
}
