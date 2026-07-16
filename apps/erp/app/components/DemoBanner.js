"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoBanner = DemoBanner;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var AppBanner_1 = require("~/components/AppBanner");
var path_1 = require("~/utils/path");
// Defined outside DemoBanner so React doesn't remount the form/button subtree on
// every render (a component defined inside a render body gets a new reference each
// time, which forces React to unmount + remount it).
function Action(_a) {
    var action = _a.action, children = _a.children;
    var fetcher = (0, react_router_1.useFetcher)();
    return (<fetcher.Form method="post" action={action} className="inline">
      <button type="submit" className="underline underline-offset-2 font-medium hover:opacity-80">
        {children}
      </button>
    </fetcher.Form>);
}
function RequestExtensionAction(_a) {
    var _b;
    var alreadyRequested = _a.alreadyRequested;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var done = alreadyRequested || ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.ok) === true;
    var busy = fetcher.state !== "idle";
    return (<fetcher.Form method="post" action={path_1.path.to.demoExtendRequest} className="inline">
      <button type="submit" disabled={busy || done} className="underline underline-offset-2 font-medium hover:opacity-80 disabled:opacity-60 disabled:no-underline">
        {extendIcon}
        {done ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Extension requested"], ["Extension requested"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Request extension"], ["Request extension"])))}
      </button>
    </fetcher.Form>);
}
var demoIcon = (<lu_1.LuFlaskConical className="mr-1 inline size-3.5 align-[-0.15em]"/>);
var companyIcon = (<lu_1.LuBuilding2 className="mr-1 inline size-3.5 align-[-0.15em]"/>);
var extendIcon = (<lu_1.LuCalendarPlus className="mr-1 inline size-3.5 align-[-0.15em]"/>);
function daysLeft(expiresAt) {
    if (!expiresAt)
        return 0;
    var ms = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}
/**
 * Free-plan / demo banner. An inline action POSTs to a route (switch company or create the
 * demo). Kept brand-neutral (no product name) so rebranding is just a token change.
 *
 * States covered so far (Phase 3 will add the free-plan/upgrade framing once gating lands):
 *  - in the demo, active   → days left + switch back
 *  - in the demo, ended    → switch back
 *  - not in demo, has demo → explore the demo
 *  - not in demo, no demo  → try the demo
 */
function DemoBanner(_a) {
    var demo = _a.demo, realCompanyId = _a.realCompanyId;
    var t = (0, macro_1.useLingui)().t;
    var content;
    if (demo === null || demo === void 0 ? void 0 : demo.isCurrent) {
        var days = daysLeft(demo.expiresAt);
        content =
            days <= 0 ? (<>
          {demoIcon}
          {t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["You're in the demo company \u2014 it has ended."], ["You're in the demo company \u2014 it has ended."])))}{" "}
          <RequestExtensionAction alreadyRequested={demo.extensionRequested}/>{" "}
          {realCompanyId && (<Action action={path_1.path.to.companySwitch(realCompanyId)}>
              {companyIcon}
              {t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Switch to your company"], ["Switch to your company"])))}
            </Action>)}
        </>) : (<>
          {demoIcon}
          {days === 1
                    ? t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["You're in the demo company \u2014 1 day left."], ["You're in the demo company \u2014 1 day left."]))) : t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["You're in the demo company \u2014 ", " days left."], ["You're in the demo company \u2014 ", " days left."])), days)}{" "}
          {days <= 7 && (<>
              <RequestExtensionAction alreadyRequested={demo.extensionRequested}/>{" "}
            </>)}
          {realCompanyId && (<Action action={path_1.path.to.companySwitch(realCompanyId)}>
              {companyIcon}
              {t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Switch to your company"], ["Switch to your company"])))}
            </Action>)}
        </>);
    }
    else if (demo) {
        content = (<>
        {companyIcon}
        {t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["You're in your company."], ["You're in your company."])))}{" "}
        <Action action={path_1.path.to.companySwitch(demo.id)}>
          {demoIcon}
          {t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Explore the demo"], ["Explore the demo"])))}
        </Action>
      </>);
    }
    else {
        content = (<>
        {companyIcon}
        {t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["You're in your company."], ["You're in your company."])))}{" "}
        <Action action={path_1.path.to.tryDemo}>
          {demoIcon}
          {t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Try the demo"], ["Try the demo"])))}
        </Action>
      </>);
    }
    return <AppBanner_1.AppBanner>{content}</AppBanner_1.AppBanner>;
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
