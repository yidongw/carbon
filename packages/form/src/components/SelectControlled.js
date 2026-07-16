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
var Select_1 = require("./Select");
var SelectControlled = function (_a) {
    var _b;
    var name = _a.name, label = _a.label, helperText = _a.helperText, options = _a.options, isConfigured = _a.isConfigured, isOptional = _a.isOptional, onConfigure = _a.onConfigure, props = __rest(_a, ["name", "label", "helperText", "options", "isConfigured", "isOptional", "onConfigure"]);
    var _c = (0, hooks_1.useField)(name), getInputProps = _c.getInputProps, error = _c.error, fieldIsOptional = _c.isOptional;
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formState.isDisabled || props.isDisabled;
    var isReadOnly = formState.isReadOnly || props.isReadOnly;
    var resolvedIsOptional = (_b = isOptional !== null && isOptional !== void 0 ? isOptional : fieldIsOptional) !== null && _b !== void 0 ? _b : false;
    var _d = (0, hooks_1.useControlField)(name), controlValue = _d[0], setControlValue = _d[1];
    (0, react_2.useEffect)(function () {
        if (props.value !== null && props.value !== undefined)
            setControlValue(props.value);
    }, [props.value, setControlValue]);
    var onChange = function (value) {
        var _a, _b, _c;
        if (value) {
            // String() guards against options declared with non-string values
            // (Radix always emits strings from the trigger).
            (_a = props === null || props === void 0 ? void 0 : props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, (_b = options.find(function (o) { return String(o.value) === value; })) !== null && _b !== void 0 ? _b : null);
        }
        else {
            (_c = props === null || props === void 0 ? void 0 : props.onChange) === null || _c === void 0 ? void 0 : _c.call(props, null);
        }
    };
    return (<react_1.FormControl isInvalid={!!error}>
      {label && (<react_1.FormLabel htmlFor={name} isConfigured={isConfigured} isOptional={resolvedIsOptional} onConfigure={onConfigure}>
          {label}
        </react_1.FormLabel>)}
      <input {...getInputProps({
        id: name
    })} type="hidden" name={name} id={name} value={controlValue}/>
      <Select_1.SelectBase {...props} options={options} value={controlValue} onChange={function (newValue) {
            setControlValue(newValue !== null && newValue !== void 0 ? newValue : "");
            onChange(newValue !== null && newValue !== void 0 ? newValue : "");
        }} isClearable={resolvedIsOptional && !isReadOnly} isDisabled={isDisabled} isReadOnly={isReadOnly} className="w-full"/>

      {error ? (<react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>) : (helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>)}
    </react_1.FormControl>);
};
SelectControlled.displayName = "SelectControlled";
exports.default = SelectControlled;
