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
exports.PulsingDot = PulsingDot;
var cn_1 = require("./utils/cn");
function PulsingDot(_a) {
    var inactive = _a.inactive, className = _a.className, props = __rest(_a, ["inactive", "className"]);
    if (inactive) {
        return (<span className={(0, cn_1.cn)("w-2 h-2 bg-muted rounded-full bg-red-500", className)} {...props}/>);
    }
    return (<span className={(0, cn_1.cn)("relative flex h-2 w-2", className)} {...props}>
      <span className={"absolute h-full w-full animate-ping rounded-full border border-emerald-500 opacity-100 duration-1000"}/>
      <span className={"h-2 w-2 rounded-full bg-emerald-500"}/>
    </span>);
}
