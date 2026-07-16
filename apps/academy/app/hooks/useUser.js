"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUser = useUser;
exports.useOptionalUser = useOptionalUser;
var react_1 = require("@carbon/react");
var path_1 = require("~/utils/path");
function useUser() {
    var data = (0, react_1.useRouteData)(path_1.path.to.root);
    if ((data === null || data === void 0 ? void 0 : data.user) && isUser(data.user)) {
        return data.user;
    }
    // TODO: force logout -- the likely cause is development changes
    throw new Error("useUser must be used within an authenticated route. If you are seeing this error, you are likely in development and have changed the session variables. Try deleting the cookies.");
}
function isUser(value) {
    return (typeof value.id === "string" &&
        typeof value.email === "string" &&
        typeof value.firstName === "string" &&
        typeof value.lastName === "string" &&
        "avatarUrl" in value);
}
function useOptionalUser() {
    var data = (0, react_1.useRouteData)(path_1.path.to.root);
    if ((data === null || data === void 0 ? void 0 : data.user) && isUser(data.user)) {
        return data.user;
    }
    return null;
}
