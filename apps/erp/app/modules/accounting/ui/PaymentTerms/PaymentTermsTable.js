"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var InlineEditor_1 = require("~/components/InlineEditor");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var path_1 = require("~/utils/path");
var accounting_models_1 = require("../../accounting.models");
// Payment-term inline edits go through the shared bulk-update action.
var PAYMENT_TERM_UPDATE = {
    action: path_1.path.to.bulkUpdatePaymentTerm,
    idKey: "ids"
};
var PaymentTermsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("paymentTerm");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={"".concat(row.original.id, "?").concat(params.toString())}>
            <Enumerable_1.Enumerable value={row.original.name}/>
          </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "daysDue",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Days Due"], ["Days Due"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "daysDue",
                    update: PAYMENT_TERM_UPDATE,
                    value: function (r) { return (r.daysDue != null ? String(r.daysDue) : ""); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "daysDiscount",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Days Discount"], ["Days Discount"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "daysDiscount",
                    update: PAYMENT_TERM_UPDATE,
                    value: function (r) { return (r.daysDiscount != null ? String(r.daysDiscount) : ""); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "discountPercentage",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Discount Percentage"], ["Discount Percentage"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "discountPercentage",
                    update: PAYMENT_TERM_UPDATE,
                    value: function (r) {
                        return r.discountPercentage != null ? String(r.discountPercentage) : "";
                    }
                }),
                meta: {
                    icon: <lu_1.LuPercent />
                }
            },
            {
                accessorKey: "calculationMethod",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Calculation Method"], ["Calculation Method"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "calculationMethod",
                    update: PAYMENT_TERM_UPDATE,
                    value: function (r) { return r.calculationMethod; },
                    options: accounting_models_1.paymentTermsCalculationMethod.map(function (v) { return ({
                        value: v,
                        label: <Enumerable_1.Enumerable value={v}/>
                    }); }),
                    renderInline: function (v) { return <Enumerable_1.Enumerable value={v}/>; }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: accounting_models_1.paymentTermsCalculationMethod.map(function (v) { return ({
                            label: <Enumerable_1.Enumerable value={v}/>,
                            value: v
                        }); })
                    },
                    icon: <lu_1.LuClock />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [params, customColumns, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "accounting")} onClick={function () {
                navigate("".concat(path_1.path.to.paymentTerm(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Payment Term</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem disabled={!permissions.can("delete", "accounting")} onClick={function () {
                navigate("".concat(path_1.path.to.deletePaymentTerm(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Payment Term</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "accounting") && (<components_1.New label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Payment Term"], ["Payment Term"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Payment Terms"], ["Payment Terms"])))}/>);
});
PaymentTermsTable.displayName = "PaymentTermsTable";
exports.default = PaymentTermsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
