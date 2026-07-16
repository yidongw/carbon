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
var core_1 = require("@dnd-kit/core");
var sortable_1 = require("@dnd-kit/sortable");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var ColumnCard_1 = require("./components/ColumnCard");
var ItemCard_1 = require("./components/ItemCard");
var KanbanContext_1 = require("./context/KanbanContext");
var utils_1 = require("./utils");
var COLUMN_ORDER_KEY = "kanban-column-order";
var Kanban = function (_a) {
    var columns = _a.columns, initialItems = _a.items, progressByItemId = _a.progressByItemId, tags = _a.tags, displaySettings = __rest(_a, ["columns", "items", "progressByItemId", "tags"]);
    var submit = (0, react_router_1.useSubmit)();
    var _b = (0, react_2.useState)(null), selectedGroup = _b[0], setSelectedGroup = _b[1];
    var _c = (0, react_2.useState)(function () {
        // Get stored column order from localStorage
        var storedOrder = localStorage.getItem(COLUMN_ORDER_KEY);
        if (storedOrder) {
            var parsedOrder = JSON.parse(storedOrder);
            // Add any new columns that aren't in stored order
            var newOrder_1 = __spreadArray([], parsedOrder, true);
            columns.forEach(function (col) {
                if (!newOrder_1.includes(col.id)) {
                    newOrder_1.push(col.id);
                }
            });
            return newOrder_1;
        }
        return columns.map(function (col) { return col.id; });
    }), columnOrder = _c[0], setColumnOrder = _c[1];
    // Update localStorage when column order changes
    (0, react_2.useEffect)(function () {
        localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(columnOrder));
    }, [columnOrder]);
    var itemsById = new Map(initialItems.map(function (item) { return [item.id, item]; }));
    var pendingItems = usePendingItems();
    // merge pending items and existing items
    for (var _i = 0, pendingItems_1 = pendingItems; _i < pendingItems_1.length; _i++) {
        var pendingItem = pendingItems_1[_i];
        var item = itemsById.get(pendingItem.id);
        if (item) {
            itemsById.set(pendingItem.id, __assign(__assign({}, item), pendingItem));
        }
    }
    var items = Array.from(itemsById.values()).sort(function (a, b) { return a.priority - b.priority; });
    var pickedUpItemColumn = (0, react_2.useRef)(null);
    var _d = (0, react_2.useState)(null), activeColumn = _d[0], setActiveColumn = _d[1];
    var _e = (0, react_2.useState)(null), activeItem = _e[0], setActiveItem = _e[1];
    var sensors = (0, core_1.useSensors)((0, core_1.useSensor)(core_1.MouseSensor), (0, core_1.useSensor)(core_1.TouchSensor), (0, core_1.useSensor)(core_1.KeyboardSensor, {
        coordinateGetter: utils_1.coordinateGetter
    }));
    function getDraggingItemData(itemId, columnId) {
        var itemsInColumn = items.filter(function (item) { return item.columnId === columnId; });
        var itemPosition = itemsInColumn.findIndex(function (item) { return item.id === itemId; });
        var column = columns.find(function (col) { return col.id === columnId; });
        return {
            itemsInColumn: itemsInColumn,
            itemPosition: itemPosition,
            column: column
        };
    }
    var announcements = {
        onDragStart: function (_a) {
            var _b, _c;
            var active = _a.active;
            if (!(0, utils_1.hasDraggableData)(active))
                return;
            if (((_b = active.data.current) === null || _b === void 0 ? void 0 : _b.type) === "column") {
                var startIndex = columnOrder.findIndex(function (id) { return id === active.id; });
                var startColumn = columns.find(function (col) { return col.id === active.id; });
                return "Picked up Column ".concat(startColumn === null || startColumn === void 0 ? void 0 : startColumn.title, " at position: ").concat(startIndex + 1, " of ").concat(columnOrder.length);
            }
            else if (((_c = active.data.current) === null || _c === void 0 ? void 0 : _c.type) === "item") {
                pickedUpItemColumn.current = active.data.current.item.columnId;
                var _d = getDraggingItemData(active.id, pickedUpItemColumn.current), itemsInColumn = _d.itemsInColumn, itemPosition = _d.itemPosition, column = _d.column;
                return "Picked up Item ".concat(active.data.current.item.title, " at position: ").concat(itemPosition + 1, " of ").concat(itemsInColumn.length, " in column ").concat(column === null || column === void 0 ? void 0 : column.title);
            }
        },
        onDragOver: function (_a) {
            var _b, _c, _d, _e;
            var active = _a.active, over = _a.over;
            if (!(0, utils_1.hasDraggableData)(active) || !(0, utils_1.hasDraggableData)(over))
                return;
            if (((_b = active.data.current) === null || _b === void 0 ? void 0 : _b.type) === "column" &&
                ((_c = over.data.current) === null || _c === void 0 ? void 0 : _c.type) === "column") {
                var overIndex = columnOrder.findIndex(function (id) { return id === over.id; });
                return "Column ".concat(active.data.current.column.title, " was moved over ").concat(over.data.current.column.title, " at position ").concat(overIndex + 1, " of ").concat(columnOrder.length);
            }
            else if (((_d = active.data.current) === null || _d === void 0 ? void 0 : _d.type) === "item" &&
                ((_e = over.data.current) === null || _e === void 0 ? void 0 : _e.type) === "item") {
                var _f = getDraggingItemData(over.id, over.data.current.item.columnId), itemsInColumn = _f.itemsInColumn, itemPosition = _f.itemPosition, column = _f.column;
                if (over.data.current.item.columnId !== pickedUpItemColumn.current) {
                    return "Item ".concat(active.data.current.item.title, " was moved over column ").concat(column === null || column === void 0 ? void 0 : column.title, " in position ").concat(itemPosition + 1, " of ").concat(itemsInColumn.length);
                }
                return "Item was moved over position ".concat(itemPosition + 1, " of ").concat(itemsInColumn.length, " in column ").concat(column === null || column === void 0 ? void 0 : column.title);
            }
        },
        onDragEnd: function (_a) {
            var _b, _c, _d, _e;
            var active = _a.active, over = _a.over;
            if (!(0, utils_1.hasDraggableData)(active) || !(0, utils_1.hasDraggableData)(over)) {
                pickedUpItemColumn.current = null;
                return;
            }
            if (((_b = active.data.current) === null || _b === void 0 ? void 0 : _b.type) === "column" &&
                ((_c = over.data.current) === null || _c === void 0 ? void 0 : _c.type) === "column") {
                var overColumnPosition = columnOrder.findIndex(function (id) { return id === over.id; });
                return "Column ".concat(active.data.current.column.title, " was dropped into position ").concat(overColumnPosition + 1, " of ").concat(columnOrder.length);
            }
            else if (((_d = active.data.current) === null || _d === void 0 ? void 0 : _d.type) === "item" &&
                ((_e = over.data.current) === null || _e === void 0 ? void 0 : _e.type) === "item") {
                var _f = getDraggingItemData(over.id, over.data.current.item.columnId), itemsInColumn = _f.itemsInColumn, itemPosition = _f.itemPosition, column = _f.column;
                if (over.data.current.item.columnId !== pickedUpItemColumn.current) {
                    return "Item was dropped into column ".concat(column === null || column === void 0 ? void 0 : column.title, " in position ").concat(itemPosition + 1, " of ").concat(itemsInColumn.length);
                }
                return "Item was dropped into position ".concat(itemPosition + 1, " of ").concat(itemsInColumn.length, " in column ").concat(column === null || column === void 0 ? void 0 : column.title);
            }
            pickedUpItemColumn.current = null;
        },
        onDragCancel: function (_a) {
            var _b;
            var active = _a.active;
            pickedUpItemColumn.current = null;
            if (!(0, utils_1.hasDraggableData)(active))
                return;
            return "Dragging ".concat((_b = active.data.current) === null || _b === void 0 ? void 0 : _b.type, " cancelled.");
        }
    };
    return (<KanbanContext_1.KanbanProvider displaySettings={displaySettings} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} tags={tags}>
      <core_1.DndContext accessibility={{
            announcements: announcements
        }} sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <ColumnCard_1.BoardContainer>
          <sortable_1.SortableContext items={columnOrder}>
            {columnOrder.map(function (colId) {
            var col = columns.find(function (c) { return c.id === colId; });
            if (!col)
                return null;
            return (<ColumnCard_1.ColumnCard key={col.id} column={col} items={items.filter(function (item) { return item.columnId === col.id; })} progressByItemId={progressByItemId}/>);
        })}
          </sortable_1.SortableContext>
        </ColumnCard_1.BoardContainer>

        <react_1.ClientOnly fallback={null}>
          {function () {
            var _a, _b, _c, _d;
            return (0, react_dom_1.createPortal)(<core_1.DragOverlay>
                {activeColumn && (<ColumnCard_1.ColumnCard isOverlay column={activeColumn} items={items.filter(function (item) { return item.columnId === activeColumn.id; })} progressByItemId={progressByItemId}/>)}
                {activeItem && (<ItemCard_1.ItemCard 
                // @ts-expect-error TS2322 - TODO: fix type
                item={__assign(__assign({}, activeItem), { status: ((_a = progressByItemId[activeItem.id]) === null || _a === void 0 ? void 0 : _a.active)
                            ? "In Progress"
                            : activeItem.status, employeeIds: ((_b = progressByItemId[activeItem.id]) === null || _b === void 0 ? void 0 : _b.employees)
                            ? Array.from(progressByItemId[activeItem.id].employees)
                            : undefined, progress: (_d = (_c = progressByItemId[activeItem.id]) === null || _c === void 0 ? void 0 : _c.progress) !== null && _d !== void 0 ? _d : 0 })} isOverlay progressByItemId={progressByItemId}/>)}
              </core_1.DragOverlay>, document.body);
        }}
        </react_1.ClientOnly>
      </core_1.DndContext>
    </KanbanContext_1.KanbanProvider>);
    function onDragStart(event) {
        if (!(0, utils_1.hasDraggableData)(event.active))
            return;
        var data = event.active.data.current;
        if ((data === null || data === void 0 ? void 0 : data.type) === "column") {
            setActiveColumn(data.column);
            return;
        }
        if ((data === null || data === void 0 ? void 0 : data.type) === "item") {
            setActiveItem(data.item);
            return;
        }
    }
    function onDragEnd(event) {
        setActiveColumn(null);
        setActiveItem(null);
        var active = event.active, over = event.over;
        if (!over)
            return;
        var activeId = active.id;
        var overId = over.id;
        if (!(0, utils_1.hasDraggableData)(active))
            return;
        var activeData = active.data.current;
        if (activeId === overId)
            return;
        var isActiveAColumn = (activeData === null || activeData === void 0 ? void 0 : activeData.type) === "column";
        if (!isActiveAColumn)
            return;
        setColumnOrder(function (prevOrder) {
            var activeColumnIndex = prevOrder.findIndex(function (id) { return id === activeId; });
            var overColumnIndex = prevOrder.findIndex(function (id) { return id === overId; });
            return (0, sortable_1.arrayMove)(prevOrder, activeColumnIndex, overColumnIndex);
        });
    }
    function onDragOver(event) {
        var _a, _b, _c, _d;
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
        var overColumn = (overData === null || overData === void 0 ? void 0 : overData.type) === "item"
            ? columns.find(function (col) { return col.id === overData.item.columnId; })
            : overData === null || overData === void 0 ? void 0 : overData.column;
        var isActiveAnItem = (activeData === null || activeData === void 0 ? void 0 : activeData.type) === "item";
        var isOverAnItem = (overData === null || overData === void 0 ? void 0 : overData.type) === "item";
        var activeItem = itemsById.get(activeId.toString());
        var overItem = itemsById.get(overId.toString());
        if (!isActiveAnItem)
            return;
        // only allow drop if column type array includes item's column type
        if (!(overColumn === null || overColumn === void 0 ? void 0 : overColumn.type.includes(activeData === null || activeData === void 0 ? void 0 : activeData.item.columnType)))
            return;
        // Im dropping a Item over another Item
        if (isActiveAnItem && isOverAnItem && activeItem && overItem) {
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
            if (activeItem.columnId !== overItem.columnId) {
                submit({
                    id: activeItem.id,
                    columnId: overItem.columnId,
                    priority: newPriority
                }, {
                    method: "post",
                    action: path_1.path.to.scheduleOperationUpdate,
                    navigate: false,
                    fetcherKey: "item:".concat(activeItem.id)
                });
                return;
            }
            if (activeItem && overItem) {
                submit({
                    id: activeItem.id,
                    columnId: activeItem.columnId,
                    priority: newPriority
                }, {
                    method: "post",
                    action: path_1.path.to.scheduleOperationUpdate,
                    navigate: false,
                    fetcherKey: "item:".concat(activeItem.id)
                });
            }
            return;
        }
        var isOverAColumn = (overData === null || overData === void 0 ? void 0 : overData.type) === "column";
        // Im dropping a Item over a column
        if (isActiveAnItem && isOverAColumn) {
            var activeItem_1 = itemsById.get(activeId.toString());
            var columnId_1 = overId;
            if (activeItem_1) {
                var firstItemInColumn = items.find(function (item) { return item.columnId === columnId_1; });
                var priorityBefore = 0;
                var priorityAfter = (_d = firstItemInColumn === null || firstItemInColumn === void 0 ? void 0 : firstItemInColumn.priority) !== null && _d !== void 0 ? _d : 1;
                var newPriority = (priorityBefore + priorityAfter) / 2;
                submit({
                    id: activeItem_1.id,
                    columnId: columnId_1,
                    priority: newPriority
                }, {
                    method: "post",
                    action: path_1.path.to.scheduleOperationUpdate,
                    navigate: false,
                    fetcherKey: "item:".concat(activeItem_1.id)
                });
            }
        }
    }
};
function usePendingItems() {
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        return fetcher.formAction === path_1.path.to.scheduleOperationUpdate;
    })
        .map(function (fetcher) {
        var columnId = String(fetcher.formData.get("columnId"));
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
exports.default = Kanban;
