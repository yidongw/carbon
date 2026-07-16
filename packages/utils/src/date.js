"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDateStringToIsoString = convertDateStringToIsoString;
exports.formatDate = formatDate;
exports.formatDateTime = formatDateTime;
exports.formatRelativeTime = formatRelativeTime;
exports.formatTimeAgo = formatTimeAgo;
exports.formatTimeFromNow = formatTimeFromNow;
exports.getDateNYearsAgo = getDateNYearsAgo;
var date_1 = require("@internationalized/date");
var DEFAULT_LOCALE = "en-US";
var DIVISIONS = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" }
];
var defaultFormatOptions = {
    dateStyle: "medium",
    timeZone: (0, date_1.getLocalTimeZone)()
};
// `Intl.DateTimeFormat` / `Intl.RelativeTimeFormat` constructors are
// expensive (locale data lookup + ICU init). These caches reuse the
// formatter for the default-options call sites — `formatDate(d)` in tables
// and `formatTimeAgo(t)` in feeds run thousands of times per render.
// Custom-options calls fall through to a fresh formatter to avoid hashing
// the options bag.
var defaultDateFormatters = new Map();
function getDefaultDateFormatter(locale) {
    var f = defaultDateFormatters.get(locale);
    if (f === undefined) {
        f = new Intl.DateTimeFormat(locale, defaultFormatOptions);
        defaultDateFormatters.set(locale, f);
    }
    return f;
}
var relativeFormatters = new Map();
function getRelativeFormatter(locale) {
    var f = relativeFormatters.get(locale);
    if (f === undefined) {
        f = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
        relativeFormatters.set(locale, f);
    }
    return f;
}
function convertDateStringToIsoString(dateString) {
    return new Date(dateString).toISOString();
}
function formatDate(dateString, options, locale) {
    if (!dateString)
        return "";
    var _locale = locale || DEFAULT_LOCALE;
    var formatter = options
        ? new Intl.DateTimeFormat(_locale, options)
        : getDefaultDateFormatter(_locale);
    try {
        var _dateString = (0, date_1.toZoned)((0, date_1.parseDate)(dateString), (0, date_1.getLocalTimeZone)()).toAbsoluteString();
        // @ts-expect-error
        var date = (0, date_1.parseAbsolute)(_dateString);
        return formatter.format(date.toDate());
    }
    catch (_a) {
        try {
            var date = new Date(dateString);
            return formatter.format(date);
        }
        catch (_b) {
            return dateString;
        }
    }
}
function formatDateTime(isoString, locale) {
    return formatDate(isoString, { dateStyle: "short", timeStyle: "short" }, locale);
}
function formatRelativeTime(isoString, locale) {
    if (new Date(isoString).getTime() > new Date().getTime()) {
        return formatTimeFromNow(isoString, locale);
    }
    else {
        return formatTimeAgo(isoString, locale);
    }
}
function formatTimeAgo(isoString, locale) {
    var relativeFormatter = getRelativeFormatter(locale || DEFAULT_LOCALE);
    var duration = (new Date(isoString).getTime() - Date.now()) / 1000;
    var len = DIVISIONS.length;
    for (var i = 0; i < len; i++) {
        var division = DIVISIONS[i];
        if (Math.abs(duration) < division.amount) {
            return relativeFormatter.format(Math.round(duration), division.name);
        }
        duration /= division.amount;
    }
    return "";
}
function formatTimeFromNow(isoString, locale) {
    var relativeFormatter = getRelativeFormatter(locale || DEFAULT_LOCALE);
    var duration = (Date.now() - new Date(isoString).getTime()) / 1000;
    var len = DIVISIONS.length;
    for (var i = 0; i < len; i++) {
        var division = DIVISIONS[i];
        if (Math.abs(duration) < division.amount) {
            return relativeFormatter.format(Math.round(-1 * duration), division.name);
        }
        duration /= division.amount;
    }
    return "";
}
function getDateNYearsAgo(n) {
    var date = new Date();
    date.setFullYear(date.getFullYear() - n);
    return date;
}
