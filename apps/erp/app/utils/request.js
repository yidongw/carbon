"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocale = void 0;
var intl_parse_accept_language_1 = require("intl-parse-accept-language");
var getLocale = function (request) {
    var _a;
    var acceptLanguage = request.headers.get("accept-language");
    var locales = (0, intl_parse_accept_language_1.parseAcceptLanguage)(acceptLanguage, {
        validate: Intl.DateTimeFormat.supportedLocalesOf
    });
    return (_a = locales === null || locales === void 0 ? void 0 : locales[0]) !== null && _a !== void 0 ? _a : "en-US";
};
exports.getLocale = getLocale;
