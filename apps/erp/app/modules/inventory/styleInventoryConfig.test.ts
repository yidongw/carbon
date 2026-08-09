import { describe, expect, it } from "vitest";
import { buildVariantsQuantityEditorState } from "~/modules/production/variantsQuantityTableColumns";
import {
  breakdownToInventoryVariantsQuantity,
  buildInventoryVariantsQuantityReferenceContext
} from "./styleInventoryConfig";

const comboParameters = [
  {
    key: "valuesKey",
    label: "Attributes",
    dataType: "list" as const,
    listOptions: ["BG|M", "BG|L", "BK|S"]
  }
];

describe("breakdownToInventoryVariantsQuantity", () => {
  it("aggregates on-hand into combo valuesKey rows", () => {
    const result = breakdownToInventoryVariantsQuantity([
      { valuesKey: "BG|M", quantityOnHand: 6 },
      { valuesKey: "BG|M", quantityOnHand: 4 },
      { valuesKey: "BG|L", quantityOnHand: 2 },
      { valuesKey: null, quantityOnHand: 50 },
      { valuesKey: "BK|S", quantityOnHand: 1 }
    ]);

    expect(result).toEqual({
      configTable: [
        { valuesKey: "BG|M", Quantities: 10 },
        { valuesKey: "BG|L", Quantities: 2 },
        { valuesKey: "BK|S", Quantities: 1 }
      ]
    });
  });

  it("returns null when nothing is tagged by valuesKey", () => {
    expect(
      breakdownToInventoryVariantsQuantity([
        { colorCode: null, sizeCode: null, quantityOnHand: 9 }
      ])
    ).toBeNull();
  });
});

describe("buildInventoryVariantsQuantityReferenceContext", () => {
  it("feeds inventory caps into the combo editor state", () => {
    const inventory = breakdownToInventoryVariantsQuantity([
      { valuesKey: "BG|M", quantityOnHand: 10 }
    ]);
    const referenceContext = buildInventoryVariantsQuantityReferenceContext({
      variantQuantities: inventory,
      otherLineVariantQuantities: [
        {
          configTable: [{ valuesKey: "BG|M", Quantities: 3 }]
        }
      ]
    });

    const { referenceByRowIndex } = buildVariantsQuantityEditorState({
      parameters: comboParameters,
      defaultQuantityLabel: "Quantities",
      currentConfiguration: { configTable: [] },
      referenceContext
    });

    expect(referenceByRowIndex[0]?.Quantities).toBe(7);
  });
});
