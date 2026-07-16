"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var items_1 = require("~/stores/items");
var path_1 = require("~/utils/path");
var defaultColumnVisibility = {
    createdAt: false,
    updatedAt: false,
    updatedBy: false
};
var InspectionDocumentTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var items = (0, items_1.useItems)()[0];
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(null), selectedDiagram = _b[0], setSelectedDiagram = _b[1];
    var columns = (0, react_2.useMemo)(function () { return [
        {
            accessorKey: "partId",
            header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Part"], ["Part"]))),
            cell: function (_a) {
                var _b;
                var row = _a.row;
                var partId = row.original.partId;
                if (!partId) {
                    return <span className="text-muted-foreground">—</span>;
                }
                var item = items.find(function (i) { return i.id === partId; });
                return (<components_1.Hyperlink to={path_1.path.to.inspectionDocument(row.original.id)}>
                <react_1.VStack spacing={0} className="min-w-[160px] leading-tight">
                  <span className="truncate font-medium">
                    {(_b = item === null || item === void 0 ? void 0 : item.readableIdWithRevision) !== null && _b !== void 0 ? _b : partId}
                  </span>
                  {(item === null || item === void 0 ? void 0 : item.name) ? (<span className="truncate text-xs text-muted-foreground">
                      {item.name}
                    </span>) : null}
                </react_1.VStack>
              </components_1.Hyperlink>);
            },
            meta: {
                filter: {
                    type: "static",
                    options: items === null || items === void 0 ? void 0 : items.map(function (item) { return ({
                        value: item.id,
                        label: item.readableIdWithRevision
                    }); })
                },
                icon: <lu_1.LuBookMarked />
            }
        },
        {
            accessorKey: "name",
            header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Name"], ["Name"]))),
            cell: function (_a) {
                var row = _a.row;
                return row.original.name;
            },
            meta: { icon: <lu_1.LuTarget /> }
        },
        {
            id: "createdBy",
            header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Created By"], ["Created By"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<components_1.EmployeeAvatar employeeId={row.original.createdBy}/>);
            },
            meta: { icon: <lu_1.LuUser /> }
        },
        {
            accessorKey: "createdAt",
            header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Created At"], ["Created At"]))),
            cell: function (item) { return (0, utils_1.formatDate)(item.getValue()); },
            meta: { icon: <lu_1.LuFileText /> }
        },
        {
            id: "updatedBy",
            header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<components_1.EmployeeAvatar employeeId={row.original.updatedBy}/>);
            },
            meta: { icon: <lu_1.LuUser /> }
        },
        {
            accessorKey: "updatedAt",
            header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
            cell: function (item) { return (0, utils_1.formatDate)(item.getValue()); },
            meta: { icon: <lu_1.LuFileText /> }
        }
    ]; }, [items, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) { return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "quality")} onClick={function () {
            navigate("".concat(path_1.path.to.inspectionDocument(row.id), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
        }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            Edit Diagram
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "quality")} onClick={function () {
            (0, react_dom_1.flushSync)(function () {
                setSelectedDiagram(row);
            });
            deleteDisclosure.onOpen();
        }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            Delete Diagram
          </react_1.MenuItem>
        </>); }, [permissions, navigate, params, deleteDisclosure]);
    return (<>
        <components_1.Table data={data} columns={columns} count={count} defaultColumnVisibility={defaultColumnVisibility} primaryAction={permissions.can("create", "quality") && (<components_1.New label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Inspection Document"], ["Inspection Document"])))} to={"".concat(path_1.path.to.newInspectionDocument, "?").concat(params === null || params === void 0 ? void 0 : params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Inspection Documents"], ["Inspection Documents"])))}/>
        {deleteDisclosure.isOpen && selectedDiagram && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteInspectionDocument(selectedDiagram.id)} isOpen onCancel={function () {
                setSelectedDiagram(null);
                deleteDisclosure.onClose();
            }} onSubmit={function () {
                setSelectedDiagram(null);
                deleteDisclosure.onClose();
            }} name={selectedDiagram.name} text={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Are you sure you want to delete this inspection document?"], ["Are you sure you want to delete this inspection document?"])))}/>)}
      </>);
});
InspectionDocumentTable.displayName = "InspectionDocumentTable";
exports.default = InspectionDocumentTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
