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
exports.loader = loader;
exports.action = action;
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var form_1 = require("@carbon/form");
var crypto_1 = require("crypto");
var zod_1 = require("zod");
var corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var request = _b.request;
        return __generator(this, function (_c) {
            if (request.method === "OPTIONS") {
                return [2 /*return*/, new Response(null, { status: 204, headers: corsHeaders })];
            }
            return [2 /*return*/, new Response(JSON.stringify({
                    error: "method_not_allowed",
                    error_description: "Use POST"
                }), { status: 405, headers: corsHeaders })];
        });
    });
}
var oauthTokenValidator = zod_1.z.object({
    grant_type: zod_1.z.enum(["authorization_code", "refresh_token"]),
    client_id: zod_1.z.string(),
    client_secret: zod_1.z.string().optional(),
    code: zod_1.z.string().optional(),
    redirect_uri: zod_1.z.string().url().optional(),
    refresh_token: zod_1.z.string().optional(),
    code_verifier: zod_1.z.string().optional()
});
function verifyCodeChallenge(codeVerifier, codeChallenge, method) {
    if (method !== "S256")
        return false;
    var hash = (0, crypto_1.createHash)("sha256").update(codeVerifier).digest();
    var base64url = hash
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    return base64url === codeChallenge;
}
function jsonResponse(body, status) {
    if (status === void 0) { status = 200; }
    return new Response(JSON.stringify(body), {
        status: status,
        headers: corsHeaders
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, validation, _c, _d, _e, grant_type, client_id, client_secret, code, redirect_uri, refresh_token, code_verifier, oauthClientResult, oauthClient, oauthCode, codeData, method, rawAccessToken, rawRefreshToken, tokenInsert, tokenResult, tokenResult, refreshTokenData, rawNewAccessToken, updateResult;
        var request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    client = (0, client_server_1.getCarbonServiceRole)();
                    _d = (_c = (0, form_1.validator)(oauthTokenValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 1: return [4 /*yield*/, _d.apply(_c, [_f.sent()])];
                case 2:
                    validation = _f.sent();
                    if (validation.error) {
                        return [2 /*return*/, jsonResponse({
                                error: "invalid_request",
                                error_description: "Invalid request parameters"
                            }, 400)];
                    }
                    _e = validation.data, grant_type = _e.grant_type, client_id = _e.client_id, client_secret = _e.client_secret, code = _e.code, redirect_uri = _e.redirect_uri, refresh_token = _e.refresh_token, code_verifier = _e.code_verifier;
                    return [4 /*yield*/, client
                            .from("oauthClient")
                            .select("*")
                            .eq("clientId", client_id)
                            .single()];
                case 3:
                    oauthClientResult = _f.sent();
                    if (!oauthClientResult.data) {
                        return [2 /*return*/, jsonResponse({ error: "invalid_client", error_description: "Unknown client" }, 401)];
                    }
                    oauthClient = oauthClientResult.data;
                    if (oauthClient.tokenEndpointAuthMethod !== "none") {
                        if (!client_secret ||
                            oauthClient.clientSecret !== (0, auth_server_1.hashOAuthSecret)(client_secret)) {
                            return [2 /*return*/, jsonResponse({
                                    error: "invalid_client",
                                    error_description: "Invalid client credentials"
                                }, 401)];
                        }
                    }
                    if (!(grant_type === "authorization_code")) return [3 /*break*/, 6];
                    if (!code || !redirect_uri) {
                        return [2 /*return*/, jsonResponse({
                                error: "invalid_request",
                                error_description: "Missing code or redirect_uri"
                            }, 400)];
                    }
                    return [4 /*yield*/, client
                            .from("oauthCode")
                            .delete()
                            .eq("code", code)
                            .select("*")
                            .single()];
                case 4:
                    oauthCode = _f.sent();
                    if (!oauthCode.data) {
                        return [2 /*return*/, jsonResponse({
                                error: "invalid_grant",
                                error_description: "Invalid authorization code"
                            }, 400)];
                    }
                    codeData = oauthCode.data;
                    if (codeData.clientId !== client_id) {
                        return [2 /*return*/, jsonResponse({
                                error: "invalid_grant",
                                error_description: "Code was not issued to this client"
                            }, 400)];
                    }
                    if (codeData.redirectUri !== redirect_uri) {
                        return [2 /*return*/, jsonResponse({ error: "invalid_grant", error_description: "Redirect URI mismatch" }, 400)];
                    }
                    if (new Date(codeData.expiresAt) < new Date()) {
                        return [2 /*return*/, jsonResponse({
                                error: "invalid_grant",
                                error_description: "Authorization code has expired"
                            }, 400)];
                    }
                    // Verify PKCE if code_challenge was stored
                    if (codeData.codeChallenge) {
                        if (!code_verifier) {
                            return [2 /*return*/, jsonResponse({
                                    error: "invalid_grant",
                                    error_description: "PKCE code_verifier required"
                                }, 400)];
                        }
                        method = codeData.codeChallengeMethod || "S256";
                        if (!verifyCodeChallenge(code_verifier, codeData.codeChallenge, method)) {
                            return [2 /*return*/, jsonResponse({
                                    error: "invalid_grant",
                                    error_description: "PKCE verification failed"
                                }, 400)];
                        }
                    }
                    rawAccessToken = crypto.randomUUID();
                    rawRefreshToken = crypto.randomUUID();
                    tokenInsert = {
                        accessToken: (0, auth_server_1.hashOAuthSecret)(rawAccessToken),
                        refreshToken: (0, auth_server_1.hashOAuthSecret)(rawRefreshToken),
                        clientId: client_id,
                        userId: codeData.userId,
                        companyId: codeData.companyId,
                        createdAt: new Date().toISOString(),
                        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
                    };
                    return [4 /*yield*/, client.from("oauthToken").insert([tokenInsert])];
                case 5:
                    tokenResult = _f.sent();
                    if (tokenResult.error) {
                        return [2 /*return*/, jsonResponse({ error: "server_error", error_description: "Failed to create token" }, 500)];
                    }
                    return [2 /*return*/, jsonResponse({
                            access_token: rawAccessToken,
                            token_type: "Bearer",
                            expires_in: 3600,
                            refresh_token: rawRefreshToken,
                            scope: codeData.scope || undefined
                        })];
                case 6:
                    if (!(grant_type === "refresh_token")) return [3 /*break*/, 9];
                    if (!refresh_token) {
                        return [2 /*return*/, jsonResponse({
                                error: "invalid_request",
                                error_description: "Missing refresh_token"
                            }, 400)];
                    }
                    return [4 /*yield*/, client
                            .from("oauthToken")
                            .select("*")
                            .eq("refreshToken", (0, auth_server_1.hashOAuthSecret)(refresh_token))
                            .single()];
                case 7:
                    tokenResult = _f.sent();
                    if (!tokenResult.data) {
                        return [2 /*return*/, jsonResponse({ error: "invalid_grant", error_description: "Invalid refresh token" }, 400)];
                    }
                    refreshTokenData = tokenResult.data;
                    if (refreshTokenData.clientId !== client_id) {
                        return [2 /*return*/, jsonResponse({
                                error: "invalid_grant",
                                error_description: "Refresh token was not issued to this client"
                            }, 400)];
                    }
                    rawNewAccessToken = crypto.randomUUID();
                    return [4 /*yield*/, client
                            .from("oauthToken")
                            .update({
                            accessToken: (0, auth_server_1.hashOAuthSecret)(rawNewAccessToken),
                            expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
                        })
                            .eq("refreshToken", (0, auth_server_1.hashOAuthSecret)(refresh_token))];
                case 8:
                    updateResult = _f.sent();
                    if (updateResult.error) {
                        return [2 /*return*/, jsonResponse({ error: "server_error", error_description: "Failed to refresh token" }, 500)];
                    }
                    return [2 /*return*/, jsonResponse({
                            access_token: rawNewAccessToken,
                            token_type: "Bearer",
                            expires_in: 3600,
                            scope: refreshTokenData.scope || undefined
                        })];
                case 9: return [2 /*return*/, jsonResponse({
                        error: "unsupported_grant_type",
                        error_description: "Unsupported grant type"
                    }, 400)];
            }
        });
    });
}
