"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var ColumnCard_1 = require("./components/ColumnCard");
var utils_1 = require("./utils");
var COLUMN_ORDER_KEY = "kanban-column-order";
var Kanban = function (_a) {
    var columns = _a.columns, items = _a.items, progressByItemId = _a.progressByItemId, displaySettings = __rest(_a, ["columns", "items", "progressByItemId"]);
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(function () {
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
    }), columnOrder = _b[0], setColumnOrder = _b[1];
    // Update localStorage when column order changes
    (0, react_2.useEffect)(function () {
        localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(columnOrder));
    }, [columnOrder]);
    var _c = (0, react_2.useState)(null), activeColumn = _c[0], setActiveColumn = _c[1];
    var sensors = (0, core_1.useSensors)((0, core_1.useSensor)(core_1.MouseSensor), (0, core_1.useSensor)(core_1.TouchSensor), (0, core_1.useSensor)(core_1.KeyboardSensor, {
        coordinateGetter: utils_1.coordinateGetter
    }));
    var announcements = {
        onDragStart: function (_a) {
            var _b;
            var active = _a.active;
            if (!(0, utils_1.hasDraggableData)(active))
                return;
            if (((_b = active.data.current) === null || _b === void 0 ? void 0 : _b.type) === "column") {
                var startIndex = columnOrder.findIndex(function (id) { return id === active.id; });
                var startColumn = columns.find(function (col) { return col.id === active.id; });
                return t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Picked up Column ", " at position: ", " of ", ""], ["Picked up Column ", " at position: ", " of ", ""])), startColumn === null || startColumn === void 0 ? void 0 : startColumn.title, startIndex + 1, columnOrder.length);
            }
        },
        onDragOver: function (_a) {
            var _b, _c;
            var active = _a.active, over = _a.over;
            if (!(0, utils_1.hasDraggableData)(active) || !(0, utils_1.hasDraggableData)(over))
                return;
            if (((_b = active.data.current) === null || _b === void 0 ? void 0 : _b.type) === "column" &&
                ((_c = over.data.current) === null || _c === void 0 ? void 0 : _c.type) === "column") {
                var overIndex = columnOrder.findIndex(function (id) { return id === over.id; });
                return t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Column ", " was moved over ", " at position ", " of ", ""], ["Column ", " was moved over ", " at position ", " of ", ""])), active.data.current.column.title, over.data.current.column.title, overIndex + 1, columnOrder.length);
            }
        },
        onDragEnd: function (_a) {
            var _b, _c;
            var active = _a.active, over = _a.over;
            if (!(0, utils_1.hasDraggableData)(active) || !(0, utils_1.hasDraggableData)(over))
                return;
            if (((_b = active.data.current) === null || _b === void 0 ? void 0 : _b.type) === "column" &&
                ((_c = over.data.current) === null || _c === void 0 ? void 0 : _c.type) === "column") {
                var overColumnPosition = columnOrder.findIndex(function (id) { return id === over.id; });
                return t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Column ", " was dropped into position ", " of ", ""], ["Column ", " was dropped into position ", " of ", ""])), active.data.current.column.title, overColumnPosition + 1, columnOrder.length);
            }
        },
        onDragCancel: function (_a) {
            var _b;
            var active = _a.active;
            if (!(0, utils_1.hasDraggableData)(active))
                return;
            return t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Dragging ", " cancelled."], ["Dragging ", " cancelled."])), (_b = active.data.current) === null || _b === void 0 ? void 0 : _b.type);
        }
    };
    return (<core_1.DndContext accessibility={{
            announcements: announcements
        }} sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <ColumnCard_1.BoardContainer>
        <sortable_1.SortableContext items={columnOrder}>
          {columnOrder.map(function (colId) {
            var col = columns.find(function (c) { return c.id === colId; });
            if (!col)
                return null;
            return (<ColumnCard_1.ColumnCard key={col.id} column={col} items={items.filter(function (item) { return item.columnId === col.id; })} progressByItemId={progressByItemId} {...displaySettings}/>);
        })}
        </sortable_1.SortableContext>
      </ColumnCard_1.BoardContainer>

      <react_1.ClientOnly fallback={null}>
        {function () {
            return (0, react_dom_1.createPortal)(<core_1.DragOverlay>
              {activeColumn && (<ColumnCard_1.ColumnCard isOverlay column={activeColumn} items={items.filter(function (item) { return item.columnId === activeColumn.id; })} progressByItemId={progressByItemId} {...displaySettings}/>)}
            </core_1.DragOverlay>, document.body);
        }}
      </react_1.ClientOnly>
    </core_1.DndContext>);
    function onDragStart(event) {
        if (!(0, utils_1.hasDraggableData)(event.active))
            return;
        var data = event.active.data.current;
        if ((data === null || data === void 0 ? void 0 : data.type) === "column") {
            setActiveColumn(data.column);
        }
    }
    function onDragEnd(event) {
        setActiveColumn(null);
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
};
exports.default = Kanban;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
