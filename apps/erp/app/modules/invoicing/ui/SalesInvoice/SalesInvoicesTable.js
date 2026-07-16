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
var Location_1 = require("~/components/Form/Location");
var PaymentTerm_1 = require("~/components/Form/PaymentTerm");
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var invoicing_1 = require("~/modules/invoicing");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var SalesInvoiceStatus_1 = require("./SalesInvoiceStatus");
// Sales invoice inline edits go through the shared sales invoice bulk-update action.
var SALES_INVOICE_UPDATE = {
    action: path_1.path.to.bulkUpdateSalesInvoice,
    idKey: "ids"
};
var SalesInvoicesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    (0, hooks_1.useRealtime)("salesInvoice", "id=in.(".concat(data.map(function (d) { return d.id; }).join(","), ")"));
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var _b = (0, react_2.useState)(null), selectedSalesInvoice = _b[0], setSelectedSalesInvoice = _b[1];
    var closeSalesInvoiceModal = (0, react_1.useDisclosure)();
    var people = (0, stores_1.usePeople)()[0];
    var customers = (0, stores_1.useCustomers)()[0];
    var locations = (0, Location_1.useLocations)();
    var paymentTerms = (0, PaymentTerm_1.usePaymentTerm)();
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("salesInvoice");
    var columns = (0, react_2.useMemo)(function () {
        var _a;
        var defaultColumns = [
            {
                accessorKey: "invoiceId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Invoice Number"], ["Invoice Number"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<react_1.HStack>
            <components_1.ItemThumbnail size="sm" thumbnailPath={row.original.thumbnailPath} 
                    // @ts-ignore
                    type={row.original.itemType || "Part"}/>
            <components_1.Hyperlink to={path_1.path.to.salesInvoiceDetails(row.original.id)}>
              {(_b = row.original) === null || _b === void 0 ? void 0 : _b.invoiceId}
            </components_1.Hyperlink>
          </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                id: "customerId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Customer"], ["Customer"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "customerId",
                    update: SALES_INVOICE_UPDATE,
                    value: function (r) { return r.customerId; },
                    options: (_a = customers === null || customers === void 0 ? void 0 : customers.map(function (c) { return ({ value: c.id, label: c.name }); })) !== null && _a !== void 0 ? _a : [],
                    renderInline: function (v) { return <components_1.CustomerAvatar customerId={v}/>; }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: customers === null || customers === void 0 ? void 0 : customers.map(function (customer) { return ({
                            value: customer.id,
                            label: customer.name
                        }); })
                    },
                    icon: <lu_1.LuContainer />
                }
            },
            {
                id: "invoiceCustomerId",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Invoice Customer"], ["Invoice Customer"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.CustomerAvatar customerId={row.original.invoiceCustomerId}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: customers === null || customers === void 0 ? void 0 : customers.map(function (customer) { return ({
                            value: customer.id,
                            label: customer.name
                        }); })
                    },
                    icon: <lu_1.LuContainer />
                }
            },
            {
                accessorKey: "customerReference",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Customer PO"], ["Customer PO"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "customerReference",
                    update: SALES_INVOICE_UPDATE,
                    value: function (r) { return r.customerReference; }
                }),
                meta: {
                    icon: <lu_1.LuQrCode />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (item) {
                    var status = item.getValue();
                    return <SalesInvoiceStatus_1.default status={status}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: invoicing_1.salesInvoiceStatusType.map(function (status) { return ({
                            value: status,
                            label: <SalesInvoiceStatus_1.default status={status}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Statuses"], ["Statuses"]))),
                    icon: <lu_1.LuStar />
                }
            },
            {
                accessorKey: "invoiceTotal",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Invoice Total"], ["Invoice Total"]))),
                cell: function (item) { return currencyFormatter.format(item.getValue()); },
                meta: {
                    icon: <lu_1.LuDollarSign />,
                    formatter: currencyFormatter.format,
                    renderTotal: true
                }
            },
            {
                id: "assignee",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.id) !== null && _b !== void 0 ? _b : ""} table="salesInvoice" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
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
                accessorKey: "dateIssued",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Issued Date"], ["Issued Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "dateIssued",
                    update: SALES_INVOICE_UPDATE,
                    value: function (r) { return r.dateIssued; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "dateDue",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Due Date"], ["Due Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "dateDue",
                    update: SALES_INVOICE_UPDATE,
                    value: function (r) { return r.dateDue; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "datePaid",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Paid Date"], ["Paid Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "datePaid",
                    update: SALES_INVOICE_UPDATE,
                    value: function (r) { return r.datePaid; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "postingDate",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Posting Date"], ["Posting Date"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "paymentTermName",
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Payment Method"], ["Payment Method"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "paymentTermId",
                    update: SALES_INVOICE_UPDATE,
                    value: function (r) { return r.paymentTermId; },
                    options: paymentTerms,
                    fallbackLabel: function (r) { return r.paymentTermName; }
                }),
                meta: {
                    icon: <lu_1.LuCreditCard />
                }
            },
            {
                accessorKey: "locationName",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "locationId",
                    update: SALES_INVOICE_UPDATE,
                    value: function (r) { return r.locationId; },
                    options: locations,
                    fallbackLabel: function (r) { return r.locationName; }
                }),
                meta: {
                    icon: <lu_1.LuMapPin />
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Created By"], ["Created By"]))),
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
                header: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
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
                header: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [currencyFormatter, customColumns, people, customers, t, formatDate]);
    var renderContextMenu = (0, react_2.useMemo)(function () {
        return function (row) { return (<>
        <react_1.MenuItem disabled={!permissions.can("view", "invoicing")} onClick={function () { return navigate(path_1.path.to.salesInvoice(row.id)); }}>
          <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
          <macro_1.Trans>Edit</macro_1.Trans>
        </react_1.MenuItem>
        <react_1.MenuItem disabled={row.status !== "Draft" || !permissions.can("delete", "invoicing")} destructive onClick={function () {
                setSelectedSalesInvoice(row);
                closeSalesInvoiceModal.onOpen();
            }}>
          <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
          <macro_1.Trans>Delete</macro_1.Trans>
        </react_1.MenuItem>
      </>); };
    }, [closeSalesInvoiceModal, navigate, permissions]);
    return (<>
      <components_1.Table count={count} columns={columns} data={data} defaultColumnPinning={{
            left: ["invoiceId"]
        }} defaultColumnVisibility={{
            invoiceCustomerId: false,
            paymentTermName: false,
            locationName: false,
            dateIssued: false,
            datePaid: false,
            postingDate: false,
            createdAt: false,
            createdBy: false,
            updatedAt: false,
            updatedBy: false
        }} primaryAction={permissions.can("create", "invoicing") && (<components_1.New label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Sales Invoice"], ["Sales Invoice"])))} to={path_1.path.to.newSalesInvoice}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Sales Invoices"], ["Sales Invoices"])))} table="salesInvoice" withSavedView/>

      {selectedSalesInvoice && selectedSalesInvoice.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteSalesInvoice(selectedSalesInvoice.id)} isOpen={closeSalesInvoiceModal.isOpen} name={selectedSalesInvoice.invoiceId} text={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Are you sure you want to permanently delete ", "?"], ["Are you sure you want to permanently delete ", "?"])), selectedSalesInvoice.invoiceId)} onCancel={function () {
                closeSalesInvoiceModal.onClose();
                setSelectedSalesInvoice(null);
            }} onSubmit={function () {
                closeSalesInvoiceModal.onClose();
                setSelectedSalesInvoice(null);
            }}/>)}
    </>);
});
SalesInvoicesTable.displayName = "SalesInvoicesTable";
exports.default = SalesInvoicesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21;
