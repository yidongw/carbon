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
exports.default = useInvoicingSubmodules;
var macro_1 = require("@lingui/react/macro");
var bs_1 = require("react-icons/bs");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var useInvoicingRoutes = function (t) { return [
    {
        name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Manage"], ["Manage"]))),
        routes: [
            {
                name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Purchasing"], ["Purchasing"]))),
                to: path_1.path.to.purchaseInvoices,
                role: "employee",
                icon: <bs_1.BsCartDash />
            }
            // {
            //   name: "Sales",
            //   to: path.to.salesInvoices,
            //   role: "employee",
            //   icon: <BsCartPlus />,
            // },
        ]
    }
]; };
function useInvoicingSubmodules() {
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    return {
        groups: useInvoicingRoutes(t)
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
            .map(function (group) { return (__assign(__assign({}, group), { routes: group.routes.filter(function (route) {
                if (route.role) {
                    return permissions.is(route.role);
                }
                else {
                    return true;
                }
            }) })); })
    };
}
var templateObject_1, templateObject_2;
