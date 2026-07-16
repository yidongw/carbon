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
var stripe_1 = require("stripe");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
var VERCEL_URL = process.env.VERCEL_URL;
var ERP_URL = process.env.ERP_URL;
if (!STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY is required");
    process.exit(1);
}
if (!VERCEL_URL) {
    console.error("❌ VERCEL_URL is required");
    process.exit(1);
}
// Initialize Stripe
var stripe = new stripe_1.default(STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
});
// Define the events to listen for (same as in stripe.dev.ts)
var events = [
    "checkout.session.completed",
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
    "payment_intent.canceled",
];
// const webhookUrl = `https://${VERCEL_URL}/api/webhook/stripe`;
var webhookUrl = "".concat(ERP_URL, "/api/webhook/stripe");
if (webhookUrl.includes("localhost")) {
    throw new Error("Cannot register webhook in local development mode");
}
function registerWebhook() {
    return __awaiter(this, void 0, void 0, function () {
        var existingEndpoints, existingEndpoint, updatedEndpoint, endpoint, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\uD83D\uDD04 Registering Stripe webhook for ".concat(webhookUrl, "..."));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, stripe.webhookEndpoints.list()];
                case 2:
                    existingEndpoints = _a.sent();
                    existingEndpoint = existingEndpoints.data.find(function (endpoint) { return endpoint.url === webhookUrl; });
                    if (!existingEndpoint) return [3 /*break*/, 4];
                    console.log("\u2139\uFE0F Webhook already exists for ".concat(webhookUrl));
                    console.log("\u2139\uFE0F Webhook ID: ".concat(existingEndpoint.id));
                    console.log("\u2139\uFE0F Updating webhook to ensure it has the correct event types...");
                    return [4 /*yield*/, stripe.webhookEndpoints.update(existingEndpoint.id, {
                            enabled_events: events,
                        })];
                case 3:
                    updatedEndpoint = _a.sent();
                    console.log("\u2705 Webhook updated successfully!");
                    return [2 /*return*/, updatedEndpoint];
                case 4: return [4 /*yield*/, stripe.webhookEndpoints.create({
                        url: webhookUrl,
                        enabled_events: events,
                        description: "Webhook for ".concat(VERCEL_URL),
                    })];
                case 5:
                    endpoint = _a.sent();
                    console.log("\u2705 Webhook registered successfully!");
                    console.log("\u2139\uFE0F Webhook ID: ".concat(endpoint.id));
                    console.log("\u2139\uFE0F Webhook Secret: ".concat(endpoint.secret));
                    console.log("\n\u26A0\uFE0F IMPORTANT: Add this webhook secret to your environment variables:\nSTRIPE_WEBHOOK_SECRET=".concat(endpoint.secret, "\n"));
                    return [2 /*return*/, endpoint];
                case 6:
                    error_1 = _a.sent();
                    console.error("\u274C Error registering webhook:", error_1);
                    throw error_1;
                case 7: return [2 /*return*/];
            }
        });
    });
}
registerWebhook()
    .then(function () {
    console.log("\n\uD83C\uDF89 All done! Your Stripe webhook is now registered.\n\uD83D\uDCDD Remember to add the webhook secret to your Vercel environment variables.\n");
})
    .catch(function (error) {
    console.error("\u274C Failed to register webhook:", error);
    process.exit(1);
});
