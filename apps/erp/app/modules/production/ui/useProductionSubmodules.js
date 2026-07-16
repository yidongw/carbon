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
exports.default = useProductionSubmodules;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
var useSavedViews_1 = require("~/hooks/useSavedViews");
var path_1 = require("~/utils/path");
function useProductionSubmodules(opts) {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var companySettings = (0, hooks_1.useCompanySettings)();
    var hidden = ((_a = companySettings === null || companySettings === void 0 ? void 0 : companySettings.hiddenSubmodules) !== null && _a !== void 0 ? _a : []);
    var productionRoutes = [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Dashboard"], ["Dashboard"]))),
            routes: [
                {
                    name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Dashboard"], ["Dashboard"]))),
                    to: path_1.path.to.productionDashboard,
                    icon: <lu_1.LuLayoutDashboard />
                }
            ]
        },
        {
            name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Manage"], ["Manage"]))),
            routes: [
                {
                    name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Jobs"], ["Jobs"]))),
                    to: path_1.path.to.jobs,
                    icon: <lu_1.LuCirclePlay />,
                    table: "job"
                },
                {
                    name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Master Work Orders"], ["Master Work Orders"]))),
                    to: path_1.path.to.masterWorkOrders,
                    icon: <lu_1.LuScissors />,
                    role: "employee"
                },
                {
                    name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Bundle Work Orders"], ["Bundle Work Orders"]))),
                    to: path_1.path.to.bundleWorkOrders,
                    icon: <lu_1.LuPackageOpen />,
                    role: "employee"
                },
                {
                    name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Procedures"], ["Procedures"]))),
                    to: path_1.path.to.procedures,
                    icon: <lu_1.LuListChecks />,
                    table: "procedure",
                    role: "employee"
                },
                {
                    name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Process Completions"], ["Process Completions"]))),
                    to: path_1.path.to.productionQuantities,
                    icon: <lu_1.LuPackageCheck />,
                    role: "employee"
                }
            ]
        },
        {
            name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Plan"], ["Plan"]))),
            routes: [
                {
                    name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Planning"], ["Planning"]))),
                    to: path_1.path.to.productionPlanning,
                    icon: <lu_1.LuSquareChartGantt />,
                    table: "production-planning"
                },
                {
                    name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Projections"], ["Projections"]))),
                    to: path_1.path.to.demandProjections,
                    icon: <lu_1.LuChartLine />,
                    table: "demand-projection"
                },
                {
                    name: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Schedule"], ["Schedule"]))),
                    to: path_1.path.to.scheduleDates,
                    icon: <lu_1.LuSquareKanban />
                }
            ]
        },
        {
            name: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Configure"], ["Configure"]))),
            routes: [
                {
                    name: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Assignment Rules"], ["Assignment Rules"]))),
                    to: path_1.path.to.jobRules,
                    role: "employee",
                    icon: <lu_1.LuShieldCheck />
                },
                {
                    name: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Scrap Reasons"], ["Scrap Reasons"]))),
                    to: path_1.path.to.scrapReasons,
                    role: "employee",
                    icon: <lu_1.LuTrash />
                }
            ]
        }
    ];
    var addSavedViewsToRoutes = (0, useSavedViews_1.useSavedViews)().addSavedViewsToRoutes;
    var isVisible = function (route) {
        if (route.role && !permissions.is(route.role))
            return false;
        if (!(opts === null || opts === void 0 ? void 0 : opts.includeHidden) && route.to && hidden.includes(route.to)) {
            return false;
        }
        return true;
    };
    return {
        groups: productionRoutes
            .map(function (group) { return (__assign(__assign({}, group), { routes: group.routes.filter(isVisible).map(addSavedViewsToRoutes) })); })
            .filter(function (group) { return group.routes.length > 0; })
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
