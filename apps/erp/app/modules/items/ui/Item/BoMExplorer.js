"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoMActions = BoMActions;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Icons_1 = require("~/components/Icons");
var ImportCSVModal_1 = require("~/components/ImportCSVModal");
var OnshapeSync_1 = require("~/components/OnshapeSync");
var TreeView_1 = require("~/components/TreeView");
var useIntegrations_1 = require("~/hooks/useIntegrations");
var bom_1 = require("~/utils/bom");
var path_1 = require("~/utils/path");
var ItemForm_1 = require("./ItemForm");
var BoMExplorer = function (_a) {
    var itemType = _a.itemType, makeMethod = _a.makeMethod, methods = _a.methods, methodIdProp = _a.methodId, itemIdOverride = _a.itemIdOverride, _b = _a.disableNavigation, disableNavigation = _b === void 0 ? false : _b, _c = _a.disableOnshapeSync, disableOnshapeSync = _c === void 0 ? false : _c, _d = _a.hideRootPreview, hideRootPreview = _d === void 0 ? false : _d, selectedId = _a.selectedId, filterTextProp = _a.filterText, hideSearch = _a.hideSearch;
    var _e = (0, react_2.useState)(""), filterTextInternal = _e[0], setFilterTextInternal = _e[1];
    var filterText = filterTextProp !== null && filterTextProp !== void 0 ? filterTextProp : filterTextInternal;
    var parentRef = (0, react_2.useRef)(null);
    var integrations = (0, useIntegrations_1.useIntegrations)();
    var params = (0, react_router_1.useParams)();
    var makeMethodId = makeMethod.id, makeMethodVersion = makeMethod.version, makeMethodStatus = makeMethod.status;
    var _f = (0, TreeView_1.useTree)({
        tree: methods,
        selectedId: selectedId,
        // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
        onSelectedIdChanged: function () { },
        estimatedRowHeight: function () { return 40; },
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
    }), nodes = _f.nodes, getTreeProps = _f.getTreeProps, getNodeProps = _f.getNodeProps, toggleExpandNode = _f.toggleExpandNode, expandAllBelowDepth = _f.expandAllBelowDepth, collapseAllBelowDepth = _f.collapseAllBelowDepth, deselectAllNodes = _f.deselectAllNodes, selectNode = _f.selectNode, virtualizer = _f.virtualizer;
    var allExpanded = (0, react_2.useMemo)(function () { return methods.every(function (m) { var _a; return !m.hasChildren || ((_a = nodes[m.id]) === null || _a === void 0 ? void 0 : _a.expanded); }); }, [methods, nodes]);
    // Generate hierarchical BOM IDs (1, 1.1, 1.1.1, etc.)
    var bomIds = (0, react_2.useMemo)(function () { return (0, bom_1.generateBomIds)(methods); }, [methods]);
    var bomIdMap = (0, react_2.useMemo)(function () { return new Map(methods.map(function (node, index) { return [node.id, bomIds[index]]; })); }, [methods, bomIds]);
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var location = (0, react_1.useOptimisticLocation)();
    var itemId = itemIdOverride !== null && itemIdOverride !== void 0 ? itemIdOverride : params.itemId;
    if (!itemId && !disableNavigation)
        throw new Error("itemId not found");
    var methodId = methodIdProp !== null && methodIdProp !== void 0 ? methodIdProp : params.methodId;
    if (!methodId)
        throw new Error("methodId not found");
    var _g = (0, react_router_1.useSearchParams)(), searchParams = _g[0], setSearchParams = _g[1];
    var selectedMaterialId = searchParams.get("materialId");
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (!selectedMaterialId) {
            deselectAllNodes();
            return;
        }
        if (selectedMaterialId) {
            var node = methods.find(function (m) { return m.data.methodMaterialId === selectedMaterialId; });
            if (node === null || node === void 0 ? void 0 : node.id)
                selectNode(node === null || node === void 0 ? void 0 : node.id);
        }
        else if (params.methodId) {
            var node = methods.find(function (m) { return m.data.materialMakeMethodId === params.methodId; });
            if (node === null || node === void 0 ? void 0 : node.id)
                selectNode(node === null || node === void 0 ? void 0 : node.id);
        }
    }, [selectedMaterialId, params.methodId]);
    var importBomDisclosure = (0, react_1.useDisclosure)();
    return (<>
      <react_1.VStack className="h-full">
        {!hideSearch && (<react_1.HStack className="w-full justify-between flex-shrink-0">
            <react_1.InputGroup size="sm" className="flex flex-grow">
              <react_1.InputLeftElement>
                <lu_1.LuSearch className="h-4 w-4"/>
              </react_1.InputLeftElement>
              <react_1.Input placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search..."], ["Search..."])))} value={filterText} onChange={function (e) { return setFilterTextInternal(e.target.value); }}/>
            </react_1.InputGroup>

            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger>
                <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Actions"], ["Actions"])))} variant="secondary" size="sm" icon={<lu_1.LuEllipsisVertical />}/>
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
                <react_1.DropdownMenuSub>
                  <react_1.DropdownMenuSubTrigger>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuDownload />}/>
                    <macro_1.Trans>Export</macro_1.Trans>
                  </react_1.DropdownMenuSubTrigger>
                  <react_1.DropdownMenuSubContent>
                    <react_1.DropdownMenuItem asChild>
                      <a href={path_1.path.to.api.billOfMaterialsCsv(makeMethodId, false)} target="_blank" rel="noreferrer">
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
                      <a href={path_1.path.to.api.billOfMaterialsCsv(makeMethodId, true)} target="_blank" rel="noreferrer">
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
                      <a href={path_1.path.to.api.billOfMaterials(makeMethodId, false)} target="_blank" rel="noreferrer">
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
                      <a href={path_1.path.to.api.billOfMaterials(makeMethodId, true)} target="_blank" rel="noreferrer">
                        <react_1.DropdownMenuIcon icon={<lu_1.LuBraces />}/>
                        <div className="flex flex-grow items-center gap-4 justify-between">
                          <span>BoM + BoP</span>
                          <react_1.Badge variant="outline" className="text-xs">
                            JSON
                          </react_1.Badge>
                        </div>
                      </a>
                    </react_1.DropdownMenuItem>
                  </react_1.DropdownMenuSubContent>
                </react_1.DropdownMenuSub>
                {/* <DropdownMenuItem onClick={importBomDisclosure.onOpen}>
            <DropdownMenuIcon icon={<LuUpload />} />
            Import
          </DropdownMenuItem> */}
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </react_1.HStack>)}
        {integrations.has("onshape") && !disableOnshapeSync && itemId && (<div className="flex flex-shrink-0 w-full">
            <OnshapeSync_1.OnshapeSync makeMethodId={makeMethodId} itemId={itemId} isDisabled={makeMethodStatus !== "Draft"}/>
          </div>)}
        <div className="flex flex-1 min-h-0 w-full">
          <TreeView_1.TreeView parentRef={parentRef} virtualizer={virtualizer} autoFocus tree={methods} nodes={nodes} getNodeProps={getNodeProps} getTreeProps={getTreeProps} parentClassName="h-full" renderNode={function (_a) {
            var node = _a.node, state = _a.state;
            var shouldHidePreview = hideRootPreview && node.data.isRoot;
            return (<react_1.HoverCard openDelay={500} closeDelay={150}>
                  <react_1.HoverCardTrigger asChild>
                    <div key={node.id} className={(0, react_1.cn)("flex h-8 cursor-pointer items-center overflow-hidden rounded-sm pr-2 gap-1 group/node", state.selected
                    ? "bg-muted hover:bg-accent"
                    : "bg-transparent hover:bg-accent", node.data.isPickDescendant && "opacity-60")} onClick={function () {
                    selectNode(node.id, false);
                    if (disableNavigation) {
                        setSearchParams(function (prev) {
                            prev.set("materialId", node.data.methodMaterialId);
                            return prev;
                        });
                        return;
                    }
                    if (!itemId || !methodId)
                        return;
                    var targetMakeMethodId = node.data.replenishmentSystem !== "Buy"
                        ? node.data.materialMakeMethodId
                        : node.data.makeMethodId;
                    if (!node.data.isRoot && !targetMakeMethodId)
                        return;
                    var nodePath = node.data.isRoot
                        ? getRootLink(itemType, itemId, methodId)
                        : getMaterialLink(itemType, itemId, methodId, targetMakeMethodId, node);
                    var separator = nodePath.includes("?") ? "&" : "?";
                    var fullPath = "".concat(nodePath).concat(separator, "materialId=").concat(node.data.methodMaterialId);
                    var nodePathname = nodePath.split("?")[0];
                    if (location.pathname !== nodePathname) {
                        navigate(fullPath, { replace: true });
                    }
                    else {
                        setSearchParams(function (prev) {
                            prev.set("materialId", node.data.methodMaterialId);
                            return prev;
                        });
                    }
                }}>
                      <div className="flex h-8 items-center">
                        {Array.from({ length: node.level }).map(function (_, index) { return (<TreeView_1.LevelLine key={index} isSelected={state.selected}/>); })}
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
                              V{makeMethodVersion}
                            </react_1.Badge>) : (<NodeData node={node}/>)}
                        </div>
                      </div>
                    </div>
                  </react_1.HoverCardTrigger>
                  {!shouldHidePreview && (<react_1.HoverCardContent side="right">
                      <NodePreview node={node}/>
                    </react_1.HoverCardContent>)}
                </react_1.HoverCard>);
        }}/>
        </div>
      </react_1.VStack>
      {importBomDisclosure.isOpen && (<ImportCSVModal_1.ImportCSVModal table={"methodMaterial"} onClose={function () { return importBomDisclosure.onClose(); }}/>)}
    </>);
};
exports.default = BoMExplorer;
function BoMActions(_a) {
    var makeMethodId = _a.makeMethodId;
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.DropdownMenu>
      <react_1.DropdownMenuTrigger>
        <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Actions"], ["Actions"])))} variant="secondary" size="sm" icon={<lu_1.LuEllipsisVertical />}/>
      </react_1.DropdownMenuTrigger>
      <react_1.DropdownMenuContent align="end">
        <react_1.DropdownMenuSub>
          <react_1.DropdownMenuSubTrigger>
            <react_1.DropdownMenuIcon icon={<lu_1.LuDownload />}/>
            <macro_1.Trans>Export</macro_1.Trans>
          </react_1.DropdownMenuSubTrigger>
          <react_1.DropdownMenuSubContent>
            <react_1.DropdownMenuItem asChild>
              <a href={path_1.path.to.api.billOfMaterialsCsv(makeMethodId, false)} target="_blank" rel="noreferrer">
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
              <a href={path_1.path.to.api.billOfMaterialsCsv(makeMethodId, true)} target="_blank" rel="noreferrer">
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
              <a href={path_1.path.to.api.billOfMaterials(makeMethodId, false)} target="_blank" rel="noreferrer">
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
              <a href={path_1.path.to.api.billOfMaterials(makeMethodId, true)} target="_blank" rel="noreferrer">
                <react_1.DropdownMenuIcon icon={<lu_1.LuBraces />}/>
                <div className="flex flex-grow items-center gap-4 justify-between">
                  <span>BoM + BoP</span>
                  <react_1.Badge variant="outline" className="text-xs">
                    JSON
                  </react_1.Badge>
                </div>
              </a>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuSubContent>
        </react_1.DropdownMenuSub>
      </react_1.DropdownMenuContent>
    </react_1.DropdownMenu>);
}
function NodeText(_a) {
    var node = _a.node;
    return (<div className="flex items-start gap-1">
      <span className="text-sm truncate font-medium">
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
              <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["View Item Master"], ["View Item Master"])))} size="sm" variant="secondary" icon={<lu_1.LuExternalLink />}/>
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
          <span>
            {node.data.quantity} {node.data.unitOfMeasureCode}
          </span>
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
      {node.data.methodType === "Make to Order" && node.data.version && (<react_1.VStack spacing={1}>
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
function getRootLink(itemType, itemId, methodId) {
    switch (itemType) {
        case "Part":
            return "".concat(path_1.path.to.partDetails(itemId), "?methodId=").concat(methodId);
        case "Tool":
            return "".concat(path_1.path.to.toolDetails(itemId), "?methodId=").concat(methodId);
        default:
            throw new Error("Unimplemented BoMExplorer itemType: ".concat(itemType));
    }
}
function getMaterialLink(itemType, itemId, methodId, makeMethodId, node) {
    switch (itemType) {
        case "Part":
            return "".concat(path_1.path.to.partMake(itemId, makeMethodId), "?methodId=").concat(methodId);
        case "Tool":
            return "".concat(path_1.path.to.toolMake(itemId, makeMethodId), "?methodId=").concat(methodId);
        default:
            throw new Error("Unimplemented BoMExplorer itemType: ".concat(itemType));
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
