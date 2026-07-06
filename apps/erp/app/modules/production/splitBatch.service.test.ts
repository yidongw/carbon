import { describe, expect, it } from "vitest";
import { buildConfirmedSplitBatch } from "./splitBatch.service";

describe("buildConfirmedSplitBatch", () => {
  it("builds bundles and allocations from pending split rows", () => {
    const result = buildConfirmedSplitBatch({
      styleCode: "ST-001",
      colorCode: "BLK",
      colorName: "Black",
      sizeCode: "42",
      shadeLot: "A",
      startSequence: 3,
      rows: [
        {
          sourceId: "psr-1",
          sourceRowKey: "row-1",
          reportId: "report-1",
          styleId: "item-1",
          colorCode: "BLK",
          sizeCode: "42",
          shadeLot: "A",
          configurationKey: "group-1",
          reportedQuantity: 40,
          allocatedQuantity: 10
        },
        {
          sourceId: "psr-2",
          sourceRowKey: "row-2",
          reportId: "report-2",
          styleId: "item-1",
          colorCode: "BLK",
          sizeCode: "42",
          shadeLot: "A",
          configurationKey: "group-1",
          reportedQuantity: 25,
          allocatedQuantity: 0
        }
      ],
      bundleQuantities: [20, 25]
    });

    expect(result.error).toBeNull();
    expect(result.bundles).toEqual([
      expect.objectContaining({
        sequence: 3,
        bundleNumber: "ST-001-BLK-42-B003",
        quantity: 20,
        colorCode: "BLK",
        colorName: "Black",
        sizeCode: "42",
        shadeLot: "A"
      }),
      expect.objectContaining({
        sequence: 4,
        bundleNumber: "ST-001-BLK-42-B004",
        quantity: 25
      })
    ]);
    expect(result.allocations).toEqual([
      {
        bundleIndex: 0,
        bundleSequence: 3,
        sourceId: "psr-1",
        sourceRowKey: "row-1",
        reportId: "report-1",
        quantity: 20
      },
      {
        bundleIndex: 1,
        bundleSequence: 4,
        sourceId: "psr-1",
        sourceRowKey: "row-1",
        reportId: "report-1",
        quantity: 10
      },
      {
        bundleIndex: 1,
        bundleSequence: 4,
        sourceId: "psr-2",
        sourceRowKey: "row-2",
        reportId: "report-2",
        quantity: 15
      }
    ]);
    expect(result.deferredQuantity).toBe(10);
  });

  it("rejects requested bundles that exceed pending split rows", () => {
    const result = buildConfirmedSplitBatch({
      styleCode: "ST-001",
      colorCode: "BLK",
      colorName: "Black",
      sizeCode: "42",
      shadeLot: null,
      startSequence: 1,
      rows: [
        {
          sourceId: "psr-1",
          sourceRowKey: "row-1",
          reportId: "report-1",
          styleId: "item-1",
          colorCode: "BLK",
          sizeCode: "42",
          shadeLot: null,
          configurationKey: "group-1",
          reportedQuantity: 20,
          allocatedQuantity: 15
        }
      ],
      bundleQuantities: [10]
    });

    expect(result.error).toBeInstanceOf(Error);
  });
});
