"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStyleNavigation = useStyleNavigation;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var styleNavigationConfig_1 = require("./styleNavigationConfig");
function useStyleNavigation() {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId)
        throw new Error("itemId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.style(itemId));
    var navigationKeys = (0, styleNavigationConfig_1.getStyleNavigationKeys)({
        itemTrackingType: (_a = routeData === null || routeData === void 0 ? void 0 : routeData.styleSummary) === null || _a === void 0 ? void 0 : _a.itemTrackingType
    });
    var items = {
        details: {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Details"], ["Details"]))),
            to: path_1.path.to.styleDetails(itemId),
            icon: lu_1.LuFileText,
            shortcut: "Command+Shift+d"
        },
        accounting: {
            name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Accounting"], ["Accounting"]))),
            to: path_1.path.to.styleCosting(itemId),
            icon: lu_1.LuTags,
            shortcut: "Command+Shift+a"
        },
        planning: {
            name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Planning"], ["Planning"]))),
            to: path_1.path.to.stylePlanning(itemId),
            icon: lu_1.LuChartLine,
            shortcut: "Command+Shift+p"
        },
        inventory: {
            name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Inventory"], ["Inventory"]))),
            to: path_1.path.to.styleInventory(itemId),
            icon: lu_1.LuBox,
            shortcut: "Command+Shift+i"
        },
        sales: {
            name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Sales"], ["Sales"]))),
            to: path_1.path.to.styleSales(itemId),
            icon: lu_1.LuReceipt,
            shortcut: "Command+Shift+x"
        }
    };
    return navigationKeys.map(function (key) { return items[key]; });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
