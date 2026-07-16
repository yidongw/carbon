"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEoriCountry = isEoriCountry;
var EORI_COUNTRY_CODES = new Set([
    "AT",
    "BE",
    "BG",
    "HR",
    "CY",
    "CZ",
    "DK",
    "EE",
    "FI",
    "FR",
    "DE",
    "GB",
    "GR",
    "HU",
    "IE",
    "IT",
    "LV",
    "LT",
    "LU",
    "MT",
    "NL",
    "PL",
    "PT",
    "RO",
    "SK",
    "SI",
    "ES",
    "SE"
]);
function isEoriCountry(countryCode) {
    if (!countryCode)
        return false;
    return EORI_COUNTRY_CODES.has(countryCode.toUpperCase());
}
