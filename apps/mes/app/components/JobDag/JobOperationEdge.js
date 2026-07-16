"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobOperationEdge = void 0;
var react_1 = require("@xyflow/react");
var react_2 = require("react");
function JobOperationEdgeImpl(_a) {
    var id = _a.id, sourceX = _a.sourceX, sourceY = _a.sourceY, targetX = _a.targetX, targetY = _a.targetY, sourcePosition = _a.sourcePosition, targetPosition = _a.targetPosition, data = _a.data;
    var d = data;
    var _b = (0, react_1.getSimpleBezierPath)({
        sourceX: sourceX,
        sourceY: sourceY,
        sourcePosition: sourcePosition,
        targetX: targetX,
        targetY: targetY,
        targetPosition: targetPosition
    }), edgePath = _b[0], labelX = _b[1], labelY = _b[2];
    var dimmed = (d === null || d === void 0 ? void 0 : d.quantity) === 0;
    return (<>
      <react_1.BaseEdge id={id} path={edgePath} style={{
            stroke: "hsl(0 0% 55%)",
            strokeWidth: 1.2,
            opacity: 0.5,
            fill: "none"
        }}/>
      {(d === null || d === void 0 ? void 0 : d.quantity) != null && (<react_1.EdgeLabelRenderer>
          <div style={{
                position: "absolute",
                transform: "translate(-50%, -50%) translate(".concat(labelX, "px, ").concat(labelY, "px)"),
                pointerEvents: "none",
                minWidth: 22,
                textAlign: "center",
                zIndex: 1000
            }} className={"text-[11px] font-medium tabular-nums leading-none px-2 py-1 rounded-full border-2 ".concat(dimmed
                ? "bg-background text-muted-foreground/60 border-border/40"
                : "bg-background text-foreground border-border")}>
            {d.quantity}
          </div>
        </react_1.EdgeLabelRenderer>)}
    </>);
}
exports.JobOperationEdge = (0, react_2.memo)(JobOperationEdgeImpl);
