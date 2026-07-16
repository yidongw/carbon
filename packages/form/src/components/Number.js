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
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var Number = (0, react_2.forwardRef)(function (_a, ref) {
    var _b;
    var name = _a.name, _c = _a.size, size = _c === void 0 ? "md" : _c, label = _a.label, _d = _a.isConfigured, isConfigured = _d === void 0 ? false : _d, isOptional = _a.isOptional, isRequired = _a.isRequired, isReadOnlyProp = _a.isReadOnly, isDisabledProp = _a.isDisabled, helperText = _a.helperText, onConfigure = _a.onConfigure, rest = __rest(_a, ["name", "size", "label", "isConfigured", "isOptional", "isRequired", "isReadOnly", "isDisabled", "helperText", "onConfigure"]);
    var _e = (0, hooks_1.useField)(name), getInputProps = _e.getInputProps, error = _e.error, fieldIsOptional = _e.isOptional;
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isReadOnly = formState.isReadOnly || isReadOnlyProp;
    var isDisabled = formState.isDisabled || isDisabledProp;
    var formatOptions = (_b = rest.formatOptions) !== null && _b !== void 0 ? _b : {
        minimumFractionDigits: 0,
        maximumFractionDigits: 10
    };
    var resolvedIsOptional = isOptional !== null && isOptional !== void 0 ? isOptional : (isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false));
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired} isDisabled={isDisabled} isReadOnly={isReadOnly}>
        {label && (<react_1.FormLabel htmlFor={name} isOptional={resolvedIsOptional} isConfigured={isConfigured} onConfigure={onConfigure}>
            {label}
          </react_1.FormLabel>)}
        <react_1.NumberField {...getInputProps(__assign({ id: name }, rest))} formatOptions={formatOptions} isDisabled={isDisabled}>
          <react_1.NumberInputGroup className="relative">
            <react_1.NumberInput isReadOnly={isReadOnly} isDisabled={isDisabled} ref={ref} size={size}/>
            {!isReadOnly && !isDisabled && size !== "sm" && (<react_1.NumberInputStepper>
                <react_1.NumberIncrementStepper>
                  <lu_1.LuChevronUp size="1em" strokeWidth="3"/>
                </react_1.NumberIncrementStepper>
                <react_1.NumberDecrementStepper>
                  <lu_1.LuChevronDown size="1em" strokeWidth="3"/>
                </react_1.NumberDecrementStepper>
              </react_1.NumberInputStepper>)}
          </react_1.NumberInputGroup>
        </react_1.NumberField>
        {helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>}
        {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
      </react_1.FormControl>);
});
Number.displayName = "Number";
exports.default = Number;
