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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var react_hotkeys_hook_1 = require("react-hotkeys-hook");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var ShowParentIcon_1 = require("~/assets/icons/ShowParentIcon");
var error_banner_tile_2x_png_1 = require("~/assets/images/error-banner-tile@2x.png");
var Timeline = require("~/components/Timeline");
var TreeView_1 = require("~/components/TreeView");
var resizable_panels_1 = require("~/utils/resizable-panels");
var GanttIcon_1 = require("./components/GanttIcon");
var GanttTaskStatus_1 = require("./components/GanttTaskStatus");
var SpanTitle_1 = require("./components/SpanTitle");
var Gantt = function (_a) {
    var events = _a.events, selectedId = _a.selectedId, parentReadableId = _a.parentReadableId, onSelectedIdChanged = _a.onSelectedIdChanged, totalDuration = _a.totalDuration, rootSpanStatus = _a.rootSpanStatus, rootStartedAt = _a.rootStartedAt;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(""), filterText = _b[0], setFilterText = _b[1];
    var _c = (0, react_2.useState)(false), wipOnly = _c[0], setWipOnly = _c[1];
    var _d = (0, react_2.useState)(false), showDurations = _d[0], setShowDurations = _d[1];
    var _e = (0, react_2.useState)(0), scale = _e[0], setScale = _e[1];
    var parentRef = (0, react_2.useRef)(null);
    var treeScrollRef = (0, react_2.useRef)(null);
    var timelineScrollRef = (0, react_2.useRef)(null);
    var _f = (0, TreeView_1.useTree)({
        tree: events,
        selectedId: selectedId,
        // collapsedIds,
        onSelectedIdChanged: onSelectedIdChanged,
        estimatedRowHeight: function () { return 32; },
        parentRef: parentRef,
        filter: {
            value: { text: filterText, wipOnly: wipOnly },
            fn: function (value, node) {
                var isWIP = (value.wipOnly && node.data.isPartial) || !value.wipOnly;
                if (!isWIP)
                    return false;
                if (value.text === "")
                    return true;
                if (node.data.message.toLowerCase().includes(value.text.toLowerCase())) {
                    return true;
                }
                return false;
            }
        }
    }), nodes = _f.nodes, getTreeProps = _f.getTreeProps, getNodeProps = _f.getNodeProps, toggleNodeSelection = _f.toggleNodeSelection, toggleExpandNode = _f.toggleExpandNode, expandAllBelowDepth = _f.expandAllBelowDepth, toggleExpandLevel = _f.toggleExpandLevel, collapseAllBelowDepth = _f.collapseAllBelowDepth, selectNode = _f.selectNode, scrollToNode = _f.scrollToNode, virtualizer = _f.virtualizer;
    return (<div className="grid h-full grid-rows-[2.5rem_1fr_3.25rem] overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-border">
        <SearchField onChange={setFilterText}/>
        <div className="flex items-center gap-2">
          <react_1.Switch variant="small" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["In Process Only"], ["In Process Only"])))} checked={wipOnly} onCheckedChange={function (e) { return setWipOnly(e.valueOf()); }}/>
          <react_1.Switch variant="small" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Show Durations"], ["Show Durations"])))} checked={showDurations} onCheckedChange={function (e) { return setShowDurations(e.valueOf()); }}/>
        </div>
      </div>
      <react_1.ResizablePanelGroup direction="horizontal" onLayout={function (layout) {
            if (layout.length !== 2)
                return;
            (0, resizable_panels_1.setResizableGanttSettings)(document, layout);
        }}>
        {/* Tree list */}
        <react_1.ResizablePanel order={1} minSize={20} defaultSize={50} className="pl-3">
          <div className="grid h-full grid-rows-[2rem_1fr] overflow-hidden">
            <div className="flex items-center pr-2">
              {parentReadableId && (<ShowParentLink ganttReadableId={parentReadableId}/>)}
              <LiveReloadingStatus rootSpanCompleted={rootSpanStatus !== "inprogress"}/>
            </div>
            <TreeView_1.TreeView parentRef={parentRef} scrollRef={treeScrollRef} virtualizer={virtualizer} autoFocus tree={events} nodes={nodes} getNodeProps={getNodeProps} getTreeProps={getTreeProps} renderNode={function (_a) {
            var _b;
            var node = _a.node, state = _a.state;
            return (<>
                  <div className={(0, react_1.cn)("flex h-8 cursor-pointer items-center overflow-hidden rounded-l-sm pr-2", state.selected
                    ? "bg-muted hover:bg-accent"
                    : "bg-transparent hover:bg-accent")} onClick={function () {
                    selectNode(node.id);
                }}>
                    <div className="flex h-8 items-center">
                      {Array.from({ length: node.level }).map(function (_, index) { return (<TreeView_1.LevelLine key={index} isError={node.data.isError} isSelected={state.selected}/>); })}
                      <div className={(0, react_1.cn)("flex h-8 w-4 items-center", node.hasChildren && "hover:bg-accent")} onClick={function (e) {
                    e.stopPropagation();
                    if (e.altKey) {
                        if (state.expanded) {
                            collapseAllBelowDepth(node.level);
                        }
                        else {
                            expandAllBelowDepth(node.level);
                        }
                    }
                    else {
                        toggleExpandNode(node.id);
                    }
                    scrollToNode(node.id);
                }}>
                        {node.hasChildren ? (state.expanded ? (<lu_1.LuChevronDown className="h-4 w-4 text-gray-400"/>) : (<lu_1.LuChevronRight className="h-4 w-4 text-gray-400"/>)) : (<div className="h-8 w-4"/>)}
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-between gap-2 pl-1">
                      <div className="flex items-center gap-2 overflow-x-hidden">
                        <GanttIcon_1.GanttIcon name={(_b = node.data.style) === null || _b === void 0 ? void 0 : _b.icon} className="h-4 min-h-4 w-4 min-w-4"/>
                        <NodeText node={node}/>
                        {node.data.isRoot && (<react_1.Badge variant="outline" className="text-xs">
                            <macro_1.Trans>Job</macro_1.Trans>
                          </react_1.Badge>)}
                      </div>
                      <div className="flex items-center gap-1">
                        <NodeStatusIcon node={node}/>
                      </div>
                    </div>
                  </div>
                </>);
        }} onScroll={function (scrollTop) {
            //sync the scroll to the tree
            if (timelineScrollRef.current) {
                timelineScrollRef.current.scrollTop = scrollTop;
            }
        }}/>
          </div>
        </react_1.ResizablePanel>
        <react_1.ResizableHandle withHandle/>
        {/* Timeline */}
        <react_1.ResizablePanel order={2} minSize={20} defaultSize={50}>
          <GanttTimeline totalDuration={totalDuration} scale={scale} events={events} rootSpanStatus={rootSpanStatus} rootStartedAt={rootStartedAt} parentRef={parentRef} timelineScrollRef={timelineScrollRef} nodes={nodes} getNodeProps={getNodeProps} getTreeProps={getTreeProps} showDurations={showDurations} treeScrollRef={treeScrollRef} virtualizer={virtualizer} toggleNodeSelection={toggleNodeSelection}/>
        </react_1.ResizablePanel>
      </react_1.ResizablePanelGroup>
      <div className="flex items-center justify-between gap-2 border-t border-border px-2">
        <div className="grow @container">
          <div className="hidden items-center gap-4 @[42rem]:flex">
            <KeyboardShortcuts expandAllBelowDepth={expandAllBelowDepth} collapseAllBelowDepth={collapseAllBelowDepth} toggleExpandLevel={toggleExpandLevel} setShowDurations={setShowDurations}/>
          </div>
          <div className="@[42rem]:hidden">
            <react_1.Popover>
              <react_1.PopoverTrigger className="text-sm">
                <macro_1.Trans>Shortcuts</macro_1.Trans>
              </react_1.PopoverTrigger>
              <react_1.PopoverContent className="min-w-[20rem] overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" align="start">
                <div className="flex flex-col gap-2">
                  <KeyboardShortcuts expandAllBelowDepth={expandAllBelowDepth} collapseAllBelowDepth={collapseAllBelowDepth} toggleExpandLevel={toggleExpandLevel} setShowDurations={setShowDurations}/>
                </div>
              </react_1.PopoverContent>
            </react_1.Popover>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <react_1.Slider className="w-20" 
    // @ts-expect-error TS2322 - TODO: fix type
    leftIcon={<lu_1.LuZoomOut />} rightIcon={<lu_1.LuZoomIn />} value={[scale]} onValueChange={function (value) { return setScale(value[0]); }} min={0} max={1} step={0.05}/>
        </div>
      </div>
    </div>);
};
exports.default = Gantt;
var TICK_COUNT = 5;
var GanttTimeline = function (_a) {
    var _b;
    var totalDuration = _a.totalDuration, scale = _a.scale, rootSpanStatus = _a.rootSpanStatus, rootStartedAt = _a.rootStartedAt, parentRef = _a.parentRef, timelineScrollRef = _a.timelineScrollRef, virtualizer = _a.virtualizer, events = _a.events, nodes = _a.nodes, getNodeProps = _a.getNodeProps, getTreeProps = _a.getTreeProps, toggleNodeSelection = _a.toggleNodeSelection, showDurations = _a.showDurations, treeScrollRef = _a.treeScrollRef;
    var timelineContainerRef = (0, react_2.useRef)(null);
    var initialTimelineDimensions = (0, react_1.useInitialDimensions)(timelineContainerRef);
    var minTimelineWidth = (_b = initialTimelineDimensions === null || initialTimelineDimensions === void 0 ? void 0 : initialTimelineDimensions.width) !== null && _b !== void 0 ? _b : 300;
    var maxTimelineWidth = minTimelineWidth * 10;
    //we want to live-update the duration if the root span is still in progress
    var _c = (0, react_2.useState)(totalDuration), duration = _c[0], setDuration = _c[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (rootSpanStatus !== "inprogress" || !rootStartedAt) {
            setDuration(totalDuration);
            return;
        }
        var interval = setInterval(function () {
            setDuration(Date.now() - rootStartedAt.getTime());
        }, 5000);
        return function () { return clearInterval(interval); };
    }, [totalDuration, rootSpanStatus]);
    return (<div className="h-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" ref={timelineContainerRef}>
      <Timeline.Root durationMs={duration * 1.05} scale={scale} className="h-full overflow-hidden" minWidth={minTimelineWidth} maxWidth={maxTimelineWidth}>
        {/* Follows the cursor */}
        <CurrentTimeIndicator totalDuration={duration}/>

        <Timeline.Row className="grid h-full grid-rows-[2rem_1fr]">
          {/* The duration labels */}
          <Timeline.Row>
            <Timeline.Row className="h-6">
              <Timeline.EquallyDistribute count={TICK_COUNT}>
                {function (ms, index) {
            if (index === TICK_COUNT - 1)
                return null;
            return (<Timeline.Point ms={ms} className={"relative bottom-[2px] text-xxs text-text-dimmed"}>
                      {function (ms) { return (<div className={(0, react_1.cn)("whitespace-nowrap", index === 0
                        ? "ml-1"
                        : index === TICK_COUNT - 1
                            ? "-ml-1 -translate-x-full"
                            : "-translate-x-1/2")}>
                          {(0, utils_1.formatDurationMilliseconds)(ms, {
                        style: "short",
                        maxDecimalPoints: ms < 1000 ? 0 : 1
                    })}
                        </div>); }}
                    </Timeline.Point>);
        }}
              </Timeline.EquallyDistribute>
              {rootSpanStatus !== "inprogress" && (<Timeline.Point ms={duration} className={(0, react_1.cn)("relative bottom-[2px] text-xxs", rootSpanStatus === "completed"
                ? "text-emerald-500"
                : "text-destructive")}>
                  {function (ms) { return (<div className={(0, react_1.cn)("-translate-x-1/2 whitespace-nowrap")}>
                      {(0, utils_1.formatDurationMilliseconds)(ms, {
                    style: "short",
                    maxDecimalPoints: ms < 1000 ? 0 : 1
                })}
                    </div>); }}
                </Timeline.Point>)}
            </Timeline.Row>
            <Timeline.Row className="h-2">
              <Timeline.EquallyDistribute count={TICK_COUNT}>
                {function (ms, index) {
            if (index === 0 || index === TICK_COUNT - 1)
                return null;
            return (<Timeline.Point ms={ms} className={"h-full border-r border-muted"}/>);
        }}
              </Timeline.EquallyDistribute>
              <Timeline.Point ms={duration} className={(0, react_1.cn)("h-full border-r", rootSpanStatus === "completed"
            ? "border-success/30"
            : "border-error/30")}/>
            </Timeline.Row>
          </Timeline.Row>
          {/* Main timeline body */}
          <Timeline.Row className="overflow-hidden">
            {/* The vertical tick lines */}
            <Timeline.EquallyDistribute count={TICK_COUNT}>
              {function (ms, index) {
            if (index === 0)
                return null;
            return (<Timeline.Point ms={ms} className={"h-full border-r border-muted"}/>);
        }}
            </Timeline.EquallyDistribute>
            {/* The completed line  */}
            {rootSpanStatus !== "inprogress" && (<Timeline.Point ms={duration} className={(0, react_1.cn)("h-full border-r", rootSpanStatus === "completed"
                ? "border-emerald-500/90"
                : "border-destructive/30")}/>)}
            <TreeView_1.TreeView scrollRef={timelineScrollRef} virtualizer={virtualizer} tree={events} nodes={nodes} getNodeProps={getNodeProps} getTreeProps={getTreeProps} parentClassName="h-full scrollbar-hide" renderNode={function (_a) {
            var node = _a.node, state = _a.state, index = _a.index, virtualizer = _a.virtualizer, virtualItem = _a.virtualItem;
            return (<Timeline.Row key={index} className={(0, react_1.cn)("group flex h-8 items-center", state.selected
                    ? "bg-muted hover:bg-accent"
                    : "bg-transparent hover:bg-muted")} 
            // onMouseOver={() => console.log(`hover ${index}`)}
            onClick={function (e) {
                    toggleNodeSelection(node.id);
                }}>
                    {node.data.level === "TRACE" ? (<SpanWithDuration showDuration={state.selected ? true : showDurations} startMs={node.data.offset} durationMs={node.data.duration
                        ? node.data.duration
                        : duration - node.data.offset} node={node}/>) : (<Timeline.Point ms={node.data.offset}>
                        {function (ms) { return (<framer_motion_1.motion.div className={(0, react_1.cn)("-ml-1 h-3 w-3 rounded-full", (0, SpanTitle_1.eventBackgroundClassName)(node.data))} layoutId={node.id}/>); }}
                      </Timeline.Point>)}
                  </Timeline.Row>);
        }} onScroll={function (scrollTop) {
            //sync the scroll to the tree
            if (treeScrollRef.current) {
                treeScrollRef.current.scrollTop = scrollTop;
            }
        }}/>
          </Timeline.Row>
        </Timeline.Row>
      </Timeline.Root>
    </div>);
};
function NodeText(_a) {
    var node = _a.node;
    var className = "line-clamp-1";
    return (<react_1.Paragraph variant="small" className={(0, react_1.cn)(className)}>
      <SpanTitle_1.SpanTitle {...node.data} size="small"/>
    </react_1.Paragraph>);
}
function NodeStatusIcon(_a) {
    var node = _a.node;
    if (node.data.isCancelled) {
        return (<>
        <react_1.Paragraph variant="extra-small" className={(0, GanttTaskStatus_1.runStatusClassNameColor)("CANCELED")}>
          <macro_1.Trans>Canceled</macro_1.Trans>
        </react_1.Paragraph>
        <GanttTaskStatus_1.GanttTaskStatusIcon status="CANCELED" className={(0, react_1.cn)("w-4 h-4")}/>
      </>);
    }
    if (node.data.isError) {
        return (<GanttTaskStatus_1.GanttTaskStatusIcon status="COMPLETED_WITH_ERRORS" className={(0, react_1.cn)("w-4 h-4")}/>);
    }
    if (node.data.isPartial) {
        return (<GanttTaskStatus_1.GanttTaskStatusIcon status={"EXECUTING"} className={(0, react_1.cn)("w-4 h-4")}/>);
    }
    return (<GanttTaskStatus_1.GanttTaskStatusIcon status="COMPLETED_SUCCESSFULLY" className={(0, react_1.cn)("w-4 h-4")}/>);
}
function ShowParentLink(_a) {
    var ganttReadableId = _a.ganttReadableId;
    var _b = (0, react_2.useState)(false), mouseOver = _b[0], setMouseOver = _b[1];
    var spanParam = (0, react_router_1.useParams)().spanParam;
    return (<react_1.Button onMouseEnter={function () { return setMouseOver(true); }} onMouseLeave={function () { return setMouseOver(false); }} asChild className="w-full text-left flex-1">
      <react_router_1.Link to={spanParam
            ? "/x/scheduling/runs?span=" + spanParam
            : "x/scheduling/runs"}>
        {mouseOver ? (<ShowParentIcon_1.ShowParentIconSelected className="h-4 w-4 text-indigo-500"/>) : (<ShowParentIcon_1.ShowParentIcon className="text-gray-600 h-4 w-4"/>)}
        <react_1.Paragraph variant="small" className={(0, react_1.cn)(mouseOver ? "text-indigo-500" : "text-gray-500")}>
          <macro_1.Trans>Show parent items</macro_1.Trans>
        </react_1.Paragraph>
      </react_router_1.Link>
    </react_1.Button>);
}
function LiveReloadingStatus(_a) {
    var rootSpanCompleted = _a.rootSpanCompleted;
    if (rootSpanCompleted)
        return null;
    return (<div className="flex items-center gap-1">
      <react_1.PulsingDot />
      <react_1.Paragraph variant="extra-small" className="whitespace-nowrap text-primary">
        <macro_1.Trans>Live reloading</macro_1.Trans>
      </react_1.Paragraph>
    </div>);
}
function SpanWithDuration(_a) {
    var showDuration = _a.showDuration, node = _a.node, props = __rest(_a, ["showDuration", "node"]);
    return (<Timeline.Span {...props}>
      <framer_motion_1.motion.div className={(0, react_1.cn)("relative flex h-4 w-full min-w-[2px] items-center rounded-sm", (0, SpanTitle_1.eventBackgroundClassName)(node.data))} layoutId={node.id}>
        {node.data.isPartial && (<div className="absolute left-0 top-0 h-full w-full animate-tile-scroll rounded-sm opacity-30" style={{
                backgroundImage: "url(".concat(error_banner_tile_2x_png_1.default, ")"),
                backgroundSize: "8px 8px"
            }}/>)}
        <div className={(0, react_1.cn)("sticky left-0 z-10 transition group-hover:opacity-100", !showDuration && "opacity-0")}>
          <div className="rounded-sm px-1 py-0.5 text-xxs text-foreground">
            {(0, utils_1.formatDurationMilliseconds)(props.durationMs, {
            style: "short",
            maxDecimalPoints: props.durationMs < 1000 ? 0 : 1
        })}
          </div>
        </div>
      </framer_motion_1.motion.div>
    </Timeline.Span>);
}
var edgeBoundary = 0.05;
function CurrentTimeIndicator(_a) {
    var totalDuration = _a.totalDuration;
    return (<Timeline.FollowCursor>
      {function (ms) {
            var ratio = ms / totalDuration;
            var offset = 0.5;
            if (ratio < edgeBoundary) {
                offset = (0, utils_1.lerp)(0, 0.5, ratio / edgeBoundary);
            }
            else if (ratio > 1 - edgeBoundary) {
                offset = (0, utils_1.lerp)(0.5, 1, (ratio - (1 - edgeBoundary)) / edgeBoundary);
            }
            return (<div className="relative z-50 flex h-full flex-col">
            <div className="relative flex h-6 items-end">
              <div className="absolute w-fit whitespace-nowrap rounded-sm border border-border bg-gray-700 px-1 py-0.5 text-xxs text-text-bright" style={{
                    left: "".concat(offset * 100, "%"),
                    transform: "translateX(-".concat(offset * 100, "%)")
                }}>
                {(0, utils_1.formatDurationMilliseconds)(ms, {
                    style: "short",
                    maxDecimalPoints: ms < 1000 ? 0 : 1
                })}
              </div>
            </div>
            <div className="w-px grow border-r border-border"/>
          </div>);
        }}
    </Timeline.FollowCursor>);
}
function KeyboardShortcuts(_a) {
    var expandAllBelowDepth = _a.expandAllBelowDepth, collapseAllBelowDepth = _a.collapseAllBelowDepth, toggleExpandLevel = _a.toggleExpandLevel, setShowDurations = _a.setShowDurations;
    var t = (0, macro_1.useLingui)().t;
    return (<>
      <ArrowKeyShortcuts />
      <ShortcutWithAction shortcut={{ key: "e" }} action={function () { return expandAllBelowDepth(0); }} title={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Expand all"], ["Expand all"])))}/>
      <ShortcutWithAction shortcut={{ key: "c" }} action={function () { return collapseAllBelowDepth(1); }} title={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Collapse all"], ["Collapse all"])))}/>
      <NumberShortcuts toggleLevel={function (number) { return toggleExpandLevel(number); }}/>
      <ShortcutWithAction shortcut={{ key: "d" }} action={function () { return setShowDurations(function (d) { return !d; }); }} title={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Toggle durations"], ["Toggle durations"])))}/>
    </>);
}
function ArrowKeyShortcuts() {
    return (<div className="flex items-center gap-0.5">
      <react_1.ShortcutKey shortcut={{ key: "arrowup" }} variant="medium" className="ml-0 mr-0"/>
      <react_1.ShortcutKey shortcut={{ key: "arrowdown" }} variant="medium" className="ml-0 mr-0"/>
      <react_1.ShortcutKey shortcut={{ key: "arrowleft" }} variant="medium" className="ml-0 mr-0"/>
      <react_1.ShortcutKey shortcut={{ key: "arrowright" }} variant="medium" className="ml-0 mr-0"/>
      <react_1.Paragraph variant="extra-small" className="ml-1.5 whitespace-nowrap">
        <macro_1.Trans>Navigate</macro_1.Trans>
      </react_1.Paragraph>
    </div>);
}
function ShortcutWithAction(_a) {
    var shortcut = _a.shortcut, title = _a.title, action = _a.action;
    (0, react_1.useShortcutKeys)({
        shortcut: shortcut,
        action: action
    });
    return (<div className="flex items-center gap-0.5">
      <react_1.ShortcutKey shortcut={shortcut} variant="medium" className="ml-0 mr-0"/>
      <react_1.Paragraph variant="extra-small" className="ml-1.5 whitespace-nowrap">
        {title}
      </react_1.Paragraph>
    </div>);
}
function NumberShortcuts(_a) {
    var toggleLevel = _a.toggleLevel;
    (0, react_hotkeys_hook_1.useHotkeys)(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], function (event, hotkeysEvent) {
        toggleLevel(Number(event.key));
    });
    return (<div className="flex items-center gap-0.5">
      <span className={(0, react_1.cn)(react_1.shortcutKeyVariants.medium, "ml-0 mr-0")}>0</span>
      <span className="text-[0.75rem] text-text-dimmed">–</span>
      <span className={(0, react_1.cn)(react_1.shortcutKeyVariants.medium, "ml-0 mr-0")}>9</span>
      <react_1.Paragraph variant="extra-small" className="ml-1.5 whitespace-nowrap">
        <macro_1.Trans>Toggle level</macro_1.Trans>
      </react_1.Paragraph>
    </div>);
}
function SearchField(_a) {
    var onChange = _a.onChange;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(""), value = _b[0], setValue = _b[1];
    var updateFilterText = (0, react_1.useDebounce)(function (text) {
        onChange(text);
    }, 250);
    var updateValue = function (value) {
        setValue(value);
        updateFilterText(value);
    };
    return (<react_1.InputGroup insetRing className="border-transparent rounded-none ring-0">
      <react_1.InputLeftElement>
        <lu_1.LuSearch className="h-4 w-4 text-muted-foreground"/>
      </react_1.InputLeftElement>
      <react_1.Input placeholder={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Search Job"], ["Search Job"])))} value={value} onChange={function (e) { return updateValue(e.target.value); }}/>
    </react_1.InputGroup>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
