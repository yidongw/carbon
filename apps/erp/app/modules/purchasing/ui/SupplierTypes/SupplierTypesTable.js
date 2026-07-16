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
var SupplierTypesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var params = (0, hooks_1.useUrlParams)()[0];
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("supplierType");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Supplier Type"], ["Supplier Type"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<Enumerable_1.Enumerable value={row.original.name} onClick={function () { return navigate(row.original.id); }} className="cursor-pointer"/>);
                },
                meta: {
                    icon: <lu_1.LuShapes />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [navigate, customColumns, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.suppliers, "?filter=type:eq:").concat(row.name));
            }}>
            <react_1.MenuIcon icon={<bs_1.BsPeopleFill />}/>
            <macro_1.Trans>View Suppliers</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem disabled={row.protected || !permissions.can("update", "purchasing")} onClick={function () {
                navigate("".concat(path_1.path.to.supplierType(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Supplier Type</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={row.protected || !permissions.can("delete", "purchasing")} onClick={function () {
                navigate("".concat(path_1.path.to.deleteSupplierType(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Supplier Type</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "purchasing") && (<components_1.New label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Supplier Type"], ["Supplier Type"])))} to={"".concat(path_1.path.to.newSupplierType, "?").concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Supplier Types"], ["Supplier Types"])))}/>);
});
SupplierTypesTable.displayName = "SupplierTypesTable";
exports.default = SupplierTypesTable;
var templateObject_1, templateObject_2, templateObject_3;
