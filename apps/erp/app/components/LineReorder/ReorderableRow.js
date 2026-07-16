"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderableRow = ReorderableRow;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
function ReorderableRow(_a) {
    var dragHandle = _a.dragHandle, isOverlay = _a.isOverlay, children = _a.children;
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.HStack spacing={0} className={(0, react_1.cn)("w-full items-center relative", isOverlay &&
            "bg-card rounded-md shadow-[0_0_0_1px_hsl(var(--border)),0_4px_12px_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.06)]")}>
      {dragHandle && (<button type="button" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Drag to reorder"], ["Drag to reorder"])))} className={(0, react_1.cn)("relative flex items-center justify-center w-10 h-10 shrink-0", "text-muted-foreground/50 hover:text-foreground", "cursor-grab active:cursor-grabbing active:scale-[0.96]", "transition-[color,transform] duration-150 ease")} {...dragHandle.attributes} {...dragHandle.listeners}>
          <lu_1.LuGripVertical className="w-4 h-4"/>
        </button>)}
      {children}
    </react_1.HStack>);
}
var templateObject_1;
