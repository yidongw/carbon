import { describe, expect, it } from "vitest";
import {
  isNonEmptyVariantsQuantity,
  isVariantsQuantityConfiguration,
  jobVariantQuantitiesToTable,
  sumJobVariantQuantities
} from "./jobVariantQuantity.service";

describe("jobVariantQuantity helpers", () => {
  it("detects variantTable vs flat Part params", () => {
    expect(
      isVariantsQuantityConfiguration({
        variantTable: [{ valuesKey: "BK|S", Quantities: 2 }]
      })
    ).toBe(true);
    expect(
      isVariantsQuantityConfiguration({ color: "BK", finish: "matte" })
    ).toBe(false);
    expect(isVariantsQuantityConfiguration(null)).toBe(false);
    expect(isVariantsQuantityConfiguration({ variantTable: [] })).toBe(true);
  });

  it("requires non-empty variantTable for dual-read / qty gates", () => {
    expect(
      isNonEmptyVariantsQuantity({
        variantTable: [{ valuesKey: "BK|S", Quantities: 2 }]
      })
    ).toBe(true);
    expect(isNonEmptyVariantsQuantity({ variantTable: [] })).toBe(false);
    expect(isNonEmptyVariantsQuantity({ color: "BK" })).toBe(false);
    expect(isNonEmptyVariantsQuantity(null)).toBe(false);
  });

  it("sums quantities", () => {
    expect(sumJobVariantQuantities([{ quantity: 2 }, { quantity: 3 }])).toBe(5);
    expect(sumJobVariantQuantities([])).toBe(0);
  });

  it("builds combo variantTable for the editor", () => {
    expect(
      jobVariantQuantitiesToTable([
        { variantItemId: "a", valuesKey: "BK|S", quantity: 2 },
        { variantItemId: "b", valuesKey: "BK|M", quantity: 0 }
      ])
    ).toEqual({
      variantTable: [{ valuesKey: "BK|S", Quantities: 2 }]
    });
  });

  it("filters zero and negative lines out of editor configTable", () => {
    expect(
      jobVariantQuantitiesToTable([
        { variantItemId: "a", valuesKey: "BK|S", quantity: -1 },
        { variantItemId: "b", valuesKey: "BK|M", quantity: 0 },
        { variantItemId: "c", valuesKey: "RD|L", quantity: 4 }
      ]).variantTable
    ).toEqual([{ valuesKey: "RD|L", Quantities: 4 }]);
  });
});
