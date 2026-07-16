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
exports.createEmailAuthAccount = createEmailAuthAccount;
exports.deleteAuthAccount = deleteAuthAccount;
exports.getAuthAccountByAccessToken = getAuthAccountByAccessToken;
exports.hashApiKey = hashApiKey;
exports.hashOAuthSecret = hashOAuthSecret;
exports.makeAuthSession = makeAuthSession;
exports.makeAuthSessionFromTokens = makeAuthSessionFromTokens;
exports.requirePermissions = requirePermissions;
exports.resetPassword = resetPassword;
exports.sendInviteByEmail = sendInviteByEmail;
exports.sendMagicLink = sendMagicLink;
exports.exchangePkceCode = exchangePkceCode;
exports.signInWithEmailViaAdmin = signInWithEmailViaAdmin;
exports.signInWithUserIdViaAdmin = signInWithUserIdViaAdmin;
exports.signInWithBypassEmail = signInWithBypassEmail;
exports.signInWithEmail = signInWithEmail;
exports.refreshAccessToken = refreshAccessToken;
exports.verifyAuthSession = verifyAuthSession;
exports.signInWithPasskey = signInWithPasskey;
var ratelimit_1 = require("@carbon/database/ratelimit");
var utils_1 = require("@carbon/utils");
var supabase_js_1 = require("@supabase/supabase-js");
var crypto_1 = require("crypto");
var react_router_1 = require("react-router");
var env_1 = require("../config/env");
var supabase_1 = require("../lib/supabase");
var client_1 = require("../lib/supabase/client");
var client_server_1 = require("../lib/supabase/client.server");
var path_1 = require("../utils/path");
var result_1 = require("../utils/result");
var identity_server_1 = require("./identity.server");
var session_server_1 = require("./session.server");
var users_1 = require("./users");
var users_server_1 = require("./users.server");
function createEmailAuthAccount(email, password, meta) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)().auth.admin.createUser({
                        email: email,
                        password: password,
                        email_confirm: true,
                        app_metadata: __assign({}, meta)
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (!data.user || error)
                        return [2 /*return*/, null];
                    return [2 /*return*/, data.user];
            }
        });
    });
}
function deleteAuthAccount(client, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, supabaseDelete, carbonDelete;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client.auth.admin.deleteUser(userId),
                        client.from("user").delete().eq("id", userId)
                    ])];
                case 1:
                    _a = _b.sent(), supabaseDelete = _a[0], carbonDelete = _a[1];
                    if (supabaseDelete.error || carbonDelete.error)
                        return [2 /*return*/, null];
                    return [2 /*return*/, true];
            }
        });
    });
}
function getAuthAccountByAccessToken(accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)().auth.getUser(accessToken)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (!data.user || error)
                        return [2 /*return*/, null];
                    return [2 /*return*/, data.user];
            }
        });
    });
}
/** Hash an API key using SHA-256 for secure storage/lookup */
function hashApiKey(rawKey) {
    return (0, crypto_1.createHash)("sha256").update(rawKey).digest("hex");
}
/** Hash an OAuth token or secret using SHA-256 for secure storage/lookup */
function hashOAuthSecret(raw) {
    return (0, crypto_1.createHash)("sha256").update(raw).digest("hex");
}
function getCompanyIdFromAPIKey(apiKey) {
    var serviceRole = (0, client_server_1.getCarbonServiceRole)();
    var keyHash = hashApiKey(apiKey);
    return serviceRole
        .from("apiKey")
        .select("id, companyId, ...company(companyGroupId), createdBy, scopes, rateLimit, rateLimitWindow, expiresAt")
        .eq("keyHash", keyHash)
        .single();
}
function makeAuthSession(supabaseSession, companyId, companyGroupId) {
    var _a, _b, _c;
    if (!supabaseSession)
        return null;
    if (!supabaseSession.refresh_token)
        throw new Error("User should have a refresh token");
    return {
        accessToken: supabaseSession.access_token,
        companyId: companyId,
        companyGroupId: companyGroupId,
        refreshToken: supabaseSession.refresh_token,
        userId: supabaseSession.user.id,
        email: (_a = supabaseSession.user.email) !== null && _a !== void 0 ? _a : null,
        expiresIn: ((_b = supabaseSession.expires_in) !== null && _b !== void 0 ? _b : 3000) - env_1.REFRESH_ACCESS_TOKEN_THRESHOLD,
        expiresAt: (_c = supabaseSession.expires_at) !== null && _c !== void 0 ? _c : -1
    };
}
/** Build an AuthSession directly from raw tokens without a Supabase round-trip.
 *  The caller must have already verified the accessToken (e.g. via getUser). */
