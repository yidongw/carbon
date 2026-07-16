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
var TextArea = (0, react_2.forwardRef)(function (_a, ref) {
    var _b;
    var name = _a.name, label = _a.label, size = _a.size, characterLimit = _a.characterLimit, isRequired = _a.isRequired, isDisabledProp = _a.isDisabled, rest = __rest(_a, ["name", "label", "size", "characterLimit", "isRequired", "isDisabled"]);
    var _c = (0, hooks_1.useField)(name), getInputProps = _c.getInputProps, error = _c.error, defaultValue = _c.defaultValue, fieldIsOptional = _c.isOptional;
    var formState = (0, formStateContext_1.useFormStateContext)();
    var disabled = formState.isDisabled || isDisabledProp || rest.disabled;
    var readOnly = formState.isReadOnly || rest.readOnly;
    var _d = (0, react_2.useState)((_b = defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.length) !== null && _b !== void 0 ? _b : 0), characterCount = _d[0], setCharacterCount = _d[1];
    var resolvedIsOptional = isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false);
    var onChange = function (e) {
        if (characterLimit)
            setCharacterCount(e.target.value.length);
    };
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && (<react_1.FormLabel htmlFor={name} isOptional={resolvedIsOptional}>
            {label}
          </react_1.FormLabel>)}
        <react_1.Textarea ref={ref} {...getInputProps(__assign({ id: name }, rest))} size={size} maxLength={characterLimit} onChange={onChange} disabled={disabled} readOnly={readOnly}/>
        {characterLimit && (<p className="text-sm text-muted-foreground">
            {characterCount} of {characterLimit}
          </p>)}
        {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
      </react_1.FormControl>);
});
TextArea.displayName = "TextArea";
exports.default = TextArea;
