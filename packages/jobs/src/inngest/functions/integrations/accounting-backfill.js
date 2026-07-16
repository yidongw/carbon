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
exports.accountingBackfillFunction = void 0;
/**
 * Backfill function for syncing entities between Carbon and accounting providers.
 *
 * This function respects the per-entity sync direction configuration:
 * - "pull-from-accounting": Only pull entities from the provider
 * - "push-to-accounting": Only push Carbon entities to the provider
 * - "two-way": Pull from provider AND push unsynced Carbon entities
 *
 * This prevents unnecessary syncing (e.g., items configured as push-only
 * won't be pulled from Xero, and POs configured as push-only won't try to pull).
 */
var client_server_1 = require("@carbon/auth/client.server");
var client_1 = require("@carbon/database/client");
var accounting_1 = require("@carbon/ee/accounting");
var kysely_1 = require("kysely");
var zod_1 = require("zod");
var client_2 = require("../../client");
// ============================================================
// HELPERS
// ============================================================
/**
 * Execute an async operation with rate limit handling.
 * If a RatelimitError is thrown, wait for the specified retry period and retry once.
 */
function withRateLimitRetry(operation, operationName, step) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1, _a, retryAfterSeconds, limitType, details;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, operation()];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    error_1 = _b.sent();
                    if (!(error_1 instanceof accounting_1.RatelimitError)) return [3 /*break*/, 5];
                    _a = error_1.rateLimitInfo, retryAfterSeconds = _a.retryAfterSeconds, limitType = _a.limitType, details = _a.details;
                    console.warn("[RATE LIMIT] ".concat(operationName, " hit rate limit"), __assign({ limitType: limitType, retryAfterSeconds: retryAfterSeconds }, details));
                    return [4 /*yield*/, step.sleep("rate-limit-wait-".concat(operationName), "".concat(retryAfterSeconds, "s"))];
                case 3:
                    _b.sent();
                    console.info("[RATE LIMIT] Retrying ".concat(operationName, " after ").concat(retryAfterSeconds, "s wait"));
                    return [4 /*yield*/, operation()];
                case 4: return [2 /*return*/, _b.sent()];
                case 5: throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
// ============================================================
// SCHEMAS
// ============================================================
var BackfillPayloadSchema = zod_1.default.object({
    companyId: zod_1.default.string(),
    provider: zod_1.default.nativeEnum(accounting_1.ProviderID),
    batchSize: zod_1.default.number().default(25), // Smaller batches to avoid rate limits
    entityTypes: zod_1.default
        .object({
        customers: zod_1.default.boolean().default(true),
        vendors: zod_1.default.boolean().default(true),
        items: zod_1.default.boolean().default(true)
    })
        .default({})
});
/**
 * Helper to determine if we should pull for a given direction config
 */
function shouldPull(direction) {
    return direction === "pull-from-accounting" || direction === "two-way";
}
/**
 * Helper to determine if we should push for a given direction config
 */
