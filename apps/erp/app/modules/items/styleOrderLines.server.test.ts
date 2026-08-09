import { describe, expect, it } from "vitest";
import {
  expandVariantTableToLines,
  hasStyleVariantsQuantity
} from "./styleOrderLines.server";

describe("hasStyleVariantsQuantity", () => {
  it("returns true when variantTable has rows", () => {
    expect(
      hasStyleVariantsQuantity({
        variantTable: [{ valuesKey: "BK|XS", Quantities: 1 }]
      })
    ).toBe(true);
  });

  it("returns false for empty or missing tables", () => {
    expect(hasStyleVariantsQuantity(null)).toBe(false);
    expect(hasStyleVariantsQuantity({})).toBe(false);
    expect(hasStyleVariantsQuantity({ variantTable: [] })).toBe(false);
  });
});

function mockClient(handlers: {
  variants?: Array<{
    id: string;
    variantItemId: string;
    valuesKey: string;
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
        return {
          select: () => ({
            eq: () => ({
              eq: async () => ({
                data: handlers.variants ?? [],
                error: handlers.variantsError ?? null
              })
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
      { valuesKey: "BK|XS", Quantities: 2 },
      { valuesKey: "BK|S", Quantities: 4 }
    ]
  };

  it("expands attribute combo cells to distinct variant SKUs", async () => {
    const client = mockClient({
      variants: [
        { id: "iv1", variantItemId: "item_bk_xs", valuesKey: "BK|XS" },
        { id: "iv2", variantItemId: "item_bk_s", valuesKey: "BK|S" }
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
      { variantItemId: "item_bk_xs", quantity: 2, valuesKey: "BK|XS" },
      { variantItemId: "item_bk_s", quantity: 4, valuesKey: "BK|S" }
    ]);
  });

  it("expands a color-only consumable grid (no size dimension)", async () => {
    // A Fabric/Trim Consumable has only a color attribute, so each combo row's
    // valuesKey is a single color code.
    const client = mockClient({
      attributeSetId: "ias_fabric",
      setAttributeCodes: ["Color"],
      variants: [
        { id: "iv1", variantItemId: "item_rd", valuesKey: "RD" },
        { id: "iv2", variantItemId: "item_bl", valuesKey: "BL" }
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
          { valuesKey: "RD", Quantities: 3 },
          { valuesKey: "BL", Quantities: 2 }
        ]
      }
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.variants).toEqual([
      { variantItemId: "item_rd", quantity: 3, valuesKey: "RD" },
      { variantItemId: "item_bl", quantity: 2, valuesKey: "BL" }
    ]);
  });

  it("fails loud when a configured cell has no variant SKU", async () => {
    const client = mockClient({
      variants: [
        { id: "iv1", variantItemId: "item_bk_xs", valuesKey: "BK|XS" }
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
    expect(result.error).toMatch(/No variant SKU exists for BK\|S/i);
  });

  it("fails when configuration has no positive quantities", async () => {
    const client = mockClient({ variants: [], attrs: [] });
    const result = await expandVariantTableToLines(client, {
      parentItemId,
      companyId,
      variantQuantities: {
        variantTable: [
          { valuesKey: "BK|XS", Quantities: 0 },
          { valuesKey: "BK|S", Quantities: 0 }
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
