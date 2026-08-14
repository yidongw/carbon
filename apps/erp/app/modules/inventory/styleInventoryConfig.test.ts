import { describe, expect, it } from "vitest";
import { buildVariantsQuantityEditorState } from "~/modules/production/variantsQuantityTableColumns";
import {
  breakdownToInventoryVariantsQuantity,
  buildInventoryVariantsQuantityReferenceContext
} from "./styleInventoryConfig";

const comboParameters = [
  {
    key: "variantItemId",
    label: "Attributes",
    dataType: "list" as const,
    listOptions: [],
    optionVariantItemLabels: {
      iav_bgm: "米色 · M",
      iav_bgl: "米色 · L",
      iav_bks: "黑色 · S"
    }
  }
];

describe("breakdownToInventoryVariantsQuantity", () => {
  it("aggregates on-hand into variantItemId rows", () => {
    const result = breakdownToInventoryVariantsQuantity([
      { variantItemId: "iav_bgm", quantityOnHand: 6 },
      { variantItemId: "iav_bgm", quantityOnHand: 4 },
      { variantItemId: "iav_bgl", quantityOnHand: 2 },
      { variantItemId: null, quantityOnHand: 50 },
      { variantItemId: "iav_bks", quantityOnHand: 1 }
    ]);

    expect(result).toEqual({
      variantTable: [
        { variantItemId: "iav_bgm", Quantities: 10 },
        { variantItemId: "iav_bgl", Quantities: 2 },
        { variantItemId: "iav_bks", Quantities: 1 }
      ]
    });
  });

  it("returns null when nothing is tagged by variantItemId", () => {
    expect(
      breakdownToInventoryVariantsQuantity([
        { variantItemId: null, quantityOnHand: 9 }
      ])
    ).toBeNull();
  });
});

describe("buildInventoryVariantsQuantityReferenceContext", () => {
  it("feeds inventory caps into the combo editor state", () => {
    const inventory = breakdownToInventoryVariantsQuantity([
      { variantItemId: "iav_bgm", quantityOnHand: 10 }
    ]);
    const referenceContext = buildInventoryVariantsQuantityReferenceContext({
      variantQuantities: inventory,
      otherLineVariantQuantities: [
        {
          variantTable: [{ variantItemId: "iav_bgm", Quantities: 3 }]
        }
      ]
    });

    const { referenceByRowIndex } = buildVariantsQuantityEditorState({
      parameters: comboParameters,
      defaultQuantityLabel: "Quantities",
      currentVariantQuantities: { variantTable: [] },
      referenceContext
    });

    expect(referenceByRowIndex[0]?.Quantities).toBe(7);
  });
});
