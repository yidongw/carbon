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
exports.default = useSettingsSubmodules;
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
var useFlags_1 = require("~/hooks/useFlags");
var path_1 = require("~/utils/path");
var internalOnlyRoutes = new Set([path_1.path.to.companies]);
function useSettingsSubmodules() {
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var _a = (0, useFlags_1.useFlags)(), isCloud = _a.isCloud, isInternal = _a.isInternal;
    var settingsRoutes = (0, react_1.useMemo)(function () { return [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Company"], ["Company"]))),
            routes: [
                {
                    name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Billing"], ["Billing"]))),
                    to: path_1.path.to.billing,
                    role: "employee",
                    icon: <lu_1.LuCreditCard />,
                    requiresOwnership: true,
                    requiresCloudEnvironment: true
                },
                {
                    name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Company"], ["Company"]))),
                    to: path_1.path.to.company,
                    role: "employee",
                    icon: <lu_1.LuFactory />
                },
                {
                    name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Companies"], ["Companies"]))),
                    to: path_1.path.to.companies,
                    role: "employee",
                    icon: <lu_1.LuNetwork />
                },
                {
                    name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Document Templates"], ["Document Templates"]))),
                    to: path_1.path.to.documentTemplates,
                    role: "employee",
                    icon: <lu_1.LuFileText />
                },
                {
                    name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Logos"], ["Logos"]))),
                    to: path_1.path.to.logos,
                    role: "employee",
                    icon: <lu_1.LuImage />
                },
                {
                    name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Printing"], ["Printing"]))),
                    to: path_1.path.to.printingSettings,
                    role: "employee",
                    icon: <lu_1.LuPrinter />
                }
            ]
        },
        {
            name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Modules"], ["Modules"]))),
            routes: [
                {
                    name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Accounting"], ["Accounting"]))),
                    to: path_1.path.to.accountingSettings,
                    role: "employee",
                    icon: <lu_1.LuLandmark />
                },
                {
                    name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Inventory"], ["Inventory"]))),
                    to: path_1.path.to.inventorySettings,
                    role: "employee",
                    icon: <lu_1.LuBox />
                },
                {
                    name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Items"], ["Items"]))),
                    to: path_1.path.to.itemsSettings,
                    role: "employee",
                    icon: <lu_1.LuSquareStack />
                },
                {
                    name: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["People"], ["People"]))),
                    to: path_1.path.to.peopleSettings,
                    role: "employee",
                    icon: <lu_1.LuUsers />
                },
                {
                    name: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Purchasing"], ["Purchasing"]))),
                    to: path_1.path.to.purchasingSettings,
                    role: "employee",
                    icon: <lu_1.LuShoppingCart />
                },
                {
                    name: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Production"], ["Production"]))),
                    to: path_1.path.to.productionSettings,
                    role: "employee",
                    icon: <lu_1.LuFactory />
                },
                {
                    name: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Quality"], ["Quality"]))),
                    to: path_1.path.to.qualitySettings,
                    role: "employee",
                    icon: <lu_1.LuClipboardCheck />
                },
                {
                    name: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Sales"], ["Sales"]))),
                    to: path_1.path.to.salesSettings,
                    role: "employee",
                    icon: <lu_1.LuCrown />
                },
                {
                    name: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Resources"], ["Resources"]))),
                    to: path_1.path.to.resourcesSettings,
                    role: "employee",
                    icon: <lu_1.LuWrench />
                }
            ]
        },
        {
            name: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["System"], ["System"]))),
            routes: [
                {
                    name: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["API Keys"], ["API Keys"]))),
                    to: path_1.path.to.apiKeys,
                    role: "employee",
                    icon: <lu_1.LuKey />
                },
                {
                    name: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Approval Rules"], ["Approval Rules"]))),
                    to: path_1.path.to.approvalRules,
                    role: "employee",
                    icon: <lu_1.LuCircleCheck />
                },
                {
                    name: t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Audit Logs"], ["Audit Logs"]))),
                    to: path_1.path.to.auditLog,
                    role: "employee",
                    icon: <lu_1.LuHistory />
                },
                {
                    name: t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Custom Fields"], ["Custom Fields"]))),
                    to: path_1.path.to.customFields,
                    role: "employee",
                    icon: <lu_1.LuLayoutDashboard />
                },
                {
                    name: t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Integrations"], ["Integrations"]))),
                    to: path_1.path.to.integrations,
                    role: "employee",
                    icon: <lu_1.LuWorkflow />
                },
                {
                    name: t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Sequences"], ["Sequences"]))),
                    to: path_1.path.to.sequences,
                    role: "employee",
                    icon: <lu_1.LuSheet />
                },
                {
                    name: t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Tags"], ["Tags"]))),
                    to: path_1.path.to.tags,
                    role: "employee",
                    icon: <lu_1.LuTags />
                },
                {
                    name: t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Webhooks"], ["Webhooks"]))),
                    to: path_1.path.to.webhooks,
                    role: "employee",
                    icon: <lu_1.LuWebhook />
                }
            ]
        }
    ]; }, [t]);
    var isRouteVisible = function (route) {
        if (route.role && !permissions.is(route.role))
            return false;
        if (route.requiresOwnership && !permissions.isOwner())
            return false;
        if (route.requiresCloudEnvironment && !isCloud)
            return false;
        if (!isInternal && internalOnlyRoutes.has(route.to))
            return false;
        return true;
    };
    return {
        groups: settingsRoutes
            .filter(function (group) { return group.routes.some(isRouteVisible); })
            .map(function (group) { return (__assign(__assign({}, group), { routes: group.routes.filter(isRouteVisible) })); })
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26;
