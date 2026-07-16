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
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var inventory_models_1 = require("../../inventory.models");
var PickingListStatus_1 = require("./PickingListStatus");
var PickingListsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var params = (0, hooks_1.useUrlParams)()[0];
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "pickingListId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Picking List ID"], ["Picking List ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.pickingListDetails(row.original.id)}>
            {row.original.pickingListId}
          </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookmark />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (item) {
                    var status = item.getValue();
                    return <PickingListStatus_1.default status={status}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: inventory_models_1.pickingListStatusType.map(function (type) { return ({
                            value: type,
                            label: <PickingListStatus_1.default status={type}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Statuses"], ["Statuses"]))),
                    icon: <lu_1.LuClock />
                }
            },
            {
                id: "assignee",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.assignee ? (<components_1.EmployeeAvatar employeeId={row.original.assignee}/>) : ("Unassigned");
                },
                meta: {
                    icon: <lu_1.LuUser />
                }
            },
            {
                id: "location",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.locationName || "N/A";
                },
                meta: {
                    icon: <lu_1.LuMapPin />
                }
            },
            {
                accessorKey: "dueDate",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Due Date"], ["Due Date"]))),
                cell: function (item) {
                    var date = item.getValue();
                    return date ? formatDate(date) : "N/A";
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "progress",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Progress"], ["Progress"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    var total = (_b = row.original.lineCount) !== null && _b !== void 0 ? _b : 0;
                    var completed = (_c = row.original.completedLineCount) !== null && _c !== void 0 ? _c : 0;
                    return "".concat(completed, "/").concat(total);
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Created"], ["Created"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Created By"], ["Created By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.createdBy}/>);
                },
                meta: {
                    icon: <lu_1.LuUser />
                }
            }
        ];
    }, [t, formatDate]);
    var _b = (0, react_2.useState)(null), selectedPickingList = _b[0], setSelectedPickingList = _b[1];
    var deleteModal = (0, react_1.useDisclosure)();
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "inventory")} onClick={function () {
                navigate("".concat(path_1.path.to.pickingListDetails(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            {row.status !== "Draft"
                ? t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["View Picking List"], ["View Picking List"]))) : t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Edit Picking List"], ["Edit Picking List"])))}
          </react_1.MenuItem>
          <react_1.MenuItem disabled={!permissions.can("delete", "inventory") || row.status !== "Draft"} destructive onClick={function () {
                setSelectedPickingList(row);
                deleteModal.onOpen();
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Picking List</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [deleteModal, navigate, params, permissions, t]);
    return (<>
      <components_1.Table data={data} columns={columns} count={count} defaultColumnPinning={{
            left: ["pickingListId"]
        }} defaultColumnVisibility={{
            createdAt: false,
            createdBy: false
        }} primaryAction={permissions.can("create", "inventory") ? (<react_1.Button asChild leftIcon={<lu_1.LuCirclePlus />}>
              <react_router_1.Link to={path_1.path.to.pickingSchedule}>
                <macro_1.Trans>New Picking List</macro_1.Trans>
              </react_router_1.Link>
            </react_1.Button>) : undefined} renderContextMenu={renderContextMenu} title={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Picking Lists"], ["Picking Lists"])))}/>
      {selectedPickingList && selectedPickingList.id && (<Modals_1.ConfirmDelete action={path_1.path.to.pickingListDelete(selectedPickingList.id)} isOpen={deleteModal.isOpen} name={selectedPickingList.pickingListId} text={"Are you sure you want to delete ".concat(selectedPickingList.pickingListId, "? This cannot be undone.")} onCancel={function () {
                deleteModal.onClose();
                setSelectedPickingList(null);
            }} onSubmit={function () {
                deleteModal.onClose();
                setSelectedPickingList(null);
            }}/>)}
    </>);
});
PickingListsTable.displayName = "PickingListsTable";
exports.default = PickingListsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
