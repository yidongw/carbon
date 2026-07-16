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
var date_1 = require("@internationalized/date");
var datepicker_1 = require("@react-aria/datepicker");
var i18n_1 = require("@react-aria/i18n");
var datepicker_2 = require("@react-stately/datepicker");
var react_1 = require("react");
var DateSegment_1 = require("./DateSegment");
var DateField = function (_a) {
    var size = _a.size, props = __rest(_a, ["size"]);
    var locale = (0, i18n_1.useLocale)().locale;
    var state = (0, datepicker_2.useDateFieldState)(__assign(__assign({}, props), { locale: locale, createCalendar: date_1.createCalendar }));
    var ref = (0, react_1.useRef)(null);
    var fieldProps = (0, datepicker_1.useDateField)(props, state, ref).fieldProps;
    return (<div className="flex items-center" {...fieldProps} ref={ref}>
      {state.segments.map(function (segment, i) { return (<DateSegment_1.DateSegment key={i} segment={segment} state={state} size={size}/>); })}
    </div>);
};
exports.default = DateField;
