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
var Hidden = (0, react_2.forwardRef)(function (_a, ref) {
    var name = _a.name, value = _a.value, rest = __rest(_a, ["name", "value"]);
    var _b = (0, hooks_1.useField)(name), getInputProps = _b.getInputProps, error = _b.error;
    var _c = getInputProps(__assign({ id: name }, rest)), defaultValue = _c.defaultValue, inputProps = __rest(_c, ["defaultValue"]);
    return (<react_1.FormControl isInvalid={!!error}>
        <react_1.Input ref={ref} {...inputProps} {...(value !== undefined ? { value: value } : { defaultValue: defaultValue })} type="hidden"/>
        {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
      </react_1.FormControl>);
});
Hidden.displayName = "Hidden";
exports.default = Hidden;
