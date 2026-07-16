"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInventoryNavigation = useInventoryNavigation;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function useInventoryNavigation() {
    (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId)
        throw new Error("itemId not found");
    return [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Details"], ["Details"]))),
            to: path_1.path.to.inventoryItem(itemId),
            role: ["employee"],
            icon: lu_1.LuFileText,
            shortcut: "Command+Shift+d"
        },
        {
            name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Activity"], ["Activity"]))),
            to: path_1.path.to.inventoryItemActivity(itemId),
            role: ["employee"],
            icon: lu_1.LuChartBar,
            shortcut: "Command+Shift+a"
        }
    ];
}
var templateObject_1, templateObject_2;
