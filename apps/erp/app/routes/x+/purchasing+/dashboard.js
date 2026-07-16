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
exports.default = PurchaseDashboard;
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
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
var Navigation_1 = require("~/components/Layout/Navigation");
var hooks_1 = require("~/hooks");
var useCurrencyFormatter_1 = require("~/hooks/useCurrencyFormatter");
var invoicing_1 = require("~/modules/invoicing");
var purchasing_1 = require("~/modules/purchasing");
var purchasing_models_1 = require("~/modules/purchasing/purchasing.models");
var PurchaseOrder_1 = require("~/modules/purchasing/ui/PurchaseOrder");
var SupplierStatusIndicator_1 = require("~/modules/purchasing/ui/Supplier/SupplierStatusIndicator");
var SupplierQuote_1 = require("~/modules/purchasing/ui/SupplierQuote");
var shared_1 = require("~/modules/shared");
var suppliers_1 = require("~/stores/suppliers");
var path_1 = require("~/utils/path");
var OPEN_SUPPLIER_QUOTE_STATUSES = ["Active"];
var OPEN_INVOICE_STATUSES = [
    "Draft",
    "Return",
    "Pending",
    "Partially Paid"
];
var OPEN_PURCHASE_ORDER_STATUSES = [
    "Draft",
    "To Review",
    "To Receive",
    "To Receive and Invoice",
    "Needs Approval",
    "Planned",
    "To Invoice"
];
var chartConfig = {
    value: {
        color: "hsl(var(--primary))"
    }
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, serviceRole, pendingApprovals, approvalPoIds, approvalSupplierIds, _d, openPurchaseOrders, openPurchaseInvoices, openSupplierQuotes, purchaseOrdersNeedingApproval, suppliersNeedingApproval, assignedToMePromise;
        var _e, _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "purchasing"
                    })];
                case 1:
                    _c = _j.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, shared_1.getPendingApprovalsForApprover)(serviceRole, userId, companyId)];
                case 2:
                    pendingApprovals = _j.sent();
                    approvalPoIds = (_f = (_e = pendingApprovals.data) === null || _e === void 0 ? void 0 : _e.filter(function (approval) {
                        return approval.documentType === "purchaseOrder" && approval.documentId;
                    }).map(function (approval) { return approval.documentId; }).filter(function (id) { return !!id; })) !== null && _f !== void 0 ? _f : [];
                    approvalSupplierIds = (_h = (_g = pendingApprovals.data) === null || _g === void 0 ? void 0 : _g.filter(function (approval) {
                        return approval.documentType === "supplier" && approval.documentId;
                    }).map(function (approval) { return approval.documentId; }).filter(function (id) { return !!id; })) !== null && _h !== void 0 ? _h : [];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("purchaseOrder")
                                .select("id, purchaseOrderId, status, supplierId, assignee, createdAt", {
                                count: "exact"
                            })
                                .in("status", OPEN_PURCHASE_ORDER_STATUSES)
                                .eq("companyId", companyId)
                                .limit(10),
                            client
                                .from("purchaseInvoice")
                                .select("id, invoiceId, status, supplierId, assignee, createdAt", {
                                count: "exact"
                            })
                                .in("status", OPEN_INVOICE_STATUSES)
                                .eq("companyId", companyId)
                                .limit(10),
                            client
                                .from("supplierQuote")
                                .select("id, supplierQuoteId, status, supplierId, assignee, createdAt", {
                                count: "exact"
                            })
                                .in("status", OPEN_SUPPLIER_QUOTE_STATUSES)
                                .eq("companyId", companyId)
                                .limit(10),
                            approvalPoIds.length > 0
                                ? client
                                    .from("purchaseOrder")
                                    .select("id, purchaseOrderId, status, supplierId, assignee, createdAt")
                                    .eq("status", "Needs Approval")
                                    .eq("companyId", companyId)
                                    .in("id", approvalPoIds)
                                : { data: [], error: null },
                            approvalSupplierIds.length > 0
                                ? client
                                    .from("supplier")
                                    .select("id, name, supplierStatus")
                                    .eq("supplierStatus", "Pending")
                                    .eq("companyId", companyId)
                                    .in("id", approvalSupplierIds)
                                : { data: [], error: null }
                        ])];
                case 3:
                    _d = _j.sent(), openPurchaseOrders = _d[0], openPurchaseInvoices = _d[1], openSupplierQuotes = _d[2], purchaseOrdersNeedingApproval = _d[3], suppliersNeedingApproval = _d[4];
                    assignedToMePromise = (0, purchasing_1.getPurchasingDocumentsAssignedToMe)(client, userId, companyId);
                    return [2 /*return*/, {
                            openPurchaseOrders: openPurchaseOrders,
                            openSupplierQuotes: openSupplierQuotes,
                            openPurchaseInvoices: openPurchaseInvoices,
                            purchaseOrdersNeedingApproval: purchaseOrdersNeedingApproval,
                            suppliersNeedingApproval: suppliersNeedingApproval,
                            assignedToMe: assignedToMePromise
                        }];
            }
        });
    });
}
function PurchaseDashboard() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var _l = (0, react_router_1.useLoaderData)(), openPurchaseOrders = _l.openPurchaseOrders, openSupplierQuotes = _l.openSupplierQuotes, openPurchaseInvoices = _l.openPurchaseInvoices, purchaseOrdersNeedingApproval = _l.purchaseOrdersNeedingApproval, suppliersNeedingApproval = _l.suppliersNeedingApproval, assignedToMe = _l.assignedToMe;
    var mergedOpenDocs = (0, react_2.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var merged = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], ((_b = (_a = openPurchaseOrders.data) === null || _a === void 0 ? void 0 : _a.map(function (doc) { return (__assign(__assign({}, doc), { type: "purchaseOrder" })); })) !== null && _b !== void 0 ? _b : []), true), ((_d = (_c = openSupplierQuotes.data) === null || _c === void 0 ? void 0 : _c.map(function (doc) { return (__assign(__assign({}, doc), { type: "supplierQuote" })); })) !== null && _d !== void 0 ? _d : []), true), ((_f = (_e = openPurchaseInvoices.data) === null || _e === void 0 ? void 0 : _e.map(function (doc) { return (__assign(__assign({}, doc), { type: "purchaseInvoice" })); })) !== null && _f !== void 0 ? _f : []), true), ((_h = (_g = purchaseOrdersNeedingApproval.data) === null || _g === void 0 ? void 0 : _g.map(function (doc) { return (__assign(__assign({}, doc), { type: "purchaseOrder" })); })) !== null && _h !== void 0 ? _h : []), true).filter(function (doc, index, self) {
            return index ===
                self.findIndex(function (d) { return d.id === doc.id && d.type === doc.type; });
        })
            .sort(function (a, b) { var _a, _b; return ((_a = b.createdAt) !== null && _a !== void 0 ? _a : "").localeCompare((_b = a.createdAt) !== null && _b !== void 0 ? _b : ""); });
        return merged;
    }, [
        openPurchaseOrders,
        openSupplierQuotes,
        openPurchaseInvoices,
        purchaseOrdersNeedingApproval
    ]);
    var t = (0, macro_1.useLingui)().t;
    var kpiFetcher = (0, react_router_1.useFetcher)();
    var isFetching = kpiFetcher.state !== "idle" || !kpiFetcher.data;
    var dateFormatter = (0, i18n_1.useDateFormatter)({
        month: "short",
        day: "numeric"
    });
    var company = (0, hooks_1.useUser)().company;
    var currencyCompactFormatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)({
        currency: company.baseCurrencyCode,
        maximumFractionDigits: 0,
        notation: "compact",
        compactDisplay: "short"
    });
    var currencyFormatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)();
    var numberFormatter = (0, i18n_1.useNumberFormatter)({
        maximumFractionDigits: 0,
        notation: "compact",
        compactDisplay: "short"
    });
    var _m = (0, react_2.useState)("all"), supplierId = _m[0], setSupplierId = _m[1];
    var suppliers = (0, suppliers_1.useSuppliers)()[0];
    var supplierOptions = (0, react_2.useMemo)(function () {
        return __spreadArray([
            { label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["All Suppliers"], ["All Suppliers"]))), value: "all" }
        ], suppliers.map(function (supplier) { return ({
            label: supplier.name,
            value: supplier.id
        }); }), true);
    }, [suppliers, t]);
    var _o = (0, react_2.useState)("month"), interval = _o[0], setInterval = _o[1];
    var _p = (0, react_2.useState)("purchaseOrderAmount"), selectedKpi = _p[0], setSelectedKpi = _p[1];
    var _q = (0, react_2.useState)(function () {
        var end = (0, date_1.toCalendarDateTime)((0, date_1.now)("UTC"));
        var start = end.add({ months: -1 });
        return { start: start, end: end };
    }), dateRange = _q[0], setDateRange = _q[1];
    var selectedKpiData = purchasing_models_1.KPIs.find(function (k) { return k.key === selectedKpi; }) || purchasing_models_1.KPIs[0];
    var kpiLabels = (0, react_2.useMemo)(function () { return ({
        supplierQuoteCount: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Supplier Quotes"], ["Supplier Quotes"]))),
        purchaseOrderCount: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Purchase Orders"], ["Purchase Orders"]))),
        purchaseInvoiceCount: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Purchase Invoices"], ["Purchase Invoices"]))),
        purchaseOrderAmount: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Purchase Order Amount"], ["Purchase Order Amount"]))),
        purchaseInvoiceAmount: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Purchase Invoice Amount"], ["Purchase Invoice Amount"])))
    }); }, [t]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        kpiFetcher.load("".concat(path_1.path.to.api.purchasingKpi(selectedKpiData.key), "?start=").concat(dateRange === null || dateRange === void 0 ? void 0 : dateRange.start.toString(), "&end=").concat(dateRange === null || dateRange === void 0 ? void 0 : dateRange.end.toString(), "&interval=").concat(interval).concat(supplierId === "all" ? "" : "&supplierId=".concat(supplierId)));
    }, [selectedKpi, dateRange, interval, selectedKpiData.key, supplierId]);
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
        return {
            value: kpiFetcher.data.data.reduce(function (acc, curr) { return acc + curr.value; }, 0)
        };
    }, [(_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data]);
    var previousTotalData = (0, react_2.useMemo)(function () {
        var _a;
        if (!((_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.previousPeriodData))
            return null;
        return {
            value: kpiFetcher.data.previousPeriodData.reduce(function (acc, curr) { return acc + curr.value; }, 0)
        };
    }, [(_b = kpiFetcher.data) === null || _b === void 0 ? void 0 : _b.previousPeriodData]);
    var total = (_c = totalData === null || totalData === void 0 ? void 0 : totalData.value) !== null && _c !== void 0 ? _c : 0;
    var previousTotal = (_d = previousTotalData === null || previousTotalData === void 0 ? void 0 : previousTotalData.value) !== null && _d !== void 0 ? _d : 0;
    var percentageChange = previousTotal === 0
        ? total > 0
            ? 100
            : 0
        : ((total - previousTotal) / previousTotal) * 100;
    var formatValue = function (value) {
        if (["purchaseOrderAmount", "purchaseInvoiceAmount"].includes(selectedKpiData.key)) {
            return currencyFormatter.format(value);
        }
        return numberFormatter.format(value);
    };
    var csvData = (0, react_2.useMemo)(function () {
        var _a;
        if (!((_a = kpiFetcher.data) === null || _a === void 0 ? void 0 : _a.data))
            return [];
        return __spreadArray([
            ["Date", "Value"]
        ], kpiFetcher.data.data.map(function (item) { return [
            "date" in item ? item.date : item.monthKey,
            item.value
        ]; }), true);
    }, [(_e = kpiFetcher.data) === null || _e === void 0 ? void 0 : _e.data]);
    var csvFilename = (0, react_2.useMemo)(function () {
        var startDate = dateRange === null || dateRange === void 0 ? void 0 : dateRange.start.toString();
        var endDate = dateRange === null || dateRange === void 0 ? void 0 : dateRange.end.toString();
        return "".concat(kpiLabels[selectedKpiData.key], "_").concat(startDate, "_to_").concat(endDate, ".csv");
    }, [dateRange, kpiLabels, selectedKpiData.key]);
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
            <lu_1.LuPackageSearch className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_1.Trans>Active Supplier Quotes</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {(_f = openSupplierQuotes.count) !== null && _f !== void 0 ? _f : 0}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.supplierQuotes, "?filter=status:in:").concat(OPEN_SUPPLIER_QUOTE_STATUSES.join(","))}>
                  <macro_1.Trans>View Active Quotes</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuLayoutList className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_1.Trans>Open Purchase Orders</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {(_g = openPurchaseOrders.count) !== null && _g !== void 0 ? _g : 0}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.purchaseOrders, "?filter=status:in:").concat(OPEN_PURCHASE_ORDER_STATUSES.join(","))}>
                  <macro_1.Trans>View Open POs</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card>
          <react_1.CardHeader className="flex-row gap-2">
            <lu_1.LuCreditCard className="text-muted-foreground"/>
            <react_1.CardTitle>
              <macro_1.Trans>Open Purchase Invoices</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <h3 className="text-5xl font-medium tracking-tighter">
                {(_h = openPurchaseInvoices.count) !== null && _h !== void 0 ? _h : 0}
              </h3>
              <react_1.Button rightIcon={<lu_1.LuArrowUpRight />} variant="secondary" asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.purchaseInvoices, "?filter=status:in:").concat(OPEN_INVOICE_STATUSES.join(","))}>
                  <macro_1.Trans>View Open Invoices</macro_1.Trans>
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
                    {purchasing_models_1.KPIs.map(function (kpi) { return (<react_1.DropdownMenuRadioItem key={kpi.key} value={kpi.key}>
                        {kpiLabels[kpi.key]}
                      </react_1.DropdownMenuRadioItem>); })}
                  </react_1.DropdownMenuRadioGroup>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>

              <react_1.Combobox asButton value={supplierId} onChange={setSupplierId} options={supplierOptions} size="sm" className="font-medium text-sm min-w-[160px] gap-4"/>
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
                {percentageChange >= 0 ? (<react_1.Badge variant="green">+{percentageChange.toFixed(0)}%</react_1.Badge>) : (<react_1.Badge variant="red">{percentageChange.toFixed(0)}%</react_1.Badge>)}
              </>)}
          </react_1.VStack>
          <react_1.Loading isLoading={isFetching} className="h-[30dvw] md:h-[23dvw] w-full">
            <Chart_1.ChartContainer config={chartConfig} className="aspect-auto h-[30dvw] md:h-[23dvw] w-full">
              <recharts_1.BarChart accessibilityLayer data={(_k = (_j = kpiFetcher.data) === null || _j === void 0 ? void 0 : _j.data) !== null && _k !== void 0 ? _k : []}>
                <recharts_1.CartesianGrid vertical={false}/>
                <recharts_1.YAxis dataKey="value" tickLine={false} axisLine={false} tickFormatter={function (value) {
            return [
                "purchaseOrderAmount",
                "purchaseInvoiceAmount"
            ].includes(selectedKpiData.key)
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
                return [
                    "purchaseOrderAmount",
                    "purchaseInvoiceAmount"
                ].includes(selectedKpiData.key)
                    ? currencyFormatter.format(value)
                    : numberFormatter.format(value);
            }}/>}/>
                <recharts_1.Bar dataKey="value" fill="var(--color-value)" radius={2}/>
              </recharts_1.BarChart>
            </Chart_1.ChartContainer>
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
                        <macro_1.Trans>Supplier</macro_1.Trans>
                      </react_1.Th>
                    </react_1.Tr>
                  </react_1.Thead>
                  <react_1.Tbody>
                    {mergedOpenDocs.map(function (doc) {
                switch (doc.type) {
                    case "purchaseOrder":
                        return (<PurchaseOrderDocumentRow key={doc.id} doc={doc}/>);
                    case "supplierQuote":
                        return (<SupplierQuoteRow key={doc.id} doc={doc}/>);
                    case "purchaseInvoice":
                        return (<PurchaseInvoiceRow key={doc.id} doc={doc}/>);
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
            var _a, _b;
            return (<AssignedDocumentsTable assignedDocs={assignedDocs} purchaseOrdersNeedingApproval={(_a = purchaseOrdersNeedingApproval.data) !== null && _a !== void 0 ? _a : []} suppliersNeedingApproval={(_b = suppliersNeedingApproval.data) !== null && _b !== void 0 ? _b : []}/>);
        }}
              </react_router_1.Await>
            </react_2.Suspense>
          </react_1.CardContent>
        </react_1.Card>
      </div>
    </div>);
}
function AssignedDocumentsTable(_a) {
    var assignedDocs = _a.assignedDocs, purchaseOrdersNeedingApproval = _a.purchaseOrdersNeedingApproval, suppliersNeedingApproval = _a.suppliersNeedingApproval;
    // Merge assigned docs with purchase orders needing approval
    // Deduplicate: if a PO is both assigned and needs approval, prefer the assigned version
    var assignedPurchaseOrderIds = new Set(assignedDocs
        .filter(function (doc) { return doc.type === "purchaseOrder"; })
        .map(function (doc) { return doc.id; }));
    var approvalDocs = purchaseOrdersNeedingApproval
        .filter(function (po) { return !assignedPurchaseOrderIds.has(po.id); })
        .map(function (doc) { return (__assign(__assign({}, doc), { type: "purchaseOrder" })); });
    var supplierDocs = suppliersNeedingApproval.map(function (doc) { return (__assign(__assign({}, doc), { type: "supplier" })); });
    var allDocs = __spreadArray(__spreadArray(__spreadArray([], assignedDocs, true), approvalDocs, true), supplierDocs, true);
    if (allDocs.length === 0) {
        return (<div className="flex justify-center items-center h-full">
        <components_1.Empty />
      </div>);
    }
    return (<react_1.Table>
      <react_1.Thead>
        <react_1.Tr>
          <react_1.Th>
            <macro_1.Trans>Document</macro_1.Trans>
          </react_1.Th>
          <react_1.Th>
            <macro_1.Trans>Status</macro_1.Trans>
          </react_1.Th>
          <react_1.Th>
            <macro_1.Trans>Supplier</macro_1.Trans>
          </react_1.Th>
        </react_1.Tr>
      </react_1.Thead>
      <react_1.Tbody>
        {allDocs.map(function (doc) { return (<DocumentRow key={doc.id} doc={doc}/>); })}
      </react_1.Tbody>
    </react_1.Table>);
}
function DocumentRow(_a) {
    var doc = _a.doc;
    switch (doc.type) {
        case "purchaseOrder":
            return <PurchaseOrderDocumentRow doc={doc}/>;
        case "supplierQuote":
            return <SupplierQuoteRow doc={doc}/>;
        case "purchaseInvoice":
            return <PurchaseInvoiceRow doc={doc}/>;
        case "supplier":
            return (<SupplierApprovalRow doc={doc}/>);
        default:
            return null;
    }
}
function SupplierQuoteRow(_a) {
    var doc = _a.doc;
    return (<react_1.Tr>
      <react_1.Td>
        <components_1.Hyperlink to={path_1.path.to.supplierQuote(doc.id)}>
          <react_1.HStack spacing={1}>
            <lu_1.LuPackageSearch className="size-4"/>
            <span>{doc.supplierQuoteId}</span>
          </react_1.HStack>
        </components_1.Hyperlink>
      </react_1.Td>
      <react_1.Td>
        <SupplierQuote_1.SupplierQuoteStatus status={doc.status}/>
      </react_1.Td>
      <react_1.Td>
        <components_1.SupplierAvatar supplierId={doc.supplierId}/>
      </react_1.Td>
    </react_1.Tr>);
}
function PurchaseOrderDocumentRow(_a) {
    var doc = _a.doc;
    return (<react_1.Tr>
      <react_1.Td>
        <components_1.Hyperlink to={path_1.path.to.purchaseOrder(doc.id)}>
          <react_1.HStack spacing={1}>
            <lu_1.LuLayoutList className="size-4"/>
            <span>{doc.purchaseOrderId}</span>
          </react_1.HStack>
        </components_1.Hyperlink>
      </react_1.Td>
      <react_1.Td>
        <PurchaseOrder_1.PurchasingStatus status={doc.status}/>
      </react_1.Td>
      <react_1.Td>
        <components_1.SupplierAvatar supplierId={doc.supplierId}/>
      </react_1.Td>
    </react_1.Tr>);
}
function PurchaseInvoiceRow(_a) {
    var doc = _a.doc;
    return (<react_1.Tr>
      <react_1.Td>
        <components_1.Hyperlink to={path_1.path.to.salesRfq(doc.id)}>
          <react_1.HStack spacing={1}>
            <lu_1.LuCreditCard className="size-4"/>
            <span>{doc.invoiceId}</span>
          </react_1.HStack>
        </components_1.Hyperlink>
      </react_1.Td>
      <react_1.Td>
        {/* @ts-expect-error - Return type is not defined */}
        <invoicing_1.PurchaseInvoicingStatus status={doc.status}/>
      </react_1.Td>
      <react_1.Td>
        <components_1.SupplierAvatar supplierId={doc.supplierId}/>
      </react_1.Td>
    </react_1.Tr>);
}
function SupplierApprovalRow(_a) {
    var doc = _a.doc;
    return (<react_1.Tr>
      <react_1.Td>
        <components_1.Hyperlink to={path_1.path.to.supplier(doc.id)}>
          <components_1.SupplierAvatar supplierId={doc.id}/>
        </components_1.Hyperlink>
      </react_1.Td>
      <react_1.Td>
        <SupplierStatusIndicator_1.SupplierStatusIndicator status={doc.supplierStatus}/>
      </react_1.Td>
      <react_1.Td>-</react_1.Td>
    </react_1.Tr>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
