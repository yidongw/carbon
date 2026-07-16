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
exports.default = usePeopleSubmodules;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var useSavedViews_1 = require("~/hooks/useSavedViews");
var useSettings_1 = require("~/hooks/useSettings");
var path_1 = require("~/utils/path");
function usePeopleSubmodules() {
    var t = (0, macro_1.useLingui)().t;
    var peopleRoutes = [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Manage"], ["Manage"]))),
            routes: [
                {
                    name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Employees"], ["Employees"]))),
                    to: path_1.path.to.people,
                    icon: <lu_1.LuUsers />,
                    table: "employee"
                },
                {
                    name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Permissions"], ["Permissions"]))),
                    to: path_1.path.to.permissions,
                    icon: <lu_1.LuShield />
                },
                {
                    name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Invite Links"], ["Invite Links"]))),
                    to: path_1.path.to.peopleInviteLinks,
                    icon: <lu_1.LuLink />
                },
                {
                    name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Applications"], ["Applications"]))),
                    to: path_1.path.to.peopleApplications,
                    icon: <lu_1.LuUserCheck />
                },
                {
                    name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Operators"], ["Operators"]))),
                    to: path_1.path.to.operators,
                    icon: <lu_1.LuMonitor />,
                    setting: "consoleEnabled"
                },
                {
                    name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Groups"], ["Groups"]))),
                    to: path_1.path.to.groups,
                    icon: <lu_1.LuGroup />
                },
                {
                    name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Timecards"], ["Timecards"]))),
                    to: path_1.path.to.peopleTimecard,
                    icon: <lu_1.LuClock />,
                    setting: "timeCardEnabled",
                    table: "timeCardEntry"
                }
            ]
        },
        {
            name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Configure"], ["Configure"]))),
            routes: [
                {
                    name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Attributes"], ["Attributes"]))),
                    to: path_1.path.to.attributes,
                    icon: <lu_1.LuListChecks />
                },
                {
                    name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Departments"], ["Departments"]))),
                    to: path_1.path.to.departments,
                    icon: <lu_1.LuNetwork />
                },
                {
                    name: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Employee Types"], ["Employee Types"]))),
                    to: path_1.path.to.employeeTypes,
                    icon: <lu_1.LuFileBadge2 />
                },
                {
                    name: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Holidays"], ["Holidays"]))),
                    to: path_1.path.to.holidays,
                    icon: <lu_1.LuCalendarHeart />
                },
                {
                    name: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Shifts"], ["Shifts"]))),
                    to: path_1.path.to.shifts,
                    icon: <lu_1.LuCalendarClock />
                }
            ]
        }
    ];
    var addSavedViewsToRoutes = (0, useSavedViews_1.useSavedViews)().addSavedViewsToRoutes;
    var settings = (0, useSettings_1.useSettings)();
    return {
        groups: peopleRoutes.map(function (group) { return (__assign(__assign({}, group), { routes: group.routes
                .filter(function (route) {
                return !route.setting ||
                    settings[route.setting] === true;
            })
                .map(addSavedViewsToRoutes) })); })
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
