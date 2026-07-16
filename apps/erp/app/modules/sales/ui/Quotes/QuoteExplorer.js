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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QuoteExplorer;
exports.useOptimisticDocumentDrag = useOptimisticDocumentDrag;
var react_1 = require("@carbon/react");
var core_1 = require("@dnd-kit/core");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Icons_1 = require("~/components/Icons");
var LineReorder_1 = require("~/components/LineReorder");
var TreeView_1 = require("~/components/TreeView");
var hooks_1 = require("~/hooks");
var ItemForm_1 = require("~/modules/items/ui/Item/ItemForm");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var DeleteQuoteLine_1 = require("./DeleteQuoteLine");
var QuoteBoMExplorer_1 = require("./QuoteBoMExplorer");
var QuoteLineForm_1 = require("./QuoteLineForm");
function QuoteExplorer(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var methods = _a.methods;
    var t = (0, macro_1.useLingui)().t;
    var prettifyShortcut = (0, react_1.usePrettifyShortcut)();
    var defaults = (0, hooks_1.useUser)().defaults;
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("Could not find quoteId");
    var quoteData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var permissions = (0, hooks_1.usePermissions)();
    var userId = (0, hooks_1.useUser)().id;
    var quoteLineInitialValues = {
        quoteId: quoteId,
        description: "",
        estimatorId: userId,
        itemId: "",
        locationId: (_d = (_c = (_b = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _b === void 0 ? void 0 : _b.locationId) !== null && _c !== void 0 ? _c : defaults.locationId) !== null && _d !== void 0 ? _d : "",
        methodType: "Make to Order",
        status: "Not Started",
        quantity: [1],
        unitOfMeasureCode: "",
        taxPercent: (_f = (_e = quoteData === null || quoteData === void 0 ? void 0 : quoteData.customer) === null || _e === void 0 ? void 0 : _e.taxPercent) !== null && _f !== void 0 ? _f : 0
    };
    (0, hooks_1.useRealtime)("modelUpload", "modelPath=in.(".concat(quoteData === null || quoteData === void 0 ? void 0 : quoteData.lines.map(function (d) { return d.modelPath; }).join(","), ")"));
    var newQuoteLineDisclosure = (0, react_1.useDisclosure)();
    var deleteLineDisclosure = (0, react_1.useDisclosure)();
    var _l = (0, react_2.useState)(null), deleteLine = _l[0], setDeleteLine = _l[1];
    var isDisabled = !permissions.can("delete", "sales") ||
        (0, sales_models_1.isQuoteLocked)((_g = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _g === void 0 ? void 0 : _g.status);
    var onDeleteLine = function (line) {
        setDeleteLine(line);
        deleteLineDisclosure.onOpen();
    };
    var onDeleteCancel = function () {
        setDeleteLine(null);
        deleteLineDisclosure.onClose();
    };
    var newButtonRef = (0, react_2.useRef)(null);
    (0, react_1.useKeyboardShortcuts)({
        "Command+Shift+l": function (event) {
            var _a;
            event.stopPropagation();
            (_a = newButtonRef.current) === null || _a === void 0 ? void 0 : _a.click();
        }
    });
    var _m = (0, core_1.useDroppable)({
        id: "quote-explorer"
    }), setExplorerRef = _m.setNodeRef, isOverExplorer = _m.isOver;
    var optimisticDrags = useOptimisticDocumentDrag();
    var linesMap = new Map((_j = (_h = quoteData === null || quoteData === void 0 ? void 0 : quoteData.lines) === null || _h === void 0 ? void 0 : _h.map(function (line) { return [line.id, line]; })) !== null && _j !== void 0 ? _j : []);
    for (var _i = 0, optimisticDrags_1 = optimisticDrags; _i < optimisticDrags_1.length; _i++) {
        var pendingItem = optimisticDrags_1[_i];
        linesMap.set(pendingItem.itemId, __assign(__assign({}, pendingItem), { quoteId: quoteId }));
    }
    // Server already returns lines ordered by sortOrder; the Map preserves
    // insertion order so we just take values as-is. Optimistic items (added
    // via .set() in the loop above) trail at the end, which is fine — they
    // don't have a sortOrder yet.
    var linesToRender = Array.from(linesMap.values());
    var realQuoteLines = ((_k = quoteData === null || quoteData === void 0 ? void 0 : quoteData.lines) !== null && _k !== void 0 ? _k : []);
    var canReorder = !isDisabled &&
        permissions.can("update", "sales") &&
        realQuoteLines.length > 1;
    var editMode = (0, LineReorder_1.useLineOrderEditMode)({
        actionPath: path_1.path.to.quoteLineOrder(quoteId),
        lines: realQuoteLines
    });
    return (<div ref={setExplorerRef} data-quote-explorer className={(0, react_1.cn)("transition-colors duration-200", isOverExplorer && "bg-primary/10 border-2 border-dashed border-primary")}>
      <react_1.VStack className="w-full h-[calc(100dvh-99px)] justify-between">
        <react_1.VStack className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" spacing={0}>
          {linesToRender.length > 0 ? (editMode.isEditing ? (<LineReorder_1.ReorderableLineList lines={editMode.draft} activeLine={editMode.activeLine} onDragStart={editMode.handleDragStart} onDragEnd={editMode.handleDragEnd} renderRow={function (line, dragHandle) { return (<QuoteLineBody line={line} dragHandle={dragHandle}/>); }} renderOverlay={function (line) { return (<QuoteLineBody line={line} isOverlay/>); }}/>) : (linesToRender.map(function (line) {
            return !isQuoteLine(line) ? (<OptimisticQuoteLineItem key={line.itemId} line={line}/>) : (<DroppableQuoteLineItem key={line.id} isDisabled={isDisabled} line={line} onDelete={onDeleteLine} methods={methods}/>);
        }))) : (<components_1.Empty>
              {permissions.can("update", "sales") && (<react_1.Button isDisabled={isDisabled} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={newQuoteLineDisclosure.onOpen}>
                  <macro_1.Trans>Add Line Item</macro_1.Trans>
                </react_1.Button>)}
            </components_1.Empty>)}
        </react_1.VStack>
        <div className="w-full flex border-t border-border p-4 gap-2">
          {editMode.isEditing ? (<LineReorder_1.ReorderEditBar isSaving={editMode.isSaving} isDirty={editMode.isDirty} onSave={editMode.save} onCancel={editMode.cancelEditMode}/>) : (<>
              <react_1.Tooltip>
                <react_1.TooltipTrigger className="flex-1">
                  <react_1.Button ref={newButtonRef} className="w-full" isDisabled={isDisabled || !permissions.can("update", "sales")} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={newQuoteLineDisclosure.onOpen}>
                    <macro_1.Trans>Add Line Item</macro_1.Trans>
                  </react_1.Button>
                </react_1.TooltipTrigger>
                <react_1.TooltipContent>
                  <react_1.HStack>
                    <span>
                      <macro_1.Trans>New Line Item</macro_1.Trans>
                    </span>
                    <react_1.Kbd>{prettifyShortcut("Command+Shift+l")}</react_1.Kbd>
                  </react_1.HStack>
                </react_1.TooltipContent>
              </react_1.Tooltip>
              {canReorder && realQuoteLines.length > 0 && (<react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Reorder lines"], ["Reorder lines"])))} icon={<lu_1.LuSettings2 />} variant="ghost" className="text-muted-foreground" onClick={editMode.enterEditMode}/>)}
            </>)}
        </div>
      </react_1.VStack>
      {newQuoteLineDisclosure.isOpen && (<QuoteLineForm_1.default initialValues={quoteLineInitialValues} type="modal" onClose={newQuoteLineDisclosure.onClose}/>)}
      {deleteLineDisclosure.isOpen && (<DeleteQuoteLine_1.default line={deleteLine} onCancel={onDeleteCancel}/>)}
    </div>);
}
function QuoteLineBody(_a) {
    var line = _a.line, dragHandle = _a.dragHandle, isOverlay = _a.isOverlay;
    return (<LineReorder_1.ReorderableRow dragHandle={dragHandle} isOverlay={isOverlay}>
      <react_1.HStack spacing={2} className="flex-grow min-w-0 p-2 pr-10">
        <components_1.ItemThumbnail thumbnailPath={line.thumbnailPath} type="Part"/>
        <react_1.VStack spacing={0} className="min-w-0">
          <span className="font-semibold line-clamp-1">
            {line.itemReadableId || line.description || "Item"}
          </span>
          <span className="text-muted-foreground text-xs truncate line-clamp-1">
            {line.description}
          </span>
        </react_1.VStack>
      </react_1.HStack>
    </LineReorder_1.ReorderableRow>);
}
function isQuoteLine(line) {
    return "id" in line && "status" in line && "methodType" in line;
}
function OptimisticQuoteLineItem(_a) {
    var line = _a.line;
    return (<react_1.VStack spacing={0} className="border-b">
      <react_1.HStack className="w-full p-2 items-center justify-between hover:bg-accent/30 cursor-pointer">
        <react_1.HStack spacing={2} className="flex-grow min-w-0 pr-10">
          <div className="w-10 h-10 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-2 flex items-center justify-center">
            <react_1.Spinner className="w-6 h-6 text-muted-foreground"/>
          </div>
          <react_1.VStack spacing={0} className="min-w-0">
            <span className="font-semibold line-clamp-1">
              {line.itemReadableId || line.customerPartId}
            </span>
            <span className="font-medium text-muted-foreground text-xs line-clamp-1">
              <macro_1.Trans>Creating part...</macro_1.Trans>
            </span>
          </react_1.VStack>
        </react_1.HStack>
        <div className="absolute right-2 opacity-50">
          <react_1.HStack spacing={1}>
            <div className="w-8 h-8 bg-muted/50 rounded animate-pulse"/>
          </react_1.HStack>
        </div>
      </react_1.HStack>
    </react_1.VStack>);
}
function useOptimisticDocumentDrag() {
    var quoteId = (0, react_router_1.useParams)().quoteId;
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        return fetcher.formAction === path_1.path.to.quoteDrag(quoteId);
    })
        .reduce(function (acc, fetcher) {
        var _a, _b;
        var payload = (_a = fetcher === null || fetcher === void 0 ? void 0 : fetcher.formData) === null || _a === void 0 ? void 0 : _a.get("payload");
        if (payload) {
            try {
                var parsedPayload = JSON.parse(payload);
                var fileName = ((_b = parsedPayload.name) === null || _b === void 0 ? void 0 : _b.replace(/\.[^/.]+$/, "")) || "";
                return __spreadArray(__spreadArray([], acc, true), [
                    {
                        itemReadableId: fileName,
                        customerPartId: fileName,
                        customerPartRevision: "",
                        itemId: "pending-".concat(parsedPayload.id)
                    }
                ], false);
            }
            catch (_c) {
                // nothing
            }
        }
        return acc;
    }, []);
}
function DroppableQuoteLineItem(_a) {
    var line = _a.line, isDisabled = _a.isDisabled, onDelete = _a.onDelete, methods = _a.methods;
    var _b = (0, core_1.useDroppable)({
        id: "quote-line-".concat(line.id),
        data: { lineId: line.id }
    }), setNodeRef = _b.setNodeRef, isOver = _b.isOver;
    return (<div ref={setNodeRef} className={(0, react_1.cn)("transition-colors duration-200 w-full", isOver && "bg-primary/20 border-2 border-dashed border-primary")}>
      <QuoteLineItem line={line} isDisabled={isDisabled} onDelete={onDelete} methods={methods}/>
    </div>);
}
function QuoteLineItem(_a) {
    var _b;
    var line = _a.line, isDisabled = _a.isDisabled, onDelete = _a.onDelete, methods = _a.methods;
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, react_router_1.useParams)(), quoteId = _c.quoteId, lineId = _c.lineId;
    if (!quoteId)
        throw new Error("Could not find quoteId");
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var location = (0, hooks_1.useOptimisticLocation)();
    var disclosure = (0, react_1.useDisclosure)();
    var searchDisclosure = (0, react_1.useDisclosure)();
    var expansionDisclosure = (0, react_1.useDisclosure)();
    (0, react_1.useMount)(function () {
        if (lineId === line.id) {
            disclosure.onOpen();
        }
    });
    var methodTree = methods.find(function (m) { return m.data.quoteLineId === line.id; });
    var flattenedMethods = (0, react_2.useMemo)(function () { return (methodTree ? (0, TreeView_1.flattenTree)(methodTree) : []); }, [methodTree]);
    var isSelected = lineId === line.id;
    var onLineClick = function (line) {
        if (line.methodType === "Make to Order") {
            disclosure.onOpen();
        }
        if (location.pathname !== path_1.path.to.quoteLine(quoteId, line.id)) {
            // navigate to line
            navigate(path_1.path.to.quoteLine(quoteId, line.id));
        }
    };
    return (<react_1.VStack spacing={0} className="border-b">
      <react_1.HStack className={(0, react_1.cn)("group w-full p-2 items-center hover:bg-accent/30 cursor-pointer relative", isSelected && "bg-accent/60 hover:bg-accent/50")} onClick={function () { return onLineClick(line); }}>
        <react_1.HStack spacing={2} className="flex-grow min-w-0 pr-10">
          <components_1.ItemThumbnail thumbnailPath={line.thumbnailPath} type={line.itemType}/>

          <react_1.VStack spacing={0} className="min-w-0">
            <react_1.HStack>
              <span className="font-semibold line-clamp-1">
                {line.itemReadableId}
              </span>
              <div className="ml-auto">
                <Icons_1.QuoteLineStatusIcon status={(_b = line.status) !== null && _b !== void 0 ? _b : "Not Started"}/>
              </div>
            </react_1.HStack>
            <span className="font-medium text-muted-foreground text-xs line-clamp-1">
              {line.customerPartId}
              {line.customerPartRevision && "-".concat(line.customerPartRevision)}
            </span>
          </react_1.VStack>
        </react_1.HStack>
        <div className="absolute right-2">
          <react_1.HStack spacing={1}>
            {line.methodType === "Make to Order" &&
            permissions.can("update", "sales") &&
            line.status !== "No Quote" && (<react_1.IconButton aria-label={disclosure.isOpen ? "Hide" : "Show"} className={(0, react_1.cn)("animate opacity-0 group-hover:opacity-100 group-active:opacity-100 data-[state=open]:opacity-100", disclosure.isOpen && "-rotate-180")} icon={<lu_1.LuChevronDown />} size="md" variant="solid" onClick={function (e) {
                e.stopPropagation();
                disclosure.onToggle();
            }}/>)}
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["More"], ["More"])))} className="opacity-0 group-hover:opacity-100 group-active:opacity-100 data-[state=open]:opacity-100" icon={<lu_1.LuEllipsisVertical />} size="md" variant="solid" onClick={function (e) { return e.stopPropagation(); }}/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent>
                <react_1.DropdownMenuItem asChild onClick={function (e) { return e.stopPropagation(); }}>
                  <react_router_1.Link to={(0, ItemForm_1.getLinkToItemDetails)(line.itemType, line.itemId)}>
                    <react_1.DropdownMenuIcon icon={<components_1.MethodItemTypeIcon type={line.itemType}/>}/>
                    <macro_1.Trans>View Item Master</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.DropdownMenuItem>
                {line.methodType === "Make to Order" && (<>
                    <react_1.DropdownMenuItem onClick={searchDisclosure.onOpen}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuSearch />}/>
                      <macro_1.Trans>Search</macro_1.Trans>
                    </react_1.DropdownMenuItem>
                    <react_1.DropdownMenuItem onClick={expansionDisclosure.onToggle}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuChevronsUpDown />}/>
                      {expansionDisclosure.isOpen ? (<macro_1.Trans>Collapse all</macro_1.Trans>) : (<macro_1.Trans>Expand all</macro_1.Trans>)}
                    </react_1.DropdownMenuItem>
                    <react_1.DropdownMenuSub>
                      <react_1.DropdownMenuSubTrigger>
                        <react_1.DropdownMenuIcon icon={<lu_1.LuDownload />}/>
                        <macro_1.Trans>Export</macro_1.Trans>
                      </react_1.DropdownMenuSubTrigger>
                      <react_1.DropdownMenuSubContent>
                        <react_1.DropdownMenuItem asChild>
                          <a href={path_1.path.to.api.quoteBillOfMaterialsCsv(line.id, false)} target="_blank" rel="noreferrer">
                            <react_1.DropdownMenuIcon icon={<lu_1.LuTable />}/>
                            <div className="flex flex-grow items-center gap-4 justify-between">
                              <span>
                                <macro_1.Trans>BoM</macro_1.Trans>
                              </span>
                              <react_1.Badge variant="green" className="text-xs">
                                CSV
                              </react_1.Badge>
                            </div>
                          </a>
                        </react_1.DropdownMenuItem>
                        <react_1.DropdownMenuItem asChild>
                          <a href={path_1.path.to.api.quoteBillOfMaterialsCsv(line.id, true)} target="_blank" rel="noreferrer">
                            <react_1.DropdownMenuIcon icon={<lu_1.LuTable />}/>
                            <div className="flex flex-grow items-center gap-4 justify-between">
                              <span>
                                <macro_1.Trans>BoM + BoP</macro_1.Trans>
                              </span>
                              <react_1.Badge variant="green" className="text-xs">
                                CSV
                              </react_1.Badge>
                            </div>
                          </a>
                        </react_1.DropdownMenuItem>
                        <react_1.DropdownMenuItem asChild>
                          <a href={path_1.path.to.api.quoteBillOfMaterials(line.id, false)} target="_blank" rel="noreferrer">
                            <react_1.DropdownMenuIcon icon={<lu_1.LuBraces />}/>
                            <div className="flex flex-grow items-center gap-4 justify-between">
                              <span>
                                <macro_1.Trans>BoM</macro_1.Trans>
                              </span>
                              <react_1.Badge variant="outline" className="text-xs">
                                JSON
                              </react_1.Badge>
                            </div>
                          </a>
                        </react_1.DropdownMenuItem>
                        <react_1.DropdownMenuItem asChild>
                          <a href={path_1.path.to.api.quoteBillOfMaterials(line.id, true)} target="_blank" rel="noreferrer">
                            <react_1.DropdownMenuIcon icon={<lu_1.LuBraces />}/>
                            <div className="flex flex-grow items-center gap-4 justify-between">
                              <span>
                                <macro_1.Trans>BoM + BoP</macro_1.Trans>
                              </span>
                              <react_1.Badge variant="outline" className="text-xs">
                                JSON
                              </react_1.Badge>
                            </div>
                          </a>
                        </react_1.DropdownMenuItem>
                      </react_1.DropdownMenuSubContent>
                    </react_1.DropdownMenuSub>
                  </>)}
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuItem destructive disabled={isDisabled || !permissions.can("update", "sales")} onClick={function (e) {
            e.stopPropagation();
            onDelete(line);
        }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                  <macro_1.Trans>Delete Line</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </react_1.HStack>
        </div>
      </react_1.HStack>
      {disclosure.isOpen &&
            line.methodType === "Make to Order" &&
            permissions.can("update", "sales") &&
            line.status !== "No Quote" && (<react_1.VStack className="border-b border-border p-1">
            <QuoteBoMExplorer_1.default methods={flattenedMethods} isSearchExpanded={searchDisclosure.isOpen} isAllExpanded={expansionDisclosure.isOpen}/>
          </react_1.VStack>)}
    </react_1.VStack>);
}
var templateObject_1, templateObject_2;
