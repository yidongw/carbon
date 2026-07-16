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
var path_1 = require("~/utils/path");
var ExchangeRatesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("currency");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id}>
            {row.original.name}
          </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "code",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Code"], ["Code"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuEuro />
                }
            },
            {
                accessorKey: "exchangeRate",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Exchange Rate"], ["Exchange Rate"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuPercent />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [customColumns, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "accounting")} onClick={function () {
                navigate("".concat(path_1.path.to.exchangeRate(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Currency</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} renderContextMenu={renderContextMenu} title={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Exchange Rates"], ["Exchange Rates"])))}/>);
});
ExchangeRatesTable.displayName = "ExchangeRatesTable";
exports.default = ExchangeRatesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
