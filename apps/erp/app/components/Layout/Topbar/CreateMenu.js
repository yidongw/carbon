"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function useCreate() {
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var result = (0, react_2.useMemo)(function () {
        var links = [];
        if (permissions.can("create", "parts")) {
            links.push({
                name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Part"], ["Part"]))),
                to: path_1.path.to.newPart,
                icon: <lu_1.LuSquareStack />
            });
        }
        if (permissions.can("create", "quality")) {
            links.push({
                name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Issue"], ["Issue"]))),
                to: path_1.path.to.newIssue,
                icon: <lu_1.LuShieldX />
            });
        }
        if (permissions.can("create", "production")) {
            links.push({
                name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Job"], ["Job"]))),
                to: path_1.path.to.newJob,
                icon: <lu_1.LuCirclePlay />
            });
        }
        if (permissions.can("create", "production")) {
            links.push({
                name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Maintenance"], ["Maintenance"]))),
                to: path_1.path.to.newMaintenanceDispatch,
                icon: <lu_1.LuWrench />
            });
        }
        if (permissions.can("create", "purchasing")) {
            links.push({
                name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Purchase Order"], ["Purchase Order"]))),
                to: path_1.path.to.newPurchaseOrder,
                icon: <lu_1.LuShoppingCart />
            });
        }
        if (permissions.can("create", "purchasing")) {
            links.push({
                name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Supplier"], ["Supplier"]))),
                to: path_1.path.to.newSupplier,
                icon: <lu_1.LuContainer />
            });
        }
        if (permissions.can("create", "sales")) {
            links.push({
                name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Customer"], ["Customer"]))),
                to: path_1.path.to.newCustomer,
                icon: <lu_1.LuSquareUser />
            });
            links.push({
                name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["RFQ"], ["RFQ"]))),
                to: path_1.path.to.newSalesRFQ,
                icon: <ri_1.RiProgress2Line />
            });
            links.push({
                name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Quote"], ["Quote"]))),
                to: path_1.path.to.newQuote,
                icon: <ri_1.RiProgress4Line />
            });
            links.push({
                name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Sales Order"], ["Sales Order"]))),
                to: path_1.path.to.newSalesOrder,
                icon: <ri_1.RiProgress8Line />
            });
        }
        if (permissions.can("create", "users")) {
            links.push({
                name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Employee"], ["Employee"]))),
                to: path_1.path.to.newEmployee,
                icon: <lu_1.LuUsers />
            });
        }
        return links;
    }, [permissions, t]);
    return result.sort(function (a, b) { return a.name.localeCompare(b.name); });
}
var CreateMenu = function (_a) {
    var trigger = _a.trigger;
    var createLinks = useCreate();
    if (!createLinks.length)
        return null;
    return (<react_1.DropdownMenu>
      <react_1.DropdownMenuTrigger asChild>{trigger}</react_1.DropdownMenuTrigger>
      <react_1.DropdownMenuContent align="center" className="w-48">
        {createLinks.map(function (link) { return (<react_1.DropdownMenuItem key={link.to} asChild>
            <react_router_1.Link to={link.to}>
              {link.icon && <react_1.DropdownMenuIcon icon={link.icon}/>}
              {link.name}
            </react_router_1.Link>
          </react_1.DropdownMenuItem>); })}
      </react_1.DropdownMenuContent>
    </react_1.DropdownMenu>);
};
exports.default = CreateMenu;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
