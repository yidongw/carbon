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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.default = MaintenanceRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var HighPriorityIcon_1 = require("~/assets/icons/HighPriorityIcon");
var LowPriorityIcon_1 = require("~/assets/icons/LowPriorityIcon");
var MediumPriorityIcon_1 = require("~/assets/icons/MediumPriorityIcon");
var EmployeeAvatar_1 = require("~/components/EmployeeAvatar");
var Filter_1 = require("~/components/Filter");
var SearchFilter_1 = require("~/components/SearchFilter");
var context_1 = require("~/context");
var hooks_1 = require("~/hooks");
var maintenance_service_1 = require("~/services/maintenance.service");
var models_1 = require("~/services/models");
var operations_service_1 = require("~/services/operations.service");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, locationId, url, searchParams, search, filterParam, selectedWorkCenterIds, selectedPriorities, selectedStatuses, selectedOeeImpacts, _i, filterParam_1, filter, _d, key, operator, value, _e, allDispatches, assignedDispatches, workCentersResult, filteredDispatches, lowercasedSearch_1, filteredAssignedDispatches, lowercasedSearch_2;
        var _f, _g, _h, _j;
        var context = _b.context, request = _b.request;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _k.sent(), client = _c.client, userId = _c.userId;
                    locationId = (_f = context.get(context_1.userContext)) === null || _f === void 0 ? void 0 : _f.locationId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    filterParam = searchParams.getAll("filter").filter(Boolean);
                    selectedWorkCenterIds = [];
                    selectedPriorities = [];
                    selectedStatuses = [];
                    selectedOeeImpacts = [];
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
                            else if (key === "priority") {
                                if (operator === "in") {
                                    selectedPriorities = value.split(",");
                                }
                                else if (operator === "eq") {
                                    selectedPriorities = [value];
                                }
                            }
                            else if (key === "status") {
                                if (operator === "in") {
                                    selectedStatuses = value.split(",");
                                }
                                else if (operator === "eq") {
                                    selectedStatuses = [value];
                                }
                            }
                            else if (key === "oeeImpact") {
                                if (operator === "in") {
                                    selectedOeeImpacts = value.split(",");
                                }
                                else if (operator === "eq") {
                                    selectedOeeImpacts = [value];
                                }
                            }
                        }
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, maintenance_service_1.getActiveMaintenanceDispatchesByLocation)(client, locationId),
                            (0, maintenance_service_1.getMaintenanceDispatchesAssignedTo)(client, userId),
                            (0, operations_service_1.getWorkCentersByLocation)(client, locationId)
                        ])];
                case 2:
                    _e = _k.sent(), allDispatches = _e[0], assignedDispatches = _e[1], workCentersResult = _e[2];
                    filteredDispatches = (_g = allDispatches === null || allDispatches === void 0 ? void 0 : allDispatches.data) !== null && _g !== void 0 ? _g : [];
                    // Apply filters
                    if (selectedWorkCenterIds.length) {
                        filteredDispatches = filteredDispatches.filter(function (d) { var _a; return selectedWorkCenterIds.includes((_a = d.workCenterId) !== null && _a !== void 0 ? _a : ""); });
                    }
                    if (selectedPriorities.length) {
                        filteredDispatches = filteredDispatches.filter(function (d) { var _a; return selectedPriorities.includes((_a = d.priority) !== null && _a !== void 0 ? _a : ""); });
                    }
                    if (selectedStatuses.length) {
                        filteredDispatches = filteredDispatches.filter(function (d) { var _a; return selectedStatuses.includes((_a = d.status) !== null && _a !== void 0 ? _a : ""); });
                    }
                    if (selectedOeeImpacts.length) {
                        filteredDispatches = filteredDispatches.filter(function (d) { var _a; return selectedOeeImpacts.includes((_a = d.oeeImpact) !== null && _a !== void 0 ? _a : ""); });
                    }
                    if (search) {
                        lowercasedSearch_1 = search.toLowerCase();
                        filteredDispatches = filteredDispatches.filter(function (d) {
                            var _a, _b, _c, _d;
                            return ((_a = d.maintenanceDispatchId) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(lowercasedSearch_1)) ||
                                ((_b = d.workCenterName) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(lowercasedSearch_1)) ||
                                ((_c = d.severity) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(lowercasedSearch_1)) ||
                                ((_d = d.assigneeName) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(lowercasedSearch_1));
                        });
                    }
                    filteredAssignedDispatches = (_h = assignedDispatches === null || assignedDispatches === void 0 ? void 0 : assignedDispatches.data) !== null && _h !== void 0 ? _h : [];
                    if (selectedWorkCenterIds.length) {
                        filteredAssignedDispatches = filteredAssignedDispatches.filter(function (d) { var _a; return selectedWorkCenterIds.includes((_a = d.workCenterId) !== null && _a !== void 0 ? _a : ""); });
                    }
                    if (selectedPriorities.length) {
                        filteredAssignedDispatches = filteredAssignedDispatches.filter(function (d) { var _a; return selectedPriorities.includes((_a = d.priority) !== null && _a !== void 0 ? _a : ""); });
                    }
                    if (selectedStatuses.length) {
                        filteredAssignedDispatches = filteredAssignedDispatches.filter(function (d) { var _a; return selectedStatuses.includes((_a = d.status) !== null && _a !== void 0 ? _a : ""); });
                    }
                    if (selectedOeeImpacts.length) {
                        filteredAssignedDispatches = filteredAssignedDispatches.filter(function (d) { var _a; return selectedOeeImpacts.includes((_a = d.oeeImpact) !== null && _a !== void 0 ? _a : ""); });
                    }
                    if (search) {
                        lowercasedSearch_2 = search.toLowerCase();
                        filteredAssignedDispatches = filteredAssignedDispatches.filter(function (d) {
                            var _a, _b, _c, _d;
                            return ((_a = d.maintenanceDispatchId) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(lowercasedSearch_2)) ||
                                ((_b = d.workCenterName) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(lowercasedSearch_2)) ||
                                ((_c = d.severity) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(lowercasedSearch_2)) ||
                                ((_d = d.assigneeName) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(lowercasedSearch_2));
                        });
                    }
                    return [2 /*return*/, {
                            dispatches: filteredDispatches,
                            assignedDispatches: filteredAssignedDispatches,
                            locationId: locationId,
                            workCenters: ((_j = workCentersResult === null || workCentersResult === void 0 ? void 0 : workCentersResult.data) !== null && _j !== void 0 ? _j : []).map(function (wc) { return ({
                                value: wc.id,
                                label: wc.name
                            }); })
                        }];
            }
        });
    });
}
function getPriorityIcon(priority) {
    switch (priority) {
        case "Critical":
            return <bs_1.BsExclamationSquareFill className="text-red-500"/>;
        case "High":
            return <HighPriorityIcon_1.HighPriorityIcon />;
        case "Medium":
            return <MediumPriorityIcon_1.MediumPriorityIcon />;
        case "Low":
            return <LowPriorityIcon_1.LowPriorityIcon />;
    }
}
function getStatusColor(status) {
    switch (status) {
        case "Open":
            return "bg-blue-500";
        case "Assigned":
            return "bg-yellow-500";
        case "In Progress":
            return "bg-emerald-500";
        default:
            return "bg-gray-500";
    }
}
function getOeeImpactColor(oeeImpact) {
    switch (oeeImpact) {
        case "Down":
            return "destructive";
        case "Planned":
            return "secondary";
        case "Impact":
            return "outline";
        default:
            return "outline";
    }
}
function MaintenanceCard(_a) {
    var _b, _c;
    var dispatch = _a.dispatch;
    var t = (0, macro_1.useLingui)().t;
    if (!dispatch.id) {
        return null;
    }
    return (<react_router_1.Link to={path_1.path.to.maintenanceDetail(dispatch.id)}>
      <react_1.Card className="hover:border-primary/50 transition-colors cursor-pointer p-0">
        <react_1.CardHeader className="pb-2">
          <react_1.HStack className="justify-between">
            <react_1.HStack spacing={2}>
              <span className="font-mono text-sm">
                {dispatch.maintenanceDispatchId}
              </span>
              <span className={"h-2 w-2 rounded-full ".concat(getStatusColor(dispatch.status))}/>
            </react_1.HStack>
            {getPriorityIcon(dispatch.priority)}
          </react_1.HStack>
          <react_1.CardTitle className="text-base">{dispatch.workCenterName}</react_1.CardTitle>
          <react_1.CardDescription className="text-xs">
            {dispatch.severity}
          </react_1.CardDescription>
        </react_1.CardHeader>
        <react_1.CardContent>
          <react_1.HStack className="justify-between">
            <react_1.Badge variant={getOeeImpactColor((_b = dispatch.oeeImpact) !== null && _b !== void 0 ? _b : "No Impact")}>
              {(_c = dispatch.oeeImpact) !== null && _c !== void 0 ? _c : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["No Impact"], ["No Impact"])))}
            </react_1.Badge>
            {dispatch.assignee && (<EmployeeAvatar_1.default employeeId={dispatch.assignee}/>)}
          </react_1.HStack>
        </react_1.CardContent>
      </react_1.Card>
    </react_router_1.Link>);
}
function EmptyState(_a) {
    var message = _a.message, onClear = _a.onClear;
    return (<div className="flex flex-col flex-1 w-full h-[calc(100dvh-var(--header-height)*2-40px)] items-center justify-center gap-4">
      <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
        <lu_1.LuTriangleAlert className="h-6 w-6"/>
      </div>
      <span className="text-xs font-mono font-light text-foreground uppercase">
        {message}
      </span>
      {onClear && (<react_1.Button onClick={onClear}>
          <macro_1.Trans>Clear Search</macro_1.Trans>
        </react_1.Button>)}
    </div>);
}
function isToday(dateString) {
    if (!dateString)
        return false;
    var date = new Date(dateString);
    var today = new Date();
    return (date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate());
}
function MaintenanceRoute() {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, react_router_1.useLoaderData)(), dispatches = _a.dispatches, assignedDispatches = _a.assignedDispatches, workCenters = _a.workCenters;
    var _b = (0, react_2.useState)("all"), activeTab = _b[0], setActiveTab = _b[1];
    var params = (0, hooks_1.useUrlParams)()[0];
    var _c = (0, Filter_1.useFilters)(), hasFilters = _c.hasFilters, clearFilters = _c.clearFilters;
    var currentFilters = params.getAll("filter").filter(Boolean);
    var blockingDispatches = (0, react_2.useMemo)(function () {
        return dispatches.filter(function (d) {
            // Down is always blocking
            if (d.oeeImpact === "Down")
                return true;
            // Planned is only blocking if status is In Progress (active)
            if (d.oeeImpact === "Planned" && d.status === "In Progress")
                return true;
            return false;
        });
    }, [dispatches]);
    var todayDispatches = (0, react_2.useMemo)(function () {
        return dispatches.filter(function (d) { return isToday(d.plannedStartTime); });
    }, [dispatches]);
    var filters = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "workCenterId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Work Center"], ["Work Center"]))),
                filter: {
                    type: "static",
                    options: workCenters
                        .filter(function (wc) { return wc.label !== null && wc.value !== null; })
                        .map(function (wc) { return ({
                        label: wc.label,
                        value: wc.value
                    }); })
                }
            },
            {
                accessorKey: "priority",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Priority"], ["Priority"]))),
                filter: {
                    type: "static",
                    options: models_1.maintenanceDispatchPriority.map(function (p) { return ({
                        label: p,
                        value: p
                    }); })
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Status"], ["Status"]))),
                pluralHeader: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Statuses"], ["Statuses"]))),
                filter: {
                    type: "static",
                    options: [
                        { label: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Open"], ["Open"]))), value: "Open" },
                        { label: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Assigned"], ["Assigned"]))), value: "Assigned" },
                        { label: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["In Progress"], ["In Progress"]))), value: "In Progress" }
                    ]
                }
            },
            {
                accessorKey: "oeeImpact",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["OEE Impact"], ["OEE Impact"]))),
                filter: {
                    type: "static",
                    options: [
                        { label: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Down"], ["Down"]))), value: "Down" },
                        { label: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Planned"], ["Planned"]))), value: "Planned" },
                        { label: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Impact"], ["Impact"]))), value: "Impact" },
                        { label: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["No Impact"], ["No Impact"]))), value: "No Impact" }
                    ]
                }
            }
        ];
    }, [workCenters, t]);
    var getActiveDispatches = function () {
        switch (activeTab) {
            case "assigned":
                return assignedDispatches;
            case "blocking":
                return blockingDispatches;
            case "today":
                return todayDispatches;
            default:
                return dispatches;
        }
    };
    var activeDispatches = getActiveDispatches();
    return (<div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <react_1.SidebarTrigger className="md:hidden"/>
          <react_1.Heading size="h4">
            <macro_1.Trans>Maintenance</macro_1.Trans>
          </react_1.Heading>
        </div>
      </header>

      <main className="h-[calc(100dvh-var(--header-height))] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
        <div className="w-full p-4">
          <react_1.VStack spacing={4}>
            <div className="w-full">
              <react_1.Tabs value={activeTab} onValueChange={setActiveTab}>
                <react_1.HStack className="justify-between w-full">
                  <react_1.TabsList>
                    <react_1.TabsTrigger value="all">
                      <macro_1.Trans>All</macro_1.Trans>
                      {dispatches.length > 0 && (<react_1.Badge variant="secondary" className="ml-2">
                          {dispatches.length}
                        </react_1.Badge>)}
                    </react_1.TabsTrigger>
                    <react_1.TabsTrigger value="today">
                      <macro_1.Trans>Today</macro_1.Trans>
                      {todayDispatches.length > 0 && (<react_1.Badge variant="secondary" className="ml-2">
                          {todayDispatches.length}
                        </react_1.Badge>)}
                    </react_1.TabsTrigger>
                    <react_1.TabsTrigger value="assigned">
                      <macro_1.Trans>Assigned to Me</macro_1.Trans>
                      {assignedDispatches.length > 0 && (<react_1.Badge variant="secondary" className="ml-2">
                          {assignedDispatches.length}
                        </react_1.Badge>)}
                    </react_1.TabsTrigger>
                    <react_1.TabsTrigger value="blocking">
                      <macro_1.Trans>Blocking</macro_1.Trans>
                      {blockingDispatches.length > 0 && (<react_1.Badge variant="destructive" className="ml-2">
                          {blockingDispatches.length}
                        </react_1.Badge>)}
                    </react_1.TabsTrigger>
                  </react_1.TabsList>
                  <react_1.HStack spacing={2}>
                    <SearchFilter_1.default param="search" size="sm" placeholder={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Search"], ["Search"])))}/>
                    <Filter_1.Filter filters={filters}/>
                  </react_1.HStack>
                </react_1.HStack>
                {currentFilters.length > 0 && (<react_1.HStack className="py-1.5 justify-between w-full">
                    <Filter_1.ActiveFilters filters={filters}/>
                  </react_1.HStack>)}
                <react_1.TabsContent value="all" className="mt-4">
                  {activeDispatches.length > 0 ? (<div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,330px),1fr))] gap-4">
                      {activeDispatches.map(function (dispatch) { return (<MaintenanceCard key={dispatch.id} dispatch={dispatch}/>); })}
                    </div>) : hasFilters ? (<EmptyState message={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["No results found"], ["No results found"])))} onClear={clearFilters}/>) : (<EmptyState message={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["No active maintenance dispatches"], ["No active maintenance dispatches"])))}/>)}
                </react_1.TabsContent>
                <react_1.TabsContent value="today" className="mt-4">
                  {activeDispatches.length > 0 ? (<div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,330px),1fr))] gap-4">
                      {activeDispatches.map(function (dispatch) { return (<MaintenanceCard key={dispatch.id} dispatch={dispatch}/>); })}
                    </div>) : hasFilters ? (<EmptyState message={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["No results found"], ["No results found"])))} onClear={clearFilters}/>) : (<EmptyState message={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["No maintenance scheduled for today"], ["No maintenance scheduled for today"])))}/>)}
                </react_1.TabsContent>
                <react_1.TabsContent value="assigned" className="mt-4">
                  {activeDispatches.length > 0 ? (<div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,330px),1fr))] gap-4">
                      {activeDispatches.map(function (dispatch) { return (<MaintenanceCard key={dispatch.id} dispatch={dispatch}/>); })}
                    </div>) : hasFilters ? (<EmptyState message={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["No results found"], ["No results found"])))} onClear={clearFilters}/>) : (<EmptyState message={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["No dispatches assigned to you"], ["No dispatches assigned to you"])))}/>)}
                </react_1.TabsContent>
                <react_1.TabsContent value="blocking" className="mt-4">
                  {activeDispatches.length > 0 ? (<div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,330px),1fr))] gap-4">
                      {activeDispatches.map(function (dispatch) { return (<MaintenanceCard key={dispatch.id} dispatch={dispatch}/>); })}
                    </div>) : hasFilters ? (<EmptyState message={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["No results found"], ["No results found"])))} onClear={clearFilters}/>) : (<EmptyState message={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["No work centers are blocked"], ["No work centers are blocked"])))}/>)}
                </react_1.TabsContent>
              </react_1.Tabs>
            </div>
          </react_1.VStack>
        </div>
      </main>
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22;
