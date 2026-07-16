"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var SalaryPeriodPicker_1 = require("./SalaryPeriodPicker");
var SalaryRowActions_1 = require("./SalaryRowActions");
var salaryDetail_utils_1 = require("./salaryDetail.utils");
var SalaryTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, departments = _a.departments, year = _a.year, month = _a.month;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)({
        minimumFractionDigits: 2
    });
    var goToMonth = (0, react_2.useCallback)(function (y, m) {
        var next = new URLSearchParams(searchParams);
        next.set("year", String(y));
        next.set("month", String(m));
        navigate("".concat(path_1.path.to.accountingSalary, "?").concat(next.toString()));
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
                    var name = (0, salaryDetail_utils_1.getEmployeeName)({
                        fullName: row.original.employeeName,
                        firstName: row.original.firstName,
                        lastName: row.original.lastName
                    });
                    return (<react_1.HStack className="items-center gap-2">
                <react_1.Avatar className="size-7" src={(_b = row.original.avatarUrl) !== null && _b !== void 0 ? _b : undefined} name={name}/>
                <span className="font-medium text-sm">{name}</span>
              </react_1.HStack>);
                },
                meta: { icon: <lu_1.LuUser /> }
            },
            {
                accessorKey: "departmentId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Department"], ["Department"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<span className="text-sm text-muted-foreground">
              {(_b = row.original.departmentName) !== null && _b !== void 0 ? _b : "—"}
            </span>);
                },
                meta: {
                    icon: <lu_1.LuBuilding2 />,
                    filter: {
                        type: "static",
                        options: departments.map(function (department) { return ({
                            value: department.id,
                            label: department.name
                        }); })
                    }
                }
            },
            {
                accessorKey: "pendingAmount",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Pending"], ["Pending"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var pending = (_b = row.original.pendingAmount) !== null && _b !== void 0 ? _b : 0;
                    var employeeId = row.original.employeeId;
                    if (pending <= 0 || !employeeId) {
                        return (<span className="text-muted-foreground tabular-nums">—</span>);
                    }
                    return (<components_1.Hyperlink to={path_1.path.to.quantityReviewForEmployee(employeeId)} prefetch="none" data-prevent-row-nav onClick={function (e) { return e.stopPropagation(); }} onPointerDown={function (e) { return e.stopPropagation(); }}>
                <span className="tabular-nums font-semibold text-amber-600 dark:text-amber-400">
                  {formatCurrency(pending)}
                </span>
              </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuClock />,
                    renderTotal: true,
                    formatter: function (val) {
                        return currencyFormatter.format(Number(val));
                    }
                }
            },
            {
                accessorKey: "totalEarned",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Earned"], ["Earned"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<span className="tabular-nums font-medium">
              {formatCurrency(row.original.totalEarned)}
            </span>);
                },
                meta: {
                    icon: <lu_1.LuBanknote />,
                    renderTotal: true,
                    formatter: function (val) {
                        return currencyFormatter.format(Number(val));
                    }
                }
            },
            {
                accessorKey: "totalPaid",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Paid"], ["Paid"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<span className="tabular-nums text-muted-foreground">
              {formatCurrency(row.original.totalPaid)}
            </span>);
                },
                meta: {
                    icon: <lu_1.LuCircleCheck />,
                    renderTotal: true,
                    formatter: function (val) {
                        return currencyFormatter.format(Number(val));
                    }
                }
            },
            {
                accessorKey: "amountOwed",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Outstanding"], ["Outstanding"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var owed = (_b = row.original.amountOwed) !== null && _b !== void 0 ? _b : 0;
                    return (<span className={"tabular-nums font-semibold ".concat(owed > 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
                {formatCurrency(owed)}
              </span>);
                },
                meta: {
                    icon: <lu_1.LuCircle />,
                    renderTotal: true,
                    formatter: function (val) {
                        return currencyFormatter.format(Number(val));
                    }
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var paymentStatus = (0, salaryDetail_utils_1.getSalaryPaymentStatus)(row.original.totalEarned, row.original.totalPaid);
                    return (<react_1.Badge variant={(0, salaryDetail_utils_1.statusVariant)(paymentStatus)}>
                {paymentStatus}
              </react_1.Badge>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            {
                                value: "Unpaid",
                                label: <react_1.Badge variant="secondary">Unpaid</react_1.Badge>
                            },
                            {
                                value: "Partially Paid",
                                label: <react_1.Badge variant="yellow">Partially Paid</react_1.Badge>
                            },
                            { value: "Paid", label: <react_1.Badge variant="green">Paid</react_1.Badge> }
                        ],
                        isArray: false
                    }
                }
            },
            {
                id: "salaryActions",
                header: function () { return <span className="sr-only">{t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Actions"], ["Actions"])))}</span>; },
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.employeeId ? (<SalaryRowActions_1.default employeeId={row.original.employeeId} salaryRecordId={row.original.id} amountOwed={row.original.amountOwed} pendingAmount={row.original.pendingAmount} year={year} month={month}/>) : null;
                },
                size: 140,
                enablePinning: false,
                meta: {
                    cellClassName: "transition-none"
                }
            }
        ];
    }, [currencyFormatter, departments, month, t, year]);
    return (<components_1.Table data={data} count={count} columns={columns} getRowHref={function (row) {
            return row.employeeId
                ? path_1.path.to.employeeSalaryMonth(row.employeeId, year, month)
                : undefined;
        }} primaryAction={<SalaryPeriodPicker_1.default year={year} month={month} onChange={goToMonth}/>} withSearch withPagination title={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Salary"], ["Salary"])))}/>);
});
SalaryTable.displayName = "SalaryTable";
exports.default = SalaryTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
