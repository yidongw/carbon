"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SeveritySelect;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
function SeveritySelect(_a) {
    var name = _a.name, label = _a.label;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, form_1.useField)(name), error = _b.error, isOptional = _b.isOptional;
    var _c = (0, form_1.useControlField)(name), value = _c[0], setValue = _c[1];
    var options = [
        {
            value: "error",
            title: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Error"], ["Error"]))),
            description: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Blocks save until resolved"], ["Blocks save until resolved"]))),
            icon: <lu_1.LuOctagonAlert />
        },
        {
            value: "warn",
            title: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Warning"], ["Warning"]))),
            description: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Allows acknowledge & continue"], ["Allows acknowledge & continue"]))),
            icon: <lu_1.LuTriangleAlert />
        }
    ];
    return (<react_1.FormControl isInvalid={!!error}>
      <react_1.FormLabel isOptional={isOptional} htmlFor={name}>
        {label !== null && label !== void 0 ? label : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Severity"], ["Severity"])))}
      </react_1.FormLabel>
      <input type="hidden" name={name} value={value !== null && value !== void 0 ? value : ""}/>
      <react_1.ChoiceCardGroup value={value !== null && value !== void 0 ? value : "error"} onChange={setValue} options={options} direction="row"/>
      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
