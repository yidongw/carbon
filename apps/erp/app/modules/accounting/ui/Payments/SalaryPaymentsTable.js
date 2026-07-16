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
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var SalaryPeriodPicker_1 = require("~/modules/people/ui/Salary/SalaryPeriodPicker");
var salaryDetail_utils_1 = require("~/modules/people/ui/Salary/salaryDetail.utils");
var path_1 = require("~/utils/path");
var SalaryPaymentsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, year = _a.year, month = _a.month;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var permissions = (0, hooks_1.usePermissions)();
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)({
        minimumFractionDigits: 2
    });
    var canCreatePayment = permissions.can("create", "people");
    var paymentsReturnTo = (0, react_2.useMemo)(function () {
        var params = new URLSearchParams(searchParams);
        params.set("year", String(year));
        params.set("month", String(month));
        return "".concat(path_1.path.to.accountingPayments, "?").concat(params.toString());
    }, [month, searchParams, year]);
    var recordPaymentTo = (0, react_2.useMemo)(function () { return path_1.path.to.recordSalaryPayment(year, month, paymentsReturnTo); }, [month, paymentsReturnTo, year]);
    var goToMonth = (0, react_2.useCallback)(function (y, m) {
        var next = new URLSearchParams(searchParams);
        next.set("year", String(y));
        next.set("month", String(m));
        navigate("".concat(path_1.path.to.accountingPayments, "?").concat(next.toString()));
    }, [navigate, searchParams]);
    var columns = (0, react_2.useMemo)(function () {
        var formatCurrency = function (amount) {
            return amount == null ? "—" : currencyFormatter.format(amount);
        };
        return [
            {
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Employee"], ["Employee"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var sr = row.original.salaryRecord;
                    var employeeId = sr === null || sr === void 0 ? void 0 : sr.employeeId;
                    var name = (0, salaryDetail_utils_1.getEmployeeName)(sr ? __assign({ fullName: sr.employeeName }, sr) : null);
                    return (<react_1.HStack className="items-center gap-2">
                <react_1.Avatar className="size-7" src={(_b = sr === null || sr === void 0 ? void 0 : sr.avatarUrl) !== null && _b !== void 0 ? _b : undefined} name={name}/>
                {employeeId && (sr === null || sr === void 0 ? void 0 : sr.year) && (sr === null || sr === void 0 ? void 0 : sr.month) ? (<components_1.Hyperlink to={path_1.path.to.employeeSalaryMonth(employeeId, sr.year, sr.month)} prefetch="none">
                    <span className="font-medium text-sm">{name}</span>
                  </components_1.Hyperlink>) : (<span className="font-medium text-sm">{name}</span>)}
              </react_1.HStack>);
                },
                meta: { icon: <lu_1.LuUser /> }
            },
            {
                accessorKey: "amount",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Amount"], ["Amount"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<span className="tabular-nums font-semibold">
              {formatCurrency(row.original.amount)}
            </span>);
                },
                meta: {
                    icon: <lu_1.LuBanknote />,
                    renderTotal: true,
                    formatter: function (val) { return currencyFormatter.format(val); }
                }
            },
            {
                accessorKey: "paidAt",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Paid at"], ["Paid at"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<span className="text-sm text-muted-foreground whitespace-nowrap">
              {(0, salaryDetail_utils_1.formatDateTime)(row.original.paidAt)}
            </span>);
                },
                meta: { icon: <lu_1.LuCalendar /> }
            },
            {
                id: "paidBy",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Paid by"], ["Paid by"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<span className="text-sm">
              {(0, salaryDetail_utils_1.getEmployeeName)(row.original.paidByUser)}
            </span>);
                }
            },
            {
                accessorKey: "notes",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Notes"], ["Notes"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<span className="text-sm text-muted-foreground max-w-xs truncate">
              {(_b = row.original.notes) !== null && _b !== void 0 ? _b : "—"}
            </span>);
                }
            }
        ];
    }, [currencyFormatter, t]);
    return (<components_1.Table data={data} count={count} columns={columns} getRowHref={function (row) {
            var sr = row.salaryRecord;
            if (!(sr === null || sr === void 0 ? void 0 : sr.employeeId) || sr.year == null || sr.month == null) {
                return undefined;
            }
            return path_1.path.to.employeeSalaryMonth(sr.employeeId, sr.year, sr.month);
        }} primaryAction={<react_1.HStack spacing={2} className="items-center">
            <SalaryPeriodPicker_1.default year={year} month={month} onChange={goToMonth}/>
            {canCreatePayment ? (<components_1.New label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Payment"], ["Payment"])))} to={recordPaymentTo}/>) : null}
          </react_1.HStack>} withSearch withPagination title={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Payments"], ["Payments"])))} table="employeeSalaryPayment"/>);
});
SalaryPaymentsTable.displayName = "SalaryPaymentsTable";
exports.default = SalaryPaymentsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
