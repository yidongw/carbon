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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetInputProps = void 0;
var R = require("remeda");
var getCheckboxChecked_1 = require("./logic/getCheckboxChecked");
var getRadioChecked_1 = require("./logic/getRadioChecked");
var defaultValidationBehavior = {
    initial: "onBlur",
    whenTouched: "onChange",
    whenSubmitted: "onChange"
};
var createGetInputProps = function (_a) {
    var clearError = _a.clearError, validate = _a.validate, defaultValue = _a.defaultValue, touched = _a.touched, setTouched = _a.setTouched, hasBeenSubmitted = _a.hasBeenSubmitted, validationBehavior = _a.validationBehavior, name = _a.name;
    var validationBehaviors = __assign(__assign({}, defaultValidationBehavior), validationBehavior);
    return function (props) {
        if (props === void 0) { props = {}; }
        var behavior = hasBeenSubmitted
            ? validationBehaviors.whenSubmitted
            : touched
                ? validationBehaviors.whenTouched
                : validationBehaviors.initial;
        var inputProps = __assign(__assign({}, props), { onChange: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (behavior === "onChange")
                    validate();
                else
                    clearError();
                setTouched(true);
                return (_a = props === null || props === void 0 ? void 0 : props.onChange) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([props], args, false));
            }, onBlur: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (behavior === "onBlur")
                    validate();
                return (_a = props === null || props === void 0 ? void 0 : props.onBlur) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([props], args, false));
            }, name: name });
        if (props.type === "checkbox") {
            inputProps.defaultChecked = (0, getCheckboxChecked_1.getCheckboxChecked)(props.value, defaultValue);
        }
        else if (props.type === "radio") {
            inputProps.defaultChecked = (0, getRadioChecked_1.getRadioChecked)(props.value, defaultValue);
        }
        else if (props.value === undefined) {
            // We should only set the defaultValue if the input is uncontrolled.
            inputProps.defaultValue = defaultValue;
        }
        return R.omitBy(inputProps, function (value) { return value === undefined; });
    };
};
exports.createGetInputProps = createGetInputProps;
