"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPurchaseOrderItemLineType = toPurchaseOrderItemLineType;
exports.calculateOutsideProcessingPurchaseOrderLines = calculateOutsideProcessingPurchaseOrderLines;
// Mirror of methodItemType in apps/erp/app/modules/shared/shared.models.ts —
// keep in sync so ERP and edge functions normalize item types identically.
var purchaseOrderItemLineTypes = [
    "Part",
    "Material",
    "Tool",
    "Consumable",
];
function toPurchaseOrderItemLineType(itemType) {
    return purchaseOrderItemLineTypes.includes(itemType)
        ? itemType
        : "Part";
}
function calculateOutsideProcessingPurchaseOrderLines(_a) {
    var quantity = _a.quantity, unitCost = _a.unitCost, minimumCost = _a.minimumCost, _b = _a.minimumCostDescription, minimumCostDescription = _b === void 0 ? "Minimum cost" : _b;
    var purchaseQuantity = quantity > 0 ? quantity : 1;
    var unitTotal = unitCost * purchaseQuantity;
    var lineTotal = Math.max(minimumCost, unitTotal);
    var minimumCostCharge = lineTotal - unitTotal;
    var lines = [
        {
            purchaseQuantity: purchaseQuantity,
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
