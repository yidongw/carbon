"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParams = exports.requestReferrer = exports.getStoragePath = exports.removeSubdomain = exports.path = void 0;
var auth_1 = require("@carbon/auth");
var react_router_1 = require("react-router");
var challenge = "/challenge"; // from ~/routes/challenge+ folder
var course = "/course"; // from ~/routes/course+ folder
var lesson = "/lesson"; // from ~/routes/lesson+ folder
var ERP_URL = (auth_1.SUPABASE_URL === null || auth_1.SUPABASE_URL === void 0 ? void 0 : auth_1.SUPABASE_URL.includes("localhost"))
    ? "http://localhost:3000"
    : auth_1.ERP_URL;
exports.path = {
    to: {
        about: "/about",
        accountSettings: "".concat(ERP_URL, "/x/account"),
        callback: "/callback",
        challenge: function (topicId) { return (0, react_router_1.generatePath)("".concat(challenge, "/").concat(topicId)); },
        course: function (moduleId, courseId) {
            return (0, react_router_1.generatePath)("".concat(course, "/").concat(moduleId, "/").concat(courseId));
        },
        dashboard: "".concat(ERP_URL, "/x"),
        health: "/health",
        login: "/login",
        logout: "/logout",
        refreshSession: "/refresh-session",
        root: "/",
        lesson: function (id) { return (0, react_router_1.generatePath)("".concat(lesson, "/").concat(id)); }
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
