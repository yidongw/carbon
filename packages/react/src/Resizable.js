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
exports.ResizablePanelGroup = exports.ResizablePanel = exports.ResizableHandle = void 0;
var lu_1 = require("react-icons/lu");
var ResizablePrimitive = require("react-resizable-panels");
var ClientOnly_1 = require("./ClientOnly");
var cn_1 = require("./utils/cn");
var ResizablePanelGroup = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<ClientOnly_1.ClientOnly fallback={null}>
    {function () { return (<ResizablePrimitive.PanelGroup className={(0, cn_1.cn)("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)} {...props}/>); }}
  </ClientOnly_1.ClientOnly>);
};
exports.ResizablePanelGroup = ResizablePanelGroup;
var ResizablePanel = ResizablePrimitive.Panel;
exports.ResizablePanel = ResizablePanel;
var ResizableHandle = function (_a) {
    var withHandle = _a.withHandle, className = _a.className, props = __rest(_a, ["withHandle", "className"]);
    return (<ResizablePrimitive.PanelResizeHandle className={(0, cn_1.cn)("relative flex w-px items-center justify-center bg-foreground/10 after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90", className)} {...props}>
    {withHandle && (<div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <lu_1.LuGripVertical className="h-3 w-3"/>
      </div>)}
  </ResizablePrimitive.PanelResizeHandle>);
};
exports.ResizableHandle = ResizableHandle;
