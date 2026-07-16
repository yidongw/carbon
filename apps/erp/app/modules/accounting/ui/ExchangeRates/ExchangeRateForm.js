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
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var Chart_1 = require("@carbon/react/Chart");
var json_2_csv_1 = require("json-2-csv");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var recharts_1 = require("recharts");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var accounting_models_1 = require("../../accounting.models");
var chartConfig = {
    rate: {
        label: "Exchange Rate",
        color: "hsl(var(--primary))"
    }
};
var CurrencyForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues, _c = _a.exchangeRateHistory, exchangeRateHistory = _c === void 0 ? [] : _c;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(-1); };
    var _d = (0, react_2.useState)((_b = initialValues.decimalPlaces) !== null && _b !== void 0 ? _b : 2), decimalPlaces = _d[0], setDecimalPlaces = _d[1];
    var company = (0, hooks_1.useUser)().company;
    var isBaseCurrency = (company === null || company === void 0 ? void 0 : company.baseCurrencyCode) === initialValues.code;
    var exchangeRateHelperText = isBaseCurrency
        ? "This is the base currency. Exchange rate is always 1."
        : "One ".concat(company === null || company === void 0 ? void 0 : company.baseCurrencyCode, " is equal to how many ").concat(initialValues.code, "?");
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "accounting")
        : !permissions.can("create", "accounting");
    var chartData = (0, react_2.useMemo)(function () {
        return exchangeRateHistory.map(function (row) { return ({
            date: row.effectiveDate,
            rate: Number(row.rate)
        }); });
    }, [exchangeRateHistory]);
    var hasHistory = chartData.length > 0;
    var onDownloadCSV = (0, react_2.useCallback)(function () {
        if (!exchangeRateHistory.length)
            return;
        var csvData = (0, json_2_csv_1.json2csv)(exchangeRateHistory);
        var blob = new Blob([csvData], { type: "text/csv" });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "".concat(initialValues.code, "-exchange-rates.csv");
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }, [exchangeRateHistory, initialValues.code]);
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={accounting_models_1.currencyValidator} method="post" action={isEditing
            ? path_1.path.to.exchangeRate(initialValues.id)
            : path_1.path.to.newExchangeRate} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>{isEditing ? "Edit" : "New"} Currency</react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>
            <react_1.VStack spacing={4}>
              <Form_1.Input name="name" label="Name" isReadOnly/>
              <Form_1.Input name="code" label="Code" isReadOnly/>
              <Form_1.Number name="decimalPlaces" label="Decimal Places" minValue={0} maxValue={4} onChange={setDecimalPlaces}/>
              <Form_1.Number name="exchangeRate" label="Exchange Rate" minValue={isBaseCurrency ? 1 : 0} maxValue={isBaseCurrency ? 1 : undefined} formatOptions={{
            minimumFractionDigits: decimalPlaces !== null && decimalPlaces !== void 0 ? decimalPlaces : 0
        }} helperText={exchangeRateHelperText}/>
              {!isBaseCurrency && (<Form_1.Number name="historicalExchangeRate" label="Historical Rate (Equity)" minValue={0} formatOptions={{
                minimumFractionDigits: decimalPlaces !== null && decimalPlaces !== void 0 ? decimalPlaces : 0
            }} helperText="Rate used for equity account translation in consolidation (IAS 21). Leave blank to use the current exchange rate."/>)}

              <Form_1.CustomFormFields table="currency"/>
            </react_1.VStack>

            {isEditing && !isBaseCurrency && hasHistory && (<react_1.Tabs defaultValue="chart" className="mt-6 w-full">
                <react_1.Card className="w-full">
                  <react_1.HStack className="items-center justify-between">
                    <react_1.CardHeader>
                      <react_1.CardTitle>Exchange Rate History</react_1.CardTitle>
                    </react_1.CardHeader>
                    <react_1.CardAction>
                      <react_1.HStack>
                        <react_1.TabsList>
                          <react_1.TabsTrigger value="chart">Chart</react_1.TabsTrigger>
                          <react_1.TabsTrigger value="table">Table</react_1.TabsTrigger>
                        </react_1.TabsList>
                        <react_1.Tooltip>
                          <react_1.TooltipTrigger asChild>
                            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Download CSV"], ["Download CSV"])))} title="Download CSV" variant="ghost" icon={<lu_1.LuDownload />} className="!border-dashed border-border" onClick={onDownloadCSV}/>
                          </react_1.TooltipTrigger>
                          <react_1.TooltipContent>
                            <p>Download CSV</p>
                          </react_1.TooltipContent>
                        </react_1.Tooltip>
                      </react_1.HStack>
                    </react_1.CardAction>
                  </react_1.HStack>
                  <react_1.CardContent>
                    <react_1.TabsContent value="chart">
                      <Chart_1.ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <recharts_1.AreaChart data={chartData}>
                          <recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false}/>
                          <recharts_1.XAxis dataKey="date" tickFormatter={function (v) {
                return new Date(v).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric"
                });
            }} tickLine={false} axisLine={false} fontSize={12}/>
                          <recharts_1.YAxis domain={[0, "auto"]} tickLine={false} axisLine={false} fontSize={12}/>
                          <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent labelFormatter={function (v) {
                    return new Date(v).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                    });
                }}/>}/>
                          <recharts_1.Area type="monotone" dataKey="rate" stroke="var(--color-rate)" fill="var(--color-rate)" fillOpacity={0.1} strokeWidth={2}/>
                        </recharts_1.AreaChart>
                      </Chart_1.ChartContainer>
                    </react_1.TabsContent>
                    <react_1.TabsContent value="table">
                      <div className="max-h-[200px] overflow-y-auto">
                        <react_1.Table>
                          <react_1.Thead>
                            <react_1.Tr>
                              <react_1.Th>Date</react_1.Th>
                              <react_1.Th className="text-right">Rate</react_1.Th>
                            </react_1.Tr>
                          </react_1.Thead>
                          <react_1.Tbody>
                            {__spreadArray([], chartData, true).reverse().map(function (row) { return (<react_1.Tr key={row.date}>
                                <react_1.Td>
                                  {new Date(row.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                })}
                                </react_1.Td>
                                <react_1.Td className="text-right">
                                  {row.rate.toFixed(decimalPlaces)}
                                </react_1.Td>
                              </react_1.Tr>); })}
                          </react_1.Tbody>
                        </react_1.Table>
                      </div>
                    </react_1.TabsContent>
                  </react_1.CardContent>
                </react_1.Card>
              </react_1.Tabs>)}
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <Form_1.Submit isDisabled={isDisabled}>Save</Form_1.Submit>
              <react_1.Button variant="solid" onClick={onClose}>
                Cancel
              </react_1.Button>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = CurrencyForm;
var templateObject_1;
