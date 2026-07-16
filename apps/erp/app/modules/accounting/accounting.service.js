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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrialBalance = getTrialBalance;
exports.getFinancialStatementBalances = getFinancialStatementBalances;
exports.getCompaniesInGroup = getCompaniesInGroup;
exports.deleteAccount = deleteAccount;
exports.deletePaymentTerm = deletePaymentTerm;
exports.getAccount = getAccount;
exports.getAccounts = getAccounts;
exports.getAccountsList = getAccountsList;
exports.getGroupAccounts = getGroupAccounts;
exports.getBaseCurrency = getBaseCurrency;
exports.getChartOfAccounts = getChartOfAccounts;
exports.getCurrency = getCurrency;
exports.getCurrencyByCode = getCurrencyByCode;
exports.getCurrencies = getCurrencies;
exports.getCurrenciesList = getCurrenciesList;
exports.getCurrentAccountingPeriod = getCurrentAccountingPeriod;
exports.getOrCreateAccountingPeriod = getOrCreateAccountingPeriod;
exports.getDefaultAccounts = getDefaultAccounts;
exports.getFiscalYearSettings = getFiscalYearSettings;
exports.getPaymentTerm = getPaymentTerm;
exports.getPaymentTerms = getPaymentTerms;
exports.getPaymentTermsList = getPaymentTermsList;
exports.updateDefaultBalanceSheetAccounts = updateDefaultBalanceSheetAccounts;
exports.updateDefaultIncomeAccounts = updateDefaultIncomeAccounts;
exports.updateFiscalYearSettings = updateFiscalYearSettings;
exports.upsertAccount = upsertAccount;
exports.upsertCurrency = upsertCurrency;
exports.upsertPaymentTerm = upsertPaymentTerm;
exports.deleteCostCenter = deleteCostCenter;
exports.getCostCenter = getCostCenter;
exports.getCostCenters = getCostCenters;
exports.getCostCentersList = getCostCentersList;
exports.getCostCentersTree = getCostCentersTree;
exports.upsertCostCenter = upsertCostCenter;
exports.getDimensions = getDimensions;
exports.getDimension = getDimension;
exports.upsertDimension = upsertDimension;
exports.deleteDimension = deleteDimension;
exports.getActiveDimensionsWithValues = getActiveDimensionsWithValues;
exports.getJournalLineDimensions = getJournalLineDimensions;
exports.saveJournalLineDimensions = saveJournalLineDimensions;
exports.translateCompanyBalances = translateCompanyBalances;
exports.getConsolidatedBalances = getConsolidatedBalances;
exports.getIntercompanyTransactions = getIntercompanyTransactions;
exports.createIntercompanyTransaction = createIntercompanyTransaction;
exports.runIntercompanyMatching = runIntercompanyMatching;
exports.generateEliminations = generateEliminations;
exports.getIntercompanyBalance = getIntercompanyBalance;
exports.getExchangeRateHistory = getExchangeRateHistory;
exports.getJournalEntries = getJournalEntries;
exports.getJournalEntry = getJournalEntry;
exports.createJournalEntry = createJournalEntry;
exports.updateJournalEntry = updateJournalEntry;
exports.deleteJournalEntry = deleteJournalEntry;
exports.upsertJournalEntryLine = upsertJournalEntryLine;
exports.deleteJournalEntryLine = deleteJournalEntryLine;
exports.saveJournalEntryWithLines = saveJournalEntryWithLines;
exports.postJournalEntry = postJournalEntry;
exports.reverseJournalEntry = reverseJournalEntry;
exports.getFixedAssetClasses = getFixedAssetClasses;
exports.getFixedAssetClass = getFixedAssetClass;
exports.getFixedAssetClassesList = getFixedAssetClassesList;
exports.upsertFixedAssetClass = upsertFixedAssetClass;
exports.deleteFixedAssetClass = deleteFixedAssetClass;
exports.getFixedAssets = getFixedAssets;
exports.getFixedAsset = getFixedAsset;
exports.getFixedAssetsList = getFixedAssetsList;
exports.getFixedAssetsListForSale = getFixedAssetsListForSale;
exports.insertFixedAsset = insertFixedAsset;
exports.updateFixedAsset = updateFixedAsset;
exports.upsertFixedAsset = upsertFixedAsset;
exports.deleteFixedAsset = deleteFixedAsset;
exports.insertDepreciationRun = insertDepreciationRun;
exports.deleteDepreciationRun = deleteDepreciationRun;
exports.getDepreciationRuns = getDepreciationRuns;
exports.getDepreciationRun = getDepreciationRun;
exports.getDepreciationRunLines = getDepreciationRunLines;
exports.getAssetDepreciationHistory = getAssetDepreciationHistory;
exports.getFixedAssetDisposal = getFixedAssetDisposal;
exports.getFixedAssetUsageLogs = getFixedAssetUsageLogs;
exports.upsertFixedAssetUsageLog = upsertFixedAssetUsageLog;
var utils_1 = require("@carbon/utils");
var settings_1 = require("~/modules/settings");
var query_1 = require("~/utils/query");
var supabase_1 = require("~/utils/supabase");
/**
 * Sign multiplier for root account aggregation.
 * Asset and Revenue have normal debit balances and add to parent.
 * Liability, Equity, and Expense have normal credit balances and subtract.
 */
function rootSignMultiplier(accountClass) {
    switch (accountClass) {
        case "Asset":
        case "Revenue":
            return 1;
        case "Liability":
        case "Equity":
        case "Expense":
            return -1;
        default:
            return 1;
    }
}
/**
 * Recalculates balance/balanceAtDate/netChange for system (root) accounts
 * using sign-aware aggregation based on direct children's account class.
 *
 * Standard accounting:
 *   Balance Sheet  = Assets − Liabilities − Equity   (should ≈ 0)
 *   Income Statement = Revenue − Expenses             (= Net Income)
 */
