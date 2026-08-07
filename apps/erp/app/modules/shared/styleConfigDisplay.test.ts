import { describe, expect, it } from "vitest";
import {
  buildStyleColorNames,
  getStyleConfigDisplay
} from "./styleConfigDisplay";

describe("getStyleConfigDisplay", () => {
  it("returns Color · Size chips for size-column Style configs", () => {
    const display = getStyleConfigDisplay(
      {
        configTable: [{ color: "BK", XS: 0, S: 6 }],
        configTablePrimaryKeys: ["XS", "S"]
      },
      { BK: "黑色" }
    );
    expect(display?.chips).toEqual([
      {
        key: "0:S",
        colorSize: "黑色 · S",
        label: "黑色 · S ×6",
        quantity: 6
      }
    ]);
  });

  it("returns Color · Size chips for color-column legacy configs", () => {
    const display = getStyleConfigDisplay(
      {
        configTable: [
          { Size: "S", Red: 2, Blue: 1 },
          { Size: "M", Red: 1, Blue: 2 }
        ],
        configTablePrimaryKeys: ["Red", "Blue"]
      },
      buildStyleColorNames([
        { colorCode: "RD", colorName: "红色" },
        { colorCode: "BL", colorName: "蓝色" }
      ])
    );
    expect(display?.chips.map((c) => c.label)).toEqual([
      "红色 · S ×2",
      "蓝色 · S ×1",
      "红色 · M ×1",
      "蓝色 · M ×2"
    ]);
  });

  it("aliases Light Gray from styleReference for legacy LGY columns", () => {
    const display = getStyleConfigDisplay(
      {
        configTable: [{ Size: "M", "Light Gray": 3 }],
        configTablePrimaryKeys: ["Light Gray"]
      },
      buildStyleColorNames([{ colorCode: "LGY", colorName: "浅灰色" }])
    );
    expect(display?.chips.map((c) => c.label)).toEqual(["浅灰色 · M ×3"]);
  });

  it("parses JSON string configurations", () => {
    const display = getStyleConfigDisplay(
      JSON.stringify({
        configTable: [{ color: "BG", L: 2 }],
        configTablePrimaryKeys: ["L"]
      }),
      { BG: "米色" }
    );
    expect(display?.chips[0]?.label).toBe("米色 · L ×2");
  });
});

describe("getStyleConfigDisplayFromVariants", () => {
  it("aggregates Color · Size chips from variant lines", async () => {
    const { getStyleConfigDisplayFromVariants } = await import(
      "./styleConfigDisplay"
    );
    const display = getStyleConfigDisplayFromVariants(
      [
        { colorCode: "BG", sizeCode: "S", quantity: 3 },
        { colorCode: "BK", sizeCode: "S", quantity: 4 },
        { colorCode: "BG", sizeCode: "S", quantity: 2 }
      ],
      { BG: "米色", BK: "黑色" }
    );
    expect(display?.chips.map((c) => c.label)).toEqual([
      "米色 · S ×5",
      "黑色 · S ×4"
    ]);
  });

  it("renders color-only chips for consumable variants (no size)", async () => {
    const { getStyleConfigDisplayFromVariants } = await import(
      "./styleConfigDisplay"
    );
    const display = getStyleConfigDisplayFromVariants(
      [
        { colorCode: "BG", sizeCode: "", quantity: 3 },
        { colorCode: "BK", sizeCode: "", quantity: 4 },
        { colorCode: "BG", sizeCode: "", quantity: 2 }
      ],
      { BG: "米色", BK: "黑色" }
    );
    expect(display?.chips.map((c) => c.label)).toEqual(["米色 ×5", "黑色 ×4"]);
  });
});

describe("groupLinesForStyleDisplay", () => {
  it("collapses variant SKUs under the parent Style", async () => {
    const { groupLinesForStyleDisplay } = await import("./styleConfigDisplay");
    const groups = groupLinesForStyleDisplay(
      [
        {
          id: "parent",
          itemId: "p1",
          configuration: {
            configTable: [{ color: "BK", S: 5 }],
            configTablePrimaryKeys: ["S"]
          },
          purchaseQuantity: 5
        },
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
          colorCode: "BK",
          sizeCode: "S"
        },
        c2: {
          variantItemId: "c2",
          parentItemId: "p1",
          parentReadableId: "111333",
          parentName: "1113333",
          parentThumbnailPath: null,
          colorCode: "BG",
          sizeCode: "S"
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
      expect(groups[0].styleConfig?.chips.map((c) => c.label)).toEqual([
        "黑色 · S ×4",
        "米色 · S ×3"
      ]);
    }
  });
});

describe("buildStyleColorNames", () => {
  it("maps colorCode and English aliases from the seed reference", () => {
    const names = buildStyleColorNames([
      { colorCode: "RD", colorName: "红色" },
      { colorCode: "GY", colorName: "灰色" }
    ]);
    expect(names.RD).toBe("红色");
    expect(names.Red).toBe("红色");
    expect(names.red).toBe("红色");
    expect(names.RED).toBe("红色");
    expect(names.Gray).toBe("灰色");
    expect(names.Grey).toBe("灰色");
  });
});