function makeAuthSessionFromTokens(accessToken, refreshToken, user, companyId, companyGroupId) {
    var _a, _b, _c;
    var expiresAt = -1;
    try {
        var payload = JSON.parse(Buffer.from((_a = accessToken.split(".")[1]) !== null && _a !== void 0 ? _a : "", "base64url").toString());
        expiresAt = (_b = payload.exp) !== null && _b !== void 0 ? _b : -1;
    }
    catch (_d) { }
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: user.id,
        email: (_c = user.email) !== null && _c !== void 0 ? _c : null,
        companyId: companyId,
        companyGroupId: companyGroupId,
        expiresIn: expiresAt > 0
            ? Math.max(0, expiresAt -
                Math.floor(Date.now() / 1000) -
                env_1.REFRESH_ACCESS_TOKEN_THRESHOLD)
            : 3000 - env_1.REFRESH_ACCESS_TOKEN_THRESHOLD,
        expiresAt: expiresAt
    };
}
/**
 * Determines the effective user based on console mode and pin-in state.
 * If console mode is on and an operator is pinned in, returns
 * the operator's ID. Otherwise returns the session user's ID.
 *
 * Console mode is read from the auth session; pin-in state is
 * still read from the `console-pin-{companyId}` cookie.
 */
function getEffectiveUser(request, companyId, sessionUserId, consoleMode) {
    var _a;
    if (!consoleMode)
        return sessionUserId;
    var cookieHeader = request.headers.get("cookie");
    if (!cookieHeader)
        return sessionUserId;
    // Parse only the pin-in cookie we need
    var cookies = Object.fromEntries(cookieHeader.split(";").map(function (c) {
        var _a = c.trim().split("="), key = _a[0], rest = _a.slice(1);
        return [key, decodeURIComponent(rest.join("="))];
    }));
    var pinRaw = cookies["console-pin-".concat(companyId)];
    if (!pinRaw)
        return sessionUserId;
    try {
        var pinIn = JSON.parse(pinRaw);
        var elapsed = Date.now() - pinIn.pinnedAt;
        if (elapsed > 3600000)
            return sessionUserId;
        return (_a = pinIn.userId) !== null && _a !== void 0 ? _a : sessionUserId;
    }
    catch (_b) {
        return sessionUserId;
    }
}
function requirePermissions(request, requiredPermissions) {
    return __awaiter(this, void 0, void 0, function () {
        var apiKey, company, apiKeyData, companyId_1, companyGroupId_1, userId_1, serviceRole, rl, scopes_1, scopeCheckPassed, isBypass, planData, client, authSession, accessToken, companyId, companyGroupId, userId, email, consoleMode, myClaims, hasRequiredPermissions, _a, _b, _c, _d;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    apiKey = request.headers.get("carbon-key");
                    if (!apiKey) return [3 /*break*/, 5];
                    return [4 /*yield*/, getCompanyIdFromAPIKey(apiKey)];
                case 1:
                    company = _g.sent();
                    if (!company.data) return [3 /*break*/, 5];
                    apiKeyData = company.data;
                    companyId_1 = apiKeyData.companyId;
                    companyGroupId_1 = apiKeyData.companyGroupId;
                    userId_1 = apiKeyData.createdBy;
                    // Check expiration
                    if (apiKeyData.expiresAt && new Date(apiKeyData.expiresAt) < new Date()) {
                        throw new Response("API key has expired", { status: 401 });
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, ratelimit_1.checkApiKeyRateLimit)(serviceRole, apiKeyData.id, apiKeyData.rateLimit, apiKeyData.rateLimitWindow)];
                case 2:
                    rl = _g.sent();
                    if (!rl.success) {
                        throw new Response("Rate limit exceeded", {
                            status: 429,
                            headers: {
                                "Content-Type": "application/json",
                                "X-RateLimit-Limit": rl.limit.toString(),
                                "X-RateLimit-Remaining": rl.remaining.toString(),
                                "X-RateLimit-Reset": rl.resetAt.toString(),
                                "Retry-After": Math.ceil((rl.resetAt - Date.now()) / 1000).toString()
                            }
                        });
                    }
                    // Update lastUsedAt (fire-and-forget)
                    void serviceRole
                        .from("apiKey")
                        .update({ lastUsedAt: new Date().toISOString() })
                        .eq("id", apiKeyData.id);
                    scopes_1 = (_e = apiKeyData.scopes) !== null && _e !== void 0 ? _e : {};
                    scopeCheckPassed = Object.entries(requiredPermissions).every(function (_a) {
                        var _b;
                        var action = _a[0], permission = _a[1];
                        if (action === "bypassRls" || action === "role")
                            return true;
                        if (typeof permission === "string") {
                            var scopeKey = "".concat(permission, "_").concat(action);
                            return scopeKey in scopes_1 && ((_b = scopes_1[scopeKey]) === null || _b === void 0 ? void 0 : _b.includes(companyId_1));
                        }
                        else if (Array.isArray(permission)) {
                            return permission.every(function (p) {
                                var _a;
                                var scopeKey = "".concat(p, "_").concat(action);
                                return (scopeKey in scopes_1 && ((_a = scopes_1[scopeKey]) === null || _a === void 0 ? void 0 : _a.includes(companyId_1)));
                            });
                        }
                        return false;
                    });
                    if (!scopeCheckPassed) {
                        throw new Response("API key lacks required permissions", {
                            status: 403
                        });
                    }
                    if (!(env_1.CarbonEdition === utils_1.Edition.Cloud)) return [3 /*break*/, 4];
                    isBypass = env_1.STRIPE_BYPASS_COMPANY_IDS
                        ? env_1.STRIPE_BYPASS_COMPANY_IDS.split(",")
                            .map(function (id) { return id.trim(); })
                            .includes(companyId_1)
                        : false;
                    if (!!isBypass) return [3 /*break*/, 4];
                    return [4 /*yield*/, serviceRole
                            .from("companyPlan")
                            .select("planId")
                            .eq("id", companyId_1)
                            .single()];
                case 3:
                    planData = (_g.sent()).data;
                    if ((planData === null || planData === void 0 ? void 0 : planData.planId) === utils_1.Plan.Starter) {
                        throw new Response("API access requires the Business plan and above. Please upgrade your plan to use API keys.", { status: 403 });
                    }
                    _g.label = 4;
                case 4:
                    client = (0, client_1.getCarbonAPIKeyClient)(apiKey);
                    return [2 /*return*/, {
                            client: client,
                            companyId: companyId_1,
                            companyGroupId: companyGroupId_1,
                            userId: userId_1,
                            sessionUserId: userId_1,
                            email: "",
                            consoleMode: false
                        }];
                case 5: return [4 /*yield*/, (0, session_server_1.requireAuthSession)(request)];
                case 6:
                    authSession = _g.sent();
                    accessToken = authSession.accessToken, companyId = authSession.companyId, companyGroupId = authSession.companyGroupId, userId = authSession.userId;
                    email = (_f = authSession.email) !== null && _f !== void 0 ? _f : "";
                    consoleMode = authSession.console === companyId;
                    // early exit if no requiredPermissions are required
                    if (Object.keys(requiredPermissions).length === 0) {
                        return [2 /*return*/, {
                                client: (0, supabase_1.getCarbon)(accessToken),
                                companyId: companyId,
                                companyGroupId: companyGroupId,
                                email: email,
                                userId: getEffectiveUser(request, companyId, userId, consoleMode),
                                sessionUserId: userId,
                                consoleMode: consoleMode
                            }];
                    }
                    return [4 /*yield*/, (0, users_server_1.getUserClaims)(userId, companyId)];
                case 7:
                    myClaims = _g.sent();
                    hasRequiredPermissions = Object.entries(requiredPermissions).every(function (_a) {
                        var _b;
                        var action = _a[0], permission = _a[1];
                        if (action === "bypassRls")
                            return true;
                        if (typeof permission === "string") {
                            if (action === "role") {
                                return myClaims.role === permission;
                            }
                            if (!(permission in myClaims.permissions))
                                return false;
                            var permissionForCompany = (_b = myClaims.permissions[permission]) === null || _b === void 0 ? void 0 : _b[action];
                            return ((permissionForCompany === null || permissionForCompany === void 0 ? void 0 : permissionForCompany.includes("0")) || // 0 is the wildcard for all companies
                                (permissionForCompany === null || permissionForCompany === void 0 ? void 0 : permissionForCompany.includes(companyId)) ||
                                false);
                        }
                        else if (Array.isArray(permission)) {
                            return permission.every(function (p) {
                                var _a, _b;
                                var permissionForCompany = (_a = myClaims.permissions[p]) === null || _a === void 0 ? void 0 : _a[action];
                                return (_b = permissionForCompany === null || permissionForCompany === void 0 ? void 0 : permissionForCompany.includes(companyId)) !== null && _b !== void 0 ? _b : false;
                            });
                        }
                        else {
                            return false;
                        }
                    });
                    if (!!hasRequiredPermissions) return [3 /*break*/, 11];
                    if (!(myClaims.role === null)) return [3 /*break*/, 9];
                    _a = react_router_1.redirect;
                    _b = ["/"];
                    return [4 /*yield*/, (0, session_server_1.destroyAuthSession)(request)];
                case 8: throw _a.apply(void 0, _b.concat([_g.sent()]));
                case 9:
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, result_1.error)({ myClaims: myClaims, requiredPermissions: requiredPermissions }, "Access Denied"))];
                case 10: throw _c.apply(void 0, _d.concat([_g.sent()]));
                case 11: return [2 /*return*/, {
                        client: !!requiredPermissions.bypassRls && myClaims.role === "employee"
                            ? (0, client_server_1.getCarbonServiceRole)()
                            : (0, supabase_1.getCarbon)(accessToken),
                        companyId: companyId,
                        companyGroupId: companyGroupId,
                        email: email,
                        userId: getEffectiveUser(request, companyId, userId, consoleMode),
                        sessionUserId: userId,
                        consoleMode: consoleMode
                    }];
            }
        });
    });
}
function resetPassword(accessToken, password) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supabase_1.getCarbon)(accessToken).auth.updateUser({
                        password: password
                    })];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        return [2 /*return*/, null];
                    return [2 /*return*/, true];
            }
        });
    });
}
function sendInviteByEmail(email, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, client_server_1.getCarbonServiceRole)().auth.admin.inviteUserByEmail(email, {
                    redirectTo: "".concat(env_1.VERCEL_URL, "/callback"),
                    data: data
                })];
        });
    });
}
function sendMagicLink(email, redirectTo) {
    return __awaiter(this, void 0, void 0, function () {
        var storage, client, appUrl, callbackUrl, otpError, entry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storage = new Map();
                    client = (0, supabase_js_1.createClient)(env_1.SUPABASE_URL, env_1.SUPABASE_SERVICE_ROLE_KEY, {
                        auth: {
                            flowType: "pkce",
                            autoRefreshToken: false,
                            storage: {
                                getItem: function (key) { var _a; return (_a = storage.get(key)) !== null && _a !== void 0 ? _a : null; },
                                setItem: function (key, value) {
                                    storage.set(key, value);
                                },
                                removeItem: function (key) {
                                    storage.delete(key);
                                }
                            }
                        }
                    });
                    appUrl = (0, env_1.getAppUrl)();
                    callbackUrl = redirectTo
                        ? "".concat(appUrl, "/callback?redirectTo=").concat(encodeURIComponent(redirectTo))
                        : "".concat(appUrl, "/callback");
                    return [4 /*yield*/, client.auth.signInWithOtp({
                            email: email,
                            options: {
                                emailRedirectTo: callbackUrl,
                                data: { app_url: appUrl }
                            }
                        })];
                case 1:
                    otpError = (_a.sent()).error;
                    if (otpError) {
                        return [2 /*return*/, { error: otpError, pkceEntry: null }];
                    }
                    entry = __spreadArray([], storage.entries(), true).find(function (_a) {
                        var k = _a[0];
                        return k.endsWith("-code-verifier");
                    });
                    if (!entry) {
                        return [2 /*return*/, {
                                error: new Error("PKCE code verifier was not generated"),
                                pkceEntry: null
                            }];
                    }
                    return [2 /*return*/, {
                            error: null,
                            pkceEntry: {
                                k: entry[0],
                                v: entry[1],
                                redirectTo: (redirectTo === null || redirectTo === void 0 ? void 0 : redirectTo.startsWith("/")) ? redirectTo : undefined
                            }
                        }];
            }
        });
    });
}
// Exchange a PKCE auth code for a session entirely server-side.
// Pre-seeds the in-memory storage with the code verifier captured during
// sendMagicLink so the Supabase client can complete the PKCE handshake.
function exchangePkceCode(code, pkceEntry, cookieCompanyId) {
    return __awaiter(this, void 0, void 0, function () {
        var storage, client, _a, session, exchangeError, companies, rows, match;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    storage = new Map([[pkceEntry.k, pkceEntry.v]]);
                    client = (0, supabase_js_1.createClient)(env_1.SUPABASE_URL, env_1.SUPABASE_ANON_KEY, {
                        auth: {
                            flowType: "pkce",
                            autoRefreshToken: false,
                            storage: {
                                getItem: function (key) { var _a; return (_a = storage.get(key)) !== null && _a !== void 0 ? _a : null; },
                                setItem: function (key, value) {
                                    storage.set(key, value);
                                },
                                removeItem: function (key) {
                                    storage.delete(key);
                                }
                            }
                        }
                    });
                    return [4 /*yield*/, client.auth.exchangeCodeForSession(code)];
                case 1:
                    _a = _e.sent(), session = _a.data.session, exchangeError = _a.error;
                    if (!session || exchangeError)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()
                            .from("userToCompany")
                            .select("companyId, ...company(companyGroupId)")
                            .eq("userId", session.user.id)
                            .limit(50)];
                case 2:
                    companies = (_e.sent()).data;
                    rows = companies;
                    match = (_b = rows === null || rows === void 0 ? void 0 : rows.find(function (c) { return c.companyId === cookieCompanyId; })) !== null && _b !== void 0 ? _b : rows === null || rows === void 0 ? void 0 : rows[0];
                    return [2 /*return*/, makeAuthSession(session, (_c = match === null || match === void 0 ? void 0 : match.companyId) !== null && _c !== void 0 ? _c : "", (_d = match === null || match === void 0 ? void 0 : match.companyGroupId) !== null && _d !== void 0 ? _d : "")];
            }
        });
    });
}
/**
 * Mint an authenticated session for an existing user without their password, by
 * generating and immediately consuming a magic-link token via the Supabase admin
 * API. Used after an out-of-band check has already proven the user's identity
 * (dev bypass, or a verified email code).
 */
