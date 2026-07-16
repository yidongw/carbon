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
exports.useRootFormStore = void 0;
var tiny_invariant_1 = require("tiny-invariant");
var zustand_1 = require("zustand");
var immer_1 = require("zustand/middleware/immer");
var utils_1 = require("../../utils");
var requestSubmit_1 = require("../logic/requestSubmit");
var arrayUtil = require("./arrayUtil");
// biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
var noOp = function () { };
var defaultFormState = {
    isHydrated: false,
    isSubmitting: false,
    hasBeenSubmitted: false,
    touchedFields: {},
    fieldErrors: {},
    formElement: null,
    isValid: function () { return true; },
    startSubmit: noOp,
    endSubmit: noOp,
    setTouched: noOp,
    setFieldError: noOp,
    setFieldErrors: noOp,
    clearFieldError: noOp,
    currentDefaultValues: {},
    reset: function () { return noOp; },
    syncFormProps: noOp,
    setFormElement: noOp,
    validate: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error("Validate called before form was initialized.");
        });
    }); },
    smartValidate: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error("Validate called before form was initialized.");
        });
    }); },
    submit: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error("Submit called before form was initialized.");
        });
    }); },
    resetFormElement: noOp,
    getValues: function () { return new FormData(); },
    controlledFields: {
        values: {},
        refCounts: {},
        valueUpdatePromises: {},
        valueUpdateResolvers: {},
        register: noOp,
        unregister: noOp,
        setValue: noOp,
        getValue: noOp,
        kickoffValueUpdate: noOp,
        awaitValueUpdate: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("AwaitValueUpdate called before form was initialized.");
            });
        }); },
        array: {
            push: noOp,
            swap: noOp,
            move: noOp,
            insert: noOp,
            unshift: noOp,
            remove: noOp,
            pop: noOp,
            replace: noOp
        }
    }
};
var createFormState = function (set, get) { return ({
    // It's not "hydrated" until the form props are synced
    isHydrated: false,
    isSubmitting: false,
    hasBeenSubmitted: false,
    touchedFields: {},
    fieldErrors: {},
    formElement: null,
    currentDefaultValues: {},
    isValid: function () { return Object.keys(get().fieldErrors).length === 0; },
    startSubmit: function () {
        return set(function (state) {
            state.isSubmitting = true;
            state.hasBeenSubmitted = true;
        });
    },
    endSubmit: function () {
        return set(function (state) {
            state.isSubmitting = false;
            state.touchedFields = {};
        });
    },
    setTouched: function (fieldName, touched) {
        return set(function (state) {
            state.touchedFields[fieldName] = touched;
        });
    },
    setFieldError: function (fieldName, error) {
        return set(function (state) {
            state.fieldErrors[fieldName] = error;
        });
    },
    setFieldErrors: function (errors) {
        return set(function (state) {
            state.fieldErrors = errors;
        });
    },
    clearFieldError: function (fieldName) {
        return set(function (state) {
            delete state.fieldErrors[fieldName];
        });
    },
    reset: function () {
        return set(function (state) {
            var _a, _b;
            state.fieldErrors = {};
            state.touchedFields = {};
            state.hasBeenSubmitted = false;
            var nextDefaults = (_b = (_a = state.formProps) === null || _a === void 0 ? void 0 : _a.defaultValues) !== null && _b !== void 0 ? _b : {};
            state.controlledFields.values = nextDefaults;
            state.currentDefaultValues = nextDefaults;
        });
    },
    syncFormProps: function (props) {
        return set(function (state) {
            if (!state.isHydrated) {
                state.controlledFields.values = props.defaultValues;
                state.currentDefaultValues = props.defaultValues;
            }
            state.formProps = props;
            state.isHydrated = true;
        });
    },
    setFormElement: function (formElement) {
        // This gets called frequently, so we want to avoid calling set() every time
        // Or else we wind up with an infinite loop
        if (get().formElement === formElement)
            return;
        set(function (state) {
            // weird type issue here
            // seems to be because formElement is a writable draft
            state.formElement = formElement;
        });
    },
    validate: function () { return __awaiter(void 0, void 0, void 0, function () {
        var formElement, validator, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    formElement = get().formElement;
                    (0, tiny_invariant_1.default)(formElement, "Cannot find reference to form. This is probably a bug in remix-validated-form.");
                    validator = (_a = get().formProps) === null || _a === void 0 ? void 0 : _a.validator;
                    (0, tiny_invariant_1.default)(validator, "Cannot find validator. This is probably a bug in remix-validated-form.");
                    return [4 /*yield*/, validator.validate(new FormData(formElement))];
                case 1:
                    result = _b.sent();
                    if (result.error)
                        get().setFieldErrors(result.error.fieldErrors);
                    return [2 /*return*/, result];
            }
        });
    }); },
    smartValidate: function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (_a) {
            var formElement, validator, validationResult, hadErrors, fieldErrors, errorFields, incomingErrors, prevErrors, fieldsToUpdate, fieldsToDelete;
            var _b;
            var _c = _a === void 0 ? {} : _a, _d = _c.alwaysIncludeErrorsFromFields, alwaysIncludeErrorsFromFields = _d === void 0 ? [] : _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        formElement = get().formElement;
                        (0, tiny_invariant_1.default)(formElement, "Cannot find reference to form. This is probably a bug in remix-validated-form.");
                        validator = (_b = get().formProps) === null || _b === void 0 ? void 0 : _b.validator;
                        (0, tiny_invariant_1.default)(validator, "Cannot find validator. This is probably a bug in remix-validated-form.");
                        return [4 /*yield*/, Promise.all(alwaysIncludeErrorsFromFields.map(function (field) { var _a, _b; return (_b = (_a = get().controlledFields).awaitValueUpdate) === null || _b === void 0 ? void 0 : _b.call(_a, field); }))];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, validator.validate(new FormData(formElement))];
                    case 2:
                        validationResult = _e.sent();
                        if (!validationResult.error) {
                            hadErrors = Object.keys(get().fieldErrors).length > 0;
                            if (hadErrors)
                                get().setFieldErrors({});
                            return [2 /*return*/, validationResult];
                        }
                        fieldErrors = validationResult.error.fieldErrors;
                        errorFields = new Set();
                        incomingErrors = new Set();
                        prevErrors = new Set();
                        Object.keys(fieldErrors).forEach(function (field) {
                            errorFields.add(field);
                            incomingErrors.add(field);
                        });
                        Object.keys(get().fieldErrors).forEach(function (field) {
                            errorFields.add(field);
                            prevErrors.add(field);
                        });
                        fieldsToUpdate = new Set();
                        fieldsToDelete = new Set();
                        errorFields.forEach(function (field) {
                            // If an error has been cleared, remove it.
                            if (!incomingErrors.has(field)) {
                                fieldsToDelete.add(field);
                                return;
                            }
                            // If an error has changed, we should update it.
                            if (prevErrors.has(field) && incomingErrors.has(field)) {
                                // Only update if the error has changed to avoid unnecessary rerenders
                                if (fieldErrors[field] !== get().fieldErrors[field])
                                    fieldsToUpdate.add(field);
                                return;
                            }
                            // If the error is always included, then we should update it.
                            if (alwaysIncludeErrorsFromFields.includes(field)) {
                                fieldsToUpdate.add(field);
                                return;
                            }
                            // If the error is new, then only update if the field has been touched
                            // or if the form has been submitted
                            if (!prevErrors.has(field)) {
                                var fieldTouched = get().touchedFields[field];
                                var formHasBeenSubmitted = get().hasBeenSubmitted;
                                if (fieldTouched || formHasBeenSubmitted)
                                    fieldsToUpdate.add(field);
                                return;
                            }
                        });
                        if (fieldsToDelete.size === 0 && fieldsToUpdate.size === 0) {
                            return [2 /*return*/, __assign(__assign({}, validationResult), { error: { fieldErrors: get().fieldErrors } })];
                        }
                        set(function (state) {
                            fieldsToDelete.forEach(function (field) {
                                delete state.fieldErrors[field];
                            });
                            fieldsToUpdate.forEach(function (field) {
                                state.fieldErrors[field] = fieldErrors[field];
                            });
                        });
                        return [2 /*return*/, __assign(__assign({}, validationResult), { error: { fieldErrors: get().fieldErrors } })];
                }
            });
        });
    },
    submit: function () {
        var formElement = get().formElement;
        (0, tiny_invariant_1.default)(formElement, "Cannot find reference to form. This is probably a bug in remix-validated-form.");
        (0, requestSubmit_1.requestSubmit)(formElement);
    },
    getValues: function () { var _a; return new FormData((_a = get().formElement) !== null && _a !== void 0 ? _a : undefined); },
    resetFormElement: function () { var _a; return (_a = get().formElement) === null || _a === void 0 ? void 0 : _a.reset(); },
    controlledFields: {
        values: {},
        refCounts: {},
        valueUpdatePromises: {},
        valueUpdateResolvers: {},
        register: function (fieldName) {
            set(function (state) {
                var _a;
                var current = (_a = state.controlledFields.refCounts[fieldName]) !== null && _a !== void 0 ? _a : 0;
                state.controlledFields.refCounts[fieldName] = current + 1;
            });
        },
        unregister: function (fieldName) {
            // For this helper in particular, we may run into a case where state is undefined.
            // When the whole form unmounts, the form state may be cleaned up before the fields are.
            if (get() === null || get() === undefined)
                return;
            set(function (state) {
                var _a, _b, _c;
                var current = (_a = state.controlledFields.refCounts[fieldName]) !== null && _a !== void 0 ? _a : 0;
                if (current > 1) {
                    state.controlledFields.refCounts[fieldName] = current - 1;
                    return;
                }
                var isNested = Object.keys(state.controlledFields.refCounts).some(function (key) { return fieldName.startsWith(key) && key !== fieldName; });
                // When nested within a field array, we should leave resetting up to the field array
                if (!isNested) {
                    (0, utils_1.setPath)(state.controlledFields.values, fieldName, (0, utils_1.getPath)((_b = state.formProps) === null || _b === void 0 ? void 0 : _b.defaultValues, fieldName));
                    (0, utils_1.setPath)(state.currentDefaultValues, fieldName, (0, utils_1.getPath)((_c = state.formProps) === null || _c === void 0 ? void 0 : _c.defaultValues, fieldName));
                }
                delete state.controlledFields.refCounts[fieldName];
            });
        },
        getValue: function (fieldName) { return (0, utils_1.getPath)(get().controlledFields.values, fieldName); },
        setValue: function (fieldName, value) {
            set(function (state) {
                (0, utils_1.setPath)(state.controlledFields.values, fieldName, value);
            });
            get().controlledFields.kickoffValueUpdate(fieldName);
        },
        kickoffValueUpdate: function (fieldName) {
            var clear = function () {
                return set(function (state) {
                    delete state.controlledFields.valueUpdateResolvers[fieldName];
                    delete state.controlledFields.valueUpdatePromises[fieldName];
                });
            };
            set(function (state) {
                var promise = new Promise(function (resolve) {
                    state.controlledFields.valueUpdateResolvers[fieldName] = resolve;
                }).then(clear);
                state.controlledFields.valueUpdatePromises[fieldName] = promise;
            });
        },
        awaitValueUpdate: function (fieldName) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, get().controlledFields.valueUpdatePromises[fieldName]];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        array: {
            push: function (fieldName, item) {
                set(function (state) {
                    arrayUtil
                        .getArray(state.controlledFields.values, fieldName)
                        .push(item);
                    arrayUtil.getArray(state.currentDefaultValues, fieldName).push(item);
                    // New item added to the end, no need to update touched or error
                });
                get().controlledFields.kickoffValueUpdate(fieldName);
            },
            swap: function (fieldName, indexA, indexB) {
                set(function (state) {
                    arrayUtil.swap(arrayUtil.getArray(state.controlledFields.values, fieldName), indexA, indexB);
                    arrayUtil.swap(arrayUtil.getArray(state.currentDefaultValues, fieldName), indexA, indexB);
                    arrayUtil.mutateAsArray(fieldName, state.touchedFields, function (array) {
                        return arrayUtil.swap(array, indexA, indexB);
                    });
                    arrayUtil.mutateAsArray(fieldName, state.fieldErrors, function (array) {
                        return arrayUtil.swap(array, indexA, indexB);
                    });
                });
                get().controlledFields.kickoffValueUpdate(fieldName);
            },
            move: function (fieldName, from, to) {
                set(function (state) {
                    arrayUtil.move(arrayUtil.getArray(state.controlledFields.values, fieldName), from, to);
                    arrayUtil.move(arrayUtil.getArray(state.currentDefaultValues, fieldName), from, to);
                    arrayUtil.mutateAsArray(fieldName, state.touchedFields, function (array) {
                        return arrayUtil.move(array, from, to);
                    });
                    arrayUtil.mutateAsArray(fieldName, state.fieldErrors, function (array) {
                        return arrayUtil.move(array, from, to);
                    });
                });
                get().controlledFields.kickoffValueUpdate(fieldName);
            },
            insert: function (fieldName, index, item) {
                set(function (state) {
                    arrayUtil.insert(arrayUtil.getArray(state.controlledFields.values, fieldName), index, item);
                    arrayUtil.insert(arrayUtil.getArray(state.currentDefaultValues, fieldName), index, item);
                    // Even though this is a new item, we need to push around other items.
                    arrayUtil.mutateAsArray(fieldName, state.touchedFields, function (array) {
                        return arrayUtil.insertEmpty(array, index);
                    });
                    arrayUtil.mutateAsArray(fieldName, state.fieldErrors, function (array) {
                        return arrayUtil.insertEmpty(array, index);
                    });
                });
                get().controlledFields.kickoffValueUpdate(fieldName);
            },
            remove: function (fieldName, index) {
                set(function (state) {
                    arrayUtil.remove(arrayUtil.getArray(state.controlledFields.values, fieldName), index);
                    arrayUtil.remove(arrayUtil.getArray(state.currentDefaultValues, fieldName), index);
                    arrayUtil.mutateAsArray(fieldName, state.touchedFields, function (array) {
                        return arrayUtil.remove(array, index);
                    });
                    arrayUtil.mutateAsArray(fieldName, state.fieldErrors, function (array) {
                        return arrayUtil.remove(array, index);
                    });
                });
                get().controlledFields.kickoffValueUpdate(fieldName);
            },
            pop: function (fieldName) {
                set(function (state) {
                    arrayUtil.getArray(state.controlledFields.values, fieldName).pop();
                    arrayUtil.getArray(state.currentDefaultValues, fieldName).pop();
                    arrayUtil.mutateAsArray(fieldName, state.touchedFields, function (array) {
                        return array.pop();
                    });
                    arrayUtil.mutateAsArray(fieldName, state.fieldErrors, function (array) {
                        return array.pop();
                    });
                });
                get().controlledFields.kickoffValueUpdate(fieldName);
            },
            unshift: function (fieldName, value) {
                set(function (state) {
                    arrayUtil
                        .getArray(state.controlledFields.values, fieldName)
                        .unshift(value);
                    arrayUtil
                        .getArray(state.currentDefaultValues, fieldName)
                        .unshift(value);
                    arrayUtil.mutateAsArray(fieldName, state.touchedFields, function (array) {
                        return arrayUtil.insertEmpty(array, 0);
                    });
                    arrayUtil.mutateAsArray(fieldName, state.fieldErrors, function (array) {
                        return arrayUtil.insertEmpty(array, 0);
                    });
                });
            },
            replace: function (fieldName, index, item) {
                set(function (state) {
                    arrayUtil.replace(arrayUtil.getArray(state.controlledFields.values, fieldName), index, item);
                    arrayUtil.replace(arrayUtil.getArray(state.currentDefaultValues, fieldName), index, item);
                    arrayUtil.mutateAsArray(fieldName, state.touchedFields, function (array) {
                        return arrayUtil.replace(array, index, item);
                    });
                    arrayUtil.mutateAsArray(fieldName, state.fieldErrors, function (array) {
                        return arrayUtil.replace(array, index, item);
                    });
                });
                get().controlledFields.kickoffValueUpdate(fieldName);
            }
        }
    }
}); };
exports.useRootFormStore = (0, zustand_1.create)()((0, immer_1.immer)(function (set, get) { return ({
    forms: {},
    form: function (formId) {
        var _a;
        return (_a = get().forms[formId]) !== null && _a !== void 0 ? _a : defaultFormState;
    },
    cleanupForm: function (formId) {
        set(function (state) {
            delete state.forms[formId];
        });
    },
    registerForm: function (formId) {
        if (get().forms[formId])
            return;
        set(function (state) {
            state.forms[formId] = createFormState(function (setter) { return set(function (state) { return setter(state.forms[formId]); }); }, function () { return get().forms[formId]; });
        });
    }
}); }));
