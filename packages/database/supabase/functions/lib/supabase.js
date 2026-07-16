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
exports.getSupabaseServiceRole = exports.getSupabase = exports.getAuthFromAPIKey = void 0;
exports.requirePermissions = requirePermissions;
var supabase_js_1 = require("@supabase/supabase-js");
var node_crypto_1 = require("node:crypto");
var ratelimit_ts_1 = require("./ratelimit.ts");
/** Hash an API key using SHA-256 for secure lookup */
function hashApiKey(rawKey) {
    return (0, node_crypto_1.createHash)("sha256").update(rawKey).digest("hex");
}
/** PostgREST may reject opaque `sb_secret_*` env keys; use caller JWT when env is not JWT-shaped. */
function postgrestServiceKey(authorizationHeader) {
    var _a, _b;
    var envKey = ((_a = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) !== null && _a !== void 0 ? _a : "").trim();
    if (envKey.split(".").length === 3)
        return envKey;
    var token = (_b = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.replace(/^Bearer\s+/i, "").trim()) !== null && _b !== void 0 ? _b : "";
    var parts = token.split(".");
    if (parts.length === 3) {
        try {
            var p = JSON.parse(atob(parts[1]));
            if (p.role === "service_role")
                return token;
        }
        catch (_c) {
            /* ignore */
        }
    }
    return envKey;
}
function isTrustedBearer(authorizationHeader) {
    var _a, _b;
    var envKey = ((_a = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) !== null && _a !== void 0 ? _a : "").trim();
    var token = (_b = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.replace(/^Bearer\s+/i, "").trim()) !== null && _b !== void 0 ? _b : "";
    if (!token)
        return false;
    if (token === envKey)
        return true;
    var parts = token.split(".");
    if (parts.length !== 3)
        return false;
    try {
        var role = JSON.parse(atob(parts[1])).role;
        return role === "service_role";
    }
    catch (_c) {
        return false;
    }
}
var getAuthFromAPIKey = function (apiKey) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceRole, keyHash, apiKeyRow, row;
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                serviceRole = (0, supabase_js_1.createClient)((_a = Deno.env.get("SUPABASE_URL")) !== null && _a !== void 0 ? _a : "", (_b = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) !== null && _b !== void 0 ? _b : "", {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false,
                    },
                });
                keyHash = hashApiKey(apiKey);
                return [4 /*yield*/, serviceRole
                        .from("apiKey")
                        .select("id, companyId, createdBy, scopes, rateLimit, rateLimitWindow, expiresAt")
                        .eq("keyHash", keyHash)
                        .single()];
            case 1:
                apiKeyRow = _h.sent();
                if (apiKeyRow.error)
                    return [2 /*return*/, null];
                row = apiKeyRow.data;
                // Check expiration
                if (row.expiresAt && new Date(row.expiresAt) < new Date()) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, {
                        client: (0, supabase_js_1.createClient)((_c = Deno.env.get("SUPABASE_URL")) !== null && _c !== void 0 ? _c : "", (_d = Deno.env.get("SUPABASE_ANON_KEY")) !== null && _d !== void 0 ? _d : "", {
                            global: {
                                headers: {
                                    "carbon-key": apiKey,
                                },
                            },
                        }),
                        companyId: row.companyId,
                        userId: row.createdBy,
                        apiKeyId: row.id,
                        scopes: (_e = row.scopes) !== null && _e !== void 0 ? _e : {},
                        rateLimit: (_f = row.rateLimit) !== null && _f !== void 0 ? _f : 60,
                        rateLimitWindow: (_g = row.rateLimitWindow) !== null && _g !== void 0 ? _g : "1m",
                    }];
        }
    });
}); };
exports.getAuthFromAPIKey = getAuthFromAPIKey;
var getSupabase = function (authorizationHeader) {
    var _a, _b;
    if (!authorizationHeader)
        throw new Error("Authorization header is required");
    return (0, supabase_js_1.createClient)((_a = Deno.env.get("SUPABASE_URL")) !== null && _a !== void 0 ? _a : "", (_b = Deno.env.get("SUPABASE_ANON_KEY")) !== null && _b !== void 0 ? _b : "", {
        global: {
            headers: { Authorization: authorizationHeader },
        },
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};
exports.getSupabase = getSupabase;
var getSupabaseServiceRole = function (authorizationHeader, apiKeyHeader, companyId) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceRole, keyHash, _a, data, error, row, rl;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!authorizationHeader && !apiKeyHeader) {
                    throw new Error("Authorization header or API key header is required");
                }
                serviceRole = (0, supabase_js_1.createClient)((_b = Deno.env.get("SUPABASE_URL")) !== null && _b !== void 0 ? _b : "", postgrestServiceKey(authorizationHeader), {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false,
                    },
                });
                if (!(apiKeyHeader && companyId)) return [3 /*break*/, 3];
                keyHash = hashApiKey(apiKeyHeader);
                return [4 /*yield*/, serviceRole
                        .from("apiKey")
                        .select("id, companyId, rateLimit, rateLimitWindow, expiresAt")
                        .eq("keyHash", keyHash)
                        .eq("companyId", companyId)
                        .single()];
            case 1:
                _a = _e.sent(), data = _a.data, error = _a.error;
                if (error) {
                    throw new Error("Failed to get API key");
                }
                if (!data) {
                    throw new Error("API key not found");
                }
                row = data;
                // Check expiration
                if (row.expiresAt && new Date(row.expiresAt) < new Date()) {
                    throw new Error("API key has expired");
                }
                return [4 /*yield*/, (0, ratelimit_ts_1.checkApiKeyRateLimit)(serviceRole, row.id, (_c = row.rateLimit) !== null && _c !== void 0 ? _c : 60, (_d = row.rateLimitWindow) !== null && _d !== void 0 ? _d : "1m")];
            case 2:
                rl = _e.sent();
                if (!rl.success) {
                    throw new Error("Rate limit exceeded");
                }
                return [2 /*return*/, serviceRole];
            case 3:
                if (authorizationHeader) {
                    if (!isTrustedBearer(authorizationHeader)) {
                        throw new Error("Valid authorization is required");
                    }
                    return [2 /*return*/, serviceRole];
                }
                throw new Error("Authorization header or API key header is required");
        }
    });
}); };
exports.getSupabaseServiceRole = getSupabaseServiceRole;
function parseClaimsPermissions(claims) {
    var permissions = {};
    var role = null;
    for (var _i = 0, _a = Object.entries(claims); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (key === "role") {
            role = value;
            continue;
        }
        var parts = key.split("_");
        if (parts.length !== 2)
            continue;
        var mod = parts[0], action = parts[1];
        if (!["view", "create", "update", "delete"].includes(action) ||
            !Array.isArray(value))
            continue;
        if (!(mod in permissions)) {
            permissions[mod] = { view: [], create: [], update: [], delete: [] };
        }
        permissions[mod][action] = value;
    }
    return { permissions: permissions, role: role };
}
function checkPermissions(claims, companyId, required) {
    var _a;
    for (var _i = 0, _b = Object.entries(required); _i < _b.length; _i++) {
        var _c = _b[_i], action = _c[0], modules = _c[1];
        var moduleList = typeof modules === "string" ? [modules] : modules;
        for (var _d = 0, moduleList_1 = moduleList; _d < moduleList_1.length; _d++) {
            var mod = moduleList_1[_d];
            var perm = (_a = claims[mod]) === null || _a === void 0 ? void 0 : _a[action];
            if (!perm || !perm.includes(companyId)) {
                return false;
            }
        }
    }
    return true;
}
function requirePermissions(req, companyId, userId, permissions) {
    return __awaiter(this, void 0, void 0, function () {
        var authorizationHeader, apiKeyHeader, serviceRole, keyHash, _a, data, error, row, rl, scopes, _i, _b, _c, action, modules, moduleList, _d, moduleList_2, mod, scopeKey, token, parts, role, claimsResult, parsed;
        var _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    authorizationHeader = req.headers.get("Authorization");
                    apiKeyHeader = req.headers.get("carbon-key");
                    serviceRole = (0, supabase_js_1.createClient)((_e = Deno.env.get("SUPABASE_URL")) !== null && _e !== void 0 ? _e : "", postgrestServiceKey(authorizationHeader), {
                        auth: {
                            autoRefreshToken: false,
                            persistSession: false,
                        },
                    });
                    if (!(apiKeyHeader && companyId)) return [3 /*break*/, 3];
                    keyHash = hashApiKey(apiKeyHeader);
                    return [4 /*yield*/, serviceRole
                            .from("apiKey")
                            .select("id, companyId, scopes, rateLimit, rateLimitWindow, expiresAt")
                            .eq("keyHash", keyHash)
                            .eq("companyId", companyId)
                            .single()];
                case 1:
                    _a = _k.sent(), data = _a.data, error = _a.error;
                    if (error || !data) {
                        throw new Error("API key not found");
                    }
                    row = data;
                    if (row.expiresAt && new Date(row.expiresAt) < new Date()) {
                        throw new Error("API key has expired");
                    }
                    return [4 /*yield*/, (0, ratelimit_ts_1.checkApiKeyRateLimit)(serviceRole, row.id, (_f = row.rateLimit) !== null && _f !== void 0 ? _f : 60, (_g = row.rateLimitWindow) !== null && _g !== void 0 ? _g : "1m")];
                case 2:
                    rl = _k.sent();
                    if (!rl.success) {
                        throw new Error("Rate limit exceeded");
                    }
                    scopes = (_h = row.scopes) !== null && _h !== void 0 ? _h : {};
                    for (_i = 0, _b = Object.entries(permissions); _i < _b.length; _i++) {
                        _c = _b[_i], action = _c[0], modules = _c[1];
                        moduleList = typeof modules === "string" ? [modules] : modules;
                        for (_d = 0, moduleList_2 = moduleList; _d < moduleList_2.length; _d++) {
                            mod = moduleList_2[_d];
                            scopeKey = "".concat(mod, "_").concat(action);
                            if (!(scopeKey in scopes) || !((_j = scopes[scopeKey]) === null || _j === void 0 ? void 0 : _j.includes(companyId))) {
                                throw new Error("API key lacks required permissions");
                            }
                        }
                    }
                    return [2 /*return*/, serviceRole];
                case 3:
                    // JWT path
                    if (!authorizationHeader) {
                        throw new Error("Authorization header or API key header is required");
                    }
                    token = authorizationHeader.replace(/^Bearer\s+/i, "").trim();
                    parts = token.split(".");
                    if (parts.length !== 3) {
                        throw new Error("Invalid authorization token");
                    }
                    try {
                        role = JSON.parse(atob(parts[1])).role;
                    }
                    catch (_l) {
                        throw new Error("Invalid authorization token");
                    }
                    if (role === "service_role") {
                        return [2 /*return*/, serviceRole];
                    }
                    if (!(role === "authenticated")) return [3 /*break*/, 5];
                    return [4 /*yield*/, serviceRole.rpc("get_claims", {
                            uid: userId,
                            company: companyId,
                        })];
                case 4:
                    claimsResult = _k.sent();
                    if (claimsResult.error || !claimsResult.data) {
                        throw new Error("Failed to get user permissions");
                    }
                    parsed = parseClaimsPermissions(claimsResult.data);
                    if (!checkPermissions(parsed.permissions, companyId, permissions)) {
                        throw new Error("Insufficient permissions");
                    }
                    return [2 /*return*/, serviceRole];
                case 5: throw new Error("Valid authorization is required");
            }
        });
    });
}
