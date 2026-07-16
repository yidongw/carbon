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
exports.updateExchangeRatesFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var exchange_rates_server_1 = require("@carbon/ee/exchange-rates.server");
var env_1 = require("@carbon/env");
var client_1 = require("../../client");
exports.updateExchangeRatesFunction = client_1.inngest.createFunction({ id: "update-exchange-rates", retries: 2 }, { cron: "0 0 * * *" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var serviceRole;
    var step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                serviceRole = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, step.run("fetch-and-update-exchange-rates", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var integrations, exchangeRatesClient, ratesEUR, error_1, cachedRates, _loop_1, _i, _a, integration;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    console.log("Exchange Rates Task Started: ".concat(new Date().toISOString()));
                                    return [4 /*yield*/, serviceRole
                                            .from("companyIntegration")
                                            .select("active, companyId")
                                            .eq("id", "exchange-rates-v1")
                                            .eq("active", true)];
                                case 1:
                                    integrations = _c.sent();
                                    if (integrations.error) {
                                        console.error("Error fetching integrations: ".concat(JSON.stringify(integrations.error)));
                                        return [2 /*return*/];
                                    }
                                    if (((_b = integrations.data) === null || _b === void 0 ? void 0 : _b.length) === 0) {
                                        console.log("No active exchange rate integrations found. Exiting task.");
                                        return [2 /*return*/];
                                    }
                                    console.log("Found ".concat(integrations.data.length, " active integrations"));
                                    exchangeRatesClient = (0, exchange_rates_server_1.getExchangeRatesClient)(env_1.EXCHANGE_RATES_API_KEY);
                                    if (!exchangeRatesClient) {
                                        console.error("Exchange rates client is undefined. Check API key configuration.");
                                        return [2 /*return*/];
                                    }
                                    _c.label = 2;
                                case 2:
                                    _c.trys.push([2, 4, , 5]);
                                    return [4 /*yield*/, exchangeRatesClient.getExchangeRates()];
                                case 3:
                                    ratesEUR = _c.sent();
                                    if (!ratesEUR)
                                        throw new Error("No rates returned from exchange rates API");
                                    console.log("Successfully fetched exchange rates with base currency of EUR for ".concat(Object.keys(ratesEUR).length, " currencies"));
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_1 = _c.sent();
                                    console.error("Error fetching exchange rates: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                                    return [2 /*return*/];
                                case 5:
                                    cachedRates = {
                                        EUR: ratesEUR
                                    };
                                    _loop_1 = function (integration) {
                                        var company, baseCurrencyCode, rates, updatedAt, _d, data, error, updates, upsertError, err_1;
                                        return __generator(this, function (_e) {
                                            switch (_e.label) {
                                                case 0:
                                                    console.log("Processing integration for company ID: ".concat(integration.companyId));
                                                    return [4 /*yield*/, serviceRole
                                                            .from("company")
                                                            .select("*")
                                                            .eq("id", integration.companyId)
                                                            .single()];
                                                case 1:
                                                    company = _e.sent();
                                                    if (company.error) {
                                                        console.error("Error fetching company ".concat(integration.companyId, ": ").concat(JSON.stringify(company.error)));
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    baseCurrencyCode = company.data.baseCurrencyCode;
                                                    rates = cachedRates[baseCurrencyCode];
                                                    if (!rates) return [3 /*break*/, 2];
                                                    console.log("Using cached rates for ".concat(baseCurrencyCode));
                                                    return [3 /*break*/, 4];
                                                case 2:
                                                    console.log("Computing rates for ".concat(baseCurrencyCode));
                                                    return [4 /*yield*/, exchangeRatesClient.convertExchangeRates(baseCurrencyCode, ratesEUR)];
                                                case 3:
                                                    rates = _e.sent();
                                                    cachedRates[baseCurrencyCode] = rates;
                                                    _e.label = 4;
                                                case 4:
                                                    updatedAt = new Date().toISOString();
                                                    _e.label = 5;
                                                case 5:
                                                    _e.trys.push([5, 8, , 9]);
                                                    if (!company.data.companyGroupId) {
                                                        console.warn("Company ".concat(integration.companyId, " has no companyGroupId, skipping"));
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    return [4 /*yield*/, serviceRole
                                                            .from("currency")
                                                            .select("*")
                                                            .eq("companyGroupId", company.data.companyGroupId)];
                                                case 6:
                                                    _d = _e.sent(), data = _d.data, error = _d.error;
                                                    if (error) {
                                                        console.error("Error fetching currencies for company ".concat(integration.companyId, ": ").concat(JSON.stringify(error)));
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    if (!data || data.length === 0) {
                                                        console.log("No currencies found for company ".concat(integration.companyId));
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    updates = data
                                                        .map(function (currency) {
                                                        var _a;
                                                        return (__assign(__assign({}, currency), { exchangeRate: Number((_a = rates[currency.code]) === null || _a === void 0 ? void 0 : _a.toFixed(currency.decimalPlaces)), updatedAt: updatedAt }));
                                                    })
                                                        .filter(function (currency) { return currency.exchangeRate; });
                                                    if (updates.length === 0) {
                                                        console.log("No currency updates needed for company ".concat(integration.companyId));
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    console.log("Updating ".concat(updates.length, " currencies for company ").concat(integration.companyId));
                                                    return [4 /*yield*/, serviceRole
                                                            .from("currency")
                                                            .upsert(updates)];
                                                case 7:
                                                    upsertError = (_e.sent()).error;
                                                    if (upsertError) {
                                                        console.error("Error updating currencies for company ".concat(integration.companyId, ": ").concat(JSON.stringify(upsertError)));
                                                    }
                                                    else {
                                                        console.log("Successfully updated currencies for company ".concat(integration.companyId));
                                                    }
                                                    return [3 /*break*/, 9];
                                                case 8:
                                                    err_1 = _e.sent();
                                                    console.error("Unexpected error processing company ".concat(integration.companyId, ": ").concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                                                    return [3 /*break*/, 9];
                                                case 9: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, _a = integrations.data;
                                    _c.label = 6;
                                case 6:
                                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                                    integration = _a[_i];
                                    return [5 /*yield**/, _loop_1(integration)];
                                case 7:
                                    _c.sent();
                                    _c.label = 8;
                                case 8:
                                    _i++;
                                    return [3 /*break*/, 6];
                                case 9:
                                    console.log("Exchange Rates Task Completed: ".concat(new Date().toISOString()));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
