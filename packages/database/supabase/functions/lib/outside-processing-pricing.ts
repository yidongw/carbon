// Mirror of methodItemType in apps/erp/app/modules/shared/shared.models.ts —
// keep in sync so ERP and edge functions normalize item types identically.
const purchaseOrderItemLineTypes = [
  "Part",
  "Material",
  "Tool",
  "Consumable",
] as const;

type PurchaseOrderItemLineType = (typeof purchaseOrderItemLineTypes)[number];

export function toPurchaseOrderItemLineType(
  itemType: string
): PurchaseOrderItemLineType {
  return purchaseOrderItemLineTypes.includes(
    itemType as PurchaseOrderItemLineType
  )
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
  minimumCostDescription = "Minimum cost",
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
      isMinimumCostLine: false,
    },
  ];

  if (minimumCostCharge > 0) {
    lines.push({
      purchaseQuantity: 1,
      supplierUnitPrice: minimumCostCharge,
      isMinimumCostLine: true,
      description: minimumCostDescription,
    });
  }

  return lines;
}
