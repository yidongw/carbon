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
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var PartnersTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("partner");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "supplierName",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Supplier"], ["Supplier"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<react_1.HStack>
            <react_1.Avatar size="sm" name={(_b = row.original.supplierName) !== null && _b !== void 0 ? _b : ""}/>

            <components_1.Hyperlink to={"".concat(path_1.path.to.partner(row.original.supplierLocationId, row.original.abilityId), "?").concat(params.toString())}>
              {row.original.supplierName}
            </components_1.Hyperlink>
          </react_1.HStack>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: suppliers.map(function (supplier) { return ({
                            value: supplier.name,
                            label: supplier.name
                        }); })
                    }
                }
            },
            {
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return "".concat(row.original.city, ", ").concat(row.original.state);
                }
            },
            // {
            //   accessorKey: "abilityName",
            //   header: "Ability",
            //   cell: (item) => <Enumerable value={item.getValue<string>()} />,
            //   meta: {
            //     filter: {
            //       type: "static",
            //       options: abilities.map((ability) => ({
            //         value: ability.name!,
            //         label: <Enumerable value={ability.name!} />,
            //       })),
            //     },
            //   },
            // },
            {
                accessorKey: "hoursPerWeek",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Hours per Week"], ["Hours per Week"]))),
                cell: function (item) { return item.getValue(); }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [params, customColumns, suppliers, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.partner(row.supplierLocationId, row.abilityId), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Partner</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "resources")} onClick={function () {
                navigate("".concat(path_1.path.to.deletePartner(row.supplierLocationId), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Partner</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} count={count} columns={columns} primaryAction={permissions.can("create", "resources") && (<components_1.New label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Partner"], ["Partner"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Partners"], ["Partners"])))}/>);
});
PartnersTable.displayName = "PartnersTable";
exports.default = PartnersTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
