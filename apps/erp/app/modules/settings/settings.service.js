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
exports.getAccountsPayableBillingAddress = getAccountsPayableBillingAddress;
exports.getAccountsReceivableBillingAddress = getAccountsReceivableBillingAddress;
exports.updateAccountsPayableBillingAddress = updateAccountsPayableBillingAddress;
exports.updateAccountsReceivableBillingAddress = updateAccountsReceivableBillingAddress;
exports.deactivateWebhooks = deactivateWebhooks;
exports.deleteApiKey = deleteApiKey;
exports.deleteSubsidiary = deleteSubsidiary;
exports.deleteWebhook = deleteWebhook;
exports.getApiKeys = getApiKeys;
exports.getCompanies = getCompanies;
exports.getEmployeeCompanies = getEmployeeCompanies;
exports.getCompany = getCompany;
exports.getCompanyIntegrations = getCompanyIntegrations;
exports.getCompanyPlan = getCompanyPlan;
exports.getActiveUserCount = getActiveUserCount;
exports.checkSeatAvailability = checkSeatAvailability;
exports.getCompanySettings = getCompanySettings;
exports.getConfig = getConfig;
exports.getCurrentSequence = getCurrentSequence;
exports.getCustomField = getCustomField;
exports.getCustomFields = getCustomFields;
exports.getCustomFieldsTables = getCustomFieldsTables;
exports.getIntegration = getIntegration;
exports.getIntegrations = getIntegrations;
exports.getKanbanOutputSetting = getKanbanOutputSetting;
exports.getNextSequence = getNextSequence;
exports.getPlanById = getPlanById;
exports.getPlans = getPlans;
exports.getSequence = getSequence;
exports.getSequences = getSequences;
exports.getSequencesList = getSequencesList;
exports.getSubsidiaries = getSubsidiaries;
exports.getSubsidiary = getSubsidiary;
exports.getTerms = getTerms;
exports.getDocumentTemplate = getDocumentTemplate;
exports.getDocumentTemplateConfig = getDocumentTemplateConfig;
exports.upsertDocumentTemplate = upsertDocumentTemplate;
exports.getDocumentSections = getDocumentSections;
exports.getDocumentSection = getDocumentSection;
exports.getDocumentSectionsByIds = getDocumentSectionsByIds;
exports.upsertDocumentSection = upsertDocumentSection;
exports.deleteDocumentSection = deleteDocumentSection;
exports.resolveSections = resolveSections;
exports.getWebhook = getWebhook;
exports.getWebhooks = getWebhooks;
exports.getWebhookTables = getWebhookTables;
exports.insertCompany = insertCompany;
exports.insertSubsidiary = insertSubsidiary;
exports.updateSubsidiary = updateSubsidiary;
exports.seedCompany = seedCompany;
exports.updateCompanyPlan = updateCompanyPlan;
exports.updateDefaultCustomerCc = updateDefaultCustomerCc;
exports.updateCompany = updateCompany;
exports.updateShelfLifeSettings = updateShelfLifeSettings;
exports.updateDigitalQuoteSetting = updateDigitalQuoteSetting;
exports.updateIntegrationMetadata = updateIntegrationMetadata;
exports.updateAccountingEnabledSetting = updateAccountingEnabledSetting;
exports.updateAssetTaxDepreciationSettings = updateAssetTaxDepreciationSettings;
exports.updateTimeCardSetting = updateTimeCardSetting;
exports.updateLastNameFirstSetting = updateLastNameFirstSetting;
exports.updateKanbanOutputSetting = updateKanbanOutputSetting;
exports.updateLogoDark = updateLogoDark;
exports.updateLogoDarkIcon = updateLogoDarkIcon;
exports.updateLogoLight = updateLogoLight;
exports.updateLogoLightIcon = updateLogoLightIcon;
exports.updateLogoWatermark = updateLogoWatermark;
exports.updateMaintenanceDispatchNotificationSettings = updateMaintenanceDispatchNotificationSettings;
exports.updateMaterialGeneratedIdsSetting = updateMaterialGeneratedIdsSetting;
exports.updateHiddenSubmodulesSetting = updateHiddenSubmodulesSetting;
exports.updateMetricSettings = updateMetricSettings;
exports.updateProductLabelSize = updateProductLabelSize;
exports.updatePurchasePriceUpdateTimingSetting = updatePurchasePriceUpdateTimingSetting;
exports.updateLeadTimesOnReceiptSetting = updateLeadTimesOnReceiptSetting;
exports.updateAccountsPayableAddressSetting = updateAccountsPayableAddressSetting;
exports.updateAccountsReceivableAddressSetting = updateAccountsReceivableAddressSetting;
exports.updateAccountsPayableEmail = updateAccountsPayableEmail;
exports.updateAccountsReceivableEmail = updateAccountsReceivableEmail;
exports.updateQuoteLineCategoryMarkups = updateQuoteLineCategoryMarkups;
exports.updateRfqReadySetting = updateRfqReadySetting;
exports.updateSequence = updateSequence;
exports.updateSuggestionNotificationSetting = updateSuggestionNotificationSetting;
exports.updateSupplierQuoteNotificationSetting = updateSupplierQuoteNotificationSetting;
exports.upsertApiKey = upsertApiKey;
exports.updateConsoleSetting = updateConsoleSetting;
exports.updateDefaultSupplierCc = updateDefaultSupplierCc;
exports.updateShowSupplierReadableIdSetting = updateShowSupplierReadableIdSetting;
exports.updateShowCustomerReadableIdSetting = updateShowCustomerReadableIdSetting;
exports.upsertWebhook = upsertWebhook;
var auth_1 = require("@carbon/auth");
var seed_1 = require("@carbon/database/seed");
var template_1 = require("@carbon/documents/template");
var items_1 = require("~/modules/items");
var query_1 = require("~/utils/query");
var string_1 = require("~/utils/string");
var supabase_1 = require("~/utils/supabase");
var PUBLIC_STORAGE_URL_PREFIX = "".concat(auth_1.SUPABASE_URL, "/storage/v1/object/public/public/");
function getAccountsPayableBillingAddress(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companyAccountsPayableBillingAddress")
                    .select("*")
                    .eq("id", companyId)
                    .single()];
        });
    });
}
function getAccountsReceivableBillingAddress(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companyAccountsReceivableBillingAddress")
                    .select("*")
                    .eq("id", companyId)
                    .single()];
        });
    });
}
function updateAccountsPayableBillingAddress(client, companyId, data, updatedBy) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companyAccountsPayableBillingAddress")
                    .update((0, supabase_1.sanitize)(__assign(__assign({}, data), { updatedBy: updatedBy })))
                    .eq("id", companyId)];
        });
    });
}
function updateAccountsReceivableBillingAddress(client, companyId, data, updatedBy) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companyAccountsReceivableBillingAddress")
                    .upsert((0, supabase_1.sanitize)(__assign(__assign({ id: companyId }, data), { updatedBy: updatedBy })))];
        });
    });
}
function deactivateWebhooks(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("webhook")
                    .update({ active: false })
                    .eq("companyId", companyId)];
        });
    });
}
function deleteApiKey(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("apiKey").delete().eq("id", id)];
        });
    });
}
function deleteSubsidiary(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("company").delete().eq("id", companyId)];
        });
    });
}
function deleteWebhook(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("webhook").delete().eq("id", id)];
        });
    });
}
function getApiKeys(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("apiKey")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "createdAt", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getCompanies(client, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var companies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("companies")
                        .select("*, companyGroup(name)")
                        .eq("userId", userId)
                        .order("name")];
                case 1:
                    companies = _a.sent();
                    if (companies.error) {
                        return [2 /*return*/, companies];
                    }
                    return [2 /*return*/, {
                            data: companies.data.map(function (_a) {
                                var _b;
                                var companyGroup = _a.companyGroup, company = __rest(_a, ["companyGroup"]);
                                return (__assign(__assign({}, company), { companyGroupName: (_b = companyGroup === null || companyGroup === void 0 ? void 0 : companyGroup.name) !== null && _b !== void 0 ? _b : null, logoLight: company.logoLight
                                        ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.logoLight)
                                        : null, logoDark: company.logoDark
                                        ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.logoDark)
                                        : null, logoLightIcon: company.logoLightIcon
                                        ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.logoLightIcon)
                                        : null, logoDarkIcon: company.logoDarkIcon
                                        ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.logoDarkIcon)
                                        : null, logoWatermark: company.logoWatermark
                                        ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.logoWatermark)
                                        : null }));
                            }),
                            error: null
                        }];
            }
        });
    });
}
/**
 * The companies a user can enter in the ERP. ERP is an employee app, so
 * supplier/customer-only memberships (which belong to the portals) are
 * excluded. Single source of truth for the login callback, the select-company
 * picker, and the x+/_layout enforcement guard — keep those in sync via this.
 */
