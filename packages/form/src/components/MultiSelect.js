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
var MultiSelectPreview = function (value, options, maxPreview) {
    return (<div className="flex flex-wrap gap-1 items-start">
      {maxPreview && value.length > maxPreview ? (<react_1.Badge variant="secondary" className="border dark:border-none dark:shadow-button-base">
          {value.length} selected
        </react_1.Badge>) : (value.sort().map(function (val) {
            var option = options.find(function (opt) { return opt.value === val; });
            var label = option ? option.label : val;
            return (<react_1.Badge className="max-w-[160px] truncate border dark:border-none dark:shadow-button-base" key={val} variant="secondary">
              {label}
            </react_1.Badge>);
        }))}
    </div>);
};
var MultiSelect = function (_a) {
    var name = _a.name, label = _a.label, helperText = _a.helperText, maxPreview = _a.maxPreview, props = __rest(_a, ["name", "label", "helperText", "maxPreview"]);
    var _b = (0, hooks_1.useField)(name), error = _b.error, fieldIsOptional = _b.isOptional;
    var _c = (0, hooks_1.useControlField)(name), value = _c[0], setValue = _c[1];
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isReadOnly = formState.isReadOnly || formState.isDisabled || props.isReadOnly;
    (0, react_2.useEffect)(function () {
        if (props.value !== null && props.value !== undefined)
            setValue(props.value);
    }, [props.value, setValue]);
    var onChange = function (value) {
        var _a;
        (_a = props === null || props === void 0 ? void 0 : props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, props.options.filter(function (o) { return value.includes(o.value); }));
    };
    return (<react_1.FormControl isInvalid={!!error}>
      {label && (<react_1.FormLabel htmlFor={name} isOptional={fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false}>
          {label}
        </react_1.FormLabel>)}
      {(value !== null && value !== void 0 ? value : []).filter(Boolean).map(function (selection, index) { return (<input key={"".concat(name, "[").concat(index, "]")} type="hidden" name={"".concat(name, "[").concat(index, "]")} value={selection}/>); })}

      <react_1.MultiSelect {...props} value={(value !== null && value !== void 0 ? value : []).filter(Boolean)} inline={props.inline ? MultiSelectPreview : undefined} onChange={function (newValue) {
            setValue(newValue !== null && newValue !== void 0 ? newValue : []);
            onChange(newValue !== null && newValue !== void 0 ? newValue : []);
        }} isReadOnly={isReadOnly} className="w-full"/>

      {error ? (<react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>) : (helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>)}
    </react_1.FormControl>);
};
MultiSelect.displayName = "MultiSelect";
exports.default = MultiSelect;
