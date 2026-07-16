"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.useFormControl = useFormControl;
exports.useFormControlProps = useFormControlProps;
var dom_1 = require("../utils/dom");
var function_1 = require("../utils/function");
var FormControl_1 = require("./FormControl");
/**
 * React hook that provides the props that should be spread on to
 * input fields (`input`, `select`, `textarea`, etc.).
 *
 * It provides a convenient way to control a form fields, validation
 * and helper text.
 *
 * @internal
 */
function useFormControl(props) {
    var _a = useFormControlProps(props), isDisabled = _a.isDisabled, isInvalid = _a.isInvalid, isReadOnly = _a.isReadOnly, isRequired = _a.isRequired, rest = __rest(_a, ["isDisabled", "isInvalid", "isReadOnly", "isRequired"]);
    return __assign(__assign({}, rest), { disabled: isDisabled, readOnly: isReadOnly, required: isRequired, "aria-invalid": (0, dom_1.ariaAttr)(isInvalid), "aria-required": (0, dom_1.ariaAttr)(isRequired), "aria-readonly": (0, dom_1.ariaAttr)(isReadOnly) });
}
/**
 * @internal
 */
function useFormControlProps(props) {
    var _a, _b, _c;
    var field = (0, FormControl_1.useFormControlContext)();
    var id = props.id, disabled = props.disabled, readOnly = props.readOnly, required = props.required, isRequired = props.isRequired, isInvalid = props.isInvalid, isReadOnly = props.isReadOnly, isDisabled = props.isDisabled, onFocus = props.onFocus, onBlur = props.onBlur, rest = __rest(props, ["id", "disabled", "readOnly", "required", "isRequired", "isInvalid", "isReadOnly", "isDisabled", "onFocus", "onBlur"]);
    var labelIds = props["aria-describedby"]
        ? [props["aria-describedby"]]
        : [];
    // Error message must be described first in all scenarios.
    if ((field === null || field === void 0 ? void 0 : field.hasFeedbackText) && (field === null || field === void 0 ? void 0 : field.isInvalid)) {
        labelIds.push(field.feedbackId);
    }
    if (field === null || field === void 0 ? void 0 : field.hasHelpText) {
        labelIds.push(field.helpTextId);
    }
    return __assign(__assign({}, rest), { "aria-describedby": labelIds.join(" ") || undefined, id: id !== null && id !== void 0 ? id : field === null || field === void 0 ? void 0 : field.id, isDisabled: (_a = disabled !== null && disabled !== void 0 ? disabled : isDisabled) !== null && _a !== void 0 ? _a : field === null || field === void 0 ? void 0 : field.isDisabled, isReadOnly: (_b = readOnly !== null && readOnly !== void 0 ? readOnly : isReadOnly) !== null && _b !== void 0 ? _b : field === null || field === void 0 ? void 0 : field.isReadOnly, isRequired: (_c = required !== null && required !== void 0 ? required : isRequired) !== null && _c !== void 0 ? _c : field === null || field === void 0 ? void 0 : field.isRequired, isInvalid: isInvalid !== null && isInvalid !== void 0 ? isInvalid : field === null || field === void 0 ? void 0 : field.isInvalid, onFocus: (0, function_1.callAllHandlers)(field === null || field === void 0 ? void 0 : field.onFocus, onFocus), onBlur: (0, function_1.callAllHandlers)(field === null || field === void 0 ? void 0 : field.onBlur, onBlur) });
}
