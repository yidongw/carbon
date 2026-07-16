"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSalesInvoiceVars = buildSalesInvoiceVars;
/**
 * Build the merge-field variable map for a Sales Invoice. Tokens here must stay
 * in sync with `SALES_INVOICE_MERGE_FIELDS` in template/merge.ts (the catalog
 * the editor offers). Missing values resolve to "" so a token never prints raw.
 */
function buildSalesInvoiceVars(data) {
    var _a, _b, _c, _d, _e, _f, _g;
    var inv = data.salesInvoice;
    var loc = data.salesInvoiceLocations;
    var str = function (v) { return (v == null ? "" : String(v)); };
    return {
        "invoice.number": str(inv === null || inv === void 0 ? void 0 : inv.invoiceId),
        "invoice.dateIssued": str(inv === null || inv === void 0 ? void 0 : inv.dateIssued),
        "invoice.dateDue": str(inv === null || inv === void 0 ? void 0 : inv.dateDue),
        "invoice.customerReference": str(inv === null || inv === void 0 ? void 0 : inv.customerReference),
        "invoice.currency": str(data.currencyCode),
        "customer.name": str((_a = loc === null || loc === void 0 ? void 0 : loc.invoiceCustomerName) !== null && _a !== void 0 ? _a : loc === null || loc === void 0 ? void 0 : loc.customerName),
        "customer.addressLine1": str((_b = loc === null || loc === void 0 ? void 0 : loc.invoiceAddressLine1) !== null && _b !== void 0 ? _b : loc === null || loc === void 0 ? void 0 : loc.customerAddressLine1),
        "customer.city": str((_c = loc === null || loc === void 0 ? void 0 : loc.invoiceCity) !== null && _c !== void 0 ? _c : loc === null || loc === void 0 ? void 0 : loc.customerCity),
        "customer.country": str((_d = loc === null || loc === void 0 ? void 0 : loc.invoiceCountryName) !== null && _d !== void 0 ? _d : loc === null || loc === void 0 ? void 0 : loc.customerCountryName),
        "company.name": str((_e = data.company) === null || _e === void 0 ? void 0 : _e.name),
        "company.city": str((_f = data.company) === null || _f === void 0 ? void 0 : _f.city),
        "company.country": str((_g = data.company) === null || _g === void 0 ? void 0 : _g.countryCode)
    };
}
