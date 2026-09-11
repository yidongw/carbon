import { describe, expect, it } from "vitest";
import {
  buildStyleScanCountCommitLines,
  tallyStyleScanCount
} from "./scanInventoryCount";

describe("tallyStyleScanCount", () => {
  it("counts unique in-scope pieces per variant SKU", () => {
    const result = tallyStyleScanCount({
      rawCodes: ["E1", "E1", "E2", "E3"],
      styleParentItemId: "style-1",
      resolvedByCode: {
        E1: {
          scannedCode: "E1",
          variantItemId: "sku-m",
          parentItemId: "style-1",
          attributeLabel: "M"
        },
        E2: {
          scannedCode: "E2",
          variantItemId: "sku-m",
          parentItemId: "style-1",
          attributeLabel: "M"
        },
        E3: {
          scannedCode: "E3",
          variantItemId: "sku-l",
          parentItemId: "style-1",
          attributeLabel: "L"
        }
      }
    });
    expect(result.inScopeCodes).toEqual(["E1", "E2", "E3"]);
    expect(result.countedByVariantId).toEqual({ "sku-l": 1, "sku-m": 2 });
    expect(result.foreignCodes).toEqual([]);
    expect(result.unknownCodes).toEqual([]);
  });

  it("separates foreign and unknown codes", () => {
    const result = tallyStyleScanCount({
      rawCodes: ["OK", "OTHER", "MISSING"],
      styleParentItemId: "style-1",
      unknownCodes: ["MISSING"],
      resolvedByCode: {
        OK: {
          scannedCode: "OK",
          variantItemId: "sku-m",
          parentItemId: "style-1"
        },
        OTHER: {
          scannedCode: "OTHER",
          variantItemId: "sku-x",
          parentItemId: "style-2"
        }
      }
    });
    expect(result.inScopeCodes).toEqual(["OK"]);
    expect(result.foreignCodes).toEqual(["OTHER"]);
    expect(result.unknownCodes).toEqual(["MISSING"]);
    expect(result.countedByVariantId).toEqual({ "sku-m": 1 });
  });
});

describe("buildStyleScanCountCommitLines", () => {
  it("zeros unscanned SKUs that still have bin on-hand", () => {
    const lines = buildStyleScanCountCommitLines({
      styleVariantItemIds: ["sku-m", "sku-l", "sku-s"],
      countedByVariantId: { "sku-m": 9 },
      onHandByVariantId: { "sku-m": 10, "sku-l": 8 }
    });
    expect(lines).toEqual([
      { variantItemId: "sku-l", counted: 0, onHand: 8 },
      { variantItemId: "sku-m", counted: 9, onHand: 10 }
    ]);
  });

  it("skips family SKUs with neither count nor on-hand", () => {
    const lines = buildStyleScanCountCommitLines({
      styleVariantItemIds: ["sku-m", "sku-l"],
      countedByVariantId: { "sku-m": 1 },
      onHandByVariantId: {}
    });
    expect(lines).toEqual([{ variantItemId: "sku-m", counted: 1, onHand: 0 }]);
  });
});
