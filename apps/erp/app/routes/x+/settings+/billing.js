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
exports.handle = void 0;
exports.loader = loader;
exports.action = action;
exports.default = PaymentSettings;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var stripe_server_1 = require("@carbon/stripe/stripe.server");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var hooks_1 = require("~/hooks");
var PlanSelector_1 = require("~/components/PlanSelector");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Payment"], ["Payment"]))),
    to: path_1.path.to.billing
};
var transferOwnershipValidator = zod_1.z.object({
    intent: zod_1.z.literal("transfer-ownership"),
    newOwnerId: zod_1.z.string().min(1, { message: "New owner is required" })
});
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, companyPlan, companyUsage, userToCompany, userIds, employees, _d, allPlans, SELLABLE_PLAN_IDS, ipCountry, url, paymentSuccess;
        var _e, _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings"
                    })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, client
                            .from("companyPlan")
                            .select("\n      *,\n      plan:planId (\n        name,\n        userBasedPricing,\n        tasksLimit,\n        aiTokensLimit\n      )\n    ")
                            .eq("id", companyId)
                            .maybeSingle()];
                case 2:
                    companyPlan = _j.sent();
                    return [4 /*yield*/, client
                            .from("companyUsage")
                            .select("*")
                            .eq("companyId", companyId)
                            .single()];
                case 3:
                    companyUsage = _j.sent();
                    return [4 /*yield*/, client
                            .from("userToCompany")
                            .select("userId")
                            .eq("companyId", companyId)
                            .eq("role", "employee")];
                case 4:
                    userToCompany = _j.sent();
                    userIds = ((_e = userToCompany.data) === null || _e === void 0 ? void 0 : _e.map(function (utc) { return utc.userId; })) || [];
                    if (!(userIds.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("user")
                            .select("\n      id,\n      firstName,\n      lastName,\n      fullName,\n      email\n    ")
                            .in("id", userIds)];
                case 5:
                    _d = _j.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _d = { data: [], error: null };
                    _j.label = 7;
                case 7:
                    employees = _d;
                    return [4 /*yield*/, (0, settings_1.getPlans)(client)];
                case 8:
                    allPlans = _j.sent();
                    SELLABLE_PLAN_IDS = ["STARTER", "BUSINESS"];
                    ipCountry = (_g = (_f = request.headers.get("x-vercel-ip-country")) !== null && _f !== void 0 ? _f : request.headers.get("cf-ipcountry")) !== null && _g !== void 0 ? _g : null;
                    url = new URL(request.url);
                    paymentSuccess = url.searchParams.get("payment") === "success";
                    return [2 /*return*/, {
                            plan: companyPlan.data,
                            usage: companyUsage.data,
                            employees: employees.data || [],
                            plans: ((_h = allPlans.data) !== null && _h !== void 0 ? _h : []).filter(function (p) { return p.public && SELLABLE_PLAN_IDS.includes(p.id); }),
                            ipCountry: ipCountry,
                            paymentSuccess: paymentSuccess
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, companyGroupId, userId, formData, intent, quantity, companyPlan, planId, _d, _e, _f, user, company, url, err_1, _g, _h, planId, mode, quantity, _j, _k, _l, user, company, url, err_2, _m, _o, plans, priceIds, billingPortalUrl, err_3, _p, _q, validation, newOwnerId, updateResult, _r, _s, err_4, _t, _u, _v, _w;
        var _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
        var request = _b.request;
        return __generator(this, function (_8) {
            switch (_8.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "settings"
                        })];
                case 1:
                    _c = _8.sent(), client = _c.client, companyId = _c.companyId, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _8.sent();
                    intent = formData.get("intent");
                    if (!(intent === "renew-annual" || intent === "buy-seats")) return [3 /*break*/, 11];
                    quantity = Math.max(1, parseInt(String((_x = formData.get("quantity")) !== null && _x !== void 0 ? _x : "1"), 10) || 1);
                    return [4 /*yield*/, (0, settings_1.getCompanyPlan)(client, companyId)];
                case 3:
                    companyPlan = _8.sent();
                    planId = (_y = companyPlan.data) === null || _y === void 0 ? void 0 : _y.planId;
                    if (!!planId) return [3 /*break*/, 5];
                    _d = react_router_1.data;
                    _e = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "No active plan"))];
                case 4: return [2 /*return*/, _d.apply(void 0, _e.concat([_8.sent()]))];
                case 5: return [4 /*yield*/, Promise.all([
                        (0, auth_1.getUser)(client, userId),
                        (0, settings_1.getCompany)(client, companyId)
                    ])];
                case 6:
                    _f = _8.sent(), user = _f[0], company = _f[1];
                    _8.label = 7;
                case 7:
                    _8.trys.push([7, 9, , 11]);
                    return [4 /*yield*/, (0, stripe_server_1.getCheckoutUrl)({
                            planId: planId,
                            userId: userId,
                            companyId: companyId,
                            email: (_0 = (_z = user.data) === null || _z === void 0 ? void 0 : _z.email) !== null && _0 !== void 0 ? _0 : "",
                            name: (_1 = company.data) === null || _1 === void 0 ? void 0 : _1.name,
                            mode: "one_time",
                            quantity: quantity,
                            purpose: intent === "buy-seats" ? "add_seats" : "purchase"
                        })];
                case 8:
                    url = _8.sent();
                    return [2 /*return*/, (0, react_router_1.redirect)(url)];
                case 9:
                    err_1 = _8.sent();
                    console.error("Failed to start one-time checkout:", err_1);
                    _g = react_router_1.data;
                    _h = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to start checkout"))];
                case 10: return [2 /*return*/, _g.apply(void 0, _h.concat([_8.sent()]))];
                case 11:
                    if (!(intent === "choose-plan")) return [3 /*break*/, 19];
                    planId = String(formData.get("planId"));
                    mode = String((_2 = formData.get("mode")) !== null && _2 !== void 0 ? _2 : "subscription") === "one_time"
                        ? "one_time"
                        : "subscription";
                    quantity = Math.max(1, parseInt(String((_3 = formData.get("quantity")) !== null && _3 !== void 0 ? _3 : "1"), 10) || 1);
                    if (!!["STARTER", "BUSINESS"].includes(planId)) return [3 /*break*/, 13];
                    _j = react_router_1.data;
                    _k = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid plan"))];
                case 12: return [2 /*return*/, _j.apply(void 0, _k.concat([_8.sent()]))];
                case 13: return [4 /*yield*/, Promise.all([
                        (0, auth_1.getUser)(client, userId),
                        (0, settings_1.getCompany)(client, companyId)
                    ])];
                case 14:
                    _l = _8.sent(), user = _l[0], company = _l[1];
                    _8.label = 15;
                case 15:
                    _8.trys.push([15, 17, , 19]);
                    return [4 /*yield*/, (0, stripe_server_1.getCheckoutUrl)({
                            planId: planId,
                            userId: userId,
                            companyId: companyId,
                            email: (_5 = (_4 = user.data) === null || _4 === void 0 ? void 0 : _4.email) !== null && _5 !== void 0 ? _5 : "",
                            name: (_6 = company.data) === null || _6 === void 0 ? void 0 : _6.name,
                            mode: mode,
                            quantity: quantity,
                            purpose: "purchase"
                        })];
                case 16:
                    url = _8.sent();
                    return [2 /*return*/, (0, react_router_1.redirect)(url)];
                case 17:
                    err_2 = _8.sent();
                    console.error("Failed to start checkout:", err_2);
                    _m = react_router_1.data;
                    _o = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to start checkout"))];
                case 18: return [2 /*return*/, _m.apply(void 0, _o.concat([_8.sent()]))];
                case 19:
                    if (!(intent === "billing-portal")) return [3 /*break*/, 25];
                    _8.label = 20;
                case 20:
                    _8.trys.push([20, 23, , 25]);
                    return [4 /*yield*/, client
                            .from("plan")
                            .select("stripePriceId")
                            .eq("userBasedPricing", true)];
                case 21:
                    plans = _8.sent();
                    priceIds = (_7 = plans.data) === null || _7 === void 0 ? void 0 : _7.map(function (plan) { return plan.stripePriceId; });
                    return [4 /*yield*/, (0, stripe_server_1.getBillingPortalRedirectUrl)({
                            companyId: companyId,
                            priceIds: priceIds
                        })];
                case 22:
                    billingPortalUrl = _8.sent();
                    return [2 /*return*/, (0, react_router_1.redirect)(billingPortalUrl, 301)];
                case 23:
                    err_3 = _8.sent();
                    console.error("Failed to get billing portal URL:", err_3);
                    _p = react_router_1.data;
                    _q = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Failed to access billing portal"))];
                case 24: return [2 /*return*/, _p.apply(void 0, _q.concat([_8.sent()]))];
                case 25:
                    if (!(intent === "transfer-ownership")) return [3 /*break*/, 32];
                    return [4 /*yield*/, (0, form_1.validator)(transferOwnershipValidator).validate(formData)];
                case 26:
                    validation = _8.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    newOwnerId = validation.data.newOwnerId;
                    _8.label = 27;
                case 27:
                    _8.trys.push([27, 30, , 32]);
                    return [4 /*yield*/, client
                            .from("companyGroup")
                            .update({ ownerId: newOwnerId })
                            .eq("id", companyGroupId)];
                case 28:
                    updateResult = _8.sent();
                    if (updateResult.error) {
                        throw new Error(updateResult.error.message);
                    }
                    _r = react_router_1.data;
                    _s = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Company ownership has been transferred successfully"))];
                case 29: return [2 /*return*/, _r.apply(void 0, _s.concat([_8.sent()]))];
                case 30:
                    err_4 = _8.sent();
                    console.error("Failed to transfer ownership:", err_4);
                    _t = react_router_1.data;
                    _u = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Failed to transfer ownership"))];
                case 31: return [2 /*return*/, _t.apply(void 0, _u.concat([_8.sent()]))];
                case 32:
                    _v = react_router_1.data;
                    _w = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Invalid intent"))];
                case 33: return [2 /*return*/, _v.apply(void 0, _w.concat([_8.sent()]))];
            }
        });
    });
}
// This route now only handles actions - UI is in the company route
function PaymentSettings() {
    var _a, _b, _c;
    var _d = (0, react_router_1.useLoaderData)(), plan = _d.plan, usage = _d.usage, employees = _d.employees, plans = _d.plans, ipCountry = _d.ipCountry, paymentSuccess = _d.paymentSuccess;
    var isOneTime = (plan === null || plan === void 0 ? void 0 : plan.paymentMode) === "one_time";
    // A company has an active paid plan if it has a subscription or a purchased
    // one-time term; otherwise it's on the free tier and sees the plan picker.
    var hasPlan = Boolean((plan === null || plan === void 0 ? void 0 : plan.stripeSubscriptionId) ||
        ((plan === null || plan === void 0 ? void 0 : plan.paymentMode) === "one_time" && (plan === null || plan === void 0 ? void 0 : plan.termEndsAt)));
    var isOwner = (0, hooks_1.usePermissions)().isOwner;
    var userId = (0, hooks_1.useUser)().id;
    var edition = (0, react_1.useEdition)();
    var _e = (0, react_2.useState)(userId), ownerId = _e[0], setOwnerId = _e[1];
    var t = (0, macro_2.useLingui)().t;
    return (<react_1.ScrollArea className="w-full h-[calc(100dvh-49px)]">
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] h-full mx-auto gap-4">
        <react_1.Heading size="h3">
          <macro_2.Trans>Billing</macro_2.Trans>
        </react_1.Heading>
        {paymentSuccess && (<div className="w-full rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <macro_2.Trans>Payment successful! Your plan is now active.</macro_2.Trans>
          </div>)}
        {edition === utils_1.Edition.Cloud && isOwner() && (<>
            {!hasPlan ? (<react_1.Card>
                <react_1.CardHeader>
                  <react_1.CardTitle>
                    <macro_2.Trans>Choose a plan</macro_2.Trans>
                  </react_1.CardTitle>
                  <react_1.CardDescription>
                    <macro_2.Trans>
                      You're on the free plan. Upgrade to unlock more seats and
                      features.
                    </macro_2.Trans>
                  </react_1.CardDescription>
                </react_1.CardHeader>
                <react_1.CardContent>
                  <PlanSelector_1.PlanSelector plans={plans} ipCountry={ipCountry} intent="choose-plan"/>
                </react_1.CardContent>
              </react_1.Card>) : isOneTime ? (<OneTimePlanCard plan={plan} usage={usage}/>) : (<react_1.Card>
              <react_1.CardHeader>
                <react_1.CardTitle>
                  <macro_2.Trans>Manage Subscription</macro_2.Trans>
                </react_1.CardTitle>
                <react_1.CardDescription>
                  <macro_2.Trans>
                    Manage your subscription and billing information
                  </macro_2.Trans>
                </react_1.CardDescription>
              </react_1.CardHeader>
              <react_1.CardContent>
                <react_1.VStack spacing={4}>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div>
                      <h4 className="font-medium">
                        <macro_2.Trans>Plan</macro_2.Trans>
                      </h4>
                      <react_1.Status color="blue">
                        {((_a = plan === null || plan === void 0 ? void 0 : plan.plan) === null || _a === void 0 ? void 0 : _a.name) || t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["No active plan"], ["No active plan"])))}
                      </react_1.Status>
                    </div>
                    <div>
                      <h4 className="font-medium">
                        <macro_2.Trans>Status</macro_2.Trans>
                      </h4>

                      <SubscriptionStatus status={(plan === null || plan === void 0 ? void 0 : plan.stripeSubscriptionStatus) || "Unknown"}/>
                    </div>
                  </div>

                  {usage && (<div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div>
                        <h4 className="font-medium">
                          <macro_2.Trans>Users</macro_2.Trans>
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {usage.users} / {(plan === null || plan === void 0 ? void 0 : plan.usersLimit) || "∞"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">
                          <macro_2.Trans>Tasks</macro_2.Trans>
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {usage.tasks.toLocaleString()} /{" "}
                          {((_b = plan === null || plan === void 0 ? void 0 : plan.tasksLimit) === null || _b === void 0 ? void 0 : _b.toLocaleString()) || "∞"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">
                          <macro_2.Trans>AI Tokens</macro_2.Trans>
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {usage.aiTokens.toLocaleString()} /{" "}
                          {((_c = plan === null || plan === void 0 ? void 0 : plan.aiTokensLimit) === null || _c === void 0 ? void 0 : _c.toLocaleString()) || "∞"}
                        </p>
                      </div>
                    </div>)}
                </react_1.VStack>
              </react_1.CardContent>
              <react_1.CardFooter>
                <react_router_1.Form method="post" action={path_1.path.to.billing}>
                  <input type="hidden" name="intent" value="billing-portal"/>
                  <react_1.Button type="submit">
                    <macro_2.Trans>Manage Subscription</macro_2.Trans>
                  </react_1.Button>
                </react_router_1.Form>
              </react_1.CardFooter>
              </react_1.Card>)}

            <form_1.ValidatedForm validator={transferOwnershipValidator} method="post">
              <react_1.Card>
                <react_1.CardHeader>
                  <react_1.CardTitle>
                    <macro_2.Trans>Manage Ownership</macro_2.Trans>
                  </react_1.CardTitle>
                  <react_1.CardDescription>
                    <macro_2.Trans>
                      Transfer ownership of this company to another user
                    </macro_2.Trans>
                  </react_1.CardDescription>
                </react_1.CardHeader>
                <react_1.CardContent>
                  <react_1.VStack spacing={4}>
                    <p className="text-sm text-muted-foreground">
                      <macro_2.Trans>
                        As the company owner, you can transfer ownership to
                        another employee. This will give them full access to
                        billing and administrative settings.
                      </macro_2.Trans>
                    </p>
                    {employees.length > 0 ? (<>
                        <input type="hidden" name="intent" value="transfer-ownership"/>
                        <div className="grid grid-cols-2 gap-4 w-full">
                          <form_1.SelectControlled name="newOwnerId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["New Owner"], ["New Owner"])))} placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Select a new owner"], ["Select a new owner"])))} value={ownerId || undefined} onChange={function (value) {
                    if (value === null || value === void 0 ? void 0 : value.value) {
                        setOwnerId(value.value);
                    }
                }} options={employees.map(function (employee) { return ({
                    label: employee.fullName || employee.email || "",
                    value: employee.id
                }); })}/>
                        </div>
                      </>) : (<p className="text-sm text-muted-foreground">
                        <macro_2.Trans>
                          No other employees found. Add employees to enable
                          ownership transfer.
                        </macro_2.Trans>
                      </p>)}
                  </react_1.VStack>
                </react_1.CardContent>
                <react_1.CardFooter>
                  <form_1.Submit withBlocker={false} isDisabled={ownerId === userId}>
                    <macro_2.Trans>Transfer Ownership</macro_2.Trans>
                  </form_1.Submit>
                </react_1.CardFooter>
              </react_1.Card>
            </form_1.ValidatedForm>
          </>)}
      </react_1.VStack>
    </react_1.ScrollArea>);
}
function OneTimePlanCard(_a) {
    var _b, _c, _d, _e;
    var plan = _a.plan, usage = _a.usage;
    var t = (0, macro_2.useLingui)().t;
    var termEndsAt = (_b = plan === null || plan === void 0 ? void 0 : plan.termEndsAt) !== null && _b !== void 0 ? _b : null;
    var daysLeft = termEndsAt
        ? Math.max(0, Math.ceil((new Date(termEndsAt).getTime() - Date.now()) / 86400000))
        : 0;
    var usersLimit = (_c = plan === null || plan === void 0 ? void 0 : plan.usersLimit) !== null && _c !== void 0 ? _c : 0;
    var _f = (0, react_2.useState)(usersLimit || 1), renewSeats = _f[0], setRenewSeats = _f[1];
    var _g = (0, react_2.useState)(1), addSeats = _g[0], setAddSeats = _g[1];
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_2.Trans>Annual License</macro_2.Trans>
        </react_1.CardTitle>
        <react_1.CardDescription>
          <macro_2.Trans>
            One-time annual plan, paid with WeChat Pay, Alipay, or card.
          </macro_2.Trans>
        </react_1.CardDescription>
      </react_1.CardHeader>
      <react_1.CardContent>
        <react_1.VStack spacing={4}>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div>
              <h4 className="font-medium">
                <macro_2.Trans>Plan</macro_2.Trans>
              </h4>
              <react_1.Status color="blue">
                {((_d = plan === null || plan === void 0 ? void 0 : plan.plan) === null || _d === void 0 ? void 0 : _d.name) || t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["No active plan"], ["No active plan"])))}
              </react_1.Status>
            </div>
            <div>
              <h4 className="font-medium">
                <macro_2.Trans>Status</macro_2.Trans>
              </h4>
              <SubscriptionStatus status={(plan === null || plan === void 0 ? void 0 : plan.stripeSubscriptionStatus) || "Unknown"}/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t">
            <div>
              <h4 className="font-medium">
                <macro_2.Trans>Term ends</macro_2.Trans>
              </h4>
              <p className="text-sm text-muted-foreground">
                {termEndsAt
            ? "".concat((0, utils_1.formatDate)(termEndsAt), " \u00B7 ").concat(daysLeft, " ").concat(t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["days left"], ["days left"]))))
            : "—"}
              </p>
            </div>
            <div>
              <h4 className="font-medium">
                <macro_2.Trans>Seats</macro_2.Trans>
              </h4>
              <p className="text-sm text-muted-foreground">
                {(_e = usage === null || usage === void 0 ? void 0 : usage.users) !== null && _e !== void 0 ? _e : 0} / {usersLimit || "∞"}
              </p>
            </div>
          </div>
        </react_1.VStack>
      </react_1.CardContent>
      <react_1.CardFooter>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <react_router_1.Form method="post" action={path_1.path.to.billing}>
            <input type="hidden" name="intent" value="renew-annual"/>
            <input type="hidden" name="quantity" value={renewSeats}/>
            <div className="flex items-end gap-2">
              <div className="w-28">
                <react_1.Label htmlFor="renewSeats">
                  <macro_2.Trans>Seats</macro_2.Trans>
                </react_1.Label>
                <react_1.NumberField value={renewSeats} minValue={1} onChange={function (v) {
            if (Number.isFinite(v))
                setRenewSeats(v);
        }}>
                  <react_1.NumberInput id="renewSeats"/>
                </react_1.NumberField>
              </div>
              <react_1.Button type="submit">
                <macro_2.Trans>Renew 1 year</macro_2.Trans>
              </react_1.Button>
            </div>
          </react_router_1.Form>

          <div>
            <react_router_1.Form method="post" action={path_1.path.to.billing}>
              <input type="hidden" name="intent" value="buy-seats"/>
              <input type="hidden" name="quantity" value={addSeats}/>
              <div className="flex items-end gap-2">
                <div className="w-28">
                  <react_1.Label htmlFor="addSeats">
                    <macro_2.Trans>Add seats</macro_2.Trans>
                  </react_1.Label>
                  <react_1.NumberField value={addSeats} minValue={1} onChange={function (v) {
            if (Number.isFinite(v))
                setAddSeats(v);
        }}>
                    <react_1.NumberInput id="addSeats"/>
                  </react_1.NumberField>
                </div>
                <react_1.Button variant="secondary" type="submit">
                  <macro_2.Trans>Buy seats</macro_2.Trans>
                </react_1.Button>
              </div>
            </react_router_1.Form>
            <p className="text-xs text-muted-foreground mt-1">
              <macro_2.Trans>Charged prorated for the days left in your term.</macro_2.Trans>
            </p>
          </div>
        </div>
      </react_1.CardFooter>
    </react_1.Card>);
}
function SubscriptionStatus(_a) {
    var status = _a.status;
    switch (status) {
        case "Active":
            return (<react_1.Status color="green">
          <macro_2.Trans>Active</macro_2.Trans>
        </react_1.Status>);
        case "Inactive":
            return (<react_1.Status color="orange">
          <macro_2.Trans>Inactive</macro_2.Trans>
        </react_1.Status>);
        case "Cancelled":
            return (<react_1.Status color="red">
          <macro_2.Trans>Cancelled</macro_2.Trans>
        </react_1.Status>);
        default:
            return (<react_1.Status color="gray">
          <macro_2.Trans>Unknown</macro_2.Trans>
        </react_1.Status>);
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
