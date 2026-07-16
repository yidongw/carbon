"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeRegistrationLine = composeRegistrationLine;
/**
 * Compose the per-page registration line shown on the left side of the PDF
 * footer (across PO, Quote, Sales Order, Sales Invoice).
 *
 * Format: "{companyName} is registered in {country}, Company Number {eori}".
 *   - The "Company Number {eori}" suffix is appended only when an EORI exists.
 *   - The "Accounts Receivable: {email}" suffix is appended only when provided
 *     (sales PDFs pass this; PO does not).
 *
 * Returns null when the minimum data (name + country) is missing — callers can
 * skip rendering when null.
 */
function composeRegistrationLine(_a) {
    var companyName = _a.companyName, country = _a.country, eori = _a.eori;
    if (!companyName || !country)
        return null;
    var line = "".concat(companyName, " is registered in ").concat(country);
    if (eori)
        line += ", Company Registration Number ".concat(eori);
    return line;
}
