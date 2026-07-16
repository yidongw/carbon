"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormValues = exports.useFormSubactionProp = exports.useFormActionProp = exports.useSubmitForm = exports.useResetFormElement = exports.useSetFieldErrors = exports.useFieldErrors = exports.useTouchedFields = exports.useSetTouched = exports.useSyncedDefaultValues = exports.useRegisterReceiveFocus = exports.useValidate = exports.useSmartValidate = exports.useInternalHasBeenSubmitted = exports.useInternalIsValid = exports.useInternalIsSubmitting = exports.useFieldDefaultValue = exports.useCurrentDefaultValueForField = exports.useClearError = exports.useFieldError = exports.useFieldTouched = exports.useHasActiveFormSubmit = exports.useDefaultValuesForForm = exports.useDefaultValuesFromLoader = exports.useFieldErrorsForForm = exports.useInternalFormContext = void 0;
exports.useErrorResponseForForm = useErrorResponseForForm;
var react_1 = require("react");
var react_router_1 = require("react-router");
var tiny_invariant_1 = require("tiny-invariant");
var utils_1 = require("../utils");
var constants_1 = require("./constants");
var formContext_1 = require("./formContext");
var hydratable_1 = require("./hydratable");
var storeHooks_1 = require("./state/storeHooks");
var useInternalFormContext = function (formId, hookName) {
    var formContext = (0, react_1.useContext)(formContext_1.InternalFormContext);
    if (formId)
        return { formId: formId };
    if (formContext)
        return formContext;
    throw new Error("Unable to determine form for ".concat(hookName, ". Please use it inside a ValidatedForm or pass a 'formId'."));
};
exports.useInternalFormContext = useInternalFormContext;
function useErrorResponseForForm(_a) {
    var _b;
    var fetcher = _a.fetcher, subaction = _a.subaction, formId = _a.formId;
    var actionData = (0, react_router_1.useActionData)();
    if (fetcher) {
        if ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.fieldErrors)
            return fetcher.data;
        return null;
    }
    if (!(actionData === null || actionData === void 0 ? void 0 : actionData.fieldErrors))
        return null;
    // If there's an explicit id, we should ignore data that has the wrong id
    if (typeof formId === "string" && actionData.formId)
        return actionData.formId === formId ? actionData : null;
    if ((!subaction && !actionData.subaction) ||
        actionData.subaction === subaction)
        return actionData;
    return null;
}
var useFieldErrorsForForm = function (context) {
    var response = useErrorResponseForForm(context);
    var hydrated = (0, storeHooks_1.useFormStore)(context.formId, function (state) { return state.isHydrated; });
    return hydratable_1.hydratable.from(response === null || response === void 0 ? void 0 : response.fieldErrors, hydrated);
};
exports.useFieldErrorsForForm = useFieldErrorsForForm;
var useDefaultValuesFromLoader = function (_a) {
    var formId = _a.formId;
    var matches = (0, react_router_1.useMatches)();
    if (typeof formId === "string") {
        var dataKey_1 = (0, constants_1.formDefaultValuesKey)(formId);
        // If multiple loaders declare the same default values,
        // we should use the data from the deepest route.
        var match = matches
            .reverse()
            .find(function (match) {
            return match.data && typeof match.data === "object" && dataKey_1 in match.data;
        });
        return match === null || match === void 0 ? void 0 : match.data[dataKey_1];
    }
    return null;
};
exports.useDefaultValuesFromLoader = useDefaultValuesFromLoader;
var useDefaultValuesForForm = function (context) {
    var formId = context.formId, defaultValuesProp = context.defaultValuesProp;
    var hydrated = (0, storeHooks_1.useFormStore)(formId, function (state) { return state.isHydrated; });
    var errorResponse = useErrorResponseForForm(context);
    var defaultValuesFromLoader = (0, exports.useDefaultValuesFromLoader)(context);
    // Typical flow is:
    // - Default values only available from props or server
    //   - Props have a higher priority than server
    // - State gets hydrated with default values
    // - After submit, we may need to use values from the error
    if (hydrated)
        return hydratable_1.hydratable.hydratedData();
    if (errorResponse === null || errorResponse === void 0 ? void 0 : errorResponse.repopulateFields) {
        (0, tiny_invariant_1.default)(typeof errorResponse.repopulateFields === "object", "repopulateFields returned something other than an object");
        return hydratable_1.hydratable.serverData(errorResponse.repopulateFields);
    }
    if (defaultValuesProp)
        return hydratable_1.hydratable.serverData(defaultValuesProp);
    return hydratable_1.hydratable.serverData(defaultValuesFromLoader);
};
exports.useDefaultValuesForForm = useDefaultValuesForForm;
var useHasActiveFormSubmit = function (_a) {
    var fetcher = _a.fetcher;
    var navigation = (0, react_router_1.useNavigation)();
    var hasActiveSubmission = fetcher
        ? fetcher.state === "submitting" || fetcher.state === "loading"
        : navigation.state === "submitting" || navigation.state === "loading";
    return hasActiveSubmission;
};
exports.useHasActiveFormSubmit = useHasActiveFormSubmit;
var useFieldTouched = function (field, _a) {
    var formId = _a.formId;
    var touched = (0, storeHooks_1.useFormStore)(formId, function (state) { return state.touchedFields[field]; });
    var setFieldTouched = (0, storeHooks_1.useFormStore)(formId, function (state) { return state.setTouched; });
    var setTouched = (0, react_1.useCallback)(function (touched) { return setFieldTouched(field, touched); }, [field, setFieldTouched]);
    return [touched, setTouched];
};
exports.useFieldTouched = useFieldTouched;
var useFieldError = function (name, context) {
    var fieldErrors = (0, exports.useFieldErrorsForForm)(context);
    var state = (0, storeHooks_1.useFormStore)(context.formId, function (state) { return state.fieldErrors[name]; });
    return fieldErrors.map(function (fieldErrors) { return fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[name]; }).hydrateTo(state);
};
exports.useFieldError = useFieldError;
var useClearError = function (context) {
    var formId = context.formId;
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return state.clearFieldError; });
};
exports.useClearError = useClearError;
var useCurrentDefaultValueForField = function (formId, field) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return (0, utils_1.getPath)(state.currentDefaultValues, field); });
};
exports.useCurrentDefaultValueForField = useCurrentDefaultValueForField;
var useFieldDefaultValue = function (name, context) {
    var defaultValues = (0, exports.useDefaultValuesForForm)(context);
    var state = (0, exports.useCurrentDefaultValueForField)(context.formId, name);
    return defaultValues.map(function (val) { return (0, utils_1.getPath)(val, name); }).hydrateTo(state);
};
exports.useFieldDefaultValue = useFieldDefaultValue;
var useInternalIsSubmitting = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return state.isSubmitting; });
};
exports.useInternalIsSubmitting = useInternalIsSubmitting;
var useInternalIsValid = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return state.isValid(); });
};
exports.useInternalIsValid = useInternalIsValid;
var useInternalHasBeenSubmitted = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return state.hasBeenSubmitted; });
};
exports.useInternalHasBeenSubmitted = useInternalHasBeenSubmitted;
var useSmartValidate = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return state.smartValidate; });
};
exports.useSmartValidate = useSmartValidate;
var useValidate = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return state.validate; });
};
exports.useValidate = useValidate;
// biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
var noOpReceiver = function () { return function () { }; };
var useRegisterReceiveFocus = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { var _a, _b; return (_b = (_a = state.formProps) === null || _a === void 0 ? void 0 : _a.registerReceiveFocus) !== null && _b !== void 0 ? _b : noOpReceiver; });
};
exports.useRegisterReceiveFocus = useRegisterReceiveFocus;
var defaultDefaultValues = {};
var useSyncedDefaultValues = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { var _a, _b; return (_b = (_a = state.formProps) === null || _a === void 0 ? void 0 : _a.defaultValues) !== null && _b !== void 0 ? _b : defaultDefaultValues; });
};
exports.useSyncedDefaultValues = useSyncedDefaultValues;
var useSetTouched = function (_a) {
    var formId = _a.formId;
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return state.setTouched; });
};
exports.useSetTouched = useSetTouched;
var useTouchedFields = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return state.touchedFields; });
};
exports.useTouchedFields = useTouchedFields;
var useFieldErrors = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return state.fieldErrors; });
};
exports.useFieldErrors = useFieldErrors;
var useSetFieldErrors = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return state.setFieldErrors; });
};
exports.useSetFieldErrors = useSetFieldErrors;
var useResetFormElement = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return state.resetFormElement; });
};
exports.useResetFormElement = useResetFormElement;
var useSubmitForm = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return state.submit; });
};
exports.useSubmitForm = useSubmitForm;
var useFormActionProp = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { var _a; return (_a = state.formProps) === null || _a === void 0 ? void 0 : _a.action; });
};
exports.useFormActionProp = useFormActionProp;
var useFormSubactionProp = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { var _a; return (_a = state.formProps) === null || _a === void 0 ? void 0 : _a.subaction; });
};
exports.useFormSubactionProp = useFormSubactionProp;
var useFormValues = function (formId) {
    return (0, storeHooks_1.useFormStore)(formId, function (state) { return state.getValues; });
};
exports.useFormValues = useFormValues;