function signInWithEmailViaAdmin(email) {
    return __awaiter(this, void 0, void 0, function () {
        var client, _a, linkData, linkError, _b, _c, sessionData, verifyError, utc, match;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    client = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, client.auth.admin.generateLink({ type: "magiclink", email: email })];
                case 1:
                    _a = _g.sent(), linkData = _a.data, linkError = _a.error;
                    if (linkError || !((_d = linkData === null || linkData === void 0 ? void 0 : linkData.properties) === null || _d === void 0 ? void 0 : _d.hashed_token) || !linkData.user)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, Promise.all([
                            client.auth.verifyOtp({
                                token_hash: linkData.properties.hashed_token,
                                type: "magiclink"
                            }),
                            client
                                .from("userToCompany")
                                .select("companyId, ...company(companyGroupId)")
                                .eq("userId", linkData.user.id)
                                .limit(1)
                                .maybeSingle()
                        ])];
                case 2:
                    _b = _g.sent(), _c = _b[0], sessionData = _c.data, verifyError = _c.error, utc = _b[1].data;
                    if (verifyError || !(sessionData === null || sessionData === void 0 ? void 0 : sessionData.session))
                        return [2 /*return*/, null];
                    match = utc;
                    return [2 /*return*/, makeAuthSession(sessionData.session, (_e = match === null || match === void 0 ? void 0 : match.companyId) !== null && _e !== void 0 ? _e : "", (_f = match === null || match === void 0 ? void 0 : match.companyGroupId) !== null && _f !== void 0 ? _f : "")];
            }
        });
    });
}
/**
 * Mint a session for a user by id, regardless of which method they used to log
 * in (phone, wechat, …). Resolves the auth user's current email — which a linked
 * real email replaces over the synthetic one — and signs in via that.
 */
