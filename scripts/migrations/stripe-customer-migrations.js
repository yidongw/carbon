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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var dotenv_1 = require("dotenv");
var ioredis_1 = require("ioredis");
var stripe_1 = require("stripe");
var v3_1 = require("zod/v3");
var stripe_customers_1 = require("./data/stripe-customers");
(0, dotenv_1.config)();
var PROD = true;
var companies = PROD ? stripe_customers_1.productionCompanies : stripe_customers_1.localCompanies;
var redisUrl = PROD
    ? process.env.PROD_REDIS_URL
    : process.env.REDIS_URL;
if (!redisUrl) {
    throw new Error(PROD
        ? "PROD_REDIS_URL is not defined"
        : "REDIS_URL is not defined");
}
var redis = new ioredis_1.default(redisUrl);
var supabaseUrl = PROD
    ? process.env.PROD_SUPABASE_URL
    : process.env.SUPABASE_URL;
var supabaseServiceRoleKey = PROD
    ? process.env.PROD_SUPABASE_SERVICE_ROLE_KEY
    : process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl) {
    throw new Error(PROD ? "PROD_SUPABASE_URL is not defined" : "SUPABASE_URL is not defined");
}
if (!supabaseServiceRoleKey) {
    throw new Error(PROD
        ? "PROD_SUPABASE_SERVICE_ROLE_KEY is not defined"
        : "SUPABASE_SERVICE_ROLE_KEY is not defined");
}
var stripeSecretKey = PROD
    ? process.env.PROD_STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error(PROD
        ? "PROD_STRIPE_SECRET_KEY is not defined"
        : "STRIPE_SECRET_KEY is not defined");
}
var client = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceRoleKey);
var stripe = new stripe_1.Stripe(stripeSecretKey, {
    apiVersion: "2025-06-30.basil",
    typescript: true,
});
var KvStripeCustomerSchema = v3_1.z.object({
    subscriptionId: v3_1.z.string(),
    status: v3_1.z.union([
        v3_1.z.literal("active"),
        v3_1.z.literal("canceled"),
        v3_1.z.literal("incomplete"),
        v3_1.z.literal("incomplete_expired"),
        v3_1.z.literal("past_due"),
        v3_1.z.literal("paused"),
        v3_1.z.literal("trialing"),
        v3_1.z.literal("unpaid"),
    ]),
    priceId: v3_1.z.string(),
    planId: v3_1.z.string().nullable(),
    currentPeriodStart: v3_1.z.number(),
    currentPeriodEnd: v3_1.z.number(),
    cancelAtPeriodEnd: v3_1.z.boolean(),
    paymentMethod: v3_1.z
        .object({
        brand: v3_1.z.string().nullable(),
        last4: v3_1.z.string().nullable(),
    })
        .nullable(),
});
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, companies_1, companies_1_1, company, companyId, customerId, customerKey, companyKey, subscription, plan, subDataResult, subData, companyPlanData, _b, companyPlan, e_1_1;
    var _c, e_1, _d, _e;
    var _f, _g, _h, _j, _k, _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                _p.trys.push([0, 12, 13, 18]);
                _a = true, companies_1 = __asyncValues(companies);
                _p.label = 1;
            case 1: return [4 /*yield*/, companies_1.next()];
            case 2:
                if (!(companies_1_1 = _p.sent(), _c = companies_1_1.done, !_c)) return [3 /*break*/, 11];
                _e = companies_1_1.value;
                _a = false;
                company = _e;
                companyId = company.id;
                customerId = company.customerId;
                console.log(company.name);
                if (!companyId) {
                    throw new Error("Company ID is required");
                }
                if (!customerId) {
                    throw new Error("Customer ID is required");
                }
                customerKey = "stripe:customer:".concat(customerId);
                companyKey = "stripe:company:".concat(company.id);
                return [4 /*yield*/, redis.set(companyKey, customerId)];
            case 3:
                _p.sent();
                return [4 /*yield*/, getSubscription(customerId)];
            case 4:
                subscription = _p.sent();
                if (!!subscription) return [3 /*break*/, 6];
                return [4 /*yield*/, redis.del(customerKey)];
            case 5:
                _p.sent();
                return [2 /*return*/, null];
            case 6: return [4 /*yield*/, getPlanByPriceId(client, subscription.items.data[0].price.id)];
            case 7:
                plan = _p.sent();
                if (plan.error) {
                    console.error("Failed to get plan by price id:", plan.error);
                    return [3 /*break*/, 10];
                }
                subDataResult = KvStripeCustomerSchema.safeParse({
                    subscriptionId: subscription.id,
                    status: subscription.status,
                    priceId: subscription.items.data[0].price.id,
                    planId: (_g = (_f = plan.data) === null || _f === void 0 ? void 0 : _f.id) !== null && _g !== void 0 ? _g : null,
                    currentPeriodStart: subscription.items.data[0].current_period_start,
                    currentPeriodEnd: subscription.items.data[0].current_period_end,
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,
                    paymentMethod: subscription.default_payment_method &&
                        typeof subscription.default_payment_method !== "string"
                        ? {
                            brand: (_j = (_h = subscription.default_payment_method.card) === null || _h === void 0 ? void 0 : _h.brand) !== null && _j !== void 0 ? _j : null,
                            last4: (_l = (_k = subscription.default_payment_method.card) === null || _k === void 0 ? void 0 : _k.last4) !== null && _l !== void 0 ? _l : null,
                        }
                        : null,
                });
                if (!subDataResult.success) {
                    console.error("Failed to parse subscription data:", subDataResult.error);
                    throw new Error("Failed to parse subscription data");
                }
                subData = subDataResult.data;
                if (!companyId) return [3 /*break*/, 9];
                companyPlanData = {
                    id: companyId,
                    planId: (_o = (_m = plan.data) === null || _m === void 0 ? void 0 : _m.id) !== null && _o !== void 0 ? _o : null,
                    tasksLimit: plan.data.tasksLimit,
                    aiTokensLimit: plan.data.aiTokensLimit,
                    usersLimit: 10, // Default value as defined in the migration
                    stripeSubscriptionStatus: (subData.cancelAtPeriodEnd
                        ? "Canceled"
                        : ["active", "trialing"].includes(subData.status)
                            ? "Active"
                            : "Inactive"),
                    stripeCustomerId: customerId,
                    stripeSubscriptionId: subData.subscriptionId,
                    subscriptionStartDate: new Date(subData.currentPeriodStart * 1000).toISOString(),
                };
                return [4 /*yield*/, Promise.all([
                        redis.set(customerKey, JSON.stringify(subData)),
                        upsertCompanyPlan(client, companyPlanData),
                        updateCompanyOwner(client, companyId, company.ownerId),
                    ])];
            case 8:
                _b = _p.sent(), companyPlan = _b[1];
                if (companyPlan.error) {
                    console.error("Failed to upsert company plan:", companyPlan.error);
                }
                return [3 /*break*/, 10];
            case 9:
                console.error("no company id, skipping company plan upsert");
                _p.label = 10;
            case 10:
                _a = true;
                return [3 /*break*/, 1];
            case 11: return [3 /*break*/, 18];
            case 12:
                e_1_1 = _p.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 18];
            case 13:
                _p.trys.push([13, , 16, 17]);
                if (!(!_a && !_c && (_d = companies_1.return))) return [3 /*break*/, 15];
                return [4 /*yield*/, _d.call(companies_1)];
            case 14:
                _p.sent();
                _p.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 17: return [7 /*endfinally*/];
            case 18: return [2 /*return*/];
        }
    });
}); })();
function getSubscription(customerId) {
    return __awaiter(this, void 0, void 0, function () {
        var subscriptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, stripe.subscriptions.list({
                        customer: customerId,
                        limit: 1,
                        status: "all",
                        expand: ["data.default_payment_method"],
                    })];
                case 1:
                    subscriptions = _a.sent();
                    return [2 /*return*/, subscriptions.data[0]];
            }
        });
    });
}
function getPlanByPriceId(client, priceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("plan")
                        .select("*")
                        .eq("stripePriceId", priceId)
                        .single()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function updateCompanyOwner(client, companyId, ownerId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("company").update({ ownerId: ownerId }).eq("id", companyId)];
        });
    });
}
function upsertCompanyPlan(client, companyPlan) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("companyPlan").upsert(companyPlan)];
        });
    });
}
