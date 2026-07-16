"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDateFormatter = useDateFormatter;
var utils_1 = require("@carbon/utils");
var i18n_1 = require("@react-aria/i18n");
var react_1 = require("react");
function useDateFormatter() {
    var locale = (0, i18n_1.useLocale)().locale;
    return {
        formatDate: (0, react_1.useCallback)(function (dateString, options) {
            return (0, utils_1.formatDate)(dateString, options, locale);
        }, [locale]),
        formatDateTime: (0, react_1.useCallback)(function (isoString) { return (0, utils_1.formatDateTime)(isoString, locale); }, [locale]),
        formatRelativeTime: (0, react_1.useCallback)(function (isoString) { return (0, utils_1.formatRelativeTime)(isoString, locale); }, [locale]),
        formatTimeAgo: (0, react_1.useCallback)(function (isoString) { return (0, utils_1.formatTimeAgo)(isoString, locale); }, [locale])
    };
}
