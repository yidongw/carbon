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
exports.shouldRevalidate = void 0;
exports.loader = loader;
exports.default = AuthenticatedRoute;
var auth_1 = require("@carbon/auth");
var company_server_1 = require("@carbon/auth/company.server");
var session_server_1 = require("@carbon/auth/session.server");
var audit_1 = require("@carbon/database/audit");
var printing_1 = require("@carbon/printing");
var ui_1 = require("@carbon/printing/ui");
var react_1 = require("@carbon/react");
var stripe_server_1 = require("@carbon/stripe/stripe.server");
var utils_1 = require("@carbon/utils");
var posthog_js_1 = require("posthog-js");
var react_2 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Chat_1 = require("~/components/Chat");
var DemoBanner_1 = require("~/components/DemoBanner");
var DemoSeedTrigger_1 = require("~/components/DemoSeedTrigger");
var Layout_1 = require("~/components/Layout");
var Overlay_1 = require("~/components/Overlay");
var PlanRenewalBanner_1 = require("~/components/PlanRenewalBanner");
var TimeCardWarning_1 = require("~/components/TimeCardWarning");
var TrainingPanel_1 = require("~/components/TrainingPanel");
var useTrainingPanel_1 = require("~/hooks/useTrainingPanel");
var people_1 = require("~/modules/people");
var settings_1 = require("~/modules/settings");
var shared_server_1 = require("~/modules/shared/shared.server");
var shared_service_1 = require("~/modules/shared/shared.service");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
var shouldRevalidate = function (_a) {
    var currentUrl = _a.currentUrl, formAction = _a.formAction, defaultShouldRevalidate = _a.defaultShouldRevalidate;
    // After a magic-link login the callback action redirects here via useFetcher.
    // React Router would otherwise revalidate all loaders a second time even though
    // the session was just established — skip it.
    if (formAction === null || formAction === void 0 ? void 0 : formAction.startsWith("/callback")) {
        return false;
    }
    if (currentUrl.pathname.startsWith("/x/settings") ||
        currentUrl.pathname.startsWith("/refresh-session") ||
        currentUrl.pathname.startsWith("/x/acknowledge") ||
        currentUrl.pathname.startsWith("/x/shared/views")) {
        return true;
    }
    return defaultShouldRevalidate;
};
exports.shouldRevalidate = shouldRevalidate;
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var authSession, accessToken, companyId, expiresAt, expiresIn, userId, client, _c, companies, employeeCompaniesResult, stripeCustomer, customFields, integrations, companySettings, savedViews, user, claims, groups, defaults, auditLogEnabled, modulePreferences, printerRoutes, supplierApprovalRequired, mesOnly, employeeCompanies, hasMultipleCompanies, redirectToPicker, company, sessionCookie, companyIdCookie, requiresOnboarding, userCompanyIds, demo, realCompanyId, demoRow_1, isCurrent, needsSeed, count, extensionRequested, annualPlan, cp;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        var request = _b.request;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0: return [4 /*yield*/, (0, session_server_1.requireAuthSession)(request)];
                case 1:
                    authSession = _u.sent();
                    accessToken = authSession.accessToken, companyId = authSession.companyId, expiresAt = authSession.expiresAt, expiresIn = authSession.expiresIn, userId = authSession.userId;
                    // Block ERP access when console mode is active on this terminal.
                    // Console terminals should only access the MES app.
                    if (authSession.console) {
                        throw (0, react_router_1.redirect)((0, auth_1.getMESUrl)());
                    }
                    client = (0, auth_1.getCarbon)(accessToken);
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompanies)(client, userId),
                            (0, settings_1.getEmployeeCompanies)(client, userId),
                            (0, stripe_server_1.getStripeCustomerByCompanyId)(companyId, userId),
                            (0, shared_server_1.getCustomFieldsSchemas)(client, { companyId: companyId }),
                            (0, settings_1.getCompanyIntegrations)(client, companyId),
                            (0, settings_1.getCompanySettings)(client, companyId),
                            (0, shared_service_1.getSavedViews)(client, userId, companyId),
                            (0, users_server_1.getUser)(client, userId),
                            (0, users_server_1.getUserClaims)(userId, companyId),
                            (0, users_server_1.getUserGroups)(client, userId),
                            (0, users_server_1.getUserDefaults)(client, userId, companyId),
                            (0, audit_1.isAuditLogEnabled)(client, companyId),
                            (0, users_server_1.getModulePreferences)(client, userId, companyId),
                            (0, printing_1.getPrinterRoutes)(client, companyId),
                            (0, shared_service_1.isApprovalRequired)(client, "supplier", companyId),
                            (0, users_server_1.isMesOnlyEmployee)(userId, companyId)
                        ])];
                case 2:
                    _c = _u.sent(), companies = _c[0], employeeCompaniesResult = _c[1], stripeCustomer = _c[2], customFields = _c[3], integrations = _c[4], companySettings = _c[5], savedViews = _c[6], user = _c[7], claims = _c[8], groups = _c[9], defaults = _c[10], auditLogEnabled = _c[11], modulePreferences = _c[12], printerRoutes = _c[13], supplierApprovalRequired = _c[14], mesOnly = _c[15];
                    // Block ERP access for MES-only workers (shop-floor employee types). They can
                    // use the MES but not the office app, and are not billed as a seat.
                    if (mesOnly) {
                        throw (0, react_router_1.redirect)((0, auth_1.getMESUrl)());
                    }
                    if (!(!claims || user.error || !user.data || !groups.data)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, session_server_1.destroyAuthSession)(request)];
                case 3: throw _u.sent();
                case 4:
                    employeeCompanies = (_d = employeeCompaniesResult.data) !== null && _d !== void 0 ? _d : [];
                    hasMultipleCompanies = employeeCompanies.length > 1;
                    redirectToPicker = function () {
                        var url = new URL(request.url);
                        var dest = "".concat(url.pathname).concat(url.search);
                        return (0, react_router_1.redirect)("".concat(path_1.path.to.selectCompany, "?redirectTo=").concat(encodeURIComponent(dest)));
                    };
                    // Multi-company users must actively choose a company. The companyId cookie is
                    // the "has chosen this session" marker — set only by the picker / company
                    // switch and cleared on logout. Until it's present, force the picker so we
                    // never silently serve the alphabetically-first company.
                    if (hasMultipleCompanies && !(0, company_server_1.getCompanyId)(request)) {
                        throw redirectToPicker();
                    }
                    company = (_e = companies.data) === null || _e === void 0 ? void 0 : _e.find(function (c) { return c.companyId === companyId; });
                    if (!(!company && ((_f = companies.data) === null || _f === void 0 ? void 0 : _f.length))) return [3 /*break*/, 6];
                    // Session company is no longer valid (e.g. access revoked). Multi-company
                    // users re-pick; single-company users auto-enter their only company.
                    if (hasMultipleCompanies) {
                        throw redirectToPicker();
                    }
                    company = (_g = employeeCompanies[0]) !== null && _g !== void 0 ? _g : companies.data[0];
                    return [4 /*yield*/, (0, session_server_1.updateCompanySession)(request, company.id, (_h = company.companyGroupId) !== null && _h !== void 0 ? _h : "")];
                case 5:
                    sessionCookie = _u.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(company.id);
                    throw (0, react_router_1.redirect)(path_1.path.to.authenticatedRoot, {
                        headers: [
                            ["Set-Cookie", sessionCookie],
                            ["Set-Cookie", companyIdCookie]
                        ]
                    });
                case 6:
                    requiresOnboarding = !(company === null || company === void 0 ? void 0 : company.name);
                    if (requiresOnboarding) {
                        throw (0, react_router_1.redirect)(path_1.path.to.onboarding.root);
                    }
                    userCompanyIds = ((_j = companies.data) !== null && _j !== void 0 ? _j : [])
                        .map(function (c) { return c.id; })
                        .filter(function (id) { return Boolean(id); });
                    demo = null;
                    realCompanyId = companyId;
                    if (!userCompanyIds.length) return [3 /*break*/, 10];
                    return [4 /*yield*/, client
                            .from("demoCompany")
                            .select("id, expiresAt, seedStatus, extensionTokenExpiresAt")
                            .in("id", userCompanyIds)
                            .maybeSingle()];
                case 7:
                    demoRow_1 = (_u.sent()).data;
                    if (!demoRow_1) return [3 /*break*/, 10];
                    isCurrent = demoRow_1.id === companyId;
                    needsSeed = false;
                    if (!(isCurrent && demoRow_1.seedStatus !== "seeding")) return [3 /*break*/, 9];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id", { count: "exact", head: true })
                            .eq("companyId", demoRow_1.id)];
                case 8:
                    count = (_u.sent()).count;
                    needsSeed = (count !== null && count !== void 0 ? count : 0) === 0;
                    _u.label = 9;
                case 9:
                    extensionRequested = demoRow_1.extensionTokenExpiresAt
                        ? new Date(demoRow_1.extensionTokenExpiresAt).getTime() >
                            Date.now() + 6 * 24 * 60 * 60 * 1000
                        : false;
                    demo = {
                        id: demoRow_1.id,
                        expiresAt: demoRow_1.expiresAt,
                        isCurrent: isCurrent,
                        seedStatus: demoRow_1.seedStatus,
                        needsSeed: needsSeed,
                        extensionRequested: extensionRequested
                    };
                    realCompanyId = (_k = userCompanyIds.find(function (id) { return id !== demoRow_1.id; })) !== null && _k !== void 0 ? _k : null;
                    _u.label = 10;
                case 10:
                    annualPlan = null;
                    return [4 /*yield*/, client
                            .from("companyPlan")
                            .select("paymentMode, termEndsAt, stripeSubscriptionStatus")
                            .eq("id", companyId)
                            .maybeSingle()];
                case 11:
                    cp = (_u.sent()).data;
                    if ((cp === null || cp === void 0 ? void 0 : cp.paymentMode) === "one_time") {
                        annualPlan = {
                            termEndsAt: cp.termEndsAt,
                            status: cp.stripeSubscriptionStatus
                        };
                    }
                    return [2 /*return*/, (0, react_router_1.data)({
                            demo: demo,
                            realCompanyId: realCompanyId,
                            annualPlan: annualPlan,
                            session: {
                                accessToken: accessToken,
                                expiresIn: expiresIn,
                                expiresAt: expiresAt
                            },
                            auditLogEnabled: auditLogEnabled,
                            company: company,
                            companies: (_l = companies.data) !== null && _l !== void 0 ? _l : [],
                            companySettings: (_m = companySettings.data) !== null && _m !== void 0 ? _m : null,
                            customFields: (_o = customFields.data) !== null && _o !== void 0 ? _o : [],
                            defaults: defaults.data,
                            integrations: (_p = integrations.data) !== null && _p !== void 0 ? _p : [],
                            groups: groups.data,
                            permissions: claims === null || claims === void 0 ? void 0 : claims.permissions,
                            plan: stripeCustomer === null || stripeCustomer === void 0 ? void 0 : stripeCustomer.planId,
                            role: claims === null || claims === void 0 ? void 0 : claims.role,
                            user: user.data,
                            modulePreferences: (_q = modulePreferences.data) !== null && _q !== void 0 ? _q : [],
                            savedViews: (_r = savedViews.data) !== null && _r !== void 0 ? _r : [],
                            printerRoutes: (_s = printerRoutes.data) !== null && _s !== void 0 ? _s : [],
                            supplierApprovalRequired: supplierApprovalRequired,
                            openClockEntry: ((_t = companySettings.data) === null || _t === void 0 ? void 0 : _t.timeCardEnabled)
                                ? (0, people_1.getOpenClockEntry)(client, userId, companyId)
                                : null
                        })];
            }
        });
    });
}
function AuthenticatedRoute() {
    var _a;
    var _b = (0, react_router_1.useLoaderData)(), session = _b.session, user = _b.user, companySettings = _b.companySettings, openClockEntry = _b.openClockEntry, printerRoutes = _b.printerRoutes, demo = _b.demo, realCompanyId = _b.realCompanyId, annualPlan = _b.annualPlan;
    var navigate = (0, react_router_1.useNavigate)();
    var _c = (0, useTrainingPanel_1.useTrainingPanel)(), training = _c.training, dismiss = _c.dismiss;
    (0, react_1.useKeyboardWedge)({
        test: function (input) { return input.startsWith(path_1.MES_URL) || input.startsWith(path_1.ERP_URL); },
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
        var _a;
        if (!user)
            return;
        posthog_js_1.default.identify(user.id, {
            email: user.email,
            name: (0, utils_1.formatPersonName)({
                firstName: user.firstName,
                lastName: user.lastName
            }, (_a = companySettings === null || companySettings === void 0 ? void 0 : companySettings.lastNameFirst) !== null && _a !== void 0 ? _a : false)
        });
    });
    return (<div className="h-[100dvh] flex flex-col overflow-hidden">
      {(user === null || user === void 0 ? void 0 : user.acknowledgedITAR) === false && auth_1.CONTROLLED_ENVIRONMENT ? (<react_1.ItarPopup acknowledgeAction={path_1.path.to.acknowledge} logoutAction={path_1.path.to.logout}/>) : (<auth_1.CarbonProvider session={session}>
          <ui_1.PrintingProvider value={{
                printing: (_a = companySettings === null || companySettings === void 0 ? void 0 : companySettings.printing) !== null && _a !== void 0 ? _a : null,
                printerRoutes: printerRoutes,
                useMetric: Boolean(companySettings === null || companySettings === void 0 ? void 0 : companySettings.useMetric),
                printPath: path_1.path.to.manualPrint,
                settingsPath: path_1.path.to.printingSettings
            }}>
            <components_1.RealtimeDataProvider>
              <Layout_1.TopbarProvider>
                <Overlay_1.OverlayProvider>
                  <react_1.TooltipProvider>
                    <div className="flex flex-col h-full min-h-0" style={{
                paddingLeft: "var(--chat-panel-left, 0px)",
                paddingRight: "var(--chat-panel-right, 0px)",
                transition: "padding-left 0.35s ease-out, padding-right 0.35s ease-out"
            }}>
                      <DemoBanner_1.DemoBanner demo={demo} realCompanyId={realCompanyId}/>
                      <PlanRenewalBanner_1.PlanRenewalBanner annualPlan={annualPlan}/>
                      {(demo === null || demo === void 0 ? void 0 : demo.isCurrent) && (<DemoSeedTrigger_1.DemoSeedTrigger needsSeed={demo.needsSeed} status={demo.seedStatus}/>)}
                      <Layout_1.Topbar />
                      <div className="flex flex-1 min-h-0 relative">
                        <Layout_1.PrimaryNavigation />
                        <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-hide bg-muted sm:rounded-tl-2xl relative z-10">
                          <react_router_1.Outlet />
                        </main>
                      </div>
                    </div>
                    <TrainingPanel_1.default training={training} isOpen={false} onDismiss={dismiss}/>
                    {(companySettings === null || companySettings === void 0 ? void 0 : companySettings.timeCardEnabled) && (<react_2.Suspense fallback={null}>
                        <react_router_1.Await resolve={openClockEntry}>
                          {function (resolved) { return (<TimeCardWarning_1.TimeCardWarning openClockEntry={(resolved === null || resolved === void 0 ? void 0 : resolved.data)
                        ? {
                            id: resolved.data.id,
                            clockIn: resolved.data.clockIn
                        }
                        : null}/>); }}
                        </react_router_1.Await>
                      </react_2.Suspense>)}
                    <Overlay_1.OverlayHost />
                    <Chat_1.FloatingChat />
                  </react_1.TooltipProvider>
                </Overlay_1.OverlayProvider>
              </Layout_1.TopbarProvider>
            </components_1.RealtimeDataProvider>
          </ui_1.PrintingProvider>
        </auth_1.CarbonProvider>)}
    </div>);
}
