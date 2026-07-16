"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var Select = (0, react_2.forwardRef)(function (_a, ref) {
    var size = _a.size, value = _a.value, options = _a.options, isClearable = _a.isClearable, isReadOnly = _a.isReadOnly, placeholder = _a.placeholder, onChange = _a.onChange, props = __rest(_a, ["size", "value", "options", "isClearable", "isReadOnly", "placeholder", "onChange"]);
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.HStack spacing={1}>
        <react_1.Select value={value} onValueChange={function (value) { return onChange(value); }} disabled={isReadOnly}>
          <react_1.SelectTrigger ref={ref} size={size} 
    // isReadOnly={isReadOnly}
    {...props} className="min-w-[160px]">
            <react_1.SelectValue placeholder={placeholder}/>
          </react_1.SelectTrigger>
          <react_1.SelectContent>
            {options.map(function (option) { return (<react_1.SelectItem key={option.value} value={option.value}>
                {option.label}
              </react_1.SelectItem>); })}
          </react_1.SelectContent>
        </react_1.Select>
        {isClearable && !isReadOnly && value && (<react_1.IconButton variant="ghost" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Clear"], ["Clear"])))} icon={<lu_1.LuX />} onClick={function () { return onChange(""); }} size={size === "sm" ? "md" : size}/>)}
      </react_1.HStack>);
});
Select.displayName = "Select";
exports.default = Select;
var templateObject_1;
