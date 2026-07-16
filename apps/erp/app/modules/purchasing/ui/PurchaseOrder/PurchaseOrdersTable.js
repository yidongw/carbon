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
var PaymentTerm_1 = require("~/components/Form/PaymentTerm");
var ShippingMethod_1 = require("~/components/Form/ShippingMethod");
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var purchasing_1 = require("~/modules/purchasing");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var PurchasingStatus_1 = require("./PurchasingStatus");
var usePurchaseOrder_1 = require("./usePurchaseOrder");
// Purchase order inline edits go through the shared PO bulk-update action.
var PO_UPDATE = {
    action: path_1.path.to.bulkUpdatePurchaseOrder,
    idKey: "ids"
};
var PurchaseOrdersTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    (0, hooks_1.useRealtime)("purchaseOrder");
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var _b = (0, react_2.useState)(null), selectedPurchaseOrder = _b[0], setSelectedPurchaseOrder = _b[1];
    var deletePurchaseOrderModal = (0, react_1.useDisclosure)();
    var people = (0, stores_1.usePeople)()[0];
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var shippingMethods = (0, ShippingMethod_1.useShippingMethod)();
    var paymentTerms = (0, PaymentTerm_1.usePaymentTerm)();
    var _c = (0, usePurchaseOrder_1.usePurchaseOrder)(), edit = _c.edit, receive = _c.receive;
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("purchaseOrder");
    var columns = (0, react_2.useMemo)(function () {
        var _a;
        var defaultColumns = [
            {
                accessorKey: "purchaseOrderId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["PO Number"], ["PO Number"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack>
              <components_1.ItemThumbnail size="sm" thumbnailPath={row.original.thumbnailPath} 
                    // @ts-ignore
                    type={row.original.itemType}/>
              <components_1.Hyperlink to={path_1.path.to.purchaseOrderDetails(row.original.id)}>
                {row.original.purchaseOrderId}
              </components_1.Hyperlink>
            </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                id: "supplierId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Supplier"], ["Supplier"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "supplierId",
                    update: PO_UPDATE,
                    value: function (r) { return r.supplierId; },
                    options: (_a = suppliers === null || suppliers === void 0 ? void 0 : suppliers.map(function (s) { return ({ value: s.id, label: s.name }); })) !== null && _a !== void 0 ? _a : [],
                    renderInline: function (v) { return <components_1.SupplierAvatar supplierId={v}/>; }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: suppliers === null || suppliers === void 0 ? void 0 : suppliers.map(function (supplier) { return ({
                            value: supplier.id,
                            label: supplier.name
                        }); })
                    },
                    icon: <lu_1.LuContainer />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (item) {
                    var status = item.getValue();
                    return <PurchasingStatus_1.default status={status}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: purchasing_1.purchaseOrderStatusType.map(function (status) { return ({
                            value: status,
                            label: <PurchasingStatus_1.default status={status}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Statuses"], ["Statuses"]))),
                    icon: <lu_1.LuStar />
                }
            },
            {
                accessorKey: "supplierReference",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Supplier Ref."], ["Supplier Ref."]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "supplierReference",
                    update: PO_UPDATE,
                    value: function (r) { return r.supplierReference; }
                }),
                meta: {
                    icon: <lu_1.LuQrCode />
                }
            },
            {
                accessorKey: "orderDate",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Order Date"], ["Order Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "orderDate",
                    update: PO_UPDATE,
                    value: function (r) { return r.orderDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "receiptRequestedDate",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Requested Date"], ["Requested Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "receiptRequestedDate",
                    update: PO_UPDATE,
                    value: function (r) { return r.receiptRequestedDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "receiptPromisedDate",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Promised Date"], ["Promised Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "receiptPromisedDate",
                    update: PO_UPDATE,
                    value: function (r) { return r.receiptPromisedDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "orderTotal",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Order Total"], ["Order Total"]))),
                cell: function (item) { return currencyFormatter.format(item.getValue()); },
                meta: {
                    icon: <lu_1.LuDollarSign />,
                    formatter: currencyFormatter.format,
                    renderTotal: true
                }
            },
            {
                id: "assignee",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.id) !== null && _b !== void 0 ? _b : ""} table="purchaseOrder" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
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
                accessorKey: "shippingMethodId",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Shipping Method"], ["Shipping Method"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "shippingMethodId",
                    update: PO_UPDATE,
                    value: function (r) { return r.shippingMethodId; },
                    options: shippingMethods,
                    fallbackLabel: function (r) { return r.shippingMethodName; }
                }),
                meta: {
                    icon: <lu_1.LuTruck />
                }
            },
            {
                accessorKey: "paymentTermId",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Payment Method"], ["Payment Method"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "paymentTermId",
                    update: PO_UPDATE,
                    value: function (r) { return r.paymentTermId; },
                    options: paymentTerms,
                    fallbackLabel: function (r) { return r.paymentTermName; }
                }),
                meta: {
                    icon: <lu_1.LuCreditCard />
                }
            },
            {
                accessorKey: "dropShipment",
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Drop Shipment"], ["Drop Shipment"]))),
                cell: function (item) { return <react_1.Checkbox isChecked={item.getValue()}/>; },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "true", label: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Yes"], ["Yes"]))) },
                            { value: "false", label: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["No"], ["No"]))) }
                        ]
                    },
                    pluralHeader: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Drop Shipment Statuses"], ["Drop Shipment Statuses"]))),
                    icon: <lu_1.LuTruck />
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Created By"], ["Created By"]))),
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
                header: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
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
                header: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [
        suppliers,
        people,
        customColumns,
        currencyFormatter,
        shippingMethods,
        paymentTerms,
        t,
        formatDate
    ]);
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error.message);
        }
    }, [fetcher.data]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onBulkUpdate = (0, react_2.useCallback)(function (selectedRows, field, value) {
        var formData = new FormData();
        selectedRows.forEach(function (row) {
            if (row.id)
                formData.append("ids", row.id);
        });
        formData.append("field", field);
        if (value)
            formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdatePurchaseOrder
        });
    }, []);
    var renderActions = (0, react_2.useCallback)(function (selectedRows) {
        return (<react_1.DropdownMenuContent align="end" className="min-w-[200px]">
            <react_1.DropdownMenuLabel>Update</react_1.DropdownMenuLabel>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuGroup>
              <react_1.DropdownMenuItem disabled={!permissions.can("delete", "purchasing") ||
                selectedRows.some(function (row) { var _a; return !["Draft", "Planned"].includes((_a = row.status) !== null && _a !== void 0 ? _a : ""); })} destructive onClick={function () { return onBulkUpdate(selectedRows, "delete"); }}>
                <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
                <macro_1.Trans>Delete Purchase Orders</macro_1.Trans>
              </react_1.DropdownMenuItem>
            </react_1.DropdownMenuGroup>
          </react_1.DropdownMenuContent>);
    }, [onBulkUpdate, permissions]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        var _a, _b;
        return (<>
          <react_1.MenuItem disabled={!permissions.can("view", "purchasing")} onClick={function () { return edit(row); }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit</macro_1.Trans>
          </react_1.MenuItem>

          <react_1.MenuItem disabled={!permissions.can("create", "purchasing") || !row.id} onClick={function () {
                if (!row.id)
                    return;
                fetcher.submit(null, {
                    method: "post",
                    action: path_1.path.to.purchaseOrderDuplicate(row.id)
                });
            }}>
            <react_1.MenuIcon icon={<lu_1.LuCopy />}/>
            <macro_1.Trans>Duplicate</macro_1.Trans>
          </react_1.MenuItem>

          <react_1.MenuItem disabled={!["To Receive", "To Receive and Invoice"].includes((_a = row.status) !== null && _a !== void 0 ? _a : "") || !permissions.can("update", "inventory")} onClick={function () {
                receive(row);
            }}>
            <react_1.MenuIcon icon={<lu_1.LuHandCoins />}/>
            <macro_1.Trans>Receive</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem disabled={!permissions.can("delete", "purchasing") ||
                !["Draft", "Planned"].includes((_b = row.status) !== null && _b !== void 0 ? _b : "")} destructive onClick={function () {
                setSelectedPurchaseOrder(row);
                deletePurchaseOrderModal.onOpen();
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [deletePurchaseOrderModal, edit, fetcher, permissions, receive]);
    return (<>
        <components_1.Table count={count} columns={columns} data={data} defaultColumnPinning={{
            left: ["purchaseOrderId"]
        }} defaultColumnVisibility={{
            shippingMethodName: false,
            paymentTermName: false,
            dropShipment: false,
            createdBy: false,
            createdAt: false,
            updatedBy: false,
            updatedAt: false
        }} primaryAction={permissions.can("create", "purchasing") && (<components_1.New label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Purchase Order"], ["Purchase Order"])))} to={path_1.path.to.newPurchaseOrder}/>)} renderContextMenu={renderContextMenu} renderActions={renderActions} title={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Purchase Orders"], ["Purchase Orders"])))} table="purchaseOrder" withSavedView withSelectableRows/>

        {selectedPurchaseOrder && selectedPurchaseOrder.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deletePurchaseOrder(selectedPurchaseOrder.id)} isOpen={deletePurchaseOrderModal.isOpen} name={selectedPurchaseOrder.purchaseOrderId} text={"Are you sure you want to delete ".concat(selectedPurchaseOrder.purchaseOrderId, "? This cannot be undone.")} onCancel={function () {
                deletePurchaseOrderModal.onClose();
                setSelectedPurchaseOrder(null);
            }} onSubmit={function () {
                deletePurchaseOrderModal.onClose();
                setSelectedPurchaseOrder(null);
            }}/>)}
      </>);
});
PurchaseOrdersTable.displayName = "PurchaseOrdersTable";
exports.default = PurchaseOrdersTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22;
