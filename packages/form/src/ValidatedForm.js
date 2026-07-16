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
exports.ValidatedForm = ValidatedForm;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var R = require("remeda");
var hooks_1 = require("./hooks");
var AdditionalValidators_1 = require("./internal/AdditionalValidators");
var constants_1 = require("./internal/constants");
var formContext_1 = require("./internal/formContext");
var formStateContext_1 = require("./internal/formStateContext");
var hooks_2 = require("./internal/hooks");
var MultiValueMap_1 = require("./internal/MultiValueMap");
var createFormStore_1 = require("./internal/state/createFormStore");
var storeHooks_1 = require("./internal/state/storeHooks");
var submissionCallbacks_1 = require("./internal/submissionCallbacks");
var util_1 = require("./internal/util");
var zod_1 = require("./zod");
var getDataFromForm = function (el) { return new FormData(el); };
function nonNull(value) {
    return value !== null;
}
var scrollIntoView = function (element) {
    if (!element) {
        return;
    }
    // try the container route first as scrollIntoView sometimes have side effects by moving the wrong container
    var container = element.closest(".overflow-hidden > .h-full");
    if (container) {
        // Get the position of the target relative to the container
        var offsetTop = element.offsetTop;
        // Scroll the container only
        container.scrollTo({
            top: offsetTop,
            behavior: "smooth" // use 'auto' if you don't want smooth scrolling
        });
    }
    else {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
};
var focusFirstInvalidInput = function (fieldErrors, customFocusHandlers, formElement) {
    var _a, _b;
    var namesInOrder = __spreadArray([], formElement.elements, true).map(function (el) {
        var input = el instanceof RadioNodeList ? el[0] : el;
        if (input instanceof HTMLElement && "name" in input)
            return input.name;
        return null;
    })
        .filter(nonNull)
        .filter(function (name) { return name in fieldErrors; });
    var uniqueNamesInOrder = R.uniq(namesInOrder);
    var _loop_1 = function (fieldName) {
        if (customFocusHandlers.has(fieldName)) {
            customFocusHandlers.getAll(fieldName).forEach(function (handler) {
                handler();
            });
            return "break";
        }
        var elem = formElement.elements.namedItem(fieldName);
        if (!elem)
            return "continue";
        if (elem instanceof RadioNodeList) {
            var selectedRadio = (_a = __spreadArray([], elem, true).filter(function (item) { return item instanceof HTMLInputElement; })
                .find(function (item) { return item.value === elem.value; })) !== null && _a !== void 0 ? _a : elem[0];
            if (selectedRadio && selectedRadio instanceof HTMLInputElement) {
                selectedRadio.focus();
                scrollIntoView(selectedRadio);
                return "break";
            }
        }
        if (elem instanceof HTMLElement) {
            if (elem instanceof HTMLInputElement && elem.type === "hidden") {
                scrollIntoView((_b = elem.parentElement) !== null && _b !== void 0 ? _b : undefined);
                return "continue";
            }
            elem.focus();
            scrollIntoView(elem);
            return "break";
        }
    };
    for (var _i = 0, uniqueNamesInOrder_1 = uniqueNamesInOrder; _i < uniqueNamesInOrder_1.length; _i++) {
        var fieldName = uniqueNamesInOrder_1[_i];
        var state_1 = _loop_1(fieldName);
        if (state_1 === "break")
            break;
    }
};
var useFormId = function (providedId) {
    // We can use a `Symbol` here because we only use it after hydration
    var symbolId = (0, react_2.useState)(function () { return Symbol("form-id"); })[0];
    return providedId !== null && providedId !== void 0 ? providedId : symbolId;
};
/**
 * Use a component to access the state so we don't cause
 * any extra rerenders of the whole form.
 */
var FormResetter = function (_a) {
    var resetAfterSubmit = _a.resetAfterSubmit, formRef = _a.formRef, onComplete = _a.onComplete;
    var isSubmitting = (0, hooks_1.useIsSubmitting)();
    var isValid = (0, hooks_1.useIsValid)();
    (0, submissionCallbacks_1.useSubmitComplete)(isSubmitting, function () {
        var _a;
        typeof onComplete === "function" && onComplete();
        if (isValid && resetAfterSubmit) {
            (_a = formRef.current) === null || _a === void 0 ? void 0 : _a.reset();
        }
    });
    return null;
};
function formEventProxy(event) {
    var defaultPrevented = false;
    return new Proxy(event, {
        get: function (target, prop) {
            if (prop === "preventDefault") {
                return function () {
                    defaultPrevented = true;
                };
            }
            if (prop === "defaultPrevented") {
                return defaultPrevented;
            }
            return target[prop];
        }
    });
}
/**
 * The primary form component of `remix-validated-form`.
 */
function ValidatedForm(_a) {
    var _this = this;
    var _b;
    var validator = _a.validator, onSubmit = _a.onSubmit, onAfterSubmit = _a.onAfterSubmit, onSuccess = _a.onSuccess, children = _a.children, fetcher = _a.fetcher, action = _a.action, unMemoizedDefaults = _a.defaultValues, formRefProp = _a.formRef, onReset = _a.onReset, subaction = _a.subaction, _c = _a.resetAfterSubmit, resetAfterSubmit = _c === void 0 ? false : _c, disableFocusOnError = _a.disableFocusOnError, _d = _a.isDisabled, isDisabled = _d === void 0 ? false : _d, _e = _a.isReadOnly, isReadOnly = _e === void 0 ? false : _e, method = _a.method, replace = _a.replace, id = _a.id, preventScrollReset = _a.preventScrollReset, relative = _a.relative, encType = _a.encType, rest = __rest(_a, ["validator", "onSubmit", "onAfterSubmit", "onSuccess", "children", "fetcher", "action", "defaultValues", "formRef", "onReset", "subaction", "resetAfterSubmit", "disableFocusOnError", "isDisabled", "isReadOnly", "method", "replace", "id", "preventScrollReset", "relative", "encType"]);
    var formId = useFormId(id);
    var providedDefaultValues = (0, util_1.useDeepEqualsMemo)(unMemoizedDefaults);
    var contextValue = (0, react_2.useMemo)(function () { return ({
        formId: formId,
        action: action,
        subaction: subaction,
        defaultValuesProp: providedDefaultValues,
        fetcher: fetcher,
        validatorSchema: validator
    }); }, [action, fetcher, formId, providedDefaultValues, subaction, validator]);
    var formStateValue = (0, react_2.useMemo)(function () { return ({ isDisabled: isDisabled, isReadOnly: isReadOnly }); }, [isDisabled, isReadOnly]);
    var backendError = (0, hooks_2.useErrorResponseForForm)(contextValue);
    var backendDefaultValues = (0, hooks_2.useDefaultValuesFromLoader)(contextValue);
    var hasActiveSubmission = (0, hooks_2.useHasActiveFormSubmit)(contextValue);
    var formRef = (0, react_2.useRef)(null);
    var Form = (_b = fetcher === null || fetcher === void 0 ? void 0 : fetcher.Form) !== null && _b !== void 0 ? _b : react_router_1.Form;
    var submit = (0, react_router_1.useSubmit)();
    var setFieldErrors = (0, hooks_2.useSetFieldErrors)(formId);
    var setFieldError = (0, storeHooks_1.useFormStore)(formId, function (state) { return state.setFieldError; });
    var reset = (0, storeHooks_1.useFormStore)(formId, function (state) { return state.reset; });
    var startSubmit = (0, storeHooks_1.useFormStore)(formId, function (state) { return state.startSubmit; });
    var endSubmit = (0, storeHooks_1.useFormStore)(formId, function (state) { return state.endSubmit; });
    var syncFormProps = (0, storeHooks_1.useFormStore)(formId, function (state) { return state.syncFormProps; });
    var setFormElementInState = (0, storeHooks_1.useFormStore)(formId, function (state) { return state.setFormElement; });
    var cleanupForm = (0, createFormStore_1.useRootFormStore)(function (state) { return state.cleanupForm; });
    var registerForm = (0, createFormStore_1.useRootFormStore)(function (state) { return state.registerForm; });
    var additionalValidatorsRef = (0, react_2.useRef)(new Map());
    var additionalValidatorsContextValue = (0, react_2.useMemo)(function () { return ({
        register: function (id, fn) {
            additionalValidatorsRef.current.set(id, fn);
        },
        unregister: function (id) {
            additionalValidatorsRef.current.delete(id);
        }
    }); }, []);
    var customFocusHandlers = (0, MultiValueMap_1.useMultiValueMap)();
    var registerReceiveFocus = (0, react_2.useCallback)(function (fieldName, handler) {
        customFocusHandlers().add(fieldName, handler);
        return function () {
            customFocusHandlers().remove(fieldName, handler);
        };
    }, [customFocusHandlers]);
    // TODO: all these hooks running at startup cause extra, unnecessary renders
    // There must be a nice way to avoid this.
    (0, react_1.useIsomorphicLayoutEffect)(function () {
        registerForm(formId);
        return function () { return cleanupForm(formId); };
    }, [cleanupForm, formId, registerForm]);
    (0, react_1.useIsomorphicLayoutEffect)(function () {
        var _a;
        syncFormProps({
            action: action,
            defaultValues: (_a = providedDefaultValues !== null && providedDefaultValues !== void 0 ? providedDefaultValues : backendDefaultValues) !== null && _a !== void 0 ? _a : {},
            subaction: subaction,
            registerReceiveFocus: registerReceiveFocus,
            validator: (0, zod_1.validator)(validator)
        });
    }, [
        action,
        providedDefaultValues,
        registerReceiveFocus,
        subaction,
        syncFormProps,
        backendDefaultValues,
        validator
    ]);
    (0, react_1.useIsomorphicLayoutEffect)(function () {
        setFormElementInState(formRef.current);
    }, [setFormElementInState]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a;
        setFieldErrors((_a = backendError === null || backendError === void 0 ? void 0 : backendError.fieldErrors) !== null && _a !== void 0 ? _a : {});
        if (!disableFocusOnError && (backendError === null || backendError === void 0 ? void 0 : backendError.fieldErrors)) {
            focusFirstInvalidInput(backendError.fieldErrors, customFocusHandlers(), formRef.current);
        }
    }, [
        backendError === null || backendError === void 0 ? void 0 : backendError.fieldErrors,
        customFocusHandlers,
        disableFocusOnError,
        setFieldErrors,
        setFieldError
    ]);
    (0, submissionCallbacks_1.useSubmitComplete)(hasActiveSubmission, function () {
        endSubmit();
    });
    var successSubmittedRef = (0, react_2.useRef)(false);
    (0, react_1.useIsomorphicLayoutEffect)(function () {
        if (fetcher && fetcher.state === "loading" && successSubmittedRef.current) {
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            successSubmittedRef.current = false;
        }
    }, [fetcher, fetcher === null || fetcher === void 0 ? void 0 : fetcher.state, onSuccess]);
    var handleSubmit = function (e, target, nativeEvent) { return __awaiter(_this, void 0, void 0, function () {
        var submitter, isValidSubmit, formMethod, formData, result, additionalErrors, hasAdditionalErrors, fieldErrors, eventProxy, opts, value;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    startSubmit();
                    submitter = nativeEvent.submitter;
                    isValidSubmit = (submitter === null || submitter === void 0 ? void 0 : submitter.form) === target;
                    if (!isValidSubmit) {
                        endSubmit();
                        return [2 /*return*/];
                    }
                    formMethod = (submitter === null || submitter === void 0 ? void 0 : submitter.formMethod) || method;
                    formData = getDataFromForm(target);
                    if (submitter === null || submitter === void 0 ? void 0 : submitter.name) {
                        formData.append(submitter.name, submitter.value);
                    }
                    return [4 /*yield*/, (0, zod_1.validator)(validator).validate(formData)];
                case 1:
                    result = _c.sent();
                    additionalErrors = {};
                    additionalValidatorsRef.current.forEach(function (validate) {
                        var errors = validate(formData);
                        for (var _i = 0, _a = Object.entries(errors); _i < _a.length; _i++) {
                            var _b = _a[_i], key = _b[0], value = _b[1];
                            if (value !== undefined)
                                additionalErrors[key] = value;
                        }
                    });
                    hasAdditionalErrors = Object.keys(additionalErrors).length > 0;
                    if (!(result.error || hasAdditionalErrors)) return [3 /*break*/, 2];
                    fieldErrors = __assign(__assign({}, ((_b = (_a = result.error) === null || _a === void 0 ? void 0 : _a.fieldErrors) !== null && _b !== void 0 ? _b : {})), additionalErrors);
                    setFieldErrors(fieldErrors);
                    endSubmit();
                    if (!disableFocusOnError) {
                        focusFirstInvalidInput(fieldErrors, customFocusHandlers(), formRef.current);
                    }
                    return [3 /*break*/, 5];
                case 2:
                    setFieldErrors({});
                    eventProxy = formEventProxy(e);
                    return [4 /*yield*/, (onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit(result.data, eventProxy))];
                case 3:
                    _c.sent();
                    if (eventProxy.defaultPrevented) {
                        endSubmit();
                        return [2 /*return*/];
                    }
                    opts = {
                        method: formMethod,
                        replace: replace,
                        preventScrollReset: preventScrollReset,
                        relative: relative,
                        action: action,
                        encType: encType
                    };
                    // We deviate from the React Routers code here a bit because of our async submit.
                    // In React Routers's `FormImpl`, they use `event.currentTarget` to get the form,
                    // but we already have the form in `formRef.current` so we can just use that.
                    // If we use `event.currentTarget` here, it will break because `currentTarget`
                    // will have changed since the start of the submission.
                    if (fetcher)
                        successSubmittedRef.current = true;
                    value = fetcher
                        ? fetcher.submit(formData, opts)
                        : submit(formData, opts);
                    if (!(value instanceof Promise)) return [3 /*break*/, 5];
                    return [4 /*yield*/, value];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<Form ref={(0, util_1.mergeRefs)([formRef, formRefProp])} {...rest} id={id} action={action} method={method} encType={encType} preventScrollReset={preventScrollReset} relative={relative} onSubmit={function (e) {
            e.preventDefault();
            handleSubmit(e, e.currentTarget, e.nativeEvent);
        }} onReset={function (event) {
            onReset === null || onReset === void 0 ? void 0 : onReset(event);
            if (event.defaultPrevented)
                return;
            reset();
        }}>
      <AdditionalValidators_1.AdditionalValidatorsContext.Provider value={additionalValidatorsContextValue}>
        <formContext_1.InternalFormContext.Provider value={contextValue}>
          <formStateContext_1.FormStateContext.Provider value={formStateValue}>
            <>
              <FormResetter formRef={formRef} resetAfterSubmit={resetAfterSubmit} onComplete={onAfterSubmit}/>
              {subaction && (<input type="hidden" value={subaction} name="subaction"/>)}
              {id && <input type="hidden" value={id} name={constants_1.FORM_ID_FIELD}/>}
              {children}
            </>
          </formStateContext_1.FormStateContext.Provider>
        </formContext_1.InternalFormContext.Provider>
      </AdditionalValidators_1.AdditionalValidatorsContext.Provider>
    </Form>);
}
