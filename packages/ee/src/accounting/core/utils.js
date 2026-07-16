"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingApiError = exports.RatelimitError = exports.NotImplementedError = exports.HTTPClient = void 0;
exports.withTriggersDisabled = withTriggersDisabled;
exports.parseRateLimitInfo = parseRateLimitInfo;
exports.extractXeroErrorDetails = extractXeroErrorDetails;
exports.throwXeroApiError = throwXeroApiError;
exports.createOAuthClient = createOAuthClient;
var kysely_1 = require("kysely");
/**
 * Execute a database operation with sync triggers disabled.
 * This prevents circular trigger loops when syncing from external systems.
 *
 * Uses PostgreSQL session variable `app.sync_in_progress` which is checked
 * by the `dispatch_event_batch` trigger function.
 *
 * @param db - The Kysely database instance
 * @param operation - A callback that receives the transaction and performs DB operations
 */
function withTriggersDisabled(db, operation) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, db.transaction().execute(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Set the session variable to disable event triggers for this transaction
                            return [4 /*yield*/, (0, kysely_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SET LOCAL \"app.sync_in_progress\" = 'true'"], ["SET LOCAL \"app.sync_in_progress\" = 'true'"]))).execute(tx)];
                            case 1:
                                // Set the session variable to disable event triggers for this transaction
                                _a.sent();
                                return [4 /*yield*/, operation(tx)];
                            case 2: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); })];
        });
    });
}
var HTTPClient = /** @class */ (function () {
    function HTTPClient(baseUrl) {
        this.baseUrl = baseUrl;
    }
    HTTPClient.prototype.request = function (method_1, path_1) {
        return __awaiter(this, arguments, void 0, function (method, path, opts) {
            var response, rateLimitInfo, error_1;
            if (opts === void 0) { opts = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.fetch(method, path, opts)];
                    case 1:
                        response = _a.sent();
                        if (response.status === 429) {
                            rateLimitInfo = parseRateLimitInfo(response);
                            throw new RatelimitError("Rate limit exceeded", rateLimitInfo);
                        }
                        return [2 /*return*/, this.parseResponse(response)];
                    case 2:
                        error_1 = _a.sent();
                        if (error_1 instanceof RatelimitError) {
                            throw error_1;
                        }
                        return [2 /*return*/, this.parseResponse(response)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HTTPClient.prototype.fetch = function (method, path, opts) {
        var url = this.baseUrl ? "".concat(this.baseUrl).concat(path) : path;
        return fetch(url, __assign({ method: method }, opts));
    };
    HTTPClient.prototype.parseResponse = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var contentType, isJson, text, parsedData, text, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        contentType = response.headers.get("content-type");
                        isJson = contentType === null || contentType === void 0 ? void 0 : contentType.includes("application/json");
                        if (!!response.ok) return [3 /*break*/, 2];
                        return [4 /*yield*/, response.text()];
                    case 1:
                        text = _b.sent();
                        parsedData = text;
                        // Try to parse JSON error responses for better error details
                        if (isJson && text) {
                            try {
                                parsedData = JSON.parse(text);
                            }
                            catch (_c) {
                                // Keep as raw string if parsing fails
                            }
                        }
                        return [2 /*return*/, {
                                error: true,
                                message: response.statusText,
                                code: response.status,
                                data: parsedData
                            }];
                    case 2:
                        if (!isJson) return [3 /*break*/, 6];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, response.text()];
                    case 4:
                        text = _b.sent();
                        if (!text || text.trim() === "") {
                            return [2 /*return*/, {
                                    error: false,
                                    message: response.statusText,
                                    code: response.status,
                                    data: null
                                }];
                        }
                        return [2 /*return*/, {
                                error: false,
                                message: response.statusText,
                                code: response.status,
                                data: JSON.parse(text)
                            }];
                    case 5:
                        _a = _b.sent();
                        return [2 /*return*/, {
                                error: true,
                                message: "Invalid JSON response",
                                code: response.status,
                                data: null
                            }];
                    case 6: return [2 /*return*/, {
                            error: false,
                            message: response.statusText,
                            code: response.status,
                            data: null
                        }];
                }
            });
        });
    };
    return HTTPClient;
}());
exports.HTTPClient = HTTPClient;
// /********************************************************\
// *                     Custom Errors Start                *
// \********************************************************/
var NotImplementedError = /** @class */ (function (_super) {
    __extends(NotImplementedError, _super);
    function NotImplementedError(name) {
        var _this = _super.call(this, "Method ".concat(name, " is not implemented.")) || this;
        _this.name = "NotImplementedError";
        return _this;
    }
    return NotImplementedError;
}(Error));
exports.NotImplementedError = NotImplementedError;
var RatelimitError = /** @class */ (function (_super) {
    __extends(RatelimitError, _super);
    function RatelimitError(message, rateLimitInfo) {
        var _this = _super.call(this, message) || this;
        _this.name = "RatelimitError";
        _this.rateLimitInfo = rateLimitInfo;
        return _this;
    }
    Object.defineProperty(RatelimitError.prototype, "retryAfterSeconds", {
        get: function () {
            return this.rateLimitInfo.retryAfterSeconds;
        },
        enumerable: false,
        configurable: true
    });
    return RatelimitError;
}(Error));
exports.RatelimitError = RatelimitError;
/**
 * Parse rate limit info from a 429 response.
 * Handles Xero-specific headers but can be extended for other providers.
 */
