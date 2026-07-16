"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
function formatCurrency(value) {
    if (value === 0)
        return "-";
    return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
var TrialBalanceTable = (0, react_1.memo)(function (_a) {
    var data = _a.data, count = _a.count, _b = _a.showTranslated, showTranslated = _b === void 0 ? false : _b, parentCurrency = _a.parentCurrency;
    var t = (0, macro_1.useLingui)().t;
    var columns = (0, react_1.useMemo)(function () {
        var cols = [
            {
                accessorKey: "accountNumber",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Account"], ["Account"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<span className="font-mono text-muted-foreground">
              {row.original.accountNumber}
            </span>);
                },
                size: 100,
                meta: {
                    icon: <lu_1.LuHash />
                }
            },
            {
                accessorKey: "accountName",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.accountName;
                },
                meta: {
                    icon: <lu_1.LuText />
                }
            },
            {
                accessorKey: "debitBalance",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Debit"], ["Debit"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<span className="tabular-nums">
              {formatCurrency(row.original.debitBalance)}
            </span>);
                },
                size: 150,
                meta: {
                    renderTotal: true,
                    formatter: function (val) { return formatCurrency(Number(val)); }
                }
            },
            {
                accessorKey: "creditBalance",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Credit"], ["Credit"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<span className="tabular-nums">
              {formatCurrency(row.original.creditBalance)}
            </span>);
                },
                size: 150,
                meta: {
                    renderTotal: true,
                    formatter: function (val) { return formatCurrency(Number(val)); }
                }
            }
        ];
        if (showTranslated) {
            cols.push({
                accessorKey: "translatedDebit",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Debit (", ")"], ["Debit (", ")"])), parentCurrency !== null && parentCurrency !== void 0 ? parentCurrency : "Translated"),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<span className="tabular-nums">
                {formatCurrency((_b = row.original.translatedDebit) !== null && _b !== void 0 ? _b : 0)}
              </span>);
                },
                size: 150,
                meta: {
                    renderTotal: true,
                    formatter: function (val) { return formatCurrency(Number(val)); }
                }
            }, {
                accessorKey: "translatedCredit",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Credit (", ")"], ["Credit (", ")"])), parentCurrency !== null && parentCurrency !== void 0 ? parentCurrency : "Translated"),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<span className="tabular-nums">
                {formatCurrency((_b = row.original.translatedCredit) !== null && _b !== void 0 ? _b : 0)}
              </span>);
                },
                size: 150,
                meta: {
                    renderTotal: true,
                    formatter: function (val) { return formatCurrency(Number(val)); }
                }
            });
        }
        cols.push({
            accessorKey: "netChange",
            header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Net Change"], ["Net Change"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<span className="tabular-nums">
            {formatCurrency(row.original.netChange)}
          </span>);
            },
            size: 150,
            meta: {
                renderTotal: true,
                formatter: function (val) { return formatCurrency(Number(val)); }
            }
        });
        return cols;
    }, [showTranslated, parentCurrency, t]);
    return (<components_1.Table data={data} columns={columns} count={count} withSimpleSorting={false} title={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Trial Balance"], ["Trial Balance"])))}/>);
});
TrialBalanceTable.displayName = "TrialBalanceTable";
exports.default = TrialBalanceTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
