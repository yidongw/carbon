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
var path_1 = require("~/utils/path");
var StyleSizesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var rows = (0, react_2.useMemo)(function () { return data; }, [data]);
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "sizeCode",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Size Code"], ["Size Code"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.companyId === null ? (<span className="font-mono">{row.original.sizeCode}</span>) : (<components_1.Hyperlink to={"".concat(path_1.path.to.styleSize(row.original.id), "?").concat(params.toString())}>
              <span className="font-mono">{row.original.sizeCode}</span>
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuTag />
                }
            },
            {
                accessorKey: "sizeName",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Size Name"], ["Size Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.sizeName;
                },
                meta: {
                    icon: <lu_1.LuRuler />
                }
            },
            {
                accessorKey: "companyId",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Standard"], ["Standard"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.companyId === null ? (<react_1.Badge variant="outline">
              <macro_1.Trans>Standard</macro_1.Trans>
            </react_1.Badge>) : (<react_1.Badge variant="blue">
              <macro_1.Trans>Custom</macro_1.Trans>
            </react_1.Badge>);
                },
                meta: {
                    icon: <lu_1.LuCircleCheck />
                }
            }
        ];
        return __spreadArray([], defaultColumns, true);
    }, [params, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "parts") || row.companyId === null} onClick={function () {
                navigate("".concat(path_1.path.to.styleSize(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Style Size</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem disabled={!permissions.can("delete", "parts") || row.companyId === null} destructive onClick={function () {
                navigate("".concat(path_1.path.to.deleteStyleSize(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Style Size</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "parts") && (<components_1.New label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Style Size"], ["Style Size"])))} to={"".concat(path_1.path.to.newStyleSize, "?").concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Style Sizes"], ["Style Sizes"])))}/>);
});
StyleSizesTable.displayName = "StyleSizesTable";
exports.default = StyleSizesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
