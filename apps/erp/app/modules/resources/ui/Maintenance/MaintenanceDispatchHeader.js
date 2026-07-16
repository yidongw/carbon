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
var path_1 = require("~/utils/path");
var resources_models_1 = require("../../resources.models");
var MaintenanceStatus_1 = require("./MaintenanceStatus");
function MaintenanceDispatchTopbarLeft(_a) {
    var _b, _c, _d, _e, _f;
    var dispatchId = _a.dispatchId;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var statusFetcher = (0, react_router_1.useFetcher)();
    var deleteModal = (0, react_1.useDisclosure)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.maintenanceDispatch(dispatchId));
    var status = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _b === void 0 ? void 0 : _b.status;
    var isLocked = (0, resources_models_1.isMaintenanceDispatchLocked)(status);
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarId to={path_1.path.to.maintenanceDispatch(dispatchId)}>
          {(_c = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _c === void 0 ? void 0 : _c.maintenanceDispatchId}
        </Layout_1.DetailTopbarId>
        <MaintenanceStatus_1.default iconOnly status={status}/>
        <react_1.Copy text={(_e = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _d === void 0 ? void 0 : _d.maintenanceDispatchId) !== null && _e !== void 0 ? _e : ""}/>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary" size="sm"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            <react_1.DropdownMenuItem disabled={!["Open", "Assigned"].includes(status !== null && status !== void 0 ? status : "") ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "resources")} onClick={function () {
            statusFetcher.submit({ status: "In Progress" }, {
                method: "post",
                action: path_1.path.to.maintenanceDispatchStatus(dispatchId)
            });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCirclePlay />}/>
              <macro_1.Trans>Start</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem disabled={status !== "In Progress" ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "resources")} onClick={function () {
            statusFetcher.submit({ status: "Completed" }, {
                method: "post",
                action: path_1.path.to.maintenanceDispatchStatus(dispatchId)
            });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCircleCheck />}/>
              <macro_1.Trans>Complete</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={!["In Progress", "Completed"].includes(status !== null && status !== void 0 ? status : "") ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "resources")} onClick={function () {
            statusFetcher.submit({ status: "Open" }, {
                method: "post",
                action: path_1.path.to.maintenanceDispatchStatus(dispatchId)
            });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuLoaderCircle />}/>
              <macro_1.Trans>Reopen</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem destructive disabled={isLocked ||
            !permissions.can("delete", "resources") ||
            !permissions.is("employee")} onClick={deleteModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Dispatch</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>
      {deleteModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deleteMaintenanceDispatch(dispatchId)} isOpen={deleteModal.isOpen} name={(_f = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _f === void 0 ? void 0 : _f.maintenanceDispatchId} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete this maintenance dispatch? This cannot be undone."], ["Are you sure you want to delete this maintenance dispatch? This cannot be undone."])))} onCancel={function () {
                deleteModal.onClose();
            }} onSubmit={function () {
                deleteModal.onClose();
            }}/>)}
    </>);
}
var MaintenanceDispatchHeader = function () {
    var dispatchId = (0, react_router_1.useParams)().dispatchId;
    if (!dispatchId)
        throw new Error("dispatchId not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    return (<>
      {leftSlotEl &&
            (0, react_dom_1.createPortal)(<MaintenanceDispatchTopbarLeft dispatchId={dispatchId}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1"/>
        <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = MaintenanceDispatchHeader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
