import { describe, expect, it } from "vitest";
import {
  isNonEmptyVariantsQuantity,
  isVariantsQuantityPayload,
  jobVariantQuantitiesToTable,
  sumJobVariantQuantities
} from "./jobVariantQuantity.service";

describe("jobVariantQuantity helpers", () => {
  it("detects variantTable vs flat Part params (retired configTable ignored)", () => {
    expect(
      isVariantsQuantityPayload({
        variantTable: [{ variantItemId: "item_bk_s", Quantities: 2 }]
      })
    ).toBe(true);
    expect(
      isVariantsQuantityPayload({
        configTable: [{ variantItemId: "item_bk_s", Quantities: 2 }]
      })
    ).toBe(false);
    expect(isVariantsQuantityPayload({ color: "BK", finish: "matte" })).toBe(
      false
    );
    expect(isVariantsQuantityPayload(null)).toBe(false);
    expect(isVariantsQuantityPayload({ variantTable: [] })).toBe(true);
    expect(isVariantsQuantityPayload({ configTable: [] })).toBe(false);
  });

  it("requires non-empty variantTable for qty gates", () => {
    expect(
      isNonEmptyVariantsQuantity({
        variantTable: [{ variantItemId: "item_bk_s", Quantities: 2 }]
      })
    ).toBe(true);
    expect(
      isNonEmptyVariantsQuantity({
        configTable: [{ variantItemId: "item_bk_s", Quantities: 2 }]
      })
    ).toBe(false);
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
        { variantItemId: "a", quantity: 2 },
        { variantItemId: "b", quantity: 0 }
      ])
    ).toEqual({
      variantTable: [{ variantItemId: "a", Quantities: 2 }]
    });
  });

  it("filters zero and negative lines out of editor variantTable", () => {
    expect(
      jobVariantQuantitiesToTable([
        { variantItemId: "a", quantity: -1 },
        { variantItemId: "b", quantity: 0 },
        { variantItemId: "c", quantity: 4 }
      ]).variantTable
    ).toEqual([{ variantItemId: "c", Quantities: 4 }]);
  });
});
