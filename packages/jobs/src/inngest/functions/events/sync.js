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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var client_1 = require("@carbon/database/client");
var event_1 = require("@carbon/database/event");
var accounting_1 = require("@carbon/ee/accounting");
var utils_1 = require("@carbon/utils");
var kysely_1 = require("kysely");
var zod_1 = require("zod");
var client_2 = require("../../client");
var SyncRecordSchema = zod_1.z.object({
    event: event_1.EventSchema,
    companyId: zod_1.z.string(),
    handlerConfig: zod_1.z.object({
        provider: zod_1.z.nativeEnum(accounting_1.ProviderID)
    })
});
var SyncPayloadSchema = zod_1.z.object({
    records: zod_1.z.array(SyncRecordSchema)
});
// Map database table names to accounting entity types
var TABLE_TO_ENTITY_MAP = {
    customer: "customer",
    supplier: "vendor",
    item: "item",
    purchaseOrder: "purchaseOrder",
    purchaseInvoice: "bill",
    salesInvoice: "invoice"
};
function getEntityTypeFromTable(table) {
    var _a;
    return (_a = TABLE_TO_ENTITY_MAP[table]) !== null && _a !== void 0 ? _a : null;
}
exports.syncFunction = client_2.inngest.createFunction({
    id: "event-handler-sync",
    retries: 3
}, { event: "carbon/event-sync" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var payload, results, byCompanyProvider, pool, kysely, client, _loop_1, _i, _c, _d, key, records;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                payload = SyncPayloadSchema.parse(event.data);
                console.log("Processing ".concat(payload.records.length, " sync events"));
                results = {
                    success: [],
                    failed: [],
                    skipped: []
                };
                byCompanyProvider = (0, utils_1.groupBy)(payload.records, function (r) {
                    var companyId = r.companyId;
                    var provider = r.handlerConfig.provider;
                    return "".concat(companyId, ":").concat(provider);
                });
                pool = (0, client_1.getPostgresConnectionPool)(10);
                kysely = (0, client_1.getPostgresClient)(pool, kysely_1.PostgresDriver);
                client = (0, client_server_1.getCarbonServiceRole)();
                _e.label = 1;
            case 1:
                _e.trys.push([1, , 6, 8]);
                _loop_1 = function (key, records) {
                    var _f, companyId, provider, _g, records_1, r, groupResult;
                    var _h, _j, _k;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0:
                                _f = key.split(":"), companyId = _f[0], provider = _f[1];
                                if (!companyId || companyId === "undefined" || !provider) {
                                    for (_g = 0, records_1 = records; _g < records_1.length; _g++) {
                                        r = records_1[_g];
                                        results.skipped.push({
                                            recordId: r.event.recordId,
                                            reason: "Missing companyId or provider"
                                        });
                                    }
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, step.run("sync-".concat(companyId, "-").concat(provider), function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var groupResults, integration, providerInstance, byEntityType, _i, _a, _b, entityType, entityRecords, _c, entityRecords_1, r, inserts, updates, deletes, syncer, toSync, entityIds, result, error_1, retryAfterSeconds, _d, deletes_1, del, error_2, _e, records_2, r;
                                        return __generator(this, function (_f) {
                                            switch (_f.label) {
                                                case 0:
                                                    groupResults = {
                                                        success: [],
                                                        failed: [],
                                                        skipped: []
                                                    };
                                                    _f.label = 1;
                                                case 1:
                                                    _f.trys.push([1, 11, , 12]);
                                                    return [4 /*yield*/, (0, accounting_1.getAccountingIntegration)(client, companyId, provider)];
                                                case 2:
                                                    integration = _f.sent();
                                                    providerInstance = (0, accounting_1.getProviderIntegration)(client, companyId, provider, integration.metadata);
                                                    byEntityType = (0, utils_1.groupBy)(records, function (r) {
                                                        var entityType = getEntityTypeFromTable(r.event.table);
                                                        return entityType !== null && entityType !== void 0 ? entityType : "unknown";
                                                    });
                                                    _i = 0, _a = Object.entries(byEntityType);
                                                    _f.label = 3;
                                                case 3:
                                                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                                                    _b = _a[_i], entityType = _b[0], entityRecords = _b[1];
                                                    if (entityType === "unknown") {
                                                        for (_c = 0, entityRecords_1 = entityRecords; _c < entityRecords_1.length; _c++) {
                                                            r = entityRecords_1[_c];
                                                            groupResults.skipped.push({
                                                                recordId: r.event.recordId,
                                                                reason: "Table '".concat(r.event.table, "' has no entity mapping")
                                                            });
                                                        }
                                                        return [3 /*break*/, 9];
                                                    }
                                                    inserts = entityRecords.filter(function (r) { return r.event.operation === "INSERT"; });
                                                    updates = entityRecords.filter(function (r) { return r.event.operation === "UPDATE"; });
                                                    deletes = entityRecords.filter(function (r) { return r.event.operation === "DELETE"; });
                                                    syncer = accounting_1.SyncFactory.getSyncer({
                                                        database: kysely,
                                                        companyId: companyId,
                                                        provider: providerInstance,
                                                        config: providerInstance.getSyncConfig(entityType),
                                                        entityType: entityType
                                                    });
                                                    toSync = __spreadArray(__spreadArray([], inserts, true), updates, true);
                                                    if (!(toSync.length > 0)) return [3 /*break*/, 8];
                                                    entityIds = (0, utils_1.pluckUnique)(toSync, function (r) { return r.event.recordId; });
                                                    console.log("Pushing ".concat(entityIds.length, " ").concat(entityType, " entities to accounting"));
                                                    result = void 0;
                                                    _f.label = 4;
                                                case 4:
                                                    _f.trys.push([4, 6, , 7]);
                                                    return [4 /*yield*/, syncer.pushBatchToAccounting(entityIds)];
                                                case 5:
                                                    result = _f.sent();
                                                    return [3 /*break*/, 7];
                                                case 6:
                                                    error_1 = _f.sent();
                                                    if (error_1 instanceof accounting_1.RatelimitError) {
                                                        retryAfterSeconds = error_1.rateLimitInfo.retryAfterSeconds;
                                                        console.warn("[RATE LIMIT] Hit rate limit, will retry after ".concat(retryAfterSeconds, "s"));
                                                        // Let inngest handle the retry by throwing
                                                        throw error_1;
                                                    }
                                                    throw error_1;
                                                case 7:
                                                    console.log("Sync result:", { entityType: entityType, result: result });
                                                    groupResults.success.push(result);
                                                    _f.label = 8;
                                                case 8:
                                                    // Handle DELETEs (log for now, not yet implemented in syncers)
                                                    for (_d = 0, deletes_1 = deletes; _d < deletes_1.length; _d++) {
                                                        del = deletes_1[_d];
                                                        groupResults.skipped.push({
                                                            recordId: del.event.recordId,
                                                            reason: "DELETE operations not yet implemented"
                                                        });
                                                    }
                                                    _f.label = 9;
                                                case 9:
                                                    _i++;
                                                    return [3 /*break*/, 3];
                                                case 10: return [3 /*break*/, 12];
                                                case 11:
                                                    error_2 = _f.sent();
                                                    console.error("Failed to process sync for ".concat(key, ":"), error_2);
                                                    for (_e = 0, records_2 = records; _e < records_2.length; _e++) {
                                                        r = records_2[_e];
                                                        groupResults.failed.push({
                                                            recordId: r.event.recordId,
                                                            error: error_2 instanceof Error ? error_2.message : "Unknown error"
                                                        });
                                                    }
                                                    return [3 /*break*/, 12];
                                                case 12: return [2 /*return*/, groupResults];
                                            }
                                        });
                                    }); })];
                            case 1:
                                groupResult = (_l.sent());
                                (_h = results.success).push.apply(_h, groupResult.success);
                                (_j = results.failed).push.apply(_j, groupResult.failed);
                                (_k = results.skipped).push.apply(_k, groupResult.skipped);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _c = Object.entries(byCompanyProvider);
                _e.label = 2;
            case 2:
                if (!(_i < _c.length)) return [3 /*break*/, 5];
                _d = _c[_i], key = _d[0], records = _d[1];
                return [5 /*yield**/, _loop_1(key, records)];
            case 3:
                _e.sent();
                _e.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, pool.end()];
            case 7:
                _e.sent();
                return [7 /*endfinally*/];
            case 8:
                console.log("Sync function completed", {
                    successCount: results.success.reduce(function (acc, r) { return acc + r.successCount; }, 0),
                    failedCount: results.failed.length,
                    skippedCount: results.skipped.length
                });
                return [2 /*return*/, results];
        }
    });
}); });