function getEmployeeCompanies(client, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var companies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("companies")
                        .select("*, companyGroup(name)")
                        .eq("userId", userId)
                        .eq("role", "employee")
                        .order("name")];
                case 1:
                    companies = _a.sent();
                    if (companies.error) {
                        return [2 /*return*/, companies];
                    }
                    return [2 /*return*/, {
                            data: companies.data.map(function (_a) {
                                var _b;
                                var companyGroup = _a.companyGroup, company = __rest(_a, ["companyGroup"]);
                                return (__assign(__assign({}, company), { companyGroupName: (_b = companyGroup === null || companyGroup === void 0 ? void 0 : companyGroup.name) !== null && _b !== void 0 ? _b : null, logoLight: company.logoLight
                                        ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.logoLight)
                                        : null, logoDark: company.logoDark
                                        ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.logoDark)
                                        : null, logoLightIcon: company.logoLightIcon
                                        ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.logoLightIcon)
                                        : null, logoDarkIcon: company.logoDarkIcon
                                        ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.logoDarkIcon)
                                        : null, logoWatermark: company.logoWatermark
                                        ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.logoWatermark)
                                        : null }));
                            }),
                            error: null
                        }];
            }
        });
    });
}
function getCompany(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var company;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("company")
                        .select("*")
                        .eq("id", companyId)
                        .single()];
                case 1:
                    company = _a.sent();
                    if (company.error) {
                        return [2 /*return*/, company];
                    }
                    return [2 /*return*/, {
                            data: __assign(__assign({}, company.data), { logoLight: company.data.logoLight
                                    ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.data.logoLight)
                                    : null, logoDark: company.data.logoDark
                                    ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.data.logoDark)
                                    : null, logoLightIcon: company.data.logoLightIcon
                                    ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.data.logoLightIcon)
                                    : null, logoDarkIcon: company.data.logoDarkIcon
                                    ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.data.logoDarkIcon)
                                    : null, logoWatermark: company.data.logoWatermark
                                    ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(company.data.logoWatermark)
                                    : null }),
                            error: null
                        }];
            }
        });
    });
}
function getCompanyIntegrations(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companyIntegration")
                    .select("*")
                    .eq("companyId", companyId)];
        });
    });
}
function getCompanyPlan(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("companyPlan").select("*").eq("id", companyId).single()];
        });
    });
}
// Count real seats in use (excludes internal @carbon.ms accounts), mirroring the
// count Stripe subscription quantity uses.
function getActiveUserCount(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("userToCompany")
                        .select("userId, ...user(email)")
                        .eq("companyId", companyId)];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, (data !== null && data !== void 0 ? data : []).filter(function (u) { var _a; return !((_a = u === null || u === void 0 ? void 0 : u.email) !== null && _a !== void 0 ? _a : "").includes("@carbon.ms"); }).length];
            }
        });
    });
}
// One-time annual plans have a hard seat cap (unlike Stripe subscriptions, which
// auto-scale). Returns ok:false with a message when adding `adding` seats would
// exceed usersLimit. Subscription/other plans always return ok.
function checkSeatAvailability(client_1, companyId_1) {
    return __awaiter(this, arguments, void 0, function (client, companyId, adding) {
        var plan, count;
        var _a, _b;
        if (adding === void 0) { adding = 1; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getCompanyPlan(client, companyId)];
                case 1:
                    plan = _c.sent();
                    if (((_a = plan.data) === null || _a === void 0 ? void 0 : _a.paymentMode) !== "one_time")
                        return [2 /*return*/, { ok: true }];
                    return [4 /*yield*/, getActiveUserCount(client, companyId)];
                case 2:
                    count = _c.sent();
                    if (count + adding > ((_b = plan.data.usersLimit) !== null && _b !== void 0 ? _b : 0)) {
                        return [2 /*return*/, {
                                ok: false,
                                message: "Seat limit reached (".concat(plan.data.usersLimit, "). Renew or buy more seats in Billing settings to add users.")
                            }];
                    }
                    return [2 /*return*/, { ok: true }];
            }
        });
    });
}
function getCompanySettings(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .select("*")
                    .eq("id", companyId)
                    .single()];
        });
    });
}
function getConfig(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("config").select("*").single()];
        });
    });
}
function getCurrentSequence(client, table, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var sequence, _a, prefix, suffix, next, size, currentSequence, derivedPrefix, derivedSuffix;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getSequence(client, table, companyId)];
                case 1:
                    sequence = _b.sent();
                    if (sequence.error) {
                        return [2 /*return*/, sequence];
                    }
                    _a = sequence.data, prefix = _a.prefix, suffix = _a.suffix, next = _a.next, size = _a.size;
                    currentSequence = next.toString().padStart(size, "0");
                    derivedPrefix = (0, string_1.interpolateSequenceDate)(prefix);
                    derivedSuffix = (0, string_1.interpolateSequenceDate)(suffix);
                    return [2 /*return*/, {
                            data: "".concat(derivedPrefix).concat(currentSequence).concat(derivedSuffix),
                            error: null
                        }];
            }
        });
    });
}
function getCustomField(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("customField").select("*").eq("id", id).single()];
        });
    });
}
function getCustomFields(client, table, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customFieldTables")
                    .select("*")
                    .eq("table", table)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getCustomFieldsTables(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("customFieldTables")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "name", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getIntegration(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companyIntegration")
                    .select("*")
                    .eq("id", id)
                    .eq("companyId", companyId)
                    .maybeSingle()];
        });
    });
}
function getIntegrations(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("integrations").select("*").eq("companyId", companyId)];
        });
    });
}
function getKanbanOutputSetting(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .select("kanbanOutput")
                    .eq("id", companyId)
                    .single()];
        });
    });
}
function getNextSequence(client, table, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_next_sequence", {
                    sequence_name: table,
                    company_id: companyId
                })];
        });
    });
}
function getPlanById(client, planId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("plan").select("*").eq("id", planId).single()];
        });
    });
}
function getPlans(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("plan").select("*")];
        });
    });
}
function getSequence(client, table, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("sequence")
                    .select("*")
                    .eq("table", table)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getSequences(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("sequence")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "name", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getSequencesList(client, table, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("sequence")
                    .select("id")
                    .eq("table", table)
                    .eq("companyId", companyId)
                    .order("table")];
        });
    });
}
function getSubsidiaries(client, companyGroupId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("company")
                    .select("id, name, baseCurrencyCode, countryCode, parentCompanyId, isEliminationEntity, active")
                    .eq("companyGroupId", companyGroupId)
                    .order("name")];
        });
    });
}
function getSubsidiary(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("company").select("*").eq("id", companyId).single()];
        });
    });
}
function getTerms(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("terms").select("*").eq("id", companyId).single()];
        });
    });
}
function getDocumentTemplate(client, companyId, documentType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("documentTemplate")
                    .select("*")
                    .eq("companyId", companyId)
                    .eq("documentType", documentType)
                    .maybeSingle()];
        });
    });
}
/**
 * Load a stored document template as a `DocumentTemplate | null` ready to pass
 * to a PDF (which runs it through `resolveTemplate`). Returns null when no row
 * is stored, so the PDF falls back to the type's default.
 */
