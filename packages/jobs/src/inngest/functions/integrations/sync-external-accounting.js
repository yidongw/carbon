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
exports.syncExternalAccountingFunction = void 0;
/**
 * Function to sync entities between accounting providers and Carbon.
 *
 * Handles three sync directions:
 * - "push-to-accounting": Push Carbon entities to the accounting provider
 * - "pull-from-accounting": Pull entities from the accounting provider to Carbon
 * - "two-way": Intelligently sync based on entity state and config
 *
 * For "two-way" sync:
 * - If entity has local ID but no remote mapping -> Push to accounting
 * - If entity has remote ID but no local mapping -> Pull from accounting
 * - If entity has both -> Use the entity config's "owner" to determine direction
 *
 * Includes cooldown protection to prevent redundant syncs of the same entity.
 */
var client_server_1 = require("@carbon/auth/client.server");
var client_1 = require("@carbon/database/client");
var accounting_1 = require("@carbon/ee/accounting");
var utils_1 = require("@carbon/utils");
var kysely_1 = require("kysely");
var client_2 = require("../../client");
// Cooldown period in milliseconds to prevent redundant syncs
// If an entity was synced within this period, skip syncing it again
var SYNC_COOLDOWN_MS = 60000; // 1 minute
var PayloadSchema = accounting_1.AccountingSyncSchema.extend({
    syncDirection: accounting_1.AccountingSyncSchema.shape.syncDirection
});
exports.syncExternalAccountingFunction = client_2.inngest.createFunction({ id: "sync-external-accounting", retries: 1 }, { event: "carbon/sync-external-accounting" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var payload, client, integration, provider, pool, kysely, mappingService, results, group, _i, _c, _d, entityType, entities, type, entityConfig, syncer, effectiveDirection, entitiesToSync, result, entitiesToSync, result, twoWayResult, error_1, error_2;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                payload = PayloadSchema.parse(event.data);
                client = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, (0, accounting_1.getAccountingIntegration)(client, payload.companyId, payload.provider)];
            case 1:
                integration = _e.sent();
                provider = (0, accounting_1.getProviderIntegration)(client, payload.companyId, integration.id, integration.metadata);
                pool = (0, client_1.getPostgresConnectionPool)(10);
                kysely = (0, client_1.getPostgresClient)(pool, kysely_1.PostgresDriver);
                mappingService = (0, accounting_1.createMappingService)(kysely, payload.companyId);
                results = {
                    success: [],
                    failed: []
                };
                _e.label = 2;
            case 2:
                _e.trys.push([2, 16, 17, 19]);
                group = (0, utils_1.groupBy)(payload.entities, function (e) { return e.entityType; });
                _i = 0, _c = Object.entries(group);
                _e.label = 3;
            case 3:
                if (!(_i < _c.length)) return [3 /*break*/, 15];
                _d = _c[_i], entityType = _d[0], entities = _d[1];
                type = entityType;
                entityConfig = provider.getSyncConfig(type);
                if (!(entityConfig === null || entityConfig === void 0 ? void 0 : entityConfig.enabled)) {
                    console.info("Sync disabled for ".concat(entityType, ", skipping"));
                    return [3 /*break*/, 14];
                }
                _e.label = 4;
            case 4:
                _e.trys.push([4, 13, , 14]);
                console.info("Starting sync for ".concat(entities.length, " ").concat(entityType, " entities"), {
                    direction: payload.syncDirection,
                    configDirection: entityConfig.direction
                });
                syncer = accounting_1.SyncFactory.getSyncer({
                    database: kysely,
                    companyId: payload.companyId,
                    provider: provider,
                    config: entityConfig,
                    entityType: type
                });
                if (entities.length === 0) {
                    console.info("No entities to sync for type ".concat(entityType));
                    return [3 /*break*/, 14];
                }
                effectiveDirection = payload.syncDirection === "two-way"
                    ? entityConfig.direction // Use the entity's configured direction
                    : payload.syncDirection;
                if (!(effectiveDirection === "push-to-accounting")) return [3 /*break*/, 7];
                return [4 /*yield*/, filterByCooldown(mappingService, type, entities, provider.id)];
            case 5:
                entitiesToSync = _e.sent();
                if (entitiesToSync.length === 0) {
                    console.info("All ".concat(entityType, " entities were synced recently, skipping"));
                    return [3 /*break*/, 14];
                }
                return [4 /*yield*/, syncer.pushBatchToAccounting(entitiesToSync.map(function (e) { return e.entityId; }))];
            case 6:
                result = _e.sent();
                console.info("Push sync result:", { entityType: entityType, result: result });
                results.success.push(result);
                return [3 /*break*/, 12];
            case 7:
                if (!(effectiveDirection === "pull-from-accounting")) return [3 /*break*/, 10];
                return [4 /*yield*/, filterByCooldown(mappingService, type, entities, provider.id)];
            case 8:
                entitiesToSync = _e.sent();
                if (entitiesToSync.length === 0) {
                    console.info("All ".concat(entityType, " entities were synced recently, skipping"));
                    return [3 /*break*/, 14];
                }
                return [4 /*yield*/, syncer.pullBatchFromAccounting(entitiesToSync.map(function (e) { return e.entityId; }))];
            case 9:
                result = _e.sent();
                console.info("Pull sync result:", { entityType: entityType, result: result });
                results.success.push(result);
                return [3 /*break*/, 12];
            case 10:
                if (!(effectiveDirection === "two-way")) return [3 /*break*/, 12];
                return [4 /*yield*/, handleTwoWaySync(syncer, mappingService, type, entities, provider.id, entityConfig.owner)];
            case 11:
                twoWayResult = _e.sent();
                console.info("Two-way sync result:", __assign({ entityType: entityType }, twoWayResult));
                results.success.push(twoWayResult.pushed);
                results.success.push(twoWayResult.pulled);
                _e.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                error_1 = _e.sent();
                console.error("Failed to process ".concat(entityType, " entities:"), error_1);
                results.failed.push({
                    entities: entities,
                    error: error_1 instanceof Error ? error_1.message : "Unknown error"
                });
                return [3 /*break*/, 14];
            case 14:
                _i++;
                return [3 /*break*/, 3];
            case 15: return [3 /*break*/, 19];
            case 16:
                error_2 = _e.sent();
                console.error("Sync task failed:", error_2);
                return [3 /*break*/, 19];
            case 17: return [4 /*yield*/, pool.end()];
            case 18:
                _e.sent();
                return [7 /*endfinally*/];
            case 19: return [2 /*return*/, results];
        }
    });
}); });
/**
 * Filter entities that were synced within the cooldown period.
 * Returns only entities that are eligible for syncing.
 */
