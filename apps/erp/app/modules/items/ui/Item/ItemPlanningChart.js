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
exports.ItemPlanningChart = void 0;
var react_1 = require("@carbon/react");
var Chart_1 = require("@carbon/react/Chart");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var recharts_1 = require("recharts");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var DemandForecastSourcesPopover_1 = require("./DemandForecastSourcesPopover");
var PlannedOrderDetailsPopover_1 = require("./PlannedOrderDetailsPopover");
var supplySourceTypes = ["Purchase Order", "Production Order"];
var demandSourceTypes = ["Sales Order", "Job Material"];
var chartConfig = {};
var ItemPlanningChart = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var _u = _a.compact, compact = _u === void 0 ? false : _u, itemId = _a.itemId, locationId = _a.locationId, _v = _a.plannedOrders, plannedOrders = _v === void 0 ? [] : _v, safetyStock = _a.safetyStock, _w = _a.conversionFactor, conversionFactor = _w === void 0 ? 1 : _w;
    var t = (0, macro_1.useLingui)().t;
    var forecastFetcher = (0, react_router_1.useFetcher)();
    var isFetching = forecastFetcher.state !== "idle" || !forecastFetcher.data;
    var _x = (0, react_2.useState)(""), searchTerm = _x[0], setSearchTerm = _x[1];
    var dateFormatter = (0, i18n_1.useDateFormatter)({
        month: "short",
        day: "numeric"
    });
    var numberFormatter = (0, i18n_1.useNumberFormatter)();
    (0, react_1.useMount)(function () {
        forecastFetcher.load(path_1.path.to.api.itemForecast(itemId, locationId));
    });
    var chartData = (0, react_2.useMemo)(function () {
        var _a, _b, _c, _d;
        if (!((_a = forecastFetcher.data) === null || _a === void 0 ? void 0 : _a.demand) ||
            !((_b = forecastFetcher.data) === null || _b === void 0 ? void 0 : _b.periods) ||
            forecastFetcher.data.periods.length === 0)
            return [];
        var periods = forecastFetcher.data.periods;
        var demand = forecastFetcher.data.demand;
        var demandForecast = (_c = forecastFetcher.data.demandForecast) !== null && _c !== void 0 ? _c : [];
        var supply = forecastFetcher.data.supply;
        var currentQuantity = (_d = forecastFetcher.data.quantityOnHand) !== null && _d !== void 0 ? _d : 0;
        // Initialize all periods with zero values
        var groupedData = periods.reduce(function (acc, period) {
            acc[period.id] = {
                period: period.id,
                startDate: period.startDate,
                "Sales Order": 0,
                "Job Material": 0,
                "Purchase Order": 0,
                "Production Order": 0,
                Planned: 0,
                Projection: currentQuantity, // Initialize with current quantity
                "Demand Forecast": 0
            };
            return acc;
        }, {});
        // Add projected orders
        plannedOrders.forEach(function (order) {
            var _a, _b, _c;
            var periodId = (_a = periods.find(function (p) {
                var _a, _b;
                return new Date(p.startDate) <= new Date((_a = order.dueDate) !== null && _a !== void 0 ? _a : "") &&
                    new Date(p.endDate) >= new Date((_b = order.dueDate) !== null && _b !== void 0 ? _b : "");
            })) === null || _a === void 0 ? void 0 : _a.id;
            // If no period found or order date is before first period, use first period
            if (!periodId || !order.dueDate) {
                if (periods.length === 0)
                    return;
                periodId = periods[0].id;
            }
            if (groupedData[periodId]) {
                // Convert purchase quantity to inventory quantity for display
                // Inventory Quantity = Purchase Quantity × Conversion Factor
                var purchaseQuantityDelta = ((_b = order.quantity) !== null && _b !== void 0 ? _b : 0) - ((_c = order.existingQuantity) !== null && _c !== void 0 ? _c : 0);
                var inventoryQuantityDelta = purchaseQuantityDelta * conversionFactor;
                // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                groupedData[periodId]["Planned"] += inventoryQuantityDelta;
            }
        });
        // Add demand data
        demand.forEach(function (curr) {
            var _a;
            if (groupedData[curr.periodId] &&
                curr.sourceType &&
                curr.actualQuantity) {
                var sourceType = curr.sourceType;
                if (sourceType === "Sales Order" || sourceType === "Job Material") {
                    groupedData[curr.periodId][sourceType] = -((_a = curr.actualQuantity) !== null && _a !== void 0 ? _a : 0);
                }
            }
        });
        // Add supply data
        supply.forEach(function (curr) {
            var _a;
            if (groupedData[curr.periodId] &&
                curr.sourceType &&
                curr.actualQuantity) {
                var sourceType = curr.sourceType;
                if (sourceType === "Purchase Order" ||
                    sourceType === "Production Order") {
                    groupedData[curr.periodId][sourceType] = (_a = curr.actualQuantity) !== null && _a !== void 0 ? _a : 0;
                }
            }
        });
        // Add demand forecast data
        demandForecast.forEach(function (forecast) {
            var _a;
            if (groupedData[forecast.periodId] && forecast.forecastQuantity) {
                groupedData[forecast.periodId]["Demand Forecast"] = -((_a = forecast.forecastQuantity) !== null && _a !== void 0 ? _a : 0);
            }
        });
        // Calculate running projection
        var runningProjection = currentQuantity;
        var sortedData = Object.values(groupedData).sort(function (a, b) {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });
        return sortedData.map(function (period) {
            // Add supply
            runningProjection +=
                period["Purchase Order"] +
                    period["Production Order"] +
                    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                    period["Planned"];
            // Subtract demand (all values are already negative)
            runningProjection +=
                period["Sales Order"] +
                    period["Job Material"] +
                    period["Demand Forecast"];
            // Update projection
            period.Projection = runningProjection;
            return period;
        });
    }, [forecastFetcher.data, plannedOrders, conversionFactor]);
    var combinedSupplyAndDemand = (0, react_2.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        var projectedQuantity = (_b = (_a = forecastFetcher.data) === null || _a === void 0 ? void 0 : _a.quantityOnHand) !== null && _b !== void 0 ? _b : 0;
        var periods = (_d = (_c = forecastFetcher.data) === null || _c === void 0 ? void 0 : _c.periods) !== null && _d !== void 0 ? _d : [];
        // First get all forecast data
        var forecastData = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], ((_f = (_e = forecastFetcher.data) === null || _e === void 0 ? void 0 : _e.openSalesOrderLines) !== null && _f !== void 0 ? _f : []).map(function (line) {
            var _a;
            return (__assign(__assign({}, line), { sourceType: "Sales Order", quantity: (_a = line.quantity) !== null && _a !== void 0 ? _a : 0 }));
        }), true), ((_h = (_g = forecastFetcher.data) === null || _g === void 0 ? void 0 : _g.openJobMaterials) !== null && _h !== void 0 ? _h : []).map(function (line) {
            var _a;
            return (__assign(__assign({}, line), { sourceType: "Job Material", quantity: (_a = line.quantity) !== null && _a !== void 0 ? _a : 0 }));
        }), true), ((_k = (_j = forecastFetcher.data) === null || _j === void 0 ? void 0 : _j.openPurchaseOrderLines) !== null && _k !== void 0 ? _k : []).map(function (line) {
            var _a;
            return (__assign(__assign({}, line), { sourceType: "Purchase Order", quantity: (_a = line.quantity) !== null && _a !== void 0 ? _a : 0 }));
        }), true), ((_m = (_l = forecastFetcher.data) === null || _l === void 0 ? void 0 : _l.openProductionOrders) !== null && _m !== void 0 ? _m : []).map(function (line) {
            var _a;
            return (__assign(__assign({}, line), { sourceType: "Production Order", quantity: (_a = line.quantity) !== null && _a !== void 0 ? _a : 0 }));
        }), true), ((_p = (_o = forecastFetcher.data) === null || _o === void 0 ? void 0 : _o.demandForecast) !== null && _p !== void 0 ? _p : []).map(function (forecast) {
            var _a, _b, _c, _d, _e;
            var period = periods.find(function (p) { return p.id === forecast.periodId; });
            var sources = ((_b = (_a = forecastFetcher.data) === null || _a === void 0 ? void 0 : _a.demandForecastSources) !== null && _b !== void 0 ? _b : []).filter(function (s) {
                var _a, _b;
                return s.itemId === forecast.itemId &&
                    s.periodId === forecast.periodId &&
                    ((_a = s.locationId) !== null && _a !== void 0 ? _a : null) === ((_b = forecast.locationId) !== null && _b !== void 0 ? _b : null);
            });
            return {
                id: null,
                sourceType: "Demand Forecast",
                quantity: (_c = forecast.forecastQuantity) !== null && _c !== void 0 ? _c : 0,
                dueDate: (_d = period === null || period === void 0 ? void 0 : period.startDate) !== null && _d !== void 0 ? _d : null,
                documentReadableId: "Demand Forecast",
                documentId: null,
                forecastMethod: (_e = forecast.forecastMethod) !== null && _e !== void 0 ? _e : null,
                forecastSources: sources
            };
        }), true);
        // Filter out planned orders that have matching existing IDs in forecast data
        var filteredPlannedOrders = plannedOrders.filter(function (order) {
            if (!order.existingId)
                return true;
            return !forecastData.some(function (item) { return item.id === order.existingId; });
        });
        // For planned orders with existing IDs, update the quantity in forecast data
        plannedOrders.forEach(function (order) {
            var _a;
            if (order.existingId) {
                var existingIndex = forecastData.findIndex(function (item) { return item.id === order.existingId; });
                if (existingIndex >= 0) {
                    // Convert purchase quantity to inventory quantity
                    var purchaseQuantity = (_a = order.quantity) !== null && _a !== void 0 ? _a : 0;
                    var inventoryQuantity = purchaseQuantity * conversionFactor;
                    forecastData[existingIndex].quantity = inventoryQuantity;
                }
            }
        });
        // Add remaining planned orders
        var combined = __spreadArray(__spreadArray([], forecastData, true), filteredPlannedOrders.map(function (order) {
            var _a;
            return (__assign(__assign({}, order), { sourceType: "Planned", quantity: ((_a = order.quantity) !== null && _a !== void 0 ? _a : 0) * conversionFactor, documentReadableId: "Planned", documentId: null, id: null, plannedOrder: order }));
        }), true).sort(function (a, b) { var _a, _b; return ((_a = a.dueDate) !== null && _a !== void 0 ? _a : "").localeCompare((_b = b.dueDate) !== null && _b !== void 0 ? _b : ""); })
            .map(function (item) {
            if (item.sourceType === "Sales Order" ||
                item.sourceType === "Job Material" ||
                item.sourceType === "Demand Forecast") {
                projectedQuantity -= item.quantity;
            }
            else {
                projectedQuantity += item.quantity;
            }
            return __assign(__assign({}, item), { projectedQuantity: projectedQuantity });
        });
        if (!searchTerm)
            return combined;
        return combined.filter(function (item) {
            var _a;
            return ((_a = item.documentReadableId) !== null && _a !== void 0 ? _a : "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        });
    }, [forecastFetcher.data, searchTerm, plannedOrders, conversionFactor]);
    if (((_d = (_c = (_b = forecastFetcher.data) === null || _b === void 0 ? void 0 : _b.periods) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) === 0 ||
        (((_e = forecastFetcher.data) === null || _e === void 0 ? void 0 : _e.demand.length) === 0 &&
            ((_f = forecastFetcher.data) === null || _f === void 0 ? void 0 : _f.supply.length) === 0 &&
            ((_j = (_h = (_g = forecastFetcher.data) === null || _g === void 0 ? void 0 : _g.demandForecast) === null || _h === void 0 ? void 0 : _h.length) !== null && _j !== void 0 ? _j : 0) === 0)) {
        return (<react_1.Card>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Projections</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent className="min-h-[360px] flex items-center justify-center">
          <components_1.Empty>
            <macro_1.Trans>No planning data</macro_1.Trans>
          </components_1.Empty>
        </react_1.CardContent>
      </react_1.Card>);
    }
    return (<>
      <react_1.Card className={(0, react_1.cn)(compact && "border-none p-0 dark:shadow-none")}>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Projections</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <div className="w-full h-[360px]">
            <react_1.Loading isLoading={isFetching}>
              <Chart_1.ChartContainer config={chartConfig} className="w-full h-full">
                <recharts_1.ComposedChart data={chartData} stackOffset="sign">
                  <recharts_1.CartesianGrid vertical={false}/>
                  <recharts_1.XAxis dataKey="startDate" tickLine={false} axisLine={false} tickFormatter={function (value) {
            return dateFormatter.format((0, date_1.parseDate)(value).toDate((0, date_1.getLocalTimeZone)()));
        }}/>
                  <recharts_1.YAxis tickLine={false} axisLine={false}/>
                  <recharts_1.ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3"/>
                  {safetyStock && safetyStock > 0 && (<recharts_1.ReferenceLine y={safetyStock} stroke="#f43f5e" strokeDasharray="3 3"/>)}
                  <recharts_1.Legend payload={__spreadArray([
            { value: "Demand", type: "rect", color: "#14b8a6" },
            {
                value: "Demand Forecast",
                type: "rect",
                color: "#06b6d4"
            },
            { value: "Supply", type: "rect", color: "#2563eb" },
            { value: "Planned", type: "rect", color: "#4f46e5" },
            {
                value: "Projection",
                type: "line",
                color: "#7c3aed"
            }
        ], (safetyStock && safetyStock > 0
            ? [
                {
                    value: "Safety Stock",
                    type: "line",
                    color: "#f43f5e"
                }
            ]
            : []), true)}/>
                  <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent labelFormatter={function (value) {
                return "Week of ".concat(dateFormatter.format((0, date_1.parseDate)(value).toDate((0, date_1.getLocalTimeZone)())));
            }}/>}/>
                  <recharts_1.Area type="monotone" dataKey="Projection" strokeWidth={1} dot={false} stroke="#7c3aed" fill="#7c3aedcc" isAnimationActive={false}/>
                  {demandSourceTypes.map(function (sourceType) { return (<recharts_1.Bar key={sourceType} dataKey={sourceType} stackId="stack" className="fill-teal-500"/>); })}
                  <recharts_1.Bar dataKey="Demand Forecast" stackId="stack" className="fill-cyan-500"/>
                  {supplySourceTypes.map(function (sourceType) { return (<recharts_1.Bar key={sourceType} dataKey={sourceType} stackId="stack" className="fill-blue-600"/>); })}
                  <recharts_1.Bar dataKey="Planned" stackId="stack" className="fill-indigo-600"/>
                </recharts_1.ComposedChart>
              </Chart_1.ChartContainer>
            </react_1.Loading>
          </div>
        </react_1.CardContent>
      </react_1.Card>
      <react_1.Tabs defaultValue="all" className="w-full">
        <react_1.Card className={(0, react_1.cn)(compact && "border-none p-0 dark:shadow-none")}>
          <react_1.HStack className="w-full justify-between">
            <react_1.CardHeader>
              <react_1.CardTitle>
                <macro_1.Trans>Supply & Demand</macro_1.Trans>
              </react_1.CardTitle>
            </react_1.CardHeader>
            <react_1.CardAction className="flex items-center gap-2">
              <react_1.TabsList>
                <react_1.TabsTrigger value="all">
                  <macro_1.Trans>All</macro_1.Trans>
                </react_1.TabsTrigger>
                <react_1.TabsTrigger value="supply">
                  <macro_1.Trans>Supply</macro_1.Trans>
                </react_1.TabsTrigger>
                <react_1.TabsTrigger value="demand">
                  <macro_1.Trans>Demand</macro_1.Trans>
                </react_1.TabsTrigger>
              </react_1.TabsList>
            </react_1.CardAction>
          </react_1.HStack>
          <react_1.CardContent>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
              <react_1.Card>
                <react_1.CardHeader className="pb-8">
                  <react_1.CardDescription>
                    <react_1.VStack>
                      <macro_1.Trans>Quantity on Hand</macro_1.Trans>
                    </react_1.VStack>
                  </react_1.CardDescription>
                  <react_1.CardTitle className="text-4xl ">
                    <div className="flex justify-start items-center gap-1">
                      {"".concat(numberFormatter.format((_l = (_k = forecastFetcher.data) === null || _k === void 0 ? void 0 : _k.quantityOnHand) !== null && _l !== void 0 ? _l : 0))}
                    </div>
                  </react_1.CardTitle>
                </react_1.CardHeader>
              </react_1.Card>
              <react_1.Card>
                <react_1.CardHeader className="pb-8">
                  <react_1.CardDescription>
                    <react_1.VStack>
                      <macro_1.Trans>Incoming</macro_1.Trans>
                    </react_1.VStack>
                  </react_1.CardDescription>
                  <react_1.CardTitle className="text-4xl ">
                    <div className="flex justify-start items-center gap-1">
                      {"".concat(numberFormatter.format((_o = (_m = forecastFetcher.data) === null || _m === void 0 ? void 0 : _m.supply.reduce(function (acc, curr) { var _a; return acc + ((_a = curr.actualQuantity) !== null && _a !== void 0 ? _a : 0); }, 0)) !== null && _o !== void 0 ? _o : 0))}
                      <lu_1.LuMoveUp className="text-teal-500 text-lg"/>
                    </div>
                  </react_1.CardTitle>
                </react_1.CardHeader>
              </react_1.Card>
              <react_1.Card>
                <react_1.CardHeader className="pb-8">
                  <react_1.CardDescription>
                    <react_1.VStack>
                      <macro_1.Trans>Outgoing</macro_1.Trans>
                    </react_1.VStack>
                  </react_1.CardDescription>
                  <react_1.CardTitle className="text-4xl ">
                    <div className="flex justify-start items-center gap-1">
                      {"".concat(numberFormatter.format(((_q = (_p = forecastFetcher.data) === null || _p === void 0 ? void 0 : _p.demand.reduce(function (acc, curr) { var _a; return acc + ((_a = curr.actualQuantity) !== null && _a !== void 0 ? _a : 0); }, 0)) !== null && _q !== void 0 ? _q : 0) +
            ((_t = (_s = (_r = forecastFetcher.data) === null || _r === void 0 ? void 0 : _r.demandForecast) === null || _s === void 0 ? void 0 : _s.reduce(function (acc, curr) { var _a; return acc + ((_a = curr.forecastQuantity) !== null && _a !== void 0 ? _a : 0); }, 0)) !== null && _t !== void 0 ? _t : 0)))}
                      <lu_1.LuMoveDown className="text-red-500 text-lg"/>
                    </div>
                  </react_1.CardTitle>
                </react_1.CardHeader>
              </react_1.Card>
            </div>

            <div className="relative w-full mb-4">
              <react_1.Input placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search"], ["Search"])))} value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="pl-10"/>
              <lu_1.LuSearch className="absolute left-3 top-3 size-4 text-muted-foreground"/>
            </div>

            <react_1.TabsContent value="all" className="border rounded-lg">
              <SupplyDemandPlanningHeader />
              {combinedSupplyAndDemand.map(function (item, index) { return (<SupplyDemandPlanningItem key={index} item={item} conversionFactor={conversionFactor}/>); })}
            </react_1.TabsContent>

            <react_1.TabsContent value="supply" className="border rounded-lg">
              <SupplyDemandPlanningHeader />
              {combinedSupplyAndDemand
            .filter(function (item) {
            return supplySourceTypes.includes(item.sourceType);
        })
            .map(function (item, index) { return (<SupplyDemandPlanningItem key={index} item={item} conversionFactor={conversionFactor}/>); })}
            </react_1.TabsContent>

            <react_1.TabsContent value="demand" className="border rounded-lg">
              <SupplyDemandPlanningHeader />
              {combinedSupplyAndDemand
            .filter(function (item) {
            return demandSourceTypes.includes(item.sourceType) || item.sourceType === "Demand Forecast";
        })
            .map(function (item, index) { return (<SupplyDemandPlanningItem key={index} item={item} conversionFactor={conversionFactor}/>); })}
            </react_1.TabsContent>
          </react_1.CardContent>
        </react_1.Card>
      </react_1.Tabs>
    </>);
};
exports.ItemPlanningChart = ItemPlanningChart;
var sourceTypeIcons = {
    "Sales Order": <lu_1.LuCrown className="size-4 text-teal-500"/>,
    "Job Material": <lu_1.LuClipboardList className="size-4 text-teal-500"/>,
    "Purchase Order": <lu_1.LuShoppingCart className="size-4 text-blue-600"/>,
    "Production Order": <lu_1.LuFactory className="size-4 text-blue-600"/>,
    Planned: <lu_1.LuMoveUp className="size-4 text-indigo-600"/>,
    "Demand Forecast": <lu_1.LuChartLine className="size-4 text-cyan-500"/>
};
function SupplyDemandPlanningHeader() {
    return (<div className="flex flex-1 justify-between items-center w-full px-4 py-2 border-b bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      <react_1.HStack spacing={4} className="w-1/2">
        <react_1.HStack spacing={4} className="flex-1">
          <div className="size-8 shrink-0" aria-hidden/>
          <react_1.VStack spacing={0} className="flex-1">
            <macro_1.Trans>Source</macro_1.Trans>
          </react_1.VStack>
          <div className="text-right">
            <macro_1.Trans>Quantity</macro_1.Trans>
          </div>
        </react_1.HStack>
      </react_1.HStack>
      <macro_1.Trans>On Hand</macro_1.Trans>
    </div>);
}
function SupplyDemandPlanningItem(_a) {
    var _b, _c;
    var item = _a.item, conversionFactor = _a.conversionFactor;
    var t = (0, macro_1.useLingui)().t;
    var numberFormatter = (0, i18n_1.useNumberFormatter)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    return (<div className="flex flex-1 justify-between items-center w-full p-4 border-b last:border-b-0">
      <react_1.HStack spacing={4} className="w-1/2">
        <react_1.HStack spacing={4} className="flex-1">
          <div className="bg-muted border rounded-full flex items-center justify-center p-2">
            {sourceTypeIcons[item.sourceType]}
          </div>
          <react_1.VStack spacing={0}>
            {item.sourceType === "Demand Forecast" ? (<DemandForecastSourcesPopover_1.DemandForecastSourcesPopover sources={(_b = item.forecastSources) !== null && _b !== void 0 ? _b : []} forecastQuantity={item.quantity} forecastMethod={(_c = item.forecastMethod) !== null && _c !== void 0 ? _c : null}>
                <button type="button" className="text-sm font-medium text-left hover:underline">
                  {item.documentReadableId}
                </button>
              </DemandForecastSourcesPopover_1.DemandForecastSourcesPopover>) : item.sourceType === "Planned" && item.plannedOrder ? (<PlannedOrderDetailsPopover_1.PlannedOrderDetailsPopover order={item.plannedOrder} conversionFactor={conversionFactor}>
                <button type="button" className="text-sm font-medium text-left hover:underline">
                  {item.documentReadableId}
                </button>
              </PlannedOrderDetailsPopover_1.PlannedOrderDetailsPopover>) : (<components_1.Hyperlink to={getPathToDocument(item)} className="text-sm font-medium">
                {item.documentReadableId}
              </components_1.Hyperlink>)}
            <span className="text-xs text-muted-foreground">
              {item.dueDate ? formatDate(item.dueDate) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["No due date"], ["No due date"])))}
            </span>
          </react_1.VStack>
          <div className="flex items-center gap-1 text-sm text-muted-foreground text-right">
            <span>{numberFormatter.format(item.quantity)}</span>
            {item.sourceType === "Sales Order" ||
            item.sourceType === "Job Material" ||
            item.sourceType === "Demand Forecast" ? (<lu_1.LuMoveDown className="text-red-500"/>) : (<lu_1.LuMoveUp className="text-teal-500"/>)}
          </div>
        </react_1.HStack>
      </react_1.HStack>

      <span className={(0, react_1.cn)("text-sm", item.projectedQuantity < 0 && "text-red-500")}>
        {numberFormatter.format(item.projectedQuantity)}
      </span>
    </div>);
}
function getPathToDocument(item) {
    var _a, _b, _c;
    switch (item.sourceType) {
        case "Sales Order":
            return path_1.path.to.salesOrder((_a = item.documentId) !== null && _a !== void 0 ? _a : "");
        case "Job Material":
            if (!item.jobId)
                return "#";
            if (!item.jobMakeMethodId)
                return "#";
            return item.parentMaterialId
                ? path_1.path.to.jobMakeMethod(item.jobId, item.jobMakeMethodId)
                : path_1.path.to.jobMethod(item.jobId, item.jobMakeMethodId);
        case "Purchase Order":
            return path_1.path.to.purchaseOrder((_b = item.documentId) !== null && _b !== void 0 ? _b : "");
        case "Production Order":
            return path_1.path.to.job((_c = item.documentId) !== null && _c !== void 0 ? _c : "");
        case "Planned":
            return "#";
        case "Demand Forecast":
            return "#";
        default:
            return "";
    }
}
var templateObject_1, templateObject_2;
