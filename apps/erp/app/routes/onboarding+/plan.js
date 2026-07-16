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
exports.action = action;
exports.default = OnboardingPlan;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var stripe_server_1 = require("@carbon/stripe/stripe.server");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var PlanSelector_1 = require("~/components/PlanSelector");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, plans, SELLABLE_PLAN_IDS, ipCountry;
        var _d, _e, _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    if (auth_1.CarbonEdition !== utils_1.Edition.Cloud) {
                        throw (0, react_router_1.redirect)(path_1.path.to.authenticatedRoot);
                    }
                    return [4 /*yield*/, (0, settings_1.getPlans)(client)];
                case 2:
                    plans = _g.sent();
                    if (!companyId) {
                        throw (0, react_router_1.redirect)(path_1.path.to.onboarding.company);
                    }
                    if (plans.error || !plans.data) {
                        throw new Error("Failed to load plans");
                    }
                    SELLABLE_PLAN_IDS = ["STARTER", "BUSINESS"];
                    ipCountry = (_e = (_d = request.headers.get("x-vercel-ip-country")) !== null && _d !== void 0 ? _d : request.headers.get("cf-ipcountry")) !== null && _e !== void 0 ? _e : null;
                    return [2 /*return*/, {
                            plans: ((_f = plans.data) !== null && _f !== void 0 ? _f : []).filter(function (p) { return p.public && SELLABLE_PLAN_IDS.includes(p.id); }),
                            companyId: companyId,
                            ipCountry: ipCountry
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, planId, mode, quantity, validPlanIds, _d, user, company, url;
        var _e, _f, _g, _h, _j;
        var request = _b.request;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _k.sent();
                    planId = String(formData.get("planId"));
                    mode = String((_e = formData.get("mode")) !== null && _e !== void 0 ? _e : "subscription") === "one_time"
                        ? "one_time"
                        : "subscription";
                    quantity = Math.max(1, parseInt(String((_f = formData.get("quantity")) !== null && _f !== void 0 ? _f : "1"), 10) || 1);
                    if (!planId) {
                        throw new Error("Plan ID is required");
                    }
                    validPlanIds = ["STARTER", "BUSINESS"];
                    if (!validPlanIds.includes(planId)) {
                        throw new Error("Invalid plan ID");
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, auth_1.getUser)(client, userId),
                            (0, settings_1.getCompany)(client, companyId)
                        ])];
                case 3:
                    _d = _k.sent(), user = _d[0], company = _d[1];
                    if (!user.data) {
                        throw new Error("User not found");
                    }
                    if (!company.data) {
                        throw new Error("Company not found");
                    }
                    return [4 /*yield*/, (0, stripe_server_1.getCheckoutUrl)({
                            planId: planId,
                            userId: userId,
                            companyId: companyId,
                            name: (_g = company.data) === null || _g === void 0 ? void 0 : _g.name,
                            email: (_j = (_h = user.data) === null || _h === void 0 ? void 0 : _h.email) !== null && _j !== void 0 ? _j : "",
                            mode: mode,
                            quantity: quantity
                        })];
                case 4:
                    url = _k.sent();
                    throw (0, react_router_1.redirect)(url);
            }
        });
    });
}
function OnboardingPlan() {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, react_router_1.useLoaderData)(), plans = _a.plans, ipCountry = _a.ipCountry;
    return (<>
      <div className="flex flex-col max-w-2xl w-full min-h-screen md:min-h-0">
        <div className="sticky top-0 bg-background z-10 mb-4 rounded-2xl">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Select a plan</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
        </div>
        <div className="flex-1 px-6">
          <PlanSelector_1.PlanSelector plans={plans} ipCountry={ipCountry}/>
        </div>
      </div>
      <div className="fixed top-0 left-2 z-10">
        <react_router_1.Form method="post" action={path_1.path.to.logout}>
          <react_1.IconButton size="lg" type="submit" variant="ghost" icon={<lu_1.LuMoveLeft />} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Back"], ["Back"])))}/>
        </react_router_1.Form>
      </div>
    </>);
}
var templateObject_1;
