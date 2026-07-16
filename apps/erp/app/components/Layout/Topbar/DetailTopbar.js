"use strict";
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
exports.DetailTopbarContent = DetailTopbarContent;
exports.DetailTopbarId = DetailTopbarId;
exports.DetailTopbarPlainId = DetailTopbarPlainId;
exports.DetailTopbarBadge = DetailTopbarBadge;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var TopbarContext_1 = require("./TopbarContext");
/** Consistent layout for detail identity rendered in the topbar portal slot. */
function DetailTopbarContent(_a) {
    var children = _a.children;
    var setHasDetailTopbar = (0, TopbarContext_1.useTopbarLeft)().setHasDetailTopbar;
    (0, react_2.useEffect)(function () {
        setHasDetailTopbar(true);
        return function () { return setHasDetailTopbar(false); };
    }, [setHasDetailTopbar]);
    return (<react_1.HStack className="items-center min-w-0 flex-1 overflow-visible [&>*:not(:first-child)]:shrink-0" spacing={1}>
      {children}
    </react_1.HStack>);
}
/** Max width leaves room for status badges, copy, and overflow menu. */
var DETAIL_ID_MAX_WIDTH = "max-w-[calc(100%-7rem)]";
/** Detail ID styled as a breadcrumb continuation on desktop. Pass `to` for a link, omit for plain text. */
function DetailTopbarId(_a) {
    var to = _a.to, children = _a.children;
    return (<div className={(0, react_1.cn)("flex min-w-0 shrink items-center overflow-hidden", DETAIL_ID_MAX_WIDTH)}>
      <span aria-hidden className="hidden md:inline shrink-0 px-1.5 text-accent-foreground">
        /
      </span>
      {to ? (<react_router_1.Link to={to} className="min-w-0 truncate font-semibold text-foreground hover:underline">
          {children}
        </react_router_1.Link>) : (<span className="truncate font-semibold text-foreground">
          {children}
        </span>)}
    </div>);
}
/** @deprecated Use `<DetailTopbarId>` without `to` instead. */
function DetailTopbarPlainId(_a) {
    var children = _a.children;
    return <DetailTopbarId>{children}</DetailTopbarId>;
}
/** Icon-only badge with label shown in a tooltip — for topbar detail metadata. */
function DetailTopbarBadge(_a) {
    var label = _a.label, icon = _a.icon, className = _a.className, props = __rest(_a, ["label", "icon", "className"]);
    return (<react_1.Tooltip>
      <react_1.TooltipTrigger asChild>
        <react_1.Badge className={(0, react_1.cn)("px-1.5 min-w-0 shrink-0", className)} {...props}>
          {icon !== null && icon !== void 0 ? icon : <lu_1.LuTag className="size-3.5"/>}
        </react_1.Badge>
      </react_1.TooltipTrigger>
      <react_1.TooltipContent>
        <span>{label}</span>
      </react_1.TooltipContent>
    </react_1.Tooltip>);
}
