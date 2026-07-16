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
exports.handle = void 0;
exports.loader = loader;
exports.default = QualityDashboard;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var Chart_1 = require("@carbon/react/Chart");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var recharts_1 = require("recharts");
var components_1 = require("~/components");
var CSVLink_1 = require("~/components/CSVLink");
var Navigation_1 = require("~/components/Layout/Navigation");
var quality_1 = require("~/modules/quality");
var IssueStatus_1 = require("~/modules/quality/ui/Issue/IssueStatus");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Dashboard"], ["Dashboard"]))),
    to: path_1.path.to.qualityDashboard
};
var OPEN_ISSUE_STATUSES = ["Registered", "In Progress"];
var categoryKeys = new Set([
    "type",
    "status",
    "criticality",
    "priority",
    "week"
]);
function StackedBar(props) {
    var _a = props, x = _a.x, y = _a.y, width = _a.width, height = _a.height, fill = _a.fill;
    if (!height || height <= 0 || !width || width <= 0)
        return <g />;
    var gap = 2;
    return (<rect x={x} y={y} width={width} height={Math.max(height - gap, 0)} fill={fill} rx={2}/>);
}
function percentageFormatter(value, _name, item) {
    if (Array.isArray(value))
        return "".concat(value.join(", "));
    var row = item === null || item === void 0 ? void 0 : item.payload;
    var total = row
        ? Object.entries(row)
            .filter(function (_a) {
            var k = _a[0];
            return !categoryKeys.has(k);
        })
            .reduce(function (sum, _a) {
            var v = _a[1];
            return sum + (typeof v === "number" ? v : 0);
        }, 0)
        : 0;
    var pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return "".concat(value, " (").concat(pct, "%)");
}
var qualityChartConfig = {
    Critical: { label: "Critical", color: "hsl(var(--destructive))" },
    High: { label: "High", color: "hsl(var(--chart-5))" },
    Medium: { label: "Medium", color: "hsl(var(--chart-1))" },
    Low: { label: "Low", color: "hsl(var(--success))" },
    Registered: { label: "Registered", color: "hsl(var(--chart-5))" },
    "In Progress": { label: "In Progress", color: "hsl(var(--chart-1))" },
    Closed: { label: "Closed", color: "hsl(var(--success))" },
    opened: { label: "Opened", color: "hsl(var(--chart-5))" },
    closed: { label: "Closed", color: "hsl(var(--success))" },
    target: { label: "Target", color: "hsl(var(--destructive))" },
    count: { label: "Count" },
    cumulative: { label: "Cumulative %", color: "hsl(var(--chart-5))" },
    Internal: { label: "Internal", color: "hsl(var(--chart-1))" },
    External: { label: "External", color: "hsl(var(--chart-5))" },
    "0-4 weeks": { label: "0-4 weeks", color: "hsl(var(--success))" },
    "5-8 weeks": { label: "5-8 weeks", color: "hsl(var(--chart-4))" },
    "9-12 weeks": { label: "9-12 weeks", color: "hsl(var(--chart-5))" },
    "13+ weeks": { label: "13+ weeks", color: "hsl(var(--destructive))" }
};
var weeklyLegendPayload = [
    {
        value: "Opened",
        dataKey: "opened",
        type: "square",
        color: qualityChartConfig.opened.color
    },
    {
        value: "Closed",
        dataKey: "closed",
        type: "square",
        color: qualityChartConfig.closed.color
    },
    {
        value: "Target",
        dataKey: "target",
        type: "line",
        color: "hsl(var(--destructive))"
    }
];
function formatWeekLabel(weekKey, locale) {
    var match = weekKey.match(/^(\d{4})-W(\d{2})$/);
    if (!match)
        return weekKey;
    var year = Number.parseInt(match[1]);
    var week = Number.parseInt(match[2]);
    var d = new Date(Date.UTC(year, 0, 4));
    d.setUTCDate(d.getUTCDate() - (d.getUTCDay() || 7) + 1 + (week - 1) * 7);
    return d.toLocaleDateString(locale, { month: "short", day: "numeric" });
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, _d, openIssues, uncontainedIssues, containedIssues, openActions, issueTypes, companySettings, recentlyCreated, assignedToMe;
        var _e, _f, _g, _h, _j, _k, _l;
        var request = _b.request;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "quality",
                        role: "employee"
                    })];
                case 1:
                    _c = _m.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("issues")
                                .select("id", { count: "exact", head: true })
                                .eq("companyId", companyId)
                                .in("status", ["Registered", "In Progress"]),
                            client
                                .from("issues")
                                .select("id", { count: "exact", head: true })
                                .eq("companyId", companyId)
                                .in("status", ["Registered", "In Progress"])
                                .eq("containmentStatus", "Uncontained"),
                            client
                                .from("issues")
                                .select("id", { count: "exact", head: true })
                                .eq("companyId", companyId)
                                .in("status", ["Registered", "In Progress"])
                                .eq("containmentStatus", "Contained"),
                            client
                                .from("nonConformanceActionTask")
                                .select("id", { count: "exact", head: true })
                                .eq("companyId", companyId)
                                .in("status", ["Pending", "In Progress"]),
                            (0, quality_1.getIssueTypesList)(client, companyId),
                            (0, settings_1.getCompanySettings)(client, companyId),
                            client
                                .from("issues")
                                .select("id, nonConformanceId, name, status, priority, createdAt")
                                .eq("companyId", companyId)
                                .order("createdAt", { ascending: false })
                                .limit(10)
                        ])];
                case 2:
                    _d = _m.sent(), openIssues = _d[0], uncontainedIssues = _d[1], containedIssues = _d[2], openActions = _d[3], issueTypes = _d[4], companySettings = _d[5], recentlyCreated = _d[6];
                    assignedToMe = client
                        .from("issues")
                        .select("id, nonConformanceId, name, status, priority")
                        .eq("companyId", companyId)
                        .eq("assignee", userId)
                        .in("status", ["Registered", "In Progress"])
                        .order("createdAt", { ascending: false })
                        .limit(10)
                        .then(function (result) { var _a; return (_a = result.data) !== null && _a !== void 0 ? _a : []; });
                    return [2 /*return*/, {
                            openIssuesCount: (_e = openIssues.count) !== null && _e !== void 0 ? _e : 0,
                            uncontainedCount: (_f = uncontainedIssues.count) !== null && _f !== void 0 ? _f : 0,
                            containedCount: (_g = containedIssues.count) !== null && _g !== void 0 ? _g : 0,
                            openActionsCount: (_h = openActions.count) !== null && _h !== void 0 ? _h : 0,
                            issueTypes: (_j = issueTypes.data) !== null && _j !== void 0 ? _j : [],
                            qualityIssueTarget: (_k = companySettings.data) === null || _k === void 0 ? void 0 : _k.qualityIssueTarget,
                            recentlyCreated: (_l = recentlyCreated.data) !== null && _l !== void 0 ? _l : [],
                            assignedToMe: assignedToMe
                        }];
            }
        });
    });
}
// --- Priority Helpers ---
function getPriorityVariant(priority) {
    switch (priority) {
        case "Critical":
            return "red";
        case "High":
            return "orange";
        case "Medium":
            return "yellow";
        case "Low":
            return "green";
        default:
            return "gray";
    }
}
// --- Component ---
function QualityDashboard() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var _l = (0, react_router_1.useLoaderData)(), openIssuesCount = _l.openIssuesCount, containedCount = _l.containedCount, openActionsCount = _l.openActionsCount, issueTypes = _l.issueTypes, qualityIssueTarget = _l.qualityIssueTarget, recentlyCreated = _l.recentlyCreated, assignedToMe = _l.assignedToMe;
    var t = (0, macro_2.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var _m = (0, react_2.useState)("weeklyTracking"), selectedChart = _m[0], setSelectedChart = _m[1];
    var _o = (0, react_2.useState)("month"), interval = _o[0], setInterval = _o[1];
    var _p = (0, react_2.useState)("all"), issueTypeId = _p[0], setIssueTypeId = _p[1];
    var _q = (0, react_2.useState)(function () {
        var end = (0, date_1.today)("UTC");
        var start = end.add({ months: -1 });
        return { start: start, end: end };
    }), dateRange = _q[0], setDateRange = _q[1];
    var kpiFetcher = (0, react_router_1.useFetcher)();
    var avgFetcher = (0, react_router_1.useFetcher)();
    var selectedChartData = quality_1.QualityKPIs.find(function (c) { return c.key === selectedChart; }) || quality_1.QualityKPIs[0];
    var kpiLabels = (0, react_2.useMemo)(function () { return ({
        weeklyTracking: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Issue Trend"], ["Issue Trend"]))),
        statusDistribution: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Status Distribution"], ["Status Distribution"]))),
        paretoByType: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Pareto by Type"], ["Pareto by Type"]))),
        ncrsByType: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["NCRs by Type"], ["NCRs by Type"]))),
        sourceAnalysis: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Source Analysis"], ["Source Analysis"]))),
        supplierQuality: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Supplier Quality"], ["Supplier Quality"]))),
        weeksOpen: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Weeks Open"], ["Weeks Open"])))
    }); }, [t]);
    var typeOptions = (0, react_2.useMemo)(function () {
        return __spreadArray([
            { label: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["All Types"], ["All Types"]))), value: "all" }
        ], issueTypes.map(function (type) { return ({ label: type.name, value: type.id }); }), true);
    }, [issueTypes, t]);
    var onIntervalChange = function (value) {
        var end = (0, date_1.today)("UTC");
        if (value === "week") {
            setDateRange({ start: end.add({ days: -7 }), end: end });
        }
        else if (value === "month") {
            setDateRange({ start: end.add({ months: -1 }), end: end });
        }
        else if (value === "quarter") {
            setDateRange({ start: end.add({ months: -3 }), end: end });
        }
        else if (value === "year") {
            setDateRange({ start: end.add({ years: -1 }), end: end });
        }
        setInterval(value);
    };
    // Fetch chart data when filters change
    // biome-ignore lint/correctness/useExhaustiveDependencies: don't include the load functions
    (0, react_2.useEffect)(function () {
        if (!(dateRange === null || dateRange === void 0 ? void 0 : dateRange.start) || !(dateRange === null || dateRange === void 0 ? void 0 : dateRange.end))
            return;
        var params = "?start=".concat(dateRange.start.toString(), "&end=").concat(dateRange.end.toString(), "&interval=").concat(interval).concat(issueTypeId === "all" ? "" : "&issueTypeId=".concat(issueTypeId));
        kpiFetcher.load(path_1.path.to.api.qualityKpi(selectedChart) + params);
        avgFetcher.load(path_1.path.to.api.qualityKpi("avgDaysToClose") + params);
    }, [selectedChart, dateRange, interval, issueTypeId]);
    var avgDaysToClose = (_d = (_c = (_b = (_a = avgFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : null;
    // CSV export
    var csvData = (0, react_2.useMemo)(function () {
        var _a;
        var data = (_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data;
        if (!data || !Array.isArray(data) || data.length === 0)
            return [];
        var keys = Object.keys(data[0]);
        return __spreadArray([keys], data.map(function (d) { return keys.map(function (k) { return d[k]; }); }), true);
    }, [(_e = kpiFetcher.data) === null || _e === void 0 ? void 0 : _e.data]);
    var csvFilename = (0, react_2.useMemo)(function () {
        var _a;
        var startDate = dateRange === null || dateRange === void 0 ? void 0 : dateRange.start.toString();
        var endDate = dateRange === null || dateRange === void 0 ? void 0 : dateRange.end.toString();
        return "".concat(((_a = kpiLabels[selectedChartData.key]) !== null && _a !== void 0 ? _a : "").replace(/ /g, "_"), "_").concat(startDate, "_to_").concat(endDate, ".csv");
    }, [dateRange, kpiLabels, selectedChartData.key]);
    // Chart data from fetcher
    var chartData = (_g = (_f = kpiFetcher.data) === null || _f === void 0 ? void 0 : _f.data) !== null && _g !== void 0 ? _g : [];
    // Target: prefer meta value from API, fall back to loader value
    var effectiveTarget = (_k = (_j = (_h = kpiFetcher.data) === null || _h === void 0 ? void 0 : _h.meta) === null || _j === void 0 ? void 0 : _j.qualityIssueTarget) !== null && _k !== void 0 ? _k : qualityIssueTarget;
    return (<div className="@container flex flex-col gap-4 w-full p-4 h-[calc(100dvh-var(--header-height))] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-muted-foreground">
      <react_1.HStack spacing={1} className="hidden md:flex">
        <Navigation_1.CollapsibleSidebarTrigger />
        <react_1.Heading size="h2">
          <macro_2.Trans>Dashboard</macro_2.Trans>
        </react_1.Heading>
      </react_1.HStack>

      {/* KPI Cards */}
      <div className="grid w-full gap-4 grid-cols-1 @sm:grid-cols-2 @4xl:grid-cols-4">
        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuCircleAlert className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_2.Trans>Open Issues</macro_2.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {openIssuesCount}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.issues, "?filter=status:in:").concat(OPEN_ISSUE_STATUSES.join(","))}>
                  <macro_2.Trans>View</macro_2.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuShieldCheck className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_2.Trans>Contained</macro_2.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {containedCount}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.issues, "?filter=containmentStatus:eq:Contained")}>
                  <macro_2.Trans>View</macro_2.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuClipboardList className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_2.Trans>Open Actions</macro_2.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {openActionsCount}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.qualityActions, "?filter=status:in:Pending,In Progress")}>
                  <macro_2.Trans>View</macro_2.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuCalendarClock className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_2.Trans>Avg Days to Close</macro_2.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <h3 className="text-5xl font-medium tracking-tighter">
              {avgDaysToClose !== null ? avgDaysToClose : "—"}
            </h3>
            <span className="text-xs text-muted-foreground">
              <macro_2.Trans>in selected period</macro_2.Trans>
            </span>
          </react_1.CardContent>
        </react_1.Card>
      </div>

      {/* Unified Chart Card */}
      <react_1.Card>
        <div className="flex flex-wrap items-center justify-between">
          <react_1.CardHeader>
            <div className="flex flex-wrap justify-start items-center gap-2">
              <react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.Button variant="secondary" rightIcon={<lu_1.LuChevronDown />} className="hover:bg-background/80">
                    <span>{kpiLabels[selectedChartData.key]}</span>
                  </react_1.Button>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent side="bottom" align="start">
                  <react_1.DropdownMenuRadioGroup value={selectedChart} onValueChange={setSelectedChart}>
                    {quality_1.QualityKPIs.map(function (chart) { return (<react_1.DropdownMenuRadioItem key={chart.key} value={chart.key}>
                        {kpiLabels[chart.key]}
                      </react_1.DropdownMenuRadioItem>); })}
                  </react_1.DropdownMenuRadioGroup>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>
              <react_1.Combobox asButton value={issueTypeId} onChange={setIssueTypeId} options={typeOptions} size="sm" className="font-medium text-sm min-w-[160px]"/>
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
                    <macro_2.Trans>Export CSV</macro_2.Trans>
                  </CSVLink_1.CSVLink>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </react_1.CardAction>
        </div>
        <react_1.CardContent className="flex-col gap-4">
          <div className="h-[30dvw] md:h-[23dvw] min-h-[300px]">
            {selectedChart === "weeklyTracking" && (<Chart_1.ChartContainer config={qualityChartConfig} className="w-full h-full">
                <recharts_1.ComposedChart data={chartData}>
                  <recharts_1.CartesianGrid vertical={false}/>
                  <recharts_1.XAxis dataKey="week" tickLine={false} axisLine={false} tickFormatter={function (v) { return formatWeekLabel(v, locale); }} minTickGap={32}/>
                  <recharts_1.YAxis tickLine={false} axisLine={false}/>
                  <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent labelFormatter={function (v) { return formatWeekLabel(v, locale); }}/>}/>
                  <Chart_1.ChartLegend payload={weeklyLegendPayload} content={<Chart_1.ChartLegendContent />}/>
                  {effectiveTarget > 0 && (<recharts_1.ReferenceLine y={effectiveTarget} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{
                    value: "Target",
                    position: "insideTopLeft",
                    fill: "hsl(var(--destructive))",
                    fontSize: 12
                }}/>)}
                  <recharts_1.Bar dataKey="opened" fill="var(--color-opened)" maxBarSize={48} radius={2} isAnimationActive={false}/>
                  <recharts_1.Bar dataKey="closed" fill="var(--color-closed)" maxBarSize={48} radius={2} isAnimationActive={false}/>
                </recharts_1.ComposedChart>
              </Chart_1.ChartContainer>)}

            {selectedChart === "statusDistribution" && (<Chart_1.ChartContainer config={qualityChartConfig} className="w-full h-full">
                <recharts_1.PieChart>
                  <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent />}/>
                  <Chart_1.ChartLegend content={<Chart_1.ChartLegendContent />}/>
                  <recharts_1.Pie data={chartData} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="80%" paddingAngle={2} isAnimationActive={false}>
                    {chartData.map(function (entry) { return (<recharts_1.Cell key={entry.name} fill={entry.fill}/>); })}
                    <recharts_1.Label content={function (_a) {
                var _b;
                var viewBox = _a.viewBox;
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    var total = chartData.reduce(function (s, d) { return s + d.value; }, 0);
                    return (<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                {total}
                              </tspan>
                              <tspan x={viewBox.cx} y={((_b = viewBox.cy) !== null && _b !== void 0 ? _b : 0) + 20} className="fill-muted-foreground text-xs">
                                {t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Total"], ["Total"])))}
                              </tspan>
                            </text>);
                }
            }}/>
                  </recharts_1.Pie>
                </recharts_1.PieChart>
              </Chart_1.ChartContainer>)}

            {selectedChart === "paretoByType" && (<Chart_1.ChartContainer config={qualityChartConfig} className="w-full h-full">
                <recharts_1.ComposedChart data={chartData}>
                  <recharts_1.CartesianGrid vertical={false}/>
                  <recharts_1.XAxis dataKey="type" tickLine={false} axisLine={false}/>
                  <recharts_1.YAxis yAxisId="left" tickLine={false} axisLine={false}/>
                  <recharts_1.YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={function (v) { return "".concat(v, "%"); }}/>
                  <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent />}/>
                  <Chart_1.ChartLegend content={<Chart_1.ChartLegendContent />}/>
                  <recharts_1.Bar yAxisId="left" dataKey="count" fill="hsl(var(--chart-1))" maxBarSize={48} radius={2} isAnimationActive={false}/>
                  <recharts_1.Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="var(--color-cumulative)" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false}/>
                </recharts_1.ComposedChart>
              </Chart_1.ChartContainer>)}

            {selectedChart === "ncrsByType" && (<Chart_1.ChartContainer config={qualityChartConfig} className="w-full h-full">
                <recharts_1.BarChart data={chartData}>
                  <recharts_1.CartesianGrid vertical={false}/>
                  <recharts_1.XAxis dataKey="type" tickLine={false} axisLine={false}/>
                  <recharts_1.YAxis tickLine={false} axisLine={false}/>
                  <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent formatter={percentageFormatter}/>}/>
                  <Chart_1.ChartLegend content={<Chart_1.ChartLegendContent />}/>
                  <recharts_1.Bar dataKey="Critical" fill="var(--color-Critical)" stackId="stack" maxBarSize={48} radius={2} shape={StackedBar} isAnimationActive={false}/>
                  <recharts_1.Bar dataKey="High" fill="var(--color-High)" stackId="stack" maxBarSize={48} radius={2} shape={StackedBar} isAnimationActive={false}/>
                  <recharts_1.Bar dataKey="Medium" fill="var(--color-Medium)" stackId="stack" maxBarSize={48} radius={2} shape={StackedBar} isAnimationActive={false}/>
                  <recharts_1.Bar dataKey="Low" fill="var(--color-Low)" stackId="stack" maxBarSize={48} radius={2} shape={StackedBar} isAnimationActive={false}/>
                </recharts_1.BarChart>
              </Chart_1.ChartContainer>)}

            {selectedChart === "sourceAnalysis" && (<Chart_1.ChartContainer config={qualityChartConfig} className="w-full h-full">
                <recharts_1.BarChart data={chartData} layout="vertical">
                  <recharts_1.CartesianGrid horizontal={false}/>
                  <recharts_1.XAxis type="number" tickLine={false} axisLine={false}/>
                  <recharts_1.YAxis type="category" dataKey="priority" tickLine={false} axisLine={false} width={80}/>
                  <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent formatter={percentageFormatter}/>}/>
                  <Chart_1.ChartLegend content={<Chart_1.ChartLegendContent />}/>
                  <recharts_1.Bar dataKey="Internal" fill="var(--color-Internal)" stackId="stack" maxBarSize={32} radius={2} shape={StackedBar} isAnimationActive={false}/>
                  <recharts_1.Bar dataKey="External" fill="var(--color-External)" stackId="stack" maxBarSize={32} radius={2} shape={StackedBar} isAnimationActive={false}/>
                </recharts_1.BarChart>
              </Chart_1.ChartContainer>)}

            {selectedChart === "supplierQuality" && (<Chart_1.ChartContainer config={qualityChartConfig} className="w-full h-full">
                {chartData.length > 0 ? (<recharts_1.BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                    <recharts_1.CartesianGrid horizontal={false}/>
                    <recharts_1.XAxis type="number" tickLine={false} axisLine={false}/>
                    <recharts_1.YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={120} tick={{ fontSize: 12 }}/>
                    <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent />}/>
                    <recharts_1.Bar dataKey="count" fill="hsl(var(--chart-1))" maxBarSize={28} radius={2} isAnimationActive={false}/>
                  </recharts_1.BarChart>) : (<div className="flex items-center justify-center h-full">
                    <components_1.Empty />
                  </div>)}
              </Chart_1.ChartContainer>)}

            {selectedChart === "weeksOpen" && (<Chart_1.ChartContainer config={qualityChartConfig} className="w-full h-full">
                <recharts_1.BarChart data={chartData}>
                  <recharts_1.CartesianGrid vertical={false}/>
                  <recharts_1.XAxis dataKey="criticality" tickLine={false} axisLine={false}/>
                  <recharts_1.YAxis tickLine={false} axisLine={false}/>
                  <Chart_1.ChartTooltip content={<Chart_1.ChartTooltipContent formatter={percentageFormatter}/>}/>
                  <Chart_1.ChartLegend content={<Chart_1.ChartLegendContent />}/>
                  <recharts_1.Bar dataKey="0-4 weeks" fill="hsl(var(--success))" stackId="stack" maxBarSize={48} radius={2} shape={StackedBar} isAnimationActive={false}/>
                  <recharts_1.Bar dataKey="5-8 weeks" fill="hsl(var(--chart-4))" stackId="stack" maxBarSize={48} radius={2} shape={StackedBar} isAnimationActive={false}/>
                  <recharts_1.Bar dataKey="9-12 weeks" fill="hsl(var(--chart-5))" stackId="stack" maxBarSize={48} radius={2} shape={StackedBar} isAnimationActive={false}/>
                  <recharts_1.Bar dataKey="13+ weeks" fill="hsl(var(--destructive))" stackId="stack" maxBarSize={48} radius={2} shape={StackedBar} isAnimationActive={false}/>
                </recharts_1.BarChart>
              </Chart_1.ChartContainer>)}
          </div>
        </react_1.CardContent>
      </react_1.Card>

      {/* Recently Created + Assigned to Me */}
      <div className="grid w-full gap-4 grid-cols-1 lg:grid-cols-2">
        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuClock className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_2.Trans>Recently Created</macro_2.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent className="p-6">
            <div className="min-h-[200px] max-h-[360px] w-full overflow-y-auto">
              {recentlyCreated.length > 0 ? (<IssueTable data={recentlyCreated}/>) : (<div className="flex justify-center items-center h-full">
                  <components_1.Empty />
                </div>)}
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuInbox className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_2.Trans>Assigned to Me</macro_2.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent className="min-h-[200px]">
            <react_2.Suspense fallback={<div className="p-4 text-muted-foreground">
                  <macro_2.Trans>Loading...</macro_2.Trans>
                </div>}>
              <react_router_1.Await resolve={assignedToMe} errorElement={<div>
                    <macro_2.Trans>Error loading assigned issues</macro_2.Trans>
                  </div>}>
                {function (assignedIssues) {
            return assignedIssues.length > 0 ? (<IssueTable data={assignedIssues}/>) : (<div className="flex justify-center items-center h-full">
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
// --- Issue Table ---
function IssueTable(_a) {
    var data = _a.data;
    return (<react_1.Table>
      <react_1.Thead>
        <react_1.Tr>
          <react_1.Th>
            <macro_2.Trans>Issue</macro_2.Trans>
          </react_1.Th>
          <react_1.Th>
            <macro_2.Trans>Status</macro_2.Trans>
          </react_1.Th>
          <react_1.Th>
            <macro_2.Trans>Priority</macro_2.Trans>
          </react_1.Th>
        </react_1.Tr>
      </react_1.Thead>
      <react_1.Tbody>
        {data.map(function (issue) {
            if (!issue.id)
                return null;
            return (<react_1.Tr key={issue.id}>
              <react_1.Td>
                <components_1.Hyperlink to={path_1.path.to.issue(issue.id)}>
                  <react_1.HStack spacing={1}>
                    <lu_1.LuShieldX className="size-4"/>
                    <span>{issue.nonConformanceId}</span>
                  </react_1.HStack>
                </components_1.Hyperlink>
              </react_1.Td>
              <react_1.Td>
                <IssueStatus_1.default status={issue.status}/>
              </react_1.Td>
              <react_1.Td>
                {issue.priority && (<react_1.Badge variant={getPriorityVariant(issue.priority)}>
                    {issue.priority}
                  </react_1.Badge>)}
              </react_1.Td>
            </react_1.Tr>);
        })}
      </react_1.Tbody>
    </react_1.Table>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
