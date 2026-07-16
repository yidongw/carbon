"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var SequenceOrCustomId = (0, react_2.forwardRef)(function (_a, ref) {
    var _b, _c;
    var name = _a.name, label = _a.label, table = _a.table, isOptional = _a.isOptional, helperText = _a.helperText, placeholderProp = _a.placeholder, rest = __rest(_a, ["name", "label", "table", "isOptional", "helperText", "placeholder"]);
    var t = (0, macro_1.useLingui)().t;
    var placeholder = placeholderProp !== null && placeholderProp !== void 0 ? placeholderProp : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Next Sequence"], ["Next Sequence"])));
    var _d = (0, form_1.useField)(name), getInputProps = _d.getInputProps, error = _d.error, fieldIsOptional = _d.isOptional;
    var _e = (0, react_2.useState)(!!((_b = getInputProps()) === null || _b === void 0 ? void 0 : _b.defaultValue)), isCustom = _e[0], setIsCustom = _e[1];
    var resolvedIsOptional = (_c = isOptional !== null && isOptional !== void 0 ? isOptional : fieldIsOptional) !== null && _c !== void 0 ? _c : false;
    return (<react_1.FormControl isInvalid={!!error}>
        {label && (<react_1.FormLabel htmlFor={name} isOptional={resolvedIsOptional}>
            {label}
          </react_1.FormLabel>)}
        <div className="flex flex-grow items-start min-w-0 relative">
          {isCustom ? (<react_1.Input ref={ref} {...getInputProps(__assign({ id: name, placeholder: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Custom ", ""], ["Custom ", ""])), label) }, rest))} className="w-full"/>) : (<react_1.Button size="md" variant="outline" className="flex-grow bg-transparent text-muted-foreground justify-start pr-4 h-10 w-full hover:scale-100 focus-visible:scale-100">
              {placeholder}
            </react_1.Button>)}
          <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle"], ["Toggle"])))} className={(0, react_1.cn)("bg-card absolute right-0 top-0", "flex-shrink-0 h-10 w-10 px-3 rounded-l-none before:rounded-l-none border-none -ml-px shadow-button-base")} icon={isCustom ? <lu_1.LuToggleLeft /> : <lu_1.LuToggleRight />} variant="secondary" size="lg" onClick={function () { return setIsCustom(!isCustom); }}/>
        </div>

        {helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>}
        {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
      </react_1.FormControl>);
});
SequenceOrCustomId.displayName = "SequenceOrCustomId";
exports.default = SequenceOrCustomId;
var templateObject_1, templateObject_2, templateObject_3;
