"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PurchaseInvoiceExplorer;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var LineReorder_1 = require("~/components/LineReorder");
var hooks_1 = require("~/hooks");
var ItemForm_1 = require("~/modules/items/ui/Item/ItemForm");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var DeletePurchaseInvoiceLine_1 = require("./DeletePurchaseInvoiceLine");
var PurchaseInvoiceLineForm_1 = require("./PurchaseInvoiceLineForm");
function PurchaseInvoiceExplorer() {
    var _a, _b, _c, _d, _e, _f, _g;
    var t = (0, macro_1.useLingui)().t;
    var prettifyShortcut = (0, react_1.usePrettifyShortcut)();
    var defaults = (0, hooks_1.useUser)().defaults;
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    if (!invoiceId)
        throw new Error("Could not find invoiceId");
    var purchaseInvoiceData = (0, hooks_1.useRouteData)(path_1.path.to.purchaseInvoice(invoiceId));
    var permissions = (0, hooks_1.usePermissions)();
    var purchaseInvoiceLineInitialValues = {
        invoiceId: invoiceId,
        invoiceLineType: "Item",
        purchaseQuantity: 1,
        locationId: (_c = (_b = (_a = purchaseInvoiceData === null || purchaseInvoiceData === void 0 ? void 0 : purchaseInvoiceData.purchaseInvoice) === null || _a === void 0 ? void 0 : _a.locationId) !== null && _b !== void 0 ? _b : defaults.locationId) !== null && _c !== void 0 ? _c : "",
        supplierUnitPrice: 0,
        supplierShippingCost: 0,
        supplierTaxAmount: 0,
        exchangeRate: (_e = (_d = purchaseInvoiceData === null || purchaseInvoiceData === void 0 ? void 0 : purchaseInvoiceData.purchaseInvoice) === null || _d === void 0 ? void 0 : _d.exchangeRate) !== null && _e !== void 0 ? _e : 1
    };
    var newPurchaseInvoiceLineDisclosure = (0, react_1.useDisclosure)();
    var deleteLineDisclosure = (0, react_1.useDisclosure)();
    var _h = (0, react_2.useState)(null), deleteLine = _h[0], setDeleteLine = _h[1];
    var isDisabled = ((_f = purchaseInvoiceData === null || purchaseInvoiceData === void 0 ? void 0 : purchaseInvoiceData.purchaseInvoice) === null || _f === void 0 ? void 0 : _f.status) !== "Draft";
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
    var lines = (_g = purchaseInvoiceData === null || purchaseInvoiceData === void 0 ? void 0 : purchaseInvoiceData.purchaseInvoiceLines) !== null && _g !== void 0 ? _g : [];
    var canReorder = !isDisabled && permissions.can("update", "invoicing") && lines.length > 1;
    var editMode = (0, LineReorder_1.useLineOrderEditMode)({
        actionPath: path_1.path.to.purchaseInvoiceLineOrder(invoiceId),
        lines: lines
    });
    return (<>
      <react_1.VStack className="w-full h-[calc(100dvh-99px)] justify-between">
        <react_1.VStack className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" spacing={0}>
          {lines.length > 0 ? (editMode.isEditing ? (<LineReorder_1.ReorderableLineList lines={editMode.draft} activeLine={editMode.activeLine} onDragStart={editMode.handleDragStart} onDragEnd={editMode.handleDragEnd} renderRow={function (line, dragHandle) { return (<PurchaseInvoiceLineBody line={line} dragHandle={dragHandle}/>); }} renderOverlay={function (line) { return (<PurchaseInvoiceLineBody line={line} isOverlay/>); }}/>) : (lines.map(function (line) { return (<PurchaseInvoiceLineItem key={line.id} isDisabled={isDisabled} line={line} onDelete={onDeleteLine}/>); }))) : (<components_1.Empty>
              {permissions.can("update", "sales") && (<react_1.Button isDisabled={isDisabled} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={newPurchaseInvoiceLineDisclosure.onOpen}>
                  <macro_1.Trans>Add Line Item</macro_1.Trans>
                </react_1.Button>)}
            </components_1.Empty>)}
        </react_1.VStack>
        <div className="w-full flex border-t border-border p-4 gap-2">
          {editMode.isEditing ? (<LineReorder_1.ReorderEditBar isSaving={editMode.isSaving} isDirty={editMode.isDirty} onSave={editMode.save} onCancel={editMode.cancelEditMode}/>) : (<>
              <react_1.Tooltip>
                <react_1.TooltipTrigger className="flex-1">
                  <react_1.Button ref={newButtonRef} className="w-full" isDisabled={isDisabled || !permissions.can("update", "sales")} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={newPurchaseInvoiceLineDisclosure.onOpen}>
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
      {newPurchaseInvoiceLineDisclosure.isOpen && (<PurchaseInvoiceLineForm_1.default initialValues={purchaseInvoiceLineInitialValues} type="modal" onClose={newPurchaseInvoiceLineDisclosure.onClose}/>)}
      {deleteLineDisclosure.isOpen && (<DeletePurchaseInvoiceLine_1.default line={deleteLine} onCancel={onDeleteCancel}/>)}
    </>);
}
function PurchaseInvoiceLineBody(_a) {
    var line = _a.line, dragHandle = _a.dragHandle, isOverlay = _a.isOverlay;
    var items = (0, stores_1.useItems)()[0];
    return (<LineReorder_1.ReorderableRow dragHandle={dragHandle} isOverlay={isOverlay}>
      <react_1.HStack spacing={2} className="flex-grow min-w-0 p-2 pr-10">
        <components_1.ItemThumbnail thumbnailPath={line.thumbnailPath} type="Part"/>
        <react_1.VStack spacing={0} className="min-w-0">
          <span className="font-semibold line-clamp-1">
            {line.invoiceLineType === "G/L Account"
            ? line.description || "Indirect Expense"
            : (0, utils_1.getItemReadableId)(items, line.itemId)}
          </span>
          <span className="text-muted-foreground text-xs truncate line-clamp-1">
            {line.invoiceLineType === "G/L Account"
            ? "G/L Account"
            : line.description}
          </span>
        </react_1.VStack>
      </react_1.HStack>
    </LineReorder_1.ReorderableRow>);
}
function PurchaseInvoiceLineItem(_a) {
    var _b;
    var line = _a.line, isDisabled = _a.isDisabled, onDelete = _a.onDelete;
    var t = (0, macro_1.useLingui)().t;
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    if (!invoiceId)
        throw new Error("Could not find invoiceId");
    var permissions = (0, hooks_1.usePermissions)();
    var location = (0, hooks_1.useOptimisticLocation)();
    var items = (0, stores_1.useItems)()[0];
    var isSelected = location.pathname === path_1.path.to.purchaseInvoiceLine(invoiceId, line.id);
    return (<react_1.VStack spacing={0} className="border-b">
      <react_router_1.Link to={path_1.path.to.purchaseInvoiceLine(invoiceId, line.id)} prefetch="intent" className="w-full">
        <react_1.HStack className={(0, react_1.cn)("group w-full p-2 items-center hover:bg-accent/30 cursor-pointer relative", "border-b border-border", isSelected && "bg-accent/60 hover:bg-accent/50")}>
          <react_1.HStack spacing={2} className="flex-grow min-w-0 pr-10">
            <components_1.ItemThumbnail thumbnailPath={line.thumbnailPath} type="Part"/>
            <react_1.VStack spacing={0} className="min-w-0">
              <span className="font-semibold line-clamp-1">
                {line.invoiceLineType === "G/L Account"
            ? line.description || "G/L Account"
            : line.invoiceLineType === "Fixed Asset"
                ? line.assetReadableId || "Fixed Asset"
                : (0, utils_1.getItemReadableId)(items, line.itemId)}
              </span>
              <span className="text-muted-foreground text-xs truncate line-clamp-1">
                {line.invoiceLineType === "G/L Account"
            ? "G/L Account"
            : line.invoiceLineType === "Fixed Asset"
                ? line.assetName || line.description
                : line.description}
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
                {/* @ts-expect-error */}
                {shared_1.methodItemType.includes((_b = line.invoiceLineType) !== null && _b !== void 0 ? _b : "") && (<react_1.DropdownMenuItem asChild onClick={function (e) { return e.stopPropagation(); }}>
                    <react_router_1.Link to={(0, ItemForm_1.getLinkToItemDetails)(line.invoiceLineType, line.itemId)}>
                      <react_1.DropdownMenuIcon icon={<components_1.MethodItemTypeIcon type={"Part"}/>}/>
                      <macro_1.Trans>View Item Master</macro_1.Trans>
                    </react_router_1.Link>
                  </react_1.DropdownMenuItem>)}
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </div>
        </react_1.HStack>
      </react_router_1.Link>
    </react_1.VStack>);
}
var templateObject_1, templateObject_2;
