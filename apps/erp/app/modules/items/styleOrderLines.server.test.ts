import { describe, expect, it } from "vitest";
import {
  resolveOrderVariantQuantities,
  scalePlanningMixToTotal
} from "./styleOrderLines";
import {
  buildMaterialRowsFromVariants,
  expandVariantTableToLines,
  getVariantChildItemIds,
  hasStyleVariantsQuantity,
  scalePlanningQuantityFieldsForVariant,
  scaleVariantQuantitiesToTotal
} from "./styleOrderLines.server";

describe("scaleVariantQuantitiesToTotal", () => {
  it("scales mix weights so quantities sum to the week total", () => {
    const scaled = scaleVariantQuantitiesToTotal(
      [
        { variantItemId: "sku_s", quantity: 1 },
        { variantItemId: "sku_m", quantity: 2 }
      ],
      30
    );
    expect(scaled).toEqual([
      { variantItemId: "sku_s", quantity: 10 },
      { variantItemId: "sku_m", quantity: 20 }
    ]);
  });

  it("drops zero allocations and returns empty for invalid inputs", () => {
    expect(scaleVariantQuantitiesToTotal([], 10)).toEqual([]);
    expect(
      scaleVariantQuantitiesToTotal(
        [{ variantItemId: "sku_s", quantity: 0 }],
        10
      )
    ).toEqual([]);
    expect(
      scaleVariantQuantitiesToTotal(
        [{ variantItemId: "sku_s", quantity: 1 }],
        0
      )
    ).toEqual([]);
  });
});

describe("scalePlanningMixToTotal", () => {
  it("scales mix table weights so Quantities sum to the order total", () => {
    expect(
      scalePlanningMixToTotal(
        {
          variantTable: [
            { variantItemId: "sku_s", Quantities: 1 },
            { variantItemId: "sku_m", Quantities: 2 }
          ]
        },
        30
      )
    ).toEqual({
      variantTable: [
        { variantItemId: "sku_s", Quantities: 10 },
        { variantItemId: "sku_m", Quantities: 20 }
      ]
    });
  });

  it("returns undefined when mix or total cannot be scaled", () => {
    expect(scalePlanningMixToTotal(undefined, 30)).toBeUndefined();
    expect(
      scalePlanningMixToTotal(
        { variantTable: [{ variantItemId: "sku_s", Quantities: 1 }] },
        0
      )
    ).toBeUndefined();
  });
});

describe("resolveOrderVariantQuantities", () => {
  const mix = {
    variantTable: [
      { variantItemId: "sku_s", Quantities: 1 },
      { variantItemId: "sku_m", Quantities: 2 }
    ]
  };

  it("keeps a saved mix on the order", () => {
    const saved = {
      variantTable: [{ variantItemId: "sku_s", Quantities: 4 }]
    };
    expect(
      resolveOrderVariantQuantities(
        { quantity: 30, variantQuantities: saved },
        mix
      )
    ).toEqual(saved);
  });

  it("does not auto-apply planning mix to existing jobs", () => {
    expect(
      resolveOrderVariantQuantities({ existingId: "job_1", quantity: 30 }, mix)
    ).toBeUndefined();
  });

  it("scales planning mix onto new jobs", () => {
    expect(resolveOrderVariantQuantities({ quantity: 30 }, mix)).toEqual({
      variantTable: [
        { variantItemId: "sku_s", Quantities: 10 },
        { variantItemId: "sku_m", Quantities: 20 }
      ]
    });
  });
});

