"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreferenceHeaders = void 0;
var cookie = require("cookie");
var intl_parse_accept_language_1 = require("intl-parse-accept-language");
var getPreferenceHeaders = function (request) {
    var _a, _b;
    var acceptLanguage = request.headers.get("accept-language");
    var cookieHeader = request.headers.get("cookie");
    var localeCookie = cookieHeader
        ? cookie.parse(cookieHeader).locale
        : undefined;
    var locales = (0, intl_parse_accept_language_1.parseAcceptLanguage)(acceptLanguage, {
        validate: Intl.DateTimeFormat.supportedLocalesOf
    });
    var cookieLocale = (localeCookie
        ? Intl.DateTimeFormat.supportedLocalesOf([localeCookie])
        : [])[0];
    // get whether it's a mac or pc from the headers
    var platform = ((_a = request.headers
        .get("user-agent")) === null || _a === void 0 ? void 0 : _a.includes("Mac"))
        ? "mac"
        : "windows";
    var locale = (_b = cookieLocale !== null && cookieLocale !== void 0 ? cookieLocale : locales === null || locales === void 0 ? void 0 : locales[0]) !== null && _b !== void 0 ? _b : "en-US";
    if (cookieLocale && !cookieLocale.includes("-") && (locales === null || locales === void 0 ? void 0 : locales.length)) {
        var regionalMatch = locales.find(function (l) {
            return l.toLowerCase().startsWith(cookieLocale.toLowerCase() + "-");
        });
        if (regionalMatch)
            locale = regionalMatch;
    }
    return {
        platform: platform,
        locale: locale
    };
};
exports.getPreferenceHeaders = getPreferenceHeaders;
