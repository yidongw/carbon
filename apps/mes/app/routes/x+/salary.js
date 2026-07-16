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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.default = MesSalaryRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var people_service_1 = require("~/services/people.service");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, url, now, year, month, _d, salaryRecord, completions, pending, history;
        var _e, _f, _g, _h, _j;
        var request = _b.request;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _k.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    url = new URL(request.url);
                    now = new Date();
                    year = Number((_e = url.searchParams.get("year")) !== null && _e !== void 0 ? _e : now.getFullYear());
                    month = Number((_f = url.searchParams.get("month")) !== null && _f !== void 0 ? _f : now.getMonth() + 1);
                    return [4 /*yield*/, Promise.all([
                            (0, people_service_1.getMySalaryRecord)(client, userId, companyId, year, month),
                            (0, people_service_1.getMyCompletions)(client, userId, companyId, year, month),
                            (0, people_service_1.getMyPendingCompletions)(client, userId, companyId),
                            (0, people_service_1.getMySalaryHistory)(client, userId, companyId)
                        ])];
                case 2:
                    _d = _k.sent(), salaryRecord = _d[0], completions = _d[1], pending = _d[2], history = _d[3];
                    return [2 /*return*/, {
                            year: year,
                            month: month,
                            salaryRecord: salaryRecord.data,
                            completions: (_g = completions.data) !== null && _g !== void 0 ? _g : [],
                            pending: (_h = pending.data) !== null && _h !== void 0 ? _h : [],
                            history: (_j = history.data) !== null && _j !== void 0 ? _j : []
                        }];
            }
        });
    });
}
var MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
function makeCurrencyFormatter(currency) {
    var fmt = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2
    });
    return function (amount) {
        return amount == null ? "—" : fmt.format(amount);
    };
}
function makeUnitCostFormatter(currency) {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 4
    });
}
function formatDateTime(dateStr) {
    if (!dateStr)
        return "—";
    return new Date(dateStr).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}
