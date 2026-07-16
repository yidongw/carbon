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
exports.ProductionPlanningOrderDrawer = void 0;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var ItemForm_1 = require("~/modules/items/ui/Item/ItemForm");
var ItemPlanningChart_1 = require("~/modules/items/ui/Item/ItemPlanningChart");
var ItemReorderPolicy_1 = require("~/modules/items/ui/Item/ItemReorderPolicy");
var path_1 = require("~/utils/path");
var Jobs_1 = require("../Jobs");
exports.ProductionPlanningOrderDrawer = (0, react_2.memo)(function (_a) {
    var _b;
    var row = _a.row, orders = _a.orders, setOrders = _a.setOrders, locationId = _a.locationId, periods = _a.periods, isOpen = _a.isOpen, onClose = _a.onClose;
    var fetcher = (0, react_router_1.useFetcher)();
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    // Memoize getExistingOrders callback
    var getExistingOrders = (0, react_2.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var existingOrderData, existingOrders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon || !row.id)
                        return [2 /*return*/];
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("job").select("*").eq("itemId", row.id).is("salesOrderId", null).is("salesOrderLineId", null).in("status", ["Draft", "Planned"]))];
                case 1:
                    existingOrderData = (_a.sent()).data;
                    if (existingOrderData) {
                        existingOrders = existingOrderData
                            .filter(function (order) {
                            return !orders.some(function (existing) { return existing.existingId === order.id; });
                        })
                            .map(function (order) {
                            var _a, _b, _c, _d, _e;
                            // If no due date or due date is before first period, use first period
                            if (!order.dueDate ||
                                (0, date_1.parseDate)(order.dueDate) < (0, date_1.parseDate)(periods[0].startDate)) {
                                return {
                                    existingId: order.id,
                                    existingReadableId: order.jobId,
                                    existingQuantity: order.status === "Draft" ? 0 : order.quantity,
                                    existingStatus: order.status,
                                    startDate: (_a = order.startDate) !== null && _a !== void 0 ? _a : null,
                                    dueDate: (_b = order.dueDate) !== null && _b !== void 0 ? _b : null,
                                    quantity: order.quantity,
                                    isASAP: order.deadlineType === "ASAP",
                                    periodId: periods[0].id
                                };
                            }
                            // Find matching period based on due date
                            var period = periods.find(function (p) {
                                var dueDate = (0, date_1.parseDate)(order.dueDate);
                                var startDate = (0, date_1.parseDate)(p.startDate);
                                var endDate = (0, date_1.parseDate)(p.endDate);
                                return dueDate >= startDate && dueDate <= endDate;
                            });
                            // If no matching period found (date is after last period), use last period
                            return {
                                existingId: order.id,
                                existingReadableId: order.jobId,
                                existingQuantity: order.status === "Draft" ? 0 : order.quantity,
                                existingStatus: order.status,
                                startDate: (_c = order.startDate) !== null && _c !== void 0 ? _c : null,
                                dueDate: (_d = order.dueDate) !== null && _d !== void 0 ? _d : null,
                                quantity: order.quantity,
                                isASAP: order.deadlineType === "ASAP",
                                periodId: (_e = period === null || period === void 0 ? void 0 : period.id) !== null && _e !== void 0 ? _e : periods[periods.length - 1].id
                            };
                        });
                        setOrders(row, __spreadArray(__spreadArray([], orders, true), existingOrders, true).sort(function (a, b) {
                            var _a, _b, _c;
                            return (_c = (_a = a.dueDate) === null || _a === void 0 ? void 0 : _a.localeCompare((_b = b.dueDate) !== null && _b !== void 0 ? _b : "")) !== null && _c !== void 0 ? _c : 0;
                        }));
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, orders, row, setOrders, periods]);
    (0, react_1.useMount)(function () {
        if (row.id) {
            getExistingOrders();
        }
    });
    // Memoize handlers
    var onAddOrder = (0, react_2.useCallback)(function () {
        var _a, _b, _c;
        if (row.id) {
            var newOrder = {
                quantity: (_b = (_a = row.lotSize) !== null && _a !== void 0 ? _a : row.minimumOrderQuantity) !== null && _b !== void 0 ? _b : 0,
                dueDate: (0, date_1.today)((0, date_1.getLocalTimeZone)())
                    .add({ days: (_c = row.leadTime) !== null && _c !== void 0 ? _c : 0 })
                    .toString(),
                startDate: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                isASAP: false,
                periodId: periods[0].id
            };
            setOrders(row, __spreadArray(__spreadArray([], orders, true), [newOrder], false));
        }
    }, [row, orders, setOrders, periods]);
    var onRemoveOrder = (0, react_2.useCallback)(function (index) {
        if (row.id) {
            var newOrders = orders.filter(function (_, i) { return i !== index; });
            setOrders(row, newOrders);
        }
    }, [row, orders, setOrders]);
    var onSubmit = (0, react_2.useCallback)(function (id, orders) {
        var ordersWithPeriods = orders.map(function (order) {
            var _a;
            // If no due date or due date is before first period, use first period
            if (!order.dueDate ||
                (0, date_1.parseDate)(order.dueDate) < (0, date_1.parseDate)(periods[0].startDate)) {
                return __assign(__assign({}, order), { periodId: periods[0].id });
            }
            // Find matching period based on due date
            var period = periods.find(function (p) {
                var dueDate = (0, date_1.parseDate)(order.dueDate);
                var startDate = (0, date_1.parseDate)(p.startDate);
                var endDate = (0, date_1.parseDate)(p.endDate);
                return dueDate >= startDate && dueDate <= endDate;
            });
            // If no matching period found (date is after last period), use last period
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
            action: path_1.path.to.bulkUpdateProductionPlanning,
            encType: "application/json"
        });
    }, [fetcher, locationId, periods]);
    // Memoize order update handler
    var handleOrderUpdate = (0, react_2.useCallback)(function (index, updates) {
        if (row.id) {
            var newOrders = __spreadArray([], orders, true);
            newOrders[index] = __assign(__assign({}, orders[index]), updates);
            setOrders(row, newOrders);
        }
    }, [row, orders, setOrders]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a, _b, _c;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === false && ((_b = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _b === void 0 ? void 0 : _b.message)) {
            react_1.toast.error(fetcher.data.message);
        }
        if (((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success) === true) {
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Orders submitted"], ["Orders submitted"]))));
            setOrders(row, []);
            onClose();
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success]);
    // Memoize drawer content
    var drawerContent = (0, react_2.useMemo)(function () { return (<react_1.DrawerContent size="lg">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle className="flex items-center gap-2">
              <span>{row.readableIdWithRevision}</span>
              <react_router_1.Link 
    // @ts-ignore
    to={(0, ItemForm_1.getLinkToItemPlanning)(row.type, row.id)}>
                <lu_1.LuExternalLink />
              </react_router_1.Link>
            </react_1.DrawerTitle>
            <react_1.DrawerDescription>{row.name}</react_1.DrawerDescription>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <div className="flex flex-col gap-4  w-full">
              <react_1.VStack spacing={2} className="text-sm border rounded-lg p-4">
                <react_1.HStack className="justify-between w-full">
                  <span className="text-muted-foreground">
                    <macro_1.Trans>Reorder Policy:</macro_1.Trans>
                  </span>
                  <ItemReorderPolicy_1.ItemReorderPolicy reorderingPolicy={row.reorderingPolicy}/>
                </react_1.HStack>
                <react_1.Separator />
                {row.reorderingPolicy === "Maximum Quantity" && (<>
                    <react_1.HStack className="justify-between w-full">
                      <span className="text-muted-foreground">
                        Reorder Point:
                      </span>
                      <span>{row.reorderPoint}</span>
                    </react_1.HStack>
                    <react_1.HStack className="justify-between w-full">
                      <span className="text-muted-foreground">
                        Maximum Inventory:
                      </span>
                      <span>{row.maximumInventoryQuantity}</span>
                    </react_1.HStack>
                  </>)}

                {row.reorderingPolicy === "Demand-Based Reorder" && (<>
                    <react_1.HStack className="justify-between w-full">
                      <span className="text-muted-foreground">
                        Accumulation Period:
                      </span>
                      <span>{row.demandAccumulationPeriod} weeks</span>
                    </react_1.HStack>
                    <react_1.HStack className="justify-between w-full">
                      <span className="text-muted-foreground">
                        Safety Stock:
                      </span>
                      <span>{row.demandAccumulationSafetyStock}</span>
                    </react_1.HStack>
                  </>)}

                {row.reorderingPolicy === "Fixed Reorder Quantity" && (<>
                    <react_1.HStack className="justify-between w-full">
                      <span className="text-muted-foreground">
                        Reorder Point:
                      </span>
                      <span>{row.reorderPoint}</span>
                    </react_1.HStack>
                    <react_1.HStack className="justify-between w-full">
                      <span className="text-muted-foreground">
                        Reorder Quantity:
                      </span>
                      <span>{row.reorderQuantity}</span>
                    </react_1.HStack>
                  </>)}
                {(row.lotSize > 0 ||
            row.minimumOrderQuantity > 0 ||
            row.maximumOrderQuantity > 0) && <react_1.Separator />}
                {row.lotSize > 0 && (<react_1.HStack className="justify-between w-full">
                    <span className="text-muted-foreground">
                      <macro_1.Trans>Lot Size:</macro_1.Trans>
                    </span>
                    <span>{row.lotSize}</span>
                  </react_1.HStack>)}
                {row.minimumOrderQuantity > 0 && (<react_1.HStack className="justify-between w-full">
                    <span className="text-muted-foreground">
                      Minimum Order:
                    </span>
                    <span>{row.minimumOrderQuantity}</span>
                  </react_1.HStack>)}
                {row.maximumOrderQuantity > 0 && (<react_1.HStack className="justify-between w-full">
                    <span className="text-muted-foreground">
                      Maximum Order:
                    </span>
                    <span>{row.maximumOrderQuantity}</span>
                  </react_1.HStack>)}
              </react_1.VStack>

              <react_1.Table full>
                <react_1.Thead>
                  <react_1.Th>
                    <div className="flex items-center gap-2">
                      <lu_1.LuCirclePlay />
                      <span>
                        <macro_1.Trans>Job</macro_1.Trans>
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
                        <macro_1.Trans>Quantity</macro_1.Trans>
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
                </react_1.Thead>
                <react_1.Tbody>
                  {orders.map(function (order, index) { return (<react_1.Tr key={index}>
                      <react_1.Td className="group-hover:bg-inherit justify-between">
                        {order.existingReadableId && order.existingId ? (<react_router_1.Link to={path_1.path.to.job(order.existingId)}>
                            {order.existingReadableId}
                          </react_router_1.Link>) : ("New Job")}
                      </react_1.Td>
                      <react_1.Td className="flex flex-row items-center gap-1 group-hover:bg-inherit">
                        <Jobs_1.JobStatus status={order.existingStatus}/>
                      </react_1.Td>
                      <react_1.Td className="text-right group-hover:bg-inherit">
                        <react_1.NumberField value={order.quantity} onBlur={function (e) {
                var _a;
                var datePickerInput = (_a = e.target
                    .closest("tr")) === null || _a === void 0 ? void 0 : _a.querySelector('[role="textbox"]');
                if (datePickerInput) {
                    datePickerInput.focus();
                }
            }} onChange={function (value) {
                if (value) {
                    handleOrderUpdate(index, { quantity: value });
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
                          <react_1.DatePicker value={order.dueDate ? (0, date_1.parseDate)(order.dueDate) : null} onChange={function (date) {
                handleOrderUpdate(index, {
                    dueDate: date ? date.toString() : null
                });
            }}/>
                        </react_1.HStack>
                      </react_1.Td>
                      <react_1.Td className="group-hover:bg-inherit">
                        <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Remove order"], ["Remove order"])))} variant="ghost" size="sm" isDisabled={!!order.existingId} onClick={function () { return onRemoveOrder(index); }} icon={<lu_1.LuTrash2 className="text-destructive"/>}/>
                      </react_1.Td>
                    </react_1.Tr>); })}
                </react_1.Tbody>
              </react_1.Table>

              <div>
                <react_1.Button variant="secondary" size="sm" className="mt-4" leftIcon={<lu_1.LuPlus />} onClick={onAddOrder}>
                  Add Order
                </react_1.Button>
              </div>

              <ItemPlanningChart_1.ItemPlanningChart compact itemId={row.id} locationId={locationId} safetyStock={row.demandAccumulationSafetyStock} plannedOrders={orders}/>
            </div>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              Close
            </react_1.Button>
            <react_1.Button variant="primary" onClick={function () { return onSubmit(row.id, orders); }} disabled={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
              Make
            </react_1.Button>
          </react_1.DrawerFooter>
        </react_1.DrawerContent>); }, [
        row,
        orders,
        locationId,
        fetcher.state,
        onClose,
        onAddOrder,
        onRemoveOrder,
        onSubmit,
        handleOrderUpdate,
        t
    ]);
    return (<react_1.Drawer open={isOpen} onOpenChange={function (open) { return !open && onClose(); }}>
        {drawerContent}
      </react_1.Drawer>);
});
exports.ProductionPlanningOrderDrawer.displayName = "ProductionPlanningOrderDrawer";
var templateObject_1, templateObject_2;
