import { describe, expect, it } from "vitest";
import {
  buildAttributeValueNames,
  getStyleConfigDisplay
} from "./styleConfigDisplay";

describe("getStyleConfigDisplay", () => {
  it("returns attribute-combo chips from valuesKey rows", () => {
    const display = getStyleConfigDisplay(
      {
        configTable: [{ valuesKey: "BK|S", Quantities: 6 }]
      },
      { BK: "黑色" }
    );
    expect(display?.chips).toEqual([
      {
        key: "0:Quantities",
        descriptor: "黑色 · S",
        label: "黑色 · S ×6",
        quantity: 6
      }
    ]);
  });

  it("localizes each combo value via the name map", () => {
    const display = getStyleConfigDisplay(
      {
        configTable: [
          { valuesKey: "RD|S", Quantities: 2 },
          { valuesKey: "BL|S", Quantities: 1 },
          { valuesKey: "RD|M", Quantities: 1 },
          { valuesKey: "BL|M", Quantities: 2 }
        ]
      },
      buildAttributeValueNames([
        { code: "RD", name: "红色" },
        { code: "BL", name: "蓝色" }
      ])
    );
    expect(display?.chips.map((c) => c.label)).toEqual([
      "红色 · S ×2",
      "蓝色 · S ×1",
      "红色 · M ×1",
      "蓝色 · M ×2"
    ]);
  });

  it("aliases Light Gray from styleReference", () => {
    const display = getStyleConfigDisplay(
      {
        configTable: [{ valuesKey: "LGY|M", Quantities: 3 }]
      },
      buildAttributeValueNames([{ code: "LGY", name: "浅灰色" }])
    );
    expect(display?.chips.map((c) => c.label)).toEqual(["浅灰色 · M ×3"]);
  });

  it("parses JSON string configurations", () => {
    const display = getStyleConfigDisplay(
      JSON.stringify({
        configTable: [{ valuesKey: "BG|L", Quantities: 2 }]
      }),
      { BG: "米色" }
    );
    expect(display?.chips[0]?.label).toBe("米色 · L ×2");
  });
});

describe("getStyleConfigDisplayFromVariants", () => {
  it("aggregates attribute combo chips from variant lines", async () => {
    const { getStyleConfigDisplayFromVariants } = await import(
      "./styleConfigDisplay"
    );
    const display = getStyleConfigDisplayFromVariants(
      [
        { attributeCodes: ["BG", "S"], quantity: 3 },
        { attributeCodes: ["BK", "S"], quantity: 4 },
        { attributeCodes: ["BG", "S"], quantity: 2 }
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
        { attributeCodes: ["BG"], quantity: 3 },
        { attributeCodes: ["BK"], quantity: 4 },
        { attributeCodes: ["BG"], quantity: 2 }
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
            configTable: [{ valuesKey: "BK|S", Quantities: 5 }]
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
          attributeCodes: ["BK", "S"]
        },
        c2: {
          variantItemId: "c2",
          parentItemId: "p1",
          parentReadableId: "111333",
          parentName: "1113333",
          parentThumbnailPath: null,
          attributeCodes: ["BG", "S"]
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
