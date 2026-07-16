"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppBanner = AppBanner;
var react_1 = require("@carbon/react");
var variants = {
    warning: "bg-yellow-100 text-yellow-900",
    destructive: "bg-destructive text-destructive-foreground"
};
function AppBanner(_a) {
    var _b = _a.variant, variant = _b === void 0 ? "warning" : _b, className = _a.className, children = _a.children;
    return (<div className={(0, react_1.cn)("w-full shrink-0 px-4 py-1.5 text-center text-sm", variants[variant], className)}>
      {children}
    </div>);
}
