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
exports.TabsTrigger = exports.TabsList = exports.TabsContent = exports.Tabs = void 0;
var TabsPrimitive = require("@radix-ui/react-tabs");
var react_1 = require("react");
var cn_1 = require("./utils/cn");
var Tabs = TabsPrimitive.Root;
exports.Tabs = Tabs;
var TabsList = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<TabsPrimitive.List ref={ref} className={(0, cn_1.cn)("inline-flex h-9 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]  border-b border-border", className)} {...props}/>);
});
exports.TabsList = TabsList;
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, _b = _a.variant, variant = _b === void 0 ? "secondary" : _b, props = __rest(_a, ["className", "variant"]);
    return (<TabsPrimitive.Trigger ref={ref} className={(0, cn_1.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-[6px] border border-transparent px-3 py-1 text-sm font-medium transition-[background-color,color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50", "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-button-base", className)} {...props}/>);
});
exports.TabsTrigger = TabsTrigger;
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<TabsPrimitive.Content ref={ref} className={(0, cn_1.cn)("flex-1 outline-none", className)} {...props}/>);
});
exports.TabsContent = TabsContent;
TabsContent.displayName = TabsPrimitive.Content.displayName;
