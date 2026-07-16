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
var path_1 = require("~/utils/path");
var MaterialShapesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var rows = (0, react_2.useMemo)(function () { return data; }, [data]);
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("materialForm");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.companyId === null ? (<Enumerable_1.Enumerable value={row.original.name}/>) : (<components_1.Hyperlink to={"".concat(path_1.path.to.materialForm(row.original.id), "?").concat(params.toString())}>
                <Enumerable_1.Enumerable value={row.original.name}/>
              </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "code",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Code"], ["Code"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.code;
                },
                meta: {
                    icon: <lu_1.LuCode />
                }
            },
            {
                accessorKey: "id",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["ID"], ["ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<div className="flex items-center gap-2">
              <span className="font-mono text-xs">{row.original.id}</span>
              <react_1.Copy text={row.original.id}/>
            </div>);
                },
                meta: {
                    icon: <lu_1.LuKeySquare />
                }
            },
            {
                accessorKey: "companyId",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Standard"], ["Standard"]))),
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
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [params, customColumns, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem disabled={!permissions.can("update", "parts") || row.companyId === null} onClick={function () {
                navigate("".concat(path_1.path.to.materialForm(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              <macro_1.Trans>Edit Material Shape</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem disabled={!permissions.can("delete", "parts") || row.companyId === null} destructive onClick={function () {
                navigate("".concat(path_1.path.to.deleteMaterialForm(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Material Shape</macro_1.Trans>
            </react_1.MenuItem>
          </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "parts") && (<components_1.New label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Material Shape"], ["Material Shape"])))} to={"".concat(path_1.path.to.newMaterialForm, "?").concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Material Shapes"], ["Material Shapes"])))}/>);
});
MaterialShapesTable.displayName = "MaterialShapesTable";
exports.default = MaterialShapesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
