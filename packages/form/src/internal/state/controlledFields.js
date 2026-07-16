"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAwaitValue = exports.useUpdateControllableValue = exports.useControllableValue = exports.useRegisterControlledField = exports.useControlledFieldValue = void 0;
var react_1 = require("react");
var hooks_1 = require("../hooks");
var storeHooks_1 = require("./storeHooks");
var useControlledFieldValue = function (context, field) {
    var value = (0, storeHooks_1.useFormStore)(context.formId, function (state) {
        return state.controlledFields.getValue(field);
    });
    var isFormHydrated = (0, storeHooks_1.useFormStore)(context.formId, function (state) { return state.isHydrated; });
    var defaultValue = (0, hooks_1.useFieldDefaultValue)(field, context);
    return isFormHydrated ? value : defaultValue;
};
exports.useControlledFieldValue = useControlledFieldValue;
var useRegisterControlledField = function (context, field) {
    var resolveUpdate = (0, storeHooks_1.useFormStore)(context.formId, function (state) { return state.controlledFields.valueUpdateResolvers[field]; });
    (0, react_1.useEffect)(function () {
        resolveUpdate === null || resolveUpdate === void 0 ? void 0 : resolveUpdate();
    }, [resolveUpdate]);
    var register = (0, storeHooks_1.useFormStore)(context.formId, function (state) { return state.controlledFields.register; });
    var unregister = (0, storeHooks_1.useFormStore)(context.formId, function (state) { return state.controlledFields.unregister; });
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        register(field);
        return function () { return unregister(field); };
    }, [context.formId, field, register, unregister]);
};
exports.useRegisterControlledField = useRegisterControlledField;
var useControllableValue = function (context, field) {
    (0, exports.useRegisterControlledField)(context, field);
    var setControlledFieldValue = (0, storeHooks_1.useFormStore)(context.formId, function (state) { return state.controlledFields.setValue; });
    var setTouched = (0, storeHooks_1.useFormStore)(context.formId, function (state) { return state.setTouched; });
    var defaultValue = (0, hooks_1.useFieldDefaultValue)(field, context);
    var setValue = (0, react_1.useCallback)(function (value) {
        setControlledFieldValue(field, value);
        if (value !== defaultValue) {
            setTouched(field, true);
        }
    }, [field, setControlledFieldValue, setTouched, defaultValue]);
    var value = (0, exports.useControlledFieldValue)(context, field);
    return [value, setValue];
};
exports.useControllableValue = useControllableValue;
var useUpdateControllableValue = function (formId) {
    var setValue = (0, storeHooks_1.useFormStore)(formId, function (state) { return state.controlledFields.setValue; });
    return (0, react_1.useCallback)(function (field, value) { return setValue(field, value); }, [setValue]);
};
exports.useUpdateControllableValue = useUpdateControllableValue;
var useAwaitValue = function (formId) {
    var awaitValue = (0, storeHooks_1.useFormStore)(formId, function (state) { return state.controlledFields.awaitValueUpdate; });
    return (0, react_1.useCallback)(function (field) { return awaitValue(field); }, [awaitValue]);
};
exports.useAwaitValue = useAwaitValue;
