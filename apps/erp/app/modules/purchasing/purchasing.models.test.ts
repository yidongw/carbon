import { describe, expect, it } from "vitest";
import { purchaseOrderLineValidator } from "./purchasing.models";

describe("purchaseOrderLineValidator", () => {
  it("accepts Style purchase order lines", () => {
    const result = purchaseOrderLineValidator.safeParse({
      purchaseOrderId: "po_1",
      purchaseOrderLineType: "Style",
      itemId: "item_1",
      purchaseQuantity: 10
    });

    expect(result.success).toBe(true);
  });

  it("requires an item for Style purchase order lines", () => {
    const result = purchaseOrderLineValidator.safeParse({
      purchaseOrderId: "po_1",
      purchaseOrderLineType: "Style",
      purchaseQuantity: 10
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["itemId"]);
  });

  it("accepts Style configuration JSON on purchase order lines", () => {
    const result = purchaseOrderLineValidator.safeParse({
      purchaseOrderId: "po_1",
      purchaseOrderLineType: "Style",
      itemId: "item_1",
      purchaseQuantity: 10,
      configuration: JSON.stringify({
        variantTable: [
          { valuesKey: "Black|S", Quantities: 2 },
          { valuesKey: "Black|M", Quantities: 3 }
        ]
      })
    });

    expect(result.success).toBe(true);
  });
});
