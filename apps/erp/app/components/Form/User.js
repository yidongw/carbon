"use strict";
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
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var Selectors_1 = require("../Selectors");
var User = function (_a) {
    var name = _a.name, label = _a.label, type = _a.type, helperText = _a.helperText, props = __rest(_a, ["name", "label", "type", "helperText"]);
    var _b = (0, form_1.useField)(name), error = _b.error, defaultValue = _b.defaultValue, validate = _b.validate, fieldIsOptional = _b.isOptional;
    var _c = (0, react_2.useState)(defaultValue), selection = _c[0], setSelection = _c[1];
    var handleChange = function (items) {
        if (items.length > 0) {
            var item = items[0];
            setSelection(item.id);
        }
        else {
            setSelection("");
        }
        validate();
    };
    return (<react_1.FormControl isInvalid={!!error}>
      {label && (<react_1.FormLabel htmlFor={name} isOptional={fieldIsOptional}>
          {label}
        </react_1.FormLabel>)}
      <input type="hidden" name={name} value={selection}/>
      <Selectors_1.UserSelect {...props} type={type} usersOnly isMulti={false} value={selection} onChange={handleChange}/>
      {helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>}
      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
};
exports.default = User;
