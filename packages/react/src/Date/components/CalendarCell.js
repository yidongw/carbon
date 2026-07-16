"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarCell = void 0;
var date_1 = require("@internationalized/date");
var calendar_1 = require("@react-aria/calendar");
var clsx_1 = require("clsx");
var react_1 = require("react");
var Button_1 = require("../../Button");
var Table_1 = require("../../Table");
var CalendarCell = function (_a) {
    var state = _a.state, date = _a.date, currentMonth = _a.currentMonth;
    var ref = (0, react_1.useRef)(null);
    var _b = (0, calendar_1.useCalendarCell)({ date: date }, state, ref), cellProps = _b.cellProps, buttonProps = _b.buttonProps, isSelected = _b.isSelected, isInvalid = _b.isInvalid, isDisabled = _b.isDisabled, isUnavailable = _b.isUnavailable, isFocused = _b.isFocused, formattedDate = _b.formattedDate;
    var isOutsideMonth = !(0, date_1.isSameMonth)(currentMonth, date);
    return (<Table_1.Td {...cellProps} className="border-none text-center p-1">
      <Button_1.Button {...buttonProps} ref={ref} className={(0, clsx_1.default)("w-8 h-8 rounded-full hover:bg-muted", {
            "opacity-50 disabled:cursor-not-allowed": isDisabled,
            "bg-destructive text-destructive-foreground": isInvalid,
            "bg-muted": isFocused,
            "bg-primary text-primary-foreground hover:bg-primary": isSelected,
            "opacity-50 hover:bg-white focus:bg-white": isInvalid || isDisabled || isUnavailable,
            hidden: isOutsideMonth
        })} variant={isSelected ? "primary" : "ghost"} style={{
            opacity: isOutsideMonth
                ? 0.25
                : isInvalid || isDisabled || isUnavailable
                    ? 0.5
                    : 1
        }}>
        {formattedDate}
      </Button_1.Button>
    </Table_1.Td>);
};
exports.CalendarCell = CalendarCell;
