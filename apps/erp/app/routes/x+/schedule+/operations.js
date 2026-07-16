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
exports.handle = void 0;
exports.loader = loader;
exports.default = ScheduleRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var Filter_1 = require("~/components/Table/components/Filter");
var useFilters_1 = require("~/components/Table/components/Filter/useFilters");
var hooks_1 = require("~/hooks");
var production_1 = require("~/modules/production");
var Kanban_1 = require("~/modules/production/ui/Schedule/Kanban");
var ScheuleNavigation_1 = require("~/modules/production/ui/Schedule/Kanban/ScheuleNavigation");
var resources_1 = require("~/modules/resources");
var shared_1 = require("~/modules/shared");
var users_server_1 = require("~/modules/users/users.server");
var stores_1 = require("~/stores");
var duration_1 = require("~/utils/duration");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Schedule"], ["Schedule"]))),
    to: path_1.path.to.scheduleOperation,
    module: "schedule"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, url, searchParams, search, filterParam, selectedWorkCenterIds, selectedProcessIds, selectedSalesOrderIds, selectedTags, selectedAssignee, _i, filterParam_1, filter, _d, key, operator, value, locationId, userDefaults, _e, _f, locations, _g, _h, _j, workCenters, processes, operations, tags, activeWorkCenters, filteredOperations, filteredWorkCenters;
        var _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        var request = _b.request;
        return __generator(this, function (_z) {
            switch (_z.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        bypassRls: true
                    })];
                case 1:
                    _c = _z.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    filterParam = searchParams.getAll("filter");
                    selectedWorkCenterIds = [];
                    selectedProcessIds = [];
                    selectedSalesOrderIds = [];
                    selectedTags = [];
                    selectedAssignee = [];
                    if (filterParam) {
                        for (_i = 0, filterParam_1 = filterParam; _i < filterParam_1.length; _i++) {
                            filter = filterParam_1[_i];
                            _d = filter.split(":"), key = _d[0], operator = _d[1], value = _d[2];
                            if (key === "workCenterId") {
                                if (operator === "in") {
                                    selectedWorkCenterIds = value.split(",");
                                }
                                else if (operator === "eq") {
                                    selectedWorkCenterIds = [value];
                                }
                            }
                            else if (key === "processId") {
                                if (operator === "in") {
                                    selectedProcessIds = value.split(",");
                                }
                                else if (operator === "eq") {
                                    selectedProcessIds = [value];
                                }
                            }
                            else if (key === "salesOrderId") {
                                if (operator === "in") {
                                    selectedSalesOrderIds = value.split(",");
                                }
                                else if (operator === "eq") {
                                    selectedSalesOrderIds = [value];
                                }
                            }
                            else if (key === "tag") {
                                if (operator === "in") {
                                    selectedTags = value.split(",");
                                }
                                else if (operator === "eq") {
                                    selectedTags = [value];
                                }
                            }
                            else if (key === "assignee") {
                                if (operator === "in") {
                                    selectedAssignee = value.split(",");
                                }
                                else if (operator === "eq") {
                                    selectedAssignee = [value];
                                }
                            }
                        }
                    }
                    locationId = searchParams.get("location");
                    if (!!locationId) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, users_server_1.getUserDefaults)(client, userId, companyId)];
                case 2:
                    userDefaults = _z.sent();
                    if (!userDefaults.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(userDefaults.error, "Failed to load default location"))];
                case 3: throw _e.apply(void 0, _f.concat([_z.sent()]));
                case 4:
                    locationId = (_l = (_k = userDefaults.data) === null || _k === void 0 ? void 0 : _k.locationId) !== null && _l !== void 0 ? _l : null;
                    _z.label = 5;
                case 5:
                    if (!!locationId) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, resources_1.getLocationsList)(client, companyId)];
                case 6:
                    locations = _z.sent();
                    if (!(locations.error || !((_m = locations.data) === null || _m === void 0 ? void 0 : _m.length))) return [3 /*break*/, 8];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(locations.error, "Failed to load any locations"))];
                case 7: throw _g.apply(void 0, _h.concat([_z.sent()]));
                case 8:
                    locationId = (_o = locations.data) === null || _o === void 0 ? void 0 : _o[0].id;
                    _z.label = 9;
                case 9: return [4 /*yield*/, Promise.all([
                        (0, resources_1.getWorkCentersByLocation)(client, locationId),
                        (0, resources_1.getProcessesList)(client, companyId),
                        (0, production_1.getActiveJobOperationsByLocation)(client, locationId, selectedWorkCenterIds),
                        (0, shared_1.getTagsList)(client, companyId, "operation")
                    ])];
                case 10:
                    _j = _z.sent(), workCenters = _j[0], processes = _j[1], operations = _j[2], tags = _j[3];
                    activeWorkCenters = new Set();
                    (_p = operations.data) === null || _p === void 0 ? void 0 : _p.forEach(function (op) {
                        if (op.operationStatus === "In Progress") {
                            activeWorkCenters.add(op.workCenterId);
                        }
                    });
                    filteredOperations = selectedWorkCenterIds.length
                        ? ((_r = (_q = operations.data) === null || _q === void 0 ? void 0 : _q.filter(function (op) {
                            return selectedWorkCenterIds.includes(op.workCenterId);
                        })) !== null && _r !== void 0 ? _r : [])
                        : ((_s = operations.data) !== null && _s !== void 0 ? _s : []);
                    if (selectedSalesOrderIds.length) {
                        filteredOperations = filteredOperations.filter(function (op) {
                            return selectedSalesOrderIds.includes(op.salesOrderId);
                        });
                    }
                    if (selectedProcessIds.length) {
                        filteredOperations = filteredOperations.filter(function (op) {
                            return selectedProcessIds.includes(op.processId);
                        });
                    }
                    if (selectedTags.length) {
                        filteredOperations = filteredOperations.filter(function (op) {
                            if (op.tags) {
                                return selectedTags.some(function (tag) { return op.tags.includes(tag); });
                            }
                            return false;
                        });
                    }
                    if (selectedAssignee.length) {
                        filteredOperations = filteredOperations.filter(function (op) {
                            return selectedAssignee.includes(op.assignee);
                        });
                    }
                    if (search) {
                        filteredOperations = filteredOperations.filter(function (op) {
                            var _a, _b;
                            return op.jobReadableId.toLowerCase().includes(search.toLowerCase()) ||
                                op.itemReadableId.toLowerCase().includes(search.toLowerCase()) ||
                                ((_a = op.customerName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search.toLowerCase())) ||
                                ((_b = op.description) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(search.toLowerCase()));
                        });
                    }
                    filteredWorkCenters = (_u = (_t = workCenters.data) === null || _t === void 0 ? void 0 : _t.filter(function (wc) {
                        var _a, _b;
                        if (selectedWorkCenterIds.length && selectedProcessIds.length) {
                            return (selectedWorkCenterIds.includes(wc.id) &&
                                ((_a = wc.processes) === null || _a === void 0 ? void 0 : _a.some(function (p) { return selectedProcessIds.includes(p); })));
                        }
                        else if (selectedWorkCenterIds.length) {
                            return selectedWorkCenterIds.includes(wc.id);
                        }
                        else if (selectedProcessIds.length) {
                            return (_b = wc.processes) === null || _b === void 0 ? void 0 : _b.some(function (p) {
                                return selectedProcessIds.includes(p);
                            });
                        }
                        return true;
                    })) !== null && _u !== void 0 ? _u : [];
                    return [2 /*return*/, {
                            columns: filteredWorkCenters
                                .map(function (wc) {
                                var _a, _b, _c, _d;
                                return ({
                                    id: wc.id,
                                    title: wc.name,
                                    type: (_a = wc.processes) !== null && _a !== void 0 ? _a : [],
                                    active: activeWorkCenters.has(wc.id),
                                    isBlocked: (_b = wc.isBlocked) !== null && _b !== void 0 ? _b : false,
                                    blockingDispatchId: (_c = wc.blockingDispatchId) !== null && _c !== void 0 ? _c : undefined,
                                    blockingDispatchReadableId: (_d = wc.blockingDispatchReadableId) !== null && _d !== void 0 ? _d : undefined
                                });
                            })
                                .sort(function (a, b) { return a.title.localeCompare(b.title); }),
                            items: ((_v = filteredOperations.map(function (op) {
                                var operation = (0, duration_1.makeDurations)(op);
                                return {
                                    id: op.id,
                                    columnId: op.workCenterId,
                                    columnType: op.processId,
                                    priority: op.priority,
                                    title: op.jobReadableId,
                                    link: op.parentMaterialId
                                        ? path_1.path.to.jobMakeMethod(op.jobId, op.jobMakeMethodId)
                                        : path_1.path.to.jobMethod(op.jobId, op.jobMakeMethodId),
                                    subtitle: op.itemReadableId,
                                    assignee: op.assignee,
                                    tags: op.tags,
                                    description: op.description,
                                    dueDate: op.operationDueDate,
                                    duration: operation.setupDuration +
                                        operation.laborDuration +
                                        operation.machineDuration,
                                    jobId: op.jobId,
                                    jobReadableId: op.jobReadableId,
                                    itemReadableId: op.itemReadableId,
                                    itemDescription: op.itemDescription,
                                    progress: 0,
                                    deadlineType: op.jobDeadlineType,
                                    customerId: op.jobCustomerId,
                                    targetQuantity: op.targetQuantity,
                                    quantity: op.operationQuantity,
                                    quantityCompleted: op.quantityComplete,
                                    quantityReworked: op.quantityReworked,
                                    quantityScrapped: op.quantityScrapped,
                                    reworkId: op.reworkId,
                                    salesOrderReadableId: op.salesOrderReadableId,
                                    salesOrderId: op.salesOrderId,
                                    salesOrderLineId: op.salesOrderLineId,
                                    status: op.operationStatus,
                                    setupDuration: operation.setupDuration,
                                    laborDuration: operation.laborDuration,
                                    machineDuration: operation.machineDuration,
                                    thumbnailPath: op.thumbnailPath
                                };
                            })) !== null && _v !== void 0 ? _v : []),
                            processes: (_w = processes.data) !== null && _w !== void 0 ? _w : [],
                            salesOrders: Object.entries((_x = filteredOperations === null || filteredOperations === void 0 ? void 0 : filteredOperations.reduce(function (acc, op) {
                                if (op.salesOrderId) {
                                    acc[op.salesOrderId] = op.salesOrderReadableId;
                                }
                                return acc;
                            }, {})) !== null && _x !== void 0 ? _x : {}).map(function (_a) {
                                var id = _a[0], readableId = _a[1];
                                return ({ id: id, readableId: readableId });
                            }),
                            availableTags: Object.entries(filteredOperations.reduce(function (acc, op) {
                                if (op.tags) {
                                    // biome-ignore lint/suspicious/useIterableCallbackReturn: suppressed due to migration
                                    op.tags.forEach(function (tag) { return (acc[tag] = true); });
                                }
                                return acc;
                            }, {})).map(function (_a) {
                                var tag = _a[0];
                                return tag;
                            }),
                            tags: (_y = tags.data) !== null && _y !== void 0 ? _y : [],
                            locationId: locationId
                        }];
            }
        });
    });
}
var defaultDisplaySettings = {
    emptyWorkCenters: true,
    showDuration: true,
    showCustomer: true,
    showDescription: true,
    showDueDate: true,
    showEmployee: true,
    showProgress: true,
    showQuantity: true,
    showStatus: true,
    showSalesOrder: true,
    showThumbnail: true
};
var DISPLAY_SETTINGS_KEY = "kanban-schedule-display-settings";
function KanbanSchedule() {
    var t = (0, macro_2.useLingui)().t;
    var _a = (0, react_router_1.useLoaderData)(), columns = _a.columns, initialItems = _a.items, processes = _a.processes, salesOrders = _a.salesOrders, availableTags = _a.availableTags, tags = _a.tags, locationId = _a.locationId;
    var locations = (0, Location_1.useLocations)();
    var _b = (0, react_2.useState)(initialItems), items = _b[0], setItems = _b[1];
    var _c = (0, react_1.useLocalStorage)(DISPLAY_SETTINGS_KEY, defaultDisplaySettings), displaySettings = _c[0], setDisplaySettings = _c[1];
    var mergedDisplaySettings = (0, react_2.useMemo)(function () { return (__assign(__assign({}, defaultDisplaySettings), displaySettings)); }, [displaySettings]);
    (0, react_2.useEffect)(function () {
        setItems(initialItems);
    }, [initialItems]);
    var sortItems = (0, react_2.useCallback)(function (items) {
        return __spreadArray([], items, true).sort(function (a, b) { return a.priority - b.priority; });
    }, []);
    (0, react_2.useEffect)(function () {
        setItems(function (prevItems) { return sortItems(prevItems); });
    }, [sortItems]);
    var visibleColumns = (0, react_2.useMemo)(function () {
        if (mergedDisplaySettings.emptyWorkCenters) {
            return columns;
        }
        var workCenterIdsWithOperations = new Set(items.map(function (item) { return item.columnId; }));
        return columns.filter(function (column) {
            return workCenterIdsWithOperations.has(column.id);
        });
    }, [columns, items, mergedDisplaySettings.emptyWorkCenters]);
    var progressByOperation = useProgressByOperation(items, setItems, sortItems).progressByOperation;
    var people = (0, stores_1.usePeople)()[0];
    var params = (0, hooks_1.useUrlParams)()[0];
    var _d = (0, useFilters_1.useFilters)(), hasFilters = _d.hasFilters, clearFilters = _d.clearFilters;
    var currentFilters = params.getAll("filter").filter(Boolean);
    var filters = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "workCenterId",
                header: "Work Center",
                filter: {
                    type: "static",
                    options: columns.map(function (col) { return ({
                        label: <Enumerable_1.Enumerable value={col.title}/>,
                        value: col.id
                    }); })
                }
            },
            {
                accessorKey: "processId",
                header: "Process",
                pluralHeader: "Processes",
                filter: {
                    type: "static",
                    options: processes.map(function (p) { return ({
                        label: <Enumerable_1.Enumerable value={p.name}/>,
                        value: p.id
                    }); })
                }
            },
            {
                accessorKey: "salesOrderId",
                header: "Sales Order",
                filter: {
                    type: "static",
                    options: salesOrders.map(function (so) { return ({
                        label: so.readableId,
                        value: so.id
                    }); })
                }
            },
            {
                accessorKey: "assignee",
                header: "Assignee",
                filter: {
                    type: "static",
                    options: people.map(function (p) { return ({
                        label: p.name,
                        value: p.id
                    }); })
                }
            },
            {
                accessorKey: "tag",
                header: "Tag",
                filter: {
                    type: "static",
                    options: availableTags.map(function (tag) { return ({
                        label: tag,
                        value: tag
                    }); })
                }
            }
        ];
    }, [columns, processes, salesOrders, people, availableTags]);
    return (<div className="flex flex-col h-full max-h-full  overflow-auto relative">
      <react_1.HStack className="px-4 py-2 justify-between bg-card border-b border-border">
        <react_1.HStack>
          <ScheuleNavigation_1.ScheduleNavigation />
          <components_1.SearchFilter param="search" size="sm" placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Search"], ["Search"])))}/>
          <Filter_1.Filter filters={filters}/>
        </react_1.HStack>

        <div className="flex items-center gap-2">
          <react_1.Popover>
            <react_1.PopoverTrigger asChild>
              <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Settings"], ["Settings"])))} icon={<lu_1.LuSettings2 />} variant="secondary" className="border-dashed border-border"/>
            </react_1.PopoverTrigger>
            <react_1.PopoverContent className="w-64">
              <react_1.VStack spacing={3}>
                <span className="text-xs font-medium text-muted-foreground">
                  <macro_2.Trans>Location</macro_2.Trans>
                </span>
                <div className="w-full">
                  <react_1.Combobox asButton size="sm" value={locationId} options={locations} onChange={function (selected) {
            // hard refresh because initialValues update has no effect otherwise
            window.location.href = getLocationPath(selected);
        }}/>
                </div>
                <react_1.Separator />
                <span className="text-xs font-medium text-muted-foreground">
                  <macro_2.Trans>Columns</macro_2.Trans>
                </span>
                <react_1.VStack>
                  {[
            {
                key: "emptyWorkCenters",
                label: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Empty work centers"], ["Empty work centers"])))
            }
        ].map(function (_a) {
            var key = _a.key, label = _a.label;
            return (<react_1.Switch key={key} variant="small" label={label} checked={mergedDisplaySettings[key]} onCheckedChange={function (checked) {
                    return setDisplaySettings(function (prev) {
                        var _a;
                        return (__assign(__assign(__assign({}, defaultDisplaySettings), prev), (_a = {}, _a[key] = checked, _a)));
                    });
                }}/>);
        })}
                </react_1.VStack>
                <react_1.Separator />
                <span className="text-xs font-medium text-muted-foreground">
                  <macro_2.Trans>Cards</macro_2.Trans>
                </span>
                <react_1.VStack>
                  {[
            { key: "showCustomer", label: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Customer"], ["Customer"]))) },
            { key: "showDueDate", label: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Due Date"], ["Due Date"]))) },
            { key: "showDuration", label: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Duration"], ["Duration"]))) },
            { key: "showProgress", label: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Progress"], ["Progress"]))) },
            { key: "showQuantity", label: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Quantity"], ["Quantity"]))) },
            { key: "showStatus", label: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Status"], ["Status"]))) },
            { key: "showSalesOrder", label: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Sales Order"], ["Sales Order"]))) },
            { key: "showThumbnail", label: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Thumbnail"], ["Thumbnail"]))) }
        ].map(function (_a) {
            var key = _a.key, label = _a.label;
            return (<react_1.Switch key={key} variant="small" label={label} checked={mergedDisplaySettings[key]} onCheckedChange={function (checked) {
                    return setDisplaySettings(function (prev) {
                        var _a;
                        return (__assign(__assign(__assign({}, defaultDisplaySettings), prev), (_a = {}, _a[key] = checked, _a)));
                    });
                }}/>);
        })}
                </react_1.VStack>
              </react_1.VStack>
            </react_1.PopoverContent>
          </react_1.Popover>
        </div>
      </react_1.HStack>
      {currentFilters.length > 0 && (<react_1.HStack className="px-4 py-1.5 justify-between bg-card border-b border-border w-full">
          <react_1.HStack>
            <Filter_1.ActiveFilters filters={filters}/>
          </react_1.HStack>
        </react_1.HStack>)}
      <div className="flex flex-grow h-full items-stretch overflow-hidden relative">
        <div className="flex flex-1 min-h-0 w-full relative">
          {columns.length > 0 ? (<Kanban_1.Kanban columns={visibleColumns} items={items} progressByItemId={progressByOperation} tags={tags} {...mergedDisplaySettings}/>) : hasFilters ? (<div className="flex flex-col w-full h-full items-center justify-center gap-4">
              <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
                <lu_1.LuTriangleAlert className="h-6 w-6"/>
              </div>
              <span className="text-xs font-mono font-light text-foreground uppercase">
                <macro_2.Trans>No results</macro_2.Trans>
              </span>
              <react_1.Button onClick={clearFilters}>
                <macro_2.Trans>Clear Filters</macro_2.Trans>
              </react_1.Button>
            </div>) : (<div className="flex flex-col w-full h-full items-center justify-center gap-4">
              <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
                <lu_1.LuTriangleAlert className="h-6 w-6"/>
              </div>
              <span className="text-xs font-mono font-light text-foreground uppercase">
                <macro_2.Trans>No work centers exist</macro_2.Trans>
              </span>
              <react_1.Button leftIcon={<lu_1.LuCirclePlus />} asChild>
                <react_router_1.Link to={path_1.path.to.newWorkCenter}>
                  <macro_2.Trans>Create Work Center</macro_2.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </div>)}
        </div>
      </div>
    </div>);
}
function ScheduleRoute() {
    return (<react_1.ClientOnly fallback={<div className="flex h-full w-full items-center justify-center">
          <react_1.Spinner className="h-8 w-8"/>
        </div>}>
      {function () { return <KanbanSchedule />; }}
    </react_1.ClientOnly>);
}
function useProgressByOperation(items, setItems, sortItems) {
    var _this = this;
    var companyId = (0, hooks_1.useUser)().company.id;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _a = (0, react_2.useState)({}), productionEventsByOperation = _a[0], setProductionEventsByOperation = _a[1];
    var _b = (0, react_2.useState)({}), progressByOperation = _b[0], setProgressByOperation = _b[1];
    var getProductionEvents = (0, react_2.useCallback)(function (operationIds) { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("productionEvent")
                            .select("id, jobOperationId, duration, startTime, endTime, duration, employeeId")
                            .eq("companyId", companyId)
                            .in("jobOperationId", operationIds)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        react_1.toast.error(error.message);
                    }
                    if (data) {
                        setProductionEventsByOperation(data.reduce(function (acc, event) {
                            var _a;
                            acc[event.jobOperationId] = __spreadArray(__spreadArray([], ((_a = acc[event.jobOperationId]) !== null && _a !== void 0 ? _a : []), true), [
                                event
                            ], false);
                            return acc;
                        }, {}));
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, companyId]);
    (0, react_1.useMount)(function () {
        getProductionEvents(items.map(function (item) { return item.id; }));
    });
    var getProgress = (0, react_2.useCallback)(function () {
        var timeNow = (0, date_1.now)((0, date_1.getLocalTimeZone)());
        var progress = {};
        Object.entries(productionEventsByOperation).forEach(function (_a) {
            var _b, _c, _d;
            var operationId = _a[0], events = _a[1];
            var operation = items.find(function (item) { return item.id === operationId; });
            var totalDuration = ((_b = operation === null || operation === void 0 ? void 0 : operation.setupDuration) !== null && _b !== void 0 ? _b : 0) +
                ((_c = operation === null || operation === void 0 ? void 0 : operation.laborDuration) !== null && _c !== void 0 ? _c : 0) +
                ((_d = operation === null || operation === void 0 ? void 0 : operation.machineDuration) !== null && _d !== void 0 ? _d : 0);
            var currentProgress = 0;
            var active = false;
            var employees = new Set();
            events.forEach(function (event) {
                if (event.endTime && event.duration) {
                    currentProgress += event.duration * 1000;
                }
                else if (event.startTime) {
                    active = true;
                    if (event.employeeId) {
                        employees.add(event.employeeId);
                    }
                    var startTime = (0, date_1.toZoned)((0, date_1.parseAbsolute)(event.startTime, (0, date_1.getLocalTimeZone)()), (0, date_1.getLocalTimeZone)());
                    var difference = timeNow.compare(startTime);
                    if (difference > 0) {
                        currentProgress += difference;
                    }
                }
            });
            progress[operationId] = {
                totalDuration: totalDuration,
                progress: currentProgress,
                active: active,
                employees: employees
            };
        });
        return { progress: progress };
    }, [productionEventsByOperation, items]);
    (0, react_1.useInterval)(function () {
        var progress = getProgress().progress;
        setProgressByOperation(progress);
    }, 5000);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (Object.keys(productionEventsByOperation).length > 0) {
            var progress = getProgress().progress;
            setProgressByOperation(progress);
        }
    }, [productionEventsByOperation]);
    (0, react_1.useRealtimeChannel)({
        topic: "kanban-schedule:".concat(companyId),
        setup: function (channel) {
            return channel
                .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "jobOperation",
                filter: "id=in.(".concat(items.map(function (item) { return item.id; }).join(","), ")")
            }, function (payload) {
                switch (payload.eventType) {
                    case "UPDATE": {
                        var updated_1 = payload.new;
                        setItems(function (prevItems) {
                            return sortItems(prevItems.map(function (item) {
                                if (item.id === updated_1.id) {
                                    return __assign(__assign({}, item), { columnId: updated_1.workCenterId, priority: updated_1.priority });
                                }
                                return item;
                            }));
                        });
                        break;
                    }
                    case "DELETE": {
                        var deleted_1 = payload.old;
                        setItems(function (prevItems) {
                            return sortItems(prevItems.filter(function (item) { return item.id !== deleted_1.id; }));
                        });
                        break;
                    }
                }
            })
                .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "productionEvent",
                filter: "companyId=eq.".concat(companyId)
            }, function (payload) {
                if (payload.eventType === "INSERT") {
                    var inserted_1 = payload.new;
                    if (inserted_1.jobOperationId) {
                        setProductionEventsByOperation(function (prevState) {
                            var _a;
                            var _b;
                            return (__assign(__assign({}, prevState), (_a = {}, _a[inserted_1.jobOperationId] = __spreadArray(__spreadArray([], ((_b = prevState[inserted_1.jobOperationId]) !== null && _b !== void 0 ? _b : []), true), [
                                inserted_1
                            ], false), _a)));
                        });
                    }
                }
                else if (payload.eventType === "UPDATE") {
                    var updated_2 = payload.new;
                    if (updated_2.jobOperationId) {
                        setProductionEventsByOperation(function (prevState) {
                            var _a;
                            var _b;
                            return (__assign(__assign({}, prevState), (_a = {}, _a[updated_2.jobOperationId] = ((_b = prevState[updated_2.jobOperationId]) !== null && _b !== void 0 ? _b : []).map(function (event) { return (event.id === updated_2.id ? updated_2 : event); }), _a)));
                        });
                    }
                }
                else if (payload.eventType === "DELETE") {
                    var deleted_2 = payload.old;
                    if (deleted_2.jobOperationId) {
                        setProductionEventsByOperation(function (prevState) {
                            var _a;
                            var _b;
                            return (__assign(__assign({}, prevState), (_a = {}, _a[deleted_2.jobOperationId] = ((_b = prevState[deleted_2.jobOperationId]) !== null && _b !== void 0 ? _b : []).filter(function (event) { return event.id !== deleted_2.id; }), _a)));
                        });
                    }
                }
            });
        }
    });
    return { progressByOperation: progressByOperation };
}
function getLocationPath(locationId) {
    return "".concat(path_1.path.to.scheduleOperation, "?location=").concat(locationId);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