function signInWithUserIdViaAdmin(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var email;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, identity_server_1.getCanonicalAuthEmail)(userId)];
                case 1:
                    email = _a.sent();
                    if (!email)
                        return [2 /*return*/, null];
                    return [2 /*return*/, signInWithEmailViaAdmin(email)];
            }
        });
    });
}
function signInWithBypassEmail(email) {
    return __awaiter(this, void 0, void 0, function () {
        var authSession;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signInWithEmailViaAdmin(email)];
                case 1:
                    authSession = _a.sent();
                    if (authSession) {
                        authSession.bypass = true;
                    }
                    return [2 /*return*/, authSession];
            }
        });
    });
}
function signInWithEmail(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var client, _a, data, error, utc, match;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    client = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, client.auth.signInWithPassword({
                            email: email,
                            password: password
                        })];
                case 1:
                    _a = _d.sent(), data = _a.data, error = _a.error;
                    if (!data.session || error)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, client
                            .from("userToCompany")
                            .select("companyId, ...company(companyGroupId)")
                            .eq("userId", data.user.id)
                            .limit(1)
                            .maybeSingle()];
                case 2:
                    utc = (_d.sent()).data;
                    match = utc;
                    return [2 /*return*/, makeAuthSession(data.session, (_b = match === null || match === void 0 ? void 0 : match.companyId) !== null && _b !== void 0 ? _b : "", (_c = match === null || match === void 0 ? void 0 : match.companyGroupId) !== null && _c !== void 0 ? _c : "")];
            }
        });
    });
}
function refreshAccessToken(refreshToken, companyId, companyGroupId) {
    return __awaiter(this, void 0, void 0, function () {
        var client, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!refreshToken)
                        return [2 /*return*/, null];
                    client = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, client.auth.refreshSession({
                            refresh_token: refreshToken
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (!data.session || error)
                        return [2 /*return*/, null];
                    return [2 /*return*/, makeAuthSession(data.session, companyId, companyGroupId)];
            }
        });
    });
}
function verifyAuthSession(authSession) {
    return __awaiter(this, void 0, void 0, function () {
        var authAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAuthAccountByAccessToken(authSession.accessToken)];
                case 1:
                    authAccount = _a.sent();
                    return [2 /*return*/, Boolean(authAccount)];
            }
        });
    });
}
function signInWithPasskey(userId, email) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceRole, _a, linkData, linkError, _b, sessionData, sessionError, companies, companyRecord;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole.auth.admin.generateLink({
                            type: "magiclink",
                            email: email,
                            options: { redirectTo: env_1.VERCEL_URL }
                        })];
                case 1:
                    _a = _g.sent(), linkData = _a.data, linkError = _a.error;
                    if (linkError || !((_c = linkData.properties) === null || _c === void 0 ? void 0 : _c.hashed_token))
                        return [2 /*return*/, null];
                    return [4 /*yield*/, serviceRole.auth.verifyOtp({
                            token_hash: linkData.properties.hashed_token,
                            type: "magiclink"
                        })];
                case 2:
                    _b = _g.sent(), sessionData = _b.data, sessionError = _b.error;
                    if (sessionError || !sessionData.session)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, (0, users_1.getCompaniesForUser)(serviceRole, userId)];
                case 3:
                    companies = _g.sent();
                    return [4 /*yield*/, serviceRole
                            .from("company")
                            .select("companyGroupId")
                            .eq("id", (_d = companies === null || companies === void 0 ? void 0 : companies[0]) !== null && _d !== void 0 ? _d : "")
                            .single()];
                case 4:
                    companyRecord = (_g.sent()).data;
                    return [2 /*return*/, makeAuthSession(sessionData.session, (_e = companies === null || companies === void 0 ? void 0 : companies[0]) !== null && _e !== void 0 ? _e : "", (_f = companyRecord === null || companyRecord === void 0 ? void 0 : companyRecord.companyGroupId) !== null && _f !== void 0 ? _f : "")];
            }
        });
    });
}
