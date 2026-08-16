import { describe, expect, it } from "vitest";
import { buildAttributeValueNames, getVariantDisplay } from "./variantDisplay";

describe("getVariantDisplay", () => {
  it("returns attribute-combo chips from stored-label variant rows", () => {
    const display = getVariantDisplay({
      variantTable: [
        { variantItemId: "item_bk_s", label: "黑色 · S", Quantities: 6 }
      ]
    });
    expect(display?.chips).toEqual([
      {
        key: "0:Quantities",
        variantLabel: "黑色 · S",
        label: "黑色 · S ×6",
        quantity: 6
      }
    ]);
  });

  it("renders one chip per stored variant row", () => {
    const display = getVariantDisplay({
      variantTable: [
        { variantItemId: "item_rd_s", label: "红色 · S", Quantities: 2 },
        { variantItemId: "item_bl_s", label: "蓝色 · S", Quantities: 1 },
        { variantItemId: "item_rd_m", label: "红色 · M", Quantities: 1 },
        { variantItemId: "item_bl_m", label: "蓝色 · M", Quantities: 2 }
      ]
    });
    expect(display?.chips.map((c) => c.label)).toEqual([
      "红色 · S ×2",
      "蓝色 · S ×1",
      "红色 · M ×1",
      "蓝色 · M ×2"
    ]);
  });

  it("falls back to variantItemId when a row has no stored label", () => {
    const display = getVariantDisplay({
      variantTable: [{ variantItemId: "item_lgy_m", Quantities: 3 }]
    });
    expect(display?.chips.map((c) => c.label)).toEqual(["item_lgy_m ×3"]);
  });

  it("parses JSON string configurations", () => {
    const display = getVariantDisplay(
      JSON.stringify({
        variantTable: [
          { variantItemId: "item_bg_l", label: "米色 · L", Quantities: 2 }
        ]
      })
    );
    expect(display?.chips[0]?.label).toBe("米色 · L ×2");
  });

  it("resolves unlabeled variantItemId rows from Style variant meta", () => {
    const display = getVariantDisplay(
      {
        variantTable: [
          { variantItemId: "item_bk_s", Quantities: 4 },
          { variantItemId: "item_bg_m", Quantities: 3 }
        ]
      },
      { BK: "黑色", BG: "米色" },
      undefined,
      {
        item_bk_s: {
          variantItemId: "item_bk_s",
          parentItemId: "parent",
          parentReadableId: "444",
          parentName: "f4",
          parentThumbnailPath: null,
          attributeLabels: ["BK", "S"]
        },
        item_bg_m: {
          variantItemId: "item_bg_m",
          parentItemId: "parent",
          parentReadableId: "444",
          parentName: "f4",
          parentThumbnailPath: null,
          attributeLabels: ["BG", "M"]
        }
      }
    );
    expect(display?.chips.map((c) => c.label)).toEqual([
      "黑色 · S ×4",
      "米色 · M ×3"
    ]);
  });
});

describe("getVariantDisplayFromVariants", () => {
  it("aggregates variant chips from variant lines", async () => {
    const { getVariantDisplayFromVariants } = await import("./variantDisplay");
    const display = getVariantDisplayFromVariants(
      [
        { attributeLabels: ["BG", "S"], quantity: 3 },
        { attributeLabels: ["BK", "S"], quantity: 4 },
        { attributeLabels: ["BG", "S"], quantity: 2 }
      ],
      { BG: "米色", BK: "黑色" }
    );
    expect(display?.chips.map((c) => c.label)).toEqual([
      "米色 · S ×5",
      "黑色 · S ×4"
    ]);
  });

  it("renders color-only chips for consumable variants (no size)", async () => {
    const { getVariantDisplayFromVariants } = await import("./variantDisplay");
    const display = getVariantDisplayFromVariants(
      [
        { attributeLabels: ["BG"], quantity: 3 },
        { attributeLabels: ["BK"], quantity: 4 },
        { attributeLabels: ["BG"], quantity: 2 }
      ],
      { BG: "米色", BK: "黑色" }
    );
    expect(display?.chips.map((c) => c.label)).toEqual(["米色 ×5", "黑色 ×4"]);
  });
});

describe("groupLinesForStyleDisplay", () => {
  it("collapses variant SKUs under the parent Style", async () => {
    const { groupLinesForStyleDisplay } = await import("./variantDisplay");
    const groups = groupLinesForStyleDisplay(
      [
        { id: "v1", itemId: "c1", purchaseQuantity: 4 },
        { id: "v2", itemId: "c2", purchaseQuantity: 3 }
      ],
      {
        c1: {
          variantItemId: "c1",
          parentItemId: "p1",
          parentReadableId: "111333",
          parentName: "1113333",
          parentThumbnailPath: null,
          attributeLabels: ["BK", "S"]
        },
        c2: {
          variantItemId: "c2",
          parentItemId: "p1",
          parentReadableId: "111333",
          parentName: "1113333",
          parentThumbnailPath: null,
          attributeLabels: ["BG", "S"]
        }
      },
      { BK: "黑色", BG: "米色" },
      (line) =>
        Number((line as { purchaseQuantity?: number }).purchaseQuantity ?? 0)
    );
    expect(groups).toHaveLength(1);
    expect(groups[0]?.kind).toBe("style-group");
    if (groups[0]?.kind === "style-group") {
      expect(groups[0].parentReadableId).toBe("111333");
      expect(groups[0].totalLines.map((l) => l.id)).toEqual(["v1", "v2"]);
      expect(groups[0].variantDisplay?.chips.map((c) => c.label)).toEqual([
        "黑色 · S ×4",
        "米色 · S ×3"
      ]);
    }
  });
});

describe("buildAttributeValueNames", () => {
  it("maps color codes and English aliases from the seed reference", () => {
    const names = buildAttributeValueNames([
      { code: "RD", name: "红色" },
      { code: "GY", name: "灰色" }
    ]);
    expect(names.RD).toBe("红色");
    expect(names.Red).toBe("红色");
    expect(names.red).toBe("红色");
    expect(names.RED).toBe("红色");
    expect(names.Gray).toBe("灰色");
    expect(names.Grey).toBe("灰色");
  });
});
