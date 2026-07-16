"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCheckboxChecked = void 0;
var getCheckboxChecked = function (checkboxValue, newValue) {
    if (checkboxValue === void 0) { checkboxValue = "on"; }
    if (Array.isArray(newValue))
        return newValue.some(function (val) { return val === true || val === checkboxValue; });
    if (typeof newValue === "boolean")
        return newValue;
    if (typeof newValue === "string")
        return newValue === checkboxValue;
    return undefined;
};
exports.getCheckboxChecked = getCheckboxChecked;
