"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var ProductionEventsTable = (0, react_2.memo)(function (_a) {
    var _b, _c, _d, _e;
    var data = _a.data, count = _a.count, operations = _a.operations, workCenters = _a.workCenters;
    var jobId = (0, react_router_1.useParams)().jobId;
    var t = (0, macro_1.useLingui)().t;
    if (!jobId)
        throw new Error("Job ID is required");
    var formatDateTime = (0, hooks_1.useDateFormatter)().formatDateTime;
    var people = (0, stores_1.usePeople)()[0];
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "jobOperationId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Operation"], ["Operation"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id}>
              {(_c = (_b = row.original.jobOperation) === null || _b === void 0 ? void 0 : _b.description) !== null && _c !== void 0 ? _c : null}
            </components_1.Hyperlink>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: operations.map(function (operation) { return ({
                            value: operation.id,
                            label: <Enumerable_1.Enumerable value={operation.description}/>
                        }); })
                    }
                }
            },
            {
                id: "item",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Item"], ["Item"]))),
                cell: function (_a) {
                    var _b, _c, _d;
                    var row = _a.row;
                    return (_d = (_c = (_b = row.original.jobOperation) === null || _b === void 0 ? void 0 : _b.jobMakeMethod) === null || _c === void 0 ? void 0 : _c.item) === null || _d === void 0 ? void 0 : _d.readableIdWithRevision;
                }
            },
            {
                accessorKey: "employeeId",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Employee"], ["Employee"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.employeeId}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: <Enumerable_1.Enumerable value={employee.name}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "type",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<react_1.Badge variant={row.original.type === "Labor"
                            ? "green"
                            : row.original.type === "Machine"
                                ? "blue"
                                : "yellow"}>
              <components_1.TimeTypeIcon type={(_b = row.original.type) !== null && _b !== void 0 ? _b : ""} className="mr-2"/>
              {row.original.type}
            </react_1.Badge>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: ["Setup", "Labor", "Machine"].map(function (type) { return ({
                            value: type,
                            label: (<react_1.Badge variant={type === "Labor"
                                    ? "green"
                                    : type === "Machine"
                                        ? "blue"
                                        : "yellow"}>
                    <components_1.TimeTypeIcon type={type} className="mr-2"/>
                    {type}
                  </react_1.Badge>)
                        }); })
                    }
                }
            },
            {
                accessorKey: "duration",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Duration"], ["Duration"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.duration
                        ? (0, utils_1.formatDurationMilliseconds)(row.original.duration * 1000)
                        : null;
                }
            },
            {
                accessorKey: "workCenterId",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Work Center"], ["Work Center"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var workCenter = workCenters.find(function (wc) { return wc.id === row.original.workCenterId; });
                    return <Enumerable_1.Enumerable value={(_b = workCenter === null || workCenter === void 0 ? void 0 : workCenter.name) !== null && _b !== void 0 ? _b : null}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: workCenters.map(function (workCenter) { return ({
                            value: workCenter.id,
                            label: <Enumerable_1.Enumerable value={workCenter.name}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "startTime",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Start Time"], ["Start Time"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatDateTime(row.original.startTime);
                }
            },
            {
                accessorKey: "endTime",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["End Time"], ["End Time"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.endTime ? formatDateTime(row.original.endTime) : null;
                }
            },
            {
                accessorKey: "notes",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Notes"], ["Notes"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<div className="max-w-[200px] truncate" title={(_b = row.original.notes) !== null && _b !== void 0 ? _b : ""}>
              {row.original.notes}
            </div>);
                }
            }
        ];
    }, [operations, people, workCenters, t, formatDateTime]);
    var permissions = (0, hooks_1.usePermissions)();
    var deleteModal = (0, react_1.useDisclosure)();
    var _f = (0, react_2.useState)(null), selectedEvent = _f[0], setSelectedEvent = _f[1];
    var onDelete = function (data) {
        setSelectedEvent(data);
        deleteModal.onOpen();
    };
    var onDeleteCancel = function () {
        setSelectedEvent(null);
        deleteModal.onClose();
    };
    var navigate = (0, react_router_1.useNavigate)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var renderContextMenu = (0, react_2.useCallback)(function (row) { return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "production")} onClick={function () { return navigate(row.id); }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            Edit Event
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "production")} onClick={function () { return onDelete(row); }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            Delete Event
          </react_1.MenuItem>
        </>); }, [permissions]);
    var params = (0, hooks_1.useUrlParams)()[0];
    return (<>
        <components_1.Table compact count={count} columns={columns} data={data} primaryAction={permissions.can("update", "accounting") && (<components_1.New label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Production Event"], ["Production Event"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Production Events"], ["Production Events"])))}/>
        {deleteModal.isOpen && selectedEvent && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteProductionEvent(selectedEvent.id)} isOpen name={"".concat((_c = (_b = selectedEvent.jobOperation) === null || _b === void 0 ? void 0 : _b.description) !== null && _c !== void 0 ? _c : "Operation", " by ").concat((_e = (_d = people.find(function (p) { return p.id === selectedEvent.employeeId; })) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : "Unknown Employee")} text="Are you sure you want to delete this production event? This action cannot be undone." onCancel={onDeleteCancel} onSubmit={onDeleteCancel}/>)}
      </>);
});
ProductionEventsTable.displayName = "ProductionEventsTable";
exports.default = ProductionEventsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
