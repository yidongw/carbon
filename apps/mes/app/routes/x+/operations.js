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
exports.loader = loader;
exports.default = ScheduleRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Filter_1 = require("~/components/Filter");
var Kanban_1 = require("~/components/Kanban");
var SearchFilter_1 = require("~/components/SearchFilter");
var context_1 = require("~/context");
var hooks_1 = require("~/hooks");
var operation_server_1 = require("~/services/operation.server");
var operations_service_1 = require("~/services/operations.service");
var stores_1 = require("~/stores");
var durations_1 = require("~/utils/durations");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId, serviceRole, url, searchParams, search, filterParam, saved, headers, savedFilters, savedFiltersArray, newUrl_1, newUrl, currentFiltersString, _c, _d, _e, selectedWorkCenterIds, selectedProcessIds, selectedSalesOrderIds, selectedTags, selectedAssignee, _i, filterParam_1, filter, _f, key, operator, value, locationId, _g, workCenters, processes, operations, activeWorkCenters, filteredOperations, filteredWorkCenters, customerIds, customers, availableTags;
        var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        var context = _b.context, request = _b.request;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    companyId = (_u.sent()).companyId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    filterParam = searchParams.getAll("filter").filter(Boolean);
                    saved = searchParams.get("saved") === "1";
                    headers = new Headers();
                    return [4 /*yield*/, (0, operation_server_1.getFilters)(request)];
                case 2:
                    savedFilters = _u.sent();
                    if (!saved) return [3 /*break*/, 3];
                    if (savedFilters && typeof savedFilters === "string") {
                        savedFiltersArray = savedFilters.split(",");
                        newUrl_1 = new URL(request.url);
                        newUrl_1.searchParams.delete("saved");
                        savedFiltersArray.forEach(function (filter) {
                            newUrl_1.searchParams.append("filter", filter);
                        });
                        return [2 /*return*/, (0, react_router_1.redirect)("".concat(newUrl_1.pathname).concat(newUrl_1.search))];
                    }
                    else if (filterParam.length === 0) {
                        newUrl = new URL(request.url);
                        newUrl.searchParams.delete("saved");
                        return [2 /*return*/, (0, react_router_1.redirect)("".concat(newUrl.pathname).concat(newUrl.search))];
                    }
                    return [3 /*break*/, 5];
                case 3:
                    currentFiltersString = filterParam === null || filterParam === void 0 ? void 0 : filterParam.filter(Boolean).join(",");
                    if (!(savedFilters !== currentFiltersString)) return [3 /*break*/, 5];
                    _d = (_c = headers).append;
                    _e = ["Set-Cookie"];
                    return [4 /*yield*/, (0, operation_server_1.setFilters)(request, currentFiltersString)];
                case 4:
                    _d.apply(_c, _e.concat([_u.sent()]));
                    _u.label = 5;
                case 5:
                    selectedWorkCenterIds = [];
                    selectedProcessIds = [];
                    selectedSalesOrderIds = [];
                    selectedTags = [];
                    selectedAssignee = [];
                    if (filterParam) {
                        for (_i = 0, filterParam_1 = filterParam; _i < filterParam_1.length; _i++) {
                            filter = filterParam_1[_i];
                            _f = filter.split(":"), key = _f[0], operator = _f[1], value = _f[2];
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
                    locationId = (_h = context.get(context_1.userContext)) === null || _h === void 0 ? void 0 : _h.locationId;
                    return [4 /*yield*/, Promise.all([
                            (0, operations_service_1.getWorkCentersByLocation)(serviceRole, locationId),
                            (0, operations_service_1.getProcessesList)(serviceRole, companyId),
                            (0, operations_service_1.getActiveJobOperationsByLocation)(serviceRole, locationId, selectedWorkCenterIds)
                        ])];
                case 6:
                    _g = _u.sent(), workCenters = _g[0], processes = _g[1], operations = _g[2];
                    if (operations.error) {
                        console.error(operations.error);
                    }
                    activeWorkCenters = new Set();
                    (_j = operations.data) === null || _j === void 0 ? void 0 : _j.forEach(function (op) {
                        if (op.operationStatus === "In Progress") {
                            activeWorkCenters.add(op.workCenterId);
                        }
                    });
                    filteredOperations = selectedWorkCenterIds.length
                        ? ((_l = (_k = operations.data) === null || _k === void 0 ? void 0 : _k.filter(function (op) {
                            return selectedWorkCenterIds.includes(op.workCenterId);
                        })) !== null && _l !== void 0 ? _l : [])
                        : ((_m = operations.data) !== null && _m !== void 0 ? _m : []);
                    if (selectedSalesOrderIds.length) {
                        filteredOperations = filteredOperations.filter(function (op) {
                            return selectedSalesOrderIds.includes(op.salesOrderId);
                        });
                    }
                    if (selectedTags.length) {
                        filteredOperations = filteredOperations.filter(function (op) { var _a; return (_a = op.tags) === null || _a === void 0 ? void 0 : _a.some(function (tag) { return selectedTags.includes(tag); }); });
                    }
                    if (selectedAssignee.length) {
                        filteredOperations = filteredOperations.filter(function (op) {
                            return selectedAssignee.includes(op.assignee);
                        });
                    }
                    if (selectedProcessIds.length) {
                        filteredOperations = filteredOperations.filter(function (op) {
                            return selectedProcessIds.includes(op.processId);
                        });
                    }
                    if (search) {
                        filteredOperations = filteredOperations.filter(function (op) {
                            var _a;
                            return op.jobReadableId.toLowerCase().includes(search.toLowerCase()) ||
                                op.itemReadableId.toLowerCase().includes(search.toLowerCase()) ||
                                ((_a = op.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search.toLowerCase()));
                        });
                    }
                    filteredWorkCenters = (_p = (_o = workCenters.data) === null || _o === void 0 ? void 0 : _o.filter(function (wc) {
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
                    })) !== null && _p !== void 0 ? _p : [];
                    customerIds = filteredOperations.map(function (op) { return op.jobCustomerId; });
                    return [4 /*yield*/, (0, operations_service_1.getCustomers)(serviceRole, companyId, customerIds)];
                case 7:
                    customers = _u.sent();
                    availableTags = Array.from(new Set(filteredOperations.flatMap(function (op) { return op.tags || []; }))).sort();
                    return [2 /*return*/, (0, react_router_1.data)({
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
                            items: ((_q = filteredOperations.map(function (op) {
                                var _a;
                                var operation = (0, durations_1.makeDurations)(op);
                                return {
                                    id: op.id,
                                    assignee: op.assignee,
                                    tags: op.tags,
                                    columnId: op.workCenterId,
                                    columnType: op.processId,
                                    priority: op.priority,
                                    title: op.jobReadableId,
                                    subtitle: op.itemReadableId,
                                    description: op.description,
                                    dueDate: op.operationDueDate,
                                    duration: operation.setupDuration +
                                        Math.max(operation.laborDuration, operation.machineDuration),
                                    deadlineType: op.jobDeadlineType,
                                    customerId: op.jobCustomerId,
                                    operationQuantity: op.operationQuantity,
                                    targetQuantity: (_a = op.targetQuantity) !== null && _a !== void 0 ? _a : op.operationQuantity,
                                    jobReadableId: op.jobReadableId,
                                    itemReadableId: op.itemReadableId,
                                    itemDescription: op.itemDescription,
                                    salesOrderReadableId: op.salesOrderReadableId,
                                    salesOrderId: op.salesOrderId,
                                    salesOrderLineId: op.salesOrderLineId,
                                    status: op.operationStatus,
                                    thumbnailPath: op.thumbnailPath,
                                    quantity: op.operationQuantity,
                                    quantityCompleted: op.quantityComplete,
                                    quantityReworked: op.quantityReworked,
                                    quantityScrapped: op.quantityScrapped,
                                    reworkId: op.reworkId,
                                    setupDuration: operation.setupDuration,
                                    laborDuration: operation.laborDuration,
                                    machineDuration: operation.machineDuration
                                };
                            })) !== null && _q !== void 0 ? _q : []),
                            processes: (_r = processes.data) !== null && _r !== void 0 ? _r : [],
                            workCenters: (_s = workCenters.data) !== null && _s !== void 0 ? _s : [],
                            customers: (_t = customers.data) !== null && _t !== void 0 ? _t : [],
                            availableTags: availableTags
                        }, { headers: headers })];
            }
        });
    });
}
function ScheduleRoute() {
    return (<react_1.ClientOnly fallback={<div className="flex h-screen w-[calc(100dvw-var(--sidebar-width-icon))] items-center justify-center">
          <react_1.Spinner className="h-8 w-8"/>
        </div>}>
      {function () { return <KanbanSchedule />; }}
    </react_1.ClientOnly>);
}
var defaultDisplaySettings = {
    emptyWorkCenters: true,
    showDuration: true,
    showCustomer: true,
    showDescription: true,
    showDueDate: true,
    showEmployee: true,
    showProgress: true,
    showStatus: true,
    showSalesOrder: true,
    showThumbnail: true
};
var DISPLAY_SETTINGS_KEY = "kanban-schedule-display-settings";
function KanbanSchedule() {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, react_router_1.useLoaderData)(), columns = _a.columns, initialItems = _a.items, processes = _a.processes, workCenters = _a.workCenters, availableTags = _a.availableTags;
    var _b = (0, react_2.useState)(initialItems), items = _b[0], setItems = _b[1];
    (0, react_2.useEffect)(function () {
        setItems(initialItems);
    }, [initialItems]);
    var _c = (0, react_1.useLocalStorage)(DISPLAY_SETTINGS_KEY, defaultDisplaySettings), displaySettings = _c[0], setDisplaySettings = _c[1];
    var mergedDisplaySettings = (0, react_2.useMemo)(function () { return (__assign(__assign({}, defaultDisplaySettings), displaySettings)); }, [displaySettings]);
    var sortItems = (0, react_2.useCallback)(function (items) {
        return items.sort(function (a, b) { return a.priority - b.priority; });
    }, []);
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
    var _d = (0, Filter_1.useFilters)(), hasFilters = _d.hasFilters, clearFilters = _d.clearFilters;
    var currentFilters = params.getAll("filter").filter(Boolean);
    var filters = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "workCenterId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Work Center"], ["Work Center"]))),
                filter: {
                    type: "static",
                    options: workCenters.map(function (col) { return ({
                        label: col.name,
                        value: col.id
                    }); })
                }
            },
            {
                accessorKey: "processId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Process"], ["Process"]))),
                pluralHeader: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Processes"], ["Processes"]))),
                filter: {
                    type: "static",
                    options: processes
                        .filter(function (p) {
                        return p.id != null && p.name != null;
                    })
                        .map(function (p) { return ({
                        label: p.name,
                        value: p.id
                    }); })
                }
            },
            {
                accessorKey: "tag",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Tag"], ["Tag"]))),
                filter: {
                    type: "static",
                    options: availableTags.map(function (tag) { return ({
                        label: tag,
                        value: tag
                    }); })
                }
            },
            {
                accessorKey: "assignee",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                filter: {
                    type: "static",
                    options: people.map(function (person) { return ({
                        label: person.name,
                        value: person.id
                    }); })
                }
            }
        ];
    }, [processes, workCenters, availableTags, people, t]);
    return (<div className="flex flex-col h-screen w-[calc(100dvw-var(--sidebar-width-icon))]">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <react_1.SidebarTrigger className="md:hidden"/>
          <react_1.Heading size="h4">
            <macro_1.Trans>Schedule</macro_1.Trans>
          </react_1.Heading>
        </div>
      </header>
      <div className="flex flex-col h-full max-h-full overflow-auto relative">
        <react_1.HStack className="px-4 py-2 justify-between bg-card border-b border-border">
          <react_1.HStack>
            <SearchFilter_1.default param="search" size="sm" placeholder={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Search"], ["Search"])))}/>
            <Filter_1.Filter filters={filters}/>
          </react_1.HStack>

          <react_1.Popover>
            <react_1.PopoverTrigger asChild>
              <react_1.Button leftIcon={<lu_1.LuSettings2 />} variant="secondary" className="border-dashed border-border">
                <macro_1.Trans>Display</macro_1.Trans>
              </react_1.Button>
            </react_1.PopoverTrigger>
            <react_1.PopoverContent className="w-56">
              <react_1.VStack>
                <span className="text-xs font-medium text-muted-foreground">
                  <macro_1.Trans>Columns</macro_1.Trans>
                </span>
                {[
            { key: "emptyWorkCenters", label: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Empty work centers"], ["Empty work centers"]))) }
        ].map(function (_a) {
            var key = _a.key, label = _a.label;
            return (<react_1.Switch key={key} variant="small" label={label} checked={mergedDisplaySettings[key]} onCheckedChange={function (checked) {
                    return setDisplaySettings(function (prev) {
                        var _a;
                        return (__assign(__assign(__assign({}, defaultDisplaySettings), prev), (_a = {}, _a[key] = checked, _a)));
                    });
                }}/>);
        })}
                <react_1.Separator />
                <span className="text-xs font-medium text-muted-foreground">
                  <macro_1.Trans>Cards</macro_1.Trans>
                </span>
                {[
            { key: "showCustomer", label: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Customer"], ["Customer"]))) },
            { key: "showDescription", label: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Description"], ["Description"]))) },
            { key: "showDueDate", label: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Due Date"], ["Due Date"]))) },
            { key: "showDuration", label: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Duration"], ["Duration"]))) },
            { key: "showProgress", label: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Progress"], ["Progress"]))) },
            { key: "showStatus", label: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Status"], ["Status"]))) },
            { key: "showSalesOrder", label: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Sales Order"], ["Sales Order"]))) },
            { key: "showThumbnail", label: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Thumbnail"], ["Thumbnail"]))) }
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
            </react_1.PopoverContent>
          </react_1.Popover>
        </react_1.HStack>
        {currentFilters.length > 0 && (<react_1.HStack className="px-4 py-1.5 justify-between bg-card border-b border-border w-full">
            <react_1.HStack>
              <Filter_1.ActiveFilters filters={filters}/>
            </react_1.HStack>
          </react_1.HStack>)}
        <div className="flex flex-grow h-full items-stretch overflow-hidden relative">
          <div className="flex flex-1 min-h-full w-full relative">
            {columns.length > 0 ? (<Kanban_1.Kanban columns={visibleColumns} items={items} {...mergedDisplaySettings} showEmployee={false} progressByItemId={progressByOperation}/>) : hasFilters ? (<div className="flex flex-col w-full h-full items-center justify-center gap-4">
                <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
                  <lu_1.LuTriangleAlert className="h-6 w-6"/>
                </div>
                <span className="text-xs font-mono font-light text-foreground uppercase">
                  <macro_1.Trans>No results</macro_1.Trans>
                </span>
                <react_1.Button onClick={clearFilters}>
                  <macro_1.Trans>Clear Filters</macro_1.Trans>
                </react_1.Button>
              </div>) : (<div className="flex flex-col w-full h-full items-center justify-center gap-4">
                <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
                  <lu_1.LuTriangleAlert className="h-6 w-6"/>
                </div>
                <span className="text-xs font-mono font-light text-foreground uppercase">
                  <macro_1.Trans>No work centers exist</macro_1.Trans>
                </span>
              </div>)}
          </div>
        </div>
      </div>
    </div>);
}
function useProgressByOperation(items, setItems, sortItems) {
    var _this = this;
    var companyId = (0, hooks_1.useUser)().company.id;
    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    var _a = (0, auth_1.useCarbon)(), carbon = _a.carbon, accessToken = _a.accessToken;
    var _b = (0, react_2.useState)({}), productionEventsByOperation = _b[0], setProductionEventsByOperation = _b[1];
    var _c = (0, react_2.useState)({}), progressByOperation = _c[0], setProgressByOperation = _c[1];
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
        dependencies: [items.length],
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
                if (payload.new) {
                    var event_1 = payload.new;
                    if (items.some(function (item) { return item.id === event_1.jobOperationId; })) {
                        setProductionEventsByOperation(function (prev) {
                            var _a;
                            var _b;
                            return (__assign(__assign({}, prev), (_a = {}, _a[event_1.jobOperationId] = __spreadArray(__spreadArray([], ((_b = prev[event_1.jobOperationId]) !== null && _b !== void 0 ? _b : []), true), [
                                event_1
                            ], false), _a)));
                        });
                    }
                }
                else if (payload.old) {
                    var event_2 = payload.old;
                    if (items.some(function (item) { return item.id === event_2.jobOperationId; })) {
                        setProductionEventsByOperation(function (prev) {
                            var _a;
                            var _b;
                            return (__assign(__assign({}, prev), (_a = {}, _a[event_2.jobOperationId] = ((_b = prev[event_2.jobOperationId]) !== null && _b !== void 0 ? _b : []).filter(function (e) { return e.id !== event_2.id; }), _a)));
                        });
                    }
                }
            });
        }
    });
    return { progressByOperation: progressByOperation };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
