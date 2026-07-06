import { describe, expect, it } from "vitest";
import {
  buildProductionQuantitySplitRowRecords,
  hydratePendingSplitRows
} from "./styleSplitRow.service";

describe("hydratePendingSplitRows", () => {
  it("converts persisted split rows and allocations into pending split rows", () => {
    const rows = hydratePendingSplitRows([
      {
        id: "psr-1",
        productionQuantityId: "pq-1",
        reportId: "report-1",
        styleId: "style-item-1",
        rowKey: "row-1",
        colorCode: "BLK",
        sizeCode: "42",
        shadeLot: "A",
        configurationKey: '{"colorCode":"BLK"}',
        quantity: 25,
        allocatedQuantity: 10
      },
      {
        id: "psr-2",
        productionQuantityId: "pq-1",
        reportId: "report-1",
        styleId: "style-item-1",
        rowKey: "row-2",
        colorCode: "BLK",
        sizeCode: "42",
        shadeLot: "A",
        configurationKey: '{"colorCode":"BLK","marker":"back"}',
        quantity: 15,
        allocatedQuantity: 0
      }
    ]);

    expect(rows).toEqual([
      {
        sourceId: "psr-1",
        sourceRowKey: "row-1",
        reportId: "report-1",
        styleId: "style-item-1",
        colorCode: "BLK",
        sizeCode: "42",
        shadeLot: "A",
        configurationKey: '{"colorCode":"BLK"}',
        reportedQuantity: 25,
        allocatedQuantity: 10
      },
      {
        sourceId: "psr-2",
        sourceRowKey: "row-2",
        reportId: "report-1",
        styleId: "style-item-1",
        colorCode: "BLK",
        sizeCode: "42",
        shadeLot: "A",
        configurationKey: '{"colorCode":"BLK","marker":"back"}',
        reportedQuantity: 15,
        allocatedQuantity: 0
      }
    ]);
  });
});

describe("buildProductionQuantitySplitRowRecords", () => {
  it("builds row-level split records from production quantity lines", () => {
    const rows = buildProductionQuantitySplitRowRecords({
      companyId: "co-1",
      jobId: "job-1",
      jobOperationId: "op-1",
      itemId: "item-1",
      createdBy: "user-1",
      fallbackColorCode: "BLK",
      lines: [
        {
          id: "pq-1",
          reportId: "report-1",
          type: "Production",
          quantity: 20,
          configuration: {
            configTable: [
              { Size: "42", Marker: "Front", Quantities: 12 },
              { Size: "42", Marker: "Back", Quantities: 8 }
            ],
            configTablePrimaryKeys: ["Quantities"]
          }
        },
        {
          id: "pq-2",
          reportId: "report-1",
          type: "Scrap",
          quantity: 2,
          configuration: null
        }
      ]
    });

    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual(
      expect.objectContaining({
        productionQuantityId: "pq-1",
        reportId: "report-1",
        rowKey: "row-1",
        colorCode: "BLK",
        sizeCode: "42",
        quantity: 12
      })
    );
    expect(rows[1]).toEqual(
      expect.objectContaining({
        productionQuantityId: "pq-1",
        reportId: "report-1",
        rowKey: "row-2",
        colorCode: "BLK",
        sizeCode: "42",
        quantity: 8
      })
    );
  });
});
