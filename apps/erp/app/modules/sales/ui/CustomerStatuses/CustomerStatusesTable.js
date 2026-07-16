"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var path_1 = require("~/utils/path");
var CustomerStatusesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var _b = (0, macro_1.useLingui)(), t = _b.t, i18n = _b.i18n;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var translateStatus = (0, react_2.useCallback)(function (value) { return i18n._(value); }, [i18n]);
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("customerStatus");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Customer Status"], ["Customer Status"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id}>
              <Enumerable_1.Enumerable value={translateStatus((_b = row.original.name) !== null && _b !== void 0 ? _b : "")}/>
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuStar />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [customColumns, t, translateStatus]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.customers, "?filter=status:eq:").concat(row.name));
            }}>
              <react_1.MenuIcon icon={<bs_1.BsPeopleFill />}/>
              <macro_1.Trans>View Customers</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.customerStatus(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              <macro_1.Trans>Edit Customer Status</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem destructive disabled={!permissions.can("delete", "sales")} onClick={function () {
                navigate("".concat(path_1.path.to.deleteCustomerStatus(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Customer Status</macro_1.Trans>
            </react_1.MenuItem>
          </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "sales") && (<components_1.New label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Customer Status"], ["Customer Status"])))} to={"".concat(path_1.path.to.newCustomerStatus, "?").concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Customer Statuses"], ["Customer Statuses"])))}/>);
});
CustomerStatusesTable.displayName = "CustomerStatusesTable";
exports.default = CustomerStatusesTable;
var templateObject_1, templateObject_2, templateObject_3;
