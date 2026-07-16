"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var Enumerable_1 = require("~/components/Enumerable");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var inventory_models_1 = require("../../inventory.models");
var KanbanForm = function (_a) {
    var initialValues = _a.initialValues, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(initialValues.replenishmentSystem || "Buy"), selectedReplenishmentSystem = _b[0], setSelectedReplenishmentSystem = _b[1];
    var isEditing = !!initialValues.id;
    var _c = (0, react_2.useState)(initialValues.storageUnitId || null), storageUnitId = _c[0], setStorageUnitId = _c[1];
    var _d = (0, react_2.useState)("Item"), itemType = _d[0], setItemType = _d[1];
    var _e = (0, react_2.useState)(initialValues.itemId || ""), itemId = _e[0], setItemId = _e[1];
    var _f = (0, react_2.useState)(initialValues.supplierId || ""), supplierId = _f[0], setSupplierId = _f[1];
    var _g = (0, react_2.useState)(initialValues.purchaseUnitOfMeasureCode || ""), purchaseUnitOfMeasureCode = _g[0], setPurchaseUnitOfMeasureCode = _g[1];
    var _h = (0, react_2.useState)(""), inventoryUnitOfMeasureCode = _h[0], setInventoryUnitOfMeasureCode = _h[1];
    var _j = (0, react_2.useState)(initialValues.conversionFactor || 1), conversionFactor = _j[0], setConversionFactor = _j[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var onItemChange = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, item, storageUnit, itemUnitOfMeasure, supplierPart;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!carbon || !value)
                        return [2 /*return*/];
                    setItemId(value.value);
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("item")
                                .select("replenishmentSystem, unitOfMeasureCode")
                                .eq("id", value.value)
                                .single(),
                            carbon
                                .from("pickMethod")
                                .select("defaultStorageUnitId")
                                .eq("itemId", value.value)
                                .eq("companyId", company.id)
                                .eq("locationId", locationId)
                                .maybeSingle()
                        ])];
                case 1:
                    _a = _e.sent(), item = _a[0], storageUnit = _a[1];
                    if (item.error) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to load item details"], ["Failed to load item details"]))));
                        return [2 /*return*/];
                    }
                    setSelectedReplenishmentSystem(((_b = item.data) === null || _b === void 0 ? void 0 : _b.replenishmentSystem) || "Buy");
                    if ((_c = storageUnit.data) === null || _c === void 0 ? void 0 : _c.defaultStorageUnitId) {
                        setStorageUnitId(storageUnit.data.defaultStorageUnitId);
                    }
                    itemUnitOfMeasure = ((_d = item.data) === null || _d === void 0 ? void 0 : _d.unitOfMeasureCode) || "";
                    setInventoryUnitOfMeasureCode(itemUnitOfMeasure);
                    if (!!supplierId) return [3 /*break*/, 2];
                    setPurchaseUnitOfMeasureCode(itemUnitOfMeasure);
                    setConversionFactor(1);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, carbon
                        .from("supplierPart")
                        .select("supplierUnitOfMeasureCode, conversionFactor")
                        .eq("itemId", value.value)
                        .eq("supplierId", supplierId)
                        .eq("companyId", company.id)
                        .maybeSingle()];
                case 3:
                    supplierPart = _e.sent();
                    if (supplierPart.data) {
                        setPurchaseUnitOfMeasureCode(supplierPart.data.supplierUnitOfMeasureCode || itemUnitOfMeasure);
                        setConversionFactor(supplierPart.data.conversionFactor || 1);
                    }
                    else {
                        setPurchaseUnitOfMeasureCode(itemUnitOfMeasure);
                        setConversionFactor(1);
                    }
                    _e.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var onSupplierChange = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var supplierPart;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSupplierId((value === null || value === void 0 ? void 0 : value.value) || "");
                    if (!(carbon && (value === null || value === void 0 ? void 0 : value.value) && itemId)) return [3 /*break*/, 2];
                    return [4 /*yield*/, carbon
                            .from("supplierPart")
                            .select("supplierUnitOfMeasureCode, conversionFactor")
                            .eq("itemId", itemId)
                            .eq("supplierId", value.value)
                            .eq("companyId", company.id)
                            .maybeSingle()];
                case 1:
                    supplierPart = _a.sent();
                    if (supplierPart.data) {
                        setPurchaseUnitOfMeasureCode(supplierPart.data.supplierUnitOfMeasureCode ||
                            inventoryUnitOfMeasureCode);
                        setConversionFactor(supplierPart.data.conversionFactor || 1);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    if (!(value === null || value === void 0 ? void 0 : value.value)) {
                        // If supplier is cleared, reset to inventory unit of measure
                        setPurchaseUnitOfMeasureCode(inventoryUnitOfMeasureCode);
                        setConversionFactor(1);
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var _k = (0, react_2.useState)(initialValues.locationId || ""), locationId = _k[0], setLocationId = _k[1];
    var _l = (0, react_2.useState)(initialValues.autoRelease || false), autoRelease = _l[0], setAutoRelease = _l[1];
    var _m = (0, react_2.useState)(initialValues.autoStartJob || false), autoStartJob = _m[0], setAutoStartJob = _m[1];
    var onLocationChange = function (value) {
        setLocationId((value === null || value === void 0 ? void 0 : value.value) || "");
        setStorageUnitId(null);
    };
    return (<react_1.Drawer open onOpenChange={onClose}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm method="post" validator={inventory_models_1.kanbanValidator} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Edit Kanban"], ["Edit Kanban"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["New Kanban"], ["New Kanban"])))}
            </react_1.DrawerTitle>
            <react_1.DrawerDescription>
              {isEditing
            ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Update the kanban information for scan-based replenishment."], ["Update the kanban information for scan-based replenishment."]))) : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Create a new kanban card for scan-based replenishment."], ["Create a new kanban card for scan-based replenishment."])))}
            </react_1.DrawerDescription>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            {isEditing && <form_1.Hidden name="id" value={initialValues.id}/>}
            {selectedReplenishmentSystem === "Make" && (<form_1.Hidden name="purchaseUnitOfMeasureCode" value={purchaseUnitOfMeasureCode}/>)}
            <react_1.VStack spacing={4}>
              <div className="grid grid-cols-1 gap-4 w-full">
                <Form_1.Item name="itemId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Item"], ["Item"])))} type={itemType} locationId={locationId || undefined} onTypeChange={function (t) { return setItemType(t); }} onChange={onItemChange} isReadOnly={isEditing}/>

                <Form_1.Number name="quantity" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Quantity"], ["Quantity"])))} minValue={1} helperText={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["The quantity of the item to be reordered on scan-based replenishment."], ["The quantity of the item to be reordered on scan-based replenishment."])))}/>

                <form_1.SelectControlled value={selectedReplenishmentSystem} name="replenishmentSystem" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Replenishment System"], ["Replenishment System"])))} onChange={function (value) {
            if (value) {
                setSelectedReplenishmentSystem(value.value);
            }
        }} options={inventory_models_1.replenishmentSystemTypes
            .filter(function (type) { return type !== "Buy and Make"; })
            .map(function (type) { return ({
            value: type,
            label: <Enumerable_1.Enumerable value={type}/>
        }); })}/>

                {selectedReplenishmentSystem === "Buy" && (<>
                    <Form_1.Supplier name="supplierId" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Supplier"], ["Supplier"])))} value={supplierId} onChange={onSupplierChange}/>

                    <Form_1.UnitOfMeasure name="purchaseUnitOfMeasureCode" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Purchase Unit of Measure"], ["Purchase Unit of Measure"])))} value={purchaseUnitOfMeasureCode} onChange={function (value) {
                if (value &&
                    typeof value === "object" &&
                    "value" in value) {
                    setPurchaseUnitOfMeasureCode(value.value);
                }
                else {
                    setPurchaseUnitOfMeasureCode("");
                }
            }}/>

                    <Form_1.ConversionFactor name="conversionFactor" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Conversion Factor"], ["Conversion Factor"])))} inventoryCode={inventoryUnitOfMeasureCode} purchasingCode={purchaseUnitOfMeasureCode} value={conversionFactor} onChange={setConversionFactor} helperText={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Number of inventory units per purchase unit"], ["Number of inventory units per purchase unit"])))}/>
                  </>)}

                <Form_1.Location name="locationId" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Location"], ["Location"])))} onChange={onLocationChange} isReadOnly={isEditing}/>

                <Form_1.StorageUnit name="storageUnitId" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))} locationId={locationId} value={storageUnitId !== null && storageUnitId !== void 0 ? storageUnitId : undefined} onChange={function (value) {
            var _a;
            if (value)
                setStorageUnitId((_a = value === null || value === void 0 ? void 0 : value.id) !== null && _a !== void 0 ? _a : null);
        }}/>

                {selectedReplenishmentSystem === "Make" && (<>
                    <form_1.Boolean name="autoRelease" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Auto Release"], ["Auto Release"])))} value={autoRelease} onChange={function (value) {
                setAutoRelease(value);
                if (!value) {
                    setAutoStartJob(false);
                }
            }} description={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Automatically release the job when the kanban is scanned"], ["Automatically release the job when the kanban is scanned"])))}/>
                    <form_1.Boolean name="autoStartJob" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Auto Start Job"], ["Auto Start Job"])))} value={autoStartJob} onChange={setAutoStartJob} isDisabled={!autoRelease} description={autoRelease
                ? t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Automatically start the job when the kanban is scanned"], ["Automatically start the job when the kanban is scanned"]))) : t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Auto release must be enabled to start a job automatically"], ["Auto release must be enabled to start a job automatically"])))}/>
                    <Form_1.SequenceOrCustomId name="completedBarcodeOverride" label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Completion Barcode"], ["Completion Barcode"])))} table="kanban" placeholder={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Auto-generated QR Code"], ["Auto-generated QR Code"])))}/>
                  </>)}
              </div>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <react_1.Button type="button" variant="ghost" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <Form_1.Submit withBlocker={false}>
                {isEditing ? (<macro_1.Trans>Update Kanban</macro_1.Trans>) : (<macro_1.Trans>Create Kanban</macro_1.Trans>)}
              </Form_1.Submit>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = KanbanForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22;
