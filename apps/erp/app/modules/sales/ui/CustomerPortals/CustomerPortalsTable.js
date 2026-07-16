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
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var CustomerPortalsTable = (0, react_2.memo)(function (_a) {
    var appUrl = _a.appUrl, data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "customer.name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Customer"], ["Customer"]))),
                cell: function (_a) {
                    var _b, _c, _d, _e;
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.customer((_c = (_b = row.original.customerId) !== null && _b !== void 0 ? _b : row.original.documentId) !== null && _c !== void 0 ? _c : "")}>
              <components_1.CustomerAvatar customerId={(_e = (_d = row.original.customerId) !== null && _d !== void 0 ? _d : row.original.documentId) !== null && _e !== void 0 ? _e : ""}/>
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuSquareUser />
                }
            },
            {
                accessorKey: "portalLink",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Portal Link"], ["Portal Link"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var portalUrl = "".concat(appUrl, "/share/customer/").concat(row.original.id);
                    return (<div className="flex items-center gap-2">
                <a href={portalUrl} target="_blank" rel="noopener noreferrer" className="font-mono underline">
                  {portalUrl}
                </a>
                <react_1.Copy text={portalUrl}/>
              </div>);
                },
                meta: {
                    icon: <lu_1.LuExternalLink />
                }
            }
        ];
        return defaultColumns;
    }, [appUrl, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.customerPortal(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              <macro_1.Trans>Edit Portal</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem destructive disabled={!permissions.can("delete", "sales")} onClick={function () {
                navigate("".concat(path_1.path.to.deleteCustomerPortal(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Portal</macro_1.Trans>
            </react_1.MenuItem>
          </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "sales") && (<components_1.New label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Customer Portal"], ["Customer Portal"])))} to={"".concat(path_1.path.to.newCustomerPortal, "?").concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Customer Portals"], ["Customer Portals"])))}/>);
});
CustomerPortalsTable.displayName = "CustomerPortalsTable";
exports.default = CustomerPortalsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
