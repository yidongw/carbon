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
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Grid_1 = require("~/components/Grid");
var Hyperlink_1 = require("~/components/Hyperlink");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var SupplierParts = function (_a) {
    var supplierParts = _a.supplierParts, _b = _a.compact, compact = _b === void 0 ? false : _b;
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var canEdit = permissions.can("update", "parts");
    var formatter = (0, hooks_1.useCurrencyFormatter)();
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("supplierPart");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "supplierId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Supplier"], ["Supplier"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<Hyperlink_1.default to={row.original.id}>
            <components_1.SupplierAvatar supplierId={row.original.supplierId}/>
          </Hyperlink_1.default>);
                }
            },
            {
                accessorKey: "supplierPartId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Supplier ID"], ["Supplier ID"]))),
                cell: function (item) { return item.getValue(); }
            },
            {
                accessorKey: "unitPrice",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Unit Price"], ["Unit Price"]))),
                cell: function (item) { return formatter.format(item.getValue()); },
                meta: {
                    formatter: formatter.format,
                    renderTotal: true
                }
            },
            {
                accessorKey: "supplierUnitOfMeasureCode",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"]))),
                cell: function (item) { return item.getValue(); }
            },
            {
                accessorKey: "minimumOrderQuantity",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Minimum Order Quantity"], ["Minimum Order Quantity"]))),
                cell: function (item) { return item.getValue(); }
            },
            {
                accessorKey: "conversionFactor",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Conversion Factor"], ["Conversion Factor"]))),
                cell: function (item) { return item.getValue(); }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [customColumns, formatter, t]);
    return (<>
      <react_1.Card className={(0, react_1.cn)(compact && "border-none p-0 dark:shadow-none")}>
        <react_1.CardHeader className={(0, react_1.cn)(compact && "px-0")}>
          <react_1.CardTitle>
            <macro_1.Trans>Supplier Parts</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent className={(0, react_1.cn)(compact && "px-0")}>
          <Grid_1.default data={supplierParts} columns={columns} canEdit={false} onNewRow={canEdit ? function () { return navigate("new"); } : undefined}/>
        </react_1.CardContent>
      </react_1.Card>
      <react_router_1.Outlet />
    </>);
};
exports.default = SupplierParts;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
