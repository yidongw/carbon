"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTheme = getTheme;
exports.setTheme = setTheme;
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
    return cookie.serialize(cookieName, theme, { path: "/", maxAge: 31536000 });
}
