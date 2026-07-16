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
var AuditLog_1 = require("~/components/AuditLog");
var Layout_1 = require("~/components/Layout");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var Receipts_1 = require("~/modules/inventory/ui/Receipts");
var Shipments_1 = require("~/modules/inventory/ui/Shipments");
var PurchaseInvoicingStatus_1 = require("~/modules/invoicing/ui/PurchaseInvoice/PurchaseInvoicingStatus");
var suppliers_1 = require("~/stores/suppliers");
var path_1 = require("~/utils/path");
var purchasing_models_1 = require("../../purchasing.models");
var PurchaseOrderApprovalModal_1 = require("./PurchaseOrderApprovalModal");
var PurchaseOrderFinalizeModal_1 = require("./PurchaseOrderFinalizeModal");
var PurchasingStatus_1 = require("./PurchasingStatus");
var usePurchaseOrder_1 = require("./usePurchaseOrder");
function PurchaseOrderTopbarLeft(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
    var orderId = _a.orderId;
    var company = (0, hooks_1.useUser)().company;
    var t = (0, macro_1.useLingui)().t;
    var supplierApprovalRequired = (0, hooks_1.useSupplierApprovalRequired)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.purchaseOrder(orderId));
    var suppliers = (0, suppliers_1.useSuppliers)()[0];
    var isSupplierApproved = (0, react_2.useMemo)(function () {
        var _a;
        return !supplierApprovalRequired ||
            ((_a = suppliers.find(function (s) { var _a; return s.id === ((_a = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _a === void 0 ? void 0 : _a.supplierId); })) === null || _a === void 0 ? void 0 : _a.supplierStatus) === "Active";
    }, [supplierApprovalRequired, (_b = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _b === void 0 ? void 0 : _b.supplierId, suppliers]);
    if (!(routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder))
        throw new Error("Failed to load purchase order");
    var permissions = (0, hooks_1.usePermissions)();
    var statusFetcher = (0, react_router_1.useFetcher)();
    var approvalFetcher = (0, react_router_1.useFetcher)();
    var navigation = (0, react_router_1.useNavigation)();
    var _13 = (0, usePurchaseOrder_1.usePurchaseOrder)(), receive = _13.receive, invoice = _13.invoice, ship = _13.ship;
    var isReceiving = navigation.state !== "idle" && navigation.formAction === path_1.path.to.newReceipt;
    var isInvoicing = navigation.state !== "idle" &&
        ((_c = navigation.location) === null || _c === void 0 ? void 0 : _c.pathname) === path_1.path.to.newPurchaseInvoice;
    var isNeedsApproval = ((_d = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _d === void 0 ? void 0 : _d.status) === "Needs Approval";
    var hasApprovalRequest = !!(routeData === null || routeData === void 0 ? void 0 : routeData.approvalRequest);
    var canApprove = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.canApprove) !== null && _e !== void 0 ? _e : false;
    var isLocked = (0, purchasing_models_1.isPurchaseOrderLocked)((_f = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _f === void 0 ? void 0 : _f.status);
    var _14 = (0, usePurchaseOrder_1.usePurchaseOrderRelatedDocuments)((_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _g === void 0 ? void 0 : _g.supplierInteractionId) !== null && _h !== void 0 ? _h : "", ((_j = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _j === void 0 ? void 0 : _j.purchaseOrderType) === "Outside Processing"), receipts = _14.receipts, invoices = _14.invoices, shipments = _14.shipments;
    var _15 = (0, AuditLog_1.useAuditLog)({
        entityType: "purchaseOrder",
        entityId: orderId,
        companyId: company.id,
        variant: "dropdown"
    }), auditLogTrigger = _15.trigger, auditLogDrawer = _15.drawer;
    var finalizeDisclosure = (0, react_1.useDisclosure)();
    var deleteModal = (0, react_1.useDisclosure)();
    var _16 = (0, react_2.useState)(null), approvalDecision = _16[0], setApprovalDecision = _16[1];
    var isOutsideProcessing = ((_k = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _k === void 0 ? void 0 : _k.purchaseOrderType) === "Outside Processing";
    var hasReceivableLines = (0, react_2.useMemo)(function () {
        var _a, _b;
        return (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _a === void 0 ? void 0 : _a.some(function (line) {
            return line.purchaseOrderLineType !== "Comment" &&
                line.purchaseOrderLineType !== "G/L Account";
        })) !== null && _b !== void 0 ? _b : false;
    }, [routeData === null || routeData === void 0 ? void 0 : routeData.lines]);
    var markAsPlanned = function () {
        statusFetcher.submit({ status: "Planned" }, { method: "post", action: path_1.path.to.purchaseOrderStatus(orderId) });
    };
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarId to={path_1.path.to.purchaseOrderDetails(orderId)}>
          {(_l = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _l === void 0 ? void 0 : _l.purchaseOrderId}
        </Layout_1.DetailTopbarId>
        <react_1.Copy text={(_o = (_m = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _m === void 0 ? void 0 : _m.purchaseOrderId) !== null && _o !== void 0 ? _o : ""}/>
        <PurchasingStatus_1.default iconOnly status={(_p = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _p === void 0 ? void 0 : _p.status}/>
        {isOutsideProcessing && (<Layout_1.DetailTopbarBadge variant="default" label={(_q = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _q === void 0 ? void 0 : _q.purchaseOrderType}/>)}
        {supplierApprovalRequired && !isSupplierApproved && (<react_1.Status iconOnly color="red">
            <macro_1.Trans>Unapproved Supplier</macro_1.Trans>
          </react_1.Status>)}
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} size="sm" variant="secondary"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            {auditLogTrigger}
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem asChild>
              <a target="_blank" href={path_1.path.to.file.purchaseOrder(orderId)} rel="noreferrer">
                <react_1.DropdownMenuIcon icon={<lu_1.LuFile />}/>
                <macro_1.Trans>Preview PDF</macro_1.Trans>
              </a>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            {isNeedsApproval && hasApprovalRequest && canApprove ? (<>
                <react_1.DropdownMenuItem disabled={approvalFetcher.state !== "idle"} onClick={function () { return setApprovalDecision("Approved"); }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuCheckCheck />}/>
                  <macro_1.Trans>Approve</macro_1.Trans>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuItem disabled={approvalFetcher.state !== "idle"} destructive onClick={function () { return setApprovalDecision("Rejected"); }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuX />}/>
                  <macro_1.Trans>Reject</macro_1.Trans>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuSeparator />
              </>) : null}
            <react_1.DropdownMenuItem disabled={statusFetcher.state !== "idle" ||
            !["Draft", "Planned"].includes((_s = (_r = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _r === void 0 ? void 0 : _r.status) !== null && _s !== void 0 ? _s : "") ||
            (routeData === null || routeData === void 0 ? void 0 : routeData.lines.length) === 0 ||
            !isSupplierApproved} onClick={finalizeDisclosure.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCheckCheck />}/>
              <macro_1.Trans>Finalize</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem disabled={!["Draft"].includes((_u = (_t = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _t === void 0 ? void 0 : _t.status) !== null && _u !== void 0 ? _u : "") ||
            (routeData === null || routeData === void 0 ? void 0 : routeData.lines.length) === 0 ||
            !isSupplierApproved ||
            statusFetcher.state !== "idle"} onClick={markAsPlanned}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCheckCheck />}/>
              <macro_1.Trans>Mark as Planned</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            {((_v = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _v === void 0 ? void 0 : _v.purchaseOrderType) ===
            "Outside Processing" && (<react_1.DropdownMenuItem disabled={![
                "To Receive",
                "To Receive and Invoice",
                "To Invoice"
            ].includes((_x = (_w = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _w === void 0 ? void 0 : _w.status) !== null && _x !== void 0 ? _x : "")} onClick={function () {
                ship(routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder);
            }}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuTruck />}/>
                <macro_1.Trans>New Shipment</macro_1.Trans>
              </react_1.DropdownMenuItem>)}
            {shipments.map(function (shipment) { return (<react_1.DropdownMenuItem key={shipment.id} asChild>
                <react_router_1.Link to={path_1.path.to.shipment(shipment.id)}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuTruck />}/>
                  <react_1.HStack spacing={8}>
                    <span>{shipment.shipmentId}</span>
                    <Shipments_1.ShipmentStatus status={shipment.status}/>
                  </react_1.HStack>
                </react_router_1.Link>
              </react_1.DropdownMenuItem>); })}
            {!isNeedsApproval && hasReceivableLines && (<>
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuItem disabled={![
                "To Receive",
                "To Receive and Invoice",
                "To Invoice"
            ].includes((_z = (_y = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _y === void 0 ? void 0 : _y.status) !== null && _z !== void 0 ? _z : "") ||
                isReceiving} onClick={function () {
                receive(routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder);
            }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuHandCoins />}/>
                  <macro_1.Trans>New Receipt</macro_1.Trans>
                </react_1.DropdownMenuItem>
                {receipts.map(function (receipt) { return (<react_1.DropdownMenuItem key={receipt.id} asChild>
                    <react_router_1.Link to={path_1.path.to.receipt(receipt.id)}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuHandCoins />}/>
                      <react_1.HStack spacing={8}>
                        <span>{receipt.receiptId}</span>
                        <Receipts_1.ReceiptStatus status={receipt.status}/>
                      </react_1.HStack>
                    </react_router_1.Link>
                  </react_1.DropdownMenuItem>); })}
              </>)}
            {!isNeedsApproval && (<>
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuItem disabled={!["To Invoice", "To Receive and Invoice"].includes((_1 = (_0 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _0 === void 0 ? void 0 : _0.status) !== null && _1 !== void 0 ? _1 : "") || isInvoicing} onClick={function () {
                invoice(routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder);
            }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuCirclePlus />}/>
                  <macro_1.Trans>New Invoice</macro_1.Trans>
                </react_1.DropdownMenuItem>
                {invoices.map(function (inv) { return (<react_1.DropdownMenuItem key={inv.id} asChild>
                    <react_router_1.Link to={path_1.path.to.purchaseInvoice(inv.id)}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuCreditCard />}/>
                      <react_1.HStack spacing={8}>
                        <span>{inv.invoiceId}</span>
                        <PurchaseInvoicingStatus_1.default 
            // @ts-expect-error - Return type is not defined
            status={inv.status}/>
                      </react_1.HStack>
                    </react_router_1.Link>
                  </react_1.DropdownMenuItem>); })}
              </>)}
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={["Draft"].includes((_3 = (_2 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _2 === void 0 ? void 0 : _2.status) !== null && _3 !== void 0 ? _3 : "") ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "purchasing") ||
            (isNeedsApproval && !(routeData === null || routeData === void 0 ? void 0 : routeData.canReopen))} onClick={function () {
            statusFetcher.submit({ status: "Draft" }, {
                method: "post",
                action: path_1.path.to.purchaseOrderStatus(orderId)
            });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuLoaderCircle />}/>
              <macro_1.Trans>Reopen</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem disabled={["Closed", "Completed"].includes((_5 = (_4 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _4 === void 0 ? void 0 : _4.status) !== null && _5 !== void 0 ? _5 : "") ||
            statusFetcher.state !== "idle" ||
            !permissions.can("delete", "purchasing")} onClick={function () {
            statusFetcher.submit({ status: "Closed" }, {
                method: "post",
                action: path_1.path.to.purchaseOrderStatus(orderId)
            });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCircleStop />}/>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={isLocked ||
            !permissions.can("delete", "purchasing") ||
            !permissions.is("employee") ||
            (isNeedsApproval && !(routeData === null || routeData === void 0 ? void 0 : routeData.canDelete))} destructive onClick={deleteModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Purchase Order</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>

      {finalizeDisclosure.isOpen && (<PurchaseOrderFinalizeModal_1.default fetcher={statusFetcher} purchaseOrder={routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder} onClose={finalizeDisclosure.onClose} defaultCc={(_6 = routeData === null || routeData === void 0 ? void 0 : routeData.defaultCc) !== null && _6 !== void 0 ? _6 : []} resolvedAttachments={(_7 = routeData === null || routeData === void 0 ? void 0 : routeData.resolvedAttachments) !== null && _7 !== void 0 ? _7 : []}/>)}
      {deleteModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deletePurchaseOrder(orderId)} isOpen={deleteModal.isOpen} name={(_9 = (_8 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _8 === void 0 ? void 0 : _8.purchaseOrderId) !== null && _9 !== void 0 ? _9 : "purchase order"} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_10 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _10 === void 0 ? void 0 : _10.purchaseOrderId)} onCancel={function () {
                deleteModal.onClose();
            }} onSubmit={function () {
                deleteModal.onClose();
            }}/>)}
      {approvalDecision && ((_11 = routeData === null || routeData === void 0 ? void 0 : routeData.approvalRequest) === null || _11 === void 0 ? void 0 : _11.id) && (<PurchaseOrderApprovalModal_1.default purchaseOrder={routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder} approvalRequestId={routeData.approvalRequest.id} decision={approvalDecision} fetcher={approvalFetcher} onClose={function () { return setApprovalDecision(null); }} defaultCc={(_12 = routeData === null || routeData === void 0 ? void 0 : routeData.defaultCc) !== null && _12 !== void 0 ? _12 : []}/>)}
      {auditLogDrawer}
    </>);
}
var PurchaseOrderHeader = function () {
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("orderId not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    return (<>
      {leftSlotEl &&
            (0, react_dom_1.createPortal)(<PurchaseOrderTopbarLeft orderId={orderId}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1"/>
        <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = PurchaseOrderHeader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
