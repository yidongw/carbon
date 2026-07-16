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
var Combobox = function (_a) {
    var name = _a.name, label = _a.label, _b = _a.isLoading, isLoading = _b === void 0 ? false : _b, isOptional = _a.isOptional, isRequired = _a.isRequired, helperText = _a.helperText, props = __rest(_a, ["name", "label", "isLoading", "isOptional", "isRequired", "helperText"]);
    var _c = (0, hooks_1.useField)(name), getInputProps = _c.getInputProps, error = _c.error, fieldIsOptional = _c.isOptional;
    var _d = (0, hooks_1.useControlField)(name), value = _d[0], setValue = _d[1];
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isReadOnly = formState.isReadOnly || formState.isDisabled || props.isReadOnly;
    var resolvedIsOptional = isOptional !== null && isOptional !== void 0 ? isOptional : (isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false));
    (0, react_2.useEffect)(function () {
        var _a;
        if (props.value !== null && props.value !== undefined)
            setValue((_a = props.value) !== null && _a !== void 0 ? _a : "");
    }, [props.value, setValue]);
    var onChange = function (value) {
        var _a, _b, _c;
        if (value) {
            (_a = props === null || props === void 0 ? void 0 : props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, (_b = props === null || props === void 0 ? void 0 : props.options.find(function (o) { return o.value === value; })) !== null && _b !== void 0 ? _b : null);
        }
        else {
            (_c = props === null || props === void 0 ? void 0 : props.onChange) === null || _c === void 0 ? void 0 : _c.call(props, null);
        }
    };
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired}>
      {label && (<react_1.FormLabel htmlFor={name} isOptional={resolvedIsOptional}>
          {label}
        </react_1.FormLabel>)}
      <input {...getInputProps({
        id: name
    })} type="hidden" name={name} id={name} value={value}/>
      <react_1.Combobox {...props} value={value} onChange={function (newValue) {
            var _a;
            (0, react_dom_1.flushSync)(function () {
                var _a;
                setValue((_a = newValue === null || newValue === void 0 ? void 0 : newValue.replace(/"/g, '\\"')) !== null && _a !== void 0 ? _a : "");
            });
            onChange((_a = newValue === null || newValue === void 0 ? void 0 : newValue.replace(/"/g, '\\"')) !== null && _a !== void 0 ? _a : "");
        }} isClearable={resolvedIsOptional && !isReadOnly} isReadOnly={isReadOnly} isLoading={isLoading} className="w-full"/>
      {error ? (<react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>) : (helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>)}
    </react_1.FormControl>);
};
Combobox.displayName = "Combobox";
exports.default = Combobox;
