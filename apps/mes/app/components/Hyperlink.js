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
var react_router_1 = require("react-router");
var Hyperlink = function (_a) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    return "to" in props && props.to ? (<react_router_1.Link prefetch="intent" className={(0, react_1.cn)("text-foreground hover:underline cursor-pointer font-medium", className)} {...props}>
      {children}
    </react_router_1.Link>) : (<span className={(0, react_1.cn)("text-foreground hover:underline cursor-pointer ", className)} {...props}>
      {children}
    </span>);
};
exports.default = Hyperlink;
