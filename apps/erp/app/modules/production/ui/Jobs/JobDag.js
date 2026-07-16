"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobDag = JobDag;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var dagre_1 = require("@dagrejs/dagre");
var react_2 = require("@xyflow/react");
require("@xyflow/react/dist/style.css");
var react_3 = require("react");
var lu_1 = require("react-icons/lu");
var JobOperationEdge_1 = require("./JobOperationEdge");
var JobOperationNode_1 = require("./JobOperationNode");
var NODE_WIDTH = 200;
var NODE_HEIGHT = 90;
var nodeTypes = {
    jobOperation: JobOperationNode_1.JobOperationNode
};
var edgeTypes = {
    jobOperationEdge: JobOperationEdge_1.JobOperationEdge
};
var proOptions = { hideAttribution: true };
function computeLayout(operations, dependencies, direction) {
    var g = new dagre_1.default.graphlib.Graph();
    g.setGraph({
        rankdir: direction,
        nodesep: 80,
        ranksep: 120,
        edgesep: 30,
        marginx: 40,
        marginy: 40
    });
    g.setDefaultEdgeLabel(function () { return ({}); });
    var opsById = new Map(operations.map(function (op) { return [op.id, op]; }));
    for (var _i = 0, operations_1 = operations; _i < operations_1.length; _i++) {
        var op = operations_1[_i];
        g.setNode(op.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    }
    for (var _a = 0, dependencies_1 = dependencies; _a < dependencies_1.length; _a++) {
        var dep = dependencies_1[_a];
        g.setEdge(dep.dependsOnId, dep.operationId);
    }
    dagre_1.default.layout(g);
    var isHorizontal = direction === "LR";
    var nodes = operations.map(function (op) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var pos = g.node(op.id);
        return {
            id: op.id,
            type: "jobOperation",
            position: {
                x: pos.x - NODE_WIDTH / 2,
                y: pos.y - NODE_HEIGHT / 2
            },
            data: {
                description: (_a = op.description) !== null && _a !== void 0 ? _a : "Untitled",
                itemId: (_d = (_c = (_b = op.jobMakeMethod) === null || _b === void 0 ? void 0 : _b.item) === null || _c === void 0 ? void 0 : _c.readableIdWithRevision) !== null && _d !== void 0 ? _d : null,
                status: (_e = op.status) !== null && _e !== void 0 ? _e : "Todo",
                quantityComplete: Number((_f = op.quantityComplete) !== null && _f !== void 0 ? _f : 0),
                targetQuantity: Number((_g = op.targetQuantity) !== null && _g !== void 0 ? _g : 0),
                quantityReworked: Number((_h = op.quantityReworked) !== null && _h !== void 0 ? _h : 0),
                quantityScrapped: Number((_j = op.quantityScrapped) !== null && _j !== void 0 ? _j : 0),
                direction: direction
            },
            sourcePosition: isHorizontal ? react_2.Position.Right : react_2.Position.Bottom,
            targetPosition: isHorizontal ? react_2.Position.Left : react_2.Position.Top
        };
    });
    var edges = dependencies.map(function (dep) {
        var _a;
        var upstream = opsById.get(dep.dependsOnId);
        return {
            id: "".concat(dep.dependsOnId, "-").concat(dep.operationId),
            source: dep.dependsOnId,
            target: dep.operationId,
            type: "jobOperationEdge",
            data: {
                quantity: Number((_a = upstream === null || upstream === void 0 ? void 0 : upstream.quantityComplete) !== null && _a !== void 0 ? _a : 0)
            }
        };
    });
    return { nodes: nodes, edges: edges };
}
function JobDagInner(_a) {
    var operations = _a.operations, dependencies = _a.dependencies;
    var _b = (0, react_3.useState)("LR"), direction = _b[0], setDirection = _b[1];
    var fitView = (0, react_2.useReactFlow)().fitView;
    var _c = (0, react_3.useMemo)(function () { return computeLayout(operations, dependencies, direction); }, [operations, dependencies, direction]), layoutNodes = _c.nodes, layoutEdges = _c.edges;
    var _d = (0, react_2.useNodesState)(layoutNodes), nodes = _d[0], setNodes = _d[1], onNodesChange = _d[2];
    var _e = (0, react_2.useEdgesState)(layoutEdges), edges = _e[0], setEdges = _e[1], onEdgesChange = _e[2];
    (0, react_3.useEffect)(function () {
        setNodes(layoutNodes);
        setEdges(layoutEdges);
        setTimeout(function () { return fitView({ padding: 0.1 }); }, 50);
    }, [layoutNodes, layoutEdges, setNodes, setEdges, fitView]);
    var toggleDirection = (0, react_3.useCallback)(function () {
        setDirection(function (d) { return (d === "LR" ? "TB" : "LR"); });
    }, []);
    var handleFitView = (0, react_3.useCallback)(function () {
        fitView({ padding: 0.1 });
    }, [fitView]);
    return (<div className="flex flex-col h-full w-full">
      <react_1.HStack className="border-b border-border px-3 py-1.5 bg-card" spacing={2}>
        <button type="button" onClick={toggleDirection} className={(0, react_1.cn)("h-7 px-2 rounded-md text-xs font-medium flex items-center gap-1.5", "border border-border bg-background hover:bg-accent/60 transition-colors")}>
          {direction === "LR" ? (<lu_1.LuArrowRight className="w-3.5 h-3.5"/>) : (<lu_1.LuArrowDown className="w-3.5 h-3.5"/>)}
          {direction === "LR" ? "Left to Right" : "Top to Bottom"}
        </button>
        <button type="button" onClick={handleFitView} className={(0, react_1.cn)("h-7 px-2 rounded-md text-xs font-medium flex items-center gap-1.5", "border border-border bg-background hover:bg-accent/60 transition-colors")}>
          <lu_1.LuMaximize className="w-3.5 h-3.5"/>
          Fit
        </button>
      </react_1.HStack>

      <div className="relative flex-1">
        <react_2.ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodeTypes={nodeTypes} edgeTypes={edgeTypes} proOptions={proOptions} fitView fitViewOptions={{ padding: 0.1 }} nodesDraggable={false} nodesConnectable={false} edgesFocusable={false} minZoom={0.1} maxZoom={2}>
          <react_2.Background gap={20} size={1}/>
          <react_2.MiniMap nodeStrokeWidth={3} pannable zoomable className="!bg-card !border-border"/>
        </react_2.ReactFlow>
        <DagLegend />
      </div>
    </div>);
}
function JobDag(props) {
    return (<react_2.ReactFlowProvider>
      <JobDagInner {...props}/>
    </react_2.ReactFlowProvider>);
}
function DagLegend() {
    var t = (0, macro_1.useLingui)().t;
    var entries = [
        { label: "Done", className: "border-green-500 bg-green-500" },
        { label: "In Progress", className: "border-blue-500 bg-blue-500" },
        { label: "Ready", className: "border-teal-500 bg-teal-500" },
        { label: "Waiting", className: "border-gray-400 bg-gray-400" },
        { label: "Todo", className: "border-gray-300 bg-gray-300" },
        { label: "Paused", className: "border-amber-500 bg-amber-500" },
        { label: "Canceled", className: "border-red-500 bg-red-500" }
    ];
    return (<div className="absolute bottom-3 left-3 z-20">
      <react_1.Popover>
        <react_1.PopoverTrigger asChild>
          <button type="button" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Show legend"], ["Show legend"])))} className={(0, react_1.cn)("h-8 w-8 rounded-md flex items-center justify-center transition-colors", "border border-border bg-card/90 backdrop-blur shadow-sm", "text-muted-foreground hover:text-foreground hover:bg-accent/60", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring")}>
            <lu_1.LuInfo className="w-4 h-4"/>
          </button>
        </react_1.PopoverTrigger>
        <react_1.PopoverContent side="top" align="start" className="w-auto p-3 border-border">
          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
            Operation Status
          </span>
          <react_1.VStack spacing={2}>
            {entries.map(function (entry) { return (<react_1.HStack key={entry.label} spacing={3} className="items-center">
                <div className={(0, react_1.cn)("w-4 h-4 rounded border-2", entry.className)}/>
                <span className="text-[13px] text-foreground">
                  {entry.label}
                </span>
              </react_1.HStack>); })}
          </react_1.VStack>
        </react_1.PopoverContent>
      </react_1.Popover>
    </div>);
}
var templateObject_1;
