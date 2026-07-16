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
var rx_1 = require("react-icons/rx");
var ReactPhoneInput = require("react-phone-number-input");
var flags_1 = require("react-phone-number-input/flags");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var PhoneInputComponent = ReactPhoneInput.default;
var PhoneInput = (0, react_2.forwardRef)(function (_a, ref) {
    var name = _a.name, label = _a.label, isRequired = _a.isRequired, className = _a.className, props = __rest(_a, ["name", "label", "isRequired", "className"]);
    var _b = (0, hooks_1.useField)(name), getInputProps = _b.getInputProps, error = _b.error, fieldIsOptional = _b.isOptional;
    var _c = (0, hooks_1.useControlField)(name), value = _c[0], setValue = _c[1];
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formState.isDisabled || formState.isReadOnly || props.disabled;
    var resolvedIsOptional = isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false);
    var onChange = function (value) {
        var _a;
        setValue(value);
        // @ts-ignore
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, value);
    };
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired}>
      {label && (<react_1.FormLabel htmlFor={name} isOptional={resolvedIsOptional}>
          {label}
        </react_1.FormLabel>)}
      <PhoneInputComponent ref={ref} className={(0, react_1.cn)("flex", className)} disabled={isDisabled} flagComponent={FlagComponent} countrySelectComponent={CountrySelect} inputComponent={InputComponent} international {...getInputProps(__assign({ id: name }, props))} value={value} 
    /**
     * Handles the onChange event.
     *
     * react-phone-number-input might trigger the onChange event as undefined
     * when a valid phone number is not entered. To prevent this,
     * the value is coerced to an empty string.
     *
     * @param {E164Number | undefined} value - The entered value
     */
    // @ts-ignore
    onChange={onChange} {...props}/>
      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
});
PhoneInput.displayName = "PhoneInput";
var InputComponent = (0, react_2.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<react_1.Input className={(0, react_1.cn)("rounded-s-none rounded-e-lg", className)} {...props} ref={ref}/>);
});
InputComponent.displayName = "InputComponent";
var CountrySelect = function (_a) {
    var disabled = _a.disabled, value = _a.value, onChange = _a.onChange, options = _a.options;
    var handleSelect = (0, react_2.useCallback)(function (country) {
        onChange(country);
    }, [onChange]);
    return (<react_1.Popover modal={true}>
      <react_1.PopoverTrigger asChild>
        <react_1.Button type="button" variant={"ghost"} className={(0, react_1.cn)("py-1 border flex gap-1 h-full rounded-e-none rounded-s-lg pr-1 pl-3")} disabled={disabled}>
          <FlagComponent country={value} countryName={value}/>
          <rx_1.RxCaretSort className={(0, react_1.cn)("h-4 w-4 opacity-50", disabled ? "hidden" : "opacity-100")}/>
        </react_1.Button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent className="p-0 w-[300px]">
        <react_1.Command>
          <react_1.CommandList>
            <react_1.CommandInput placeholder="Search country..."/>
            <react_1.CommandEmpty>No country found.</react_1.CommandEmpty>
            <react_1.CommandGroup>
              {options
            .filter(function (x) { return x.value; })
            .map(function (option) { return (<react_1.CommandItem className="gap-2" key={option.value} onSelect={function () { return handleSelect(option.value); }}>
                    <FlagComponent country={option.value} countryName={option.label}/>
                    <span className="text-sm flex-1">{option.label}</span>
                    {option.value && (<span className="text-sm text-foreground/50">
                        {"+".concat(ReactPhoneInput.getCountryCallingCode(option.value))}
                      </span>)}
                    <rx_1.RxCheck className={(0, react_1.cn)("ml-auto h-4 w-4", option.value === value ? "opacity-100" : "opacity-0")}/>
                  </react_1.CommandItem>); })}
            </react_1.CommandGroup>
          </react_1.CommandList>
        </react_1.Command>
      </react_1.PopoverContent>
    </react_1.Popover>);
};
var FlagComponent = function (_a) {
    var country = _a.country, countryName = _a.countryName;
    var Flag = flags_1.default[country];
    return (<span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
      {Flag && <Flag title={countryName}/>}
    </span>);
};
FlagComponent.displayName = "FlagComponent";
exports.default = PhoneInput;
