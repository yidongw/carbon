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
var bi_1 = require("react-icons/bi");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var Password = (0, react_2.forwardRef)(function (_a, ref) {
    var name = _a.name, label = _a.label, isRequired = _a.isRequired, rest = __rest(_a, ["name", "label", "isRequired"]);
    var _b = (0, hooks_1.useField)(name), getInputProps = _b.getInputProps, error = _b.error, fieldIsOptional = _b.isOptional;
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formState.isDisabled || rest.isDisabled;
    var isReadOnly = formState.isReadOnly || rest.isReadOnly;
    var _c = (0, react_2.useState)(false), passwordVisible = _c[0], setPasswordVisible = _c[1];
    var resolvedIsOptional = isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false);
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && (<react_1.FormLabel htmlFor={name} isOptional={resolvedIsOptional}>
            {label}
          </react_1.FormLabel>)}
        <react_1.InputGroup>
          <react_1.Input {...getInputProps(__assign({ id: name }, rest))} ref={ref} type={passwordVisible ? "text" : "password"} isDisabled={isDisabled} isReadOnly={isReadOnly}/>
          <react_1.InputRightElement className="w-[2.75rem]">
            <react_1.IconButton aria-label={passwordVisible ? "Show password" : "Hide password"} icon={passwordVisible ? <bi_1.BiShowAlt /> : <bi_1.BiHide />} variant="ghost" tabIndex={-1} onClick={function () { return setPasswordVisible(!passwordVisible); }}/>
          </react_1.InputRightElement>
        </react_1.InputGroup>
        {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
      </react_1.FormControl>);
});
Password.displayName = "Password";
exports.default = Password;