function getDocumentTemplateConfig(client, companyId, documentType) {
    return __awaiter(this, void 0, void 0, function () {
        var stored;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDocumentTemplate(client, companyId, documentType)];
                case 1:
                    stored = _a.sent();
                    return [2 /*return*/, (0, template_1.toDocumentTemplate)(stored.data, documentType)];
            }
        });
    });
}
function upsertDocumentTemplate(client, documentTemplate) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("documentTemplate").upsert(__assign(__assign({}, documentTemplate), { 
                    // Always persist the current schema version of the JSON we're writing.
                    formatVersion: template_1.CURRENT_TEMPLATE_FORMAT_VERSION, updatedAt: new Date().toISOString() }), { onConflict: "companyId,documentType" })];
        });
    });
}
function getDocumentSections(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("documentSection")
                    .select("*")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getDocumentSection(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("documentSection")
                    .select("*")
                    .eq("id", id)
                    .eq("companyId", companyId)
                    .maybeSingle()];
        });
    });
}
function getDocumentSectionsByIds(client, companyId, ids) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("documentSection")
                    .select("*")
                    .eq("companyId", companyId)
                    .in("id", ids)];
        });
    });
}
function upsertDocumentSection(client, documentSection) {
    return __awaiter(this, void 0, void 0, function () {
        var actor, id, companyId, update;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            // Editing a system default forks it into a real row keyed by the same id, so
            // it overrides the built-in everywhere it's referenced. Upsert keeps repeat
            // edits idempotent (the row may or may not exist yet).
            if (documentSection.id && (0, template_1.isBuiltInSectionId)(documentSection.id)) {
                actor = "createdBy" in documentSection
                    ? documentSection.createdBy
                    : documentSection.updatedBy;
                return [2 /*return*/, client
                        .from("documentSection")
                        .upsert({
                        id: documentSection.id,
                        companyId: documentSection.companyId,
                        name: documentSection.name,
                        placement: documentSection.placement,
                        content: documentSection.content,
                        config: ((_a = documentSection.config) !== null && _a !== void 0 ? _a : {}),
                        createdBy: actor,
                        updatedBy: actor,
                        updatedAt: new Date().toISOString()
                    }, { onConflict: "id,companyId" })
                        .select("id")];
            }
            if ("createdBy" in documentSection) {
                return [2 /*return*/, client
                        .from("documentSection")
                        .insert(__assign(__assign({}, documentSection), { content: documentSection.content, config: ((_b = documentSection.config) !== null && _b !== void 0 ? _b : {}) }))
                        .select("id")];
            }
            id = documentSection.id, companyId = documentSection.companyId, update = __rest(documentSection, ["id", "companyId"]);
            return [2 /*return*/, client
                    .from("documentSection")
                    .update(__assign(__assign({}, update), { content: update.content, config: ((_c = update.config) !== null && _c !== void 0 ? _c : {}), updatedAt: new Date().toISOString() }))
                    .eq("id", id !== null && id !== void 0 ? id : "")
                    .eq("companyId", companyId)
                    .select("id")];
        });
    });
}
function deleteDocumentSection(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("documentSection")
                    .delete()
                    .eq("id", id)
                    .eq("companyId", companyId)];
        });
    });
}
/** Fetch the given section ids and return them keyed by id for rendering. */
function resolveSections(client, companyId, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var map, _i, ids_1, id, builtIn, dbIds, data, _a, _b, row;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (ids.length === 0)
                        return [2 /*return*/, {}];
                    map = {};
                    // System sections live in code, not the DB. Seed them first so a stored row
                    // with the same id (a customized/forked default) overrides below.
                    for (_i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                        id = ids_1[_i];
                        builtIn = (0, template_1.getBuiltInSection)(id);
                        if (builtIn)
                            map[id] = builtIn;
                    }
                    dbIds = ids.filter(function (id) { var _a; return !map[id] || ((_a = map[id]) === null || _a === void 0 ? void 0 : _a.builtIn); });
                    return [4 /*yield*/, getDocumentSectionsByIds(client, companyId, dbIds)];
                case 1:
                    data = (_c.sent()).data;
                    for (_a = 0, _b = (data !== null && data !== void 0 ? data : []); _a < _b.length; _a++) {
                        row = _b[_a];
                        map[row.id] = {
                            id: row.id,
                            name: row.name,
                            placement: row.placement,
                            content: row.content,
                            config: row.config
                        };
                    }
                    return [2 /*return*/, map];
            }
        });
    });
}
function getWebhook(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("webhook").select("*").eq("id", id).single()];
        });
    });
}
function getWebhooks(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("webhook")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "createdAt", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getWebhookTables(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("webhookTable").select("*").order("name")];
        });
    });
}
function insertCompany(client, company, companyGroupId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("company")
                    .insert(__assign(__assign({}, company), { companyGroupId: companyGroupId }))
                    .select("id")
                    .single()];
        });
    });
}
function insertSubsidiary(client, subsidiary) {
    return __awaiter(this, void 0, void 0, function () {
        var _, data;
        return __generator(this, function (_a) {
            _ = subsidiary.id, data = __rest(subsidiary, ["id"]);
            return [2 /*return*/, client.from("company").insert(data).select("id").single()];
        });
    });
}
function updateSubsidiary(client, id, subsidiary) {
    return __awaiter(this, void 0, void 0, function () {
        var _, data;
        return __generator(this, function (_a) {
            _ = subsidiary.id, data = __rest(subsidiary, ["id"]);
            return [2 /*return*/, client.from("company").update(data).eq("id", id)];
        });
    });
}
/**
 * Seeds a new company's default data via the seed_company() Postgres RPC.
 *
 * This replaced the seed-company edge function: a single round trip that runs all
 * inserts server-side in one transaction, avoiding the edge runtime's ~5s cold start
 * (it was invoked ~once per company, so nearly always cold) and the 95 sequential
 * round trips it took to insert the chart of accounts.
 */
