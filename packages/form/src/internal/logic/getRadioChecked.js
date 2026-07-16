"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRadioChecked = void 0;
var getRadioChecked = function (radioValue, newValue) {
    if (radioValue === void 0) { radioValue = "on"; }
    if (typeof newValue === "string")
        return newValue === radioValue;
    return undefined;
};
exports.getRadioChecked = getRadioChecked;
