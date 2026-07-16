"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var formatValidationError_1 = require("~/utils/formatValidationError");
var Array = (0, react_1.forwardRef)(function (_a, ref) {
    var formatErrorProp = _a.formatError, addButtonLabel = _a.addButtonLabel, removeItemAriaLabel = _a.removeItemAriaLabel, rest = __rest(_a, ["formatError", "addButtonLabel", "removeItemAriaLabel"]);
    var t = (0, macro_1.useLingui)().t;
    var formatValidationError = (0, formatValidationError_1.useFormatValidationError)();
    var formatError = formatErrorProp !== null && formatErrorProp !== void 0 ? formatErrorProp : formatValidationError;
    return (<form_1.Array ref={ref} addButtonLabel={addButtonLabel !== null && addButtonLabel !== void 0 ? addButtonLabel : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["New Option"], ["New Option"])))} removeItemAriaLabel={removeItemAriaLabel !== null && removeItemAriaLabel !== void 0 ? removeItemAriaLabel : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Remove item"], ["Remove item"])))} formatError={formatError} {...rest}/>);
});
Array.displayName = "Array";
exports.default = Array;
var templateObject_1, templateObject_2;
