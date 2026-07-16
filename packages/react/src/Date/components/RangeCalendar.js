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
exports.RangeCalendar = RangeCalendar;
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var calendar_1 = require("@react-aria/calendar");
var i18n_1 = require("@react-aria/i18n");
var calendar_2 = require("@react-stately/calendar");
var clsx_1 = require("clsx");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var Button_1 = require("./Button");
var CalendarGrid_1 = require("./CalendarGrid");
function RangeCalendar(_a) {
    var _b = _a.bordered, bordered = _b === void 0 ? false : _b, props = __rest(_a, ["bordered"]);
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var state = (0, calendar_2.useRangeCalendarState)(__assign(__assign({}, props), { visibleDuration: { months: 2 }, locale: locale, createCalendar: date_1.createCalendar }));
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        var _a;
        if (!((_a = props.value) === null || _a === void 0 ? void 0 : _a.start))
            return;
        state.setFocusedDate(props.value.start);
    }, [props.value]);
    var ref = (0, react_1.useRef)(null);
    var _c = (0, calendar_1.useRangeCalendar)(props, state, ref), calendarProps = _c.calendarProps, prevButtonProps = _c.prevButtonProps, nextButtonProps = _c.nextButtonProps;
    var startTitle = useLocalizedTitle(state.visibleRange.start, state.timeZone, locale);
    var endTitle = useLocalizedTitle(state.visibleRange.end, state.timeZone, locale);
    // Note that in some calendar systems, such as the Hebrew,
    // the number of months may differ between years.
    var numMonths = state.focusedDate.calendar.getMonthsInYear(state.focusedDate);
    var handlePrevYear = function () {
        state.setFocusedDate(state.visibleRange.start.subtract({ months: numMonths - 1 }));
    };
    var handleNextYear = function () {
        state.setFocusedDate(state.visibleRange.start.add({ years: 1 }));
    };
    return (<div {...calendarProps} ref={ref} className="flex">
      <div className={(0, clsx_1.default)("p-4 border-r border-border", {
            "rounded-md border shadow": bordered
        })}>
        <div className="flex items-center pb-4">
          <Button_1.CalendarButton onClick={handlePrevYear} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Previous Year"], ["Previous Year"])))} className="rounded-full" icon={<lu_1.LuChevronsLeft />} size="sm" variant="ghost"/>
          <Button_1.CalendarButton {...prevButtonProps} aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Previous Month"], ["Previous Month"])))} className="rounded-full" icon={<lu_1.LuChevronLeft />} size="sm" variant="ghost"/>
          <div className="font-medium text-left text-base flex-1 pl-2">
            {startTitle}
          </div>
        </div>
        <div className="flex gap-8">
          <CalendarGrid_1.CalendarGrid state={state} isRangeCalendar/>
        </div>
      </div>
      <div className={(0, clsx_1.default)("p-4 ", {
            "rounded-md border shadow": bordered
        })}>
        <div className="flex items-center pb-4">
          <div className="font-medium text-right text-base flex-1 pr-2">
            {endTitle}
          </div>
          <Button_1.CalendarButton {...nextButtonProps} aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Next Month"], ["Next Month"])))} className="rounded-full" icon={<lu_1.LuChevronRight />} size="sm" variant="ghost"/>
          <Button_1.CalendarButton onClick={handleNextYear} aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Next Year"], ["Next Year"])))} className="rounded-full" icon={<lu_1.LuChevronsRight />} size="sm" variant="ghost"/>
        </div>
        <div className="flex gap-8">
          <CalendarGrid_1.CalendarGrid state={state} offset={{ months: 1 }} isRangeCalendar/>
        </div>
      </div>
    </div>);
}
function useLocalizedTitle(date, timeZone, locale) {
    var dateFormatter = (0, react_1.useMemo)(function () {
        return new Intl.DateTimeFormat(locale, {
            month: "long",
            year: "numeric"
        });
    }, [locale]);
    return dateFormatter.format(date.toDate(timeZone));
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
