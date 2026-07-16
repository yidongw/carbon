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
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var Input = (0, react_2.forwardRef)(function (_a, ref) {
    var _b, _c;
    var name = _a.name, label = _a.label, isConfigured = _a.isConfigured, isOptional = _a.isOptional, isRequired = _a.isRequired, helperText = _a.helperText, characterLimit = _a.characterLimit, prefix = _a.prefix, suffix = _a.suffix, onConfigure = _a.onConfigure, maxLength = _a.maxLength, _d = _a.formatError, formatError = _d === void 0 ? function (error) { return error; } : _d, isDisabledProp = _a.isDisabled, isReadOnlyProp = _a.isReadOnly, rest = __rest(_a, ["name", "label", "isConfigured", "isOptional", "isRequired", "helperText", "characterLimit", "prefix", "suffix", "onConfigure", "maxLength", "formatError", "isDisabled", "isReadOnly"]);
    var _e = (0, hooks_1.useField)(name), getInputProps = _e.getInputProps, error = _e.error, defaultValue = _e.defaultValue, fieldIsOptional = _e.isOptional;
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formState.isDisabled || isDisabledProp;
    var isReadOnly = formState.isReadOnly || isReadOnlyProp;
    var _f = (0, react_2.useState)((_b = defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.length) !== null && _b !== void 0 ? _b : 0), characterCount = _f[0], setCharacterCount = _f[1];
    var onChange = function (e) {
        if (characterLimit)
            setCharacterCount(e.target.value.length);
    };
    var resolvedIsOptional = isOptional !== null && isOptional !== void 0 ? isOptional : (isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false));
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired} isDisabled={isDisabled} isReadOnly={isReadOnly}>
        {label ? (<react_1.FormLabel htmlFor={name} isOptional={resolvedIsOptional} isConfigured={isConfigured} onConfigure={onConfigure}>
            {label}
          </react_1.FormLabel>) : (<label htmlFor={name} className="sr-only">
            {(_c = rest.placeholder) !== null && _c !== void 0 ? _c : name}
          </label>)}
        {prefix || suffix ? (<react_1.InputGroup>
            {prefix && <react_1.InputLeftAddon children={prefix}/>}
            <react_1.Input ref={ref} {...getInputProps(__assign({ id: name }, rest))} maxLength={characterLimit !== null && characterLimit !== void 0 ? characterLimit : maxLength} {...(characterLimit ? { onChange: onChange } : {})} isDisabled={isDisabled} isReadOnly={isReadOnly}/>
            {suffix && <react_1.InputRightAddon children={suffix}/>}
          </react_1.InputGroup>) : (<react_1.Input ref={ref} {...getInputProps(__assign({ id: name }, rest))} maxLength={characterLimit !== null && characterLimit !== void 0 ? characterLimit : maxLength} {...(characterLimit ? { onChange: onChange } : {})} isDisabled={isDisabled} isReadOnly={isReadOnly}/>)}

        {characterLimit && (<react_1.FormHelperText>
            {characterCount}/{characterLimit}
          </react_1.FormHelperText>)}
        {helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>}
        {error && <react_1.FormErrorMessage>{formatError(error)}</react_1.FormErrorMessage>}
      </react_1.FormControl>);
});
Input.displayName = "Input";
exports.default = Input;
