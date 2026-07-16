"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAddressLines = formatAddressLines;
exports.formatCityStatePostalCode = formatCityStatePostalCode;
exports.formatAddress = formatAddress;
function formatAddressLines(addressLine1, addressLine2) {
    // Concatenate addressLine1 and addressLine2 if both are provided
    if (addressLine1) {
        var address = addressLine2
            ? "".concat(addressLine1, " ").concat(addressLine2)
            : addressLine1;
        return address;
    }
    else if (addressLine2) {
        return addressLine2;
    }
    return "";
}
function formatCityStatePostalCode(city, stateProvince, postalCode) {
    // Create an array to hold the different parts of the address
    var parts = [];
    // Add city in the correct format
    if (city)
        parts.push(city);
    // Combine state and postalCode without a comma if both are provided
    if (stateProvince) {
        var stateProvincePostalCode = postalCode
            ? "".concat(stateProvince, " ").concat(postalCode)
            : stateProvince;
        parts.push(stateProvincePostalCode);
    }
    else if (postalCode) {
        parts.push(postalCode);
    }
    // Join all parts with a comma separator
    return parts.join(", ");
}
function formatAddress(addressLine1, addressLine2, city, stateProvince, postalCode, country) {
    // Create an array to hold the different parts of the address
    var parts = [];
    var formattedAddressLines = formatAddressLines(addressLine1, addressLine2);
    if (formattedAddressLines)
        parts.push(formattedAddressLines);
    var formattedCityStatePostalCode = formatCityStatePostalCode(city, stateProvince, postalCode);
    if (formattedCityStatePostalCode)
        parts.push(formattedCityStatePostalCode);
    if (country)
        parts.push(country);
    // Join all parts with a comma separator
    return parts.join(", ");
}
