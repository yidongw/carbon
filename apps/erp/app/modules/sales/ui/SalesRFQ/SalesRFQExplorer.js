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
exports.default = SalesRFQExplorer;
exports.useOptimisticSalesRFQLineDrag = useOptimisticSalesRFQLineDrag;
var react_1 = require("@carbon/react");
var core_1 = require("@dnd-kit/core");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var LineReorder_1 = require("~/components/LineReorder");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var DeleteSalesRFQLine_1 = require("./DeleteSalesRFQLine");
var SalesRFQLineForm_1 = require("./SalesRFQLineForm");
var useOptimiticDocumentDrag_1 = require("./useOptimiticDocumentDrag");
function SalesRFQExplorer() {
    var _a, _b, _c;
    var t = (0, macro_1.useLingui)().t;
    var prettifyShortcut = (0, react_1.usePrettifyShortcut)();
    var rfqId = (0, react_router_1.useParams)().rfqId;
    if (!rfqId)
        throw new Error("Could not find rfqId");
    var salesRfqData = (0, hooks_1.useRouteData)(path_1.path.to.salesRfq(rfqId));
    var permissions = (0, hooks_1.usePermissions)();
    (0, hooks_1.useRealtime)("modelUpload", "modelPath=in.(".concat(salesRfqData === null || salesRfqData === void 0 ? void 0 : salesRfqData.lines.map(function (d) { return d.modelPath; }).join(","), ")"));
    var newSalesRFQLineDisclosure = (0, react_1.useDisclosure)();
    var deleteLineDisclosure = (0, react_1.useDisclosure)();
    var _d = (0, react_2.useState)(null), deleteLine = _d[0], setDeleteLine = _d[1];
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
    var salesRfqLineInitialValues = {
        salesRfqId: rfqId,
        customerPartId: "",
        customerPartRevision: "",
        description: "",
        itemId: "",
        quantity: [1],
        order: 1,
        unitOfMeasureCode: "EA"
    };
    var isDisabled = (0, sales_models_1.isSalesRfqLocked)((_a = salesRfqData === null || salesRfqData === void 0 ? void 0 : salesRfqData.rfqSummary) === null || _a === void 0 ? void 0 : _a.status);
    var _e = (0, core_1.useDroppable)({
        id: "sales-rfq-explorer"
    }), setExplorerRef = _e.setNodeRef, isOverExplorer = _e.isOver;
    var linesByCustomerPartId = new Map(salesRfqData === null || salesRfqData === void 0 ? void 0 : salesRfqData.lines.map(function (line) { return [line.customerPartId, line]; }));
    var pendingItems = (0, useOptimiticDocumentDrag_1.useOptimisticDocumentDrag)();
    // merge pending items and existing items
    for (var _i = 0, pendingItems_1 = pendingItems; _i < pendingItems_1.length; _i++) {
        var pendingItem = pendingItems_1[_i];
        var item = linesByCustomerPartId.get(pendingItem.customerPartId);
        var merged = item
            ? __assign(__assign({}, item), pendingItem) : __assign(__assign({}, pendingItem), { salesRfqId: rfqId });
        linesByCustomerPartId.set(pendingItem.customerPartId, merged);
    }
    var lines = Array.from(linesByCustomerPartId.values());
    var realLines = ((_b = salesRfqData === null || salesRfqData === void 0 ? void 0 : salesRfqData.lines) !== null && _b !== void 0 ? _b : []);
    var canReorder = !isDisabled && permissions.can("update", "sales") && realLines.length > 1;
    var editMode = (0, LineReorder_1.useLineOrderEditMode)({
        actionPath: path_1.path.to.salesRfqLineOrder(rfqId),
        lines: realLines,
        getSortOrder: function (line) { var _a; return (_a = line.order) !== null && _a !== void 0 ? _a : 0; }
    });
    return (<div ref={setExplorerRef} data-sales-rfq-explorer className={(0, react_1.cn)("transition-colors duration-200", isOverExplorer && "bg-primary/10 border-2 border-dashed border-primary")}>
      <react_1.VStack className="w-full h-[calc(100dvh-99px)] justify-between">
        <react_1.VStack className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" spacing={0}>
          {((salesRfqData === null || salesRfqData === void 0 ? void 0 : salesRfqData.lines) && ((_c = salesRfqData === null || salesRfqData === void 0 ? void 0 : salesRfqData.lines) === null || _c === void 0 ? void 0 : _c.length) > 0) ||
            lines.length > 0 ? (editMode.isEditing ? (<LineReorder_1.ReorderableLineList lines={editMode.draft} activeLine={editMode.activeLine} onDragStart={editMode.handleDragStart} onDragEnd={editMode.handleDragEnd} renderRow={function (line, dragHandle) { return (<SalesRFQLineBody line={line} dragHandle={dragHandle}/>); }} renderOverlay={function (line) { return (<SalesRFQLineBody line={line} isOverlay/>); }}/>) : (lines.map(function (line) {
            return !isSalesRFQLine(line) ? (<OptimisticSalesRFQLineItem key={line.id} line={line}/>) : (<DroppableSalesRFQLineItem key={line.id} line={line} isDisabled={isDisabled} onDelete={onDeleteLine}/>);
        }))) : (<components_1.Empty>
              {permissions.can("update", "sales") && (<react_1.Button leftIcon={<lu_1.LuCirclePlus />} isDisabled={isDisabled} variant="secondary" onClick={newSalesRFQLineDisclosure.onOpen}>
                  <macro_1.Trans>Add Line Item</macro_1.Trans>
                </react_1.Button>)}
            </components_1.Empty>)}
        </react_1.VStack>
        <div className="w-full flex border-t border-border p-4 gap-2">
          {editMode.isEditing ? (<LineReorder_1.ReorderEditBar isSaving={editMode.isSaving} isDirty={editMode.isDirty} onSave={editMode.save} onCancel={editMode.cancelEditMode}/>) : (<>
              <react_1.Tooltip>
                <react_1.TooltipTrigger className="flex-1">
                  <react_1.Button ref={newButtonRef} className="w-full" isDisabled={isDisabled || !permissions.can("update", "sales")} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={newSalesRFQLineDisclosure.onOpen}>
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
              {canReorder && realLines.length > 0 && (<react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Reorder lines"], ["Reorder lines"])))} icon={<lu_1.LuSettings2 />} variant="ghost" className="text-muted-foreground" onClick={editMode.enterEditMode}/>)}
            </>)}
        </div>
      </react_1.VStack>
      {newSalesRFQLineDisclosure.isOpen && (<SalesRFQLineForm_1.default initialValues={salesRfqLineInitialValues} type="modal" onClose={newSalesRFQLineDisclosure.onClose}/>)}
      {deleteLineDisclosure.isOpen && (<DeleteSalesRFQLine_1.default line={deleteLine} onCancel={onDeleteCancel}/>)}
    </div>);
}
function isSalesRFQLine(line) {
    return "id" in line && "order" in line && "unitOfMeasureCode" in line;
}
function SalesRFQLineBody(_a) {
    var line = _a.line, dragHandle = _a.dragHandle, isOverlay = _a.isOverlay;
    return (<LineReorder_1.ReorderableRow dragHandle={dragHandle} isOverlay={isOverlay}>
      <react_1.HStack spacing={2} className="flex-grow min-w-0 p-2 pr-10">
        <components_1.ItemThumbnail thumbnailPath={line.thumbnailPath} type={line.itemType}/>
        <react_1.VStack spacing={0} className="min-w-0">
          <span className="font-semibold line-clamp-1">
            {line.customerPartId}
            {line.customerPartRevision && "-".concat(line.customerPartRevision)}
          </span>
          <span className="font-medium text-muted-foreground text-xs line-clamp-1">
            {line.itemReadableId}
          </span>
        </react_1.VStack>
      </react_1.HStack>
    </LineReorder_1.ReorderableRow>);
}
function OptimisticSalesRFQLineItem(_a) {
    var line = _a.line;
    return (<react_1.VStack spacing={0} className="border-b">
      <react_1.HStack className="w-full p-2 items-center justify-between hover:bg-accent/30 cursor-pointer">
        <react_1.HStack spacing={2}>
          <div className="w-10 h-10 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-2">
            <react_1.Spinner className="w-6 h-6 text-muted-foreground"/>
          </div>

          <react_1.VStack spacing={0}>
            <span className="font-semibold line-clamp-1">
              {line.customerPartId}
            </span>
          </react_1.VStack>
        </react_1.HStack>
        <react_1.HStack spacing={0}></react_1.HStack>
      </react_1.HStack>
    </react_1.VStack>);
}
function DroppableSalesRFQLineItem(_a) {
    var line = _a.line, isDisabled = _a.isDisabled, onDelete = _a.onDelete;
    var _b = (0, core_1.useDroppable)({
        id: "sales-rfq-line-".concat(line.id),
        data: { lineId: line.id }
    }), setNodeRef = _b.setNodeRef, isOver = _b.isOver;
    return (<div ref={setNodeRef} className={(0, react_1.cn)("transition-colors duration-200 w-full", isOver && "bg-primary/20 border-2 border-dashed border-primary")}>
      <SalesRFQLineItem line={line} isDisabled={isDisabled} onDelete={onDelete}/>
    </div>);
}
function SalesRFQLineItem(_a) {
    var line = _a.line, isDisabled = _a.isDisabled, onDelete = _a.onDelete;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_router_1.useParams)(), rfqId = _b.rfqId, lineId = _b.lineId;
    if (!rfqId)
        throw new Error("Could not find rfqId");
    var permissions = (0, hooks_1.usePermissions)();
    var isSelected = lineId === line.id;
    return (<react_1.VStack spacing={0} className="border-b">
      <react_router_1.Link className="w-full" prefetch="intent" to={path_1.path.to.salesRfqLine(rfqId, line.id)}>
        <react_1.HStack className={(0, react_1.cn)("group w-full p-2 items-center hover:bg-accent/30 cursor-pointer relative", isSelected && "bg-accent/60 hover:bg-accent/50")}>
          <react_1.HStack spacing={2} className="flex-grow min-w-0 pr-10">
            <components_1.ItemThumbnail thumbnailPath={line.thumbnailPath} type={line.itemType}/>

            <react_1.VStack spacing={0} className="min-w-0">
              <span className="font-semibold line-clamp-1">
                {line.customerPartId}
                {line.customerPartRevision && "-".concat(line.customerPartRevision)}
              </span>
              <span className="font-medium text-muted-foreground text-xs line-clamp-1">
                {line.itemReadableId}
              </span>
            </react_1.VStack>
          </react_1.HStack>
          <div className="absolute right-2">
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["More"], ["More"])))} className="opacity-0 group-hover:opacity-100 group-active:opacity-100 data-[state=open]:opacity-100" icon={<lu_1.LuEllipsisVertical />} variant="solid" onClick={function (e) { return e.stopPropagation(); }}/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent>
                <react_1.DropdownMenuItem destructive disabled={isDisabled || !permissions.can("update", "sales")} onClick={function (e) {
            e.stopPropagation();
            onDelete(line);
        }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                  <macro_1.Trans>Delete Line</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </div>
        </react_1.HStack>
      </react_router_1.Link>
    </react_1.VStack>);
}
function useOptimisticSalesRFQLineDrag() {
    var rfqId = (0, react_router_1.useParams)().rfqId;
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        return fetcher.formAction === path_1.path.to.salesRfqDrag(rfqId);
    })
        .reduce(function (acc, fetcher) {
        var _a;
        var payload = (_a = fetcher === null || fetcher === void 0 ? void 0 : fetcher.formData) === null || _a === void 0 ? void 0 : _a.get("payload");
        if (payload) {
            try {
                var parsedPayload = sales_models_1.salesRfqDragValidator.parse(JSON.parse(payload));
                return __spreadArray(__spreadArray([], acc, true), [parsedPayload], false);
            }
            catch (_b) {
                // nothing
            }
        }
        return acc;
    }, []);
}
var templateObject_1, templateObject_2;
