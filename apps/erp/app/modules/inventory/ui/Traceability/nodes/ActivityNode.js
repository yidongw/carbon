"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityNode = void 0;
var react_1 = require("@carbon/react");
var react_2 = require("@xyflow/react");
var react_3 = require("react");
var constants_1 = require("../constants");
var metadata_1 = require("../metadata");
function ActivityNodeImpl(_a) {
    var _b;
    var data = _a.data, selected = _a.selected;
    var activity = data.activity;
    var kind = (0, metadata_1.activityKindFor)(activity.type);
    var meta = metadata_1.ACTIVITY_KIND_META[kind];
    var Icon = meta.icon;
    var label = (_b = activity.type) !== null && _b !== void 0 ? _b : meta.label;
    var zoomedIn = (0, react_2.useStore)(function (s) { return s.transform[2] > 0.5; });
    var showLabel = zoomedIn || data.isRoot || selected;
    var half = constants_1.NODE_RADIUS;
    var size = constants_1.NODE_SIZE;
    var iconSize = 18;
    return (<div className={(0, react_1.cn)("relative", data.dimmed && "opacity-15")} style={{ width: size, height: size, zIndex: 10 }}>
      <react_2.Handle type="target" position={react_2.Position.Top} className="!opacity-0 !pointer-events-none !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-1 !h-1 !min-w-0 !min-h-0 !border-0"/>
      <react_2.Handle type="source" position={react_2.Position.Bottom} className="!opacity-0 !pointer-events-none !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-1 !h-1 !min-w-0 !min-h-0 !border-0"/>
      <svg width={size} height={size} className="absolute inset-0 overflow-visible" aria-hidden>
        {(selected || data.isRoot) && (<rect x={-7} y={-7} width={size + 14} height={size + 14} rx={8} fill={meta.color} opacity={0.2} transform={"rotate(45 ".concat(half, " ").concat(half, ")")}/>)}
        <rect x={0} y={0} width={size} height={size} rx={5} fill={meta.color} stroke={selected || data.isRoot ? "hsl(var(--foreground))" : "transparent"} strokeWidth={selected || data.isRoot ? 2 : 0} transform={"rotate(45 ".concat(half, " ").concat(half, ")")}/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white drop-shadow-sm">
        <Icon style={{ width: iconSize, height: iconSize }}/>
      </div>
      {showLabel && (<div className={(0, react_1.cn)("absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none select-none", data.isRoot || selected
                ? "text-foreground"
                : "text-muted-foreground")} style={{ top: size + 8 }}>
          <span className={(0, react_1.cn)("text-[11px] tracking-tight px-1.5 py-px rounded bg-background", (data.isRoot || selected) && "font-medium")}>
            {label}
          </span>
        </div>)}
    </div>);
}
exports.ActivityNode = (0, react_3.memo)(ActivityNodeImpl);
