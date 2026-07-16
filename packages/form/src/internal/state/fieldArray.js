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
exports.useFieldArray = useFieldArray;
exports.FieldArray = FieldArray;
var nanoid_1 = require("nanoid");
var react_1 = require("react");
var tiny_invariant_1 = require("tiny-invariant");
var hooks_1 = require("../hooks");
var arrayUtil = require("./arrayUtil");
var controlledFields_1 = require("./controlledFields");
var storeHooks_1 = require("./storeHooks");
var useInternalFieldArray = function (context, field, validationBehavior) {
    var value = (0, hooks_1.useFieldDefaultValue)(field, context);
    (0, controlledFields_1.useRegisterControlledField)(context, field);
    var hasBeenSubmitted = (0, hooks_1.useInternalHasBeenSubmitted)(context.formId);
    var validateField = (0, hooks_1.useSmartValidate)(context.formId);
    var error = (0, hooks_1.useFieldError)(field, context);
    var resolvedValidationBehavior = __assign({ initial: "onSubmit", whenSubmitted: "onChange" }, validationBehavior);
    var behavior = hasBeenSubmitted
        ? resolvedValidationBehavior.whenSubmitted
        : resolvedValidationBehavior.initial;
    var maybeValidate = (0, react_1.useCallback)(function () {
        if (behavior === "onChange") {
            validateField({ alwaysIncludeErrorsFromFields: [field] });
        }
    }, [behavior, field, validateField]);
    (0, tiny_invariant_1.default)(value === undefined || value === null || Array.isArray(value), "FieldArray: defaultValue value for ".concat(field, " must be an array, null, or undefined"));
    var arr = (0, storeHooks_1.useFormStore)(context.formId, function (state) { return state.controlledFields.array; });
    var arrayValue = (0, react_1.useMemo)(function () { return value !== null && value !== void 0 ? value : []; }, [value]);
    var keyRef = (0, react_1.useRef)([]);
    // If the lengths don't match up it means one of two things
    // 1. The array has been modified outside of this hook
    // 2. We're initializing the array
    if (keyRef.current.length !== arrayValue.length) {
        keyRef.current = arrayValue.map(function () { return (0, nanoid_1.nanoid)(); });
    }
    var helpers = (0, react_1.useMemo)(function () { return ({
        push: function (item) {
            arr.push(field, item);
            keyRef.current.push((0, nanoid_1.nanoid)());
            maybeValidate();
        },
        swap: function (indexA, indexB) {
            arr.swap(field, indexA, indexB);
            arrayUtil.swap(keyRef.current, indexA, indexB);
            maybeValidate();
        },
        move: function (from, to) {
            arr.move(field, from, to);
            arrayUtil.move(keyRef.current, from, to);
            maybeValidate();
        },
        insert: function (index, value) {
            arr.insert(field, index, value);
            arrayUtil.insert(keyRef.current, index, (0, nanoid_1.nanoid)());
            maybeValidate();
        },
        unshift: function (value) {
            arr.unshift(field, value);
            keyRef.current.unshift((0, nanoid_1.nanoid)());
            maybeValidate();
        },
        remove: function (index) {
            arr.remove(field, index);
            arrayUtil.remove(keyRef.current, index);
            maybeValidate();
        },
        pop: function () {
            arr.pop(field);
            keyRef.current.pop();
            maybeValidate();
        },
        replace: function (index, value) {
            arr.replace(field, index, value);
            keyRef.current[index] = (0, nanoid_1.nanoid)();
            maybeValidate();
        }
    }); }, [arr, field, maybeValidate]);
    var valueWithKeys = (0, react_1.useMemo)(function () {
        var result = [];
        arrayValue.forEach(function (item, index) {
            result[index] = {
                key: keyRef.current[index],
                defaultValue: item
            };
        });
        return result;
    }, [arrayValue]);
    return [valueWithKeys, helpers, error];
};
function useFieldArray(name, _a) {
    var _b = _a === void 0 ? {} : _a, formId = _b.formId, validationBehavior = _b.validationBehavior;
    var context = (0, hooks_1.useInternalFormContext)(formId, "FieldArray");
    return useInternalFieldArray(context, name, validationBehavior);
}
function FieldArray(_a) {
    var name = _a.name, children = _a.children, formId = _a.formId, validationBehavior = _a.validationBehavior;
    var context = (0, hooks_1.useInternalFormContext)(formId, "FieldArray");
    var _b = useInternalFieldArray(context, name, validationBehavior), value = _b[0], helpers = _b[1], error = _b[2];
    return <>{children(value, helpers, error)}</>;
}
