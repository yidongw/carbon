"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFactor = formatFactor;
exports.formatDuration = formatDuration;
exports.formatDurationHours = formatDurationHours;
exports.formatDurationMinutes = formatDurationMinutes;
exports.formatDurationMilliseconds = formatDurationMilliseconds;
exports.formatDurationInDays = formatDurationInDays;
// @ts-ignore -- type declarations only visible within this package, not cross-package consumers
var humanize_duration_1 = require("humanize-duration");
var factorAbbreviations = {
    "Total Hours": "hr",
    "Total Minutes": "min",
    "Hours/Piece": "hr/pc",
    "Hours/100 Pieces": "hr/100 pcs",
    "Hours/1000 Pieces": "hr/1000 pcs",
    "Minutes/Piece": "min/pc",
    "Minutes/100 Pieces": "min/100 pcs",
    "Minutes/1000 Pieces": "min/1000 pcs",
    "Pieces/Hour": "pcs/hr",
    "Pieces/Minute": "pcs/min",
    "Seconds/Piece": "sec/pc"
};
function formatFactor(value, unit) {
    if (value === 0)
        return "";
    return "".concat(value, " ").concat(factorAbbreviations[unit]);
}
function dateDifference(date1, date2) {
    return Math.abs(date1.getTime() - date2.getTime());
}
function formatDuration(start, end, options) {
    if (!start || !end) {
        return "–";
    }
    return formatDurationMilliseconds(dateDifference(start, end), options);
}
var aboveOneSecondUnits = ["d", "h", "m", "s"];
var belowOneSecondUnits = ["ms"];
// Single regex pass replaces the 14-step `.replace` chain in the "short"
// style branch — each prior `.replace` allocated a new intermediate
// string. Unit ordering: longer suffix first so plurals don't get
// truncated to the singular form.
var SHORT_UNIT_PATTERN = / (milliseconds?|seconds?|minutes?|hours?|days?|weeks?|months?|years?)/g;
var SHORT_UNIT_MAP = {
    millisecond: "ms",
    milliseconds: "ms",
    second: "s",
    seconds: "s",
    minute: "m",
    minutes: "m",
    hour: "h",
    hours: "h",
    day: "d",
    days: "d",
    week: "w",
    weeks: "w",
    month: "mo",
    months: "mo",
    year: "y",
    years: "y"
};
function formatDurationHours(hours, options) {
    if (hours === 0)
        return "-";
    return formatDurationMilliseconds(hours * 1000 * 60 * 60, options);
}
function formatDurationMinutes(minutes, options) {
    if (minutes === 0)
        return "";
    return formatDurationMilliseconds(minutes * 1000 * 60, options);
}
function formatDurationMilliseconds(milliseconds, options) {
    var _a;
    var duration = (0, humanize_duration_1.default)(milliseconds, {
        units: (options === null || options === void 0 ? void 0 : options.units)
            ? options.units
            : milliseconds < 1000
                ? belowOneSecondUnits
                : aboveOneSecondUnits,
        maxDecimalPoints: (_a = options === null || options === void 0 ? void 0 : options.maxDecimalPoints) !== null && _a !== void 0 ? _a : 0,
        largest: 2
    });
    if (!options) {
        return duration;
    }
    if (options.style === "short") {
        duration = duration.replace(SHORT_UNIT_PATTERN, function (match, unit) { var _a; return (_a = SHORT_UNIT_MAP[unit]) !== null && _a !== void 0 ? _a : match; });
    }
    return duration;
}
function formatDurationInDays(milliseconds) {
    var duration = (0, humanize_duration_1.default)(milliseconds, {
        maxDecimalPoints: 0,
        largest: 2,
        units: ["d"]
    });
    return duration;
}
