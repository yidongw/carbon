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
exports.loader = loader;
exports.action = action;
exports.default = IntegrationRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var ee_1 = require("@carbon/ee");
var accounting_1 = require("@carbon/ee/accounting");
var hooks_server_1 = require("@carbon/ee/hooks.server");
var plan_1 = require("@carbon/ee/plan");
var plan_server_1 = require("@carbon/ee/plan.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var settings_1 = require("~/modules/settings");
var settings_server_1 = require("~/modules/settings/settings.server");
var path_1 = require("~/utils/path");
/**
 * Transforms flat owner settings (customerOwner, vendorOwner, etc.) into
 * the nested syncConfig.entities structure expected by the accounting sync.
 */
function buildIntegrationMetadata(existingMetadata, formData) {
    var _a, _b;
    // Extract owner settings from form data
    var ownerSettings = {
        customerOwner: formData.customerOwner,
        vendorOwner: formData.vendorOwner,
        itemOwner: formData.itemOwner,
        invoiceOwner: formData.invoiceOwner,
        billOwner: formData.billOwner
    };
    // Check if any owner settings are present
    var hasOwnerSettings = Object.values(ownerSettings).some(function (v) { return v !== undefined; });
    if (!hasOwnerSettings) {
        // No owner settings, just merge as-is
        return __assign(__assign({}, existingMetadata), formData);
    }
    // Build syncConfig.entities from owner settings
    var existingSyncConfig = (_a = existingMetadata.syncConfig) !== null && _a !== void 0 ? _a : {};
    var existingEntities = (_b = existingSyncConfig.entities) !== null && _b !== void 0 ? _b : {};
    var syncConfig = __assign(__assign({}, existingSyncConfig), { entities: __assign(__assign(__assign(__assign(__assign(__assign({}, existingEntities), (ownerSettings.customerOwner && {
            customer: __assign(__assign({}, existingEntities.customer), { owner: ownerSettings.customerOwner })
        })), (ownerSettings.vendorOwner && {
            vendor: __assign(__assign({}, existingEntities.vendor), { owner: ownerSettings.vendorOwner })
        })), (ownerSettings.itemOwner && {
            item: __assign(__assign({}, existingEntities.item), { owner: ownerSettings.itemOwner })
        })), (ownerSettings.invoiceOwner && {
            invoice: __assign(__assign({}, existingEntities.invoice), { owner: ownerSettings.invoiceOwner })
        })), (ownerSettings.billOwner && {
            bill: __assign(__assign({}, existingEntities.bill), { owner: ownerSettings.billOwner })
        })) });
    // Remove owner settings from formData since they're now in syncConfig
    var _customerOwner = formData.customerOwner, _vendorOwner = formData.vendorOwner, _itemOwner = formData.itemOwner, _invoiceOwner = formData.invoiceOwner, _billOwner = formData.billOwner, restFormData = __rest(formData, ["customerOwner", "vendorOwner", "itemOwner", "invoiceOwner", "billOwner"]);
    return __assign(__assign(__assign({}, existingMetadata), restFormData), { syncConfig: syncConfig });
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, integrationId, integration, integrationData, metadata, flattenedMetadata, dynamicOptions, xeroIntegration, provider, accounts, accountOptions, error_1;
        var _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _e.sent(), client = _c.client, companyId = _c.companyId;
                    integrationId = params.id;
                    if (!integrationId)
                        throw new Error("Integration ID not found");
                    integration = ee_1.integrations.find(function (i) { return i.id === integrationId; });
                    if (!integration)
                        throw new Error("Integration not found");
                    return [4 /*yield*/, (0, settings_1.getIntegration)(client, integrationId, companyId)];
                case 2:
                    integrationData = _e.sent();
                    if (integrationData.error || !integrationData.data) {
                        return [2 /*return*/, {
                                installed: false,
                                metadata: {},
                                dynamicOptions: {}
                            }];
                    }
                    metadata = ((_d = integrationData.data.metadata) !== null && _d !== void 0 ? _d : {});
                    flattenedMetadata = flattenSyncConfigToOwnerSettings(metadata);
                    dynamicOptions = {};
                    if (!(integrationId === "xero" && integrationData.data.active)) return [3 /*break*/, 7];
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, (0, accounting_1.getAccountingIntegration)(client, companyId, accounting_1.ProviderID.XERO)];
                case 4:
                    xeroIntegration = _e.sent();
                    provider = (0, accounting_1.getProviderIntegration)(client, companyId, xeroIntegration.id, xeroIntegration.metadata);
                    return [4 /*yield*/, provider.listChartOfAccounts()];
                case 5:
                    accounts = _e.sent();
                    accountOptions = accounts.map(function (account) {
                        var _a;
                        return ({
                            value: (_a = account.Code) !== null && _a !== void 0 ? _a : account.AccountID,
                            label: account.Code
                                ? "".concat(account.Code, " - ").concat(account.Name)
                                : account.Name,
                            description: account.Type
                        });
                    });
                    dynamicOptions = {
                        defaultSalesAccountCode: accountOptions,
                        defaultPurchaseAccountCode: accountOptions
                    };
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _e.sent();
                    console.error("Failed to fetch Xero accounts for settings:", error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/, {
                        installed: integrationData.data.active,
                        metadata: flattenedMetadata,
                        dynamicOptions: dynamicOptions
                    }];
            }
        });
    });
}
/**
 * Extracts owner settings from nested syncConfig.entities back into
 * flat fields (customerOwner, vendorOwner, etc.) for the form.
 */
