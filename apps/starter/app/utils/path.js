"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParams = exports.requestReferrer = exports.getStoragePath = exports.removeSubdomain = exports.path = void 0;
var auth_1 = require("@carbon/auth");
var react_router_1 = require("react-router");
var x = "/x"; // from ~/routes/x+ folder
var ERP_URL = (0, auth_1.getAppUrl)();
exports.path = {
    to: {
        authenticatedRoot: x,
        accountSettings: "".concat(ERP_URL, "/x/account"),
        callback: "/callback",
        companySwitch: function (companyId) {
            return (0, react_router_1.generatePath)("".concat(x, "/company/switch/").concat(companyId));
        },
        dashboard: "".concat(ERP_URL, "/x"),
        health: "/health",
        login: "/login",
        logout: "/logout",
        onboarding: "".concat(ERP_URL, "/onboarding"),
        refreshSession: "/refresh-session",
        requestAccess: "/request-access",
        root: "/"
    }
};
var removeSubdomain = function (url) {
    if (!url)
        return "localhost:3000";
    var parts = url.split("/")[0].split(".");
    var domain = parts.slice(-2).join(".");
    return domain;
};
exports.removeSubdomain = removeSubdomain;
var getStoragePath = function (bucket, path) {
    return "".concat(auth_1.SUPABASE_URL, "/storage/v1/object/public/").concat(bucket, "/").concat(path);
};
exports.getStoragePath = getStoragePath;
var requestReferrer = function (request) {
    return request.headers.get("referer");
};
exports.requestReferrer = requestReferrer;
var getParams = function (request) {
    var _a;
    var url = new URL((_a = (0, exports.requestReferrer)(request)) !== null && _a !== void 0 ? _a : "");
    var searchParams = new URLSearchParams(url.search);
    return searchParams.toString();
};
exports.getParams = getParams;
