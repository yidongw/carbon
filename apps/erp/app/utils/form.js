"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCustomFields = exports.getCustomFields = exports.isValidEmail = void 0;
var emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
var isValidEmail = function (email) {
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
var getCustomFields = function (fields) {
    if (!fields || typeof fields !== "object" || fields === null)
        return {};
    return Object.entries(fields).reduce(function (acc, _a) {
        var key = _a[0], value = _a[1];
        if (typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean") {
            acc["custom-".concat(key)] = value;
        }
        return acc;
    }, {});
};
exports.getCustomFields = getCustomFields;
var setCustomFields = function (formData) {
    var result = {};
    for (var _i = 0, _a = formData.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if ((key.startsWith("custom-") && typeof value === "string") ||
            typeof value === "number" ||
            typeof value === "boolean") {
            result[key.replace("custom-", "")] = value;
        }
    }
    return result;
};
exports.setCustomFields = setCustomFields;
