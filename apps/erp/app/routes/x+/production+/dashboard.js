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
exports.default = ProductionDashboard;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var Chart_1 = require("@carbon/react/Chart");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var recharts_1 = require("recharts");
var components_1 = require("~/components");
var CSVLink_1 = require("~/components/CSVLink");
var Navigation_1 = require("~/components/Layout/Navigation");
var useUser_1 = require("~/hooks/useUser");
var production_1 = require("~/modules/production");
var Jobs_1 = require("~/modules/production/ui/Jobs");
var resources_1 = require("~/modules/resources");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var OPEN_JOB_STATUSES = ["Ready", "In Progress", "Paused"];
var chartConfig = {
    value: {
        color: "hsl(var(--primary))"
    },
    actual: {
        color: "hsl(var(--chart-1))",
        label: "Actual"
    },
    estimate: {
        color: "hsl(var(--chart-2))",
        label: "Estimate"
    }
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, _d, activeJobs, assignedJobs, workCenters;
        var _e, _f, _g, _h, _j;
        var request = _b.request;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production"
                    })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("job")
                                .select("id,status,assignee")
                                .eq("companyId", companyId)
                                .in("status", OPEN_JOB_STATUSES),
                            client
                                .from("job")
                                .select("id,status,assignee")
                                .eq("companyId", companyId)
                                .eq("assignee", userId),
                            (0, resources_1.getWorkCentersListWithBlockingStatus)(client, companyId)
                        ])];
                case 2:
                    _d = _k.sent(), activeJobs = _d[0], assignedJobs = _d[1], workCenters = _d[2];
                    return [2 /*return*/, {
                            activeJobs: (_f = (_e = activeJobs.data) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0,
                            assignedJobs: (_h = (_g = assignedJobs.data) === null || _g === void 0 ? void 0 : _g.length) !== null && _h !== void 0 ? _h : 0,
                            workCenters: (_j = workCenters.data) !== null && _j !== void 0 ? _j : [],
                            events: (0, production_1.getActiveProductionEvents)(client, companyId)
                        }];
            }
        });
    });
}
function ProductionDashboard() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var t = (0, macro_1.useLingui)().t;
    var _q = (0, react_router_1.useLoaderData)(), activeJobs = _q.activeJobs, assignedJobs = _q.assignedJobs, events = _q.events, workCenters = _q.workCenters;
    var user = (0, useUser_1.useUser)();
    var kpiFetcher = (0, react_router_1.useFetcher)();
    var isFetching = kpiFetcher.state !== "idle" || !kpiFetcher.data;
    var _r = (0, react_2.useState)("month"), interval = _r[0], setInterval = _r[1];
    var _s = (0, react_2.useState)("utilization"), selectedKpi = _s[0], setSelectedKpi = _s[1];
    var _t = (0, react_2.useState)(function () {
        var end = (0, date_1.toCalendarDateTime)((0, date_1.now)("UTC"));
        var start = end.add({ months: -1 });
        return { start: start, end: end };
    }), dateRange = _t[0], setDateRange = _t[1];
    var selectedKpiData = production_1.KPIs.find(function (k) { return k.key === selectedKpi; }) || production_1.KPIs[0];
    var kpiLabels = (0, react_2.useMemo)(function () { return ({
        utilization: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Work Center Utilization"], ["Work Center Utilization"]))),
        estimatesVsActuals: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Estimates vs Actuals"], ["Estimates vs Actuals"]))),
        completionTime: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Completion Time"], ["Completion Time"])))
    }); }, [t]);
    var kpiEmptyMessages = (0, react_2.useMemo)(function () { return ({
        utilization: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["No work center utilization data within range"], ["No work center utilization data within range"]))),
        estimatesVsActuals: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["No completed jobs within range"], ["No completed jobs within range"]))),
        completionTime: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["No completed jobs within range"], ["No completed jobs within range"])))
    }); }, [t]);
    var totalTimeInInterval = (0, react_2.useMemo)(function () {
        if (!dateRange)
            return 0;
        return dateRange.end.compare(dateRange.start) * 24 * 60 * 60 * 1000;
    }, [dateRange]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        kpiFetcher.load("".concat(path_1.path.to.api.productionKpi(selectedKpiData.key), "?start=").concat(dateRange === null || dateRange === void 0 ? void 0 : dateRange.start.toString(), "&end=").concat(dateRange === null || dateRange === void 0 ? void 0 : dateRange.end.toString(), "&interval=").concat(interval));
    }, [selectedKpi, dateRange, interval, selectedKpiData.key]);
    var onIntervalChange = function (value) {
        var end = (0, date_1.toCalendarDateTime)((0, date_1.now)("UTC"));
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
        var data = kpiFetcher.data.data;
        if (selectedKpi === "utilization") {
            return {
                // @ts-expect-error
                value: data.reduce(function (acc, item) { return acc + item.value; }, 0)
            };
        }
        if (selectedKpi === "completionTime") {
            if (data.length === 0)
                return { value: 0 };
            return {
                // @ts-expect-error
                value: data.reduce(function (acc, item) { return acc + item.value; }, 0) / data.length
            };
        }
        if (selectedKpi === "estimatesVsActuals") {
            return {
                // @ts-expect-error
                value: data.reduce(function (acc, item) { return acc + item.actual; }, 0)
            };
        }
        return { value: 0 };
    }, [(_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data, selectedKpi]);
    var previousTotalData = (0, react_2.useMemo)(function () {
        var _a, _b;
        if (selectedKpi === "estimatesVsActuals") {
            if (!((_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data))
                return null;
            return {
                value: kpiFetcher.data.data.reduce(
                // @ts-expect-error TS2339 - TODO: fix type
                function (acc, item) { return acc + item.estimate; }, 0)
            };
        }
        if (!((_b = kpiFetcher.data) === null || _b === void 0 ? void 0 : _b.previousPeriodData))
            return null;
        var data = kpiFetcher.data.previousPeriodData;
        if (selectedKpi === "utilization") {
            return {
                value: data.reduce(function (acc, item) { return acc + item.value; }, 0)
            };
        }
        if (selectedKpi === "completionTime") {
            if (data.length === 0)
                return { value: 0 };
            return {
                value: data.reduce(function (acc, item) { return acc + item.value; }, 0) / data.length
            };
        }
        return { value: 0 };
    }, [(_b = kpiFetcher.data) === null || _b === void 0 ? void 0 : _b.data, (_c = kpiFetcher.data) === null || _c === void 0 ? void 0 : _c.previousPeriodData, selectedKpi]);
    var total = (_d = totalData === null || totalData === void 0 ? void 0 : totalData.value) !== null && _d !== void 0 ? _d : 0;
    var previousTotal = (_e = previousTotalData === null || previousTotalData === void 0 ? void 0 : previousTotalData.value) !== null && _e !== void 0 ? _e : 0;
    var percentageChange = previousTotal === 0
        ? total > 0
            ? 100
            : 0
        : ((total - previousTotal) / previousTotal) * 100;
    var formatValue = function (value) {
        return (0, utils_1.formatDurationMilliseconds)(value);
    };
    var csvData = (0, react_2.useMemo)(function () {
        var _a;
        if (!((_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data))
            return [];
        switch (selectedKpiData.key) {
            case "utilization":
                return __spreadArray([
                    ["Work Center", "Utilization (%)"]
                ], kpiFetcher.data.data.map(function (item) { return [
                    item.key,
                    // @ts-expect-error
                    (item.value / totalTimeInInterval) * 100
                ]; }), true);
            case "estimatesVsActuals":
                return __spreadArray([
                    ["Job", "Actual (ms)", "Estimate (ms)"]
                ], kpiFetcher.data.data.map(function (item) { return [
                    item.key,
                    // @ts-expect-error
                    item.actual,
                    // @ts-expect-error
                    item.estimate
                ]; }), true);
            default:
                return [];
        }
    }, [(_f = kpiFetcher.data) === null || _f === void 0 ? void 0 : _f.data, selectedKpiData.key, totalTimeInInterval]);
    var csvFilename = (0, react_2.useMemo)(function () {
        var startDate = dateRange === null || dateRange === void 0 ? void 0 : dateRange.start.toString();
        var endDate = dateRange === null || dateRange === void 0 ? void 0 : dateRange.end.toString();
        return "".concat(kpiLabels[selectedKpiData.key], "_").concat(startDate, "_to_").concat(endDate, ".csv");
    }, [dateRange, kpiLabels, selectedKpiData.key]);
    var yAxisWidth = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((((_b = (_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.reduce(function (max, wc) {
            var _a;
            return Math.max(max, ((_a = wc === null || wc === void 0 ? void 0 : wc.key) === null || _a === void 0 ? void 0 : _a.length) || 0);
        }, 0)) || 0) * 10);
    }, [(_g = kpiFetcher.data) === null || _g === void 0 ? void 0 : _g.data]);
    return (<div className="@container flex flex-col gap-4 w-full p-4 h-[calc(100dvh-var(--header-height))] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-muted-foreground">
      <react_1.HStack spacing={1} className="hidden md:flex">
        <Navigation_1.CollapsibleSidebarTrigger />
        <react_1.Heading size="h2">
          <macro_1.Trans>Dashboard</macro_1.Trans>
        </react_1.Heading>
      </react_1.HStack>
      <div className="grid w-full gap-y-4 lg:gap-x-4 grid-cols-1 lg:grid-cols-6">
        <react_1.Card className="col-span-full lg:col-span-3">
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuCirclePlay className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_1.Trans>Active Jobs</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {activeJobs}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.jobs, "?filter=status:in:").concat(OPEN_JOB_STATUSES.join(","))}>
                  <macro_1.Trans>View Active Jobs</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card className="col-span-full lg:col-span-3">
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuInbox className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_1.Trans>Jobs Assigned to Me</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>

          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {assignedJobs}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.jobs, "?filter=assignee:eq:").concat(user.id)}>
                  <macro_1.Trans>View Assigned Jobs</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card className="col-span-full">
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
                    <react_1.DropdownMenuRadioGroup value={selectedKpi} 
    // @ts-expect-error
    onValueChange={setSelectedKpi}>
                      {production_1.KPIs.map(function (kpi) { return (<react_1.DropdownMenuRadioItem key={kpi.key} value={kpi.key}>
                          {kpiLabels[kpi.key]}
                        </react_1.DropdownMenuRadioItem>); })}
                    </react_1.DropdownMenuRadioGroup>
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>
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
          <react_1.CardContent className="min-h-[320px] flex-col gap-4">
            <react_1.VStack className="pl-[3px]" spacing={0}>
              {isFetching ? (<div className="flex flex-col gap-0.5 w-full">
                  <react_1.Skeleton className="h-8 w-[120px]"/>
                  <react_1.Skeleton className="h-4 w-[50px]"/>
                </div>) : (<>
                  <p className="text-3xl font-medium tracking-tighter">
                    {formatValue(total)}
                  </p>
                  {percentageChange >= 0 ? (<react_1.Badge variant="green">
                      +{percentageChange.toFixed(0)}%
                    </react_1.Badge>) : (<react_1.Badge variant="red">{percentageChange.toFixed(0)}%</react_1.Badge>)}
                </>)}
            </react_1.VStack>
            {kpiFetcher.state === "idle" &&
            ((_j = (_h = kpiFetcher.data) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.length) === 0 ? (<div className="flex flex-col items-center justify-center h-full">
                <components_1.Empty className="py-8">
                  <p className="text-sm text-muted-foreground">
                    {kpiEmptyMessages[selectedKpiData.key]}
                  </p>
                </components_1.Empty>
              </div>) : (<react_1.Loading isLoading={isFetching} className="w-full">
                <Chart_1.ChartContainer config={chartConfig} style={{
                height: "".concat(((_m = (_l = (_k = kpiFetcher.data) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.length) !== null && _m !== void 0 ? _m : 5) *
                    (selectedKpi === "estimatesVsActuals" ? 80 : 40), "px")
            }}>
                  <recharts_1.BarChart accessibilityLayer data={(_p = (_o = kpiFetcher.data) === null || _o === void 0 ? void 0 : _o.data) !== null && _p !== void 0 ? _p : []} layout="vertical" margin={{
                right: 30
            }}>
                    <recharts_1.YAxis dataKey="key" type="category" tickLine={false} axisLine={false} width={yAxisWidth}/>
                    <recharts_1.XAxis type="number" hide/>

                    {selectedKpi === "utilization" && (<>
                        <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent formatter={function (value) {
                        var percentage = totalTimeInInterval === 0
                            ? "0.00"
                            : ((value /
                                totalTimeInInterval) *
                                100).toFixed(2);
                        return (<div className="flex flex-col gap-1">
                                    <div className="font-medium font-mono">
                                      {percentage}%
                                    </div>
                                    <div className="font-mono">
                                      {(0, utils_1.formatDurationMilliseconds)(value)}
                                    </div>
                                  </div>);
                    }}/>}/>

                        <recharts_1.Bar dataKey="value" fill="var(--color-value)" radius={2}>
                          <recharts_1.LabelList dataKey="value" position="right" formatter={function (value) {
                    var percentage = totalTimeInInterval === 0
                        ? "0.00"
                        : ((value / totalTimeInInterval) *
                            100).toFixed(2);
                    return "".concat(percentage, "%");
                }} offset={8} className="fill-foreground" fontSize={12}/>
                        </recharts_1.Bar>
                      </>)}
                    {selectedKpi === "estimatesVsActuals" && (<>
                        <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent formatter={function (value, name) {
                        return (<div className="min-w-64 flex justify-between gap-1">
                                    <div className="font-medium">
                                      {(0, string_1.capitalize)(name)}
                                    </div>
                                    <div className="font-mono">
                                      {(0, utils_1.formatDurationMilliseconds)(value)}
                                    </div>
                                  </div>);
                    }}/>}/>

                        <Chart_1.ChartLegend content={<Chart_1.ChartLegendContent />}/>
                        <recharts_1.Bar dataKey="actual" fill="var(--color-actual)" radius={2}/>
                        <recharts_1.Bar dataKey="estimate" fill="var(--color-estimate)" radius={2}/>
                      </>)}
                    {selectedKpi === "completionTime" && (<>
                        <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent labelFormatter={function (value) { return value; }} formatter={function (value) { return (<span className="font-mono">
                                  {(0, utils_1.formatDurationMilliseconds)(value)}
                                </span>); }}/>}/>
                        <recharts_1.Bar dataKey="value" fill="var(--color-value)" radius={2}/>
                      </>)}
                  </recharts_1.BarChart>
                </Chart_1.ChartContainer>
              </react_1.Loading>)}
          </react_1.CardContent>
        </react_1.Card>
      </div>

      <div className="w-full">
        <react_2.Suspense fallback={null}>
          <react_router_1.Await resolve={events}>
            {function (resolvedEvents) {
            var _a;
            return (<WorkCenterCards events={(_a = resolvedEvents.data) !== null && _a !== void 0 ? _a : []} 
            // @ts-expect-error TS2322 - TODO: fix type
            workCenters={workCenters}/>);
        }}
          </react_router_1.Await>
        </react_2.Suspense>
      </div>
    </div>);
}
function WorkCenterCards(_a) {
    var _this = this;
    var initialEvents = _a.events, workCenters = _a.workCenters;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(initialEvents), events = _b[0], setEvents = _b[1];
    var _c = (0, react_2.useState)(initialEvents.reduce(function (acc, event) {
        if (event.id) {
            acc[event.jobOperationId] = {
                jobId: event.jobId,
                jobReadableId: event.jobReadableId,
                salesOrderId: event.salesOrderId,
                salesOrderReadableId: event.salesOrderReadableId,
                salesOrderLineId: event.salesOrderLineId,
                customerId: event.customerId,
                description: event.description,
                dueDate: event.dueDate,
                deadlineType: event.deadlineType
            };
        }
        return acc;
    }, {})), jobOperationMetaData = _c[0], setJobOperationMetaData = _c[1];
    var eventsByWorkCenterId = workCenters.reduce(function (acc, workCenter) {
        var wcEvents = events.filter(function (event) { return event.workCenterId === workCenter.id; });
        if (wcEvents.length === 0) {
            acc[workCenter.id] = {
                hasEvents: false
            };
            return acc;
        }
        var firstEvent = wcEvents === null || wcEvents === void 0 ? void 0 : wcEvents[0];
        if (!firstEvent) {
            acc[workCenter.id] = {
                hasEvents: false
            };
            return acc;
        }
        var jobOperationId = firstEvent.jobOperationId;
        var employeeIds = (0, utils_1.pluckUnique)(wcEvents, function (event) { return event.employeeId; });
        // Count unique jobs and descriptions
        var uniqueJobs = new Set(wcEvents
            .filter(function (event) { return event.jobId && event.workCenterId === workCenter.id; })
            .map(function (event) { return event.jobId; })).size;
        var uniqueDescriptions = new Set(wcEvents
            .filter(function (event) { return event.description && event.workCenterId === workCenter.id; })
            .map(function (event) { return event.description; })).size;
        if (workCenter.id) {
            acc[workCenter.id] = __assign(__assign({ hasEvents: true, employeeIds: employeeIds }, jobOperationMetaData[jobOperationId]), { descriptionCount: uniqueDescriptions, jobCount: uniqueJobs });
        }
        return acc;
    }, {});
    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    var _d = (0, auth_1.useCarbon)(), carbon = _d.carbon, accessToken = _d.accessToken;
    var companyId = (0, useUser_1.useUser)().company.id;
    var ensureMetaData = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var jobOperation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (jobOperationMetaData[event.jobOperationId]) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("jobOperation").select("description, ...job(jobId:id, jobReadableId:jobId, customerId, dueDate, deadlineType, salesOrderLineId, ...salesOrderLine(...salesOrder(salesOrderId:id, salesOrderReadableId:salesOrderId)))").eq("id", event.jobOperationId).single())];
                case 1:
                    jobOperation = _a.sent();
                    if (jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.data) {
                        (0, react_dom_1.flushSync)(function () {
                            setJobOperationMetaData(function (prev) {
                                var _a;
                                return (__assign(__assign({}, prev), (_a = {}, _a[event.jobOperationId] = jobOperation.data, _a)));
                            });
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_2.useEffect)(function () {
        setEvents(initialEvents);
    }, [initialEvents]);
    (0, react_1.useRealtimeChannel)({
        topic: "production-dashboard-work-centers:".concat(companyId),
        setup: function (channel) {
            return channel.on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "productionEvent",
                filter: "companyId=eq.".concat(companyId)
            }, function (payload) {
                if (payload.eventType === "INSERT") {
                    var inserted_1 = payload.new;
                    setEvents(function (prev) { return __spreadArray(__spreadArray([], prev, true), [inserted_1], false); });
                    ensureMetaData({ jobOperationId: inserted_1.jobOperationId });
                }
                else if (payload.eventType === "UPDATE") {
                    var updated_1 = payload.new;
                    setEvents(function (prev) {
                        if (updated_1.endTime) {
                            return prev.filter(function (event) { return event.id !== updated_1.id; });
                        }
                        var exists = prev.some(function (event) { return event.id === updated_1.id; });
                        if (exists) {
                            return prev.map(function (event) {
                                return event.id === updated_1.id ? __assign(__assign({}, event), updated_1) : event;
                            });
                        }
                        return __spreadArray(__spreadArray([], prev, true), [updated_1], false);
                    });
                }
                else if (payload.eventType === "DELETE") {
                    var deleted_1 = payload.old;
                    setEvents(function (prev) {
                        return prev.filter(function (event) { return event.id !== deleted_1.id; });
                    });
                }
            });
        }
    });
    return (<div className="w-full grid grid-cols-6 gap-4">
      {workCenters.map(function (workCenter) {
            var _a;
            var _b = eventsByWorkCenterId[(_a = workCenter === null || workCenter === void 0 ? void 0 : workCenter.id) !== null && _a !== void 0 ? _a : ""], hasEvents = _b.hasEvents, customerId = _b.customerId, deadlineType = _b.deadlineType, description = _b.description, descriptionCount = _b.descriptionCount, dueDate = _b.dueDate, employeeIds = _b.employeeIds, jobCount = _b.jobCount, jobId = _b.jobId, jobReadableId = _b.jobReadableId, salesOrderId = _b.salesOrderId, salesOrderReadableId = _b.salesOrderReadableId, salesOrderLineId = _b.salesOrderLineId;
            var isOverdue = deadlineType !== "No Deadline" && dueDate
                ? new Date(dueDate) < new Date()
                : false;
            var isBlocked = workCenter.isBlocked && workCenter.blockingDispatchId;
            return (<react_1.Card key={workCenter.id} className="p-0 h-[300px] col-span-6 lg:col-span-3 xl:col-span-2">
            <react_1.HStack className={(0, react_1.cn)("justify-between w-full relative rounded-t-lg", isBlocked
                    ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400"
                    : "")}>
              <react_1.CardHeader>
                <react_1.CardTitle className="line-clamp-2 text-base">
                  {workCenter.name}
                </react_1.CardTitle>
                {isBlocked && (<react_1.Tooltip>
                    <react_1.TooltipTrigger asChild>
                      <react_router_1.Link to={path_1.path.to.maintenanceDispatch(workCenter.blockingDispatchId)} className="inline-flex items-center gap-1 text-xs font-normal">
                        <span>
                          <macro_1.Trans>
                            Blocked by {workCenter.blockingDispatchReadableId}
                          </macro_1.Trans>
                        </span>
                      </react_router_1.Link>
                    </react_1.TooltipTrigger>
                    <react_1.TooltipContent>
                      <p>
                        <macro_1.Trans>View maintenance dispatch</macro_1.Trans>
                      </p>
                    </react_1.TooltipContent>
                  </react_1.Tooltip>)}
              </react_1.CardHeader>
              <react_1.CardAction className="pt-2">
                {!isBlocked && (<react_1.PulsingDot inactive={!hasEvents} className="mt-2"/>)}
              </react_1.CardAction>
            </react_1.HStack>
            <react_1.CardContent className="flex items-start justify-start p-6 pt-3 border-t">
              {!hasEvents ? (<p className="text-muted-foreground text-center w-full h-full flex flex-col gap-2 items-center justify-center text-sm">
                  <macro_1.Trans>Inactive</macro_1.Trans>
                </p>) : (<div className="flex flex-col gap-2 items-start justify-start text-sm">
                  {jobId && jobReadableId && (<react_1.HStack className="justify-start space-x-2">
                      <lu_1.LuCirclePlay className="text-muted-foreground flex-shrink-0"/>
                      <components_1.Hyperlink to={path_1.path.to.job(jobId)} className="truncate">
                        {jobReadableId}
                      </components_1.Hyperlink>
                      {jobCount !== undefined &&
                            Number.isInteger(jobCount) &&
                            jobCount > 1 && (<div className="text-muted-foreground font-mono font-semibold flex items-center justify-center flex-shrink-0">
                            {"+".concat(jobCount - 1)}
                          </div>)}
                    </react_1.HStack>)}

                  {description && (<react_1.HStack className="justify-start space-x-2">
                      <lu_1.LuClipboardCheck className="text-muted-foreground flex-shrink-0"/>
                      <span className="text-sm line-clamp-1 truncate">
                        {description}
                      </span>
                      {descriptionCount !== undefined &&
                            Number.isInteger(descriptionCount) &&
                            descriptionCount > 1 && (<div className="text-muted-foreground font-mono font-semibold flex items-center justify-center flex-shrink-0">
                            {"+".concat(descriptionCount - 1)}
                          </div>)}
                    </react_1.HStack>)}

                  {salesOrderId && salesOrderLineId && salesOrderReadableId && (<react_1.HStack className="justify-start space-x-2">
                      <ri_1.RiProgress8Line className="text-muted-foreground flex-shrink-0"/>
                      <components_1.Hyperlink to={path_1.path.to.salesOrderLine(salesOrderId, salesOrderLineId)} className="truncate">
                        {salesOrderReadableId}
                      </components_1.Hyperlink>
                    </react_1.HStack>)}

                  {customerId && (<react_1.HStack className="justify-start space-x-2">
                      <lu_1.LuInbox className="text-muted-foreground flex-shrink-0"/>
                      <components_1.CustomerAvatar customerId={customerId}/>
                    </react_1.HStack>)}

                  {deadlineType && (<react_1.HStack className="justify-start space-x-2">
                      {(0, Jobs_1.getDeadlineIcon)(deadlineType)}
                      <react_1.Tooltip>
                        <react_1.TooltipTrigger>
                          <span className={(0, react_1.cn)("text-sm truncate", isOverdue ? "text-red-500" : "")}>
                            {["ASAP", "No Deadline"].includes(deadlineType)
                            ? deadlineType
                            : dueDate
                                ? t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Due ", ""], ["Due ", ""])), (0, utils_1.formatRelativeTime)((0, utils_1.convertDateStringToIsoString)(dueDate))) : "–"}
                          </span>
                        </react_1.TooltipTrigger>
                        <react_1.TooltipContent side="right">
                          {deadlineType}
                        </react_1.TooltipContent>
                      </react_1.Tooltip>
                    </react_1.HStack>)}
                </div>)}
            </react_1.CardContent>
            {(employeeIds === null || employeeIds === void 0 ? void 0 : employeeIds.length) ? (<react_1.CardFooter className="border-t py-3 bg-muted/30 text-sm">
                {employeeIds.length > 1 ? (<components_1.EmployeeAvatarGroup employeeIds={employeeIds.filter(function (id) { return id !== null; })}/>) : (<components_1.EmployeeAvatar employeeId={employeeIds[0]}/>)}
              </react_1.CardFooter>) : (<react_1.CardFooter className="h-[49px]"/>)}
          </react_1.Card>);
        })}
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
