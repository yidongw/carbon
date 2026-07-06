import { describe, expect, it } from "vitest";
import { splitBatchConfirmValidator } from "./splitBatch.models";

describe("splitBatchConfirmValidator", () => {
  it("accepts a valid split batch confirmation payload", () => {
    const result = splitBatchConfirmValidator.safeParse({
      jobId: "job-1",
      itemId: "item-1",
      styleCode: "ST-001",
      colorCode: "BLK",
      colorName: "Black",
      sizeCode: "42",
      shadeLot: "A",
      configurationKey: "group-1",
      bundleQuantities: [20, 25]
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty bundle quantity lists", () => {
    const result = splitBatchConfirmValidator.safeParse({
      jobId: "job-1",
      itemId: "item-1",
      styleCode: "ST-001",
      colorCode: "BLK",
      colorName: "Black",
      configurationKey: "group-1",
      bundleQuantities: []
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-positive bundle quantities", () => {
    const result = splitBatchConfirmValidator.safeParse({
      jobId: "job-1",
      itemId: "item-1",
      styleCode: "ST-001",
      colorCode: "BLK",
      colorName: "Black",
      configurationKey: "group-1",
      bundleQuantities: [20, 0]
    });

    expect(result.success).toBe(false);
  });
});
