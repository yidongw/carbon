"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphToolbar = GraphToolbar;
var react_1 = require("@carbon/react");
var react_2 = require("@xyflow/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var PANEL = "rounded-lg border border-border bg-card/95 backdrop-blur shadow-sm";
function GraphToolbar(_a) {
    var depth = _a.depth, onDepthChange = _a.onDepthChange, direction = _a.direction, onDirectionChange = _a.onDirectionChange, view = _a.view, onViewChange = _a.onViewChange, isolate = _a.isolate, onIsolateChange = _a.onIsolateChange, _b = _a.hasSelection, hasSelection = _b === void 0 ? false : _b, onRelayout = _a.onRelayout, onOpenSearch = _a.onOpenSearch, _c = _a.spacing, spacing = _c === void 0 ? 2 : _c, onSpacingChange = _a.onSpacingChange;
    return (<>
      <ViewModeChip view={view} onViewChange={onViewChange}/>
      <GraphControlsChip depth={depth} onDepthChange={onDepthChange} direction={direction} onDirectionChange={onDirectionChange} isolate={isolate} onIsolateChange={onIsolateChange} hasSelection={hasSelection} onRelayout={onRelayout} onOpenSearch={onOpenSearch} spacing={spacing} onSpacingChange={onSpacingChange} showGraphOnly={view === "graph"}/>
    </>);
}
function ViewModeChip(_a) {
    var view = _a.view, onViewChange = _a.onViewChange;
    return (<react_1.HStack spacing={0} className={(0, react_1.cn)("absolute top-3 left-3 z-30 p-1", PANEL)}>
      <SegmentButton active={view === "graph"} onClick={function () { return onViewChange("graph"); }} ariaLabel="Graph view">
        <lu_1.LuNetwork className="w-3.5 h-3.5"/>
        <span>Graph</span>
      </SegmentButton>
      <SegmentButton active={view === "table"} onClick={function () { return onViewChange("table"); }} ariaLabel="Table view">
        <lu_1.LuTable className="w-3.5 h-3.5"/>
        <span>Table</span>
      </SegmentButton>
    </react_1.HStack>);
}
function GraphControlsChip(_a) {
    var depth = _a.depth, onDepthChange = _a.onDepthChange, direction = _a.direction, onDirectionChange = _a.onDirectionChange, isolate = _a.isolate, onIsolateChange = _a.onIsolateChange, hasSelection = _a.hasSelection, onRelayout = _a.onRelayout, onOpenSearch = _a.onOpenSearch, spacing = _a.spacing, onSpacingChange = _a.onSpacingChange, showGraphOnly = _a.showGraphOnly;
    var t = (0, macro_1.useLingui)().t;
    var fitView = (0, react_2.useReactFlow)().fitView;
    return (<react_1.HStack spacing={1} className={(0, react_1.cn)("absolute top-3 right-3 z-30 px-1.5 py-1", PANEL)}>
      {onOpenSearch && (<>
          <react_1.HoverCard openDelay={150} closeDelay={50}>
            <react_1.HoverCardTrigger asChild>
              <button type="button" onClick={onOpenSearch} className={(0, react_1.cn)("h-7 px-2 rounded-md flex items-center gap-1 transition-colors text-xs", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "text-muted-foreground hover:text-foreground hover:bg-accent/60")} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search nodes"], ["Search nodes"])))}>
                <lu_1.LuSearch className="w-3.5 h-3.5"/>
                <kbd className="text-[10px] text-muted-foreground bg-muted/50 px-1 rounded">
                  /
                </kbd>
              </button>
            </react_1.HoverCardTrigger>
            <react_1.HoverCardContent side="top" sideOffset={8} className="!w-auto !p-2 text-xs">
              Search nodes
            </react_1.HoverCardContent>
          </react_1.HoverCard>
          <div className="w-px h-5 bg-border mx-1"/>
        </>)}
      <react_1.HoverCard openDelay={150} closeDelay={50}>
        <react_1.HoverCardTrigger asChild>
          <react_1.HStack spacing={0} className="rounded-md bg-muted/40 p-0.5">
            <button type="button" onClick={function () { return depth > 1 && onDepthChange(depth - 1); }} aria-disabled={depth <= 1} aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Decrease hops"], ["Decrease hops"])))} className={(0, react_1.cn)("h-6 w-6 rounded flex items-center justify-center transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", depth <= 1
            ? "opacity-40 cursor-not-allowed text-muted-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-background")}>
              <lu_1.LuMinus className="w-3 h-3"/>
            </button>
            <div className="px-2 min-w-[64px] text-center text-xs tabular-nums select-none">
              <span className="font-medium text-foreground">{depth}</span>
              <span className="text-muted-foreground ml-1">
                {depth === 1 ? "hop" : "hops"}
              </span>
            </div>
            <button type="button" onClick={function () { return depth < 5 && onDepthChange(depth + 1); }} aria-disabled={depth >= 5} aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Increase hops"], ["Increase hops"])))} className={(0, react_1.cn)("h-6 w-6 rounded flex items-center justify-center transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", depth >= 5
            ? "opacity-40 cursor-not-allowed text-muted-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-background")}>
              <lu_1.LuPlus className="w-3 h-3"/>
            </button>
          </react_1.HStack>
        </react_1.HoverCardTrigger>
        <react_1.HoverCardContent side="top" sideOffset={8} className="!w-auto !p-2 text-xs">
          Max connections fetched per direction (1–5)
        </react_1.HoverCardContent>
      </react_1.HoverCard>

      {showGraphOnly && (<>
          <div className="w-px h-5 bg-border mx-1"/>

          <react_1.HStack spacing={0} className="rounded-md bg-muted/40 p-0.5">
            <react_1.HoverCard openDelay={150} closeDelay={50}>
              <react_1.HoverCardTrigger asChild>
                <button onClick={function () { return onDirectionChange("TB"); }} className={(0, react_1.cn)("h-6 w-6 rounded flex items-center justify-center transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", direction === "TB"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground")} aria-pressed={direction === "TB"} aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Top-down layout"], ["Top-down layout"])))}>
                  <lu_1.LuMoveDown className="w-3.5 h-3.5"/>
                </button>
              </react_1.HoverCardTrigger>
              <react_1.HoverCardContent side="top" sideOffset={8}>
                Top-down
              </react_1.HoverCardContent>
            </react_1.HoverCard>
            <react_1.HoverCard openDelay={150} closeDelay={50}>
              <react_1.HoverCardTrigger asChild>
                <button onClick={function () { return onDirectionChange("LR"); }} className={(0, react_1.cn)("h-6 w-6 rounded flex items-center justify-center transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", direction === "LR"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground")} aria-pressed={direction === "LR"} aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Left-right layout"], ["Left-right layout"])))}>
                  <lu_1.LuMoveRight className="w-3.5 h-3.5"/>
                </button>
              </react_1.HoverCardTrigger>
              <react_1.HoverCardContent side="top" sideOffset={8}>
                Left-right
              </react_1.HoverCardContent>
            </react_1.HoverCard>
          </react_1.HStack>

          <div className="w-px h-5 bg-border mx-1"/>

          <react_1.HoverCard openDelay={150} closeDelay={50}>
            <react_1.HoverCardTrigger asChild>
              <button type="button" onClick={function () {
                if (!hasSelection)
                    return;
                onIsolateChange(!isolate);
            }} aria-disabled={!hasSelection} className={(0, react_1.cn)("h-7 w-7 rounded-md flex items-center justify-center transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", !hasSelection && "opacity-40 cursor-not-allowed", hasSelection &&
                !isolate &&
                "text-muted-foreground hover:text-foreground hover:bg-accent/60", hasSelection &&
                isolate &&
                "bg-foreground/10 text-foreground ring-1 ring-foreground/20")} aria-pressed={isolate} aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Isolate lineage"], ["Isolate lineage"])))}>
                <lu_1.LuFocus className="w-3.5 h-3.5"/>
              </button>
            </react_1.HoverCardTrigger>
            <react_1.HoverCardContent side="top" sideOffset={8} className="!w-auto !p-2 text-xs">
              {hasSelection ? "Isolate lineage" : "Select a node first"}
            </react_1.HoverCardContent>
          </react_1.HoverCard>

          <react_1.HoverCard openDelay={150} closeDelay={50}>
            <react_1.HoverCardTrigger asChild>
              <button onClick={function () { return fitView({ duration: 300, padding: 0.2 }); }} className={(0, react_1.cn)("h-7 w-7 rounded-md flex items-center justify-center transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "text-muted-foreground hover:text-foreground hover:bg-accent/60")} aria-label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Fit to view"], ["Fit to view"])))}>
                <lu_1.LuMaximize className="w-3.5 h-3.5"/>
              </button>
            </react_1.HoverCardTrigger>
            <react_1.HoverCardContent side="top" sideOffset={8} className="!w-auto !p-2 text-xs">
              Fit to view
            </react_1.HoverCardContent>
          </react_1.HoverCard>

          <react_1.HoverCard openDelay={150} closeDelay={50}>
            <react_1.HoverCardTrigger asChild>
              <button type="button" onClick={function () { return onRelayout === null || onRelayout === void 0 ? void 0 : onRelayout(); }} className={(0, react_1.cn)("h-7 w-7 rounded-md flex items-center justify-center transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "text-muted-foreground hover:text-foreground hover:bg-accent/60")} aria-label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Re-layout graph"], ["Re-layout graph"])))}>
                <lu_1.LuMove className="w-3.5 h-3.5"/>
              </button>
            </react_1.HoverCardTrigger>
            <react_1.HoverCardContent side="top" sideOffset={8} className="!w-auto !p-2 text-xs">
              Re-layout graph
            </react_1.HoverCardContent>
          </react_1.HoverCard>

          <div className="w-px h-5 bg-border mx-1"/>

          <SpacingSlider value={spacing} onChange={onSpacingChange}/>
        </>)}
    </react_1.HStack>);
}
function SpacingSlider(_a) {
    var value = _a.value, onChange = _a.onChange;
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.Popover>
      <react_1.HoverCard openDelay={150} closeDelay={50}>
        <react_1.HoverCardTrigger asChild>
          <react_1.PopoverTrigger asChild>
            <button type="button" aria-label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Layout spacing"], ["Layout spacing"])))} className={(0, react_1.cn)("h-7 px-2 rounded-md flex items-center gap-1 transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "text-muted-foreground hover:text-foreground hover:bg-accent/60")}>
              <span className="text-[10px] uppercase tracking-wide">
                Spacing
              </span>
              <span className="text-xs tabular-nums font-medium text-foreground">
                {value}
              </span>
            </button>
          </react_1.PopoverTrigger>
        </react_1.HoverCardTrigger>
        <react_1.HoverCardContent side="top" sideOffset={8} className="!w-auto !p-2 text-xs">
          Spacing
        </react_1.HoverCardContent>
      </react_1.HoverCard>
      <react_1.PopoverContent side="bottom" align="end" sideOffset={8} collisionPadding={16} className="w-auto p-3">
        <react_1.VStack spacing={2} className="items-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Spacing
          </span>
          <span className="text-base font-medium tabular-nums text-foreground">
            {value}
          </span>
          <div className="relative h-32 w-6 flex items-center justify-center">
            <input type="range" min={1} max={5} step={1} value={value} onChange={function (e) { return onChange === null || onChange === void 0 ? void 0 : onChange(Number(e.target.value)); }} aria-label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Layout spacing"], ["Layout spacing"])))} className="absolute h-32 w-32 -rotate-90 cursor-pointer accent-foreground" style={{ accentColor: "hsl(var(--foreground))" }}/>
          </div>
          <react_1.HStack className="w-full justify-between text-[10px] text-muted-foreground tabular-nums">
            <span>1</span>
            <span>5</span>
          </react_1.HStack>
        </react_1.VStack>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
function SegmentButton(_a) {
    var active = _a.active, onClick = _a.onClick, ariaLabel = _a.ariaLabel, children = _a.children;
    return (<button onClick={onClick} aria-pressed={active} aria-label={ariaLabel} className={(0, react_1.cn)("h-7 px-2.5 rounded-md text-xs flex items-center gap-1.5 transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", active
            ? "bg-background text-foreground shadow-sm font-medium"
            : "text-muted-foreground hover:text-foreground")}>
      {children}
    </button>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
