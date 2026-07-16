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
exports.default = MaintenanceDetailRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var bs_1 = require("react-icons/bs");
var fa6_1 = require("react-icons/fa6");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var HighPriorityIcon_1 = require("~/assets/icons/HighPriorityIcon");
var LowPriorityIcon_1 = require("~/assets/icons/LowPriorityIcon");
var MediumPriorityIcon_1 = require("~/assets/icons/MediumPriorityIcon");
var EmployeeAvatar_1 = require("~/components/EmployeeAvatar");
var MaintenanceDispatch_1 = require("~/components/MaintenanceDispatch");
var MaintenanceOeeImpact_1 = require("~/components/MaintenanceOeeImpact");
var MaintenanceSeverity_1 = require("~/components/MaintenanceSeverity");
var maintenance_service_1 = require("~/services/maintenance.service");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, dispatchId, _d, dispatch, events, items, activeEvent, replacementParts, parts, itemTrackedEntities, _i, _e, item, trackedEntities;
        var _f, _g, _h, _j, _k;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _l.sent(), client = _c.client, userId = _c.userId;
                    dispatchId = params.dispatchId;
                    if (!dispatchId) {
                        throw new Error("Dispatch ID is required");
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, maintenance_service_1.getMaintenanceDispatch)(client, dispatchId),
                            (0, maintenance_service_1.getMaintenanceDispatchEvents)(client, dispatchId),
                            (0, maintenance_service_1.getMaintenanceDispatchItems)(client, dispatchId),
                            (0, maintenance_service_1.getActiveMaintenanceEventByEmployee)(client, userId)
                        ])];
                case 2:
                    _d = _l.sent(), dispatch = _d[0], events = _d[1], items = _d[2], activeEvent = _d[3];
                    replacementParts = [];
                    if (!((_f = dispatch.data) === null || _f === void 0 ? void 0 : _f.workCenterId)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, maintenance_service_1.getWorkCenterReplacementParts)(client, dispatch.data.workCenterId)];
                case 3:
                    parts = _l.sent();
                    replacementParts = (_g = parts.data) !== null && _g !== void 0 ? _g : [];
                    _l.label = 4;
                case 4:
                    itemTrackedEntities = {};
                    if (!items.data) return [3 /*break*/, 8];
                    _i = 0, _e = items.data;
                    _l.label = 5;
                case 5:
                    if (!(_i < _e.length)) return [3 /*break*/, 8];
                    item = _e[_i];
                    return [4 /*yield*/, (0, maintenance_service_1.getMaintenanceDispatchItemTrackedEntities)(client, item.id)];
                case 6:
                    trackedEntities = _l.sent();
                    itemTrackedEntities[item.id] = (_h = trackedEntities.data) !== null && _h !== void 0 ? _h : [];
                    _l.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, {
                        dispatch: dispatch.data,
                        events: (_j = events.data) !== null && _j !== void 0 ? _j : [],
                        items: (_k = items.data) !== null && _k !== void 0 ? _k : [],
                        activeEvent: activeEvent.data,
                        replacementParts: replacementParts,
                        itemTrackedEntities: itemTrackedEntities,
                        userId: userId
                    }];
            }
        });
    });
}
function getPriorityIcon(priority) {
    switch (priority) {
        case "Critical":
            return <bs_1.BsExclamationSquareFill className="text-red-500 h-5 w-5"/>;
        case "High":
            return <HighPriorityIcon_1.HighPriorityIcon className="h-5 w-5"/>;
        case "Medium":
            return <MediumPriorityIcon_1.MediumPriorityIcon className="h-5 w-5"/>;
        case "Low":
            return <LowPriorityIcon_1.LowPriorityIcon className="h-5 w-5"/>;
    }
}
function MaintenanceStatus(_a) {
    var status = _a.status, className = _a.className;
    switch (status) {
        case "Open":
            return (<react_1.Status color="gray" className={className}>
          {status}
        </react_1.Status>);
        case "Assigned":
            return (<react_1.Status color="yellow" className={className}>
          {status}
        </react_1.Status>);
        case "In Progress":
            return (<react_1.Status color="blue" className={className}>
          {status}
        </react_1.Status>);
        case "Completed":
            return (<react_1.Status color="green" className={className}>
          {status}
        </react_1.Status>);
        case "Cancelled":
            return (<react_1.Status color="red" className={className}>
          {status}
        </react_1.Status>);
        default:
            return null;
    }
}
function formatDuration(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return "".concat(hours, "h ").concat(minutes, "m");
    }
    return "".concat(minutes, "m");
}
var eventValidator = zod_1.z.object({
    action: zod_1.z.enum(["Start", "End", "Complete"]),
    dispatchId: zod_1.z.string(),
    workCenterId: zod_1.z.string().optional(),
    eventId: zod_1.z.string().optional()
});
var deletePartValidator = zod_1.z.object({
    action: zod_1.z.literal("delete"),
    itemId: zod_1.z.string().min(1, "Item is required")
});
function MaintenanceDetailRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var _k = (0, react_router_1.useLoaderData)(), dispatch = _k.dispatch, events = _k.events, items = _k.items, activeEvent = _k.activeEvent;
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var fetcher = (0, react_router_1.useFetcher)();
    var deleteFetcher = (0, react_router_1.useFetcher)();
    var addPartModal = (0, react_1.useDisclosure)();
    var allItems = (0, stores_1.useItems)()[0];
    // Create item options for the combobox
    var itemOptions = (0, react_2.useMemo)(function () {
        return allItems.map(function (item) { return ({
            value: item.id,
            label: item.name,
            helper: item.readableIdWithRevision
        }); });
    }, [allItems]);
    // Check if user has an active event on THIS dispatch
    var myActiveEvent = (0, react_2.useMemo)(function () {
        if (!activeEvent)
            return null;
        if (activeEvent.maintenanceDispatchId === (dispatch === null || dispatch === void 0 ? void 0 : dispatch.id)) {
            return activeEvent;
        }
        return null;
    }, [activeEvent, dispatch === null || dispatch === void 0 ? void 0 : dispatch.id]);
    var isWorking = !!myActiveEvent;
    var isCompleted = (dispatch === null || dispatch === void 0 ? void 0 : dispatch.status) === "Completed";
    // Calculate total time worked
    var totalDuration = (0, react_2.useMemo)(function () {
        return events.reduce(function (total, event) {
            var _a;
            return total + ((_a = event.duration) !== null && _a !== void 0 ? _a : 0);
        }, 0);
    }, [events]);
    if (!dispatch) {
        return (<div className="flex flex-col flex-1 items-center justify-center">
        <span className="text-muted-foreground">
          <macro_1.Trans>Dispatch not found</macro_1.Trans>
        </span>
      </div>);
    }
    return (<div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background">
        <div className="flex items-center gap-2 px-2 w-full justify-between">
          <react_1.HStack>
            <react_1.SidebarTrigger className="md:hidden"/>
            <react_router_1.Link to={path_1.path.to.maintenance}>
              <react_1.Button variant="ghost" size="sm">
                <lu_1.LuArrowLeft className="h-4 w-4"/>
              </react_1.Button>
            </react_router_1.Link>
            <react_1.Heading size="h4">{dispatch.maintenanceDispatchId}</react_1.Heading>
            <MaintenanceStatus status={dispatch.status}/>
          </react_1.HStack>
          <react_1.HStack>
            {getPriorityIcon(dispatch.priority)}
          </react_1.HStack>
        </div>
      </header>

      <main className="h-[calc(100dvh-var(--header-height))] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent p-4">
        <react_1.VStack spacing={4} className="max-w-2xl mx-auto">
          {/* Work Center & OEE Impact */}
          <react_1.Card className="w-full">
            <react_1.CardHeader>
              <react_1.CardTitle className="text-sm text-muted-foreground font-normal">
                <macro_1.Trans>Work Center</macro_1.Trans>
              </react_1.CardTitle>
            </react_1.CardHeader>
            <react_1.CardContent>
              <react_1.VStack spacing={2} className="items-start">
                <span className="text-lg font-semibold">
                  {(_b = (_a = dispatch.workCenter) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Unknown"], ["Unknown"])))}
                </span>
                <react_1.HStack>
                  <MaintenanceOeeImpact_1.default oeeImpact={dispatch.oeeImpact}/>
                  <MaintenanceSeverity_1.default severity={dispatch.severity}/>
                </react_1.HStack>
              </react_1.VStack>
            </react_1.CardContent>
          </react_1.Card>

          {/* Description */}
          {dispatch.content &&
            Object.keys(dispatch.content).length > 0 && (<react_1.Card className="w-full">
                <react_1.CardHeader>
                  <react_1.CardTitle className="text-sm text-muted-foreground font-normal">
                    <macro_1.Trans>Description</macro_1.Trans>
                  </react_1.CardTitle>
                </react_1.CardHeader>
                <react_1.CardContent>
                  <div className="prose dark:prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{
                __html: (0, react_1.generateHTML)(((_c = dispatch.content) !== null && _c !== void 0 ? _c : {}))
            }}/>
                </react_1.CardContent>
              </react_1.Card>)}

          {/* Time Tracking Controls */}
          {!isCompleted && (<react_1.Card className="w-full">
              <react_1.CardHeader>
                <react_1.CardTitle>
                  <span className="text-sm text-muted-foreground">
                    <macro_1.Trans>Time Worked: {formatDuration(totalDuration)}</macro_1.Trans>
                  </span>
                </react_1.CardTitle>
              </react_1.CardHeader>
              <react_1.CardContent className="pt-6">
                <react_1.VStack spacing={4}>
                  <react_1.HStack spacing={4} className="justify-center w-full">
                    <form_1.ValidatedForm method="post" action={path_1.path.to.maintenanceEvent} validator={eventValidator} fetcher={fetcher} defaultValues={{
                action: isWorking ? "End" : "Start",
                dispatchId: dispatch.id,
                workCenterId: (_d = dispatch.workCenterId) !== null && _d !== void 0 ? _d : undefined,
                eventId: myActiveEvent === null || myActiveEvent === void 0 ? void 0 : myActiveEvent.id
            }}>
                      <form_1.Hidden name="dispatchId" value={dispatch.id}/>
                      <form_1.Hidden name="workCenterId" value={(_e = dispatch.workCenterId) !== null && _e !== void 0 ? _e : ""}/>
                      <form_1.Hidden name="eventId" value={(_f = myActiveEvent === null || myActiveEvent === void 0 ? void 0 : myActiveEvent.id) !== null && _f !== void 0 ? _f : ""}/>
                      <form_1.Hidden name="action" value={isWorking ? "End" : "Start"}/>
                      <button type="submit" disabled={fetcher.state !== "idle"} className={"group size-24 flex flex-row items-center gap-2 justify-center rounded-full shadow-lg hover:cursor-pointer hover:drop-shadow-xl hover:scale-105 transition-all text-white text-3xl border-b-4 active:border-b-0 active:translate-y-1 disabled:bg-gray-500 disabled:hover:bg-gray-600 disabled:border-gray-700 ".concat(isWorking
                ? "bg-red-500 hover:bg-red-600 border-red-700"
                : "bg-emerald-500 hover:bg-emerald-600 border-emerald-700")}>
                        {isWorking ? (<fa6_1.FaPause className="group-hover:scale-110"/>) : (<fa6_1.FaPlay className="group-hover:scale-110"/>)}
                      </button>
                    </form_1.ValidatedForm>

                    <form_1.ValidatedForm method="post" action={path_1.path.to.maintenanceEvent} validator={eventValidator} fetcher={fetcher} defaultValues={{
                action: "Complete",
                dispatchId: dispatch.id,
                eventId: myActiveEvent === null || myActiveEvent === void 0 ? void 0 : myActiveEvent.id
            }}>
                      <form_1.Hidden name="dispatchId" value={dispatch.id}/>
                      <form_1.Hidden name="eventId" value={(_g = myActiveEvent === null || myActiveEvent === void 0 ? void 0 : myActiveEvent.id) !== null && _g !== void 0 ? _g : ""}/>
                      <form_1.Hidden name="action" value="Complete"/>
                      <button type="submit" disabled={fetcher.state !== "idle"} className="group size-24 flex flex-row items-center gap-2 justify-center bg-accent rounded-full shadow-lg hover:cursor-pointer hover:shadow-xl hover:scale-105 transition-all text-accent-foreground text-3xl disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-30">
                        <fa6_1.FaCheck className="group-hover:scale-110"/>
                      </button>
                    </form_1.ValidatedForm>
                  </react_1.HStack>
                </react_1.VStack>
              </react_1.CardContent>
            </react_1.Card>)}

          {/* Time Entries */}
          {events.length > 0 && (<react_1.Card className="w-full">
              <react_1.CardHeader>
                <react_1.CardTitle>
                  <macro_1.Trans>Time Entries</macro_1.Trans>
                </react_1.CardTitle>
              </react_1.CardHeader>
              <react_1.CardContent>
                <div className="w-full divide-y">
                  {events.map(function (event) { return (<div key={event.id} className="py-2 flex justify-between items-center">
                      <react_1.VStack spacing={2} className="items-start">
                        <EmployeeAvatar_1.default employeeId={event.employeeId} size="xs"/>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.startTime).toLocaleString(locale)}
                          {event.endTime &&
                    " - ".concat(new Date(event.endTime).toLocaleTimeString(locale))}
                        </span>
                      </react_1.VStack>
                      <span className="text-sm font-mono">
                        {event.duration
                    ? formatDuration(event.duration)
                    : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Active"], ["Active"])))}
                      </span>
                    </div>); })}
                </div>
              </react_1.CardContent>
            </react_1.Card>)}

          {/* Spare Parts */}
          {!isCompleted && (<react_1.Card className="w-full">
              <react_1.CardHeader>
                <react_1.HStack className="justify-between w-full">
                  <react_1.CardTitle className="text-sm font-medium">
                    <macro_1.Trans>Spare Parts</macro_1.Trans>
                  </react_1.CardTitle>
                  <react_1.Button variant="secondary" leftIcon={<lu_1.LuCirclePlus />} onClick={addPartModal.onOpen}>
                    <macro_1.Trans>Add</macro_1.Trans>
                  </react_1.Button>
                </react_1.HStack>
              </react_1.CardHeader>
              <react_1.CardContent>
                {items.length > 0 && (<div className="w-full divide-y">
                    {items.map(function (item) {
                    var _a;
                    return (<div key={item.id} className="py-2">
                          <div className="flex justify-between items-center">
                            <react_1.VStack spacing={0} className="items-start">
                              <span className="text-sm">{(_a = item.item) === null || _a === void 0 ? void 0 : _a.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {item.quantity} {item.unitOfMeasureCode}
                              </span>
                            </react_1.VStack>
                            <form_1.ValidatedForm method="post" action={path_1.path.to.maintenanceDispatchItem(dispatch.id)} validator={deletePartValidator} fetcher={deleteFetcher}>
                              <form_1.Hidden name="action" value="delete"/>
                              <form_1.Hidden name="itemId" value={item.id}/>
                              <react_1.IconButton type="submit" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Remove part"], ["Remove part"])))} size="sm" variant="ghost" icon={<lu_1.LuX className="h-4 w-4"/>} isDisabled={deleteFetcher.state !== "idle"}/>
                            </form_1.ValidatedForm>
                          </div>
                        </div>);
                })}
                  </div>)}
                {items.length === 0 && (<span className="text-xs text-muted-foreground">
                    <macro_1.Trans>No spare parts added yet</macro_1.Trans>
                  </span>)}
              </react_1.CardContent>
            </react_1.Card>)}

          {/* Materials (when completed) */}
          {isCompleted && items.length > 0 && (<react_1.Card className="w-full">
              <react_1.CardHeader>
                <react_1.CardTitle className="text-sm font-medium">
                  <macro_1.Trans>Spare Parts Used</macro_1.Trans>
                </react_1.CardTitle>
              </react_1.CardHeader>
              <react_1.CardContent>
                <div className="w-full divide-y">
                  {items.map(function (item) {
                var _a;
                return (<div key={item.id} className="py-2 flex justify-between items-center">
                      <span className="text-sm">{(_a = item.item) === null || _a === void 0 ? void 0 : _a.name}</span>
                      <span className="text-sm font-mono">
                        {item.quantity} {item.unitOfMeasureCode}
                      </span>
                    </div>);
            })}
                </div>
              </react_1.CardContent>
            </react_1.Card>)}

          {/* Procedure */}
          {dispatch.procedure &&
            dispatch.procedure.content &&
            Object.keys(dispatch.procedure.content).length >
                0 && (<react_1.Card className="w-full">
                <react_1.CardHeader>
                  <react_1.CardTitle className="text-sm text-muted-foreground font-normal">
                    <macro_1.Trans>Procedure</macro_1.Trans>
                  </react_1.CardTitle>
                </react_1.CardHeader>
                <react_1.CardContent>
                  <span className="text-sm font-medium mb-2 block">
                    {(_h = dispatch.procedure) === null || _h === void 0 ? void 0 : _h.name}
                  </span>
                  <div className="prose dark:prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{
                __html: (0, react_1.generateHTML)(((_j = dispatch.procedure.content) !== null && _j !== void 0 ? _j : {}))
            }}/>
                </react_1.CardContent>
              </react_1.Card>)}

          {/* Completed State */}
          {isCompleted && (<react_1.Card className="w-full bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
              <react_1.CardContent className="pt-6">
                <react_1.VStack spacing={2}>
                  <lu_1.LuCheck className="h-8 w-8 text-emerald-600"/>
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    <macro_1.Trans>Maintenance Completed</macro_1.Trans>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <macro_1.Trans>Total time: {formatDuration(totalDuration)}</macro_1.Trans>
                  </span>
                </react_1.VStack>
              </react_1.CardContent>
            </react_1.Card>)}
        </react_1.VStack>
      </main>

      {/* Add Part Modal */}
      {addPartModal.isOpen && (<MaintenanceDispatch_1.MaintenanceAddPartModal dispatchId={dispatch.id} itemOptions={itemOptions} onClose={addPartModal.onClose}/>)}
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3;
