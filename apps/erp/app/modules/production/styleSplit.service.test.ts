import { describe, expect, it } from "vitest";
import {
  allocatePendingSplitRows,
  buildPendingSplitSourceRows,
  summarizePendingSplitGroups,
  validateSplitBatchBundles
} from "./styleSplit.service";

describe("summarizePendingSplitGroups", () => {
  it("accumulates matching style/color/size rows into one pending group", () => {
    const summary = summarizePendingSplitGroups([
      {
        sourceId: "r1",
        styleId: "ST-001",
        colorCode: "BLK",
        sizeCode: "42",
        configurationKey: "BLK|42",
        reportedQuantity: 60,
        allocatedQuantity: 20
      },
      {
        sourceId: "r2",
        styleId: "ST-001",
        colorCode: "BLK",
        sizeCode: "42",
        configurationKey: "BLK|42",
        reportedQuantity: 40,
        allocatedQuantity: 0
      }
    ]);

    expect(summary).toEqual([
      expect.objectContaining({
        styleId: "ST-001",
        colorCode: "BLK",
        sizeCode: "42",
        reportedQuantity: 100,
        allocatedQuantity: 20,
        pendingQuantity: 80
      })
    ]);
  });

  it("keeps rows with different grouping keys separate", () => {
    const summary = summarizePendingSplitGroups([
      {
        sourceId: "r1",
        styleId: "ST-001",
        colorCode: "BLK",
        sizeCode: "42",
        configurationKey: "BLK|42",
        reportedQuantity: 30,
        allocatedQuantity: 0
      },
      {
        sourceId: "r2",
        styleId: "ST-001",
        colorCode: "RED",
        sizeCode: "42",
        configurationKey: "RED|42",
        reportedQuantity: 30,
        allocatedQuantity: 0
      }
    ]);

    expect(summary).toHaveLength(2);
  });

  it("keeps rows with different shade lots separate", () => {
    const summary = summarizePendingSplitGroups([
      {
        sourceId: "r1",
        styleId: "ST-001",
        colorCode: "BLK",
        sizeCode: "42",
        shadeLot: "A",
        configurationKey: "BLK|42|A",
        reportedQuantity: 30,
        allocatedQuantity: 0
      },
      {
        sourceId: "r2",
        styleId: "ST-001",
        colorCode: "BLK",
        sizeCode: "42",
        shadeLot: "B",
        configurationKey: "BLK|42|B",
        reportedQuantity: 30,
        allocatedQuantity: 0
      }
    ]);

    expect(summary).toHaveLength(2);
  });
});

describe("validateSplitBatchBundles", () => {
  it("accepts bundle quantities that stay within available pending quantity", () => {
    const result = validateSplitBatchBundles({
      availableQuantity: 100,
      bundleQuantities: [25, 25, 30]
    });

    expect(result.error).toBeNull();
    expect(result.createdQuantity).toBe(80);
    expect(result.deferredQuantity).toBe(20);
  });

  it("rejects bundle quantities that exceed available pending quantity", () => {
    const result = validateSplitBatchBundles({
      availableQuantity: 100,
      bundleQuantities: [60, 50]
    });

    expect(result.error).toBeInstanceOf(Error);
  });

  it("rejects zero or negative bundle quantities", () => {
    const result = validateSplitBatchBundles({
      availableQuantity: 100,
      bundleQuantities: [50, 0]
    });

    expect(result.error).toBeInstanceOf(Error);
  });
});

