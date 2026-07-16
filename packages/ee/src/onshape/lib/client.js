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
exports.OnshapeClient = void 0;
exports.getOnshapeClient = getOnshapeClient;
var auth_1 = require("@carbon/auth");
var axios_1 = require("axios");
var OnshapeClient = /** @class */ (function () {
    function OnshapeClient(config) {
        this.baseUrl = config.baseUrl;
        this.accessToken = config.accessToken;
        this.axiosInstance = axios_1.default.create({
            baseURL: this.baseUrl,
            headers: this.getAuthHeaders()
        });
    }
    OnshapeClient.prototype.getAuthHeaders = function () {
        return {
            "Content-Type": "application/json",
            Accept: "application/json;charset=UTF-8; qs=0.09",
            Authorization: "Bearer ".concat(this.accessToken)
        };
    };
    OnshapeClient.prototype.request = function (method, path, body) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.axiosInstance.request({
                                method: method,
                                url: path,
                                data: body
                            })];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_1 = _d.sent();
                        if (axios_1.default.isAxiosError(error_1)) {
                            throw new Error("Onshape API error (".concat((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.status, "): ").concat(typeof ((_b = error_1.response) === null || _b === void 0 ? void 0 : _b.data) === "string"
                                ? error_1.response.data
                                : JSON.stringify((_c = error_1.response) === null || _c === void 0 ? void 0 : _c.data)));
                        }
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OnshapeClient.prototype.getDocuments = function () {
        return __awaiter(this, arguments, void 0, function (limit, offset) {
            if (limit === void 0) { limit = 20; }
            if (offset === void 0) { offset = 0; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request("GET", "/api/v10/documents?limit=".concat(limit, "&offset=").concat(offset))];
            });
        });
    };
    OnshapeClient.prototype.getVersions = function (documentId_1) {
        return __awaiter(this, arguments, void 0, function (documentId, limit, offset) {
            if (limit === void 0) { limit = 20; }
            if (offset === void 0) { offset = 0; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request("GET", "/api/v10/documents/d/".concat(documentId, "/versions?limit=").concat(limit, "&offset=").concat(offset))];
            });
        });
    };
    OnshapeClient.prototype.getElements = function (document, elementType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request("GET", "/api/v10/documents/d/".concat(document.documentId, "/").concat(document.wvm, "/").concat(document.wvmId, "/elements").concat(elementType ? "?elementType=" + elementType : ""))];
            });
        });
    };
    OnshapeClient.prototype.getBillOfMaterials = function (documentId, versionId, elementId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request("GET", "/api/v10/assemblies/d/".concat(documentId, "/v/").concat(versionId, "/e/").concat(elementId, "/bom?indented=true&multiLevel=true&generateIfAbsent=true&onlyVisibleColumns=true&includeItemMicroversions=false&includeTopLevelAssemblyRow=true&thumbnail=false"))];
            });
        });
    };
    OnshapeClient.refreshAccessToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!auth_1.ONSHAPE_CLIENT_ID || !auth_1.ONSHAPE_CLIENT_SECRET) {
                            throw new Error("Onshape OAuth not configured");
                        }
                        return [4 /*yield*/, fetch("https://oauth.onshape.com/oauth/token", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                body: new URLSearchParams({
                                    grant_type: "refresh_token",
                                    refresh_token: refreshToken,
                                    client_id: auth_1.ONSHAPE_CLIENT_ID,
                                    client_secret: auth_1.ONSHAPE_CLIENT_SECRET
                                })
                            })];
                    case 1:
                        response = _d.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        _a = Error.bind;
                        _c = (_b = "Onshape token refresh failed (".concat(response.status, "): ")).concat;
                        return [4 /*yield*/, response.text()];
                    case 2: throw new (_a.apply(Error, [void 0, _c.apply(_b, [_d.sent()])]))();
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        });
    };
    return OnshapeClient;
}());
exports.OnshapeClient = OnshapeClient;
function getOnshapeClient(client, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var integration, metadata, credentials, accessToken, baseUrl, refreshed, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("companyIntegration")
                        .select("*")
                        .eq("id", "onshape")
                        .eq("companyId", companyId)
                        .maybeSingle()];
                case 1:
                    integration = _b.sent();
                    if (integration.error || !integration.data) {
                        return [2 /*return*/, { client: null, error: "Onshape integration not found" }];
                    }
                    metadata = integration.data.metadata;
                    credentials = metadata === null || metadata === void 0 ? void 0 : metadata.credentials;
                    if (!(credentials === null || credentials === void 0 ? void 0 : credentials.accessToken)) {
                        return [2 /*return*/, { client: null, error: "Onshape credentials not found" }];
                    }
                    accessToken = credentials.accessToken;
                    baseUrl = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.baseUrl) !== null && _a !== void 0 ? _a : "https://cad.onshape.com";
                    if (!(credentials.expiresAt &&
                        credentials.refreshToken &&
                        new Date(credentials.expiresAt) <= new Date())) return [3 /*break*/, 6];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, OnshapeClient.refreshAccessToken(credentials.refreshToken)];
                case 3:
                    refreshed = _b.sent();
                    accessToken = refreshed.access_token;
                    // Persist the new tokens
                    return [4 /*yield*/, client
                            .from("companyIntegration")
                            .update({
                            metadata: __assign(__assign({}, metadata), { credentials: __assign(__assign({}, credentials), { accessToken: refreshed.access_token, refreshToken: refreshed.refresh_token, expiresAt: new Date(Date.now() + 3600 * 1000).toISOString() }) }),
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", "onshape")
                            .eq("companyId", companyId)];
                case 4:
                    // Persist the new tokens
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    console.error("Failed to refresh Onshape token:", error_2);
                    return [2 /*return*/, { client: null, error: "Failed to refresh Onshape token" }];
                case 6: return [2 /*return*/, {
                        client: new OnshapeClient({ baseUrl: baseUrl, accessToken: accessToken }),
                        error: null
                    }];
            }
        });
    });
}