function filterByCooldown(mappingService, entityType, entities, integration) {
    return __awaiter(this, void 0, void 0, function () {
        var now, eligibleEntities, _i, entities_1, entity, mapping, lastSyncedAt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = Date.now();
                    eligibleEntities = [];
                    _i = 0, entities_1 = entities;
                    _a.label = 1;
                case 1:
                    if (!(_i < entities_1.length)) return [3 /*break*/, 4];
                    entity = entities_1[_i];
                    return [4 /*yield*/, mappingService.getByEntity(entityType, entity.entityId, integration)];
                case 2:
                    mapping = _a.sent();
                    // If no mapping exists or lastSyncedAt is old enough, include it
                    if (!(mapping === null || mapping === void 0 ? void 0 : mapping.lastSyncedAt)) {
                        eligibleEntities.push(entity);
                        return [3 /*break*/, 3];
                    }
                    lastSyncedAt = new Date(mapping.lastSyncedAt).getTime();
                    if (now - lastSyncedAt > SYNC_COOLDOWN_MS) {
                        eligibleEntities.push(entity);
                    }
                    else {
                        console.debug("Skipping ".concat(entityType, " ").concat(entity.entityId, " - synced ").concat(now - lastSyncedAt, "ms ago"));
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, eligibleEntities];
            }
        });
    });
}
/**
 * Handle two-way sync by determining the appropriate direction for each entity.
 *
 * Logic:
 * - If entity has entityId (Carbon ID) but no remote mapping -> Push to accounting
 * - If entity has entityId that is actually a remote ID (no local entity) -> Pull from accounting
 * - If entity has both local and remote -> Use "owner" config to determine winner
 */
function handleTwoWaySync(syncer, mappingService, entityType, entities, integration, owner) {
    return __awaiter(this, void 0, void 0, function () {
        var toPush, toPull, now, _i, entities_2, entity, mapping, lastSyncedAt, pushResult, _a, pullResult, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    toPush = [];
                    toPull = [];
                    now = Date.now();
                    _i = 0, entities_2 = entities;
                    _c.label = 1;
                case 1:
                    if (!(_i < entities_2.length)) return [3 /*break*/, 4];
                    entity = entities_2[_i];
                    return [4 /*yield*/, mappingService.getByEntity(entityType, entity.entityId, integration)];
                case 2:
                    mapping = _c.sent();
                    if (mapping === null || mapping === void 0 ? void 0 : mapping.lastSyncedAt) {
                        lastSyncedAt = new Date(mapping.lastSyncedAt).getTime();
                        if (now - lastSyncedAt <= SYNC_COOLDOWN_MS) {
                            console.debug("Skipping two-way sync for ".concat(entityType, " ").concat(entity.entityId, " - synced recently"));
                            return [3 /*break*/, 3];
                        }
                    }
                    if (mapping) {
                        // Entity exists in both systems - use owner to determine direction
                        if (owner === "carbon") {
                            toPush.push(entity.entityId);
                        }
                        else {
                            // owner === "accounting"
                            toPull.push(mapping.externalId);
                        }
                    }
                    else {
                        // No mapping exists - this is likely a Carbon-only entity that needs pushing
                        // Or it could be a remote ID that needs pulling
                        // For now, assume entityId is a Carbon ID and push it
                        toPush.push(entity.entityId);
                    }
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!(toPush.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, syncer.pushBatchToAccounting(toPush)];
                case 5:
                    _a = _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _a = {
                        results: [],
                        successCount: 0,
                        errorCount: 0,
                        skippedCount: 0
                    };
                    _c.label = 7;
                case 7:
                    pushResult = _a;
                    if (!(toPull.length > 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, syncer.pullBatchFromAccounting(toPull)];
                case 8:
                    _b = _c.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _b = {
                        results: [],
                        successCount: 0,
                        errorCount: 0,
                        skippedCount: 0
                    };
                    _c.label = 10;
                case 10:
                    pullResult = _b;
                    return [2 /*return*/, { pushed: pushResult, pulled: pullResult }];
            }
        });
    });
}
