"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrencyFormatter = exports.formatTaxPercent = exports.getRegistrationFooter = exports.getCountryName = void 0;
var regionNames = new Intl.DisplayNames(["en"], { type: "region" });
var getCountryName = function (countryCode) {
    var _a;
    if (!countryCode)
        return "";
    try {
        return (_a = regionNames.of(countryCode.toUpperCase())) !== null && _a !== void 0 ? _a : countryCode;
    }
    catch (_b) {
        return countryCode;
    }
};
exports.getCountryName = getCountryName;
var getRegistrationFooter = function (name, countryCode, taxId) {
    if (!name)
        return undefined;
    var country = (0, exports.getCountryName)(countryCode);
    var base = country ? "".concat(name, " is registered in ").concat(country) : name;
    return taxId ? "".concat(base, ", Company Registration Number ").concat(taxId) : base;
};
exports.getRegistrationFooter = getRegistrationFooter;
var formatTaxPercent = function (taxPercent) {
    if (!taxPercent)
        return null;
    return "".concat((taxPercent * 100).toFixed(0), "%");
};
exports.formatTaxPercent = formatTaxPercent;
var getCurrencyFormatter = function (baseCurrencyCode, locale, maximumFractionDigits) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: baseCurrencyCode,
        maximumFractionDigits: maximumFractionDigits !== null && maximumFractionDigits !== void 0 ? maximumFractionDigits : 2
    });
};
exports.getCurrencyFormatter = getCurrencyFormatter;
