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
var Layout_1 = require("~/components/Layout");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var suppliers_1 = require("~/stores/suppliers");
var path_1 = require("~/utils/path");
var purchasing_models_1 = require("../../purchasing.models");
var SupplierQuoteCompareDrawer_1 = require("./SupplierQuoteCompareDrawer");
var SupplierQuoteSendModal_1 = require("./SupplierQuoteSendModal");
var SupplierQuoteStatus_1 = require("./SupplierQuoteStatus");
var SupplierQuoteToOrderDrawer_1 = require("./SupplierQuoteToOrderDrawer");
function SupplierQuoteTopbarLeft(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    var id = _a.id;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var revalidator = (0, react_router_1.useRevalidator)();
    var supplierApprovalRequired = (0, hooks_1.useSupplierApprovalRequired)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.supplierQuote(id));
    var suppliers = (0, suppliers_1.useSuppliers)()[0];
    var isSupplierApproved = (0, react_2.useMemo)(function () {
        var _a;
        return !supplierApprovalRequired ||
            ((_a = suppliers.find(function (s) { var _a; return s.id === ((_a = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _a === void 0 ? void 0 : _a.supplierId); })) === null || _a === void 0 ? void 0 : _a.supplierStatus) === "Active";
    }, [supplierApprovalRequired, (_b = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _b === void 0 ? void 0 : _b.supplierId, suppliers]);
    var isOutsideProcessing = ((_c = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _c === void 0 ? void 0 : _c.supplierQuoteType) === "Outside Processing";
    var convertToOrderModal = (0, react_1.useDisclosure)();
    var compareModal = (0, react_1.useDisclosure)();
    var deleteModal = (0, react_1.useDisclosure)();
    var shareModal = (0, react_1.useDisclosure)();
    var finalizeModal = (0, react_1.useDisclosure)();
    var sendModal = (0, react_1.useDisclosure)();
    var finalizeFetcher = (0, react_router_1.useFetcher)();
    var sendFetcher = (0, react_router_1.useFetcher)();
    var statusFetcher = (0, react_router_1.useFetcher)();
    var hasLines = (routeData === null || routeData === void 0 ? void 0 : routeData.lines) && routeData.lines.length > 0;
    var isLocked = (0, purchasing_models_1.isSupplierQuoteLocked)((_d = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _d === void 0 ? void 0 : _d.status);
    var quoteStatus = (_f = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _e === void 0 ? void 0 : _e.status) !== null && _f !== void 0 ? _f : "";
    var editableStatuses = ["Draft", "Declined"];
    var isEditableStatus = editableStatuses.includes(quoteStatus);
    // Get the first linked RFQ ID for comparison
    var linkedRfqId = (_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.interaction.purchasingRfq) === null || _g === void 0 ? void 0 : _g.id) !== null && _h !== void 0 ? _h : null;
    // Check if sibling quotes exist (for showing Compare option)
    var hasSiblingQuotes = ((_j = routeData === null || routeData === void 0 ? void 0 : routeData.siblingQuotes) !== null && _j !== void 0 ? _j : []).length > 0;
    var canSend = isEditableStatus && permissions.can("update", "purchasing") && hasLines;
    var canFinalize = ["Draft", "Declined"].includes(quoteStatus);
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarId to={path_1.path.to.supplierQuoteDetails(id)}>
          {(_k = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _k === void 0 ? void 0 : _k.supplierQuoteId}
        </Layout_1.DetailTopbarId>
        <react_1.Copy text={(_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _l === void 0 ? void 0 : _l.supplierQuoteId) !== null && _m !== void 0 ? _m : ""}/>
        <SupplierQuoteStatus_1.default iconOnly status={(_o = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _o === void 0 ? void 0 : _o.status}/>
        {isOutsideProcessing && (<Layout_1.DetailTopbarBadge variant="default" label={(_p = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _p === void 0 ? void 0 : _p.supplierQuoteType}/>)}
        {supplierApprovalRequired && !isSupplierApproved && (<react_1.Status iconOnly color="red">
            <macro_1.Trans>Unapproved Supplier</macro_1.Trans>
          </react_1.Status>)}
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} size="sm" variant="secondary"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            {/* Preview - Digital Quote */}
            <react_1.DropdownMenuItem asChild>
              <a target="_blank" href={path_1.path.to.externalSupplierQuote((routeData === null || routeData === void 0 ? void 0 : routeData.quote).externalLinkId)} rel="noreferrer">
                <react_1.DropdownMenuIcon icon={<lu_1.LuExternalLink />}/>
                <macro_1.Trans>Digital Quote</macro_1.Trans>
              </a>
            </react_1.DropdownMenuItem>

            <react_1.DropdownMenuSeparator />

            {/* Send */}
            {canSend && (<react_1.DropdownMenuItem disabled={quoteStatus === "Active" ||
                sendFetcher.state !== "idle" ||
                !permissions.can("update", "purchasing") ||
                !hasLines} onClick={sendModal.onOpen}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuSend />}/>
                <macro_1.Trans>Send</macro_1.Trans>
              </react_1.DropdownMenuItem>)}

            {/* Finalize */}
            {canFinalize && (<react_1.DropdownMenuItem disabled={finalizeFetcher.state !== "idle" ||
                !permissions.can("update", "purchasing") ||
                !hasLines} onClick={function () {
                revalidator.revalidate();
                finalizeModal.onOpen();
            }}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuCheckCheck />}/>
                <macro_1.Trans>Finalize</macro_1.Trans>
              </react_1.DropdownMenuItem>)}

            {/* Order / Compare and Order */}
            {((_q = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _q === void 0 ? void 0 : _q.status) === "Active" && (<>
                <react_1.DropdownMenuItem disabled={!permissions.can("update", "purchasing") ||
                !isSupplierApproved} onClick={convertToOrderModal.onOpen}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuShoppingCart />}/>
                  <macro_1.Trans>Order</macro_1.Trans>
                </react_1.DropdownMenuItem>
                {hasSiblingQuotes && (<react_1.DropdownMenuItem disabled={!permissions.can("update", "purchasing") ||
                    !isSupplierApproved} onClick={compareModal.onOpen}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuGitCompare />}/>
                    <macro_1.Trans>Compare and Order</macro_1.Trans>
                  </react_1.DropdownMenuItem>)}
              </>)}

            {/* Cancel */}
            {((_r = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _r === void 0 ? void 0 : _r.status) === "Draft" && (<react_1.DropdownMenuItem disabled={statusFetcher.state !== "idle" ||
                !permissions.can("update", "purchasing")} onClick={function () {
                statusFetcher.submit({ status: "Cancelled" }, {
                    method: "post",
                    action: path_1.path.to.supplierQuoteStatus(id)
                });
            }}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuCircleStop />}/>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.DropdownMenuItem>)}

            <react_1.DropdownMenuSeparator />

            {/* Reopen */}
            <react_1.DropdownMenuItem disabled={((_s = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _s === void 0 ? void 0 : _s.status) === "Draft" ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "purchasing")} onClick={function () {
            statusFetcher.submit({ status: "Draft" }, {
                method: "post",
                action: path_1.path.to.supplierQuoteStatus(id)
            });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuLoaderCircle />}/>
              <macro_1.Trans>Reopen</macro_1.Trans>
            </react_1.DropdownMenuItem>

            {/* Delete */}
            <react_1.DropdownMenuItem disabled={isLocked ||
            !permissions.can("delete", "purchasing") ||
            !permissions.is("employee")} destructive onClick={deleteModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Supplier Quote</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>

      <SupplierQuoteToOrderDrawer_1.default isOpen={convertToOrderModal.isOpen} onClose={convertToOrderModal.onClose} quote={routeData === null || routeData === void 0 ? void 0 : routeData.quote} lines={(_t = routeData === null || routeData === void 0 ? void 0 : routeData.lines) !== null && _t !== void 0 ? _t : []} pricing={(_u = routeData === null || routeData === void 0 ? void 0 : routeData.prices) !== null && _u !== void 0 ? _u : []}/>
      {deleteModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deleteSupplierQuote(id)} isOpen={deleteModal.isOpen} name={(_w = (_v = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _v === void 0 ? void 0 : _v.supplierQuoteId) !== null && _w !== void 0 ? _w : "supplier quote"} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_x = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _x === void 0 ? void 0 : _x.supplierQuoteId)} onCancel={function () {
                deleteModal.onClose();
            }} onSubmit={function () {
                deleteModal.onClose();
            }}/>)}
      {finalizeModal.isOpen && (<SupplierQuoteFinalizeModal quote={routeData === null || routeData === void 0 ? void 0 : routeData.quote} lines={(_y = routeData === null || routeData === void 0 ? void 0 : routeData.lines) !== null && _y !== void 0 ? _y : []} prices={(_z = routeData === null || routeData === void 0 ? void 0 : routeData.prices) !== null && _z !== void 0 ? _z : []} onClose={finalizeModal.onClose} fetcher={finalizeFetcher}/>)}
      {sendModal.isOpen && (<SupplierQuoteSendModal_1.default quote={routeData === null || routeData === void 0 ? void 0 : routeData.quote} onClose={sendModal.onClose} fetcher={sendFetcher} externalLinkId={(_1 = (_0 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _0 === void 0 ? void 0 : _0.externalLinkId) !== null && _1 !== void 0 ? _1 : ""} 
        // @ts-expect-error TS2339 - TODO: fix type
        defaultCc={(_2 = routeData === null || routeData === void 0 ? void 0 : routeData.defaultCc) !== null && _2 !== void 0 ? _2 : []}/>)}
      <ShareQuoteModal id={id} externalLinkId={((_3 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _3 === void 0 ? void 0 : _3.externalLinkId) || ""} onClose={shareModal.onClose} isOpen={shareModal.isOpen}/>
      {compareModal.isOpen && linkedRfqId && (<SupplierQuoteCompareDrawer_1.default isOpen={compareModal.isOpen} onClose={compareModal.onClose} purchasingRfqId={linkedRfqId}/>)}
    </>);
}
var SupplierQuoteHeader = function () {
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    return (<>
      {leftSlotEl &&
            (0, react_dom_1.createPortal)(<SupplierQuoteTopbarLeft id={id}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1"/>
        <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
function SupplierQuoteFinalizeModal(_a) {
    var quote = _a.quote, lines = _a.lines, prices = _a.prices, onClose = _a.onClose, fetcher = _a.fetcher;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    // Validation logic: A line is valid if at least ONE quantity has both price and lead time
    // (not all quantities need them)
    var warningLineReadableIds = lines
        .filter(function (line) {
        if (!line.id)
            return true; // Missing line ID is an error
        var linePrices = prices.filter(function (price) { return price.supplierQuoteLineId === line.id; });
        // Check if at least one quantity has both valid price and lead time
        var hasValidPriceAndLeadTime = linePrices.some(function (price) {
            return price.supplierUnitPrice !== null &&
                price.supplierUnitPrice !== 0 &&
                price.leadTime !== null &&
                price.leadTime !== 0;
        });
        // If no valid price/lead time found, this line has a warning
        return !hasValidPriceAndLeadTime;
    })
        .map(function (line) { return line.itemReadableId; })
        .filter(function (id) { return id !== undefined; });
    var hasErrors = warningLineReadableIds.length > 0;
    var submitted = (0, react_2.useRef)(false);
    (0, react_1.useIsomorphicLayoutEffect)(function () {
        if (fetcher.state === "loading" && submitted.current) {
            onClose();
            submitted.current = false;
        }
    }, [fetcher.state, onClose]);
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Finalize</macro_1.Trans> {quote === null || quote === void 0 ? void 0 : quote.supplierQuoteId}
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            <macro_1.Trans>Are you sure you want to finalize the supplier quote?</macro_1.Trans>
          </react_1.ModalDescription>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <react_1.VStack spacing={4}>
            {hasErrors && (<react_1.Alert variant="destructive">
                <lu_1.LuTriangleAlert className="h-4 w-4"/>
                <react_1.AlertTitle>
                  <macro_1.Trans>Lines need prices or lead times</macro_1.Trans>
                </react_1.AlertTitle>
                <react_1.AlertDescription>
                  <macro_1.Trans>
                    The following line items are missing prices or lead times:
                  </macro_1.Trans>
                  <ul className="list-disc py-2 pl-4">
                    {warningLineReadableIds.map(function (readableId) { return (<li key={readableId}>{readableId}</li>); })}
                  </ul>
                </react_1.AlertDescription>
              </react_1.Alert>)}
          </react_1.VStack>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onClose}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <fetcher.Form method="post" action={path_1.path.to.supplierQuoteFinalize(id)} onSubmit={function () {
            submitted.current = true;
        }}>
            <react_1.Button type="submit" isDisabled={hasErrors || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
              <macro_1.Trans>Finalize</macro_1.Trans>
            </react_1.Button>
          </fetcher.Form>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function ShareQuoteModal(_a) {
    var id = _a.id, externalLinkId = _a.externalLinkId, onClose = _a.onClose, isOpen = _a.isOpen;
    if (!externalLinkId)
        return null;
    if (typeof window === "undefined")
        return null;
    var digitalQuoteUrl = "".concat(window.location.origin).concat(path_1.path.to.externalSupplierQuote(externalLinkId));
    return (<react_1.Modal open={isOpen} onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Share Quote</macro_1.Trans>
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            <macro_1.Trans>Copy this link to share the quote with a supplier</macro_1.Trans>
          </react_1.ModalDescription>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <react_1.InputGroup>
            <react_1.Input value={digitalQuoteUrl}/>
            <react_1.InputRightElement>
              <react_1.Copy text={digitalQuoteUrl}/>
            </react_1.InputRightElement>
          </react_1.InputGroup>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onClose}>
            <macro_1.Trans>Close</macro_1.Trans>
          </react_1.Button>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
exports.default = SupplierQuoteHeader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
