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
exports.default = usePurchasingSubmodules;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
var useSavedViews_1 = require("~/hooks/useSavedViews");
var path_1 = require("~/utils/path");
function usePurchasingSubmodules() {
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var addSavedViewsToRoutes = (0, useSavedViews_1.useSavedViews)().addSavedViewsToRoutes;
    var purchasingRoutes = [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Dashboard"], ["Dashboard"]))),
            routes: [
                {
                    name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Dashboard"], ["Dashboard"]))),
                    to: path_1.path.to.purchasingDashboard,
                    icon: <lu_1.LuLayoutDashboard />
                }
            ]
        },
        {
            name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Manage"], ["Manage"]))),
            routes: [
                {
                    name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Suppliers"], ["Suppliers"]))),
                    to: path_1.path.to.suppliers,
                    icon: <lu_1.LuContainer />,
                    table: "supplier"
                },
                {
                    name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["RFQs"], ["RFQs"]))),
                    to: path_1.path.to.purchasingRfqs,
                    icon: <lu_1.LuPackageSearch />,
                    table: "purchasingRfq"
                },
                {
                    name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Quotes"], ["Quotes"]))),
                    to: path_1.path.to.supplierQuotes,
                    icon: <lu_1.LuFileText />,
                    table: "supplierQuote"
                },
                {
                    name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Orders"], ["Orders"]))),
                    to: path_1.path.to.purchaseOrders,
                    icon: <lu_1.LuLayoutList />,
                    table: "purchaseOrder"
                },
                {
                    name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Invoices"], ["Invoices"]))),
                    to: path_1.path.to.purchaseInvoices,
                    icon: <lu_1.LuCreditCard />,
                    table: "purchaseInvoice",
                    permission: "invoicing"
                }
            ]
        },
        {
            name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Plan"], ["Plan"]))),
            routes: [
                {
                    name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Planning"], ["Planning"]))),
                    to: path_1.path.to.purchasingPlanning,
                    icon: <lu_1.LuSquareChartGantt />,
                    table: "purchase-planning"
                }
            ]
        },
        {
            name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Configure"], ["Configure"]))),
            routes: [
                {
                    name: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Types"], ["Types"]))),
                    to: path_1.path.to.supplierTypes,
                    role: "employee",
                    icon: <lu_1.LuStar />
                }
            ]
        }
    ];
    return {
        groups: purchasingRoutes
            .filter(function (group) {
            var filteredRoutes = group.routes.filter(function (route) {
                if (route.role) {
                    return permissions.is(route.role);
                }
                else if (route.permission) {
                    return permissions.can("view", route.permission);
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
                else if (route.permission) {
                    return permissions.can("view", route.permission);
                }
                else {
                    return true;
                }
            })
                .map(addSavedViewsToRoutes) })); })
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
