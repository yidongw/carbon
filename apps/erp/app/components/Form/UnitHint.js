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
exports.getUnitHint = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var components_1 = require("~/components");
var getUnitHint = function (u) {
    return ["Total Minutes", "Total Hours"].includes(u !== null && u !== void 0 ? u : "") ? "Fixed" : "Per Unit";
};
exports.getUnitHint = getUnitHint;
var UnitHint = function (_a) {
    var _b;
    var defaultUnit = _a.defaultUnit, name = _a.name, label = _a.label, helperText = _a.helperText, isOptional = _a.isOptional, isConfigured = _a.isConfigured, _c = _a.value, value = _c === void 0 ? (0, exports.getUnitHint)(defaultUnit) : _c, onConfigure = _a.onConfigure, props = __rest(_a, ["defaultUnit", "name", "label", "helperText", "isOptional", "isConfigured", "value", "onConfigure"]);
    var t = (0, macro_1.useLingui)().t;
    var fieldIsOptional = (0, form_1.useField)(name).isOptional;
    var resolvedIsOptional = (_b = isOptional !== null && isOptional !== void 0 ? isOptional : fieldIsOptional) !== null && _b !== void 0 ? _b : false;
    var onChange = function (value) {
        var _a;
        (_a = props === null || props === void 0 ? void 0 : props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, value);
    };
    var translateUnitHint = function (v) {
        return v === "Fixed" ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Fixed"], ["Fixed"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Per Unit"], ["Per Unit"])));
    };
    return (<react_1.FormControl className={props.className}>
      {label && (<react_1.FormLabel htmlFor={name} isConfigured={isConfigured} isOptional={resolvedIsOptional} onConfigure={onConfigure}>
          {label}
        </react_1.FormLabel>)}

      <components_1.Select {...props} value={value} onChange={onChange} className="w-full" options={["Fixed", "Per Unit"].map(function (u) { return ({
            value: u,
            label: translateUnitHint(u)
        }); })}/>

      {helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>}
    </react_1.FormControl>);
};
UnitHint.displayName = "UnitHint";
exports.default = UnitHint;
var templateObject_1, templateObject_2;
