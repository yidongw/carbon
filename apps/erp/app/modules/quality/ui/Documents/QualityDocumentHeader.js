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
var path_1 = require("~/utils/path");
var QualityDocumentApprovalModal_1 = require("./QualityDocumentApprovalModal");
var QualityDocumentForm_1 = require("./QualityDocumentForm");
var QualityDocumentStatus_1 = require("./QualityDocumentStatus");
function QualityDocumentTopbarLeft(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    var id = _a.id;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var newVersionDisclosure = (0, react_1.useDisclosure)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var statusFetcher = (0, react_router_1.useFetcher)();
    var approvalFetcher = (0, react_router_1.useFetcher)();
    var _1 = (0, react_2.useState)(null), approvalDecision = _1[0], setApprovalDecision = _1[1];
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.qualityDocument(id));
    var status = (_c = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _b === void 0 ? void 0 : _b.status) !== null && _c !== void 0 ? _c : null;
    var isDraft = status === "Draft";
    var isArchived = status === "Archived";
    var canActivate = isDraft || isArchived;
    var approvalRequestId = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.approvalRequest) === null || _d === void 0 ? void 0 : _d.id;
    var hasApprovalRequest = !!approvalRequestId;
    var canApprove = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.canApprove) !== null && _e !== void 0 ? _e : false;
    var canDelete = (_f = routeData === null || routeData === void 0 ? void 0 : routeData.canDelete) !== null && _f !== void 0 ? _f : true;
    var isApprovalRequired = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.isApprovalRequired) !== null && _g !== void 0 ? _g : false;
    var statusIdle = statusFetcher.state === "idle";
    var submitLoading = !statusIdle &&
        ((_h = statusFetcher.formData) === null || _h === void 0 ? void 0 : _h.get("field")) === "status" &&
        ((_j = statusFetcher.formData) === null || _j === void 0 ? void 0 : _j.get("value")) === "Active";
    var submitButtonLabel;
    if (isApprovalRequired) {
        submitButtonLabel = t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Submit for approval"], ["Submit for approval"])));
    }
    else if (isArchived) {
        submitButtonLabel = t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Reactivate"], ["Reactivate"])));
    }
    else {
        submitButtonLabel = t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Publish"], ["Publish"])));
    }
    var submitForActivation = function () {
        var formData = new FormData();
        formData.append("ids", id);
        formData.append("field", "status");
        formData.append("value", "Active");
        statusFetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdateQualityDocument
        });
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        newVersionDisclosure.onClose();
    }, [id]);
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarPlainId>{(_k = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _k === void 0 ? void 0 : _k.name}</Layout_1.DetailTopbarPlainId>
        <Layout_1.DetailTopbarBadge variant="outline" label={"V".concat((_l = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _l === void 0 ? void 0 : _l.version)}/>
        <QualityDocumentStatus_1.default iconOnly status={(_m = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _m === void 0 ? void 0 : _m.status}/>
        <react_1.Copy text={(_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _o === void 0 ? void 0 : _o.name) !== null && _p !== void 0 ? _p : ""}/>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} size="sm" variant="secondary"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            {canActivate && !hasApprovalRequest && (<react_1.DropdownMenuItem disabled={!permissions.can("update", "quality") ||
                !permissions.is("employee") ||
                !statusIdle ||
                submitLoading} onClick={submitForActivation}>
                <react_1.DropdownMenuIcon icon={isApprovalRequired ? <lu_1.LuClipboardCheck /> : <lu_1.LuCheckCheck />}/>
                {submitButtonLabel}
              </react_1.DropdownMenuItem>)}
            {canActivate && hasApprovalRequest && (<>
                <react_1.DropdownMenuItem disabled={!canApprove} onClick={function () { return setApprovalDecision("Approved"); }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuCheckCheck />}/>
                  <macro_1.Trans>Approve</macro_1.Trans>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuItem destructive disabled={!canApprove} onClick={function () { return setApprovalDecision("Rejected"); }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuX />}/>
                  <macro_1.Trans>Reject</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </>)}
            {(canActivate || permissions.can("create", "quality")) && (<react_1.DropdownMenuSeparator />)}
            {permissions.can("create", "quality") && (<react_1.DropdownMenuItem onClick={newVersionDisclosure.onOpen}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuCirclePlus />}/>
                <macro_1.Trans>New Version</macro_1.Trans>
              </react_1.DropdownMenuItem>)}
            <react_2.Suspense fallback={null}>
              <react_router_1.Await resolve={routeData === null || routeData === void 0 ? void 0 : routeData.versions}>
                {function (versions) {
            var _a;
            return (<react_1.DropdownMenuRadioGroup value={id} onValueChange={function (value) {
                    return navigate(path_1.path.to.qualityDocument(value));
                }}>
                    {(routeData === null || routeData === void 0 ? void 0 : routeData.document) && (<react_1.DropdownMenuRadioItem key={routeData.document.id} value={routeData.document.id} className="flex items-center justify-between gap-2">
                        <react_1.Badge variant="outline">
                          V{routeData.document.version}
                        </react_1.Badge>
                        <span>{routeData.document.name}</span>
                        <QualityDocumentStatus_1.default status={routeData.document.status}/>
                      </react_1.DropdownMenuRadioItem>)}
                    {(_a = versions === null || versions === void 0 ? void 0 : versions.data) === null || _a === void 0 ? void 0 : _a.filter(function (v) { return v.id !== id; }).map(function (version) { return (<react_1.DropdownMenuRadioItem key={version.id} value={version.id} className="flex items-center justify-between gap-2">
                          <react_1.Badge variant="outline">V{version.version}</react_1.Badge>
                          <span>{version.name}</span>
                          <QualityDocumentStatus_1.default status={version.status}/>
                        </react_1.DropdownMenuRadioItem>); })}
                  </react_1.DropdownMenuRadioGroup>);
        }}
              </react_router_1.Await>
            </react_2.Suspense>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={!permissions.can("delete", "quality") ||
            !permissions.is("employee") ||
            (canActivate && hasApprovalRequest && !canDelete)} destructive onClick={deleteDisclosure.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Document</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>
      {newVersionDisclosure.isOpen && (<QualityDocumentForm_1.default type="copy" initialValues={{
                name: (_r = (_q = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _q === void 0 ? void 0 : _q.name) !== null && _r !== void 0 ? _r : "",
                version: ((_t = (_s = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _s === void 0 ? void 0 : _s.version) !== null && _t !== void 0 ? _t : 0) + 1,
                content: (_v = JSON.stringify((_u = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _u === void 0 ? void 0 : _u.content)) !== null && _v !== void 0 ? _v : "",
                copyFromId: (_x = (_w = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _w === void 0 ? void 0 : _w.id) !== null && _x !== void 0 ? _x : ""
            }} open={newVersionDisclosure.isOpen} onClose={newVersionDisclosure.onClose}/>)}
      {deleteDisclosure.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deleteQualityDocument(id)} isOpen={deleteDisclosure.isOpen} name={(_z = (_y = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _y === void 0 ? void 0 : _y.name) !== null && _z !== void 0 ? _z : "document"} text={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_0 = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _0 === void 0 ? void 0 : _0.name)} onCancel={function () {
                deleteDisclosure.onClose();
            }} onSubmit={function () {
                deleteDisclosure.onClose();
            }}/>)}
      {approvalDecision && approvalRequestId && (<QualityDocumentApprovalModal_1.default qualityDocument={routeData === null || routeData === void 0 ? void 0 : routeData.document} approvalRequestId={approvalRequestId} decision={approvalDecision} fetcher={approvalFetcher} onClose={function () { return setApprovalDecision(null); }}/>)}
    </>);
}
var QualityDocumentHeader = function () {
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    return (<>
      {leftSlotEl &&
            (0, react_dom_1.createPortal)(<QualityDocumentTopbarLeft id={id}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1"/>
        <react_1.IconButton aria-label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = QualityDocumentHeader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
