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
var lu_1 = require("react-icons/lu");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var fieldArray_1 = require("../internal/state/fieldArray");
var ArrayNumeric = (0, react_2.forwardRef)(function (_a, ref) {
    var name = _a.name, label = _a.label, isDisabledProp = _a.isDisabled, isReadOnlyProp = _a.isReadOnly, isRequired = _a.isRequired, defaults = _a.defaults, rest = __rest(_a, ["name", "label", "isDisabled", "isReadOnly", "isRequired", "defaults"]);
    var fieldIsOptional = (0, hooks_1.useField)(name).isOptional;
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formState.isDisabled || isDisabledProp;
    var isReadOnly = formState.isReadOnly || isReadOnlyProp;
    var listRef = (0, react_2.useRef)(null);
    var _b = (0, fieldArray_1.useFieldArray)(name), items = _b[0], _c = _b[1], push = _c.push, remove = _c.remove, error = _b[2];
    var resolvedIsOptional = isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false);
    var onAdd = function () {
        var _a, _b;
        (0, react_dom_1.flushSync)(function () {
            var _a;
            var next = (_a = defaults === null || defaults === void 0 ? void 0 : defaults[items.length]) !== null && _a !== void 0 ? _a : 0;
            push(next);
        });
        var lastInput = (_b = (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll("input[inputmode='numeric']")) === null || _b === void 0 ? void 0 : _b[items.length];
        lastInput === null || lastInput === void 0 ? void 0 : lastInput.focus();
    };
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && (<react_1.FormLabel htmlFor={"".concat(name)} isOptional={resolvedIsOptional}>
            {label}
          </react_1.FormLabel>)}
        <react_1.VStack className="mb-4" ref={listRef}>
          {items.map(function (item, index) { return (<ArrayNumericInput key={item.key} id={"".concat(name, ".").concat(index)} name={"".concat(name, ".").concat(index)} onRemove={function () {
                (0, react_dom_1.flushSync)(function () {
                    remove(index);
                });
            }} isDisabled={isDisabled} isReadOnly={isReadOnly} {...rest}/>); })}
          <react_1.Button isDisabled={isDisabled || isReadOnly} variant="secondary" leftIcon={<io_1.IoMdAdd />} onClick={onAdd}>
            Add {label !== null && label !== void 0 ? label : "Option"}
          </react_1.Button>
        </react_1.VStack>
        {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
      </react_1.FormControl>);
});
ArrayNumeric.displayName = "ArrayNumeric";
var ArrayNumericInput = function (_a) {
    var name = _a.name, onRemove = _a.onRemove, isDisabled = _a.isDisabled, isReadOnly = _a.isReadOnly, rest = __rest(_a, ["name", "onRemove", "isDisabled", "isReadOnly"]);
    var _b = (0, hooks_1.useField)(name), getInputProps = _b.getInputProps, error = _b.error;
    return (<react_1.FormControl isInvalid={!!error} isRequired>
      <react_1.HStack className="w-full content-between">
        <react_1.NumberField 
    // @ts-ignore
    {...getInputProps(__assign({ id: name }, rest))} isDisabled={isDisabled}>
          <react_1.NumberInputGroup className="relative">
            <react_1.NumberInput isReadOnly={isReadOnly}/>

            {!isReadOnly && (<react_1.NumberInputStepper>
                <react_1.NumberIncrementStepper>
                  <lu_1.LuChevronUp size="1em" strokeWidth="3"/>
                </react_1.NumberIncrementStepper>
                <react_1.NumberDecrementStepper>
                  <lu_1.LuChevronDown size="1em" strokeWidth="3"/>
                </react_1.NumberDecrementStepper>
              </react_1.NumberInputStepper>)}
          </react_1.NumberInputGroup>
        </react_1.NumberField>
        <react_1.IconButton variant="ghost" aria-label="Remove item" icon={<io_1.IoMdClose />} onClick={onRemove} isDisabled={isDisabled || isReadOnly}/>
      </react_1.HStack>

      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
};
ArrayNumericInput.displayName = "ArrayNumericInput";
exports.default = ArrayNumeric;
