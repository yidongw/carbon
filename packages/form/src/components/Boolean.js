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
var Boolean = (0, react_2.forwardRef)(function (_a, ref) {
    var name = _a.name, label = _a.label, description = _a.description, helperText = _a.helperText, onChange = _a.onChange, variant = _a.variant, bordered = _a.bordered, isDisabledProp = _a.isDisabled, controlledValue = _a.value, className = _a.className, props = __rest(_a, ["name", "label", "description", "helperText", "onChange", "variant", "bordered", "isDisabled", "value", "className"]);
    var _b = (0, hooks_1.useField)(name), getInputProps = _b.getInputProps, error = _b.error, fieldIsOptional = _b.isOptional;
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formState.isDisabled || formState.isReadOnly || isDisabledProp;
    var _c = (0, hooks_1.useControlField)(name), value = _c[0], setValue = _c[1];
    (0, react_2.useEffect)(function () {
        if (controlledValue !== null && controlledValue !== undefined)
            setValue(controlledValue);
    }, [controlledValue, setValue]);
    if (bordered) {
        return (<react_1.FormControl isInvalid={!!error} className={className}>
          <react_1.HStack className="justify-between items-center gap-4 border border-border rounded-lg p-4">
            <react_1.VStack spacing={1}>
              {label && (<react_1.Label htmlFor={name} className="text-sm text-foreground cursor-pointer">
                  {label}
                </react_1.Label>)}
              {description && (<p className="text-xs text-muted-foreground">{description}</p>)}
            </react_1.VStack>
            <react_1.Switch id={name} variant={variant} {...getInputProps()} checked={value} disabled={isDisabled} onCheckedChange={function (checked) {
                setValue(checked);
                onChange === null || onChange === void 0 ? void 0 : onChange(checked);
            }} aria-label={label} {...props}/>
          </react_1.HStack>
          {error ? (<react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>) : (helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>)}
        </react_1.FormControl>);
    }
    return (<react_1.FormControl isInvalid={!!error} className={(0, react_1.cn)("pt-2", className)}>
        {label && (<react_1.FormLabel htmlFor={name} isOptional={fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false}>
            {label}
          </react_1.FormLabel>)}
        <react_1.HStack>
          <react_1.Switch variant={variant} {...getInputProps()} checked={value} disabled={isDisabled} onCheckedChange={function (checked) {
            setValue(checked);
            onChange === null || onChange === void 0 ? void 0 : onChange(checked);
        }} aria-label={label} {...props}/>
          {description && (<p className="text-muted-foreground text-sm">{description}</p>)}
        </react_1.HStack>

        {error ? (<react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>) : (helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>)}
      </react_1.FormControl>);
});
Boolean.displayName = "Boolean";
exports.default = Boolean;