function getSalaryPaymentStatus(totalEarned, totalPaid) {
    var earned = totalEarned !== null && totalEarned !== void 0 ? totalEarned : 0;
    var paid = totalPaid !== null && totalPaid !== void 0 ? totalPaid : 0;
    if (paid > 0 && earned > 0 && paid >= earned)
        return "Paid";
    if (paid > 0)
        return "Partially Paid";
    return "Unpaid";
}
function statusVariant(status) {
    switch (status) {
        case "Paid":
            return "green";
        case "Partially Paid":
            return "yellow";
        case "Unpaid":
        default:
            return "secondary";
    }
}
function getJobReadableId(c) {
    var _a;
    var jo = c.jobOperation;
    if (!jo)
        return "—";
    var job = Array.isArray(jo.job) ? jo.job[0] : jo.job;
    return (_a = job === null || job === void 0 ? void 0 : job.jobId) !== null && _a !== void 0 ? _a : "—";
}
function getProcessName(c) {
    var _a;
    var jo = c.jobOperation;
    if (!jo)
        return null;
    var process = Array.isArray(jo.process) ? jo.process[0] : jo.process;
    return (_a = process === null || process === void 0 ? void 0 : process.name) !== null && _a !== void 0 ? _a : null;
}
function getUnitCost(c) {
    var _a;
    var jo = Array.isArray(c.jobOperation) ? c.jobOperation[0] : c.jobOperation;
    return (_a = jo === null || jo === void 0 ? void 0 : jo.insideUnitCost) !== null && _a !== void 0 ? _a : 0;
}
function getEarned(c) {
    var _a;
    return ((_a = c.quantity) !== null && _a !== void 0 ? _a : 0) * getUnitCost(c);
}
function MesSalaryRoute() {
    var _a, _b, _c, _d;
    var _e = (0, react_router_1.useLoaderData)(), year = _e.year, month = _e.month, salaryRecord = _e.salaryRecord, completions = _e.completions, pending = _e.pending, history = _e.history;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var layoutData = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var baseCurrencyCode = (_b = (_a = layoutData === null || layoutData === void 0 ? void 0 : layoutData.company) === null || _a === void 0 ? void 0 : _a.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    var formatCurrency = makeCurrencyFormatter(baseCurrencyCode);
    var unitCostFormatter = makeUnitCostFormatter(baseCurrencyCode);
    var totalEarned = (_c = salaryRecord === null || salaryRecord === void 0 ? void 0 : salaryRecord.totalEarned) !== null && _c !== void 0 ? _c : 0;
    var totalPaid = (_d = salaryRecord === null || salaryRecord === void 0 ? void 0 : salaryRecord.totalPaid) !== null && _d !== void 0 ? _d : 0;
    var amountOwed = totalEarned - totalPaid;
    var paymentStatus = getSalaryPaymentStatus(totalEarned, totalPaid);
    var goToMonth = function (y, m) {
        navigate("".concat(path_1.path.to.salary, "?year=").concat(y, "&month=").concat(m));
    };
    var prevMonth = function () {
        return month === 1 ? goToMonth(year - 1, 12) : goToMonth(year, month - 1);
    };
    var nextMonth = function () {
        return month === 12 ? goToMonth(year + 1, 1) : goToMonth(year, month + 1);
    };
    return (<div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <react_1.SidebarTrigger className="md:hidden"/>
          <react_1.Heading size="h4">
            <macro_1.Trans>My Salary</macro_1.Trans>
          </react_1.Heading>
        </div>
      </header>

      <main className="h-[calc(100dvh-var(--header-height))] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
        <div className="p-4 flex flex-col gap-4">
          <react_1.HStack className="w-full justify-between items-center">
            <react_1.HStack spacing={2}>
              <react_1.Button size="sm" variant="ghost" onClick={prevMonth}>
                <lu_1.LuChevronLeft className="size-4"/>
              </react_1.Button>
              <span className="font-semibold text-base min-w-[10rem] text-center">
                {MONTH_NAMES[month - 1]} {year}
              </span>
              <react_1.Button size="sm" variant="ghost" onClick={nextMonth}>
                <lu_1.LuChevronRight className="size-4"/>
              </react_1.Button>
            </react_1.HStack>
            {salaryRecord && (<react_1.Badge variant={statusVariant(paymentStatus)}>
                {paymentStatus}
              </react_1.Badge>)}
          </react_1.HStack>

          <div className="grid w-full gap-4 grid-cols-1 sm:grid-cols-3">
            <react_1.Card>
              <react_1.CardHeader className="flex-row gap-2">
                <lu_1.LuBanknote className="text-muted-foreground"/>
                <react_1.CardTitle>
                  <macro_1.Trans>Earned</macro_1.Trans>
                </react_1.CardTitle>
              </react_1.CardHeader>
              <react_1.CardContent>
                <p className="text-3xl font-medium tracking-tighter tabular-nums">
                  {formatCurrency(totalEarned)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {completions.length} <macro_1.Trans>approved</macro_1.Trans>
                </p>
              </react_1.CardContent>
            </react_1.Card>
            <react_1.Card>
              <react_1.CardHeader className="flex-row gap-2">
                <lu_1.LuCircleCheck className="text-muted-foreground"/>
                <react_1.CardTitle>
                  <macro_1.Trans>Paid</macro_1.Trans>
                </react_1.CardTitle>
              </react_1.CardHeader>
              <react_1.CardContent>
                <p className="text-3xl font-medium tracking-tighter tabular-nums">
                  {formatCurrency(totalPaid)}
                </p>
              </react_1.CardContent>
            </react_1.Card>
            <react_1.Card>
              <react_1.CardHeader className="flex-row gap-2">
                <lu_1.LuClock className="text-muted-foreground"/>
                <react_1.CardTitle>
                  <macro_1.Trans>Owed</macro_1.Trans>
                </react_1.CardTitle>
              </react_1.CardHeader>
              <react_1.CardContent>
                <p className="text-3xl font-medium tracking-tighter tabular-nums">
                  {formatCurrency(amountOwed)}
                </p>
              </react_1.CardContent>
            </react_1.Card>
          </div>

          {pending.length > 0 && (<react_1.Card>
              <react_1.CardHeader className="flex-row items-center gap-2">
                <react_1.CardTitle>
                  <macro_1.Trans>Pending Approval</macro_1.Trans>
                </react_1.CardTitle>
                <react_1.Badge variant="secondary">{pending.length}</react_1.Badge>
              </react_1.CardHeader>
              <react_1.CardContent className="flex flex-col gap-2">
                {pending.map(function (c) {
                var _a, _b, _c;
                return (<div key={c.id} className="rounded-md border bg-card p-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <react_1.HStack spacing={2} className="mb-0.5">
                        <span className="font-mono font-medium text-sm">
                          {getJobReadableId(c)}
                        </span>
                        <react_1.Badge variant="secondary" className="text-xs">
                          <macro_1.Trans>Pending</macro_1.Trans>
                        </react_1.Badge>
                      </react_1.HStack>
                      <div className="text-xs text-muted-foreground">
                        {(_c = (_a = getProcessName(c)) !== null && _a !== void 0 ? _a : (_b = c.jobOperation) === null || _b === void 0 ? void 0 : _b.description) !== null && _c !== void 0 ? _c : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {formatDateTime(c.createdAt)}
                        {" · "}
                        <macro_1.Trans>Qty</macro_1.Trans>: {c.quantity}
                        {" · "}@ {unitCostFormatter.format(getUnitCost(c))}/
                        {t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["unit"], ["unit"])))}
                      </div>
                    </div>
                    <span className="font-semibold tabular-nums whitespace-nowrap">
                      {formatCurrency(getEarned(c))}
                    </span>
                  </div>);
            })}
              </react_1.CardContent>
            </react_1.Card>)}

          <react_1.Card>
            <react_1.CardHeader>
              <react_1.CardTitle>
                <macro_1.Trans>This Period</macro_1.Trans>
              </react_1.CardTitle>
            </react_1.CardHeader>
            <react_1.CardContent className="flex flex-col gap-2">
              {completions.length === 0 ? (<p className="text-center text-sm text-muted-foreground py-6">
                  <macro_1.Trans>No approved completions this period</macro_1.Trans>
                </p>) : (completions.map(function (c) {
            var _a, _b, _c;
            return (<div key={c.id} className="rounded-md border bg-card p-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <react_1.HStack spacing={2} className="mb-0.5">
                        <span className="font-mono font-medium text-sm">
                          {getJobReadableId(c)}
                        </span>
                        <react_1.Badge variant="green" className="text-xs">
                          <macro_1.Trans>Approved</macro_1.Trans>
                        </react_1.Badge>
                      </react_1.HStack>
                      <div className="text-xs text-muted-foreground">
                        {(_c = (_a = getProcessName(c)) !== null && _a !== void 0 ? _a : (_b = c.jobOperation) === null || _b === void 0 ? void 0 : _b.description) !== null && _c !== void 0 ? _c : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {formatDateTime(c.createdAt)}
                        {" · "}
                        <macro_1.Trans>Qty</macro_1.Trans>: {c.quantity}
                        {" · "}@ {unitCostFormatter.format(getUnitCost(c))}/
                        {t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["unit"], ["unit"])))}
                      </div>
                    </div>
                    <span className="font-semibold tabular-nums whitespace-nowrap">
                      {formatCurrency(getEarned(c))}
                    </span>
                  </div>);
        }))}
            </react_1.CardContent>
          </react_1.Card>

          {history.length > 1 && (<react_1.Card>
              <react_1.CardHeader>
                <react_1.CardTitle>
                  <macro_1.Trans>History</macro_1.Trans>
                </react_1.CardTitle>
              </react_1.CardHeader>
              <react_1.CardContent className="p-0">
                <react_1.Table>
                  <react_1.Thead>
                    <react_1.Tr>
                      <react_1.Th>{t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Period"], ["Period"])))}</react_1.Th>
                      <react_1.Th className="text-right">{t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Earned"], ["Earned"])))}</react_1.Th>
                      <react_1.Th className="text-right">{t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Paid"], ["Paid"])))}</react_1.Th>
                      <react_1.Th>{t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Status"], ["Status"])))}</react_1.Th>
                    </react_1.Tr>
                  </react_1.Thead>
                  <react_1.Tbody>
                    {history
                .filter(function (h) { return !(h.year === year && h.month === month); })
                .map(function (h) { return (<react_1.Tr key={"".concat(h.year, "-").concat(h.month)} className="cursor-pointer hover:bg-muted/40" onClick={function () { return goToMonth(h.year, h.month); }}>
                          <react_1.Td className="text-sm">
                            {MONTH_NAMES[h.month - 1]} {h.year}
                          </react_1.Td>
                          <react_1.Td className="text-right tabular-nums font-medium text-sm">
                            {formatCurrency(h.totalEarned)}
                          </react_1.Td>
                          <react_1.Td className="text-right tabular-nums text-sm text-muted-foreground">
                            {formatCurrency(h.totalPaid)}
                          </react_1.Td>
                          <react_1.Td>
                            <react_1.Badge variant={statusVariant(getSalaryPaymentStatus(h.totalEarned, h.totalPaid))}>
                              {getSalaryPaymentStatus(h.totalEarned, h.totalPaid)}
                            </react_1.Badge>
                          </react_1.Td>
                        </react_1.Tr>); })}
                  </react_1.Tbody>
                </react_1.Table>
              </react_1.CardContent>
            </react_1.Card>)}
        </div>
      </main>
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
