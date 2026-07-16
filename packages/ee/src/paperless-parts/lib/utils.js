"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePromisedDate = calculatePromisedDate;
var date_1 = require("@internationalized/date");
function calculatePromisedDate(leadTime, holidays) {
    var now = new Date();
    var cutoffHour = 10;
    var timeZone = (0, date_1.getLocalTimeZone)();
    var startDate = (0, date_1.today)(timeZone);
    if (now.getHours() >= cutoffHour) {
        startDate = startDate.add({ days: 1 });
    }
    var holidayDates = new Set(holidays.map(function (holiday) {
        var parts = holiday.date.split("-").map(Number);
        return new date_1.CalendarDate(parts[0], parts[1], parts[2]).toString();
    }));
    var businessDaysAdded = 0;
    var currentDate = startDate;
    while (businessDaysAdded < leadTime) {
        currentDate = currentDate.add({ days: 1 });
        var dayOfWeek = currentDate.toDate(timeZone).getDay();
        var isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
        var isNotHoliday = !holidayDates.has(currentDate.toString());
        if (isWeekday && isNotHoliday) {
            businessDaysAdded++;
        }
    }
    return currentDate.toDate(timeZone).toISOString();
}
