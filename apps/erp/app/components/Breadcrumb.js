"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Breadcrumbs = exports.BreadcrumbLink = exports.BreadcrumbItem = void 0;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Breadcrumbs = (0, react_2.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, _b = _a.useReactRouter, useReactRouter = _b === void 0 ? true : _b, props = __rest(_a, ["className", "children", "useReactRouter"]);
    var t = (0, macro_1.useLingui)().t;
    var validChildren = (0, react_1.getValidChildren)(children);
    var count = validChildren.length;
    var clones = validChildren.map(function (child, index) {
        return (0, react_2.cloneElement)(child, {
            isFirstChild: index === 0,
            isLastChild: index === count - 1
        });
    });
    return (<nav aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Breadcrumb"], ["Breadcrumb"])))} ref={ref} className={(0, react_1.cn)("reset flex", className)} {...props}>
      <ol className="inline-flex items-center">{clones}</ol>
    </nav>);
});
exports.Breadcrumbs = Breadcrumbs;
Breadcrumbs.displayName = "Breadcrumbs";
var BreadcrumbItem = (0, react_2.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, isFirstChild = _a.isFirstChild, isLastChild = _a.isLastChild, props = __rest(_a, ["className", "children", "isFirstChild", "isLastChild"]);
    return (<li ref={ref} className={(0, react_1.cn)("inline-flex items-center", className)} {...props}>
    {!isFirstChild && (<span aria-hidden className="shrink-0 px-1.5 text-accent-foreground">
        /
      </span>)}
    {children}
  </li>);
});
exports.BreadcrumbItem = BreadcrumbItem;
BreadcrumbItem.displayName = "BreadcrumbItem";
var breadcrumbLinkClassName = function (isCurrentPage, className) {
    return (0, react_1.cn)("inline-flex min-w-0 max-w-full truncate rounded-sm outline-none", "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", isCurrentPage
        ? "font-semibold text-foreground"
        : "font-medium text-accent-foreground hover:underline", className);
};
var BreadcrumbLink = (0, react_2.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, isCurrentPage = _a.isCurrentPage, to = _a.to, props = __rest(_a, ["className", "children", "isCurrentPage", "to"]);
    if (isCurrentPage) {
        return (<span aria-current="page" ref={ref} className={breadcrumbLinkClassName(true, className)}>
        {children}
      </span>);
    }
    return (<react_router_1.Link ref={ref} to={to} prefetch="intent" className={breadcrumbLinkClassName(false, className)} {...props}>
      {children}
    </react_router_1.Link>);
});
exports.BreadcrumbLink = BreadcrumbLink;
BreadcrumbLink.displayName = "BreadcrumbLink";
var templateObject_1;
