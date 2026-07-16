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
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var inventory_models_1 = require("../../inventory.models");
var WarehouseTransferStatus_1 = require("./WarehouseTransferStatus");
var WarehouseTransfersTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    (0, hooks_1.useRealtime)("warehouseTransfer", "id=in.(".concat(data.map(function (d) { return d.id; }).join(","), ")"));
    var params = (0, hooks_1.useUrlParams)()[0];
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var rows = (0, react_2.useMemo)(function () { return data; }, [data]);
    var people = (0, stores_1.usePeople)()[0];
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("warehouseTransfer");
    var columns = (0, react_2.useMemo)(function () {
        var result = [
            {
                accessorKey: "transferId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Transfer ID"], ["Transfer ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.warehouseTransferDetails(row.original.id)}>
              {row.original.transferId}
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (item) {
                    var status = item.getValue();
                    return <WarehouseTransferStatus_1.default status={status}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: inventory_models_1.warehouseTransferStatusType.map(function (type) { return ({
                            value: type,
                            label: <WarehouseTransferStatus_1.default status={type}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Statuses"], ["Statuses"]))),
                    icon: <lu_1.LuClock />
                }
            },
            {
                id: "fromLocation",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["From Location"], ["From Location"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return ((_b = row.original.fromLocation) === null || _b === void 0 ? void 0 : _b.name) || "N/A";
                },
                meta: {
                    icon: <lu_1.LuMapPin />
                }
            },
            {
                id: "toLocation",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["To Location"], ["To Location"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return ((_b = row.original.toLocation) === null || _b === void 0 ? void 0 : _b.name) || "N/A";
                },
                meta: {
                    icon: <lu_1.LuMapPin />
                }
            },
            {
                accessorKey: "reference",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Reference"], ["Reference"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuHash />
                }
            },
            {
                accessorKey: "transferDate",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Transfer Date"], ["Transfer Date"]))),
                cell: function (item) {
                    var date = item.getValue();
                    return date ? formatDate(date) : "N/A";
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "expectedReceiptDate",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Expected Receipt"], ["Expected Receipt"]))),
                cell: function (item) {
                    var date = item.getValue();
                    return date ? formatDate(date) : "N/A";
                },
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
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.updatedBy}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "updatedAt",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        return __spreadArray(__spreadArray([], result, true), customColumns, true);
    }, [people, customColumns, t, formatDate]);
    var _b = (0, react_2.useState)(null), selectedTransfer = _b[0], setSelectedTransfer = _b[1];
    var deleteTransferModal = (0, react_1.useDisclosure)();
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem disabled={!permissions.can("update", "inventory")} onClick={function () {
                navigate("".concat(path_1.path.to.warehouseTransferDetails(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              {row.status !== "Draft" ? t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["View Transfer"], ["View Transfer"]))) : t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Edit Transfer"], ["Edit Transfer"])))}
            </react_1.MenuItem>
            <react_1.MenuItem disabled={!permissions.can("delete", "inventory") ||
                row.status === "Draft"} destructive onClick={function () {
                setSelectedTransfer(row);
                deleteTransferModal.onOpen();
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Transfer</macro_1.Trans>
            </react_1.MenuItem>
          </>);
    }, [deleteTransferModal, navigate, params, permissions, t]);
    return (<>
        <components_1.Table data={data} columns={columns} count={count} defaultColumnPinning={{
            left: ["transferId"]
        }} defaultColumnVisibility={{
            createdAt: false,
            createdBy: false,
            updatedAt: false,
            updatedBy: false
        }} primaryAction={permissions.can("create", "inventory") && (<components_1.New label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Warehouse Transfer"], ["Warehouse Transfer"])))} to={path_1.path.to.newWarehouseTransfer}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Warehouse Transfers"], ["Warehouse Transfers"])))} table="warehouseTransfer" withSavedView/>
        {selectedTransfer && selectedTransfer.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteWarehouseTransfer(selectedTransfer.id)} isOpen={deleteTransferModal.isOpen} name={selectedTransfer.transferId} text={"Are you sure you want to delete ".concat(selectedTransfer.transferId, "? This cannot be undone.")} onCancel={function () {
                deleteTransferModal.onClose();
                setSelectedTransfer(null);
            }} onSubmit={function () {
                deleteTransferModal.onClose();
                setSelectedTransfer(null);
            }}/>)}
      </>);
});
WarehouseTransfersTable.displayName = "WarehouseTransfersTable";
exports.default = WarehouseTransfersTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16;
