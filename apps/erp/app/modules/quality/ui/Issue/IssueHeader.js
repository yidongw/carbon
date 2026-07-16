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
var suppliers_1 = require("~/stores/suppliers");
var path_1 = require("~/utils/path");
var quality_models_1 = require("../../quality.models");
var IssueStatus_1 = require("./IssueStatus");
function IssueTopbarLeft(_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var id = _a.id;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var statusFetcher = (0, react_router_1.useFetcher)();
    var suppliers = (0, suppliers_1.useSuppliers)()[0];
    var deleteIssueModal = (0, react_1.useDisclosure)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.issue(id));
    var status = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _b === void 0 ? void 0 : _b.status;
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarId to={path_1.path.to.issueDetails(id)}>
          {(_c = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _c === void 0 ? void 0 : _c.nonConformanceId}
        </Layout_1.DetailTopbarId>
        <IssueStatus_1.default iconOnly status={status}/>
        <react_1.Copy text={(_e = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _d === void 0 ? void 0 : _d.nonConformanceId) !== null && _e !== void 0 ? _e : ""}/>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary" size="sm"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            {(_f = routeData === null || routeData === void 0 ? void 0 : routeData.suppliers) === null || _f === void 0 ? void 0 : _f.map(function (s) {
            if (!s.externalLinkId)
                return null;
            var supplier = suppliers.find(function (sup) { return sup.id === s.supplierId; });
            return (<react_1.DropdownMenuItem key={s.supplierId} asChild>
                  <react_router_1.Link to={path_1.path.to.externalScar(s.externalLinkId)}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuExternalLink />}/>
                    {supplier === null || supplier === void 0 ? void 0 : supplier.name} <macro_1.Trans>SCAR</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.DropdownMenuItem>);
        })}
            <react_1.DropdownMenuItem asChild>
              <a target="_blank" href={path_1.path.to.file.nonConformance(id)} rel="noreferrer">
                <react_1.DropdownMenuIcon icon={<lu_1.LuFile />}/>
                <macro_1.Trans>Report</macro_1.Trans>
              </a>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={status !== "Registered" ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "quality")} onClick={function () {
            statusFetcher.submit({ status: "In Progress" }, { method: "post", action: path_1.path.to.issueStatus(id) });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCirclePlay />}/>
              <macro_1.Trans>Start</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem disabled={status !== "In Progress" ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "quality")} onClick={function () {
            statusFetcher.submit({}, { method: "post", action: path_1.path.to.closeIssue(id) });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCircleCheck />}/>
              <macro_1.Trans>Complete</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={!["In Progress", "Closed"].includes(status !== null && status !== void 0 ? status : "") ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "quality")} onClick={function () {
            statusFetcher.submit({ status: "Registered" }, { method: "post", action: path_1.path.to.issueStatus(id) });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuLoaderCircle />}/>
              <macro_1.Trans>Reopen</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem destructive disabled={!permissions.can("delete", "quality") ||
            !permissions.is("employee") ||
            (0, quality_models_1.isIssueLocked)(status)} onClick={deleteIssueModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Issue</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>
      {deleteIssueModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deleteIssue(id)} isOpen={deleteIssueModal.isOpen} name={(_g = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _g === void 0 ? void 0 : _g.nonConformanceId} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_h = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _h === void 0 ? void 0 : _h.nonConformanceId)} onCancel={function () {
                deleteIssueModal.onClose();
            }} onSubmit={function () {
                deleteIssueModal.onClose();
            }}/>)}
    </>);
}
var IssueHeader = function () {
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    return (<>
      {leftSlotEl && (0, react_dom_1.createPortal)(<IssueTopbarLeft id={id}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1"/>
        <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = IssueHeader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
