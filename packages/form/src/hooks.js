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
exports.useUpdateControlledField = exports.useControlField = exports.useField = exports.useIsValid = exports.useIsSubmitting = void 0;
var react_1 = require("react");
var getInputProps_1 = require("./internal/getInputProps");
var hooks_1 = require("./internal/hooks");
var isFieldOptional_1 = require("./internal/isFieldOptional");
var controlledFields_1 = require("./internal/state/controlledFields");
/**
 * Returns whether or not the parent form is currently being submitted.
 * This is different from React Router's `useNavigation()` in that it
 * is aware of what form it's in and when _that_ form is being submitted.
 *
 * @param formId
 */
var useIsSubmitting = function (formId) {
    var formContext = (0, hooks_1.useInternalFormContext)(formId, "useIsSubmitting");
    return (0, hooks_1.useInternalIsSubmitting)(formContext.formId);
};
exports.useIsSubmitting = useIsSubmitting;
/**
 * Returns whether or not the current form is valid.
 *
 * @param formId the id of the form. Only necessary if being used outside a ValidatedForm.
 */
var useIsValid = function (formId) {
    var formContext = (0, hooks_1.useInternalFormContext)(formId, "useIsValid");
    return (0, hooks_1.useInternalIsValid)(formContext.formId);
};
exports.useIsValid = useIsValid;
/**
 * Provides the data and helpers necessary to set up a field.
 */
var useField = function (name, options) {
    var _a = options !== null && options !== void 0 ? options : {}, providedFormId = _a.formId, handleReceiveFocus = _a.handleReceiveFocus;
    var formContext = (0, hooks_1.useInternalFormContext)(providedFormId, "useField");
    var defaultValue = (0, hooks_1.useFieldDefaultValue)(name, formContext);
    var _b = (0, hooks_1.useFieldTouched)(name, formContext), touched = _b[0], setTouched = _b[1];
    var error = (0, hooks_1.useFieldError)(name, formContext);
    var clearError = (0, hooks_1.useClearError)(formContext);
    var hasBeenSubmitted = (0, hooks_1.useInternalHasBeenSubmitted)(formContext.formId);
    var smartValidate = (0, hooks_1.useSmartValidate)(formContext.formId);
    var registerReceiveFocus = (0, hooks_1.useRegisterReceiveFocus)(formContext.formId);
    (0, react_1.useEffect)(function () {
        if (handleReceiveFocus)
            return registerReceiveFocus(name, handleReceiveFocus);
    }, [handleReceiveFocus, name, registerReceiveFocus]);
    var optionality = (0, react_1.useMemo)(function () { return (0, isFieldOptional_1.isFieldOptional)(formContext.validatorSchema, name); }, [formContext.validatorSchema, name]);
    var field = (0, react_1.useMemo)(function () {
        var helpers = {
            error: error,
            clearError: function () { return clearError(name); },
            validate: function () { return smartValidate({ alwaysIncludeErrorsFromFields: [name] }); },
            defaultValue: defaultValue,
            touched: !!touched,
            isOptional: optionality,
            setTouched: setTouched
        };
        var getInputProps = (0, getInputProps_1.createGetInputProps)(__assign(__assign({}, helpers), { name: name, hasBeenSubmitted: hasBeenSubmitted, validationBehavior: options === null || options === void 0 ? void 0 : options.validationBehavior }));
        return __assign(__assign({}, helpers), { getInputProps: getInputProps });
    }, [
        error,
        clearError,
        defaultValue,
        touched,
        optionality,
        setTouched,
        name,
        hasBeenSubmitted,
        options === null || options === void 0 ? void 0 : options.validationBehavior,
        smartValidate
    ]);
    return field;
};
exports.useField = useField;
var useControlField = function (name, formId) {
    var context = (0, hooks_1.useInternalFormContext)(formId, "useControlField");
    var _a = (0, controlledFields_1.useControllableValue)(context, name), value = _a[0], setValue = _a[1];
    return [value, setValue];
};
exports.useControlField = useControlField;
var useUpdateControlledField = function (formId) {
    var context = (0, hooks_1.useInternalFormContext)(formId, "useControlField");
    return (0, controlledFields_1.useUpdateControllableValue)(context.formId);
};
exports.useUpdateControlledField = useUpdateControlledField;
