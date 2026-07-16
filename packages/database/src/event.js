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
exports.CreateSubscriptionSchema = exports.QueueMessageSchema = exports.EventSchema = exports.OperationSchema = void 0;
exports.createEventSystemSubscription = createEventSystemSubscription;
exports.deleteEventSystemSubscription = deleteEventSystemSubscription;
exports.deleteEventSystemSubscriptionsByName = deleteEventSystemSubscriptionsByName;
var zod_1 = require("zod");
exports.OperationSchema = zod_1.z.enum([
    "INSERT",
    "UPDATE",
    "DELETE",
    "TRUNCATE"
]);
var HandlerTypeSchema = zod_1.z.enum([
    "WEBHOOK",
    "WORKFLOW",
    "SYNC",
    "SEARCH",
    "AUDIT",
    "EMBEDDING"
]);
exports.EventSchema = zod_1.z.discriminatedUnion("operation", [
    zod_1.z.object({
        table: zod_1.z.string(),
        operation: zod_1.z.enum(["UPDATE"]),
        recordId: zod_1.z.string(),
        new: zod_1.z.record(zod_1.z.any()),
        old: zod_1.z.record(zod_1.z.any()),
        timestamp: zod_1.z.string()
    }),
    zod_1.z.object({
        table: zod_1.z.string(),
        operation: zod_1.z.enum(["INSERT"]),
        recordId: zod_1.z.string(),
        new: zod_1.z.record(zod_1.z.any()),
        old: zod_1.z.null(),
        timestamp: zod_1.z.string()
    }),
    zod_1.z.object({
        table: zod_1.z.string(),
        operation: zod_1.z.enum(["DELETE", "TRUNCATE"]),
        recordId: zod_1.z.string(),
        new: zod_1.z.null(),
        old: zod_1.z.record(zod_1.z.any()),
        timestamp: zod_1.z.string()
    })
]);
exports.QueueMessageSchema = zod_1.z.object({
    subscriptionId: zod_1.z.string(),
    triggerType: zod_1.z.enum(["ROW", "STATEMENT"]),
    handlerType: HandlerTypeSchema,
    handlerConfig: zod_1.z.record(zod_1.z.any()),
    companyId: zod_1.z.string(),
    actorId: zod_1.z.string().nullish(), // Captured from auth.uid() at trigger time
    event: exports.EventSchema
});
// The Main Subscription Schema
exports.CreateSubscriptionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    // The table name in your database
    table: zod_1.z.string().min(1, "Table name is required"),
    // The company this subscription belongs to
    companyId: zod_1.z.string().min(1, "Company ID is required"),
    // Must provide at least one operation (e.g. ['INSERT'])
    operations: zod_1.z
        .array(exports.OperationSchema)
        .min(1, "At least one operation is required"),
    // The type determines how Trigger.dev processes it
    type: HandlerTypeSchema,
    // Configuration specific to the handler (URL for webhooks, WorkflowID for workflows)
    // We allow any object here since it's stored as JSONB
    config: zod_1.z.record(zod_1.z.any()).default({}),
    // Database-level filtering (e.g. { status: "paid" })
    filter: zod_1.z.record(zod_1.z.any()).default({}),
    // Defaults to true
    active: zod_1.z.boolean().default(true)
});
/**
 * Creates or updates an event system subscription using RPC.
 *
 * @param client - Supabase client (e.g., from getCarbonServiceRole())
 * @param input - Subscription parameters
 * @returns The created/updated subscription
 * @throws Error if the RPC call fails
 *
 * @example
 * ```ts
 * const client = getCarbonServiceRole();
 * const subscription = await createEventSystemSubscription(client, {
 *   name: "my-webhook",
 *   table: "customer",
 *   companyId: "company-123",
 *   operations: ["INSERT", "UPDATE"],
 *   type: "WEBHOOK",
 *   config: { url: "https://example.com/webhook" },
 * });
 * ```
 */
function createEventSystemSubscription(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var params, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    params = exports.CreateSubscriptionSchema.parse(input);
                    return [4 /*yield*/, client.rpc("create_event_system_subscription", {
                            p_name: params.name,
                            p_table: params.table,
                            p_company_id: params.companyId,
                            p_operations: params.operations,
                            p_handler_type: params.type,
                            p_config: params.config,
                            p_filter: params.filter,
                            p_active: params.active
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        throw new Error("Failed to create subscription: ".concat(error.message));
                    }
                    return [2 /*return*/, data === null || data === void 0 ? void 0 : data[0]];
            }
        });
    });
}
/**
 * Deletes an event system subscription by ID.
 *
 * @param client - Supabase client
 * @param subscriptionId - The ID of the subscription to delete
 * @throws Error if the RPC call fails
 */
function deleteEventSystemSubscription(client, subscriptionId) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.rpc("delete_event_system_subscription", {
                        p_subscription_id: subscriptionId
                    })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        throw new Error("Failed to delete subscription: ".concat(error.message));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Deletes all event system subscriptions with a given name for a company.
 *
 * @param client - Supabase client
 * @param companyId - The company ID
 * @param name - The subscription name to delete
 * @throws Error if the RPC call fails
 */
function deleteEventSystemSubscriptionsByName(client, companyId, name) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.rpc("delete_event_system_subscriptions_by_name", {
                        p_company_id: companyId,
                        p_name: name
                    })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        throw new Error("Failed to delete subscriptions: ".concat(error.message));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
