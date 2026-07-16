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
Object.defineProperty(exports, "__esModule", { value: true });
var datepicker_1 = require("@react-aria/datepicker");
var i18n_1 = require("@react-aria/i18n");
var datepicker_2 = require("@react-stately/datepicker");
var react_1 = require("react");
var Input_1 = require("../Input");
var DateSegment_1 = require("./components/DateSegment");
var TimePicker = function (props) {
    var locale = (0, i18n_1.useLocale)().locale;
    var state = (0, datepicker_2.useTimeFieldState)(__assign(__assign({}, props), { locale: locale }));
    var ref = (0, react_1.useRef)(null);
    var fieldProps = (0, datepicker_1.useTimeField)(props, state, ref).fieldProps;
    return (<Input_1.InputGroup {...fieldProps} ref={ref} className="px-4 py-2">
      {state.segments.map(function (segment, i) { return (<DateSegment_1.DateSegment key={i} segment={segment} state={state}/>); })}
    </Input_1.InputGroup>);
};
exports.default = TimePicker;
