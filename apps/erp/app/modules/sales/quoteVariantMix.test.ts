import {
  collectVariantMixItemIds,
  formatVariantTableMix,
  readVariantTableMix
} from "@carbon/utils";
import { describe, expect, it } from "vitest";

describe("quote variant mix display", () => {
  it("reads Style mix rows from configuration.variantTable", () => {
    expect(
      readVariantTableMix({
        variantTable: [
          { variantItemId: "item_s", Quantities: 60 },
          { variantItemId: "item_m", Quantities: 50 }
        ]
      })
    ).toEqual([
      { variantItemId: "item_s", quantity: 60 },
      { variantItemId: "item_m", quantity: 50 }
    ]);
  });

  it("formats mix with readable SKU labels", () => {
    expect(
      formatVariantTableMix(
        {
          variantTable: [
            { variantItemId: "item_s", Quantities: 60 },
            { variantItemId: "item_m", Quantities: 50 }
          ]
        },
        { item_s: "444-S", item_m: "444-M" }
      )
    ).toEqual(["444-S × 60", "444-M × 50"]);
  });

  it("dedupes variant item ids across lines", () => {
    expect(
      collectVariantMixItemIds([
        { variantTable: [{ variantItemId: "item_s", Quantities: 1 }] },
        { variantTable: [{ variantItemId: "item_s", Quantities: 2 }] },
        { variantTable: [{ variantItemId: "item_m", Quantities: 3 }] }
      ])
    ).toEqual(["item_s", "item_m"]);
  });
});
