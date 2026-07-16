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
var AuditLog_1 = require("~/components/AuditLog");
var Layout_1 = require("~/components/Layout");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var useMaterialNavigation_1 = require("./useMaterialNavigation");
function MaterialTopbarLeft(_a) {
    var _b, _c;
    var itemId = _a.itemId;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var deleteModal = (0, react_1.useDisclosure)();
    var _d = (0, AuditLog_1.useAuditLog)({
        entityType: "item",
        entityId: itemId,
        companyId: company.id,
        variant: "dropdown"
    }), auditLogTrigger = _d.trigger, auditLogDrawer = _d.drawer;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.material(itemId));
    var readableId = (_c = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _b === void 0 ? void 0 : _b.readableIdWithRevision) !== null && _c !== void 0 ? _c : "";
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarId to={path_1.path.to.materialDetails(itemId)}>
          {readableId}
        </Layout_1.DetailTopbarId>
        <react_1.Copy text={readableId}/>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} size="sm" variant="secondary"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            {auditLogTrigger}
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={!permissions.can("delete", "parts") ||
            !permissions.is("employee")} destructive onClick={deleteModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Material</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>
      {auditLogDrawer}
      {deleteModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deleteItem(itemId)} isOpen={deleteModal.isOpen} name={readableId} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), readableId)} onCancel={deleteModal.onClose} onSubmit={deleteModal.onClose}/>)}
    </>);
}
var MaterialHeader = function () {
    var t = (0, macro_1.useLingui)().t;
    var links = (0, useMaterialNavigation_1.useMaterialNavigation)();
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId)
        throw new Error("itemId not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    return (<>
      {leftSlotEl &&
            (0, react_dom_1.createPortal)(<MaterialTopbarLeft itemId={itemId}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center">
          <Layout_1.DetailsTopbar links={links}/>
        </div>
        <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = MaterialHeader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
