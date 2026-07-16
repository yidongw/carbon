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
exports.FieldButton = exports.CalendarButton = void 0;
var macro_1 = require("@lingui/react/macro");
var button_1 = require("@react-aria/button");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var IconButton_1 = require("../../IconButton");
var CalendarButton = function (props) {
    var ref = (0, react_1.useRef)(null);
    var buttonProps = (0, button_1.useButton)(props, ref).buttonProps;
    return (<IconButton_1.IconButton {...buttonProps} ref={ref} variant="solid" className="rounded-full" {...props}/>);
};
exports.CalendarButton = CalendarButton;
var FieldButton = function (_a) {
    var _b = _a.size, size = _b === void 0 ? "md" : _b, props = __rest(_a, ["size"]);
    var t = (0, macro_1.useLingui)().t;
    var ref = (0, react_1.useRef)(null);
    var buttonProps = (0, button_1.useButton)(props, ref).buttonProps;
    var sizeClasses = {
        sm: "h-8 w-8 px-2",
        md: "h-10 w-10 px-3",
        lg: "h-12 w-12 px-4"
    };
    return (<IconButton_1.IconButton {...buttonProps} ref={ref} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Toggle"], ["Toggle"])))} className={"flex-shrink-0 ".concat(sizeClasses[size], " rounded-l-none border border-l-0 before:rounded-l-none")} icon={<lu_1.LuCalendar />} variant="secondary" size={size}/>);
};
exports.FieldButton = FieldButton;
var templateObject_1;
