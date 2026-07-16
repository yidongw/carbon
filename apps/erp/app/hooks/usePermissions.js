"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePermissions = usePermissions;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var path_1 = require("~/utils/path");
var useUser_1 = require("./useUser");
function usePermissions() {
    var data = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var _a = (0, useUser_1.useUser)(), userId = _a.id, _b = _a.company, companyId = _b.id, ownerId = _b.ownerId;
    if (!isPermissions(data === null || data === void 0 ? void 0 : data.permissions) || !isRole(data === null || data === void 0 ? void 0 : data.role)) {
        // TODO: force logout -- the likely cause is development changes
        throw new Error("usePermissions must be used within an authenticated route. If you are seeing this after seeding or changing companies, clear the permissions Redis cache and sign in again (or delete cookies and hard-refresh).");
    }
    var can = (0, react_2.useCallback)(function (action, feature) {
        var _a, _b;
        return (((_a = data === null || data === void 0 ? void 0 : data.permissions[feature]) === null || _a === void 0 ? void 0 : _a[action].includes("0")) ||
            ((_b = data === null || data === void 0 ? void 0 : data.permissions[feature]) === null || _b === void 0 ? void 0 : _b[action].includes(companyId)));
    }, [companyId, data === null || data === void 0 ? void 0 : data.permissions]);
    var has = (0, react_2.useCallback)(function (feature) {
        return !!(data === null || data === void 0 ? void 0 : data.permissions) && feature in data.permissions;
    }, [data === null || data === void 0 ? void 0 : data.permissions]);
    var is = (0, react_2.useCallback)(function (role) {
        return (data === null || data === void 0 ? void 0 : data.role) === role;
    }, [data === null || data === void 0 ? void 0 : data.role]);
    var isOwner = (0, react_2.useCallback)(function () {
        return ownerId === userId;
    }, [ownerId, userId]);
    return {
        can: can,
        has: has,
        is: is,
        isOwner: isOwner
    };
}
function isPermissions(value) {
    if (typeof value === "object" &&
        Array.isArray(value) === false &&
        value !== null) {
        var entries = Object.values(value);
        if (entries.length === 0) {
            return false;
        }
        return entries.every(function (permission) {
            return "view" in permission &&
                "create" in permission &&
                "update" in permission &&
                "delete" in permission;
        });
    }
    else {
        return false;
    }
}
function isRole(value) {
    return value === "employee" || value === "customer" || value === "supplier";
}
