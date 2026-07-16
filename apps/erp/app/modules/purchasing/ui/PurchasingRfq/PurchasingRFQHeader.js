"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var useIntegrations_1 = require("~/hooks/useIntegrations");
var path_1 = require("~/utils/path");
var purchasing_models_1 = require("../../purchasing.models");
var SupplierQuote_1 = require("../SupplierQuote");
var FinalizeRFQModal_1 = require("./FinalizeRFQModal");
var PurchasingRFQStatus_1 = require("./PurchasingRFQStatus");
function PurchasingRFQTopbarLeft(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    var rfqId = _a.rfqId;
    var t = (0, macro_1.useLingui)().t;
    var finalizeModal = (0, react_1.useDisclosure)();
    var requiresSuppliersAlert = (0, react_1.useDisclosure)();
    var cancelReasonModal = (0, react_1.useDisclosure)();
    var deleteRFQModal = (0, react_1.useDisclosure)();
    var compareQuotesModal = (0, react_1.useDisclosure)();
    var permissions = (0, hooks_1.usePermissions)();
    var integrations = (0, useIntegrations_1.useIntegrations)();
    var canEmail = integrations.has("email");
    var finalizeFetcher = (0, react_router_1.useFetcher)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.purchasingRfq(rfqId));
    var status = (_c = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _b === void 0 ? void 0 : _b.status) !== null && _c !== void 0 ? _c : "Draft";
    var isLocked = (0, purchasing_models_1.isRfqLocked)(status);
    var statusFetcher = (0, react_router_1.useFetcher)();
    var hasSuppliers = ((_e = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.suppliers) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0) > 0;
    var activeLinkedQuotes = ((_f = routeData === null || routeData === void 0 ? void 0 : routeData.linkedQuotes) !== null && _f !== void 0 ? _f : []).filter(function (q) { return q.status === "Active"; });
    var canCompareQuotes = activeLinkedQuotes.length > 1;
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarId to={path_1.path.to.purchasingRfqDetails(rfqId)}>
          {(_g = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _g === void 0 ? void 0 : _g.rfqId}
        </Layout_1.DetailTopbarId>
        <react_1.Copy text={(_j = (_h = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _h === void 0 ? void 0 : _h.rfqId) !== null && _j !== void 0 ? _j : ""}/>
        <PurchasingRFQStatus_1.default iconOnly status={(_k = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _k === void 0 ? void 0 : _k.status}/>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} size="sm" variant="secondary"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            {/* Preview */}
            {status === "Draft" && (<react_1.DropdownMenuItem asChild>
                <react_router_1.Link to={path_1.path.to.purchasingRfqPreview(rfqId)} target="_blank">
                  <react_1.DropdownMenuIcon icon={<lu_1.LuEye />}/>
                  <macro_1.Trans>Preview</macro_1.Trans>
                </react_router_1.Link>
              </react_1.DropdownMenuItem>)}

            {/* Share links for Requested status */}
            {status === "Requested" && hasSuppliers && (<>
                {(_l = routeData === null || routeData === void 0 ? void 0 : routeData.suppliers) === null || _l === void 0 ? void 0 : _l.map(function (supplier) { return (<react_1.DropdownMenuItem key={supplier.id} disabled={!supplier.quoteExternalLinkId} onClick={function () {
                    if (supplier.quoteExternalLinkId) {
                        window.open(path_1.path.to.externalSupplierQuote(supplier.quoteExternalLinkId), "_blank");
                    }
                }}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuShare2 />}/>
                    {supplier.supplier.name}
                    {supplier.quoteExternalLinkId &&
                    typeof window !== "undefined" && (<react_1.Copy className="ml-2" text={"".concat(window.location.origin).concat(path_1.path.to.externalSupplierQuote(supplier.quoteExternalLinkId))}/>)}
                  </react_1.DropdownMenuItem>); })}
                <react_1.DropdownMenuSeparator />
              </>)}

            {/* Finalize */}
            {hasSuppliers ? (canEmail ? (<react_1.DropdownMenuItem disabled={status !== "Draft" ||
                ((_m = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _m === void 0 ? void 0 : _m.length) === 0 ||
                !permissions.can("create", "purchasing")} onClick={finalizeModal.onOpen}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuSend />}/>
                  <macro_1.Trans>Finalize</macro_1.Trans>
                </react_1.DropdownMenuItem>) : (<react_1.DropdownMenuItem disabled={status !== "Draft" ||
                ((_o = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _o === void 0 ? void 0 : _o.length) === 0 ||
                !permissions.can("create", "purchasing") ||
                finalizeFetcher.state !== "idle"} onClick={function () {
                var _a;
                var formData = new FormData();
                (_a = routeData === null || routeData === void 0 ? void 0 : routeData.suppliers) === null || _a === void 0 ? void 0 : _a.forEach(function (supplier, index) {
                    formData.append("suppliers[".concat(index, "].supplierId"), supplier.supplierId);
                    formData.append("suppliers[".concat(index, "].rfqSupplierId"), supplier.id);
                });
                finalizeFetcher.submit(formData, {
                    method: "post",
                    action: path_1.path.to.purchasingRfqFinalize(rfqId)
                });
            }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuSend />}/>
                  <macro_1.Trans>Finalize</macro_1.Trans>
                </react_1.DropdownMenuItem>)) : (<react_1.DropdownMenuItem disabled={status !== "Draft" ||
                ((_p = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _p === void 0 ? void 0 : _p.length) === 0 ||
                !permissions.can("create", "purchasing")} onClick={requiresSuppliersAlert.onOpen}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuSend />}/>
                <macro_1.Trans>Finalize</macro_1.Trans>
              </react_1.DropdownMenuItem>)}

            {/* Cancel */}
            <react_1.DropdownMenuItem disabled={(status !== "Draft" && status !== "Requested") ||
            !permissions.can("update", "purchasing")} onClick={cancelReasonModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCircleX />}/>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.DropdownMenuItem>

            {/* Compare Quotes */}
            {canCompareQuotes && (<react_1.DropdownMenuItem onClick={compareQuotesModal.onOpen}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuGitCompare />}/>
                <macro_1.Trans>Compare Quotes</macro_1.Trans>
              </react_1.DropdownMenuItem>)}

            <react_1.DropdownMenuSeparator />

            {/* Reopen */}
            <react_1.DropdownMenuItem disabled={status !== "Closed" ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "purchasing")} onClick={function () {
            statusFetcher.submit({ status: "Draft" }, {
                method: "post",
                action: path_1.path.to.purchasingRfqStatus(rfqId)
            });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuLoaderCircle />}/>
              <macro_1.Trans>Reopen</macro_1.Trans>
            </react_1.DropdownMenuItem>

            {/* Delete */}
            <react_1.DropdownMenuItem disabled={isLocked ||
            !permissions.can("delete", "purchasing") ||
            !permissions.is("employee")} destructive onClick={deleteRFQModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete RFQ</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>

      {finalizeModal.isOpen && (<FinalizeRFQModal_1.default lines={(_q = routeData === null || routeData === void 0 ? void 0 : routeData.lines) !== null && _q !== void 0 ? _q : []} suppliers={(_r = routeData === null || routeData === void 0 ? void 0 : routeData.suppliers) !== null && _r !== void 0 ? _r : []} rfqId={rfqId} onClose={finalizeModal.onClose}/>)}
      {requiresSuppliersAlert.isOpen && (<RequiresSuppliersAlert onClose={requiresSuppliersAlert.onClose}/>)}
      {cancelReasonModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.cancelPurchasingRfq(rfqId)} isOpen={cancelReasonModal.isOpen} name={(_s = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _s === void 0 ? void 0 : _s.rfqId} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to cancel ", "? This will also cancel all related supplier quotes."], ["Are you sure you want to cancel ", "? This will also cancel all related supplier quotes."])), (_t = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _t === void 0 ? void 0 : _t.rfqId)} deleteText="Cancel" onCancel={function () {
                cancelReasonModal.onClose();
            }} onSubmit={function () {
                cancelReasonModal.onClose();
            }}/>)}
      {deleteRFQModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deletePurchasingRfq(rfqId)} isOpen={deleteRFQModal.isOpen} name={(_u = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _u === void 0 ? void 0 : _u.rfqId} text={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_v = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _v === void 0 ? void 0 : _v.rfqId)} onCancel={function () {
                deleteRFQModal.onClose();
            }} onSubmit={function () {
                deleteRFQModal.onClose();
            }}/>)}
      {compareQuotesModal.isOpen && (<SupplierQuote_1.SupplierQuoteCompareDrawer isOpen={compareQuotesModal.isOpen} onClose={compareQuotesModal.onClose} purchasingRfqId={rfqId}/>)}
    </>);
}
var PurchasingRFQHeader = function () {
    var rfqId = (0, react_router_1.useParams)().rfqId;
    if (!rfqId)
        throw new Error("rfqId not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    return (<>
      {leftSlotEl &&
            (0, react_dom_1.createPortal)(<PurchasingRFQTopbarLeft rfqId={rfqId}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1"/>
        <react_1.IconButton aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = PurchasingRFQHeader;
function RequiresSuppliersAlert(_a) {
    var onClose = _a.onClose;
    return (<react_1.Modal open onOpenChange={function (open) { return !open && onClose(); }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Cannot send RFQ</macro_1.Trans>
          </react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <react_1.Alert variant="destructive">
            <lu_1.LuTriangleAlert className="h-4 w-4"/>
            <react_1.AlertTitle>
              <macro_1.Trans>RFQ has no suppliers</macro_1.Trans>
            </react_1.AlertTitle>
            <react_1.AlertDescription>
              <macro_1.Trans>
                In order to send this RFQ to suppliers, you must first add
                suppliers to the RFQ.
              </macro_1.Trans>
            </react_1.AlertDescription>
          </react_1.Alert>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.Button onClick={onClose}>
            <macro_1.Trans>OK</macro_1.Trans>
          </react_1.Button>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
