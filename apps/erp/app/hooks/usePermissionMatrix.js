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
exports.usePermissionMatrix = usePermissionMatrix;
exports.toApiKeyScopes = toApiKeyScopes;
exports.fromApiKeyScopes = fromApiKeyScopes;
exports.toCompanyPermissions = toCompanyPermissions;
exports.fromCompanyPermissions = fromCompanyPermissions;
exports.toEmployeeTypePermissions = toEmployeeTypePermissions;
exports.fromEmployeeTypePermissions = fromEmployeeTypePermissions;
var react_1 = require("react");
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
var ALL_ACTIONS = [
    "view",
    "create",
    "update",
    "delete"
];
/** Modules that should be hidden from all permission UIs */
var HIDDEN_MODULES = new Set(["items", "timecards"]);
// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
function usePermissionMatrix(_a) {
    var modules = _a.modules, initialState = _a.initialState;
    var sortedModules = (0, react_1.useMemo)(function () {
        return Object.entries(modules).sort(function (_a, _b) {
            var a = _a[0];
            var b = _b[0];
            return a.localeCompare(b);
        });
    }, [modules]);
    var _b = (0, react_1.useState)(function () { return initialState !== null && initialState !== void 0 ? initialState : buildDefaultState(modules); }), permissions = _b[0], setPermissionsRaw = _b[1];
    var setPermissions = (0, react_1.useCallback)(function (next) { return setPermissionsRaw(next); }, []);
    // Derived state
    var allKeys = (0, react_1.useMemo)(function () { return Object.keys(permissions); }, [permissions]);
    var allChecked = (0, react_1.useMemo)(function () { return allKeys.length > 0 && allKeys.every(function (k) { return permissions[k]; }); }, [allKeys, permissions]);
    var someChecked = (0, react_1.useMemo)(function () { return allKeys.some(function (k) { return permissions[k]; }); }, [allKeys, permissions]);
    var isChecked = (0, react_1.useCallback)(function (mod, action) { var _a; return (_a = permissions["".concat(mod, "_").concat(action)]) !== null && _a !== void 0 ? _a : false; }, [permissions]);
    var hasAction = (0, react_1.useCallback)(function (mod, action) {
        var _a, _b;
        return (_b = (_a = modules[mod]) === null || _a === void 0 ? void 0 : _a.includes(action)) !== null && _b !== void 0 ? _b : false;
    }, [modules]);
    var toggleCell = (0, react_1.useCallback)(function (mod, action) {
        var key = "".concat(mod, "_").concat(action);
        setPermissionsRaw(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = !prev[key], _a)));
        });
    }, []);
    var toggleRow = (0, react_1.useCallback)(function (mod) {
        setPermissionsRaw(function (prev) {
            var _a;
            var moduleActions = (_a = modules[mod]) !== null && _a !== void 0 ? _a : [];
            var rowKeys = moduleActions.map(function (a) { return "".concat(mod, "_").concat(a); });
            var allRowChecked = rowKeys.every(function (k) { return prev[k]; });
            var next = __assign({}, prev);
            for (var _i = 0, rowKeys_1 = rowKeys; _i < rowKeys_1.length; _i++) {
                var k = rowKeys_1[_i];
                next[k] = !allRowChecked;
            }
            return next;
        });
    }, [modules]);
    var toggleAll = (0, react_1.useCallback)(function () {
        setPermissionsRaw(function (prev) {
            var keys = Object.keys(prev);
            var currentAllChecked = keys.length > 0 && keys.every(function (k) { return prev[k]; });
            var next = {};
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var k = keys_1[_i];
                next[k] = !currentAllChecked;
            }
            return next;
        });
    }, []);
    var isRowAllChecked = (0, react_1.useCallback)(function (mod) {
        var _a;
        var moduleActions = (_a = modules[mod]) !== null && _a !== void 0 ? _a : [];
        return (moduleActions.length > 0 &&
            moduleActions.every(function (a) { return permissions["".concat(mod, "_").concat(a)]; }));
    }, [modules, permissions]);
    var isRowIndeterminate = (0, react_1.useCallback)(function (mod) {
        var _a;
        var moduleActions = (_a = modules[mod]) !== null && _a !== void 0 ? _a : [];
        var some = moduleActions.some(function (a) { return permissions["".concat(mod, "_").concat(a)]; });
        var all = moduleActions.every(function (a) { return permissions["".concat(mod, "_").concat(a)]; });
        return some && !all;
    }, [modules, permissions]);
    return {
        permissions: permissions,
        modules: sortedModules,
        actions: ALL_ACTIONS,
        isChecked: isChecked,
        toggleCell: toggleCell,
        toggleRow: toggleRow,
        toggleAll: toggleAll,
        allChecked: allChecked,
        someChecked: someChecked,
        isRowAllChecked: isRowAllChecked,
        isRowIndeterminate: isRowIndeterminate,
        hasAction: hasAction,
        setPermissions: setPermissions
    };
}
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/** Build a default all-false state from module definitions */
function buildDefaultState(modules) {
    var state = {};
    for (var _i = 0, _a = Object.entries(modules); _i < _a.length; _i++) {
        var _b = _a[_i], mod = _b[0], actions = _b[1];
        for (var _c = 0, actions_1 = actions; _c < actions_1.length; _c++) {
            var action = actions_1[_c];
            state["".concat(mod, "_").concat(action)] = false;
        }
    }
    return state;
}
// ---------------------------------------------------------------------------
// Adapter: API Key scopes
// ---------------------------------------------------------------------------
/** Convert flat boolean map → JSONB scopes format { "sales_view": ["<companyId>"], ... } */
function toApiKeyScopes(permissions, companyId) {
    var result = {};
    for (var _i = 0, _a = Object.entries(permissions); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], enabled = _b[1];
        if (enabled) {
            result[key] = [companyId];
        }
    }
    return result;
}
/** Convert JSONB scopes format → flat boolean map (empty scopes = no access) */
function fromApiKeyScopes(scopes, modules) {
    var state = buildDefaultState(modules);
    if (!scopes || Object.keys(scopes).length === 0) {
        return state;
    }
    for (var _i = 0, _a = Object.keys(scopes); _i < _a.length; _i++) {
        var key = _a[_i];
        if (key in state) {
            state[key] = true;
        }
    }
    return state;
}
// ---------------------------------------------------------------------------
// Adapter: CompanyPermission (employee permissions, bulk edit)
// ---------------------------------------------------------------------------
/** Convert flat boolean map → Record<string, CompanyPermission> */
function toCompanyPermissions(permissions) {
    var result = {};
    for (var _i = 0, _a = Object.entries(permissions); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], enabled = _b[1];
        var lastUnderscore = key.lastIndexOf("_");
        if (lastUnderscore === -1)
            continue;
        var mod = key.slice(0, lastUnderscore);
        var action = key.slice(lastUnderscore + 1);
        if (!result[mod]) {
            result[mod] = {
                view: false,
                create: false,
                update: false,
                delete: false
            };
        }
        if (action in result[mod]) {
            result[mod][action] = enabled;
        }
    }
    return result;
}
/** Convert Record<string, CompanyPermission> → flat boolean map + derived ModuleDefinition */
function fromCompanyPermissions(permissions) {
    var state = {};
    var modules = {};
    for (var _i = 0, _a = Object.entries(permissions); _i < _a.length; _i++) {
        var _b = _a[_i], mod = _b[0], perm = _b[1];
        if (HIDDEN_MODULES.has(mod))
            continue;
        var actions = ["view", "create", "update", "delete"];
        modules[mod] = actions;
        for (var _c = 0, actions_2 = actions; _c < actions_2.length; _c++) {
            var action = actions_2[_c];
            state["".concat(mod, "_").concat(action)] = perm[action];
        }
    }
    return { state: state, modules: modules };
}
// ---------------------------------------------------------------------------
// Adapter: Employee type permissions ({ name, permission } shape)
// ---------------------------------------------------------------------------
/** Convert flat boolean map → Record<string, { name: string; permission: CompanyPermission }> */
function toEmployeeTypePermissions(permissions) {
    var company = toCompanyPermissions(permissions);
    var result = {};
    for (var _i = 0, _a = Object.entries(company); _i < _a.length; _i++) {
        var _b = _a[_i], mod = _b[0], perm = _b[1];
        result[mod] = { name: mod, permission: perm };
    }
    return result;
}
/** Convert Record<string, { name: string; permission: CompanyPermission }> → flat boolean map + derived ModuleDefinition */
function fromEmployeeTypePermissions(permissions) {
    var state = {};
    var modules = {};
    for (var _i = 0, _a = Object.entries(permissions); _i < _a.length; _i++) {
        var _b = _a[_i], mod = _b[0], data = _b[1];
        if (HIDDEN_MODULES.has(mod))
            continue;
        var actions = ["view", "create", "update", "delete"];
        modules[mod] = actions;
        for (var _c = 0, actions_3 = actions; _c < actions_3.length; _c++) {
            var action = actions_3[_c];
            state["".concat(mod, "_").concat(action)] = data.permission[action];
        }
    }
    return { state: state, modules: modules };
}
