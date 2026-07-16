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
exports.PopoverTrigger = exports.PopoverHeader = exports.PopoverFooter = exports.PopoverContent = exports.PopoverClose = exports.Popover = void 0;
var PopoverPrimitive = require("@radix-ui/react-popover");
var react_1 = require("react");
var cn_1 = require("./utils/cn");
var dom_1 = require("./utils/dom");
var Popover = PopoverPrimitive.Root;
exports.Popover = Popover;
var PopoverTrigger = PopoverPrimitive.Trigger;
exports.PopoverTrigger = PopoverTrigger;
var PopoverContent = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, _b = _a.align, align = _b === void 0 ? "center" : _b, _c = _a.sideOffset, sideOffset = _c === void 0 ? 4 : _c, onCloseAutoFocus = _a.onCloseAutoFocus, props = __rest(_a, ["className", "align", "sideOffset", "onCloseAutoFocus"]);
    return (<PopoverPrimitive.Portal>
      <PopoverPrimitive.Content ref={ref} align={align} sideOffset={sideOffset} onCloseAutoFocus={(0, dom_1.preventOverlayCloseAutoFocus)(onCloseAutoFocus)} className={(0, cn_1.cn)("z-50 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)} {...props}/>
    </PopoverPrimitive.Portal>);
});
exports.PopoverContent = PopoverContent;
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
var PopoverHeader = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} className={(0, cn_1.cn)("-mx-4 -mt-4 mb-4 px-4 py-2 border-b border-border text-sm font-medium text-foreground", className)} {...props}/>);
});
exports.PopoverHeader = PopoverHeader;
PopoverHeader.displayName = "PopoverHeader";
var PopoverFooter = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} className={(0, cn_1.cn)("-mx-4 -mb-4 mt-4 px-4 py-2 border-t border-border text-sm font-medium text-foreground", className)} {...props}/>);
});
exports.PopoverFooter = PopoverFooter;
PopoverFooter.displayName = "PopoverFooter";
var PopoverClose = PopoverPrimitive.Close;
exports.PopoverClose = PopoverClose;
