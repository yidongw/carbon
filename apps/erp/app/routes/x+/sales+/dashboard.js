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
exports.loader = loader;
exports.default = SalesDashboard;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var Chart_1 = require("@carbon/react/Chart");
var FunnelChart_1 = require("@carbon/react/FunnelChart");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var recharts_1 = require("recharts");
var components_1 = require("~/components");
var CSVLink_1 = require("~/components/CSVLink");
var Navigation_1 = require("~/components/Layout/Navigation");
var useCurrencyFormatter_1 = require("~/hooks/useCurrencyFormatter");
var sales_models_1 = require("~/modules/sales/sales.models");
var sales_service_1 = require("~/modules/sales/sales.service");
var QuoteStatus_1 = require("~/modules/sales/ui/Quotes/QuoteStatus");
var SalesOrder_1 = require("~/modules/sales/ui/SalesOrder");
var SalesRFQ_1 = require("~/modules/sales/ui/SalesRFQ");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var OPEN_RFQ_STATUSES = ["Ready for Quote", "Draft"];
var OPEN_QUOTE_STATUSES = ["Sent", "Draft"];
var OPEN_SALES_ORDER_STATUSES = [
    "Confirmed",
    "To Ship and Invoice",
    "To Ship",
    "To Invoice",
    "Needs Approval",
    "In Progress",
    "Draft"
];
var chartConfig = {
    value: {
        color: "hsl(var(--primary))"
    }
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, _d, openSalesOrders, openQuotes, openRFQs;
        var request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales"
                    })];
                case 1:
                    _c = _e.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("salesOrder")
                                .select("id, salesOrderId, status, customerId, assignee, createdAt", {
                                count: "exact"
                            })
                                .in("status", OPEN_SALES_ORDER_STATUSES)
                                .eq("companyId", companyId)
                                .limit(10),
                            client
                                .from("quote")
                                .select("id, quoteId, status, customerId, assignee, createdAt", {
                                count: "exact"
                            })
                                .in("status", OPEN_QUOTE_STATUSES)
                                .eq("companyId", companyId)
                                .limit(10),
                            client
                                .from("salesRfq")
                                .select("id, rfqId, status, customerId, assignee, createdAt", {
                                count: "exact"
                            })
                                .in("status", OPEN_RFQ_STATUSES)
                                .eq("companyId", companyId)
                                .limit(10)
                        ])];
                case 2:
                    _d = _e.sent(), openSalesOrders = _d[0], openQuotes = _d[1], openRFQs = _d[2];
                    return [2 /*return*/, {
                            openSalesOrders: openSalesOrders,
                            openQuotes: openQuotes,
                            openRFQs: openRFQs,
                            assignedToMe: (0, sales_service_1.getSalesDocumentsAssignedToMe)(client, userId, companyId)
                        }];
            }
        });
    });
}
function SalesDashboard() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var t = (0, macro_1.useLingui)().t;
    var _m = (0, react_router_1.useLoaderData)(), openSalesOrders = _m.openSalesOrders, openQuotes = _m.openQuotes, openRFQs = _m.openRFQs, assignedToMe = _m.assignedToMe;
    var mergedOpenDocs = (0, react_2.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f;
        var merged = __spreadArray(__spreadArray(__spreadArray([], ((_b = (_a = openSalesOrders.data) === null || _a === void 0 ? void 0 : _a.map(function (doc) { return (__assign(__assign({}, doc), { type: "salesOrder" })); })) !== null && _b !== void 0 ? _b : []), true), ((_d = (_c = openQuotes.data) === null || _c === void 0 ? void 0 : _c.map(function (doc) { return (__assign(__assign({}, doc), { type: "quote" })); })) !== null && _d !== void 0 ? _d : []), true), ((_f = (_e = openRFQs.data) === null || _e === void 0 ? void 0 : _e.map(function (doc) { return (__assign(__assign({}, doc), { type: "rfq" })); })) !== null && _f !== void 0 ? _f : []), true).sort(function (a, b) { var _a, _b; return ((_a = b.createdAt) !== null && _a !== void 0 ? _a : "").localeCompare((_b = a.createdAt) !== null && _b !== void 0 ? _b : ""); });
        return merged;
    }, [openSalesOrders, openQuotes, openRFQs]);
    var kpiFetcher = (0, react_router_1.useFetcher)();
    var isFetching = kpiFetcher.state !== "idle" || !kpiFetcher.data;
    var steps = (0, react_2.useMemo)(function () {
        var _a;
        var defaultSteps = [
            {
                id: "rfqs",
                label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["RFQs"], ["RFQs"]))),
                value: 0,
                colorClassName: "text-violet-600"
            },
            {
                id: "quotes",
                label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Quotes"], ["Quotes"]))),
                value: 0,
                colorClassName: "text-blue-600"
            },
            {
                id: "salesOrders",
                label: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Sales Orders"], ["Sales Orders"]))),
                value: 0,
                additionalValue: 0,
                colorClassName: "text-teal-500"
            }
        ];
        if (!((_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            return defaultSteps;
        }
        var getKpiValue = function (name) {
            var _a, _b, _c, _d;
            return (_d = (_c = (_b = (_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.find(function (item) { return "name" in item && item.name === name; })) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : 0;
        };
        return [
            __assign(__assign({}, defaultSteps[0]), { value: getKpiValue("RFQs") }),
            __assign(__assign({}, defaultSteps[1]), { value: getKpiValue("Quotes") }),
            __assign(__assign({}, defaultSteps[2]), { value: getKpiValue("Sales Orders"), additionalValue: getKpiValue("Revenue") })
        ];
    }, [(_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data, t]);
    var dateFormatter = (0, i18n_1.useDateFormatter)({
        month: "short",
        day: "numeric"
    });
    var currencyCompactFormatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)({
        notation: "compact",
        compactDisplay: "short"
    });
    var currencyFormatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)();
    var numberFormatter = (0, i18n_1.useNumberFormatter)({
        maximumFractionDigits: 0,
        notation: "compact",
        compactDisplay: "short"
    });
    var _o = (0, react_2.useState)("all"), customerId = _o[0], setCustomerId = _o[1];
    var customers = (0, stores_1.useCustomers)()[0];
    var customerOptions = (0, react_2.useMemo)(function () {
        return __spreadArray([
            {
                label: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["All Customers"], ["All Customers"]))),
                value: "all"
            }
        ], customers.map(function (customer) { return ({
            label: customer.name,
            value: customer.id
        }); }), true);
    }, [customers, t]);
    var _p = (0, react_2.useState)("month"), interval = _p[0], setInterval = _p[1];
    var _q = (0, react_2.useState)("salesOrderRevenue"), selectedKpi = _q[0], setSelectedKpi = _q[1];
    var _r = (0, react_2.useState)(function () {
        var end = (0, date_1.today)("UTC");
        var start = end.add({ months: -1 });
        return { start: start, end: end };
    }), dateRange = _r[0], setDateRange = _r[1];
    var selectedKpiData = sales_models_1.KPIs.find(function (k) { return k.key === selectedKpi; }) || sales_models_1.KPIs[0];
    var kpiLabels = (0, react_2.useMemo)(function () { return ({
        quoteCount: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quotes"], ["Quotes"]))),
        rfqCount: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["RFQs"], ["RFQs"]))),
        salesFunnel: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Sales Funnel"], ["Sales Funnel"]))),
        salesOrderCount: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Sales Orders"], ["Sales Orders"]))),
        salesOrderRevenue: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Sales Revenue"], ["Sales Revenue"])))
    }); }, [t]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        kpiFetcher.load("".concat(path_1.path.to.api.salesKpi(selectedKpiData.key), "?start=").concat(dateRange === null || dateRange === void 0 ? void 0 : dateRange.start.toString(), "&end=").concat(dateRange === null || dateRange === void 0 ? void 0 : dateRange.end.toString(), "&interval=").concat(interval).concat(customerId === "all" ? "" : "&customerId=".concat(customerId)));
    }, [selectedKpi, dateRange, interval, selectedKpiData.key, customerId]);
    var onIntervalChange = function (value) {
        var end = (0, date_1.today)("UTC");
        if (value === "week") {
            var start = end.add({ days: -7 });
            setDateRange({ start: start, end: end });
        }
        else if (value === "month") {
            var start = end.add({ months: -1 });
            setDateRange({ start: start, end: end });
        }
        else if (value === "quarter") {
            var start = end.add({ months: -3 });
            setDateRange({ start: start, end: end });
        }
        else if (value === "year") {
            var start = end.add({ years: -1 });
            setDateRange({ start: start, end: end });
        }
        setInterval(value);
    };
    var totalData = (0, react_2.useMemo)(function () {
        var _a, _b;
        if (!((_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data))
            return null;
        // For salesFunnel, find the Revenue item
        if (selectedKpi === "salesFunnel") {
            return kpiFetcher.data.data.find(function (item) { return "name" in item && item.name === "Revenue"; });
        }
        // For other KPIs, calculate total
        return {
            value: (_b = kpiFetcher.data.data.reduce(function (acc, curr) { return acc + curr.value; }, 0)) !== null && _b !== void 0 ? _b : 0
        };
    }, [(_b = kpiFetcher.data) === null || _b === void 0 ? void 0 : _b.data, selectedKpi]);
    var previousTotalData = (0, react_2.useMemo)(function () {
        var _a, _b;
        if (!((_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.previousPeriodData))
            return null;
        // For salesFunnel, find the Revenue item
        if (selectedKpi === "salesFunnel") {
            return kpiFetcher.data.previousPeriodData.find(function (item) { return "name" in item && item.name === "Revenue"; });
        }
        // For other KPIs, calculate total
        return {
            value: (_b = kpiFetcher.data.previousPeriodData.reduce(function (acc, curr) { return acc + curr.value; }, 0)) !== null && _b !== void 0 ? _b : 0
        };
    }, [(_c = kpiFetcher.data) === null || _c === void 0 ? void 0 : _c.previousPeriodData, selectedKpi]);
    var total = (_d = totalData === null || totalData === void 0 ? void 0 : totalData.value) !== null && _d !== void 0 ? _d : 0;
    var previousTotal = (_e = previousTotalData === null || previousTotalData === void 0 ? void 0 : previousTotalData.value) !== null && _e !== void 0 ? _e : 0;
    var percentageChange = previousTotal === 0
        ? total > 0
            ? 100
            : 0
        : ((total - previousTotal) / previousTotal) * 100;
    var formatValue = function (value) {
        if (["salesOrderRevenue", "salesFunnel"].includes(selectedKpiData.key)) {
            return currencyFormatter.format(value);
        }
        return numberFormatter.format(value);
    };
    var csvData = (0, react_2.useMemo)(function () {
        var _a;
        if (!((_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data))
            return [];
        // Handle different data formats based on KPI type
        if (selectedKpi === "salesFunnel") {
            return __spreadArray([
                ["Name", "Value"]
            ], kpiFetcher.data.data.map(function (item) { return [
                "name" in item ? item.name : "",
                item.value
            ]; }), true);
        }
        return __spreadArray([
            ["Date", "Value"]
        ], kpiFetcher.data.data.map(function (item) { return [
            "date" in item
                ? item.date
                : "month" in item
                    ? item.month
                    : // @ts-ignore
                        item.monthKey,
            item.value
        ]; }), true);
    }, [(_f = kpiFetcher.data) === null || _f === void 0 ? void 0 : _f.data, selectedKpi]);
    var csvFilename = (0, react_2.useMemo)(function () {
        var _a;
        var startDate = dateRange === null || dateRange === void 0 ? void 0 : dateRange.start.toString();
        var endDate = dateRange === null || dateRange === void 0 ? void 0 : dateRange.end.toString();
        return "".concat(kpiLabels[selectedKpiData.key], "_").concat(startDate, "_to_").concat(endDate).concat(customerId === "all"
            ? ""
            : "_".concat((_a = customers.find(function (c) { return c.id === customerId; })) === null || _a === void 0 ? void 0 : _a.name), ".csv");
    }, [
        dateRange === null || dateRange === void 0 ? void 0 : dateRange.start,
        dateRange === null || dateRange === void 0 ? void 0 : dateRange.end,
        kpiLabels,
        selectedKpiData.key,
        customerId,
        customers
    ]);
    return (<div className="@container flex flex-col gap-4 w-full p-4 h-[calc(100dvh-var(--header-height))] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-muted-foreground">
      <react_1.HStack spacing={1} className="hidden md:flex">
        <Navigation_1.CollapsibleSidebarTrigger />
        <react_1.Heading size="h2">
          <macro_1.Trans>Dashboard</macro_1.Trans>
        </react_1.Heading>
      </react_1.HStack>
      <div className="grid w-full gap-4 grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-3">
        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <ri_1.RiProgress2Line className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_1.Trans>Open RFQs</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {(_g = openRFQs.count) !== null && _g !== void 0 ? _g : 0}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.salesRfqs, "?filter=status:in:").concat(OPEN_RFQ_STATUSES.join(","))}>
                  <macro_1.Trans>View Open RFQs</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <ri_1.RiProgress4Line className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_1.Trans>Open Quotes</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {(_h = openQuotes.count) !== null && _h !== void 0 ? _h : 0}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.quotes, "?filter=status:in:").concat(OPEN_QUOTE_STATUSES.join(","))}>
                  <macro_1.Trans>View Open Quotes</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <ri_1.RiProgress8Line className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_1.Trans>Open Sales Orders</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {(_j = openSalesOrders.count) !== null && _j !== void 0 ? _j : 0}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.salesOrders, "?filter=status:in:").concat(OPEN_SALES_ORDER_STATUSES.join(","))}>
                  <macro_1.Trans>View Open Orders</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </div>
          </react_1.CardContent>
        </react_1.Card>
      </div>

      <react_1.Card>
        <div className="flex flex-wrap items-center justify-between">
          <react_1.CardHeader>
            <div className="flex flex-wrap justify-start items-center gap-2">
              <react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.Button variant="secondary" rightIcon={<lu_1.LuChevronDown />} className="hover:bg-background/80">
                    <span>{kpiLabels[selectedKpiData.key]}</span>
                  </react_1.Button>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent side="bottom" align="start">
                  <react_1.DropdownMenuRadioGroup value={selectedKpi} onValueChange={setSelectedKpi}>
                    {sales_models_1.KPIs.map(function (kpi) { return (<react_1.DropdownMenuRadioItem key={kpi.key} value={kpi.key}>
                        {kpiLabels[kpi.key]}
                      </react_1.DropdownMenuRadioItem>); })}
                  </react_1.DropdownMenuRadioGroup>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>

              <react_1.Combobox asButton value={customerId} onChange={setCustomerId} options={customerOptions} size="sm" className="min-w-[160px] gap-4"/>
            </div>
          </react_1.CardHeader>
          <react_1.CardAction className="flex-row items-center gap-2 shrink-0">
            <components_1.DateSelect value={interval} onValueChange={onIntervalChange} dateRange={dateRange} onDateRangeChange={setDateRange}/>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton variant="secondary" icon={<lu_1.LuEllipsisVertical />} aria-label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["More"], ["More"])))}/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent align="end">
                <react_1.DropdownMenuItem>
                  <CSVLink_1.CSVLink data={csvData} filename={csvFilename} className="flex flex-row items-center gap-2">
                    <react_1.DropdownMenuIcon icon={<lu_1.LuFile />}/>
                    <macro_1.Trans>Export CSV</macro_1.Trans>
                  </CSVLink_1.CSVLink>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </react_1.CardAction>
        </div>
        <react_1.CardContent className="flex-col gap-4">
          <react_1.VStack className="pl-[3px]" spacing={0}>
            {isFetching ? (<div className="flex flex-col gap-0.5 w-full">
                <react_1.Skeleton className="h-8 w-[120px]"/>
                <react_1.Skeleton className="h-4 w-[50px]"/>
              </div>) : (<>
                <p className="text-3xl font-medium tracking-tighter">
                  {formatValue(total)}
                </p>
                {percentageChange >= 0 ? (<react_1.Badge variant="green">+{percentageChange.toFixed(0)}%</react_1.Badge>) : (<react_1.Badge variant="red">{percentageChange.toFixed(0)}%</react_1.Badge>)}
              </>)}
          </react_1.VStack>
          <react_1.Loading isLoading={isFetching} className="h-[30dvw] md:h-[23dvw] w-full">
            {selectedKpi === "salesFunnel" ? (<FunnelChart_1.FunnelChart steps={steps} currencyFormatter={currencyCompactFormatter} numberFormatter={numberFormatter}/>) : (<Chart_1.ChartContainer config={chartConfig} className="aspect-auto h-[30dvw] md:h-[23dvw] w-full">
                <recharts_1.BarChart accessibilityLayer data={(_l = (_k = kpiFetcher.data) === null || _k === void 0 ? void 0 : _k.data) !== null && _l !== void 0 ? _l : []}>
                  <recharts_1.CartesianGrid vertical={false}/>
                  <recharts_1.YAxis dataKey="value" tickLine={false} axisLine={false} tickFormatter={function (value) {
                return ["salesOrderRevenue"].includes(selectedKpiData.key)
                    ? currencyCompactFormatter.format(value)
                    : numberFormatter.format(value);
            }}/>
                  <recharts_1.XAxis dataKey={["week", "month"].includes(interval) ? "date" : "month"} tickLine={false} tickMargin={8} minTickGap={32} axisLine={false} tickFormatter={function (value) {
                if (!value)
                    return "";
                return ["week", "month"].includes(interval)
                    ? dateFormatter.format((0, date_1.parseDate)(value).toDate((0, date_1.getLocalTimeZone)()))
                    : value.slice(0, 3);
            }}/>
                  <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent labelFormatter={["week", "month"].includes(interval)
                    ? function (value) {
                        return dateFormatter.format((0, date_1.parseDate)(value).toDate((0, date_1.getLocalTimeZone)()));
                    }
                    : function (value) { return (<span className="font-mono">{value}</span>); }} formatter={function (value) {
                    return ["salesOrderRevenue"].includes(selectedKpiData.key)
                        ? currencyFormatter.format(value)
                        : numberFormatter.format(value);
                }}/>}/>
                  <recharts_1.Bar dataKey="value" fill="var(--color-value)" radius={2}/>
                </recharts_1.BarChart>
              </Chart_1.ChartContainer>)}
          </react_1.Loading>
        </react_1.CardContent>
      </react_1.Card>
      <div className="grid w-full gap-4 grid-cols-1 lg:grid-cols-2">
        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuClock className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_1.Trans>Recently Created</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent className="p-6">
            <div className="min-h-[200px] max-h-[360px] w-full overflow-y-auto">
              {mergedOpenDocs.length > 0 ? (<react_1.Table>
                  <react_1.Thead>
                    <react_1.Tr>
                      <react_1.Th>
                        <macro_1.Trans>Document</macro_1.Trans>
                      </react_1.Th>
                      <react_1.Th>
                        <macro_1.Trans>Status</macro_1.Trans>
                      </react_1.Th>
                      <react_1.Th>
                        <macro_1.Trans>Customer</macro_1.Trans>
                      </react_1.Th>
                    </react_1.Tr>
                  </react_1.Thead>
                  <react_1.Tbody>
                    {mergedOpenDocs.map(function (doc) {
                switch (doc.type) {
                    case "salesOrder":
                        return (<SalesOrderDocumentRow key={doc.id} doc={doc}/>);
                    case "quote":
                        return (<QuoteDocumentRow key={doc.id} doc={doc}/>);
                    case "rfq":
                        return (<RfqDocumentRow key={doc.id} doc={doc}/>);
                    default:
                        return null;
                }
            })}
                  </react_1.Tbody>
                </react_1.Table>) : (<div className="flex justify-center items-center h-full">
                  <components_1.Empty />
                </div>)}
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuInbox className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_1.Trans>Assigned to Me</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent className="min-h-[200px]">
            <react_2.Suspense fallback={<react_1.Loading isLoading/>}>
              <react_router_1.Await resolve={assignedToMe} errorElement={<div>
                    <macro_1.Trans>Error loading assigned documents</macro_1.Trans>
                  </div>}>
                {function (assignedDocs) {
            return assignedDocs.length > 0 ? (<react_1.Table>
                      <react_1.Thead>
                        <react_1.Tr>
                          <react_1.Th>
                            <macro_1.Trans>Document</macro_1.Trans>
                          </react_1.Th>
                          <react_1.Th>
                            <macro_1.Trans>Status</macro_1.Trans>
                          </react_1.Th>
                          <react_1.Th>
                            <macro_1.Trans>Customer</macro_1.Trans>
                          </react_1.Th>
                        </react_1.Tr>
                      </react_1.Thead>
                      <react_1.Tbody>
                        {assignedDocs.map(function (doc) {
                    switch (doc.type) {
                        case "salesOrder":
                            return (<SalesOrderDocumentRow key={doc.id} doc={doc}/>);
                        case "quote":
                            return (<QuoteDocumentRow key={doc.id} doc={doc}/>);
                        case "rfq":
                            return (<RfqDocumentRow key={doc.id} doc={doc}/>);
                        default:
                            return null;
                    }
                })}
                      </react_1.Tbody>
                    </react_1.Table>) : (<div className="flex justify-center items-center h-full">
                      <components_1.Empty />
                    </div>);
        }}
              </react_router_1.Await>
            </react_2.Suspense>
          </react_1.CardContent>
        </react_1.Card>
      </div>
    </div>);
}
function SalesOrderDocumentRow(_a) {
    var doc = _a.doc;
    return (<react_1.Tr>
      <react_1.Td>
        <components_1.Hyperlink to={path_1.path.to.salesOrder(doc.id)}>
          <react_1.HStack spacing={1}>
            <ri_1.RiProgress8Line className="size-4"/>
            <span>{doc.salesOrderId}</span>
          </react_1.HStack>
        </components_1.Hyperlink>
      </react_1.Td>
      <react_1.Td>
        <SalesOrder_1.SalesStatus status={doc.status}/>
      </react_1.Td>
      <react_1.Td>
        <components_1.CustomerAvatar customerId={doc.customerId}/>
      </react_1.Td>
    </react_1.Tr>);
}
function QuoteDocumentRow(_a) {
    var doc = _a.doc;
    return (<react_1.Tr>
      <react_1.Td>
        <components_1.Hyperlink to={path_1.path.to.quote(doc.id)}>
          <react_1.HStack spacing={1}>
            <ri_1.RiProgress4Line className="size-4"/>
            <span>{doc.quoteId}</span>
          </react_1.HStack>
        </components_1.Hyperlink>
      </react_1.Td>
      <react_1.Td>
        <QuoteStatus_1.default status={doc.status}/>
      </react_1.Td>
      <react_1.Td>
        <components_1.CustomerAvatar customerId={doc.customerId}/>
      </react_1.Td>
    </react_1.Tr>);
}
function RfqDocumentRow(_a) {
    var doc = _a.doc;
    return (<react_1.Tr>
      <react_1.Td>
        <components_1.Hyperlink to={path_1.path.to.salesRfq(doc.id)}>
          <react_1.HStack spacing={1}>
            <ri_1.RiProgress2Line className="size-4"/>
            <span>{doc.rfqId}</span>
          </react_1.HStack>
        </components_1.Hyperlink>
      </react_1.Td>
      <react_1.Td>
        <SalesRFQ_1.SalesRFQStatus status={doc.status}/>
      </react_1.Td>
      <react_1.Td>
        <components_1.CustomerAvatar customerId={doc.customerId}/>
      </react_1.Td>
    </react_1.Tr>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
