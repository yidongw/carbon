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
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var path_1 = require("~/utils/path");
var DepartmentsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var rows = data.map(function (row) {
        var _a, _b;
        return (__assign(__assign({}, row), { parentDepartment: (_b = (Array.isArray(row.department)
                ? row.department.map(function (d) { return d.name; }).join(", ")
                : // @ts-expect-error TS2339 - TODO: fix type
                    (_a = row.department) === null || _a === void 0 ? void 0 : _a.name)) !== null && _b !== void 0 ? _b : "" }));
    });
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("department");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Department"], ["Department"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id}>
            <Enumerable_1.Enumerable value={row.original.name}/>
          </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBuilding />
                }
            },
            {
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Sub-Departments"], ["Sub-Departments"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack>
            {/* @ts-expect-error TS7006 */}
            {row.original.parentDepartment.split(", ").map(function (v) { return (<Enumerable_1.Enumerable key={v} value={v}/>); })}
          </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuBuilding />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [customColumns, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.department(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Department</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "people")} onClick={function () {
                navigate("".concat(path_1.path.to.deleteDepartment(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Department</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={rows} count={count} columns={columns} primaryAction={permissions.can("create", "people") && (<components_1.New label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Department"], ["Department"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Departments"], ["Departments"])))}/>);
});
DepartmentsTable.displayName = "DepartmentsTable";
exports.default = DepartmentsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