describe("allocatePendingSplitRows", () => {
  it("allocates bundle quantities across pending cutting rows in order", () => {
    const result = allocatePendingSplitRows({
      rows: [
        {
          sourceId: "r1",
          reportId: "report-1",
          styleId: "ST-001",
          colorCode: "BLK",
          sizeCode: "42",
          shadeLot: "A",
          configurationKey: "BLK|42|A",
          reportedQuantity: 40,
          allocatedQuantity: 10
        },
        {
          sourceId: "r2",
          reportId: "report-2",
          styleId: "ST-001",
          colorCode: "BLK",
          sizeCode: "42",
          shadeLot: "A",
          configurationKey: "BLK|42|A",
          reportedQuantity: 35,
          allocatedQuantity: 0
        }
      ],
      bundleQuantities: [25, 30]
    });

    expect(result.error).toBeNull();
    expect(result.allocations).toEqual([
      {
        bundleIndex: 0,
        sourceId: "r1",
        sourceRowKey: null,
        reportId: "report-1",
        quantity: 25
      },
      {
        bundleIndex: 1,
        sourceId: "r1",
        sourceRowKey: null,
        reportId: "report-1",
        quantity: 5
      },
      {
        bundleIndex: 1,
        sourceId: "r2",
        sourceRowKey: null,
        reportId: "report-2",
        quantity: 25
      }
    ]);
    expect(result.pendingQuantityAfterAllocation).toBe(10);
  });

  it("rejects allocations that exceed net pending quantity after prior assignment", () => {
    const result = allocatePendingSplitRows({
      rows: [
        {
          sourceId: "r1",
          reportId: "report-1",
          styleId: "ST-001",
          colorCode: "BLK",
          sizeCode: "42",
          shadeLot: "A",
          configurationKey: "BLK|42|A",
          reportedQuantity: 20,
          allocatedQuantity: 15
        }
      ],
      bundleQuantities: [10]
    });

    expect(result.error).toBeInstanceOf(Error);
  });

  it("returns no allocations when no bundles are confirmed yet", () => {
    const result = allocatePendingSplitRows({
      rows: [
        {
          sourceId: "r1",
          reportId: "report-1",
          styleId: "ST-001",
          colorCode: "BLK",
          sizeCode: "42",
          shadeLot: null,
          configurationKey: "BLK|42",
          reportedQuantity: 20,
          allocatedQuantity: 5
        }
      ],
      bundleQuantities: []
    });

    expect(result.error).toBeNull();
    expect(result.allocations).toEqual([]);
    expect(result.pendingQuantityAfterAllocation).toBe(15);
  });
});

describe("buildPendingSplitSourceRows", () => {
  it("expands a cutting quantity config table into garment split rows", () => {
    const rows = buildPendingSplitSourceRows({
      sourceId: "pq-1",
      reportId: "report-1",
      styleId: "ST-001",
      fallbackColorCode: "BLK",
      configuration: {
        configTable: [
          {
            "Color Code": "BLK",
            Size: "42",
            "Shade Lot": "A",
            Marker: "Front",
            Quantities: 12
          },
          {
            "Color Code": "BLK",
            Size: "42",
            "Shade Lot": "A",
            Marker: "Back",
            Quantities: 8
          }
        ],
        configTablePrimaryKeys: ["Quantities"]
      }
    });

    expect(rows).toEqual([
      expect.objectContaining({
        sourceId: "pq-1",
        sourceRowKey: "row-1",
        reportId: "report-1",
        styleId: "ST-001",
        colorCode: "BLK",
        sizeCode: "42",
        shadeLot: "A",
        reportedQuantity: 12,
        allocatedQuantity: 0
      }),
      expect.objectContaining({
        sourceId: "pq-1",
        sourceRowKey: "row-2",
        reportId: "report-1",
        styleId: "ST-001",
        colorCode: "BLK",
        sizeCode: "42",
        shadeLot: "A",
        reportedQuantity: 8,
        allocatedQuantity: 0
      })
    ]);
    expect(rows[0]?.configurationKey).not.toBe(rows[1]?.configurationKey);
  });

  it("uses the style color when the cutting row does not carry color explicitly", () => {
    const rows = buildPendingSplitSourceRows({
      sourceId: "pq-2",
      styleId: "ST-001",
      fallbackColorCode: "RED",
      configuration: {
        configTable: [{ Size: "M", Quantities: 10 }],
        configTablePrimaryKeys: ["Quantities"]
      }
    });

    expect(rows).toEqual([
      expect.objectContaining({
        colorCode: "RED",
        sizeCode: "M",
        reportedQuantity: 10
      })
    ]);
  });

  it("creates one split row from a plain cutting quantity without config rows", () => {
    const rows = buildPendingSplitSourceRows({
      sourceId: "pq-3",
      styleId: "ST-001",
      fallbackColorCode: "NAVY",
      reportedQuantity: 15,
      allocatedQuantity: 5,
      configuration: null
    });

    expect(rows).toEqual([
      expect.objectContaining({
        sourceId: "pq-3",
        sourceRowKey: "row-1",
        colorCode: "NAVY",
        reportedQuantity: 15,
        allocatedQuantity: 5
      })
    ]);
  });
});
