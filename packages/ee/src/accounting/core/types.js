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
exports.BaseEntitySyncer = exports.BaseProvider = void 0;
var external_mapping_1 = require("./external-mapping");
var utils_1 = require("./utils");
var BaseProvider = /** @class */ (function () {
    function BaseProvider() {
    }
    return BaseProvider;
}());
exports.BaseProvider = BaseProvider;
var BaseEntitySyncer = /** @class */ (function () {
    function BaseEntitySyncer(context) {
        this.context = context;
        this._companyGroupId = undefined;
        this.database = context.database;
        this.companyId = context.companyId;
        this.provider = context.provider;
        this.config = context.config;
        this.entityType = context.entityType;
        this.mappingService = (0, external_mapping_1.createMappingService)(context.database, context.companyId);
    }
    // =================================================================
    // 1. ID MAPPING (Default implementations using mapping service)
    // =================================================================
    /**
     * Look up the Remote ID (e.g. Xero ID) for a given Local ID (Carbon ID).
     * Default implementation uses the external integration mapping table.
     * Can be overridden by subclasses for custom behavior.
     */
    BaseEntitySyncer.prototype.getRemoteId = function (localId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.mappingService.getExternalId(this.entityType, localId, this.provider.id)];
            });
        });
    };
    /**
     * Look up the Local ID (Carbon ID) for a given Remote ID (e.g. Xero ID).
     * Default implementation uses the external integration mapping table.
     * Can be overridden by subclasses for custom behavior.
     */
    BaseEntitySyncer.prototype.getLocalId = function (remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.mappingService.getEntityId(this.provider.id, remoteId, this.entityType)];
            });
        });
    };
    /**
     * Save the link between a Carbon ID and a Remote ID.
     * Default implementation uses the external integration mapping table.
     * Can be overridden by subclasses for custom behavior.
     */
    BaseEntitySyncer.prototype.linkEntities = function (tx, localId, remoteId, remoteUpdatedAt) {
        return __awaiter(this, void 0, void 0, function () {
            var txMappingService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txMappingService = (0, external_mapping_1.createMappingService)(tx, this.companyId);
                        return [4 /*yield*/, txMappingService.link(this.entityType, localId, this.provider.id, remoteId, { remoteUpdatedAt: remoteUpdatedAt })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseEntitySyncer.prototype.getCompanyGroupId = function (dbOrTx) {
        return __awaiter(this, void 0, void 0, function () {
            var db, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this._companyGroupId !== undefined)
                            return [2 /*return*/, this._companyGroupId];
                        db = dbOrTx !== null && dbOrTx !== void 0 ? dbOrTx : this.database;
                        return [4 /*yield*/, db
                                .selectFrom("company")
                                .select("companyGroupId")
                                .where("id", "=", this.companyId)
                                .executeTakeFirst()];
                    case 1:
                        result = _b.sent();
                        this._companyGroupId = (_a = result === null || result === void 0 ? void 0 : result.companyGroupId) !== null && _a !== void 0 ? _a : null;
                        return [2 /*return*/, this._companyGroupId];
                }
            });
        });
    };
    BaseEntitySyncer.prototype.resolveAccountIdByNumber = function (tx, accountNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var companyGroupId, match;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getCompanyGroupId(tx)];
                    case 1:
                        companyGroupId = _b.sent();
                        if (!companyGroupId)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, tx
                                .selectFrom("account")
                                .select("id")
                                .where("companyGroupId", "=", companyGroupId)
                                .where("number", "=", accountNumber)
                                .where("active", "=", true)
                                .executeTakeFirst()];
                    case 2:
                        match = _b.sent();
                        return [2 /*return*/, (_a = match === null || match === void 0 ? void 0 : match.id) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    // =================================================================
    // 3. PUSH WORKFLOW (Carbon -> Accounting)
    // =================================================================
    BaseEntitySyncer.prototype.pushToAccounting = function (entityId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingMapping, localEntity, shouldSyncResult, localUpdatedAt, remotePayload, id_1, remoteId, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.enabled) {
                            return [2 /*return*/, {
                                    status: "skipped",
                                    action: "none",
                                    error: "Sync disabled in config"
                                }];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 12]);
                        return [4 /*yield*/, this.mappingService.getByEntity(this.entityType, entityId, this.provider.id)];
                    case 2:
                        existingMapping = _a.sent();
                        return [4 /*yield*/, this.fetchLocal(entityId)];
                    case 3:
                        localEntity = _a.sent();
                        if (!localEntity) {
                            return [2 /*return*/, {
                                    status: "error",
                                    action: "none",
                                    error: "Entity ".concat(entityId, " not found in Carbon")
                                }];
                        }
                        if (!this.shouldSync) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.shouldSync({
                                direction: "push",
                                localEntity: localEntity,
                                isFirstSync: !existingMapping,
                                entityId: entityId
                            })];
                    case 4:
                        shouldSyncResult = _a.sent();
                        if (shouldSyncResult !== true) {
                            return [2 /*return*/, {
                                    status: "skipped",
                                    action: "none",
                                    localId: entityId,
                                    error: typeof shouldSyncResult === "string"
                                        ? shouldSyncResult
                                        : "Entity not eligible for sync"
                                }];
                        }
                        _a.label = 5;
                    case 5:
                        localUpdatedAt = new Date(localEntity.updatedAt);
                        // 4. FAST BAILOUT: If already synced and local hasn't changed
                        if (existingMapping === null || existingMapping === void 0 ? void 0 : existingMapping.lastSyncedAt) {
                            if (localUpdatedAt <= new Date(existingMapping.lastSyncedAt)) {
                                return [2 /*return*/, {
                                        status: "skipped",
                                        action: "none",
                                        localId: entityId,
                                        remoteId: existingMapping.externalId,
                                        error: "Already synced - local unchanged"
                                    }];
                            }
                        }
                        return [4 /*yield*/, this.mapToRemote(localEntity)];
                    case 6:
                        remotePayload = _a.sent();
                        return [4 /*yield*/, this.upsertRemote(remotePayload, entityId)];
                    case 7:
                        id_1 = _a.sent();
                        return [4 /*yield*/, (0, utils_1.withTriggersDisabled)(this.database, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.linkEntities(tx, entityId, id_1)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, id_1];
                                    }
                                });
                            }); })];
                    case 8:
                        remoteId = _a.sent();
                        return [4 /*yield*/, this.logSyncOperation("push", entityId, remoteId, "success")];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, {
                                status: "success",
                                action: existingMapping ? "updated" : "created",
                                localId: entityId,
                                remoteId: remoteId
                            }];
                    case 10:
                        err_1 = _a.sent();
                        return [4 /*yield*/, this.logSyncOperation("push", entityId, undefined, "error", err_1)];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, {
                                status: "error",
                                action: "none",
                                localId: entityId,
                                error: err_1 instanceof Error ? err_1.message : String(err_1)
                            }];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    // =================================================================
    // 4. PULL WORKFLOW (Accounting -> Carbon)
    // =================================================================
    BaseEntitySyncer.prototype.pullFromAccounting = function (remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingMapping, remoteEntity, shouldSyncResult, remoteUpdatedAt_1, localPayload_1, newLocalId, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.enabled) {
                            return [2 /*return*/, {
                                    status: "skipped",
                                    action: "none",
                                    error: "Sync disabled in config"
                                }];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 11]);
                        return [4 /*yield*/, this.mappingService.getByExternalId(this.provider.id, remoteId, this.entityType)];
                    case 2:
                        existingMapping = _a.sent();
                        return [4 /*yield*/, this.fetchRemote(remoteId)];
                    case 3:
                        remoteEntity = _a.sent();
                        if (!remoteEntity) {
                            return [2 /*return*/, {
                                    status: "error",
                                    action: "none",
                                    error: "Entity ".concat(remoteId, " not found in Remote")
                                }];
                        }
                        if (!this.shouldSync) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.shouldSync({
                                direction: "pull",
                                remoteEntity: remoteEntity,
                                isFirstSync: !existingMapping,
                                entityId: remoteId
                            })];
                    case 4:
                        shouldSyncResult = _a.sent();
                        if (shouldSyncResult !== true) {
                            return [2 /*return*/, {
                                    status: "skipped",
                                    action: "none",
                                    remoteId: remoteId,
                                    error: typeof shouldSyncResult === "string"
                                        ? shouldSyncResult
                                        : "Entity not eligible for sync"
                                }];
                        }
                        _a.label = 5;
                    case 5:
                        remoteUpdatedAt_1 = this.getRemoteUpdatedAt(remoteEntity);
                        // 4. FAST BAILOUT: Compare timestamps without fetching local entity
                        if ((existingMapping === null || existingMapping === void 0 ? void 0 : existingMapping.remoteUpdatedAt) && remoteUpdatedAt_1) {
                            if (new Date(existingMapping.remoteUpdatedAt) >= remoteUpdatedAt_1) {
                                return [2 /*return*/, {
                                        status: "skipped",
                                        action: "none",
                                        localId: existingMapping.entityId,
                                        remoteId: remoteId,
                                        error: "Already synced - remote unchanged"
                                    }];
                            }
                        }
                        return [4 /*yield*/, this.mapToLocal(remoteEntity)];
                    case 6:
                        localPayload_1 = _a.sent();
                        return [4 /*yield*/, (0, utils_1.withTriggersDisabled)(this.database, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var id;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.upsertLocal(tx, localPayload_1, remoteId)];
                                        case 1:
                                            id = _a.sent();
                                            return [4 /*yield*/, this.linkEntities(tx, id, remoteId, remoteUpdatedAt_1 !== null && remoteUpdatedAt_1 !== void 0 ? remoteUpdatedAt_1 : undefined)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/, id];
                                    }
                                });
                            }); })];
                    case 7:
                        newLocalId = _a.sent();
                        return [4 /*yield*/, this.logSyncOperation("pull", newLocalId, remoteId, "success")];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, {
                                status: "success",
                                action: existingMapping ? "updated" : "created",
                                localId: newLocalId,
                                remoteId: remoteId
                            }];
                    case 9:
                        err_2 = _a.sent();
                        return [4 /*yield*/, this.logSyncOperation("pull", undefined, remoteId, "error", err_2)];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, {
                                status: "error",
                                action: "none",
                                remoteId: remoteId,
                                error: err_2 instanceof Error ? err_2.message : String(err_2)
                            }];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    // =================================================================
    // 5. BATCH PUSH WORKFLOW (Carbon -> Accounting)
    // =================================================================
    BaseEntitySyncer.prototype.pushBatchToAccounting = function (entityIds) {
        return __awaiter(this, void 0, void 0, function () {
            var results, _i, entityIds_1, id, localEntities_2, notFoundIds, _a, notFoundIds_1, id, batchPayloads, _b, localEntities_1, _c, localId, entity, shouldSyncResult, payload, err_3, remoteIdMap, mappingsToLink_1, _d, batchPayloads_1, localId, remoteId, err_4, _loop_1, _e, entityIds_2, id;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        results = [];
                        if (!this.config.enabled) {
                            for (_i = 0, entityIds_1 = entityIds; _i < entityIds_1.length; _i++) {
                                id = entityIds_1[_i];
                                results.push({
                                    status: "skipped",
                                    action: "none",
                                    localId: id,
                                    error: "Sync disabled in config"
                                });
                            }
                            return [2 /*return*/, this.summarizeBatchResults(results)];
                        }
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 14, , 15]);
                        return [4 /*yield*/, this.fetchLocalBatch(entityIds)];
                    case 2:
                        localEntities_2 = _f.sent();
                        notFoundIds = entityIds.filter(function (id) { return !localEntities_2.has(id); });
                        for (_a = 0, notFoundIds_1 = notFoundIds; _a < notFoundIds_1.length; _a++) {
                            id = notFoundIds_1[_a];
                            results.push({
                                status: "error",
                                action: "none",
                                localId: id,
                                error: "Entity ".concat(id, " not found in Carbon")
                            });
                        }
                        batchPayloads = [];
                        _b = 0, localEntities_1 = localEntities_2;
                        _f.label = 3;
                    case 3:
                        if (!(_b < localEntities_1.length)) return [3 /*break*/, 10];
                        _c = localEntities_1[_b], localId = _c[0], entity = _c[1];
                        _f.label = 4;
                    case 4:
                        _f.trys.push([4, 8, , 9]);
                        if (!this.shouldSync) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.shouldSync({
                                direction: "push",
                                localEntity: entity,
                                isFirstSync: true, // Batch doesn't check existing mappings for perf
                                entityId: localId
                            })];
                    case 5:
                        shouldSyncResult = _f.sent();
                        if (shouldSyncResult !== true) {
                            results.push({
                                status: "skipped",
                                action: "none",
                                localId: localId,
                                error: typeof shouldSyncResult === "string"
                                    ? shouldSyncResult
                                    : "Entity not eligible for sync"
                            });
                            return [3 /*break*/, 9];
                        }
                        _f.label = 6;
                    case 6: return [4 /*yield*/, this.mapToRemote(entity)];
                    case 7:
                        payload = _f.sent();
                        batchPayloads.push({ localId: localId, payload: payload });
                        return [3 /*break*/, 9];
                    case 8:
                        err_3 = _f.sent();
                        results.push({
                            status: "error",
                            action: "none",
                            localId: localId,
                            error: err_3 instanceof Error ? err_3.message : String(err_3)
                        });
                        return [3 /*break*/, 9];
                    case 9:
                        _b++;
                        return [3 /*break*/, 3];
                    case 10:
                        if (batchPayloads.length === 0) {
                            return [2 /*return*/, this.summarizeBatchResults(results)];
                        }
                        return [4 /*yield*/, this.upsertRemoteBatch(batchPayloads)];
                    case 11:
                        remoteIdMap = _f.sent();
                        mappingsToLink_1 = [];
                        for (_d = 0, batchPayloads_1 = batchPayloads; _d < batchPayloads_1.length; _d++) {
                            localId = batchPayloads_1[_d].localId;
                            remoteId = remoteIdMap.get(localId);
                            if (remoteId) {
                                mappingsToLink_1.push({
                                    entityType: this.entityType,
                                    entityId: localId,
                                    integration: this.provider.id,
                                    externalId: remoteId
                                });
                                results.push({
                                    status: "success",
                                    action: "updated",
                                    localId: localId,
                                    remoteId: remoteId
                                });
                            }
                            else {
                                results.push({
                                    status: "error",
                                    action: "none",
                                    localId: localId,
                                    error: "Remote upsert did not return ID"
                                });
                            }
                        }
                        if (!(mappingsToLink_1.length > 0)) return [3 /*break*/, 13];
                        return [4 /*yield*/, (0, utils_1.withTriggersDisabled)(this.database, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var txMappingService;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            txMappingService = (0, external_mapping_1.createMappingService)(tx, this.companyId);
                                            return [4 /*yield*/, txMappingService.linkBatch(mappingsToLink_1)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 12:
                        _f.sent();
                        _f.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        err_4 = _f.sent();
                        _loop_1 = function (id) {
                            if (!results.find(function (r) { return r.localId === id; })) {
                                results.push({
                                    status: "error",
                                    action: "none",
                                    localId: id,
                                    error: err_4 instanceof Error ? err_4.message : String(err_4)
                                });
                            }
                        };
                        // If the whole batch fails, mark all as errors
                        for (_e = 0, entityIds_2 = entityIds; _e < entityIds_2.length; _e++) {
                            id = entityIds_2[_e];
                            _loop_1(id);
                        }
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/, this.summarizeBatchResults(results)];
                }
            });
        });
    };
    // =================================================================
    // 6. BATCH PULL WORKFLOW (Accounting -> Carbon)
    // =================================================================
    BaseEntitySyncer.prototype.pullBatchFromAccounting = function (remoteIds) {
        return __awaiter(this, void 0, void 0, function () {
            var results, _i, remoteIds_1, id, remoteEntities_2, notFoundIds, _a, notFoundIds_2, id, _loop_2, this_1, _b, remoteEntities_1, _c, remoteId, entity, err_5, _loop_3, _d, remoteIds_2, id;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        results = [];
                        if (!this.config.enabled) {
                            for (_i = 0, remoteIds_1 = remoteIds; _i < remoteIds_1.length; _i++) {
                                id = remoteIds_1[_i];
                                results.push({
                                    status: "skipped",
                                    action: "none",
                                    remoteId: id,
                                    error: "Sync disabled in config"
                                });
                            }
                            return [2 /*return*/, this.summarizeBatchResults(results)];
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, this.fetchRemoteBatch(remoteIds)];
                    case 2:
                        remoteEntities_2 = _e.sent();
                        notFoundIds = remoteIds.filter(function (id) { return !remoteEntities_2.has(id); });
                        for (_a = 0, notFoundIds_2 = notFoundIds; _a < notFoundIds_2.length; _a++) {
                            id = notFoundIds_2[_a];
                            results.push({
                                status: "error",
                                action: "none",
                                remoteId: id,
                                error: "Entity ".concat(id, " not found in Remote")
                            });
                        }
                        _loop_2 = function (remoteId, entity) {
                            var existingLocalId, shouldSyncResult, localPayload_2, localId, err_6;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        _f.trys.push([0, 6, , 7]);
                                        return [4 /*yield*/, this_1.getLocalId(remoteId)];
                                    case 1:
                                        existingLocalId = _f.sent();
                                        if (existingLocalId && this_1.config.owner === "carbon") {
                                            results.push({
                                                status: "skipped",
                                                action: "none",
                                                remoteId: remoteId,
                                                localId: existingLocalId,
                                                error: "Carbon is System of Record"
                                            });
                                            return [2 /*return*/, "continue"];
                                        }
                                        if (!this_1.shouldSync) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this_1.shouldSync({
                                                direction: "pull",
                                                remoteEntity: entity,
                                                isFirstSync: !existingLocalId,
                                                entityId: remoteId
                                            })];
                                    case 2:
                                        shouldSyncResult = _f.sent();
                                        if (shouldSyncResult !== true) {
                                            results.push({
                                                status: "skipped",
                                                action: "none",
                                                remoteId: remoteId,
                                                error: typeof shouldSyncResult === "string"
                                                    ? shouldSyncResult
                                                    : "Entity not eligible for sync"
                                            });
                                            return [2 /*return*/, "continue"];
                                        }
                                        _f.label = 3;
                                    case 3: return [4 /*yield*/, this_1.mapToLocal(entity)];
                                    case 4:
                                        localPayload_2 = _f.sent();
                                        return [4 /*yield*/, (0, utils_1.withTriggersDisabled)(this_1.database, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                var id;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, this.upsertLocal(tx, localPayload_2, remoteId)];
                                                        case 1:
                                                            id = _a.sent();
                                                            return [4 /*yield*/, this.linkEntities(tx, id, remoteId)];
                                                        case 2:
                                                            _a.sent();
                                                            return [2 /*return*/, id];
                                                    }
                                                });
                                            }); })];
                                    case 5:
                                        localId = _f.sent();
                                        results.push({
                                            status: "success",
                                            action: "updated",
                                            localId: localId,
                                            remoteId: remoteId
                                        });
                                        return [3 /*break*/, 7];
                                    case 6:
                                        err_6 = _f.sent();
                                        results.push({
                                            status: "error",
                                            action: "none",
                                            remoteId: remoteId,
                                            error: err_6 instanceof Error ? err_6.message : String(err_6)
                                        });
                                        return [3 /*break*/, 7];
                                    case 7: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _b = 0, remoteEntities_1 = remoteEntities_2;
                        _e.label = 3;
                    case 3:
                        if (!(_b < remoteEntities_1.length)) return [3 /*break*/, 6];
                        _c = remoteEntities_1[_b], remoteId = _c[0], entity = _c[1];
                        return [5 /*yield**/, _loop_2(remoteId, entity)];
                    case 4:
                        _e.sent();
                        _e.label = 5;
                    case 5:
                        _b++;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_5 = _e.sent();
                        _loop_3 = function (id) {
                            if (!results.find(function (r) { return r.remoteId === id; })) {
                                results.push({
                                    status: "error",
                                    action: "none",
                                    remoteId: id,
                                    error: err_5 instanceof Error ? err_5.message : String(err_5)
                                });
                            }
                        };
                        // If the whole batch fails, mark all as errors
                        for (_d = 0, remoteIds_2 = remoteIds; _d < remoteIds_2.length; _d++) {
                            id = remoteIds_2[_d];
                            _loop_3(id);
                        }
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, this.summarizeBatchResults(results)];
                }
            });
        });
    };
    BaseEntitySyncer.prototype.summarizeBatchResults = function (results) {
        return {
            results: results,
            successCount: results.filter(function (r) { return r.status === "success"; }).length,
            errorCount: results.filter(function (r) { return r.status === "error"; }).length,
            skippedCount: results.filter(function (r) { return r.status === "skipped"; }).length
        };
    };
    // =================================================================
    // 7. DEPENDENCY HELPER
    // =================================================================
    /**
     * JIT (Just-In-Time) Dependency Sync.
     * Finds the Remote ID for a related entity. If not synced, it syncs it.
     */
    BaseEntitySyncer.prototype.ensureDependencySynced = function (type, localId) {
        return __awaiter(this, void 0, void 0, function () {
            var SyncFactory, dependencyConfig, syncer, existingRemoteId, result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log("[BaseSyncer] Resolving dependency: ".concat(type, " ").concat(localId));
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./sync"); })];
                    case 1:
                        SyncFactory = (_d.sent()).SyncFactory;
                        dependencyConfig = (_a = this.context.provider.getSyncConfig(type)) !== null && _a !== void 0 ? _a : {
                            enabled: true,
                            direction: "two-way",
                            owner: "carbon"
                        };
                        syncer = SyncFactory.getSyncer(__assign(__assign({}, this.context), { config: dependencyConfig, entityType: type }));
                        return [4 /*yield*/, syncer.getRemoteId(localId)];
                    case 2:
                        existingRemoteId = _d.sent();
                        if (existingRemoteId) {
                            console.log("[BaseSyncer] Dependency ".concat(type, " ").concat(localId, " already synced: ").concat(existingRemoteId));
                            return [2 /*return*/, existingRemoteId];
                        }
                        console.log("[BaseSyncer] Dependency not found. Triggering sync for ".concat(type, " ").concat(localId));
                        return [4 /*yield*/, syncer.pushToAccounting(localId)];
                    case 3:
                        result = _d.sent();
                        if (result.status === "skipped") {
                            throw new Error("Dependency sync skipped for ".concat(type, " ").concat(localId, ": ").concat((_b = result.error) !== null && _b !== void 0 ? _b : "Sync disabled in config"));
                        }
                        if (result.status === "error" || !result.remoteId) {
                            throw new Error("Dependency failed: Could not sync ".concat(type, " ").concat(localId, ". Error: ").concat((_c = result.error) !== null && _c !== void 0 ? _c : "No remote ID returned"));
                        }
                        console.log("[BaseSyncer] Dependency ".concat(type, " ").concat(localId, " synced successfully: ").concat(result.remoteId));
                        return [2 /*return*/, result.remoteId];
                }
            });
        });
    };
    // =================================================================
    // 6. LOGGING
    // =================================================================
    BaseEntitySyncer.prototype.logSyncOperation = function (direction, localId, remoteId, status, error) {
        return __awaiter(this, void 0, void 0, function () {
            var logEntry, errorDetails;
            return __generator(this, function (_a) {
                logEntry = {
                    direction: direction.toUpperCase(),
                    entity: this.getEntityTypeName(),
                    localId: localId,
                    remoteId: remoteId,
                    status: status
                };
                if (status === "success") {
                    console.log("[SyncLog]", logEntry);
                }
                else {
                    errorDetails = __assign({}, logEntry);
                    if (error instanceof utils_1.AccountingApiError) {
                        errorDetails.errorType = error.name;
                        errorDetails.provider = error.provider;
                        errorDetails.operation = error.operation;
                        errorDetails.apiDetails = {
                            statusCode: error.details.statusCode,
                            statusText: error.details.statusText,
                            providerErrorType: error.details.providerErrorType,
                            providerErrorCode: error.details.providerErrorCode,
                            providerMessage: error.details.providerMessage,
                            validationErrors: error.details.validationErrors
                        };
                        errorDetails.userMessage = error.getUserMessage();
                    }
                    else if (error instanceof Error) {
                        errorDetails.errorType = error.name;
                        errorDetails.errorMessage = error.message;
                        errorDetails.stack = error.stack;
                    }
                    else {
                        errorDetails.error = error;
                    }
                    console.error("[SyncLog] ERROR", errorDetails);
                }
                return [2 /*return*/];
            });
        });
    };
    BaseEntitySyncer.prototype.getEntityTypeName = function () {
        return this.context.entityType || "unknown";
    };
    return BaseEntitySyncer;
}());
exports.BaseEntitySyncer = BaseEntitySyncer;
