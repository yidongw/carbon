"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var accounting_models_1 = require("../../accounting.models");
var IntercompanyTransactionStatus_1 = require("./IntercompanyTransactionStatus");
var IntercompanyTransactionTable = (0, react_1.memo)(function (_a) {
    var data = _a.data, count = _a.count, primaryAction = _a.primaryAction;
    var columns = (0, react_1.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "sourceCompany",
                header: "Source",
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (_c = (_b = row.original.sourceCompany) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "—";
                },
                meta: {
                    icon: <lu_1.LuBuilding2 />
                }
            },
            {
                accessorKey: "targetCompany",
                header: "Target",
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (_c = (_b = row.original.targetCompany) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "—";
                },
                meta: {
                    icon: <lu_1.LuBuilding2 />
                }
            },
            {
                accessorKey: "amount",
                header: "Amount",
                cell: function (_a) {
                    var row = _a.row;
                    var formatted = new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: row.original.currencyCode || "USD"
                    }).format(row.original.amount);
                    return formatted;
                },
                meta: {
                    icon: <lu_1.LuCircleDollarSign />
                }
            },
            {
                accessorKey: "description",
                header: "Description",
                cell: function (_a) {
                    var row = _a.row;
                    return (<div className="max-w-[240px] truncate">
              {row.original.description || row.original.documentType || "—"}
            </div>);
                },
                meta: {
                    icon: <lu_1.LuFileText />
                }
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: function (_a) {
                    var row = _a.row;
                    return (<IntercompanyTransactionStatus_1.default status={row.original
                            .status}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: accounting_models_1.intercompanyTransactionStatuses.map(function (v) { return ({
                            label: v,
                            value: v
                        }); })
                    },
                    icon: <lu_1.LuStar />
                }
            },
            {
                accessorKey: "createdAt",
                header: "Created",
                cell: function (_a) {
                    var row = _a.row;
                    return new Date(row.original.createdAt).toLocaleDateString();
                }
            }
        ];
        return defaultColumns;
    }, []);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={primaryAction} title="Intercompany Transactions"/>);
});
IntercompanyTransactionTable.displayName = "IntercompanyTransactionTable";
exports.default = IntercompanyTransactionTable;
