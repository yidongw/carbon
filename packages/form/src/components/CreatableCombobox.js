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
var react_dom_1 = require("react-dom");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var CreatableCombobox = (0, react_2.forwardRef)(function (_a, ref) {
    var _b = _a.autoSelectSingleOption, autoSelectSingleOption = _b === void 0 ? false : _b, isClearable = _a.isClearable, name = _a.name, label = _a.label, helperText = _a.helperText, _c = _a.isConfigured, isConfigured = _c === void 0 ? false : _c, isOptional = _a.isOptional, isRequired = _a.isRequired, onConfigure = _a.onConfigure, props = __rest(_a, ["autoSelectSingleOption", "isClearable", "name", "label", "helperText", "isConfigured", "isOptional", "isRequired", "onConfigure"]);
    var _d = (0, hooks_1.useField)(name), getInputProps = _d.getInputProps, error = _d.error, fieldIsOptional = _d.isOptional;
    var _e = (0, hooks_1.useControlField)(name), value = _e[0], setValue = _e[1];
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isReadOnly = formState.isReadOnly || formState.isDisabled || props.isReadOnly;
    var resolvedIsOptional = isOptional !== null && isOptional !== void 0 ? isOptional : (isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false));
    (0, react_2.useEffect)(function () {
        if (props.value !== null && props.value !== undefined)
            setValue(props.value);
    }, [props.value, setValue]);
    (0, react_2.useEffect)(function () {
        if (autoSelectSingleOption &&
            props.options.length === 1 &&
            !value // Only auto-select if no value is already set
        ) {
            setValue(props.options[0].value);
        }
    }, [autoSelectSingleOption, props.options, setValue, value]);
    var onChange = function (value) {
        var _a, _b, _c;
        if (value) {
            (_a = props === null || props === void 0 ? void 0 : props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, (_b = props.options.find(function (o) { return o.value === value; })) !== null && _b !== void 0 ? _b : null);
        }
        else {
            (_c = props === null || props === void 0 ? void 0 : props.onChange) === null || _c === void 0 ? void 0 : _c.call(props, null);
        }
    };
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && (<react_1.FormLabel htmlFor={name} isConfigured={isConfigured} onConfigure={onConfigure} isOptional={resolvedIsOptional}>
            {label}
          </react_1.FormLabel>)}
        <input {...getInputProps({
        id: name,
        value: value
    })} type="hidden" name={name} id={name}/>
        <react_1.CreatableCombobox ref={ref} {...props} value={value === null || value === void 0 ? void 0 : value.replace(/"/g, '\\"')} isClearable={isClearable !== null && isClearable !== void 0 ? isClearable : (resolvedIsOptional && !isReadOnly)} isReadOnly={isReadOnly} label={label} className="w-full" onChange={function (newValue) {
            var _a;
            (0, react_dom_1.flushSync)(function () {
                var _a;
                setValue((_a = newValue === null || newValue === void 0 ? void 0 : newValue.replace(/"/g, '\\"')) !== null && _a !== void 0 ? _a : "");
            });
            onChange((_a = newValue === null || newValue === void 0 ? void 0 : newValue.replace(/"/g, '\\"')) !== null && _a !== void 0 ? _a : "");
        }}/>
        {error ? (<react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>) : (helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>)}
      </react_1.FormControl>);
});
CreatableCombobox.displayName = "CreatableCombobox";
exports.default = CreatableCombobox;
