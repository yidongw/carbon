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
exports.default = useQualitySubmodules;
var macro_1 = require("@lingui/react/macro");
var io5_1 = require("react-icons/io5");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
var useSavedViews_1 = require("~/hooks/useSavedViews");
var path_1 = require("~/utils/path");
function useQualitySubmodules() {
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var addSavedViewsToRoutes = (0, useSavedViews_1.useSavedViews)().addSavedViewsToRoutes;
    var qualityRoutes = [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Dashboard"], ["Dashboard"]))),
            routes: [
                {
                    name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Dashboard"], ["Dashboard"]))),
                    to: path_1.path.to.qualityDashboard,
                    icon: <lu_1.LuLayoutDashboard />
                }
            ]
        },
        {
            name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Issues"], ["Issues"]))),
            routes: [
                {
                    name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Actions"], ["Actions"]))),
                    to: path_1.path.to.qualityActions,
                    icon: <lu_1.LuListChecks />,
                    table: "nonConformanceActionTask"
                },
                {
                    name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Issues"], ["Issues"]))),
                    to: path_1.path.to.issues,
                    icon: <lu_1.LuShieldX />,
                    table: "nonConformance"
                },
                {
                    name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Risks"], ["Risks"]))),
                    to: path_1.path.to.risks,
                    icon: <lu_1.LuShieldAlert />,
                    table: "riskRegister"
                }
            ]
        },
        {
            name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Calibrations"], ["Calibrations"]))),
            routes: [
                {
                    name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Gauges"], ["Gauges"]))),
                    to: path_1.path.to.gauges,
                    icon: <lu_1.LuDraftingCompass />
                },
                {
                    name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Records"], ["Records"]))),
                    to: path_1.path.to.calibrations,
                    icon: <lu_1.LuCircleGauge />
                }
            ]
        },
        {
            name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Inspection"], ["Inspection"]))),
            routes: [
                {
                    name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Inbound Inspections"], ["Inbound Inspections"]))),
                    to: path_1.path.to.inboundInspections,
                    icon: <lu_1.LuClipboardCheck />,
                    table: "inboundInspection"
                },
                {
                    name: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Inspection Documents"], ["Inspection Documents"]))),
                    to: path_1.path.to.inspectionDocuments,
                    icon: <io5_1.IoBalloonOutline />
                }
            ]
        },
        {
            name: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Document Control"], ["Document Control"]))),
            routes: [
                {
                    name: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Quality Documents"], ["Quality Documents"]))),
                    to: path_1.path.to.qualityDocuments,
                    icon: <lu_1.LuFileText />,
                    table: "qualityDocument"
                }
            ]
        },
        {
            name: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Configure"], ["Configure"]))),
            routes: [
                {
                    name: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Action Types"], ["Action Types"]))),
                    to: path_1.path.to.requiredActions,
                    icon: <lu_1.LuSquareCheck />
                },
                {
                    name: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Gauge Types"], ["Gauge Types"]))),
                    to: path_1.path.to.gaugeTypes,
                    icon: <lu_1.LuShapes />
                },
                {
                    name: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Issue Types"], ["Issue Types"]))),
                    to: path_1.path.to.issueTypes,
                    icon: <lu_1.LuOctagonX />
                },
                {
                    name: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Issue Workflows"], ["Issue Workflows"]))),
                    to: path_1.path.to.issueWorkflows,
                    icon: <lu_1.LuWorkflow />
                }
            ]
        }
    ];
    return {
        groups: qualityRoutes
            .filter(function (group) {
            var filteredRoutes = group.routes.filter(function (route) {
                if (route.role) {
                    return permissions.is(route.role);
                }
                else {
                    return true;
                }
            });
            return filteredRoutes.length > 0;
        })
            .map(function (group) { return (__assign(__assign({}, group), { routes: group.routes
                .filter(function (route) {
                if (route.role) {
                    return permissions.is(route.role);
                }
                else {
                    return true;
                }
            })
                .map(addSavedViewsToRoutes) })); })
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19;
