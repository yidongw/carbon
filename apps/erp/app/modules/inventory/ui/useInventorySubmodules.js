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
exports.default = useInventorySubmodules;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
var useSavedViews_1 = require("~/hooks/useSavedViews");
var path_1 = require("~/utils/path");
function useInventorySubmodules() {
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var addSavedViewsToRoutes = (0, useSavedViews_1.useSavedViews)().addSavedViewsToRoutes;
    var inventoryRoutes = [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Manage"], ["Manage"]))),
            routes: [
                {
                    name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Picking Lists"], ["Picking Lists"]))),
                    to: path_1.path.to.pickingLists,
                    icon: <lu_1.LuClipboardList />
                },
                {
                    name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Receipts"], ["Receipts"]))),
                    to: path_1.path.to.receipts,
                    icon: <lu_1.LuHandCoins />,
                    table: "receipt"
                },
                {
                    name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Shipments"], ["Shipments"]))),
                    to: path_1.path.to.shipments,
                    icon: <lu_1.LuTruck />,
                    table: "shipment"
                },
                {
                    name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Stock Transfers"], ["Stock Transfers"]))),
                    to: path_1.path.to.stockTransfers,
                    icon: <lu_1.LuListChecks />,
                    table: "stockTransfer"
                },
                {
                    name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Warehouse Transfers"], ["Warehouse Transfers"]))),
                    to: path_1.path.to.warehouseTransfers,
                    icon: <lu_1.LuArrowRightLeft />,
                    table: "warehouseTransfer"
                }
            ]
        },
        {
            name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Track"], ["Track"]))),
            routes: [
                {
                    name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Kanbans"], ["Kanbans"]))),
                    to: path_1.path.to.kanbans,
                    role: "employee",
                    icon: <lu_1.LuScanQrCode />
                },
                {
                    name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Quantities"], ["Quantities"]))),
                    to: path_1.path.to.inventoryQuantities,
                    role: "employee",
                    icon: <lu_1.LuTally5 />,
                    table: "inventory"
                },
                {
                    name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Tracked Entities"], ["Tracked Entities"]))),
                    to: path_1.path.to.trackedEntities,
                    role: "employee",
                    icon: <lu_1.LuQrCode />
                },
                {
                    name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Traceability"], ["Traceability"]))),
                    to: path_1.path.to.traceability,
                    role: "employee",
                    icon: <lu_1.LuNetwork />
                }
            ]
        },
        {
            name: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Configure"], ["Configure"]))),
            routes: [
                {
                    name: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Storage Units"], ["Storage Units"]))),
                    to: path_1.path.to.storageUnits,
                    role: "employee",
                    icon: <lu_1.LuWarehouse />,
                    table: "storageUnit"
                },
                {
                    name: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Storage Types"], ["Storage Types"]))),
                    to: path_1.path.to.storageTypes,
                    role: "employee",
                    icon: <lu_1.LuTag />,
                    table: "storageType"
                },
                {
                    name: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Storage Rules"], ["Storage Rules"]))),
                    to: path_1.path.to.storageRules,
                    role: "employee",
                    icon: <lu_1.LuShieldCheck />
                },
                {
                    name: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Shipping Methods"], ["Shipping Methods"]))),
                    to: path_1.path.to.shippingMethods,
                    role: "employee",
                    icon: <lu_1.LuTruck />
                }
            ]
        }
    ];
    return {
        groups: inventoryRoutes
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
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16;
