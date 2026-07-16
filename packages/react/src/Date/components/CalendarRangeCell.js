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
exports.CalendarRangeCell = CalendarRangeCell;
var date_1 = require("@internationalized/date");
var calendar_1 = require("@react-aria/calendar");
var clsx_1 = require("clsx");
var react_1 = require("react");
var Button_1 = require("../../Button");
function CalendarRangeCell(_a) {
    var state = _a.state, date = _a.date, currentMonth = _a.currentMonth, props = __rest(_a, ["state", "date", "currentMonth"]);
    var ref = (0, react_1.useRef)(null);
    var _b = (0, calendar_1.useCalendarCell)({ date: date }, state, ref), cellProps = _b.cellProps, buttonProps = _b.buttonProps, isSelected = _b.isSelected, isInvalid = _b.isInvalid, isDisabled = _b.isDisabled, isUnavailable = _b.isUnavailable, isFocused = _b.isFocused, formattedDate = _b.formattedDate;
    var isOutsideMonth = !(0, date_1.isSameMonth)(currentMonth, date);
    var isToday = (0, date_1.isToday)(date, (0, date_1.getLocalTimeZone)());
    var isSelectionStart = state.highlightedRange
        ? (0, date_1.isSameDay)(date, state.highlightedRange.start)
        : isSelected;
    var isSelectionEnd = state.highlightedRange
        ? (0, date_1.isSameDay)(date, state.highlightedRange.end)
        : isSelected;
    var isRoundedLeft = isSelected && isSelectionStart;
    var isRoundedRight = isSelected && isSelectionEnd;
    return (<td className="text-center relative" {...cellProps}>
      <Button_1.Button {...buttonProps} ref={ref} size="sm" variant={isSelected ? "primary" : "ghost"} className={(0, clsx_1.default)("p-0 w-8 h-8 shadow-none font-normal hover:primary/10", {
            "bg-primary/50": isFocused,
            "bg-primary text-card hover:bg-primary": isSelected,
            "opacity-50 hover:bg-card focus:bg-card": isInvalid || isDisabled || isUnavailable,
            "hover:rounded-full": !isSelected,
            hidden: isOutsideMonth,
            "rounded-none": isSelected && !isRoundedLeft && !isRoundedRight,
            "!rounded-l-full !rounded-r-none": isRoundedLeft,
            "!rounded-r-full !rounded-l-none": isRoundedRight,
            "!rounded-full": (isFocused && !isSelected) ||
                (isSelected && isRoundedLeft && isRoundedRight)
        })}>
        {formattedDate}
      </Button_1.Button>
      {isToday && (<span className={(0, clsx_1.default)("absolute w-1 h-1 bottom-1 rounded-full left-1/2 transform -translate-x-1/2", {
                "bg-card": isSelected,
                "bg-primary ": !isSelected
            })}/>)}
    </td>);
}
