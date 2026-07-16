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
exports.useUser = useUser;
var react_1 = require("@carbon/react");
var path_1 = require("~/utils/path");
function useUser() {
    var _a, _b, _c;
    var data = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    if ((data === null || data === void 0 ? void 0 : data.company) &&
        isCompany(data.company) &&
        (data === null || data === void 0 ? void 0 : data.user) &&
        isUser(data.user) &&
        (data === null || data === void 0 ? void 0 : data.groups) &&
        isGroups(data.groups) &&
        isDefaults(data.defaults)) {
        return __assign(__assign({}, data.user), { 
            // WeChat users have no email (null in DB); expose "" so the many call sites
            // that do user.email.toLowerCase()/etc. don't crash.
            email: (_a = data.user.email) !== null && _a !== void 0 ? _a : "", company: data.company, groups: data.groups, defaults: (_b = data.defaults) !== null && _b !== void 0 ? _b : { locationId: null }, flags: (_c = data.user.flags) !== null && _c !== void 0 ? _c : {} });
    }
    // TODO: force logout -- the likely cause is development changes
    throw new Error("useUser must be used within an authenticated route. If you are seeing this error, you are likely in development and have changed the session variables. Try deleting the cookies.");
}
function isCompany(value) {
    return (typeof value.id === "string" &&
        typeof value.name === "string" &&
        (typeof value.logoDarkIcon === "string" || value.logoDarkIcon === null) &&
        (typeof value.logoLightIcon === "string" || value.logoLightIcon === null) &&
        (typeof value.logoDark === "string" || value.logoDark === null) &&
        (typeof value.logoLight === "string" || value.logoLight === null) &&
        (typeof value.countryCode === "string" || value.countryCode === null) &&
        typeof value.baseCurrencyCode === "string");
}
function isDefaults(value) {
    return (value === null ||
        typeof value.locationId === "string" ||
        value.locationId === null);
}
function isGroups(value) {
    return Array.isArray(value) && value.every(function (v) { return typeof v === "string"; });
}
function isUser(value) {
    return (typeof value.id === "string" &&
        (typeof value.email === "string" || value.email === null) &&
        typeof value.firstName === "string" &&
        typeof value.lastName === "string" &&
        "avatarUrl" in value);
}
