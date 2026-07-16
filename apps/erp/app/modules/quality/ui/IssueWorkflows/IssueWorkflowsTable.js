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
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var IssueIcons_1 = require("../Issue/IssueIcons");
var IssueWorkflowsTable = (0, react_2.memo)(function (_a) {
    var _b;
    var data = _a.data, count = _a.count;
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(null), selectedIssueWorkflow = _c[0], setSelectedIssueWorkflow = _c[1];
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<div className="flex flex-col gap-0">
              <components_1.Hyperlink to={path_1.path.to.issueWorkflow(row.original.id)}>
                {row.original.name}
              </components_1.Hyperlink>
            </div>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "source",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Default Source"], ["Default Source"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<div className="flex gap-2 items-center">
              {(0, IssueIcons_1.getSourceIcon)(row.original.source, false)}
              {row.original.source}
            </div>);
                },
                meta: {
                    icon: <lu_1.LuDna />
                }
            },
            {
                accessorKey: "priority",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Default Priority"], ["Default Priority"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<div className="flex gap-2 items-center">
              {(0, IssueIcons_1.getPriorityIcon)(row.original.priority, false)}
              {row.original.priority}
            </div>);
                },
                meta: {
                    icon: <lu_1.LuChartNoAxesColumnIncreasing />
                }
            }
        ];
        return __spreadArray([], defaultColumns, true);
    }, [t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem disabled={!permissions.can("update", "quality")} onClick={function () {
                navigate("".concat(path_1.path.to.issueWorkflow(row.id)));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              Edit Template
            </react_1.MenuItem>
            <react_1.MenuItem destructive disabled={!permissions.can("delete", "quality")} onClick={function () {
                (0, react_dom_1.flushSync)(function () {
                    setSelectedIssueWorkflow(row);
                });
                deleteDisclosure.onOpen();
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              Delete Template
            </react_1.MenuItem>
          </>);
    }, [navigate, permissions, deleteDisclosure]);
    return (<>
        <components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "quality") && (<components_1.New label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Issue Workflow"], ["Issue Workflow"])))} to={path_1.path.to.newIssueWorkflow}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Issue Workflows"], ["Issue Workflows"])))} table="nonConformanceWorkflow" withSavedView/>
        {deleteDisclosure.isOpen && selectedIssueWorkflow && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteIssueWorkflow(selectedIssueWorkflow.id)} isOpen onCancel={function () {
                setSelectedIssueWorkflow(null);
                deleteDisclosure.onClose();
            }} onSubmit={function () {
                setSelectedIssueWorkflow(null);
                deleteDisclosure.onClose();
            }} name={(_b = selectedIssueWorkflow.name) !== null && _b !== void 0 ? _b : "issue workflow"} text={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Are you sure you want to delete this issue workflow?"], ["Are you sure you want to delete this issue workflow?"])))}/>)}
      </>);
});
IssueWorkflowsTable.displayName = "IssueWorkflowsTable";
exports.default = IssueWorkflowsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
