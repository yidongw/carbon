"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SalesOrderExplorer;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var LineReorder_1 = require("~/components/LineReorder");
var TreeView_1 = require("~/components/TreeView");
var hooks_1 = require("~/hooks");
var ItemForm_1 = require("~/modules/items/ui/Item/ItemForm");
var shared_1 = require("~/modules/shared");
var items_1 = require("~/stores/items");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var DeleteSalesOrderLine_1 = require("./DeleteSalesOrderLine");
var SalesOrderLineForm_1 = require("./SalesOrderLineForm");
function getRelatedItems(items, lineId) {
    var _a, _b;
    return [
        {
            key: "jobs",
            name: "Jobs",
            module: "production",
            children: (_b = (_a = items.jobs) === null || _a === void 0 ? void 0 : _a.filter(function (job) { return job.salesOrderLineId === lineId; }).map(function (job) {
                var _a, _b, _c;
                return ({
                    id: (_a = job.id) !== null && _a !== void 0 ? _a : "",
                    documentReadableId: (_b = job.jobId) !== null && _b !== void 0 ? _b : "",
                    documentId: (_c = job.id) !== null && _c !== void 0 ? _c : ""
                });
            })) !== null && _b !== void 0 ? _b : []
        },
        {
            key: "shipments",
            name: "Shipments",
            module: "inventory",
            children: items.shipments
                .filter(function (shipment) {
                return shipment.shipmentLine.some(function (line) { return line.lineId === lineId && line.shippedQuantity > 0; });
            })
                .map(function (shipment) {
                var _a, _b, _c;
                return ({
                    id: (_a = shipment.id) !== null && _a !== void 0 ? _a : "",
                    documentReadableId: (_b = shipment.shipmentId) !== null && _b !== void 0 ? _b : "",
                    documentId: (_c = shipment.id) !== null && _c !== void 0 ? _c : ""
                });
            })
        }
    ];
}
function SalesOrderExplorer() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var t = (0, macro_1.useLingui)().t;
    var prettifyShortcut = (0, react_1.usePrettifyShortcut)();
    var defaults = (0, hooks_1.useUser)().defaults;
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("Could not find orderId");
    var salesOrderData = (0, hooks_1.useRouteData)(path_1.path.to.salesOrder(orderId));
    var permissions = (0, hooks_1.usePermissions)();
    var salesOrderLineInitialValues = {
        salesOrderId: orderId,
        salesOrderLineType: "Part",
        saleQuantity: 1,
        unitPrice: 0,
        addOnCost: 0,
        nonTaxableAddOnCost: 0,
        locationId: (_c = (_b = (_a = salesOrderData === null || salesOrderData === void 0 ? void 0 : salesOrderData.salesOrder) === null || _a === void 0 ? void 0 : _a.locationId) !== null && _b !== void 0 ? _b : defaults.locationId) !== null && _c !== void 0 ? _c : "",
        taxPercent: (_e = (_d = salesOrderData === null || salesOrderData === void 0 ? void 0 : salesOrderData.customer) === null || _d === void 0 ? void 0 : _d.taxPercent) !== null && _e !== void 0 ? _e : 0,
        promisedDate: (_j = (_g = (_f = salesOrderData === null || salesOrderData === void 0 ? void 0 : salesOrderData.salesOrder) === null || _f === void 0 ? void 0 : _f.receiptPromisedDate) !== null && _g !== void 0 ? _g : (_h = salesOrderData === null || salesOrderData === void 0 ? void 0 : salesOrderData.salesOrder) === null || _h === void 0 ? void 0 : _h.receiptRequestedDate) !== null && _j !== void 0 ? _j : "",
        shippingCost: 0
    };
    var newSalesOrderLineDisclosure = (0, react_1.useDisclosure)();
    var deleteLineDisclosure = (0, react_1.useDisclosure)();
    var _o = (0, react_2.useState)(null), deleteLine = _o[0], setDeleteLine = _o[1];
    var isLocked = (0, sales_models_1.isSalesOrderLocked)((_k = salesOrderData === null || salesOrderData === void 0 ? void 0 : salesOrderData.salesOrder) === null || _k === void 0 ? void 0 : _k.status);
    var isDisabled = isLocked
        ? true
        : ((_l = salesOrderData === null || salesOrderData === void 0 ? void 0 : salesOrderData.salesOrder) === null || _l === void 0 ? void 0 : _l.status) !== "Draft";
    (0, hooks_1.useRealtime)("modelUpload", "modelPath=in.(".concat(salesOrderData === null || salesOrderData === void 0 ? void 0 : salesOrderData.lines.map(function (d) { return d.modelPath; }).join(","), ")"));
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
    var lines = (_m = salesOrderData === null || salesOrderData === void 0 ? void 0 : salesOrderData.lines) !== null && _m !== void 0 ? _m : [];
    var canReorder = !isDisabled && permissions.can("update", "sales") && lines.length > 1;
    var editMode = (0, LineReorder_1.useLineOrderEditMode)({
        actionPath: path_1.path.to.salesOrderLineOrder(orderId),
        lines: lines
    });
    return (<>
      <react_1.VStack className="w-full h-[calc(100dvh-99px)] justify-between">
        <react_1.VStack className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" spacing={0}>
          {lines.length > 0 ? (editMode.isEditing ? (<LineReorder_1.ReorderableLineList lines={editMode.draft} activeLine={editMode.activeLine} onDragStart={editMode.handleDragStart} onDragEnd={editMode.handleDragEnd} renderRow={function (line, dragHandle) { return (<SalesOrderLineBody line={line} dragHandle={dragHandle}/>); }} renderOverlay={function (line) { return (<SalesOrderLineBody line={line} isOverlay/>); }}/>) : (lines.map(function (line) { return (<SalesOrderLineItem key={line.id} isDisabled={isDisabled} line={line} onDelete={onDeleteLine}/>); }))) : (<components_1.Empty>
              {permissions.can("update", "sales") && (<react_1.Button isDisabled={isDisabled} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={newSalesOrderLineDisclosure.onOpen}>
                  <macro_1.Trans>Add Line Item</macro_1.Trans>
                </react_1.Button>)}
            </components_1.Empty>)}
        </react_1.VStack>
        <div className="w-full flex border-t border-border p-4 gap-2">
          {editMode.isEditing ? (<LineReorder_1.ReorderEditBar isSaving={editMode.isSaving} isDirty={editMode.isDirty} onSave={editMode.save} onCancel={editMode.cancelEditMode}/>) : (<>
              <react_1.Tooltip>
                <react_1.TooltipTrigger className="flex-1">
                  <react_1.Button ref={newButtonRef} className="w-full" isDisabled={isDisabled || !permissions.can("update", "sales")} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={newSalesOrderLineDisclosure.onOpen}>
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
              {canReorder && lines.length > 0 && (<react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Reorder lines"], ["Reorder lines"])))} icon={<lu_1.LuSettings2 />} variant="ghost" className="text-muted-foreground" onClick={editMode.enterEditMode}/>)}
            </>)}
        </div>
      </react_1.VStack>
      {newSalesOrderLineDisclosure.isOpen && (<SalesOrderLineForm_1.default initialValues={salesOrderLineInitialValues} type="modal" onClose={newSalesOrderLineDisclosure.onClose}/>)}
      {deleteLineDisclosure.isOpen && (<DeleteSalesOrderLine_1.default line={deleteLine} onCancel={onDeleteCancel}/>)}
    </>);
}
function SalesOrderLineBody(_a) {
    var line = _a.line, dragHandle = _a.dragHandle, isOverlay = _a.isOverlay;
    var items = (0, items_1.useItems)()[0];
    return (<LineReorder_1.ReorderableRow dragHandle={dragHandle} isOverlay={isOverlay}>
      <react_1.HStack spacing={2} className="flex-grow min-w-0 p-2 pr-10">
        <components_1.ItemThumbnail thumbnailPath={line.thumbnailPath} type="Part"/>
        <react_1.VStack spacing={0} className="min-w-0">
          <span className="font-semibold line-clamp-1">
            {(0, utils_1.getItemReadableId)(items, line.itemId)}
          </span>
          <span className="text-muted-foreground text-xs truncate line-clamp-1">
            {line.description}
          </span>
        </react_1.VStack>
      </react_1.HStack>
    </LineReorder_1.ReorderableRow>);
}
function SalesOrderLineItem(_a) {
    var _b;
    var line = _a.line, isDisabled = _a.isDisabled, onDelete = _a.onDelete;
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, react_router_1.useParams)(), orderId = _c.orderId, lineId = _c.lineId;
    if (!orderId)
        throw new Error("Could not find orderId");
    var items = (0, items_1.useItems)()[0];
    var permissions = (0, hooks_1.usePermissions)();
    var disclosure = (0, react_1.useDisclosure)();
    var location = (0, hooks_1.useOptimisticLocation)();
    var navigate = (0, react_router_1.useNavigate)();
    var searchDisclosure = (0, react_1.useDisclosure)();
    (0, react_1.useMount)(function () {
        if (lineId === line.id) {
            disclosure.onOpen();
        }
    });
    var isSelected = location.pathname === path_1.path.to.salesOrderLine(orderId, line.id);
    var onLineClick = function () {
        if (location.pathname !== path_1.path.to.salesOrderLine(orderId, line.id)) {
            navigate(path_1.path.to.salesOrderLine(orderId, line.id));
        }
    };
    return (<react_1.VStack spacing={0} className="border-b">
      <react_1.HStack className={(0, react_1.cn)("group w-full p-2 items-center hover:bg-accent/30 cursor-pointer relative", isSelected && "bg-accent/60 hover:bg-accent/50")} onClick={onLineClick}>
        <react_1.HStack spacing={2} className="flex-grow min-w-0 pr-10">
          <components_1.ItemThumbnail thumbnailPath={line.thumbnailPath} type="Part" // TODO
    />

          <react_1.VStack spacing={0} className="min-w-0">
            <span className="font-semibold line-clamp-1">
              {line.salesOrderLineType === "Fixed Asset"
            ? line.assetReadableId || "Fixed Asset"
            : (0, utils_1.getItemReadableId)(items, line.itemId)}
            </span>
            <span className="text-muted-foreground text-xs truncate line-clamp-1">
              {line.salesOrderLineType === "Fixed Asset"
            ? line.assetName || line.description
            : line.description}
            </span>
          </react_1.VStack>
        </react_1.HStack>
        <div className="absolute right-2">
          <react_1.HStack spacing={1}>
            <react_1.IconButton aria-label={disclosure.isOpen ? "Hide" : "Show"} className={(0, react_1.cn)("animate opacity-0 group-hover:opacity-100 group-active:opacity-100 data-[state=open]:opacity-100", disclosure.isOpen && "-rotate-180")} icon={<lu_1.LuChevronDown />} size="md" variant="solid" onClick={function (e) {
            e.stopPropagation();
            disclosure.onToggle();
        }}/>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["More"], ["More"])))} className="opacity-0 group-hover:opacity-100 group-active:opacity-100 data-[state=open]:opacity-100" icon={<lu_1.LuEllipsisVertical />} size="md" variant="solid" onClick={function (e) { return e.stopPropagation(); }}/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent>
                <react_1.DropdownMenuItem destructive disabled={isDisabled || !permissions.can("update", "sales")} onClick={function (e) {
            e.stopPropagation();
            onDelete(line);
        }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                  <macro_1.Trans>Delete Line</macro_1.Trans>
                </react_1.DropdownMenuItem>
                {/* @ts-expect-error */}
                {shared_1.methodItemType.includes((_b = line === null || line === void 0 ? void 0 : line.salesOrderLineType) !== null && _b !== void 0 ? _b : "") && (<react_1.DropdownMenuItem asChild onClick={function (e) { return e.stopPropagation(); }}>
                    <react_router_1.Link to={(0, ItemForm_1.getLinkToItemDetails)(line.salesOrderLineType, line.itemId)}>
                      <react_1.DropdownMenuIcon icon={<components_1.MethodItemTypeIcon type={"Part"}/>}/>
                      <macro_1.Trans>View Item Master</macro_1.Trans>
                    </react_router_1.Link>
                  </react_1.DropdownMenuItem>)}
                <react_1.DropdownMenuItem onClick={searchDisclosure.onOpen}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuSearch />}/>
                  <macro_1.Trans>Search</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </react_1.HStack>
        </div>
      </react_1.HStack>
      {disclosure.isOpen && (<react_1.VStack className="border-b border-border p-1">
          <RelatedItems lineId={line.id} isSearchExpanded={searchDisclosure.isOpen}/>
        </react_1.VStack>)}
    </react_1.VStack>);
}
function RelatedItems(_a) {
    var lineId = _a.lineId, isSearchExpanded = _a.isSearchExpanded;
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("Could not find orderId");
    var salesOrderData = (0, hooks_1.useRouteData)(path_1.path.to.salesOrder(orderId));
    return (<react_2.Suspense fallback={<div className="p-2 text-sm text-muted-foreground">
          Loading related items...
        </div>}>
      <react_router_1.Await resolve={salesOrderData === null || salesOrderData === void 0 ? void 0 : salesOrderData.relatedItems}>
        {function (relatedItemsData) {
            // Process the related items for this specific line
            // @ts-ignore
            var relatedItems = getRelatedItems(relatedItemsData, lineId);
            return (<SalesOrderLineRelatedItems relatedItems={relatedItems} isSearchExpanded={isSearchExpanded}/>);
        }}
      </react_router_1.Await>
    </react_2.Suspense>);
}
// Component to display related items tree for a sales order line
function SalesOrderLineRelatedItems(_a) {
    var relatedItems = _a.relatedItems, isSearchExpanded = _a.isSearchExpanded;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(""), filterText = _b[0], setFilterText = _b[1];
    return (<react_1.VStack className="w-full p-2">
      {isSearchExpanded && (<react_1.HStack className="w-full pb-2">
          <react_1.InputGroup size="sm" className="flex flex-grow">
            <react_1.InputLeftElement>
              <lu_1.LuSearch className="h-4 w-4"/>
            </react_1.InputLeftElement>
            <react_1.Input placeholder={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Search related items..."], ["Search related items..."])))} value={filterText} onChange={function (e) { return setFilterText(e.target.value); }}/>
          </react_1.InputGroup>
        </react_1.HStack>)}
      <react_1.VStack spacing={0} className="w-full">
        {relatedItems.map(function (node) { return (<RelatedItemTreeNode key={node.key} node={node} filterText={filterText}/>); })}
      </react_1.VStack>
    </react_1.VStack>);
}
// Component to display a node in the related items tree
function RelatedItemTreeNode(_a) {
    var node = _a.node, filterText = _a.filterText;
    var _b = (0, react_2.useState)(true), isExpanded = _b[0], setIsExpanded = _b[1];
    var filteredChildren = node.children.filter(function (child) {
        return child.documentReadableId.toLowerCase().includes(filterText.toLowerCase());
    });
    return (<>
      <button className="flex h-8 cursor-pointer items-center overflow-hidden rounded-sm px-2 gap-2 text-sm hover:bg-accent w-full font-medium" onClick={function (e) {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
        }}>
        <div className="h-8 w-4 flex items-center justify-center">
          <lu_1.LuChevronRight className={(0, react_1.cn)("size-4", isExpanded && "rotate-90")}/>
        </div>
        <div className="flex flex-grow items-center justify-between gap-2">
          <span>{node.name}</span>
          {filteredChildren.length > 0 && (<react_1.Count count={filteredChildren.length}/>)}
        </div>
      </button>
      {isExpanded && (<div className="flex flex-col w-full">
          {filteredChildren.length === 0 ? (<div className="flex h-8 items-center overflow-hidden rounded-sm px-2 gap-4">
              <TreeView_1.LevelLine isSelected={false}/>
              <div className="text-xs text-muted-foreground">
                No {node.name.toLowerCase()} found
              </div>
            </div>) : (filteredChildren.map(function (child) { return (<RelatedItemLink key={child.id} item={child} nodeType={node.key}/>); }))}
        </div>)}
    </>);
}
// Component to display a link to a related item
function RelatedItemLink(_a) {
    var item = _a.item, nodeType = _a.nodeType;
    var getLinkForItem = function () {
        switch (nodeType) {
            case "jobs":
                return item.documentId ? path_1.path.to.job(item.documentId) : "#";
            case "shipments":
                return item.documentId ? path_1.path.to.shipment(item.documentId) : "#";
            default:
                return "#";
        }
    };
    var getIcon = function () {
        switch (nodeType) {
            case "jobs":
                return <components_1.MethodIcon type="Make to Order"/>;
            case "shipments":
                return <lu_1.LuTruck className="text-indigo-600"/>;
            default:
                return null;
        }
    };
    return (<components_1.Hyperlink to={getLinkForItem()} className="flex h-8 cursor-pointer items-center overflow-hidden rounded-sm px-1 gap-4 text-sm hover:bg-accent w-full font-medium whitespace-nowrap">
      <TreeView_1.LevelLine isSelected={false} className="mr-2"/>
      <div className="mr-2">{getIcon()}</div>
      <span className="truncate">{item.documentReadableId}</span>
    </components_1.Hyperlink>);
}
var templateObject_1, templateObject_2, templateObject_3;
