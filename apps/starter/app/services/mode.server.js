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
        if (auth_1.DOMAIN && !auth_1.DOMAIN.startsWith("localhost")) {
            cookieOptions.domain = auth_1.DOMAIN;
        }
        return cookie.serialize(cookieName, mode, cookieOptions);
    }
}
