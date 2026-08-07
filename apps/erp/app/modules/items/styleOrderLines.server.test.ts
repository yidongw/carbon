import { describe, expect, it } from "vitest";
import {
  expandStyleConfigToVariantLines,
  hasStyleConfigTable
} from "./styleOrderLines.server";

describe("hasStyleConfigTable", () => {
  it("returns true when configTable has rows", () => {
    expect(
      hasStyleConfigTable({
        configTable: [{ color: "BK", XS: 1 }],
        configTablePrimaryKeys: ["XS"]
      })
    ).toBe(true);
  });

  it("returns false for empty or missing tables", () => {
    expect(hasStyleConfigTable(null)).toBe(false);
    expect(hasStyleConfigTable({})).toBe(false);
    expect(hasStyleConfigTable({ configTable: [] })).toBe(false);
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
      throw new Error(`unexpected table ${table}`);
    }
  } as any;
}

describe("expandStyleConfigToVariantLines", () => {
  const parentItemId = "item_parent";
  const companyId = "co_1";
  const configuration = {
    configTable: [{ color: "BK", XS: 2, S: 4 }],
    configTablePrimaryKeys: ["XS", "S"]
  };

  it("expands color×size cells to distinct variant SKUs", async () => {
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

    const result = await expandStyleConfigToVariantLines(client, {
      parentItemId,
      companyId,
      configuration
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.variants).toEqual([
      { variantItemId: "item_bk_xs", quantity: 2, valuesKey: "BK|XS" },
      { variantItemId: "item_bk_s", quantity: 4, valuesKey: "BK|S" }
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

    const result = await expandStyleConfigToVariantLines(client, {
      parentItemId,
      companyId,
      configuration
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatch(/No variant SKU exists for BK \/ S/i);
  });

  it("fails when configuration has no positive quantities", async () => {
    const client = mockClient({ variants: [], attrs: [] });
    const result = await expandStyleConfigToVariantLines(client, {
      parentItemId,
      companyId,
      configuration: {
        configTable: [{ color: "BK", XS: 0, S: 0 }],
        configTablePrimaryKeys: ["XS", "S"]
      }
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatch(/no quantities/i);
  });
});
