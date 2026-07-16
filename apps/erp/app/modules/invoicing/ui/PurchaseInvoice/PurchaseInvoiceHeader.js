"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var AuditLog_1 = require("~/components/AuditLog");
var Layout_1 = require("~/components/Layout");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var invoicing_1 = require("~/modules/invoicing");
var stores_1 = require("~/stores");
var suppliers_1 = require("~/stores/suppliers");
var path_1 = require("~/utils/path");
var invoicing_models_1 = require("../../invoicing.models");
var PurchaseInvoicePostModal_1 = require("./PurchaseInvoicePostModal");
var PurchaseInvoiceVoidModal_1 = require("./PurchaseInvoiceVoidModal");
function PurchaseInvoiceTopbarLeft(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var invoiceId = _a.invoiceId;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var supplierApprovalRequired = (0, hooks_1.useSupplierApprovalRequired)();
    var company = (0, hooks_1.useUser)().company;
    var postingModal = (0, react_1.useDisclosure)();
    var voidModal = (0, react_1.useDisclosure)();
    var deleteModal = (0, react_1.useDisclosure)();
    var _o = (0, AuditLog_1.useAuditLog)({
        entityType: "purchaseInvoice",
        entityId: invoiceId,
        companyId: company.id,
        variant: "dropdown"
    }), auditLogTrigger = _o.trigger, auditLogDrawer = _o.drawer;
    var statusFetcher = (0, react_router_1.useFetcher)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _p = (0, react_2.useState)([]), linesNotAssociatedWithPO = _p[0], setLinesNotAssociatedWithPO = _p[1];
    var items = (0, stores_1.useItems)()[0];
    var suppliers = (0, suppliers_1.useSuppliers)()[0];
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.purchaseInvoice(invoiceId));
    var isSupplierApproved = (0, react_2.useMemo)(function () {
        var _a;
        return !supplierApprovalRequired ||
            ((_a = suppliers.find(function (s) { var _a; return s.id === ((_a = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _a === void 0 ? void 0 : _a.supplierId); })) === null || _a === void 0 ? void 0 : _a.supplierStatus) === "Active";
    }, [
        supplierApprovalRequired,
        (_b = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _b === void 0 ? void 0 : _b.supplierId,
        suppliers
    ]);
    if (!(routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice))
        throw new Error("purchaseInvoice not found");
    var purchaseInvoice = routeData.purchaseInvoice;
    var isPosted = purchaseInvoice.postingDate !== null;
    var isVoided = purchaseInvoice.status === "Voided";
    var hasPayment = purchaseInvoice.status === "Paid" ||
        purchaseInvoice.status === "Partially Paid";
    var canVoid = isPosted && !isVoided && !hasPayment;
    var _q = (0, react_2.useState)({ purchaseOrders: [], receipts: [] }), relatedDocs = _q[0], setRelatedDocs = _q[1];
    // Load related documents on mount
    (0, react_2.useEffect)(function () {
        function loadRelatedDocs() {
            return __awaiter(this, void 0, void 0, function () {
                var _a, purchaseOrdersResult, receiptsResult;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            if (!carbon || !purchaseInvoice.supplierInteractionId)
                                return [2 /*return*/];
                            return [4 /*yield*/, Promise.all([
                                    carbon
                                        .from("purchaseOrder")
                                        .select("id, purchaseOrderId")
                                        .eq("supplierInteractionId", purchaseInvoice.supplierInteractionId),
                                    carbon
                                        .from("receipt")
                                        .select("id, receiptId")
                                        .eq("supplierInteractionId", purchaseInvoice.supplierInteractionId)
                                ])];
                        case 1:
                            _a = _f.sent(), purchaseOrdersResult = _a[0], receiptsResult = _a[1];
                            if (purchaseOrdersResult.error)
                                throw new Error(purchaseOrdersResult.error.message);
                            if (receiptsResult.error)
                                throw new Error(receiptsResult.error.message);
                            setRelatedDocs({
                                purchaseOrders: (_c = (_b = purchaseOrdersResult.data) === null || _b === void 0 ? void 0 : _b.map(function (po) { return ({
                                    id: po.id,
                                    readableId: po.purchaseOrderId
                                }); })) !== null && _c !== void 0 ? _c : [],
                                receipts: (_e = (_d = receiptsResult.data) === null || _d === void 0 ? void 0 : _d.map(function (r) { return ({
                                    id: r.id,
                                    readableId: r.receiptId
                                }); })) !== null && _e !== void 0 ? _e : []
                            });
                            return [2 /*return*/];
                    }
                });
            });
        }
        loadRelatedDocs();
    }, [carbon, purchaseInvoice.supplierInteractionId]);
    var showPostModal = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // check if there are any lines that are not associated with a PO
                    if (!carbon)
                        throw new Error("carbon not found");
                    return [4 /*yield*/, carbon
                            .from("purchaseInvoiceLine")
                            .select("itemId, description, quantity, conversionFactor")
                            .eq("invoiceId", invoiceId)
                            .in("invoiceLineType", [
                            "Style",
                            "Part",
                            "Material",
                            "Tool",
                            "Consumable",
                            "Service",
                            "Fixture"
                        ])
                            .is("purchaseOrderLineId", null)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw new Error(error.message);
                    if (!data)
                        return [2 /*return*/];
                    // so that we can ask the user if they want to receive those lines
                    (0, react_dom_1.flushSync)(function () {
                        var _a;
                        return setLinesNotAssociatedWithPO((_a = data === null || data === void 0 ? void 0 : data.map(function (d) {
                            var _a, _b, _c;
                            return (__assign(__assign({}, d), { itemReadableId: (_a = (0, utils_1.getItemReadableId)(items, d.itemId)) !== null && _a !== void 0 ? _a : null, description: (_b = d.description) !== null && _b !== void 0 ? _b : "", quantity: d.quantity * ((_c = d.conversionFactor) !== null && _c !== void 0 ? _c : 1) }));
                        })) !== null && _a !== void 0 ? _a : []);
                    });
                    postingModal.onOpen();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleStatusChange = function (status) {
        statusFetcher.submit({ status: status }, { method: "post", action: path_1.path.to.purchaseInvoiceStatus(invoiceId) });
    };
    var isPaymentDisabled = purchaseInvoice.status === "Draft" ||
        purchaseInvoice.status === "Pending" ||
        isVoided ||
        !permissions.can("update", "invoicing");
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarId to={path_1.path.to.purchaseInvoiceDetails(invoiceId)}>
          {(_c = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _c === void 0 ? void 0 : _c.invoiceId}
        </Layout_1.DetailTopbarId>
        <react_1.Copy text={(_e = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _d === void 0 ? void 0 : _d.invoiceId) !== null && _e !== void 0 ? _e : ""}/>
        <invoicing_1.PurchaseInvoicingStatus iconOnly 
    // @ts-expect-error TS2322 - TODO: fix type
    status={(_f = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _f === void 0 ? void 0 : _f.status}/>
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
            {relatedDocs.purchaseOrders.length === 1 && (<react_1.DropdownMenuItem asChild>
                <react_router_1.Link to={path_1.path.to.purchaseOrderDetails(relatedDocs.purchaseOrders[0].id)}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuShoppingCart />}/>
                  <macro_1.Trans>Purchase Order</macro_1.Trans>
                </react_router_1.Link>
              </react_1.DropdownMenuItem>)}
            {relatedDocs.purchaseOrders.length > 1 &&
            relatedDocs.purchaseOrders.map(function (po) { return (<react_1.DropdownMenuItem key={po.id} asChild>
                  <react_router_1.Link to={path_1.path.to.purchaseOrderDetails(po.id)}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuShoppingCart />}/>
                    {po.readableId}
                  </react_router_1.Link>
                </react_1.DropdownMenuItem>); })}
            {relatedDocs.receipts.length === 1 && (<react_1.DropdownMenuItem asChild>
                <react_router_1.Link to={path_1.path.to.receipt(relatedDocs.receipts[0].id)}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuHandCoins />}/>
                  <macro_1.Trans>Receipt</macro_1.Trans>
                </react_router_1.Link>
              </react_1.DropdownMenuItem>)}
            {relatedDocs.receipts.length > 1 &&
            relatedDocs.receipts.map(function (receipt) { return (<react_1.DropdownMenuItem key={receipt.id} asChild>
                  <react_router_1.Link to={path_1.path.to.receipt(receipt.id)}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuHandCoins />}/>
                    {receipt.readableId}
                  </react_router_1.Link>
                </react_1.DropdownMenuItem>); })}
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={isPosted ||
            ((_g = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoiceLines) === null || _g === void 0 ? void 0 : _g.length) === 0 ||
            !permissions.can("update", "invoicing") ||
            !isSupplierApproved} onClick={showPostModal}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCheckCheck />}/>
              <macro_1.Trans>Post</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            {isPaymentDisabled ? (<react_1.DropdownMenuItem disabled>
                <react_1.DropdownMenuIcon icon={<lu_1.LuHandCoins />}/>
                <macro_1.Trans>Payment</macro_1.Trans>
              </react_1.DropdownMenuItem>) : (<react_1.DropdownMenuRadioGroup value={(_h = purchaseInvoice.status) !== null && _h !== void 0 ? _h : "Draft"} onValueChange={handleStatusChange}>
                {["Paid", "Partially Paid"].map(function (status) { return (<react_1.DropdownMenuRadioItem key={status} value={status}>
                    <invoicing_1.PurchaseInvoicingStatus status={status}/>
                  </react_1.DropdownMenuRadioItem>); })}
              </react_1.DropdownMenuRadioGroup>)}
            {isPosted && (<>
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuItem disabled={!canVoid || !permissions.can("update", "invoicing")} destructive onClick={voidModal.onOpen}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuTicketX />}/>
                  <macro_1.Trans>Void</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </>)}
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={(0, invoicing_models_1.isPurchaseInvoiceLocked)((_j = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _j === void 0 ? void 0 : _j.status) ||
            !permissions.can("delete", "invoicing") ||
            !permissions.is("employee")} destructive onClick={deleteModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Purchase Invoice</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>

      {postingModal.isOpen && (<PurchaseInvoicePostModal_1.default invoiceId={invoiceId} isOpen={postingModal.isOpen} onClose={postingModal.onClose} linesToReceive={linesNotAssociatedWithPO}/>)}
      {voidModal.isOpen && (<PurchaseInvoiceVoidModal_1.default onClose={voidModal.onClose}/>)}
      {deleteModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deletePurchaseInvoice(invoiceId)} isOpen={deleteModal.isOpen} name={(_l = (_k = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _k === void 0 ? void 0 : _k.invoiceId) !== null && _l !== void 0 ? _l : "purchase invoice"} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_m = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _m === void 0 ? void 0 : _m.invoiceId)} onCancel={function () {
                deleteModal.onClose();
            }} onSubmit={function () {
                deleteModal.onClose();
            }}/>)}
      {auditLogDrawer}
    </>);
}
var PurchaseInvoiceHeader = function () {
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    if (!invoiceId)
        throw new Error("invoiceId not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    return (<>
      {leftSlotEl &&
            (0, react_dom_1.createPortal)(<PurchaseInvoiceTopbarLeft invoiceId={invoiceId}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1"/>
        <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = PurchaseInvoiceHeader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
