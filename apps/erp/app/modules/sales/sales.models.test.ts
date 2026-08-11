import { describe, expect, it } from "vitest";
import { quoteLineValidator, salesOrderLineValidator } from "./sales.models";

const baseStyle = {
  salesOrderId: "so_1",
  salesOrderLineType: "Style" as const,
  itemId: "item_1",
  locationId: "loc_1",
  methodType: "Make to Order" as const,
  saleQuantity: 10,
  taxPercent: 0,
  variantQuantities: JSON.stringify({
    variantTable: [{ valuesKey: "Black|M", Quantities: 10 }]
  })
};

const baseQuoteStyle = {
  quoteId: "q_1",
  itemId: "item_1",
  itemType: "Style" as const,
  status: "Not Started" as const,
  description: "Style line",
  methodType: "Make to Order" as const,
  unitOfMeasureCode: "EA",
  quantity: [10],
  taxPercent: 0,
  variantQuantities: JSON.stringify({
    variantTable: [{ valuesKey: "Black|M", Quantities: 10 }]
  })
};

describe("salesOrderLineValidator", () => {
  it("accepts Style sales order lines with quantity and variantQuantities", () => {
    const result = salesOrderLineValidator.safeParse(baseStyle);
    expect(result.success).toBe(true);
  });

  it("requires an item for Style sales order lines", () => {
    const result = salesOrderLineValidator.safeParse({
      ...baseStyle,
      itemId: undefined
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.path.includes("itemId"))).toBe(
      true
    );
  });

  it("requires a positive Style quantity", () => {
    const result = salesOrderLineValidator.safeParse({
      ...baseStyle,
      saleQuantity: 0
    });

    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((i) => i.path.includes("saleQuantity"))
    ).toBe(true);
  });

  it("allows Style variant SKU lines without variantQuantities JSON", () => {
    const result = salesOrderLineValidator.safeParse({
      ...baseStyle,
      variantQuantities: ""
    });

    expect(result.success).toBe(true);
  });
});

describe("quoteLineValidator", () => {
  it("accepts Style quote lines with quantity and variantQuantities", () => {
    const result = quoteLineValidator.safeParse(baseQuoteStyle);
    expect(result.success).toBe(true);
  });

  it("requires a positive Style quantity", () => {
    const result = quoteLineValidator.safeParse({
      ...baseQuoteStyle,
      quantity: [0]
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.path.includes("quantity"))).toBe(
      true
    );
  });

  it("accepts Part quote lines without variantQuantities", () => {
    const result = quoteLineValidator.safeParse({
      ...baseQuoteStyle,
      itemType: "Part",
      variantQuantities: ""
    });

    expect(result.success).toBe(true);
  });
});
