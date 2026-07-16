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
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var AuditLog_1 = require("~/components/AuditLog");
var CSVLink_1 = require("~/components/CSVLink");
var Form_1 = require("~/components/Form");
var Layout_1 = require("~/components/Layout");
var Confirm_1 = require("~/components/Modals/Confirm/Confirm");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var useIntegrations_1 = require("~/hooks/useIntegrations");
var Shipments_1 = require("~/modules/inventory/ui/Shipments");
var SalesInvoiceStatus_1 = require("~/modules/invoicing/ui/SalesInvoice/SalesInvoiceStatus");
var customers_1 = require("~/stores/customers");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var SalesStatus_1 = require("./SalesStatus");
var useSalesOrder_1 = require("./useSalesOrder");
var SalesOrderConfirmModal = function (_a) {
    var _b, _c, _d;
    var fetcher = _a.fetcher, salesOrder = _a.salesOrder, onClose = _a.onClose, _e = _a.defaultCc, defaultCc = _e === void 0 ? [] : _e;
    var t = (0, macro_1.useLingui)().t;
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("orderId not found");
    var integrations = (0, useIntegrations_1.useIntegrations)();
    var canEmail = integrations.has("email");
    var _f = (0, react_2.useState)(canEmail ? "Email" : "None"), notificationType = _f[0], setNotificationType = _f[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a, _b, _c;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onClose();
        }
        else if (((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success) === false && ((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.message)) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success]);
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={path_1.path.to.salesOrderConfirm(orderId)} validator={sales_models_1.salesConfirmValidator} onSuccess={onClose} defaultValues={{
            notification: notificationType,
            customerContact: (_c = salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.customerContactId) !== null && _c !== void 0 ? _c : undefined,
            cc: defaultCc
        }} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>{t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Confirm ", ""], ["Confirm ", ""])), salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.salesOrderId)}</react_1.ModalTitle>
            <react_1.ModalDescription>
              <macro_1.Trans>
                Are you sure you want to confirm this sales order? Confirming
                the order will affect on order quantities used to calculate
                supply and demand.
              </macro_1.Trans>
            </react_1.ModalDescription>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              {canEmail && (<form_1.SelectControlled label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Send Via"], ["Send Via"])))} name="notification" options={[
                {
                    label: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["None"], ["None"]))),
                    value: "None"
                },
                {
                    label: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Email"], ["Email"]))),
                    value: "Email"
                }
            ]} value={notificationType} onChange={function (t) {
                if (t)
                    setNotificationType(t.value);
            }}/>)}
              {notificationType === "Email" && (<>
                  <Form_1.CustomerContact name="customerContact" customer={(_d = salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.customerId) !== null && _d !== void 0 ? _d : undefined}/>
                  <Form_1.EmailRecipients name="cc" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["CC"], ["CC"])))} type="employee"/>
                </>)}
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button type="submit" isLoading={fetcher.state !== "idle"}>
              <macro_1.Trans>Confirm</macro_1.Trans>
            </react_1.Button>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
};
function SalesOrderTopbarLeft(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
    var orderId = _a.orderId;
    var t = (0, macro_1.useLingui)().t;
    var company = (0, hooks_1.useUser)().company;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.salesOrder(orderId));
    if (!(routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder))
        throw new Error("Failed to load sales order");
    var permissions = (0, hooks_1.usePermissions)();
    var isLocked = (0, sales_models_1.isSalesOrderLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _b === void 0 ? void 0 : _b.status);
    var statusFetcher = (0, react_router_1.useFetcher)();
    var confirmFetcher = (0, react_router_1.useFetcher)();
    var _3 = (0, useSalesOrder_1.useSalesOrder)(), ship = _3.ship, invoice = _3.invoice;
    // Check if there are any lines with "Make" method type that would require jobs
    var hasMakeItems = (_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _c === void 0 ? void 0 : _c.some(function (line) { return line.methodType === "Make to Order"; })) !== null && _d !== void 0 ? _d : false;
    var salesOrderToJobsModal = (0, react_1.useDisclosure)();
    var confirmDisclosure = (0, react_1.useDisclosure)();
    var deleteSalesOrderModal = (0, react_1.useDisclosure)();
    var customers = (0, customers_1.useCustomers)()[0];
    var _4 = (0, AuditLog_1.useAuditLog)({
        entityType: "salesOrder",
        entityId: orderId,
        companyId: company.id,
        variant: "dropdown"
    }), auditLogTrigger = _4.trigger, auditLogDrawer = _4.drawer;
    var csvExportData = (0, react_2.useMemo)(function () {
        var headers = [
            "Part ID",
            "Quantity",
            "Customer",
            "Customer #",
            "Sales Order #",
            "Order Date",
            "Promised Date"
        ];
        if (!(routeData === null || routeData === void 0 ? void 0 : routeData.lines))
            return [headers];
        return __spreadArray([
            headers
        ], routeData === null || routeData === void 0 ? void 0 : routeData.lines.map(function (item) {
            var _a, _b, _c, _d;
            return [
                item.itemReadableId,
                item.saleQuantity,
                (_a = customers.find(function (c) { var _a; return c.id === ((_a = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _a === void 0 ? void 0 : _a.customerId); })) === null || _a === void 0 ? void 0 : _a.name,
                (_b = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _b === void 0 ? void 0 : _b.customerReference,
                (_c = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _c === void 0 ? void 0 : _c.salesOrderId,
                (_d = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _d === void 0 ? void 0 : _d.orderDate,
                item.promisedDate
            ];
        }), true);
    }, [
        customers,
        routeData === null || routeData === void 0 ? void 0 : routeData.lines,
        (_e = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _e === void 0 ? void 0 : _e.customerId,
        (_f = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _f === void 0 ? void 0 : _f.customerReference,
        (_g = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _g === void 0 ? void 0 : _g.orderDate,
        (_h = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _h === void 0 ? void 0 : _h.salesOrderId
    ]);
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarId to={path_1.path.to.salesOrderDetails(orderId)}>
          {(_j = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _j === void 0 ? void 0 : _j.salesOrderId}
        </Layout_1.DetailTopbarId>
        <react_1.Copy text={(_l = (_k = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _k === void 0 ? void 0 : _k.salesOrderId) !== null && _l !== void 0 ? _l : ""}/>
        <SalesStatus_1.default iconOnly status={(_m = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _m === void 0 ? void 0 : _m.status} jobs={(_o = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _o === void 0 ? void 0 : _o.jobs} lines={(_p = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _p === void 0 ? void 0 : _p.lines}/>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} size="sm" variant="secondary"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            {auditLogTrigger}
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem asChild>
              <a target="_blank" href={path_1.path.to.file.salesOrder(orderId)} rel="noreferrer">
                <react_1.DropdownMenuIcon icon={<lu_1.LuFile />}/>
                <macro_1.Trans>Preview PDF</macro_1.Trans>
              </a>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={confirmFetcher.state !== "idle" ||
            !["Draft", "Needs Approval"].includes((_r = (_q = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _q === void 0 ? void 0 : _q.status) !== null && _r !== void 0 ? _r : "") ||
            (routeData === null || routeData === void 0 ? void 0 : routeData.lines.length) === 0 ||
            !permissions.can("update", "sales")} onClick={confirmDisclosure.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCheckCheck />}/>
              <macro_1.Trans>Confirm</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            <react_2.Suspense fallback={null}>
              <react_router_1.Await resolve={routeData === null || routeData === void 0 ? void 0 : routeData.relatedItems}>
                {function (relatedItems) {
            var _a, _b, _c, _d;
            var shipments = (relatedItems === null || relatedItems === void 0 ? void 0 : relatedItems.shipments) || [];
            var invoices = (relatedItems === null || relatedItems === void 0 ? void 0 : relatedItems.invoices) || [];
            return (<>
                      <react_1.DropdownMenuItem disabled={![
                    "To Ship",
                    "To Ship and Invoice",
                    "To Invoice"
                ].includes((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : "")} onClick={function () {
                    ship(routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder);
                }}>
                        <react_1.DropdownMenuIcon icon={<lu_1.LuTruck />}/>
                        <macro_1.Trans>New Shipment</macro_1.Trans>
                      </react_1.DropdownMenuItem>
                      {shipments.map(function (shipment) { return (<react_1.DropdownMenuItem key={shipment.id} asChild>
                          <react_router_1.Link to={path_1.path.to.shipment(shipment.id)}>
                            <react_1.DropdownMenuIcon icon={<lu_1.LuTruck />}/>
                            <react_1.HStack spacing={8}>
                              <span>{shipment.shipmentId}</span>
                              <Shipments_1.ShipmentStatus status={shipment.status} invoiced={shipment.invoiced}/>
                            </react_1.HStack>
                          </react_router_1.Link>
                        </react_1.DropdownMenuItem>); })}
                      <react_1.DropdownMenuSeparator />
                      <react_1.DropdownMenuItem disabled={!["To Invoice", "To Ship and Invoice"].includes((_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : "")} onClick={function () {
                    invoice(routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder);
                }}>
                        <react_1.DropdownMenuIcon icon={<lu_1.LuCirclePlus />}/>
                        <macro_1.Trans>New Invoice</macro_1.Trans>
                      </react_1.DropdownMenuItem>
                      {invoices.map(function (inv) { return (<react_1.DropdownMenuItem key={inv.id} asChild>
                          <react_router_1.Link to={path_1.path.to.salesInvoice(inv.id)}>
                            <react_1.DropdownMenuIcon icon={<lu_1.LuCreditCard />}/>
                            <react_1.HStack spacing={8}>
                              <span>{inv.invoiceId}</span>
                              <SalesInvoiceStatus_1.default status={inv.status}/>
                            </react_1.HStack>
                          </react_router_1.Link>
                        </react_1.DropdownMenuItem>); })}
                    </>);
        }}
              </react_router_1.Await>
            </react_2.Suspense>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={["Cancelled", "Closed", "Completed", "Invoiced"].includes((_t = (_s = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _s === void 0 ? void 0 : _s.status) !== null && _t !== void 0 ? _t : "") ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "sales")} onClick={function () {
            statusFetcher.submit({ status: "Cancelled" }, {
                method: "post",
                action: path_1.path.to.salesOrderStatus(orderId)
            });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCircleStop />}/>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={!["To Ship and Invoice", "To Ship"].includes((_v = (_u = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _u === void 0 ? void 0 : _u.status) !== null && _v !== void 0 ? _v : "") ||
            !permissions.can("create", "production") ||
            !permissions.is("employee") ||
            !!((_w = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _w === void 0 ? void 0 : _w.jobs) ||
            !hasMakeItems} onClick={salesOrderToJobsModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuGitCompare />}/>
              <macro_1.Trans>Convert Lines to Jobs</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem asChild>
              <CSVLink_1.CSVLink data={csvExportData} filename={"".concat((_x = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _x === void 0 ? void 0 : _x.salesOrderId, ".csv")}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuFile />}/>
                <macro_1.Trans>Export Lines to CSV</macro_1.Trans>
              </CSVLink_1.CSVLink>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={["Draft"].includes((_z = (_y = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _y === void 0 ? void 0 : _y.status) !== null && _z !== void 0 ? _z : "") ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "sales")} onClick={function () {
            statusFetcher.submit({ status: "Draft" }, {
                method: "post",
                action: path_1.path.to.salesOrderStatus(orderId)
            });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuLoaderCircle />}/>
              <macro_1.Trans>Reopen</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem destructive disabled={isLocked ||
            !permissions.can("delete", "sales") ||
            !permissions.is("employee")} onClick={deleteSalesOrderModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Sales Order</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>

      {salesOrderToJobsModal.isOpen && (<Confirm_1.default title={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Convert Lines to Jobs"], ["Convert Lines to Jobs"])))} text={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Are you sure you want to create jobs for this sales order? This will create jobs for all lines that don't already have jobs."], ["Are you sure you want to create jobs for this sales order? This will create jobs for all lines that don't already have jobs."])))} confirmText={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Create Jobs"], ["Create Jobs"])))} onCancel={salesOrderToJobsModal.onClose} onSubmit={salesOrderToJobsModal.onClose} action={path_1.path.to.salesOrderLinesToJobs(orderId)}/>)}
      {confirmDisclosure.isOpen && (<SalesOrderConfirmModal fetcher={confirmFetcher} salesOrder={routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder} onClose={confirmDisclosure.onClose} defaultCc={(_0 = routeData === null || routeData === void 0 ? void 0 : routeData.defaultCc) !== null && _0 !== void 0 ? _0 : []}/>)}
      {deleteSalesOrderModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deleteSalesOrder(orderId)} isOpen={deleteSalesOrderModal.isOpen} name={(_1 = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _1 === void 0 ? void 0 : _1.salesOrderId} text={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_2 = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _2 === void 0 ? void 0 : _2.salesOrderId)} onCancel={function () {
                deleteSalesOrderModal.onClose();
            }} onSubmit={function () {
                deleteSalesOrderModal.onClose();
            }}/>)}
      {auditLogDrawer}
    </>);
}
var SalesOrderHeader = function () {
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("orderId not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    return (<>
      {leftSlotEl &&
            (0, react_dom_1.createPortal)(<SalesOrderTopbarLeft orderId={orderId}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1"/>
        <react_1.IconButton aria-label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = SalesOrderHeader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
