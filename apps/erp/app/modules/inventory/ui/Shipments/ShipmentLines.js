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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.useSerialNumbers = useSerialNumbers;
exports.useBatchNumbers = useBatchNumbers;
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var StorageUnit_1 = require("~/components/Form/StorageUnit");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var ShipmentLines = function () {
    var _a, _b, _c, _d, _e;
    var shipmentId = (0, react_router_1.useParams)().shipmentId;
    if (!shipmentId)
        throw new Error("shipmentId not found");
    var fetcher = (0, react_router_1.useFetcher)();
    var items = (0, stores_1.useItems)()[0];
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.shipment(shipmentId));
    var shipmentsById = new Map(
    // @ts-expect-error
    ((_a = routeData === null || routeData === void 0 ? void 0 : routeData.shipmentLines) !== null && _a !== void 0 ? _a : []).map(function (line) { return [line.id, line]; }));
    var pendingShipmentLines = usePendingShipmentLines();
    for (var _i = 0, pendingShipmentLines_1 = pendingShipmentLines; _i < pendingShipmentLines_1.length; _i++) {
        var pendingShipmentLine = pendingShipmentLines_1[_i];
        var item = shipmentsById.get(pendingShipmentLine.id);
        var merged = item
            ? __assign(__assign({}, item), pendingShipmentLine) : pendingShipmentLine;
        shipmentsById.set(pendingShipmentLine.id, merged);
    }
    var shipmentLines = Array.from(shipmentsById.values()).map(function (line) {
        var _a;
        return (__assign(__assign({}, line), { shippedQuantity: (_a = line.shippedQuantity) !== null && _a !== void 0 ? _a : 0 }));
    });
    var _f = (0, react_2.useState)(function () {
        return shipmentLines.reduce(function (acc, line) {
            var _a;
            var _b;
            if (!line.requiresSerialTracking)
                return acc;
            var trackedEntitiesForLine = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.shipmentLineTracking) === null || _b === void 0 ? void 0 : _b.filter(function (t) {
                var attributes = t.attributes;
                return attributes["Shipment Line"] === line.id;
            });
            if (!trackedEntitiesForLine)
                return acc;
            return __assign(__assign({}, acc), (_a = {}, _a[line.id] = Array.from({ length: line.shippedQuantity || 0 }, function (_, index) {
                var serialNumberEntity = trackedEntitiesForLine.find(function (t) {
                    var attributes = t.attributes;
                    return attributes["Shipment Line Index"] === index;
                });
                var serialNumber = (serialNumberEntity === null || serialNumberEntity === void 0 ? void 0 : serialNumberEntity.readableId) || (serialNumberEntity === null || serialNumberEntity === void 0 ? void 0 : serialNumberEntity.id) || "";
                return {
                    index: index,
                    id: serialNumber
                };
            }), _a));
        }, {});
    }), serialNumbersByLineId = _f[0], setSerialNumbersByLineId = _f[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        setSerialNumbersByLineId(shipmentLines.reduce(function (acc, line) {
            var _a;
            var _b;
            if (!line.requiresSerialTracking)
                return acc;
            var trackedEntitiesForLine = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.shipmentLineTracking) === null || _b === void 0 ? void 0 : _b.filter(function (t) {
                var attributes = t.attributes;
                return attributes["Shipment Line"] === line.id;
            });
            if (!trackedEntitiesForLine)
                return acc;
            return __assign(__assign({}, acc), (_a = {}, _a[line.id] = Array.from({ length: line.shippedQuantity || 0 }, function (_, index) {
                var serialNumberEntity = trackedEntitiesForLine.find(function (t) {
                    var attributes = t.attributes;
                    return attributes["Shipment Line Index"] === index;
                });
                var serialNumber = (serialNumberEntity === null || serialNumberEntity === void 0 ? void 0 : serialNumberEntity.readableId) || (serialNumberEntity === null || serialNumberEntity === void 0 ? void 0 : serialNumberEntity.id) || "";
                return {
                    index: index,
                    id: serialNumber
                };
            }), _a));
        }, {}));
    }, [(_b = routeData === null || routeData === void 0 ? void 0 : routeData.shipment) === null || _b === void 0 ? void 0 : _b.sourceDocumentId, (_c = routeData === null || routeData === void 0 ? void 0 : routeData.shipmentLines) === null || _c === void 0 ? void 0 : _c.length]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateShipmentLine = (0, react_2.useCallback)(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var formData;
        var lineId = _b.lineId, field = _b.field, value = _b.value;
        return __generator(this, function (_c) {
            formData = new FormData();
            formData.append("ids", lineId);
            formData.append("field", field);
            formData.append("value", value.toString());
            fetcher.submit(formData, {
                method: "post",
                action: path_1.path.to.bulkUpdateShipmentLine
            });
            return [2 /*return*/];
        });
    }); }, []);
    var isPosted = ((_d = routeData === null || routeData === void 0 ? void 0 : routeData.shipment) === null || _d === void 0 ? void 0 : _d.status) === "Posted";
    var isVoided = ((_e = routeData === null || routeData === void 0 ? void 0 : routeData.shipment) === null || _e === void 0 ? void 0 : _e.status) === "Voided";
    var isReadOnly = isPosted || isVoided;
    return (<>
      <react_1.Card>
        <react_1.HStack className="justify-between items-start">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Shipment Lines</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
        </react_1.HStack>

        <react_1.CardContent>
          <div className="border rounded-lg">
            {shipmentLines.length === 0 ? (<components_1.Empty className="py-6"/>) : (shipmentLines
            .map(function (line) {
            var _a;
            return (__assign(__assign({}, line), { itemReadableId: (_a = (0, utils_1.getItemReadableId)(items, line.itemId)) !== null && _a !== void 0 ? _a : "" }));
        })
            .sort(function (a, b) {
            return a.itemReadableId.localeCompare(b.itemReadableId);
        })
            .map(function (line, index) {
            var _a, _b, _c;
            var tracking = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.shipmentLineTracking) === null || _a === void 0 ? void 0 : _a.find(function (t) {
                var attributes = t.attributes;
                return attributes["Shipment Line"] === line.id;
            });
            return (<ShipmentLineItem key={line.id} line={line} shipment={routeData === null || routeData === void 0 ? void 0 : routeData.shipment} hasTrackingLabel={(_c = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.shipmentLineTracking) === null || _b === void 0 ? void 0 : _b.some(function (t) {
                    var attributes = t.attributes;
                    return attributes["Shipment Line"] === line.id;
                })) !== null && _c !== void 0 ? _c : false} isReadOnly={isReadOnly} onUpdate={onUpdateShipmentLine} className={index === shipmentLines.length - 1 ? "border-none" : ""} serialNumbers={serialNumbersByLineId[line.id] || []} onSerialNumbersChange={function (newSerialNumbers) {
                    setSerialNumbersByLineId(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[line.id] = newSerialNumbers, _a)));
                    });
                }} tracking={tracking}/>);
        }))}
          </div>
        </react_1.CardContent>
      </react_1.Card>
      {(routeData === null || routeData === void 0 ? void 0 : routeData.fixedAssetLines) && routeData.fixedAssetLines.length > 0 && (<react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Fixed Assets</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="border rounded-lg">
              {routeData.fixedAssetLines.map(function (line, index) { return (<ShipmentFixedAssetLineItem key={line.id} line={line} isReadOnly={isReadOnly} className={index < routeData.fixedAssetLines.length - 1
                    ? "border-b"
                    : ""}/>); })}
            </div>
          </react_1.CardContent>
        </react_1.Card>)}
      <react_router_1.Outlet />
    </>);
};
function ShipmentFixedAssetLineItem(_a) {
    var _b, _c, _d;
    var line = _a.line, isReadOnly = _a.isReadOnly, className = _a.className;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var _e = (0, react_2.useState)((_b = line.serialNumber) !== null && _b !== void 0 ? _b : ""), serialNumber = _e[0], setSerialNumber = _e[1];
    var updateField = function (field, value) {
        var formData = new FormData();
        formData.append("id", line.id);
        formData.append("field", field);
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.shipmentFixedAssetLineUpdate
        });
    };
    return (<div className={(0, react_1.cn)("flex items-center gap-4 p-6", className)}>
      <react_1.Checkbox isChecked={line.shipped} disabled={isReadOnly} onCheckedChange={function (checked) {
            return updateField("shipped", String(checked === true));
        }}/>
      <react_1.VStack spacing={0} className="flex-1 min-w-0">
        <span className="text-sm font-medium">
          {(_d = (_c = line.assetName) !== null && _c !== void 0 ? _c : line.description) !== null && _d !== void 0 ? _d : "Fixed Asset"}
        </span>
        {line.assetReadableId && (<span className="text-xs text-muted-foreground">
            {line.assetReadableId}
          </span>)}
      </react_1.VStack>
      <react_1.Input placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Serial Number"], ["Serial Number"])))} value={serialNumber} isDisabled={isReadOnly} className="w-48" onChange={function (e) { return setSerialNumber(e.target.value); }} onBlur={function () {
            var _a;
            if (serialNumber !== ((_a = line.serialNumber) !== null && _a !== void 0 ? _a : "")) {
                updateField("serialNumber", serialNumber);
            }
        }}/>
    </div>);
}
function ShipmentLineItem(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var line = _a.line, shipment = _a.shipment, className = _a.className, hasTrackingLabel = _a.hasTrackingLabel, isReadOnly = _a.isReadOnly, tracking = _a.tracking, serialNumbers = _a.serialNumbers, onUpdate = _a.onUpdate, onSerialNumbersChange = _a.onSerialNumbersChange;
    var t = (0, macro_1.useLingui)().t;
    var items = (0, stores_1.useItems)()[0];
    var item = items.find(function (p) { return p.id === line.itemId; });
    var unitsOfMeasure = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var splitDisclosure = (0, react_1.useDisclosure)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    // Check if shipped quantity exceeds job quantity for job fulfillments
    var isJobOverShipped = ((_b = line.fulfillment) === null || _b === void 0 ? void 0 : _b.type) === "Job" &&
        (line.shippedQuantity || 0) > (((_d = (_c = line.fulfillment) === null || _c === void 0 ? void 0 : _c.job) === null || _d === void 0 ? void 0 : _d.quantity) || 0);
    return (<div className={(0, react_1.cn)("flex flex-col border-b p-6 gap-6 relative", className)}>
      <div className="absolute top-6 right-6">
        {((_e = line.fulfillment) === null || _e === void 0 ? void 0 : _e.type) === "Job" ? (<div className="flex flex-col items-end gap-0">
            <span>Job</span>
            <span className="text-xs text-muted-foreground">
              {(_g = (_f = line.fulfillment) === null || _f === void 0 ? void 0 : _f.job) === null || _g === void 0 ? void 0 : _g.jobId}
            </span>
          </div>) : (<react_1.DropdownMenu>
            <react_1.DropdownMenuTrigger asChild>
              <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Line options"], ["Line options"])))} variant="secondary" icon={<lu_1.LuEllipsisVertical />} size="md"/>
            </react_1.DropdownMenuTrigger>
            <react_1.DropdownMenuContent>
              <react_1.DropdownMenuItem disabled={isReadOnly} onClick={splitDisclosure.onOpen}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuSplit />}/>
                {t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Split shipment line"], ["Split shipment line"])))}
              </react_1.DropdownMenuItem>
              <react_1.DropdownMenuItem destructive disabled={isReadOnly} onClick={deleteDisclosure.onOpen}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                {t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Delete shipment line"], ["Delete shipment line"])))}
              </react_1.DropdownMenuItem>
            </react_1.DropdownMenuContent>
          </react_1.DropdownMenu>)}
      </div>
      <div className="flex flex-1 justify-between items-center w-full">
        <react_1.HStack spacing={4} className="w-1/2">
          <react_1.HStack spacing={4}>
            <components_1.ItemThumbnail size="md" thumbnailPath={line.thumbnailPath} type={(_h = item === null || item === void 0 ? void 0 : item.type) !== null && _h !== void 0 ? _h : "Part"}/>

            <react_1.VStack spacing={0} className="max-w-[380px] w-full">
              <div className="w-full overflow-hidden">
                <span className="text-sm font-medium truncate block w-full">
                  {item === null || item === void 0 ? void 0 : item.readableIdWithRevision}
                </span>
                <span className="text-xs text-muted-foreground truncate block w-full">
                  {item === null || item === void 0 ? void 0 : item.name}
                </span>
              </div>
              <div className="mt-2">
                <Enumerable_1.Enumerable value={(_k = (_j = unitsOfMeasure === null || unitsOfMeasure === void 0 ? void 0 : unitsOfMeasure.find(function (u) { return u.value === line.unitOfMeasure; })) === null || _j === void 0 ? void 0 : _j.label) !== null && _k !== void 0 ? _k : null}/>
              </div>
            </react_1.VStack>
          </react_1.HStack>
        </react_1.HStack>
        <div className="flex flex-grow items-center justify-between gap-2 pl-4 w-1/2">
          <react_1.HStack spacing={4}>
            <react_1.VStack spacing={1}>
              <div className="flex items-center justify-between gap-1 w-full">
                <label className="text-xs text-muted-foreground">{t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Shipped"], ["Shipped"])))}</label>
                {isJobOverShipped && (<react_1.Tooltip>
                    <react_1.TooltipTrigger>
                      <lu_1.LuCircleAlert className="text-red-500"/>
                    </react_1.TooltipTrigger>
                    <react_1.TooltipContent>
                      Shipped quantity exceeds job quantity
                    </react_1.TooltipContent>
                  </react_1.Tooltip>)}
              </div>
              <react_1.NumberField value={line.shippedQuantity || 0} onChange={function (value) {
            // Default to 0 if value is NaN, null, or undefined
            var safeValue = isNaN(value) || value == null ? 0 : value;
            onUpdate({
                lineId: line.id,
                field: "shippedQuantity",
                value: safeValue
            });
            // Adjust serial numbers array size while preserving existing values
            if (safeValue > serialNumbers.length) {
                onSerialNumbersChange(__spreadArray(__spreadArray([], serialNumbers, true), Array.from({ length: safeValue - serialNumbers.length }, function (_, i) { return ({
                    index: i,
                    id: ""
                }); }), true));
            }
            else if (safeValue < serialNumbers.length) {
                onSerialNumbersChange(serialNumbers.slice(0, safeValue));
            }
        }}>
                <react_1.NumberInput className={(0, react_1.cn)("disabled:bg-transparent disabled:opacity-100 min-w-[100px]", isJobOverShipped && "border-red-500 border-2")} isDisabled={isReadOnly ||
            (((_l = line.fulfillment) === null || _l === void 0 ? void 0 : _l.type) === "Job" &&
                ((_m = line.requiresSerialTracking) !== null && _m !== void 0 ? _m : false))} size="sm" min={0}/>
              </react_1.NumberField>
            </react_1.VStack>
            <react_1.VStack spacing={1} className="text-center items-center">
              <label className="text-xs text-muted-foreground">{t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Ordered"], ["Ordered"])))}</label>
              <span className="text-sm py-1.5">{line.orderQuantity || 0}</span>
            </react_1.VStack>

            <react_1.VStack spacing={1} className="text-center items-center">
              <label className="text-xs text-muted-foreground">
                {t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Outstanding"], ["Outstanding"])))}
              </label>
              <react_1.HStack className="justify-center">
                <span className="text-sm py-1.5">
                  {(line.outstandingQuantity || 0) -
            (line.shippedQuantity || 0)}
                </span>

                {(line.shippedQuantity || 0) >
            (line.outstandingQuantity || 0) && (<react_1.Tooltip>
                    <react_1.TooltipTrigger>
                      <lu_1.LuCircleAlert className="text-red-500"/>
                    </react_1.TooltipTrigger>
                    <react_1.TooltipContent>
                      There are more shipped than ordered
                    </react_1.TooltipContent>
                  </react_1.Tooltip>)}
              </react_1.HStack>
            </react_1.VStack>
          </react_1.HStack>
          {((_o = line.fulfillment) === null || _o === void 0 ? void 0 : _o.type) !== "Job" &&
            (shipment === null || shipment === void 0 ? void 0 : shipment.sourceDocument) !== "Purchase Order" && (<StorageUnit locationId={line.locationId} storageUnitId={line.storageUnitId} itemId={line.itemId} isReadOnly={isReadOnly} onChange={function (storageUnit) {
                onUpdate({
                    lineId: line.id,
                    field: "storageUnitId",
                    value: storageUnit
                });
            }}/>)}
        </div>
      </div>
      {line.requiresBatchTracking && (<BatchForm shipment={shipment} line={line} hasTrackingLabel={hasTrackingLabel} isReadOnly={isReadOnly} tracking={tracking} onUpdate={onUpdate}/>)}
      {line.requiresSerialTracking && (<SerialForm shipment={shipment} line={line} hasTrackingLabel={hasTrackingLabel} serialNumbers={serialNumbers} isReadOnly={isReadOnly} onSerialNumbersChange={onSerialNumbersChange}/>)}
      {splitDisclosure.isOpen && (<SplitShipmentLineModal line={line} onClose={splitDisclosure.onClose}/>)}
      {deleteDisclosure.isOpen && (<Modals_1.ConfirmDelete name="Shipment Line" text="Are you sure you want to delete this shipment line?" action={path_1.path.to.shipmentLineDelete(line.id)} onCancel={deleteDisclosure.onClose} onSubmit={deleteDisclosure.onClose}/>)}
    </div>);
}
function BatchForm(_a) {
    var _this = this;
    var _b, _c, _d;
    var line = _a.line, shipment = _a.shipment, hasTrackingLabel = _a.hasTrackingLabel, tracking = _a.tracking, isReadOnly = _a.isReadOnly, onUpdate = _a.onUpdate;
    var t = (0, macro_1.useLingui)().t;
    var submit = (0, react_router_1.useSubmit)();
    var _e = (0, react_2.useState)(function () {
        var _a;
        if (tracking) {
            return {
                number: tracking.readableId || "",
                properties: Object.entries(((_a = tracking.attributes) !== null && _a !== void 0 ? _a : {}))
                    .filter(function (_a) {
                    var key = _a[0];
                    return ![
                        "Shipment Line",
                        "Shipment",
                        "Shipment Line Index",
                        "Receipt Line",
                        "Receipt"
                    ].includes(key);
                })
                    .reduce(function (acc, _a) {
                    var _b;
                    var key = _a[0], value = _a[1];
                    return (__assign(__assign({}, acc), (_b = {}, _b[key] = value || "", _b)));
                }, {})
            };
        }
        return {
            number: "",
            properties: {}
        };
    }), values = _e[0], setValues = _e[1];
    var batchNumbers = useBatchNumbers(line.itemId).data;
    var _f = (0, react_2.useState)(null), error = _f[0], setError = _f[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    // Check if the batch number is valid and in the list
    var resolvedBatch = values.number
        ? resolveTrackedEntity(values.number, (_b = batchNumbers === null || batchNumbers === void 0 ? void 0 : batchNumbers.data) !== null && _b !== void 0 ? _b : [])
        : null;
    // @ts-expect-error TS2339 - TODO: fix type
    var isBatchNumberValid = (resolvedBatch === null || resolvedBatch === void 0 ? void 0 : resolvedBatch.status) === "Available";
    // Verify batch quantity is sufficient for the shipped quantity
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (values.number &&
            (batchNumbers === null || batchNumbers === void 0 ? void 0 : batchNumbers.data) &&
            (line.shippedQuantity || 0) > 0) {
            var batchNumber = resolveTrackedEntity(values.number, batchNumbers.data);
            if (batchNumber &&
                // @ts-expect-error TS2339 - TODO: fix type
                batchNumber.status === "Available" &&
                // @ts-expect-error TS2339 - TODO: fix type
                (line.shippedQuantity || 0) > batchNumber.quantity) {
                setValues(__assign(__assign({}, values), { number: "" }));
            }
        }
    }, [line.shippedQuantity]);
    var getStorageUnitFromBatchNumber = function (trackedEntityId) { return __awaiter(_this, void 0, void 0, function () {
        var response;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("itemLedger")
                            .select("storageUnitId")
                            .eq("trackedEntityId", trackedEntityId)
                            .order("createdAt", { ascending: false })
                            .single()];
                case 1:
                    response = _b.sent();
                    if ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.storageUnitId) {
                        onUpdate({
                            lineId: line.id,
                            field: "storageUnitId",
                            value: response.data.storageUnitId
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    // Fetch the latest storage unit for the selected batch number
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a;
        if (values.number && values.number.trim()) {
            var resolved = resolveTrackedEntity(values.number, (_a = batchNumbers === null || batchNumbers === void 0 ? void 0 : batchNumbers.data) !== null && _a !== void 0 ? _a : []);
            if (resolved) {
                getStorageUnitFromBatchNumber(resolved.id);
            }
        }
    }, [values.number]);
    var updateBatchNumber = function (newValues_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([newValues_1], args_1, true), void 0, function (newValues, isNew) {
            var batchMatch, valuesToSubmit, attributes, batchNumber, attributes, formData;
            var _a;
            if (isNew === void 0) { isNew = false; }
            return __generator(this, function (_b) {
                if (!(shipment === null || shipment === void 0 ? void 0 : shipment.id) || !newValues.number.trim())
                    return [2 /*return*/];
                batchMatch = null;
                if (isNew && tracking) {
                    batchMatch = tracking.readableId;
                }
                valuesToSubmit = newValues;
                if (batchMatch) {
                    attributes = tracking === null || tracking === void 0 ? void 0 : tracking.attributes;
                    valuesToSubmit = __assign(__assign({}, newValues), { properties: Object.entries(attributes)
                            .filter(function (_a) {
                            var key = _a[0];
                            return !["Receipt Line"].includes(key);
                        })
                            .reduce(function (acc, _a) {
                            var _b;
                            var key = _a[0], value = _a[1];
                            return (__assign(__assign({}, acc), (_b = {}, _b[key] = value || "", _b)));
                        }, {}) });
                    // Just update the local state without triggering another database write
                    setValues(valuesToSubmit);
                }
                batchNumber = resolveTrackedEntity(valuesToSubmit.number.trim(), (_a = batchNumbers === null || batchNumbers === void 0 ? void 0 : batchNumbers.data) !== null && _a !== void 0 ? _a : []);
                // @ts-expect-error TS2339 - TODO: fix type
                if (batchNumber && batchNumber.status !== "Available") {
                    // @ts-expect-error TS2339 - TODO: fix type
                    setError("Batch number is ".concat(batchNumber.status));
                    setValues(__assign(__assign({}, valuesToSubmit), { number: "" }));
                    return [2 /*return*/];
                }
                else if (!batchNumber && valuesToSubmit.number.trim()) {
                    // If batch number is not in the list, don't proceed with the network request
                    setError("Batch number not found");
                    return [2 /*return*/];
                }
                else {
                    setError(null);
                }
                // Check if the shipped quantity exceeds the batch quantity
                // @ts-expect-error TS2339 - TODO: fix type
                if (batchNumber && (line.shippedQuantity || 0) > batchNumber.quantity) {
                    setError(
                    // @ts-expect-error TS2339 - TODO: fix type
                    "Shipped quantity exceeds batch quantity (".concat(batchNumber.quantity, ")"));
                    setValues(__assign(__assign({}, valuesToSubmit), { number: "" }));
                    return [2 /*return*/];
                }
                // @ts-expect-error TS2339 - TODO: fix type
                if (batchNumber && batchNumber.attributes) {
                    attributes = batchNumber.attributes;
                    if (attributes["Shipment Line"] &&
                        attributes["Shipment Line"] !== line.id &&
                        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                        attributes["Shipment"] === (shipment === null || shipment === void 0 ? void 0 : shipment.id)) {
                        setError("Batch number is already used on another shipment line");
                        setValues(__assign(__assign({}, valuesToSubmit), { number: "" }));
                    }
                }
                formData = new FormData();
                formData.append("itemId", line.itemId);
                formData.append("shipmentId", shipment.id);
                formData.append("shipmentLineId", line.id);
                formData.append("trackingType", "batch");
                formData.append("trackedEntityId", batchNumber.id);
                formData.append("properties", JSON.stringify(valuesToSubmit.properties));
                formData.append("quantity", (line.shippedQuantity || 0).toString());
                submit(formData, {
                    method: "post",
                    action: path_1.path.to.shipmentLinesTracking(shipment.id),
                    navigate: false
                });
                return [2 /*return*/];
            });
        });
    };
    return (<div className="flex flex-col gap-6 w-full p-6 border rounded-lg">
      <div className="flex justify-between items-center gap-4">
        <react_1.Heading size="h4">{t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Tracking Number"], ["Tracking Number"])))}</react_1.Heading>
        {hasTrackingLabel && (<components_1.PrintButton sourceDocument="Shipment" sourceDocumentId={(_c = shipment === null || shipment === void 0 ? void 0 : shipment.id) !== null && _c !== void 0 ? _c : ""} locationId={(_d = shipment === null || shipment === void 0 ? void 0 : shipment.locationId) !== null && _d !== void 0 ? _d : undefined} context="shipping" fileRoutes={{
                pdf: function (id, opts) {
                    return path_1.path.to.file.shipmentLabelsPdf(id, __assign(__assign({}, opts), { lineId: line.id }));
                },
                zpl: function (id, opts) {
                    return path_1.path.to.file.shipmentLabelsZpl(id, __assign(__assign({}, opts), { lineId: line.id }));
                }
            }}/>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-muted-foreground flex items-center gap-2">
            <lu_1.LuGroup /> {t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Batch Number"], ["Batch Number"])))}
          </label>

          <div className="flex flex-col gap-1">
            <react_1.InputGroup isDisabled={isReadOnly}>
              <react_1.Input placeholder={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Batch number"], ["Batch number"])))} value={values.number} onChange={function (e) {
            setValues(__assign(__assign({}, values), { number: e.target.value }));
        }} onBlur={function () {
            updateBatchNumber(values, true);
        }} className={(0, react_1.cn)(error && "border-destructive")}/>
              <react_1.InputRightElement className="pl-2">
                {isBatchNumberValid ? (<lu_1.LuCheck className="text-emerald-500"/>) : (<lu_1.LuQrCode />)}
              </react_1.InputRightElement>
            </react_1.InputGroup>
            {error && <span className="text-xs text-destructive">{error}</span>}
          </div>
        </div>
      </div>
      {values.number &&
            (batchNumbers === null || batchNumbers === void 0 ? void 0 : batchNumbers.data) &&
            (function () {
                var batchNumber = resolveTrackedEntity(values.number, batchNumbers.data);
                if (!batchNumber)
                    return null;
                // @ts-expect-error TS2339 - TODO: fix type
                if ((line.shippedQuantity || 0) >= batchNumber.quantity)
                    return null;
                return (<div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground">
              <lu_1.LuInfo className="h-3.5 w-3.5 flex-shrink-0"/>
              <span>
                Shipped quantity is less than batch quantity. A new batch will
                be created for the remaining quantity when posted.
              </span>
            </div>);
            })()}
    </div>);
}
function SerialForm(_a) {
    var _this = this;
    var _b, _c;
    var line = _a.line, shipment = _a.shipment, hasTrackingLabel = _a.hasTrackingLabel, serialNumbers = _a.serialNumbers, isReadOnly = _a.isReadOnly, onSerialNumbersChange = _a.onSerialNumbersChange;
    var t = (0, macro_1.useLingui)().t;
    var _d = (0, react_2.useState)({}), errors = _d[0], setErrors = _d[1];
    var serialNumbersData = useSerialNumbers(line.itemId, isReadOnly).data;
    // Check for duplicates within the current form
    var validateSerialNumber = (0, react_2.useCallback)(function (serialNumberId, currentIndex) {
        var _a, _b;
        if (!serialNumberId)
            return null;
        // Check for duplicates within the form (resolve both sides to entity id)
        var resolvedCurrent = resolveTrackedEntity(serialNumberId, (_a = serialNumbersData === null || serialNumbersData === void 0 ? void 0 : serialNumbersData.data) !== null && _a !== void 0 ? _a : []);
        var isDuplicate = serialNumbers.some(function (sn, idx) {
            var _a;
            if (idx === currentIndex || !sn.id)
                return false;
            var resolvedOther = resolveTrackedEntity(sn.id, (_a = serialNumbersData === null || serialNumbersData === void 0 ? void 0 : serialNumbersData.data) !== null && _a !== void 0 ? _a : []);
            return (sn.id === serialNumberId ||
                (resolvedCurrent &&
                    resolvedOther &&
                    resolvedCurrent.id === resolvedOther.id));
        });
        if (isDuplicate) {
            return "Duplicate serial number";
        }
        // Check if serial number is available (by id or readableId)
        var serialNumber = resolveTrackedEntity(serialNumberId, (_b = serialNumbersData === null || serialNumbersData === void 0 ? void 0 : serialNumbersData.data) !== null && _b !== void 0 ? _b : []);
        if (!serialNumber) {
            return "Serial number not found";
        }
        // @ts-expect-error TS2339 - TODO: fix type
        if (serialNumber.status !== "Available") {
            // @ts-expect-error TS2339 - TODO: fix type
            return "Serial number is ".concat(serialNumber.status);
        }
        return null;
    }, [serialNumbers, serialNumbersData === null || serialNumbersData === void 0 ? void 0 : serialNumbersData.data]);
    var updateSerialNumber = (0, react_2.useCallback)(function (serialNumber) { return __awaiter(_this, void 0, void 0, function () {
        var error, newSerialNumbers, resolvedEntity, formData, response, responseData, errorMessage_1, newSerialNumbers, error_1, newSerialNumbers;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(shipment === null || shipment === void 0 ? void 0 : shipment.id) || !serialNumber.id)
                        return [2 /*return*/];
                    error = validateSerialNumber(serialNumber.id, serialNumber.index);
                    if (error) {
                        setErrors(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[serialNumber.index] = error, _a)));
                        });
                        newSerialNumbers = __spreadArray([], serialNumbers, true);
                        newSerialNumbers[serialNumber.index] = {
                            index: serialNumber.index,
                            id: ""
                        };
                        onSerialNumbersChange(newSerialNumbers);
                        return [2 /*return*/];
                    }
                    resolvedEntity = resolveTrackedEntity(serialNumber.id.trim(), (_a = serialNumbersData === null || serialNumbersData === void 0 ? void 0 : serialNumbersData.data) !== null && _a !== void 0 ? _a : []);
                    formData = new FormData();
                    formData.append("trackingType", "serial");
                    formData.append("itemId", line.itemId);
                    formData.append("shipmentId", shipment.id);
                    formData.append("shipmentLineId", line.id);
                    formData.append("index", serialNumber.index.toString());
                    formData.append("trackedEntityId", (_b = resolvedEntity === null || resolvedEntity === void 0 ? void 0 : resolvedEntity.id) !== null && _b !== void 0 ? _b : serialNumber.id.trim());
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch(path_1.path.to.shipmentLinesTracking(shipment.id), {
                            method: "POST",
                            body: formData
                        })];
                case 2:
                    response = _c.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    // Clear error if submission was successful
                    setErrors(function (prev) {
                        var newErrors = __assign({}, prev);
                        delete newErrors[serialNumber.index];
                        return newErrors;
                    });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    responseData = _c.sent();
                    errorMessage_1 = responseData.message || "Failed to track serial number";
                    setErrors(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[serialNumber.index] = errorMessage_1, _a)));
                    });
                    newSerialNumbers = __spreadArray([], serialNumbers, true);
                    newSerialNumbers[serialNumber.index] = {
                        index: serialNumber.index,
                        id: ""
                    };
                    onSerialNumbersChange(newSerialNumbers);
                    _c.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _c.sent();
                    if (error_1 instanceof Error && error_1.message.includes("available")) {
                        setErrors(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[serialNumber.index] = "Serial number is not available", _a)));
                        });
                        newSerialNumbers = __spreadArray([], serialNumbers, true);
                        newSerialNumbers[serialNumber.index] = {
                            index: serialNumber.index,
                            id: ""
                        };
                        onSerialNumbersChange(newSerialNumbers);
                    }
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); }, [
        line.id,
        line.itemId,
        shipment === null || shipment === void 0 ? void 0 : shipment.id,
        validateSerialNumber,
        serialNumbers,
        serialNumbersData === null || serialNumbersData === void 0 ? void 0 : serialNumbersData.data,
        onSerialNumbersChange
    ]);
    return (<div className="flex flex-col gap-6 p-6 border rounded-lg">
      <div className="flex justify-between items-center gap-4">
        <react_1.Heading size="h4">{t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Tracking Numbers"], ["Tracking Numbers"])))}</react_1.Heading>
        {hasTrackingLabel && (<components_1.PrintButton sourceDocument="Shipment" sourceDocumentId={(_b = shipment === null || shipment === void 0 ? void 0 : shipment.id) !== null && _b !== void 0 ? _b : ""} locationId={(_c = shipment === null || shipment === void 0 ? void 0 : shipment.locationId) !== null && _c !== void 0 ? _c : undefined} context="shipping" fileRoutes={{
                pdf: function (id, opts) {
                    return path_1.path.to.file.shipmentLabelsPdf(id, __assign(__assign({}, opts), { lineId: line.id }));
                },
                zpl: function (id, opts) {
                    return path_1.path.to.file.shipmentLabelsZpl(id, __assign(__assign({}, opts), { lineId: line.id }));
                }
            }}/>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
        {serialNumbers.map(function (serialNumber, index) {
            var _a;
            // Check if the serial number is valid and in the list
            var resolvedSerial = serialNumber.id
                ? resolveTrackedEntity(serialNumber.id, (_a = serialNumbersData === null || serialNumbersData === void 0 ? void 0 : serialNumbersData.data) !== null && _a !== void 0 ? _a : [])
                : null;
            // @ts-expect-error TS2339 - TODO: fix type
            var isSerialNumberValid = (resolvedSerial === null || resolvedSerial === void 0 ? void 0 : resolvedSerial.status) === "Available";
            return (<div key={"".concat(line.id, "-").concat(index, "-serial")} className="flex flex-col gap-1">
              <react_1.InputGroup isDisabled={isReadOnly}>
                <react_1.Input placeholder={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Tracking Number ", ""], ["Tracking Number ", ""])), index + 1)} value={serialNumber.id} onChange={function (e) {
                    var newValue = e.target.value;
                    var newSerialNumbers = __spreadArray([], serialNumbers, true);
                    newSerialNumbers[index] = {
                        index: index,
                        id: newValue
                    };
                    onSerialNumbersChange(newSerialNumbers);
                }} onBlur={function (e) {
                    var newValue = e.target.value;
                    var error = validateSerialNumber(newValue, index);
                    setErrors(function (prev) {
                        var newErrors = __assign({}, prev);
                        if (error) {
                            newErrors[index] = error;
                        }
                        else {
                            delete newErrors[index];
                        }
                        return newErrors;
                    });
                    if (!error) {
                        updateSerialNumber({
                            index: index,
                            id: newValue
                        });
                    }
                    else {
                        // Clear the input value but keep the error message
                        var newSerialNumbers = __spreadArray([], serialNumbers, true);
                        newSerialNumbers[index] = {
                            index: index,
                            id: ""
                        };
                        onSerialNumbersChange(newSerialNumbers);
                    }
                }} className={(0, react_1.cn)(errors[index] && "border-destructive")}/>
                <react_1.InputRightElement className="pl-2">
                  {isSerialNumberValid ? (<lu_1.LuCheck className="text-emerald-500"/>) : (<lu_1.LuQrCode />)}
                </react_1.InputRightElement>
              </react_1.InputGroup>
              {errors[index] && (<span className="text-xs text-destructive">
                  {errors[index]}
                </span>)}
            </div>);
        })}
      </div>
    </div>);
}
function SplitShipmentLineModal(_a) {
    var _b, _c;
    var line = _a.line, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onClose();
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success, onClose]);
    return (<react_1.Modal open onOpenChange={onClose}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={path_1.path.to.shipmentLineSplit} validator={inventory_1.splitValidator} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>{t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Split Shipment Line"], ["Split Shipment Line"])))}</react_1.ModalTitle>
            <react_1.ModalDescription>
              {t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Select the quantity that you'd like to split into a new line."], ["Select the quantity that you'd like to split into a new line."])))}
            </react_1.ModalDescription>
          </react_1.ModalHeader>

          <react_1.ModalBody>
            <input type="hidden" name="documentId" value={line.shipmentId}/>
            <input type="hidden" name="documentLineId" value={line.id}/>
            <input type="hidden" name="locationId" value={(_c = line.locationId) !== null && _c !== void 0 ? _c : ""}/>
            <form_1.Number name="quantity" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Quantity"], ["Quantity"])))} minValue={0.0001}/>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              {t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Cancel"], ["Cancel"])))}
            </react_1.Button>
            <form_1.Submit>{t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Split Line"], ["Split Line"])))}</form_1.Submit>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function StorageUnit(_a) {
    var locationId = _a.locationId, storageUnitId = _a.storageUnitId, itemId = _a.itemId, isReadOnly = _a.isReadOnly, onChange = _a.onChange;
    var options = (0, StorageUnit_1.useStorageUnits)(locationId !== null && locationId !== void 0 ? locationId : undefined, itemId !== null && itemId !== void 0 ? itemId : undefined).options;
    if (!locationId)
        return null;
    return (<react_1.VStack spacing={1} className="min-w-[140px] text-sm">
      <label className="text-xs text-muted-foreground">
        <macro_1.Trans>Storage Unit</macro_1.Trans>
      </label>
      <div className="py-1">
        <react_1.Combobox value={storageUnitId !== null && storageUnitId !== void 0 ? storageUnitId : undefined} onChange={function (newValue) {
            onChange(newValue);
        }} options={options} isReadOnly={isReadOnly} inline={function (value, options) {
            var _a;
            var option = options.find(function (o) { return o.value === value; });
            return (_a = option === null || option === void 0 ? void 0 : option.label) !== null && _a !== void 0 ? _a : "";
        }}/>
      </div>
    </react_1.VStack>);
}
var usePendingShipmentLines = function () {
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        return fetcher.formAction === path_1.path.to.bulkUpdateShipmentLine;
    })
        .reduce(function (acc, fetcher) {
        var _a;
        var lineId = fetcher.formData.get("ids");
        var field = fetcher.formData.get("field");
        var value = fetcher.formData.get("value");
        if (lineId && field && value) {
            var newItem = (_a = {
                    id: lineId
                },
                _a[field] = value,
                _a);
            return __spreadArray(__spreadArray([], acc, true), [newItem], false);
        }
        return acc;
    }, []);
};
function resolveTrackedEntity(scannedValue, entities) {
    var _a, _b;
    return ((_b = (_a = entities.find(function (e) { return e.id === scannedValue; })) !== null && _a !== void 0 ? _a : entities.find(function (e) { return e.readableId === scannedValue; })) !== null && _b !== void 0 ? _b : null);
}
exports.default = ShipmentLines;
function useSerialNumbers(itemId, isReadOnly) {
    if (isReadOnly === void 0) { isReadOnly = false; }
    var serialNumbersFetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (itemId) {
            serialNumbersFetcher.load(path_1.path.to.api.serialNumbers(itemId, isReadOnly));
        }
    }, [itemId]);
    return { data: serialNumbersFetcher.data };
}
function useBatchNumbers(itemId) {
    var batchNumbersFetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (itemId) {
            batchNumbersFetcher.load(path_1.path.to.api.batchNumbers(itemId));
        }
    }, [itemId]);
    return { data: batchNumbersFetcher.data };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17;
