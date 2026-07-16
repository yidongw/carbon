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
exports.default = EditChartOfAccountsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var accounting_1 = require("~/modules/accounting");
var ChartOfAccounts_1 = require("~/modules/accounting/ui/ChartOfAccounts");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyGroupId, accountId, _d, account, groupAccounts;
        var _e, _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "accounting",
                        role: "employee"
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyGroupId = _c.companyGroupId;
                    accountId = params.accountId;
                    if (!accountId)
                        throw (0, auth_1.notFound)("accountId not found");
                    return [4 /*yield*/, Promise.all([
                            (0, accounting_1.getAccount)(client, accountId),
                            (0, accounting_1.getGroupAccounts)(client, companyGroupId)
                        ])];
                case 2:
                    _d = _g.sent(), account = _d[0], groupAccounts = _d[1];
                    return [2 /*return*/, {
                            account: (_e = account === null || account === void 0 ? void 0 : account.data) !== null && _e !== void 0 ? _e : null,
                            groupAccounts: (_f = groupAccounts.data) !== null && _f !== void 0 ? _f : []
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, accountId, existing, _d, _e, formData, intent, validation_1, _f, id_1, d_1, updateAccount_1, _g, _h, _j, _k, validation, _l, id, d, updateAccount, _m, _o, _p, _q;
        var _r;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "accounting"
                        })];
                case 1:
                    _c = _s.sent(), client = _c.client, userId = _c.userId;
                    accountId = params.accountId;
                    if (!accountId) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, accounting_1.getAccount)(client, accountId)];
                case 2:
                    existing = _s.sent();
                    if (!((_r = existing.data) === null || _r === void 0 ? void 0 : _r.isSystem)) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.chartOfAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Root accounts cannot be modified"))];
                case 3: throw _d.apply(void 0, _e.concat([_s.sent()]));
                case 4: return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _s.sent();
                    intent = formData.get("intent");
                    if (!(intent === "group")) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, form_1.validator)(accounting_1.groupAccountValidator).validate(formData)];
                case 6:
                    validation_1 = _s.sent();
                    if (validation_1.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation_1.error)];
                    }
                    _f = validation_1.data, id_1 = _f.id, d_1 = __rest(_f, ["id"]);
                    if (!id_1)
                        throw new Error("id not found");
                    return [4 /*yield*/, (0, accounting_1.upsertAccount)(client, __assign(__assign({ id: id_1 }, d_1), { number: null, isGroup: true, consolidatedRate: "Average", parentId: d_1.parentId || undefined, updatedBy: userId }))];
                case 7:
                    updateAccount_1 = _s.sent();
                    if (!updateAccount_1.error) return [3 /*break*/, 9];
                    _g = react_router_1.data;
                    _h = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateAccount_1.error, "Failed to update group"))];
                case 8: return [2 /*return*/, _g.apply(void 0, _h.concat([_s.sent()]))];
                case 9:
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.chartOfAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated group"))];
                case 10: throw _j.apply(void 0, _k.concat([_s.sent()]));
                case 11: return [4 /*yield*/, (0, form_1.validator)(accounting_1.accountValidator).validate(formData)];
                case 12:
                    validation = _s.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _l = validation.data, id = _l.id, d = __rest(_l, ["id"]);
                    if (!id)
                        throw new Error("id not found");
                    return [4 /*yield*/, (0, accounting_1.upsertAccount)(client, __assign(__assign({ id: id }, d), { parentId: d.parentId || undefined, customFields: (0, form_2.setCustomFields)(formData), updatedBy: userId }))];
                case 13:
                    updateAccount = _s.sent();
                    if (!updateAccount.error) return [3 /*break*/, 15];
                    _m = react_router_1.data;
                    _o = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateAccount.error, "Failed to update account"))];
                case 14: return [2 /*return*/, _m.apply(void 0, _o.concat([_s.sent()]))];
                case 15:
                    _p = react_router_1.redirect;
                    _q = [path_1.path.to.chartOfAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated account"))];
                case 16: throw _p.apply(void 0, _q.concat([_s.sent()]));
            }
        });
    });
}
function EditChartOfAccountsRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var _q = (0, react_router_1.useLoaderData)(), account = _q.account, groupAccounts = _q.groupAccounts;
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(path_1.path.to.chartOfAccounts); };
    if (account === null || account === void 0 ? void 0 : account.isGroup) {
        var groupInitialValues = {
            id: account.id,
            name: (_a = account.name) !== null && _a !== void 0 ? _a : "",
            parentId: (_b = account.parentId) !== null && _b !== void 0 ? _b : undefined,
            accountType: (_c = account.accountType) !== null && _c !== void 0 ? _c : undefined,
            class: (_d = account.class) !== null && _d !== void 0 ? _d : "Asset",
            incomeBalance: (_e = account.incomeBalance) !== null && _e !== void 0 ? _e : "Balance Sheet"
        };
        return (<ChartOfAccounts_1.GroupAccountForm key={account.id} initialValues={groupInitialValues} groupAccounts={groupAccounts} onClose={onClose}/>);
    }
    var initialValues = __assign({ id: (_f = account === null || account === void 0 ? void 0 : account.id) !== null && _f !== void 0 ? _f : undefined, number: (_g = account === null || account === void 0 ? void 0 : account.number) !== null && _g !== void 0 ? _g : "", name: (_h = account === null || account === void 0 ? void 0 : account.name) !== null && _h !== void 0 ? _h : "", parentId: (_j = account === null || account === void 0 ? void 0 : account.parentId) !== null && _j !== void 0 ? _j : undefined, isGroup: (_k = account === null || account === void 0 ? void 0 : account.isGroup) !== null && _k !== void 0 ? _k : false, accountType: (_l = account === null || account === void 0 ? void 0 : account.accountType) !== null && _l !== void 0 ? _l : undefined, class: (_m = account === null || account === void 0 ? void 0 : account.class) !== null && _m !== void 0 ? _m : "Asset", incomeBalance: (_o = account === null || account === void 0 ? void 0 : account.incomeBalance) !== null && _o !== void 0 ? _o : "Balance Sheet", consolidatedRate: (_p = account === null || account === void 0 ? void 0 : account.consolidatedRate) !== null && _p !== void 0 ? _p : "Average" }, (0, form_2.getCustomFields)(account === null || account === void 0 ? void 0 : account.customFields));
    return (<ChartOfAccounts_1.ChartOfAccountForm key={initialValues.id} initialValues={initialValues} groupAccounts={groupAccounts} onClose={onClose}/>);
}
