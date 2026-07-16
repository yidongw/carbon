"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var RequiredActionsTable = (0, react_2.memo)(function (_a) {
    var _b;
    var data = _a.data, count = _a.count;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(null), selectedRequiredAction = _c[0], setSelectedRequiredAction = _c[1];
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Required Action"], ["Required Action"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id}>
              <Enumerable_1.Enumerable value={row.original.name}/>
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuSquareCheck />
                }
            },
            {
                accessorKey: "active",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Active"], ["Active"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <react_1.Checkbox checked={row.original.active}/>;
                }
            }
        ];
        return defaultColumns;
    }, [t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.requiredAction(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              Edit Action
            </react_1.MenuItem>
            <react_1.MenuItem destructive disabled={!permissions.can("delete", "quality")} onClick={function () {
                (0, react_dom_1.flushSync)(function () {
                    setSelectedRequiredAction(row);
                });
                deleteDisclosure.onOpen();
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              Delete Action
            </react_1.MenuItem>
          </>);
    }, [navigate, params, permissions, deleteDisclosure]);
    return (<>
        <components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "quality") && (<components_1.New label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Required Action"], ["Required Action"])))} to={"".concat(path_1.path.to.newRequiredAction, "?").concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Required Actions"], ["Required Actions"])))}/>
        {deleteDisclosure.isOpen && selectedRequiredAction && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteRequiredAction(selectedRequiredAction.id)} isOpen onCancel={function () {
                setSelectedRequiredAction(null);
                deleteDisclosure.onClose();
            }} onSubmit={function () {
                setSelectedRequiredAction(null);
                deleteDisclosure.onClose();
            }} name={(_b = selectedRequiredAction.name) !== null && _b !== void 0 ? _b : "required action"} text={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Are you sure you want to delete this required action?"], ["Are you sure you want to delete this required action?"])))}/>)}
      </>);
});
RequiredActionsTable.displayName = "RequiredActionsTable";
exports.default = RequiredActionsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
