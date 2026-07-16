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
exports.config = void 0;
exports.loader = loader;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var ee_1 = require("@carbon/ee");
var accounting_1 = require("@carbon/ee/accounting");
var hooks_server_1 = require("@carbon/ee/xero/hooks.server");
var react_router_1 = require("react-router");
var settings_server_1 = require("~/modules/settings/settings.server");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
exports.config = {
    runtime: "nodejs"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, url, searchParams, xeroAuthResponse, params, provider, auth, connectionsResponse, connections, tenantId, tenantName, _d, company, companyError, xeroOrgResponse, _e, _f, _g, xeroOrgData, parseError_1, xeroBaseCurrency, createdXeroIntegration, requestUrl, redirectUrl, err_1;
        var _h, _j, _k;
        var request = _b.request;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _l.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = Object.fromEntries(url.searchParams.entries());
                    xeroAuthResponse = shared_1.oAuthCallbackSchema.safeParse(searchParams);
                    if (!xeroAuthResponse.success) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid Xero auth response" }, { status: 400 })];
                    }
                    params = xeroAuthResponse.data;
                    // TODO: Verify state parameter
                    if (!params.state) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid state parameter" }, { status: 400 })];
                    }
                    if (!auth_1.XERO_CLIENT_ID || !auth_1.XERO_CLIENT_SECRET) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Xero OAuth not configured" }, { status: 500 })];
                    }
                    _l.label = 2;
                case 2:
                    _l.trys.push([2, 16, , 17]);
                    provider = (0, accounting_1.getProviderIntegration)(client, companyId, accounting_1.ProviderID.XERO);
                    return [4 /*yield*/, provider.authenticate(params.code, "".concat(url.origin, "/api/integrations/xero/oauth"))];
                case 3:
                    auth = _l.sent();
                    if (!auth) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to exchange code for token" }, { status: 500 })];
                    }
                    return [4 /*yield*/, fetch("https://api.xero.com/connections", {
                            method: "GET",
                            headers: {
                                Authorization: "Bearer ".concat(auth.accessToken),
                                "Content-Type": "application/json"
                            }
                        })];
                case 4:
                    connectionsResponse = _l.sent();
                    if (!connectionsResponse.ok) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to fetch Xero connections" }, { status: 500 })];
                    }
                    return [4 /*yield*/, connectionsResponse.json()];
                case 5:
                    connections = _l.sent();
                    if (!Array.isArray(connections) || connections.length === 0) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "No Xero connections found" }, { status: 500 })];
                    }
                    tenantId = connections[0].tenantId;
                    tenantName = connections[0].tenantName;
                    if (!tenantId) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "No tenant ID found in Xero connections" }, { status: 500 })];
                    }
                    return [4 /*yield*/, client
                            .from("company")
                            .select("baseCurrencyCode")
                            .eq("id", companyId)
                            .single()];
                case 6:
                    _d = _l.sent(), company = _d.data, companyError = _d.error;
                    if (companyError || !(company === null || company === void 0 ? void 0 : company.baseCurrencyCode)) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Company base currency not configured" }, { status: 400 })];
                    }
                    return [4 /*yield*/, fetch("https://api.xero.com/api.xro/2.0/Organisation", {
                            method: "GET",
                            headers: {
                                Authorization: "Bearer ".concat(auth.accessToken),
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                "xero-tenant-id": tenantId
                            }
                        })];
                case 7:
                    xeroOrgResponse = _l.sent();
                    if (!!xeroOrgResponse.ok) return [3 /*break*/, 9];
                    _f = (_e = console).error;
                    _g = ["Xero Organisation API error:",
                        xeroOrgResponse.status];
                    return [4 /*yield*/, xeroOrgResponse.text()];
                case 8:
                    _f.apply(_e, _g.concat([_l.sent()]));
                    return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to fetch Xero organization details" }, { status: 500 })];
                case 9:
                    xeroOrgData = void 0;
                    _l.label = 10;
                case 10:
                    _l.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, xeroOrgResponse.json()];
                case 11:
                    xeroOrgData = _l.sent();
                    return [3 /*break*/, 13];
                case 12:
                    parseError_1 = _l.sent();
                    console.error("Failed to parse Xero Organisation response:", parseError_1);
                    return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid response from Xero organization API" }, { status: 500 })];
                case 13:
                    xeroBaseCurrency = (_j = (_h = xeroOrgData === null || xeroOrgData === void 0 ? void 0 : xeroOrgData.Organisations) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.BaseCurrency;
                    if (!xeroBaseCurrency) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Could not determine Xero organization base currency" }, { status: 500 })];
                    }
                    // Check if Carbon's base currency matches Xero's base currency
                    if (company.baseCurrencyCode !== xeroBaseCurrency) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                error: "Currency mismatch: Your Carbon company uses ".concat(company.baseCurrencyCode, ", but your Xero organization uses ").concat(xeroBaseCurrency, ". Please ensure both systems use the same base currency before connecting.")
                            }, { status: 400 })];
                    }
                    return [4 /*yield*/, (0, settings_server_1.upsertCompanyIntegration)(client, {
                            id: ee_1.Xero.id,
                            active: true,
                            // @ts-ignore
                            metadata: {
                                syncConfig: accounting_1.DEFAULT_SYNC_CONFIG,
                                credentials: __assign(__assign({}, auth), { tenantId: tenantId, tenantName: tenantName !== null && tenantName !== void 0 ? tenantName : undefined })
                            },
                            updatedBy: userId,
                            companyId: companyId
                        })];
                case 14:
                    createdXeroIntegration = _l.sent();
                    return [4 /*yield*/, (0, hooks_server_1.xeroOnInstall)(companyId)];
                case 15:
                    _l.sent();
                    if ((_k = createdXeroIntegration === null || createdXeroIntegration === void 0 ? void 0 : createdXeroIntegration.data) === null || _k === void 0 ? void 0 : _k.metadata) {
                        requestUrl = new URL(request.url);
                        if (!auth_1.VERCEL_URL || auth_1.VERCEL_URL.includes("localhost")) {
                            requestUrl.protocol = "http";
                        }
                        redirectUrl = "".concat(requestUrl.origin).concat(path_1.path.to.integrations);
                        return [2 /*return*/, (0, react_router_1.redirect)(redirectUrl)];
                    }
                    else {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to save Xero integration" }, { status: 500 })];
                    }
                    return [3 /*break*/, 17];
                case 16:
                    err_1 = _l.sent();
                    console.error("Xero OAuth Error:", err_1);
                    return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to exchange code for token" }, { status: 500 })];
                case 17: return [2 /*return*/];
            }
        });
    });
}
