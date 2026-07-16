"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMaterialNavigation = useMaterialNavigation;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function useMaterialNavigation() {
    var _a, _b;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId)
        throw new Error("itemId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.material(itemId));
    if (!((_a = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _a === void 0 ? void 0 : _a.itemTrackingType))
        throw new Error("Could not find itemTrackingType in routeData");
    var itemTrackingType = routeData.materialSummary.itemTrackingType;
    return [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Details"], ["Details"]))),
            to: path_1.path.to.materialDetails(itemId),
            icon: lu_1.LuFileText,
            shortcut: "Command+Shift+d"
        },
        {
            name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Purchasing"], ["Purchasing"]))),
            to: path_1.path.to.materialPurchasing(itemId),
            role: ["employee", "supplier"],
            permission: "purchasing",
            icon: lu_1.LuShoppingCart,
            shortcut: "Command+Shift+p"
        },
        {
            name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Accounting"], ["Accounting"]))),
            to: path_1.path.to.materialCosting(itemId),
            role: ["employee"],
            permission: "purchasing",
            icon: lu_1.LuTags,
            shortcut: "Command+Shift+a"
        },
        {
            name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Planning"], ["Planning"]))),
            to: path_1.path.to.materialPlanning(itemId),
            isDisabled: itemTrackingType === "Non-Inventory",
            role: ["employee"],
            icon: lu_1.LuChartLine,
            shortcut: "Command+Shift+p"
        },
        {
            name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Inventory"], ["Inventory"]))),
            to: path_1.path.to.materialInventory(itemId),
            isDisabled: itemTrackingType === "Non-Inventory",
            role: ["employee", "supplier"],
            icon: lu_1.LuBox,
            shortcut: "Command+Shift+i"
        },
        {
            name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Quality"], ["Quality"]))),
            to: path_1.path.to.materialQuality(itemId),
            isDisabled: !((_b = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _b === void 0 ? void 0 : _b.requiresInspection),
            role: ["employee"],
            permission: "quality",
            icon: lu_1.LuClipboardCheck,
            shortcut: "Command+Shift+q"
        }
    ].filter(function (item) {
        return !item.isDisabled &&
            (item.role === undefined ||
                item.role.some(function (role) { return permissions.is(role); })) &&
            (item.permission === undefined ||
                permissions.can("view", item.permission));
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
