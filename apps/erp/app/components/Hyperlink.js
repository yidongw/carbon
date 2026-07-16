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
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Hyperlink = function (_a) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    return "to" in props && props.to ? (<react_router_1.Link prefetch="intent" className={(0, react_1.cn)("group/hyperlink inline-flex items-center gap-1 text-foreground font-medium cursor-pointer", className)} {...props}>
      {children}
      {props.to && props.to !== "#" && (<lu_1.LuPanelRight className="hidden md:block h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50 transition-colors duration-150 group-hover/hyperlink:text-foreground"/>)}
    </react_router_1.Link>) : (<span className={(0, react_1.cn)("text-foreground", className)} {...props}>
      {children}
    </span>);
};
exports.default = Hyperlink;
