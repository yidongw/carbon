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
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var QuoteFinalizeModal_1 = require("./QuoteFinalizeModal");
var QuoteStatus_1 = require("./QuoteStatus");
var QuoteToOrderDrawer_1 = require("./QuoteToOrderDrawer");
function QuoteTopbarLeft(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    var quoteId = _a.quoteId;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var eligibleLines = routeData === null || routeData === void 0 ? void 0 : routeData.lines.filter(function (line) { return line.status !== "No Quote"; });
    var finalizeModal = (0, react_1.useDisclosure)();
    var convertToOrderModal = (0, react_1.useDisclosure)();
    var shareModal = (0, react_1.useDisclosure)();
    var createRevisionModal = (0, react_1.useDisclosure)();
    var deleteQuoteModal = (0, react_1.useDisclosure)();
    var _z = (0, react_2.useState)(false), asRevision = _z[0], setAsRevision = _z[1];
    var finalizeFetcher = (0, react_router_1.useFetcher)();
    var statusFetcher = (0, react_router_1.useFetcher)();
    var _0 = (0, AuditLog_1.useAuditLog)({
        entityType: "salesQuote",
        entityId: quoteId,
        companyId: company.id,
        variant: "dropdown"
    }), auditLogTrigger = _0.trigger, auditLogDrawer = _0.drawer;
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarId to={path_1.path.to.quoteDetails(quoteId)}>
          <span className="flex items-center gap-0">
            <span>{(_b = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _b === void 0 ? void 0 : _b.quoteId}</span>
            {((_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _c === void 0 ? void 0 : _c.revisionId) !== null && _d !== void 0 ? _d : 0) > 0 && (<span className="text-muted-foreground">
                -{(_e = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _e === void 0 ? void 0 : _e.revisionId}
              </span>)}
          </span>
        </Layout_1.DetailTopbarId>
        <react_1.Copy text={(_g = (_f = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _f === void 0 ? void 0 : _f.quoteId) !== null && _g !== void 0 ? _g : ""}/>
        <QuoteStatus_1.default iconOnly status={(_h = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _h === void 0 ? void 0 : _h.status}/>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} size="sm" variant="secondary"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            {auditLogTrigger}
            <react_1.DropdownMenuSeparator />

            {/* Copy / Revision */}
            <react_1.DropdownMenuItem onClick={function () {
            setAsRevision(false);
            createRevisionModal.onOpen();
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCopy />}/>
              <macro_1.Trans>Copy Quote</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem onClick={function () {
            setAsRevision(true);
            createRevisionModal.onOpen();
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuGitBranchPlus />}/>
              <macro_1.Trans>Create Quote Revision</macro_1.Trans>
            </react_1.DropdownMenuItem>

            <react_1.DropdownMenuSeparator />

            {/* Preview / Share */}
            {(routeData === null || routeData === void 0 ? void 0 : routeData.quote.externalLinkId) &&
            (routeData === null || routeData === void 0 ? void 0 : routeData.quote.status) === "Sent" ? (<react_1.DropdownMenuItem onClick={shareModal.onOpen}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuShare2 />}/>
                <macro_1.Trans>Share</macro_1.Trans>
              </react_1.DropdownMenuItem>) : (<>
                {(routeData === null || routeData === void 0 ? void 0 : routeData.quote.externalLinkId) && (<react_1.DropdownMenuItem asChild>
                    <a target="_blank" href={path_1.path.to.externalQuote(routeData.quote.externalLinkId)} rel="noreferrer">
                      <react_1.DropdownMenuIcon icon={<lu_1.LuExternalLink />}/>
                      <macro_1.Trans>Digital Quote</macro_1.Trans>
                    </a>
                  </react_1.DropdownMenuItem>)}
                <react_1.DropdownMenuItem asChild>
                  <a target="_blank" href={path_1.path.to.file.quote(quoteId)} rel="noreferrer">
                    <react_1.DropdownMenuIcon icon={<lu_1.LuFile />}/>
                    <macro_1.Trans>PDF</macro_1.Trans>
                  </a>
                </react_1.DropdownMenuItem>
              </>)}

            <react_1.DropdownMenuSeparator />

            {/* Finalize */}
            <react_1.DropdownMenuItem disabled={((_j = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _j === void 0 ? void 0 : _j.status) !== "Draft" ||
            finalizeFetcher.state !== "idle" ||
            !permissions.can("update", "sales") ||
            !(eligibleLines === null || eligibleLines === void 0 ? void 0 : eligibleLines.length)} onClick={finalizeModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCheckCheck />}/>
              <macro_1.Trans>Finalize</macro_1.Trans>
            </react_1.DropdownMenuItem>

            {/* Won */}
            <react_1.DropdownMenuItem disabled={((_k = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _k === void 0 ? void 0 : _k.status) !== "Sent" ||
            !permissions.can("update", "sales")} onClick={convertToOrderModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrophy />}/>
              <macro_1.Trans>Won</macro_1.Trans>
            </react_1.DropdownMenuItem>

            {/* Lost */}
            <react_1.DropdownMenuItem disabled={((_l = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _l === void 0 ? void 0 : _l.status) !== "Sent" ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "sales")} onClick={function () {
            statusFetcher.submit({ status: "Lost" }, {
                method: "post",
                action: path_1.path.to.quoteStatus(quoteId)
            });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCircleX />}/>
              <macro_1.Trans>Lost</macro_1.Trans>
            </react_1.DropdownMenuItem>

            {/* Cancel */}
            {((_m = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _m === void 0 ? void 0 : _m.status) === "Draft" && (<react_1.DropdownMenuItem disabled={statusFetcher.state !== "idle" ||
                !permissions.can("update", "sales")} onClick={function () {
                statusFetcher.submit({ status: "Cancelled" }, {
                    method: "post",
                    action: path_1.path.to.quoteStatus(quoteId)
                });
            }}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuCircleStop />}/>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.DropdownMenuItem>)}

            <react_1.DropdownMenuSeparator />

            {/* Reopen */}
            <react_1.DropdownMenuItem disabled={((_o = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _o === void 0 ? void 0 : _o.status) === "Draft" ||
            ((_q = (_p = routeData === null || routeData === void 0 ? void 0 : routeData.opportunity) === null || _p === void 0 ? void 0 : _p.salesOrders.length) !== null && _q !== void 0 ? _q : 0) > 0 ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "sales")} onClick={function () {
            statusFetcher.submit({ status: "Draft" }, {
                method: "post",
                action: path_1.path.to.quoteStatus(quoteId)
            });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuLoaderCircle />}/>
              <macro_1.Trans>Reopen</macro_1.Trans>
            </react_1.DropdownMenuItem>

            {/* Delete */}
            <react_1.DropdownMenuItem disabled={!permissions.can("delete", "sales") ||
            !permissions.is("employee") ||
            (0, sales_models_1.isQuoteLocked)((_r = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _r === void 0 ? void 0 : _r.status)} destructive onClick={deleteQuoteModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Quote</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>

      {finalizeModal.isOpen && (<QuoteFinalizeModal_1.default quote={routeData === null || routeData === void 0 ? void 0 : routeData.quote} lines={eligibleLines !== null && eligibleLines !== void 0 ? eligibleLines : []} pricing={(_s = routeData === null || routeData === void 0 ? void 0 : routeData.prices) !== null && _s !== void 0 ? _s : []} shipment={(_t = routeData === null || routeData === void 0 ? void 0 : routeData.shipment) !== null && _t !== void 0 ? _t : null} onClose={finalizeModal.onClose} fetcher={finalizeFetcher} 
        // @ts-expect-error TS2339 - TODO: fix type
        defaultCc={(_u = routeData === null || routeData === void 0 ? void 0 : routeData.defaultCc) !== null && _u !== void 0 ? _u : []}/>)}
      {createRevisionModal.isOpen && (<CreateRevisionModal quote={routeData === null || routeData === void 0 ? void 0 : routeData.quote} asRevision={asRevision} onClose={createRevisionModal.onClose}/>)}
      {shareModal.isOpen && (<ShareQuoteModal id={quoteId} externalLinkId={(_v = routeData === null || routeData === void 0 ? void 0 : routeData.quote.externalLinkId) !== null && _v !== void 0 ? _v : undefined} onClose={shareModal.onClose}/>)}
      {/* we use isOpen so we don't lose state */}
      <QuoteToOrderDrawer_1.default isOpen={convertToOrderModal.isOpen} onClose={convertToOrderModal.onClose} quote={routeData === null || routeData === void 0 ? void 0 : routeData.quote} lines={eligibleLines !== null && eligibleLines !== void 0 ? eligibleLines : []} pricing={(_w = routeData === null || routeData === void 0 ? void 0 : routeData.prices) !== null && _w !== void 0 ? _w : []}/>
      {deleteQuoteModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deleteQuote(quoteId)} isOpen={deleteQuoteModal.isOpen} name={(_x = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _x === void 0 ? void 0 : _x.quoteId} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_y = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _y === void 0 ? void 0 : _y.quoteId)} onCancel={function () {
                deleteQuoteModal.onClose();
            }} onSubmit={function () {
                deleteQuoteModal.onClose();
            }}/>)}
      {auditLogDrawer}
    </>);
}
var QuoteHeader = function () {
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("quoteId not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    return (<>
      {leftSlotEl &&
            (0, react_dom_1.createPortal)(<QuoteTopbarLeft quoteId={quoteId}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1"/>
        <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = QuoteHeader;
function CreateRevisionModal(_a) {
    var _b, _c;
    var quote = _a.quote, asRevision = _a.asRevision, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var _d = (0, react_2.useState)(null), newQuoteId = _d[0], setNewQuoteId = _d[1];
    var fetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d, _e;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === false) {
            react_1.toast.error((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.message);
        }
        if (((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success) === true) {
            react_1.toast.success(asRevision
                ? t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Successfully created a new revision"], ["Successfully created a new revision"]))) : t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Successfully copied quote"], ["Successfully copied quote"]))));
            setNewQuoteId((_e = (_d = fetcher.data) === null || _d === void 0 ? void 0 : _d.data.newQuoteId) !== null && _e !== void 0 ? _e : null);
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success, t]);
    if (!quote)
        return null;
    return (<react_1.Modal open onOpenChange={onClose}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            {asRevision ? (<macro_1.Trans>Create Quote Revision</macro_1.Trans>) : (<macro_1.Trans>Copy Quote</macro_1.Trans>)}
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            {asRevision ? (<macro_1.Trans>The quote will be copied with a revision suffix</macro_1.Trans>) : (<macro_1.Trans>Create a quote with a new quote ID</macro_1.Trans>)}
          </react_1.ModalDescription>
        </react_1.ModalHeader>
        {newQuoteId ? (<>
            <react_1.ModalBody>
              <div className="flex flex-col items-center justify-center py-8">
                <div>
                  <lu_1.LuCheck className="w-16 h-16 text-green-500"/>
                </div>
                <h2 className="animate-fade-in">
                  <macro_1.Trans>The quote has been created</macro_1.Trans>
                </h2>
              </div>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.Button variant="secondary" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <react_1.Button asChild>
                <react_router_1.Link to={path_1.path.to.quoteDetails(newQuoteId)}>
                  <macro_1.Trans>Open</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </react_1.ModalFooter>
          </>) : (<react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <fetcher.Form method="post" action={path_1.path.to.quoteDuplicate(quote.id)}>
              <input type="hidden" name="quoteId" value={(_c = quote === null || quote === void 0 ? void 0 : quote.id) !== null && _c !== void 0 ? _c : ""}/>
              <input type="hidden" name="asRevision" value={asRevision ? "true" : "false"}/>
              <react_1.Button isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} variant="primary" type="submit">
                {asRevision ? (<macro_1.Trans>Create Revision</macro_1.Trans>) : (<macro_1.Trans>Copy Quote</macro_1.Trans>)}
              </react_1.Button>
            </fetcher.Form>
          </react_1.ModalFooter>)}
      </react_1.ModalContent>
    </react_1.Modal>);
}
function ShareQuoteModal(_a) {
    var id = _a.id, externalLinkId = _a.externalLinkId, onClose = _a.onClose;
    if (!externalLinkId)
        return null;
    if (typeof window === "undefined")
        return null;
    var digitalQuoteUrl = "".concat(window.location.origin).concat(path_1.path.to.externalQuote(externalLinkId));
    return (<react_1.Modal open onOpenChange={function (open) {
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
            <macro_1.Trans>Copy this link to share the quote with a customer</macro_1.Trans>
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
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
