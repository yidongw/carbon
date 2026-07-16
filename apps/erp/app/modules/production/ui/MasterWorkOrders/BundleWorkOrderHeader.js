"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_dom_1 = require("react-dom");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var JobStatus_1 = require("../Jobs/JobStatus");
function BundleTopbarLeft(_a) {
    var _b, _c, _d;
    var bundleWorkOrderId = _a.bundleWorkOrderId;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.bundleWorkOrder(bundleWorkOrderId));
    var readableId = (_c = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.bundleWorkOrder) === null || _b === void 0 ? void 0 : _b.jobReadableId) !== null && _c !== void 0 ? _c : "";
    var status = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.bundleWorkOrder) === null || _d === void 0 ? void 0 : _d.status;
    return (<Layout_1.DetailTopbarContent>
      <Layout_1.DetailTopbarId to={path_1.path.to.bundleWorkOrder(bundleWorkOrderId)}>
        {readableId}
      </Layout_1.DetailTopbarId>
      <react_1.Copy text={readableId}/>
      <JobStatus_1.default iconOnly status={status}/>
    </Layout_1.DetailTopbarContent>);
}
var BundleWorkOrderHeader = function () {
    var t = (0, macro_1.useLingui)().t;
    var bundleWorkOrderId = (0, react_router_1.useParams)().bundleWorkOrderId;
    if (!bundleWorkOrderId)
        throw new Error("bundleWorkOrderId not found");
    var toggleProperties = (0, Layout_1.usePanels)().toggleProperties;
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var links = [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Processes"], ["Processes"]))),
            to: path_1.path.to.bundleWorkOrderProcesses(bundleWorkOrderId)
        },
        {
            name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Process Completions"], ["Process Completions"]))),
            to: path_1.path.to.bundleWorkOrderQuantities(bundleWorkOrderId)
        }
    ];
    return (<>
      {leftSlotEl &&
            (0, react_dom_1.createPortal)(<BundleTopbarLeft bundleWorkOrderId={bundleWorkOrderId}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center">
          <Layout_1.DetailsTopbar links={links}/>
        </div>
        <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = BundleWorkOrderHeader;
var templateObject_1, templateObject_2, templateObject_3;
