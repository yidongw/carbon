"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var path_1 = require("~/utils/path");
var EmployeeTypesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Employee Type"], ["Employee Type"]))),
                cell: function (_a) {
                    var row = _a.row, getValue = _a.getValue;
                    return (<components_1.Hyperlink to={row.original.id}>
            <Enumerable_1.Enumerable value={row.original.name} className="cursor-pointer"/>
          </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuUsers />
                }
            }
        ];
    }, [t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.employeeAccounts, "?filter=employeeTypeId:eq:").concat(row.id));
            }}>
            <react_1.MenuIcon icon={<bs_1.BsPeopleFill />}/>
            <macro_1.Trans>View Employees</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem disabled={!permissions.can("update", "users")} onClick={function () {
                navigate("".concat(path_1.path.to.employeeType(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Employee Type</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={row.protected || !permissions.can("delete", "users")} onClick={function () {
                navigate("".concat(path_1.path.to.deleteEmployeeType(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Employee Type</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "users") && (<components_1.New label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Employee Type"], ["Employee Type"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Employee Types"], ["Employee Types"])))}/>);
});
EmployeeTypesTable.displayName = "EmployeeTypesTable";
exports.default = EmployeeTypesTable;
var templateObject_1, templateObject_2, templateObject_3;
