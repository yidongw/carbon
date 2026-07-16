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
exports.ExternalIntegrationMappingService = void 0;
exports.createMappingService = createMappingService;
/**
 * Service for managing external integration mappings.
 * Provides a clean interface for linking Carbon entities to external system entities.
 */
var ExternalIntegrationMappingService = /** @class */ (function () {
    function ExternalIntegrationMappingService(db, companyId) {
        this.db = db;
        this.companyId = companyId;
    }
    /**
     * Link a Carbon entity to an external system entity.
     * Uses upsert to handle both create and update cases.
     * If remoteUpdatedAt is not provided, it defaults to the current timestamp.
     */
    ExternalIntegrationMappingService.prototype.link = function (entityType, entityId, integration, externalId, options) {
        return __awaiter(this, void 0, void 0, function () {
            var now, remoteUpdatedAt, allowDuplicateExternalId;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        now = new Date().toISOString();
                        remoteUpdatedAt = (options === null || options === void 0 ? void 0 : options.remoteUpdatedAt) instanceof Date
                            ? options.remoteUpdatedAt.toISOString()
                            : ((_a = options === null || options === void 0 ? void 0 : options.remoteUpdatedAt) !== null && _a !== void 0 ? _a : now);
                        allowDuplicateExternalId = (_b = options === null || options === void 0 ? void 0 : options.allowDuplicateExternalId) !== null && _b !== void 0 ? _b : false;
                        return [4 /*yield*/, this.db
                                .insertInto("externalIntegrationMapping")
                                .values({
                                entityType: entityType,
                                entityId: entityId,
                                integration: integration,
                                externalId: externalId,
                                allowDuplicateExternalId: allowDuplicateExternalId,
                                companyId: this.companyId,
                                metadata: (_c = options === null || options === void 0 ? void 0 : options.metadata) !== null && _c !== void 0 ? _c : null,
                                lastSyncedAt: now,
                                remoteUpdatedAt: remoteUpdatedAt,
                                createdBy: (_d = options === null || options === void 0 ? void 0 : options.createdBy) !== null && _d !== void 0 ? _d : null,
                                createdAt: now,
                                updatedAt: now
                            })
                                .onConflict(function (oc) {
                                var _a;
                                return oc
                                    .columns(["entityType", "entityId", "integration", "companyId"])
                                    .doUpdateSet({
                                    externalId: externalId,
                                    allowDuplicateExternalId: allowDuplicateExternalId,
                                    metadata: ((_a = options === null || options === void 0 ? void 0 : options.metadata) !== null && _a !== void 0 ? _a : null),
                                    lastSyncedAt: now,
                                    remoteUpdatedAt: remoteUpdatedAt,
                                    updatedAt: now
                                });
                            })
                                .execute()];
                    case 1:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Unlink a Carbon entity from an external system.
     */
    ExternalIntegrationMappingService.prototype.unlink = function (entityType, entityId, integration) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .deleteFrom("externalIntegrationMapping")
                            .where("entityType", "=", entityType)
                            .where("entityId", "=", entityId)
                            .where("integration", "=", integration)
                            .where("companyId", "=", this.companyId)
                            .execute()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the external ID for a Carbon entity.
     */
    ExternalIntegrationMappingService.prototype.getExternalId = function (entityType, entityId, integration) {
        return __awaiter(this, void 0, void 0, function () {
            var mapping;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.db
                            .selectFrom("externalIntegrationMapping")
                            .select("externalId")
                            .where("entityType", "=", entityType)
                            .where("entityId", "=", entityId)
                            .where("integration", "=", integration)
                            .where("companyId", "=", this.companyId)
                            .executeTakeFirst()];
                    case 1:
                        mapping = _b.sent();
                        return [2 /*return*/, (_a = mapping === null || mapping === void 0 ? void 0 : mapping.externalId) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    /**
     * Get the Carbon entity ID for an external ID.
     */
    ExternalIntegrationMappingService.prototype.getEntityId = function (integration, externalId, entityType) {
        return __awaiter(this, void 0, void 0, function () {
            var query, mapping;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = this.db
                            .selectFrom("externalIntegrationMapping")
                            .select("entityId")
                            .where("integration", "=", integration)
                            .where("externalId", "=", externalId)
                            .where("companyId", "=", this.companyId);
                        if (entityType) {
                            query = query.where("entityType", "=", entityType);
                        }
                        return [4 /*yield*/, query.executeTakeFirst()];
                    case 1:
                        mapping = _b.sent();
                        return [2 /*return*/, (_a = mapping === null || mapping === void 0 ? void 0 : mapping.entityId) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    /**
     * Get the full mapping for a Carbon entity.
     */
    ExternalIntegrationMappingService.prototype.getByEntity = function (entityType, entityId, integration) {
        return __awaiter(this, void 0, void 0, function () {
            var mapping;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.db
                            .selectFrom("externalIntegrationMapping")
                            .selectAll()
                            .where("entityType", "=", entityType)
                            .where("entityId", "=", entityId)
                            .where("integration", "=", integration)
                            .where("companyId", "=", this.companyId)
                            .executeTakeFirst()];
                    case 1:
                        mapping = _b.sent();
                        return [2 /*return*/, (_a = mapping) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    /**
     * Get the full mapping for an external ID.
     */
    ExternalIntegrationMappingService.prototype.getByExternalId = function (integration, externalId, entityType) {
        return __awaiter(this, void 0, void 0, function () {
            var query, mapping;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = this.db
                            .selectFrom("externalIntegrationMapping")
                            .selectAll()
                            .where("integration", "=", integration)
                            .where("externalId", "=", externalId)
                            .where("companyId", "=", this.companyId);
                        if (entityType) {
                            query = query.where("entityType", "=", entityType);
                        }
                        return [4 /*yield*/, query.executeTakeFirst()];
                    case 1:
                        mapping = _b.sent();
                        return [2 /*return*/, (_a = mapping) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    /**
     * Get all mappings for a Carbon entity (across all integrations).
     */
    ExternalIntegrationMappingService.prototype.getAllByEntity = function (entityType, entityId) {
        return __awaiter(this, void 0, void 0, function () {
            var mappings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .selectFrom("externalIntegrationMapping")
                            .selectAll()
                            .where("entityType", "=", entityType)
                            .where("entityId", "=", entityId)
                            .where("companyId", "=", this.companyId)
                            .execute()];
                    case 1:
                        mappings = _a.sent();
                        return [2 /*return*/, mappings];
                }
            });
        });
    };
    /**
     * Get all mappings for an integration.
     */
    ExternalIntegrationMappingService.prototype.getAllByIntegration = function (integration, entityType) {
        return __awaiter(this, void 0, void 0, function () {
            var query, mappings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.db
                            .selectFrom("externalIntegrationMapping")
                            .selectAll()
                            .where("integration", "=", integration)
                            .where("companyId", "=", this.companyId);
                        if (entityType) {
                            query = query.where("entityType", "=", entityType);
                        }
                        return [4 /*yield*/, query.execute()];
                    case 1:
                        mappings = _a.sent();
                        return [2 /*return*/, mappings];
                }
            });
        });
    };
    /**
     * Check if a mapping already exists and is up to date.
     * Returns true if the mapping exists and remoteUpdatedAt >= the provided timestamp.
     */
    ExternalIntegrationMappingService.prototype.isUpToDate = function (integration, externalId, remoteUpdatedAt) {
        return __awaiter(this, void 0, void 0, function () {
            var mapping;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getByExternalId(integration, externalId)];
                    case 1:
                        mapping = _a.sent();
                        if (!(mapping === null || mapping === void 0 ? void 0 : mapping.remoteUpdatedAt)) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, new Date(mapping.remoteUpdatedAt) >= remoteUpdatedAt];
                }
            });
        });
    };
    /**
     * Get entity IDs that don't have a mapping for a specific integration.
     * Useful for finding entities that need to be synced.
     */
    ExternalIntegrationMappingService.prototype.getUnsyncedEntityIds = function (entityType, tableName, integration, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .selectFrom(tableName)
                            .leftJoin("externalIntegrationMapping as m", function (join) {
                            return join
                                .onRef("m.entityId", "=", "".concat(tableName, ".id"))
                                .on("m.entityType", "=", entityType)
                                .on("m.integration", "=", integration)
                                .on("m.companyId", "=", _this.companyId);
                        })
                            .select(["".concat(tableName, ".id")])
                            .where("".concat(tableName, ".companyId"), "=", this.companyId)
                            .where("m.id", "is", null)
                            .limit(limit)
                            .execute()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.map(function (r) { return r.id; })];
                }
            });
        });
    };
    /**
     * Update only the lastSyncedAt timestamp for a mapping.
     */
    ExternalIntegrationMappingService.prototype.touchLastSyncedAt = function (entityType, entityId, integration) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .updateTable("externalIntegrationMapping")
                            .set({
                            lastSyncedAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        })
                            .where("entityType", "=", entityType)
                            .where("entityId", "=", entityId)
                            .where("integration", "=", integration)
                            .where("companyId", "=", this.companyId)
                            .execute()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Batch link multiple entities to external IDs.
     * If remoteUpdatedAt is not provided for a mapping, it defaults to the current timestamp.
     */
    ExternalIntegrationMappingService.prototype.linkBatch = function (mappings) {
        return __awaiter(this, void 0, void 0, function () {
            var now, values;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (mappings.length === 0)
                            return [2 /*return*/];
                        now = new Date().toISOString();
                        values = mappings.map(function (m) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                            return ({
                                entityType: m.entityType,
                                entityId: m.entityId,
                                integration: m.integration,
                                externalId: m.externalId,
                                allowDuplicateExternalId: (_b = (_a = m.options) === null || _a === void 0 ? void 0 : _a.allowDuplicateExternalId) !== null && _b !== void 0 ? _b : false,
                                companyId: _this.companyId,
                                metadata: (_d = (_c = m.options) === null || _c === void 0 ? void 0 : _c.metadata) !== null && _d !== void 0 ? _d : null,
                                lastSyncedAt: now,
                                // Default to current timestamp if remoteUpdatedAt is not provided
                                remoteUpdatedAt: ((_e = m.options) === null || _e === void 0 ? void 0 : _e.remoteUpdatedAt) instanceof Date
                                    ? m.options.remoteUpdatedAt.toISOString()
                                    : ((_g = (_f = m.options) === null || _f === void 0 ? void 0 : _f.remoteUpdatedAt) !== null && _g !== void 0 ? _g : now),
                                createdBy: (_j = (_h = m.options) === null || _h === void 0 ? void 0 : _h.createdBy) !== null && _j !== void 0 ? _j : null,
                                createdAt: now,
                                updatedAt: now
                            });
                        });
                        return [4 /*yield*/, this.db
                                .insertInto("externalIntegrationMapping")
                                .values(values)
                                .onConflict(function (oc) {
                                return oc
                                    .columns(["entityType", "entityId", "integration", "companyId"])
                                    .doUpdateSet(function (eb) { return ({
                                    externalId: eb.ref("excluded.externalId"),
                                    allowDuplicateExternalId: eb.ref("excluded.allowDuplicateExternalId"),
                                    metadata: eb.ref("excluded.metadata"),
                                    lastSyncedAt: eb.ref("excluded.lastSyncedAt"),
                                    remoteUpdatedAt: eb.ref("excluded.remoteUpdatedAt"),
                                    updatedAt: eb.ref("excluded.updatedAt")
                                }); });
                            })
                                .execute()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ExternalIntegrationMappingService;
}());
exports.ExternalIntegrationMappingService = ExternalIntegrationMappingService;
/**
 * Create a new ExternalIntegrationMappingService instance.
 */
function createMappingService(db, companyId) {
    return new ExternalIntegrationMappingService(db, companyId);
}
