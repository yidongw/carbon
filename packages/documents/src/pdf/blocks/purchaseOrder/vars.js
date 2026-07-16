"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPurchaseOrderVars = buildPurchaseOrderVars;
/** Merge-field variable map for a Purchase Order. */
function buildPurchaseOrderVars(data) {
    var _a, _b, _c;
    var po = data.purchaseOrder;
    var loc = data.purchaseOrderLocations;
    var str = function (v) { return (v == null ? "" : String(v)); };
    return {
        "order.number": str(po === null || po === void 0 ? void 0 : po.purchaseOrderId),
        "order.date": str(po === null || po === void 0 ? void 0 : po.orderDate),
        "order.supplierReference": str(po === null || po === void 0 ? void 0 : po.supplierReference),
        "order.currency": str(data.currencyCode),
        "supplier.name": str(loc === null || loc === void 0 ? void 0 : loc.supplierName),
        "supplier.addressLine1": str(loc === null || loc === void 0 ? void 0 : loc.supplierAddressLine1),
        "supplier.city": str(loc === null || loc === void 0 ? void 0 : loc.supplierCity),
        "supplier.country": str(loc === null || loc === void 0 ? void 0 : loc.supplierCountryName),
        "company.name": str((_a = data.company) === null || _a === void 0 ? void 0 : _a.name),
        "company.city": str((_b = data.company) === null || _b === void 0 ? void 0 : _b.city),
        "company.country": str((_c = data.company) === null || _c === void 0 ? void 0 : _c.countryCode)
    };
}
