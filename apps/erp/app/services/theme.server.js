"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTheme = getTheme;
exports.setTheme = setTheme;
var auth_1 = require("@carbon/auth");
var cookie = require("cookie");
var cookieName = "theme";
var themes = [
    "zinc",
    "neutral",
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "violet"
];
function getTheme(request) {
    var cookieHeader = request.headers.get("cookie");
    var parsed = cookieHeader ? cookie.parse(cookieHeader)[cookieName] : "zinc";
    if (themes.includes(parsed))
        return parsed;
    return "zinc";
}
function setTheme(theme) {
    var cookieOptions = {
        path: "/",
        maxAge: 31536000
    };
    var cookieDomain = (0, auth_1.getCookieDomain)(auth_1.DOMAIN);
    if (cookieDomain)
        cookieOptions.domain = cookieDomain;
    return cookie.serialize(cookieName, theme, cookieOptions);
}
