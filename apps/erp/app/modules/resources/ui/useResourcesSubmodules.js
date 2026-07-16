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
exports.default = useResourcesSubmodules;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var useSavedViews_1 = require("~/hooks/useSavedViews");
var path_1 = require("~/utils/path");
function useResourcesSubmodules() {
    var t = (0, macro_1.useLingui)().t;
    var addSavedViewsToRoutes = (0, useSavedViews_1.useSavedViews)().addSavedViewsToRoutes;
    var translatedRoutes = [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Dashboard"], ["Dashboard"]))),
            routes: [
                {
                    name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Dashboard"], ["Dashboard"]))),
                    to: path_1.path.to.resourcesDashboard,
                    icon: <lu_1.LuLayoutDashboard />
                }
            ]
        },
        {
            name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Maintenance"], ["Maintenance"]))),
            routes: [
                {
                    name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Dispatches"], ["Dispatches"]))),
                    to: path_1.path.to.maintenanceDispatches,
                    icon: <lu_1.LuWrench />,
                    table: "maintenanceDispatch"
                },
                {
                    name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Schedules"], ["Schedules"]))),
                    to: path_1.path.to.maintenanceSchedules,
                    icon: <lu_1.LuCalendarClock />,
                    table: "maintenanceSchedule"
                },
                {
                    name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Failure Modes"], ["Failure Modes"]))),
                    to: path_1.path.to.failureModes,
                    icon: <lu_1.LuCircleAlert />
                }
            ]
        },
        {
            name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Infrastructure"], ["Infrastructure"]))),
            routes: [
                {
                    name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Locations"], ["Locations"]))),
                    to: path_1.path.to.locations,
                    icon: <lu_1.LuMapPin />,
                    table: "location"
                },
                {
                    name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Processes"], ["Processes"]))),
                    to: path_1.path.to.processes,
                    icon: <lu_1.LuCog />,
                    table: "process"
                },
                {
                    name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Work Centers"], ["Work Centers"]))),
                    to: path_1.path.to.workCenters,
                    icon: <lu_1.LuWrench />,
                    table: "workCenter"
                }
            ]
        },
        {
            name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["People"], ["People"]))),
            routes: [
                {
                    name: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Training"], ["Training"]))),
                    to: path_1.path.to.trainings,
                    icon: <lu_1.LuGraduationCap />,
                    table: "training"
                },
                {
                    name: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Assignments"], ["Assignments"]))),
                    to: path_1.path.to.trainingAssignments,
                    icon: <lu_1.LuClipboardCheck />
                },
                {
                    name: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Suggestions"], ["Suggestions"]))),
                    to: path_1.path.to.suggestions,
                    icon: <lu_1.LuMailbox />,
                    table: "suggestion"
                }
            ]
        }
    ];
    return {
        groups: translatedRoutes.map(function (group) { return (__assign(__assign({}, group), { routes: group.routes.map(addSavedViewsToRoutes) })); })
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