/**
 * Provisions base reference data for a newly created company. Must be called
 * with a service-role client — it seeds rows before the creator has RLS
 * permissions on the new company.
 */
function seedCompany(client, companyId, userId, parentCompanyId, language) {
    return __awaiter(this, void 0, void 0, function () {
        var result, _a, colorSeed, sizeSeed;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client.rpc("seed_company", {
                        company_id: companyId,
                        user_id: userId,
                        parent_company_id: parentCompanyId,
                        seed: seed_1.companySeedData
                    })];
                case 1:
                    result = _c.sent();
                    return [4 /*yield*/, (0, items_1.seedStyleReference)(client, companyId, userId, language)];
                case 2:
                    _a = _c.sent(), colorSeed = _a[0], sizeSeed = _a[1];
                    if (colorSeed.error || sizeSeed.error) {
                        console.error((_b = colorSeed.error) !== null && _b !== void 0 ? _b : sizeSeed.error);
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function updateCompanyPlan(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var companyId, updateData;
        return __generator(this, function (_a) {
            companyId = data.companyId, updateData = __rest(data, ["companyId"]);
            return [2 /*return*/, client.from("companyPlan").update(updateData).eq("id", companyId)];
        });
    });
}
function updateDefaultCustomerCc(client, companyId, defaultCustomerCc) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update({ defaultCustomerCc: defaultCustomerCc })
                    .eq("companyId", companyId)];
        });
    });
}
function updateCompany(client, companyId, company) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("company").update((0, supabase_1.sanitize)(company)).eq("id", companyId)];
        });
    });
}
function updateShelfLifeSettings(client, companyId, settings) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update({
                    inventoryShelfLife: {
                        nearExpiryWarningDays: (_a = settings.nearExpiryWarningDays) !== null && _a !== void 0 ? _a : null,
                        defaultShelfLifeDays: settings.defaultShelfLifeDays,
                        calculatedInputScope: settings.calculatedInputScope,
                        expiredEntityPolicy: settings.expiredEntityPolicy
                    }
                })
                    .eq("id", companyId)];
        });
    });
}
function updateDigitalQuoteSetting(client, companyId, digitalQuoteEnabled, digitalQuoteNotificationGroup, digitalQuoteIncludesPurchaseOrders) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({
                    digitalQuoteEnabled: digitalQuoteEnabled,
                    digitalQuoteNotificationGroup: digitalQuoteNotificationGroup,
                    digitalQuoteIncludesPurchaseOrders: digitalQuoteIncludesPurchaseOrders
                }))
                    .eq("id", companyId)];
        });
    });
}
function updateIntegrationMetadata(client, companyId, integrationId, metadata, updatedBy) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companyIntegration")
                    .update((0, supabase_1.sanitize)({
                    metadata: metadata,
                    updatedAt: new Date().toISOString(),
                    updatedBy: updatedBy
                }))
                    .eq("companyId", companyId)
                    .eq("id", integrationId)];
        });
    });
}
function updateAccountingEnabledSetting(client, companyId, accountingEnabled) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ accountingEnabled: accountingEnabled }))
                    .eq("id", companyId)];
        });
    });
}
function updateAssetTaxDepreciationSettings(client, companyId, settings) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)(settings))
                    .eq("id", companyId)];
        });
    });
}
function updateTimeCardSetting(client, companyId, timeCardEnabled) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ timeCardEnabled: timeCardEnabled }))
                    .eq("id", companyId)];
        });
    });
}
function updateLastNameFirstSetting(client, companyId, lastNameFirst) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ lastNameFirst: lastNameFirst }))
                    .eq("id", companyId)];
        });
    });
}
function updateKanbanOutputSetting(client, companyId, kanbanOutput) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ kanbanOutput: kanbanOutput }))
                    .eq("id", companyId)];
        });
    });
}
function updateLogoDark(client, companyId, logoDark) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("company")
                    .update((0, supabase_1.sanitize)({
                    logoDark: logoDark
                }))
                    .eq("id", companyId)];
        });
    });
}
function updateLogoDarkIcon(client, companyId, logoDarkIcon) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("company")
                    .update((0, supabase_1.sanitize)({ logoDarkIcon: logoDarkIcon }))
                    .eq("id", companyId)];
        });
    });
}
function updateLogoLight(client, companyId, logoLight) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("company")
                    .update((0, supabase_1.sanitize)({ logoLight: logoLight }))
                    .eq("id", companyId)];
        });
    });
}
function updateLogoLightIcon(client, companyId, logoLightIcon) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("company")
                    .update((0, supabase_1.sanitize)({ logoLightIcon: logoLightIcon }))
                    .eq("id", companyId)];
        });
    });
}
function updateLogoWatermark(client, companyId, logoWatermark) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("company")
                    .update((0, supabase_1.sanitize)({ logoWatermark: logoWatermark }))
                    .eq("id", companyId)];
        });
    });
}
function updateMaintenanceDispatchNotificationSettings(client, companyId, settings) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)(settings))
                    .eq("id", companyId)];
        });
    });
}
function updateMaterialGeneratedIdsSetting(client, companyId, materialGeneratedIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ materialGeneratedIds: materialGeneratedIds }))
                    .eq("id", companyId)];
        });
    });
}
function updateHiddenSubmodulesSetting(client, companyId, hiddenSubmodules) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ hiddenSubmodules: hiddenSubmodules }))
                    .eq("id", companyId)];
        });
    });
}
function updateMetricSettings(client, companyId, useMetric) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ useMetric: useMetric }))
                    .eq("id", companyId)];
        });
    });
}
function updateProductLabelSize(client, companyId, productLabelSize) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ productLabelSize: productLabelSize }))
                    .eq("id", companyId)];
        });
    });
}
function updatePurchasePriceUpdateTimingSetting(client, companyId, purchasePriceUpdateTiming) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ purchasePriceUpdateTiming: purchasePriceUpdateTiming }))
                    .eq("id", companyId)];
        });
    });
}
function updateLeadTimesOnReceiptSetting(client, companyId, updateLeadTimesOnReceipt) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("companySettings")
                    .update((0, supabase_1.sanitize)({ updateLeadTimesOnReceipt: updateLeadTimesOnReceipt }))
                    .eq("id", companyId)];
        });
    });
}
function updateAccountsPayableAddressSetting(client, companyId, accountsPayableAddress) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ accountsPayableAddress: accountsPayableAddress }))
                    .eq("id", companyId)];
        });
    });
}
function updateAccountsReceivableAddressSetting(client, companyId, accountsReceivableAddress) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ accountsReceivableAddress: accountsReceivableAddress }))
                    .eq("id", companyId)];
        });
    });
}
function updateAccountsPayableEmail(client, companyId, accountsPayableEmail) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ accountsPayableEmail: accountsPayableEmail !== null && accountsPayableEmail !== void 0 ? accountsPayableEmail : null }))
                    .eq("id", companyId)];
        });
    });
}
function updateAccountsReceivableEmail(client, companyId, accountsReceivableEmail) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ accountsReceivableEmail: accountsReceivableEmail !== null && accountsReceivableEmail !== void 0 ? accountsReceivableEmail : null }))
                    .eq("id", companyId)];
        });
    });
}
function updateQuoteLineCategoryMarkups(client, companyId, quoteLineCategoryMarkups) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ quoteLineCategoryMarkups: quoteLineCategoryMarkups }))
                    .eq("id", companyId)];
        });
    });
}
function updateRfqReadySetting(client, companyId, rfqReadyNotificationGroup) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ rfqReadyNotificationGroup: rfqReadyNotificationGroup }))
                    .eq("id", companyId)];
        });
    });
}
function updateSequence(client, table, companyId, sequence) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("sequence")
                    .update((0, supabase_1.sanitize)(sequence))
                    .eq("companyId", companyId)
                    .eq("table", table)];
        });
    });
}
function updateSuggestionNotificationSetting(client, companyId, suggestionNotificationGroup) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("company")
                    .update((0, supabase_1.sanitize)({ suggestionNotificationGroup: suggestionNotificationGroup }))
                    .eq("id", companyId)];
        });
    });
}
function updateSupplierQuoteNotificationSetting(client, companyId, supplierQuoteNotificationGroup) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ supplierQuoteNotificationGroup: supplierQuoteNotificationGroup }))
                    .eq("id", companyId)];
        });
    });
}
function upsertApiKey(client, apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, scopes_1, expiresAt_1, rawKey, keyHash, _rl_1, _rlw_1, rest_1, result, _b, scopes, expiresAt, _rl, _rlw, rest;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!("createdBy" in apiKey)) return [3 /*break*/, 2];
                    _a = apiKey, scopes_1 = _a.scopes, expiresAt_1 = _a.expiresAt, rawKey = _a.rawKey, keyHash = _a.keyHash, _rl_1 = _a.rateLimit, _rlw_1 = _a.rateLimitWindow, rest_1 = __rest(_a, ["scopes", "expiresAt", "rawKey", "keyHash", "rateLimit", "rateLimitWindow"]);
                    return [4 /*yield*/, client
                            .from("apiKey")
                            .insert((0, supabase_1.sanitize)(__assign(__assign({}, rest_1), { keyHash: keyHash, scopes: scopes_1, expiresAt: expiresAt_1 || null })))
                            .select("id")
                            .single()];
                case 1:
                    result = _c.sent();
                    if (result.error) {
                        return [2 /*return*/, { data: null, error: result.error }];
                    }
                    // Return the raw key (shown to user once, never stored)
                    return [2 /*return*/, { data: { key: rawKey, id: result.data.id }, error: null }];
                case 2:
                    _b = apiKey, scopes = _b.scopes, expiresAt = _b.expiresAt, _rl = _b.rateLimit, _rlw = _b.rateLimitWindow, rest = __rest(_b, ["scopes", "expiresAt", "rateLimit", "rateLimitWindow"]);
                    return [2 /*return*/, client
                            .from("apiKey")
                            .update((0, supabase_1.sanitize)(__assign(__assign({}, rest), { scopes: scopes, expiresAt: expiresAt || null })))
                            .eq("id", apiKey.id)];
            }
        });
    });
}
function updateConsoleSetting(client, companyId, consoleEnabled, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var update, existing, newType_1, mesModules, permissions, generatedPin, userEmployee;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("companySettings")
                        .update((0, supabase_1.sanitize)({ consoleEnabled: consoleEnabled }))
                        .eq("id", companyId)];
                case 1:
                    update = _a.sent();
                    if (!consoleEnabled) return [3 /*break*/, 8];
                    return [4 /*yield*/, client
                            .from("employeeType")
                            .select("id")
                            .eq("companyId", companyId)
                            .eq("systemType", "Console Operator")
                            .maybeSingle()];
                case 2:
                    existing = _a.sent();
                    if (!!existing.data) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("employeeType")
                            .insert({
                            name: "Console Operator",
                            companyId: companyId,
                            protected: true,
                            systemType: "Console Operator",
                            // Console operators use the MES only and are not billed as a seat.
                            mesOnly: true
                        })
                            .select("id")
                            .single()];
                case 3:
                    newType_1 = _a.sent();
                    if (!newType_1.data) return [3 /*break*/, 5];
                    mesModules = [
                        {
                            module: "Production",
                            create: true,
                            update: true,
                            delete: false,
                            view: true
                        },
                        {
                            module: "Inventory",
                            create: true,
                            update: true,
                            delete: false,
                            view: true
                        },
                        {
                            module: "Resources",
                            create: false,
                            update: false,
                            delete: false,
                            view: true
                        },
                        {
                            module: "Items",
                            create: false,
                            update: false,
                            delete: false,
                            view: true
                        },
                        {
                            module: "Quality",
                            create: true,
                            update: true,
                            delete: false,
                            view: true
                        },
                        {
                            module: "People",
                            create: false,
                            update: false,
                            delete: false,
                            view: true
                        }
                    ];
                    permissions = mesModules.map(function (m) { return ({
                        employeeTypeId: newType_1.data.id,
                        module: m.module,
                        create: m.create ? [companyId] : [],
                        update: m.update ? [companyId] : [],
                        delete: m.delete ? [companyId] : [],
                        view: m.view ? [companyId] : []
                    }); });
                    return [4 /*yield*/, client.from("employeeTypePermission").insert(permissions)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    generatedPin = null;
                    if (!userId) return [3 /*break*/, 8];
                    return [4 /*yield*/, client
                            .from("employee")
                            .select("id, pin")
                            .eq("id", userId)
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 6:
                    userEmployee = _a.sent();
                    if (!(userEmployee.data && !userEmployee.data.pin)) return [3 /*break*/, 8];
                    generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
                    return [4 /*yield*/, client
                            .from("employee")
                            .update({ pin: generatedPin })
                            .eq("id", userId)
                            .eq("companyId", companyId)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/, update];
            }
        });
    });
}
function updateDefaultSupplierCc(client, companyId, defaultSupplierCc) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ defaultSupplierCc: defaultSupplierCc }))
                    .eq("id", companyId)];
        });
    });
}
function updateShowSupplierReadableIdSetting(client, companyId, showSupplierReadableId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ showSupplierReadableId: showSupplierReadableId }))
                    .eq("id", companyId)];
        });
    });
}
function updateShowCustomerReadableIdSetting(client, companyId, showCustomerReadableId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update((0, supabase_1.sanitize)({ showCustomerReadableId: showCustomerReadableId }))
                    .eq("id", companyId)];
        });
    });
}
function upsertWebhook(client, webhook) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in webhook) {
                return [2 /*return*/, client.from("webhook").insert(webhook).select("id").single()];
            }
            return [2 /*return*/, client.from("webhook").update((0, supabase_1.sanitize)(webhook)).eq("id", webhook.id)];
        });
    });
}
