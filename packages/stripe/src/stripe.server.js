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
exports.stripe = void 0;
exports.createStripeCustomer = createStripeCustomer;
exports.getStripeCustomerByCompanyId = getStripeCustomerByCompanyId;
exports.getStripeCustomer = getStripeCustomer;
exports.getStripeCustomerId = getStripeCustomerId;
exports.getCheckoutUrl = getCheckoutUrl;
exports.getBillingPortalRedirectUrl = getBillingPortalRedirectUrl;
exports.processStripeEvent = processStripeEvent;
exports.syncStripeDataToKV = syncStripeDataToKV;
exports.updateActiveUsers = updateActiveUsers;
exports.updateSubscriptionQuantityForCompany = updateSubscriptionQuantityForCompany;
var client_server_1 = require("@carbon/auth/client.server");
var env_1 = require("@carbon/env");
var kv_1 = require("@carbon/kv");
var trigger_1 = require("@carbon/lib/trigger");
var utils_1 = require("@carbon/utils");
var stripe_1 = require("stripe");
var zod_1 = require("zod");
var gtm_events_server_1 = require("./gtm-events.server");
exports.stripe = env_1.STRIPE_SECRET_KEY
    ? new stripe_1.Stripe(env_1.STRIPE_SECRET_KEY, {
        // @ts-expect-error
        apiVersion: "2025-06-30.basil",
        typescript: true
    })
    : null;
var KvStripeCustomerSchema = zod_1.z.object({
    subscriptionId: zod_1.z.string(),
    status: zod_1.z.union([
        zod_1.z.literal("active"),
        zod_1.z.literal("canceled"),
        zod_1.z.literal("incomplete"),
        zod_1.z.literal("incomplete_expired"),
        zod_1.z.literal("past_due"),
        zod_1.z.literal("paused"),
        zod_1.z.literal("trialing"),
        zod_1.z.literal("unpaid")
    ]),
    planId: zod_1.z.string().nullish(),
    priceId: zod_1.z.string(),
    currentPeriodStart: zod_1.z.number(),
    currentPeriodEnd: zod_1.z.number(),
    cancelAtPeriodEnd: zod_1.z.boolean(),
    paymentMethod: zod_1.z
        .object({
        brand: zod_1.z.string().nullable(),
        last4: zod_1.z.string().nullable()
    })
        .nullable()
});
var allowedEventTypes = [
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "customer.subscription.paused",
    "customer.subscription.resumed",
    "customer.subscription.pending_update_applied",
    "customer.subscription.pending_update_expired",
    "customer.subscription.trial_will_end",
    "invoice.sent",
    "invoice.paid",
    "invoice.payment_failed",
    "invoice.payment_action_required",
    "invoice.upcoming",
    "invoice.marked_uncollectible",
    "invoice.payment_succeeded",
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "payment_intent.canceled"
];
function createStripeCustomer(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var customer, error_1;
        var userId = _b.userId, companyId = _b.companyId, email = _b.email, name = _b.name;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!exports.stripe) {
                        throw new Error("Stripe is not initialized");
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, exports.stripe.customers.create({
                            email: email,
                            name: name !== null && name !== void 0 ? name : undefined,
                            metadata: {
                                userId: userId,
                                companyId: companyId
                            }
                        }, {
                            maxNetworkRetries: 3
                        })];
                case 2:
                    customer = _c.sent();
                    // Store the relation between companyId and stripeCustomerId in KV
                    return [4 /*yield*/, kv_1.redis.set("stripe:company:".concat(companyId), customer.id)];
                case 3:
                    // Store the relation between companyId and stripeCustomerId in KV
                    _c.sent();
                    return [2 /*return*/, customer];
                case 4:
                    error_1 = _c.sent();
                    console.error("Error creating Stripe customer:", error_1);
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getPlanById(client, planId) {
    return client.from("plan").select("*").eq("id", planId).single();
}
function getPlanByPriceId(client, priceId) {
    return client.from("plan").select("*").eq("stripePriceId", priceId).single();
}
function getStripeCustomerByCompanyId(companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var bypassList, customerId, customer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (env_1.CarbonEdition !== utils_1.Edition.Cloud) {
                        return [2 /*return*/, null];
                    }
                    // Check if this company is in the bypass list
                    if (env_1.STRIPE_BYPASS_COMPANY_IDS) {
                        bypassList = env_1.STRIPE_BYPASS_COMPANY_IDS.split(",").map(function (id) {
                            return id.trim();
                        });
                        if (bypassList.includes(companyId) ||
                            (env_1.STRIPE_BYPASS_USER_IDS === null || env_1.STRIPE_BYPASS_USER_IDS === void 0 ? void 0 : env_1.STRIPE_BYPASS_USER_IDS.includes(userId))) {
                            // Return a mock customer object that satisfies the expected interface
                            return [2 /*return*/, {
                                    subscriptionId: "bypass-subscription",
                                    status: "active",
                                    priceId: "bypass-price",
                                    planId: utils_1.Plan.Partner,
                                    currentPeriodStart: Math.floor(Date.now() / 1000),
                                    currentPeriodEnd: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year from now
                                    cancelAtPeriodEnd: false,
                                    paymentMethod: null
                                }];
                        }
                    }
                    return [4 /*yield*/, getStripeCustomerId(companyId)];
                case 1:
                    customerId = _a.sent();
                    if (!customerId) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, getStripeCustomer(customerId, companyId)];
                case 2:
                    customer = _a.sent();
                    if (!customer || customer.status === "canceled") {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, customer];
            }
        });
    });
}
function getStripeCustomer(customerId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var cached, result, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (env_1.CarbonEdition !== utils_1.Edition.Cloud) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, kv_1.redis.get("stripe:customer:".concat(customerId))];
                case 1:
                    cached = _b.sent();
                    if (cached)
                        return [2 /*return*/, KvStripeCustomerSchema.parse(JSON.parse(cached))];
                    // Fallback: fetch from Stripe API and re-populate cache (self-heals after Redis migration data loss)
                    if (!exports.stripe)
                        return [2 /*return*/, null];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, syncStripeDataToKV(customerId, companyId)];
                case 3:
                    result = _b.sent();
                    return [2 /*return*/, (_a = result === null || result === void 0 ? void 0 : result.data) !== null && _a !== void 0 ? _a : null];
                case 4:
                    error_2 = _b.sent();
                    console.error("Failed to sync stripe data from API fallback:", error_2);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var KvStripeUserSchema = zod_1.z.string().nullish();