function parseRateLimitInfo(response) {
    var _a;
    // Parse Retry-After header (standard HTTP header, value in seconds)
    var retryAfter = response.headers.get("Retry-After");
    var retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : 60;
    // Fallback to 60 seconds if parsing fails
    if (isNaN(retryAfterSeconds) || retryAfterSeconds <= 0) {
        retryAfterSeconds = 60;
    }
    // Parse provider-specific headers
    var limitType = (_a = response.headers.get("X-Rate-Limit-Problem")) !== null && _a !== void 0 ? _a : undefined;
    var details = {};
    // Xero-specific headers
    var minuteRemaining = response.headers.get("X-MinLimit-Remaining");
    var dayRemaining = response.headers.get("X-DayLimit-Remaining");
    var appMinuteRemaining = response.headers.get("X-AppMinLimit-Remaining");
    if (minuteRemaining)
        details.minuteRemaining = parseInt(minuteRemaining, 10);
    if (dayRemaining)
        details.dayRemaining = parseInt(dayRemaining, 10);
    if (appMinuteRemaining)
        details.appMinuteRemaining = parseInt(appMinuteRemaining, 10);
    return {
        retryAfterSeconds: retryAfterSeconds,
        limitType: limitType,
        details: Object.keys(details).length > 0 ? details : undefined
    };
}
/**
 * Structured error class for accounting provider API errors.
 * Captures detailed error information for debugging and user display.
 */
