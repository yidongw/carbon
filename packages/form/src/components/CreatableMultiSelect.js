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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var CreatableMultiSelect = (0, react_2.forwardRef)(function (_a, ref) {
    var _b;
    var name = _a.name, label = _a.label, helperText = _a.helperText, isOptional = _a.isOptional, _c = _a.options, options = _c === void 0 ? [] : _c, props = __rest(_a, ["name", "label", "helperText", "isOptional", "options"]);
    var _d = (0, hooks_1.useField)(name), error = _d.error, fieldIsOptional = _d.isOptional;
    var _e = (0, hooks_1.useControlField)(name), value = _e[0], setValue = _e[1];
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isReadOnly = formState.isReadOnly || formState.isDisabled || props.isReadOnly;
    var resolvedIsOptional = (_b = isOptional !== null && isOptional !== void 0 ? isOptional : fieldIsOptional) !== null && _b !== void 0 ? _b : false;
    (0, react_2.useEffect)(function () {
        if (props.value !== null && props.value !== undefined)
            setValue(props.value);
    }, [props.value, setValue]);
    var onChange = function (value) {
        var _a;
        setValue(value);
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, value);
    };
    var sortedOptions = (0, react_2.useMemo)(function () {
        // Split options into selected and unselected
        var selectedOptions = options.filter(function (opt) { return value === null || value === void 0 ? void 0 : value.includes(opt.value); });
        var unselectedOptions = options.filter(function (opt) { return !(value === null || value === void 0 ? void 0 : value.includes(opt.value)); });
        // Sort unselected options alphabetically by label
        var sortedUnselected = __spreadArray([], unselectedOptions, true).sort(function (a, b) {
            return a.label.localeCompare(b.label);
        });
        // Combine selected options first, followed by sorted unselected options
        return __spreadArray(__spreadArray([], selectedOptions, true), sortedUnselected, true);
    }, [options, value]);
    return (<react_1.FormControl isInvalid={!!error}>
      {label && (<react_1.FormLabel htmlFor={name} isOptional={resolvedIsOptional}>
          {label}
        </react_1.FormLabel>)}
      {(value !== null && value !== void 0 ? value : []).filter(Boolean).map(function (selection, index) { return (<input key={"".concat(name, "[").concat(index, "]")} type="hidden" name={"".concat(name, "[").concat(index, "]")} value={selection}/>); })}
      <react_1.CreatableMultiSelect ref={ref} {...props} options={sortedOptions} value={value !== null && value !== void 0 ? value : []} onChange={function (newValue) {
            setValue(newValue !== null && newValue !== void 0 ? newValue : []);
            onChange(newValue !== null && newValue !== void 0 ? newValue : []);
        }} isReadOnly={isReadOnly} label={label} className="w-full"/>

      {error ? (<react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>) : (helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>)}
    </react_1.FormControl>);
});
CreatableMultiSelect.displayName = "CreatableMultiSelect";
exports.default = CreatableMultiSelect;
