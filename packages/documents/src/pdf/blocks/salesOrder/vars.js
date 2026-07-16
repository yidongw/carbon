"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSalesOrderVars = buildSalesOrderVars;
/**
 * Merge-field variable map for a Sales Order. Tokens mirror
 * `SALES_ORDER_MERGE_FIELDS` in template/merge.ts.
 */
function buildSalesOrderVars(data) {
    var _a, _b, _c;
    var so = data.salesOrder;
    var loc = data.salesOrderLocations;
    var str = function (v) { return (v == null ? "" : String(v)); };
    return {
        "order.number": str(so === null || so === void 0 ? void 0 : so.salesOrderId),
        "order.date": str(so === null || so === void 0 ? void 0 : so.orderDate),
        "order.customerReference": str(so === null || so === void 0 ? void 0 : so.customerReference),
        "order.currency": str(data.currencyCode),
        "customer.name": str(loc === null || loc === void 0 ? void 0 : loc.customerName),
        "customer.addressLine1": str(loc === null || loc === void 0 ? void 0 : loc.customerAddressLine1),
        "customer.city": str(loc === null || loc === void 0 ? void 0 : loc.customerCity),
        "customer.country": str(loc === null || loc === void 0 ? void 0 : loc.customerCountryName),
        "company.name": str((_a = data.company) === null || _a === void 0 ? void 0 : _a.name),
        "company.city": str((_b = data.company) === null || _b === void 0 ? void 0 : _b.city),
        "company.country": str((_c = data.company) === null || _c === void 0 ? void 0 : _c.countryCode)
    };
}
