"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormHelpers = exports.useFormState = void 0;
var react_1 = require("react");
var hooks_1 = require("../internal/hooks");
/**
 * Returns information about the form.
 *
 * @param formId the id of the form. Only necessary if being used outside a ValidatedForm.
 */
var useFormState = function (formId) {
    var formContext = (0, hooks_1.useInternalFormContext)(formId, "useFormState");
    var isSubmitting = (0, hooks_1.useInternalIsSubmitting)(formContext.formId);
    var hasBeenSubmitted = (0, hooks_1.useInternalHasBeenSubmitted)(formContext.formId);
    var touchedFields = (0, hooks_1.useTouchedFields)(formContext.formId);
    var isValid = (0, hooks_1.useInternalIsValid)(formContext.formId);
    var action = (0, hooks_1.useFormActionProp)(formContext.formId);
    var subaction = (0, hooks_1.useFormSubactionProp)(formContext.formId);
    var syncedDefaultValues = (0, hooks_1.useSyncedDefaultValues)(formContext.formId);
    var defaultValuesToUse = (0, hooks_1.useDefaultValuesForForm)(formContext);
    var hydratedDefaultValues = defaultValuesToUse.hydrateTo(syncedDefaultValues);
    var fieldErrorsFromState = (0, hooks_1.useFieldErrors)(formContext.formId);
    var fieldErrorsToUse = (0, hooks_1.useFieldErrorsForForm)(formContext);
    var hydratedFieldErrors = fieldErrorsToUse.hydrateTo(fieldErrorsFromState);
    return (0, react_1.useMemo)(function () { return ({
        action: action,
        subaction: subaction,
        defaultValues: hydratedDefaultValues,
        fieldErrors: hydratedFieldErrors !== null && hydratedFieldErrors !== void 0 ? hydratedFieldErrors : {},
        hasBeenSubmitted: hasBeenSubmitted,
        isSubmitting: isSubmitting,
        touchedFields: touchedFields,
        isValid: isValid
    }); }, [
        action,
        hasBeenSubmitted,
        hydratedDefaultValues,
        hydratedFieldErrors,
        isSubmitting,
        isValid,
        subaction,
        touchedFields
    ]);
};
exports.useFormState = useFormState;
/**
 * Returns helpers that can be used to update the form state.
 *
 * @param formId the id of the form. Only necessary if being used outside a ValidatedForm.
 */
var useFormHelpers = function (formId) {
    var formContext = (0, hooks_1.useInternalFormContext)(formId, "useFormHelpers");
    var setTouched = (0, hooks_1.useSetTouched)(formContext);
    var validateField = (0, hooks_1.useSmartValidate)(formContext.formId);
    var validate = (0, hooks_1.useValidate)(formContext.formId);
    var clearError = (0, hooks_1.useClearError)(formContext);
    var setFieldErrors = (0, hooks_1.useSetFieldErrors)(formContext.formId);
    var reset = (0, hooks_1.useResetFormElement)(formContext.formId);
    var submit = (0, hooks_1.useSubmitForm)(formContext.formId);
    var getValues = (0, hooks_1.useFormValues)(formContext.formId);
    return (0, react_1.useMemo)(function () { return ({
        setTouched: setTouched,
        validateField: function (fieldName) { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, validateField({
                            alwaysIncludeErrorsFromFields: [fieldName]
                        })];
                    case 1:
                        res = _c.sent();
                        return [2 /*return*/, (_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.fieldErrors[fieldName]) !== null && _b !== void 0 ? _b : null];
                }
            });
        }); },
        clearError: clearError,
        validate: validate,
        clearAllErrors: function () { return setFieldErrors({}); },
        reset: reset,
        submit: submit,
        getValues: getValues
    }); }, [
        clearError,
        reset,
        setFieldErrors,
        setTouched,
        submit,
        validate,
        validateField,
        getValues
    ]);
};
exports.useFormHelpers = useFormHelpers;
