"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQuoteVars = buildQuoteVars;
/** Merge-field variable map for a Quote. */
function buildQuoteVars(data) {
    var _a, _b, _c;
    var q = data.quote;
    var c = data.quoteCustomerDetails;
    var str = function (v) { return (v == null ? "" : String(v)); };
    return {
        "quote.number": str(q === null || q === void 0 ? void 0 : q.quoteId),
        "quote.expirationDate": str(q === null || q === void 0 ? void 0 : q.expirationDate),
        "quote.customerReference": str(q === null || q === void 0 ? void 0 : q.customerReference),
        "quote.currency": str(data.currencyCode),
        "customer.name": str(c === null || c === void 0 ? void 0 : c.customerName),
        "customer.addressLine1": str(c === null || c === void 0 ? void 0 : c.customerAddressLine1),
        "customer.city": str(c === null || c === void 0 ? void 0 : c.customerCity),
        "customer.country": str(c === null || c === void 0 ? void 0 : c.customerCountryName),
        "company.name": str((_a = data.company) === null || _a === void 0 ? void 0 : _a.name),
        "company.city": str((_b = data.company) === null || _b === void 0 ? void 0 : _b.city),
        "company.country": str((_c = data.company) === null || _c === void 0 ? void 0 : _c.countryCode)
    };
}
