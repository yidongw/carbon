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
exports.action = action;
exports.loader = loader;
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var env_1 = require("@carbon/env");
var webStandardStreamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js");
var server_1 = require("./lib/server");
var corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
};
function addCorsHeaders(response) {
    var headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return new Response(response.body, {
        status: response.status,
        headers: headers
    });
}
function authenticateOAuthToken(accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceRole, tokenResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("oauthToken")
                            .select("userId, companyId, expiresAt")
                            .eq("accessToken", (0, auth_server_1.hashOAuthSecret)(accessToken))
                            .single()];
                case 1:
                    tokenResult = _a.sent();
                    if (!tokenResult.data)
                        return [2 /*return*/, null];
                    if (new Date(tokenResult.data.expiresAt) < new Date())
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            userId: tokenResult.data.userId,
                            companyId: tokenResult.data.companyId
                        }];
            }
        });
    });
}
function make401Response(request) {
    var origin = (0, env_1.getAppUrl)() || new URL(request.url).origin;
    return new Response(null, {
        status: 401,
        headers: __assign({ "WWW-Authenticate": "Bearer resource_metadata=\"".concat(origin, "/.well-known/oauth-protected-resource\"") }, corsHeaders)
    });
}
function resolveAuth(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, hasCarbonKey, token, oauthAuth, client_1, companyResult, headers, _a, client, companyId, companyGroupId, userId;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    authHeader = request.headers.get("Authorization");
                    hasCarbonKey = request.headers.has("carbon-key");
                    if (!((authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) && !hasCarbonKey)) return [3 /*break*/, 6];
                    token = authHeader.slice(7);
                    if (!!token.startsWith("crbn_")) return [3 /*break*/, 5];
                    return [4 /*yield*/, authenticateOAuthToken(token)];
                case 1:
                    oauthAuth = _d.sent();
                    if (!oauthAuth) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, client_server_1.getUserScopedClient)(oauthAuth.userId)];
                case 2:
                    client_1 = _d.sent();
                    return [4 /*yield*/, client_1
                            .from("company")
                            .select("companyGroupId")
                            .eq("id", oauthAuth.companyId)
                            .single()];
                case 3:
                    companyResult = _d.sent();
                    return [2 /*return*/, {
                            ctx: {
                                client: client_1,
                                companyId: oauthAuth.companyId,
                                companyGroupId: (_c = (_b = companyResult.data) === null || _b === void 0 ? void 0 : _b.companyGroupId) !== null && _c !== void 0 ? _c : oauthAuth.companyId,
                                userId: oauthAuth.userId
                            },
                            request: request
                        }];
                case 4: throw make401Response(request);
                case 5:
                    headers = new Headers(request.headers);
                    headers.set("carbon-key", token);
                    request = new Request(request, { headers: headers });
                    _d.label = 6;
                case 6:
                    // No Authorization header at all — return 401 for OAuth discovery
                    if (!authHeader && !hasCarbonKey) {
                        throw make401Response(request);
                    }
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 7:
                    _a = _d.sent(), client = _a.client, companyId = _a.companyId, companyGroupId = _a.companyGroupId, userId = _a.userId;
                    return [2 /*return*/, {
                            ctx: { client: client, companyId: companyId, companyGroupId: companyGroupId, userId: userId },
                            request: request
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, ctx, authedRequest, server, transport, response;
        var request = _b.request;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, resolveAuth(request)];
                case 1:
                    _c = _d.sent(), ctx = _c.ctx, authedRequest = _c.request;
                    server = (0, server_1.createMcpServer)(ctx);
                    transport = new webStandardStreamableHttp_js_1.WebStandardStreamableHTTPServerTransport({
                        sessionIdGenerator: undefined,
                        enableJsonResponse: true
                    });
                    return [4 /*yield*/, server.connect(transport)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, transport.handleRequest(authedRequest)];
                case 3:
                    response = _d.sent();
                    return [2 /*return*/, addCorsHeaders(response)];
            }
        });
    });
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var request = _b.request;
        return __generator(this, function (_c) {
            if (request.method === "OPTIONS") {
                return [2 /*return*/, new Response(null, { status: 204, headers: corsHeaders })];
            }
            return [2 /*return*/, new Response(JSON.stringify({
                    jsonrpc: "2.0",
                    error: { code: -32000, message: "Method not allowed. Use POST." },
                    id: null
                }), {
                    status: 405,
                    headers: corsHeaders
                })];
        });
    });
}
