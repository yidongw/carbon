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
exports.getConsolePinIn = getConsolePinIn;
exports.setConsolePinIn = setConsolePinIn;
exports.clearConsolePinIn = clearConsolePinIn;
exports.refreshConsolePinIn = refreshConsolePinIn;
var cookie = require("cookie");
var CONSOLE_PIN_PREFIX = "console-pin-";
var CONSOLE_PIN_MAX_AGE = 60 * 60; // 1 hour in seconds
var CONSOLE_PIN_MAX_AGE_MS = CONSOLE_PIN_MAX_AGE * 1000;
function getConsolePinIn(request, companyId) {
    var cookieHeader = request.headers.get("cookie");
    if (!cookieHeader)
        return null;
    var raw = cookie.parse(cookieHeader)["".concat(CONSOLE_PIN_PREFIX).concat(companyId)];
    if (!raw)
        return null;
    try {
        var parsed = JSON.parse(raw);
        // Check manual expiry (defense-in-depth alongside cookie maxAge)
        var elapsed = Date.now() - parsed.pinnedAt;
        if (elapsed > CONSOLE_PIN_MAX_AGE_MS)
            return null;
        return parsed;
    }
    catch (_a) {
        return null;
    }
}
function setConsolePinIn(companyId, data) {
    return cookie.serialize("".concat(CONSOLE_PIN_PREFIX).concat(companyId), JSON.stringify(data), {
        path: "/",
        maxAge: CONSOLE_PIN_MAX_AGE
    });
}
function clearConsolePinIn(companyId) {
    return cookie.serialize("".concat(CONSOLE_PIN_PREFIX).concat(companyId), "", {
        path: "/",
        maxAge: 0
    });
}
function refreshConsolePinIn(companyId, existing) {
    return setConsolePinIn(companyId, __assign(__assign({}, existing), { pinnedAt: Date.now() }));
}
