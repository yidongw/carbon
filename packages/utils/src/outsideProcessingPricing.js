"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseOrderItemLineTypes = void 0;
exports.toPurchaseOrderItemLineType = toPurchaseOrderItemLineType;
exports.calculateOutsideProcessingPurchaseOrderLines = calculateOutsideProcessingPurchaseOrderLines;
exports.getPurchaseOrderLineExtendedPrice = getPurchaseOrderLineExtendedPrice;
exports.getPurchaseOrderLineSupplierExtendedPrice = getPurchaseOrderLineSupplierExtendedPrice;
/** Valid `purchaseOrderLineType` values when `itemId` is set (matches ERP methodItemType). */
exports.purchaseOrderItemLineTypes = [
    "Style",
    "Part",
    "Material",
    "Tool",
    "Consumable"
];
function toPurchaseOrderItemLineType(itemType) {
    return exports.purchaseOrderItemLineTypes.includes(itemType)
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
function getPurchaseOrderLineExtendedPrice(line) {
    var _a, _b, _c, _d, _e;
    var quantity = (_a = line.purchaseQuantity) !== null && _a !== void 0 ? _a : 0;
    var unitPrice = (_c = (_b = line.unitPrice) !== null && _b !== void 0 ? _b : line.supplierUnitPrice) !== null && _c !== void 0 ? _c : 0;
    return (quantity * unitPrice + ((_d = line.taxAmount) !== null && _d !== void 0 ? _d : 0) + ((_e = line.shippingCost) !== null && _e !== void 0 ? _e : 0));
}
function getPurchaseOrderLineSupplierExtendedPrice(line) {
    var _a, _b, _c, _d;
    var quantity = (_a = line.purchaseQuantity) !== null && _a !== void 0 ? _a : 0;
    var unitPrice = (_b = line.supplierUnitPrice) !== null && _b !== void 0 ? _b : 0;
    return (quantity * unitPrice +
        ((_c = line.supplierTaxAmount) !== null && _c !== void 0 ? _c : 0) +
        ((_d = line.supplierShippingCost) !== null && _d !== void 0 ? _d : 0));
}
