import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildBundleJobReadableId } from "./bundleJobId";
import {
  allocatePendingSplitRows,
  type PendingSplitSourceRow,
  summarizePendingSplitGroups,
  validateSplitBatchBundles
} from "./styleSplit.service";
import { getPendingSplitSourceRows } from "./styleSplitRow.service";

export type ConfirmedBundleDraft = {
  sequence: number;
  bundleNumber: string;
  colorCode: string;
  colorName: string;
  sizeCode: string | null;
  shadeLot: string | null;
  quantity: number;
};

export type ConfirmedBundleAllocationDraft = {
  bundleIndex: number;
  bundleSequence: number;
  sourceId: string;
  sourceRowKey: string | null;
  reportId: string | null;
  quantity: number;
};

type PersistedBundle = {
  id: string;
  sequence: number;
  bundleNumber: string;
  quantity: number;
  colorCode: string;
  colorName: string;
  sizeCode: string | null;
  shadeLot: string | null;
};

export function buildConfirmedSplitBatch(args: {
  styleCode: string;
  colorCode: string;
  colorName: string;
  sizeCode: string | null;
  shadeLot: string | null;
  startSequence: number;
  rows: PendingSplitSourceRow[];
  bundleQuantities: number[];
}) {
  const allocation = allocatePendingSplitRows({
    rows: args.rows,
    bundleQuantities: args.bundleQuantities
  });

  if (allocation.error) {
    return {
      error: allocation.error,
      bundles: [] as ConfirmedBundleDraft[],
      allocations: [] as ConfirmedBundleAllocationDraft[],
      deferredQuantity: allocation.pendingQuantityAfterAllocation
    };
  }

  const bundles = args.bundleQuantities.map((quantity, index) => {
    const sequence = args.startSequence + index;
    return {
      sequence,
      bundleNumber: buildBundleJobReadableId({
        styleCode: args.styleCode,
        colorCode: args.colorCode,
        sizeCode: args.sizeCode,
        bundleSequence: sequence
      }),
      colorCode: args.colorCode,
      colorName: args.colorName,
      sizeCode: args.sizeCode,
      shadeLot: args.shadeLot,
      quantity
    } satisfies ConfirmedBundleDraft;
  });

  const allocations = allocation.allocations.map((rowAllocation) => ({
    bundleIndex: rowAllocation.bundleIndex,
    bundleSequence: args.startSequence + rowAllocation.bundleIndex,
    sourceId: rowAllocation.sourceId,
    sourceRowKey: rowAllocation.sourceRowKey ?? null,
    reportId: rowAllocation.reportId,
    quantity: rowAllocation.quantity
  }));

  return {
    error: null,
    bundles,
    allocations,
    deferredQuantity: allocation.pendingQuantityAfterAllocation
  };
}

export async function createConfirmedSplitBatch(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
    jobOperationId?: string | null;
    itemId: string;
    userId: string;
    notes?: string | null;
    styleCode: string;
    colorCode: string;
    colorName: string;
    sizeCode: string | null;
    shadeLot: string | null;
    startSequence: number;
    rows: PendingSplitSourceRow[];
    bundleQuantities: number[];
  }
) {
  const draft = buildConfirmedSplitBatch(args);

  if (draft.error) {
    return { data: null, error: draft.error };
  }

  const { insertSplitBatch, insertBundles, insertBundleAllocations } =
    await import("./styleBundlePersistence.server");

  const { data: splitBatch, error: splitBatchError } = await insertSplitBatch({
    jobId: args.jobId,
    jobOperationId: args.jobOperationId ?? null,
    itemId: args.itemId,
    status: "Confirmed",
    notes: args.notes ?? null,
    companyId: args.companyId,
    createdBy: args.userId
  });

  if (splitBatchError || !splitBatch?.id) {
    return { data: null, error: splitBatchError };
  }

  const { data: bundles, error: bundlesError } = await insertBundles(
    draft.bundles.map((bundle) => ({
      splitBatchId: splitBatch.id,
      itemId: args.itemId,
      bundleNumber: bundle.bundleNumber,
      sequence: bundle.sequence,
      colorCode: bundle.colorCode,
      colorName: bundle.colorName,
      sizeCode: bundle.sizeCode,
      shadeLot: bundle.shadeLot,
      quantity: bundle.quantity,
      status: "Released",
      companyId: args.companyId,
      createdBy: args.userId
    }))
  );

  if (bundlesError) {
    return { data: null, error: bundlesError };
  }

  const bundleIdsBySequence = new Map<string, string>(
    (bundles ?? []).map((bundle: { id: string; sequence: number }) => [
      String(bundle.sequence),
      bundle.id
    ])
  );

  const { error: allocationError } = await insertBundleAllocations(
    draft.allocations.map((allocation) => ({
      bundleId: bundleIdsBySequence.get(String(allocation.bundleSequence))!,
      productionQuantitySplitRowId: allocation.sourceId,
      quantity: allocation.quantity,
      companyId: args.companyId,
      createdBy: args.userId
    }))
  );

  if (allocationError) {
    return { data: null, error: allocationError };
  }

  const bundleJobs = await createBundleJobsForBundles(client, {
    companyId: args.companyId,
    splitBatchId: splitBatch.id,
    parentJobId: args.jobId,
    parentJobOperationId: args.jobOperationId ?? null,
    itemId: args.itemId,
    userId: args.userId,
    bundles: (bundles ?? []) as PersistedBundle[]
  });

  if (bundleJobs.error) {
    return { data: null, error: bundleJobs.error };
  }

  return {
    data: {
      splitBatchId: splitBatch.id,
      bundles: draft.bundles,
      allocations: draft.allocations,
      deferredQuantity: draft.deferredQuantity,
      bundleJobs: bundleJobs.data ?? []
    },
    error: null
  };
}

