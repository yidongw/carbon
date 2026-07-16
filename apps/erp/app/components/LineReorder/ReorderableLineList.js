"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderableLineList = ReorderableLineList;
var react_1 = require("@carbon/react");
var core_1 = require("@dnd-kit/core");
var sortable_1 = require("@dnd-kit/sortable");
var utilities_1 = require("@dnd-kit/utilities");
var react_dom_1 = require("react-dom");
function ReorderableLineList(_a) {
    var lines = _a.lines, activeLine = _a.activeLine, onDragStart = _a.onDragStart, onDragEnd = _a.onDragEnd, renderRow = _a.renderRow, renderOverlay = _a.renderOverlay;
    var sensors = (0, core_1.useSensors)((0, core_1.useSensor)(core_1.PointerSensor, { activationConstraint: { distance: 8 } }), (0, core_1.useSensor)(core_1.KeyboardSensor));
    return (<core_1.DndContext sensors={sensors} collisionDetection={core_1.closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <sortable_1.SortableContext items={lines.map(function (l) { return l.id; })} strategy={sortable_1.verticalListSortingStrategy}>
        <react_1.VStack spacing={0} className="w-full">
          {lines.map(function (line) { return (<SortableLineRow key={line.id} line={line} renderRow={renderRow}/>); })}
        </react_1.VStack>
      </sortable_1.SortableContext>
      <react_1.ClientOnly fallback={null}>
        {function () {
            return (0, react_dom_1.createPortal)(<core_1.DragOverlay dropAnimation={null}>
              {activeLine && renderOverlay(activeLine)}
            </core_1.DragOverlay>, document.body);
        }}
      </react_1.ClientOnly>
    </core_1.DndContext>);
}
function SortableLineRow(_a) {
    var line = _a.line, renderRow = _a.renderRow;
    var _b = (0, sortable_1.useSortable)({ id: line.id }), attributes = _b.attributes, listeners = _b.listeners, setNodeRef = _b.setNodeRef, transform = _b.transform, transition = _b.transition, isDragging = _b.isDragging;
    var style = {
        transform: utilities_1.CSS.Translate.toString(transform),
        transition: transition !== null && transition !== void 0 ? transition : undefined
    };
    return (<div ref={setNodeRef} style={style} className={(0, react_1.cn)("w-full border-b border-border/60 bg-card", "transition-[opacity,background-color] duration-150 ease", isDragging && "opacity-40 bg-muted/30")}>
      {renderRow(line, { attributes: attributes, listeners: listeners })}
    </div>);
}
