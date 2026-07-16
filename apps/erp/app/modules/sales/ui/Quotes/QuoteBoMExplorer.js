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
var QuoteBoMExplorer = function (_a) {
    var _b, _c;
    var methods = _a.methods, _d = _a.isSearchExpanded, isSearchExpanded = _d === void 0 ? false : _d, _e = _a.isAllExpanded, isAllExpanded = _e === void 0 ? false : _e;
    var t = (0, macro_1.useLingui)().t;
    var parentRef = (0, react_2.useRef)(null);
    var navigate = (0, react_router_1.useNavigate)();
    var location = (0, hooks_1.useOptimisticLocation)();
    var fetchers = (0, react_router_1.useFetchers)();
    var getMethodFetcher = fetchers.find(function (f) { return f.formAction === path_1.path.to.quoteMethodGet; });
    var _f = (0, react_2.useState)(""), filterText = _f[0], setFilterText = _f[1];
    var isLoading = (getMethodFetcher === null || getMethodFetcher === void 0 ? void 0 : getMethodFetcher.state) === "loading" &&
        ((_b = getMethodFetcher.formData) === null || _b === void 0 ? void 0 : _b.get("quoteLineId")) ===
            (methods === null || methods === void 0 ? void 0 : methods[0].data.quoteLineId);
    // Generate hierarchical BOM IDs (1, 1.1, 1.1.1, etc.)
    var bomIds = (0, react_2.useMemo)(function () { return (0, bom_1.generateBomIds)(methods); }, [methods]);
    var bomIdMap = (0, react_2.useMemo)(function () { return new Map(methods.map(function (node, index) { return [node.id, bomIds[index]]; })); }, [methods, bomIds]);
    var _g = (0, TreeView_1.useTree)({
        tree: methods,
        // selectedId,
        // collapsedIds,
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
    }), nodes = _g.nodes, getTreeProps = _g.getTreeProps, getNodeProps = _g.getNodeProps, 
    // toggleNodeSelection,
    toggleExpandNode = _g.toggleExpandNode, expandAllBelowDepth = _g.expandAllBelowDepth, 
    // toggleExpandLevel,
    collapseAllBelowDepth = _g.collapseAllBelowDepth, deselectAllNodes = _g.deselectAllNodes, selectNode = _g.selectNode, virtualizer = _g.virtualizer;
    // biome-ignore lint/correctness/useExhaustiveDependencies: only react to isAllExpanded changes
    (0, react_2.useEffect)(function () {
        if (isAllExpanded) {
            expandAllBelowDepth(0);
        }
        else {
            collapseAllBelowDepth(1);
        }
    }, [isAllExpanded]);
    var params = (0, react_router_1.useParams)();
    var _h = (0, react_router_1.useSearchParams)(), searchParams = _h[0], setSearchParams = _h[1];
    var selectedMaterialId = searchParams.get("materialId");
    var explorerLineId = (_c = methods[0]) === null || _c === void 0 ? void 0 : _c.data.quoteLineId;
    var isDetailsRouteForThisLine = params.quoteId &&
        params.lineId &&
        params.lineId === explorerLineId &&
        location.pathname === path_1.path.to.quoteLine(params.quoteId, params.lineId);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (!selectedMaterialId) {
            if (isDetailsRouteForThisLine) {
                var rootNode = methods.find(function (m) { return m.data.isRoot; });
                if (rootNode) {
                    selectNode(rootNode.id);
                    return;
                }
            }
            deselectAllNodes();
            return;
        }
        var node = methods.find(function (m) { return m.data.methodMaterialId === selectedMaterialId; });
        if (node === null || node === void 0 ? void 0 : node.id) {
            selectNode(node.id);
        }
        else if (params.methodId) {
            var methodNode = methods.find(function (m) { return m.data.quoteMaterialMakeMethodId === params.methodId; });
            if (methodNode === null || methodNode === void 0 ? void 0 : methodNode.id) {
                selectNode(methodNode.id);
            }
            else {
                deselectAllNodes();
            }
        }
        else {
            deselectAllNodes();
        }
    }, [selectedMaterialId, params.methodId, location.pathname]);
    return (<react_1.VStack className="flex flex-1 w-full">
      {isLoading ? (<div className="flex items-center justify-center py-8 w-full">
          <react_1.Spinner className="w-4 h-4"/>
        </div>) : (<>
          {isSearchExpanded && (<react_1.HStack className="w-full">
              <react_1.InputGroup size="sm" className="flex flex-grow">
                <react_1.InputLeftElement>
                  <lu_1.LuSearch className="h-4 w-4"/>
                </react_1.InputLeftElement>
                <react_1.Input placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search..."], ["Search..."])))} value={filterText} onChange={function (e) { return setFilterText(e.target.value); }}/>
              </react_1.InputGroup>
            </react_1.HStack>)}
          <TreeView_1.TreeView parentRef={parentRef} virtualizer={virtualizer} autoFocus tree={methods} nodes={nodes} getNodeProps={getNodeProps} getTreeProps={getTreeProps} renderNode={function (_a) {
                var node = _a.node, state = _a.state;
                return (<react_1.HoverCard openDelay={500} closeDelay={0}>
                <react_1.HoverCardTrigger asChild>
                  <div key={node.id} className={(0, react_1.cn)("flex h-8 cursor-pointer items-center overflow-hidden rounded-sm pr-2 gap-1 group/node", state.selected
                        ? "bg-muted hover:bg-accent"
                        : "bg-transparent hover:bg-accent")} onClick={function (e) {
                        selectNode(node.id);
                        if (location.pathname !== getNodePath(node)) {
                            navigate("".concat(getNodePath(node), "?materialId=").concat(node.data.methodMaterialId), { replace: true });
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
                        {node.data.isRoot ? (<react_1.Badge variant="outline">V{node.data.version}</react_1.Badge>) : (<NodeData node={node}/>)}
                      </div>
                    </div>
                  </div>
                </react_1.HoverCardTrigger>
                <react_1.HoverCardContent side="right" className="pointer-events-none">
                  <NodePreview node={node}/>
                </react_1.HoverCardContent>
              </react_1.HoverCard>);
            }}/>
        </>)}
    </react_1.VStack>);
};
exports.default = QuoteBoMExplorer;
function NodeText(_a) {
    var node = _a.node, bomId = _a.bomId;
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
          Item ID
        </span>
        <react_1.HStack className="w-full justify-between">
          <span>{node.data.itemReadableId}</span>
          <react_1.HStack spacing={1}>
            <react_1.Copy text={node.data.itemReadableId}/>
            <react_router_1.Link to={(0, ItemForm_1.getLinkToItemDetails)(node.data.itemType, node.data.itemId)}>
              <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["View Item Master"], ["View Item Master"])))} size="sm" variant="secondary" icon={<lu_1.LuExternalLink />}/>
            </react_router_1.Link>
          </react_1.HStack>
        </react_1.HStack>
      </react_1.VStack>
      <react_1.VStack spacing={1}>
        <span className="text-xs text-muted-foreground font-medium">
          Description
        </span>
        <react_1.HStack className="w-full justify-between">
          <span>{node.data.description}</span>
          <react_1.Copy text={node.data.description}/>
        </react_1.HStack>
      </react_1.VStack>
      <react_1.VStack spacing={1}>
        <span className="text-xs text-muted-foreground font-medium">
          Quantity
        </span>
        <react_1.HStack className="w-full justify-between">
          <span>{node.data.quantity}</span>
        </react_1.HStack>
      </react_1.VStack>
      <react_1.VStack spacing={1}>
        <span className="text-xs text-muted-foreground font-medium">
          Method
        </span>
        <react_1.HStack className="w-full">
          <components_1.MethodIcon type={node.data.methodType}/>
          <span>{node.data.methodType}</span>
        </react_1.HStack>
      </react_1.VStack>
      <react_1.VStack spacing={1}>
        <span className="text-xs text-muted-foreground font-medium">
          Item Type
        </span>
        <react_1.HStack className="w-full">
          <components_1.MethodItemTypeIcon type={node.data.itemType}/>
          <span>{node.data.itemType}</span>
        </react_1.HStack>
      </react_1.VStack>
      {node.data.methodType === "Make to Order" && (<react_1.VStack spacing={1}>
          <span className="text-xs text-muted-foreground font-medium">
            Make Method Version
          </span>
          <react_1.HStack className="w-full">
            <react_1.Badge variant="outline">V{node.data.version}</react_1.Badge>
          </react_1.HStack>
        </react_1.VStack>)}
      {onShapeState && (<react_1.VStack spacing={1}>
          <span className="text-xs text-muted-foreground font-medium">
            Onshape Status
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
        ? path_1.path.to.quoteLine(node.data.quoteId, node.data.quoteLineId)
        : node.data.methodType === "Make to Order"
            ? path_1.path.to.quoteLineMakeMethod(node.data.quoteId, node.data.quoteLineId, node.data.quoteMaterialMakeMethodId)
            : path_1.path.to.quoteLineMakeMethod(node.data.quoteId, node.data.quoteLineId, node.data.quoteMakeMethodId);
}
var templateObject_1, templateObject_2;
