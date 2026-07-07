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