describe("scalePlanningQuantityFieldsForVariant", () => {
  const mix = [
    { variantItemId: "sku_s", quantity: 1 },
    { variantItemId: "sku_m", quantity: 2 }
  ];

  it("splits stock targets by mix ratio and leaves lot size alone", () => {
    const parent = {
      demandAccumulationSafetyStock: 30,
      reorderPoint: 15,
      reorderQuantity: 9,
      maximumInventoryQuantity: 60,
      orderMultiple: 5,
      minimumOrderQuantity: 2
    };

    expect(scalePlanningQuantityFieldsForVariant(parent, mix, "sku_s")).toEqual(
      {
        demandAccumulationSafetyStock: 10,
        reorderPoint: 5,
        reorderQuantity: 3,
        maximumInventoryQuantity: 20
      }
    );
    expect(scalePlanningQuantityFieldsForVariant(parent, mix, "sku_m")).toEqual(
      {
        demandAccumulationSafetyStock: 20,
        reorderPoint: 10,
        reorderQuantity: 6,
        maximumInventoryQuantity: 40
      }
    );
  });

  it("assigns zero to a SKU omitted from the mix remainder", () => {
    expect(
      scalePlanningQuantityFieldsForVariant(
        { demandAccumulationSafetyStock: 30 },
        mix,
        "sku_l"
      )
    ).toEqual({ demandAccumulationSafetyStock: 0 });
  });
});

describe("hasStyleVariantsQuantity", () => {
  it("returns true when variantTable has rows", () => {
    expect(
      hasStyleVariantsQuantity({
        variantTable: [{ variantItemId: "item_bk_xs", Quantities: 1 }]
      })
    ).toBe(true);
  });

  it("ignores the retired legacy configTable key", () => {
    expect(
      hasStyleVariantsQuantity({
        configTable: [{ variantItemId: "item_bk_xs", Quantities: 1 }]
      })
    ).toBe(false);
  });

  it("returns false for empty or missing tables", () => {
    expect(hasStyleVariantsQuantity(null)).toBe(false);
    expect(hasStyleVariantsQuantity({})).toBe(false);
    expect(hasStyleVariantsQuantity({ variantTable: [] })).toBe(false);
    expect(hasStyleVariantsQuantity({ configTable: [] })).toBe(false);
  });
});

describe("getVariantChildItemIds", () => {
  it("returns child SKU ids for a parent with variants", async () => {
    const client = mockClient({
      variants: [
        { id: "iv1", variantItemId: "sku_s" },
        { id: "iv2", variantItemId: "sku_m" }
      ]
    });
    await expect(
      getVariantChildItemIds(client as never, {
        parentItemId: "style_1",
        companyId: "co"
      })
    ).resolves.toEqual(["sku_s", "sku_m"]);
  });

  it("returns empty when the parent has no variants", async () => {
    const client = mockClient({ variants: [] });
    await expect(
      getVariantChildItemIds(client as never, {
        parentItemId: "part_1",
        companyId: "co"
      })
    ).resolves.toEqual([]);
  });
});

function mockClient(handlers: {
  variants?: Array<{
    id: string;
    variantItemId: string;
  }>;
  attrs?: Array<{
    itemVariantId: string;
    attributeId: string;
    itemAttributeValue: { code: string } | null;
  }>;
  /** Parent item attributeSetId — null uses Color|Size fallback. */
  attributeSetId?: string | null;
  /** Ordered attribute codes on the set (e.g. ["Color"] for color-only). */
  setAttributeCodes?: string[];
  variantsError?: Error;
  attrsError?: Error;
}) {
  return {
    from(table: string) {
      if (table === "itemVariant") {
        const result = {
          data: handlers.variants ?? [],
          error: handlers.variantsError ?? null
        };
        // Supports both loadParentVariantIds (.eq().eq()) and the code-combo
        // fallback loader (.eq().in()).
        return {
          select: () => ({
            eq: () => ({
              eq: async () => result,
              in: async () => result
            })
          })
        };
      }
      if (table === "itemVariantAttribute") {
        return {
          select: () => ({
            eq: () => ({
              in: async () => ({
                data: handlers.attrs ?? [],
                error: handlers.attrsError ?? null
              })
            })
          })
        };
      }
      if (table === "item") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: {
                    attributeSetId:
                      handlers.attributeSetId === undefined
                        ? null
                        : handlers.attributeSetId
                  },
                  error: null
                })
              })
            })
          })
        };
      }
      if (table === "itemAttributeSetAttribute") {
        const codes = handlers.setAttributeCodes ?? [];
        return {
          select: () => ({
            eq: () => ({
              order: async () => ({
                data: codes.map((code) => ({
                  itemAttribute: { code }
                })),
                error: null
              })
            })
          })
        };
      }
      throw new Error(`unexpected table ${table}`);
    }
  } as any;
}

