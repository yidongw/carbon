import { describe, expect, it } from "vitest";
import {
  aggregateStorageUnitsBySku,
  padBreakdownToTotal,
  sortBreakdown
} from "./styleBreakdown";

describe("sortBreakdown", () => {
  it("orders by valuesKey and keeps untagged rows last", () => {
    const result = sortBreakdown([
      { valuesKey: null, label: null, quantityOnHand: 10 },
      { valuesKey: "BK|S", label: "BK · S", quantityOnHand: 3 },
      { valuesKey: "BG|M", label: "BG · M", quantityOnHand: 1 }
    ]);
    expect(result.map((e) => e.valuesKey)).toEqual(["BG|M", "BK|S", null]);
  });

  it("does not mutate the input", () => {
    const input = [
      { valuesKey: "B", quantityOnHand: 1 },
      { valuesKey: "A", quantityOnHand: 1 }
    ];
    sortBreakdown(input);
    expect(input.map((e) => e.valuesKey)).toEqual(["B", "A"]);
  });
});

describe("padBreakdownToTotal", () => {
  it("adds an untagged remainder when tagged SKUs undercount the total", () => {
    const result = padBreakdownToTotal(
      [{ valuesKey: "BK|M", quantityOnHand: 6 }],
      10
    );
    expect(result).toEqual([
      { valuesKey: "BK|M", quantityOnHand: 6 },
      { valuesKey: null, label: null, quantityOnHand: 4 }
    ]);
  });

  it("pads the whole value when the breakdown is empty", () => {
    expect(padBreakdownToTotal([], 15)).toEqual([
      { valuesKey: null, label: null, quantityOnHand: 15 }
    ]);
  });

  it("leaves the breakdown untouched when it already sums to the value", () => {
    const breakdown = [{ valuesKey: "BK|M", quantityOnHand: 10 }];
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
        valuesKey: "BK|M",
        skuLabel: "BK · M"
      },
      {
        storageUnitId: "bin-b",
        quantity: 3,
        valuesKey: "BK|S",
        skuLabel: "BK · S"
      },
      {
        storageUnitId: "rack-a",
        quantity: 25,
        valuesKey: "GY|XL",
        skuLabel: "GY · XL"
      }
    ]);

    expect(result).toHaveLength(2);
    const binB = result.find((r) => r.storageUnitId === "bin-b");
    expect(binB?.quantity).toBe(43);
    expect(binB?.breakdown).toEqual([
      { valuesKey: "BK|M", label: "BK · M", quantityOnHand: 40 },
      { valuesKey: "BK|S", label: "BK · S", quantityOnHand: 3 }
    ]);
  });

  it("merges repeated SKUs within the same storage unit", () => {
    const result = aggregateStorageUnitsBySku([
      {
        storageUnitId: "bin-b",
        quantity: 5,
        valuesKey: "BK|M",
        skuLabel: "BK · M"
      },
      {
        storageUnitId: "bin-b",
        quantity: 4,
        valuesKey: "BK|M",
        skuLabel: "BK · M"
      }
    ]);
    expect(result[0].quantity).toBe(9);
    expect(result[0].breakdown).toEqual([
      { valuesKey: "BK|M", label: "BK · M", quantityOnHand: 9 }
    ]);
  });

  it("preserves first-appearance order of storage units", () => {
    const result = aggregateStorageUnitsBySku([
      { storageUnitId: "rack-a", quantity: 1, valuesKey: "A|1" },
      { storageUnitId: "bin-b", quantity: 1, valuesKey: "B|1" },
      { storageUnitId: "rack-a", quantity: 1, valuesKey: "A|2" }
    ]);
    expect(result.map((r) => r.storageUnitId)).toEqual(["rack-a", "bin-b"]);
  });
});
