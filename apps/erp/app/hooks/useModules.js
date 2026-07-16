"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.useModules = useModules;
exports.useSettingsModule = useSettingsModule;
exports.useAllModules = useAllModules;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var path_1 = require("~/utils/path");
var usePermissions_1 = require("./usePermissions");
function filterByPermissions(modules, permissions) {
    return modules.filter(function (item) {
        if (item.permission) {
            return permissions.can("view", item.permission);
        }
        else if (item.role) {
            return permissions.is(item.role);
        }
        else {
            return true;
        }
    });
}
function useModuleDefinitions() {
    var t = (0, macro_1.useLingui)().t;
    return [
        {
            key: "accounting",
            permission: "accounting",
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Accounting"], ["Accounting"]))),
            to: path_1.path.to.chartOfAccounts,
            icon: lu_1.LuLandmark
        },
        {
            key: "documents",
            permission: "documents",
            name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Documents"], ["Documents"]))),
            to: path_1.path.to.documents,
            icon: lu_1.LuFiles
        },
        {
            key: "inventory",
            permission: "inventory",
            name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Inventory"], ["Inventory"]))),
            to: path_1.path.to.inventoryQuantities,
            icon: lu_1.LuBox
        },
        {
            key: "parts",
            permission: "parts",
            name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Items"], ["Items"]))),
            to: path_1.path.to.parts,
            icon: lu_1.LuSquareStack
        },
        {
            key: "people",
            permission: "people",
            name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["People"], ["People"]))),
            to: path_1.path.to.people,
            icon: lu_1.LuUsers
        },
        {
            key: "production",
            permission: "production",
            name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Production"], ["Production"]))),
            to: path_1.path.to.productionDashboard,
            icon: lu_1.LuFactory
        },
        {
            key: "purchasing",
            permission: "purchasing",
            name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Purchasing"], ["Purchasing"]))),
            to: path_1.path.to.purchasingDashboard,
            icon: lu_1.LuShoppingCart
        },
        {
            key: "quality",
            permission: "quality",
            name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Quality"], ["Quality"]))),
            to: path_1.path.to.qualityDashboard,
            icon: lu_1.LuFolderCheck
        },
        {
            key: "resources",
            permission: "resources",
            name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Resources"], ["Resources"]))),
            to: path_1.path.to.resourcesDashboard,
            icon: lu_1.LuWrench
        },
        {
            key: "sales",
            permission: "sales",
            name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Sales"], ["Sales"]))),
            to: path_1.path.to.salesDashboard,
            icon: lu_1.LuCrown
        },
        {
            key: "settings",
            permission: "settings",
            name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Settings"], ["Settings"]))),
            to: path_1.path.to.company,
            icon: lu_1.LuSettings
        },
        {
            key: "shopFloor",
            name: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Shop Floor"], ["Shop Floor"]))),
            to: path_1.path.to.external.mes,
            icon: lu_1.LuTvMinimalPlay,
            role: "employee"
        }
    ];
}
var PINNED_MODULES = new Set(["settings"]);
function useModules() {
    var _a;
    var permissions = (0, usePermissions_1.usePermissions)();
    var modules = useModuleDefinitions();
    var routeData = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var modulePreferences = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.modulePreferences) !== null && _a !== void 0 ? _a : [];
    var permitted = filterByPermissions(modules, permissions).filter(function (m) { return !PINNED_MODULES.has(m.key); });
    var alphabetical = permitted.sort(function (a, b) { return a.name.localeCompare(b.name); });
    if (modulePreferences.length === 0) {
        return alphabetical;
    }
    var prefMap = new Map(modulePreferences.map(function (p) { return [p.module, p]; }));
    var visible = alphabetical.filter(function (m) {
        var pref = prefMap.get(m.key);
        return !(pref === null || pref === void 0 ? void 0 : pref.hidden);
    });
    return visible.sort(function (a, b) {
        var _a, _b, _c, _d;
        var posA = (_b = (_a = prefMap.get(a.key)) === null || _a === void 0 ? void 0 : _a.position) !== null && _b !== void 0 ? _b : Infinity;
        var posB = (_d = (_c = prefMap.get(b.key)) === null || _c === void 0 ? void 0 : _c.position) !== null && _d !== void 0 ? _d : Infinity;
        return posA - posB;
    });
}
function useSettingsModule() {
    var permissions = (0, usePermissions_1.usePermissions)();
    var modules = useModuleDefinitions();
    var settings = modules.find(function (m) { return m.key === "settings"; });
    if (!settings)
        return null;
    if (settings.permission && !permissions.can("view", settings.permission)) {
        return null;
    }
    return settings;
}
function useAllModules() {
    var _a;
    var permissions = (0, usePermissions_1.usePermissions)();
    var modules = useModuleDefinitions();
    var routeData = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var modulePreferences = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.modulePreferences) !== null && _a !== void 0 ? _a : [];
    var permitted = filterByPermissions(modules, permissions)
        .filter(function (m) { return !PINNED_MODULES.has(m.key); })
        .sort(function (a, b) { return a.name.localeCompare(b.name); });
    var prefMap = new Map(modulePreferences.map(function (p) { return [p.module, p]; }));
    return permitted
        .map(function (m, index) {
        var _a, _b, _c, _d;
        return (__assign(__assign({}, m), { position: (_b = (_a = prefMap.get(m.key)) === null || _a === void 0 ? void 0 : _a.position) !== null && _b !== void 0 ? _b : index + 1, hidden: (_d = (_c = prefMap.get(m.key)) === null || _c === void 0 ? void 0 : _c.hidden) !== null && _d !== void 0 ? _d : false }));
    })
        .sort(function (a, b) { return a.position - b.position; });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
