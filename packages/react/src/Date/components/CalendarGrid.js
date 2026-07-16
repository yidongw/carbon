"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarGrid = void 0;
var date_1 = require("@internationalized/date");
var calendar_1 = require("@react-aria/calendar");
var i18n_1 = require("@react-aria/i18n");
var CalendarCell_1 = require("./CalendarCell");
var CalendarRangeCell_1 = require("./CalendarRangeCell");
var CalendarGrid = function (_a) {
    var state = _a.state, _b = _a.offset, offset = _b === void 0 ? {} : _b, _c = _a.isRangeCalendar, isRangeCalendar = _c === void 0 ? false : _c;
    var locale = (0, i18n_1.useLocale)().locale;
    var startDate = state.visibleRange.start.add(offset);
    var endDate = (0, date_1.endOfMonth)(startDate);
    var _d = (0, calendar_1.useCalendarGrid)({
        startDate: startDate,
        endDate: endDate
    }, state), gridProps = _d.gridProps, headerProps = _d.headerProps, weekDays = _d.weekDays;
    // Get the number of weeks in the month so we can render the proper number of rows.
    var weeksInMonth = (0, date_1.getWeeksInMonth)(state.visibleRange.start, locale);
    return (<table {...gridProps} className="w-full border-collapse space-y-1" cellPadding={isRangeCalendar ? "0" : undefined}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map(function (day, index) { return (<th className="text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]" key={index}>
              {day}
            </th>); })}
        </tr>
      </thead>
      <tbody>
        {__spreadArray([], new Array(weeksInMonth).keys(), true).map(function (weekIndex) { return (<tr key={weekIndex} className="h-9">
            {state
                .getDatesInWeek(weekIndex, startDate)
                .map(function (date, i) {
                return date ? (isRangeCalendar ? (<CalendarRangeCell_1.CalendarRangeCell key={i} state={state} date={date} currentMonth={startDate} locale={locale}/>) : (<CalendarCell_1.CalendarCell key={i} state={state} date={date} currentMonth={startDate}/>)) : (<td key={i}/>);
            })}
          </tr>); })}
      </tbody>
    </table>);
};
exports.CalendarGrid = CalendarGrid;
