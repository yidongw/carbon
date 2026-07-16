"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortableNavItem = SortableNavItem;
var react_1 = require("@carbon/react");
var sortable_1 = require("@dnd-kit/sortable");
var utilities_1 = require("@dnd-kit/utilities");
var lu_1 = require("react-icons/lu");
function SortableNavItem(_a) {
    var module = _a.module, isOpen = _a.isOpen, onToggleHidden = _a.onToggleHidden;
    var _b = (0, sortable_1.useSortable)({ id: module.key }), attributes = _b.attributes, listeners = _b.listeners, setNodeRef = _b.setNodeRef, transform = _b.transform, transition = _b.transition, isDragging = _b.isDragging;
    var style = {
        transform: utilities_1.CSS.Translate.toString(transform),
        transition: transition
    };
    return (<div ref={setNodeRef} style={style} className={(0, react_1.cn)("relative", "h-10 w-10 group-data-[state=expanded]:w-full", "flex items-center rounded-md", "group-data-[state=collapsed]:justify-center", "group-data-[state=expanded]:-space-x-2", "font-medium shrink-0 inline-flex select-none", "transition-[background-color,color,width] duration-100 ease-out", "hover:bg-accent hover:text-accent-foreground", "border border-transparent", isDragging && "opacity-50 border-primary", "group/item")}>
      {/* Drag handle */}
      <div className={(0, react_1.cn)("absolute left-0 top-0 h-full flex items-center pl-1", "opacity-0 group-data-[state=expanded]:opacity-100", "cursor-grab active:cursor-grabbing")} {...attributes} {...listeners}>
        <lu_1.LuGripVertical className="w-3 h-3 text-muted-foreground"/>
      </div>

      {/* Module icon */}
      <module.icon className="absolute left-8 top-3 flex items-center justify-center"/>

      {/* Module name */}
      <span className={(0, react_1.cn)("min-w-[128px] text-sm", "absolute left-12 group-data-[state=expanded]:left-16", "opacity-0 group-data-[state=expanded]:opacity-100")}>
        {module.name}
      </span>

      {/* Hide button */}
      <button type="button" onClick={function () { return onToggleHidden(module.key); }} className={(0, react_1.cn)("absolute right-2 top-2.5 p-0.5 rounded", "opacity-0 group-data-[state=expanded]:opacity-100", "text-muted-foreground hover:text-foreground", "transition-opacity")}>
        <lu_1.LuEyeOff className="w-3.5 h-3.5"/>
      </button>
    </div>);
}
