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
exports.PurchasingPlanningOrderDrawer = void 0;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var hooks_1 = require("~/hooks");
var Item_1 = require("~/modules/items/ui/Item");
var ItemForm_1 = require("~/modules/items/ui/Item/ItemForm");
var ItemPlanningChart_1 = require("~/modules/items/ui/Item/ItemPlanningChart");
var ItemReorderPolicy_1 = require("~/modules/items/ui/Item/ItemReorderPolicy");
var path_1 = require("~/utils/path");
var PurchaseOrder_1 = require("../PurchaseOrder");
exports.PurchasingPlanningOrderDrawer = (0, react_2.memo)(function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var selectedItem = _a.selectedItem, setSelectedItem = _a.setSelectedItem, orders = _a.orders, setOrders = _a.setOrders, locationId = _a.locationId, periods = _a.periods, selectedSupplier = _a.selectedSupplier, isOpen = _a.isOpen, onClose = _a.onClose, onSupplierChange = _a.onSupplierChange;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var formatter = (0, hooks_1.useCurrencyFormatter)();
    var unitOfMeasureOptions = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var _k = (0, react_2.useState)("ordering"), activeTab = _k[0], setActiveTab = _k[1];
    var getExistingOrders = (0, react_2.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var existingOrderData, existingOrders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon || !selectedItem.id)
                        return [2 /*return*/];
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("openPurchaseOrderLines").select("*").eq("itemId", selectedItem.id).in("status", [
                            "To Review",
                            "Needs Approval",
                            "Planned",
                            "To Receive",
                            "To Receive and Invoice",
                            "To Invoice"
                        ]))];
                case 1:
                    existingOrderData = (_a.sent()).data;
                    if (existingOrderData) {
                        existingOrders = existingOrderData
                            .filter(function (order) {
                            return !orders.some(function (existing) { return existing.existingLineId === order.id; });
                        })
                            .map(function (order) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
                            var dueDate = order.dueDate;
                            if (!dueDate ||
                                (0, date_1.parseDate)(dueDate) < (0, date_1.parseDate)(periods[0].startDate)) {
                                return {
                                    existingId: (_a = order.purchaseOrderId) !== null && _a !== void 0 ? _a : undefined,
                                    existingLineId: (_b = order.id) !== null && _b !== void 0 ? _b : undefined,
                                    existingReadableId: (_c = order.purchaseOrderReadableId) !== null && _c !== void 0 ? _c : undefined,
                                    existingQuantity: order.status === "Draft"
                                        ? 0
                                        : ((_d = order === null || order === void 0 ? void 0 : order.quantityToReceive) !== null && _d !== void 0 ? _d : 0),
                                    existingStatus: (_e = order.status) !== null && _e !== void 0 ? _e : undefined,
                                    startDate: (_f = order.orderDate) !== null && _f !== void 0 ? _f : null,
                                    dueDate: null,
                                    quantity: (_g = order.quantityToReceive) !== null && _g !== void 0 ? _g : 0,
                                    periodId: periods[0].id,
                                    supplierId: (_h = order.supplierId) !== null && _h !== void 0 ? _h : undefined
                                };
                            }
                            var period = periods.find(function (p) {
                                var d = (0, date_1.parseDate)(dueDate);
                                var startDate = (0, date_1.parseDate)(p.startDate);
                                var endDate = (0, date_1.parseDate)(p.endDate);
                                return d >= startDate && d <= endDate;
                            });
                            return {
                                existingId: (_j = order.purchaseOrderId) !== null && _j !== void 0 ? _j : undefined,
                                existingLineId: (_k = order.id) !== null && _k !== void 0 ? _k : undefined,
                                existingReadableId: (_l = order.purchaseOrderReadableId) !== null && _l !== void 0 ? _l : undefined,
                                existingQuantity: order.status === "Draft" ? 0 : ((_m = order === null || order === void 0 ? void 0 : order.quantityToReceive) !== null && _m !== void 0 ? _m : 0),
                                existingStatus: (_o = order.status) !== null && _o !== void 0 ? _o : undefined,
                                startDate: (_p = order.orderDate) !== null && _p !== void 0 ? _p : null,
                                dueDate: dueDate !== null && dueDate !== void 0 ? dueDate : null,
                                quantity: (_q = order.quantityToReceive) !== null && _q !== void 0 ? _q : 0,
                                isASAP: false,
                                periodId: (_r = period === null || period === void 0 ? void 0 : period.id) !== null && _r !== void 0 ? _r : periods[periods.length - 1].id,
                                supplierId: (_s = order.supplierId) !== null && _s !== void 0 ? _s : undefined
                            };
                        });
                        // Backend now handles grouping items by supplier into single POs
                        // So we just need to merge the existing orders with current orders
                        setOrders(selectedItem, __spreadArray(__spreadArray([], orders, true), existingOrders, true).sort(function (a, b) {
                            var _a, _b, _c;
                            return (_c = (_a = a.dueDate) === null || _a === void 0 ? void 0 : _a.localeCompare((_b = b.dueDate) !== null && _b !== void 0 ? _b : "")) !== null && _c !== void 0 ? _c : 0;
                        }));
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, selectedItem, orders, periods, setOrders]);
    (0, react_1.useMount)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (selectedItem.id) {
                getExistingOrders();
            }
            return [2 /*return*/];
        });
    }); });
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (selectedItem.id) {
            getExistingOrders();
        }
    }, [selectedSupplier]);
    var onAddOrder = (0, react_2.useCallback)(function () {
        var _a, _b, _c, _d, _e;
        if (selectedItem.id) {
            // Get the conversion factor from the selected supplier
            var supplier = (_a = selectedItem.suppliers) === null || _a === void 0 ? void 0 : _a.find(function (s) { return s.supplierId === selectedSupplier; });
            var conversionFactor = (_b = supplier === null || supplier === void 0 ? void 0 : supplier.conversionFactor) !== null && _b !== void 0 ? _b : 1;
            // Convert inventory quantity to purchase quantity
            var inventoryQuantity = (_d = (_c = selectedItem.lotSize) !== null && _c !== void 0 ? _c : selectedItem.minimumOrderQuantity) !== null && _d !== void 0 ? _d : 0;
            var purchaseQuantity = conversionFactor > 0
                ? Math.ceil(inventoryQuantity / conversionFactor)
                : inventoryQuantity;
            var newOrder = {
                quantity: purchaseQuantity,
                dueDate: (0, date_1.today)((0, date_1.getLocalTimeZone)())
                    .add({ days: (_e = selectedItem.leadTime) !== null && _e !== void 0 ? _e : 0 })
                    .toString(),
                startDate: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                supplierId: selectedItem.preferredSupplierId,
                itemReadableId: selectedItem.readableIdWithRevision,
                description: selectedItem.name,
                periodId: periods[0].id
            };
            setOrders(selectedItem, __spreadArray(__spreadArray([], orders, true), [newOrder], false));
        }
    }, [selectedItem, orders, setOrders, periods, selectedSupplier]);
    var onRemoveOrder = (0, react_2.useCallback)(function (index) {
        if (selectedItem.id) {
            var newOrders = orders.filter(function (_, i) { return i !== index; });
            setOrders(selectedItem, newOrders);
        }
    }, [selectedItem, orders, setOrders]);
    var onSubmit = (0, react_2.useCallback)(function (id, orders) {
        // Skip existing PO lines that are past the Planned stage — their
        // quantity/due-date inputs are disabled in the UI, so the user can't
        // have edited them, and we don't want the action to issue UPDATEs
        // against already-shipped lines.
        var editableOrders = orders.filter(function (order) {
            return !order.existingLineId ||
                order.existingStatus === "Draft" ||
                order.existingStatus === "Planned";
        });
        var ordersWithPeriods = editableOrders.map(function (order) {
            var _a;
            if (!order.dueDate ||
                (0, date_1.parseDate)(order.dueDate) < (0, date_1.parseDate)(periods[0].startDate)) {
                return __assign(__assign({}, order), { periodId: periods[0].id });
            }
            var period = periods.find(function (p) {
                var dueDate = (0, date_1.parseDate)(order.dueDate);
                var startDate = (0, date_1.parseDate)(p.startDate);
                var endDate = (0, date_1.parseDate)(p.endDate);
                return dueDate >= startDate && dueDate <= endDate;
            });
            return __assign(__assign({}, order), { periodId: (_a = period === null || period === void 0 ? void 0 : period.id) !== null && _a !== void 0 ? _a : periods[periods.length - 1].id });
        });
        var payload = {
            locationId: locationId,
            items: [
                {
                    id: id,
                    orders: ordersWithPeriods
                }
            ],
            action: "order"
        };
        fetcher.submit(payload, {
            method: "post",
            action: path_1.path.to.bulkUpdatePurchasingPlanning,
            encType: "application/json"
        });
    }, [fetcher, locationId, periods]);
    var onOrderUpdate = (0, react_2.useCallback)(function (index, updates) {
        if (selectedItem.id) {
            var newOrders = __spreadArray([], orders, true);
            newOrders[index] = __assign(__assign({}, orders[index]), updates);
            setOrders(selectedItem, newOrders);
        }
    }, [selectedItem, orders, setOrders]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d, _e;
        if (fetcher.state !== "idle" || !fetcher.data) {
            return;
        }
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === false && ((_b = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _b === void 0 ? void 0 : _b.message)) {
            react_1.toast.error(fetcher.data.message);
        }
        if (((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success) === true) {
            var purchaseOrders = (_e = (_d = fetcher.data) === null || _d === void 0 ? void 0 : _d.purchaseOrders) !== null && _e !== void 0 ? _e : [];
            if (purchaseOrders.length === 0) {
                react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Orders submitted"], ["Orders submitted"]))));
            }
            else {
                react_1.toast.success(<div className="flex gap-1">
              <span>{t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Orders submitted"], ["Orders submitted"])))}</span>
              <span className="flex flex-wrap gap-2 text-xs">
                {purchaseOrders.map(function (po) { return (<react_router_1.Link key={po.id} to={path_1.path.to.purchaseOrder(po.id)} className="underline underline-offset-2 hover:opacity-80">
                    {po.readableId}
                  </react_router_1.Link>); })}
              </span>
            </div>, { duration: 8000 });
            }
            setOrders(selectedItem, []);
            onClose();
        }
    }, [fetcher.state, fetcher.data]);
    var supplierDisclosure = (0, react_1.useDisclosure)();
    return (<react_1.Drawer open={isOpen} onOpenChange={function (open) { return !open && onClose(); }}>
        <react_1.Tabs value={activeTab} onValueChange={setActiveTab}>
          <react_1.DrawerContent size="lg">
            <react_1.DrawerHeader className="relative">
              <react_1.DrawerTitle className="flex items-center gap-2">
                <span>{selectedItem.readableIdWithRevision}</span>
                <react_router_1.Link to={(0, ItemForm_1.getLinkToItemPlanning)(selectedItem.type, selectedItem.id)}>
                  <lu_1.LuExternalLink />
                </react_router_1.Link>
              </react_1.DrawerTitle>
              <react_1.DrawerDescription>{selectedItem.name}</react_1.DrawerDescription>
              <div className="absolute top-4 right-12">
                <react_1.TabsList>
                  <react_1.TabsTrigger value="ordering">
                    <macro_1.Trans>Ordering</macro_1.Trans>
                  </react_1.TabsTrigger>
                  <react_1.TabsTrigger value="suppliers">
                    <macro_1.Trans>Suppliers</macro_1.Trans>
                  </react_1.TabsTrigger>
                </react_1.TabsList>
              </div>
            </react_1.DrawerHeader>
            <react_1.DrawerBody>
              <div className="flex flex-col gap-4  w-full">
                <react_1.TabsContent value="suppliers" className="flex flex-col gap-4">
                  <react_1.Table>
                    <react_1.Thead>
                      <react_1.Tr>
                        <react_1.Th>
                          <macro_1.Trans>Supplier</macro_1.Trans>
                        </react_1.Th>
                        <react_1.Th>
                          <macro_1.Trans>Unit</macro_1.Trans>
                        </react_1.Th>
                        <react_1.Th>
                          <macro_1.Trans>Conversion</macro_1.Trans>
                        </react_1.Th>
                        <react_1.Th>
                          <macro_1.Trans>Unit Price</macro_1.Trans>
                        </react_1.Th>
                        <react_1.Th />
                      </react_1.Tr>
                    </react_1.Thead>
                    <react_1.Tbody>
                      {(_b = selectedItem.suppliers) === null || _b === void 0 ? void 0 : _b.map(function (part) {
            var _a, _b;
            return (<react_1.Tr key={part.id}>
                            <react_1.Td>
                              <components_1.SupplierAvatar supplierId={part.supplierId}/>
                            </react_1.Td>
                            <react_1.Td>
                              {(_a = unitOfMeasureOptions.find(function (uom) {
                    return uom.value === part.supplierUnitOfMeasureCode;
                })) === null || _a === void 0 ? void 0 : _a.label}
                            </react_1.Td>
                            <react_1.Td>{part.conversionFactor}</react_1.Td>
                            <react_1.Td>{formatter.format((_b = part.unitPrice) !== null && _b !== void 0 ? _b : 0)}</react_1.Td>
                            <react_1.Td className="text-end">
                              <react_1.Button variant="secondary" isDisabled={selectedSupplier === part.supplierId} leftIcon={<lu_1.LuCircleCheck />} onClick={function () {
                    if (selectedItem.id) {
                        onSupplierChange(selectedItem.id, part.supplierId);
                        var updatedOrders = orders.map(function (order) { return (__assign(__assign({}, order), { supplierId: part.supplierId })); });
                        setOrders(selectedItem, updatedOrders);
                        react_1.toast.success(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Supplier updated"], ["Supplier updated"]))));
                        setActiveTab("ordering");
                    }
                }}>
                                <macro_1.Trans>Select</macro_1.Trans>
                              </react_1.Button>
                            </react_1.Td>
                          </react_1.Tr>);
        })}
                    </react_1.Tbody>
                  </react_1.Table>
                  <div>
                    <react_1.Button variant="secondary" leftIcon={<lu_1.LuCirclePlus />} onClick={supplierDisclosure.onOpen}>
                      <macro_1.Trans>Add Supplier</macro_1.Trans>
                    </react_1.Button>
                    {supplierDisclosure.isOpen && (<Item_1.SupplierPartForm type="Part" initialValues={{
                itemId: selectedItem.id,
                supplierId: "",
                supplierPartId: "",
                unitPrice: 0,
                supplierUnitOfMeasureCode: "EA",
                minimumOrderQuantity: 1,
                orderMultiple: 1,
                conversionFactor: 1
            }} unitOfMeasureCode={(_c = selectedItem.unitOfMeasureCode) !== null && _c !== void 0 ? _c : ""} onClose={function () {
                if (carbon && selectedItem.id) {
                    carbon === null || carbon === void 0 ? void 0 : carbon.from("supplierPart").select("*").eq("itemId", selectedItem.id).then(function (_a) {
                        var data = _a.data;
                        if (data) {
                            setSelectedItem(
                            // @ts-expect-error
                            function (prev) {
                                return __assign(__assign({}, prev), { suppliers: data });
                            });
                            // Auto-select the newly added supplier if it's the only one
                            if (data.length === 1 && selectedItem.id) {
                                onSupplierChange(selectedItem.id, data[0].supplierId);
                                var updatedOrders = orders.map(function (order) { return (__assign(__assign({}, order), { supplierId: data[0].supplierId })); });
                                setOrders(selectedItem, updatedOrders);
                                react_1.toast.success(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Supplier added and selected"], ["Supplier added and selected"]))));
                                setActiveTab("ordering");
                            }
                        }
                    });
                }
                supplierDisclosure.onClose();
            }}/>)}
                  </div>
                </react_1.TabsContent>
                <react_1.TabsContent value="ordering" className="flex flex-col gap-4">
                  <react_1.VStack spacing={2} className="text-sm border rounded-lg p-4">
                    <react_1.HStack className="justify-between w-full">
                      <span className="text-muted-foreground">
                        <macro_1.Trans>Reorder Policy:</macro_1.Trans>
                      </span>
                      <ItemReorderPolicy_1.ItemReorderPolicy reorderingPolicy={selectedItem.reorderingPolicy}/>
                    </react_1.HStack>
                    <react_1.Separator />
                    <react_1.HStack className="justify-between w-full">
                      <span className="text-muted-foreground">
                        <macro_1.Trans>Supplier:</macro_1.Trans>
                      </span>
                      <components_1.SupplierAvatar supplierId={selectedSupplier}/>
                    </react_1.HStack>
                    <react_1.Separator />
                    <react_1.HStack className="justify-between w-full">
                      <span className="text-muted-foreground">
                        <macro_1.Trans>Purchase Unit:</macro_1.Trans>
                      </span>
                      <span>
                        {(_f = (_e = (_d = unitOfMeasureOptions.find(function (uom) {
            var _a, _b;
            return uom.value ===
                ((_b = (_a = selectedItem.suppliers) === null || _a === void 0 ? void 0 : _a.find(function (s) { return s.supplierId === selectedSupplier; })) === null || _b === void 0 ? void 0 : _b.supplierUnitOfMeasureCode);
        })) === null || _d === void 0 ? void 0 : _d.label) !== null && _e !== void 0 ? _e : selectedItem.unitOfMeasureCode) !== null && _f !== void 0 ? _f : "EA"}
                      </span>
                    </react_1.HStack>
                    {(function () {
            var _a, _b;
            var supplier = (_a = selectedItem.suppliers) === null || _a === void 0 ? void 0 : _a.find(function (s) { return s.supplierId === selectedSupplier; });
            var conversionFactor = (_b = supplier === null || supplier === void 0 ? void 0 : supplier.conversionFactor) !== null && _b !== void 0 ? _b : 1;
            return conversionFactor !== 1 ? (<react_1.HStack className="justify-between w-full">
                          <span className="text-muted-foreground">
                            <macro_1.Trans>Conversion:</macro_1.Trans>
                          </span>
                          <span>1 Purchase = {conversionFactor} Inventory</span>
                        </react_1.HStack>) : null;
        })()}
                    <react_1.Separator />
                    {selectedItem.reorderingPolicy === "Maximum Quantity" && (<>
                        <react_1.HStack className="justify-between w-full">
                          <span className="text-muted-foreground">
                            <macro_1.Trans>Reorder Point:</macro_1.Trans>
                          </span>
                          <span>{selectedItem.reorderPoint}</span>
                        </react_1.HStack>
                        <react_1.HStack className="justify-between w-full">
                          <span className="text-muted-foreground">
                            <macro_1.Trans>Maximum Inventory:</macro_1.Trans>
                          </span>
                          <span>{selectedItem.maximumInventoryQuantity}</span>
                        </react_1.HStack>
                      </>)}

                    {selectedItem.reorderingPolicy ===
            "Demand-Based Reorder" && (<>
                        <react_1.HStack className="justify-between w-full">
                          <span className="text-muted-foreground">
                            <macro_1.Trans>Accumulation Period:</macro_1.Trans>
                          </span>
                          <span>
                            {selectedItem.demandAccumulationPeriod} weeks
                          </span>
                        </react_1.HStack>
                        <react_1.HStack className="justify-between w-full">
                          <span className="text-muted-foreground">
                            <macro_1.Trans>Safety Stock:</macro_1.Trans>
                          </span>
                          <span>
                            {selectedItem.demandAccumulationSafetyStock}
                          </span>
                        </react_1.HStack>
                      </>)}

                    {selectedItem.reorderingPolicy ===
            "Fixed Reorder Quantity" && (<>
                        <react_1.HStack className="justify-between w-full">
                          <span className="text-muted-foreground">
                            <macro_1.Trans>Reorder Point:</macro_1.Trans>
                          </span>
                          <span>{selectedItem.reorderPoint}</span>
                        </react_1.HStack>
                        <react_1.HStack className="justify-between w-full">
                          <span className="text-muted-foreground">
                            <macro_1.Trans>Reorder Quantity:</macro_1.Trans>
                          </span>
                          <span>{selectedItem.reorderQuantity}</span>
                        </react_1.HStack>
                      </>)}
                    {(selectedItem.lotSize > 0 ||
            selectedItem.minimumOrderQuantity > 0 ||
            selectedItem.maximumOrderQuantity > 0) && <react_1.Separator />}
                    {selectedItem.lotSize > 0 && (<react_1.HStack className="justify-between w-full">
                        <span className="text-muted-foreground">
                          <macro_1.Trans>Lot Size:</macro_1.Trans>
                        </span>
                        <span>{selectedItem.lotSize}</span>
                      </react_1.HStack>)}
                    {selectedItem.minimumOrderQuantity > 0 && (<react_1.HStack className="justify-between w-full">
                        <span className="text-muted-foreground">
                          <macro_1.Trans>Minimum Order:</macro_1.Trans>
                        </span>
                        <span>{selectedItem.minimumOrderQuantity}</span>
                      </react_1.HStack>)}
                    {selectedItem.maximumOrderQuantity > 0 && (<react_1.HStack className="justify-between w-full">
                        <span className="text-muted-foreground">
                          <macro_1.Trans>Maximum Order:</macro_1.Trans>
                        </span>
                        <span>{selectedItem.maximumOrderQuantity}</span>
                      </react_1.HStack>)}
                  </react_1.VStack>

                  <react_1.Table full>
                    <react_1.Thead>
                      <react_1.Tr>
                        <react_1.Th>
                          <div className="flex items-center gap-2">
                            <lu_1.LuCirclePlay />
                            <span>
                              <macro_1.Trans>PO</macro_1.Trans>
                            </span>
                          </div>
                        </react_1.Th>
                        <react_1.Th>
                          <div className="flex items-center gap-2 text-left">
                            <lu_1.LuStar />
                            <span>
                              <macro_1.Trans>Status</macro_1.Trans>
                            </span>
                          </div>
                        </react_1.Th>
                        <react_1.Th>
                          <div className="flex items-center gap-2 text-right">
                            <lu_1.LuPackage />
                            <span>
                              <macro_1.Trans>Purchase Qty</macro_1.Trans>
                            </span>
                          </div>
                        </react_1.Th>
                        <react_1.Th>
                          <div className="flex items-center gap-2">
                            <lu_1.LuCalendar />
                            <span>
                              <macro_1.Trans>Due Date</macro_1.Trans>
                            </span>
                          </div>
                        </react_1.Th>
                        <react_1.Th className="w-[50px]"></react_1.Th>
                      </react_1.Tr>
                    </react_1.Thead>
                    <react_1.Tbody>
                      {orders.map(function (order, index) {
            // Lock the row when (a) the selected supplier differs
            // from the order's supplier, or (b) the existing PO
            // line is past the Planned stage (already shipped /
            // being received / being invoiced). Once committed
            // to the supplier, mutating quantity or due date
            // would desync the receiving workflow.
            var isPostPlannedExisting = !!order.existingLineId &&
                order.existingStatus !== "Draft" &&
                order.existingStatus !== "Planned";
            var isDisabled = (selectedSupplier !== order.supplierId &&
                !!order.existingId) ||
                isPostPlannedExisting;
            return (<react_1.Tr key={index}>
                            <react_1.Td className="group-hover:bg-inherit justify-between">
                              {order.existingReadableId && order.existingId ? (<react_router_1.Link to={path_1.path.to.purchaseOrder(order.existingId)}>
                                  {order.existingReadableId}
                                </react_router_1.Link>) : (t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["New PO"], ["New PO"]))))}
                            </react_1.Td>
                            <react_1.Td className="flex flex-row items-center gap-1 group-hover:bg-inherit">
                              {/* @ts-expect-error - status is a string because we have a general type for purchase orders and purchaseOrderLines */}
                              <PurchaseOrder_1.PurchasingStatus status={order.existingStatus}/>
                            </react_1.Td>
                            <react_1.Td className="text-right group-hover:bg-inherit">
                              <react_1.NumberField value={isDisabled
                    ? order.existingQuantity
                    : order.quantity} isDisabled={isDisabled} onChange={function (value) {
                    if (value) {
                        onOrderUpdate(index, {
                            quantity: value
                        });
                    }
                }}>
                                <react_1.NumberInputGroup className="relative group-hover:bg-inherit">
                                  <react_1.NumberInput />
                                  <react_1.NumberInputStepper>
                                    <react_1.NumberIncrementStepper>
                                      <lu_1.LuChevronUp size="1em" strokeWidth="3"/>
                                    </react_1.NumberIncrementStepper>
                                    <react_1.NumberDecrementStepper>
                                      <lu_1.LuChevronDown size="1em" strokeWidth="3"/>
                                    </react_1.NumberDecrementStepper>
                                  </react_1.NumberInputStepper>
                                </react_1.NumberInputGroup>
                              </react_1.NumberField>
                            </react_1.Td>
                            <react_1.Td className="text-right group-hover:bg-inherit">
                              <react_1.HStack className="justify-end">
                                <react_1.DatePicker value={order.dueDate
                    ? (0, date_1.parseDate)(order.dueDate)
                    : null} isDisabled={isDisabled} onChange={function (date) {
                    onOrderUpdate(index, {
                        dueDate: date ? date.toString() : null
                    });
                }}/>
                              </react_1.HStack>
                            </react_1.Td>
                            <react_1.Td className="group-hover:bg-inherit">
                              <react_1.IconButton aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Remove order"], ["Remove order"])))} variant="ghost" size="sm" isDisabled={!!order.existingId} onClick={function () { return onRemoveOrder(index); }} icon={<lu_1.LuTrash2 className="text-destructive"/>}/>
                            </react_1.Td>
                          </react_1.Tr>);
        })}
                    </react_1.Tbody>
                  </react_1.Table>

                  <div>
                    <react_1.Button variant="secondary" size="sm" className="mt-4" leftIcon={<lu_1.LuPlus />} onClick={onAddOrder}>
                      Add Order
                    </react_1.Button>
                  </div>

                  <ItemPlanningChart_1.ItemPlanningChart compact itemId={selectedItem.id} locationId={locationId} safetyStock={selectedItem.demandAccumulationSafetyStock} plannedOrders={orders} conversionFactor={(_j = (_h = (_g = selectedItem.suppliers) === null || _g === void 0 ? void 0 : _g.find(function (s) { return s.supplierId === selectedSupplier; })) === null || _h === void 0 ? void 0 : _h.conversionFactor) !== null && _j !== void 0 ? _j : 1}/>
                </react_1.TabsContent>
              </div>
            </react_1.DrawerBody>
            <react_1.DrawerFooter>
              <react_1.Button variant="secondary" onClick={onClose}>
                <macro_1.Trans>Close</macro_1.Trans>
              </react_1.Button>
              <react_1.Button variant="primary" onClick={function () {
            if (!selectedSupplier) {
                react_1.toast.error(t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Cannot place order - no supplier associated with this item"], ["Cannot place order - no supplier associated with this item"]))));
                return;
            }
            onSubmit(selectedItem.id, orders);
        }} disabled={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                <macro_1.Trans>Order</macro_1.Trans>
              </react_1.Button>
            </react_1.DrawerFooter>
          </react_1.DrawerContent>
        </react_1.Tabs>
      </react_1.Drawer>);
});
exports.PurchasingPlanningOrderDrawer.displayName = "PurchasingPlanningOrderDrawer";
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
