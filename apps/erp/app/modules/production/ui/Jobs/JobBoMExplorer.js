"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Icons_1 = require("~/components/Icons");
var TreeView_1 = require("~/components/TreeView");
var hooks_1 = require("~/hooks");
var useIntegrations_1 = require("~/hooks/useIntegrations");
var ItemForm_1 = require("~/modules/items/ui/Item/ItemForm");
var bom_1 = require("~/utils/bom");
var path_1 = require("~/utils/path");
var JobBoMExplorer = function (_a) {
    var method = _a.method;
    var parentRef = (0, react_2.useRef)(null);
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var location = (0, hooks_1.useOptimisticLocation)();
    var _b = (0, react_2.useState)(""), filterText = _b[0], setFilterText = _b[1];
    var _c = (0, react_router_1.useParams)(), jobId = _c.jobId, methodId = _c.methodId;
    var fetchers = (0, react_router_1.useFetchers)();
    var getMethodFetcher = fetchers.find(function (f) { return f.formAction === path_1.path.to.jobMethodGet; });
    var isLoading = (getMethodFetcher === null || getMethodFetcher === void 0 ? void 0 : getMethodFetcher.state) === "loading";
    // Generate hierarchical BOM IDs (1, 1.1, 1.1.1, etc.)
    var bomIds = (0, react_2.useMemo)(function () { return (0, bom_1.generateBomIds)(method); }, [method]);
    var bomIdMap = (0, react_2.useMemo)(function () { return new Map(method.map(function (node, index) { return [node.id, bomIds[index]]; })); }, [method, bomIds]);
    var _d = (0, TreeView_1.useTree)({
        tree: method,
        // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
        onSelectedIdChanged: function () { },
        estimatedRowHeight: function () { return 32; },
        parentRef: parentRef,
        filter: {
            value: { text: filterText },
            fn: function (value, node) {
                if (value.text === "")
                    return true;
                if (node.data.description.toLowerCase().includes(value.text.toLowerCase())) {
                    return true;
                }
                return false;
            }
        },
        isEager: true
    }), nodes = _d.nodes, getTreeProps = _d.getTreeProps, getNodeProps = _d.getNodeProps, toggleExpandNode = _d.toggleExpandNode, expandAllBelowDepth = _d.expandAllBelowDepth, selectNode = _d.selectNode, collapseAllBelowDepth = _d.collapseAllBelowDepth, deselectAllNodes = _d.deselectAllNodes, virtualizer = _d.virtualizer;
    var allExpanded = (0, react_2.useMemo)(function () { return method.every(function (m) { var _a; return !m.hasChildren || ((_a = nodes[m.id]) === null || _a === void 0 ? void 0 : _a.expanded); }); }, [method, nodes]);
    var _e = (0, react_router_1.useSearchParams)(), searchParams = _e[0], setSearchParams = _e[1];
    var selectedMaterialId = searchParams.get("materialId");
    var isDetailsRoute = jobId && location.pathname === path_1.path.to.jobDetails(jobId);
    // biome-ignore lint/correctness/useExhaustiveDependencies: supress
    (0, react_2.useEffect)(function () {
        if (!selectedMaterialId) {
            if (isDetailsRoute) {
                var rootNode = method.find(function (m) { return m.data.isRoot; });
                if (rootNode) {
                    selectNode(rootNode.id);
                    return;
                }
            }
            deselectAllNodes();
            return;
        }
        if (selectedMaterialId) {
            var node = method.find(function (m) { return m.data.methodMaterialId === selectedMaterialId; });
            if (node) {
                selectNode(node.id);
            }
        }
        else if (methodId) {
            var node = method.find(function (m) { return m.data.jobMaterialMakeMethodId === methodId; });
            if (node) {
                selectNode(node.id);
            }
        }
    }, [selectedMaterialId, methodId, location.pathname, jobId]);
    return (<react_1.VStack className="flex-1 h-full w-full">
      {isLoading ? (<div className="flex items-center justify-center py-8 w-full">
          <react_1.Spinner className="w-4 h-4"/>
        </div>) : (<>
          <react_1.HStack className="w-full flex-shrink-0">
            <react_1.InputGroup size="sm" className="flex flex-grow">
              <react_1.InputLeftElement>
                <lu_1.LuSearch className="h-4 w-4"/>
              </react_1.InputLeftElement>
              <react_1.Input placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search..."], ["Search..."])))} value={filterText} onChange={function (e) { return setFilterText(e.target.value); }}/>
            </react_1.InputGroup>
            {jobId && (<react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger>
                  <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Actions"], ["Actions"])))} variant="ghost" size="sm" icon={<lu_1.LuEllipsisVertical />}/>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent align="end">
                  <react_1.DropdownMenuItem onClick={function () {
                    if (allExpanded) {
                        collapseAllBelowDepth(1);
                    }
                    else {
                        expandAllBelowDepth(0);
                    }
                }}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuChevronsUpDown />}/>
                    {allExpanded ? (<macro_1.Trans>Collapse all</macro_1.Trans>) : (<macro_1.Trans>Expand all</macro_1.Trans>)}
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuSeparator />
                  <react_1.DropdownMenuItem asChild>
                    <a href={path_1.path.to.api.jobBillOfMaterialsCsv(jobId, false)} target="_blank" rel="noreferrer">
                      <react_1.DropdownMenuIcon icon={<lu_1.LuTable />}/>
                      <div className="flex flex-grow items-center gap-4 justify-between">
                        <span>BoM</span>
                        <react_1.Badge variant="green" className="text-xs">
                          CSV
                        </react_1.Badge>
                      </div>
                    </a>
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem asChild>
                    <a href={path_1.path.to.api.jobBillOfMaterialsCsv(jobId, true)} target="_blank" rel="noreferrer">
                      <react_1.DropdownMenuIcon icon={<lu_1.LuTable />}/>
                      <div className="flex flex-grow items-center gap-4 justify-between">
                        <span>BoM + BoP</span>
                        <react_1.Badge variant="green" className="text-xs">
                          CSV
                        </react_1.Badge>
                      </div>
                    </a>
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem asChild>
                    <a href={path_1.path.to.api.jobBillOfMaterials(jobId, false)} target="_blank" rel="noreferrer">
                      <react_1.DropdownMenuIcon icon={<lu_1.LuBraces />}/>
                      <div className="flex flex-grow items-center gap-4 justify-between">
                        <span>BoM</span>
                        <react_1.Badge variant="outline" className="text-xs">
                          JSON
                        </react_1.Badge>
                      </div>
                    </a>
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem asChild>
                    <a href={path_1.path.to.api.jobBillOfMaterials(jobId, true)} target="_blank" rel="noreferrer">
                      <react_1.DropdownMenuIcon icon={<lu_1.LuBraces />}/>
                      <div className="flex flex-grow items-center gap-4 justify-between">
                        <span>BoM + BoP</span>
                        <react_1.Badge variant="outline" className="text-xs">
                          JSON
                        </react_1.Badge>
                      </div>
                    </a>
                  </react_1.DropdownMenuItem>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>)}
          </react_1.HStack>
          <div className="flex flex-1 min-h-0 w-full">
            <TreeView_1.TreeView parentRef={parentRef} virtualizer={virtualizer} autoFocus tree={method} nodes={nodes} getNodeProps={getNodeProps} getTreeProps={getTreeProps} renderNode={function (_a) {
                var node = _a.node, state = _a.state;
                return (<react_1.HoverCard openDelay={500} closeDelay={0}>
                  <react_1.HoverCardTrigger asChild>
                    <div key={node.id} className={(0, react_1.cn)("flex h-8 cursor-pointer items-center overflow-hidden rounded-sm pr-2 gap-1", state.selected
                        ? "bg-muted hover:bg-accent"
                        : "bg-transparent hover:bg-accent")} onClick={function () {
                        selectNode(node.id, false);
                        var nodePath = getNodePath(node);
                        if (location.pathname !== nodePath) {
                            navigate("".concat(nodePath, "?materialId=").concat(node.data.methodMaterialId), { replace: true });
                        }
                        else {
                            setSearchParams({
                                materialId: node.data.methodMaterialId
                            });
                        }
                    }}>
                      <div className="flex h-8 items-center">
                        {Array.from({ length: node.level }).map(function (_, index) { return (<TreeView_1.LevelLine key={index} isSelected={getNodePath(node) === location.pathname}/>); })}
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
                    }}>
                          {node.hasChildren ? (state.expanded ? (<lu_1.LuChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 ml-1"/>) : (<lu_1.LuChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-1"/>)) : (<div className="h-8 w-4"/>)}
                        </div>
                      </div>

                      <div className="flex w-full items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-x-hidden">
                          {bomIdMap.get(node.id) && (<react_1.Badge variant="outline" className="flex-shrink-0">
                              {bomIdMap.get(node.id)}
                            </react_1.Badge>)}
                          <NodeText node={node}/>
                        </div>
                        <div className="flex items-center gap-1">
                          {node.data.isRoot ? (<react_1.Badge variant="outline">
                              V{node.data.version}
                            </react_1.Badge>) : (<NodeData node={node}/>)}
                        </div>
                      </div>
                    </div>
                  </react_1.HoverCardTrigger>
                  <react_1.HoverCardContent side="right" className="pointer-events-none">
                    <NodePreview node={node}/>
                  </react_1.HoverCardContent>
                </react_1.HoverCard>);
            }}/>
          </div>
        </>)}
    </react_1.VStack>);
};
exports.default = JobBoMExplorer;
function NodeText(_a) {
    var node = _a.node;
    return (<div className="flex items-center gap-1">
      <span className="font-medium text-sm truncate">
        {node.data.description || node.data.itemReadableId}
      </span>
    </div>);
}
function NodeData(_a) {
    var _b, _c;
    var node = _a.node;
    var integrations = (0, useIntegrations_1.useIntegrations)();
    var onShapeState = integrations.has("onshape")
        ? // @ts-expect-error
            // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
            (_c = (_b = node.data.externalId) === null || _b === void 0 ? void 0 : _b["onshapeData"]) === null || _c === void 0 ? void 0 : _c["State"]
        : null;
    return (<react_1.HStack spacing={1}>
      <react_1.Badge className="text-xs" variant="outline">
        <components_1.MethodIcon type={
        // node.data.isRoot ? "Method" :
        node.data.methodType} isKit={node.data.kit} className="mr-2"/>
        {node.data.quantity}
      </react_1.Badge>
      {onShapeState && <Icons_1.OnshapeStatus status={onShapeState}/>}
    </react_1.HStack>);
}
function NodePreview(_a) {
    var _b, _c;
    var node = _a.node;
    var t = (0, macro_1.useLingui)().t;
    var integrations = (0, useIntegrations_1.useIntegrations)();
    var onShapeState = integrations.has("onshape")
        ? // @ts-expect-error
            // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
            (_c = (_b = node.data.externalId) === null || _b === void 0 ? void 0 : _b["onshapeData"]) === null || _c === void 0 ? void 0 : _c["State"]
        : null;
    return (<react_1.VStack className="w-full text-sm">
      <react_1.VStack spacing={1}>
        <span className="text-xs text-muted-foreground font-medium">
          <macro_1.Trans>Item ID</macro_1.Trans>
        </span>
        <react_1.HStack className="w-full justify-between">
          <span>{node.data.itemReadableId}</span>
          <react_1.HStack spacing={1}>
            <react_1.Copy text={node.data.itemReadableId}/>
            <react_router_1.Link to={(0, ItemForm_1.getLinkToItemDetails)(node.data.itemType, node.data.itemId)}>
              <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["View Item Master"], ["View Item Master"])))} size="sm" variant="secondary" icon={<lu_1.LuExternalLink />}/>
            </react_router_1.Link>
          </react_1.HStack>
        </react_1.HStack>
      </react_1.VStack>
      <react_1.VStack spacing={1}>
        <span className="text-xs text-muted-foreground font-medium">
          <macro_1.Trans>Description</macro_1.Trans>
        </span>
        <react_1.HStack className="w-full justify-between">
          <span>{node.data.description}</span>
          <react_1.Copy text={node.data.description}/>
        </react_1.HStack>
      </react_1.VStack>
      <react_1.VStack spacing={1}>
        <span className="text-xs text-muted-foreground font-medium">
          <macro_1.Trans>Quantity</macro_1.Trans>
        </span>
        <react_1.HStack className="w-full justify-between">
          <span>{node.data.quantity}</span>
        </react_1.HStack>
      </react_1.VStack>
      <react_1.VStack spacing={1}>
        <span className="text-xs text-muted-foreground font-medium">
          <macro_1.Trans>Method</macro_1.Trans>
        </span>
        <react_1.HStack className="w-full">
          <components_1.MethodIcon type={node.data.methodType}/>
          <span>{node.data.methodType}</span>
        </react_1.HStack>
      </react_1.VStack>
      <react_1.VStack spacing={1}>
        <span className="text-xs text-muted-foreground font-medium">
          <macro_1.Trans>Item Type</macro_1.Trans>
        </span>
        <react_1.HStack className="w-full">
          <components_1.MethodItemTypeIcon type={node.data.itemType}/>
          <span>{node.data.itemType}</span>
        </react_1.HStack>
      </react_1.VStack>
      {node.data.methodType === "Make to Order" && (<react_1.VStack spacing={1}>
          <span className="text-xs text-muted-foreground font-medium">
            <macro_1.Trans>Make Method Version</macro_1.Trans>
          </span>
          <react_1.HStack className="w-full">
            <react_1.Badge variant="outline">V{node.data.version}</react_1.Badge>
          </react_1.HStack>
        </react_1.VStack>)}
      {onShapeState && (<react_1.VStack spacing={1}>
          <span className="text-xs text-muted-foreground font-medium">
            <macro_1.Trans>Onshape Status</macro_1.Trans>
          </span>
          <react_1.HStack className="w-full">
            <Icons_1.OnshapeStatus status={onShapeState}/>
            <span>{onShapeState}</span>
          </react_1.HStack>
        </react_1.VStack>)}
    </react_1.VStack>);
}
function getNodePath(node) {
    return node.data.isRoot
        ? path_1.path.to.jobDetails(node.data.jobId)
        : node.data.methodType === "Make to Order"
            ? path_1.path.to.jobMakeMethod(node.data.jobId, node.data.jobMaterialMakeMethodId)
            : path_1.path.to.jobMakeMethod(node.data.jobId, node.data.jobMakeMethodId);
}
var templateObject_1, templateObject_2, templateObject_3;
