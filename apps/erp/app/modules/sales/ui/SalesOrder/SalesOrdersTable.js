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
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var PaymentTerm_1 = require("~/components/Form/PaymentTerm");
var ShippingMethod_1 = require("~/components/Form/ShippingMethod");
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var JobStatus_1 = require("~/modules/production/ui/Jobs/JobStatus");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var SalesStatus_1 = require("./SalesStatus");
var useSalesOrder_1 = require("./useSalesOrder");
// Sales-order inline edits go through the shared sales-order bulk-update action.
var SALES_ORDER_UPDATE = {
    action: path_1.path.to.bulkUpdateSalesOrder,
    idKey: "ids"
};
var IconWithTooltip = function (_a) {
    var icon = _a.icon, tooltip = _a.tooltip;
    return (<react_1.Tooltip>
    <react_1.TooltipTrigger asChild>
      <span className="inline-flex">{icon}</span>
    </react_1.TooltipTrigger>
    <react_1.TooltipContent>
      <p>{tooltip}</p>
    </react_1.TooltipContent>
  </react_1.Tooltip>);
};
var SalesOrdersTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var _b = (0, react_2.useState)(null), selectedSalesOrder = _b[0], setSelectedSalesOrder = _b[1];
    var deleteSalesOrderModal = (0, react_1.useDisclosure)();
    var people = (0, stores_1.usePeople)()[0];
    var customers = (0, stores_1.useCustomers)()[0];
    var locations = (0, Location_1.useLocations)();
    var shippingMethods = (0, ShippingMethod_1.useShippingMethod)();
    var paymentTerms = (0, PaymentTerm_1.usePaymentTerm)();
    var todaysDate = (0, react_2.useMemo)(function () { return (0, date_1.today)((0, date_1.getLocalTimeZone)()); }, []);
    var edit = (0, useSalesOrder_1.useSalesOrder)().edit;
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("salesOrder");
    var columns = (0, react_2.useMemo)(function () {
        var _a;
        var defaultColumns = [
            {
                accessorKey: "salesOrderId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Sales Order Number"], ["Sales Order Number"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack>
            <components_1.ItemThumbnail size="md" thumbnailPath={row.original.thumbnailPath} 
                    // @ts-ignore
                    type={row.original.itemType}/>
            <components_1.Hyperlink to={path_1.path.to.salesOrderDetails(row.original.id)}>
              {row.original.salesOrderId}
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
                    update: SALES_ORDER_UPDATE,
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
                    icon: <lu_1.LuSquareUser />
                }
            },
            {
                accessorKey: "displayStatus",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <SalesStatus_1.default status={row.original.displayStatus}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: sales_models_1.salesOrderStatusType.map(function (status) { return ({
                            value: status,
                            label: <SalesStatus_1.default status={status}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Statuses"], ["Statuses"]))),
                    icon: <lu_1.LuStar />
                }
            },
            {
                id: "jobs",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Jobs"], ["Jobs"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    var jobs = ((_b = row.original.jobs) !== null && _b !== void 0 ? _b : []);
                    var lines = (_c = row.original.lines) !== null && _c !== void 0 ? _c : [];
                    if (lines.length === 0 ||
                        lines.every(function (line) { return line.methodType !== "Make to Order"; })) {
                        return null;
                    }
                    var everyMadeLineHasSufficientJobs = lines.every(function (line) {
                        var _a, _b;
                        if (line.methodType !== "Make to Order")
                            return true;
                        var relevantJobs = (_b = (_a = jobs.filter) === null || _a === void 0 ? void 0 : _a.call(jobs, function (job) { return job.salesOrderLineId === line.id; })) !== null && _b !== void 0 ? _b : [];
                        var totalJobQuantity = relevantJobs.reduce(function (acc, job) { return acc + job.quantity; }, 0);
                        return totalJobQuantity >= line.saleQuantity;
                    });
                    var everyMadeLineIsCompleted = lines.every(function (line) {
                        var _a, _b;
                        if (line.methodType !== "Make to Order")
                            return true;
                        var relevantJobs = (_b = (_a = jobs.filter) === null || _a === void 0 ? void 0 : _a.call(jobs, function (job) { return job.salesOrderLineId === line.id; })) !== null && _b !== void 0 ? _b : [];
                        var totalJobQuantity = relevantJobs.reduce(function (acc, job) { return acc + job.quantityComplete; }, 0);
                        return totalJobQuantity >= line.saleQuantity;
                    });
                    var statusIcon = everyMadeLineIsCompleted ? (<IconWithTooltip icon={<lu_1.LuCheck className="w-3 h-3 mr-2 text-emerald-500"/>} tooltip={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["All jobs completed"], ["All jobs completed"])))}/>) : everyMadeLineHasSufficientJobs ? (<IconWithTooltip icon={<lu_1.LuLoader className="w-3 h-3 mr-2 text-orange-500"/>} tooltip={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Jobs in progress"], ["Jobs in progress"])))}/>) : (<IconWithTooltip icon={<lu_1.LuTriangleAlert className="w-3 h-3 mr-2 text-red-500"/>} tooltip={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Not enough jobs to cover quantity"], ["Not enough jobs to cover quantity"])))}/>);
                    return (<div className={(0, react_1.cn)("flex flex-row items-center justify-center gap-2", !everyMadeLineHasSufficientJobs && jobs.length === 0
                            ? "justify-center"
                            : "justify-start")}>
              {!everyMadeLineHasSufficientJobs && jobs.length === 0 && (<react_1.Tooltip>
                  <react_1.TooltipTrigger asChild>
                    <span className="inline-flex">
                      <lu_1.LuTriangleAlert className="w-3 h-3 mr-2 text-red-500"/>
                    </span>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent side="left">
                    <p>
                      <macro_1.Trans>Not enough jobs to cover quantity</macro_1.Trans>
                    </p>
                  </react_1.TooltipContent>
                </react_1.Tooltip>)}
              {jobs.length > 0 && (<react_1.HoverCard>
                  <react_1.HoverCardTrigger>
                    <react_1.Badge variant="secondary" className="cursor-pointer">
                      {statusIcon}
                      {jobs.length}{" "}
                      {jobs.length > 1 ? (<macro_1.Trans>Jobs</macro_1.Trans>) : (<macro_1.Trans>Job</macro_1.Trans>)}
                      <lu_1.LuEllipsisVertical className="w-3 h-3 ml-2"/>
                    </react_1.Badge>
                  </react_1.HoverCardTrigger>
                  <react_1.HoverCardContent className="w-[400px]">
                    <div className="flex flex-col w-full gap-4 text-sm">
                      {jobs.map(function (job) {
                                var _a;
                                return (<div key={job.id} className="flex items-center justify-between gap-2">
                          <components_1.Hyperlink to={path_1.path.to.jobDetails(job.id)} className="flex items-center justify-start gap-1">
                            {job.jobId}
                          </components_1.Hyperlink>
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            <JobStatus_1.default status={job.status}/>
                            {[
                                        "Draft",
                                        "Planned",
                                        "In Progress",
                                        "Ready",
                                        "Paused"
                                    ].includes((_a = job.status) !== null && _a !== void 0 ? _a : "") && (<>
                                {job.dueDate &&
                                            (0, date_1.isSameDay)((0, date_1.parseDate)(job.dueDate), todaysDate) && <JobStatus_1.default status="Due Today"/>}
                                {job.dueDate &&
                                            (0, date_1.parseDate)(job.dueDate) < todaysDate && (<JobStatus_1.default status="Overdue"/>)}
                              </>)}
                          </div>
                        </div>);
                            })}
                    </div>
                  </react_1.HoverCardContent>
                </react_1.HoverCard>)}
            </div>);
                },
                meta: {
                    icon: <lu_1.LuFactory />
                }
            },
            {
                accessorKey: "customerReference",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Customer PO"], ["Customer PO"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "customerReference",
                    update: SALES_ORDER_UPDATE,
                    value: function (r) { return r.customerReference; }
                }),
                meta: {
                    icon: <lu_1.LuQrCode />
                }
            },
            {
                accessorKey: "orderDate",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Order Date"], ["Order Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "orderDate",
                    update: SALES_ORDER_UPDATE,
                    value: function (r) { return r.orderDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "orderTotal",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Order Total"], ["Order Total"]))),
                cell: function (item) { return currencyFormatter.format(item.getValue()); },
                meta: {
                    icon: <lu_1.LuDollarSign />,
                    formatter: currencyFormatter.format,
                    renderTotal: true
                }
            },
            {
                id: "assignee",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.id) !== null && _b !== void 0 ? _b : ""} table="salesOrder" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
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
                accessorKey: "receiptPromisedDate",
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Promised Date"], ["Promised Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "receiptPromisedDate",
                    update: SALES_ORDER_UPDATE,
                    value: function (r) { return r.receiptPromisedDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "shippingMethodId",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Shipping Method"], ["Shipping Method"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "shippingMethodId",
                    update: SALES_ORDER_UPDATE,
                    value: function (r) { return r.shippingMethodId; },
                    options: shippingMethods,
                    fallbackLabel: function (r) { return r.shippingMethodName; }
                }),
                meta: {
                    icon: <lu_1.LuTruck />
                }
            },
            {
                accessorKey: "locationId",
                header: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "locationId",
                    update: SALES_ORDER_UPDATE,
                    value: function (r) { return r.locationId; },
                    options: locations,
                    fallbackLabel: function (r) { return r.locationName; }
                }),
                meta: {
                    icon: <lu_1.LuMapPin />,
                    filter: {
                        type: "static",
                        options: locations.map(function (l) { return ({
                            value: l.value,
                            label: <Enumerable_1.Enumerable value={l.label}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "paymentTermId",
                header: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Payment Method"], ["Payment Method"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "paymentTermId",
                    update: SALES_ORDER_UPDATE,
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
                header: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Drop Shipment"], ["Drop Shipment"]))),
                cell: function (item) { return <react_1.Checkbox isChecked={item.getValue()}/>; },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            {
                                value: "true",
                                label: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Yes"], ["Yes"])))
                            },
                            {
                                value: "false",
                                label: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["No"], ["No"])))
                            }
                        ]
                    },
                    pluralHeader: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Drop Shipment Statuses"], ["Drop Shipment Statuses"]))),
                    icon: <lu_1.LuTruck />
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Created By"], ["Created By"]))),
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
                header: t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
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
                header: t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [
        customers,
        people,
        locations,
        shippingMethods,
        paymentTerms,
        customColumns,
        todaysDate,
        currencyFormatter,
        t,
        formatDate
    ]);
    var renderContextMenu = (0, react_2.useMemo)(function () {
        return function (row) { return (<>
        <react_1.MenuItem disabled={!permissions.can("view", "sales")} onClick={function () { return edit(row); }}>
          <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
          <macro_1.Trans>Edit</macro_1.Trans>
        </react_1.MenuItem>

        {/*<MenuItem
                disabled={
                  !["To Recieve", "To Receive and Invoice"].includes(
                    row.status ?? ""
                  ) || !permissions.can("update", "inventory")
                }
                onClick={() => {
                  receive(row);
                }}
              >
                <MenuIcon icon={<MdCallReceived />} />
                Receive
              </MenuItem>*/}
        <react_1.MenuItem disabled={!permissions.can("delete", "sales")} destructive onClick={function () {
                setSelectedSalesOrder(row);
                deleteSalesOrderModal.onOpen();
            }}>
          <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
          <macro_1.Trans>Delete</macro_1.Trans>
        </react_1.MenuItem>
      </>); };
    }, [deleteSalesOrderModal, edit, permissions /*receive*/]);
    return (<>
      <components_1.Table count={count} columns={columns} data={data} defaultColumnPinning={{
            left: ["salesOrderId"]
        }} defaultColumnVisibility={{
            receiptPromisedDate: false,
            shippingMethodName: false,
            shippingTermName: false,
            paymentTermName: false,
            dropShipment: false,
            createdBy: false,
            createdAt: false,
            updatedBy: false,
            updatedAt: false
        }} primaryAction={permissions.can("create", "sales") && (<components_1.New label={t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Sales Order"], ["Sales Order"])))} to={path_1.path.to.newSalesOrder}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Sales Orders"], ["Sales Orders"])))} table="salesOrder" withSavedView/>

      {selectedSalesOrder && selectedSalesOrder.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteSalesOrder(selectedSalesOrder.id)} isOpen={deleteSalesOrderModal.isOpen} name={selectedSalesOrder.salesOrderId} text={t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), selectedSalesOrder.salesOrderId)} onCancel={function () {
                deleteSalesOrderModal.onClose();
                setSelectedSalesOrder(null);
            }} onSubmit={function () {
                deleteSalesOrderModal.onClose();
                setSelectedSalesOrder(null);
            }}/>)}
    </>);
});
SalesOrdersTable.displayName = "SalesOrdersTable";
exports.default = SalesOrdersTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27;
