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
exports.Kbd = void 0;
var react_1 = require("react");
var cn_1 = require("./utils/cn");
var Kbd = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<kbd ref={ref} className={(0, cn_1.cn)("bg-muted text-foreground rounded-md border border-input border-b-[3px] text-[0.8em] font-mono font-bold px-[0.8em] whitespace-nowrap", className)} {...props}/>);
});
exports.Kbd = Kbd;
Kbd.displayName = "Kbd";