var AccountingApiError = /** @class */ (function (_super) {
    __extends(AccountingApiError, _super);
    function AccountingApiError(provider, operation, details) {
        var _this = this;
        var _a;
        // Build a human-readable message
        var messages = ["".concat(details.statusCode, " ").concat(details.statusText)];
        if (details.providerMessage) {
            messages.push(details.providerMessage);
        }
        if ((_a = details.validationErrors) === null || _a === void 0 ? void 0 : _a.length) {
            messages.push(details.validationErrors.map(function (e) { return e.message; }).join("; "));
        }
        _this = _super.call(this, "[".concat(provider, "] ").concat(operation, " failed: ").concat(messages.join(" - "))) || this;
        _this.name = "AccountingApiError";
        _this.provider = provider;
        _this.operation = operation;
        _this.details = details;
        return _this;
    }
    /** Get a concise error message suitable for user display */
    AccountingApiError.prototype.getUserMessage = function () {
        var _a;
        if ((_a = this.details.validationErrors) === null || _a === void 0 ? void 0 : _a.length) {
            return this.details.validationErrors.map(function (e) { return e.message; }).join("; ");
        }
        return this.details.providerMessage || this.details.statusText;
    };
    return AccountingApiError;
}(Error));
exports.AccountingApiError = AccountingApiError;
// /********************************************************\
// *                     Custom Errors End                  *
// \********************************************************/
// /********************************************************\
// *              Xero Error Parsing Start                  *
// \********************************************************/
/**
 * Parses Xero API error responses into structured ApiErrorDetails.
 *
 * Xero returns errors in several formats:
 *
 * 1. ValidationException with Elements:
 * {
 *   "ErrorNumber": 10,
 *   "Type": "ValidationException",
 *   "Message": "A validation exception occurred",
 *   "Elements": [{
 *     "ValidationErrors": [{ "Message": "Code must be unique" }]
 *   }]
 * }
 *
 * 2. Simple error:
 * { "Message": "Something went wrong" }
 *
 * 3. OAuth error:
 * { "error": "invalid_grant", "error_description": "Token expired" }
 *
 * 4. RFC 7807 problem+json:
 * { "type": "...", "title": "...", "detail": "..." }
 */
function extractXeroErrorDetails(statusCode, statusText, responseData) {
    var details = {
        statusCode: statusCode,
        statusText: statusText,
        rawResponse: responseData
    };
    // Try to parse if it's a string
    var data = responseData;
    if (typeof responseData === "string") {
        try {
            data = JSON.parse(responseData);
        }
        catch (_a) {
            // Not JSON, use raw string as message if short enough
            if (responseData.length < 500) {
                details.providerMessage = responseData;
            }
            return details;
        }
    }
    if (typeof data !== "object" || data === null) {
        return details;
    }
    var obj = data;
    // Extract error type and code
    if (typeof obj.Type === "string") {
        details.providerErrorType = obj.Type;
    }
    if (obj.ErrorNumber !== undefined) {
        details.providerErrorCode = obj.ErrorNumber;
    }
    // Extract main message (try multiple common formats)
    if (typeof obj.Message === "string") {
        details.providerMessage = obj.Message;
    }
    else if (typeof obj.message === "string") {
        details.providerMessage = obj.message;
    }
    else if (typeof obj.detail === "string") {
        // RFC 7807 format
        details.providerMessage = obj.detail;
    }
    else if (typeof obj.error_description === "string") {
        // OAuth format
        details.providerMessage = obj.error_description;
        details.providerErrorType = obj.error;
    }
    // Extract validation errors from Elements array
    if (Array.isArray(obj.Elements)) {
        var validationErrors = [];
        for (var _i = 0, _b = obj.Elements; _i < _b.length; _i++) {
            var element = _b[_i];
            if (element && Array.isArray(element.ValidationErrors)) {
                for (var _c = 0, _d = element.ValidationErrors; _c < _d.length; _c++) {
                    var err = _d[_c];
                    if (err && typeof err.Message === "string") {
                        validationErrors.push({ message: err.Message });
                    }
                }
            }
        }
        if (validationErrors.length > 0) {
            details.validationErrors = validationErrors;
        }
    }
    return details;
}
var isDevelopment = process.env.NODE_ENV !== "production";
/**
 * Creates and logs an AccountingApiError from an HTTP response, then throws it.
 * Logs full error details to console for debugging.
 *
 * @param operation - Description of the operation that failed (e.g., "create item", "batch upsert contacts")
 * @param response - The HTTP response object from HTTPClient
 * @throws AccountingApiError
 */
