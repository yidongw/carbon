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
var utils_1 = require("@carbon/utils");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var Timezone = function (_a) {
    var name = _a.name, label = _a.label, helperText = _a.helperText, isReadOnlyProp = _a.isReadOnly, isClearable = _a.isClearable, placeholder = _a.placeholder, size = _a.size, props = __rest(_a, ["name", "label", "helperText", "isReadOnly", "isClearable", "placeholder", "size"]);
    var _b = (0, hooks_1.useField)(name), getInputProps = _b.getInputProps, error = _b.error, fieldIsOptional = _b.isOptional;
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isReadOnly = formState.isReadOnly || formState.isDisabled || isReadOnlyProp;
    var _c = (0, hooks_1.useControlField)(name), value = _c[0], setValue = _c[1];
    return (<react_1.FormControl isInvalid={!!error}>
      {label && (<react_1.FormLabel htmlFor={name} isOptional={fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false}>
          {label}
        </react_1.FormLabel>)}
      <input {...getInputProps({
        id: name
    })} type="hidden" name={name} id={name} value={value !== null && value !== void 0 ? value : undefined}/>
      <react_1.HStack spacing={1}>
        <react_1.Select value={value} onValueChange={function (value) { return setValue(value); }} disabled={isReadOnly}>
          <react_1.SelectTrigger size={size} className="min-w-[160px]">
            <react_1.SelectValue placeholder={placeholder}/>
          </react_1.SelectTrigger>
          <react_1.SelectContent>
            {utils_1.timezones.map(function (_a) {
            var label = _a.label, options = _a.options;
            return (<react_1.SelectGroup key={label}>
                <react_1.SelectLabel>{label}</react_1.SelectLabel>
                {options.map(function (option) { return (<react_1.SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </react_1.SelectItem>); })}
              </react_1.SelectGroup>);
        })}
          </react_1.SelectContent>
        </react_1.Select>
        {isClearable && !isReadOnly && value && (<react_1.IconButton variant="ghost" aria-label="Clear" icon={<lu_1.LuX />} onClick={function () { return setValue(""); }} size={size === "sm" ? "md" : size}/>)}
      </react_1.HStack>

      {error ? (<react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>) : (helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>)}
    </react_1.FormControl>);
};
Timezone.displayName = "Timezone";
exports.default = Timezone;
