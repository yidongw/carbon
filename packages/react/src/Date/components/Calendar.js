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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = void 0;
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var calendar_1 = require("@react-aria/calendar");
var i18n_1 = require("@react-aria/i18n");
var calendar_2 = require("@react-stately/calendar");
var react_1 = require("react");
var bi_1 = require("react-icons/bi");
var Heading_1 = require("../../Heading");
var Button_1 = require("./Button");
var CalendarGrid_1 = require("./CalendarGrid");
var Calendar = function (props) {
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var state = (0, calendar_2.useCalendarState)(__assign(__assign({}, props), { locale: locale, createCalendar: date_1.createCalendar }));
    var ref = (0, react_1.useRef)(null);
    var _a = (0, calendar_1.useCalendar)(props, state), calendarProps = _a.calendarProps, prevButtonProps = _a.prevButtonProps, nextButtonProps = _a.nextButtonProps;
    var title = useLocalizedTitle(state.visibleRange.start, state.visibleRange.end, state.timeZone, locale);
    return (<div {...calendarProps} ref={ref}>
      <div className="flex items-center pb-4">
        <Button_1.CalendarButton {...prevButtonProps} icon={<bi_1.BiChevronLeft />} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Previous"], ["Previous"])))}/>

        <Heading_1.Heading as="h2" size="h3" className="flex-1 text-center">
          {title}
        </Heading_1.Heading>
        <Button_1.CalendarButton {...nextButtonProps} icon={<bi_1.BiChevronRight />} aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Next"], ["Next"])))}/>
      </div>
      <CalendarGrid_1.CalendarGrid state={state}/>
    </div>);
};
exports.Calendar = Calendar;
function useLocalizedTitle(startDate, endDate, timeZone, locale) {
    var dateFormatter = (0, react_1.useMemo)(function () {
        return new Intl.DateTimeFormat(locale, {
            month: "long",
            year: "numeric"
        });
    }, [locale]);
    return dateFormatter.format(startDate.toDate(timeZone));
}
var templateObject_1, templateObject_2;
