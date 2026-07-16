"use strict";
/**
 * Xero Webhook Handler
 *
 * This endpoint receives webhook notifications from Xero when entities
 * (contacts, invoices, etc.) are created, updated, or deleted in Xero.
 *
 * The webhook handler implements Xero's intent-to-receive workflow:
 * 1. Validates the webhook signature for security
 * 2. Returns HTTP 200 for valid signatures (intent-to-receive)
 * 3. Once Xero confirms the webhook is working, processes actual events
 * 4. Looks up the company integration by Xero tenant ID
 * 5. Triggers background sync jobs to process the entity changes
 *
 * Supported entity types:
 * - Contact: Synced to Carbon's customer/supplier table (based on IsCustomer/IsSupplier flags)
 * - Invoice: Synced to Carbon's invoice table
 *
 * The actual sync logic is handled asynchronously by the accounting-sync
 * background job to prevent webhook timeouts and ensure reliability.
 */
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
exports.config = void 0;
exports.action = action;
var auth_1 = require("@carbon/auth");
var client_server_1 = require("@carbon/auth/client.server");
var accounting_1 = require("@carbon/ee/accounting");
var jobs_1 = require("@carbon/jobs");
var crypto_1 = require("crypto");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
exports.config = {
    runtime: "nodejs"
};
var WebhookSchema = zod_1.z.object({
    entropy: zod_1.z.string().optional(),
    events: zod_1.z.array(zod_1.z.object({
        tenantId: zod_1.z.string(),
        eventCategory: zod_1.z.enum(["CONTACT", "INVOICE"]),
        eventType: zod_1.z.enum(["CREATE", "UPDATE", "DELETE"]),
        resourceId: zod_1.z.string(),
        eventDateUtc: zod_1.z.string()
    })),
    firstEventSequence: zod_1.z.number(),
    lastEventSequence: zod_1.z.number()
});
function verifySignature(payload, header) {
    if (!auth_1.XERO_WEBHOOK_SECRET) {
        console.warn("XERO_WEBHOOK_SECRET is not configured");
        return payload;
    }
    var hmac = crypto_1.default
        .createHmac("sha256", auth_1.XERO_WEBHOOK_SECRET)
        .update(payload, "utf8")
        .digest("base64");
    return crypto_1.default.timingSafeEqual(Buffer.from(hmac), Buffer.from(header));
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var payloadText, signature, isValid, payload, parsed, serviceRole, events, syncJobs, errors, eventsByTenant, _i, _c, _d, tenantId, tenantEvents, integration, companyId, provider, entities, _e, tenantEvents_1, event_1, resourceId, eventCategory, operation, _f, contactType, invoiceType, payload_1, error_1, error_2;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, request.text()];
                case 1:
                    payloadText = _g.sent();
                    // Verify webhook signature for security (Xero's intent-to-receive workflow)
                    if (auth_1.XERO_WEBHOOK_SECRET) {
                        // If payload is empty or just contains intent-to-receive data, return 200
                        if (!payloadText || payloadText.trim() === "" || payloadText === "{}") {
                            return [2 /*return*/, new Response("", { status: 200 })];
                        }
                        signature = request.headers.get("x-xero-signature");
                        if (!signature) {
                            return [2 /*return*/, (0, react_router_1.data)({ success: false, error: "Missing signature" }, { status: 401 })];
                        }
                        isValid = verifySignature(payloadText, signature);
                        if (!isValid) {
                            return [2 /*return*/, (0, react_router_1.data)({
                                    success: false,
                                    error: "Invalid signature"
                                }, { status: 401 })];
                        }
                    }
                    try {
                        payload = JSON.parse(payloadText);
                    }
                    catch (error) {
                        console.error("Failed to parse webhook payload:", error);
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                error: "Invalid JSON payload"
                            }, { status: 401 })];
                    }
                    parsed = WebhookSchema.safeParse(payload);
                    if (!parsed.success) {
                        console.error("Invalid Xero webhook payload:", parsed.error);
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                error: "Invalid payload format"
                            }, { status: 401 })];
                    }
                    console.log("Processing Xero webhook with", parsed.data.events.length, "events");
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    events = parsed.data.events;
                    syncJobs = [];
                    errors = [];
                    eventsByTenant = events.reduce(function (acc, event) {
                        if (!acc[event.tenantId]) {
                            acc[event.tenantId] = [];
                        }
                        acc[event.tenantId].push(event);
                        return acc;
                    }, {});
                    _i = 0, _c = Object.entries(eventsByTenant);
                    _g.label = 2;
                case 2:
                    if (!(_i < _c.length)) return [3 /*break*/, 18];
                    _d = _c[_i], tenantId = _d[0], tenantEvents = _d[1];
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 16, , 17]);
                    return [4 /*yield*/, (0, accounting_1.getAccountingIntegration)(serviceRole, tenantId, accounting_1.ProviderID.XERO)];
                case 4:
                    integration = _g.sent();
                    if (!integration) {
                        console.error("No Xero integration found for tenant ".concat(tenantId));
                        errors.push({
                            tenantId: tenantId,
                            error: "Tenant ID not found in integrations"
                        });
                        return [3 /*break*/, 17];
                    }
                    companyId = integration.companyId;
                    provider = (0, accounting_1.getProviderIntegration)(serviceRole, companyId, accounting_1.ProviderID.XERO, integration.metadata);
                    entities = [];
                    _e = 0, tenantEvents_1 = tenantEvents;
                    _g.label = 5;
                case 5:
                    if (!(_e < tenantEvents_1.length)) return [3 /*break*/, 11];
                    event_1 = tenantEvents_1[_e];
                    resourceId = event_1.resourceId, eventCategory = event_1.eventCategory;
                    operation = event_1.eventType.toLowerCase();
                    // Log each entity change for debugging
                    console.log("Xero ".concat(operation, ": ").concat(eventCategory, " ").concat(resourceId, " (tenant: ").concat(tenantId, ")"));
                    _f = eventCategory;
                    switch (_f) {
                        case "CONTACT": return [3 /*break*/, 6];
                        case "INVOICE": return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 10];
                case 6: return [4 /*yield*/, fetchContactType(provider, resourceId)];
                case 7:
                    contactType = _g.sent();
                    if (!contactType) {
                        console.log("Skipping contact ".concat(resourceId, " with no customer/supplier role"));
                        return [3 /*break*/, 10];
                    }
                    if (contactType === "customer" || contactType === "both") {
                        entities.push({
                            entityType: "customer",
                            entityId: resourceId,
                            operation: operation
                        });
                    }
                    if (contactType === "supplier" || contactType === "both") {
                        entities.push({
                            entityType: "vendor",
                            entityId: resourceId,
                            operation: operation
                        });
                    }
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, fetchInvoiceType(provider, resourceId)];
                case 9:
                    invoiceType = _g.sent();
                    if (!invoiceType) {
                        console.log("Skipping invoice ".concat(resourceId, " - could not determine type"));
                        return [3 /*break*/, 10];
                    }
                    entities.push({
                        entityType: invoiceType,
                        entityId: resourceId,
                        operation: operation
                    });
                    return [3 /*break*/, 10];
                case 10:
                    _e++;
                    return [3 /*break*/, 5];
                case 11:
                    if (!(entities.length > 0)) return [3 /*break*/, 15];
                    _g.label = 12;
                case 12:
                    _g.trys.push([12, 14, , 15]);
                    payload_1 = {
                        companyId: companyId,
                        provider: accounting_1.ProviderID.XERO,
                        syncType: "webhook",
                        syncDirection: "pull-from-accounting",
                        entities: entities,
                        metadata: {
                            tenantId: tenantId,
                            raw: parsed.data
                        }
                    };
                    console.dir(payload_1, { depth: null });
                    // Trigger the background job using Trigger.dev
                    return [4 /*yield*/, (0, jobs_1.trigger)("sync-external-accounting", payload_1)];
                case 13:
                    // Trigger the background job using Trigger.dev
                    _g.sent();
                    console.log("Triggered accounting sync job for ".concat(entities.length, " entities"));
                    syncJobs.push({
                        companyId: companyId,
                        tenantId: tenantId,
                        entityCount: entities.length
                    });
                    return [3 /*break*/, 15];
                case 14:
                    error_1 = _g.sent();
                    console.error("Failed to trigger sync job:", error_1);
                    errors.push({
                        tenantId: tenantId,
                        error: error_1 instanceof Error ? error_1.message : "Failed to trigger job"
                    });
                    return [3 /*break*/, 15];
                case 15: return [3 /*break*/, 17];
                case 16:
                    error_2 = _g.sent();
                    console.error("Error processing events for tenant:", tenantId, error_2);
                    errors.push({
                        tenantId: tenantId,
                        error: error_2 instanceof Error ? error_2.message : "Unknown error"
                    });
                    return [3 /*break*/, 17];
                case 17:
                    _i++;
                    return [3 /*break*/, 2];
                case 18:
                    console.log("Processed Xero webhook: ".concat(syncJobs.length, " sync jobs triggered"));
                    // Return detailed response
                    return [2 /*return*/, {
                            success: errors.length === 0,
                            jobsTriggered: syncJobs.length,
                            jobs: syncJobs,
                            errors: errors.length > 0 ? errors : undefined,
                            timestamp: new Date().toISOString()
                        }];
            }
        });
    });
}
var fetchContactType = function (provider, resourceId) { return __awaiter(void 0, void 0, void 0, function () {
    var res, contact;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, provider.request("GET", "/Contacts/".concat(resourceId))];
            case 1:
                res = _a.sent();
                if (res.error || !res.data || res.data.Contacts.length === 0) {
                    throw new Error("Failed to fetch contact ".concat(resourceId, ": ").concat(res.message));
                }
                contact = res.data.Contacts[0];
                if (contact.IsSupplier && contact.IsCustomer) {
                    return [2 /*return*/, "both"];
                }
                else if (contact.IsSupplier) {
                    return [2 /*return*/, "supplier"];
                }
                else if (contact.IsCustomer) {
                    return [2 /*return*/, "customer"];
                }
                return [2 /*return*/, null];
        }
    });
}); };
/**
 * Fetches invoice from Xero to determine if it's a sales invoice or bill.
 * - ACCREC (Accounts Receivable) = Sales Invoice -> maps to "invoice"
 * - ACCPAY (Accounts Payable) = Purchase Invoice/Bill -> maps to "bill"
 */
var fetchInvoiceType = function (provider, resourceId) { return __awaiter(void 0, void 0, void 0, function () {
    var res, invoice;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, provider.request("GET", "/Invoices/".concat(resourceId))];
            case 1:
                res = _a.sent();
                if (res.error || !res.data || res.data.Invoices.length === 0) {
                    throw new Error("Failed to fetch invoice ".concat(resourceId, ": ").concat(res.message));
                }
                invoice = res.data.Invoices[0];
                // ACCREC = Accounts Receivable = Sales Invoice
                // ACCPAY = Accounts Payable = Bill/Purchase Invoice
                return [2 /*return*/, invoice.Type === "ACCREC" ? "invoice" : "bill"];
        }
    });
}); };
