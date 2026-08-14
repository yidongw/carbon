import { describe, expect, it } from "vitest";
import {
  aggregateStorageUnitsBySku,
  padBreakdownToTotal,
  sortBreakdown
} from "./styleBreakdown";

describe("sortBreakdown", () => {
  it("orders by label and keeps untagged rows last", () => {
    const result = sortBreakdown([
      { variantItemId: null, label: null, quantityOnHand: 10 },
      { variantItemId: "iav_bks", label: "BK · S", quantityOnHand: 3 },
      { variantItemId: "iav_bgm", label: "BG · M", quantityOnHand: 1 }
    ]);
    expect(result.map((e) => e.label)).toEqual(["BG · M", "BK · S", null]);
  });

  it("does not mutate the input", () => {
    const input = [
      { variantItemId: "x", label: "B", quantityOnHand: 1 },
      { variantItemId: "y", label: "A", quantityOnHand: 1 }
    ];
    sortBreakdown(input);
    expect(input.map((e) => e.label)).toEqual(["B", "A"]);
  });
});

describe("padBreakdownToTotal", () => {
  it("adds an untagged remainder when tagged SKUs undercount the total", () => {
    const result = padBreakdownToTotal(
      [{ variantItemId: "iav_bkm", quantityOnHand: 6 }],
      10
    );
    expect(result).toEqual([
      { variantItemId: "iav_bkm", quantityOnHand: 6 },
      { variantItemId: null, label: null, quantityOnHand: 4 }
    ]);
  });

  it("pads the whole value when the breakdown is empty", () => {
    expect(padBreakdownToTotal([], 15)).toEqual([
      { variantItemId: null, label: null, quantityOnHand: 15 }
    ]);
  });

  it("leaves the breakdown untouched when it already sums to the value", () => {
    const breakdown = [{ variantItemId: "iav_bkm", quantityOnHand: 10 }];
    expect(padBreakdownToTotal(breakdown, 10)).toBe(breakdown);
  });

  it("does not pad for a non-positive value", () => {
    expect(padBreakdownToTotal([], 0)).toEqual([]);
  });
});

describe("aggregateStorageUnitsBySku", () => {
  it("collapses per-SKU rows into one row per storage unit with a breakdown", () => {
    const result = aggregateStorageUnitsBySku([
      {
        storageUnitId: "bin-b",
        quantity: 40,
        variantItemId: "iav_bkm",
        skuLabel: "BK · M"
      },
      {
        storageUnitId: "bin-b",
        quantity: 3,
        variantItemId: "iav_bks",
        skuLabel: "BK · S"
      },
      {
        storageUnitId: "rack-a",
        quantity: 25,
        variantItemId: "iav_gyxl",
        skuLabel: "GY · XL"
      }
    ]);

    expect(result).toHaveLength(2);
    const binB = result.find((r) => r.storageUnitId === "bin-b");
    expect(binB?.quantity).toBe(43);
    expect(binB?.breakdown).toEqual([
      { variantItemId: "iav_bkm", label: "BK · M", quantityOnHand: 40 },
      { variantItemId: "iav_bks", label: "BK · S", quantityOnHand: 3 }
    ]);
  });

  it("merges repeated SKUs within the same storage unit", () => {
    const result = aggregateStorageUnitsBySku([
      {
        storageUnitId: "bin-b",
        quantity: 5,
        variantItemId: "iav_bkm",
        skuLabel: "BK · M"
      },
      {
        storageUnitId: "bin-b",
        quantity: 4,
        variantItemId: "iav_bkm",
        skuLabel: "BK · M"
      }
    ]);
    expect(result[0].quantity).toBe(9);
    expect(result[0].breakdown).toEqual([
      { variantItemId: "iav_bkm", label: "BK · M", quantityOnHand: 9 }
    ]);
  });

  it("preserves first-appearance order of storage units", () => {
    const result = aggregateStorageUnitsBySku([
      { storageUnitId: "rack-a", quantity: 1, variantItemId: "iav_a1" },
      { storageUnitId: "bin-b", quantity: 1, variantItemId: "iav_b1" },
      { storageUnitId: "rack-a", quantity: 1, variantItemId: "iav_a2" }
    ]);
    expect(result.map((r) => r.storageUnitId)).toEqual(["rack-a", "bin-b"]);
  });
});
