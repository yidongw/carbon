"use client";
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortableList = SortableList;
exports.SortableListItem = SortableListItem;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var Empty_1 = require("./Empty");
function SortableListItem(_a) {
    var item = _a.item, items = _a.items, order = _a.order, onSelectItem = _a.onSelectItem, onToggleItem = _a.onToggleItem, onRemoveItem = _a.onRemoveItem, renderExtra = _a.renderExtra, renderHeaderAction = _a.renderHeaderAction, handleDrag = _a.handleDrag, isExpanded = _a.isExpanded, isHighlighted = _a.isHighlighted, className = _a.className, _b = _a.isReadOnly, isReadOnly = _b === void 0 ? false : _b, _c = _a.dragHandle, dragHandle = _c === void 0 ? false : _c;
    var t = (0, macro_1.useLingui)().t;
    var _d = (0, react_2.useState)(false), isDragging = _d[0], setIsDragging = _d[1];
    var dragControls = (0, framer_motion_1.useDragControls)();
    var itemRef = (0, react_2.useRef)(null);
    var handleDragStart = function (event) {
        if (isExpanded || isReadOnly)
            return;
        (0, react_dom_1.flushSync)(function () { return setIsDragging(true); });
        // snapToCursor jumps the card so its origin meets the pointer. That's fine
        // when the whole card is the drag surface, but with a corner grip handle it
        // yanks the card toward the handle on a plain click. Skip it for the handle.
        dragControls.start(event, dragHandle ? undefined : { snapToCursor: true });
        handleDrag();
    };
    var handleDragEnd = function () {
        setIsDragging(false);
    };
    // Scroll into view when highlighted
    (0, react_2.useEffect)(function () {
        if (isHighlighted && itemRef.current) {
            itemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    }, [isHighlighted]);
    return (<div className={(0, react_1.cn)("", className)} key={item.id} ref={itemRef}>
      <div className="flex w-full items-center">
        <framer_motion_1.Reorder.Item value={item} className={(0, react_1.cn)("relative z-auto grow", "h-full rounded-md bg-muted/40", "border border-border rounded-lg ", !dragHandle && !isExpanded && !isReadOnly && "cursor-grab", isHighlighted && "border-2 border-primary", item.checked && !isDragging ? "w-7/10" : "w-full")} key={item.id} dragListener={!dragHandle && !item.checked && !isExpanded && !isReadOnly} dragControls={dragControls} onDragEnd={handleDragEnd} style={isExpanded
            ? {
                zIndex: 9999,
                position: "relative",
                overflow: item.quantityProgress != null ? "visible" : "hidden"
            }
            : {
                position: "relative",
                overflow: item.quantityProgress != null ? "visible" : "hidden"
            }} whileDrag={{ zIndex: 9999 }}>
          <div className={(0, react_1.cn)(isExpanded ? "w-full" : "", "relative z-20 flex w-full min-w-0 flex-col")}>
            <framer_motion_1.motion.div className="relative w-full px-3 pt-3" layout="position">
              {renderHeaderAction ? (<div className="absolute right-3 top-3 z-20">
                  {renderHeaderAction(item)}
                </div>) : null}
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex flex-col w-full">
                  <div className="flex w-full min-w-0 items-center gap-x-2 pl-3">
                    {/* List Remove Actions */}
                    {!isReadOnly && (<react_1.Checkbox checked={item.checked} id={"checkbox-".concat(item.id)} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Mark to delete"], ["Mark to delete"])))} onCheckedChange={function () { return onToggleItem(item.id); }} className="border-foreground/20 bg-background/30 data-[state=checked]:bg-background data-[state=checked]:text-red-200 flex flex-shrink-0 "/>)}
                    {/* List Order */}
                    <p className="font-medium text-xs pl-1 text-foreground/50 flex flex-shrink-0">
                      {getParallelizedOrder(order, item, items)}
                    </p>

                    <div key={"".concat(item.checked)} className="px-1 flex min-w-0 flex-grow" role="button">
                      <react_1.HStack className={(0, react_1.cn)("w-full min-w-0 justify-between pr-8", !dragHandle && !isReadOnly && "cursor-grab")}>
                        {/* List Title */}
                        {typeof item.title === "string" ? (<span className={(0, react_1.cn)("flex font-medium text-sm md:text-base truncate hover:underline cursor-pointer", item.checked ? "text-red-400" : "text-foreground")} onClick={function (e) {
                if (!isDragging) {
                    onSelectItem(item.id);
                }
            }}>
                            {item.title}
                          </span>) : (<div onClick={function (e) {
                if (!isDragging) {
                    onSelectItem(item.id);
                }
            }} className={(0, react_1.cn)("min-w-0 flex-1", item.checked ? "text-red-400" : "")}>
                            {item.title}
                          </div>)}

                        {item.details && (<div className="ml-2 flex shrink-0 overflow-visible">
                            {item.details}
                          </div>)}
                      </react_1.HStack>
                    </div>
                  </div>
                </div>

                {/* List Item Children */}
              </div>
            </framer_motion_1.motion.div>
            {item.quantityProgress != null && (<QuantityProgressStrip progress={item.quantityProgress}/>)}
            {renderExtra && (<framer_motion_1.motion.div className={(0, react_1.cn)("w-full px-3", item.quantityProgress == null && !item.footer && "pb-3")} layout="position">
                {renderExtra(item)}
              </framer_motion_1.motion.div>)}
            {item.footer && (<div className={(0, react_1.cn)("flex w-full items-center px-3 py-2", (isExpanded || item.quantityProgress == null) &&
                "border-t border-border")}>
                {item.footer}
              </div>)}
          </div>
          {dragHandle
            ? !isExpanded &&
                !isReadOnly &&
                !item.checked && (<button type="button" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Drag to reorder"], ["Drag to reorder"])))} onPointerDown={handleDragStart} className="absolute right-9 top-3 z-20 flex cursor-grab touch-none items-center justify-center text-foreground/40 transition-colors hover:text-foreground/80 active:cursor-grabbing" style={{ touchAction: "none" }}>
                  <lu_1.LuGripVertical className="h-5 w-5"/>
                </button>)
            : !isReadOnly && (<div onPointerDown={!isExpanded && !isReadOnly ? handleDragStart : undefined} style={{ touchAction: "none" }}/>)}
        </framer_motion_1.Reorder.Item>
        {/* List Delete Action Animation */}

        {!isReadOnly && item.checked ? (<div className="h-[1.5rem] w-3"/>) : null}

        {!isReadOnly && item.checked ? (<div className="inset-0 z-0 rounded-full bg-card border-border border dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)] dark:bg-[#161716]/50">
            <button className="inline-flex h-10 items-center justify-center space-nowrap rounded-md px-3 text-sm font-medium  transition-colors duration-150  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" onClick={function () { return onRemoveItem(item.id); }}>
              <lu_1.LuTrash className="h-4 w-4 text-red-400 transition-colors duration-150 fill-red-400/60 "/>
            </button>
          </div>) : null}
      </div>
    </div>);
}
function SortableList(_a) {
    var items = _a.items, onRemoveItem = _a.onRemoveItem, onToggleItem = _a.onToggleItem, onReorder = _a.onReorder, renderItem = _a.renderItem, _b = _a.isReadOnly, isReadOnly = _b === void 0 ? false : _b;
    if (items && Array.isArray(items) && items.length > 0) {
        return (<framer_motion_1.LayoutGroup>
        <framer_motion_1.Reorder.Group axis="y" values={items} 
        // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
        onReorder={isReadOnly ? function () { } : onReorder} className="flex flex-col">
          {items === null || items === void 0 ? void 0 : items.map(function (item, index) {
                return renderItem({
                    item: item,
                    items: items,
                    order: index,
                    onToggleItem: onToggleItem,
                    onRemoveItem: onRemoveItem
                });
            })}
        </framer_motion_1.Reorder.Group>
      </framer_motion_1.LayoutGroup>);
    }
    else {
        return <Empty_1.default />;
    }
}
SortableList.displayName = "SortableList";
function formatQuantityValue(value) {
    return Number.isInteger(value)
        ? value
        : value.toLocaleString(undefined, { maximumFractionDigits: 4 });
}
function getPercent(value, target) {
    if (target > 0)
        return Math.min(100, (value / target) * 100);
    return value > 0 ? 100 : 0;
}
function QuantityProgressStrip(_a) {
    var progress = _a.progress;
    var t = (0, macro_1.useLingui)().t;
    var complete = progress.complete, target = progress.target, onAddQuantity = progress.onAddQuantity, onOpenConfigTable = progress.onOpenConfigTable;
    var completePercent = getPercent(complete, target);
    var isOverTarget = target > 0 && complete > target;
    var unassigned = Math.max(0, target - complete);
    var indicator = (<div className="flex items-center gap-2.5 sm:gap-2 whitespace-nowrap rounded-full border border-border/40 bg-transparent px-3 py-1 shadow-none backdrop-blur-sm sm:px-2 sm:py-0.5">
      {/* Finished group */}
      {onAddQuantity ? (<button type="button" className="flex items-center gap-1 sm:gap-0.5 rounded transition-opacity duration-150 hover:opacity-70 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Add process completion"], ["Add process completion"])))} onClick={function (event) {
                event.stopPropagation();
                onAddQuantity();
            }}>
          <lu_1.LuCircleCheckBig className="h-4 w-4 sm:h-3.5 sm:w-3.5 shrink-0 text-emerald-600" strokeWidth={2.5}/>
          <span className="text-base sm:text-sm font-medium tabular-nums leading-none tracking-tight text-emerald-600">
            {formatQuantityValue(complete)}
          </span>
        </button>) : (<span className="text-base sm:text-sm font-medium tabular-nums leading-none tracking-tight text-emerald-600">
          {formatQuantityValue(complete)}
        </span>)}
      {/* Unassigned */}
      <span className="flex items-center gap-1 sm:gap-0.5">
        <lu_1.LuCircleDashed className="h-4 w-4 sm:h-3.5 sm:w-3.5 shrink-0 text-muted-foreground" strokeWidth={2.5}/>
        <span className="text-base sm:text-sm font-medium tabular-nums leading-none tracking-tight text-muted-foreground">
          {formatQuantityValue(unassigned)}
        </span>
      </span>
      {/* Target + config summary */}
      {onOpenConfigTable ? (<button type="button" className="flex items-center gap-1 sm:gap-0.5 rounded transition-opacity duration-150 hover:opacity-70 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["View configuration quantities"], ["View configuration quantities"])))} onClick={function (event) {
                event.stopPropagation();
                onOpenConfigTable();
            }}>
          <lu_1.LuTable className="h-3.5 w-3.5 sm:h-3 sm:w-3 shrink-0 text-foreground/80" strokeWidth={2.5}/>
          <span className="text-base sm:text-sm font-medium tabular-nums leading-none tracking-tight text-foreground">
            {formatQuantityValue(target)}
          </span>
        </button>) : (<span className="text-base sm:text-sm font-medium tabular-nums leading-none tracking-tight text-foreground">
          {formatQuantityValue(target)}
        </span>)}
    </div>);
    var progressLine = (<div className="relative h-0.5 w-full overflow-hidden bg-muted-foreground/35">
      <div className={(0, react_1.cn)("absolute inset-y-0 left-0 transition-[width] duration-300 ease-out", isOverTarget ? "bg-amber-500/90" : "bg-emerald-500")} style={{ width: "".concat(completePercent, "%") }}/>
    </div>);
    return (<div className="w-full min-w-0 shrink-0" role="img" aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Finished ", " of ", " units, ", " unassigned"], ["Finished ", " of ", " units, ", " unassigned"])), complete, target, unassigned)}>
      <div className="relative h-9 sm:h-7 w-full">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          {progressLine}
        </div>
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          {indicator}
        </div>
      </div>
    </div>);
}
function getParallelizedOrder(index, item, items) {
    if ((item === null || item === void 0 ? void 0 : item.order) !== "With Previous")
        return index + 1;
    for (var i = index - 1; i >= 0; i--) {
        if (items[i].order !== "With Previous") {
            return i + 1;
        }
    }
    return 1;
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
