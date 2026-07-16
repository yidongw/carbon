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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormContext = void 0;
var react_1 = require("react");
var hooks_1 = require("./internal/hooks");
var formStateHooks_1 = require("./state/formStateHooks");
/**
 * Provides access to some of the internal state of the form.
 */
var useFormContext = function (formId) {
    // Try to access context so we get our error specific to this hook if it's not there
    var context = (0, hooks_1.useInternalFormContext)(formId, "useFormContext");
    var state = (0, formStateHooks_1.useFormState)(formId);
    var _a = (0, formStateHooks_1.useFormHelpers)(formId), internalClearError = _a.clearError, setTouched = _a.setTouched, validateField = _a.validateField, clearAllErrors = _a.clearAllErrors, validate = _a.validate, reset = _a.reset, submit = _a.submit, getValues = _a.getValues;
    var registerReceiveFocus = (0, hooks_1.useRegisterReceiveFocus)(context.formId);
    var clearError = (0, react_1.useCallback)(function () {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        names.forEach(function (name) {
            internalClearError(name);
        });
    }, [internalClearError]);
    return (0, react_1.useMemo)(function () { return (__assign(__assign({}, state), { setFieldTouched: setTouched, validateField: validateField, clearError: clearError, registerReceiveFocus: registerReceiveFocus, clearAllErrors: clearAllErrors, validate: validate, reset: reset, submit: submit, getValues: getValues })); }, [
        clearAllErrors,
        clearError,
        registerReceiveFocus,
        reset,
        setTouched,
        state,
        submit,
        validate,
        validateField,
        getValues
    ]);
};
exports.useFormContext = useFormContext;
