"use client";
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
exports.TooltipTrigger = exports.TooltipProvider = exports.TooltipContent = exports.Tooltip = void 0;
var TooltipPrimitive = require("@radix-ui/react-tooltip");
var react_1 = require("react");
var cn_1 = require("./utils/cn");
var TooltipProvider = TooltipPrimitive.Provider;
exports.TooltipProvider = TooltipProvider;
var Tooltip = function (_a) {
    var _b = _a.delayDuration, delayDuration = _b === void 0 ? 0 : _b, props = __rest(_a, ["delayDuration"]);
    return (<TooltipPrimitive.Root delayDuration={delayDuration} {...props}/>);
};
exports.Tooltip = Tooltip;
Tooltip.displayName = TooltipPrimitive.Root.displayName;
var TooltipTrigger = TooltipPrimitive.Trigger;
exports.TooltipTrigger = TooltipTrigger;
var TooltipContent = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, _b = _a.sideOffset, sideOffset = _b === void 0 ? 4 : _b, props = __rest(_a, ["className", "sideOffset"]);
    return (<TooltipPrimitive.Portal>
    <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={(0, cn_1.cn)("z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)} {...props}/>
  </TooltipPrimitive.Portal>);
});
exports.TooltipContent = TooltipContent;
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
