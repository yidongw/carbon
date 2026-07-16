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
exports.XeroProvider = void 0;
var models_1 = require("../../core/models");
var utils_1 = require("../../core/utils");
var XeroProvider = /** @class */ (function () {
    function XeroProvider(config) {
        var _a;
        this.config = config;
        this.syncConfig = config.syncConfig;
        this._settings = (_a = config.settings) !== null && _a !== void 0 ? _a : {};
        console.log("[XeroProvider] Initialized with settings:", this._settings);
        this.http = new utils_1.HTTPClient("https://api.xero.com/api.xro/2.0");
        this.auth = (0, utils_1.createOAuthClient)({
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            accessToken: config.accessToken,
            refreshToken: config.refreshToken,
            redirectUri: config.redirectUri,
            tokenUrl: "https://identity.xero.com/connect/token",
            onTokenRefresh: config.onTokenRefresh,
            getAuthUrl: function (scopes, redirectURL) {
                var params = new URLSearchParams({
                    response_type: "code",
                    client_id: config.clientId,
                    redirect_uri: redirectURL,
                    scope: scopes.join(" "),
                    state: crypto.randomUUID()
                });
                return "https://login.xero.com/identity/connect/authorize?".concat(params.toString());
            }
        });
    }
    Object.defineProperty(XeroProvider.prototype, "id", {
        get: function () {
            // @ts-expect-error
            return this.constructor.id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(XeroProvider.prototype, "settings", {
        /**
         * Get integration settings (e.g., default account codes).
         */
        get: function () {
            return this._settings;
        },
        enumerable: false,
        configurable: true
    });
    XeroProvider.prototype.getSyncConfig = function (entity) {
        return this.syncConfig.entities[entity];
    };
    XeroProvider.prototype.authenticate = function (code, redirectUri) {
        return this.auth.exchangeCode(code, redirectUri);
    };
    XeroProvider.prototype.request = function (method, url, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, accessToken, creds, tenantId, headers, response, c, retryHeaders;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.auth.getCredentials(), accessToken = _a.accessToken, creds = __rest(_a, ["accessToken"]);
                        tenantId = creds.tenantId || this.config.tenantId;
                        headers = __assign({ Authorization: "Bearer ".concat(accessToken), Accept: "application/json", "Content-Type": "application/json" }, ((_b = options === null || options === void 0 ? void 0 : options.headers) !== null && _b !== void 0 ? _b : {}));
                        if (tenantId) {
                            headers["xero-tenant-id"] = tenantId;
                        }
                        return [4 /*yield*/, this.http.request(method, url, __assign(__assign({}, options), { headers: headers }))];
                    case 1:
                        response = _c.sent();
                        if (!(response.code === 401)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.auth.refresh()];
                    case 2:
                        _c.sent();
                        c = this.auth.getCredentials();
                        retryHeaders = __assign(__assign({}, headers), { Authorization: "Bearer ".concat(c.accessToken) });
                        if (tenantId) {
                            retryHeaders["xero-tenant-id"] = tenantId;
                        }
                        return [2 /*return*/, this.http.request(method, url, __assign(__assign({}, options), { headers: retryHeaders }))];
                    case 3: return [2 /*return*/, response];
                }
            });
        });
    };
    XeroProvider.prototype.validate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.request("GET", "/Organisation")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, !response.error];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Xero validate error:", error_1);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fetch the Xero organisation details including base currency.
     */
    XeroProvider.prototype.getOrganisation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.request("GET", "/Organisation")];
                    case 1:
                        response = _c.sent();
                        if (response.error || !((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.Organisations) === null || _b === void 0 ? void 0 : _b[0])) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, response.data.Organisations[0]];
                }
            });
        });
    };
    /**
     * Fetch all currencies enabled/subscribed in the Xero organisation.
     */
    XeroProvider.prototype.listCurrencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.request("GET", "/Currencies")];
                    case 1:
                        response = _b.sent();
                        if (response.error) {
                            return [2 /*return*/, []];
                        }
                        data = response.data;
                        return [2 /*return*/, (_a = data === null || data === void 0 ? void 0 : data.Currencies) !== null && _a !== void 0 ? _a : []];
                }
            });
        });
    };
    /**
     * Fetch chart of accounts from Xero.
     * Returns all active accounts by default.
     */
    XeroProvider.prototype.listChartOfAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.request("GET", "/Accounts")];
                    case 1:
                        response = _c.sent();
                        if (response.error) {
                            console.error("Failed to fetch Xero accounts:", response);
                            return [2 /*return*/, []];
                        }
                        // Filter to only active accounts
                        return [2 /*return*/, ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.Accounts) !== null && _b !== void 0 ? _b : []).filter(function (account) { return account.Status === "ACTIVE"; })];
                }
            });
        });
    };
    /**
     * List all contacts from Xero with pagination support.
     * Xero returns 100 contacts per page by default.
     */
    XeroProvider.prototype.listContacts = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var page, params, headers, response, contacts, hasMore;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        page = (_a = options === null || options === void 0 ? void 0 : options.page) !== null && _a !== void 0 ? _a : 1;
                        params = new URLSearchParams();
                        params.set("page", String(page));
                        if (options === null || options === void 0 ? void 0 : options.summaryOnly) {
                            params.set("summarizeErrors", "true");
                        }
                        if (options === null || options === void 0 ? void 0 : options.includeArchived) {
                            params.set("includeArchived", "true");
                        }
                        // Only fetch contacts that are customers or suppliers — skip
                        // contacts that are neither (e.g. plain address book entries)
                        params.set("where", "IsCustomer==true OR IsSupplier==true");
                        headers = {};
                        if (options === null || options === void 0 ? void 0 : options.modifiedSince) {
                            headers["If-Modified-Since"] = options.modifiedSince.toUTCString();
                        }
                        return [4 /*yield*/, this.request("GET", "/Contacts?".concat(params.toString()), { headers: headers })];
                    case 1:
                        response = _c.sent();
                        if (response.error || !((_b = response.data) === null || _b === void 0 ? void 0 : _b.Contacts)) {
                            return [2 /*return*/, { contacts: [], hasMore: false, page: page }];
                        }
                        contacts = response.data.Contacts;
                        hasMore = contacts.length === 100;
                        return [2 /*return*/, { contacts: contacts, hasMore: hasMore, page: page }];
                }
            });
        });
    };
    /**
     * List all items from Xero with pagination support.
     * Xero returns 100 items per page by default.
     */
    XeroProvider.prototype.listItems = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var page, params, headers, response, items, hasMore;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        page = (_a = options === null || options === void 0 ? void 0 : options.page) !== null && _a !== void 0 ? _a : 1;
                        params = new URLSearchParams();
                        params.set("page", String(page));
                        headers = {};
                        if (options === null || options === void 0 ? void 0 : options.modifiedSince) {
                            headers["If-Modified-Since"] = options.modifiedSince.toUTCString();
                        }
                        return [4 /*yield*/, this.request("GET", "/Items?".concat(params.toString()), { headers: headers })];
                    case 1:
                        response = _c.sent();
                        if (response.error || !((_b = response.data) === null || _b === void 0 ? void 0 : _b.Items)) {
                            return [2 /*return*/, { items: [], hasMore: false, page: page }];
                        }
                        items = response.data.Items;
                        hasMore = items.length === 100;
                        return [2 /*return*/, { items: items, hasMore: hasMore, page: page }];
                }
            });
        });
    };
    XeroProvider.id = models_1.ProviderID.XERO;
    return XeroProvider;
}());
exports.XeroProvider = XeroProvider;