describe("expandVariantTableToLines", () => {
  const parentItemId = "item_parent";
  const companyId = "co_1";
  const configuration = {
    variantTable: [
      { variantItemId: "item_bk_xs", Quantities: 2 },
      { variantItemId: "item_bk_s", Quantities: 4 }
    ]
  };

  it("expands attribute combo cells to distinct variant SKUs", async () => {
    const client = mockClient({
      variants: [
        { id: "iv1", variantItemId: "item_bk_xs" },
        { id: "iv2", variantItemId: "item_bk_s" }
      ],
      attrs: [
        {
          itemVariantId: "iv1",
          attributeId: "iat_color",
          itemAttributeValue: { code: "BK" }
        },
        {
          itemVariantId: "iv1",
          attributeId: "iat_size",
          itemAttributeValue: { code: "XS" }
        },
        {
          itemVariantId: "iv2",
          attributeId: "iat_color",
          itemAttributeValue: { code: "BK" }
        },
        {
          itemVariantId: "iv2",
          attributeId: "iat_size",
          itemAttributeValue: { code: "S" }
        }
      ]
    });

    const result = await expandVariantTableToLines(client, {
      parentItemId,
      companyId,
      variantQuantities: configuration
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.variants).toEqual([
      { variantItemId: "item_bk_xs", quantity: 2 },
      { variantItemId: "item_bk_s", quantity: 4 }
    ]);
  });

  it("expands a color-only consumable grid (no size dimension)", async () => {
    // A Fabric/Trim Consumable has only a color attribute, so each combo row is
    // a single color-code variant SKU.
    const client = mockClient({
      attributeSetId: "ias_fabric",
      setAttributeCodes: ["Color"],
      variants: [
        { id: "iv1", variantItemId: "item_rd" },
        { id: "iv2", variantItemId: "item_bl" }
      ],
      attrs: [
        {
          itemVariantId: "iv1",
          attributeId: "iat_color",
          itemAttributeValue: { code: "RD" }
        },
        {
          itemVariantId: "iv2",
          attributeId: "iat_color",
          itemAttributeValue: { code: "BL" }
        }
      ]
    });

    const result = await expandVariantTableToLines(client, {
      parentItemId,
      companyId,
      variantQuantities: {
        variantTable: [
          { variantItemId: "item_rd", Quantities: 3 },
          { variantItemId: "item_bl", Quantities: 2 }
        ]
      }
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.variants).toEqual([
      { variantItemId: "item_rd", quantity: 3 },
      { variantItemId: "item_bl", quantity: 2 }
    ]);
  });

  it("fails loud when a configured cell has no variant SKU", async () => {
    const client = mockClient({
      variants: [{ id: "iv1", variantItemId: "item_bk_xs" }],
      attrs: [
        {
          itemVariantId: "iv1",
          attributeId: "iat_color",
          itemAttributeValue: { code: "BK" }
        },
        {
          itemVariantId: "iv1",
          attributeId: "iat_size",
          itemAttributeValue: { code: "XS" }
        }
      ]
    });

    const result = await expandVariantTableToLines(client, {
      parentItemId,
      companyId,
      variantQuantities: configuration
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatch(/No variant SKU exists for item_bk_s/i);
  });

  it("fails when configuration has no positive quantities", async () => {
    const client = mockClient({ variants: [], attrs: [] });
    const result = await expandVariantTableToLines(client, {
      parentItemId,
      companyId,
      variantQuantities: {
        variantTable: [
          { variantItemId: "item_bk_xs", Quantities: 0 },
          { variantItemId: "item_bk_s", Quantities: 0 }
        ]
      }
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatch(/no quantities/i);
  });
});

describe("requireVariantQuantitiesIfAttributeParent", () => {
  const parentItemId = "item_parent";
  const companyId = "co_1";

  it("rejects attribute parents without a grid", async () => {
    const client = {
      from: (table: string) => {
        const chain: Record<string, unknown> = {};
        chain.select = () => chain;
        chain.eq = () => chain;
        chain.limit = () =>
          Promise.resolve({
            data: table === "itemVariant" ? [{ id: "v1" }] : [],
            error: null
          });
        return chain;
      }
    } as never;

    const { requireVariantQuantitiesIfAttributeParent } = await import(
      "./styleOrderLines.server"
    );
    const result = await requireVariantQuantitiesIfAttributeParent(client, {
      parentItemId,
      companyId,
      variantQuantities: null,
      quantity: 5
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatch(/variant quantities/i);
  });

  it("allows plain items without variants", async () => {
    const client = {
      from: () => {
        const chain: Record<string, unknown> = {};
        chain.select = () => chain;
        chain.eq = () => chain;
        chain.limit = () => Promise.resolve({ data: [], error: null });
        return chain;
      }
    } as never;

    const { requireVariantQuantitiesIfAttributeParent } = await import(
      "./styleOrderLines.server"
    );
    const result = await requireVariantQuantitiesIfAttributeParent(client, {
      parentItemId,
      companyId,
      variantQuantities: null,
      quantity: 5
    });
    expect(result.ok).toBe(true);
  });
});

describe("buildMaterialRowsFromVariants", () => {
  it("expands parent material fields into one row per variant SKU", () => {
    const rows = buildMaterialRowsFromVariants(
      {
        id: "tmp_1",
        makeMethodId: "mm_1",
        itemId: "item_parent",
        quantity: 0,
        methodType: "Pull from Inventory" as const,
        unitOfMeasureCode: "EA"
      },
      [
        { variantItemId: "item_rd", quantity: 3 },
        { variantItemId: "item_bl", quantity: 2 }
      ]
    );

    expect(rows).toEqual([
      {
        id: "tmp_1",
        makeMethodId: "mm_1",
        itemId: "item_rd",
        quantity: 3,
        methodType: "Pull from Inventory",
        unitOfMeasureCode: "EA"
      },
      {
        id: "tmp_1",
        makeMethodId: "mm_1",
        itemId: "item_bl",
        quantity: 2,
        methodType: "Pull from Inventory",
        unitOfMeasureCode: "EA"
      }
    ]);
  });

  it("returns an empty array when there are no variants", () => {
    expect(
      buildMaterialRowsFromVariants({ itemId: "item_parent", quantity: 1 }, [])
    ).toEqual([]);
  });
});

describe("resolveMaterialVariantQuantities", () => {
  const parentItemId = "item_parent";
  const companyId = "co_1";

  it("expands a filled grid into variant SKUs", async () => {
    const { resolveMaterialVariantQuantities } = await import(
      "./styleOrderLines.server"
    );
    const client = mockClient({
      attributeSetId: "ias_fabric",
      setAttributeCodes: ["Color"],
      variants: [
        { id: "iv1", variantItemId: "item_rd" },
        { id: "iv2", variantItemId: "item_bl" }
      ],
      attrs: [
        {
          itemVariantId: "iv1",
          attributeId: "iat_color",
          itemAttributeValue: { code: "RD" }
        },
        {
          itemVariantId: "iv2",
          attributeId: "iat_color",
          itemAttributeValue: { code: "BL" }
        }
      ]
    });

    const result = await resolveMaterialVariantQuantities(client, {
      companyId,
      itemId: parentItemId,
      quantity: 0,
      variantQuantities: {
        variantTable: [
          { variantItemId: "item_rd", Quantities: 3 },
          { variantItemId: "item_bl", Quantities: 2 }
        ]
      }
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.mode).toBe("expand");
    if (result.mode !== "expand") return;
    expect(result.variants.map((v) => v.variantItemId)).toEqual([
      "item_rd",
      "item_bl"
    ]);
  });

  it("rejects attribute parents submitted without a grid", async () => {
    const { resolveMaterialVariantQuantities } = await import(
      "./styleOrderLines.server"
    );
    const client = {
      from: (table: string) => {
        const chain: Record<string, unknown> = {};
        chain.select = () => chain;
        chain.eq = () => chain;
        chain.limit = () =>
          Promise.resolve({
            data: table === "itemAttributeSelection" ? [{ id: "s1" }] : [],
            error: null
          });
        return chain;
      }
    } as never;

    const result = await resolveMaterialVariantQuantities(client, {
      companyId,
      itemId: parentItemId,
      quantity: 5,
      variantQuantities: null
    });
    expect(result.ok).toBe(false);
  });

  it("passes through plain items as a single row", async () => {
    const { resolveMaterialVariantQuantities } = await import(
      "./styleOrderLines.server"
    );
    const client = {
      from: () => {
        const chain: Record<string, unknown> = {};
        chain.select = () => chain;
        chain.eq = () => chain;
        chain.limit = () => Promise.resolve({ data: [], error: null });
        return chain;
      }
    } as never;

    const result = await resolveMaterialVariantQuantities(client, {
      companyId,
      itemId: "item_plain",
      quantity: 2,
      variantQuantities: null
    });
    expect(result).toEqual({ ok: true, mode: "single", quantity: 2 });
  });
});

describe("planning mix persistence helpers", () => {
  it("stores mix JSON on customFields without dropping other fields", async () => {
    const {
      PLANNING_VARIANT_MIX_CUSTOM_FIELD,
      omitPlanningVariantMixCustomFields,
      readPlanningVariantMixCustomFields,
      withPlanningVariantMixCustomFields
    } = await import("./styleOrderLines");
    const mix = {
      variantTable: [
        { variantItemId: "sku_s", Quantities: 1 },
        { variantItemId: "sku_m", Quantities: 2 }
      ]
    };

    const stored = withPlanningVariantMixCustomFields(
      { color: "navy" },
      JSON.stringify(mix)
    );
    expect(stored.color).toBe("navy");
    expect(stored[PLANNING_VARIANT_MIX_CUSTOM_FIELD]).toEqual(mix);
    expect(readPlanningVariantMixCustomFields(stored)).toEqual(mix);
    expect(omitPlanningVariantMixCustomFields(stored)).toEqual({
      color: "navy"
    });
  });

  it("rebuilds mix weights from the child field with the largest family total", async () => {
    const { planningMixFromChildStockTargets } = await import(
      "./styleOrderLines"
    );
    expect(
      planningMixFromChildStockTargets([
        {
          variantItemId: "sku_s",
          demandAccumulationSafetyStock: 10,
          reorderQuantity: 1
        },
        {
          variantItemId: "sku_m",
          demandAccumulationSafetyStock: 20,
          reorderQuantity: 2
        }
      ])
    ).toEqual({
      variantTable: [
        { variantItemId: "sku_s", Quantities: 10 },
        { variantItemId: "sku_m", Quantities: 20 }
      ]
    });
  });

  it("returns undefined when child stock targets are all zero", async () => {
    const { planningMixFromChildStockTargets } = await import(
      "./styleOrderLines"
    );
    expect(
      planningMixFromChildStockTargets([
        { variantItemId: "sku_s", demandAccumulationSafetyStock: 0 },
        { variantItemId: "sku_m", demandAccumulationSafetyStock: 0 }
      ])
    ).toBeUndefined();
  });
});
