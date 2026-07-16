"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coordinateGetter = void 0;
exports.hasDraggableData = hasDraggableData;
var core_1 = require("@dnd-kit/core");
var directions = [
    core_1.KeyboardCode.Down,
    core_1.KeyboardCode.Right,
    core_1.KeyboardCode.Up,
    core_1.KeyboardCode.Left
];
var coordinateGetter = function (event, _a) {
    var _b = _a.context, active = _b.active, droppableRects = _b.droppableRects, droppableContainers = _b.droppableContainers, collisionRect = _b.collisionRect;
    if (directions.includes(event.code)) {
        event.preventDefault();
        if (!active || !collisionRect) {
            return;
        }
        var filteredContainers_1 = [];
        droppableContainers.getEnabled().forEach(function (entry) {
            var _a, _b, _c;
            if (!entry || (entry === null || entry === void 0 ? void 0 : entry.disabled)) {
                return;
            }
            var rect = droppableRects.get(entry.id);
            if (!rect) {
                return;
            }
            var data = entry.data.current;
            if (data) {
                var type = data.type, children = data.children;
                if (type === "Column" && (children === null || children === void 0 ? void 0 : children.length) > 0) {
                    if (((_a = active.data.current) === null || _a === void 0 ? void 0 : _a.type) !== "Column") {
                        return;
                    }
                }
            }
            switch (event.code) {
                case core_1.KeyboardCode.Down:
                    if (((_b = active.data.current) === null || _b === void 0 ? void 0 : _b.type) === "Column") {
                        return;
                    }
                    if (collisionRect.top < rect.top) {
                        // find all droppable areas below
                        filteredContainers_1.push(entry);
                    }
                    break;
                case core_1.KeyboardCode.Up:
                    if (((_c = active.data.current) === null || _c === void 0 ? void 0 : _c.type) === "Column") {
                        return;
                    }
                    if (collisionRect.top > rect.top) {
                        // find all droppable areas above
                        filteredContainers_1.push(entry);
                    }
                    break;
                case core_1.KeyboardCode.Left:
                    if (collisionRect.left >= rect.left + rect.width) {
                        // find all droppable areas to left
                        filteredContainers_1.push(entry);
                    }
                    break;
                case core_1.KeyboardCode.Right:
                    // find all droppable areas to right
                    if (collisionRect.left + collisionRect.width <= rect.left) {
                        filteredContainers_1.push(entry);
                    }
                    break;
            }
        });
        var collisions = (0, core_1.closestCorners)({
            active: active,
            collisionRect: collisionRect,
            droppableRects: droppableRects,
            droppableContainers: filteredContainers_1,
            pointerCoordinates: null
        });
        var closestId = (0, core_1.getFirstCollision)(collisions, "id");
        if (closestId != null) {
            var newDroppable = droppableContainers.get(closestId);
            var newNode = newDroppable === null || newDroppable === void 0 ? void 0 : newDroppable.node.current;
            var newRect = newDroppable === null || newDroppable === void 0 ? void 0 : newDroppable.rect.current;
            if (newNode && newRect) {
                return {
                    x: newRect.left,
                    y: newRect.top
                };
            }
        }
    }
    return undefined;
};
exports.coordinateGetter = coordinateGetter;
function hasDraggableData(entry) {
    if (!entry) {
        return false;
    }
    var data = entry.data.current;
    if ((data === null || data === void 0 ? void 0 : data.type) === "column" || (data === null || data === void 0 ? void 0 : data.type) === "item") {
        return true;
    }
    return false;
}
