"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityNode = void 0;
var react_1 = require("@carbon/react");
var react_2 = require("@xyflow/react");
var react_3 = require("react");
var lu_1 = require("react-icons/lu");
var constants_1 = require("../constants");
var metadata_1 = require("../metadata");
var utils_1 = require("../utils");
function EntityNodeImpl(_a) {
    var data = _a.data, selected = _a.selected, id = _a.id;
    var entity = data.entity;
    var headline = (0, utils_1.entityHeadline)(entity, 8);
    var zoomedIn = (0, react_2.useStore)(function (s) { return s.transform[2] > 0.5; });
    var showLabel = zoomedIn || data.isRoot || selected;
    var meta = (0, metadata_1.entityStatusMeta)(entity.status);
    var Icon = meta.icon;
    var isRejected = entity.status === "Rejected";
    var containmentStatus = data.containmentStatus;
    var radius = constants_1.NODE_RADIUS;
    var size = constants_1.NODE_SIZE;
    var iconSize = 18;
    return (<div className={(0, react_1.cn)("relative", data.dimmed && "opacity-15")} style={{ width: size, height: size, zIndex: 10 }}>
      <react_2.Handle type="target" position={react_2.Position.Top} className="!opacity-0 !pointer-events-none !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-1 !h-1 !min-w-0 !min-h-0 !border-0"/>
      <react_2.Handle type="source" position={react_2.Position.Bottom} className="!opacity-0 !pointer-events-none !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-1 !h-1 !min-w-0 !min-h-0 !border-0"/>
      <svg width={size} height={size} className="absolute inset-0 overflow-visible" aria-hidden>
        {(selected || data.isRoot) && (<circle cx={radius} cy={radius} r={radius + 6} fill={meta.color} opacity={0.2}/>)}
        {isRejected && (<circle cx={radius} cy={radius} r={radius + 3} fill="none" stroke="hsl(0 84% 60%)" strokeWidth={1.5} strokeDasharray="3 3"/>)}
        {!isRejected && containmentStatus && (<circle cx={radius} cy={radius} r={radius + 3} fill="none" stroke={containmentStatus === "Uncontained"
                ? "hsl(0 84% 60%)"
                : "hsl(38 95% 53%)"} strokeWidth={1.5} strokeDasharray="3 3"/>)}
        <circle cx={radius} cy={radius} r={radius} fill={meta.color} stroke={selected || data.isRoot ? "hsl(var(--foreground))" : "transparent"} strokeWidth={selected || data.isRoot ? 2 : 0}/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white drop-shadow-sm">
        <Icon style={{ width: iconSize, height: iconSize }}/>
      </div>
      <div className="absolute -top-1 -right-1 rounded-full bg-card border border-border text-[9px] tabular-nums px-1 leading-tight pointer-events-none" title={"Quantity ".concat(entity.quantity)}>
        {formatQuantity(entity.quantity)}
      </div>
      {data.isExpanded ? (<NodeExpandToggle kind="collapse" onClick={function () { var _a; return (_a = data.onCollapse) === null || _a === void 0 ? void 0 : _a.call(data, id); }}/>) : (<>
          {data.canExpandUp && (<NodeExpandToggle kind="up" onClick={function () { var _a; return (_a = data.onExpand) === null || _a === void 0 ? void 0 : _a.call(data, id, "up"); }}/>)}
          {data.canExpandDown && (<NodeExpandToggle kind="down" onClick={function () { var _a; return (_a = data.onExpand) === null || _a === void 0 ? void 0 : _a.call(data, id, "down"); }}/>)}
        </>)}
      {showLabel && (<div className={(0, react_1.cn)("absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none select-none flex flex-col items-center", data.isRoot || selected
                ? "text-foreground"
                : "text-muted-foreground")} style={{ top: size + 4 }}>
          <span className={(0, react_1.cn)("text-[11px] tracking-tight px-1.5 py-px rounded bg-background", (data.isRoot || selected) && "font-medium")}>
            {headline}
          </span>
        </div>)}
    </div>);
}
function formatQuantity(q) {
    if (q >= 1000)
        return "".concat((q / 1000).toFixed(1), "k");
    if (Number.isInteger(q))
        return String(q);
    return q.toFixed(1);
}
var TOGGLE_META = {
    collapse: { icon: lu_1.LuMinus, title: "Collapse", anchor: "top" },
    up: { icon: lu_1.LuChevronUp, title: "Expand upstream", anchor: "top" },
    down: { icon: lu_1.LuChevronDown, title: "Expand downstream", anchor: "bottom" }
};
function NodeExpandToggle(_a) {
    var kind = _a.kind, onClick = _a.onClick;
    var _b = TOGGLE_META[kind], Icon = _b.icon, title = _b.title, anchor = _b.anchor;
    return (<button type="button" className={(0, react_1.cn)("nodrag absolute left-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 flex items-center justify-center ring-1 ring-background shadow-sm z-20 transition-colors", anchor === "top" ? "-top-2" : "-bottom-2")} title={title} onClick={function (e) {
            e.stopPropagation();
            onClick();
        }}>
      <Icon className="w-3 h-3" strokeWidth={2.5}/>
    </button>);
}
exports.EntityNode = (0, react_3.memo)(EntityNodeImpl);
