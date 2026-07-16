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
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var DocumentIcon_1 = require("~/components/DocumentIcon");
var Enumerable_1 = require("~/components/Enumerable");
var FileDropzone_1 = require("~/components/FileDropzone");
var StorageUnit_1 = require("~/components/Form/StorageUnit");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var shared_service_1 = require("~/modules/shared/shared.service");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var upload_1 = require("~/utils/upload");
var BatchPropertiesConfig_1 = require("../Batches/BatchPropertiesConfig");
var BatchPropertiesFields_1 = require("../Batches/BatchPropertiesFields");
var ReceiptLines = function () {
    var _a, _b;
    var receiptId = (0, react_router_1.useParams)().receiptId;
    if (!receiptId)
        throw new Error("receiptId not found");
    var fetcher = (0, react_router_1.useFetcher)();
    var _c = useReceiptFiles(receiptId), upload = _c.upload, deleteFile = _c.deleteFile, getPath = _c.getPath;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.receipt(receiptId));
    var receiptsById = new Map(
    // @ts-expect-error
    routeData === null || routeData === void 0 ? void 0 : routeData.receiptLines.map(function (line) { return [line.id, line]; }));
    var pendingReceiptLines = usePendingReceiptLines();
    for (var _i = 0, pendingReceiptLines_1 = pendingReceiptLines; _i < pendingReceiptLines_1.length; _i++) {
        var pendingReceiptLine = pendingReceiptLines_1[_i];
        var item = receiptsById.get(pendingReceiptLine.id);
        var merged = item ? __assign(__assign({}, item), pendingReceiptLine) : pendingReceiptLine;
        receiptsById.set(pendingReceiptLine.id, merged);
    }
    var receiptLines = Array.from(receiptsById.values());
    var _d = (0, react_2.useState)(function () {
        return receiptLines.reduce(function (acc, line) {
            var _a;
            var _b;
            if (!line.requiresSerialTracking)
                return acc;
            var trackedEntitiesForLine = routeData === null || routeData === void 0 ? void 0 : routeData.receiptLineTracking.filter(function (t) {
                var attributes = t.attributes;
                return attributes["Receipt Line"] === line.id;
            });
            if (!trackedEntitiesForLine)
                return acc;
            return __assign(__assign({}, acc), (_a = {}, _a[line.id] = Array.from({ length: (_b = line.receivedQuantity) !== null && _b !== void 0 ? _b : 0 }, function (_, index) {
                var serialNumberEntity = trackedEntitiesForLine.find(function (t) {
                    var attributes = t.attributes;
                    return attributes["Receipt Line Index"] === index;
                });
                var serialNumber = (serialNumberEntity === null || serialNumberEntity === void 0 ? void 0 : serialNumberEntity.readableId) || "";
                return {
                    index: index,
                    number: serialNumber
                };
            }), _a));
        }, {});
    }), serialNumbersByLineId = _d[0], setSerialNumbersByLineId = _d[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        setSerialNumbersByLineId(receiptLines.reduce(function (acc, line) {
            var _a;
            var _b;
            if (!line.requiresSerialTracking)
                return acc;
            var trackedEntitiesForLine = routeData === null || routeData === void 0 ? void 0 : routeData.receiptLineTracking.filter(function (t) {
                var attributes = t.attributes;
                return attributes["Receipt Line"] === line.id;
            });
            if (!trackedEntitiesForLine)
                return acc;
            return __assign(__assign({}, acc), (_a = {}, _a[line.id] = Array.from({ length: (_b = line.receivedQuantity) !== null && _b !== void 0 ? _b : 0 }, function (_, index) {
                var serialNumberEntity = trackedEntitiesForLine.find(function (t) {
                    var attributes = t.attributes;
                    return attributes["Receipt Line Index"] === index;
                });
                var serialNumber = (serialNumberEntity === null || serialNumberEntity === void 0 ? void 0 : serialNumberEntity.readableId) || "";
                return {
                    index: index,
                    number: serialNumber
                };
            }), _a));
        }, {}));
    }, [(_a = routeData === null || routeData === void 0 ? void 0 : routeData.receipt) === null || _a === void 0 ? void 0 : _a.sourceDocumentId, (_b = routeData === null || routeData === void 0 ? void 0 : routeData.receiptLines) === null || _b === void 0 ? void 0 : _b.length]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateReceiptLine = (0, react_2.useCallback)(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var formData;
        var lineId = _b.lineId, field = _b.field, value = _b.value;
        return __generator(this, function (_c) {
            formData = new FormData();
            formData.append("ids", lineId);
            formData.append("field", field);
            formData.append("value", value.toString());
            fetcher.submit(formData, {
                method: "post",
                action: path_1.path.to.bulkUpdateReceiptLine
            });
            return [2 /*return*/];
        });
    }); }, []);
    var isPosted = (routeData === null || routeData === void 0 ? void 0 : routeData.receipt.status) === "Posted" ||
        (routeData === null || routeData === void 0 ? void 0 : routeData.receipt.status) === "Voided";
    return (<>
      <react_1.Card>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Receipt Lines</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>

        <react_1.CardContent>
          <div className="border rounded-lg">
            {receiptLines.length === 0 ? (<components_1.Empty className="py-6"/>) : (receiptLines.map(function (line, index) {
            var _a, _b, _c;
            var trackingCandidates = (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.receiptLineTracking) === null || _a === void 0 ? void 0 : _a.filter(function (t) {
                var attributes = t.attributes;
                return attributes["Receipt Line"] === line.id;
            })) !== null && _b !== void 0 ? _b : [];
            var tracking = (_c = trackingCandidates.find(function (t) { return t.expirationDate; })) !== null && _c !== void 0 ? _c : trackingCandidates[0];
            return (<ReceiptLineItem key={line.id} line={line} receipt={routeData === null || routeData === void 0 ? void 0 : routeData.receipt} isReadOnly={isPosted} onUpdate={onUpdateReceiptLine} files={routeData === null || routeData === void 0 ? void 0 : routeData.receiptFiles} className={index === receiptLines.length - 1 ? "border-none" : ""} serialNumbers={serialNumbersByLineId[line.id] || []} getPath={function (file) { return getPath(file, line.id); }} onSerialNumbersChange={function (newSerialNumbers) {
                    setSerialNumbersByLineId(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[line.id] = newSerialNumbers, _a)));
                    });
                }} batchProperties={routeData === null || routeData === void 0 ? void 0 : routeData.batchProperties} itemShelfLife={routeData === null || routeData === void 0 ? void 0 : routeData.itemShelfLife} tracking={tracking} upload={function (files) { return upload(files, line.id); }} deleteFile={function (file) { return deleteFile(file, line.id); }}/>);
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
              {routeData.fixedAssetLines.map(function (line, index) { return (<ReceiptFixedAssetLineItem key={line.id} line={line} isReadOnly={isPosted} className={index < routeData.fixedAssetLines.length - 1
                    ? "border-b"
                    : ""}/>); })}
            </div>
          </react_1.CardContent>
        </react_1.Card>)}
      <react_router_1.Outlet />
    </>);
};
function ReceiptFixedAssetLineItem(_a) {
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
            action: path_1.path.to.receiptFixedAssetLineUpdate
        });
    };
    return (<div className={(0, react_1.cn)("flex items-center gap-4 p-6", className)}>
      <react_1.Checkbox isChecked={line.received} disabled={isReadOnly} onCheckedChange={function (checked) {
            return updateField("received", String(checked === true));
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
function ReceiptLineItem(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var line = _a.line, receipt = _a.receipt, className = _a.className, isReadOnly = _a.isReadOnly, onUpdate = _a.onUpdate, files = _a.files, batchProperties = _a.batchProperties, itemShelfLife = _a.itemShelfLife, tracking = _a.tracking, serialNumbers = _a.serialNumbers, getPath = _a.getPath, onSerialNumbersChange = _a.onSerialNumbersChange, upload = _a.upload, deleteFile = _a.deleteFile;
    var t = (0, macro_1.useLingui)().t;
    var items = (0, stores_1.useItems)()[0];
    var item = items.find(function (p) { return p.id === line.itemId; });
    var unitsOfMeasure = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var splitDisclosure = (0, react_1.useDisclosure)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    return (<div className={(0, react_1.cn)("flex flex-col border-b p-6 gap-6 relative", className)}>
      <div className="absolute top-4 right-6">
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Line options"], ["Line options"])))} variant="secondary" icon={<lu_1.LuEllipsisVertical />} size="md"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            <react_1.DropdownMenuItem disabled={isReadOnly} onClick={splitDisclosure.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuSplit />}/>
              {t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Split receipt line"], ["Split receipt line"])))}
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem destructive disabled={isReadOnly} onClick={deleteDisclosure.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              {t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Delete receipt line"], ["Delete receipt line"])))}
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </div>
      <div className="flex flex-1 justify-between items-center w-full">
        <react_1.HStack spacing={4} className="w-1/2">
          <react_1.HStack spacing={4} className="flex-1">
            <components_1.ItemThumbnail size="md" thumbnailPath={line.thumbnailPath} type={(_b = item === null || item === void 0 ? void 0 : item.type) !== null && _b !== void 0 ? _b : "Part"}/>
            <react_1.VStack spacing={0}>
              <span className="text-sm font-medium">{item === null || item === void 0 ? void 0 : item.name}</span>
              <span className="text-xs text-muted-foreground line-clamp-2">
                {item === null || item === void 0 ? void 0 : item.readableIdWithRevision}
              </span>
              <div className="mt-2">
                <Enumerable_1.Enumerable value={(_d = (_c = unitsOfMeasure === null || unitsOfMeasure === void 0 ? void 0 : unitsOfMeasure.find(function (u) { return u.value === line.unitOfMeasure; })) === null || _c === void 0 ? void 0 : _c.label) !== null && _d !== void 0 ? _d : null}/>
              </div>
            </react_1.VStack>
            <react_1.VStack spacing={1}>
              <label className="text-xs text-muted-foreground">{t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Received"], ["Received"])))}</label>

              <react_1.NumberField value={(_e = line.receivedQuantity) !== null && _e !== void 0 ? _e : 0} onChange={function (value) {
            // Default to 0 if value is NaN, null, or undefined
            var safeValue = isNaN(value) || value == null ? 0 : value;
            onUpdate({
                lineId: line.id,
                field: "receivedQuantity",
                value: safeValue
            });
            // Adjust serial numbers array size while preserving existing values
            if (safeValue > serialNumbers.length) {
                onSerialNumbersChange(__spreadArray(__spreadArray([], serialNumbers, true), Array.from({ length: safeValue - serialNumbers.length }, function () { return ({
                    index: serialNumbers.length,
                    number: ""
                }); }), true));
            }
            else if (safeValue < serialNumbers.length) {
                onSerialNumbersChange(serialNumbers.slice(0, safeValue));
            }
        }}>
                <react_1.NumberInput className="disabled:bg-transparent disabled:opacity-100 min-w-[100px]" isDisabled={isReadOnly} size="sm" min={0}/>
              </react_1.NumberField>
            </react_1.VStack>
          </react_1.HStack>
        </react_1.HStack>
        <div className="flex flex-grow items-center justify-between gap-2 pl-4">
          <react_1.HStack spacing={4}>
            <react_1.VStack spacing={1} className="text-center items-center">
              <label className="text-xs text-muted-foreground">{t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Ordered"], ["Ordered"])))}</label>
              <span className="text-sm py-1.5">{(_f = line.orderQuantity) !== null && _f !== void 0 ? _f : 0}</span>
            </react_1.VStack>

            <react_1.VStack spacing={1} className="text-center items-center">
              <label className="text-xs text-muted-foreground">
                {t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Outstanding"], ["Outstanding"])))}
              </label>
              <react_1.HStack className="justify-center">
                <span className="text-sm py-1.5">
                  {((_g = line.outstandingQuantity) !== null && _g !== void 0 ? _g : 0) -
            ((_h = line.receivedQuantity) !== null && _h !== void 0 ? _h : 0)}
                </span>

                {((_j = line.receivedQuantity) !== null && _j !== void 0 ? _j : 0) >
            ((_k = line.outstandingQuantity) !== null && _k !== void 0 ? _k : 0) && (<react_1.Tooltip>
                    <react_1.TooltipTrigger>
                      <lu_1.LuCircleAlert className="text-red-500"/>
                    </react_1.TooltipTrigger>
                    <react_1.TooltipContent>
                      There are more received than ordered
                    </react_1.TooltipContent>
                  </react_1.Tooltip>)}
              </react_1.HStack>
            </react_1.VStack>
          </react_1.HStack>

          <div className="flex flex-col items-start gap-1 min-w-[140px] text-sm">
            <label className="text-xs text-muted-foreground">
              {t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))}
            </label>
            <StorageUnit_1.default locationId={line.locationId} value={line.storageUnitId} isReadOnly={isReadOnly} onChange={function (storageUnit) {
            var _a;
            onUpdate({
                lineId: line.id,
                field: "storageUnitId",
                value: (_a = storageUnit === null || storageUnit === void 0 ? void 0 : storageUnit.id) !== null && _a !== void 0 ? _a : ""
            });
        }}/>
          </div>
        </div>
      </div>
      {line.requiresBatchTracking && (<>
          <BatchForm receipt={receipt} line={line} isReadOnly={isReadOnly} tracking={tracking} batchProperties={batchProperties} itemShelfLife={itemShelfLife}/>
        </>)}
      {line.requiresSerialTracking && (<SerialForm receipt={receipt} line={line} serialNumbers={serialNumbers} isReadOnly={isReadOnly} onSerialNumbersChange={onSerialNumbersChange} itemShelfLife={itemShelfLife} tracking={tracking}/>)}
      {(line.requiresBatchTracking || line.requiresSerialTracking) && (<>
          <react_2.Suspense fallback={null}>
            <react_router_1.Await resolve={files}>
              {function (resolvedFiles) {
                var _a;
                var lineFiles = (_a = resolvedFiles === null || resolvedFiles === void 0 ? void 0 : resolvedFiles.data) === null || _a === void 0 ? void 0 : _a.filter(function (file) { return file.bucket === line.id; });
                return Array.isArray(lineFiles) && lineFiles.length > 0 ? (<div className="flex flex-col gap-2">
                    {lineFiles.map(function (file) {
                        var documentType = (0, shared_service_1.getDocumentType)(file.name);
                        var isPreviewable = ["PDF", "Image"].includes(documentType);
                        return (<react_1.HStack key={file.id}>
                          <DocumentIcon_1.default type={documentType}/>
                          <span className="font-medium text-sm">
                            {isPreviewable ? (<components_1.DocumentPreview bucket="private" pathToFile={getPath(file)} 
                            // @ts-expect-error
                            type={(0, shared_service_1.getDocumentType)(file.name)}>
                                {file.name}
                              </components_1.DocumentPreview>) : (file.name)}
                          </span>
                          <react_1.IconButton icon={<lu_1.LuX />} aria-label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Delete file"], ["Delete file"])))} variant="ghost" onClick={function () { return deleteFile(file); }}/>
                        </react_1.HStack>);
                    })}
                  </div>) : null;
            }}
            </react_router_1.Await>
          </react_2.Suspense>
          <FileDropzone_1.default onDrop={upload}/>
          {splitDisclosure.isOpen && (<SplitReceiptLineModal line={line} onClose={splitDisclosure.onClose}/>)}
          {deleteDisclosure.isOpen && (<Modals_1.ConfirmDelete name="Receipt Line" text="Are you sure you want to delete this receipt line?" action={path_1.path.to.receiptLineDelete(line.id)} onCancel={deleteDisclosure.onClose} onSubmit={deleteDisclosure.onClose}/>)}
        </>)}
    </div>);
}
function BatchForm(_a) {
    var _this = this;
    var _b, _c, _d;
    var line = _a.line, receipt = _a.receipt, batchProperties = _a.batchProperties, itemShelfLife = _a.itemShelfLife, tracking = _a.tracking, isReadOnly = _a.isReadOnly;
    var t = (0, macro_1.useLingui)().t;
    var submit = (0, react_router_1.useSubmit)();
    var shelfLife = (_b = itemShelfLife === null || itemShelfLife === void 0 ? void 0 : itemShelfLife.data) === null || _b === void 0 ? void 0 : _b.find(function (sl) { return sl.itemId === line.itemId; });
    var showExpiryField = (shelfLife === null || shelfLife === void 0 ? void 0 : shelfLife.mode) === "Set on Receipt";
    var _e = (0, react_2.useState)(function () {
        var _a;
        if (tracking) {
            var attributes = tracking.attributes;
            return {
                number: tracking.readableId || "",
                expirationDate: (_a = tracking.expirationDate) !== null && _a !== void 0 ? _a : "",
                properties: Object.entries(attributes)
                    .filter(function (_a) {
                    var key = _a[0];
                    return ![
                        "Shipment Line",
                        "Shipment",
                        "Shipment Line Index",
                        "Receipt Line",
                        "Receipt",
                        "expirationDate"
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
            properties: {},
            expirationDate: ""
        };
    }), values = _e[0], setValues = _e[1];
    (0, react_2.useEffect)(function () {
        if (!tracking)
            return;
        setValues(function (prev) {
            var _a;
            var attributes = tracking.attributes;
            var newExpiration = (_a = tracking.expirationDate) !== null && _a !== void 0 ? _a : "";
            var newNumber = tracking.readableId || "";
            if (prev.expirationDate === newExpiration && prev.number === newNumber)
                return prev;
            return {
                number: newNumber || prev.number,
                expirationDate: newExpiration || prev.expirationDate,
                properties: Object.entries(attributes)
                    .filter(function (_a) {
                    var key = _a[0];
                    return ![
                        "Shipment Line",
                        "Shipment",
                        "Shipment Line Index",
                        "Receipt Line",
                        "Receipt",
                        "expirationDate"
                    ].includes(key);
                })
                    .reduce(function (acc, _a) {
                    var _b;
                    var key = _a[0], value = _a[1];
                    return (__assign(__assign({}, acc), (_b = {}, _b[key] = value || "", _b)));
                }, {})
            };
        });
    }, [tracking]);
    var updateBatchNumber = function (newValues_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([newValues_1], args_1, true), void 0, function (newValues, isNew) {
            var batchMatch, valuesToSubmit, attributes, formData, propertiesWithExpiry;
            var _a;
            if (isNew === void 0) { isNew = false; }
            return __generator(this, function (_b) {
                if (!(receipt === null || receipt === void 0 ? void 0 : receipt.id) || !newValues.number.trim())
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
                formData = new FormData();
                formData.append("itemId", line.itemId);
                formData.append("receiptId", receipt.id);
                formData.append("receiptLineId", line.id);
                formData.append("trackingType", "batch");
                if (tracking === null || tracking === void 0 ? void 0 : tracking.id) {
                    formData.append("trackedEntityId", tracking.id);
                }
                formData.append("batchNumber", valuesToSubmit.number.trim());
                propertiesWithExpiry = valuesToSubmit.expirationDate
                    ? __assign(__assign({}, valuesToSubmit.properties), { expirationDate: valuesToSubmit.expirationDate }) : valuesToSubmit.properties;
                formData.append("properties", JSON.stringify(propertiesWithExpiry));
                formData.append("quantity", ((_a = line.receivedQuantity) !== null && _a !== void 0 ? _a : 0).toString());
                submit(formData, {
                    method: "post",
                    action: path_1.path.to.receiptLinesTracking(receipt.id),
                    navigate: false
                });
                return [2 /*return*/];
            });
        });
    };
    var handlePropertiesChange = function (newProperties) {
        var newValues = __assign(__assign({}, values), { properties: newProperties });
        setValues(newValues);
        updateBatchNumber(newValues);
    };
    var propertiesDisclosure = (0, react_1.useDisclosure)();
    return (<div className="flex flex-col gap-6 w-full p-6 border rounded-lg">
      <div className="flex justify-between items-center gap-4">
        <react_1.Heading size="h4">{t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Batch Properties"], ["Batch Properties"])))}</react_1.Heading>
        <div className="flex items-center gap-2">
          {values.number.trim() !== "" && (<components_1.PrintButton sourceDocument="Receipt" sourceDocumentId={(_c = receipt === null || receipt === void 0 ? void 0 : receipt.id) !== null && _c !== void 0 ? _c : ""} locationId={(_d = receipt === null || receipt === void 0 ? void 0 : receipt.locationId) !== null && _d !== void 0 ? _d : undefined} context="receiving" fileRoutes={{
                pdf: function (id, opts) {
                    return path_1.path.to.file.receiptLabelsPdf(id, __assign(__assign({}, opts), { lineId: line.id }));
                },
                zpl: function (id, opts) {
                    return path_1.path.to.file.receiptLabelsZpl(id, __assign(__assign({}, opts), { lineId: line.id }));
                }
            }}/>)}
          <react_1.Button variant="secondary" leftIcon={<lu_1.LuGroup />} size="md" onClick={propertiesDisclosure.onOpen}>
            {t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Edit Properties"], ["Edit Properties"])))}
          </react_1.Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-muted-foreground flex items-center gap-2">
            <lu_1.LuGroup /> <macro_1.Trans>Batch Number</macro_1.Trans>
            {showExpiryField && (<span className="text-destructive-foreground">*</span>)}
          </label>

          <react_1.Input placeholder={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Batch number"], ["Batch number"])))} isDisabled={isReadOnly} value={values.number} onChange={function (e) {
            setValues(function (prev) { return (__assign(__assign({}, prev), { number: e.target.value })); });
        }} onBlur={function () {
            updateBatchNumber(values, true);
        }}/>
        </div>

        {showExpiryField && (<div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-muted-foreground flex items-center gap-2">
              <lu_1.LuCalendar /> <macro_1.Trans>Expiration Date</macro_1.Trans>
            </label>
            <react_1.DatePicker isDisabled={isReadOnly} value={values.expirationDate ? (0, date_1.parseDate)(values.expirationDate) : null} onChange={function (date) {
                var _a;
                var next = (_a = date === null || date === void 0 ? void 0 : date.toString()) !== null && _a !== void 0 ? _a : "";
                var newValues = __assign(__assign({}, values), { expirationDate: next });
                setValues(newValues);
                if (newValues.number.trim()) {
                    updateBatchNumber(newValues, true);
                }
                else if (next) {
                    react_1.toast.error(t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Enter a batch number before setting the expiration date"], ["Enter a batch number before setting the expiration date"]))));
                }
            }}/>
          </div>)}

        <react_2.Suspense fallback={null}>
          <react_router_1.Await resolve={batchProperties}>
            {function (resolvedBatchProperties) {
            var _a, _b;
            return (<BatchPropertiesFields_1.BatchPropertiesFields itemId={line.itemId} properties={(_b = (_a = resolvedBatchProperties === null || resolvedBatchProperties === void 0 ? void 0 : resolvedBatchProperties.data) === null || _a === void 0 ? void 0 : _a.filter(function (p) { return p.itemId === line.itemId; })) !== null && _b !== void 0 ? _b : []} isReadOnly={isReadOnly} values={values.properties} onChange={function (newProperties) {
                    handlePropertiesChange(newProperties);
                }}/>);
        }}
          </react_router_1.Await>
        </react_2.Suspense>
      </div>
      {propertiesDisclosure.isOpen && (<react_2.Suspense fallback={null}>
          <react_router_1.Await resolve={batchProperties}>
            {function (resolvedBatchProperties) {
                var _a;
                return (<BatchPropertiesConfig_1.default itemId={line.itemId} properties={(_a = resolvedBatchProperties === null || resolvedBatchProperties === void 0 ? void 0 : resolvedBatchProperties.data) !== null && _a !== void 0 ? _a : []} type="modal" onClose={propertiesDisclosure.onClose}/>);
            }}
          </react_router_1.Await>
        </react_2.Suspense>)}
    </div>);
}
function SerialForm(_a) {
    var _this = this;
    var _b, _c, _d, _e;
    var line = _a.line, receipt = _a.receipt, batchProperties = _a.batchProperties, itemShelfLife = _a.itemShelfLife, serialNumbers = _a.serialNumbers, isReadOnly = _a.isReadOnly, onSerialNumbersChange = _a.onSerialNumbersChange, tracking = _a.tracking;
    var t = (0, macro_1.useLingui)().t;
    var shelfLife = (_b = itemShelfLife === null || itemShelfLife === void 0 ? void 0 : itemShelfLife.data) === null || _b === void 0 ? void 0 : _b.find(function (sl) { return sl.itemId === line.itemId; });
    var showExpiryField = (shelfLife === null || shelfLife === void 0 ? void 0 : shelfLife.mode) === "Set on Receipt";
    var _f = (0, react_2.useState)((_c = tracking === null || tracking === void 0 ? void 0 : tracking.expirationDate) !== null && _c !== void 0 ? _c : ""), expiryDate = _f[0], setExpiryDate = _f[1];
    (0, react_2.useEffect)(function () {
        if (tracking === null || tracking === void 0 ? void 0 : tracking.expirationDate) {
            setExpiryDate(function (prev) { return prev || tracking.expirationDate || ""; });
        }
    }, [tracking === null || tracking === void 0 ? void 0 : tracking.expirationDate]);
    var _g = (0, react_2.useState)({}), errors = _g[0], setErrors = _g[1];
    // Check for duplicates within the current form
    var validateSerialNumber = (0, react_2.useCallback)(function (serialNumber, currentIndex) {
        var trimmedNumber = serialNumber.trim();
        if (!trimmedNumber)
            return null;
        var isDuplicate = serialNumbers.some(function (sn, idx) { return idx !== currentIndex && sn.number.trim() === trimmedNumber; });
        return isDuplicate ? "Duplicate serial number" : null;
    }, [serialNumbers]);
    var updateSerialNumber = (0, react_2.useCallback)(function (serialNumber) { return __awaiter(_this, void 0, void 0, function () {
        var error, formData, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(receipt === null || receipt === void 0 ? void 0 : receipt.id) || !serialNumber.number.trim())
                        return [2 /*return*/];
                    error = validateSerialNumber(serialNumber.number, serialNumber.index);
                    if (error) {
                        setErrors(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[serialNumber.index] = error, _a)));
                        });
                        return [2 /*return*/];
                    }
                    formData = new FormData();
                    formData.append("itemId", line.itemId);
                    formData.append("receiptId", receipt.id);
                    formData.append("receiptLineId", line.id);
                    formData.append("trackingType", "serial");
                    formData.append("index", serialNumber.index.toString());
                    formData.append("serialNumber", serialNumber.number.trim());
                    if (expiryDate) {
                        formData.append("expiryDate", expiryDate);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(path_1.path.to.receiptLinesTracking(receipt.id), {
                            method: "POST",
                            body: formData
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        // Clear error if submission was successful
                        setErrors(function (prev) {
                            var newErrors = __assign({}, prev);
                            delete newErrors[serialNumber.index];
                            return newErrors;
                        });
                    }
                    else {
                        setErrors(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[serialNumber.index] = "Serial number already exists", _a)));
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    if (error_1 instanceof Error && error_1.message.includes("duplicate")) {
                        setErrors(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[serialNumber.index] = "Serial number already exists for this item", _a)));
                        });
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [line.id, line.itemId, receipt === null || receipt === void 0 ? void 0 : receipt.id, validateSerialNumber, expiryDate]);
    var propertiesDisclosure = (0, react_1.useDisclosure)();
    return (<div className="flex flex-col gap-6 p-6 border rounded-lg">
      <div className="flex justify-between items-center gap-6">
        <react_1.Heading size="h4">{t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Serial Numbers"], ["Serial Numbers"])))}</react_1.Heading>
        <div className="flex items-center gap-2">
          <components_1.PrintButton sourceDocument="Receipt" sourceDocumentId={(_d = receipt === null || receipt === void 0 ? void 0 : receipt.id) !== null && _d !== void 0 ? _d : ""} locationId={(_e = receipt === null || receipt === void 0 ? void 0 : receipt.locationId) !== null && _e !== void 0 ? _e : undefined} context="receiving" fileRoutes={{
            pdf: function (id, opts) {
                return path_1.path.to.file.receiptLabelsPdf(id, __assign(__assign({}, opts), { lineId: line.id }));
            },
            zpl: function (id, opts) {
                return path_1.path.to.file.receiptLabelsZpl(id, __assign(__assign({}, opts), { lineId: line.id }));
            }
        }}/>
        </div>
      </div>

      {showExpiryField && (<div className="flex flex-col gap-2 max-w-xs">
          <label className="text-xs text-muted-foreground flex items-center gap-2">
            <lu_1.LuCalendar />{" "}
            <macro_1.Trans>Expiration Date (applies to all serials on this line)</macro_1.Trans>
          </label>
          <react_1.DatePicker isDisabled={isReadOnly} value={expiryDate ? (0, date_1.parseDate)(expiryDate) : null} onChange={function (date) { var _a; return setExpiryDate((_a = date === null || date === void 0 ? void 0 : date.toString()) !== null && _a !== void 0 ? _a : ""); }}/>
        </div>)}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
        {serialNumbers.map(function (serialNumber, index) { return (<div key={"".concat(line.id, "-").concat(index, "-serial")} className="flex flex-col gap-1">
            <react_1.Input placeholder={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Serial ", ""], ["Serial ", ""])), index + 1)} isDisabled={isReadOnly} value={serialNumber.number} onChange={function (e) {
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
                var newSerialNumbers = __spreadArray([], serialNumbers, true);
                newSerialNumbers[index] = {
                    index: index,
                    number: newValue
                };
                onSerialNumbersChange(newSerialNumbers);
            }} onBlur={function () {
                if (serialNumber.number.trim()) {
                    updateSerialNumber(serialNumber);
                }
            }} onKeyDown={function (e) {
                var _a;
                if (e.key === "Enter") {
                    e.preventDefault();
                    if (serialNumber.number.trim()) {
                        updateSerialNumber(serialNumber);
                    }
                    var nextInput = (_a = e.currentTarget
                        .closest("div")) === null || _a === void 0 ? void 0 : _a.querySelector("input[placeholder=\"".concat(t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Serial ", ""], ["Serial ", ""])), index + 2), "\"]"));
                    if (nextInput) {
                        nextInput.focus();
                    }
                }
            }} className={(0, react_1.cn)(errors[index] && "border-destructive")}/>
            {errors[index] && (<span className="text-xs text-destructive">{errors[index]}</span>)}
          </div>); })}
        {propertiesDisclosure.isOpen && (<react_2.Suspense fallback={null}>
            <react_router_1.Await resolve={batchProperties}>
              {function (resolvedBatchProperties) {
                var _a;
                return (<BatchPropertiesConfig_1.default itemId={line.itemId} properties={(_a = resolvedBatchProperties === null || resolvedBatchProperties === void 0 ? void 0 : resolvedBatchProperties.data) !== null && _a !== void 0 ? _a : []} type="modal" onClose={propertiesDisclosure.onClose}/>);
            }}
            </react_router_1.Await>
          </react_2.Suspense>)}
      </div>
    </div>);
}
function SplitReceiptLineModal(_a) {
    var _b, _c, _d, _e;
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
        <form_1.ValidatedForm method="post" action={path_1.path.to.receiptLineSplit} validator={inventory_1.splitValidator} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>{t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Split Receipt Line"], ["Split Receipt Line"])))}</react_1.ModalTitle>
            <react_1.ModalDescription>
              {t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Select the quantity that you'd like to split into a new line."], ["Select the quantity that you'd like to split into a new line."])))}
            </react_1.ModalDescription>
          </react_1.ModalHeader>

          <react_1.ModalBody>
            <input type="hidden" name="documentId" value={(_c = line.receiptId) !== null && _c !== void 0 ? _c : ""}/>
            <input type="hidden" name="documentLineId" value={line.id}/>
            <input type="hidden" name="locationId" value={(_d = line.locationId) !== null && _d !== void 0 ? _d : ""}/>
            <form_1.Number name="quantity" label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Quantity"], ["Quantity"])))} maxValue={(_e = line.orderQuantity) !== null && _e !== void 0 ? _e : 0 - 0.0001} minValue={0.0001}/>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              {t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Cancel"], ["Cancel"])))}
            </react_1.Button>
            <form_1.Submit>{t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Split Line"], ["Split Line"])))}</form_1.Submit>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var usePendingReceiptLines = function () {
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        return fetcher.formAction === path_1.path.to.bulkUpdateReceiptLine;
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
exports.default = ReceiptLines;
function useReceiptFiles(receiptId) {
    var _this = this;
    var t = (0, macro_1.useLingui)().t;
    var company = (0, hooks_1.useUser)().company;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var getPath = (0, react_2.useCallback)(function (_a, lineId) {
        var name = _a.name;
        return "".concat(company.id, "/inventory/").concat(lineId, "/").concat((0, string_1.stripSpecialCharacters)(name));
    }, [company.id]);
    var submit = (0, react_router_1.useSubmit)();
    var revalidator = (0, react_router_1.useRevalidator)();
    var upload = (0, react_2.useCallback)(function (files, lineId) { return __awaiter(_this, void 0, void 0, function () {
        var _loop_1, _i, _a, _b, index, file;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Carbon client not available"], ["Carbon client not available"]))));
                        return [2 /*return*/];
                    }
                    _loop_1 = function (index, file) {
                        var uploadToast, fileName, fileUpload, formData;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    uploadToast = (0, upload_1.createUploadToast)({
                                        id: "receipt-doc-".concat(lineId, "-").concat(index, "-").concat(file.name),
                                        label: function (pct) { return "".concat(t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Uploading ", ""], ["Uploading ", ""])), file.name), " (").concat(pct, "%)"); }
                                    });
                                    fileName = getPath({ name: file.name }, lineId);
                                    return [4 /*yield*/, (0, upload_1.uploadToStorageWithProgress)(carbon, {
                                            bucket: "private",
                                            path: fileName,
                                            file: file,
                                            cacheControl: "".concat(12 * 60 * 60),
                                            upsert: true,
                                            onProgress: uploadToast.onProgress
                                        })];
                                case 1:
                                    fileUpload = _e.sent();
                                    if (fileUpload.error) {
                                        uploadToast.error(t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Failed to upload file: ", ""], ["Failed to upload file: ", ""])), file.name));
                                    }
                                    else if ((_c = fileUpload.data) === null || _c === void 0 ? void 0 : _c.path) {
                                        uploadToast.dismiss();
                                        formData = new FormData();
                                        formData.append("path", fileUpload.data.path);
                                        formData.append("name", file.name);
                                        formData.append("size", Math.round(file.size / 1024).toString());
                                        formData.append("sourceDocument", "Receipt");
                                        formData.append("sourceDocumentId", receiptId);
                                        submit(formData, {
                                            method: "post",
                                            action: path_1.path.to.newDocument,
                                            navigate: false,
                                            fetcherKey: "".concat(lineId, ":").concat(file.name)
                                        });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = files.entries();
                    _d.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    _b = _a[_i], index = _b[0], file = _b[1];
                    return [5 /*yield**/, _loop_1(index, file)];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    revalidator.revalidate();
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, revalidator, getPath, receiptId, submit, t]);
    var deleteFile = (0, react_2.useCallback)(function (file, lineId) { return __awaiter(_this, void 0, void 0, function () {
        var fileDelete;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").remove([getPath(file, lineId)]))];
                case 1:
                    fileDelete = _b.sent();
                    if (!fileDelete || fileDelete.error) {
                        react_1.toast.error(((_a = fileDelete === null || fileDelete === void 0 ? void 0 : fileDelete.error) === null || _a === void 0 ? void 0 : _a.message) || "Error deleting file");
                        return [2 /*return*/];
                    }
                    react_1.toast.success("".concat(file.name, " deleted successfully"));
                    revalidator.revalidate();
                    return [2 /*return*/];
            }
        });
    }); }, [getPath, carbon === null || carbon === void 0 ? void 0 : carbon.storage, revalidator]);
    return { upload: upload, deleteFile: deleteFile, getPath: getPath };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24;
