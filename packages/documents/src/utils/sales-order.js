"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLineDescription = getLineDescription;
exports.getLineDescriptionDetails = getLineDescriptionDetails;
exports.getLineSubtotal = getLineSubtotal;
exports.getLineTaxableSubtotal = getLineTaxableSubtotal;
exports.getLineTaxesAndFees = getLineTaxesAndFees;
exports.getLineTotal = getLineTotal;
exports.getTotal = getTotal;
function getLineDescription(line) {
    var _a, _b;
    switch (line === null || line === void 0 ? void 0 : line.salesOrderLineType) {
        case "Fixed Asset":
            return ((_b = (_a = line === null || line === void 0 ? void 0 : line.assetReadableId) !== null && _a !== void 0 ? _a : line === null || line === void 0 ? void 0 : line.assetName) !== null && _b !== void 0 ? _b : "Fixed Asset");
        case "Comment":
            return line === null || line === void 0 ? void 0 : line.description;
        default:
            var customerPartNumber = line.customerPartId
                ? " (".concat(line.customerPartId).concat(line.customerPartRevision ? " Rev ".concat(line.customerPartRevision) : "", ")")
                : "";
            return (line === null || line === void 0 ? void 0 : line.itemReadableId) + customerPartNumber;
    }
}
function getLineDescriptionDetails(line) {
    var _a;
    switch (line === null || line === void 0 ? void 0 : line.salesOrderLineType) {
        case "Fixed Asset":
            return line === null || line === void 0 ? void 0 : line.description;
        case "Comment":
        default:
            var itemDescription = (line === null || line === void 0 ? void 0 : line.customerPartId)
                ? "\n".concat(line.customerPartId).concat(line.customerPartRevision ? " Rev ".concat(line.customerPartRevision) : "")
                : "";
            return ((_a = line === null || line === void 0 ? void 0 : line.description) !== null && _a !== void 0 ? _a : "") + itemDescription;
    }
}
function getLineSubtotal(line) {
    var _a, _b, _c;
    if ((line === null || line === void 0 ? void 0 : line.saleQuantity) && (line === null || line === void 0 ? void 0 : line.convertedUnitPrice)) {
        return (line.saleQuantity * line.convertedUnitPrice +
            ((_a = line.convertedAddOnCost) !== null && _a !== void 0 ? _a : 0) +
            ((_b = line.convertedNonTaxableAddOnCost) !== null && _b !== void 0 ? _b : 0) +
            ((_c = line.convertedShippingCost) !== null && _c !== void 0 ? _c : 0));
    }
    return 0;
}
function getLineTaxableSubtotal(line) {
    var _a, _b;
    if ((line === null || line === void 0 ? void 0 : line.saleQuantity) && (line === null || line === void 0 ? void 0 : line.convertedUnitPrice)) {
        return (line.saleQuantity * line.convertedUnitPrice +
            ((_a = line.convertedAddOnCost) !== null && _a !== void 0 ? _a : 0) +
            ((_b = line.convertedShippingCost) !== null && _b !== void 0 ? _b : 0));
    }
    return 0;
}
function getLineTaxesAndFees(line) {
    var _a, _b, _c, _d;
    var taxPercent = (_a = line.taxPercent) !== null && _a !== void 0 ? _a : 0;
    var tax = getLineTaxableSubtotal(line) * taxPercent;
    var fees = ((_b = line.convertedAddOnCost) !== null && _b !== void 0 ? _b : 0) +
        ((_c = line.convertedNonTaxableAddOnCost) !== null && _c !== void 0 ? _c : 0) +
        ((_d = line.convertedShippingCost) !== null && _d !== void 0 ? _d : 0);
    return tax + fees;
}
function getLineTotal(line) {
    var _a;
    var taxPercent = (_a = line.taxPercent) !== null && _a !== void 0 ? _a : 0;
    var tax = getLineTaxableSubtotal(line) * taxPercent;
    return getLineSubtotal(line) + tax;
}
function getTotal(lines, salesOrder) {
    var _a, _b;
    var total = 0;
    lines.forEach(function (line) {
        total += getLineTotal(line);
    });
    return (total + ((_a = salesOrder.shippingCost) !== null && _a !== void 0 ? _a : 0) * ((_b = salesOrder.exchangeRate) !== null && _b !== void 0 ? _b : 1));
}
