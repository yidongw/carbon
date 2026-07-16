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
exports.MaintenanceAddPartModal = MaintenanceAddPartModal;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function MaintenanceAddPartModal(_a) {
    var _this = this;
    var dispatchId = _a.dispatchId, itemOptions = _a.itemOptions, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _b = (0, react_2.useState)(""), selectedItemId = _b[0], setSelectedItemId = _b[1];
    var _c = (0, react_2.useState)(null), itemDetails = _c[0], setItemDetails = _c[1];
    var _d = (0, react_2.useState)(1), quantity = _d[0], setQuantity = _d[1];
    var _e = (0, react_2.useState)(false), isLoadingItem = _e[0], setIsLoadingItem = _e[1];
    // For serial tracking
    var _f = (0, react_2.useState)([{ index: 0, id: "" }]), selectedSerialNumbers = _f[0], setSelectedSerialNumbers = _f[1];
    var _g = (0, react_2.useState)({}), serialErrors = _g[0], setSerialErrors = _g[1];
    var _h = (0, react_2.useState)([]), serialOptions = _h[0], setSerialOptions = _h[1];
    // For batch tracking
    var _j = (0, react_2.useState)([{ index: 0, id: "", quantity: 1 }]), selectedBatches = _j[0], setSelectedBatches = _j[1];
    var _k = (0, react_2.useState)({}), batchErrors = _k[0], setBatchErrors = _k[1];
    var _l = (0, react_2.useState)([]), batchOptions = _l[0], setBatchOptions = _l[1];
    var _m = (0, react_2.useState)("scan"), activeTab = _m[0], setActiveTab = _m[1];
    var handleItemChange = (0, react_2.useCallback)(function (itemId) { return __awaiter(_this, void 0, void 0, function () {
        var data, serials, batches;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setSelectedItemId(itemId);
                    setItemDetails(null);
                    setQuantity(1);
                    setSelectedSerialNumbers([{ index: 0, id: "" }]);
                    setSelectedBatches([{ index: 0, id: "", quantity: 1 }]);
                    setSerialErrors({});
                    setBatchErrors({});
                    setSerialOptions([]);
                    setBatchOptions([]);
                    if (!(itemId && carbon)) return [3 /*break*/, 6];
                    setIsLoadingItem(true);
                    return [4 /*yield*/, carbon
                            .from("item")
                            .select("id, name, unitOfMeasureCode, itemTrackingType")
                            .eq("id", itemId)
                            .single()];
                case 1:
                    data = (_c.sent()).data;
                    if (!data) return [3 /*break*/, 5];
                    setItemDetails(data);
                    if (!(data.itemTrackingType === "Serial")) return [3 /*break*/, 3];
                    return [4 /*yield*/, carbon
                            .from("trackedEntity")
                            .select("id, readableId, status")
                            .eq("sourceDocumentId", itemId)
                            .eq("status", "Available")];
                case 2:
                    serials = (_c.sent()).data;
                    setSerialOptions((_a = serials === null || serials === void 0 ? void 0 : serials.map(function (sn) {
                        var _a;
                        return ({
                            label: sn.readableId
                                ? "".concat(sn.readableId, " \u2014 ").concat(sn.id)
                                : ((_a = sn.id) !== null && _a !== void 0 ? _a : ""),
                            value: sn.id
                        });
                    })) !== null && _a !== void 0 ? _a : []);
                    _c.label = 3;
                case 3:
                    if (!(data.itemTrackingType === "Batch")) return [3 /*break*/, 5];
                    return [4 /*yield*/, carbon
                            .from("trackedEntity")
                            .select("id, readableId, status, quantity")
                            .eq("sourceDocumentId", itemId)
                            .eq("status", "Available")];
                case 4:
                    batches = (_c.sent()).data;
                    setBatchOptions((_b = batches === null || batches === void 0 ? void 0 : batches.map(function (batch) {
                        var _a;
                        return ({
                            label: batch.readableId
                                ? "".concat(batch.readableId, " \u2014 ").concat(batch.id.slice(0, 10), " \u2014 ").concat(batch.quantity, " available")
                                : "".concat(batch.id.slice(0, 10), " \u2014 ").concat(batch.quantity, " available"),
                            value: batch.id,
                            quantity: (_a = batch.quantity) !== null && _a !== void 0 ? _a : 0
                        });
                    })) !== null && _b !== void 0 ? _b : []);
                    _c.label = 5;
                case 5:
                    setIsLoadingItem(false);
                    _c.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); }, [carbon]);
    var validateSerialNumber = (0, react_2.useCallback)(function (value, index) {
        if (!value)
            return t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Serial number is required"], ["Serial number is required"])));
        var isDuplicate = selectedSerialNumbers.some(function (sn, i) { return sn.id === value && i !== index; });
        if (isDuplicate)
            return t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Duplicate serial number"], ["Duplicate serial number"])));
        var isValid = serialOptions.some(function (opt) { return opt.value === value; });
        if (!isValid)
            return t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Serial number is not available"], ["Serial number is not available"])));
        return null;
    }, [selectedSerialNumbers, serialOptions, t]);
    var validateBatch = (0, react_2.useCallback)(function (value, qty, index) {
        if (!value)
            return t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Batch number is required"], ["Batch number is required"])));
        if (qty <= 0)
            return t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quantity must be greater than 0"], ["Quantity must be greater than 0"])));
        var isDuplicate = selectedBatches.some(function (b, i) { return b.id === value && i !== index; });
        if (isDuplicate)
            return t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Duplicate batch number"], ["Duplicate batch number"])));
        var batch = batchOptions.find(function (b) { return b.value === value; });
        if (!batch)
            return t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Batch is not available"], ["Batch is not available"])));
        if (qty > batch.quantity)
            return t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Only ", " available"], ["Only ", " available"])), batch.quantity);
        return null;
    }, [selectedBatches, batchOptions, t]);
    var handleSubmit = (0, react_2.useCallback)(function () {
        if (!selectedItemId || !itemDetails) {
            react_1.toast.error(t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Please select an item"], ["Please select an item"]))));
            return;
        }
        var trackingType = itemDetails.itemTrackingType;
        if (trackingType === "Serial") {
            // Validate all serial numbers
            var hasErrors_1 = false;
            var newErrors_1 = {};
            selectedSerialNumbers.forEach(function (sn) {
                var error = validateSerialNumber(sn.id, sn.index);
                if (error) {
                    newErrors_1[sn.index] = error;
                    hasErrors_1 = true;
                }
            });
            setSerialErrors(newErrors_1);
            if (hasErrors_1)
                return;
            // Submit serial tracked items
            var payload = {
                itemId: selectedItemId,
                unitOfMeasureCode: itemDetails.unitOfMeasureCode,
                children: selectedSerialNumbers.map(function (sn) { return ({
                    trackedEntityId: sn.id,
                    quantity: 1
                }); })
            };
            fetcher.submit(JSON.stringify(payload), {
                method: "post",
                action: path_1.path.to.addAndIssueMaintenanceDispatchItem(dispatchId),
                encType: "application/json"
            });
        }
        else if (trackingType === "Batch") {
            // Validate all batches
            var hasErrors_2 = false;
            var newErrors_2 = {};
            selectedBatches.forEach(function (batch) {
                var error = validateBatch(batch.id, batch.quantity, batch.index);
                if (error) {
                    newErrors_2[batch.index] = error;
                    hasErrors_2 = true;
                }
            });
            setBatchErrors(newErrors_2);
            if (hasErrors_2)
                return;
            // Submit batch tracked items
            var payload = {
                itemId: selectedItemId,
                unitOfMeasureCode: itemDetails.unitOfMeasureCode,
                children: selectedBatches.map(function (batch) { return ({
                    trackedEntityId: batch.id,
                    quantity: batch.quantity
                }); })
            };
            fetcher.submit(JSON.stringify(payload), {
                method: "post",
                action: path_1.path.to.addAndIssueMaintenanceDispatchItem(dispatchId),
                encType: "application/json"
            });
        }
        else {
            // Inventory item
            if (quantity <= 0) {
                react_1.toast.error(t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Quantity must be greater than 0"], ["Quantity must be greater than 0"]))));
                return;
            }
            var payload = {
                itemId: selectedItemId,
                unitOfMeasureCode: itemDetails.unitOfMeasureCode,
                quantity: quantity
            };
            fetcher.submit(JSON.stringify(payload), {
                method: "post",
                action: path_1.path.to.addAndIssueMaintenanceDispatchItem(dispatchId),
                encType: "application/json"
            });
        }
    }, [
        selectedItemId,
        itemDetails,
        quantity,
        selectedSerialNumbers,
        selectedBatches,
        validateSerialNumber,
        validateBatch,
        dispatchId,
        fetcher,
        t
    ]);
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onClose();
            if (fetcher.data.message) {
                react_1.toast.success(fetcher.data.message);
            }
        }
        else if ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.message) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [fetcher.data, onClose]);
    return (<react_1.Modal open onOpenChange={onClose}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Add Spare Part</macro_1.Trans>
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            <macro_1.Trans>Select an item and specify the quantity to issue</macro_1.Trans>
          </react_1.ModalDescription>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <div className="flex flex-col gap-4">
            {/* Item Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <macro_1.Trans>Item</macro_1.Trans>
              </label>
              <react_1.Combobox placeholder={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Select an item..."], ["Select an item..."])))} value={selectedItemId} onChange={handleItemChange} options={itemOptions}/>
            </div>

            {isLoadingItem && (<div className="text-sm text-muted-foreground">
                <macro_1.Trans>Loading item details...</macro_1.Trans>
              </div>)}

            {/* Inventory Item - Simple Quantity */}
            {itemDetails &&
            (itemDetails.itemTrackingType === "Inventory" ||
                !itemDetails.itemTrackingType) && (<div>
                  <label className="block text-sm font-medium mb-1">
                    <macro_1.Trans>Quantity</macro_1.Trans>
                  </label>
                  <react_1.NumberField value={quantity} onChange={function (value) { return setQuantity(value); }} minValue={1}>
                    <react_1.NumberInputGroup>
                      <react_1.NumberInput name="quantity"/>
                      <react_1.NumberInputStepper>
                        <react_1.NumberIncrementStepper>
                          <lu_1.LuChevronUp />
                        </react_1.NumberIncrementStepper>
                        <react_1.NumberDecrementStepper>
                          <lu_1.LuChevronDown />
                        </react_1.NumberDecrementStepper>
                      </react_1.NumberInputStepper>
                    </react_1.NumberInputGroup>
                  </react_1.NumberField>
                </div>)}

            {/* Serial Tracked Item */}
            {itemDetails && itemDetails.itemTrackingType === "Serial" && (<react_1.Tabs value={activeTab} onValueChange={setActiveTab}>
                <react_1.TabsList className="grid w-full grid-cols-2 mb-4">
                  <react_1.TabsTrigger value="scan">
                    <lu_1.LuQrCode className="mr-2"/>
                    <macro_1.Trans>Scan</macro_1.Trans>
                  </react_1.TabsTrigger>
                  <react_1.TabsTrigger value="select">
                    <lu_1.LuList className="mr-2"/>
                    <macro_1.Trans>Select</macro_1.Trans>
                  </react_1.TabsTrigger>
                </react_1.TabsList>
                <react_1.TabsContent value="scan">
                  <div className="flex flex-col gap-4">
                    {selectedSerialNumbers.map(function (sn, index) { return (<div key={"".concat(index, "-scan")} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <react_1.InputGroup>
                              <react_1.Input placeholder={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Serial Number ", ""], ["Serial Number ", ""])), index + 1)} value={sn.id} onChange={function (e) {
                    var newValue = e.target.value;
                    setSelectedSerialNumbers(function (prev) {
                        var updated = __spreadArray([], prev, true);
                        updated[index] = { index: index, id: newValue };
                        return updated;
                    });
                }} onBlur={function (e) {
                    var error = validateSerialNumber(e.target.value, index);
                    setSerialErrors(function (prev) {
                        var newErrors = __assign({}, prev);
                        if (error) {
                            newErrors[index] = error;
                        }
                        else {
                            delete newErrors[index];
                        }
                        return newErrors;
                    });
                }} className={(0, react_1.cn)(serialErrors[index] && "border-destructive")}/>
                              <react_1.InputRightElement className="pl-2">
                                {!serialErrors[index] && sn.id ? (<lu_1.LuCheck className="text-emerald-500"/>) : (<lu_1.LuQrCode />)}
                              </react_1.InputRightElement>
                            </react_1.InputGroup>
                          </div>
                        </div>
                        {serialErrors[index] && (<span className="text-xs text-destructive">
                            {serialErrors[index]}
                          </span>)}
                      </div>); })}
                  </div>
                </react_1.TabsContent>
                <react_1.TabsContent value="select">
                  <div className="flex flex-col gap-4">
                    {selectedSerialNumbers.map(function (sn, index) { return (<div key={"".concat(index, "-select")} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <react_1.Combobox placeholder={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Select Serial ", ""], ["Select Serial ", ""])), index + 1)} value={sn.id} onChange={function (value) {
                    setSelectedSerialNumbers(function (prev) {
                        var updated = __spreadArray([], prev, true);
                        updated[index] = { index: index, id: value };
                        return updated;
                    });
                    var error = validateSerialNumber(value, index);
                    setSerialErrors(function (prev) {
                        var newErrors = __assign({}, prev);
                        if (error) {
                            newErrors[index] = error;
                        }
                        else {
                            delete newErrors[index];
                        }
                        return newErrors;
                    });
                }} options={serialOptions}/>
                          </div>
                        </div>
                        {serialErrors[index] && (<span className="text-xs text-destructive">
                            {serialErrors[index]}
                          </span>)}
                      </div>); })}
                  </div>
                </react_1.TabsContent>
              </react_1.Tabs>)}

            {/* Batch Tracked Item */}
            {itemDetails && itemDetails.itemTrackingType === "Batch" && (<react_1.Tabs value={activeTab} onValueChange={setActiveTab}>
                <react_1.TabsList className="grid w-full grid-cols-2 mb-4">
                  <react_1.TabsTrigger value="scan">
                    <lu_1.LuQrCode className="mr-2"/>
                    <macro_1.Trans>Scan</macro_1.Trans>
                  </react_1.TabsTrigger>
                  <react_1.TabsTrigger value="select">
                    <lu_1.LuList className="mr-2"/>
                    <macro_1.Trans>Select</macro_1.Trans>
                  </react_1.TabsTrigger>
                </react_1.TabsList>
                <react_1.TabsContent value="scan">
                  <div className="flex flex-col gap-4">
                    {selectedBatches.map(function (batch, index) { return (<div key={"".concat(index, "-scan")} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <react_1.InputGroup>
                              <react_1.Input placeholder={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Batch Number ", ""], ["Batch Number ", ""])), index + 1)} value={batch.id} onChange={function (e) {
                    var newValue = e.target.value;
                    setSelectedBatches(function (prev) {
                        var updated = __spreadArray([], prev, true);
                        updated[index] = __assign(__assign({}, batch), { id: newValue });
                        return updated;
                    });
                }} onBlur={function (e) {
                    var error = validateBatch(e.target.value, batch.quantity, index);
                    setBatchErrors(function (prev) {
                        var newErrors = __assign({}, prev);
                        if (error) {
                            newErrors[index] = error;
                        }
                        else {
                            delete newErrors[index];
                        }
                        return newErrors;
                    });
                }} className={(0, react_1.cn)(batchErrors[index] && "border-destructive")}/>
                              <react_1.InputRightElement className="pl-2">
                                {!batchErrors[index] && batch.id ? (<lu_1.LuCheck className="text-emerald-500"/>) : (<lu_1.LuQrCode />)}
                              </react_1.InputRightElement>
                            </react_1.InputGroup>
                          </div>
                          <div className="w-20">
                            <react_1.NumberField value={batch.quantity} onChange={function (value) {
                    setSelectedBatches(function (prev) {
                        var updated = __spreadArray([], prev, true);
                        updated[index] = __assign(__assign({}, batch), { quantity: value });
                        return updated;
                    });
                }} minValue={1}>
                              <react_1.NumberInputGroup className="relative">
                                <react_1.NumberInput name="quantity"/>
                                <react_1.NumberInputStepper>
                                  <react_1.NumberIncrementStepper>
                                    <lu_1.LuChevronUp />
                                  </react_1.NumberIncrementStepper>
                                  <react_1.NumberDecrementStepper>
                                    <lu_1.LuChevronDown />
                                  </react_1.NumberDecrementStepper>
                                </react_1.NumberInputStepper>
                              </react_1.NumberInputGroup>
                            </react_1.NumberField>
                          </div>
                        </div>
                        {batchErrors[index] && (<span className="text-xs text-destructive">
                            {batchErrors[index]}
                          </span>)}
                      </div>); })}
                  </div>
                </react_1.TabsContent>
                <react_1.TabsContent value="select">
                  <div className="flex flex-col gap-4">
                    {selectedBatches.map(function (batch, index) { return (<div key={"".concat(index, "-select")} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <react_1.Combobox placeholder={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Select Batch ", ""], ["Select Batch ", ""])), index + 1)} value={batch.id} onChange={function (value) {
                    setSelectedBatches(function (prev) {
                        var updated = __spreadArray([], prev, true);
                        updated[index] = __assign(__assign({}, batch), { id: value });
                        return updated;
                    });
                    var error = validateBatch(value, batch.quantity, index);
                    setBatchErrors(function (prev) {
                        var newErrors = __assign({}, prev);
                        if (error) {
                            newErrors[index] = error;
                        }
                        else {
                            delete newErrors[index];
                        }
                        return newErrors;
                    });
                }} options={batchOptions}/>
                          </div>
                          <div className="w-20">
                            <react_1.NumberField value={batch.quantity} onChange={function (value) {
                    setSelectedBatches(function (prev) {
                        var updated = __spreadArray([], prev, true);
                        updated[index] = __assign(__assign({}, batch), { quantity: value });
                        return updated;
                    });
                }} minValue={1}>
                              <react_1.NumberInputGroup>
                                <react_1.NumberInput name="quantity"/>
                                <react_1.NumberInputStepper>
                                  <react_1.NumberIncrementStepper />
                                  <react_1.NumberDecrementStepper />
                                </react_1.NumberInputStepper>
                              </react_1.NumberInputGroup>
                            </react_1.NumberField>
                          </div>
                        </div>
                        {batchErrors[index] && (<span className="text-xs text-destructive">
                            {batchErrors[index]}
                          </span>)}
                      </div>); })}
                  </div>
                </react_1.TabsContent>
              </react_1.Tabs>)}
          </div>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onClose}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <react_1.Button variant="primary" onClick={handleSubmit} isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle" || !selectedItemId || isLoadingItem}>
            <macro_1.Trans>Add & Issue</macro_1.Trans>
          </react_1.Button>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
