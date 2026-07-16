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
var zod_1 = require("zod");
var corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
};
function jsonResponse(body, status) {
    if (status === void 0) { status = 200; }
    return new Response(JSON.stringify(body), {
        status: status,
        headers: corsHeaders
    });
}
var clientRegistrationSchema = zod_1.z.object({
    client_name: zod_1.z.string().min(1),
    redirect_uris: zod_1.z.array(zod_1.z.string().url()).min(1),
    grant_types: zod_1.z
        .array(zod_1.z.string())
        .optional()
        .default(["authorization_code", "refresh_token"]),
    response_types: zod_1.z.array(zod_1.z.string()).optional().default(["code"]),
    token_endpoint_auth_method: zod_1.z
        .enum(["client_secret_post", "client_secret_basic", "none"])
        .optional()
        .default("none"),
    client_uri: zod_1.z.string().url().optional(),
    logo_uri: zod_1.z.string().url().optional(),
    scope: zod_1.z.string().optional()
});
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var request = _b.request;
        return __generator(this, function (_c) {
            if (request.method === "OPTIONS") {
                return [2 /*return*/, new Response(null, { status: 204, headers: corsHeaders })];
            }
            return [2 /*return*/, jsonResponse({ error: "method_not_allowed", error_description: "Use POST" }, 405)];
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, body, _c, validation, _d, client_name, redirect_uris, grant_types, response_types, token_endpoint_auth_method, client_uri, logo_uri, scope, clientId, rawClientSecret, insertResult, response;
        var request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    client = (0, client_server_1.getCarbonServiceRole)();
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, request.json()];
                case 2:
                    body = _e.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _c = _e.sent();
                    return [2 /*return*/, jsonResponse({ error: "invalid_request", error_description: "Invalid JSON body" }, 400)];
                case 4:
                    validation = clientRegistrationSchema.safeParse(body);
                    if (!validation.success) {
                        return [2 /*return*/, jsonResponse({
                                error: "invalid_client_metadata",
                                error_description: validation.error.issues
                                    .map(function (i) { return i.message; })
                                    .join(", ")
                            }, 400)];
                    }
                    _d = validation.data, client_name = _d.client_name, redirect_uris = _d.redirect_uris, grant_types = _d.grant_types, response_types = _d.response_types, token_endpoint_auth_method = _d.token_endpoint_auth_method, client_uri = _d.client_uri, logo_uri = _d.logo_uri, scope = _d.scope;
                    clientId = "mcp_".concat(crypto.randomUUID().replace(/-/g, ""));
                    rawClientSecret = token_endpoint_auth_method !== "none" ? crypto.randomUUID() : null;
                    return [4 /*yield*/, client.from("oauthClient").insert([
                            {
                                clientId: clientId,
                                clientSecret: rawClientSecret ? (0, auth_server_1.hashOAuthSecret)(rawClientSecret) : null,
                                name: client_name,
                                redirectUris: redirect_uris,
                                grantTypes: grant_types,
                                responseTypes: response_types,
                                tokenEndpointAuthMethod: token_endpoint_auth_method,
                                clientUri: client_uri || null,
                                logoUri: logo_uri || null,
                                scope: scope || null,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            }
                        ])];
                case 5:
                    insertResult = _e.sent();
                    if (insertResult.error) {
                        console.error("[OAuth Register] Failed to create client:", insertResult.error);
                        return [2 /*return*/, jsonResponse({ error: "server_error", error_description: "Failed to register client" }, 500)];
                    }
                    response = {
                        client_id: clientId,
                        client_id_issued_at: Math.floor(Date.now() / 1000),
                        client_name: client_name,
                        redirect_uris: redirect_uris,
                        grant_types: grant_types,
                        response_types: response_types,
                        token_endpoint_auth_method: token_endpoint_auth_method
                    };
                    if (rawClientSecret) {
                        response.client_secret = rawClientSecret;
                        response.client_secret_expires_at = 0;
                    }
                    if (client_uri)
                        response.client_uri = client_uri;
                    if (logo_uri)
                        response.logo_uri = logo_uri;
                    if (scope)
                        response.scope = scope;
                    return [2 /*return*/, jsonResponse(response, 201)];
            }
        });
    });
}
