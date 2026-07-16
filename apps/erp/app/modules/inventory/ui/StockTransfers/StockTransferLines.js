"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.default = StockTransferLines;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
function StockTransferLineComponent(_a) {
    var _b, _c, _d, _e, _f, _g;
    var line = _a.line, index = _a.index, totalLines = _a.totalLines, locationId = _a.locationId, pickedQuantity = _a.pickedQuantity, isPickable = _a.isPickable, isEditable = _a.isEditable, isPending = _a.isPending, onPick = _a.onPick, onUnpick = _a.onUnpick, onDelete = _a.onDelete, permissions = _a.permissions;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var params = (0, react_router_1.useParams)();
    var id = params.id;
    if (!id)
        throw new Error("stock transfer id not found");
    var items = (0, stores_1.useItems)()[0];
    var unitsOfMeasure = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var item = items.find(function (p) { return p.id === line.itemId; });
    var isTracked = line.requiresSerialTracking || line.requiresBatchTracking;
    var isPicked = pickedQuantity > 0;
    return (<div className={(0, react_1.cn)("flex flex-col border-b p-6 gap-6", index === totalLines - 1 && "border-none", isPicked && "opacity-50 hover:opacity-100")}>
      <div className="flex justify-between items-center w-full">
        <react_1.HStack spacing={4} className="w-1/2 justify-between">
          <react_1.HStack spacing={4}>
            <components_1.ItemThumbnail size="md" thumbnailPath={line.thumbnailPath} type={(_b = item === null || item === void 0 ? void 0 : item.type) !== null && _b !== void 0 ? _b : "Part"}/>
            <react_1.VStack spacing={0} className="max-w-[380px] w-full">
              <div className="w-full overflow-hidden">
                <span className="text-sm font-medium truncate block w-full">
                  {item === null || item === void 0 ? void 0 : item.name}
                </span>
                <span className="text-xs text-muted-foreground truncate block w-full">
                  {item === null || item === void 0 ? void 0 : item.readableIdWithRevision}
                </span>
                {line.trackedEntityId && (<span className="flex gap-1 text-xs text-muted-foreground truncate items-center w-full">
                    <lu_1.LuQrCode /> {line.trackedEntityId}
                  </span>)}
              </div>
              <div className="mt-2">
                <Enumerable_1.Enumerable value={(_d = (_c = unitsOfMeasure === null || unitsOfMeasure === void 0 ? void 0 : unitsOfMeasure.find(function (u) { return u.value === line.unitOfMeasure; })) === null || _c === void 0 ? void 0 : _c.label) !== null && _d !== void 0 ? _d : null}/>
              </div>
            </react_1.VStack>
          </react_1.HStack>
          <react_1.Count count={(_e = line.quantity) !== null && _e !== void 0 ? _e : 0} className={(0, react_1.cn)("text-right text-white text-base", isPicked ? "bg-emerald-600" : "bg-red-600")}/>
        </react_1.HStack>
        <div className="flex flex-grow items-center justify-between gap-4 pl-4 w-1/2">
          <react_1.HStack spacing={4} className="text-left items-center">
            {"fromStorageUnitId" in line && (<span className="text-base font-medium  whitespace-nowrap">
                {(_f = line.fromStorageUnitName) !== null && _f !== void 0 ? _f : ""}
              </span>)}
            <lu_1.LuArrowRight className="size-4"/>
            {"toStorageUnitId" in line && (<span className="text-base font-medium  whitespace-nowrap">
                {(_g = line.toStorageUnitName) !== null && _g !== void 0 ? _g : ""}
              </span>)}
          </react_1.HStack>
          <react_1.HStack spacing={1}>
            {line.trackedEntityId && (<components_1.PrintButton sourceDocument="Entity" sourceDocumentId={line.trackedEntityId} locationId={locationId} context="inventory" fileRoutes={{
                pdf: path_1.path.to.file.trackedEntityLabelPdf,
                zpl: path_1.path.to.file.trackedEntityLabelZpl
            }}/>)}
            {pickedQuantity === line.quantity ? (<react_1.Button variant="secondary" isDisabled={!isPickable || isPending} isLoading={isPending} leftIcon={<lu_1.LuUndo2 />} onClick={function () { return onUnpick(line); }}>
                Unpick
              </react_1.Button>) : (<react_1.Button isDisabled={!isPickable || isPending} isLoading={isPending} leftIcon={isTracked ? <lu_1.LuQrCode /> : <lu_1.LuCirclePlus />} onClick={isTracked
                ? function () { return navigate(path_1.path.to.stockTransferScan(id, line.id)); }
                : function () { return onPick(line); }}>
                Pick
              </react_1.Button>)}
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton variant="secondary" isDisabled={!isEditable} icon={<lu_1.LuEllipsisVertical />} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Line options"], ["Line options"])))}/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent>
                <react_1.DropdownMenuItem disabled={!isEditable || !permissions.can("update", "inventory")} asChild>
                  <react_router_1.Link to={path_1.path.to.stockTransferLine(line.stockTransferId, line.id)}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuPencilLine />}/>
                    <macro_1.Trans>Edit Line</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuItem disabled={!isEditable || !permissions.can("delete", "inventory")} destructive onClick={function () { return onDelete(line); }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                  <macro_1.Trans>Delete Line</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </react_1.HStack>
        </div>
      </div>
    </div>);
}
function StockTransferLines() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var params = (0, react_router_1.useParams)();
    var id = params.id;
    if (!id)
        throw new Error("stock transfer id not found");
    var permissions = (0, hooks_1.usePermissions)();
    var locations = (0, Location_1.useLocations)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.stockTransfer(id));
    var isPickable = ["Released", "In Progress"].includes((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : "");
    var isLocked = (0, inventory_1.isStockTransferLocked)((_c = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _c === void 0 ? void 0 : _c.status);
    var isEditable = !isLocked &&
        ["Draft", "Released", "In Progress"].includes((_e = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _d === void 0 ? void 0 : _d.status) !== null && _e !== void 0 ? _e : "");
    var _j = (0, react_2.useState)(null), selectedLine = _j[0], setSelectedLine = _j[1];
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var lines = ((_f = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransferLines) !== null && _f !== void 0 ? _f : []).sort(function (a, b) {
        var _a, _b, _c, _d, _e, _f;
        // First sort by itemReadableId
        var itemComparison = ((_a = a.itemReadableId) !== null && _a !== void 0 ? _a : "").localeCompare((_b = b.itemReadableId) !== null && _b !== void 0 ? _b : "");
        if (itemComparison !== 0)
            return itemComparison;
        // Then sort by toStorageUnitName
        var toStorageUnitComparison = ((_c = a.toStorageUnitName) !== null && _c !== void 0 ? _c : "").localeCompare((_d = b.toStorageUnitName) !== null && _d !== void 0 ? _d : "");
        if (toStorageUnitComparison !== 0)
            return toStorageUnitComparison;
        // Finally sort by fromStorageUnitName
        return ((_e = a.fromStorageUnitName) !== null && _e !== void 0 ? _e : "").localeCompare((_f = b.fromStorageUnitName) !== null && _f !== void 0 ? _f : "");
    });
    var pickedQuantitiesById = new Map();
    lines.forEach(function (line) {
        var _a;
        if (!line.id)
            return;
        pickedQuantitiesById.set(line.id, (_a = line.pickedQuantity) !== null && _a !== void 0 ? _a : 0);
    });
    var pendingQuantities = usePendingItems({ id: id });
    pendingQuantities.forEach(function (pendingQuantity) {
        if (pendingQuantity.id) {
            pickedQuantitiesById.set(pendingQuantity.id, pendingQuantity.quantity);
        }
    });
    var submit = (0, react_router_1.useSubmit)();
    var onPick = function (line) {
        var _a, _b;
        var formData = new FormData();
        formData.append("id", line.id);
        formData.append("quantity", line.quantity.toString());
        formData.append("locationId", (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _a === void 0 ? void 0 : _a.locationId) !== null && _b !== void 0 ? _b : "");
        if (line.trackedEntityId) {
            formData.append("trackedEntityId", line.trackedEntityId);
        }
        submit(formData, {
            method: "post",
            action: path_1.path.to.stockTransferLineQuantity(id),
            navigate: false,
            fetcherKey: "stockTransferLine:".concat(line.id)
        });
    };
    var onUnpick = function (line) {
        var _a, _b;
        var formData = new FormData();
        formData.append("id", line.id);
        formData.append("quantity", "0");
        formData.append("locationId", (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _a === void 0 ? void 0 : _a.locationId) !== null && _b !== void 0 ? _b : "");
        if (line.trackedEntityId) {
            formData.append("trackedEntityId", line.trackedEntityId);
        }
        submit(formData, {
            method: "post",
            action: path_1.path.to.stockTransferLineQuantity(id),
            navigate: false,
            fetcherKey: "stockTransferLine:".concat(line.id)
        });
    };
    return (<>
      <react_1.Card>
        <react_1.HStack className="justify-between items-center">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Stock Transfer Lines</macro_1.Trans>
            </react_1.CardTitle>
            <react_1.CardDescription>
              <Enumerable_1.Enumerable value={(_h = (_g = locations === null || locations === void 0 ? void 0 : locations.find(function (l) { var _a; return l.value === ((_a = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _a === void 0 ? void 0 : _a.locationId); })) === null || _g === void 0 ? void 0 : _g.label) !== null && _h !== void 0 ? _h : null}/>
            </react_1.CardDescription>
          </react_1.CardHeader>
          <react_1.CardAction>
            {isEditable && permissions.can("create", "inventory") && (<react_1.Button variant="secondary" isDisabled={!isEditable} leftIcon={<lu_1.LuCirclePlus />} asChild>
                <react_router_1.Link to={path_1.path.to.newStockTransferLine(id)}>
                  <macro_1.Trans>Add Line</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>)}
          </react_1.CardAction>
        </react_1.HStack>

        <react_1.CardContent>
          <div className="border rounded-lg">
            {lines.length === 0 ? (<components_1.Empty className="py-6"/>) : (lines.map(function (line, index) {
            var _a, _b, _c, _d, _e;
            return (<StockTransferLineComponent key={line.id} line={line} index={index} totalLines={lines.length} locationId={(_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _a === void 0 ? void 0 : _a.locationId) !== null && _b !== void 0 ? _b : undefined} pickedQuantity={(_d = pickedQuantitiesById.get((_c = line.id) !== null && _c !== void 0 ? _c : "")) !== null && _d !== void 0 ? _d : 0} isPickable={isPickable} isEditable={isEditable} isPending={(_e = pendingQuantities === null || pendingQuantities === void 0 ? void 0 : pendingQuantities.some(function (q) { return q.id === line.id; })) !== null && _e !== void 0 ? _e : false} onPick={onPick} onUnpick={onUnpick} onDelete={function () {
                    setSelectedLine(line);
                    deleteDisclosure.onOpen();
                }} permissions={permissions}/>);
        }))}
          </div>
        </react_1.CardContent>
      </react_1.Card>
      {deleteDisclosure.isOpen && (<Modals_1.ConfirmDelete name="Stock Transfer Line" text="Are you sure you want to delete this stock transfer line?" action={path_1.path.to.deleteStockTransferLine(id, selectedLine === null || selectedLine === void 0 ? void 0 : selectedLine.id)} onCancel={deleteDisclosure.onClose} onSubmit={deleteDisclosure.onClose}/>)}
    </>);
}
var usePendingItems = function (_a) {
    var id = _a.id;
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        return fetcher.formAction === path_1.path.to.stockTransferLineQuantity(id);
    })
        .reduce(function (acc, fetcher) {
        var formData = fetcher.formData;
        var quantity = parseInt(formData.get("quantity"), 10);
        var lineId = fetcher.formData.get("id");
        if (lineId && Number.isFinite(quantity)) {
            return __spreadArray(__spreadArray([], acc, true), [{ id: lineId, quantity: quantity }], false);
        }
        return acc;
    }, []);
};
var templateObject_1;
