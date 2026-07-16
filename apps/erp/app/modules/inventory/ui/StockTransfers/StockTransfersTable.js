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
var Location_1 = require("~/components/Form/Location");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var inventory_models_1 = require("../../inventory.models");
var StockTransferStatus_1 = require("./StockTransferStatus");
var StockTransferWizard_1 = require("./StockTransferWizard");
var StockTransfersTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, locationId = _a.locationId;
    var wizardDisclosure = (0, react_1.useDisclosure)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var rows = (0, react_2.useMemo)(function () { return data; }, [data]);
    var people = (0, stores_1.usePeople)()[0];
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("stockTransfer");
    var locations = (0, Location_1.useLocations)();
    var columns = (0, react_2.useMemo)(function () {
        var result = [
            {
                accessorKey: "stockTransferId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Stock Transfer ID"], ["Stock Transfer ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.stockTransfer(row.original.id)}>
              {row.original.stockTransferId}
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "locationId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<Enumerable_1.Enumerable value={(_c = (_b = locations.find(function (l) { return l.value === row.original.locationId; })) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : null}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: locations.map(function (type) { return ({
                            value: type.value,
                            label: <Enumerable_1.Enumerable value={type.label}/>
                        }); })
                    },
                    icon: <lu_1.LuMapPin />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (item) {
                    var status = item.getValue();
                    return <StockTransferStatus_1.default status={status}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: inventory_models_1.stockTransferStatusType.map(function (type) { return ({
                            value: type,
                            label: <StockTransferStatus_1.default status={type}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Statuses"], ["Statuses"]))),
                    icon: <lu_1.LuClock />
                }
            },
            {
                accessorKey: "assignee",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.assignee}/>);
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
                accessorKey: "completedAt",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Completed At"], ["Completed At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Created By"], ["Created By"]))),
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
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
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
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        return __spreadArray(__spreadArray([], result, true), customColumns, true);
    }, [locations, people, customColumns, t, formatDate]);
    var _b = (0, react_2.useState)(null), selectedStockTransfer = _b[0], setSelectedStockTransfer = _b[1];
    var deleteStockTransferModal = (0, react_1.useDisclosure)();
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem disabled={!permissions.can("update", "inventory")} onClick={function () {
                navigate("".concat(path_1.path.to.shipmentDetails(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              {row.completedAt
                ? t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["View Stock Transfer"], ["View Stock Transfer"]))) : t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Edit Stock Transfer"], ["Edit Stock Transfer"])))}
            </react_1.MenuItem>
            <react_1.MenuItem disabled={!permissions.can("delete", "inventory") ||
                !!row.completedAt ||
                ["Completed", "In Progress"].includes(row.status)} destructive onClick={function () {
                setSelectedStockTransfer(row);
                deleteStockTransferModal.onOpen();
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Stock Transfer</macro_1.Trans>
            </react_1.MenuItem>
          </>);
    }, [deleteStockTransferModal, navigate, params, permissions, t]);
    return (<>
        <components_1.Table data={data} columns={columns} count={count} defaultColumnPinning={{
            left: ["shipmentId"]
        }} defaultColumnVisibility={{
            updatedAt: false,
            updatedBy: false
        }} primaryAction={<div className="flex items-center gap-2">
              <react_1.Combobox asButton size="sm" value={locationId} options={locations} onChange={function (selected) {
                // hard refresh because initialValues update has no effect otherwise
                window.location.href = getLocationPath(selected);
            }}/>
              {permissions.can("create", "inventory") && (<react_1.Button onClick={function () {
                    (0, stores_1.clearStockTransferWizard)();
                    wizardDisclosure.onOpen();
                }} leftIcon={<lu_1.LuCirclePlus />}>
                  Add Stock Transfer
                </react_1.Button>)}
            </div>} renderContextMenu={renderContextMenu} title={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Stock Transfers"], ["Stock Transfers"])))} table="stockTransfer" withSavedView/>
        {selectedStockTransfer && selectedStockTransfer.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteStockTransfer(selectedStockTransfer.id)} isOpen={deleteStockTransferModal.isOpen} name={selectedStockTransfer.stockTransferId} text={"Are you sure you want to delete ".concat(selectedStockTransfer.stockTransferId, "? This cannot be undone.")} onCancel={function () {
                deleteStockTransferModal.onClose();
                setSelectedStockTransfer(null);
            }} onSubmit={function () {
                deleteStockTransferModal.onClose();
                setSelectedStockTransfer(null);
            }}/>)}
        {wizardDisclosure.isOpen && (<StockTransferWizard_1.StockTransferWizard locationId={locationId} onClose={wizardDisclosure.onClose}/>)}
      </>);
});
StockTransfersTable.displayName = "StockTransfersTable";
exports.default = StockTransfersTable;
function getLocationPath(locationId) {
    return "".concat(path_1.path.to.stockTransfers, "?location=").concat(locationId);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
