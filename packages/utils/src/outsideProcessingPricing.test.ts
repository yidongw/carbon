import { describe, expect, it } from "vitest";
import {
  calculateOutsideProcessingPurchaseOrderLines,
  toPurchaseOrderItemLineType
} from "./outsideProcessingPricing";

describe("toPurchaseOrderItemLineType", () => {
  it("passes through valid item types", () => {
    expect(toPurchaseOrderItemLineType("Material")).toBe("Material");
  });

  it("falls back to Part for unsupported item types", () => {
    expect(toPurchaseOrderItemLineType("Fixture")).toBe("Part");
    expect(toPurchaseOrderItemLineType("Service")).toBe("Part");
    expect(toPurchaseOrderItemLineType("Finished Good")).toBe("Part");
  });
});

describe("calculateOutsideProcessingPurchaseOrderLines", () => {
  it("returns a single unit-cost line when quantity exceeds minimum", () => {
    const lines = calculateOutsideProcessingPurchaseOrderLines({
      quantity: 100,
      unitCost: 10,
      minimumCost: 1000
    });

    expect(lines).toEqual([
      {
        purchaseQuantity: 100,
        supplierUnitPrice: 10,
        isMinimumCostLine: false
      }
    ]);
  });

  it("adds a minimum cost line when unit total is below minimum", () => {
    const lines = calculateOutsideProcessingPurchaseOrderLines({
      quantity: 100,
      unitCost: 1,
      minimumCost: 1000
    });

    expect(lines).toEqual([
      {
        purchaseQuantity: 100,
        supplierUnitPrice: 1,
        isMinimumCostLine: false
      },
      {
        purchaseQuantity: 1,
        supplierUnitPrice: 900,
        isMinimumCostLine: true,
        description: "Minimum cost"
      }
    ]);
  });

  it("uses quantity 1 when quantity is zero", () => {
    const lines = calculateOutsideProcessingPurchaseOrderLines({
      quantity: 0,
      unitCost: 1,
      minimumCost: 1000
    });

    expect(lines).toHaveLength(2);
    expect(lines[0]?.purchaseQuantity).toBe(1);
    expect(lines[1]?.supplierUnitPrice).toBe(999);
  });
});
