"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var Radios = function (_a) {
    var name = _a.name, label = _a.label, options = _a.options, _b = _a.orientation, orientation = _b === void 0 ? "vertical" : _b;
    var _c = (0, hooks_1.useField)(name), getInputProps = _c.getInputProps, error = _c.error, fieldIsOptional = _c.isOptional;
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formState.isDisabled || formState.isReadOnly;
    var id = (0, react_2.useId)();
    return (<react_1.FormControl isInvalid={!!error}>
      {label && (<react_1.FormLabel htmlFor={name} isOptional={fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false}>
          {label}
        </react_1.FormLabel>)}
      <react_1.RadioGroup {...getInputProps({
        // @ts-ignore
        id: name
    })} name={name} orientation={orientation} disabled={isDisabled}>
        {options.map(function (_a) {
            var label = _a.label, value = _a.value;
            return (<div key={value} className="flex items-center space-x-2">
            <react_1.RadioGroupItem value={value} id={"".concat(id, ":").concat(value)}/>
            <label htmlFor={"".concat(id, ":").concat(value)}>{label}</label>
          </div>);
        })}
      </react_1.RadioGroup>
      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
};
exports.default = Radios;
