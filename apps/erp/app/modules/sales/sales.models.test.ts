import { describe, expect, it } from "vitest";
import { salesOrderLineValidator } from "./sales.models";

const baseStyle = {
  salesOrderId: "so_1",
  salesOrderLineType: "Style" as const,
  itemId: "item_1",
  locationId: "loc_1",
  methodType: "Make to Order" as const,
  saleQuantity: 10,
  taxPercent: 0,
  configuration: JSON.stringify({
    configTable: [{ color: "Black", size: "M", quantity: 10 }],
    primaryKeys: ["color", "size"]
  })
};

describe("salesOrderLineValidator", () => {
  it("accepts Style sales order lines with quantity and configuration", () => {
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

  it("allows Style variant SKU lines without configuration JSON", () => {
    const result = salesOrderLineValidator.safeParse({
      ...baseStyle,
      configuration: ""
    });

    expect(result.success).toBe(true);
  });
});
