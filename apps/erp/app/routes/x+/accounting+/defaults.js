"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.handle = void 0;
exports.loader = loader;
exports.action = action;
exports.default = AccountDefaultsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var accounting_1 = require("~/modules/accounting");
var AccountDefaults_1 = require("~/modules/accounting/ui/AccountDefaults");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Defaults"], ["Defaults"]))),
    to: path_1.path.to.accountingDefaults
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, defaultAccounts, _d, _e;
        var request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "accounting"
                    })];
                case 1:
                    _c = _f.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, accounting_1.getDefaultAccounts)(client, companyId)];
                case 2:
                    defaultAccounts = _f.sent();
                    if (!(defaultAccounts.error || !defaultAccounts.data)) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.accounting];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(defaultAccounts.error, "Failed to load default accounts"))];
                case 3: throw _d.apply(void 0, _e.concat([_f.sent()]));
                case 4: return [2 /*return*/, {
                        defaultAccounts: defaultAccounts.data
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, intent, validation, incomeValidation, balanceValidation, _d, updateIncome, updateBalance, _e, _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "accounting"
                        })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _j.sent();
                    intent = formData.get("intent");
                    if (!(intent === "all")) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, form_1.validator)(accounting_1.defaultAccountValidator).validate(formData)];
                case 3:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    incomeValidation = accounting_1.defaultIncomeAcountValidator.safeParse(validation.data);
                    balanceValidation = accounting_1.defaultBalanceSheetAccountValidator.safeParse(validation.data);
                    if (!incomeValidation.success || !balanceValidation.success) {
                        throw new Error("Failed to parse default accounts");
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, accounting_1.updateDefaultIncomeAccounts)(client, __assign(__assign({}, incomeValidation.data), { companyId: companyId, updatedBy: userId })),
                            (0, accounting_1.updateDefaultBalanceSheetAccounts)(client, __assign(__assign({}, balanceValidation.data), { companyId: companyId, updatedBy: userId }))
                        ])];
                case 4:
                    _d = _j.sent(), updateIncome = _d[0], updateBalance = _d[1];
                    if (!(updateIncome.error || updateBalance.error)) return [3 /*break*/, 6];
                    _e = react_router_1.data;
                    _f = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateIncome.error || updateBalance.error, "Failed to update default accounts"))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([_j.sent()]))];
                case 6:
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.accountingDefaults];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated default accounts"))];
                case 7: throw _g.apply(void 0, _h.concat([_j.sent()]));
                case 8: throw new Error("Invalid intent: ".concat(intent));
            }
        });
    });
}
function AccountDefaultsRoute() {
    var _a, _b;
    var defaultAccounts = (0, react_router_1.useLoaderData)().defaultAccounts;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.accounting);
    return (<react_1.ScrollArea className="w-full h-[calc(100dvh-49px)]">
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] h-full mx-auto gap-4">
        <AccountDefaults_1.AccountDefaultsForm balanceSheetAccounts={(_a = routeData === null || routeData === void 0 ? void 0 : routeData.balanceSheetAccounts) !== null && _a !== void 0 ? _a : []} incomeStatementAccounts={(_b = routeData === null || routeData === void 0 ? void 0 : routeData.incomeStatementAccounts) !== null && _b !== void 0 ? _b : []} 
    // @ts-expect-error TS2322 - TODO: fix type
    initialValues={defaultAccounts}/>
      </react_1.VStack>
    </react_1.ScrollArea>);
}
var templateObject_1;
