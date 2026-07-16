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
    var data = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    if ((data === null || data === void 0 ? void 0 : data.company) &&
        isCompany(data.company) &&
        (data === null || data === void 0 ? void 0 : data.user) &&
        isUser(data.user)) {
        return __assign(__assign({}, data.user), { company: data.company });
    }
    // TODO: force logout -- the likely cause is development changes
    throw new Error("useUser must be used within an authenticated route. If you are seeing this error, you are likely in development and have changed the session variables. Try deleting the cookies.");
}
function isCompany(value) {
    return (typeof value.id === "string" &&
        typeof value.name === "string" &&
        (typeof value.logoLightIcon === "string" || value.logoLightIcon === null) &&
        (typeof value.logoDarkIcon === "string" || value.logoDarkIcon === null) &&
        (typeof value.logoLight === "string" || value.logoLight === null) &&
        (typeof value.logoDark === "string" || value.logoDark === null));
}
function isUser(value) {
    return (typeof value.id === "string" &&
        typeof value.email === "string" &&
        typeof value.firstName === "string" &&
        typeof value.lastName === "string" &&
        "avatarUrl" in value);
}
