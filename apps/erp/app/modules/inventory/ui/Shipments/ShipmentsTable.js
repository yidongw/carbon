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
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var inventory_models_1 = require("../../inventory.models");
var ShipmentStatus_1 = require("./ShipmentStatus");
function NewShipment() {
    var fetcher = (0, react_router_1.useFetcher)();
    return (<fetcher.Form method="post" action={path_1.path.to.newShipment}>
      <react_1.Button type="submit" leftIcon={<lu_1.LuCirclePlus />} variant="primary" isLoading={fetcher.state !== "idle"}>
        <macro_1.Trans>Add Shipment</macro_1.Trans>
      </react_1.Button>
    </fetcher.Form>);
}
var ShipmentsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    (0, hooks_1.useRealtime)("shipment", "id=in.(".concat(data.map(function (d) { return d.id; }).join(","), ")"));
    var params = (0, hooks_1.useUrlParams)()[0];
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var rows = (0, react_2.useMemo)(function () { return data; }, [data]);
    var people = (0, stores_1.usePeople)()[0];
    var customers = (0, stores_1.useCustomers)()[0];
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("shipment");
    var columns = (0, react_2.useMemo)(function () {
        var result = [
            {
                accessorKey: "shipmentId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Shipment ID"], ["Shipment ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.shipmentDetails(row.original.id)}>
            {row.original.shipmentId}
          </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "sourceDocument",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Source Document"], ["Source Document"]))),
                cell: function (item) { return <Enumerable_1.Enumerable value={item.getValue()}/>; },
                meta: {
                    filter: {
                        type: "static",
                        options: inventory_models_1.shipmentSourceDocumentType.map(function (type) { return ({
                            value: type,
                            label: <Enumerable_1.Enumerable value={type}/>
                        }); })
                    },
                    icon: <lu_1.LuFileText />
                }
            },
            {
                accessorKey: "sourceDocumentReadableId",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Source Document ID"], ["Source Document ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    if (!row.original.sourceDocumentId)
                        return null;
                    switch (row.original.sourceDocument) {
                        case "Sales Invoice":
                            return (<components_1.Hyperlink to={path_1.path.to.salesInvoiceDetails(row.original.sourceDocumentId)}>
                  {row.original.sourceDocumentReadableId}
                </components_1.Hyperlink>);
                        case "Sales Order":
                            return (<components_1.Hyperlink to={path_1.path.to.salesOrderDetails(row.original.sourceDocumentId)}>
                  {row.original.sourceDocumentReadableId}
                </components_1.Hyperlink>);
                        case "Purchase Order":
                            return (<components_1.Hyperlink to={path_1.path.to.purchaseOrderDetails(row.original.sourceDocumentId)}>
                  {row.original.sourceDocumentReadableId}
                </components_1.Hyperlink>);
                        case "Outbound Transfer":
                            return (<components_1.Hyperlink to={path_1.path.to.warehouseTransferDetails(row.original.sourceDocumentId)}>
                  {row.original.sourceDocumentReadableId}
                </components_1.Hyperlink>);
                        default:
                            return null;
                    }
                },
                meta: {
                    icon: <lu_1.LuHash />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (item) {
                    var status = item.getValue();
                    return (<ShipmentStatus_1.default status={status} invoiced={item.row.original.invoiced}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: inventory_models_1.shipmentStatusType.map(function (type) { return ({
                            value: type,
                            label: <ShipmentStatus_1.default status={type}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Statuses"], ["Statuses"]))),
                    icon: <lu_1.LuClock />
                }
            },
            {
                accessorKey: "invoiced",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Invoiced"], ["Invoiced"]))),
                cell: function (item) { return <react_1.Checkbox isChecked={item.getValue()}/>; },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "true", label: "Yes" },
                            { value: "false", label: "No" }
                        ]
                    },
                    icon: <lu_1.LuCheck />
                }
            },
            {
                id: "postedBy",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Posted By"], ["Posted By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.postedBy}/>);
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
                accessorKey: "postingDate",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Posting Date"], ["Posting Date"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "assignee",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
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
                id: "customerId",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Customer"], ["Customer"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <components_1.CustomerAvatar customerId={row.original.customerId}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: customers === null || customers === void 0 ? void 0 : customers.map(function (customer) { return ({
                            value: customer.id,
                            label: customer.name
                        }); })
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "externalDocumentId",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["External Ref."], ["External Ref."]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuHash />
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Created By"], ["Created By"]))),
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
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
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
                header: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        return __spreadArray(__spreadArray([], result, true), customColumns, true);
    }, [people, customers, customColumns, t, formatDate]);
    var _b = (0, react_2.useState)(null), selectedShipment = _b[0], setSelectedShipment = _b[1];
    var deleteShipmentModal = (0, react_1.useDisclosure)();
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "inventory")} onClick={function () {
                navigate("".concat(path_1.path.to.shipmentDetails(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            {row.postingDate ? t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["View Shipment"], ["View Shipment"]))) : t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Edit Shipment"], ["Edit Shipment"])))}
          </react_1.MenuItem>
          <react_1.MenuItem disabled={!permissions.can("delete", "inventory") ||
                !!row.postingDate ||
                row.status === "Pending"} destructive onClick={function () {
                setSelectedShipment(row);
                deleteShipmentModal.onOpen();
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Shipment</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [deleteShipmentModal, navigate, params, permissions, t]);
    return (<>
      <components_1.Table data={data} columns={columns} count={count} defaultColumnPinning={{
            left: ["shipmentId"]
        }} defaultColumnVisibility={{
            createdAt: false,
            createdBy: false,
            updatedAt: false,
            updatedBy: false
        }} primaryAction={permissions.can("create", "inventory") && <NewShipment />} renderContextMenu={renderContextMenu} title={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Shipments"], ["Shipments"])))} table="shipment" withSavedView/>
      {selectedShipment && selectedShipment.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteShipment(selectedShipment.id)} isOpen={deleteShipmentModal.isOpen} name={selectedShipment.shipmentId} text={"Are you sure you want to delete ".concat(selectedShipment.shipmentId, "? This cannot be undone.")} onCancel={function () {
                deleteShipmentModal.onClose();
                setSelectedShipment(null);
            }} onSubmit={function () {
                deleteShipmentModal.onClose();
                setSelectedShipment(null);
            }}/>)}
    </>);
});
ShipmentsTable.displayName = "ShipmentsTable";
exports.default = ShipmentsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
