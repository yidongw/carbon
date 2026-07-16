"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePercentFormatter = usePercentFormatter;
var i18n_1 = require("@react-aria/i18n");
var react_1 = require("react");
function usePercentFormatter() {
    var locale = (0, i18n_1.useLocale)().locale;
    var formatter = (0, react_1.useMemo)(function () {
        return new Intl.NumberFormat(locale, {
            style: "percent",
            maximumFractionDigits: 2
        });
    }, [locale]);
    return formatter;
}
