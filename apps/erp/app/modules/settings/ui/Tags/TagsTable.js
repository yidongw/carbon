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
var Enumerable_1 = require("~/components/Enumerable");
var Overlay_1 = require("~/components/Overlay");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var TagsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var openOverlay = (0, Overlay_1.useOverlay)().openOverlay;
    var revalidator = (0, react_router_1.useRevalidator)();
    var openNewTag = (0, react_2.useCallback)(function () {
        openOverlay(Overlay_1.overlay.to.newTag(), {
            onCreated: function () { return revalidator.revalidate(); }
        });
    }, [openOverlay, revalidator]);
    var rows = (0, react_2.useMemo)(function () { return data; }, [data]);
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <Enumerable_1.Enumerable value={row.original.name}/>;
                }
            },
            {
                accessorKey: "table",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Applies to"], ["Applies to"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (_b = shared_1.tagTableLabels[row.original.table]) !== null && _b !== void 0 ? _b : row.original.table;
                }
            }
        ];
    }, [t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<react_1.MenuItem destructive disabled={!permissions.can("update", "settings")} onClick={function () {
                navigate(path_1.path.to.deleteTag(row.table, row.name));
            }}>
          <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
          Delete Tag
        </react_1.MenuItem>);
    }, [navigate, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.is("employee") && (<react_1.Button type="button" variant="primary" leftIcon={<lu_1.LuCirclePlus />} onClick={openNewTag}>
            <macro_1.Trans>Add Tag</macro_1.Trans>
          </react_1.Button>)} renderContextMenu={renderContextMenu} title={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Tags"], ["Tags"])))}/>);
});
TagsTable.displayName = "TagsTable";
exports.default = TagsTable;
var templateObject_1, templateObject_2, templateObject_3;