async function getParentJobForBundleCreation(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
  }
) {
  const splitClient = client as SupabaseClient<any>;
  return splitClient
    .from("job")
    .select(
      "id, itemId, locationId, dueDate, startDate, deadlineType, storageUnitId, unitOfMeasureCode, customerId, salesOrderId, salesOrderLineId, quoteId, quoteLineId, modelUploadId"
    )
    .eq("companyId", args.companyId)
    .eq("id", args.jobId)
    .single();
}

async function getCuttingProcessId(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobOperationId?: string | null;
  }
) {
  if (!args.jobOperationId) return { data: null, error: null };

  const splitClient = client as SupabaseClient<any>;
  const operation = await splitClient
    .from("jobOperation")
    .select("processId")
    .eq("companyId", args.companyId)
    .eq("id", args.jobOperationId)
    .single();

  if (operation.error) return { data: null, error: operation.error };
  return { data: operation.data?.processId ?? null, error: null };
}

async function pruneBundleJobCuttingOperations(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    userId: string;
    bundleJobId: string;
    cuttingProcessId?: string | null;
  }
) {
  const splitClient = client as SupabaseClient<any>;
  const operations = await splitClient
    .from("jobOperation")
    .select("id, processId, order, tags, customFields")
    .eq("companyId", args.companyId)
    .eq("jobId", args.bundleJobId);

  if (operations.error) return operations;

  const { getBundleJobCuttingOperationIdsToDelete } = await import(
    "../items/styleMethod.service"
  );

  const operationIds = getBundleJobCuttingOperationIdsToDelete({
    operations:
      (operations.data as Array<{
        id: string;
        processId: string | null;
        order: number | null;
        tags: string[] | null;
        customFields: Json | null;
      }>) ?? [],
    cuttingProcessId: args.cuttingProcessId
  });

  const { deleteJobOperation, recalculateJobOperationDependencies } =
    await import("./production.service");

  for (const operationId of operationIds) {
    const deleted = await deleteJobOperation(client, operationId);
    if (deleted.error) return deleted;
  }

  if (operationIds.length > 0) {
    const recalc = await recalculateJobOperationDependencies(client, {
      jobId: args.bundleJobId,
      companyId: args.companyId,
      userId: args.userId
    });
    if (recalc.error) return recalc;
  }

  return { data: { deletedOperationIds: operationIds }, error: null };
}

async function createBundleJobsForBundles(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    splitBatchId: string;
    parentJobId: string;
    parentJobOperationId?: string | null;
    itemId: string;
    userId: string;
    bundles: PersistedBundle[];
  }
) {
  if (args.bundles.length === 0) {
    return { data: [], error: null };
  }

  const [parentJob, cuttingProcess] = await Promise.all([
    getParentJobForBundleCreation(client, {
      companyId: args.companyId,
      jobId: args.parentJobId
    }),
    getCuttingProcessId(client, {
      companyId: args.companyId,
      jobOperationId: args.parentJobOperationId
    })
  ]);

  if (parentJob.error || !parentJob.data) {
    return { data: null, error: parentJob.error };
  }
  if (cuttingProcess.error) {
    return { data: null, error: cuttingProcess.error };
  }

  const createdJobs: Array<{
    bundleId: string;
    jobId: string;
    jobReadableId: string;
  }> = [];
  const { insertJob } = await import("./production.service");

  for (const bundle of args.bundles) {
    const createdJob = await insertJob(
      client,
      {
        itemId: args.itemId,
        quantity: Number(bundle.quantity),
        companyId: args.companyId,
        createdBy: args.userId,
        jobId: bundle.bundleNumber,
        locationId: parentJob.data.locationId ?? undefined,
        dueDate: parentJob.data.dueDate ?? undefined,
        startDate: parentJob.data.startDate ?? undefined,
        deadlineType: parentJob.data.deadlineType ?? undefined,
        storageUnitId: parentJob.data.storageUnitId ?? undefined,
        unitOfMeasureCode: parentJob.data.unitOfMeasureCode ?? "EA",
        customerId: parentJob.data.customerId ?? undefined,
        salesOrderId: parentJob.data.salesOrderId ?? undefined,
        salesOrderLineId: parentJob.data.salesOrderLineId ?? undefined,
        quoteId: parentJob.data.quoteId ?? undefined,
        quoteLineId: parentJob.data.quoteLineId ?? undefined,
        parentJobId: args.parentJobId,
        modelUploadId: parentJob.data.modelUploadId ?? undefined,
        status: "Ready",
        customFields: {
          splitBatchId: args.splitBatchId,
          bundleId: bundle.id,
          bundleNumber: bundle.bundleNumber,
          colorCode: bundle.colorCode,
          colorName: bundle.colorName,
          sizeCode: bundle.sizeCode,
          shadeLot: bundle.shadeLot
        },
        configuration: {
          colorCode: bundle.colorCode,
          colorName: bundle.colorName,
          sizeCode: bundle.sizeCode,
          shadeLot: bundle.shadeLot
        }
      },
      {
        methodSource: "item"
      }
    );

    if (createdJob.error || !createdJob.data?.id) {
      return { data: null, error: createdJob.error };
    }

    const pruned = await pruneBundleJobCuttingOperations(client, {
      companyId: args.companyId,
      userId: args.userId,
      bundleJobId: createdJob.data.id,
      cuttingProcessId: cuttingProcess.data
    });
    if (pruned.error) {
      return { data: null, error: pruned.error };
    }

    const { updateBundleJobLink } = await import(
      "./styleBundlePersistence.server"
    );
    const bundleUpdate = await updateBundleJobLink({
      bundleId: bundle.id,
      companyId: args.companyId,
      jobId: createdJob.data.id,
      userId: args.userId
    });

    if (bundleUpdate.error) {
      return { data: null, error: bundleUpdate.error };
    }

    createdJobs.push({
      bundleId: bundle.id,
      jobId: createdJob.data.id,
      jobReadableId: createdJob.data.jobId
    });
  }

  return { data: createdJobs, error: null };
}

