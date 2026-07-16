"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphLegend = GraphLegend;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var metadata_1 = require("./metadata");
var ENTITY_DISPLAY_ORDER = [
    "Available",
    "Consumed",
    "Reserved",
    "On Hold",
    "Rejected"
];
var ENTITY_ENTRIES = ENTITY_DISPLAY_ORDER.map(function (status) {
    var meta = metadata_1.ENTITY_STATUS_META[status];
    return {
        label: meta.label,
        color: meta.color,
        shape: "circle",
        icon: meta.icon
    };
});
var ACTIVITY_ENTRIES = Object.keys(metadata_1.ACTIVITY_KIND_META).map(function (kind) {
    var meta = metadata_1.ACTIVITY_KIND_META[kind];
    return {
        label: meta.label,
        color: meta.color,
        shape: "diamond",
        icon: meta.icon
    };
});
function GraphLegend() {
    var t = (0, macro_1.useLingui)().t;
    return (<div className="absolute bottom-3 left-3 z-20">
      <react_1.Popover>
        <react_1.PopoverTrigger asChild>
          <button type="button" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Show legend"], ["Show legend"])))} className={(0, react_1.cn)("h-8 w-8 rounded-md flex items-center justify-center transition-colors", "border border-border bg-card/90 backdrop-blur shadow-sm", "text-muted-foreground hover:text-foreground hover:bg-accent/60", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring")}>
            <lu_1.LuInfo className="w-4 h-4"/>
          </button>
        </react_1.PopoverTrigger>
        <react_1.PopoverContent side="top" align="start" className="w-[420px] p-0 border-border">
          <react_1.HStack spacing={0} className="items-stretch divide-x divide-border">
            <Section title={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Entities"], ["Entities"])))} entries={ENTITY_ENTRIES}/>
            <Section title={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Activities"], ["Activities"])))} entries={ACTIVITY_ENTRIES}/>
          </react_1.HStack>
          <div className="border-t border-border p-4">
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              {t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Lines"], ["Lines"])))}
            </span>
            <react_1.VStack spacing={2}>
              <LineRow label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Normal flow"], ["Normal flow"])))} color="hsl(0 0% 55%)" width={1.2} opacity={0.6}/>
              <LineRow label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Selection path"], ["Selection path"])))} color="hsl(0 0% 92%)" width={2.5} opacity={1}/>
              <LineRow label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Reject branch"], ["Reject branch"])))} color="hsl(0 72% 55%)" width={1.5} opacity={0.9}/>
              <LineRow label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Cycle back-edge"], ["Cycle back-edge"])))} color="hsl(0 0% 55%)" width={1.2} opacity={0.3} dashed/>
            </react_1.VStack>
          </div>
        </react_1.PopoverContent>
      </react_1.Popover>
    </div>);
}
function Section(_a) {
    var title = _a.title, entries = _a.entries;
    return (<react_1.VStack spacing={3} className="p-4 flex-1 min-w-0">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
        {title}
      </span>
      {entries.map(function (entry) { return (<Row key={entry.label} entry={entry}/>); })}
    </react_1.VStack>);
}
function LineRow(_a) {
    var label = _a.label, color = _a.color, width = _a.width, opacity = _a.opacity, _b = _a.dashed, dashed = _b === void 0 ? false : _b;
    return (<react_1.HStack spacing={3} className="items-center">
      <svg width={36} height={6} className="shrink-0">
        <line x1={0} y1={3} x2={36} y2={3} stroke={color} strokeWidth={width} strokeOpacity={opacity} strokeDasharray={dashed ? "5 3" : undefined}/>
      </svg>
      <span className="text-[13px] text-foreground truncate">{label}</span>
    </react_1.HStack>);
}
function Row(_a) {
    var entry = _a.entry;
    var Icon = entry.icon;
    return (<react_1.HStack spacing={3} className="items-center">
      <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
        <div className={(0, react_1.cn)("absolute inset-0", entry.shape === "circle" ? "rounded-full" : "rounded")} style={{
            background: entry.color,
            transform: entry.shape === "diamond" ? "rotate(45deg)" : undefined
        }}/>
        <Icon className="relative w-3.5 h-3.5 text-white"/>
      </div>
      <span className="text-[13px] text-foreground truncate">
        {entry.label}
      </span>
    </react_1.HStack>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
