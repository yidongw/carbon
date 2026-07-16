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
var JobRulesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var submit = (0, react_router_1.useSubmit)();
    var permissions = (0, hooks_1.usePermissions)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var columns = (0, react_2.useMemo)(function () { return [
        {
            accessorKey: "priority",
            header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Priority"], ["Priority"]))),
            cell: function (_a) {
                var _b;
                var row = _a.row;
                return (<span className="tabular-nums text-muted-foreground text-sm">
            #{(_b = row.original.priority) !== null && _b !== void 0 ? _b : 0}
          </span>);
            },
            size: 80
        },
        {
            accessorKey: "name",
            header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Rule Name"], ["Rule Name"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<div>
            {row.original.id ? (<components_1.Hyperlink to={path_1.path.to.jobRule(row.original.id)}>
                <div className="font-medium text-sm">{row.original.name}</div>
              </components_1.Hyperlink>) : (<div className="font-medium text-sm">{row.original.name}</div>)}
            {row.original.description && (<div className="text-xs text-muted-foreground truncate max-w-64">
                {row.original.description}
              </div>)}
          </div>);
            },
            meta: { icon: <lu_1.LuShieldCheck /> }
        },
        {
            accessorKey: "targetGroupName",
            header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Assigned Group"], ["Assigned Group"]))),
            cell: function (_a) {
                var _b;
                var row = _a.row;
                return (<react_1.HStack spacing={1}>
            <lu_1.LuUsers className="size-3.5 text-muted-foreground"/>
            <span className="text-sm">
              {(_b = row.original.targetGroupName) !== null && _b !== void 0 ? _b : "—"}
            </span>
          </react_1.HStack>);
            },
            meta: { icon: <lu_1.LuUsers /> }
        },
        {
            id: "conditionCount",
            header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Conditions"], ["Conditions"]))),
            cell: function (_a) {
                var row = _a.row;
                var conds = Array.isArray(row.original.conditions)
                    ? row.original.conditions
                    : [];
                return (<react_1.Badge variant="outline">
              {conds.length} {conds.length === 1 ? t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["condition"], ["condition"]))) : t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["conditions"], ["conditions"])))}
            </react_1.Badge>);
            }
        },
        {
            accessorKey: "active",
            header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Active"], ["Active"]))),
            cell: function (_a) {
                var _b;
                var row = _a.row;
                return (<react_1.Switch checked={(_b = row.original.active) !== null && _b !== void 0 ? _b : false} onCheckedChange={function (checked) {
                        if (!row.original.id || !permissions.can("update", "production"))
                            return;
                        var formData = new FormData();
                        formData.append("id", row.original.id);
                        formData.append("active", checked ? "on" : "off");
                        formData.append("_action", "toggle");
                        submit(formData, {
                            method: "post",
                            action: path_1.path.to.jobRule(row.original.id)
                        });
                    }} disabled={!permissions.can("update", "production")}/>);
            }
        }
    ]; }, [t, permissions, submit]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        if (!row.id)
            return null;
        return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "production")} onClick={function () {
                return navigate("".concat(path_1.path.to.jobRule(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Rule</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "production")} onClick={function () {
                return navigate("".concat(path_1.path.to.deleteJobRule(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Rule</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} count={count} columns={columns} getRowHref={function (row) { return (row.id ? path_1.path.to.jobRule(row.id) : undefined); }} primaryAction={<react_1.HStack spacing={2}>
          <react_1.Button size="sm" variant="secondary" leftIcon={<lu_1.LuFlaskConical />} onClick={function () {
                return navigate("".concat(path_1.path.to.jobRulesSimulate, "?").concat(params.toString()));
            }}>
            <macro_1.Trans>Simulate</macro_1.Trans>
          </react_1.Button>
          {permissions.can("create", "production") && (<components_1.New label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Rule"], ["Rule"])))} to={"new?".concat(params.toString())}/>)}
        </react_1.HStack>} renderContextMenu={renderContextMenu} withSearch withPagination title={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Assignment Rules"], ["Assignment Rules"])))}/>);
});
JobRulesTable.displayName = "JobRulesTable";
exports.default = JobRulesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