export async function getPendingSplitGroupsForJob(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
  }
) {
  const pendingRows = await getPendingSplitSourceRows(client, args);
  if (pendingRows.error || !pendingRows.data) {
    return { data: null, error: pendingRows.error };
  }

  return {
    data: summarizePendingSplitGroups(pendingRows.data).filter(
      (group) => group.pendingQuantity > 0
    ),
    error: null
  };
}

export async function getNextBundleSequenceForJob(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
  }
) {
  const { getAllSplitBatchIdsForJob, getBundlesForSplitBatchIds } =
    await import("./styleBundlePersistence.server");
  const { data: splitBatchIds, error: splitBatchError } =
    await getAllSplitBatchIdsForJob({
      companyId: args.companyId,
      jobId: args.jobId
    });

  if (splitBatchError) {
    return { data: null, error: splitBatchError };
  }

  if (!splitBatchIds || splitBatchIds.length === 0) {
    return { data: 1, error: null };
  }

  const { data: bundles, error: bundleError } =
    await getBundlesForSplitBatchIds({
      companyId: args.companyId,
      splitBatchIds
    });

  if (bundleError) {
    return { data: null, error: bundleError };
  }

  const maxSequence = Math.max(
    0,
    ...(bundles ?? []).map((bundle) => Number(bundle.sequence) || 0)
  );
  return { data: maxSequence + 1, error: null };
}

export async function createConfirmedSplitBatchForGroup(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
    jobOperationId?: string | null;
    itemId: string;
    styleCode: string;
    colorCode: string;
    colorName: string;
    sizeCode: string | null;
    shadeLot: string | null;
    configurationKey: string;
    userId: string;
    notes?: string | null;
    bundleQuantities: number[];
  }
) {
  const pendingRows = await getPendingSplitSourceRows(client, {
    companyId: args.companyId,
    jobId: args.jobId
  });

  if (pendingRows.error || !pendingRows.data) {
    return { data: null, error: pendingRows.error };
  }

  const groupRows = pendingRows.data.filter(
    (row) =>
      row.colorCode === args.colorCode &&
      (row.sizeCode ?? null) === (args.sizeCode ?? null) &&
      (row.shadeLot ?? null) === (args.shadeLot ?? null) &&
      row.configurationKey === args.configurationKey
  );

  const availableQuantity = groupRows.reduce(
    (sum, row) => sum + (row.reportedQuantity - row.allocatedQuantity),
    0
  );
  const validation = validateSplitBatchBundles({
    availableQuantity,
    bundleQuantities: args.bundleQuantities
  });
  if (validation.error) {
    return { data: null, error: validation.error };
  }

  const nextSequence = await getNextBundleSequenceForJob(client, {
    companyId: args.companyId,
    jobId: args.jobId
  });

  if (nextSequence.error || !nextSequence.data) {
    return { data: null, error: nextSequence.error };
  }

  return createConfirmedSplitBatch(client, {
    companyId: args.companyId,
    jobId: args.jobId,
    jobOperationId: args.jobOperationId,
    itemId: args.itemId,
    userId: args.userId,
    notes: args.notes,
    styleCode: args.styleCode,
    colorCode: args.colorCode,
    colorName: args.colorName,
    sizeCode: args.sizeCode,
    shadeLot: args.shadeLot,
    startSequence: nextSequence.data,
    rows: groupRows,
    bundleQuantities: args.bundleQuantities
  });
}
