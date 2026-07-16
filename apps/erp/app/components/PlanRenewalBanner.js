"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanRenewalBanner = PlanRenewalBanner;
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var AppBanner_1 = require("~/components/AppBanner");
var path_1 = require("~/utils/path");
function daysLeft(termEndsAt) {
    if (!termEndsAt)
        return 0;
    return Math.ceil((new Date(termEndsAt).getTime() - Date.now()) / 86400000);
}
// Nudges owners of a one-time annual plan to renew. Shows only within the last
// 30 days of the term, or once it has expired. Links to Billing settings.
function PlanRenewalBanner(_a) {
    var annualPlan = _a.annualPlan;
    var t = (0, macro_1.useLingui)().t;
    if (!annualPlan)
        return null;
    var left = daysLeft(annualPlan.termEndsAt);
    var expired = annualPlan.status === "Inactive" || left <= 0;
    if (!expired && left > 30)
        return null;
    return (<AppBanner_1.AppBanner variant={expired ? "destructive" : "warning"}>
      <react_router_1.Link to={path_1.path.to.billing} className="font-medium hover:underline">
        {expired
            ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Your annual license has expired. Renew now to restore access."], ["Your annual license has expired. Renew now to restore access."]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Your annual license expires in ", " days. Renew now."], ["Your annual license expires in ", " days. Renew now."])), left)}
      </react_router_1.Link>
    </AppBanner_1.AppBanner>);
}
var templateObject_1, templateObject_2;
