/** Valid `purchaseOrderLineType` values when `itemId` is set (matches ERP methodItemType). */
export const purchaseOrderItemLineTypes = [
  "Part",
  "Material",
  "Tool",
  "Consumable"
] as const;

export type PurchaseOrderItemLineType =
  (typeof purchaseOrderItemLineTypes)[number];

export function toPurchaseOrderItemLineType(
  itemType: string
): PurchaseOrderItemLineType {
  return purchaseOrderItemLineTypes.includes(itemType as PurchaseOrderItemLineType)
    ? (itemType as PurchaseOrderItemLineType)
    : "Part";
}

export type OutsideProcessingPurchaseOrderLinePricing = {
  purchaseQuantity: number;
  supplierUnitPrice: number;
  isMinimumCostLine: boolean;
  description?: string;
};

export function calculateOutsideProcessingPurchaseOrderLines({
  quantity,
  unitCost,
  minimumCost,
  minimumCostDescription = "Minimum cost"
}: {
  quantity: number;
  unitCost: number;
  minimumCost: number;
  minimumCostDescription?: string;
}): OutsideProcessingPurchaseOrderLinePricing[] {
  const purchaseQuantity = quantity > 0 ? quantity : 1;
  const unitTotal = unitCost * purchaseQuantity;
  const lineTotal = Math.max(minimumCost, unitTotal);
  const minimumCostCharge = lineTotal - unitTotal;

  const lines: OutsideProcessingPurchaseOrderLinePricing[] = [
    {
      purchaseQuantity,
      supplierUnitPrice: unitCost,
      isMinimumCostLine: false
    }
  ];

  if (minimumCostCharge > 0) {
    lines.push({
      purchaseQuantity: 1,
      supplierUnitPrice: minimumCostCharge,
      isMinimumCostLine: true,
      description: minimumCostDescription
    });
  }

  return lines;
}

export function getPurchaseOrderLineExtendedPrice(line: {
  purchaseQuantity?: number | null;
  supplierUnitPrice?: number | null;
  unitPrice?: number | null;
  taxAmount?: number | null;
  shippingCost?: number | null;
}) {
  const quantity = line.purchaseQuantity ?? 0;
  const unitPrice = line.unitPrice ?? line.supplierUnitPrice ?? 0;
  return (
    quantity * unitPrice + (line.taxAmount ?? 0) + (line.shippingCost ?? 0)
  );
}

export function getPurchaseOrderLineSupplierExtendedPrice(line: {
  purchaseQuantity?: number | null;
  supplierUnitPrice?: number | null;
  supplierTaxAmount?: number | null;
  supplierShippingCost?: number | null;
}) {
  const quantity = line.purchaseQuantity ?? 0;
  const unitPrice = line.supplierUnitPrice ?? 0;
  return (
    quantity * unitPrice +
    (line.supplierTaxAmount ?? 0) +
    (line.supplierShippingCost ?? 0)
  );
}
