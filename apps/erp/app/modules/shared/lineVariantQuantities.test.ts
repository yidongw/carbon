import { describe, expect, it } from "vitest";
import {
  buildLineVariantQuantitiesHiddenValue,
  createInitialLineVariantQuantitiesState
} from "./lineVariantQuantities";

describe("lineVariantQuantities", () => {
  it("derives initial state for a persisted variant grid", () => {
    const state = createInitialLineVariantQuantitiesState({
      initialVariantQuantities: JSON.stringify({
        variantTable: [{ valuesKey: "BK|S", Quantities: 2 }]
      }),
      hasVariantAttributes: true,
      itemId: "item_1",
      isEditing: true
    });

    expect(state.rows).toEqual([{ valuesKey: "BK|S", Quantities: 2 }]);
    expect(state.total).toBe(2);
    expect(state.hasVariantsQuantity).toBe(true);
    expect(state.isMissingVariantQty).toBe(false);
  });

  it("serializes variant rows for hidden form submission", () => {
    expect(
      buildLineVariantQuantitiesHiddenValue([
        { valuesKey: "BK|S", Quantities: 2 }
      ])
    ).toBe(
      JSON.stringify({
        variantTable: [{ valuesKey: "BK|S", Quantities: 2 }]
      })
    );
  });
});
