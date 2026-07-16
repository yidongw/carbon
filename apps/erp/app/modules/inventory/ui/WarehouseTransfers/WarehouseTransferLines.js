"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var useWarehouseTransferLines_1 = require("./useWarehouseTransferLines");
var WarehouseTransferLines = function (_a) {
    var warehouseTransferLines = _a.warehouseTransferLines, transferId = _a.transferId, warehouseTransfer = _a.warehouseTransfer, _b = _a.compact, compact = _b === void 0 ? false : _b;
    var items = (0, stores_1.useItems)()[0];
    var canEdit = (0, useWarehouseTransferLines_1.default)(warehouseTransfer).canEdit;
    var sortedLines = warehouseTransferLines.sort(function (a, b) {
        var _a, _b;
        var aReadableId = (_a = (0, utils_1.getItemReadableId)(items, a.itemId)) !== null && _a !== void 0 ? _a : "";
        var bReadableId = (_b = (0, utils_1.getItemReadableId)(items, b.itemId)) !== null && _b !== void 0 ? _b : "";
        return aReadableId.localeCompare(bReadableId);
    });
    return (<>
      <react_1.Card className={(0, react_1.cn)(compact && "border-none p-0 dark:shadow-none")}>
        <react_1.HStack className="justify-between">
          <react_1.CardHeader className={(0, react_1.cn)(compact && "px-0")}>
            <react_1.CardTitle className="flex flex-row items-center gap-2">
              <macro_1.Trans>Transfer Lines</macro_1.Trans>
              {sortedLines.length > 0 && <react_1.Count count={sortedLines.length}/>}
            </react_1.CardTitle>
          </react_1.CardHeader>
          {canEdit && (<react_1.CardAction>
              <react_1.Button variant="secondary" leftIcon={<lu_1.LuCirclePlus />} asChild disabled={!canEdit}>
                <react_router_1.Link to={path_1.path.to.newWarehouseTransferLine(transferId)}>
                  Add Line
                </react_router_1.Link>
              </react_1.Button>
            </react_1.CardAction>)}
        </react_1.HStack>
        <react_1.CardContent className={(0, react_1.cn)(compact && "px-0")}>
          <div className="flex flex-col gap-6">
            {sortedLines.length > 0 && (<div className="border rounded-lg">
                {sortedLines.map(function (line, index) { return (<WarehouseTransferLineListItem key={line.id} line={line} warehouseTransfer={warehouseTransfer} isDisabled={!canEdit} className={index === sortedLines.length - 1 ? "border-none" : ""}/>); })}
              </div>)}

            {sortedLines.length === 0 && (<div className="flex flex-1 py-24 justify-center items-center w-full">
                <components_1.Empty />
              </div>)}
          </div>
        </react_1.CardContent>
      </react_1.Card>
      <react_router_1.Outlet />
    </>);
};
function WarehouseTransferLineListItem(_a) {
    var _b, _c, _d;
    var line = _a.line, warehouseTransfer = _a.warehouseTransfer, isDisabled = _a.isDisabled, className = _a.className;
    var t = (0, macro_1.useLingui)().t;
    var deleteModalDisclosure = (0, react_1.useDisclosure)();
    var items = (0, stores_1.useItems)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var item = (0, utils_1.getItemById)(items, line.itemId);
    if (!item || !line.id)
        return null;
    var isUpdated = line.updatedBy !== null;
    var person = isUpdated ? line.updatedBy : line.createdBy;
    var date = (_b = line.updatedAt) !== null && _b !== void 0 ? _b : line.createdAt;
    return (<div className={(0, react_1.cn)("border-b p-6", className)}>
      <div className="flex flex-1 justify-between items-center w-full">
        <react_1.HStack spacing={4} className="w-1/2">
          <react_1.HStack spacing={4} className="flex-1">
            <div className="flex items-center space-x-3">
              <components_1.ItemThumbnail size="sm" thumbnailPath={(_c = line.item) === null || _c === void 0 ? void 0 : _c.thumbnailPath} 
    // @ts-expect-error TS2339 - TODO: fix type
    type={(_d = item.type) !== null && _d !== void 0 ? _d : "Part"}/>
              <react_1.VStack spacing={0}>
                <span className="text-sm font-medium truncate">
                  {/* @ts-expect-error TS2339 */}
                  {item.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {item.readableIdWithRevision}
                </span>
              </react_1.VStack>
            </div>
            <div className="flex items-center gap-2">
              <react_1.Badge variant="secondary">
                {Number(line.quantity).toLocaleString()}
              </react_1.Badge>
              {line.fromStorageUnit && (<react_1.Badge variant="outline">{line.fromStorageUnit.name}</react_1.Badge>)}
              <lu_1.LuArrowRight className="size-4"/>
              {line.toStorageUnit && (<react_1.Badge variant="outline">{line.toStorageUnit.name}</react_1.Badge>)}
            </div>
          </react_1.HStack>
        </react_1.HStack>
        <div className="flex items-center justify-end gap-2">
          <react_1.HStack spacing={2}>
            <span className="text-xs text-muted-foreground">
              {isUpdated ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Updated"], ["Updated"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Created"], ["Created"])))} {(0, utils_1.formatRelativeTime)(date)}
            </span>
            <components_1.EmployeeAvatar employeeId={person} withName={false}/>
          </react_1.HStack>
          {!isDisabled && (<react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Open menu"], ["Open menu"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost"/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent align="end">
                <react_1.DropdownMenuItem disabled={isDisabled} onClick={function () {
                return navigate(path_1.path.to.warehouseTransferLine(warehouseTransfer.id, line.id));
            }}>
                  <macro_1.Trans>Edit</macro_1.Trans>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuItem disabled={isDisabled} destructive onClick={deleteModalDisclosure.onOpen}>
                  <macro_1.Trans>Delete</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>)}
        </div>
      </div>

      {deleteModalDisclosure.isOpen && (<DeleteWarehouseTransferLine lineId={line.id} warehouseTransferId={warehouseTransfer.id} itemName={item.readableIdWithRevision} onCancel={function () {
                deleteModalDisclosure.onClose();
            }} onSubmit={function () {
                deleteModalDisclosure.onClose();
            }}/>)}
    </div>);
}
function DeleteWarehouseTransferLine(_a) {
    var lineId = _a.lineId, warehouseTransferId = _a.warehouseTransferId, itemName = _a.itemName, onCancel = _a.onCancel, onSubmit = _a.onSubmit;
    var fetcher = (0, react_router_1.useFetcher)();
    var submitted = (0, react_2.useRef)(false);
    (0, react_2.useEffect)(function () {
        if (submitted.current && fetcher.state === "idle") {
            onSubmit();
            submitted.current = false;
        }
    }, [fetcher.state, onSubmit]);
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                onCancel();
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Delete Transfer Line</macro_1.Trans>
          </react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          Are you sure you want to delete this transfer line for {itemName}?
          This cannot be undone.
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onCancel}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <fetcher.Form method="post" action={path_1.path.to.warehouseTransferLine(warehouseTransferId, lineId)} onSubmit={function () { return (submitted.current = true); }}>
            <input type="hidden" name="type" value="delete"/>
            <input type="hidden" name="id" value={lineId}/>
            <react_1.Button variant="destructive" isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} type="submit">
              Delete
            </react_1.Button>
          </fetcher.Form>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
exports.default = WarehouseTransferLines;
var templateObject_1, templateObject_2, templateObject_3;
