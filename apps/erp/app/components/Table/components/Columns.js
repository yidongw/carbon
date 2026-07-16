"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var lu_1 = require("react-icons/lu");
var Columns = function (_a) {
    var columns = _a.columns, columnOrder = _a.columnOrder, featuredColumns = _a.featuredColumns, onPinnedReorder = _a.onPinnedReorder, withSelectableRows = _a.withSelectableRows, setColumnOrder = _a.setColumnOrder, setFeaturedColumns = _a.setFeaturedColumns;
    // Only pass toggleable IDs to Framer Motion so its position tracking is not
    // thrown off by non-rendered system columns (Select, Actions, Expand).
    var draggableOrder = columnOrder.filter(function (id) {
        var col = columns.find(function (c) { return c.id === id; });
        return col && isColumnToggable(col);
    });
    var handleReorder = function (newToggleableOrder) {
        var pinnedIds = new Set(columns
            .filter(function (col) { return isColumnToggable(col) && col.getIsPinned(); })
            .map(function (col) { return col.id; }));
        // Pinned columns stay first; non-pinned columns are freely reorderable —
        // no forced featured→regular grouping during drag.
        var pinned = newToggleableOrder.filter(function (id) { return pinnedIds.has(id); });
        var nonPinned = newToggleableOrder.filter(function (id) { return !pinnedIds.has(id); });
        var corrected = __spreadArray(__spreadArray([], pinned, true), nonPinned, true);
        // A featured column keeps featured status only if it stays within the
        // first F non-pinned positions (F = current non-pinned featured count).
        // Dragging it past that zone drops it from the featured set.
        var nonPinnedFeatured = new Set(__spreadArray([], featuredColumns, true).filter(function (id) { return !pinnedIds.has(id); }));
        var F = nonPinnedFeatured.size;
        var newNonPinnedFeatured = new Set(nonPinned.slice(0, F).filter(function (id) { return nonPinnedFeatured.has(id); }));
        if (newNonPinnedFeatured.size !== nonPinnedFeatured.size) {
            var pinnedFeatured = __spreadArray([], featuredColumns, true).filter(function (id) {
                return pinnedIds.has(id);
            });
            setFeaturedColumns(new Set(__spreadArray(__spreadArray([], pinnedFeatured, true), newNonPinnedFeatured, true)));
        }
        setColumnOrder(mergeWithNonToggleable(corrected, columnOrder, columns));
        var newLeft = corrected.filter(function (id) { return pinnedIds.has(id); });
        if (newLeft.length > 0)
            onPinnedReorder(newLeft);
    };
    var _b = (0, macro_1.useLingui)(), t = _b.t, i18n = _b.i18n;
    var translate = function (value) { return i18n._(value); };
    return (<react_1.Drawer>
      <react_1.DrawerTrigger>
        <react_1.Tooltip>
          <react_1.TooltipTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Columns"], ["Columns"])))} title={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Columns"], ["Columns"])))} variant="ghost" icon={<lu_1.LuColumns2 />}/>
          </react_1.TooltipTrigger>
          <react_1.TooltipContent>
            <p>
              <macro_1.Trans>Column visibility and order</macro_1.Trans>
            </p>
          </react_1.TooltipContent>
        </react_1.Tooltip>
      </react_1.DrawerTrigger>
      <react_1.DrawerContent>
        <react_1.DrawerHeader>
          <react_1.DrawerTitle>
            <macro_1.Trans>Edit column visibility</macro_1.Trans>
          </react_1.DrawerTitle>
          <react_1.DrawerDescription>
            <macro_1.Trans>Hide, pin and reorder columns</macro_1.Trans>
          </react_1.DrawerDescription>
        </react_1.DrawerHeader>
        <react_1.DrawerBody>
          <framer_motion_1.Reorder.Group axis="y" values={draggableOrder} onReorder={handleReorder} className="w-full space-y-2">
            {/* Render in draggableOrder sequence so Framer Motion's values and
            children are always in the same order — getAllLeafColumns() order
            can diverge from columnOrder after pinning changes. */}
            {draggableOrder.map(function (columnId) {
            var column = columns.find(function (c) { return c.id === columnId; });
            if (!column)
                return null;
            var isPinned = !!column.getIsPinned();
            var isFeatured = featuredColumns.has(column.id) && !isPinned;
            var currentPinnedIds = new Set(columns
                .filter(function (c) { return isColumnToggable(c) && c.getIsPinned(); })
                .map(function (c) { return c.id; }));
            var applyNewOrder = function (newPinnedIds, newFeaturedIds) {
                var corrected = reorderByGroups(draggableOrder, newPinnedIds, newFeaturedIds);
                setColumnOrder(mergeWithNonToggleable(corrected, columnOrder, columns));
            };
            var togglePin = function () {
                if (isPinned) {
                    var newPinnedIds = new Set(__spreadArray([], currentPinnedIds, true).filter(function (id) { return id !== column.id; }));
                    column.pin(false);
                    applyNewOrder(newPinnedIds, featuredColumns);
                }
                else {
                    var newFeatured = isFeatured
                        ? new Set(__spreadArray([], featuredColumns, true).filter(function (id) { return id !== column.id; }))
                        : featuredColumns;
                    if (isFeatured)
                        setFeaturedColumns(newFeatured);
                    var newPinnedIds = new Set(__spreadArray(__spreadArray([], currentPinnedIds, true), [
                        column.id
                    ], false));
                    column.pin("left");
                    if (!column.getIsVisible())
                        column.toggleVisibility(true);
                    applyNewOrder(newPinnedIds, newFeatured);
                }
            };
            var toggleFeatured = function () {
                if (isFeatured) {
                    var newFeatured = new Set(__spreadArray([], featuredColumns, true).filter(function (id) { return id !== column.id; }));
                    setFeaturedColumns(newFeatured);
                    applyNewOrder(currentPinnedIds, newFeatured);
                }
                else {
                    var newFeatured = new Set(__spreadArray(__spreadArray([], featuredColumns, true), [column.id], false));
                    var newPinnedIds = isPinned
                        ? new Set(__spreadArray([], currentPinnedIds, true).filter(function (id) { return id !== column.id; }))
                        : currentPinnedIds;
                    if (isPinned)
                        column.pin(false);
                    setFeaturedColumns(newFeatured);
                    applyNewOrder(newPinnedIds, newFeatured);
                }
            };
            return (<ColumnRow key={column.id} column={column} isPinned={isPinned} isFeatured={isFeatured} translate={translate} onTogglePin={togglePin} onToggleFeatured={toggleFeatured} onToggleVisibility={function () { return column.toggleVisibility(); }}/>);
        })}
          </framer_motion_1.Reorder.Group>
        </react_1.DrawerBody>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