function shouldPush(direction) {
    return direction === "push-to-accounting" || direction === "two-way";
}
exports.accountingBackfillFunction = client_2.inngest.createFunction({ id: "accounting-backfill", retries: 3 }, { event: "carbon/accounting-backfill" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var payload, client, integration, provider, customerConfig, vendorConfig, itemConfig, result, pullCustomers, pullVendors, page, hasMore, _loop_1, pullItems, page, hasMore, _loop_2, pushCustomers, hasMore, batchIndex, currentBatchIndex, pushResult, pushVendors, hasMore, batchIndex, currentBatchIndex, pushResult, pushItems, hasMore, batchIndex, currentBatchIndex, pushResult;
    var _c, _d, _e;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                payload = BackfillPayloadSchema.parse(event.data);
                client = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, (0, accounting_1.getAccountingIntegration)(client, payload.companyId, payload.provider)];
            case 1:
                integration = _f.sent();
                provider = (0, accounting_1.getProviderIntegration)(client, payload.companyId, integration.id, integration.metadata);
                customerConfig = provider.getSyncConfig("customer");
                vendorConfig = provider.getSyncConfig("vendor");
                itemConfig = provider.getSyncConfig("item");
                result = {
                    customers: { pulled: 0, pushed: 0 },
                    vendors: { pulled: 0, pushed: 0 },
                    items: { pulled: 0, pushed: 0 },
                    totalPulled: 0,
                    totalPushed: 0
                };
                // Log the sync directions for visibility
                console.info("[BACKFILL] Starting with entity sync directions:", {
                    customer: {
                        enabled: customerConfig === null || customerConfig === void 0 ? void 0 : customerConfig.enabled,
                        direction: customerConfig === null || customerConfig === void 0 ? void 0 : customerConfig.direction,
                        shouldPull: (customerConfig === null || customerConfig === void 0 ? void 0 : customerConfig.enabled) && shouldPull(customerConfig.direction),
                        shouldPush: (customerConfig === null || customerConfig === void 0 ? void 0 : customerConfig.enabled) && shouldPush(customerConfig.direction)
                    },
                    vendor: {
                        enabled: vendorConfig === null || vendorConfig === void 0 ? void 0 : vendorConfig.enabled,
                        direction: vendorConfig === null || vendorConfig === void 0 ? void 0 : vendorConfig.direction,
                        shouldPull: (vendorConfig === null || vendorConfig === void 0 ? void 0 : vendorConfig.enabled) && shouldPull(vendorConfig.direction),
                        shouldPush: (vendorConfig === null || vendorConfig === void 0 ? void 0 : vendorConfig.enabled) && shouldPush(vendorConfig.direction)
                    },
                    item: {
                        enabled: itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.enabled,
                        direction: itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.direction,
                        shouldPull: (itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.enabled) && shouldPull(itemConfig.direction),
                        shouldPush: (itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.enabled) && shouldPush(itemConfig.direction)
                    }
                });
                pullCustomers = payload.entityTypes.customers &&
                    (customerConfig === null || customerConfig === void 0 ? void 0 : customerConfig.enabled) &&
                    shouldPull(customerConfig.direction);
                pullVendors = payload.entityTypes.vendors &&
                    (vendorConfig === null || vendorConfig === void 0 ? void 0 : vendorConfig.enabled) &&
                    shouldPull(vendorConfig.direction);
                if (!(pullCustomers || pullVendors)) return [3 /*break*/, 5];
                page = 1;
                hasMore = true;
                console.info("[PULL] Starting contact pull phase", {
                    pullCustomers: pullCustomers,
                    pullVendors: pullVendors
                });
                _loop_1 = function () {
                    var currentPage, pullResult;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                currentPage = page;
                                return [4 /*yield*/, step.run("pull-contacts-page-".concat(currentPage), function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var pullClient, pullIntegration, pullProvider, pool, kysely, response, customersPulled, vendorsPulled, customers, syncer_1, ids_1, syncResult, vendors, syncer_2, ids_2, syncResult;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    pullClient = (0, client_server_1.getCarbonServiceRole)();
                                                    return [4 /*yield*/, (0, accounting_1.getAccountingIntegration)(pullClient, payload.companyId, payload.provider)];
                                                case 1:
                                                    pullIntegration = _a.sent();
                                                    pullProvider = (0, accounting_1.getProviderIntegration)(pullClient, payload.companyId, pullIntegration.id, pullIntegration.metadata);
                                                    pool = (0, client_1.getPostgresConnectionPool)(5);
                                                    kysely = (0, client_1.getPostgresClient)(pool, kysely_1.PostgresDriver);
                                                    _a.label = 2;
                                                case 2:
                                                    _a.trys.push([2, , 8, 10]);
                                                    console.info("[PULL] Fetching contacts page ".concat(currentPage));
                                                    return [4 /*yield*/, withRateLimitRetry(function () {
                                                            return pullProvider.listContacts({
                                                                page: currentPage,
                                                                summaryOnly: true
                                                            });
                                                        }, "listContacts page ".concat(currentPage), step)];
                                                case 3:
                                                    response = _a.sent();
                                                    console.info("[PULL] Contacts page ".concat(currentPage, " response"), {
                                                        count: response.contacts.length,
                                                        hasMore: response.hasMore,
                                                        contacts: response.contacts.map(function (c) { return ({
                                                            id: c.ContactID,
                                                            name: c.Name,
                                                            isCustomer: c.IsCustomer,
                                                            isSupplier: c.IsSupplier
                                                        }); })
                                                    });
                                                    if (response.contacts.length === 0) {
                                                        return [2 /*return*/, {
                                                                hasMore: false,
                                                                pulled: { customers: 0, vendors: 0 }
                                                            }];
                                                    }
                                                    customersPulled = 0;
                                                    vendorsPulled = 0;
                                                    if (!pullCustomers) return [3 /*break*/, 5];
                                                    customers = response.contacts.filter(function (c) { return c.IsCustomer; });
                                                    if (!(customers.length > 0)) return [3 /*break*/, 5];
                                                    syncer_1 = accounting_1.SyncFactory.getSyncer({
                                                        database: kysely,
                                                        companyId: payload.companyId,
                                                        provider: pullProvider,
                                                        config: pullProvider.getSyncConfig("customer"),
                                                        entityType: "customer"
                                                    });
                                                    ids_1 = customers.map(function (c) { return c.ContactID; });
                                                    return [4 /*yield*/, withRateLimitRetry(function () { return syncer_1.pullBatchFromAccounting(ids_1); }, "pullBatchFromAccounting customers page ".concat(currentPage), step)];
                                                case 4:
                                                    syncResult = _a.sent();
                                                    customersPulled = syncResult.successCount;
                                                    console.info("[PULL] Page ".concat(currentPage, ": pulled ").concat(customersPulled, " customers"), {
                                                        results: syncResult.results.map(function (r) { return ({
                                                            status: r.status,
                                                            action: r.action,
                                                            localId: r.localId,
                                                            remoteId: r.remoteId,
                                                            error: r.error
                                                        }); })
                                                    });
                                                    _a.label = 5;
                                                case 5:
                                                    if (!pullVendors) return [3 /*break*/, 7];
                                                    vendors = response.contacts.filter(function (c) { return c.IsSupplier; });
                                                    if (!(vendors.length > 0)) return [3 /*break*/, 7];
                                                    syncer_2 = accounting_1.SyncFactory.getSyncer({
                                                        database: kysely,
                                                        companyId: payload.companyId,
                                                        provider: pullProvider,
                                                        config: pullProvider.getSyncConfig("vendor"),
                                                        entityType: "vendor"
                                                    });
                                                    ids_2 = vendors.map(function (c) { return c.ContactID; });
                                                    return [4 /*yield*/, withRateLimitRetry(function () { return syncer_2.pullBatchFromAccounting(ids_2); }, "pullBatchFromAccounting vendors page ".concat(currentPage), step)];
                                                case 6:
                                                    syncResult = _a.sent();
                                                    vendorsPulled = syncResult.successCount;
                                                    console.info("[PULL] Page ".concat(currentPage, ": pulled ").concat(vendorsPulled, " vendors"), {
                                                        results: syncResult.results.map(function (r) { return ({
                                                            status: r.status,
                                                            action: r.action,
                                                            localId: r.localId,
                                                            remoteId: r.remoteId,
                                                            error: r.error
                                                        }); })
                                                    });
                                                    _a.label = 7;
                                                case 7: return [2 /*return*/, {
                                                        hasMore: response.hasMore,
                                                        pulled: {
                                                            customers: customersPulled,
                                                            vendors: vendorsPulled
                                                        }
                                                    }];
                                                case 8: return [4 /*yield*/, pool.end()];
                                                case 9:
                                                    _a.sent();
                                                    return [7 /*endfinally*/];
                                                case 10: return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                            case 1:
                                pullResult = _g.sent();
                                result.customers.pulled += (_c = pullResult.pulled.customers) !== null && _c !== void 0 ? _c : 0;
                                result.vendors.pulled += (_d = pullResult.pulled.vendors) !== null && _d !== void 0 ? _d : 0;
                                hasMore = pullResult.hasMore;
                                page++;
                                if (!hasMore) return [3 /*break*/, 3];
                                return [4 /*yield*/, step.sleep("contacts-page-delay-".concat(currentPage), "1s")];
                            case 2:
                                _g.sent();
                                _g.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                };
                _f.label = 2;
            case 2:
                if (!hasMore) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_1()];
            case 3:
                _f.sent();
                return [3 /*break*/, 2];
            case 4: return [3 /*break*/, 6];
            case 5:
                console.info("[PULL] Skipping contact pull - not enabled or direction is push-only");
                _f.label = 6;
            case 6:
                pullItems = payload.entityTypes.items &&
                    (itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.enabled) &&
                    shouldPull(itemConfig.direction);
                if (!pullItems) return [3 /*break*/, 10];
                page = 1;
                hasMore = true;
                console.info("[PULL] Starting items pull phase");
                _loop_2 = function () {
                    var currentPage, pullResult;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0:
                                currentPage = page;
                                return [4 /*yield*/, step.run("pull-items-page-".concat(currentPage), function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var pullClient, pullIntegration, pullProvider, pool, kysely, response, syncer_3, ids_3, syncResult;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    pullClient = (0, client_server_1.getCarbonServiceRole)();
                                                    return [4 /*yield*/, (0, accounting_1.getAccountingIntegration)(pullClient, payload.companyId, payload.provider)];
                                                case 1:
                                                    pullIntegration = _a.sent();
                                                    pullProvider = (0, accounting_1.getProviderIntegration)(pullClient, payload.companyId, pullIntegration.id, pullIntegration.metadata);
                                                    pool = (0, client_1.getPostgresConnectionPool)(5);
                                                    kysely = (0, client_1.getPostgresClient)(pool, kysely_1.PostgresDriver);
                                                    _a.label = 2;
                                                case 2:
                                                    _a.trys.push([2, , 5, 7]);
                                                    console.info("[PULL] Fetching items page ".concat(currentPage));
                                                    return [4 /*yield*/, withRateLimitRetry(function () { return pullProvider.listItems({ page: currentPage }); }, "listItems page ".concat(currentPage), step)];
                                                case 3:
                                                    response = _a.sent();
                                                    console.info("[PULL] Items page ".concat(currentPage, " response"), {
                                                        count: response.items.length,
                                                        hasMore: response.hasMore,
                                                        items: response.items.map(function (i) { return ({
                                                            id: i.ItemID,
                                                            code: i.Code,
                                                            name: i.Name
                                                        }); })
                                                    });
                                                    if (response.items.length === 0) {
                                                        return [2 /*return*/, { hasMore: false, pulled: { items: 0 } }];
                                                    }
                                                    syncer_3 = accounting_1.SyncFactory.getSyncer({
                                                        database: kysely,
                                                        companyId: payload.companyId,
                                                        provider: pullProvider,
                                                        config: pullProvider.getSyncConfig("item"),
                                                        entityType: "item"
                                                    });
                                                    ids_3 = response.items.map(function (item) { return item.ItemID; });
                                                    return [4 /*yield*/, withRateLimitRetry(function () { return syncer_3.pullBatchFromAccounting(ids_3); }, "pullBatchFromAccounting items page ".concat(currentPage), step)];
                                                case 4:
                                                    syncResult = _a.sent();
                                                    console.info("[PULL] Page ".concat(currentPage, ": pulled ").concat(syncResult.successCount, " items"), {
                                                        results: syncResult.results.map(function (r) { return ({
                                                            status: r.status,
                                                            action: r.action,
                                                            localId: r.localId,
                                                            remoteId: r.remoteId,
                                                            error: r.error
                                                        }); })
                                                    });
                                                    return [2 /*return*/, {
                                                            hasMore: response.hasMore,
                                                            pulled: { items: syncResult.successCount }
                                                        }];
                                                case 5: return [4 /*yield*/, pool.end()];
                                                case 6:
                                                    _a.sent();
                                                    return [7 /*endfinally*/];
                                                case 7: return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                            case 1:
                                pullResult = _h.sent();
                                result.items.pulled += (_e = pullResult.pulled.items) !== null && _e !== void 0 ? _e : 0;
                                hasMore = pullResult.hasMore;
                                page++;
                                if (!hasMore) return [3 /*break*/, 3];
                                return [4 /*yield*/, step.sleep("items-page-delay-".concat(currentPage), "1s")];
                            case 2:
                                _h.sent();
                                _h.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                };
                _f.label = 7;
            case 7:
                if (!hasMore) return [3 /*break*/, 9];
                return [5 /*yield**/, _loop_2()];
            case 8:
                _f.sent();
                return [3 /*break*/, 7];
            case 9: return [3 /*break*/, 11];
            case 10:
                console.info("[PULL] Skipping items pull - not enabled or direction is push-only");
                _f.label = 11;
            case 11:
                pushCustomers = payload.entityTypes.customers &&
                    (customerConfig === null || customerConfig === void 0 ? void 0 : customerConfig.enabled) &&
                    shouldPush(customerConfig.direction);
                if (!pushCustomers) return [3 /*break*/, 17];
                hasMore = true;
                batchIndex = 0;
                console.info("[PUSH] Starting customers push phase");
                _f.label = 12;
            case 12:
                if (!hasMore) return [3 /*break*/, 16];
                currentBatchIndex = batchIndex;
                return [4 /*yield*/, step.run("push-customers-batch-".concat(currentBatchIndex), function () { return __awaiter(void 0, void 0, void 0, function () {
                        var pushClient, pushIntegration, pushProvider, pool, kysely, mappingService, unsyncedIds_1, syncer_4, syncResult;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    pushClient = (0, client_server_1.getCarbonServiceRole)();
                                    return [4 /*yield*/, (0, accounting_1.getAccountingIntegration)(pushClient, payload.companyId, payload.provider)];
                                case 1:
                                    pushIntegration = _a.sent();
                                    pushProvider = (0, accounting_1.getProviderIntegration)(pushClient, payload.companyId, pushIntegration.id, pushIntegration.metadata);
                                    pool = (0, client_1.getPostgresConnectionPool)(5);
                                    kysely = (0, client_1.getPostgresClient)(pool, kysely_1.PostgresDriver);
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, , 5, 7]);
                                    mappingService = (0, accounting_1.createMappingService)(kysely, payload.companyId);
                                    return [4 /*yield*/, mappingService.getUnsyncedEntityIds("customer", "customer", pushProvider.id, payload.batchSize)];
                                case 3:
                                    unsyncedIds_1 = _a.sent();
                                    if (unsyncedIds_1.length === 0) {
                                        return [2 /*return*/, {
                                                successCount: 0,
                                                hasMore: false
                                            }];
                                    }
                                    syncer_4 = accounting_1.SyncFactory.getSyncer({
                                        database: kysely,
                                        companyId: payload.companyId,
                                        provider: pushProvider,
                                        config: pushProvider.getSyncConfig("customer"),
                                        entityType: "customer"
                                    });
                                    return [4 /*yield*/, withRateLimitRetry(function () { return syncer_4.pushBatchToAccounting(unsyncedIds_1); }, "pushBatchToAccounting customers", step)];
                                case 4:
                                    syncResult = _a.sent();
                                    console.info("[PUSH] Pushed ".concat(syncResult.successCount, "/").concat(unsyncedIds_1.length, " customer entities"), {
                                        entityIds: unsyncedIds_1,
                                        results: syncResult.results.map(function (r) { return ({
                                            status: r.status,
                                            action: r.action,
                                            localId: r.localId,
                                            remoteId: r.remoteId,
                                            error: r.error
                                        }); })
                                    });
                                    return [2 /*return*/, {
                                            successCount: syncResult.successCount,
                                            hasMore: unsyncedIds_1.length >= payload.batchSize
                                        }];
                                case 5: return [4 /*yield*/, pool.end()];
                                case 6:
                                    _a.sent();
                                    return [7 /*endfinally*/];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 13:
                pushResult = _f.sent();
                result.customers.pushed += pushResult.successCount;
                hasMore = pushResult.hasMore;
                batchIndex++;
                if (!hasMore) return [3 /*break*/, 15];
                return [4 /*yield*/, step.sleep("customers-push-delay-".concat(currentBatchIndex), "2s")];
            case 14:
                _f.sent();
                _f.label = 15;
            case 15: return [3 /*break*/, 12];
            case 16: return [3 /*break*/, 18];
            case 17:
                console.info("[PUSH] Skipping customers push - not enabled or direction is pull-only");
                _f.label = 18;
            case 18:
                pushVendors = payload.entityTypes.vendors &&
                    (vendorConfig === null || vendorConfig === void 0 ? void 0 : vendorConfig.enabled) &&
                    shouldPush(vendorConfig.direction);
                if (!pushVendors) return [3 /*break*/, 24];
                hasMore = true;
                batchIndex = 0;
                console.info("[PUSH] Starting vendors push phase");
                _f.label = 19;
            case 19:
                if (!hasMore) return [3 /*break*/, 23];
                currentBatchIndex = batchIndex;
                return [4 /*yield*/, step.run("push-vendors-batch-".concat(currentBatchIndex), function () { return __awaiter(void 0, void 0, void 0, function () {
                        var pushClient, pushIntegration, pushProvider, pool, kysely, mappingService, unsyncedIds_2, syncer_5, syncResult;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    pushClient = (0, client_server_1.getCarbonServiceRole)();
                                    return [4 /*yield*/, (0, accounting_1.getAccountingIntegration)(pushClient, payload.companyId, payload.provider)];
                                case 1:
                                    pushIntegration = _a.sent();
                                    pushProvider = (0, accounting_1.getProviderIntegration)(pushClient, payload.companyId, pushIntegration.id, pushIntegration.metadata);
                                    pool = (0, client_1.getPostgresConnectionPool)(5);
                                    kysely = (0, client_1.getPostgresClient)(pool, kysely_1.PostgresDriver);
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, , 5, 7]);
                                    mappingService = (0, accounting_1.createMappingService)(kysely, payload.companyId);
                                    return [4 /*yield*/, mappingService.getUnsyncedEntityIds("vendor", "supplier", pushProvider.id, payload.batchSize)];
                                case 3:
                                    unsyncedIds_2 = _a.sent();
                                    if (unsyncedIds_2.length === 0) {
                                        return [2 /*return*/, {
                                                successCount: 0,
                                                hasMore: false
                                            }];
                                    }
                                    syncer_5 = accounting_1.SyncFactory.getSyncer({
                                        database: kysely,
                                        companyId: payload.companyId,
                                        provider: pushProvider,
                                        config: pushProvider.getSyncConfig("vendor"),
                                        entityType: "vendor"
                                    });
                                    return [4 /*yield*/, withRateLimitRetry(function () { return syncer_5.pushBatchToAccounting(unsyncedIds_2); }, "pushBatchToAccounting vendors", step)];
                                case 4:
                                    syncResult = _a.sent();
                                    console.info("[PUSH] Pushed ".concat(syncResult.successCount, "/").concat(unsyncedIds_2.length, " vendor entities"), {
                                        entityIds: unsyncedIds_2,
                                        results: syncResult.results.map(function (r) { return ({
                                            status: r.status,
                                            action: r.action,
                                            localId: r.localId,
                                            remoteId: r.remoteId,
                                            error: r.error
                                        }); })
                                    });
                                    return [2 /*return*/, {
                                            successCount: syncResult.successCount,
                                            hasMore: unsyncedIds_2.length >= payload.batchSize
                                        }];
                                case 5: return [4 /*yield*/, pool.end()];
                                case 6:
                                    _a.sent();
                                    return [7 /*endfinally*/];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 20:
                pushResult = _f.sent();
                result.vendors.pushed += pushResult.successCount;
                hasMore = pushResult.hasMore;
                batchIndex++;
                if (!hasMore) return [3 /*break*/, 22];
                return [4 /*yield*/, step.sleep("vendors-push-delay-".concat(currentBatchIndex), "2s")];
            case 21:
                _f.sent();
                _f.label = 22;
            case 22: return [3 /*break*/, 19];
            case 23: return [3 /*break*/, 25];
            case 24:
                console.info("[PUSH] Skipping vendors push - not enabled or direction is pull-only");
                _f.label = 25;
            case 25:
                pushItems = payload.entityTypes.items &&
                    (itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.enabled) &&
                    shouldPush(itemConfig.direction);
                if (!pushItems) return [3 /*break*/, 31];
                hasMore = true;
                batchIndex = 0;
                console.info("[PUSH] Starting items push phase");
                _f.label = 26;
            case 26:
                if (!hasMore) return [3 /*break*/, 30];
                currentBatchIndex = batchIndex;
                return [4 /*yield*/, step.run("push-items-batch-".concat(currentBatchIndex), function () { return __awaiter(void 0, void 0, void 0, function () {
                        var pushClient, pushIntegration, pushProvider, pool, kysely, mappingService, unsyncedIds_3, syncer_6, syncResult;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    pushClient = (0, client_server_1.getCarbonServiceRole)();
                                    return [4 /*yield*/, (0, accounting_1.getAccountingIntegration)(pushClient, payload.companyId, payload.provider)];
                                case 1:
                                    pushIntegration = _a.sent();
                                    pushProvider = (0, accounting_1.getProviderIntegration)(pushClient, payload.companyId, pushIntegration.id, pushIntegration.metadata);
                                    pool = (0, client_1.getPostgresConnectionPool)(5);
                                    kysely = (0, client_1.getPostgresClient)(pool, kysely_1.PostgresDriver);
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, , 5, 7]);
                                    mappingService = (0, accounting_1.createMappingService)(kysely, payload.companyId);
                                    return [4 /*yield*/, mappingService.getUnsyncedEntityIds("item", "item", pushProvider.id, payload.batchSize)];
                                case 3:
                                    unsyncedIds_3 = _a.sent();
                                    if (unsyncedIds_3.length === 0) {
                                        return [2 /*return*/, {
                                                successCount: 0,
                                                hasMore: false
                                            }];
                                    }
                                    syncer_6 = accounting_1.SyncFactory.getSyncer({
                                        database: kysely,
                                        companyId: payload.companyId,
                                        provider: pushProvider,
                                        config: pushProvider.getSyncConfig("item"),
                                        entityType: "item"
                                    });
                                    return [4 /*yield*/, withRateLimitRetry(function () { return syncer_6.pushBatchToAccounting(unsyncedIds_3); }, "pushBatchToAccounting items", step)];
                                case 4:
                                    syncResult = _a.sent();
                                    console.info("[PUSH] Pushed ".concat(syncResult.successCount, "/").concat(unsyncedIds_3.length, " item entities"), {
                                        entityIds: unsyncedIds_3,
                                        results: syncResult.results.map(function (r) { return ({
                                            status: r.status,
                                            action: r.action,
                                            localId: r.localId,
                                            remoteId: r.remoteId,
                                            error: r.error
                                        }); })
                                    });
                                    return [2 /*return*/, {
                                            successCount: syncResult.successCount,
                                            hasMore: unsyncedIds_3.length >= payload.batchSize
                                        }];
                                case 5: return [4 /*yield*/, pool.end()];
                                case 6:
                                    _a.sent();
                                    return [7 /*endfinally*/];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 27:
                pushResult = _f.sent();
                result.items.pushed += pushResult.successCount;
                hasMore = pushResult.hasMore;
                batchIndex++;
                if (!hasMore) return [3 /*break*/, 29];
                return [4 /*yield*/, step.sleep("items-push-delay-".concat(currentBatchIndex), "2s")];
            case 28:
                _f.sent();
                _f.label = 29;
            case 29: return [3 /*break*/, 26];
            case 30: return [3 /*break*/, 32];
            case 31:
                console.info("[PUSH] Skipping items push - not enabled or direction is pull-only");
                _f.label = 32;
            case 32:
                // Calculate totals
                result.totalPulled =
                    result.customers.pulled + result.vendors.pulled + result.items.pulled;
                result.totalPushed =
                    result.customers.pushed + result.vendors.pushed + result.items.pushed;
                console.info("[COMPLETE] Backfill finished. Pulled: ".concat(result.totalPulled, ", Pushed: ").concat(result.totalPushed));
                return [2 /*return*/, result];
        }
    });
}); });
