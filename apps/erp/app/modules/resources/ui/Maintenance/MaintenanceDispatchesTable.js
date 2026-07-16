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
var WorkCenters_1 = require("~/components/Form/WorkCenters");
var InlineEditor_1 = require("~/components/InlineEditor");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var resources_models_1 = require("../../resources.models");
var MaintenanceOeeImpact_1 = require("./MaintenanceOeeImpact");
var MaintenancePriority_1 = require("./MaintenancePriority");
var MaintenanceSource_1 = require("./MaintenanceSource");
var MaintenanceStatus_1 = require("./MaintenanceStatus");
// Maintenance dispatch inline edits go through the shared update action.
var MAINTENANCE_UPDATE = {
    action: path_1.path.to.maintenanceDispatchUpdate,
    idKey: "ids"
};
var MaintenanceDispatchesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, failureModes = _a.failureModes, locations = _a.locations, locationId = _a.locationId;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var workCenters = (0, WorkCenters_1.useWorkCenters)();
    var people = (0, stores_1.usePeople)()[0];
    var locationOptions = (0, react_2.useMemo)(function () {
        return locations.map(function (location) { return ({
            value: location.id,
            label: location.name
        }); });
    }, [locations]);
    var getLocationPath = function (locId) {
        return "".concat(path_1.path.to.maintenanceDispatches, "?location=").concat(locId);
    };
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "maintenanceDispatchId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Dispatch ID"], ["Dispatch ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.maintenanceDispatch(row.original.id)}>
              {row.original.maintenanceDispatchId}
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "workCenterId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Work Center"], ["Work Center"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "workCenterId",
                    update: MAINTENANCE_UPDATE,
                    value: function (r) { return r.workCenterId; },
                    clearable: true,
                    options: workCenters.map(function (wc) { return ({
                        value: wc.value,
                        label: <Enumerable_1.Enumerable value={wc.label}/>
                    }); }),
                    renderInline: function (v) {
                        var _a, _b;
                        return (<Enumerable_1.Enumerable value={(_b = (_a = workCenters.find(function (wc) { return wc.value === v; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : null}/>);
                    }
                }),
                meta: {
                    icon: <lu_1.LuBuilding />,
                    filter: {
                        type: "static",
                        options: workCenters.map(function (wc) { return ({
                            value: wc.value,
                            label: <Enumerable_1.Enumerable value={wc.label}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "source",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Source"], ["Source"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "source",
                    update: MAINTENANCE_UPDATE,
                    value: function (r) { return r.source; },
                    options: resources_models_1.maintenanceSource.map(function (source) { return ({
                        value: source,
                        label: <MaintenanceSource_1.default source={source}/>
                    }); }),
                    renderInline: function (v) { return (<MaintenanceSource_1.default source={v}/>); }
                }),
                meta: {
                    icon: <lu_1.LuDna />,
                    filter: {
                        type: "static",
                        options: resources_models_1.maintenanceSource.map(function (source) { return ({
                            value: source,
                            label: <MaintenanceSource_1.default source={source}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "status",
                    update: MAINTENANCE_UPDATE,
                    value: function (r) { return r.status; },
                    options: resources_models_1.maintenanceDispatchStatus.map(function (status) { return ({
                        value: status,
                        label: <MaintenanceStatus_1.default status={status}/>
                    }); }),
                    renderInline: function (v) { return (<MaintenanceStatus_1.default status={v}/>); }
                }),
                meta: {
                    icon: <lu_1.LuStar />,
                    filter: {
                        type: "static",
                        options: resources_models_1.maintenanceDispatchStatus.map(function (status) { return ({
                            value: status,
                            label: <MaintenanceStatus_1.default status={status}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Statuses"], ["Statuses"])))
                }
            },
            {
                accessorKey: "priority",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Priority"], ["Priority"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "priority",
                    update: MAINTENANCE_UPDATE,
                    value: function (r) { return r.priority; },
                    options: resources_models_1.maintenanceDispatchPriority.map(function (priority) { return ({
                        value: priority,
                        label: <MaintenancePriority_1.default priority={priority}/>
                    }); }),
                    renderInline: function (v) { return (<MaintenancePriority_1.default priority={v}/>); }
                }),
                meta: {
                    icon: <lu_1.LuChartNoAxesColumnIncreasing />,
                    filter: {
                        type: "static",
                        options: resources_models_1.maintenanceDispatchPriority.map(function (priority) { return ({
                            value: priority,
                            label: <MaintenancePriority_1.default priority={priority}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Priorities"], ["Priorities"])))
                }
            },
            {
                accessorKey: "oeeImpact",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["OEE Impact"], ["OEE Impact"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "oeeImpact",
                    update: MAINTENANCE_UPDATE,
                    value: function (r) { return r.oeeImpact; },
                    options: resources_models_1.oeeImpact.map(function (impact) { return ({
                        value: impact,
                        label: <MaintenanceOeeImpact_1.default oeeImpact={impact}/>
                    }); }),
                    renderInline: function (v) { return (<MaintenanceOeeImpact_1.default oeeImpact={v}/>); }
                }),
                meta: {
                    icon: <lu_1.LuChartNoAxesColumnIncreasing />,
                    filter: {
                        type: "static",
                        options: resources_models_1.oeeImpact.map(function (impact) { return ({
                            value: impact,
                            label: <MaintenanceOeeImpact_1.default oeeImpact={impact}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "plannedStartTime",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Planned Start"], ["Planned Start"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "plannedStartTime",
                    update: MAINTENANCE_UPDATE,
                    value: function (r) { return r.plannedStartTime; },
                    withTime: true,
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "assignee",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.id) !== null && _b !== void 0 ? _b : ""} table="maintenanceDispatch" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
                },
                meta: {
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "actualFailureModeId",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Actual Failure Mode"], ["Actual Failure Mode"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "actualFailureModeId",
                    update: MAINTENANCE_UPDATE,
                    value: function (r) { return r.actualFailureModeId; },
                    clearable: true,
                    options: failureModes.map(function (mode) { return ({
                        value: mode.id,
                        label: <Enumerable_1.Enumerable value={mode.name}/>
                    }); }),
                    renderInline: function (v) {
                        var _a, _b;
                        return (<Enumerable_1.Enumerable value={(_b = (_a = failureModes.find(function (m) { return m.id === v; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null}/>);
                    }
                }),
                meta: {
                    icon: <lu_1.LuCircleAlert />,
                    filter: {
                        type: "static",
                        options: failureModes === null || failureModes === void 0 ? void 0 : failureModes.map(function (mode) { return ({
                            value: mode.id,
                            label: <Enumerable_1.Enumerable value={mode.name}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "suspectedFailureModeId",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Suspected Failure Mode"], ["Suspected Failure Mode"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "suspectedFailureModeId",
                    update: MAINTENANCE_UPDATE,
                    value: function (r) { return r.suspectedFailureModeId; },
                    clearable: true,
                    options: failureModes.map(function (mode) { return ({
                        value: mode.id,
                        label: <Enumerable_1.Enumerable value={mode.name}/>
                    }); }),
                    renderInline: function (v) {
                        var _a, _b;
                        return (<Enumerable_1.Enumerable value={(_b = (_a = failureModes.find(function (m) { return m.id === v; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null}/>);
                    }
                }),
                meta: {
                    icon: <lu_1.LuCircleAlert />,
                    filter: {
                        type: "static",
                        options: failureModes === null || failureModes === void 0 ? void 0 : failureModes.map(function (mode) { return ({
                            value: mode.id,
                            label: <Enumerable_1.Enumerable value={mode.name}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "createdBy",
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Created By"], ["Created By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var createdBy = row.original.createdBy;
                    return <components_1.EmployeeAvatar employeeId={createdBy} size="xs"/>;
                },
                meta: {
                    icon: <lu_1.LuUser />,
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    }
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var date = row.original.createdAt;
                    return date ? formatDate(date) : "-";
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "updatedBy",
                header: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var updatedBy = row.original.updatedBy;
                    return <components_1.EmployeeAvatar employeeId={updatedBy} size="xs"/>;
                },
                meta: {
                    icon: <lu_1.LuUser />,
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    }
                }
            },
            {
                accessorKey: "updatedAt",
                header: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var date = row.original.updatedAt;
                    return date ? formatDate(date) : "-";
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
    }, [
        workCenters,
        failureModes.find,
        failureModes === null || failureModes === void 0 ? void 0 : failureModes.map,
        people.map,
        t,
        formatDate
    ]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem onClick={function () {
                navigate(path_1.path.to.maintenanceDispatch(row.id));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              <macro_1.Trans>Edit Dispatch</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem destructive disabled={!permissions.can("delete", "resources")} onClick={function () {
                navigate("".concat(path_1.path.to.deleteMaintenanceDispatch(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Dispatch</macro_1.Trans>
            </react_1.MenuItem>
          </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} defaultColumnPinning={{
            left: ["maintenanceDispatchId"]
        }} defaultColumnVisibility={{
            suspectedFailureModeId: false,
            createdBy: false,
            createdAt: false,
            updatedBy: false,
            updatedAt: false
        }} count={count} primaryAction={<div className="flex items-center gap-2">
            {locationId && (<react_1.Combobox asButton size="sm" value={locationId} options={locationOptions} onChange={function (selected) {
                    // hard refresh because initialValues update has no effect otherwise
                    window.location.href = getLocationPath(selected);
                }}/>)}
            {permissions.can("create", "resources") && (<components_1.New label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Dispatch"], ["Dispatch"])))} to={"".concat(path_1.path.to.newMaintenanceDispatch, "?").concat(params.toString())}/>)}
          </div>} renderContextMenu={renderContextMenu} title={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Maintenance Dispatches"], ["Maintenance Dispatches"])))}/>);
});
MaintenanceDispatchesTable.displayName = "MaintenanceDispatchesTable";
exports.default = MaintenanceDispatchesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
