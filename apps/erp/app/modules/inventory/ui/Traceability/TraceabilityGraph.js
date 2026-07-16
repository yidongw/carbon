"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceabilityGraph = TraceabilityGraph;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("@xyflow/react");
var react_3 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var shallow_1 = require("zustand/react/shallow");
var constants_1 = require("./constants");
var QuantityEdge_1 = require("./edges/QuantityEdge");
var GraphLegend_1 = require("./GraphLegend");
var GraphToolbar_1 = require("./GraphToolbar");
var useExpandNode_1 = require("./hooks/useExpandNode");
var useProbeBoundary_1 = require("./hooks/useProbeBoundary");
var metadata_1 = require("./metadata");
var NodeSearchDialog_1 = require("./NodeSearchDialog");
var ActivityNode_1 = require("./nodes/ActivityNode");
var EntityNode_1 = require("./nodes/EntityNode");
var store_1 = require("./store");
var TraceabilityTable_1 = require("./TraceabilityTable");
var utils_1 = require("./utils");
var hooks_1 = require("./worker/hooks");
var nodeTypes = {
    entity: EntityNode_1.EntityNode,
    activity: ActivityNode_1.ActivityNode
};
var edgeTypes = {
    quantity: QuantityEdge_1.QuantityEdge
};
var proOptions = { hideAttribution: true };
var EMPTY_NODES = [];
var EMPTY_EDGES = [];
function TraceabilityGraph(props) {
    return <TraceabilityGraphInner {...props}/>;
}
function TraceabilityGraphInner(_a) {
    var _b, _c, _d, _e, _f;
    var entities = _a.entities, activities = _a.activities, inputs = _a.inputs, outputs = _a.outputs, containments = _a.containments, rootId = _a.rootId, rootType = _a.rootType, width = _a.width, height = _a.height;
    var t = (0, macro_1.useLingui)().t;
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var fitView = (0, react_2.useReactFlow)().fitView;
    var nodesInitialized = (0, react_2.useNodesInitialized)();
    var lastFitSignatureRef = (0, react_3.useRef)("");
    var initialPayload = (0, react_3.useMemo)(function () { return ({
        entities: entities,
        activities: activities,
        inputs: inputs,
        outputs: outputs,
        containments: containments
    }); }, [entities, activities, inputs, outputs, containments]);
    var expansions = (0, store_1.useTraceabilityStore)(function (s) { return s.expansions; });
    var expandable = (0, store_1.useTraceabilityStore)(function (s) { return s.expandable; });
    var _g = (0, store_1.useTraceabilityStore)((0, shallow_1.useShallow)(function (s) { return ({
        addExpansion: s.addExpansion,
        removeExpansion: s.removeExpansion,
        markExpandable: s.markExpandable,
        markExhausted: s.markExhausted,
        reset: s.reset,
        setDirection: s.setDirection,
        setView: s.setView,
        setSpacing: s.setSpacing,
        setIsolate: s.setIsolate,
        toggleExcluded: s.toggleExcluded,
        clearExcluded: s.clearExcluded,
        toggleAdditionalRoot: s.toggleAdditionalRoot,
        clearAdditionalRoots: s.clearAdditionalRoots
    }); })), addExpansion = _g.addExpansion, removeExpansion = _g.removeExpansion, markExpandable = _g.markExpandable, markExhausted = _g.markExhausted, resetStore = _g.reset, setDirection = _g.setDirection, setView = _g.setView, setSpacing = _g.setSpacing, setIsolate = _g.setIsolate, toggleExcluded = _g.toggleExcluded, clearExcluded = _g.clearExcluded, toggleAdditionalRoot = _g.toggleAdditionalRoot, clearAdditionalRoots = _g.clearAdditionalRoots;
    var excludedIds = (0, store_1.useTraceabilityStore)(function (s) { return s.excludedIds; });
    var additionalRootIds = (0, store_1.useTraceabilityStore)(function (s) { return s.additionalRootIds; });
    var probeCacheRef = (0, react_3.useRef)(new Map());
    var probedRef = (0, react_3.useRef)(new Set());
    // biome-ignore lint/correctness/useExhaustiveDependencies: reset on payload identity change (loader refetch)
    (0, react_3.useEffect)(function () {
        resetStore(rootId);
        probeCacheRef.current = new Map();
        probedRef.current = new Set();
    }, [initialPayload, resetStore, rootId]);
    var payload = (0, react_3.useMemo)(function () {
        var merged = initialPayload;
        for (var _i = 0, _a = expansions.values(); _i < _a.length; _i++) {
            var exp = _a[_i];
            merged = (0, utils_1.mergePayloads)(merged, exp);
        }
        return merged;
    }, [initialPayload, expansions]);
    var direction = (0, store_1.useTraceabilityStore)(function (s) { return s.direction; });
    var view = (0, store_1.useTraceabilityStore)(function (s) { return s.view; });
    var spacing = (0, store_1.useTraceabilityStore)(function (s) { return s.spacing; });
    var isolate = (0, store_1.useTraceabilityStore)(function (s) { return s.isolate; });
    var _h = (0, react_3.useState)(false), searchOpen = _h[0], setSearchOpen = _h[1];
    var _j = (0, react_3.useState)(0), layoutVersion = _j[0], setLayoutVersion = _j[1];
    (0, react_3.useEffect)(function () {
        var onKey = function (e) {
            var isMeta = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
            if (e.key === "/" || isMeta) {
                var target = e.target;
                if (target &&
                    (target.tagName === "INPUT" ||
                        target.tagName === "TEXTAREA" ||
                        target.isContentEditable)) {
                    if (!isMeta)
                        return;
                }
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener("keydown", onKey);
        return function () { return window.removeEventListener("keydown", onKey); };
    }, []);
    var handleRelayout = (0, react_3.useCallback)(function () {
        setLayoutVersion(function (v) { return v + 1; });
    }, []);
    var _k = (0, react_3.useState)(new Set()), draggedIds = _k[0], setDraggedIds = _k[1];
    var _l = (0, react_3.useState)(false), fitted = _l[0], setFitted = _l[1];
    (0, react_3.useEffect)(function () {
        if (view === "graph") {
            lastFitSignatureRef.current = "";
            setFitted(false);
        }
    }, [view]);
    var rejectIds = (0, react_3.useMemo)(function () {
        var set = new Set();
        for (var _i = 0, _a = payload.entities; _i < _a.length; _i++) {
            var e = _a[_i];
            if (e.status === "Rejected")
                set.add(e.id);
        }
        return set;
    }, [payload.entities]);
    var tracingGraphManager = (0, hooks_1.useTracingGraphManager)();
    var layoutResult = (0, hooks_1.useAsyncLayout)(tracingGraphManager, payload, direction, spacing, rejectIds, layoutVersion);
    var laidNodes = (_b = layoutResult === null || layoutResult === void 0 ? void 0 : layoutResult.nodes) !== null && _b !== void 0 ? _b : EMPTY_NODES;
    var laidEdges = (_c = layoutResult === null || layoutResult === void 0 ? void 0 : layoutResult.edges) !== null && _c !== void 0 ? _c : EMPTY_EDGES;
    var _m = (0, react_2.useNodesState)(laidNodes), nodes = _m[0], setNodes = _m[1], onNodesChangeRaw = _m[2];
    var _o = (0, react_2.useEdgesState)(laidEdges), edges = _o[0], setEdges = _o[1], onEdgesChange = _o[2];
    var shiftDownRef = (0, react_3.useRef)(false);
    var _p = (0, react_3.useState)(false), shiftHeld = _p[0], setShiftHeld = _p[1];
    (0, react_3.useEffect)(function () {
        var onDown = function (e) {
            // Auto-repeat fires keydown continuously; bail if already tracked.
            if (e.key !== "Shift" || shiftDownRef.current)
                return;
            shiftDownRef.current = true;
            setShiftHeld(true);
        };
        var onUp = function (e) {
            if (e.key !== "Shift" || !shiftDownRef.current)
                return;
            shiftDownRef.current = false;
            setShiftHeld(false);
        };
        var onBlur = function () {
            if (!shiftDownRef.current)
                return;
            shiftDownRef.current = false;
            setShiftHeld(false);
        };
        window.addEventListener("keydown", onDown);
        window.addEventListener("keyup", onUp);
        window.addEventListener("blur", onBlur);
        return function () {
            window.removeEventListener("keydown", onDown);
            window.removeEventListener("keyup", onUp);
            window.removeEventListener("blur", onBlur);
        };
    }, []);
    var onNodesChange = (0, react_3.useCallback)(function (changes) {
        if (shiftDownRef.current) {
            var filtered = changes.filter(function (c) { return c.type !== "select"; });
            if (filtered.length > 0)
                onNodesChangeRaw(filtered);
            return;
        }
        onNodesChangeRaw(changes);
    }, [onNodesChangeRaw]);
    var selectionPathRef = (0, react_3.useRef)(null);
    var additionalRootIdsRef = (0, react_3.useRef)(additionalRootIds);
    additionalRootIdsRef.current = additionalRootIds;
    var excludedIdsRef = (0, react_3.useRef)(excludedIds);
    excludedIdsRef.current = excludedIds;
    var onNodeClick = (0, react_3.useCallback)(function (event, node) {
        var _a, _b;
        if (event.shiftKey) {
            var id = node.id;
            if (excludedIdsRef.current.has(id)) {
                toggleExcluded(id);
                return;
            }
            if (additionalRootIdsRef.current.has(id)) {
                toggleAdditionalRoot(id);
                return;
            }
            var inPath = (_b = (_a = selectionPathRef.current) === null || _a === void 0 ? void 0 : _a.nodeIds.has(id)) !== null && _b !== void 0 ? _b : false;
            if (inPath)
                toggleExcluded(id);
            else
                toggleAdditionalRoot(id);
        }
        else {
            clearExcluded();
            clearAdditionalRoots();
        }
    }, [toggleExcluded, toggleAdditionalRoot, clearExcluded, clearAdditionalRoots]);
    var _q = (0, react_3.useState)(false), layoutAnimating = _q[0], setLayoutAnimating = _q[1];
    (0, react_3.useEffect)(function () {
        setNodes(laidNodes);
        setEdges(laidEdges);
        setDraggedIds(new Set());
        setLayoutAnimating(true);
        var t = setTimeout(function () { return setLayoutAnimating(false); }, 260);
        return function () { return clearTimeout(t); };
    }, [laidNodes, laidEdges, setNodes, setEdges]);
    var selectedIds = (0, react_3.useMemo)(function () {
        var out = [];
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].selected)
                out.push(nodes[i].id);
        }
        return out;
    }, [nodes]);
    var selectedIdSet = (0, react_3.useMemo)(function () { return new Set(selectedIds); }, [selectedIds]);
    var selectedId = (_d = selectedIds[0]) !== null && _d !== void 0 ? _d : null;
    var selectNode = (0, react_3.useCallback)(function (id) {
        setNodes(function (ns) {
            return ns.map(function (n) {
                var wantsSelected = id !== null && n.id === id;
                if (n.selected === wantsSelected)
                    return n;
                return __assign(__assign({}, n), { selected: wantsSelected });
            });
        });
    }, [setNodes]);
    var onExpandResult = (0, react_3.useCallback)(function (incoming, originId) {
        var knownEntityIds = new Set(payload.entities.map(function (e) { return e.id; }));
        var knownActivityIds = new Set(payload.activities.map(function (a) { return a.id; }));
        var hasNewEntity = incoming.entities.some(function (e) { return !knownEntityIds.has(e.id); });
        var hasNewActivity = incoming.activities.some(function (a) { return !knownActivityIds.has(a.id); });
        if (!hasNewEntity && !hasNewActivity) {
            markExhausted(originId);
            return;
        }
        addExpansion(originId, incoming);
    }, [payload, markExhausted, addExpansion]);
    var _r = (0, useExpandNode_1.useExpandNode)(onExpandResult), expand = _r.expand, isExpanding = _r.isLoading;
    var onExpandNode = (0, react_3.useCallback)(function (id, direction) {
        var cached = probeCacheRef.current.get(id);
        if (cached) {
            addExpansion(id, cached);
            return;
        }
        expand(id, direction, 1);
    }, [expand, addExpansion]);
    var onCollapseNode = (0, react_3.useCallback)(function (id) {
        removeExpansion(id);
    }, [removeExpansion]);
    var selectionPath = (0, hooks_1.useAsyncSelectionPath)(tracingGraphManager, edges, selectedIds, excludedIds, additionalRootIds);
    selectionPathRef.current = selectionPath;
    var isolated = (0, react_3.useMemo)(function () {
        if (!isolate)
            return null;
        if (selectedIds.length === 0 && additionalRootIds.size === 0)
            return null;
        if (selectionPath)
            return selectionPath;
        var nodeIds = new Set(selectedIds);
        for (var _i = 0, additionalRootIds_1 = additionalRootIds; _i < additionalRootIds_1.length; _i++) {
            var id = additionalRootIds_1[_i];
            nodeIds.add(id);
        }
        return { nodeIds: nodeIds, edgeIds: new Set() };
    }, [isolate, selectedIds, additionalRootIds, selectionPath]);
    var boundaryByNode = (0, react_3.useMemo)(function () {
        var incoming = new Set();
        var outgoing = new Set();
        for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
            var e = edges_1[_i];
            incoming.add(e.target);
            outgoing.add(e.source);
        }
        return { incoming: incoming, outgoing: outgoing };
    }, [edges]);
    (0, useProbeBoundary_1.useProbeBoundary)({
        payload: payload,
        boundaryByNode: boundaryByNode,
        markExpandable: markExpandable,
        markExhausted: markExhausted,
        probeCacheRef: probeCacheRef,
        probedRef: probedRef
    });
    var containmentByEntity = (0, react_3.useMemo)(function () {
        var _a;
        var m = new Map();
        for (var _i = 0, _b = (_a = payload.containments) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
            var c = _b[_i];
            var prev = m.get(c.trackedEntityId);
            if (c.containmentStatus === "Uncontained" || !prev) {
                m.set(c.trackedEntityId, c.containmentStatus);
            }
        }
        return m;
    }, [payload.containments]);
    var enrichedNodes = (0, react_3.useMemo)(function () {
        var isJobRoot = rootType === "job";
        return nodes.map(function (n) {
            var _a, _b;
            var isRoot = !isJobRoot && n.id === rootId;
            var selected = selectedIdSet.has(n.id);
            var excluded = excludedIds.has(n.id);
            var inPath = !excluded && ((_a = selectionPath === null || selectionPath === void 0 ? void 0 : selectionPath.nodeIds.has(n.id)) !== null && _a !== void 0 ? _a : false);
            var dimmed = isolated ? !isolated.nodeIds.has(n.id) : false;
            var isExpanded = expansions.has(n.id);
            var isEntity = ((_b = n.data) === null || _b === void 0 ? void 0 : _b.kind) === "entity";
            var isExpandable = expandable.has(n.id);
            var canExpandUp = isEntity && isExpandable && !boundaryByNode.incoming.has(n.id);
            var canExpandDown = isEntity && isExpandable && !boundaryByNode.outgoing.has(n.id);
            var containmentStatus = isEntity
                ? containmentByEntity.get(n.id)
                : undefined;
            return __assign(__assign({}, n), { data: __assign(__assign({}, n.data), { isRoot: isRoot, selected: selected, inPath: inPath, dimmed: dimmed, excluded: excluded, isExpanded: isExpanded, canExpandUp: canExpandUp, canExpandDown: canExpandDown, containmentStatus: containmentStatus, onExpand: onExpandNode, onCollapse: onCollapseNode }), selected: selected });
        });
    }, [
        nodes,
        rootId,
        rootType,
        selectedIdSet,
        isolated,
        expansions,
        boundaryByNode,
        expandable,
        selectionPath,
        containmentByEntity,
        excludedIds,
        onExpandNode,
        onCollapseNode
    ]);
    var enrichedEdges = (0, react_3.useMemo)(function () {
        return edges.map(function (e) {
            var _a, _b;
            var dimmed = isolated ? !isolated.edgeIds.has(e.id) : false;
            var highlighted = (_a = selectionPath === null || selectionPath === void 0 ? void 0 : selectionPath.edgeIds.has(e.id)) !== null && _a !== void 0 ? _a : false;
            var touchesDragged = draggedIds.has(e.source) || draggedIds.has(e.target);
            var baseData = __assign({}, ((_b = e.data) !== null && _b !== void 0 ? _b : {}));
            if (touchesDragged)
                baseData.points = undefined;
            return __assign(__assign({}, e), { data: __assign(__assign({}, baseData), { dimmed: dimmed, highlighted: highlighted }) });
        });
    }, [edges, isolated, selectionPath, draggedIds]);
    (0, react_3.useEffect)(function () {
        if (!nodesInitialized)
            return;
        if (view !== "graph")
            return;
        if (nodes.length === 0)
            return;
        if (width === 0 || height === 0)
            return;
        var sig = "".concat(nodes.length, ":").concat(edges.length, ":").concat(rootId, ":").concat(direction, ":").concat(width, "x").concat(height);
        if (lastFitSignatureRef.current === sig)
            return;
        var isFirstFit = lastFitSignatureRef.current === "";
        lastFitSignatureRef.current = sig;
        var raf = requestAnimationFrame(function () {
            fitView({
                padding: 0.2,
                duration: isFirstFit ? 0 : 250,
                maxZoom: 1
            });
            requestAnimationFrame(function () { return setFitted(true); });
        });
        return function () { return cancelAnimationFrame(raf); };
    }, [
        nodesInitialized,
        nodes.length,
        edges.length,
        rootId,
        direction,
        view,
        width,
        height,
        fitView
    ]);
    var handleDepthChange = (0, react_3.useCallback)(function (next) {
        var params = new URLSearchParams(searchParams);
        params.set("depth", String(next));
        navigate("/x/traceability/graph?".concat(params.toString()));
    }, [navigate, searchParams]);
    if (view === "table") {
        return (<div className="relative w-full h-full" style={{ width: width, height: height }}>
        <div className="pt-14 w-full h-full overflow-auto">
          <TraceabilityTable_1.TraceabilityTable payload={payload} rootId={rootId} selectedId={selectedId} onSelect={function (id) { return selectNode(id); }}/>
        </div>
        <GraphToolbar_1.GraphToolbar depth={(0, constants_1.clampDepth)(Number((_e = searchParams.get("depth")) !== null && _e !== void 0 ? _e : 1))} onDepthChange={handleDepthChange} direction={direction} onDirectionChange={setDirection} view={view} onViewChange={setView} isolate={isolate} onIsolateChange={setIsolate} hasSelection={selectedIds.length > 0 || additionalRootIds.size > 0} onOpenSearch={function () { return setSearchOpen(true); }} spacing={spacing} onSpacingChange={setSpacing}/>
        <NodeSearchDialog_1.NodeSearchDialog open={searchOpen} onOpenChange={setSearchOpen} payload={payload} onSelect={function (id) { return selectNode(id); }}/>
      </div>);
    }
    return (<div className={(0, react_1.cn)("relative w-full h-full", layoutAnimating && "trace-layout-animating")} style={{ width: width, height: height }}>
      <style>{"\n        .trace-layout-animating .react-flow__node {\n          transition: transform 220ms cubic-bezier(0.645, 0.045, 0.355, 1);\n          will-change: transform;\n        }\n        .trace-fade-in {\n          transition: opacity 150ms cubic-bezier(0.215, 0.61, 0.355, 1);\n        }\n        .trace-edge-path {\n          transition: opacity 150ms cubic-bezier(0.215, 0.61, 0.355, 1),\n                      stroke-width 150ms cubic-bezier(0.215, 0.61, 0.355, 1);\n        }\n        @media (prefers-reduced-motion: reduce) {\n          .trace-layout-animating .react-flow__node { transition: none; }\n          .trace-fade-in { transition: none; }\n          .trace-edge-path { transition: none; }\n        }\n      "}</style>
      <react_2.ReactFlow nodes={enrichedNodes} edges={enrichedEdges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} className="trace-fade-in" style={{ opacity: fitted ? 1 : 0 }} onNodeDragStart={function (_, node) {
            return setDraggedIds(function (prev) {
                if (prev.has(node.id))
                    return prev;
                var next = new Set(prev);
                next.add(node.id);
                return next;
            });
        }} nodeTypes={nodeTypes} edgeTypes={edgeTypes} proOptions={proOptions} minZoom={0.15} maxZoom={3} nodesDraggable nodesConnectable={false} edgesFocusable={false} elevateNodesOnSelect={false} onlyRenderVisibleElements selectionKeyCode={null} multiSelectionKeyCode={null} onNodeClick={onNodeClick} defaultEdgeOptions={{ type: "quantity", zIndex: 0 }}>
        <react_2.Background variant={react_2.BackgroundVariant.Dots} gap={28} size={1} color="hsl(var(--muted-foreground) / 0.15)"/>
        <react_2.MiniMap pannable zoomable className="!bg-card !border-border" nodeColor={function (n) {
            var _a, _b;
            var data = n.data;
            if ((data === null || data === void 0 ? void 0 : data.kind) === "entity") {
                return (0, metadata_1.entityStatusMeta)((_a = data.entity) === null || _a === void 0 ? void 0 : _a.status).color;
            }
            return metadata_1.ACTIVITY_KIND_META[(0, metadata_1.activityKindFor)((_b = data === null || data === void 0 ? void 0 : data.activity) === null || _b === void 0 ? void 0 : _b.type)]
                .color;
        }} nodeStrokeWidth={0} maskColor="hsl(var(--background) / 0.7)"/>
      </react_2.ReactFlow>

      <GraphToolbar_1.GraphToolbar depth={Math.min(Math.max(1, Number((_f = searchParams.get("depth")) !== null && _f !== void 0 ? _f : 1)), 5)} onDepthChange={handleDepthChange} direction={direction} onDirectionChange={setDirection} view={view} onViewChange={setView} isolate={isolate} onIsolateChange={setIsolate} hasSelection={selectedIds.length > 0 || additionalRootIds.size > 0} onRelayout={handleRelayout} onOpenSearch={function () { return setSearchOpen(true); }} spacing={spacing} onSpacingChange={setSpacing}/>

      <GraphLegend_1.GraphLegend />

      <NodeSearchDialog_1.NodeSearchDialog open={searchOpen} onOpenChange={setSearchOpen} payload={payload} onSelect={function (id) { return selectNode(id); }}/>

      {isExpanding && (<div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 rounded-full border border-border bg-card px-3 py-1 text-xs shadow-sm">
          Loading...
        </div>)}

      {(function () {
            var _a;
            var traceCount = (_a = selectionPath === null || selectionPath === void 0 ? void 0 : selectionPath.nodeIds.size) !== null && _a !== void 0 ? _a : selectedIds.length + additionalRootIds.size;
            var traceActive = selectedIds.length > 0 ||
                additionalRootIds.size > 0 ||
                excludedIds.size > 0;
            var visible = shiftHeld || traceActive;
            if (!visible)
                return null;
            var clearAll = function () {
                if (selectedIds.length > 0)
                    selectNode(null);
                clearExcluded();
                clearAdditionalRoots();
            };
            return (<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 rounded-full border border-border bg-card/95 backdrop-blur pl-2 pr-1 py-1 text-xs shadow-md">
            {traceActive ? (<>
                <span className="px-1 tabular-nums font-medium">
                  {traceCount}
                </span>
                <span className="text-muted-foreground">in trace</span>
                <button type="button" onClick={clearAll} className="ml-1 flex items-center justify-center w-5 h-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Clear trace"], ["Clear trace"])))} title="Clear trace">
                  <lu_1.LuX className="w-3 h-3"/>
                </button>
              </>) : (<span className="px-1 flex items-center gap-1.5 text-muted-foreground">
                <kbd className="rounded border border-border bg-muted px-1 py-px font-mono text-[10px] leading-none text-foreground">
                  Shift
                </kbd>
                click to add or remove
              </span>)}
          </div>);
        })()}
    </div>);
}
var templateObject_1;
