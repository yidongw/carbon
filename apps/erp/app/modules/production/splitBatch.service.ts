import { buildBundleJobReadableId } from "./bundleJobId";
import {
  allocatePendingSplitRows,
  type PendingSplitSourceRow
} from "./styleSplit.service";

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
