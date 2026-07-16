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
exports.loader = loader;
exports.action = action;
exports.default = MoveAccountRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var accounting_1 = require("~/modules/accounting");
var ChartOfAccounts_1 = require("~/modules/accounting/ui/ChartOfAccounts");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        // Walk descendants of the account being moved
        function collectDescendants(id) {
            var _a;
            descendantIds.add(id);
            for (var _i = 0, _b = (_a = childrenMap.get(id)) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
                var childId = _b[_i];
                collectDescendants(childId);
            }
        }
        var _c, client, companyGroupId, accountId, _d, account, allGroupAccounts, _e, _f, allAccounts, descendantIds, allAccountsResult, accountsList, childrenMap, _i, accountsList_1, a, children, validGroupAccounts;
        var _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "accounting",
                        role: "employee"
                    })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyGroupId = _c.companyGroupId;
                    accountId = params.accountId;
                    if (!accountId)
                        throw (0, auth_1.notFound)("accountId not found");
                    return [4 /*yield*/, Promise.all([
                            (0, accounting_1.getAccount)(client, accountId),
                            (0, accounting_1.getGroupAccounts)(client, companyGroupId)
                        ])];
                case 2:
                    _d = _k.sent(), account = _d[0], allGroupAccounts = _d[1];
                    if (!(account.error || !account.data)) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.chartOfAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(account.error, "Failed to get account"))];
                case 3: throw _e.apply(void 0, _f.concat([_k.sent()]));
                case 4:
                    allAccounts = (_g = allGroupAccounts.data) !== null && _g !== void 0 ? _g : [];
                    descendantIds = new Set();
                    return [4 /*yield*/, client
                            .from("account")
                            .select("id, parentId")
                            .eq("companyGroupId", companyGroupId)
                            .eq("active", true)];
                case 5:
                    allAccountsResult = _k.sent();
                    accountsList = (_h = allAccountsResult.data) !== null && _h !== void 0 ? _h : [];
                    childrenMap = new Map();
                    for (_i = 0, accountsList_1 = accountsList; _i < accountsList_1.length; _i++) {
                        a = accountsList_1[_i];
                        if (a.parentId) {
                            children = (_j = childrenMap.get(a.parentId)) !== null && _j !== void 0 ? _j : [];
                            children.push(a.id);
                            childrenMap.set(a.parentId, children);
                        }
                    }
                    collectDescendants(accountId);
                    validGroupAccounts = allAccounts.filter(function (a) { return !descendantIds.has(a.id); });
                    return [2 /*return*/, {
                            account: account.data,
                            groupAccounts: validGroupAccounts
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, accountId, formData, validation, parentId, updateData, parent_1, _d, _e, result, _f, _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "accounting"
                        })];
                case 1:
                    _c = _k.sent(), client = _c.client, userId = _c.userId;
                    accountId = params.accountId;
                    if (!accountId)
                        throw (0, auth_1.notFound)("accountId not found");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _k.sent();
                    return [4 /*yield*/, (0, form_1.validator)(accounting_1.moveAccountValidator).validate(formData)];
                case 3:
                    validation = _k.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    parentId = validation.data.parentId;
                    updateData = {
                        parentId: parentId || null,
                        updatedBy: userId
                    };
                    if (!parentId) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("account")
                            .select("class, incomeBalance")
                            .eq("id", parentId)
                            .single()];
                case 4:
                    parent_1 = _k.sent();
                    if (!(parent_1.error || !parent_1.data)) return [3 /*break*/, 6];
                    _d = react_router_1.data;
                    _e = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(parent_1.error, "Failed to get parent account"))];
                case 5: return [2 /*return*/, _d.apply(void 0, _e.concat([_k.sent()]))];
                case 6:
                    updateData = __assign(__assign({}, updateData), { class: parent_1.data.class, incomeBalance: parent_1.data.incomeBalance });
                    _k.label = 7;
                case 7: return [4 /*yield*/, client
                        .from("account")
                        .update(updateData)
                        .eq("id", accountId)
                        .select("id")
                        .single()];
                case 8:
                    result = _k.sent();
                    if (!result.error) return [3 /*break*/, 10];
                    _f = react_router_1.data;
                    _g = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to move account"))];
                case 9: return [2 /*return*/, _f.apply(void 0, _g.concat([_k.sent()]))];
                case 10:
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.chartOfAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Account moved"))];
                case 11: throw _h.apply(void 0, _j.concat([_k.sent()]));
            }
        });
    });
}
function MoveAccountRoute() {
    var _a = (0, react_router_1.useLoaderData)(), account = _a.account, groupAccounts = _a.groupAccounts;
    var navigate = (0, react_router_1.useNavigate)();
    return (<ChartOfAccounts_1.MoveAccountForm accountId={account.id} accountName={account.name} groupAccounts={groupAccounts} currentParentId={account.parentId} onClose={function () { return navigate(path_1.path.to.chartOfAccounts); }}/>);
}
