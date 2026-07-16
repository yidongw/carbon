"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Process_1 = require("~/components/Form/Process");
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
// Work-center inline edits go through the shared work-center bulk-update action.
var WORK_CENTER_UPDATE = {
    action: path_1.path.to.bulkUpdateWorkCenter,
    idKey: "ids"
};
var defaultColumnVisibility = {
    description: false,
    createdAt: false,
    createdBy: false,
    updatedAt: false,
    updatedBy: false
};
var WorkCentersTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, departments = _a.departments, locations = _a.locations;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var people = (0, stores_1.usePeople)()[0];
    var permissions = (0, hooks_1.usePermissions)();
    var deleteModal = (0, react_1.useDisclosure)();
    var activateModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(null), selectedWorkCenter = _b[0], setSelectedWorkCenter = _b[1];
    var formatter = (0, hooks_1.useCurrencyFormatter)();
    var processes = (0, Process_1.useProcesses)();
    var onActivate = function (data) {
        setSelectedWorkCenter(data);
        activateModal.onOpen();
    };
    var onDelete = function (data) {
        setSelectedWorkCenter(data);
        deleteModal.onOpen();
    };
    var onCancel = function () {
        setSelectedWorkCenter(null);
        deleteModal.onClose();
        activateModal.onClose();
    };
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("workCenter");
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Work Center"], ["Work Center"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<react_1.HStack>
              {((_b = row.original.processes) !== null && _b !== void 0 ? _b : []).length > 0 ? (<components_1.Hyperlink to={row.original.id}>
                  <Enumerable_1.Enumerable value={row.original.name} className="cursor-pointer"/>
                </components_1.Hyperlink>) : (<components_1.Hyperlink to={row.original.id}>
                  <react_1.HStack spacing={2}>
                    <lu_1.LuTriangleAlert />
                    <span>{row.original.name}</span>
                  </react_1.HStack>
                </components_1.Hyperlink>)}
            </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuWrench />
                }
            },
            {
                id: "processes",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Processes"], ["Processes"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<span className="flex gap-2 items-center flex-wrap py-2">
              {((_b = row.original.processes) !== null && _b !== void 0 ? _b : []).map(function (p) {
                            var _a;
                            var process = processes.find(function (proc) { return proc.value === p; });
                            return (<Enumerable_1.Enumerable key={process === null || process === void 0 ? void 0 : process.label} value={(_a = process === null || process === void 0 ? void 0 : process.label) !== null && _a !== void 0 ? _a : null} onClick={function () { return navigate(path_1.path.to.process(process === null || process === void 0 ? void 0 : process.value)); }} className="cursor-pointer"/>);
                        })}
            </span>);
                },
                meta: {
                    icon: <lu_1.LuCog />,
                    filter: {
                        type: "static",
                        options: processes.map(function (process) { return ({
                            value: process.value,
                            label: <Enumerable_1.Enumerable value={process.label}/>
                        }); }),
                        isArray: true
                    }
                }
            },
            {
                accessorKey: "locationName",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "locationId",
                    update: WORK_CENTER_UPDATE,
                    value: function (r) { return r.locationId; },
                    options: locations.map(function (l) { return ({
                        value: l.id,
                        label: <Enumerable_1.Enumerable value={l.name}/>
                    }); }),
                    renderInline: function (v) {
                        var _a, _b;
                        return (<Enumerable_1.Enumerable value={(_b = (_a = locations.find(function (l) { return l.id === v; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null}/>);
                    }
                }),
                meta: {
                    icon: <lu_1.LuBuilding2 />,
                    filter: {
                        type: "static",
                        options: locations.map(function (_a) {
                            var name = _a.name;
                            return ({
                                value: name,
                                label: <Enumerable_1.Enumerable value={name}/>
                            });
                        })
                    }
                }
            },
            {
                accessorKey: "departmentName",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Department"], ["Department"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "departmentId",
                    update: WORK_CENTER_UPDATE,
                    value: function (r) { return r.departmentId; },
                    clearable: true,
                    options: departments.map(function (d) { return ({
                        value: d.id,
                        label: <Enumerable_1.Enumerable value={d.name}/>
                    }); }),
                    renderInline: function (v) {
                        var _a, _b;
                        return (<Enumerable_1.Enumerable value={(_b = (_a = departments.find(function (d) { return d.id === v; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null}/>);
                    }
                }),
                meta: {
                    icon: <lu_1.LuBuilding2 />,
                    filter: {
                        type: "static",
                        options: departments.map(function (_a) {
                            var name = _a.name;
                            return ({
                                value: name,
                                label: <Enumerable_1.Enumerable value={name}/>
                            });
                        })
                    }
                }
            },
            {
                accessorKey: "active",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Active"], ["Active"]))),
                cell: function (item) { return <react_1.Checkbox isChecked={item.getValue()}/>; },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "true", label: "Active" },
                            { value: "false", label: "Inactive" }
                        ]
                    },
                    pluralHeader: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Active Statuses"], ["Active Statuses"]))),
                    icon: <lu_1.LuCheck />
                }
            },
            {
                accessorKey: "description",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Description"], ["Description"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "description",
                    update: WORK_CENTER_UPDATE,
                    value: function (r) { return r.description; }
                }),
                meta: {
                    icon: <lu_1.LuAlignLeft />
                }
            },
            {
                accessorKey: "laborRate",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Labor Rate"], ["Labor Rate"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<span>{formatter.format((_b = row.original.laborRate) !== null && _b !== void 0 ? _b : 0)}</span>);
                },
                meta: {
                    icon: <lu_1.LuDollarSign />
                }
            },
            {
                accessorKey: "machineRate",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Machine Rate"], ["Machine Rate"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<span>{formatter.format((_b = row.original.machineRate) !== null && _b !== void 0 ? _b : 0)}</span>);
                },
                meta: {
                    icon: <lu_1.LuDollarSign />
                }
            },
            {
                accessorKey: "overheadRate",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Overhead Rate"], ["Overhead Rate"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<span>{formatter.format((_b = row.original.overheadRate) !== null && _b !== void 0 ? _b : 0)}</span>);
                },
                meta: {
                    icon: <lu_1.LuDollarSign />
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Created By"], ["Created By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.createdBy}/>);
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
                id: "updatedBy",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.updatedBy}/>);
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
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [params, customColumns]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var renderContextMenu = (0, react_2.useCallback)(function (row) { return (<>
          <react_1.MenuItem onClick={function () {
            navigate("".concat(path_1.path.to.workCenter(row.id), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
        }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Work Center</macro_1.Trans>
          </react_1.MenuItem>
          {row.active ? (<react_1.MenuItem destructive disabled={!permissions.can("delete", "resources")} onClick={function () { return onDelete(row); }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Deactivate Work Center</macro_1.Trans>
            </react_1.MenuItem>) : (<react_1.MenuItem disabled={!permissions.can("delete", "resources")} onClick={function () { return onActivate(row); }}>
              <react_1.MenuIcon icon={<lu_1.LuCheck />}/>
              <macro_1.Trans>Activate Work Center</macro_1.Trans>
            </react_1.MenuItem>)}
        </>); }, [navigate, params, permissions]);
    return (<>
        <components_1.Table data={data} defaultColumnVisibility={defaultColumnVisibility} columns={columns} count={count !== null && count !== void 0 ? count : 0} importCSV={[
            {
                table: "workCenter",
                label: "Work Centers"
            }
        ]} primaryAction={permissions.can("update", "resources") && (<components_1.New label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Work Center"], ["Work Center"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Work Centers"], ["Work Centers"])))} table="workCenter" withSavedView/>

        {selectedWorkCenter && selectedWorkCenter.id && (<DeleteWorkCenterModal workCenter={selectedWorkCenter} isOpen={deleteModal.isOpen} onCancel={onCancel} onSubmit={onCancel}/>)}

        {selectedWorkCenter && selectedWorkCenter.id && (<Modals_1.Confirm action={path_1.path.to.workCenterActivate(selectedWorkCenter.id)} title={"Activate ".concat(selectedWorkCenter === null || selectedWorkCenter === void 0 ? void 0 : selectedWorkCenter.name, " Work Center")} text={"Are you sure you want to activate the ".concat(selectedWorkCenter === null || selectedWorkCenter === void 0 ? void 0 : selectedWorkCenter.name, " work center?")} confirmText="Activate" isOpen={activateModal.isOpen} onCancel={onCancel} onSubmit={onCancel}/>)}
      </>);
});
WorkCentersTable.displayName = "WorkCentersTable";
exports.default = WorkCentersTable;
function DeleteWorkCenterModal(_a) {
    var _this = this;
    var workCenter = _a.workCenter, isOpen = _a.isOpen, onCancel = _a.onCancel, onSubmit = _a.onSubmit;
    var _b = (0, react_2.useState)(false), hasNoActiveOperations = _b[0], setHasNoActiveOperations = _b[1];
    var _c = (0, react_2.useState)([]), jobsWithActiveOperations = _c[0], setJobsWithActiveOperations = _c[1];
    var uniqueJobsWithActiveOperations = (0, react_2.useMemo)(function () {
        return jobsWithActiveOperations.filter(function (job, index, self) {
            return index === self.findIndex(function (t) { return t.jobId === job.jobId; });
        });
    }, [jobsWithActiveOperations]);
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var getActiveOperations = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("jobOperation")
                            .select("job(jobId, id, status)")
                            .in("job.status", ["Ready", "In Progress", "Paused"])
                            .neq("status", "Done")
                            .eq("workCenterId", workCenter.id)
                            .eq("companyId", company === null || company === void 0 ? void 0 : company.id)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error(error);
                    }
                    if (data) {
                        setJobsWithActiveOperations(data.map(function (job) { return job.job; }).filter(function (job) { return Boolean(job); }));
                        setHasNoActiveOperations(data.length === 0);
                    }
                    else {
                        react_1.toast.error("Failed to check active operations");
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var fetcher = (0, react_router_1.useFetcher)();
    var submitted = (0, react_2.useRef)(false);
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "idle" && submitted.current) {
            onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit();
            submitted.current = false;
        }
    }, [fetcher.state, onSubmit]);
    (0, react_1.useMount)(function () {
        getActiveOperations();
    });
    return (<react_1.Modal open={isOpen} onOpenChange={function (open) {
            if (!open)
                onCancel();
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Deactivate {workCenter.name}</macro_1.Trans>
          </react_1.ModalTitle>
        </react_1.ModalHeader>

        <react_1.ModalBody>
          {uniqueJobsWithActiveOperations.length > 0 ? (<react_1.Alert variant="destructive">
              <lu_1.LuTriangleAlert className="h-4 w-4"/>
              <react_1.AlertTitle>
                <macro_1.Trans>
                  These jobs have operations assigned to this work center:
                </macro_1.Trans>
              </react_1.AlertTitle>
              <react_1.AlertDescription>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  {uniqueJobsWithActiveOperations.map(function (job, index) { return (<li key={index} className="text-sm font-medium flex gap-2">
                      <components_1.Hyperlink to={path_1.path.to.jobDetails(job.id)}>
                        {job.jobId}
                      </components_1.Hyperlink>
                    </li>); })}
                </ul>
              </react_1.AlertDescription>
            </react_1.Alert>) : (<p>
              Are you sure you want to deactivate the {workCenter.name} work
              center?
            </p>)}
        </react_1.ModalBody>

        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onCancel}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <fetcher.Form method="post" action={path_1.path.to.deleteWorkCenter(workCenter.id)} onSubmit={function () { return (submitted.current = true); }}>
            <react_1.Button variant="destructive" isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle" || hasNoActiveOperations === false} type="submit">
              <macro_1.Trans>Deactivate</macro_1.Trans>
            </react_1.Button>
          </fetcher.Form>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
