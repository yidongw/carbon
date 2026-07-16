"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesTreeView = CompaniesTreeView;
var react_1 = require("@xyflow/react");
var react_2 = require("react");
require("@xyflow/react/dist/style.css");
var CompanyNode_1 = require("./CompanyNode");
var layout_utils_1 = require("./layout-utils");
var nodeTypes = {
    subsidiary: CompanyNode_1.CompanyNode
};
function CompaniesTreeView(_a) {
    var companies = _a.companies, onEdit = _a.onEdit, onDelete = _a.onDelete, onAddChild = _a.onAddChild;
    var _b = (0, react_2.useMemo)(function () {
        var nodes = companies.map(function (company) { return ({
            id: company.id,
            type: "subsidiary",
            position: { x: 0, y: 0 },
            draggable: false,
            data: {
                company: company,
                isEliminationEntity: company.isEliminationEntity,
                onEdit: onEdit,
                onDelete: onDelete,
                onAddChild: onAddChild
            }
        }); });
        var edges = companies
            .filter(function (c) { return c.parentCompanyId !== null; })
            .map(function (company) { return ({
            id: "".concat(company.parentCompanyId, "-").concat(company.id),
            source: company.parentCompanyId,
            target: company.id,
            type: "smoothstep",
            style: { stroke: "hsl(var(--border))", strokeWidth: 1.5 }
        }); });
        var _a = (0, layout_utils_1.getLayoutedElements)(nodes, edges, "TB"), layoutedNodes = _a.nodes, layoutedEdges = _a.edges;
        return { initialNodes: layoutedNodes, initialEdges: layoutedEdges };
    }, [companies, onEdit, onDelete, onAddChild]), initialNodes = _b.initialNodes, initialEdges = _b.initialEdges;
    var _c = (0, react_1.useNodesState)(initialNodes), nodes = _c[0], setNodes = _c[1], onNodesChange = _c[2];
    var _d = (0, react_1.useEdgesState)(initialEdges), edges = _d[0], setEdges = _d[1], onEdgesChange = _d[2];
    (0, react_2.useEffect)(function () {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);
    return (<div className="h-[calc(100dvh-(var(--header-height))-61px)] w-full overflow-hidden">
      <react_1.ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodeTypes={nodeTypes} connectionLineType={react_1.ConnectionLineType.SmoothStep} fitView fitViewOptions={{
            padding: 0.3,
            maxZoom: 1.2,
            minZoom: 0.3
        }} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} panOnScroll zoomOnScroll minZoom={0.15} maxZoom={2} proOptions={{ hideAttribution: true }}>
        <react_1.Controls showInteractive={false} className="!bg-card !border-border !shadow-sm [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-accent"/>
        <react_1.Background variant={react_1.BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--border))"/>
      </react_1.ReactFlow>
    </div>);
}