function getStripeCustomerId(companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var cached, _a, _b, serviceRole, data, customerId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (env_1.CarbonEdition !== utils_1.Edition.Cloud) {
                        return [2 /*return*/, null];
                    }
                    _b = (_a = KvStripeUserSchema).parse;
                    return [4 /*yield*/, kv_1.redis.get("stripe:company:".concat(companyId))];
                case 1:
                    cached = _b.apply(_a, [_c.sent()]);
                    if (cached)
                        return [2 /*return*/, cached];
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("companyPlan")
                            .select("stripeCustomerId")
                            .eq("id", companyId)
                            .single()];
                case 2:
                    data = (_c.sent()).data;
                    customerId = data === null || data === void 0 ? void 0 : data.stripeCustomerId;
                    if (!customerId) return [3 /*break*/, 4];
                    return [4 /*yield*/, kv_1.redis.set("stripe:company:".concat(companyId), customerId)];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4: return [2 /*return*/, customerId !== null && customerId !== void 0 ? customerId : null];
            }
        });
    });
}
function getStripeWebhookEvent(_a) {
    var body = _a.body, signature = _a.signature;
    if (!exports.stripe) {
        throw new Error("Stripe is not initialized");
    }
    try {
        var event_1 = exports.stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        return { success: true, event: event_1, error: null };
    }
    catch (error) {
        return { success: false, error: error, event: null };
    }
}
function getCheckoutUrl(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var customerId, stripeCustomerId, customer, serviceRole, plan, annualPriceId, seats, lineItems, price, annualUnit, cp, msLeft, daysLeft, proratedUnit, oneTimeSession, checkoutSession;
        var _c, _d, _e, _f, _g, _h;
        var planId = _b.planId, userId = _b.userId, companyId = _b.companyId, email = _b.email, name = _b.name, _j = _b.mode, mode = _j === void 0 ? "subscription" : _j, _k = _b.quantity, quantity = _k === void 0 ? 1 : _k, _l = _b.purpose, purpose = _l === void 0 ? "purchase" : _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    if (env_1.CarbonEdition !== utils_1.Edition.Cloud) {
                        return [2 /*return*/, ""];
                    }
                    return [4 /*yield*/, getStripeCustomerId(companyId)];
                case 1:
                    customerId = _m.sent();
                    stripeCustomerId = customerId;
                    if (!!stripeCustomerId) return [3 /*break*/, 3];
                    return [4 /*yield*/, createStripeCustomer({
                            userId: userId,
                            companyId: companyId,
                            email: email,
                            name: name
                        })];
                case 2:
                    customer = _m.sent();
                    stripeCustomerId = customer.id;
                    _m.label = 3;
                case 3:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, getPlanById(serviceRole, planId)];
                case 4:
                    plan = _m.sent();
                    if (!name) return [3 /*break*/, 6];
                    return [4 /*yield*/, exports.stripe.customers.update(stripeCustomerId, { name: name })];
                case 5:
                    _m.sent();
                    _m.label = 6;
                case 6:
                    if (!(mode === "one_time")) return [3 /*break*/, 11];
                    annualPriceId = (_c = plan.data) === null || _c === void 0 ? void 0 : _c.stripeAnnualPriceId;
                    if (!annualPriceId) {
                        throw new Error("Plan does not have a one-time annual price configured");
                    }
                    seats = Math.max(1, Math.floor(quantity));
                    lineItems = [
                        { price: annualPriceId, quantity: seats }
                    ];
                    if (!(purpose === "add_seats")) return [3 /*break*/, 9];
                    return [4 /*yield*/, exports.stripe.prices.retrieve(annualPriceId)];
                case 7:
                    price = _m.sent();
                    annualUnit = (_d = price.unit_amount) !== null && _d !== void 0 ? _d : 0;
                    return [4 /*yield*/, serviceRole
                            .from("companyPlan")
                            .select("termEndsAt")
                            .eq("id", companyId)
                            .maybeSingle()];
                case 8:
                    cp = (_m.sent()).data;
                    msLeft = (cp === null || cp === void 0 ? void 0 : cp.termEndsAt)
                        ? new Date(cp.termEndsAt).getTime() - Date.now()
                        : 0;
                    daysLeft = Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
                    proratedUnit = Math.max(1, Math.round((annualUnit * Math.min(daysLeft, 365)) / 365));
                    lineItems = [
                        {
                            quantity: seats,
                            price_data: {
                                currency: price.currency,
                                product_data: {
                                    name: "".concat((_f = (_e = plan.data) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : "Plan", " \u2014 additional seats (prorated)")
                                },
                                unit_amount: proratedUnit
                            }
                        }
                    ];
                    _m.label = 9;
                case 9: return [4 /*yield*/, exports.stripe.checkout.sessions.create({
                        customer: stripeCustomerId,
                        line_items: lineItems,
                        mode: "payment",
                        success_url: "".concat((0, env_1.getAppUrl)(), "/x/settings/billing?payment=success"),
                        cancel_url: "".concat((0, env_1.getAppUrl)(), "/x/settings/billing"),
                        payment_method_types: ["card", "wechat_pay", "alipay"],
                        payment_method_options: { wechat_pay: { client: "web" } },
                        // "auto" only collects billing address when required (e.g. card fraud rules).
                        // WeChat Pay and Alipay don't need it, avoiding friction for Chinese users.
                        billing_address_collection: "auto",
                        invoice_creation: { enabled: true },
                        customer_update: { address: "auto" },
                        metadata: {
                            userId: userId,
                            companyId: companyId,
                            planId: planId,
                            mode: "one_time",
                            purpose: purpose,
                            quantity: String(seats)
                        }
                    })];
                case 10:
                    oneTimeSession = _m.sent();
                    if (!oneTimeSession.url) {
                        throw new Error("Failed to create checkout session");
                    }
                    return [2 /*return*/, oneTimeSession.url];
                case 11: return [4 /*yield*/, exports.stripe.checkout.sessions.create({
                        customer: stripeCustomerId,
                        line_items: [
                            {
                                price: (_h = (_g = plan.data) === null || _g === void 0 ? void 0 : _g.stripePriceId) !== null && _h !== void 0 ? _h : "",
                                quantity: 1
                            }
                        ],
                        mode: "subscription",
                        success_url: "".concat((0, env_1.getAppUrl)(), "/x/settings/billing?payment=success"),
                        cancel_url: "".concat((0, env_1.getAppUrl)(), "/x/settings/billing"),
                        payment_method_types: ["card", "us_bank_account", "cashapp"],
                        billing_address_collection: "required",
                        automatic_tax: { enabled: true },
                        tax_id_collection: { enabled: true, required: "never" },
                        customer_update: { name: "auto", address: "auto" },
                        // No trial — the subscription is charged immediately.
                        metadata: {
                            userId: userId,
                            companyId: companyId
                        }
                    })];
                case 12:
                    checkoutSession = _m.sent();
                    if (!checkoutSession.url) {
                        throw new Error("Failed to create checkout session");
                    }
                    return [2 /*return*/, checkoutSession.url];
            }
        });
    });
}
function getBillingPortalRedirectUrl(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var customerId, portalSession;
        var companyId = _b.companyId, priceIds = _b.priceIds;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!exports.stripe) {
                        throw new Error("Stripe is not initialized");
                    }
                    if (env_1.CarbonEdition !== utils_1.Edition.Cloud) {
                        return [2 /*return*/, (0, env_1.getAppUrl)()];
                    }
                    return [4 /*yield*/, getStripeCustomerId(companyId)];
                case 1:
                    customerId = _c.sent();
                    if (!customerId) {
                        throw new Error("Customer not found");
                    }
                    return [4 /*yield*/, exports.stripe.billingPortal.sessions.create({
                            customer: customerId,
                            return_url: "".concat((0, env_1.getAppUrl)(), "/x/settings/company")
                        })];
                case 2:
                    portalSession = _c.sent();
                    if (!portalSession.url) {
                        throw new Error("Failed to create portal session");
                    }
                    return [2 /*return*/, portalSession.url];
            }
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
function isAllowedEventType(event) {
    return allowedEventTypes.includes(event.type);
}
function processStripeEvent(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, event, eventSuccess, eventError, eventType, data, customer, companyId, userId, error_3, collectedTaxId, error_4, data, customer, error_5, data, customer, serviceRole, key, error_6;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        var body = _b.body, signature = _b.signature;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    if (env_1.CarbonEdition !== utils_1.Edition.Cloud) {
                        return [2 /*return*/];
                    }
                    _c = getStripeWebhookEvent({ body: body, signature: signature }), event = _c.event, eventSuccess = _c.success, eventError = _c.error;
                    if (!eventSuccess) {
                        throw new Error("Stripe webhook event error: ".concat(eventError.message));
                    }
                    if (!isAllowedEventType(event)) {
                        console.warn("[STRIPE HOOK] Received untracked event: ".concat(event.type, ". Configure webhook event types in your Stripe dashboard."));
                        return [2 /*return*/];
                    }
                    eventType = event.type;
                    if (!(eventType === "checkout.session.completed" ||
                        eventType === "checkout.session.async_payment_succeeded")) return [3 /*break*/, 10];
                    data = event.data.object;
                    customer = data.customer;
                    companyId = (_d = data.metadata) === null || _d === void 0 ? void 0 : _d.companyId;
                    userId = (_e = data.metadata) === null || _e === void 0 ? void 0 : _e.userId;
                    if (!companyId || !userId) {
                        console.error("Missing required metadata in checkout session:", data.metadata);
                        throw new Error("Missing required metadata in checkout session");
                    }
                    if (typeof customer !== "string") {
                        throw new Error("Stripe webhook handler failed");
                    }
                    if (!(((_f = data.metadata) === null || _f === void 0 ? void 0 : _f.mode) === "one_time")) return [3 /*break*/, 5];
                    if (!(data.payment_status === "paid")) return [3 /*break*/, 4];
                    _s.label = 1;
                case 1:
                    _s.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, recordOneTimePurchase({
                            companyId: companyId,
                            customerId: customer,
                            planId: (_h = (_g = data.metadata) === null || _g === void 0 ? void 0 : _g.planId) !== null && _h !== void 0 ? _h : "",
                            quantity: Number((_k = (_j = data.metadata) === null || _j === void 0 ? void 0 : _j.quantity) !== null && _k !== void 0 ? _k : "1"),
                            purpose: ((_l = data.metadata) === null || _l === void 0 ? void 0 : _l.purpose) === "add_seats" ? "add_seats" : "purchase"
                        })];
                case 2:
                    _s.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _s.sent();
                    console.error("Error recording one-time purchase:", error_3);
                    throw new Error("Stripe webhook handler failed");
                case 4: return [2 /*return*/];
                case 5:
                    // Subscription onboarding runs only on the initial completed event, as before
                    // (async_payment_succeeded is handled above solely for one-time purchases).
                    if (eventType !== "checkout.session.completed") {
                        return [2 /*return*/];
                    }
                    collectedTaxId = (_p = (_o = (_m = data.customer_details) === null || _m === void 0 ? void 0 : _m.tax_ids) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.value;
                    _s.label = 6;
                case 6:
                    _s.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, Promise.all([
                            syncStripeDataToKV(customer, companyId),
                            sendNewCustomerNotification(customer, companyId, userId, (_r = (_q = data.customer_details) === null || _q === void 0 ? void 0 : _q.email) !== null && _r !== void 0 ? _r : undefined),
                            collectedTaxId
                                ? (0, client_server_1.getCarbonServiceRole)()
                                    .from("company")
                                    .update({ taxId: collectedTaxId })
                                    .eq("id", companyId)
                                : Promise.resolve()
                        ])];
                case 7:
                    _s.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_4 = _s.sent();
                    console.error("Error processing webhook:", error_4);
                    throw new Error("Stripe webhook handler failed");
                case 9: return [3 /*break*/, 21];
                case 10:
                    if (!(eventType === "customer.subscription.updated")) return [3 /*break*/, 15];
                    data = event.data.object;
                    customer = data.customer;
                    if (typeof customer !== "string") {
                        throw new Error("Stripe webhook handler failed");
                    }
                    _s.label = 11;
                case 11:
                    _s.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, syncStripeDataToKV(customer)];
                case 12:
                    _s.sent();
                    return [3 /*break*/, 14];
                case 13:
                    error_5 = _s.sent();
                    console.error("Error processing webhook:", error_5);
                    throw new Error("Stripe webhook handler failed");
                case 14: return [3 /*break*/, 21];
                case 15:
                    if (!(eventType === "customer.subscription.deleted")) return [3 /*break*/, 20];
                    data = event.data.object;
                    customer = data.customer;
                    if (typeof customer !== "string") {
                        throw new Error("Stripe webhook handler failed");
                    }
                    _s.label = 16;
                case 16:
                    _s.trys.push([16, 18, , 19]);
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    key = "stripe:customer:".concat(customer);
                    return [4 /*yield*/, Promise.all([
                            kv_1.redis.del(key),
                            serviceRole
                                .from("companyPlan")
                                .delete()
                                .eq("stripeCustomerId", customer)
                        ])];
                case 17:
                    _s.sent();
                    return [3 /*break*/, 19];
                case 18:
                    error_6 = _s.sent();
                    console.error("Error processing webhook:", error_6);
                    throw new Error("Stripe webhook handler failed");
                case 19: return [3 /*break*/, 21];
                case 20:
                    if (eventType === "invoice.sent" ||
                        eventType === "invoice.payment_succeeded" ||
                        eventType === "invoice.payment_failed") {
                        (0, gtm_events_server_1.forwardToGtm)(eventType, { invoice: event.data.object }).catch(function (err) {
                            console.error("[gtm-events] forward failed:", err);
                        });
                    }
                    _s.label = 21;
                case 21: return [2 /*return*/];
            }
        });
    });
}
function recordOneTimePurchase(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var serviceRole, seats, now, existing, currentSeats, error_7, plan, base, termEndsAt, companyPlanData, error;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var companyId = _b.companyId, customerId = _b.customerId, planId = _b.planId, quantity = _b.quantity, purpose = _b.purpose;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    seats = Math.max(1, Math.floor(quantity || 1));
                    now = new Date();
                    return [4 /*yield*/, serviceRole
                            .from("companyPlan")
                            .select("usersLimit, termEndsAt")
                            .eq("id", companyId)
                            .maybeSingle()];
                case 1:
                    existing = _m.sent();
                    if (!(purpose === "add_seats")) return [3 /*break*/, 3];
                    currentSeats = (_d = (_c = existing.data) === null || _c === void 0 ? void 0 : _c.usersLimit) !== null && _d !== void 0 ? _d : 0;
                    return [4 /*yield*/, serviceRole
                            .from("companyPlan")
                            .update({
                            usersLimit: currentSeats + seats,
                            stripeCustomerId: customerId,
                            stripeSubscriptionStatus: "Active",
                            paymentMode: "one_time"
                        })
                            .eq("id", companyId)];
                case 2:
                    error_7 = (_m.sent()).error;
                    if (error_7) {
                        console.error("Failed to add seats to company plan:", error_7);
                        throw new Error("Failed to add seats to company plan");
                    }
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, getPlanById(serviceRole, planId)];
                case 4:
                    plan = _m.sent();
                    base = ((_e = existing.data) === null || _e === void 0 ? void 0 : _e.termEndsAt) && new Date(existing.data.termEndsAt) > now
                        ? new Date(existing.data.termEndsAt)
                        : now;
                    termEndsAt = new Date(base);
                    termEndsAt.setFullYear(termEndsAt.getFullYear() + 1);
                    companyPlanData = {
                        id: companyId,
                        planId: (_g = (_f = plan.data) === null || _f === void 0 ? void 0 : _f.id) !== null && _g !== void 0 ? _g : planId,
                        tasksLimit: (_j = (_h = plan.data) === null || _h === void 0 ? void 0 : _h.tasksLimit) !== null && _j !== void 0 ? _j : 10000,
                        aiTokensLimit: (_l = (_k = plan.data) === null || _k === void 0 ? void 0 : _k.aiTokensLimit) !== null && _l !== void 0 ? _l : 1000000,
                        usersLimit: seats,
                        paymentMode: "one_time",
                        termEndsAt: termEndsAt.toISOString(),
                        subscriptionStartDate: now.toISOString(),
                        stripeCustomerId: customerId,
                        stripeSubscriptionStatus: "Active"
                    };
                    return [4 /*yield*/, upsertCompanyPlan(serviceRole, companyPlanData)];
                case 5:
                    error = (_m.sent()).error;
                    if (error) {
                        console.error("Failed to upsert one-time company plan:", error);
                        throw new Error("Failed to upsert one-time company plan");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function sendNewCustomerNotification(customerId, companyId, userId, email) {
    return __awaiter(this, void 0, void 0, function () {
        var subscriptions, serviceRole, subscription, plan;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!exports.stripe) {
                        throw new Error("Stripe is not initialized");
                    }
                    return [4 /*yield*/, exports.stripe.subscriptions.list({
                            customer: customerId,
                            limit: 1,
                            status: "all",
                            expand: ["data.default_payment_method"]
                        })];
                case 1:
                    subscriptions = _d.sent();
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    subscription = subscriptions.data[0];
                    return [4 /*yield*/, getPlanByPriceId(serviceRole, (_b = (_a = subscription === null || subscription === void 0 ? void 0 : subscription.items.data[0]) === null || _a === void 0 ? void 0 : _a.price.id) !== null && _b !== void 0 ? _b : "")];
                case 2:
                    plan = _d.sent();
                    if (env_1.CarbonEdition === utils_1.Edition.Cloud) {
                        (0, trigger_1.trigger)("onboard", {
                            type: "customer",
                            companyId: companyId,
                            userId: userId,
                            plan: (_c = plan.data) === null || _c === void 0 ? void 0 : _c.name
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function syncStripeDataToKV(customerId, companyIdFromMetadata) {
    return __awaiter(this, void 0, void 0, function () {
        var key, companyId, serviceRole, subscriptions, companyPlan, subscription, plan, subDataResult, subData, companyPlanData, _a, companyPlan;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
        return __generator(this, function (_3) {
            switch (_3.label) {
                case 0:
                    if (!exports.stripe) {
                        throw new Error("Stripe is not initialized");
                    }
                    key = "stripe:customer:".concat(customerId);
                    companyId = companyIdFromMetadata;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, exports.stripe.subscriptions.list({
                            customer: customerId,
                            limit: 1,
                            status: "all",
                            expand: ["data.default_payment_method"]
                        })];
                case 1:
                    subscriptions = _3.sent();
                    if (!(subscriptions.data.length === 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, kv_1.redis.del(key)];
                case 2:
                    _3.sent();
                    return [2 /*return*/, null];
                case 3:
                    if (!!companyId) return [3 /*break*/, 5];
                    return [4 /*yield*/, serviceRole
                            .from("companyPlan")
                            .select("*")
                            .eq("stripeCustomerId", customerId)
                            .single()];
                case 4:
                    companyPlan = _3.sent();
                    companyId = (_b = companyPlan.data) === null || _b === void 0 ? void 0 : _b.id;
                    _3.label = 5;
                case 5:
                    subscription = subscriptions.data[0];
                    return [4 /*yield*/, getPlanByPriceId(serviceRole, (_d = (_c = subscription === null || subscription === void 0 ? void 0 : subscription.items.data[0]) === null || _c === void 0 ? void 0 : _c.price.id) !== null && _d !== void 0 ? _d : "")];
                case 6:
                    plan = _3.sent();
                    subDataResult = KvStripeCustomerSchema.safeParse({
                        subscriptionId: (_e = subscription === null || subscription === void 0 ? void 0 : subscription.id) !== null && _e !== void 0 ? _e : "",
                        status: (_f = subscription === null || subscription === void 0 ? void 0 : subscription.status) !== null && _f !== void 0 ? _f : "active",
                        planId: (_h = (_g = plan.data) === null || _g === void 0 ? void 0 : _g.id) !== null && _h !== void 0 ? _h : null,
                        priceId: (_k = (_j = subscription === null || subscription === void 0 ? void 0 : subscription.items.data[0]) === null || _j === void 0 ? void 0 : _j.price.id) !== null && _k !== void 0 ? _k : "",
                        currentPeriodStart: (_m = (_l = subscription === null || subscription === void 0 ? void 0 : subscription.items.data[0]) === null || _l === void 0 ? void 0 : _l.current_period_start) !== null && _m !== void 0 ? _m : 0,
                        currentPeriodEnd: (_p = (_o = subscription === null || subscription === void 0 ? void 0 : subscription.items.data[0]) === null || _o === void 0 ? void 0 : _o.current_period_end) !== null && _p !== void 0 ? _p : 0,
                        cancelAtPeriodEnd: (_q = subscription === null || subscription === void 0 ? void 0 : subscription.cancel_at_period_end) !== null && _q !== void 0 ? _q : false,
                        paymentMethod: (subscription === null || subscription === void 0 ? void 0 : subscription.default_payment_method) &&
                            typeof (subscription === null || subscription === void 0 ? void 0 : subscription.default_payment_method) !== "string"
                            ? {
                                brand: (_t = (_s = (_r = subscription === null || subscription === void 0 ? void 0 : subscription.default_payment_method) === null || _r === void 0 ? void 0 : _r.card) === null || _s === void 0 ? void 0 : _s.brand) !== null && _t !== void 0 ? _t : null,
                                last4: (_w = (_v = (_u = subscription === null || subscription === void 0 ? void 0 : subscription.default_payment_method) === null || _u === void 0 ? void 0 : _u.card) === null || _v === void 0 ? void 0 : _v.last4) !== null && _w !== void 0 ? _w : null
                            }
                            : null
                    });
                    if (!subDataResult.success) {
                        console.error("Failed to parse subscription data:", subDataResult.error);
                        throw new Error("Failed to parse subscription data");
                    }
                    subData = subDataResult.data;
                    if (!companyId) return [3 /*break*/, 8];
                    companyPlanData = {
                        id: companyId,
                        planId: (_y = (_x = plan.data) === null || _x === void 0 ? void 0 : _x.id) !== null && _y !== void 0 ? _y : "",
                        tasksLimit: (_0 = (_z = plan.data) === null || _z === void 0 ? void 0 : _z.tasksLimit) !== null && _0 !== void 0 ? _0 : 0,
                        aiTokensLimit: (_2 = (_1 = plan.data) === null || _1 === void 0 ? void 0 : _1.aiTokensLimit) !== null && _2 !== void 0 ? _2 : 0,
                        usersLimit: 10, // Default value as defined in the migration
                        stripeSubscriptionStatus: (subData.cancelAtPeriodEnd
                            ? "Canceled"
                            : ["active", "trialing"].includes(subData.status)
                                ? "Active"
                                : "Inactive"),
                        stripeCustomerId: customerId,
                        stripeSubscriptionId: subData.subscriptionId,
                        subscriptionStartDate: new Date(subData.currentPeriodStart * 1000).toISOString(),
                        // This is a recurring subscription — reset any prior one-time state so
                        // the hard seat cap no longer applies (subscriptions auto-scale seats).
                        paymentMode: "subscription",
                        termEndsAt: null
                    };
                    return [4 /*yield*/, Promise.all([
                            kv_1.redis.set(key, JSON.stringify(subData)),
                            upsertCompanyPlan(serviceRole, companyPlanData)
                        ])];
                case 7:
                    _a = _3.sent(), companyPlan = _a[1];
                    if (companyPlan.error) {
                        console.error("Failed to upsert company plan:", companyPlan.error);
                    }
                    return [3 /*break*/, 9];
                case 8:
                    console.error("no company id, skipping company plan upsert");
                    _3.label = 9;
                case 9: return [2 /*return*/, subDataResult];
            }
        });
    });
}
function updateActiveUsers(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var subscriptionId = _b.subscriptionId, activeUsers = _b.activeUsers;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!exports.stripe) {
                        throw new Error("Stripe is not initialized");
                    }
                    return [4 /*yield*/, exports.stripe.subscriptionItems.update(subscriptionId, {
                            quantity: activeUsers
                        })];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function updateSubscriptionQuantityForCompany(companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceRole, companyPlanResult, _a, stripeSubscriptionId, plan, _b, activeUsersResult, mesOnlyEmployeesResult, mesOnlyUserIds_1, activeUserCount, subscription, subscriptionItemId, error_8;
        var _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (env_1.CarbonEdition !== utils_1.Edition.Cloud || !exports.stripe) {
                        return [2 /*return*/];
                    }
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 6, , 7]);
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("companyPlan")
                            .select("\n        stripeSubscriptionId,\n        plan!inner(\n          userBasedPricing\n        )\n      ")
                            .eq("id", companyId)
                            .single()];
                case 2:
                    companyPlanResult = _h.sent();
                    if (companyPlanResult.error || !companyPlanResult.data) {
                        console.log("No company plan found for company ".concat(companyId));
                        return [2 /*return*/];
                    }
                    _a = companyPlanResult.data, stripeSubscriptionId = _a.stripeSubscriptionId, plan = _a.plan;
                    // Only update if userBasedPricing is true and we have a subscription
                    if (!(plan === null || plan === void 0 ? void 0 : plan.userBasedPricing) || !stripeSubscriptionId) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Promise.all([
                            serviceRole
                                .from("userToCompany")
                                .select("userId, ...user(email)")
                                .eq("companyId", companyId),
                            serviceRole
                                .from("employee")
                                .select("id, employeeType!inner(mesOnly)")
                                .eq("companyId", companyId)
                                .eq("employeeType.mesOnly", true)
                        ])];
                case 3:
                    _b = _h.sent(), activeUsersResult = _b[0], mesOnlyEmployeesResult = _b[1];
                    if (activeUsersResult.error) {
                        console.error("Failed to count active users for company ".concat(companyId, ":"), activeUsersResult.error);
                        return [2 /*return*/];
                    }
                    if (mesOnlyEmployeesResult.error) {
                        console.error("Failed to load MES-only employees for company ".concat(companyId, ":"), mesOnlyEmployeesResult.error);
                        return [2 /*return*/];
                    }
                    mesOnlyUserIds_1 = new Set((_d = (_c = mesOnlyEmployeesResult.data) === null || _c === void 0 ? void 0 : _c.map(function (employee) { return employee.id; })) !== null && _d !== void 0 ? _d : []);
                    activeUserCount = ((_e = activeUsersResult.data) === null || _e === void 0 ? void 0 : _e.filter(function (user) {
                        var _a;
                        return !((_a = user === null || user === void 0 ? void 0 : user.email) !== null && _a !== void 0 ? _a : "").includes("@carbon.ms") &&
                            !mesOnlyUserIds_1.has(user.userId);
                    }).length) || 1;
                    return [4 /*yield*/, exports.stripe.subscriptions.retrieve(stripeSubscriptionId)];
                case 4:
                    subscription = _h.sent();
                    if (!subscription ||
                        !subscription.items ||
                        subscription.items.data.length === 0) {
                        console.error("No subscription items found for subscription ".concat(stripeSubscriptionId));
                        return [2 /*return*/];
                    }
                    subscriptionItemId = (_g = (_f = subscription === null || subscription === void 0 ? void 0 : subscription.items.data[0]) === null || _f === void 0 ? void 0 : _f.id) !== null && _g !== void 0 ? _g : "";
                    return [4 /*yield*/, exports.stripe.subscriptionItems.update(subscriptionItemId, {
                            quantity: activeUserCount
                        })];
                case 5:
                    _h.sent();
                    console.log("Updated Stripe subscription ".concat(stripeSubscriptionId, " quantity to ").concat(activeUserCount, " for company ").concat(companyId));
                    return [3 /*break*/, 7];
                case 6:
                    error_8 = _h.sent();
                    // Log error but don't throw - we don't want to block user operations
                    console.error("Failed to update Stripe subscription quantity for company ".concat(companyId, ":"), error_8);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
