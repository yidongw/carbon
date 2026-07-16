"use strict";
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
var auth_server_1 = require("@carbon/auth/auth.server");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var purchasing_models_1 = require("~/modules/purchasing/purchasing.models");
var chart_1 = require("~/utils/chart");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, locale, monthName, url, searchParams, start, end, supplierId, startDate, endDate, daysBetween, previousEndDate, previousStartDate, interval, key, kpi, _d, _e, orders, previousOrders, _f, groupedData, previousGroupedData, _g, data, previousPeriodData, _h, groupedData, previousGroupedData, _j, data, previousPeriodData, _k, invoices, previousInvoices, _l, groupedData, previousGroupedData, _m, data, previousPeriodData, _o, groupedData, previousGroupedData, _p, data, previousPeriodData, _q, quotes, previousQuotes, _r, groupedData, previousGroupedData, _s, data, previousPeriodData, _t, groupedData, previousGroupedData, _u, data, previousPeriodData;
        var _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_11) {
            switch (_11.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "purchasing"
                    })];
                case 1:
                    _c = _11.sent(), client = _c.client, companyId = _c.companyId;
                    locale = (0, utils_1.getPreferenceHeaders)(request).locale;
                    monthName = function (dateKey) {
                        return new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2000, Number(dateKey.split("-")[1]) - 1));
                    };
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    start = String(searchParams.get("start"));
                    end = String(searchParams.get("end"));
                    supplierId = searchParams.get("supplierId");
                    startDate = (0, date_1.toCalendarDateTime)((0, date_1.parseDateTime)(start));
                    endDate = (0, date_1.toCalendarDateTime)((0, date_1.parseDateTime)(end));
                    daysBetween = endDate.compare(startDate);
                    previousEndDate = startDate;
                    previousStartDate = startDate.add({ days: -daysBetween });
                    interval = searchParams.get("interval");
                    key = params.key;
                    if (!key ||
                        !start ||
                        !end ||
                        !interval ||
                        daysBetween < 1 ||
                        daysBetween > 500)
                        return [2 /*return*/, {
                                data: [],
                                previousPeriodData: []
                            }];
                    kpi = purchasing_models_1.KPIs.find(function (k) { return k.key === key; });
                    if (!kpi)
                        return [2 /*return*/, {
                                data: [],
                                previousPeriodData: []
                            }];
                    _d = kpi.key;
                    switch (_d) {
                        case "purchaseOrderCount": return [3 /*break*/, 2];
                        case "purchaseOrderAmount": return [3 /*break*/, 2];
                        case "purchaseInvoiceCount": return [3 /*break*/, 4];
                        case "purchaseInvoiceAmount": return [3 /*break*/, 4];
                        case "supplierQuoteCount": return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 2: return [4 /*yield*/, Promise.all([
                        getPurchaseOrdersQuery(client, {
                            companyId: companyId,
                            supplierId: supplierId,
                            start: start,
                            end: end
                        }),
                        getPurchaseOrdersQuery(client, {
                            companyId: companyId,
                            supplierId: supplierId,
                            start: previousStartDate.toString(),
                            end: previousEndDate.toString()
                        })
                    ])];
                case 3:
                    _e = _11.sent(), orders = _e[0], previousOrders = _e[1];
                    if (daysBetween < 60) {
                        _f = [
                            (0, chart_1.groupDataByDay)((_v = orders.data) !== null && _v !== void 0 ? _v : [], {
                                start: start,
                                end: end,
                                groupBy: "orderDate"
                            }),
                            (0, chart_1.groupDataByDay)((_w = previousOrders.data) !== null && _w !== void 0 ? _w : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "orderDate"
                            })
                        ], groupedData = _f[0], previousGroupedData = _f[1];
                        _g = [
                            groupedData,
                            previousGroupedData
                        ].map(function (data) {
                            return Object.entries(data)
                                .map(function (_a) {
                                var date = _a[0], d = _a[1];
                                return ({
                                    date: date,
                                    value: kpi.key === "purchaseOrderAmount"
                                        ? d.reduce(function (sum, i) { var _a; return sum + ((_a = i.orderTotal) !== null && _a !== void 0 ? _a : 0); }, 0)
                                        : d.length
                                });
                            })
                                .sort(function (a, b) { return a.date.localeCompare(b.date); });
                        }), data = _g[0], previousPeriodData = _g[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    else {
                        _h = [
                            (0, chart_1.groupDataByMonth)((_x = orders.data) !== null && _x !== void 0 ? _x : [], {
                                start: start,
                                end: end,
                                groupBy: "orderDate"
                            }),
                            (0, chart_1.groupDataByMonth)((_y = previousOrders.data) !== null && _y !== void 0 ? _y : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "orderDate"
                            })
                        ], groupedData = _h[0], previousGroupedData = _h[1];
                        _j = [
                            groupedData,
                            previousGroupedData
                        ].map(function (data) {
                            return Object.entries(data)
                                .map(function (_a) {
                                var date = _a[0], d = _a[1];
                                return ({
                                    month: monthName(date),
                                    monthKey: date,
                                    value: kpi.key === "purchaseOrderAmount"
                                        ? d.reduce(function (sum, i) { var _a; return sum + ((_a = i.orderTotal) !== null && _a !== void 0 ? _a : 0); }, 0)
                                        : d.length
                                });
                            })
                                .sort(function (a, b) { return a.monthKey.localeCompare(b.monthKey); });
                        }), data = _j[0], previousPeriodData = _j[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    _11.label = 4;
                case 4: return [4 /*yield*/, Promise.all([
                        getPurchaseInvoicesQuery(client, {
                            companyId: companyId,
                            supplierId: supplierId,
                            start: start,
                            end: end
                        }),
                        getPurchaseInvoicesQuery(client, {
                            companyId: companyId,
                            supplierId: supplierId,
                            start: previousStartDate.toString(),
                            end: previousEndDate.toString()
                        })
                    ])];
                case 5:
                    _k = _11.sent(), invoices = _k[0], previousInvoices = _k[1];
                    if (daysBetween < 60) {
                        _l = [
                            (0, chart_1.groupDataByDay)((_z = invoices.data) !== null && _z !== void 0 ? _z : [], {
                                start: start,
                                end: end,
                                groupBy: "dateIssued"
                            }),
                            (0, chart_1.groupDataByDay)((_0 = previousInvoices.data) !== null && _0 !== void 0 ? _0 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "dateIssued"
                            })
                        ], groupedData = _l[0], previousGroupedData = _l[1];
                        _m = [
                            groupedData,
                            previousGroupedData
                        ].map(function (data) {
                            return Object.entries(data)
                                .map(function (_a) {
                                var date = _a[0], d = _a[1];
                                return ({
                                    date: date,
                                    value: kpi.key === "purchaseInvoiceAmount"
                                        ? d.reduce(function (sum, i) { var _a; return sum + ((_a = i.orderTotal) !== null && _a !== void 0 ? _a : 0); }, 0)
                                        : d.length
                                });
                            })
                                .sort(function (a, b) { return a.date.localeCompare(b.date); });
                        }), data = _m[0], previousPeriodData = _m[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    else {
                        _o = [
                            (0, chart_1.groupDataByMonth)((_1 = invoices.data) !== null && _1 !== void 0 ? _1 : [], {
                                start: start,
                                end: end,
                                groupBy: "dateIssued"
                            }),
                            (0, chart_1.groupDataByMonth)((_2 = previousInvoices.data) !== null && _2 !== void 0 ? _2 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "dateIssued"
                            })
                        ], groupedData = _o[0], previousGroupedData = _o[1];
                        _p = [
                            groupedData,
                            previousGroupedData
                        ].map(function (data) {
                            return Object.entries(data)
                                .map(function (_a) {
                                var date = _a[0], d = _a[1];
                                return ({
                                    month: monthName(date),
                                    monthKey: date,
                                    value: kpi.key === "purchaseInvoiceAmount"
                                        ? d.reduce(function (sum, i) { var _a; return sum + ((_a = i.orderTotal) !== null && _a !== void 0 ? _a : 0); }, 0)
                                        : d.length
                                });
                            })
                                .sort(function (a, b) { return a.monthKey.localeCompare(b.monthKey); });
                        }), data = _p[0], previousPeriodData = _p[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    _11.label = 6;
                case 6: return [4 /*yield*/, Promise.all([
                        getSupplierQuotesQuery(client, {
                            companyId: companyId,
                            supplierId: supplierId,
                            start: start,
                            end: end
                        }),
                        getSupplierQuotesQuery(client, {
                            companyId: companyId,
                            supplierId: supplierId,
                            start: previousStartDate.toString(),
                            end: previousEndDate.toString()
                        })
                    ])];
                case 7:
                    _q = _11.sent(), quotes = _q[0], previousQuotes = _q[1];
                    if (daysBetween < 60) {
                        _r = [
                            (0, chart_1.groupDataByDay)((_4 = (_3 = quotes.data) === null || _3 === void 0 ? void 0 : _3.map(function (q) { return ({
                                createdAt: q.createdAt
                            }); })) !== null && _4 !== void 0 ? _4 : [], {
                                start: start,
                                end: end,
                                groupBy: "createdAt"
                            }),
                            (0, chart_1.groupDataByDay)((_6 = (_5 = previousQuotes.data) === null || _5 === void 0 ? void 0 : _5.map(function (q) { return ({
                                createdAt: q.createdAt
                            }); })) !== null && _6 !== void 0 ? _6 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "createdAt"
                            })
                        ], groupedData = _r[0], previousGroupedData = _r[1];
                        _s = [
                            groupedData,
                            previousGroupedData
                        ].map(function (data) {
                            return Object.entries(data)
                                .map(function (_a) {
                                var date = _a[0], d = _a[1];
                                return ({
                                    date: date,
                                    value: d.length
                                });
                            })
                                .sort(function (a, b) { return a.date.localeCompare(b.date); });
                        }), data = _s[0], previousPeriodData = _s[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    else {
                        _t = [
                            (0, chart_1.groupDataByMonth)((_8 = (_7 = quotes.data) === null || _7 === void 0 ? void 0 : _7.map(function (q) { return ({
                                createdAt: q.createdAt
                            }); })) !== null && _8 !== void 0 ? _8 : [], {
                                start: start,
                                end: end,
                                groupBy: "createdAt"
                            }),
                            (0, chart_1.groupDataByMonth)((_10 = (_9 = previousQuotes.data) === null || _9 === void 0 ? void 0 : _9.map(function (q) { return ({
                                createdAt: q.createdAt
                            }); })) !== null && _10 !== void 0 ? _10 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "createdAt"
                            })
                        ], groupedData = _t[0], previousGroupedData = _t[1];
                        _u = [
                            groupedData,
                            previousGroupedData
                        ].map(function (data) {
                            return Object.entries(data)
                                .map(function (_a) {
                                var date = _a[0], d = _a[1];
                                return ({
                                    month: monthName(date),
                                    monthKey: date,
                                    value: d.length
                                });
                            })
                                .sort(function (a, b) { return a.monthKey.localeCompare(b.monthKey); });
                        }), data = _u[0], previousPeriodData = _u[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    _11.label = 8;
                case 8: throw new Error("Invalid KPI key: ".concat(key));
            }
        });
    });
}
function getPurchaseOrdersQuery(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var query;
        var companyId = _b.companyId, supplierId = _b.supplierId, start = _b.start, end = _b.end;
        return __generator(this, function (_c) {
            query = client
                .from("purchaseOrders")
                .select("orderTotal, orderDate", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .in("status", [
                "To Review",
                "To Receive",
                "To Invoice",
                "To Receive and Invoice",
                "Completed"
            ])
                .gte("orderDate", start)
                .lte("orderDate", end);
            if (supplierId) {
                query = query.eq("supplierId", supplierId);
            }
            query = query.order("orderDate", { ascending: false });
            return [2 /*return*/, query];
        });
    });
}
function getPurchaseInvoicesQuery(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var query;
        var companyId = _b.companyId, supplierId = _b.supplierId, start = _b.start, end = _b.end;
        return __generator(this, function (_c) {
            query = client
                .from("purchaseInvoices")
                .select("orderTotal, dateIssued", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .in("status", ["Pending", "Partially Paid", "Paid", "Open", "Overdue"])
                .gte("dateIssued", start)
                .lte("dateIssued", end);
            if (supplierId) {
                query = query.eq("supplierId", supplierId);
            }
            query = query.order("dateIssued", { ascending: false });
            return [2 /*return*/, query];
        });
    });
}
function getSupplierQuotesQuery(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var endWithTime, query;
        var companyId = _b.companyId, supplierId = _b.supplierId, start = _b.start, end = _b.end;
        return __generator(this, function (_c) {
            endWithTime = end.includes("T") ? end : "".concat(end, "T23:59:59");
            query = client
                .from("supplierQuote")
                .select("createdAt", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .gte("createdAt", start)
                .lte("createdAt", endWithTime);
            if (supplierId) {
                query = query.eq("supplierId", supplierId);
            }
            query = query.order("createdAt", { ascending: false });
            return [2 /*return*/, query];
        });
    });
}
