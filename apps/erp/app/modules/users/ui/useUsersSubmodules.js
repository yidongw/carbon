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
exports.default = useUsersSubmodules;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var useSettings_1 = require("~/hooks/useSettings");
var path_1 = require("~/utils/path");
function useUsersSubmodules() {
    var t = (0, macro_1.useLingui)().t;
    var settings = (0, useSettings_1.useSettings)();
    var usersRoutes = [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Manage"], ["Manage"]))),
            routes: [
                {
                    name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Accounts"], ["Accounts"]))),
                    to: path_1.path.to.employeeAccounts,
                    icon: <lu_1.LuUsers />
                },
                {
                    name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Operators"], ["Operators"]))),
                    to: path_1.path.to.operators,
                    icon: <lu_1.LuMonitor />,
                    setting: "consoleEnabled"
                },
                // {
                //   name: t`Customers`,
                //   to: path.to.customerAccounts,
                //   icon: <LuSquareUser />,
                // },
                // {
                //   name: t`Suppliers`,
                //   to: path.to.supplierAccounts,
                //   icon: <LuContainer />,
                // },
                {
                    name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Groups"], ["Groups"]))),
                    to: path_1.path.to.groups,
                    icon: <lu_1.LuGroup />
                }
            ]
        },
        {
            name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Configure"], ["Configure"]))),
            routes: [
                {
                    name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Employee Types"], ["Employee Types"]))),
                    to: path_1.path.to.employeeTypes,
                    icon: <lu_1.LuFileBadge2 />
                }
            ]
        }
    ];
    return {
        groups: usersRoutes.map(function (group) { return (__assign(__assign({}, group), { routes: group.routes.filter(function (route) {
                return !route.setting ||
                    settings[route.setting] === true;
            }) })); })
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
