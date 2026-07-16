"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLocale = setLocale;
var auth_1 = require("@carbon/auth");
var locale_1 = require("@carbon/locale");
var cookie = require("cookie");
function setLocale(locale) {
    var cookieOptions = {
        path: "/",
        maxAge: 31536000
    };
    var cookieDomain = (0, auth_1.getCookieDomain)(auth_1.DOMAIN);
    if (cookieDomain)
        cookieOptions.domain = cookieDomain;
    return cookie.serialize(locale_1.localeCookieName, (0, locale_1.resolveLanguage)(locale), cookieOptions);
}
