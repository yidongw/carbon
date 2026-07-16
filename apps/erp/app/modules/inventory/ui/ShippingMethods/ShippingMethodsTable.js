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
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var inventory_1 = require("~/modules/inventory");
var path_1 = require("~/utils/path");
var ShippingMethodsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var params = (0, hooks_1.useUrlParams)()[0];
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var hasAccounting = permissions.has("accounting") && permissions.can("view", "accounting");
    var rows = (0, react_2.useMemo)(function () { return data; }, [data]);
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("shippingMethod");
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var columns = (0, react_2.useMemo)(function () {
        var result = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={"".concat(path_1.path.to.shippingMethod(row.original.id), "?").concat(params.toString())}>
              {row.original.name}
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "carrier",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Carrier"], ["Carrier"]))),
                cell: function (item) { return <Enumerable_1.Enumerable value={item.getValue()}/>; },
                meta: {
                    filter: {
                        type: "static",
                        options: inventory_1.shippingCarrierType.map(function (v) { return ({
                            label: v,
                            value: v
                        }); })
                    },
                    icon: <lu_1.LuTruck />
                }
            },
            {
                accessorKey: "trackingUrl",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Tracking URL"], ["Tracking URL"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuGlobe />
                }
            }
        ];
        result = __spreadArray(__spreadArray([], result, true), customColumns, true);
        return hasAccounting
            ? result.concat([
                {
                    accessorKey: "carrierAccountId",
                    header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Carrier Account"], ["Carrier Account"]))),
                    cell: function (item) { return item.getValue(); },
                    meta: {
                        icon: <lu_1.LuBanknote />
                    }
                }
            ])
            : result;
    }, [permissions, customColumns]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem disabled={!permissions.can("update", "inventory")} onClick={function () {
                navigate("".concat(path_1.path.to.shippingMethod(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              <macro_1.Trans>Edit Shipping Method</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem disabled={!permissions.can("delete", "inventory")} destructive onClick={function () {
                navigate("".concat(path_1.path.to.deleteShippingMethod(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Shipping Method</macro_1.Trans>
            </react_1.MenuItem>
          </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "inventory") && (<components_1.New label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Shipping Method"], ["Shipping Method"])))} to={"".concat(path_1.path.to.newShippingMethod, "?").concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Shipping Methods"], ["Shipping Methods"])))}/>);
});
ShippingMethodsTable.displayName = "ShippingMethodsTable";
exports.default = ShippingMethodsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
