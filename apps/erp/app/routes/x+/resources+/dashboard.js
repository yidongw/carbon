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
exports.default = MaintenanceDashboard;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var Chart_1 = require("@carbon/react/Chart");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var recharts_1 = require("recharts");
var components_1 = require("~/components");
var CSVLink_1 = require("~/components/CSVLink");
var WorkCenters_1 = require("~/components/Form/WorkCenters");
var Navigation_1 = require("~/components/Layout/Navigation");
var useCurrencyFormatter_1 = require("~/hooks/useCurrencyFormatter");
var resources_models_1 = require("~/modules/resources/resources.models");
var MaintenanceSource_1 = require("~/modules/resources/ui/Maintenance/MaintenanceSource");
var MaintenanceStatus_1 = require("~/modules/resources/ui/Maintenance/MaintenanceStatus");
var path_1 = require("~/utils/path");
var OPEN_STATUSES = ["Open", "Assigned", "In Progress"];
var chartConfig = {
    value: {
        color: "hsl(var(--primary))"
    }
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, _d, openDispatches, openScheduled, openReactive, recentlyCreated, assignedToMe;
        var _e, _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "resources"
                    })];
                case 1:
                    _c = _j.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("maintenanceDispatch")
                                .select("id", { count: "exact" })
                                .in("status", OPEN_STATUSES)
                                .eq("companyId", companyId),
                            client
                                .from("maintenanceDispatch")
                                .select("id", { count: "exact" })
                                .in("status", OPEN_STATUSES)
                                .eq("source", "Scheduled")
                                .eq("companyId", companyId),
                            client
                                .from("maintenanceDispatch")
                                .select("id", { count: "exact" })
                                .in("status", OPEN_STATUSES)
                                .eq("source", "Reactive")
                                .eq("companyId", companyId),
                            client
                                .from("maintenanceDispatch")
                                .select("id, maintenanceDispatchId, status, source, priority, workCenterId, createdAt, assignee")
                                .eq("companyId", companyId)
                                .order("createdAt", { ascending: false })
                                .limit(10)
                        ])];
                case 2:
                    _d = _j.sent(), openDispatches = _d[0], openScheduled = _d[1], openReactive = _d[2], recentlyCreated = _d[3];
                    assignedToMe = client
                        .from("maintenanceDispatch")
                        .select("id, maintenanceDispatchId, status, source, priority, workCenterId, createdAt")
                        .eq("companyId", companyId)
                        .eq("assignee", userId)
                        .in("status", OPEN_STATUSES)
                        .order("priority", { ascending: false })
                        .limit(10)
                        .then(function (result) { var _a; return (_a = result.data) !== null && _a !== void 0 ? _a : []; });
                    return [2 /*return*/, {
                            openDispatches: (_e = openDispatches.count) !== null && _e !== void 0 ? _e : 0,
                            openScheduled: (_f = openScheduled.count) !== null && _f !== void 0 ? _f : 0,
                            openReactive: (_g = openReactive.count) !== null && _g !== void 0 ? _g : 0,
                            recentlyCreated: (_h = recentlyCreated.data) !== null && _h !== void 0 ? _h : [],
                            assignedToMe: assignedToMe
                        }];
            }
        });
    });
}
function MaintenanceDashboard() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var t = (0, macro_1.useLingui)().t;
    var _k = (0, react_router_1.useLoaderData)(), openDispatches = _k.openDispatches, openScheduled = _k.openScheduled, openReactive = _k.openReactive, recentlyCreated = _k.recentlyCreated, assignedToMe = _k.assignedToMe;
    var kpiFetcher = (0, react_router_1.useFetcher)();
    var isFetching = kpiFetcher.state !== "idle" || !kpiFetcher.data;
    var dateFormatter = (0, i18n_1.useDateFormatter)({
        month: "short",
        day: "numeric"
    });
    var currencyFormatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)();
    var numberFormatter = (0, i18n_1.useNumberFormatter)({
        maximumFractionDigits: 0,
        notation: "compact",
        compactDisplay: "short"
    });
    var _l = (0, react_2.useState)("all"), workCenterId = _l[0], setWorkCenterId = _l[1];
    var workCenters = (0, WorkCenters_1.useWorkCenters)();
    var workCenterOptions = (0, react_2.useMemo)(function () {
        return __spreadArray([
            { label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["All Work Centers"], ["All Work Centers"]))), value: "all" }
        ], workCenters.map(function (wc) { return ({
            label: wc.label,
            value: wc.value
        }); }), true);
    }, [workCenters, t]);
    var _m = (0, react_2.useState)("month"), interval = _m[0], setInterval = _m[1];
    var _o = (0, react_2.useState)("mttr"), selectedKpi = _o[0], setSelectedKpi = _o[1];
    var _p = (0, react_2.useState)(function () {
        var end = (0, date_1.today)("UTC");
        var start = end.add({ months: -1 });
        return { start: start, end: end };
    }), dateRange = _p[0], setDateRange = _p[1];
    var selectedKpiData = resources_models_1.MaintenanceKPIs.find(function (k) { return k.key === selectedKpi; }) || resources_models_1.MaintenanceKPIs[0];
    var kpiLabels = (0, react_2.useMemo)(function () { return ({
        mttr: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Mean Time To Repair"], ["Mean Time To Repair"]))),
        mtbf: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Mean Time Between Failures"], ["Mean Time Between Failures"]))),
        sparePartCost: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Spare Part Cost"], ["Spare Part Cost"]))),
        worstPerformingMachines: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Worst Performing Machines"], ["Worst Performing Machines"]))),
        sparePartConsumption: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Spare Part Consumption"], ["Spare Part Consumption"])))
    }); }, [t]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: deps are intentionally limited
    (0, react_2.useEffect)(function () {
        kpiFetcher.load("".concat(path_1.path.to.api.resourcesKpi(selectedKpiData.key), "?start=").concat(dateRange === null || dateRange === void 0 ? void 0 : dateRange.start.toString(), "&end=").concat(dateRange === null || dateRange === void 0 ? void 0 : dateRange.end.toString(), "&interval=").concat(interval).concat(workCenterId === "all" ? "" : "&workCenterId=".concat(workCenterId)));
    }, [selectedKpi, dateRange, interval, selectedKpiData.key, workCenterId]);
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
        var _a;
        if (!((_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data))
            return null;
        // For time-based KPIs (MTTR, MTBF), calculate weighted average
        if (selectedKpi === "mttr" || selectedKpi === "mtbf") {
            var nonZeroValues = kpiFetcher.data.data.filter(function (d) { return d.value > 0; });
            if (nonZeroValues.length === 0)
                return { value: 0 };
            return {
                value: nonZeroValues.reduce(function (acc, curr) { return acc + curr.value; }, 0) /
                    nonZeroValues.length
            };
        }
        // For worst performing machines, sum all failures
        if (selectedKpi === "worstPerformingMachines") {
            return {
                value: kpiFetcher.data.data.reduce(function (acc, curr) { return acc + curr.value; }, 0)
            };
        }
        // For other KPIs, sum the values
        return {
            value: kpiFetcher.data.data.reduce(function (acc, curr) { return acc + curr.value; }, 0)
        };
    }, [(_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data, selectedKpi]);
    var previousTotalData = (0, react_2.useMemo)(function () {
        var _a;
        if (!((_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.previousPeriodData))
            return null;
        // For time-based KPIs (MTTR, MTBF), calculate weighted average
        if (selectedKpi === "mttr" || selectedKpi === "mtbf") {
            var nonZeroValues = kpiFetcher.data.previousPeriodData.filter(function (d) { return d.value > 0; });
            if (nonZeroValues.length === 0)
                return { value: 0 };
            return {
                value: nonZeroValues.reduce(function (acc, curr) { return acc + curr.value; }, 0) /
                    nonZeroValues.length
            };
        }
        if (selectedKpi === "worstPerformingMachines") {
            return {
                value: kpiFetcher.data.previousPeriodData.reduce(function (acc, curr) { return acc + curr.value; }, 0)
            };
        }
        return {
            value: kpiFetcher.data.previousPeriodData.reduce(function (acc, curr) { return acc + curr.value; }, 0)
        };
    }, [(_b = kpiFetcher.data) === null || _b === void 0 ? void 0 : _b.previousPeriodData, selectedKpi]);
    var total = (_c = totalData === null || totalData === void 0 ? void 0 : totalData.value) !== null && _c !== void 0 ? _c : 0;
    var previousTotal = (_d = previousTotalData === null || previousTotalData === void 0 ? void 0 : previousTotalData.value) !== null && _d !== void 0 ? _d : 0;
    var percentageChange = previousTotal === 0
        ? total > 0
            ? 100
            : 0
        : ((total - previousTotal) / previousTotal) * 100;
    // For MTTR, lower is better (faster repairs). For MTBF, higher is better (longer time between failures)
    var isLowerBetter = selectedKpi === "mttr";
    var isBadgePositive = isLowerBetter
        ? percentageChange <= 0
        : percentageChange >= 0;
    var formatValue = function (value) {
        // Time-based KPIs (MTTR, MTBF) - value is in seconds
        if (selectedKpi === "mttr" || selectedKpi === "mtbf") {
            return (0, utils_1.formatDurationMilliseconds)(value * 1000, { style: "short" });
        }
        // Cost-based KPIs
        if (selectedKpi === "sparePartCost") {
            return currencyFormatter.format(value);
        }
        // Count-based KPIs
        return numberFormatter.format(value);
    };
    var csvData = (0, react_2.useMemo)(function () {
        var _a;
        if (!((_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data))
            return [];
        if (selectedKpi === "worstPerformingMachines") {
            return __spreadArray([
                ["Work Center", "Failures"]
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
    }, [(_e = kpiFetcher.data) === null || _e === void 0 ? void 0 : _e.data, selectedKpi]);
    var csvFilename = (0, react_2.useMemo)(function () {
        var _a, _b;
        var startDate = dateRange === null || dateRange === void 0 ? void 0 : dateRange.start.toString();
        var endDate = dateRange === null || dateRange === void 0 ? void 0 : dateRange.end.toString();
        return "".concat(((_a = kpiLabels[selectedKpiData.key]) !== null && _a !== void 0 ? _a : "").replace(/ /g, "_"), "_").concat(startDate, "_to_").concat(endDate).concat(workCenterId === "all"
            ? ""
            : "_".concat((_b = workCenters.find(function (wc) { return wc.value === workCenterId; })) === null || _b === void 0 ? void 0 : _b.label), ".csv");
    }, [
        dateRange === null || dateRange === void 0 ? void 0 : dateRange.start,
        dateRange === null || dateRange === void 0 ? void 0 : dateRange.end,
        kpiLabels,
        selectedKpiData.key,
        workCenterId,
        workCenters
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
            <lu_1.LuWrench className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_1.Trans>Open Dispatches</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {openDispatches}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.maintenanceDispatches, "?filter=status:in:").concat(OPEN_STATUSES.join(","))}>
                  <macro_1.Trans>View Open</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuCalendarClock className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_1.Trans>Open Scheduled</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {openScheduled}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.maintenanceDispatches, "?filter=status:in:").concat(OPEN_STATUSES.join(","), "&filter=source:eq:Scheduled")}>
                  <macro_1.Trans>View Scheduled</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuTriangleAlert className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_1.Trans>Open Reactive</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {openReactive}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.maintenanceDispatches, "?filter=status:in:").concat(OPEN_STATUSES.join(","), "&filter=source:eq:Reactive")}>
                  <macro_1.Trans>View Reactive</macro_1.Trans>
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
                    {resources_models_1.MaintenanceKPIs.map(function (kpi) { return (<react_1.DropdownMenuRadioItem key={kpi.key} value={kpi.key}>
                        {kpiLabels[kpi.key]}
                      </react_1.DropdownMenuRadioItem>); })}
                  </react_1.DropdownMenuRadioGroup>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>

              <react_1.Combobox asButton value={workCenterId} onChange={setWorkCenterId} options={workCenterOptions} size="sm" className="min-w-[160px] gap-4"/>
            </div>
          </react_1.CardHeader>
          <react_1.CardAction className="flex-row items-center gap-2 shrink-0">
            <components_1.DateSelect value={interval} onValueChange={onIntervalChange} dateRange={dateRange} onDateRangeChange={setDateRange}/>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton variant="secondary" icon={<lu_1.LuEllipsisVertical />} aria-label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["More"], ["More"])))}/>
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
                {isBadgePositive ? (<react_1.Badge variant="green">
                    {percentageChange >= 0 ? "+" : ""}
                    {percentageChange.toFixed(0)}%
                  </react_1.Badge>) : (<react_1.Badge variant="red">
                    {percentageChange >= 0 ? "+" : ""}
                    {percentageChange.toFixed(0)}%
                  </react_1.Badge>)}
              </>)}
          </react_1.VStack>
          <react_1.Loading isLoading={isFetching} className="h-[30dvw] md:h-[23dvw] w-full">
            {selectedKpi === "worstPerformingMachines" ? (<Chart_1.ChartContainer config={chartConfig} className="aspect-auto h-[30dvw] md:h-[23dvw] w-full">
                <recharts_1.BarChart accessibilityLayer layout="vertical" data={(_g = (_f = kpiFetcher.data) === null || _f === void 0 ? void 0 : _f.data) !== null && _g !== void 0 ? _g : []} margin={{ left: 20 }}>
                  <recharts_1.CartesianGrid horizontal={false}/>
                  <recharts_1.YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={150}/>
                  <recharts_1.XAxis type="number" tickLine={false} axisLine={false}/>
                  <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent formatter={function (value) {
                    return "".concat(numberFormatter.format(value), " failures");
                }}/>}/>
                  <recharts_1.Bar dataKey="value" fill="var(--color-value)" radius={2}/>
                </recharts_1.BarChart>
              </Chart_1.ChartContainer>) : (<Chart_1.ChartContainer config={chartConfig} className="aspect-auto h-[30dvw] md:h-[23dvw] w-full">
                <recharts_1.BarChart accessibilityLayer data={(_j = (_h = kpiFetcher.data) === null || _h === void 0 ? void 0 : _h.data) !== null && _j !== void 0 ? _j : []}>
                  <recharts_1.CartesianGrid vertical={false}/>
                  <recharts_1.YAxis dataKey="value" tickLine={false} axisLine={false} tickFormatter={function (value) {
                if (["mttr", "mtbf"].includes(selectedKpiData.key)) {
                    return (0, utils_1.formatDurationMilliseconds)(value * 1000, { style: "short" });
                }
                if (["sparePartCost"].includes(selectedKpiData.key)) {
                    return currencyFormatter.format(value);
                }
                return numberFormatter.format(value);
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
                    if (["mttr", "mtbf"].includes(selectedKpiData.key)) {
                        return (0, utils_1.formatDurationMilliseconds)(value * 1000);
                    }
                    if (selectedKpiData.key === "sparePartCost") {
                        return currencyFormatter.format(value);
                    }
                    return numberFormatter.format(value);
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
              {recentlyCreated.length > 0 ? (<DispatchTable data={recentlyCreated}/>) : (<div className="flex justify-center items-center h-full">
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
                    <macro_1.Trans>Error loading assigned dispatches</macro_1.Trans>
                  </div>}>
                {function (dispatches) {
            return dispatches.length > 0 ? (<DispatchTable data={dispatches}/>) : (<div className="flex justify-center items-center h-full">
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
function DispatchTable(_a) {
    var data = _a.data;
    var workCenters = (0, WorkCenters_1.useWorkCenters)();
    var getWorkCenterName = function (workCenterId) {
        var _a;
        if (!workCenterId)
            return "-";
        var wc = workCenters.find(function (w) { return w.value === workCenterId; });
        return (_a = wc === null || wc === void 0 ? void 0 : wc.label) !== null && _a !== void 0 ? _a : "-";
    };
    return (<react_1.Table>
      <react_1.Thead>
        <react_1.Tr>
          <react_1.Th>
            <macro_1.Trans>Dispatch</macro_1.Trans>
          </react_1.Th>
          <react_1.Th>
            <macro_1.Trans>Status</macro_1.Trans>
          </react_1.Th>
          <react_1.Th>
            <macro_1.Trans>Source</macro_1.Trans>
          </react_1.Th>
          <react_1.Th>
            <macro_1.Trans>Work Center</macro_1.Trans>
          </react_1.Th>
        </react_1.Tr>
      </react_1.Thead>
      <react_1.Tbody>
        {data.map(function (dispatch) { return (<react_1.Tr key={dispatch.id}>
            <react_1.Td>
              <components_1.Hyperlink to={path_1.path.to.maintenanceDispatch(dispatch.id)}>
                <react_1.HStack spacing={1}>
                  <lu_1.LuWrench className="size-4"/>
                  <span>{dispatch.maintenanceDispatchId}</span>
                </react_1.HStack>
              </components_1.Hyperlink>
            </react_1.Td>
            <react_1.Td>
              <MaintenanceStatus_1.default status={dispatch.status}/>
            </react_1.Td>
            <react_1.Td>
              <MaintenanceSource_1.default source={dispatch.source}/>
            </react_1.Td>
            <react_1.Td>{getWorkCenterName(dispatch.workCenterId)}</react_1.Td>
          </react_1.Tr>); })}
      </react_1.Tbody>
    </react_1.Table>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
