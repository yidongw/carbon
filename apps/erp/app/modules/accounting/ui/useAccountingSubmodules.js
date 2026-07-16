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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useAccountingSubmodules;
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var multiCompanyRoutes = new Set([path_1.path.to.intercompany]);
var accountingOnlyRoutes = new Set([
    path_1.path.to.balanceSheet,
    path_1.path.to.incomeStatement,
    path_1.path.to.trialBalance,
    path_1.path.to.intercompany,
    path_1.path.to.accountingJournals,
    path_1.path.to.fixedAssets,
    path_1.path.to.depreciationRuns
]);
/** Payroll routes stay visible when full GL accounting is disabled. */
var payrollRoutes = [path_1.path.to.accountingSalary, path_1.path.to.accountingPayments];
var isPayrollRoute = function (to) {
    return payrollRoutes.some(function (base) { return to === base || to.startsWith("".concat(base, "?")); });
};
function useAccountingSubmodules() {
    var _a, _b;
    var t = (0, macro_1.useLingui)().t;
    var accountingRoutes = (0, react_1.useMemo)(function () { return [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Payroll"], ["Payroll"]))),
            routes: [
                {
                    name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Salary"], ["Salary"]))),
                    to: path_1.path.to.accountingSalary,
                    role: "employee",
                    icon: <lu_1.LuBanknote />
                },
                {
                    name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Payments"], ["Payments"]))),
                    to: path_1.path.to.accountingPayments,
                    role: "employee",
                    icon: <lu_1.LuCircleCheck />
                }
            ]
        },
        {
            name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Reports"], ["Reports"]))),
            routes: [
                {
                    name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Balance Sheet"], ["Balance Sheet"]))),
                    to: path_1.path.to.balanceSheet,
                    role: "employee",
                    icon: <lu_1.LuScale />
                },
                {
                    name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Income Statement"], ["Income Statement"]))),
                    to: path_1.path.to.incomeStatement,
                    role: "employee",
                    icon: <lu_1.LuTrendingUp />
                },
                {
                    name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Trial Balance"], ["Trial Balance"]))),
                    to: path_1.path.to.trialBalance,
                    role: "employee",
                    icon: <lu_1.LuFileSpreadsheet />
                }
            ]
        },
        {
            name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["General Ledger"], ["General Ledger"]))),
            routes: [
                {
                    name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Intercompany"], ["Intercompany"]))),
                    to: path_1.path.to.intercompany,
                    role: "employee",
                    icon: <lu_1.LuArrowLeftRight />
                },
                {
                    name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Journal Entries"], ["Journal Entries"]))),
                    to: path_1.path.to.accountingJournals,
                    role: "employee",
                    icon: <lu_1.LuBookOpen />
                }
            ]
        },
        {
            name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Fixed Assets"], ["Fixed Assets"]))),
            routes: [
                {
                    name: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Assets"], ["Assets"]))),
                    to: path_1.path.to.fixedAssets,
                    role: "employee",
                    icon: <lu_1.LuBuilding2 />
                },
                {
                    name: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Depreciation"], ["Depreciation"]))),
                    to: path_1.path.to.depreciationRuns,
                    role: "employee",
                    icon: <lu_1.LuClock />
                }
            ]
        },
        {
            name: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Configure"], ["Configure"]))),
            routes: [
                {
                    name: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Asset Classes"], ["Asset Classes"]))),
                    to: path_1.path.to.assetClasses,
                    role: "employee",
                    icon: <lu_1.LuLayers />
                },
                {
                    name: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Chart of Accounts"], ["Chart of Accounts"]))),
                    to: path_1.path.to.chartOfAccounts,
                    role: "employee",
                    icon: <lu_1.LuSheet />
                },
                {
                    name: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Cost Centers"], ["Cost Centers"]))),
                    to: path_1.path.to.costCenters,
                    role: "employee",
                    icon: <lu_1.LuCoins />
                },
                {
                    name: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Default Accounts"], ["Default Accounts"]))),
                    to: path_1.path.to.accountingDefaults,
                    icon: <lu_1.LuBetweenHorizontalStart />,
                    role: "employee"
                },
                {
                    name: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Dimensions"], ["Dimensions"]))),
                    to: path_1.path.to.dimensions,
                    role: "employee",
                    icon: <lu_1.LuAxis3D />
                },
                {
                    name: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Exchange Rates"], ["Exchange Rates"]))),
                    to: path_1.path.to.exchangeRates,
                    role: "employee",
                    icon: <lu_1.LuEuro />
                },
                {
                    name: t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Fiscal Year"], ["Fiscal Year"]))),
                    to: path_1.path.to.fiscalYears,
                    role: "employee",
                    icon: <lu_1.LuCalendar1 />
                },
                {
                    name: t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Payment Terms"], ["Payment Terms"]))),
                    to: path_1.path.to.paymentTerms,
                    role: "employee",
                    icon: <lu_1.LuHandCoins />
                }
            ]
        }
    ]; }, [t]);
    var settings = (0, hooks_1.useSettings)();
    var accountingEnabled = (_a = settings.accountingEnabled) !== null && _a !== void 0 ? _a : false;
    var permissions = (0, hooks_1.usePermissions)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.accounting);
    var hasMultipleCompanies = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.hasMultipleCompanies) !== null && _b !== void 0 ? _b : false;
    var isRouteVisible = function (route) {
        if (route.role && !permissions.is(route.role))
            return false;
        if (!hasMultipleCompanies && multiCompanyRoutes.has(route.to))
            return false;
        if (isPayrollRoute(route.to)) {
            return permissions.can("view", "people");
        }
        if (!accountingEnabled && accountingOnlyRoutes.has(route.to))
            return false;
        return true;
    };
    return {
        groups: accountingRoutes
            .filter(function (group) { return group.routes.some(isRouteVisible); })
            .map(function (group) { return (__assign(__assign({}, group), { routes: group.routes.filter(isRouteVisible) })); })
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22;
