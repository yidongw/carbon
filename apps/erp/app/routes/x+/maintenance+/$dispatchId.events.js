"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
exports.default = MaintenanceDispatchEventsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var i18n_1 = require("@react-aria/i18n");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var resources_1 = require("~/modules/resources");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, dispatchId, viewClient, dispatchForLock, formData, intent, dispatch, _d, _e, workCenterId, insertEvent, _f, _g, _h, _j, eventId, updateEvent, _k, _l, _m, _o, validation, upsertEvent, _p, _q, _r, _s;
        var _t;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "resources"
                        })];
                case 1:
                    _c = _u.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    dispatchId = params.dispatchId;
                    if (!dispatchId)
                        throw new Error("dispatchId not found");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "resources"
                        })];
                case 2:
                    viewClient = (_u.sent()).client;
                    return [4 /*yield*/, viewClient
                            .from("maintenanceDispatch")
                            .select("id, status")
                            .eq("id", dispatchId)
                            .single()];
                case 3:
                    dispatchForLock = _u.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, resources_1.isMaintenanceDispatchLocked)((_t = dispatchForLock.data) === null || _t === void 0 ? void 0 : _t.status),
                            redirectTo: path_1.path.to.maintenanceDispatch(dispatchId),
                            message: "Cannot modify a locked dispatch. Reopen it first."
                        })];
                case 4:
                    _u.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _u.sent();
                    intent = formData.get("intent");
                    return [4 /*yield*/, client
                            .from("maintenanceDispatch")
                            .select("id, workCenterId")
                            .eq("id", dispatchId)
                            .single()];
                case 6:
                    dispatch = _u.sent();
                    if (!dispatch.error) return [3 /*break*/, 8];
                    _d = react_router_1.data;
                    _e = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(dispatch.error, "Failed to get dispatch"))];
                case 7: return [2 /*return*/, _d.apply(void 0, _e.concat([_u.sent()]))];
                case 8:
                    workCenterId = dispatch.data.workCenterId;
                    if (!(intent === "start")) return [3 /*break*/, 13];
                    return [4 /*yield*/, client
                            .from("maintenanceDispatchEvent")
                            .insert({
                            maintenanceDispatchId: dispatchId,
                            employeeId: userId,
                            workCenterId: workCenterId,
                            startTime: new Date().toISOString(),
                            companyId: companyId,
                            createdBy: userId
                        })
                            .select("id")
                            .single()];
                case 9:
                    insertEvent = _u.sent();
                    if (!insertEvent.error) return [3 /*break*/, 11];
                    _f = react_router_1.data;
                    _g = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(insertEvent.error, "Failed to start event"))];
                case 10: return [2 /*return*/, _f.apply(void 0, _g.concat([_u.sent()]))];
                case 11:
                    _h = react_router_1.data;
                    _j = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Event started"))];
                case 12: return [2 /*return*/, _h.apply(void 0, _j.concat([_u.sent()]))];
                case 13:
                    if (!(intent === "stop")) return [3 /*break*/, 18];
                    eventId = formData.get("eventId");
                    if (!eventId)
                        throw new Error("eventId not found");
                    return [4 /*yield*/, client
                            .from("maintenanceDispatchEvent")
                            .update({
                            endTime: new Date().toISOString(),
                            updatedBy: userId
                        })
                            .eq("id", eventId)];
                case 14:
                    updateEvent = _u.sent();
                    if (!updateEvent.error) return [3 /*break*/, 16];
                    _k = react_router_1.data;
                    _l = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateEvent.error, "Failed to stop event"))];
                case 15: return [2 /*return*/, _k.apply(void 0, _l.concat([_u.sent()]))];
                case 16:
                    _m = react_router_1.data;
                    _o = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Event stopped"))];
                case 17: return [2 /*return*/, _m.apply(void 0, _o.concat([_u.sent()]))];
                case 18: return [4 /*yield*/, (0, form_1.validator)(resources_1.maintenanceDispatchEventValidator).validate(formData)];
                case 19:
                    validation = _u.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, client.from("maintenanceDispatchEvent").insert(__assign(__assign({}, validation.data), { companyId: companyId, createdBy: userId }))];
                case 20:
                    upsertEvent = _u.sent();
                    if (!upsertEvent.error) return [3 /*break*/, 22];
                    _p = react_router_1.data;
                    _q = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(upsertEvent.error, "Failed to save event"))];
                case 21: return [2 /*return*/, _p.apply(void 0, _q.concat([_u.sent()]))];
                case 22:
                    _r = react_router_1.data;
                    _s = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Event saved"))];
                case 23: return [2 /*return*/, _r.apply(void 0, _s.concat([_u.sent()]))];
            }
        });
    });
}
function MaintenanceDispatchEventsRoute() {
    var _a;
    var dispatchId = (0, react_router_1.useParams)().dispatchId;
    if (!dispatchId)
        throw new Error("dispatchId not found");
    var user = (0, hooks_1.useUser)();
    var locale = (0, i18n_1.useLocale)().locale;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.maintenanceDispatch(dispatchId));
    var events = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.events) !== null && _a !== void 0 ? _a : [];
    var activeEvent = events.find(function (e) { var _a; return ((_a = e.employee) === null || _a === void 0 ? void 0 : _a.id) === user.id && !e.endTime; });
    return (<react_1.VStack spacing={4}>
      <react_1.HStack className="justify-between w-full">
        <h2 className="text-lg font-semibold">Time Events</h2>
        {permissions.can("update", "resources") && (<fetcher.Form method="post">
            {activeEvent ? (<>
                <input type="hidden" name="intent" value="stop"/>
                <input type="hidden" name="eventId" value={activeEvent.id}/>
                <react_1.Button type="submit" variant="secondary" leftIcon={<lu_1.LuSquare />} isLoading={fetcher.state !== "idle"}>
                  Stop Timer
                </react_1.Button>
              </>) : (<>
                <input type="hidden" name="intent" value="start"/>
                <react_1.Button type="submit" variant="primary" leftIcon={<lu_1.LuPlay />} isLoading={fetcher.state !== "idle"}>
                  Start Timer
                </react_1.Button>
              </>)}
          </fetcher.Form>)}
      </react_1.HStack>

      {events.length === 0 ? (<react_1.Card>
          <react_1.CardContent className="py-8 text-center text-muted-foreground">
            No time events recorded yet. Click "Start Timer" to begin tracking
            time.
          </react_1.CardContent>
        </react_1.Card>) : (<div className="space-y-2">
          {events.map(function (event) {
                var _a, _b, _c, _d, _e;
                return (<react_1.Card key={event.id}>
              <react_1.CardHeader className="pb-2">
                <react_1.HStack className="justify-between">
                  <react_1.HStack>
                    <components_1.EmployeeAvatar employeeId={(_a = event.employee) === null || _a === void 0 ? void 0 : _a.id} size="xs"/>
                    <span className="text-sm font-medium">
                      {(_c = (_b = event.employee) === null || _b === void 0 ? void 0 : _b.fullName) !== null && _c !== void 0 ? _c : "Unknown"}
                    </span>
                  </react_1.HStack>
                  {!event.endTime && (<span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      In Progress
                    </span>)}
                </react_1.HStack>
              </react_1.CardHeader>
              <react_1.CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Start:</span>{" "}
                    {new Date(event.startTime).toLocaleString(locale)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">End:</span>{" "}
                    {event.endTime
                        ? new Date(event.endTime).toLocaleString(locale)
                        : "-"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>{" "}
                    {event.duration ? "".concat(event.duration, " min") : "-"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Work Center:</span>{" "}
                    {(_e = (_d = event.workCenter) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : "-"}
                  </div>
                </div>
              </react_1.CardContent>
            </react_1.Card>);
            })}
        </div>)}
    </react_1.VStack>);
}