function applyRootSignCorrection(accounts) {
    var _a;
    var roots = accounts.filter(function (a) { var _a; return (_a = a.isSystem) !== null && _a !== void 0 ? _a : a.parentId === null; });
    if (roots.length === 0)
        return accounts;
    var rootIds = new Set(roots.map(function (r) { return r.id; }));
    var childrenByRoot = new Map();
    for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
        var account = accounts_1[_i];
        if (account.parentId && rootIds.has(account.parentId)) {
            var list = (_a = childrenByRoot.get(account.parentId)) !== null && _a !== void 0 ? _a : [];
            list.push(account);
            childrenByRoot.set(account.parentId, list);
        }
    }
    return accounts.map(function (account) {
        var _a;
        if (!rootIds.has(account.id))
            return account;
        var children = (_a = childrenByRoot.get(account.id)) !== null && _a !== void 0 ? _a : [];
        var balance = 0;
        var balanceAtDate = 0;
        var netChange = 0;
        var translatedBalance = 0;
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            var sign = rootSignMultiplier(child.class);
            balance += sign * child.balance;
            balanceAtDate += sign * child.balanceAtDate;
            netChange += sign * child.netChange;
            if ("translatedBalance" in child &&
                typeof child.translatedBalance === "number") {
                translatedBalance += sign * child.translatedBalance;
            }
        }
        var result = __assign(__assign({}, account), { balance: balance, balanceAtDate: balanceAtDate, netChange: netChange });
        if ("translatedBalance" in account) {
            result.translatedBalance =
                translatedBalance;
        }
        return result;
    });
}
function getTrialBalance(client, companyGroupId, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            return [2 /*return*/, client.rpc("trialBalance", {
                    p_company_group_id: companyGroupId,
                    p_company_id: companyId !== null && companyId !== void 0 ? companyId : undefined,
                    from_date: (_a = args.startDate) !== null && _a !== void 0 ? _a : (0, utils_1.getDateNYearsAgo)(50).toISOString().split("T")[0],
                    to_date: (_b = args.endDate) !== null && _b !== void 0 ? _b : new Date().toISOString().split("T")[0]
                })];
        });
    });
}
function getFinancialStatementBalances(client, companyGroupId, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var accountsQuery, balancesQuery, _a, accountsResponse, balancesResponse, balancesByAccountId;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    accountsQuery = client
                        .from("accounts")
                        .select("*")
                        .eq("companyGroupId", companyGroupId)
                        .eq("active", true)
                        .order("number", { ascending: true });
                    balancesQuery = client.rpc("accountTreeBalancesByCompany", {
                        p_company_group_id: companyGroupId,
                        p_company_id: companyId !== null && companyId !== void 0 ? companyId : undefined,
                        from_date: (_b = args.startDate) !== null && _b !== void 0 ? _b : (0, utils_1.getDateNYearsAgo)(50).toISOString().split("T")[0],
                        to_date: (_c = args.endDate) !== null && _c !== void 0 ? _c : new Date().toISOString().split("T")[0]
                    });
                    return [4 /*yield*/, Promise.all([
                            accountsQuery,
                            balancesQuery
                        ])];
                case 1:
                    _a = _e.sent(), accountsResponse = _a[0], balancesResponse = _a[1];
                    if (accountsResponse.error)
                        return [2 /*return*/, accountsResponse];
                    if (balancesResponse.error)
                        return [2 /*return*/, balancesResponse];
                    balancesByAccountId = balancesResponse.data.reduce(function (acc, row) {
                        acc[row.accountId] = {
                            number: row.number,
                            netChange: row.netChange,
                            balance: row.balance,
                            balanceAtDate: row.balanceAtDate
                        };
                        return acc;
                    }, {});
                    return [2 /*return*/, {
                            data: applyRootSignCorrection(((_d = accountsResponse.data) !== null && _d !== void 0 ? _d : [])
                                .filter(function (a) { return a.id !== null; })
                                .map(function (account) {
                                var _a, _b, _c, _d, _e, _f;
                                return (__assign(__assign({}, account), { netChange: (_b = (_a = balancesByAccountId[account.id]) === null || _a === void 0 ? void 0 : _a.netChange) !== null && _b !== void 0 ? _b : 0, balance: (_d = (_c = balancesByAccountId[account.id]) === null || _c === void 0 ? void 0 : _c.balance) !== null && _d !== void 0 ? _d : 0, balanceAtDate: (_f = (_e = balancesByAccountId[account.id]) === null || _e === void 0 ? void 0 : _e.balanceAtDate) !== null && _f !== void 0 ? _f : 0 }));
                            })),
                            error: null
                        }];
            }
        });
    });
}
function getCompaniesInGroup(client, companyGroupId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("company")
                    .select("id, name, baseCurrencyCode, parentCompanyId, isEliminationEntity")
                    .eq("companyGroupId", companyGroupId)
                    .eq("active", true)
                    .eq("isEliminationEntity", false)
                    .order("name", { ascending: true })];
        });
    });
}
function deleteAccount(client, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("account").delete().eq("id", accountId)];
        });
    });
}
function deletePaymentTerm(client, paymentTermId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("paymentTerm")
                    .update({ active: false })
                    .eq("id", paymentTermId)];
        });
    });
}
function getAccount(client, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("account").select("*").eq("id", accountId).single()];
        });
    });
}
function getAccounts(client, companyGroupId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("account")
                .select("*", {
                count: "exact"
            })
                .eq("companyGroupId", companyGroupId)
                .eq("active", true);
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
function getAccountsList(client, companyGroupId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("account")
                .select("id, number, name, incomeBalance, class")
                .eq("companyGroupId", companyGroupId)
                .eq("active", true);
            if ((args === null || args === void 0 ? void 0 : args.isGroup) !== undefined && args.isGroup !== null) {
                query = query.eq("isGroup", args.isGroup);
            }
            if (args === null || args === void 0 ? void 0 : args.incomeBalance) {
                query = query.eq("incomeBalance", args.incomeBalance);
            }
            if ((args === null || args === void 0 ? void 0 : args.classes) && args.classes.length > 0) {
                query = query.in("class", args.classes);
            }
            query = query.order("number", { ascending: true });
            return [2 /*return*/, query];
        });
    });
}
function getGroupAccounts(client, companyGroupId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("account")
                    .select("id, number, name, incomeBalance, class, accountType")
                    .eq("companyGroupId", companyGroupId)
                    .eq("isGroup", true)
                    .eq("active", true)
                    .order("name", { ascending: true })];
        });
    });
}
function getBaseCurrency(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, company, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("company")
                        .select("baseCurrencyCode, companyGroupId")
                        .eq("id", companyId)
                        .single()];
                case 1:
                    _a = _b.sent(), company = _a.data, error = _a.error;
                    if (error) {
                        throw new Error("Failed to get company: ".concat(error.message));
                    }
                    if (!company || !company.baseCurrencyCode) {
                        throw new Error("Company or base currency code not found");
                    }
                    return [2 /*return*/, client
                            .from("currency")
                            .select("*")
                            .eq("code", company.baseCurrencyCode)
                            .eq("companyGroupId", company.companyGroupId)
                            .single()];
            }
        });
    });
}
function getChartOfAccounts(client, companyGroupId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var accountsQuery, balancesQuery, _a, accountsResponse, balancesResponse, balancesByAccountId;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    accountsQuery = client
                        .from("accounts")
                        .select("*")
                        .eq("companyGroupId", companyGroupId)
                        .eq("active", true)
                        .order("number", { ascending: true });
                    if (args.incomeBalance) {
                        accountsQuery = accountsQuery.eq("incomeBalance", args.incomeBalance);
                    }
                    balancesQuery = client.rpc("accountTreeBalances", {
                        p_company_group_id: companyGroupId,
                        from_date: (_b = args.startDate) !== null && _b !== void 0 ? _b : (0, utils_1.getDateNYearsAgo)(50).toISOString().split("T")[0],
                        to_date: (_c = args.endDate) !== null && _c !== void 0 ? _c : new Date().toISOString().split("T")[0]
                    });
                    return [4 /*yield*/, Promise.all([
                            accountsQuery,
                            balancesQuery
                        ])];
                case 1:
                    _a = _e.sent(), accountsResponse = _a[0], balancesResponse = _a[1];
                    if (accountsResponse.error)
                        return [2 /*return*/, accountsResponse];
                    if (balancesResponse.error)
                        return [2 /*return*/, balancesResponse];
                    balancesByAccountId = balancesResponse.data.reduce(function (acc, row) {
                        acc[row.accountId] = {
                            number: row.number,
                            netChange: row.netChange,
                            balance: row.balance,
                            balanceAtDate: row.balanceAtDate
                        };
                        return acc;
                    }, {});
                    return [2 /*return*/, {
                            data: applyRootSignCorrection(((_d = accountsResponse.data) !== null && _d !== void 0 ? _d : [])
                                .filter(function (a) { return a.id !== null; })
                                .map(function (account) {
                                var _a, _b, _c, _d, _e, _f;
                                return (__assign(__assign({}, account), { netChange: (_b = (_a = balancesByAccountId[account.id]) === null || _a === void 0 ? void 0 : _a.netChange) !== null && _b !== void 0 ? _b : 0, balance: (_d = (_c = balancesByAccountId[account.id]) === null || _c === void 0 ? void 0 : _c.balance) !== null && _d !== void 0 ? _d : 0, balanceAtDate: (_f = (_e = balancesByAccountId[account.id]) === null || _e === void 0 ? void 0 : _e.balanceAtDate) !== null && _f !== void 0 ? _f : 0 }));
                            })),
                            error: null
                        }];
            }
        });
    });
}
function getCurrency(client, currencyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("currency")
                    .select("*, currencyCode!inner(name)")
                    .eq("id", currencyId)
                    .single()];
        });
    });
}
function getCurrencyByCode(client, companyGroupId, currencyCode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("currencies")
                    .select("*")
                    .eq("code", currencyCode)
                    .eq("companyGroupId", companyGroupId)
                    .single()];
        });
    });
}
function getCurrencies(client, companyGroupId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("currencies")
                .select("*", {
                count: "exact"
            })
                .eq("companyGroupId", companyGroupId)
                .eq("active", true);
            if (args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            return [2 /*return*/, query];
        });
    });
}
function getCurrenciesList(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("currencyCode")
                    .select("code, name")
                    .order("name", { ascending: true })];
        });
    });
}
function getCurrentAccountingPeriod(client, companyId, date) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("accountingPeriod")
                    .select("*")
                    .eq("companyId", companyId)
                    .lte("startDate", date)
                    .gte("endDate", date)
                    .single()];
        });
    });
}
function getOrCreateAccountingPeriod(client, companyId, date) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, d, year, month, startDate, endDate, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCurrentAccountingPeriod(client, companyId, date)];
                case 1:
                    existing = _a.sent();
                    if (!existing.data) return [3 /*break*/, 5];
                    if (existing.data.closedAt) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "Accounting period is closed. Reopen it before posting."
                                }
                            }];
                    }
                    if (!(existing.data.status === "Inactive")) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("accountingPeriod")
                            .update({ status: "Inactive" })
                            .eq("companyId", companyId)
                            .eq("status", "Active")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client
                            .from("accountingPeriod")
                            .update({ status: "Active" })
                            .eq("id", existing.data.id)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, { data: existing.data.id, error: null }];
                case 5:
                    d = new Date(date);
                    year = d.getFullYear();
                    month = d.getMonth();
                    startDate = new Date(year, month, 1).toISOString().split("T")[0];
                    endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];
                    return [4 /*yield*/, client
                            .from("accountingPeriod")
                            .update({ status: "Inactive" })
                            .eq("companyId", companyId)
                            .eq("status", "Active")];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, client
                            .from("accountingPeriod")
                            .insert({
                            startDate: startDate,
                            endDate: endDate,
                            companyId: companyId,
                            status: "Active",
                            createdBy: "system"
                        })
                            .select("id")
                            .single()];
                case 7:
                    result = _a.sent();
                    if (result.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "Failed to create accounting period" }
                            }];
                    }
                    return [2 /*return*/, { data: result.data.id, error: null }];
            }
        });
    });
}
function getDefaultAccounts(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("accountDefault")
                    .select("*")
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getFiscalYearSettings(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("fiscalYearSettings")
                    .select("*")
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getPaymentTerm(client, paymentTermId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("paymentTerm")
                    .select("*")
                    .eq("id", paymentTermId)
                    .single()];
        });
    });
}
function getPaymentTerms(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("paymentTerm")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .eq("active", true);
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
function getPaymentTermsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("paymentTerm")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .eq("active", true)
                    .order("name", { ascending: true })];
        });
    });
}
function updateDefaultBalanceSheetAccounts(client, defaultAccounts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("accountDefault")
                    .update(defaultAccounts)
                    .eq("companyId", defaultAccounts.companyId)];
        });
    });
}
function updateDefaultIncomeAccounts(client, defaultAccounts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("accountDefault")
                    .update(defaultAccounts)
                    .eq("companyId", defaultAccounts.companyId)];
        });
    });
}
function updateFiscalYearSettings(client, fiscalYearSettings) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("fiscalYearSettings")
                    .update((0, supabase_1.sanitize)(fiscalYearSettings))
                    .eq("companyId", fiscalYearSettings.companyId)];
        });
    });
}
function upsertAccount(client, account) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in account) {
                return [2 /*return*/, client.from("account").insert([account]).select("*").single()];
            }
            return [2 /*return*/, client
                    .from("account")
                    .update((0, supabase_1.sanitize)(account))
                    .eq("id", account.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertCurrency(client, currency) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in currency) {
                return [2 /*return*/, client.from("currency").insert([currency]).select("*").single()];
            }
            return [2 /*return*/, client
                    .from("currency")
                    .update((0, supabase_1.sanitize)(currency))
                    .eq("id", currency.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertPaymentTerm(client, paymentTerm) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in paymentTerm) {
                return [2 /*return*/, client
                        .from("paymentTerm")
                        .insert([paymentTerm])
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("paymentTerm")
                    .update((0, supabase_1.sanitize)(paymentTerm))
                    .eq("id", paymentTerm.id)
                    .select("id")
                    .single()];
        });
    });
}
function deleteCostCenter(client, costCenterId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("costCenter").delete().eq("id", costCenterId)];
        });
    });
}
function getCostCenter(client, costCenterId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("costCenter").select("*").eq("id", costCenterId).single()];
        });
    });
}
function getCostCenters(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("costCenter")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getCostCentersList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("costCenter")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getCostCentersTree(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("costCenter")
                    .select("id, name, parentCostCenterId, ownerId, owner:user!costCenter_ownerId_fkey(fullName)")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function upsertCostCenter(client, costCenter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in costCenter) {
                return [2 /*return*/, client.from("costCenter").insert([costCenter]).select("id").single()];
            }
            return [2 /*return*/, client
                    .from("costCenter")
                    .update((0, supabase_1.sanitize)(costCenter))
                    .eq("id", costCenter.id)
                    .select("id")
                    .single()];
        });
    });
}
function getDimensions(client, companyGroupId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("dimension")
                .select("*, dimensionValue(id, name)", {
                count: "exact"
            })
                .eq("companyGroupId", companyGroupId)
                .eq("active", true);
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
function getDimension(client, dimensionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("dimension")
                    .select("*, dimensionValue(id, name)")
                    .eq("id", dimensionId)
                    .single()];
        });
    });
}
function upsertDimension(client, dimension, dimensionValues) {
    return __awaiter(this, void 0, void 0, function () {
        var dimensionResult, dimensionId_1, companyGroupId_1, existing, existingNames_1, desiredNames_1, toDelete, deleteResult, toInsert, insertResult;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!("createdBy" in dimension)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client
                            .from("dimension")
                            .insert([dimension])
                            .select("id, companyGroupId")
                            .single()];
                case 1:
                    dimensionResult = _c.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, client
                        .from("dimension")
                        .update((0, supabase_1.sanitize)(dimension))
                        .eq("id", dimension.id)
                        .select("id, companyGroupId")
                        .single()];
                case 3:
                    dimensionResult = _c.sent();
                    _c.label = 4;
                case 4:
                    if (dimensionResult.error)
                        return [2 /*return*/, dimensionResult];
                    if (!(dimension.entityType === "Custom" && dimensionValues !== undefined)) return [3 /*break*/, 9];
                    dimensionId_1 = dimensionResult.data.id;
                    companyGroupId_1 = dimensionResult.data.companyGroupId;
                    return [4 /*yield*/, client
                            .from("dimensionValue")
                            .select("id, name")
                            .eq("dimensionId", dimensionId_1)];
                case 5:
                    existing = _c.sent();
                    if (existing.error)
                        return [2 /*return*/, existing];
                    existingNames_1 = new Set(((_a = existing.data) !== null && _a !== void 0 ? _a : []).map(function (v) { return v.name; }));
                    desiredNames_1 = new Set(dimensionValues);
                    toDelete = ((_b = existing.data) !== null && _b !== void 0 ? _b : [])
                        .filter(function (v) { return !desiredNames_1.has(v.name); })
                        .map(function (v) { return v.id; });
                    if (!(toDelete.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("dimensionValue")
                            .delete()
                            .in("id", toDelete)];
                case 6:
                    deleteResult = _c.sent();
                    if (deleteResult.error)
                        return [2 /*return*/, deleteResult];
                    _c.label = 7;
                case 7:
                    toInsert = dimensionValues
                        .filter(function (name) { return !existingNames_1.has(name); })
                        .map(function (name) { return ({
                        dimensionId: dimensionId_1,
                        name: name,
                        companyGroupId: companyGroupId_1,
                        createdBy: "createdBy" in dimension ? dimension.createdBy : dimension.updatedBy
                    }); });
                    if (!(toInsert.length > 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, client.from("dimensionValue").insert(toInsert)];
                case 8:
                    insertResult = _c.sent();
                    if (insertResult.error)
                        return [2 /*return*/, insertResult];
                    _c.label = 9;
                case 9: return [2 /*return*/, dimensionResult];
            }
        });
    });
}
function deleteDimension(client, dimensionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("dimension")
                    .update({ active: false })
                    .eq("id", dimensionId)];
        });
    });
}
function getActiveDimensionsWithValues(client, companyGroupId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var dimensionsResult, dimensions, customDimensionIds, entityTypes, _a, customValues, entityResults, entityValuesByType, customValuesByDimension, _i, _b, v, existing;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, client
                        .from("dimension")
                        .select("id, name, entityType, required")
                        .eq("companyGroupId", companyGroupId)
                        .eq("active", true)
                        .order("name")];
                case 1:
                    dimensionsResult = _f.sent();
                    if (dimensionsResult.error)
                        return [2 /*return*/, dimensionsResult];
                    dimensions = (_c = dimensionsResult.data) !== null && _c !== void 0 ? _c : [];
                    customDimensionIds = dimensions
                        .filter(function (d) { return d.entityType === "Custom"; })
                        .map(function (d) { return d.id; });
                    entityTypes = __spreadArray([], new Set(dimensions
                        .filter(function (d) { return d.entityType !== "Custom"; })
                        .map(function (d) { return d.entityType; })), true);
                    return [4 /*yield*/, Promise.all(__spreadArray([
                            customDimensionIds.length > 0
                                ? client
                                    .from("dimensionValue")
                                    .select("id, name, dimensionId")
                                    .in("dimensionId", customDimensionIds)
                                : Promise.resolve({
                                    data: [],
                                    error: null
                                })
                        ], entityTypes.map(function (et) { return getEntityDimensionValues(client, et, companyId); }), true))];
                case 2:
                    _a = _f.sent(), customValues = _a[0], entityResults = _a.slice(1);
                    if (customValues.error)
                        return [2 /*return*/, customValues];
                    entityValuesByType = new Map();
                    entityTypes.forEach(function (et, i) {
                        var result = entityResults[i];
                        if (result && !result.error && result.data) {
                            entityValuesByType.set(et, result.data);
                        }
                    });
                    customValuesByDimension = new Map();
                    for (_i = 0, _b = (_d = customValues.data) !== null && _d !== void 0 ? _d : []; _i < _b.length; _i++) {
                        v = _b[_i];
                        existing = (_e = customValuesByDimension.get(v.dimensionId)) !== null && _e !== void 0 ? _e : [];
                        existing.push({ id: v.id, name: v.name });
                        customValuesByDimension.set(v.dimensionId, existing);
                    }
                    return [2 /*return*/, {
                            data: dimensions.map(function (d) {
                                var _a, _b;
                                return ({
                                    dimensionId: d.id,
                                    dimensionName: d.name,
                                    entityType: d.entityType,
                                    required: d.required,
                                    values: d.entityType === "Custom"
                                        ? ((_a = customValuesByDimension.get(d.id)) !== null && _a !== void 0 ? _a : [])
                                        : ((_b = entityValuesByType.get(d.entityType)) !== null && _b !== void 0 ? _b : [])
                                });
                            }),
                            error: null
                        }];
            }
        });
    });
}
function getEntityDimensionValues(client, entityType, companyId) {
    switch (entityType) {
        case "Location":
            return client
                .from("location")
                .select("id, name")
                .eq("companyId", companyId)
                .order("name");
        case "Department":
            return client
                .from("department")
                .select("id, name")
                .eq("companyId", companyId)
                .order("name");
        case "Employee":
            return client
                .from("employeeSummary")
                .select("id, name")
                .eq("companyId", companyId)
                .order("name");
        case "CustomerType":
            return client
                .from("customerType")
                .select("id, name")
                .eq("companyId", companyId)
                .order("name");
        case "SupplierType":
            return client
                .from("supplierType")
                .select("id, name")
                .eq("companyId", companyId)
                .order("name");
        case "FixedAssetClass":
            return client
                .from("fixedAssetClass")
                .select("id, name")
                .eq("companyId", companyId)
                .order("name");
        case "ItemPostingGroup":
            return client
                .from("itemPostingGroup")
                .select("id, name")
                .eq("companyId", companyId)
                .order("name");
        case "CostCenter":
            return client
                .from("costCenter")
                .select("id, name")
                .eq("companyId", companyId)
                .order("name");
        default:
            return Promise.resolve({
                data: [],
                error: null
            });
    }
}
function getJournalLineDimensions(client, journalLineIds) {
    return __awaiter(this, void 0, void 0, function () {
        var result, rows, valueIdsByType, _i, rows_1, row, et, valueNameMap, resolutions, _a, resolutions_1, batch, _b, _c, item, grouped, _d, rows_2, row;
        var _this = this;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (journalLineIds.length === 0) {
                        return [2 /*return*/, {
                                data: {},
                                error: null
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("journalLineDimension")
                            .select("journalLineId, dimensionId, valueId, dimension:dimensionId(name, entityType)")
                            .in("journalLineId", journalLineIds)];
                case 1:
                    result = _f.sent();
                    if (result.error)
                        return [2 /*return*/, { data: null, error: result.error }];
                    rows = result.data;
                    valueIdsByType = new Map();
                    for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                        row = rows_1[_i];
                        et = row.dimension.entityType;
                        if (!valueIdsByType.has(et))
                            valueIdsByType.set(et, new Set());
                        valueIdsByType.get(et).add(row.valueId);
                    }
                    valueNameMap = new Map();
                    return [4 /*yield*/, Promise.all(Array.from(valueIdsByType.entries()).map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                            var ids, res_1, res;
                            var _c, _d;
                            var entityType = _b[0], valueIds = _b[1];
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        ids = __spreadArray([], valueIds, true);
                                        if (!(entityType === "Custom")) return [3 /*break*/, 2];
                                        return [4 /*yield*/, client
                                                .from("dimensionValue")
                                                .select("id, name")
                                                .in("id", ids)];
                                    case 1:
                                        res_1 = _e.sent();
                                        return [2 /*return*/, (_c = res_1.data) !== null && _c !== void 0 ? _c : []];
                                    case 2: return [4 /*yield*/, getEntityValuesByIds(client, entityType, ids)];
                                    case 3:
                                        res = _e.sent();
                                        return [2 /*return*/, (_d = res.data) !== null && _d !== void 0 ? _d : []];
                                }
                            });
                        }); }))];
                case 2:
                    resolutions = _f.sent();
                    for (_a = 0, resolutions_1 = resolutions; _a < resolutions_1.length; _a++) {
                        batch = resolutions_1[_a];
                        for (_b = 0, _c = batch; _b < _c.length; _b++) {
                            item = _c[_b];
                            valueNameMap.set(item.id, item.name);
                        }
                    }
                    grouped = {};
                    for (_d = 0, rows_2 = rows; _d < rows_2.length; _d++) {
                        row = rows_2[_d];
                        if (!grouped[row.journalLineId])
                            grouped[row.journalLineId] = [];
                        grouped[row.journalLineId].push({
                            dimensionId: row.dimensionId,
                            dimensionName: row.dimension.name,
                            valueId: row.valueId,
                            valueName: (_e = valueNameMap.get(row.valueId)) !== null && _e !== void 0 ? _e : row.valueId
                        });
                    }
                    return [2 /*return*/, { data: grouped, error: null }];
            }
        });
    });
}
function getEntityValuesByIds(client, entityType, ids) {
    switch (entityType) {
        case "Location":
            return client.from("location").select("id, name").in("id", ids);
        case "Department":
            return client.from("department").select("id, name").in("id", ids);
        case "Employee":
            return client.from("employeeSummary").select("id, name").in("id", ids);
        case "CustomerType":
            return client.from("customerType").select("id, name").in("id", ids);
        case "SupplierType":
            return client.from("supplierType").select("id, name").in("id", ids);
        case "ItemPostingGroup":
            return client.from("itemPostingGroup").select("id, name").in("id", ids);
        case "CostCenter":
            return client.from("costCenter").select("id, name").in("id", ids);
        case "FixedAssetClass":
            return client.from("fixedAssetClass").select("id, name").in("id", ids);
        default:
            return Promise.resolve({
                data: [],
                error: null
            });
    }
}
function saveJournalLineDimensions(client, journalLineId, companyId, dimensions) {
    return __awaiter(this, void 0, void 0, function () {
        var deleteResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("journalLineDimension")
                        .delete()
                        .eq("journalLineId", journalLineId)];
                case 1:
                    deleteResult = _a.sent();
                    if (deleteResult.error)
                        return [2 /*return*/, deleteResult];
                    if (dimensions.length === 0)
                        return [2 /*return*/, { data: null, error: null }];
                    return [2 /*return*/, client.from("journalLineDimension").insert(dimensions.map(function (d) { return ({
                            journalLineId: journalLineId,
                            dimensionId: d.dimensionId,
                            valueId: d.valueId,
                            companyId: companyId
                        }); }))];
            }
        });
    });
}
function translateCompanyBalances(client, companyGroupId, companyId, targetCurrency, periodEnd, periodStart) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, rows, accountIds, accounts, classById, totalTranslatedAssets, totalTranslatedLiabilitiesAndEquity, _i, rows_3, row, cls, cta;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.rpc("translateTrialBalance", {
                        p_company_group_id: companyGroupId,
                        p_company_id: companyId !== null && companyId !== void 0 ? companyId : undefined,
                        p_target_currency: targetCurrency,
                        p_period_end: periodEnd,
                        p_period_start: periodStart !== null && periodStart !== void 0 ? periodStart : undefined
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        return [2 /*return*/, { data: null, cta: 0, error: error.message }];
                    }
                    rows = (data !== null && data !== void 0 ? data : []);
                    accountIds = rows.map(function (r) { return r.accountId; });
                    return [4 /*yield*/, client
                            .from("account")
                            .select("id, class")
                            .in("id", accountIds)];
                case 2:
                    accounts = (_b.sent()).data;
                    classById = new Map((accounts !== null && accounts !== void 0 ? accounts : []).map(function (a) { return [a.id, a.class]; }));
                    totalTranslatedAssets = 0;
                    totalTranslatedLiabilitiesAndEquity = 0;
                    for (_i = 0, rows_3 = rows; _i < rows_3.length; _i++) {
                        row = rows_3[_i];
                        cls = classById.get(row.accountId);
                        if (cls === "Asset") {
                            totalTranslatedAssets += Number(row.translatedBalance);
                        }
                        else {
                            // Liability, Equity, Revenue, Expense (but income statement
                            // accounts net to retained earnings on balance sheet)
                            totalTranslatedLiabilitiesAndEquity += Number(row.translatedBalance);
                        }
                    }
                    cta = totalTranslatedAssets - totalTranslatedLiabilitiesAndEquity;
                    return [2 /*return*/, { data: rows, cta: cta, error: null }];
            }
        });
    });
}
function getConsolidatedBalances(client, companyGroupId, companyIds, targetCurrency, periodEnd, periodStart) {
    return __awaiter(this, void 0, void 0, function () {
        var allGroupCompanies, groupCompanies, selectedSet, ancestors, companyById, _i, companyIds_1, id, current, eliminationIds, allIds, _a, allBalances, translations, translationByAccount, _b, translations_1, translation, _c, _d, row, existing, totalCta, accountMap, _e, allBalances_1, result, _f, _g, account, existing, _h, translationByAccount_1, _j, accountId, translation, account, baseAccounts, consolidated;
        var _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0: return [4 /*yield*/, client
                        .from("company")
                        .select("id, parentCompanyId, isEliminationEntity")
                        .eq("companyGroupId", companyGroupId)
                        .eq("active", true)];
                case 1:
                    allGroupCompanies = (_t.sent()).data;
                    groupCompanies = allGroupCompanies !== null && allGroupCompanies !== void 0 ? allGroupCompanies : [];
                    selectedSet = new Set(companyIds);
                    ancestors = new Set();
                    companyById = new Map(groupCompanies.map(function (c) { return [c.id, c]; }));
                    for (_i = 0, companyIds_1 = companyIds; _i < companyIds_1.length; _i++) {
                        id = companyIds_1[_i];
                        current = companyById.get(id);
                        while (current === null || current === void 0 ? void 0 : current.parentCompanyId) {
                            ancestors.add(current.parentCompanyId);
                            current = companyById.get(current.parentCompanyId);
                        }
                    }
                    eliminationIds = groupCompanies
                        .filter(function (c) {
                        return c.isEliminationEntity &&
                            c.parentCompanyId &&
                            (ancestors.has(c.parentCompanyId) || selectedSet.has(c.parentCompanyId));
                    })
                        .map(function (c) { return c.id; });
                    allIds = __spreadArray(__spreadArray([], companyIds, true), eliminationIds, true);
                    return [4 /*yield*/, Promise.all([
                            Promise.all(allIds.map(function (id) {
                                return getFinancialStatementBalances(client, companyGroupId, id, {
                                    startDate: periodStart !== null && periodStart !== void 0 ? periodStart : null,
                                    endDate: periodEnd
                                });
                            })),
                            Promise.all(allIds.map(function (id) {
                                return translateCompanyBalances(client, companyGroupId, id, targetCurrency, periodEnd, periodStart);
                            }))
                        ])];
                case 2:
                    _a = _t.sent(), allBalances = _a[0], translations = _a[1];
                    translationByAccount = new Map();
                    for (_b = 0, translations_1 = translations; _b < translations_1.length; _b++) {
                        translation = translations_1[_b];
                        if (!translation.data)
                            continue;
                        for (_c = 0, _d = translation.data; _c < _d.length; _c++) {
                            row = _d[_c];
                            existing = translationByAccount.get(row.accountId);
                            if (existing) {
                                existing.translatedBalance += Number(row.translatedBalance);
                            }
                            else {
                                translationByAccount.set(row.accountId, {
                                    translatedBalance: Number(row.translatedBalance),
                                    exchangeRate: Number(row.exchangeRate)
                                });
                            }
                        }
                    }
                    totalCta = translations.reduce(function (sum, t) { return sum + t.cta; }, 0);
                    accountMap = new Map();
                    for (_e = 0, allBalances_1 = allBalances; _e < allBalances_1.length; _e++) {
                        result = allBalances_1[_e];
                        if (result.error || !result.data)
                            continue;
                        for (_f = 0, _g = result.data; _f < _g.length; _f++) {
                            account = _g[_f];
                            existing = accountMap.get(account.id);
                            if (existing) {
                                existing.balance += (_k = account.balance) !== null && _k !== void 0 ? _k : 0;
                                existing.balanceAtDate += (_l = account.balanceAtDate) !== null && _l !== void 0 ? _l : 0;
                                existing.netChange += (_m = account.netChange) !== null && _m !== void 0 ? _m : 0;
                            }
                            else {
                                accountMap.set(account.id, {
                                    balance: (_o = account.balance) !== null && _o !== void 0 ? _o : 0,
                                    balanceAtDate: (_p = account.balanceAtDate) !== null && _p !== void 0 ? _p : 0,
                                    netChange: (_q = account.netChange) !== null && _q !== void 0 ? _q : 0,
                                    translatedBalance: 0,
                                    exchangeRate: 0
                                });
                            }
                        }
                    }
                    // Overlay translated values
                    for (_h = 0, translationByAccount_1 = translationByAccount; _h < translationByAccount_1.length; _h++) {
                        _j = translationByAccount_1[_h], accountId = _j[0], translation = _j[1];
                        account = accountMap.get(accountId);
                        if (account) {
                            account.translatedBalance = translation.translatedBalance;
                            account.exchangeRate = translation.exchangeRate;
                        }
                    }
                    baseAccounts = (_s = (_r = allBalances.find(function (r) { return r.data; })) === null || _r === void 0 ? void 0 : _r.data) !== null && _s !== void 0 ? _s : [];
                    consolidated = baseAccounts.map(function (account) {
                        var _a, _b, _c, _d, _e;
                        var summed = accountMap.get(account.id);
                        return __assign(__assign({}, account), { balance: (_a = summed === null || summed === void 0 ? void 0 : summed.balance) !== null && _a !== void 0 ? _a : 0, balanceAtDate: (_b = summed === null || summed === void 0 ? void 0 : summed.balanceAtDate) !== null && _b !== void 0 ? _b : 0, netChange: (_c = summed === null || summed === void 0 ? void 0 : summed.netChange) !== null && _c !== void 0 ? _c : 0, translatedBalance: (_d = summed === null || summed === void 0 ? void 0 : summed.translatedBalance) !== null && _d !== void 0 ? _d : 0, exchangeRate: (_e = summed === null || summed === void 0 ? void 0 : summed.exchangeRate) !== null && _e !== void 0 ? _e : 0 });
                    });
                    return [2 /*return*/, { data: applyRootSignCorrection(consolidated), cta: totalCta }];
            }
        });
    });
}
// -- Intercompany --
function getIntercompanyTransactions(client, companyGroupId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("intercompanyTransaction")
                .select("*, sourceCompany:company!intercompanyTransaction_sourceCompanyId_fkey(name), targetCompany:company!intercompanyTransaction_targetCompanyId_fkey(name)", { count: "exact" })
                .eq("companyGroupId", companyGroupId);
            if (args.status) {
                query = query.eq("status", args.status);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "createdAt", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function createIntercompanyTransaction(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var today, postingDate, nextSequence, journal, journalId, journalLineRef, journalLines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    today = new Date().toISOString().split("T")[0];
                    postingDate = input.postingDate || today;
                    return [4 /*yield*/, (0, settings_1.getNextSequence)(client, "journalEntry", input.sourceCompanyId)];
                case 1:
                    nextSequence = _a.sent();
                    if (nextSequence.error)
                        return [2 /*return*/, nextSequence];
                    return [4 /*yield*/, client
                            .from("journal")
                            .insert({
                            journalEntryId: nextSequence.data,
                            description: "IC: ".concat(input.description),
                            companyId: input.sourceCompanyId,
                            postingDate: postingDate
                        })
                            .select("id")
                            .single()];
                case 2:
                    journal = _a.sent();
                    if (journal.error)
                        return [2 /*return*/, journal];
                    journalId = journal.data.id;
                    journalLineRef = crypto.randomUUID();
                    return [4 /*yield*/, client
                            .from("journalLine")
                            .insert([
                            {
                                journalId: journalId,
                                accountId: input.debitAccountId,
                                description: input.description,
                                amount: input.amount,
                                journalLineReference: journalLineRef,
                                intercompanyPartnerId: input.targetCompanyId,
                                companyId: input.sourceCompanyId,
                                companyGroupId: input.companyGroupId
                            },
                            {
                                journalId: journalId,
                                accountId: input.creditAccountId,
                                description: input.description,
                                amount: -input.amount,
                                journalLineReference: journalLineRef,
                                intercompanyPartnerId: input.targetCompanyId,
                                companyId: input.sourceCompanyId,
                                companyGroupId: input.companyGroupId
                            }
                        ])
                            .select("id")];
                case 3:
                    journalLines = _a.sent();
                    if (journalLines.error)
                        return [2 /*return*/, journalLines];
                    // Create intercompany transaction record
                    return [2 /*return*/, client
                            .from("intercompanyTransaction")
                            .insert({
                            companyGroupId: input.companyGroupId,
                            sourceCompanyId: input.sourceCompanyId,
                            targetCompanyId: input.targetCompanyId,
                            sourceJournalLineId: journalLines.data[0].id,
                            amount: input.amount,
                            currencyCode: input.currencyCode,
                            description: input.description,
                            status: "Unmatched"
                        })
                            .select("id")
                            .single()];
            }
        });
    });
}
function runIntercompanyMatching(client, companyGroupId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("matchIntercompanyTransactions", {
                    p_company_group_id: companyGroupId
                })];
        });
    });
}
function generateEliminations(client, companyGroupId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("generateEliminationEntries", {
                    p_company_group_id: companyGroupId,
                    p_user_id: userId
                })];
        });
    });
}
function getIntercompanyBalance(client, companyGroupId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("getIntercompanyBalance", {
                    p_company_group_id: companyGroupId
                })];
        });
    });
}
function getExchangeRateHistory(client, companyGroupId, currencyCode) {
    return __awaiter(this, void 0, void 0, function () {
        var sixMonthsAgo;
        return __generator(this, function (_a) {
            sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            return [2 /*return*/, client
                    .from("exchangeRateHistory")
                    .select("effectiveDate, rate")
                    .eq("companyGroupId", companyGroupId)
                    .eq("currencyCode", currencyCode)
                    .gte("effectiveDate", sixMonthsAgo.toISOString().split("T")[0])
                    .order("effectiveDate", { ascending: true })];
        });
    });
}
// -- Journal Entries --
// Uses existing journal/journalLine tables with added status/entryType columns.
// Manual JEs start as Draft and are posted by flipping status to Posted.
// amount > 0 = debit, amount < 0 = credit.
function getJournalEntries(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("journalEntries")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("journalEntryId.ilike.%".concat(args.search, "%,description.ilike.%").concat(args.search, "%"));
            }
            if (args.status) {
                query = query.eq("status", args.status);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "createdAt", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getJournalEntry(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("journal")
                    .select("*, journalLine(*, account!journalLine_accountId_fkey(class))")
                    .eq("id", id)
                    .single()];
        });
    });
}
function createJournalEntry(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _id, rest;
        return __generator(this, function (_a) {
            _id = data.id, rest = __rest(data, ["id"]);
            return [2 /*return*/, client
                    .from("journal")
                    .insert(__assign(__assign({}, rest), { status: "Draft" }))
                    .select("id")
                    .single()];
        });
    });
}
function updateJournalEntry(client, id, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _id, rest;
        return __generator(this, function (_a) {
            _id = data.id, rest = __rest(data, ["id"]);
            return [2 /*return*/, client
                    .from("journal")
                    .update((0, supabase_1.sanitize)(rest))
                    .eq("id", id)
                    .eq("status", "Draft")];
        });
    });
}
function deleteJournalEntry(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("journal").delete().eq("id", id).eq("status", "Draft")];
        });
    });
}
function upsertJournalEntryLine(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var account, amount;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client
                        .from("account")
                        .select("class")
                        .eq("id", data.accountId)
                        .single()];
                case 1:
                    account = _d.sent();
                    if (account.error || !((_a = account.data) === null || _a === void 0 ? void 0 : _a.class)) {
                        return [2 /*return*/, { data: null, error: { message: "Account not found" } }];
                    }
                    amount = (0, utils_1.toStoredAmount)((_b = data.debit) !== null && _b !== void 0 ? _b : 0, (_c = data.credit) !== null && _c !== void 0 ? _c : 0, account.data.class);
                    if ("companyId" in data) {
                        return [2 /*return*/, client
                                .from("journalLine")
                                .insert({
                                journalId: data.journalId,
                                accountId: data.accountId,
                                description: data.description,
                                amount: amount,
                                journalLineReference: crypto.randomUUID(),
                                companyId: data.companyId
                            })
                                .select("id")
                                .single()];
                    }
                    else {
                        return [2 /*return*/, client
                                .from("journalLine")
                                .update((0, supabase_1.sanitize)({
                                accountId: data.accountId,
                                description: data.description,
                                amount: amount,
                                updatedBy: data.updatedBy
                            }))
                                .eq("id", data.id)
                                .select("id")
                                .single()];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function deleteJournalEntryLine(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("journalLine").delete().eq("id", id)];
        });
    });
}
function saveJournalEntryWithLines(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var headerUpdate, deleteResult, accountIds, accounts, accountMap, inserts, insertResult, newLineIds, dimensionInserts, i, lineDims, _i, lineDims_1, d, dimInsertResult;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("journal")
                        .update((0, supabase_1.sanitize)({
                        postingDate: data.postingDate,
                        description: data.description,
                        updatedBy: data.updatedBy
                    }))
                        .eq("id", data.journalEntryId)
                        .eq("status", "Draft")];
                case 1:
                    headerUpdate = _c.sent();
                    if (headerUpdate.error)
                        return [2 /*return*/, headerUpdate];
                    return [4 /*yield*/, client
                            .from("journalLine")
                            .delete()
                            .eq("journalId", data.journalEntryId)];
                case 2:
                    deleteResult = _c.sent();
                    if (deleteResult.error)
                        return [2 /*return*/, deleteResult];
                    if (data.lines.length === 0)
                        return [2 /*return*/, { data: null, error: null }];
                    accountIds = __spreadArray([], new Set(data.lines.map(function (l) { return l.accountId; })), true);
                    return [4 /*yield*/, client
                            .from("account")
                            .select("id, class")
                            .in("id", accountIds)];
                case 3:
                    accounts = _c.sent();
                    if (accounts.error)
                        return [2 /*return*/, accounts];
                    accountMap = new Map(accounts.data.map(function (a) { return [a.id, a.class]; }));
                    inserts = data.lines.map(function (line) {
                        var accountClass = accountMap.get(line.accountId);
                        if (!accountClass) {
                            throw new Error("Account not found: ".concat(line.accountId));
                        }
                        return {
                            journalId: data.journalEntryId,
                            accountId: line.accountId,
                            description: line.description,
                            amount: (0, utils_1.toStoredAmount)(line.debit, line.credit, accountClass),
                            journalLineReference: crypto.randomUUID(),
                            companyId: data.companyId
                        };
                    });
                    return [4 /*yield*/, client
                            .from("journalLine")
                            .insert(inserts)
                            .select("id")];
                case 4:
                    insertResult = _c.sent();
                    if (insertResult.error)
                        return [2 /*return*/, insertResult];
                    newLineIds = ((_a = insertResult.data) !== null && _a !== void 0 ? _a : []).map(function (l) { return l.id; });
                    dimensionInserts = [];
                    for (i = 0; i < newLineIds.length; i++) {
                        lineDims = (_b = data.lines[i]) === null || _b === void 0 ? void 0 : _b.dimensions;
                        if (lineDims) {
                            for (_i = 0, lineDims_1 = lineDims; _i < lineDims_1.length; _i++) {
                                d = lineDims_1[_i];
                                dimensionInserts.push({
                                    journalLineId: newLineIds[i],
                                    dimensionId: d.dimensionId,
                                    valueId: d.valueId,
                                    companyId: data.companyId
                                });
                            }
                        }
                    }
                    if (!(dimensionInserts.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("journalLineDimension")
                            .insert(dimensionInserts)];
                case 5:
                    dimInsertResult = _c.sent();
                    if (dimInsertResult.error)
                        return [2 /*return*/, dimInsertResult];
                    _c.label = 6;
                case 6: return [2 /*return*/, insertResult];
            }
        });
    });
}
function postJournalEntry(client, id, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var entry, lines, total;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getJournalEntry(client, id)];
                case 1:
                    entry = _b.sent();
                    if (entry.error)
                        return [2 /*return*/, entry];
                    if (entry.data.status !== "Draft") {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "Journal entry is not in Draft status" }
                            }];
                    }
                    lines = (_a = entry.data.journalLine) !== null && _a !== void 0 ? _a : [];
                    if (lines.length === 0) {
                        return [2 /*return*/, { data: null, error: { message: "Journal entry has no lines" } }];
                    }
                    total = lines.reduce(function (sum, l) { return sum + Number(l.amount); }, 0);
                    if (Math.abs(total) > 0.001) {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "Total debits must equal total credits" }
                            }];
                    }
                    // 3. Flip status — lines are already in journalLine, no copying needed
                    return [2 /*return*/, client
                            .from("journal")
                            .update({
                            status: "Posted",
                            postedAt: new Date().toISOString(),
                            postedBy: userId,
                            updatedBy: userId
                        })
                            .eq("id", id)
                            .select("id")
                            .single()];
            }
        });
    });
}
function reverseJournalEntry(client, id, data) {
    return __awaiter(this, void 0, void 0, function () {
        var original, journalEntryId, seq, reversed, lines, linesResult, updateResult;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getJournalEntry(client, id)];
                case 1:
                    original = _c.sent();
                    if (original.error)
                        return [2 /*return*/, original];
                    if (original.data.status !== "Posted") {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "Can only reverse posted journal entries" }
                            }];
                    }
                    if (!data.journalEntryId) return [3 /*break*/, 2];
                    journalEntryId = data.journalEntryId;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "journalEntry",
                        company_id: data.companyId
                    })];
                case 3:
                    seq = _c.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_a = seq.error) !== null && _a !== void 0 ? _a : {
                                    message: "Failed to generate journalEntry sequence"
                                }
                            }];
                    }
                    journalEntryId = seq.data;
                    _c.label = 4;
                case 4: return [4 /*yield*/, client
                        .from("journal")
                        .insert({
                        journalEntryId: journalEntryId,
                        companyId: data.companyId,
                        description: "Reversal of ".concat(original.data.journalEntryId),
                        postingDate: new Date().toISOString().split("T")[0],
                        sourceType: "Manual",
                        reversalOfId: id,
                        status: "Posted",
                        postedAt: new Date().toISOString(),
                        postedBy: data.userId,
                        createdBy: data.userId
                    })
                        .select("id")
                        .single()];
                case 5:
                    reversed = _c.sent();
                    if (reversed.error)
                        return [2 /*return*/, reversed];
                    lines = ((_b = original.data.journalLine) !== null && _b !== void 0 ? _b : []).map(function (line) { return ({
                        journalId: reversed.data.id,
                        accountId: line.accountId,
                        companyId: line.companyId,
                        description: line.description,
                        amount: -Number(line.amount),
                        journalLineReference: crypto.randomUUID()
                    }); });
                    if (!(lines.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, client.from("journalLine").insert(lines)];
                case 6:
                    linesResult = _c.sent();
                    if (linesResult.error)
                        return [2 /*return*/, linesResult];
                    _c.label = 7;
                case 7: return [4 /*yield*/, client
                        .from("journal")
                        .update({
                        status: "Reversed",
                        reversedById: reversed.data.id,
                        updatedBy: data.userId
                    })
                        .eq("id", id)];
                case 8:
                    updateResult = _c.sent();
                    if (updateResult.error)
                        return [2 /*return*/, updateResult];
                    return [2 /*return*/, reversed];
            }
        });
    });
}
// -- Asset Classes --
function getFixedAssetClasses(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("fixedAssetClass")
                .select("id, name, description, depreciationMethod, usefulLifeMonths, residualValuePercent, taxDepreciationMethod, taxUsefulLifeMonths, macrsPropertyClass", { count: "exact" })
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
function getFixedAssetClass(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("fixedAssetClass").select("*").eq("id", id).single()];
        });
    });
}
function getFixedAssetClassesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("fixedAssetClass")
                    .select("id, name, depreciationMethod, usefulLifeMonths, residualValuePercent, taxDepreciationMethod, taxUsefulLifeMonths, taxResidualValuePercent, macrsPropertyClass, macrsConvention, bonusDepreciationPercent")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function upsertFixedAssetClass(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var id, rest;
        return __generator(this, function (_a) {
            if ("createdBy" in data) {
                return [2 /*return*/, client
                        .from("fixedAssetClass")
                        .insert([data])
                        .select("id")
                        .single()];
            }
            id = data.id, rest = __rest(data, ["id"]);
            return [2 /*return*/, client
                    .from("fixedAssetClass")
                    .update((0, supabase_1.sanitize)(rest))
                    .eq("id", id)
                    .select("id")
                    .single()];
        });
    });
}
function deleteFixedAssetClass(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("fixedAssetClass").delete().eq("id", id)];
        });
    });
}
// -- Fixed Assets --
function getFixedAssets(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("fixedAsset")
                .select("id, fixedAssetId, fixedAssetClassId, name, serialNumber, status, depreciationMethod, acquisitionCost, accumulatedDepreciation, fixedAssetClass:fixedAssetClassId(id, name), location:locationId(id, name)", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("name.ilike.%".concat(args.search, "%,fixedAssetId.ilike.%").concat(args.search, "%,serialNumber.ilike.%").concat(args.search, "%"));
            }
            if (args.status) {
                query = query.eq("status", args.status);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "fixedAssetId", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getFixedAsset(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("fixedAsset")
                    .select("*, fixedAssetClass:fixedAssetClassId(*), location:locationId(id, name)")
                    .eq("id", id)
                    .single()];
        });
    });
}
function getFixedAssetsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("fixedAsset")
                    .select("id, fixedAssetId, name")
                    .eq("companyId", companyId)
                    .eq("status", "Draft")
                    .order("fixedAssetId")];
        });
    });
}
function getFixedAssetsListForSale(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("fixedAsset")
                    .select("id, fixedAssetId, name")
                    .eq("companyId", companyId)
                    .in("status", ["Active", "Fully Depreciated"])
                    .order("fixedAssetId")];
        });
    });
}
function insertFixedAsset(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var fixedAssetId, seq, asset;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    if (!input.fixedAssetId) return [3 /*break*/, 1];
                    fixedAssetId = input.fixedAssetId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "fixedAsset",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _o.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_a = seq.error) !== null && _a !== void 0 ? _a : {
                                    message: "Failed to generate fixedAsset sequence"
                                }
                            }];
                    }
                    fixedAssetId = seq.data;
                    _o.label = 3;
                case 3: return [4 /*yield*/, client
                        .from("fixedAsset")
                        .insert({
                        fixedAssetId: fixedAssetId,
                        fixedAssetClassId: input.fixedAssetClassId,
                        name: input.name,
                        description: (_b = input.description) !== null && _b !== void 0 ? _b : null,
                        serialNumber: (_c = input.serialNumber) !== null && _c !== void 0 ? _c : null,
                        depreciationMethod: input.depreciationMethod,
                        usefulLifeMonths: input.usefulLifeMonths,
                        residualValuePercent: input.residualValuePercent,
                        assetLifetimeUsage: (_d = input.assetLifetimeUsage) !== null && _d !== void 0 ? _d : null,
                        locationId: (_e = input.locationId) !== null && _e !== void 0 ? _e : null,
                        status: (_f = input.status) !== null && _f !== void 0 ? _f : "Draft",
                        taxDepreciationMethod: (_g = input.taxDepreciationMethod) !== null && _g !== void 0 ? _g : null,
                        taxUsefulLifeMonths: (_h = input.taxUsefulLifeMonths) !== null && _h !== void 0 ? _h : null,
                        taxResidualValuePercent: (_j = input.taxResidualValuePercent) !== null && _j !== void 0 ? _j : null,
                        macrsPropertyClass: (_k = input.macrsPropertyClass) !== null && _k !== void 0 ? _k : null,
                        macrsConvention: (_l = input.macrsConvention) !== null && _l !== void 0 ? _l : null,
                        bonusDepreciationPercent: (_m = input.bonusDepreciationPercent) !== null && _m !== void 0 ? _m : null,
                        companyId: input.companyId,
                        createdBy: input.createdBy,
                        updatedBy: input.createdBy
                    })
                        .select("id, fixedAssetId")
                        .single()];
                case 4:
                    asset = _o.sent();
                    if (asset.error)
                        return [2 /*return*/, { data: null, error: asset.error }];
                    return [2 /*return*/, {
                            data: { id: asset.data.id, fixedAssetId: asset.data.fixedAssetId },
                            error: null
                        }];
            }
        });
    });
}
function updateFixedAsset(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var id, rest, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = input.id, rest = __rest(input, ["id"]);
                    return [4 /*yield*/, client
                            .from("fixedAsset")
                            .update((0, supabase_1.sanitize)(rest))
                            .eq("id", id)
                            .select("id")
                            .single()];
                case 1:
                    result = _a.sent();
                    if (result.error)
                        return [2 /*return*/, { data: null, error: result.error }];
                    return [2 /*return*/, { data: { id: result.data.id }, error: null }];
            }
        });
    });
}
/** @deprecated Use insertFixedAsset for new assets, updateFixedAsset for existing assets */
function upsertFixedAsset(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var id, rest;
        return __generator(this, function (_a) {
            if ("createdBy" in data) {
                return [2 /*return*/, client
                        .from("fixedAsset")
                        .insert([data])
                        .select("id")
                        .single()];
            }
            id = data.id, rest = __rest(data, ["id"]);
            return [2 /*return*/, client
                    .from("fixedAsset")
                    .update((0, supabase_1.sanitize)(rest))
                    .eq("id", id)
                    .select("id")
                    .single()];
        });
    });
}
function deleteFixedAsset(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("fixedAsset").delete().eq("id", id).eq("status", "Draft")];
        });
    });
}
function insertDepreciationRun(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var depreciationRunId, seq, run, lineInserts, lineResult;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!input.depreciationRunId) return [3 /*break*/, 1];
                    depreciationRunId = input.depreciationRunId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "depreciationRun",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _b.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_a = seq.error) !== null && _a !== void 0 ? _a : {
                                    message: "Failed to generate depreciationRun sequence"
                                }
                            }];
                    }
                    depreciationRunId = seq.data;
                    _b.label = 3;
                case 3: return [4 /*yield*/, client
                        .from("depreciationRun")
                        .insert({
                        depreciationRunId: depreciationRunId,
                        periodEnd: input.periodEnd,
                        status: "Draft",
                        companyId: input.companyId,
                        createdBy: input.createdBy
                    })
                        .select("id, depreciationRunId")
                        .single()];
                case 4:
                    run = _b.sent();
                    if (run.error)
                        return [2 /*return*/, { data: null, error: run.error }];
                    if (!(input.lines.length > 0)) return [3 /*break*/, 7];
                    lineInserts = input.lines.map(function (line) { return ({
                        depreciationRunId: run.data.id,
                        fixedAssetId: line.fixedAssetId,
                        amount: line.amount,
                        taxAmount: line.taxAmount,
                        companyId: input.companyId
                    }); });
                    return [4 /*yield*/, client
                            .from("depreciationRunLine")
                            .insert(lineInserts)];
                case 5:
                    lineResult = _b.sent();
                    if (!lineResult.error) return [3 /*break*/, 7];
                    return [4 /*yield*/, client.from("depreciationRun").delete().eq("id", run.data.id)];
                case 6:
                    _b.sent();
                    return [2 /*return*/, { data: null, error: lineResult.error }];
                case 7: return [2 /*return*/, {
                        data: {
                            id: run.data.id,
                            depreciationRunId: run.data.depreciationRunId
                        },
                        error: null
                    }];
            }
        });
    });
}
function deleteDepreciationRun(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("depreciationRun")
                    .delete()
                    .eq("id", id)
                    .eq("status", "Draft")];
        });
    });
}
// -- Depreciation --
function getDepreciationRuns(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("depreciationRun")
                .select("id, depreciationRunId, periodEnd, status, postedAt", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.ilike("depreciationRunId", "%".concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "createdAt", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getDepreciationRun(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("depreciationRun").select("*").eq("id", id).single()];
        });
    });
}
function getDepreciationRunLines(client, depreciationRunId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("depreciationRunLine")
                    .select("id, amount, taxAmount, journalId, fixedAsset:fixedAssetId(id, fixedAssetId, name, acquisitionCost, accumulatedDepreciation, accumulatedTaxDepreciation, residualValuePercent)")
                    .eq("depreciationRunId", depreciationRunId)];
        });
    });
}
// -- Depreciation History for a single asset --
function getAssetDepreciationHistory(client, fixedAssetId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("depreciationRunLine")
                    .select("id, amount, taxAmount, journalId, depreciationRun:depreciationRunId(id, depreciationRunId, periodEnd, status)")
                    .eq("fixedAssetId", fixedAssetId)
                    .order("depreciationRun(periodEnd)", { ascending: false })];
        });
    });
}
// -- Disposals --
function getFixedAssetDisposal(client, fixedAssetId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("fixedAssetDisposal")
                    .select("*")
                    .eq("fixedAssetId", fixedAssetId)
                    .maybeSingle()];
        });
    });
}
// -- Usage Logs --
function getFixedAssetUsageLogs(client, fixedAssetId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("fixedAssetUsageLog")
                    .select("*")
                    .eq("fixedAssetId", fixedAssetId)
                    .order("periodEnd", { ascending: false })];
        });
    });
}
function upsertFixedAssetUsageLog(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("fixedAssetUsageLog")
                    .insert([data])
                    .select("id")
                    .single()];
        });
    });
}
