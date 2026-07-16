import { describe, expect, it } from "vitest";
import {
  purchaseInvoiceLineValidator,
  salesInvoiceLineValidator
} from "./invoicing.models";

describe("purchaseInvoiceLineValidator", () => {
  it("accepts Style item lines with a location", () => {
    const result = purchaseInvoiceLineValidator.safeParse({
      invoiceId: "pi_1",
      invoiceLineType: "Style",
      itemId: "item_1",
      locationId: "loc_1",
      quantity: 10,
      supplierShippingCost: 0,
      supplierTaxAmount: 0
    });

    expect(result.success).toBe(true);
  });

  it("requires a location for Style item lines", () => {
    const result = purchaseInvoiceLineValidator.safeParse({
      invoiceId: "pi_1",
      invoiceLineType: "Style",
      itemId: "item_1",
      quantity: 10,
      supplierShippingCost: 0,
      supplierTaxAmount: 0
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["locationId"]);
  });
});

describe("salesInvoiceLineValidator", () => {
  it("accepts Style item lines with method and location", () => {
    const result = salesInvoiceLineValidator.safeParse({
      invoiceId: "si_1",
      invoiceLineType: "Style",
      itemId: "item_1",
      methodType: "Pull from Inventory",
      locationId: "loc_1",
      quantity: 10,
      unitOfMeasureCode: "EA",
      addOnCost: 0,
      nonTaxableAddOnCost: 0,
      shippingCost: 0,
      taxPercent: 0
    });

    expect(result.success).toBe(true);
  });

  it("requires an item for Style sales lines", () => {
    const result = salesInvoiceLineValidator.safeParse({
      invoiceId: "si_1",
      invoiceLineType: "Style",
      methodType: "Pull from Inventory",
      locationId: "loc_1",
      quantity: 10,
      unitOfMeasureCode: "EA",
      addOnCost: 0,
      nonTaxableAddOnCost: 0,
      shippingCost: 0,
      taxPercent: 0
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["itemId"]);
  });
});
