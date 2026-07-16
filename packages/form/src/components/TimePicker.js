"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var react_2 = require("react");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var TimePicker = function (_a) {
    var name = _a.name, label = _a.label, onChange = _a.onChange;
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formState.isDisabled || formState.isReadOnly;
    var _b = (0, hooks_1.useField)(name), error = _b.error, defaultValue = _b.defaultValue, validate = _b.validate, fieldIsOptional = _b.isOptional;
    var _c = (0, react_2.useState)(defaultValue ? (0, date_1.parseTime)(defaultValue) : null), time = _c[0], setDate = _c[1];
    var handleChange = function (time) {
        setDate(time);
        validate();
        onChange === null || onChange === void 0 ? void 0 : onChange(time);
    };
    return (<react_1.FormControl isInvalid={!!error}>
      {label && (<react_1.FormLabel htmlFor={name} isOptional={fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false}>
          {label}
        </react_1.FormLabel>)}
      <input type="hidden" name={name} value={time === null || time === void 0 ? void 0 : time.toString()}/>
      <react_1.TimePicker value={time !== null && time !== void 0 ? time : undefined} 
    //@ts-ignore
    onChange={handleChange} isDisabled={isDisabled}/>
      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
};
exports.default = TimePicker;
