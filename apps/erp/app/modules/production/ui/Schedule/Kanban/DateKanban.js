"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.DateKanban = void 0;
var react_1 = require("@carbon/react");
var core_1 = require("@dnd-kit/core");
var sortable_1 = require("@dnd-kit/sortable");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var ColumnCard_1 = require("./components/ColumnCard");
var JobCard_1 = require("./components/JobCard");
var KanbanContext_1 = require("./context/KanbanContext");
var utils_1 = require("./utils");
function usePendingItems() {
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        return fetcher.formAction === path_1.path.to.scheduleDatesUpdate;
    })
        .map(function (fetcher) {
        var optimisticColumnId = fetcher.formData.get("optimisticColumnId");
        var columnId = optimisticColumnId
            ? String(optimisticColumnId)
            : String(fetcher.formData.get("columnId"));
        var id = String(fetcher.formData.get("id"));
        var priority = Number(fetcher.formData.get("priority"));
        var item = {
            id: id,
            priority: priority,
            columnId: columnId
        };
        return item;
    });
}
var DateKanban = function (_a) {
    var columns = _a.columns, initialItems = _a.items, progressByItemId = _a.progressByItemId, tags = _a.tags, displaySettings = __rest(_a, ["columns", "items", "progressByItemId", "tags"]);
    var submit = (0, react_router_1.useSubmit)();
    var _b = (0, react_2.useState)(null), selectedGroup = _b[0], setSelectedGroup = _b[1];
    // For date-based kanban, always use the column order from props (don't persist)
    var _c = (0, react_2.useState)(columns.map(function (col) { return col.id; })), columnOrder = _c[0], setColumnOrder = _c[1];
    // Update column order when columns change (e.g., navigating to a different week/month)
    (0, react_2.useEffect)(function () {
        setColumnOrder(columns.map(function (col) { return col.id; }));
    }, [columns]);
    var itemsById = new Map(initialItems.map(function (item) { return [item.id, item]; }));
    var pendingItems = usePendingItems();
    // Merge pending items and existing items for optimistic updates
    for (var _i = 0, pendingItems_1 = pendingItems; _i < pendingItems_1.length; _i++) {
        var pendingItem = pendingItems_1[_i];
        var item = itemsById.get(pendingItem.id);
        if (item) {
            itemsById.set(pendingItem.id, __assign(__assign({}, item), pendingItem));
        }
    }
    var items = Array.from(itemsById.values()).sort(function (a, b) { return a.priority - b.priority; });
    var _d = (0, react_2.useState)(null), activeItem = _d[0], setActiveItem = _d[1];
    var sensors = (0, core_1.useSensors)((0, core_1.useSensor)(core_1.PointerSensor), (0, core_1.useSensor)(core_1.KeyboardSensor, {
        coordinateGetter: sortable_1.sortableKeyboardCoordinates
    }));
    function onDragStart(event) {
        if (!(0, utils_1.hasDraggableData)(event.active))
            return;
        var data = event.active.data.current;
        // Only handle item dragging, not column dragging (dates are fixed)
        if ((data === null || data === void 0 ? void 0 : data.type) === "item") {
            setActiveItem(data.item);
            return;
        }
    }
    function onDragEnd() {
        setActiveItem(null);
    }
    function onDragOver(event) {
        var _a, _b, _c;
        var active = event.active, over = event.over;
        if (!over)
            return;
        var activeId = active.id;
        var overId = over.id;
        if (activeId === overId)
            return;
        if (!(0, utils_1.hasDraggableData)(active) || !(0, utils_1.hasDraggableData)(over))
            return;
        var activeData = active.data.current;
        var overData = over.data.current;
        var isActiveAnItem = (activeData === null || activeData === void 0 ? void 0 : activeData.type) === "item";
        var isOverAnItem = (overData === null || overData === void 0 ? void 0 : overData.type) === "item";
        if (!isActiveAnItem)
            return;
        var activeItem = itemsById.get(activeId.toString());
        var overItem = itemsById.get(overId.toString());
        // Dropping a job over another job
        if (isActiveAnItem && isOverAnItem && activeItem && overItem) {
            // Calculate priority
            var priorityBefore_1 = 0;
            var priorityAfter = 0;
            if (activeItem.priority > overItem.priority ||
                activeItem.columnId !== overItem.columnId) {
                priorityAfter = overItem.priority;
                for (var i = items.length - 1; i >= 0; i--) {
                    var item = items[i];
                    if (item.columnId === overItem.columnId &&
                        item.priority < priorityAfter) {
                        priorityBefore_1 = (_a = item.priority) !== null && _a !== void 0 ? _a : 0;
                        break;
                    }
                }
            }
            else {
                priorityBefore_1 = overItem.priority;
                priorityAfter =
                    (_c = (_b = items.find(function (item) {
                        return item.columnId === overItem.columnId &&
                            item.priority > priorityBefore_1;
                    })) === null || _b === void 0 ? void 0 : _b.priority) !== null && _c !== void 0 ? _c : priorityBefore_1 + 1;
            }
            var newPriority = (priorityBefore_1 + priorityAfter) / 2;
            // Submit update when moving to a different column (date)
            if (activeItem.columnId !== overItem.columnId) {
                submit({
                    id: activeItem.id,
                    columnId: overItem.columnId,
                    priority: newPriority
                }, {
                    method: "post",
                    action: path_1.path.to.scheduleDatesUpdate,
                    navigate: false,
                    fetcherKey: "job:".concat(activeItem.id)
                });
                return;
            }
            // Update priority within the same column
            if (activeItem && overItem) {
                submit({
                    id: activeItem.id,
                    columnId: activeItem.columnId,
                    priority: newPriority
                }, {
                    method: "post",
                    action: path_1.path.to.scheduleDatesUpdate,
                    navigate: false,
                    fetcherKey: "job:".concat(activeItem.id)
                });
            }
        }
        var isOverAColumn = (overData === null || overData === void 0 ? void 0 : overData.type) === "column";
        // Dropping a job over a column
        if (isActiveAnItem && isOverAColumn && activeItem) {
            var newColumnId = overId;
            if (activeItem.columnId !== newColumnId) {
                submit({
                    id: activeItem.id,
                    columnId: newColumnId,
                    priority: activeItem.priority
                }, {
                    method: "post",
                    action: path_1.path.to.scheduleDatesUpdate,
                    navigate: false,
                    fetcherKey: "job:".concat(activeItem.id)
                });
            }
        }
    }
    var columnsMap = new Map(columns.map(function (col) { return [col.id, col]; }));
    var isInitialMount = (0, react_2.useRef)(true);
    (0, react_2.useEffect)(function () {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
    }, []);
    return (<KanbanContext_1.KanbanProvider displaySettings={displaySettings} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} tags={tags} columnIds={columns.map(function (col) { return col.id; })}>
      <core_1.DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <ColumnCard_1.BoardContainer>
          {columnOrder.map(function (colId) {
            var col = columnsMap.get(colId);
            if (!col)
                return null;
            return (<ColumnCard_1.ColumnCard key={col.id} column={col} items={items.filter(function (item) { return item.columnId === col.id; })} progressByItemId={progressByItemId} isDateView={true} disableColumnDrag={true} CardComponent={JobCard_1.JobCard}/>);
        })}
        </ColumnCard_1.BoardContainer>

        <react_1.ClientOnly fallback={null}>
          {function () {
            var _a, _b, _c, _d;
            return (0, react_dom_1.createPortal)(<core_1.DragOverlay>
                {activeItem && (<JobCard_1.JobCard item={__assign(__assign({}, activeItem), { status: ((_a = progressByItemId[activeItem.id]) === null || _a === void 0 ? void 0 : _a.active)
                            ? "In Progress"
                            : activeItem.status, employeeIds: ((_b = progressByItemId[activeItem.id]) === null || _b === void 0 ? void 0 : _b.employees)
                            ? Array.from(progressByItemId[activeItem.id].employees)
                            : undefined, progress: (_d = (_c = progressByItemId[activeItem.id]) === null || _c === void 0 ? void 0 : _c.progress) !== null && _d !== void 0 ? _d : 0 })} isOverlay progressByItemId={progressByItemId}/>)}
              </core_1.DragOverlay>, document.body);
        }}
        </react_1.ClientOnly>
      </core_1.DndContext>
    </KanbanContext_1.KanbanProvider>);
};
exports.DateKanban = DateKanban;
