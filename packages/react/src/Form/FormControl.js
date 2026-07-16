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
exports.FormHelperText = exports.FormControl = exports.useFormControlContext = void 0;
var react_1 = require("react");
var cn_1 = require("../utils/cn");
var dom_1 = require("../utils/dom");
var react_2 = require("../utils/react");
var FormControlContext = (0, react_1.createContext)(null);
var useFormControlContext = function () {
    var ctx = (0, react_1.useContext)(FormControlContext);
    if (!ctx) {
        throw Error("useFormControlContext() must be used inside of a FormControl");
    }
    return ctx;
};
exports.useFormControlContext = useFormControlContext;
function useFormControlProvider(props) {
    var idProp = props.id, isRequired = props.isRequired, isInvalid = props.isInvalid, isDisabled = props.isDisabled, isReadOnly = props.isReadOnly, htmlProps = __rest(props, ["id", "isRequired", "isInvalid", "isDisabled", "isReadOnly"]);
    // Generate all the required ids
    var uuid = (0, react_1.useId)();
    var id = idProp || "field-".concat(uuid);
    var labelId = "".concat(id, "-label");
    var feedbackId = "".concat(id, "-feedback");
    var helpTextId = "".concat(id, "-helptext");
    /**
     * Track whether the `FormErrorMessage` has been rendered.
     * We use this to append its id the `aria-describedby` of the `input`.
     */
    var _a = (0, react_1.useState)(false), hasFeedbackText = _a[0], setHasFeedbackText = _a[1];
    /**
     * Track whether the `FormHelperText` has been rendered.
     * We use this to append its id the `aria-describedby` of the `input`.
     */
    var _b = (0, react_1.useState)(false), hasHelpText = _b[0], setHasHelpText = _b[1];
    // Track whether the form element (e.g, `input`) has focus.
    var _c = (0, react_1.useState)(false), isFocused = _c[0], setFocus = _c[1];
    var getHelpTextProps = (0, react_1.useCallback)(function (props, forwardedRef) {
        if (props === void 0) { props = {}; }
        if (forwardedRef === void 0) { forwardedRef = null; }
        return (__assign(__assign({ id: helpTextId }, props), { 
            /**
             * Notify the field context when the help text is rendered on screen,
             * so we can apply the correct `aria-describedby` to the field (e.g. input, textarea).
             */
            ref: (0, react_2.mergeRefs)(forwardedRef, function (node) {
                if (!node)
                    return;
                setHasHelpText(true);
            }) }));
    }, [helpTextId]);
    var getLabelProps = (0, react_1.useCallback)(function (props, forwardedRef) {
        if (props === void 0) { props = {}; }
        if (forwardedRef === void 0) { forwardedRef = null; }
        return (__assign(__assign({}, props), { ref: forwardedRef, "data-focus": (0, dom_1.dataAttr)(isFocused), "data-disabled": (0, dom_1.dataAttr)(isDisabled), "data-invalid": (0, dom_1.dataAttr)(isInvalid), "data-readonly": (0, dom_1.dataAttr)(isReadOnly), id: props.id !== undefined ? props.id : labelId, htmlFor: id }));
    }, [id, isDisabled, isFocused, isInvalid, isReadOnly, labelId]);
    var getErrorMessageProps = (0, react_1.useCallback)(function (props, forwardedRef) {
        if (props === void 0) { props = {}; }
        if (forwardedRef === void 0) { forwardedRef = null; }
        return (__assign(__assign({ id: feedbackId }, props), { 
            /**
             * Notify the field context when the error message is rendered on screen,
             * so we can apply the correct `aria-describedby` to the field (e.g. input, textarea).
             */
            ref: (0, react_2.mergeRefs)(forwardedRef, function (node) {
                if (!node)
                    return;
                setHasFeedbackText(true);
            }), "aria-live": "polite" }));
    }, [feedbackId]);
    var getRootProps = (0, react_1.useCallback)(function (props, forwardedRef) {
        if (props === void 0) { props = {}; }
        if (forwardedRef === void 0) { forwardedRef = null; }
        return (__assign(__assign(__assign({}, props), htmlProps), { ref: forwardedRef, role: "group", "data-focus": (0, dom_1.dataAttr)(isFocused), "data-disabled": (0, dom_1.dataAttr)(isDisabled), "data-invalid": (0, dom_1.dataAttr)(isInvalid), "data-readonly": (0, dom_1.dataAttr)(isReadOnly) }));
    }, 
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    [htmlProps, isDisabled, isFocused, isInvalid, isReadOnly]);
    return {
        isRequired: !!isRequired,
        isInvalid: !!isInvalid,
        isReadOnly: !!isReadOnly,
        isDisabled: !!isDisabled,
        isFocused: !!isFocused,
        onFocus: function () { return setFocus(true); },
        onBlur: function () { return setFocus(false); },
        hasFeedbackText: hasFeedbackText,
        setHasFeedbackText: setHasFeedbackText,
        hasHelpText: hasHelpText,
        setHasHelpText: setHasHelpText,
        id: id,
        labelId: labelId,
        feedbackId: feedbackId,
        helpTextId: helpTextId,
        htmlProps: htmlProps,
        getHelpTextProps: getHelpTextProps,
        getErrorMessageProps: getErrorMessageProps,
        getRootProps: getRootProps,
        getLabelProps: getLabelProps
    };
}
/**
 * FormControl provides context such as
 * `isInvalid`, `isDisabled`, and `isRequired` to form elements.
 *
 * This is commonly used in form elements such as `input`,
 * `select`, `textarea`, etc.
 *
 */
exports.FormControl = (0, react_1.forwardRef)(function FormControl(props, ref) {
    var _a = useFormControlProvider(props), getRootProps = _a.getRootProps, _ = _a.htmlProps, context = __rest(_a, ["getRootProps", "htmlProps"]);
    return (<FormControlContext.Provider value={context}>
        <div {...getRootProps({}, ref)} className={(0, cn_1.cn)("flex flex-col w-full gap-y-2", props.className)}/>
      </FormControlContext.Provider>);
});
exports.FormControl.displayName = "FormControl";
/**
 * FormHelperText
 *
 * Assistive component that conveys additional guidance
 * about the field, such as how it will be used and what
 * types in values should be provided.
 */
exports.FormHelperText = (0, react_1.forwardRef)(function FormHelperText(props, ref) {
    var field = (0, exports.useFormControlContext)();
    return (<div {...field === null || field === void 0 ? void 0 : field.getHelpTextProps(props, ref)} className={(0, cn_1.cn)("font-normal text-xs text-muted-foreground", props.className)}/>);
});
exports.FormHelperText.displayName = "FormHelperText";
