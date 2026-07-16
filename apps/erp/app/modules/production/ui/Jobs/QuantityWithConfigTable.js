"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantityWithConfigTable = QuantityWithConfigTable;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var ItemConfigQuantityInput_1 = require("./ItemConfigQuantityInput");
/**
 * Form-connected quantity with optional config-table affordance (same layout
 * as {@link ItemConfigQuantityInput}).
 */
function QuantityWithConfigTable(_a) {
    var name = _a.name, label = _a.label, helperText = _a.helperText, isOptional = _a.isOptional, isRequired = _a.isRequired, isConfigured = _a.isConfigured, onConfigure = _a.onConfigure, value = _a.value, onChange = _a.onChange, hasConfigurationParameters = _a.hasConfigurationParameters, onOpenConfigTable = _a.onOpenConfigTable, _b = _a.configTableTotal, configTableTotal = _b === void 0 ? 0 : _b, _c = _a.minValue, minValue = _c === void 0 ? 0 : _c, maxValue = _a.maxValue, _d = _a.size, size = _d === void 0 ? "md" : _d, formatOptions = _a.formatOptions, isReadOnlyProp = _a.isReadOnly, isDisabledProp = _a.isDisabled;
    var t = (0, macro_1.useLingui)().t;
    var _e = (0, form_1.useField)(name), getInputProps = _e.getInputProps, error = _e.error, fieldIsOptional = _e.isOptional;
    var _f = (0, form_1.useControlField)(name), controlValue = _f[0], setControlValue = _f[1];
    var formState = (0, form_1.useFormStateContext)();
    var isReadOnly = formState.isReadOnly || isReadOnlyProp;
    var isDisabled = formState.isDisabled || isDisabledProp;
    (0, react_2.useEffect)(function () {
        setControlValue(value);
    }, [value, setControlValue]);
    var handleChange = function (newValue) {
        setControlValue(newValue);
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    var resolvedIsOptional = isOptional !== null && isOptional !== void 0 ? isOptional : (isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false));
    var resolvedFormat = formatOptions !== null && formatOptions !== void 0 ? formatOptions : {
        minimumFractionDigits: 0,
        maximumFractionDigits: 10
    };
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired} isDisabled={isDisabled} isReadOnly={isReadOnly}>
      {label ? (<react_1.FormLabel htmlFor={name} isOptional={resolvedIsOptional} isConfigured={isConfigured} onConfigure={onConfigure}>
          {label}
        </react_1.FormLabel>) : null}
      <ItemConfigQuantityInput_1.ItemConfigQuantityInput hideLabel id={name} numberFieldProps={getInputProps()} value={controlValue} onChange={handleChange} minValue={minValue} maxValue={maxValue} isDisabled={isDisabled} isReadOnly={isReadOnly} size={size} formatOptions={resolvedFormat} hasConfigurationParameters={hasConfigurationParameters} onOpenConfigTable={hasConfigurationParameters ? onOpenConfigTable : undefined} configTableTotal={configTableTotal} openConfigAccessibilityLabel={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Configure quantities"], ["Configure quantities"])))}/>
      {helperText ? <react_1.FormHelperText>{helperText}</react_1.FormHelperText> : null}
      {error ? <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage> : null}
    </react_1.FormControl>);
}
var templateObject_1;
