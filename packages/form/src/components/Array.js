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
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var io_1 = require("react-icons/io");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var fieldArray_1 = require("../internal/state/fieldArray");
var Array = (0, react_2.forwardRef)(function (_a, ref) {
    var name = _a.name, label = _a.label, isRequired = _a.isRequired, _b = _a.addButtonLabel, addButtonLabel = _b === void 0 ? "New Option" : _b, _c = _a.removeItemAriaLabel, removeItemAriaLabel = _c === void 0 ? "Remove item" : _c, _d = _a.formatError, formatError = _d === void 0 ? function (error) { return error; } : _d, isDisabledProp = _a.isDisabled, isReadOnlyProp = _a.isReadOnly, rest = __rest(_a, ["name", "label", "isRequired", "addButtonLabel", "removeItemAriaLabel", "formatError", "isDisabled", "isReadOnly"]);
    var fieldIsOptional = (0, hooks_1.useField)(name).isOptional;
    var listRef = (0, react_2.useRef)(null);
    var _e = (0, fieldArray_1.useFieldArray)(name), items = _e[0], _f = _e[1], push = _f.push, remove = _f.remove, error = _e[2];
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formState.isDisabled || isDisabledProp;
    var isReadOnly = formState.isReadOnly || isReadOnlyProp;
    var resolvedIsOptional = isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false);
    var onAdd = function () {
        var _a, _b;
        (0, react_dom_1.flushSync)(function () {
            push("");
        });
        var lastInput = (_b = (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll("input")) === null || _b === void 0 ? void 0 : _b[items.length];
        lastInput === null || lastInput === void 0 ? void 0 : lastInput.focus();
    };
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && (<react_1.FormLabel htmlFor={"".concat(name)} isOptional={resolvedIsOptional}>
            {label}
          </react_1.FormLabel>)}
        <react_1.VStack className="mb-4" ref={listRef}>
          {items.map(function (item, index) { return (<ArrayInput key={"".concat(item, "-").concat(index)} id={"".concat(name, "[").concat(index, "]")} name={"".concat(name, "[").concat(index, "]")} ref={index === 0 ? ref : undefined} onRemove={function () { return remove(index); }} isDisabled={isDisabled} isReadOnly={isReadOnly} removeItemAriaLabel={removeItemAriaLabel} formatError={formatError} {...rest}/>); })}
          <react_1.Button variant="secondary" leftIcon={<io_1.IoMdAdd />} onClick={onAdd} isDisabled={isDisabled || isReadOnly}>
            {addButtonLabel}
          </react_1.Button>
        </react_1.VStack>
        {error && <react_1.FormErrorMessage>{formatError(error)}</react_1.FormErrorMessage>}
      </react_1.FormControl>);
});
Array.displayName = "Array";
var ArrayInput = (0, react_2.forwardRef)(function (_a, ref) {
    var name = _a.name, onRemove = _a.onRemove, removeItemAriaLabel = _a.removeItemAriaLabel, formatError = _a.formatError, isDisabled = _a.isDisabled, isReadOnly = _a.isReadOnly, rest = __rest(_a, ["name", "onRemove", "removeItemAriaLabel", "formatError", "isDisabled", "isReadOnly"]);
    var _b = (0, hooks_1.useField)(name), getInputProps = _b.getInputProps, error = _b.error;
    return (<react_1.FormControl isInvalid={!!error} isRequired>
        <react_1.HStack className="w-full content-between">
          <react_1.Input ref={ref} {...getInputProps(__assign({ id: name }, rest))} isDisabled={isDisabled} isReadOnly={isReadOnly}/>
          <react_1.IconButton variant="ghost" aria-label={removeItemAriaLabel} icon={<io_1.IoMdClose />} onClick={onRemove} isDisabled={isDisabled || isReadOnly}/>
        </react_1.HStack>

        {error && <react_1.FormErrorMessage>{formatError(error)}</react_1.FormErrorMessage>}
      </react_1.FormControl>);
});
ArrayInput.displayName = "ArrayInput";
exports.default = Array;
