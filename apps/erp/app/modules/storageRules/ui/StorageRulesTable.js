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
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var path_1 = require("~/utils/path");
var SurfaceChips_1 = require("./SurfaceChips");
var TARGET_TYPE_LABELS = {
    item: "Storage",
    workCenter: "Work center"
};
var StorageRulesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("storageRule");
    var rows = (0, react_2.useMemo)(function () { return data; }, [data]);
    var columns = (0, react_2.useMemo)(function () {
        var defaults = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={"".concat(path_1.path.to.storageRule(row.original.id), "?").concat(params.toString())}>
            <Enumerable_1.Enumerable value={row.original.name}/>
          </components_1.Hyperlink>);
                },
                meta: { icon: <lu_1.LuShieldCheck /> }
            },
            {
                accessorKey: "targetType",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Target"], ["Target"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.Badge variant="secondary">
            {TARGET_TYPE_LABELS[row.original.targetType]}
          </react_1.Badge>);
                }
            },
            {
                accessorKey: "severity",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Severity"], ["Severity"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.severity === "error" ? (<react_1.Badge variant="red">
              <macro_1.Trans>Error</macro_1.Trans>
            </react_1.Badge>) : (<react_1.Badge variant="yellow">
              <macro_1.Trans>Warn</macro_1.Trans>
            </react_1.Badge>);
                }
            },
            {
                accessorKey: "surfaces",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Surfaces"], ["Surfaces"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<SurfaceChips_1.default surfaces={row.original.surfaces} targetType={row.original.targetType}/>);
                }
            },
            {
                accessorKey: "active",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.active ? (<react_1.Status color="green">
              <macro_1.Trans>Active</macro_1.Trans>
            </react_1.Status>) : (<react_1.Status color="gray">
              <macro_1.Trans>Inactive</macro_1.Trans>
            </react_1.Status>);
                }
            },
            {
                accessorKey: "assignmentCount",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Items"], ["Items"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<span className="tabular-nums text-muted-foreground">
            {(_b = row.original.assignmentCount) !== null && _b !== void 0 ? _b : 0}
          </span>);
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaults, true), customColumns, true);
    }, [customColumns, params, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) { return (<>
        <react_1.MenuItem disabled={!permissions.can("update", "settings")} onClick={function () {
            navigate("".concat(path_1.path.to.storageRule(row.id), "?").concat(params.toString()));
        }}>
          <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
          <macro_1.Trans>Edit Rule</macro_1.Trans>
        </react_1.MenuItem>
        <react_1.MenuItem disabled={!permissions.can("delete", "settings")} destructive onClick={function () {
            navigate("".concat(path_1.path.to.deleteStorageRule(row.id), "?").concat(params.toString()));
        }}>
          <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
          <macro_1.Trans>Delete Rule</macro_1.Trans>
        </react_1.MenuItem>
      </>); }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "settings") && (<components_1.New label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Rule"], ["Rule"])))} to={"".concat(path_1.path.to.newStorageRule, "?").concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Storage Rules"], ["Storage Rules"])))}/>);
});
StorageRulesTable.displayName = "StorageRulesTable";
exports.default = StorageRulesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
