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
exports.clearCustomFieldsCache = clearCustomFieldsCache;
exports.clearCompanyIntegrationCache = clearCompanyIntegrationCache;
exports.clearAllIntegrationCaches = clearAllIntegrationCaches;
exports.deactivateIntegration = deactivateIntegration;
exports.deleteCustomField = deleteCustomField;
exports.getCompanyIntegrations = getCompanyIntegrations;
exports.hasIntegration = hasIntegration;
exports.getCompanyIntegration = getCompanyIntegration;
exports.getSlackIntegration = getSlackIntegration;
exports.hasSlackIntegration = hasSlackIntegration;
exports.upsertCompanyIntegration = upsertCompanyIntegration;
exports.upsertCustomField = upsertCustomField;
exports.updateCustomFieldsSortOrder = updateCustomFieldsSortOrder;
exports.getIntegrationHealth = getIntegrationHealth;
exports.getIntegrationsWithHealth = getIntegrationsWithHealth;
exports.invalidateIntegrationHealthCache = invalidateIntegrationHealthCache;
var ee_1 = require("@carbon/ee");
var hooks_server_1 = require("@carbon/ee/hooks.server");
var kv_1 = require("@carbon/kv");
var supabase_1 = require("~/utils/supabase");
var INTEGRATION_CACHE_TTL = 3600;
function clearCustomFieldsCache(companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var keys;
        return __generator(this, function (_a) {
            keys = companyId ? "customFields:".concat(companyId, ":*") : "customFields:*";
            kv_1.redis.keys(keys).then(function (keys) {
                var pipeline = kv_1.redis.pipeline();
                keys.forEach(function (key) {
                    pipeline.del(key);
                });
                return pipeline.exec();
            });
            return [2 /*return*/];
        });
    });
}
function clearCompanyIntegrationCache(companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheKey, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheKey = "integrations:".concat(companyId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Clear both old and new key formats
                    return [4 /*yield*/, kv_1.redis.del(cacheKey, "json:".concat(cacheKey))];
                case 2:
                    // Clear both old and new key formats
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Redis cache invalidation error:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function clearAllIntegrationCaches() {
    return __awaiter(this, void 0, void 0, function () {
        var oldPattern, newPattern, _a, oldKeys, newKeys, allKeys, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    oldPattern = "integrations:*";
                    newPattern = "json:integrations:*";
                    return [4 /*yield*/, Promise.all([
                            kv_1.redis.keys(oldPattern),
                            kv_1.redis.keys(newPattern)
                        ])];
                case 1:
                    _a = _b.sent(), oldKeys = _a[0], newKeys = _a[1];
                    allKeys = __spreadArray(__spreadArray([], oldKeys, true), newKeys, true);
                    if (!(allKeys.length > 0)) return [3 /*break*/, 3];
                    console.log("Clearing ".concat(allKeys.length, " integration cache entries"));
                    return [4 /*yield*/, kv_1.redis.del.apply(kv_1.redis, allKeys)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_2 = _b.sent();
                    console.error("Error clearing all integration caches:", error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function deactivateIntegration(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var id, companyId, updatedBy, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = args.id, companyId = args.companyId, updatedBy = args.updatedBy;
                    return [4 /*yield*/, client
                            .from("companyIntegration")
                            .update({
                            active: false,
                            updatedBy: updatedBy,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", id)
                            .eq("companyId", companyId)];
                case 1:
                    result = _a.sent();
                    if (result.error) {
                        return [2 /*return*/, result];
                    }
                    return [4 /*yield*/, clearCompanyIntegrationCache(companyId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function deleteCustomField(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                clearCustomFieldsCache(companyId);
            }
            finally {
                return [2 /*return*/, client.from("customField").delete().eq("id", id)];
            }
            return [2 /*return*/];
        });
    });
}
function getCompanyIntegrations(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheKey, cached, parseError_1, parseError_2, error_3, deleteError_1, _a, data, error, integrations, serializedData, error_4;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cacheKey = "integrations:".concat(companyId);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 17, , 22]);
                    return [4 /*yield*/, kv_1.redis.get("json:".concat(cacheKey))];
                case 2:
                    cached = _c.sent();
                    if (!(cached && typeof cached === "string")) return [3 /*break*/, 6];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 4, , 6]);
                    return [2 /*return*/, JSON.parse(cached)];
                case 4:
                    parseError_1 = _c.sent();
                    console.error("JSON parse error for prefixed cache key json:".concat(cacheKey, ":"), parseError_1);
                    return [4 /*yield*/, kv_1.redis.del("json:".concat(cacheKey))];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, kv_1.redis.get(cacheKey)];
                case 7:
                    // Fallback to old key format for backwards compatibility
                    cached = _c.sent();
                    if (!(cached !== null && cached !== undefined)) return [3 /*break*/, 16];
                    // Log the type and content for debugging
                    console.log("Cache hit for ".concat(cacheKey, ":"), {
                        type: typeof cached,
                        isArray: Array.isArray(cached),
                        value: cached,
                        constructor: (_b = cached === null || cached === void 0 ? void 0 : cached.constructor) === null || _b === void 0 ? void 0 : _b.name
                    });
                    if (!Array.isArray(cached)) return [3 /*break*/, 8];
                    // Direct array return from Upstash
                    return [2 /*return*/, cached];
                case 8:
                    if (!(typeof cached === "object" && cached !== null)) return [3 /*break*/, 9];
                    // Object return from Upstash - could be a parsed JSON already
                    return [2 /*return*/, cached];
                case 9:
                    if (!(typeof cached === "string")) return [3 /*break*/, 14];
                    _c.label = 10;
                case 10:
                    _c.trys.push([10, 11, , 13]);
                    return [2 /*return*/, JSON.parse(cached)];
                case 11:
                    parseError_2 = _c.sent();
                    console.error("JSON parse error for cache key ".concat(cacheKey, ":"), parseError_2);
                    console.error("Cached value that failed to parse:", cached);
                    return [4 /*yield*/, kv_1.redis.del(cacheKey)];
                case 12:
                    _c.sent();
                    return [3 /*break*/, 13];
                case 13: return [3 /*break*/, 16];
                case 14:
                    console.warn("Unexpected cache format for key ".concat(cacheKey, ":"), typeof cached, cached);
                    return [4 /*yield*/, kv_1.redis.del(cacheKey)];
                case 15:
                    _c.sent();
                    _c.label = 16;
                case 16: return [3 /*break*/, 22];
                case 17:
                    error_3 = _c.sent();
                    console.error("Redis cache read error:", error_3);
                    _c.label = 18;
                case 18:
                    _c.trys.push([18, 20, , 21]);
                    return [4 /*yield*/, kv_1.redis.del(cacheKey)];
                case 19:
                    _c.sent();
                    return [3 /*break*/, 21];
                case 20:
                    deleteError_1 = _c.sent();
                    console.error("Failed to delete corrupted cache entry:", deleteError_1);
                    return [3 /*break*/, 21];
                case 21: return [3 /*break*/, 22];
                case 22: return [4 /*yield*/, client
                        .from("companyIntegration")
                        .select("*")
                        .eq("companyId", companyId)];
                case 23:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        throw error;
                    }
                    integrations = data || [];
                    _c.label = 24;
                case 24:
                    _c.trys.push([24, 28, , 29]);
                    serializedData = JSON.stringify(integrations);
                    if (!(typeof serializedData === "string" && serializedData.length > 0)) return [3 /*break*/, 26];
                    // Use a prefixed key to ensure we know this is a JSON string
                    return [4 /*yield*/, kv_1.redis.setex("json:".concat(cacheKey), INTEGRATION_CACHE_TTL, serializedData)];
                case 25:
                    // Use a prefixed key to ensure we know this is a JSON string
                    _c.sent();
                    return [3 /*break*/, 27];
                case 26:
                    console.error("Failed to serialize integrations data for cache");
                    _c.label = 27;
                case 27: return [3 /*break*/, 29];
                case 28:
                    error_4 = _c.sent();
                    console.error("Redis cache write error:", error_4);
                    return [3 /*break*/, 29];
                case 29: return [2 /*return*/, integrations];
            }
        });
    });
}
function hasIntegration(client, companyId, integrationId) {
    return __awaiter(this, void 0, void 0, function () {
        var integrations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCompanyIntegrations(client, companyId)];
                case 1:
                    integrations = _a.sent();
                    return [2 /*return*/, integrations.some(function (i) { return i.id === integrationId && i.active === true; })];
            }
        });
    });
}
function getCompanyIntegration(client, companyId, integrationId) {
    return __awaiter(this, void 0, void 0, function () {
        var integrations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCompanyIntegrations(client, companyId)];
                case 1:
                    integrations = _a.sent();
                    return [2 /*return*/, (integrations.find(function (i) { return i.id === integrationId && i.active === true; }) ||
                            null)];
            }
        });
    });
}
function getSlackIntegration(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var integration, metadata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCompanyIntegration(client, companyId, "slack")];
                case 1:
                    integration = _a.sent();
                    if (!(integration === null || integration === void 0 ? void 0 : integration.metadata)) {
                        return [2 /*return*/, null];
                    }
                    metadata = integration.metadata;
                    if (!metadata.access_token) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, {
                            token: metadata.access_token,
                            channelId: metadata.channel_id || metadata.default_channel_id
                        }];
            }
        });
    });
}
function hasSlackIntegration(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, hasIntegration(client, companyId, "slack")];
        });
    });
}
function upsertCompanyIntegration(client, update) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("companyIntegration")
                        .upsert([update], {
                        onConflict: "id,companyId"
                    })
                        .select()
                        .single()];
                case 1:
                    result = _a.sent();
                    if (result.error) {
                        return [2 /*return*/, result];
                    }
                    return [4 /*yield*/, clearCompanyIntegrationCache(update.companyId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function upsertCustomField(client, customField) {
    return __awaiter(this, void 0, void 0, function () {
        var sortOrders, maxSortOrder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 1, 4]);
                    clearCustomFieldsCache();
                    return [3 /*break*/, 4];
                case 1:
                    if (!("createdBy" in customField)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("customField")
                            .select("sortOrder")
                            .eq("table", customField.table)];
                case 2:
                    sortOrders = _a.sent();
                    if (sortOrders.error)
                        return [2 /*return*/, sortOrders];
                    maxSortOrder = sortOrders.data.reduce(function (max, item) {
                        return Math.max(max, item.sortOrder);
                    }, 0);
                    return [2 /*return*/, client
                            .from("customField")
                            .insert([__assign(__assign({}, customField), { sortOrder: maxSortOrder + 1 })])];
                case 3: return [2 /*return*/, client
                        .from("customField")
                        .update((0, supabase_1.sanitize)(__assign(__assign({}, customField), { updatedBy: customField.updatedBy })))
                        .eq("id", customField.id)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updateCustomFieldsSortOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            try {
                clearCustomFieldsCache();
            }
            finally {
                updatePromises = updates.map(function (_a) {
                    var id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                    return client.from("customField").update({ sortOrder: sortOrder, updatedBy: updatedBy }).eq("id", id);
                });
                return [2 /*return*/, Promise.all(updatePromises)];
            }
            return [2 /*return*/];
        });
    });
}
function getIntegrationHealth(companyId, integration) {
    return __awaiter(this, void 0, void 0, function () {
        var serverHooks, config, healthcheck, key, cached, status;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!integration.active) {
                        return [2 /*return*/, __assign(__assign({}, integration), { health: "inactive" })];
                    }
                    serverHooks = (0, hooks_server_1.getIntegrationServerHooks)(integration.id);
                    config = (0, ee_1.getIntegrationConfigById)(integration.id);
                    healthcheck = (_a = serverHooks === null || serverHooks === void 0 ? void 0 : serverHooks.onHealthcheck) !== null && _a !== void 0 ? _a : config === null || config === void 0 ? void 0 : config.onHealthcheck;
                    if (!healthcheck) {
                        return [2 /*return*/, __assign(__assign({}, integration), { health: "healthy" })];
                    }
                    key = "integrations:".concat(companyId, ":").concat(integration.id, ":health");
                    return [4 /*yield*/, kv_1.redis.get(key)];
                case 1:
                    cached = _b.sent();
                    // Only cache healthy status
                    if (cached === "1") {
                        return [2 /*return*/, __assign(__assign({}, integration), { health: "healthy" })];
                    }
                    return [4 /*yield*/, healthcheck(companyId, integration.metadata)];
                case 2:
                    status = _b.sent();
                    return [4 /*yield*/, kv_1.redis.set(key, status ? "1" : "0", "EX", INTEGRATION_CACHE_TTL * 5)];
                case 3:
                    _b.sent(); // Cache for 5 minutes
                    return [2 /*return*/, __assign(__assign({}, integration), { health: status ? "healthy" : "unhealthy" })];
            }
        });
    });
}
function getIntegrationsWithHealth(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var results, integrations, withHealth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("integrations")
                        .select("*")
                        .eq("companyId", companyId)];
                case 1:
                    results = _a.sent();
                    if (results.error)
                        return [2 /*return*/, results];
                    integrations = results.data;
                    return [4 /*yield*/, Promise.all(integrations.map(function (i) { return getIntegrationHealth(companyId, i); }))];
                case 2:
                    withHealth = _a.sent();
                    return [2 /*return*/, {
                            data: withHealth,
                            error: null
                        }];
            }
        });
    });
}
function invalidateIntegrationHealthCache(integrationId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = "integrations:".concat(companyId, ":").concat(integrationId, ":health");
                    return [4 /*yield*/, kv_1.redis.del(key)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
