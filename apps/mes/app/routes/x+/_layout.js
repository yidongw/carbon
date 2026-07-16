"use strict";
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
exports.middleware = exports.shouldRevalidate = void 0;
exports.loader = loader;
exports.default = AuthenticatedRoute;
var auth_1 = require("@carbon/auth");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var printing_1 = require("@carbon/printing");
var ui_1 = require("@carbon/printing/ui");
var react_1 = require("@carbon/react");
var stripe_server_1 = require("@carbon/stripe/stripe.server");
var utils_1 = require("@carbon/utils");
var posthog_js_1 = require("posthog-js");
var react_2 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var ConsolePill_1 = require("~/components/ConsolePill");
var PinInOverlay_1 = require("~/components/PinInOverlay");
var RealtimeDataProvider_1 = require("~/components/RealtimeDataProvider");
var TimeCardWarning_1 = require("~/components/TimeCardWarning");
var context_1 = require("~/context");
var user_1 = require("~/middleware/user");
var console_server_1 = require("~/services/console.server");
var maintenance_service_1 = require("~/services/maintenance.service");
var operations_service_1 = require("~/services/operations.service");
var people_service_1 = require("~/services/people.service");
var path_1 = require("~/utils/path");
var shouldRevalidate = function (_a) {
    var currentUrl = _a.currentUrl, defaultShouldRevalidate = _a.defaultShouldRevalidate;
    if (currentUrl.pathname.startsWith("/refresh-session") ||
        currentUrl.pathname.startsWith("/switch-company")) {
        return true;
    }
    return defaultShouldRevalidate;
};
exports.shouldRevalidate = shouldRevalidate;
exports.middleware = [user_1.userMiddleware];
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, accessToken, companyId, expiresAt, expiresIn, userId, client, _d, companies, user, company, ctx, locationId, consoleMode, pinnedInUser, effectiveUserId, serviceRole, _e, companyPlan, locations, activeEvents, companySettings, openClockEntry, locationEmployees, printerRoutes, locationEmployeeIds, timeCardEnabled, consoleEnabled, lastNameFirst, activeMaintenanceCount, headers;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
        var request = _b.request, context = _b.context;
        return __generator(this, function (_2) {
            switch (_2.label) {
                case 0: return [4 /*yield*/, (0, session_server_1.requireAuthSession)(request, { verify: true })];
                case 1:
                    _c = _2.sent(), accessToken = _c.accessToken, companyId = _c.companyId, expiresAt = _c.expiresAt, expiresIn = _c.expiresIn, userId = _c.userId;
                    client = (0, auth_1.getCarbon)(accessToken);
                    return [4 /*yield*/, Promise.all([
                            (0, auth_1.getCompanies)(client, userId),
                            (0, auth_1.getUser)(client, userId)
                        ])];
                case 2:
                    _d = _2.sent(), companies = _d[0], user = _d[1];
                    if (!(user.error || !user.data)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, session_server_1.destroyAuthSession)(request)];
                case 3:
                    _2.sent();
                    _2.label = 4;
                case 4:
                    company = (_f = companies.data) === null || _f === void 0 ? void 0 : _f.find(function (c) { return c.companyId === companyId; });
                    if (!company) {
                        throw (0, react_router_1.redirect)(path_1.path.to.accountSettings);
                    }
                    ctx = context.get(context_1.userContext);
                    locationId = ctx === null || ctx === void 0 ? void 0 : ctx.locationId;
                    consoleMode = (_g = ctx === null || ctx === void 0 ? void 0 : ctx.consoleMode) !== null && _g !== void 0 ? _g : false;
                    pinnedInUser = (_h = ctx === null || ctx === void 0 ? void 0 : ctx.pinnedInUser) !== null && _h !== void 0 ? _h : null;
                    effectiveUserId = (_j = ctx === null || ctx === void 0 ? void 0 : ctx.effectiveUserId) !== null && _j !== void 0 ? _j : userId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, Promise.all([
                            (0, stripe_server_1.getStripeCustomerByCompanyId)(companyId, userId),
                            (0, operations_service_1.getLocationsByCompany)(client, companyId),
                            (0, operations_service_1.getActiveJobCount)(client, {
                                employeeId: effectiveUserId,
                                companyId: companyId
                            }),
                            client
                                .from("companySettings")
                                .select("timeCardEnabled, consoleEnabled, printing, useMetric, lastNameFirst")
                                .eq("id", companyId)
                                .single(),
                            (0, people_service_1.getOpenClockEntry)(client, effectiveUserId, companyId),
                            // Get employees at current location for console mode pin-in filtering
                            consoleMode && locationId
                                ? serviceRole
                                    .from("employeeJob")
                                    .select("id")
                                    .eq("locationId", locationId)
                                    .eq("companyId", companyId)
                                : Promise.resolve({ data: [] }),
                            (0, printing_1.getPrinterRoutes)(serviceRole, companyId)
                        ])];
                case 5:
                    _e = _2.sent(), companyPlan = _e[0], locations = _e[1], activeEvents = _e[2], companySettings = _e[3], openClockEntry = _e[4], locationEmployees = _e[5], printerRoutes = _e[6];
                    locationEmployeeIds = (_l = (_k = locationEmployees.data) === null || _k === void 0 ? void 0 : _k.map(function (e) { return e.id; })) !== null && _l !== void 0 ? _l : [];
                    timeCardEnabled = (_o = (_m = companySettings.data) === null || _m === void 0 ? void 0 : _m.timeCardEnabled) !== null && _o !== void 0 ? _o : false;
                    consoleEnabled = (_q = (_p = companySettings.data) === null || _p === void 0 ? void 0 : _p.consoleEnabled) !== null && _q !== void 0 ? _q : false;
                    lastNameFirst = (_s = (_r = companySettings.data) === null || _r === void 0 ? void 0 : _r.lastNameFirst) !== null && _s !== void 0 ? _s : false;
                    return [4 /*yield*/, (0, maintenance_service_1.getActiveMaintenanceEventsCount)(client, locationId)];
                case 6:
                    activeMaintenanceCount = _2.sent();
                    if (!companyPlan && auth_1.CarbonEdition === utils_1.Edition.Cloud) {
                        throw (0, react_router_1.redirect)(path_1.path.to.onboarding);
                    }
                    if (!locations.data || locations.data.length === 0) {
                        throw new Error("No locations found for ".concat(company.name));
                    }
                    headers = new Headers();
                    if (pinnedInUser && ctx) {
                        headers.append("Set-Cookie", (0, console_server_1.refreshConsolePinIn)(companyId, {
                            userId: pinnedInUser.userId,
                            name: pinnedInUser.name,
                            avatarUrl: pinnedInUser.avatarUrl,
                            pinnedAt: Date.now()
                        }));
                    }
                    return [2 /*return*/, (0, react_router_1.data)({
                            session: {
                                accessToken: accessToken,
                                expiresIn: expiresIn,
                                expiresAt: expiresAt
                            },
                            activeEvents: (_t = activeEvents.data) !== null && _t !== void 0 ? _t : 0,
                            activeMaintenanceCount: (_u = activeMaintenanceCount.count) !== null && _u !== void 0 ? _u : 0,
                            company: company,
                            companies: (_v = companies.data) !== null && _v !== void 0 ? _v : [],
                            consoleEnabled: consoleEnabled,
                            consoleMode: consoleEnabled && consoleMode,
                            location: locationId,
                            locationEmployeeIds: locationEmployeeIds,
                            locations: (_w = locations.data) !== null && _w !== void 0 ? _w : [],
                            openClockEntry: (openClockEntry === null || openClockEntry === void 0 ? void 0 : openClockEntry.data)
                                ? (0, people_service_1.getOpenClockEntry)(client, userId, companyId)
                                : null,
                            effectiveUserId: effectiveUserId,
                            pinnedInUser: pinnedInUser,
                            plan: companyPlan === null || companyPlan === void 0 ? void 0 : companyPlan.planId,
                            printing: (_y = (_x = companySettings.data) === null || _x === void 0 ? void 0 : _x.printing) !== null && _y !== void 0 ? _y : null,
                            printerRoutes: (_z = printerRoutes.data) !== null && _z !== void 0 ? _z : [],
                            timeCardEnabled: timeCardEnabled,
                            useMetric: (_1 = (_0 = companySettings.data) === null || _0 === void 0 ? void 0 : _0.useMetric) !== null && _1 !== void 0 ? _1 : false,
                            lastNameFirst: lastNameFirst,
                            user: user.data
                        }, headers.has("Set-Cookie") ? { headers: headers } : undefined)];
            }
        });
    });
}
function AuthenticatedRoute() {
    var _a, _b;
    var _c = (0, react_router_1.useLoaderData)(), session = _c.session, activeEvents = _c.activeEvents, activeMaintenanceCount = _c.activeMaintenanceCount, company = _c.company, companies = _c.companies, consoleEnabled = _c.consoleEnabled, consoleMode = _c.consoleMode, location = _c.location, locationEmployeeIds = _c.locationEmployeeIds, locations = _c.locations, openClockEntry = _c.openClockEntry, pinnedInUser = _c.pinnedInUser, printing = _c.printing, printerRoutes = _c.printerRoutes, timeCardEnabled = _c.timeCardEnabled, useMetric = _c.useMetric, lastNameFirst = _c.lastNameFirst, user = _c.user;
    var navigate = (0, react_router_1.useNavigate)();
    (0, react_1.useNProgress)();
    (0, react_1.useKeyboardWedge)({
        test: function (input) {
            return (input.startsWith(path_1.MES_URL) || input.startsWith(path_1.ERP_URL)) &&
                !input.includes("/kanban/complete/");
        }, // we handle this more gracefully in JobOperation
        callback: function (input) {
            try {
                var url = new URL(input);
                navigate(url.pathname + url.search);
            }
            catch (_a) {
                navigate(input);
            }
        }
    });
    (0, react_1.useMount)(function () {
        posthog_js_1.default.identify(user === null || user === void 0 ? void 0 : user.id, {
            email: user === null || user === void 0 ? void 0 : user.email,
            name: (0, utils_1.formatPersonName)({
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                lastName: user === null || user === void 0 ? void 0 : user.lastName
            }, lastNameFirst)
        });
    });
    return (<div className="h-screen w-screen overflow-y-auto md:overflow-hidden">
      {(user === null || user === void 0 ? void 0 : user.acknowledgedITAR) === false && auth_1.CONTROLLED_ENVIRONMENT ? (<react_1.ItarPopup acknowledgeAction={path_1.path.to.acknowledge} logoutAction={path_1.path.to.logout}/>) : (<auth_1.CarbonProvider session={session}>
          <ui_1.PrintingProvider value={{
                printing: printing,
                printerRoutes: printerRoutes,
                useMetric: useMetric,
                printPath: path_1.path.to.manualPrint,
                settingsPath: path_1.path.to.printingSettings,
                settingsExternal: true
            }}>
            <RealtimeDataProvider_1.default>
              <react_1.SidebarProvider defaultOpen={false} touch className="mes-sidebar-overlay">
                <react_1.TooltipProvider delayDuration={0}>
                  <components_1.AppSidebar activeEvents={activeEvents} activeMaintenanceCount={activeMaintenanceCount} company={company} companies={companies} consoleEnabled={consoleEnabled} consoleMode={consoleMode} location={location} locations={locations} openClockEntry={openClockEntry} pinnedInUser={pinnedInUser} timeCardEnabled={timeCardEnabled}/>
                  <react_router_1.Outlet />
                  {timeCardEnabled && (<react_2.Suspense fallback={null}>
                      <react_router_1.Await resolve={openClockEntry}>
                        {function (resolved) { return (<TimeCardWarning_1.TimeCardWarning openClockEntry={(resolved === null || resolved === void 0 ? void 0 : resolved.data)
                        ? {
                            id: resolved.data.id,
                            clockIn: resolved.data.clockIn
                        }
                        : null}/>); }}
                      </react_router_1.Await>
                    </react_2.Suspense>)}
                  {consoleMode && !pinnedInUser && (<PinInOverlay_1.PinInOverlay companyId={company.companyId} locationEmployeeIds={locationEmployeeIds} sessionUserId={(_a = user === null || user === void 0 ? void 0 : user.id) !== null && _a !== void 0 ? _a : ""} hasPinnedUser={false}/>)}
                  {consoleMode && pinnedInUser && (<ConsolePill_1.ConsolePill user={pinnedInUser} companyId={company.companyId} locationEmployeeIds={locationEmployeeIds} sessionUserId={(_b = user === null || user === void 0 ? void 0 : user.id) !== null && _b !== void 0 ? _b : ""}/>)}
                </react_1.TooltipProvider>
              </react_1.SidebarProvider>
            </RealtimeDataProvider_1.default>
          </ui_1.PrintingProvider>
        </auth_1.CarbonProvider>)}
    </div>);
}
