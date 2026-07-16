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
exports.getProviderIntegration = exports.getAccountingIntegration = void 0;
var xero_1 = require("../providers/xero");
var models_1 = require("./models");
var getAccountingIntegration = function (client, companyOrTenantId, provider) { return __awaiter(void 0, void 0, void 0, function () {
    var integration, config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client
                    .from("companyIntegration")
                    .select("*")
                    .eq("id", provider)
                    .or("companyId.eq.".concat(companyOrTenantId, ",metadata->credentials->>tenantId.eq.").concat(companyOrTenantId))
                    .single()];
            case 1:
                integration = _a.sent();
                console.log("Fetched integration for", provider, "and ID", companyOrTenantId, integration);
                if (integration.error || !integration.data) {
                    throw new Error("No ".concat(provider, " integration found for company or tenant ").concat(companyOrTenantId));
                }
                config = models_1.ProviderIntegrationMetadataSchema.safeParse(integration.data.metadata);
                if (!config.success) {
                    console.dir(config.error, { depth: null });
                    throw new Error("Invalid provider config");
                }
                return [2 /*return*/, __assign(__assign({}, integration.data), { id: provider, metadata: config.data })];
        }
    });
}); };
exports.getAccountingIntegration = getAccountingIntegration;
var getProviderIntegration = function (client, companyId, provider, config) {
    var _a = (config === null || config === void 0 ? void 0 : config.credentials) || {}, accessToken = _a.accessToken, refreshToken = _a.refreshToken, tenantId = _a.tenantId;
    // For now don't use the company level sync config
    var syncConfig = models_1.DEFAULT_SYNC_CONFIG;
    // Create a callback function to update the integration metadata when tokens are refreshed
    var onTokenRefresh = function (auth) { return __awaiter(void 0, void 0, void 0, function () {
        var update, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("Refreshing tokens for", provider, "integration");
                    update = __assign(__assign({}, auth), { expiresAt: auth.expiresAt || new Date(Date.now() + 3600000).toISOString(), tenantId: auth.tenantId || tenantId });
                    return [4 /*yield*/, client
                            .from("companyIntegration")
                            .update({ metadata: __assign(__assign({}, config), { credentials: update }) })
                            .eq("companyId", companyId)
                            .eq("id", provider)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to update ".concat(provider, " integration metadata:"), error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    switch (provider) {
        // case "quickbooks": {
        //   const environment = process.env.QUICKBOOKS_ENVIRONMENT as
        //     | "production"
        //     | "sandbox";
        //   return new QuickBooksProvider({
        //     companyId,
        //     tenantId,
        //     environment: environment || "sandbox",
        //     clientId: process.env.QUICKBOOKS_CLIENT_ID!,
        //     clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
        //     redirectUri: process.env.QUICKBOOKS_REDIRECT_URI,
        //     onTokenRefresh
        //   });
        // }
        case "xero": {
            var settings = {
                defaultSalesAccountCode: config === null || config === void 0 ? void 0 : config.defaultSalesAccountCode,
                defaultPurchaseAccountCode: config === null || config === void 0 ? void 0 : config.defaultPurchaseAccountCode
            };
            console.log("[getProviderIntegration] Creating XeroProvider with settings:", settings);
            console.log("[getProviderIntegration] Full config received:", config);
            return new xero_1.XeroProvider({
                companyId: companyId,
                tenantId: tenantId,
                accessToken: accessToken,
                refreshToken: refreshToken,
                clientId: process.env.XERO_CLIENT_ID,
                clientSecret: process.env.XERO_CLIENT_SECRET,
                redirectUri: process.env.XERO_REDIRECT_URI,
                syncConfig: syncConfig,
                onTokenRefresh: onTokenRefresh,
                settings: settings
            });
        }
        // Add other providers as needed
        // case "sage":
        //   return new SageProvider(config);
        default:
            throw new Error("Unsupported provider: ".concat(provider));
    }
};
exports.getProviderIntegration = getProviderIntegration;
