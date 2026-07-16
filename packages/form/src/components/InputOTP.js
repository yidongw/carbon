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
var react_1 = require("@carbon/react");
var react_2 = require("react");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var InputOTP = (0, react_2.forwardRef)(function (_a, ref) {
    var name = _a.name, label = _a.label, isConfigured = _a.isConfigured, isOptional = _a.isOptional, isRequired = _a.isRequired, helperText = _a.helperText, _b = _a.maxLength, maxLength = _b === void 0 ? 6 : _b, onConfigure = _a.onConfigure, rest = __rest(_a, ["name", "label", "isConfigured", "isOptional", "isRequired", "helperText", "maxLength", "onConfigure"]);
    var _c = (0, hooks_1.useField)(name), error = _c.error, fieldIsOptional = _c.isOptional;
    var _d = (0, hooks_1.useControlField)(name), value = _d[0], setValue = _d[1];
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formState.isDisabled || formState.isReadOnly;
    var resolvedIsOptional = isOptional !== null && isOptional !== void 0 ? isOptional : (isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false));
    (0, react_2.useEffect)(function () {
        var _a;
        if ((value === null || value === void 0 ? void 0 : value.length) === maxLength) {
            var form = (_a = document
                .querySelector("input[name=\"".concat(name, "\"]"))) === null || _a === void 0 ? void 0 : _a.closest("form");
            if (form) {
                form.submit();
            }
        }
    }, [value, maxLength, name]);
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired}>
        {label ? (<react_1.FormLabel htmlFor={name} isOptional={resolvedIsOptional} isConfigured={isConfigured} onConfigure={onConfigure}>
            {label}
          </react_1.FormLabel>) : null}

        <react_1.InputOTP name={name} maxLength={6} value={value} onChange={setValue} ref={ref} disabled={isDisabled}>
          <react_1.InputOTPGroup>
            <react_1.InputOTPSlot index={0}/>
            <react_1.InputOTPSlot index={1}/>
            <react_1.InputOTPSlot index={2}/>
            <react_1.InputOTPSlot index={3}/>
            <react_1.InputOTPSlot index={4}/>
            <react_1.InputOTPSlot index={5}/>
          </react_1.InputOTPGroup>
        </react_1.InputOTP>

        {helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>}
        {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
      </react_1.FormControl>);
});
InputOTP.displayName = "InputOTP";
exports.default = InputOTP;
