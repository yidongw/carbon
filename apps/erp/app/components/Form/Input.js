"use strict";
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
var react_1 = require("react");
var formatValidationError_1 = require("~/utils/formatValidationError");
var Input = (0, react_1.forwardRef)(function (_a, ref) {
    var formatErrorProp = _a.formatError, rest = __rest(_a, ["formatError"]);
    var formatValidationError = (0, formatValidationError_1.useFormatValidationError)();
    return (<form_1.Input ref={ref} formatError={formatErrorProp !== null && formatErrorProp !== void 0 ? formatErrorProp : formatValidationError} {...rest}/>);
});
Input.displayName = "Input";
exports.default = Input;
