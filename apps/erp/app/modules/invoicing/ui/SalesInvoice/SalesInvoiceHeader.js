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
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var AuditLog_1 = require("~/components/AuditLog");
var Layout_1 = require("~/components/Layout");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var Shipments_1 = require("~/modules/inventory/ui/Shipments");
var invoicing_1 = require("~/modules/invoicing");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var SalesInvoicePostModal_1 = require("./SalesInvoicePostModal");
var SalesInvoiceStatus_1 = require("./SalesInvoiceStatus");
var SalesInvoiceVoidModal_1 = require("./SalesInvoiceVoidModal");
function SalesInvoiceTopbarLeft(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var invoiceId = _a.invoiceId;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var postingModal = (0, react_1.useDisclosure)();
    var voidModal = (0, react_1.useDisclosure)();
    var deleteModal = (0, react_1.useDisclosure)();
    var _k = (0, AuditLog_1.useAuditLog)({
        entityType: "salesInvoice",
        entityId: invoiceId,
        companyId: company.id,
        variant: "dropdown"
    }), auditLogTrigger = _k.trigger, auditLogDrawer = _k.drawer;
    var postFetcher = (0, react_router_1.useFetcher)();
    var statusFetcher = (0, react_router_1.useFetcher)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _l = (0, react_2.useState)([]), linesNotAssociatedWithSO = _l[0], setLinesNotAssociatedWithSO = _l[1];
    var items = (0, stores_1.useItems)()[0];
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.salesInvoice(invoiceId));
    if (!(routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice))
        throw new Error("salesInvoice not found");
    var salesInvoice = routeData.salesInvoice;
    var isPosted = salesInvoice.postingDate !== null;
    var isVoided = salesInvoice.status === "Voided";
    var _m = (0, react_2.useState)({ salesOrders: [], shipments: [] }), relatedDocs = _m[0], setRelatedDocs = _m[1];
    // Load related documents on mount
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        function getRelatedDocuments() {
            return __awaiter(this, void 0, void 0, function () {
                var _a, salesOrdersResult, shipmentsResult;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            if (!carbon || !salesInvoice.opportunityId)
                                return [2 /*return*/];
                            return [4 /*yield*/, Promise.all([
                                    carbon
                                        .from("salesOrder")
                                        .select("id, salesOrderId")
                                        .eq("opportunityId", salesInvoice.opportunityId),
                                    carbon
                                        .from("shipment")
                                        .select("id, shipmentId, status")
                                        .eq("opportunityId", salesInvoice.opportunityId)
                                ])];
                        case 1:
                            _a = _f.sent(), salesOrdersResult = _a[0], shipmentsResult = _a[1];
                            if (salesOrdersResult.error)
                                throw new Error(salesOrdersResult.error.message);
                            if (shipmentsResult.error)
                                throw new Error(shipmentsResult.error.message);
                            setRelatedDocs({
                                salesOrders: (_c = (_b = salesOrdersResult.data) === null || _b === void 0 ? void 0 : _b.map(function (po) { return ({
                                    id: po.id,
                                    readableId: po.salesOrderId
                                }); })) !== null && _c !== void 0 ? _c : [],
                                shipments: (_e = (_d = shipmentsResult.data) === null || _d === void 0 ? void 0 : _d.map(function (r) { return ({
                                    id: r.id,
                                    readableId: r.shipmentId,
                                    status: r.status
                                }); })) !== null && _e !== void 0 ? _e : []
                            });
                            return [2 /*return*/];
                    }
                });
            });
        }
        getRelatedDocuments();
    }, [carbon, salesInvoice.opportunityId, salesInvoice.status]);
    var showPostModal = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // check if there are any lines that are not associated with a SO
                    if (!carbon)
                        throw new Error("carbon not found");
                    return [4 /*yield*/, carbon
                            .from("salesInvoiceLine")
                            .select("itemId, description, quantity")
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
                            .is("salesOrderLineId", null)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw new Error(error.message);
                    if (!data)
                        return [2 /*return*/];
                    // so that we can ask the user if they want to receive those lines
                    (0, react_dom_1.flushSync)(function () {
                        var _a;
                        return setLinesNotAssociatedWithSO((_a = data === null || data === void 0 ? void 0 : data.map(function (d) {
                            var _a, _b;
                            return (__assign(__assign({}, d), { itemReadableId: (_a = (0, utils_1.getItemReadableId)(items, d.itemId)) !== null && _a !== void 0 ? _a : null, description: (_b = d.description) !== null && _b !== void 0 ? _b : "", quantity: d.quantity }));
                        })) !== null && _a !== void 0 ? _a : []);
                    });
                    postingModal.onOpen();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleStatusChange = function (status) {
        statusFetcher.submit({ status: status }, { method: "post", action: path_1.path.to.salesInvoiceStatus(invoiceId) });
    };
    var IS_PAYMENT_DROPDOWN_DISABLED = ["Voided", "Draft", "Pending"].includes((_b = salesInvoice.status) !== null && _b !== void 0 ? _b : "") ||
        !permissions.can("update", "invoicing");
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarId to={path_1.path.to.salesInvoiceDetails(invoiceId)}>
          {(_c = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice) === null || _c === void 0 ? void 0 : _c.invoiceId}
        </Layout_1.DetailTopbarId>
        <react_1.Copy text={(_e = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice) === null || _d === void 0 ? void 0 : _d.invoiceId) !== null && _e !== void 0 ? _e : ""}/>
        <SalesInvoiceStatus_1.default iconOnly status={salesInvoice.status}/>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} size="sm" variant="secondary"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            {auditLogTrigger}
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem asChild>
              <a target="_blank" href={path_1.path.to.file.salesInvoice(invoiceId)} rel="noreferrer">
                <react_1.DropdownMenuIcon icon={<lu_1.LuFile />}/>
                <macro_1.Trans>Preview PDF</macro_1.Trans>
              </a>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            {relatedDocs.salesOrders.length === 1 && (<react_1.DropdownMenuItem asChild>
                <react_router_1.Link to={path_1.path.to.salesOrderDetails(relatedDocs.salesOrders[0].id)}>
                  <react_1.DropdownMenuIcon icon={<ri_1.RiProgress8Line />}/>
                  <macro_1.Trans>Sales Order</macro_1.Trans>
                </react_router_1.Link>
              </react_1.DropdownMenuItem>)}
            {relatedDocs.salesOrders.length > 1 &&
            relatedDocs.salesOrders.map(function (so) { return (<react_1.DropdownMenuItem key={so.id} asChild>
                  <react_router_1.Link to={path_1.path.to.salesOrderDetails(so.id)}>
                    <react_1.DropdownMenuIcon icon={<ri_1.RiProgress8Line />}/>
                    {so.readableId}
                  </react_router_1.Link>
                </react_1.DropdownMenuItem>); })}
            {relatedDocs.shipments.length > 0 && (<>
                {relatedDocs.shipments.map(function (shipment) { return (<react_1.DropdownMenuItem key={shipment.id} asChild>
                    <react_router_1.Link to={path_1.path.to.shipment(shipment.id)}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuTruck />}/>
                      <react_1.HStack spacing={8}>
                        <span>{shipment.readableId}</span>
                        <Shipments_1.ShipmentStatus status={shipment.status}/>
                      </react_1.HStack>
                    </react_router_1.Link>
                  </react_1.DropdownMenuItem>); })}
              </>)}
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={postFetcher.state !== "idle" ||
            isPosted ||
            ((_f = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoiceLines) === null || _f === void 0 ? void 0 : _f.length) === 0 ||
            !permissions.can("update", "invoicing")} onClick={showPostModal}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCheckCheck />}/>
              <macro_1.Trans>Post</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            {IS_PAYMENT_DROPDOWN_DISABLED ? (<react_1.DropdownMenuItem disabled>
                <macro_1.Trans>Payment</macro_1.Trans>
              </react_1.DropdownMenuItem>) : (<react_1.DropdownMenuRadioGroup value={(_g = salesInvoice.status) !== null && _g !== void 0 ? _g : "Draft"} onValueChange={handleStatusChange}>
                {invoicing_1.salesInvoiceStatusType
                .filter(function (status) { return !["Draft", "Pending", "Voided"].includes(status); })
                .map(function (status) { return (<react_1.DropdownMenuRadioItem key={status} value={status}>
                      <SalesInvoiceStatus_1.default status={status}/>
                    </react_1.DropdownMenuRadioItem>); })}
              </react_1.DropdownMenuRadioGroup>)}
            {isPosted && (<>
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuItem disabled={isVoided || !permissions.can("update", "invoicing")} destructive onClick={voidModal.onOpen}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuTicketX />}/>
                  <macro_1.Trans>Void</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </>)}
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={salesInvoice.status !== "Draft" ||
            !permissions.can("delete", "invoicing") ||
            !permissions.is("employee")} destructive onClick={deleteModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Sales Invoice</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>

      {postingModal.isOpen && (<SalesInvoicePostModal_1.default invoiceId={invoiceId} customerId={salesInvoice.invoiceCustomerId} customerContactId={salesInvoice.invoiceCustomerContactId} isOpen={postingModal.isOpen} onClose={postingModal.onClose} linesToShip={linesNotAssociatedWithSO} fetcher={postFetcher} defaultCc={(_h = routeData === null || routeData === void 0 ? void 0 : routeData.defaultCc) !== null && _h !== void 0 ? _h : []}/>)}
      {voidModal.isOpen && (<SalesInvoiceVoidModal_1.default onClose={voidModal.onClose}/>)}
      {deleteModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deleteSalesInvoice(invoiceId)} isOpen={deleteModal.isOpen} name={(_j = salesInvoice.invoiceId) !== null && _j !== void 0 ? _j : "sales invoice"} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), salesInvoice.invoiceId)} onCancel={function () {
                deleteModal.onClose();
            }} onSubmit={function () {
                deleteModal.onClose();
            }}/>)}
      {auditLogDrawer}
    </>);
}
var SalesInvoiceHeader = function () {
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    if (!invoiceId)
        throw new Error("invoiceId not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    return (<>
      {leftSlotEl &&
            (0, react_dom_1.createPortal)(<SalesInvoiceTopbarLeft invoiceId={invoiceId}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1"/>
        <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = SalesInvoiceHeader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
