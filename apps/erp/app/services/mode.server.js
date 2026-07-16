"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMode = getMode;
exports.setMode = setMode;
var auth_1 = require("@carbon/auth");
var cookie = require("cookie");
var cookieName = "mode";
function getMode(request) {
    var cookieHeader = request.headers.get("cookie");
    var parsed = cookieHeader
        ? cookie.parse(cookieHeader)[cookieName]
        : "light";
    if (parsed === "light" || parsed === "dark")
        return parsed;
    return null;
}
function setMode(mode) {
    if (mode === "system") {
        return cookie.serialize(cookieName, "", { path: "/", maxAge: -1 });
    }
    else {
        var cookieOptions = {
            path: "/",
            maxAge: 31536000
        };
        var cookieDomain = (0, auth_1.getCookieDomain)(auth_1.DOMAIN);
        if (cookieDomain)
            cookieOptions.domain = cookieDomain;
        return cookie.serialize(cookieName, mode, cookieOptions);
    }
}