function flattenSyncConfigToOwnerSettings(metadata) {
    var _a, _b, _c, _d, _e;
    var syncConfig = metadata.syncConfig;
    var entities = syncConfig === null || syncConfig === void 0 ? void 0 : syncConfig.entities;
    if (!entities) {
        return metadata;
    }
    return __assign(__assign({}, metadata), { customerOwner: (_a = entities.customer) === null || _a === void 0 ? void 0 : _a.owner, vendorOwner: (_b = entities.vendor) === null || _b === void 0 ? void 0 : _b.owner, itemOwner: (_c = entities.item) === null || _c === void 0 ? void 0 : _c.owner, invoiceOwner: (_d = entities.invoice) === null || _d === void 0 ? void 0 : _d.owner, billOwner: (_e = entities.bill) === null || _e === void 0 ? void 0 : _e.owner });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, integrationId, integration, validation, _d, _e, _f, _active, d, existing, existingMetadata, metadata, wasInstalled, update, _g, _h, serverHooks, onInstall, hookError_1, _j, _k, _l, _m;
        var _o, _p, _q, _r;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "settings"
                        })];
                case 1:
                    _c = _s.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    integrationId = params.id;
                    if (!integrationId)
                        throw new Error("Integration ID not found");
                    if (!!(0, plan_1.isIntegrationWhitelisted)(integrationId)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, plan_server_1.requirePlan)({
                            request: request,
                            client: client,
                            companyId: companyId,
                            feature: "INTEGRATIONS",
                            redirectTo: path_1.path.to.integrations
                        })];
                case 2:
                    _s.sent();
                    _s.label = 3;
                case 3:
                    integration = ee_1.integrations.find(function (i) { return i.id === integrationId; });
                    if (!integration)
                        throw new Error("Integration not found");
                    _e = (_d = (0, form_1.validator)(
                    // integration.schema is a union across all integrations (incl. a
                    // discriminated union for Email). Cast to a generic ZodType so the
                    // validator signature accepts it.
                    integration.schema)).validate;
                    return [4 /*yield*/, request.formData()];
                case 4: return [4 /*yield*/, _e.apply(_d, [_s.sent()])];
                case 5:
                    validation = _s.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _f = validation.data, _active = _f.active, d = __rest(_f, ["active"]);
                    return [4 /*yield*/, (0, settings_1.getIntegration)(client, integrationId, companyId)];
                case 6:
                    existing = _s.sent();
                    existingMetadata = (_p = (_o = existing.data) === null || _o === void 0 ? void 0 : _o.metadata) !== null && _p !== void 0 ? _p : {};
                    metadata = buildIntegrationMetadata(existingMetadata, d);
                    wasInstalled = ((_q = existing.data) === null || _q === void 0 ? void 0 : _q.active) === true;
                    return [4 /*yield*/, (0, settings_server_1.upsertCompanyIntegration)(client, {
                            id: integrationId,
                            active: true,
                            // @ts-expect-error TS2322 - TODO: fix type
                            metadata: metadata,
                            companyId: companyId,
                            updatedBy: userId
                        })];
                case 7:
                    update = _s.sent();
                    if (!update.error) return [3 /*break*/, 9];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.integrations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to install integration"))];
                case 8: throw _g.apply(void 0, _h.concat([_s.sent()]));
                case 9:
                    if (!!wasInstalled) return [3 /*break*/, 14];
                    serverHooks = (0, hooks_server_1.getIntegrationServerHooks)(integrationId);
                    onInstall = ((_r = serverHooks === null || serverHooks === void 0 ? void 0 : serverHooks.onInstall) !== null && _r !== void 0 ? _r : integration.onInstall);
                    if (!onInstall) return [3 /*break*/, 14];
                    _s.label = 10;
                case 10:
                    _s.trys.push([10, 12, , 14]);
                    return [4 /*yield*/, onInstall(companyId)];
                case 11:
                    _s.sent();
                    return [3 /*break*/, 14];
                case 12:
                    hookError_1 = _s.sent();
                    console.error("onInstall hook failed for integration '".concat(integrationId, "'"), hookError_1);
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.integrations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(hookError_1, "Installed ".concat(integration.name, ", but setup hook failed")))];
                case 13: throw _j.apply(void 0, _k.concat([_s.sent()]));
                case 14: return [4 /*yield*/, (0, settings_server_1.invalidateIntegrationHealthCache)(integrationId, companyId)];
                case 15:
                    _s.sent();
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.integrations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Installed ".concat(integration.name, " integration")))];
                case 16: throw _l.apply(void 0, _m.concat([_s.sent()]));
            }
        });
    });
}
function IntegrationRoute() {
    var _a = (0, react_router_1.useLoaderData)(), installed = _a.installed, metadata = _a.metadata, dynamicOptions = _a.dynamicOptions;
    var navigate = (0, react_router_1.useNavigate)();
    return (<settings_1.IntegrationForm installed={installed} metadata={metadata} dynamicOptions={dynamicOptions} onClose={function () { return navigate(path_1.path.to.integrations); }}/>);
}
