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
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var people_1 = require("~/stores/people");
var path_1 = require("~/utils/path");
var quality_models_1 = require("../../quality.models");
var IssueStatus_1 = require("../Issue/IssueStatus");
var ActionsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, issueTypes = _a.issueTypes, requiredActions = _a.requiredActions, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var people = (0, people_1.usePeople)()[0];
    var items = (0, stores_1.useItems)()[0];
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "readableNonConformanceId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Issue"], ["Issue"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.issueActions(row.original.nonConformanceId)}>
              <div className="flex flex-col gap-0">
                <span className="text-sm font-medium">
                  {row.original.readableNonConformanceId}
                </span>
                <span className="text-xs text-muted-foreground">
                  {row.original.nonConformanceName}
                </span>
              </div>
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "actionType",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Action Type"], ["Action Type"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <Enumerable_1.Enumerable value={row.original.actionType}/>;
                },
                meta: {
                    icon: <lu_1.LuFileText />,
                    filter: {
                        type: "static",
                        options: requiredActions.map(function (action) { return ({
                            label: action.name,
                            value: action.name
                        }); })
                    }
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Action Status"], ["Action Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <ActionStatus status={row.original.status}/>;
                },
                meta: {
                    icon: <lu_1.LuCircleGauge />,
                    filter: {
                        type: "static",
                        options: quality_models_1.nonConformanceTaskStatus.map(function (status) { return ({
                            label: <ActionStatus status={status}/>,
                            value: status
                        }); })
                    }
                }
            },
            {
                accessorKey: "assignee",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.assignee}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                id: "items",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Items"], ["Items"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<span className="flex gap-2 items-center flex-wrap py-2">
              {((_b = row.original.items) !== null && _b !== void 0 ? _b : []).map(function (i) {
                            var item = items.find(function (x) { return x.id === i; });
                            if (!item)
                                return null;
                            return (<react_1.Badge variant="outline" key={item === null || item === void 0 ? void 0 : item.id}>
                    {item === null || item === void 0 ? void 0 : item.readableIdWithRevision}
                  </react_1.Badge>);
                        })}
            </span>);
                },
                meta: {
                    icon: <lu_1.LuSquareStack />,
                    filter: {
                        type: "static",
                        options: items.map(function (item) { return ({
                            value: item.id,
                            label: (<react_1.Badge variant="outline">{item.readableIdWithRevision}</react_1.Badge>)
                        }); }),
                        isArray: true
                    }
                }
            },
            {
                accessorKey: "dueDate",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Due Date"], ["Due Date"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var isOverdue = 
                    // @ts-ignore
                    !["Completed", "Skipped"].includes(row.original.status) &&
                        row.original.nonConformanceStatus !== "Closed" &&
                        row.original.dueDate &&
                        new Date(row.original.dueDate) < new Date();
                    return (<span className={isOverdue ? "text-red-500" : ""}>
                {formatDate(row.original.dueDate)}
              </span>);
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "nonConformanceStatus",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Issue Status"], ["Issue Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.nonConformanceStatus && (<IssueStatus_1.default status={row.original.nonConformanceStatus}/>);
                },
                meta: {
                    icon: <lu_1.LuOctagonX />
                }
            },
            {
                accessorKey: "nonConformanceTypeName",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Issue Type"], ["Issue Type"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<Enumerable_1.Enumerable value={row.original.nonConformanceTypeName}/>);
                },
                meta: {
                    icon: <lu_1.LuOctagonX />,
                    filter: {
                        type: "static",
                        options: issueTypes.map(function (type) { return ({
                            label: type.name,
                            value: type.name
                        }); })
                    }
                }
            },
            {
                accessorKey: "dueDate",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Due Date"], ["Due Date"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatDate(row.original.dueDate);
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "completedDate",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Completed Date"], ["Completed Date"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatDate(row.original.completedDate);
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Created"], ["Created"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatDate(row.original.createdAt);
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        return defaultColumns;
    }, [requiredActions, people, items, issueTypes, t, formatDate]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem disabled={!permissions.can("update", "quality")} onClick={function () {
                navigate("".concat(path_1.path.to.issue(row.nonConformanceId)));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              <macro_1.Trans>View Issue</macro_1.Trans>
            </react_1.MenuItem>
          </>);
    }, [navigate, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} renderContextMenu={renderContextMenu} title={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Actions"], ["Actions"])))} table="nonConformanceActionTask" withSavedView/>);
});
ActionsTable.displayName = "ActionsTable";
exports.default = ActionsTable;
function ActionStatus(_a) {
    var status = _a.status;
    switch (status) {
        case "Pending":
            return (<react_1.Status color="yellow">
          <macro_1.Trans>Pending</macro_1.Trans>
        </react_1.Status>);
        case "In Progress":
            return (<react_1.Status color="green">
          <macro_1.Trans>In Progress</macro_1.Trans>
        </react_1.Status>);
        case "Completed":
            return (<react_1.Status color="blue">
          <macro_1.Trans>Completed</macro_1.Trans>
        </react_1.Status>);
        case "Skipped":
            return (<react_1.Status color="gray">
          <macro_1.Trans>Skipped</macro_1.Trans>
        </react_1.Status>);
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
