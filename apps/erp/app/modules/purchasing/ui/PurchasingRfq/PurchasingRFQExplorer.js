"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PurchasingRFQExplorer;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var LineReorder_1 = require("~/components/LineReorder");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var purchasing_models_1 = require("../../purchasing.models");
var DeletePurchasingRFQLine_1 = require("./DeletePurchasingRFQLine");
var PurchasingRFQLineForm_1 = require("./PurchasingRFQLineForm");
function PurchasingRFQExplorer() {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var prettifyShortcut = (0, react_1.usePrettifyShortcut)();
    var rfqId = (0, react_router_1.useParams)().rfqId;
    if (!rfqId)
        throw new Error("Could not find rfqId");
    var purchasingRfqData = (0, hooks_1.useRouteData)(path_1.path.to.purchasingRfq(rfqId));
    var permissions = (0, hooks_1.usePermissions)();
    var newPurchasingRFQLineDisclosure = (0, react_1.useDisclosure)();
    var deleteLineDisclosure = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(null), deleteLine = _b[0], setDeleteLine = _b[1];
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
    var purchasingRfqLineInitialValues = {
        purchasingRfqId: rfqId,
        description: "",
        itemId: "",
        quantity: [1],
        order: 1,
        purchaseUnitOfMeasureCode: "EA",
        inventoryUnitOfMeasureCode: "EA",
        conversionFactor: 1,
        itemType: "Item"
    };
    var isDisabled = (0, purchasing_models_1.isRfqLocked)(purchasingRfqData === null || purchasingRfqData === void 0 ? void 0 : purchasingRfqData.rfqSummary.status);
    var lines = (_a = purchasingRfqData === null || purchasingRfqData === void 0 ? void 0 : purchasingRfqData.lines) !== null && _a !== void 0 ? _a : [];
    var canReorder = !isDisabled && permissions.can("update", "purchasing") && lines.length > 1;
    var editMode = (0, LineReorder_1.useLineOrderEditMode)({
        actionPath: path_1.path.to.purchasingRfqLineOrder(rfqId),
        lines: lines,
        getSortOrder: function (line) { var _a; return (_a = line.order) !== null && _a !== void 0 ? _a : 0; }
    });
    return (<div data-purchasing-rfq-explorer>
      <react_1.VStack className="w-full h-[calc(100dvh-99px)] justify-between">
        <react_1.VStack className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" spacing={0}>
          {lines.length > 0 ? (editMode.isEditing ? (<LineReorder_1.ReorderableLineList lines={editMode.draft} activeLine={editMode.activeLine} onDragStart={editMode.handleDragStart} onDragEnd={editMode.handleDragEnd} renderRow={function (line, dragHandle) { return (<PurchasingRFQLineBody line={line} dragHandle={dragHandle}/>); }} renderOverlay={function (line) { return (<PurchasingRFQLineBody line={line} isOverlay/>); }}/>) : (lines.map(function (line) { return (<PurchasingRFQLineItem key={line.id} line={line} isDisabled={isDisabled} onDelete={onDeleteLine}/>); }))) : (<components_1.Empty>
              {permissions.can("update", "purchasing") && (<react_1.Button leftIcon={<lu_1.LuCirclePlus />} isDisabled={isDisabled} variant="secondary" onClick={newPurchasingRFQLineDisclosure.onOpen}>
                  <macro_1.Trans>Add Line Item</macro_1.Trans>
                </react_1.Button>)}
            </components_1.Empty>)}
        </react_1.VStack>
        <div className="w-full flex border-t border-border p-4 gap-2">
          {editMode.isEditing ? (<LineReorder_1.ReorderEditBar isSaving={editMode.isSaving} isDirty={editMode.isDirty} onSave={editMode.save} onCancel={editMode.cancelEditMode}/>) : (<>
              <react_1.Tooltip>
                <react_1.TooltipTrigger className="flex-1">
                  <react_1.Button ref={newButtonRef} className="w-full" isDisabled={isDisabled || !permissions.can("update", "purchasing")} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={newPurchasingRFQLineDisclosure.onOpen}>
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
      {newPurchasingRFQLineDisclosure.isOpen && (<PurchasingRFQLineForm_1.default initialValues={purchasingRfqLineInitialValues} type="modal" onClose={newPurchasingRFQLineDisclosure.onClose}/>)}
      {deleteLineDisclosure.isOpen && (<DeletePurchasingRFQLine_1.default line={deleteLine} onCancel={onDeleteCancel}/>)}
    </div>);
}
function PurchasingRFQLineBody(_a) {
    var line = _a.line, dragHandle = _a.dragHandle, isOverlay = _a.isOverlay;
    return (<LineReorder_1.ReorderableRow dragHandle={dragHandle} isOverlay={isOverlay}>
      <react_1.HStack spacing={2} className="flex-grow min-w-0 p-2 pr-10">
        <components_1.ItemThumbnail thumbnailPath={line.thumbnailPath} type={line.itemType}/>
        <react_1.VStack spacing={0} className="min-w-0">
          <span className="font-semibold line-clamp-1">
            {line.itemReadableId || line.description || "Item"}
          </span>
          <span className="font-medium text-muted-foreground text-xs line-clamp-1">
            {line.description}
          </span>
        </react_1.VStack>
      </react_1.HStack>
    </LineReorder_1.ReorderableRow>);
}
function PurchasingRFQLineItem(_a) {
    var line = _a.line, isDisabled = _a.isDisabled, onDelete = _a.onDelete;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_router_1.useParams)(), rfqId = _b.rfqId, lineId = _b.lineId;
    if (!rfqId)
        throw new Error("Could not find rfqId");
    var permissions = (0, hooks_1.usePermissions)();
    var isSelected = lineId === line.id;
    return (<react_1.VStack spacing={0} className="border-b">
      <react_router_1.Link className="w-full" prefetch="intent" to={path_1.path.to.purchasingRfqLine(rfqId, line.id)}>
        <react_1.HStack className={(0, react_1.cn)("group w-full p-2 items-center hover:bg-accent/30 cursor-pointer relative", isSelected && "bg-accent/60 hover:bg-accent/50 shadow-inner")}>
          <react_1.HStack spacing={2} className="flex-grow min-w-0 pr-10">
            <components_1.ItemThumbnail thumbnailPath={line.thumbnailPath} type={line.itemType}/>

            <react_1.VStack spacing={0} className="min-w-0">
              <span className="font-semibold line-clamp-1">
                {line.itemReadableId || line.description || "Item"}
              </span>
              <span className="font-medium text-muted-foreground text-xs line-clamp-1">
                {line.description}
              </span>
            </react_1.VStack>
          </react_1.HStack>
          <div className="absolute right-2">
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["More"], ["More"])))} className="opacity-0 group-hover:opacity-100 group-active:opacity-100 data-[state=open]:opacity-100" icon={<lu_1.LuEllipsisVertical />} variant="solid" onClick={function (e) { return e.stopPropagation(); }}/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent>
                <react_1.DropdownMenuItem destructive disabled={isDisabled || !permissions.can("update", "purchasing")} onClick={function (e) {
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
var templateObject_1, templateObject_2;