function throwXeroApiError(operation, response) {
    var details = extractXeroErrorDetails(response.code, response.message, response.data);
    var error = new AccountingApiError("xero", operation, details);
    // Log full error details for debugging
    var logDetails = {
        statusCode: details.statusCode,
        statusText: details.statusText,
        providerErrorType: details.providerErrorType,
        providerErrorCode: details.providerErrorCode,
        providerMessage: details.providerMessage,
        validationErrors: details.validationErrors
    };
    // Only include raw response in development to avoid log bloat
    if (isDevelopment) {
        logDetails.rawResponse = details.rawResponse;
    }
    console.error("[Xero API Error] ".concat(operation), logDetails);
    throw error;
}
// /********************************************************\
// *              Xero Error Parsing End                    *
// \********************************************************/
function createOAuthClient(_a) {
    var clientId = _a.clientId, clientSecret = _a.clientSecret, options = __rest(_a, ["clientId", "clientSecret"]);
    var basicAuth = btoa("".concat(clientId, ":").concat(clientSecret));
    var http = new HTTPClient();
    var creds = {
        type: "oauth2",
        accessToken: options.accessToken,
        refreshToken: options.refreshToken
    };
    return {
        getAuthUrl: options.getAuthUrl,
        exchangeCode: function (code, redirectUri) {
            return __awaiter(this, void 0, void 0, function () {
                var response, newCreds, _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, http.request("POST", options.tokenUrl, {
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    Authorization: "Basic ".concat(basicAuth)
                                },
                                body: new URLSearchParams({
                                    grant_type: "authorization_code",
                                    code: code,
                                    redirect_uri: (_b = redirectUri !== null && redirectUri !== void 0 ? redirectUri : options.redirectUri) !== null && _b !== void 0 ? _b : ""
                                })
                            })];
                        case 1:
                            response = _c.sent();
                            if (response.error || !response.data) {
                                throw new Error("Auth failed: ".concat(response.data));
                            }
                            newCreds = {
                                type: "oauth2",
                                accessToken: response.data.access_token,
                                refreshToken: response.data.refresh_token,
                                expiresAt: new Date(Date.now() + response.data.expires_in * 1000).toISOString()
                            };
                            creds = __assign(__assign({}, creds), newCreds);
                            _a = options.onTokenRefresh;
                            if (!_a) return [3 /*break*/, 3];
                            return [4 /*yield*/, options.onTokenRefresh(newCreds)];
                        case 2:
                            _a = (_c.sent());
                            _c.label = 3;
                        case 3:
                            _a;
                            return [2 /*return*/, newCreds];
                    }
                });
            });
        },
        refresh: function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, newCreds, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log("Refreshing OAuth tokens", creds);
                            if (!(creds === null || creds === void 0 ? void 0 : creds.refreshToken)) {
                                throw new Error("No refresh token available");
                            }
                            return [4 /*yield*/, http.request("POST", options.tokenUrl, {
                                    headers: {
                                        "Content-Type": "application/x-www-form-urlencoded",
                                        Authorization: "Basic ".concat(basicAuth)
                                    },
                                    body: new URLSearchParams({
                                        grant_type: "refresh_token",
                                        refresh_token: creds.refreshToken
                                    })
                                })];
                        case 1:
                            response = _b.sent();
                            if (response.error || !response.data) {
                                console.log(response.data);
                                throw new Error("Token refresh failed: ".concat(response.error));
                            }
                            newCreds = {
                                type: "oauth2",
                                accessToken: response.data.access_token,
                                refreshToken: response.data.refresh_token,
                                expiresAt: new Date(Date.now() + response.data.expires_in * 1000).toISOString(),
                                tenantId: creds === null || creds === void 0 ? void 0 : creds.tenantId
                            };
                            creds = __assign(__assign({}, creds), newCreds);
                            _a = options.onTokenRefresh;
                            if (!_a) return [3 /*break*/, 3];
                            return [4 /*yield*/, options.onTokenRefresh(newCreds)];
                        case 2:
                            _a = (_b.sent());
                            _b.label = 3;
                        case 3:
                            _a;
                            return [2 /*return*/, newCreds];
                    }
                });
            });
        },
        getCredentials: function () {
            if (!creds) {
                throw new Error("No credentials available");
            }
            return creds;
        }
    };
}
var templateObject_1;
