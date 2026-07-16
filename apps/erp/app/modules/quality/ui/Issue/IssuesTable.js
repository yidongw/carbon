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
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var items_1 = require("~/stores/items");
var people_1 = require("~/stores/people");
var path_1 = require("~/utils/path");
var quality_models_1 = require("../../quality.models");
var IssueIcons_1 = require("./IssueIcons");
var IssueStatus_1 = require("./IssueStatus");
// Issue inline edits go through the shared issue bulk-update action.
var ISSUE_UPDATE = {
    action: path_1.path.to.bulkUpdateIssue,
    idKey: "ids"
};
var IssuesTable = (0, react_2.memo)(function (_a) {
    var _b;
    var data = _a.data, types = _a.types, count = _a.count;
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var permissions = (0, hooks_1.usePermissions)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(null), selectedIssue = _c[0], setSelectedIssue = _c[1];
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("nonConformance");
    var locations = (0, Location_1.useLocations)();
    var people = (0, people_1.usePeople)()[0];
    var items = (0, items_1.useItems)()[0];
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "nonConformanceId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.issue(row.original.id)}>
            <div className="flex flex-col gap-0">
              <span className="text-sm font-medium">
                {row.original.nonConformanceId}
              </span>
              <span className="text-xs text-muted-foreground">
                {row.original.name}
              </span>
            </div>
          </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <IssueStatus_1.default status={row.original.status}/>;
                },
                meta: {
                    icon: <lu_1.LuCircleGauge />,
                    filter: {
                        type: "static",
                        options: quality_models_1.nonConformanceStatus.map(function (status) { return ({
                            label: status,
                            value: status
                        }); })
                    }
                }
            },
            {
                accessorKey: "nonConformanceTypeId",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<Enumerable_1.Enumerable value={(_c = (_b = types.find(function (type) { return type.id === row.original.nonConformanceTypeId; })) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : null}/>);
                },
                meta: {
                    icon: <lu_1.LuOctagonX />,
                    filter: {
                        type: "static",
                        options: types.map(function (type) { return ({
                            label: type.name,
                            value: type.id
                        }); })
                    }
                }
            },
            {
                accessorKey: "priority",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Priority"], ["Priority"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "priority",
                    update: ISSUE_UPDATE,
                    value: function (r) { return r.priority; },
                    options: quality_models_1.nonConformancePriority.map(function (priority) { return ({
                        value: priority,
                        label: (<span className="flex gap-2 items-center">
                {(0, IssueIcons_1.getPriorityIcon)(priority, false)}
                {priority}
              </span>)
                    }); }),
                    renderInline: function (v) {
                        var _a;
                        return (<span className="flex gap-2 items-center">
              {(0, IssueIcons_1.getPriorityIcon)((_a = v) !== null && _a !== void 0 ? _a : "Low", false)}
              {v}
            </span>);
                    }
                }),
                meta: {
                    icon: <lu_1.LuChartNoAxesColumnIncreasing />,
                    filter: {
                        type: "static",
                        options: quality_models_1.nonConformancePriority.map(function (priority) { return ({
                            label: priority,
                            value: priority
                        }); })
                    }
                }
            },
            {
                accessorKey: "source",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Source"], ["Source"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "source",
                    update: ISSUE_UPDATE,
                    value: function (r) { return r.source; },
                    options: quality_models_1.nonConformanceSource.map(function (source) { return ({
                        value: source,
                        label: (<span className="flex gap-2 items-center">
                {(0, IssueIcons_1.getSourceIcon)(source, false)}
                {source}
              </span>)
                    }); }),
                    renderInline: function (v) {
                        var _a;
                        return (<span className="flex gap-2 items-center">
              {(0, IssueIcons_1.getSourceIcon)((_a = v) !== null && _a !== void 0 ? _a : "Internal", false)}
              {v}
            </span>);
                    }
                }),
                meta: {
                    icon: <lu_1.LuDna />,
                    filter: {
                        type: "static",
                        options: quality_models_1.nonConformanceSource.map(function (source) { return ({
                            label: source,
                            value: source
                        }); })
                    }
                }
            },
            {
                accessorKey: "containmentStatus",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Containment"], ["Containment"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var status = (_b = row.original.containmentStatus) !== null && _b !== void 0 ? _b : "Uncontained";
                    return (<react_1.Badge variant={status === "Contained" ? "green" : "orange"}>
              {status}
            </react_1.Badge>);
                },
                meta: {
                    icon: <lu_1.LuShieldCheck />,
                    filter: {
                        type: "static",
                        options: [
                            { label: "Contained", value: "Contained" },
                            { label: "Uncontained", value: "Uncontained" }
                        ]
                    }
                }
            },
            {
                accessorKey: "locationId",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<Enumerable_1.Enumerable value={(_c = (_b = locations.find(function (location) { return location.value === row.original.locationId; })) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : null}/>);
                },
                meta: {
                    icon: <lu_1.LuMap />,
                    filter: {
                        type: "static",
                        options: locations.map(function (location) { return ({
                            label: location.label,
                            value: location.value
                        }); })
                    }
                }
            },
            {
                accessorKey: "assignee",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.id) !== null && _b !== void 0 ? _b : ""} table="nonConformance" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
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
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Items"], ["Items"]))),
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
                accessorKey: "openDate",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Open Date"], ["Open Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "openDate",
                    update: ISSUE_UPDATE,
                    value: function (r) { return r.openDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "closeDate",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Closed Date"], ["Closed Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "closeDate",
                    update: ISSUE_UPDATE,
                    value: function (r) { return r.closeDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "createdBy",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Created By"], ["Created By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.createdBy}/>);
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
                accessorKey: "createdAt",
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [customColumns, items, locations, people, types, t, formatDate]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "quality")} onClick={function () {
                navigate("".concat(path_1.path.to.issue(row.id)));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            Edit Issue
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "quality")} onClick={function () {
                (0, react_dom_1.flushSync)(function () {
                    setSelectedIssue(row);
                });
                deleteDisclosure.onOpen();
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            Delete Issue
          </react_1.MenuItem>
        </>);
    }, [navigate, permissions, deleteDisclosure]);
    return (<>
      <components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "quality") && (<components_1.New label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Issue"], ["Issue"])))} to={path_1.path.to.newIssue}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Issues"], ["Issues"])))} table="nonConformance" withSavedView/>
      {deleteDisclosure.isOpen && selectedIssue && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteIssue(selectedIssue.id)} isOpen onCancel={function () {
                setSelectedIssue(null);
                deleteDisclosure.onClose();
            }} onSubmit={function () {
                setSelectedIssue(null);
                deleteDisclosure.onClose();
            }} name={(_b = selectedIssue.name) !== null && _b !== void 0 ? _b : "issue"} text={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Are you sure you want to delete this issue?"], ["Are you sure you want to delete this issue?"])))}/>)}
    </>);
});
IssuesTable.displayName = "IssuesTable";
exports.default = IssuesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16;