function ColumnRow(_a) {
    var _b;
    var column = _a.column, isPinned = _a.isPinned, isFeatured = _a.isFeatured, translate = _a.translate, onTogglePin = _a.onTogglePin, onToggleFeatured = _a.onToggleFeatured, onToggleVisibility = _a.onToggleVisibility;
    var dragControls = (0, framer_motion_1.useDragControls)();
    var t = (0, macro_1.useLingui)().t;
    return (<framer_motion_1.Reorder.Item value={column.id} dragControls={dragControls} dragListener={false} className="w-full rounded-lg">
      <react_1.HStack className="w-full">
        <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Drag handle"], ["Drag handle"])))} icon={<lu_1.LuGripVertical />} variant="ghost" className="cursor-grab active:cursor-grabbing" onPointerDown={function (e) { return dragControls.start(e); }} style={{ touchAction: "none" }}/>
        <span className="text-sm flex-grow flex items-center gap-2">
          {(_b = column.columnDef.meta) === null || _b === void 0 ? void 0 : _b.icon}
          <>{translate(column.columnDef.header)}</>
        </span>

        <react_1.IconButton aria-label={isPinned ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Unpin column"], ["Unpin column"]))) : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Pin column"], ["Pin column"])))} icon={isPinned ? <lu_1.LuPin className="text-primary"/> : <lu_1.LuPinOff />} onClick={onTogglePin} variant="ghost"/>

        <react_1.IconButton aria-label={isFeatured ? t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Remove from card right"], ["Remove from card right"]))) : t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Show on card right"], ["Show on card right"])))} icon={isFeatured ? <lu_1.LuStar className="text-primary"/> : <lu_1.LuStarOff />} onClick={onToggleFeatured} variant="ghost" className="md:hidden"/>

        <react_1.IconButton aria-label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Toggle visibility"], ["Toggle visibility"])))} icon={column.getIsVisible() ? <lu_1.LuEye /> : <lu_1.LuEyeOff />} onClick={onToggleVisibility} variant="ghost" disabled={isPinned}/>
      </react_1.HStack>
    </framer_motion_1.Reorder.Item>);
}
// Groups toggleable IDs: pinned → featured → regular.
function reorderByGroups(toggleableOrder, pinnedIds, featuredIds) {
    var pinned = toggleableOrder.filter(function (id) { return pinnedIds.has(id); });
    var featured = toggleableOrder.filter(function (id) { return featuredIds.has(id) && !pinnedIds.has(id); });
    var regular = toggleableOrder.filter(function (id) { return !pinnedIds.has(id) && !featuredIds.has(id); });
    return __spreadArray(__spreadArray(__spreadArray([], pinned, true), featured, true), regular, true);
}
// Merges a corrected toggleable order back into the full columnOrder,
// keeping non-toggleable system columns (Select, Actions, Expand) in place.
function mergeWithNonToggleable(newToggleableOrder, currentColumnOrder, columns) {
    var idx = 0;
    return currentColumnOrder.map(function (id) {
        var _a;
        var col = columns.find(function (c) { return c.id === id; });
        if (col && isColumnToggable(col)) {
            return (_a = newToggleableOrder[idx++]) !== null && _a !== void 0 ? _a : id;
        }
        return id;
    });
}
function isColumnToggable(column) {
    return (column.columnDef.id !== "select" &&
        typeof column.columnDef.header === "string" &&
        column.columnDef.header !== "");
}
exports.default = Columns;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
