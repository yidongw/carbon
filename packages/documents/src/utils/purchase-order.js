"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLineDescription = getLineDescription;
exports.getLineDescriptionDetails = getLineDescriptionDetails;
exports.getLineTotal = getLineTotal;
exports.getTotal = getTotal;
function getLineDescription(line) {
    var _a;
    switch (line === null || line === void 0 ? void 0 : line.purchaseOrderLineType) {
        case "Fixed Asset":
            return (_a = line === null || line === void 0 ? void 0 : line.assetName) !== null && _a !== void 0 ? _a : "Fixed Asset";
        case "G/L Account":
            return line === null || line === void 0 ? void 0 : line.description;
        case "Comment":
            return line === null || line === void 0 ? void 0 : line.description;
        default:
            // Use `||` (not `??`) so an empty-string supplier part number falls
            // through to the item id. Supplier parts with no part number get
            // backfilled onto the line as "", and `??` would render a blank line.
            return ((line === null || line === void 0 ? void 0 : line.supplierPartId) ||
                (line === null || line === void 0 ? void 0 : line.supplierPartIdFromSupplier) ||
                (line === null || line === void 0 ? void 0 : line.itemReadableId));
    }
}
function getLineDescriptionDetails(line) {
    switch (line === null || line === void 0 ? void 0 : line.purchaseOrderLineType) {
        case "Fixed Asset":
            return line === null || line === void 0 ? void 0 : line.description;
        case "G/L Account":
            return line.accountName
                ? "G/L Account: ".concat(line.accountName)
                : "G/L Account";
        case "Comment":
        default:
            var itemDescription = (line === null || line === void 0 ? void 0 : line.itemDescription)
                ? "\n".concat(line.itemDescription)
                : "";
            return (line === null || line === void 0 ? void 0 : line.description) + itemDescription;
    }
}
function getLineTotal(line) {
    var _a, _b;
    if ((line === null || line === void 0 ? void 0 : line.purchaseQuantity) && (line === null || line === void 0 ? void 0 : line.supplierUnitPrice)) {
        return (line.purchaseQuantity * line.supplierUnitPrice +
            ((_a = line.supplierShippingCost) !== null && _a !== void 0 ? _a : 0) +
            ((_b = line.supplierTaxAmount) !== null && _b !== void 0 ? _b : 0));
    }
    return 0;
}
function getTotal(lines) {
    var total = 0;
    lines.forEach(function (line) {
        var _a, _b;
        if ((line === null || line === void 0 ? void 0 : line.purchaseQuantity) && (line === null || line === void 0 ? void 0 : line.supplierUnitPrice)) {
            total +=
                line.purchaseQuantity * line.supplierUnitPrice +
                    ((_a = line === null || line === void 0 ? void 0 : line.supplierShippingCost) !== null && _a !== void 0 ? _a : 0) +
                    ((_b = line === null || line === void 0 ? void 0 : line.supplierTaxAmount) !== null && _b !== void 0 ? _b : 0);
        }
    });
    return total;
}
