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
exports.ItemCostHistoryChart = ItemCostHistoryChart;
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
var CSVLink_1 = require("~/components/CSVLink");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
function ItemCostHistoryChart(_a) {
    var readableId = _a.readableId, itemCostHistory = _a.itemCostHistory;
    var t = (0, macro_1.useLingui)().t;
    var chartConfig = {
        cost: {
            color: "hsl(var(--chart-1))",
            label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Unit Cost"], ["Unit Cost"])))
        },
        weightedAverage: {
            color: "hsl(var(--chart-2))",
            label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Weighted Average"], ["Weighted Average"])))
        }
    };
    var chartData = (0, react_2.useMemo)(function () {
        // Generate array of dates for the last year
        var todayDate = (0, date_1.today)("UTC");
        var oneYearAgo = todayDate.subtract({ years: 1 });
        // Create array of all dates in the last year
        var allDates = [];
        var current = oneYearAgo;
        while (current.compare(todayDate) <= 0) {
            allDates.push(current);
            current = current.add({ days: 1 });
        }
        // Map cost history to dates, filling in gaps with null
        return allDates.map(function (date, index) {
            var _a, _b, _c;
            var dateString = date.toString();
            var entries = itemCostHistory === null || itemCostHistory === void 0 ? void 0 : itemCostHistory.filter(function (h) { return h.postingDate === dateString; });
            // If the first date is empty, fill it with the first item cost history entry
            if (index === 0 &&
                (entries === undefined || entries.length === 0) &&
                (itemCostHistory === null || itemCostHistory === void 0 ? void 0 : itemCostHistory[0])) {
                entries = [
                    (_a = itemCostHistory.find(function (h) { return new Date(h.postingDate) <= new Date(dateString); })) !== null && _a !== void 0 ? _a : itemCostHistory[0]
                ];
            }
            // If the last date is empty, fill it with the last item cost history entry
            if (index === allDates.length - 1 &&
                (entries === undefined || entries.length === 0) &&
                (itemCostHistory === null || itemCostHistory === void 0 ? void 0 : itemCostHistory[itemCostHistory.length - 1])) {
                entries = [itemCostHistory[itemCostHistory.length - 1]];
            }
            var totalCost = (_b = entries === null || entries === void 0 ? void 0 : entries.reduce(function (sum, entry) { return sum + entry.cost; }, 0)) !== null && _b !== void 0 ? _b : 0;
            var totalQuantity = (_c = entries === null || entries === void 0 ? void 0 : entries.reduce(function (sum, entry) { return sum + entry.quantity; }, 0)) !== null && _c !== void 0 ? _c : 0;
            return {
                postingDate: dateString,
                cost: totalQuantity > 0 ? totalCost / totalQuantity : null,
                quantity: totalQuantity
            };
        });
    }, [itemCostHistory]);
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)();
    var shortDateFormatter = (0, i18n_1.useDateFormatter)({
        month: "short",
        day: "numeric"
    });
    var longDateFormatter = (0, i18n_1.useDateFormatter)({
        year: "numeric",
        month: "short",
        day: "numeric"
    });
    // Calculate max value for y-axis
    var maxCost = Math.max.apply(Math, chartData.map(function (d) { var _a; return (_a = d.cost) !== null && _a !== void 0 ? _a : 0; }));
    var yAxisMax = maxCost * 1.2;
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var csvData = (0, react_2.useMemo)(function () {
        if (!itemCostHistory)
            return [];
        return __spreadArray([
            ["Posting Date", "Nominal Cost", "Actual Cost", "Quantity", "Supplier"]
        ], itemCostHistory.map(function (h) {
            var _a;
            return [
                longDateFormatter.format(new Date(h.postingDate)),
                currencyFormatter.format(h.nominalCost / h.quantity),
                currencyFormatter.format(h.cost / h.quantity),
                h.quantity,
                (_a = suppliers.find(function (s) { return s.id === h.supplierId; })) === null || _a === void 0 ? void 0 : _a.name
            ];
        }), true);
    }, [itemCostHistory, longDateFormatter, currencyFormatter, suppliers]);
    return (<react_1.Card>
      <react_1.Tabs defaultValue="chart">
        <react_1.HStack className="w-full justify-between">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Cost History</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardAction className="flex-row-reverse items-center gap-2">
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton variant="secondary" icon={<lu_1.LuEllipsisVertical />} aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["More"], ["More"])))}/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent align="end">
                <react_1.DropdownMenuItem>
                  <CSVLink_1.CSVLink data={csvData} filename={"".concat(readableId, "-cost-history-").concat(date_1.today.toString(), ".csv")} className="flex flex-row items-center gap-2">
                    <react_1.DropdownMenuIcon icon={<lu_1.LuFile />}/>
                    Export CSV
                  </CSVLink_1.CSVLink>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
            <react_1.TabsList>
              <react_1.TabsTrigger value="chart" className="p-2">
                <lu_1.LuChartLine />
              </react_1.TabsTrigger>
              <react_1.TabsTrigger value="table" className="p-2">
                <lu_1.LuTable />
              </react_1.TabsTrigger>
            </react_1.TabsList>
          </react_1.CardAction>
        </react_1.HStack>
        <react_1.CardContent>
          <react_1.TabsContent value="chart">
            <Chart_1.ChartContainer config={chartConfig} className="min-h-[40vh] h-[calc(100dvh-570px)] w-full">
              <recharts_1.LineChart accessibilityLayer data={chartData}>
                <recharts_1.CartesianGrid vertical={false}/>
                <recharts_1.YAxis domain={[0, yAxisMax]} tickLine={false} tickMargin={8} minTickGap={32} axisLine={false} tickFormatter={function (value) {
            return currencyFormatter.format(value);
        }}/>
                <recharts_1.XAxis dataKey="postingDate" tickLine={false} tickMargin={8} minTickGap={32} axisLine={false} tickFormatter={function (value) {
            if (!value)
                return "";
            return shortDateFormatter.format(new Date(value));
        }}/>
                <Chart_1.ChartTooltip cursor={false} content={<Chart_1.ChartTooltipContent hideLabel labelFormatter={function (value) {
                return currencyFormatter.format(value);
            }}/>}/>
                <recharts_1.Line dataKey="cost" type="linear" stroke="var(--color-cost)" strokeWidth={2} dot={{
            fill: "var(--color-cost)",
            r: 4
        }} activeDot={{
            r: 8
        }} connectNulls/>
                <recharts_1.Bar dataKey="cost" fill="var(--color-cost)" radius={2}/>
              </recharts_1.LineChart>
            </Chart_1.ChartContainer>
          </react_1.TabsContent>
          <react_1.TabsContent value="table">
            {itemCostHistory ? (<react_1.Table>
                <react_1.Thead>
                  <react_1.Tr>
                    <react_1.Th>
                      <macro_1.Trans>Posting Date</macro_1.Trans>
                    </react_1.Th>
                    <react_1.Th>
                      <div className="flex flex-row items-center gap-2">
                        <macro_1.Trans>Nominal Cost</macro_1.Trans>{" "}
                        <react_1.Tooltip>
                          <react_1.TooltipTrigger>
                            <lu_1.LuInfo />
                          </react_1.TooltipTrigger>
                          <react_1.TooltipContent>
                            <macro_1.Trans>
                              The unit price of the item at the time of the
                              purchase
                            </macro_1.Trans>
                          </react_1.TooltipContent>
                        </react_1.Tooltip>
                      </div>
                    </react_1.Th>
                    <react_1.Th>
                      <div className="flex flex-row items-center gap-2">
                        <macro_1.Trans>Actual Cost</macro_1.Trans>{" "}
                        <react_1.Tooltip>
                          <react_1.TooltipTrigger>
                            <lu_1.LuInfo />
                          </react_1.TooltipTrigger>
                          <react_1.TooltipContent>
                            <macro_1.Trans>Includes tax and shipping costs</macro_1.Trans>
                          </react_1.TooltipContent>
                        </react_1.Tooltip>
                      </div>
                    </react_1.Th>
                    <react_1.Th>
                      <macro_1.Trans>Quantity</macro_1.Trans>
                    </react_1.Th>
                    <react_1.Th>
                      <macro_1.Trans>Supplier</macro_1.Trans>
                    </react_1.Th>
                  </react_1.Tr>
                </react_1.Thead>
                <react_1.Tbody>
                  {itemCostHistory.map(function (h) {
                var unitCost = h.quantity > 0 ? h.cost / h.quantity : 0;
                var nominalUnitCost = h.nominalCost / h.quantity;
                return (<react_1.Tr key={h.id}>
                        <react_1.Td>
                          <div className="flex flex-row items-center gap-2">
                            {longDateFormatter.format(new Date(h.postingDate))}
                            {h.documentId &&
                        h.documentType === "Purchase Invoice" && (<react_1.Tooltip>
                                  <react_1.TooltipTrigger>
                                    <react_1.Button variant="link" size="sm" asChild>
                                      <react_router_1.Link to={path_1.path.to.purchaseInvoice(h.documentId)}>
                                        <lu_1.LuExternalLink />
                                      </react_router_1.Link>
                                    </react_1.Button>
                                  </react_1.TooltipTrigger>
                                  <react_1.TooltipContent>
                                    <macro_1.Trans>View Purchase Invoice</macro_1.Trans>
                                  </react_1.TooltipContent>
                                </react_1.Tooltip>)}
                          </div>
                        </react_1.Td>
                        <react_1.Td>{currencyFormatter.format(nominalUnitCost)}</react_1.Td>
                        <react_1.Td>{currencyFormatter.format(unitCost)}</react_1.Td>
                        <react_1.Td>{h.quantity}</react_1.Td>
                        <react_1.Td>
                          <components_1.SupplierAvatar supplierId={h.supplierId}/>
                        </react_1.Td>
                      </react_1.Tr>);
            })}
                </react_1.Tbody>
              </react_1.Table>) : (<div className="flex flex-col items-center justify-center h-full">
                <p>
                  <macro_1.Trans>No cost history found</macro_1.Trans>
                </p>
              </div>)}
          </react_1.TabsContent>
        </react_1.CardContent>
      </react_1.Tabs>
    </react_1.Card>);
}
var templateObject_1, templateObject_2, templateObject_3;
