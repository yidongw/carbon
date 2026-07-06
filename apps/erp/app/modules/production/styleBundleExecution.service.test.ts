import { describe, expect, it } from "vitest";
import { deriveStyleBundleExecutionState } from "./styleBundleExecution.service";

describe("deriveStyleBundleExecutionState", () => {
  it("blocks parent style jobs after at least one confirmed split batch", () => {
    const result = deriveStyleBundleExecutionState({
      itemType: "Style",
      parentJobId: null,
      splitBatchCount: 1,
      cuttingOperationIds: ["op-cut"],
      bundles: []
    });

    expect(result.restrictParentToCuttingReporting).toBe(true);
    expect(result.isParentStyleJob).toBe(true);
    expect(result.hasConfirmedSplit).toBe(true);
    expect(result.cuttingOperationIds).toEqual(["op-cut"]);
  });

  it("does not block bundle child jobs", () => {
    const result = deriveStyleBundleExecutionState({
      itemType: "Style",
      parentJobId: "job-parent",
      splitBatchCount: 0,
      cuttingOperationIds: [],
      bundles: []
    });

    expect(result.restrictParentToCuttingReporting).toBe(false);
    expect(result.isParentStyleJob).toBe(false);
  });

  it("does not block non-style jobs", () => {
    const result = deriveStyleBundleExecutionState({
      itemType: "Part",
      parentJobId: null,
      splitBatchCount: 2,
      cuttingOperationIds: [],
      bundles: []
    });

    expect(result.restrictParentToCuttingReporting).toBe(false);
    expect(result.isStyle).toBe(false);
  });
});
