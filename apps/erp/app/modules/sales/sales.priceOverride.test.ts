import { describe, expect, it } from "vitest";
import {
  familyQuantityFromSiblingLines,
  pickBestBreak,
  priceOverrideLookupItemIds,
  variantFamilyBreakQuantity
} from "./sales.priceOverride";

describe("pickBestBreak", () => {
  const breaks = [
    { quantity: 1, overridePrice: 10, active: true },
    { quantity: 100, overridePrice: 8, active: true }
  ];

  it("does not apply a volume break until family qty reaches the rung", () => {
    expect(pickBestBreak(breaks, 60)?.overridePrice).toBe(10);
    expect(pickBestBreak(breaks, 99)?.overridePrice).toBe(10);
  });

  it("applies the volume break when the family total reaches the rung", () => {
    expect(pickBestBreak(breaks, 100)?.overridePrice).toBe(8);
    expect(pickBestBreak(breaks, 110)?.overridePrice).toBe(8);
  });
});

describe("priceOverrideLookupItemIds", () => {
  it("includes the parent after the child SKU", () => {
    expect(priceOverrideLookupItemIds("sku_s", "style_parent")).toEqual([
      "sku_s",
      "style_parent"
    ]);
  });

  it("returns only the item when there is no parent", () => {
    expect(priceOverrideLookupItemIds("style_parent", null)).toEqual([
      "style_parent"
    ]);
  });
});

describe("familyQuantityFromSiblingLines", () => {
  it("sums sibling SKU qty with the qty being typed on this line", () => {
    expect(
      familyQuantityFromSiblingLines({
        lineQuantity: 70,
        currentLineId: "line_s",
        siblingLines: [
          { id: "line_s", saleQuantity: 60 },
          { id: "line_m", saleQuantity: 50 }
        ]
      })
    ).toBe(120);
  });
});

describe("variantFamilyBreakQuantity", () => {
  it("prefers the family total when provided", () => {
    expect(variantFamilyBreakQuantity(60, 110)).toBe(110);
    expect(variantFamilyBreakQuantity(60)).toBe(60);
  });
});
