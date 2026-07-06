import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isStyleCuttingOperation } from "../items/styleMethod.service";

export type StyleBundleExecutionState = {
  isStyle: boolean;
  isParentStyleJob: boolean;
  hasConfirmedSplit: boolean;
  restrictParentToCuttingReporting: boolean;
  cuttingOperationIds: string[];
  bundleJobs: Array<{
    bundleId: string;
    bundleNumber: string;
    bundleStatus: string;
    jobId: string | null;
    quantity: number;
    colorCode: string;
    colorName: string;
    sizeCode: string | null;
    shadeLot: string | null;
  }>;
};

export function deriveStyleBundleExecutionState(args: {
  itemType: string | null | undefined;
  parentJobId: string | null | undefined;
  splitBatchCount: number;
  cuttingOperationIds: string[];
  bundles: StyleBundleExecutionState["bundleJobs"];
}): StyleBundleExecutionState {
  const isStyle = args.itemType === "Style";
  const isParentStyleJob = isStyle && !args.parentJobId;
  const hasConfirmedSplit = args.splitBatchCount > 0;

  return {
    isStyle,
    isParentStyleJob,
    hasConfirmedSplit,
    restrictParentToCuttingReporting: isParentStyleJob && hasConfirmedSplit,
    cuttingOperationIds: args.cuttingOperationIds,
    bundleJobs: args.bundles
  };
}

export async function getStyleBundleExecutionState(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
  }
) {
  const splitClient = client as SupabaseClient<any>;
  const { data: job, error: jobError } = await splitClient
    .from("job")
    .select("id, parentJobId, ...item(itemType:type)")
    .eq("id", args.jobId)
    .eq("companyId", args.companyId)
    .single();

  if (jobError) {
    return { data: null, error: jobError };
  }

  if (job?.itemType !== "Style") {
    return {
      data: deriveStyleBundleExecutionState({
        itemType: job?.itemType ?? null,
        parentJobId: job?.parentJobId ?? null,
        splitBatchCount: 0,
        cuttingOperationIds: [],
        bundles: []
      }),
      error: null
    };
  }

  const { data: splitBatches, error: splitBatchError } = await splitClient
    .from("splitBatch")
    .select("id, status")
    .eq("companyId", args.companyId)
    .eq("jobId", args.jobId)
    .eq("status", "Confirmed");

  if (splitBatchError) {
    return { data: null, error: splitBatchError };
  }

  const splitBatchIds = (splitBatches ?? []).map(
    (row: { id: string }) => row.id
  );
  if (splitBatchIds.length === 0) {
    return {
      data: deriveStyleBundleExecutionState({
        itemType: job.itemType,
        parentJobId: job.parentJobId,
        splitBatchCount: 0,
        cuttingOperationIds: [],
        bundles: []
      }),
      error: null
    };
  }

  const { data: operations, error: operationError } = await splitClient
    .from("jobOperation")
    .select("id, tags, customFields")
    .eq("companyId", args.companyId)
    .eq("jobId", args.jobId)
    .order("order", { ascending: true });

  if (operationError) {
    return { data: null, error: operationError };
  }

  const cuttingOperationIds = (operations ?? [])
    .filter((operation: any) => isStyleCuttingOperation(operation))
    .map((operation: any) => operation.id as string);

  const { data: bundles, error: bundleError } = await splitClient
    .from("bundle")
    .select(
      "id, bundleNumber, status, jobId, quantity, colorCode, colorName, sizeCode, shadeLot"
    )
    .eq("companyId", args.companyId)
    .in("splitBatchId", splitBatchIds)
    .order("sequence", { ascending: true });

  if (bundleError) {
    return { data: null, error: bundleError };
  }

  return {
    data: deriveStyleBundleExecutionState({
      itemType: job.itemType,
      parentJobId: job.parentJobId,
      splitBatchCount: splitBatchIds.length,
      cuttingOperationIds,
      bundles: (bundles ?? []).map((bundle: any) => ({
        bundleId: bundle.id,
        bundleNumber: bundle.bundleNumber,
        bundleStatus: bundle.status,
        jobId: bundle.jobId,
        quantity: Number(bundle.quantity ?? 0),
        colorCode: bundle.colorCode,
        colorName: bundle.colorName,
        sizeCode: bundle.sizeCode ?? null,
        shadeLot: bundle.shadeLot ?? null
      }))
    }),
    error: null
  };
}

export async function assertStyleJobCanRecordQuantities(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
    jobOperationId: string;
  }
) {
  const state = await getStyleBundleExecutionState(client, args);
  if (state.error || !state.data) {
    return { data: null, error: state.error };
  }

  if (
    state.data.restrictParentToCuttingReporting &&
    !state.data.cuttingOperationIds.includes(args.jobOperationId)
  ) {
    return {
      data: null,
      error: new Error(
        "This Style job has already been split into bundles. Only cutting can still be reported on the parent job. Record downstream completions on the bundle jobs instead."
      )
    };
  }

  return { data: state.data, error: null };
}
