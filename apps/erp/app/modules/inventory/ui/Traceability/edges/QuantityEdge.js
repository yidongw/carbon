"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantityEdge = void 0;
var react_1 = require("@xyflow/react");
var react_2 = require("react");
function QuantityEdgeImpl(_a) {
    var id = _a.id, sourceX = _a.sourceX, sourceY = _a.sourceY, targetX = _a.targetX, targetY = _a.targetY, sourcePosition = _a.sourcePosition, targetPosition = _a.targetPosition, data = _a.data;
    var _b = (0, react_1.getSimpleBezierPath)({
        sourceX: sourceX,
        sourceY: sourceY,
        sourcePosition: sourcePosition,
        targetX: targetX,
        targetY: targetY,
        targetPosition: targetPosition
    }), edgePath = _b[0], labelX = _b[1], labelY = _b[2];
    var isReject = !!(data === null || data === void 0 ? void 0 : data.isReject);
    var isBackEdge = !!(data === null || data === void 0 ? void 0 : data.isBackEdge);
    var dimmed = !!(data === null || data === void 0 ? void 0 : data.dimmed);
    var highlighted = !!(data === null || data === void 0 ? void 0 : data.highlighted);
    var strokeWidth = highlighted ? 2.5 : isReject ? 1.5 : 1;
    var stroke = highlighted
        ? "hsl(0 0% 92%)"
        : isReject
            ? "hsl(0 72% 55%)"
            : "hsl(0 0% 45%)";
    var baseOpacity = highlighted
        ? 1
        : isReject
            ? 0.85
            : isBackEdge
                ? 0.2
                : 0.4;
    return (<>
      <react_1.BaseEdge id={id} path={edgePath} className="trace-edge-path" style={{
            stroke: stroke,
            strokeWidth: strokeWidth,
            opacity: dimmed ? 0.08 : baseOpacity,
            strokeDasharray: isBackEdge ? "8 4" : undefined,
            fill: "none"
        }}/>
      {!dimmed && (data === null || data === void 0 ? void 0 : data.quantity) != null && (<react_1.EdgeLabelRenderer>
          <div style={{
                position: "absolute",
                transform: "translate(-50%, -50%) translate(".concat(labelX, "px, ").concat(labelY, "px)"),
                pointerEvents: "none",
                minWidth: 22,
                textAlign: "center",
                zIndex: 1000
            }} className={"text-[11px] font-medium tabular-nums leading-none px-2 py-1 rounded-full border-2 ".concat(isReject
                ? "bg-background text-[hsl(0_72%_55%)] border-[hsl(0_72%_55%)]"
                : highlighted
                    ? "bg-foreground text-background border-foreground"
                    : isBackEdge
                        ? "bg-background text-muted-foreground/60 border-border/40"
                        : "bg-background text-foreground border-border")}>
            {data.quantity}
          </div>
        </react_1.EdgeLabelRenderer>)}
    </>);
}
exports.QuantityEdge = (0, react_2.memo)(QuantityEdgeImpl);
