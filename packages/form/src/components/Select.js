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
exports.SelectBase = void 0;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var Select = function (_a) {
    var name = _a.name, label = _a.label, helperText = _a.helperText, _b = _a.isConfigured, isConfigured = _b === void 0 ? false : _b, isOptional = _a.isOptional, isRequired = _a.isRequired, isLoading = _a.isLoading, options = _a.options, onConfigure = _a.onConfigure, props = __rest(_a, ["name", "label", "helperText", "isConfigured", "isOptional", "isRequired", "isLoading", "options", "onConfigure"]);
    var _c = (0, hooks_1.useField)(name), getInputProps = _c.getInputProps, error = _c.error, fieldIsOptional = _c.isOptional;
    var _d = (0, hooks_1.useControlField)(name), value = _d[0], setValue = _d[1];
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formState.isDisabled || props.isDisabled;
    var isReadOnly = formState.isReadOnly || props.isReadOnly;
    var resolvedIsOptional = isOptional !== null && isOptional !== void 0 ? isOptional : (isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false));
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
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired} className={props.className}>
      {label && (<react_1.FormLabel htmlFor={name} isOptional={resolvedIsOptional} isConfigured={isConfigured} onConfigure={onConfigure}>
          {label}
        </react_1.FormLabel>)}

      <input {...getInputProps({
        id: name
    })} type="hidden" name={name} id={name} value={value !== null && value !== void 0 ? value : undefined}/>
      <exports.SelectBase {...props} options={options} value={value} onChange={function (newValue) {
            setValue(newValue !== null && newValue !== void 0 ? newValue : "");
            onChange(newValue !== null && newValue !== void 0 ? newValue : "");
        }} isClearable={resolvedIsOptional && !isReadOnly} isDisabled={isDisabled} isReadOnly={isReadOnly} isLoading={isLoading} className="w-full"/>

      {error ? (<react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>) : (helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>)}
    </react_1.FormControl>);
};
Select.displayName = "Select";
var iconSizeClass = function (size) {
    return size === "lg" ? "size-5" : size === "md" ? "size-4" : "size-3.5";
};
exports.default = Select;
exports.SelectBase = (0, react_2.forwardRef)(function (_a, ref) {
    var size = _a.size, value = _a.value, options = _a.options, isClearable = _a.isClearable, isDisabled = _a.isDisabled, isLoading = _a.isLoading, isReadOnly = _a.isReadOnly, placeholder = _a.placeholder, emptyMessage = _a.emptyMessage, inline = _a.inline, onChange = _a.onChange, props = __rest(_a, ["size", "value", "options", "isClearable", "isDisabled", "isLoading", "isReadOnly", "placeholder", "emptyMessage", "inline", "onChange"]);
    var isInlinePreview = !!inline;
    var isNonInteractive = isReadOnly || isDisabled;
    return (<react_1.HStack spacing={1}>
        {isInlinePreview && value && (<span className="flex flex-grow line-clamp-1 items-center">
            {inline(value, options)}
          </span>)}

        <react_1.Select value={value} onValueChange={function (value) { return onChange(value); }} disabled={isNonInteractive}>
          <react_1.SelectTrigger ref={ref} size={size} {...props} className={(0, react_1.cn)(!isInlinePreview && "min-w-[160px] relative")} inline={isInlinePreview} disabled={isNonInteractive} hideIcon={isLoading}>
            {isInlinePreview ? (<span aria-hidden className={(0, react_1.cn)((0, react_1.buttonVariants)({
                variant: "secondary",
                size: size !== null && size !== void 0 ? size : "sm",
                isIcon: true,
                isDisabled: isNonInteractive
            }))}>
                {value ? (<lu_1.LuSettings2 className={iconSizeClass(size !== null && size !== void 0 ? size : "sm")}/>) : (<lu_1.LuPlus className={iconSizeClass(size !== null && size !== void 0 ? size : "sm")}/>)}
              </span>) : (<div>
                <react_1.SelectValue placeholder={placeholder}/>
                {isLoading && (<div className="absolute top-3 right-2">
                    <react_1.Spinner className="size-3"/>
                  </div>)}
              </div>)}
          </react_1.SelectTrigger>
          <react_1.SelectContent>
            {options.length === 0
            ? (emptyMessage !== null && emptyMessage !== void 0 ? emptyMessage : (<div className="py-6 text-center text-sm text-muted-foreground">
                    No options available
                  </div>))
            : options.map(function (option) { return (<react_1.SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </react_1.SelectItem>); })}
          </react_1.SelectContent>
        </react_1.Select>
        {isClearable && !isNonInteractive && value && (<react_1.IconButton variant="ghost" aria-label="Clear" icon={<lu_1.LuX />} onClick={function () { return onChange(""); }} size={size === "sm" ? "md" : size}/>)}
      </react_1.HStack>);
});
exports.SelectBase.displayName = "Select";
