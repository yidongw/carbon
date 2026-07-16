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
var storage_rules_1 = require("@carbon/ee/storage-rules");
var form_1 = require("@carbon/form");
var ui_1 = require("@carbon/printing/ui");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Enumerable_1 = require("~/components/Enumerable");
var Form_1 = require("~/components/Form");
var StorageUnit_1 = require("~/components/Form/StorageUnit");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var inventory_models_1 = require("../../inventory.models");
var InventoryStorageUnits = function (_a) {
    var _b, _c, _d;
    var itemStorageUnitQuantities = _a.itemStorageUnitQuantities, itemUnitOfMeasureCode = _a.itemUnitOfMeasureCode, itemTrackingType = _a.itemTrackingType, itemShelfLife = _a.itemShelfLife, trackedEntityExpirations = _a.trackedEntityExpirations, pickMethod = _a.pickMethod, storageUnits = _a.storageUnits;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var adjustmentModal = (0, react_1.useDisclosure)();
    var ruleViolations = (0, storage_rules_1.useStorageRuleViolations)({
        action: path_1.path.to.inventoryItemAdjustment(pickMethod.itemId),
        onSuccess: adjustmentModal.onClose
    });
    var unitOfMeasures = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var itemUnitOfMeasure = (0, react_2.useMemo)(function () { return unitOfMeasures.find(function (unit) { return unit.value === itemUnitOfMeasureCode; }); }, [itemUnitOfMeasureCode, unitOfMeasures]);
    var isSerial = itemTrackingType === "Serial";
    var isBatch = itemTrackingType === "Batch";
    var visibleStorageUnitQuantities = (0, react_2.useMemo)(function () { return itemStorageUnitQuantities.filter(function (item) { return item.quantity !== 0; }); }, [itemStorageUnitQuantities]);
    var showExpirationColumn = (0, react_2.useMemo)(function () {
        return visibleStorageUnitQuantities.some(function (item) {
            return item.trackedEntityId && trackedEntityExpirations[item.trackedEntityId];
        });
    }, [visibleStorageUnitQuantities, trackedEntityExpirations]);
    var _e = (0, react_2.useState)(1), quantity = _e[0], setQuantity = _e[1];
    var _f = (0, react_2.useState)(null), selectedStorageUnitId = _f[0], setSelectedStorageUnitId = _f[1];
    var _g = (0, react_2.useState)(null), selectedTrackedEntityId = _g[0], setSelectedTrackedEntityId = _g[1];
    var _h = (0, react_2.useState)(null), selectedReadableId = _h[0], setSelectedReadableId = _h[1];
    var _j = (0, react_2.useState)(false), isEditingRow = _j[0], setIsEditingRow = _j[1];
    var isEditing = selectedTrackedEntityId !== null;
    var showExpirationField = isBatch || isSerial;
    var defaultExpirationDate = (0, react_2.useMemo)(function () {
        var _a;
        if (!showExpirationField)
            return undefined;
        if (selectedTrackedEntityId) {
            return (_a = trackedEntityExpirations[selectedTrackedEntityId]) !== null && _a !== void 0 ? _a : undefined;
        }
        if ((itemShelfLife === null || itemShelfLife === void 0 ? void 0 : itemShelfLife.mode) === "Fixed Duration" &&
            itemShelfLife.days &&
            Number(itemShelfLife.days) > 0) {
            return (0, date_1.today)((0, date_1.getLocalTimeZone)())
                .add({ days: Number(itemShelfLife.days) })
                .toString();
        }
        return undefined;
    }, [
        showExpirationField,
        selectedTrackedEntityId,
        trackedEntityExpirations,
        itemShelfLife
    ]);
    var openAdjustmentModal = function (storageUnitId, trackedEntityId, readableId, currentQuantity) {
        setSelectedStorageUnitId(storageUnitId || null);
        setSelectedTrackedEntityId(trackedEntityId || null);
        setSelectedReadableId(readableId || null);
        setIsEditingRow(storageUnitId !== undefined);
        if (currentQuantity !== undefined) {
            setQuantity(currentQuantity);
        }
        adjustmentModal.onOpen();
    };
    var _k = (0, hooks_1.usePrinting)(), printerRoutes = _k.printerRoutes, resolvePrinterRoute = _k.resolvePrinterRoute;
    var printerModal = (0, react_1.useDisclosure)();
    var downloadModal = (0, react_1.useDisclosure)();
    var printFetcher = (0, react_router_1.useFetcher)();
    var _l = (0, react_2.useState)(null), pendingPrintEntityId = _l[0], setPendingPrintEntityId = _l[1];
    var locationId = pickMethod.locationId;
    var defaultPrinter = resolvePrinterRoute(locationId, "inventory");
    var _m = (0, react_2.useState)((_b = defaultPrinter === null || defaultPrinter === void 0 ? void 0 : defaultPrinter.id) !== null && _b !== void 0 ? _b : ""), selectedPrinterId = _m[0], setSelectedPrinterId = _m[1];
    var handlePrintLabel = function (trackedEntityId) {
        var _a, _b, _c;
        setPendingPrintEntityId(trackedEntityId);
        if (printerRoutes.length > 0) {
            setSelectedPrinterId((_c = (_a = defaultPrinter === null || defaultPrinter === void 0 ? void 0 : defaultPrinter.id) !== null && _a !== void 0 ? _a : (_b = printerRoutes[0]) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : "");
            printerModal.onOpen();
        }
        else {
            downloadModal.onOpen();
        }
    };
    var handleConfirmPrint = function () {
        if (!pendingPrintEntityId || !selectedPrinterId)
            return;
        printFetcher.submit({
            sourceDocument: "Entity",
            sourceDocumentId: pendingPrintEntityId,
            locationId: locationId,
            printerRouteId: selectedPrinterId
        }, {
            method: "POST",
            action: path_1.path.to.manualPrint,
            encType: "application/json"
        });
        react_1.toast.success("Print job queued");
        printerModal.onClose();
        setPendingPrintEntityId(null);
    };
    return (<>
      <react_1.Card className="w-full">
        <react_1.HStack className="w-full justify-between">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <react_1.HStack className="gap-2 items-center">
                <macro_1.Trans>Storage Units</macro_1.Trans>
                <Enumerable_1.Enumerable value={((_c = unitOfMeasures.find(function (uom) { return uom.value === itemUnitOfMeasureCode; })) === null || _c === void 0 ? void 0 : _c.label) || itemUnitOfMeasureCode}/>
              </react_1.HStack>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardAction>
            <react_1.Button onClick={function () { return openAdjustmentModal(); }}>
              <macro_1.Trans>Update Inventory</macro_1.Trans>
            </react_1.Button>
          </react_1.CardAction>
        </react_1.HStack>
        <react_1.CardContent>
          <react_1.Table className="table-fixed">
            <react_1.Thead>
              <react_1.Tr>
                <react_1.Th>
                  <macro_1.Trans>Storage Unit</macro_1.Trans>
                </react_1.Th>

                <react_1.Th>
                  <macro_1.Trans>Quantity</macro_1.Trans>
                </react_1.Th>
                <react_1.Th>
                  <macro_1.Trans>Tracking ID</macro_1.Trans>
                </react_1.Th>
                {showExpirationColumn && (<react_1.Th>
                    <macro_1.Trans>Expiration Date</macro_1.Trans>
                  </react_1.Th>)}
                <react_1.Th className="flex flex-shrink-0 justify-end"/>
              </react_1.Tr>
            </react_1.Thead>
            <react_1.Tbody>
              {visibleStorageUnitQuantities.map(function (item, index) {
            var _a;
            return (<react_1.Tr key={index}>
                  <react_1.Td>
                    {((_a = storageUnits.find(function (s) { return s.value === item.storageUnitId; })) === null || _a === void 0 ? void 0 : _a.label) || item.storageUnitId}
                  </react_1.Td>

                  <react_1.Td>
                    <span>{item.quantity}</span>
                  </react_1.Td>
                  <react_1.Td>
                    {item.trackedEntityId && (<react_1.HStack>
                        {item.readableId && <span>{item.readableId}</span>}
                        <react_1.Copy icon={<lu_1.LuQrCode />} text={item.trackedEntityId} withTextInTooltip/>
                      </react_1.HStack>)}
                  </react_1.Td>
                  {showExpirationColumn && (<react_1.Td>
                      {item.trackedEntityId &&
                        trackedEntityExpirations[item.trackedEntityId] && (<span>
                            {(0, utils_1.formatDate)(trackedEntityExpirations[item.trackedEntityId], undefined, locale)}
                          </span>)}
                    </react_1.Td>)}
                  <react_1.Td className="flex flex-shrink-0 justify-end items-center">
                    <react_1.DropdownMenu>
                      <react_1.DropdownMenuTrigger asChild>
                        <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Actions"], ["Actions"])))} variant="ghost" icon={<lu_1.LuEllipsisVertical />}/>
                      </react_1.DropdownMenuTrigger>
                      <react_1.DropdownMenuContent className="w-56">
                        <react_1.DropdownMenuItem onClick={function () {
                    return openAdjustmentModal(item.storageUnitId, item.trackedEntityId, item.readableId, item.quantity);
                }}>
                          <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
                          <macro_1.Trans>Update Quantity</macro_1.Trans>
                        </react_1.DropdownMenuItem>
                        {item.trackedEntityId && (<react_1.DropdownMenuItem onClick={function () {
                        return handlePrintLabel(item.trackedEntityId);
                    }}>
                            <react_1.DropdownMenuIcon icon={<lu_1.LuPrinter />}/>
                            <macro_1.Trans>Print Label</macro_1.Trans>
                          </react_1.DropdownMenuItem>)}
                      </react_1.DropdownMenuContent>
                    </react_1.DropdownMenu>
                  </react_1.Td>
                </react_1.Tr>);
        })}
            </react_1.Tbody>
          </react_1.Table>
        </react_1.CardContent>
      </react_1.Card>
      {adjustmentModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open) {
                    adjustmentModal.onClose();
                }
            }}>
          <react_1.ModalContent>
            <form_1.ValidatedForm method="post" validator={inventory_models_1.inventoryAdjustmentValidator} fetcher={ruleViolations.fetcher} action={path_1.path.to.inventoryItemAdjustment(pickMethod.itemId)} defaultValues={{
                itemId: pickMethod.itemId,
                quantity: isSerial && !isEditing ? 1 : quantity,
                locationId: pickMethod.locationId,
                storageUnitId: selectedStorageUnitId || undefined,
                originalStorageUnitId: isEditing
                    ? selectedStorageUnitId || undefined
                    : undefined,
                adjustmentType: "Set Quantity",
                trackedEntityId: selectedTrackedEntityId || (0, nanoid_1.nanoid)(),
                readableId: selectedReadableId || undefined,
                expirationDate: defaultExpirationDate
            }}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>
                  <macro_1.Trans>Inventory Adjustment</macro_1.Trans>
                </react_1.ModalTitle>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <form_1.Hidden name="itemId"/>
                {isEditing && <form_1.Hidden name="originalStorageUnitId"/>}

                <react_1.VStack spacing={2}>
                  <Form_1.Location name="locationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Location"], ["Location"])))} isReadOnly/>
                  <StorageUnit_1.default name="storageUnitId" locationId={pickMethod.locationId} label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))} isReadOnly={isEditingRow}/>
                  <Form_1.Select name="adjustmentType" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Adjustment Type"], ["Adjustment Type"])))} options={isEditing && (isSerial || isBatch)
                ? [
                    { label: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Set Quantity"], ["Set Quantity"]))), value: "Set Quantity" },
                    {
                        label: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Negative Adjustment"], ["Negative Adjustment"]))),
                        value: "Negative Adjmt."
                    }
                ]
                : __spreadArray(__spreadArray([], (isSerial
                    ? []
                    : [
                        {
                            label: "Set Quantity",
                            value: "Set Quantity"
                        }
                    ]), true), [
                    {
                        label: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Positive Adjustment"], ["Positive Adjustment"]))),
                        value: "Positive Adjmt."
                    },
                    {
                        label: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Negative Adjustment"], ["Negative Adjustment"]))),
                        value: "Negative Adjmt."
                    }
                ], false)}/>
                  {(isBatch || isSerial) && (<>
                      <form_1.Hidden name="trackedEntityId"/>
                      <Form_1.Input name="readableId" label={isSerial ? t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Serial Number"], ["Serial Number"]))) : t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Batch Number"], ["Batch Number"])))}/>
                      {showExpirationField && (<form_1.DatePicker name="expirationDate" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Expiration Date"], ["Expiration Date"])))}/>)}
                    </>)}
                  <form_1.NumberControlled name="quantity" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Quantity"], ["Quantity"])))} minValue={0} maxValue={isSerial && isEditing ? 1 : undefined} value={isSerial && !isEditing ? 1 : quantity} onChange={setQuantity} isReadOnly={isSerial && !isEditing}/>

                  <Form_1.Input name="unitOfMeasure" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))} value={(_d = itemUnitOfMeasure === null || itemUnitOfMeasure === void 0 ? void 0 : itemUnitOfMeasure.label) !== null && _d !== void 0 ? _d : ""} isReadOnly/>
                  <Form_1.TextArea name="comment" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Comment"], ["Comment"])))}/>
                </react_1.VStack>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button onClick={adjustmentModal.onClose} variant="secondary">
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                <form_1.Submit withBlocker={false} isDisabled={!permissions.can("update", "inventory")}>
                  Save
                </form_1.Submit>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}
      <ruleViolations.ViolationModal />
      {printerModal.isOpen && pendingPrintEntityId && (<react_1.Modal open onOpenChange={function (open) { return !open && printerModal.onClose(); }}>
          <react_1.ModalContent>
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                <macro_1.Trans>Select Printer</macro_1.Trans>
              </react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody>
              <div className="flex flex-col gap-1">
                {printerRoutes.map(function (route) { return (<button type="button" key={route.id} className={"flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ".concat(selectedPrinterId === route.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted")} onClick={function () { return setSelectedPrinterId(route.id); }}>
                    <lu_1.LuPrinter className="size-4 text-muted-foreground shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{route.name}</span>
                      <span className="text-xs text-muted-foreground ml-2 uppercase">
                        {route.format}
                      </span>
                    </div>
                    {selectedPrinterId === route.id && (<lu_1.LuCheck className="size-4 text-primary shrink-0"/>)}
                  </button>); })}
              </div>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <div className="flex gap-2">
                <react_1.Button variant="primary" leftIcon={<lu_1.LuPrinter />} disabled={!selectedPrinterId} onClick={handleConfirmPrint}>
                  <macro_1.Trans>Print</macro_1.Trans>
                </react_1.Button>
                <react_1.Button variant="solid" onClick={printerModal.onClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
              </div>
            </react_1.ModalFooter>
          </react_1.ModalContent>
        </react_1.Modal>)}
      {downloadModal.isOpen && pendingPrintEntityId && (<ui_1.LabelDownloadModal sourceDocumentId={pendingPrintEntityId} fileRoutes={{
                pdf: path_1.path.to.file.trackedEntityLabelPdf,
                zpl: path_1.path.to.file.trackedEntityLabelZpl
            }} isOpen={downloadModal.isOpen} onClose={function () {
                downloadModal.onClose();
                setPendingPrintEntityId(null);
            }}/>)}
      <react_router_1.Outlet />
    </>);
};
exports.default = InventoryStorageUnits;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
