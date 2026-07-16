"use strict";
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
exports.useCurrencyFormatter = useCurrencyFormatter;
var i18n_1 = require("@react-aria/i18n");
var react_1 = require("react");
var useUser_1 = require("./useUser");
function useCurrencyFormatter(options) {
    var _a, _b;
    var company = (0, useUser_1.useUser)().company;
    var baseCurrency = (_a = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _a !== void 0 ? _a : "USD";
    var locale = (0, i18n_1.useLocale)().locale;
    var currency = (_b = options === null || options === void 0 ? void 0 : options.currency) !== null && _b !== void 0 ? _b : baseCurrency;
    var formatter = (0, react_1.useMemo)(function () {
        return new Intl.NumberFormat(locale, __assign({ style: "currency", currency: currency }, options));
    }, [locale, currency, options]);
    return formatter;
}
