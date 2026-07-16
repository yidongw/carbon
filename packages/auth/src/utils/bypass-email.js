"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBypassEmail = isBypassEmail;
exports.isBypassSession = isBypassSession;
var env_1 = require("../config/env");
function isBypassEmail(email) {
    if (!email || !env_1.DEV_BYPASS_EMAIL)
        return false;
    return env_1.DEV_BYPASS_EMAIL.split(",")
        .map(function (entry) { return entry.trim().toLowerCase(); })
        .filter(Boolean)
        .includes(email.toLowerCase());
}
function isBypassSession(session) {
    return Boolean(session.bypass) || isBypassEmail(session.email);
}
