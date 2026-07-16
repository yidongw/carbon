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
var InlineEditor_1 = require("~/components/InlineEditor");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
// Templates are items; description inline edits go through the items action.
var ITEM_UPDATE = {
    action: path_1.path.to.bulkUpdateItems,
    idKey: "items"
};
var TemplatesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var rows = (0, react_2.useMemo)(function () { return data; }, [data]);
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={"".concat(path_1.path.to.templateDetails(row.original.id), "?").concat(params.toString())}>
            <span className="truncate">{row.original.name}</span>
          </components_1.Hyperlink>);
                }
            },
            {
                accessorKey: "configurationParameterCount",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Config Params"], ["Config Params"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (_b = row.original.configurationParameterCount) !== null && _b !== void 0 ? _b : 0;
                }
            },
            {
                accessorKey: "bomCount",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["BOM"], ["BOM"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (_b = row.original.bomCount) !== null && _b !== void 0 ? _b : 0;
                }
            },
            {
                accessorKey: "bopCount",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["BOP"], ["BOP"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (_b = row.original.bopCount) !== null && _b !== void 0 ? _b : 0;
                }
            },
            {
                accessorKey: "description",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Description"], ["Description"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "description",
                    update: ITEM_UPDATE,
                    value: function (r) { return r.description; }
                })
            }
        ];
    }, [params, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={!permissions.can("view", "parts")} onClick={function () {
                navigate("".concat(path_1.path.to.templateDetails(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            {t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Open Template"], ["Open Template"])))}
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions, t]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "parts") && (<components_1.New label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Template"], ["Template"])))} to={"".concat(path_1.path.to.templates, "/new?").concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Templates"], ["Templates"])))}/>);
});
TemplatesTable.displayName = "TemplatesTable";
exports.default = TemplatesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
