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
var sales_models_1 = require("~/modules/sales/sales.models");
var chart_1 = require("~/utils/chart");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, locale, monthName, url, searchParams, start, end, customerId, startDate, endDate, daysBetween, previousEndDate, previousStartDate, interval, key, kpi, _d, _e, salesOrders, quotes, rfqs, previousSalesOrders, data, previousPeriodData, _f, salesOrders, previousSalesOrders, _g, groupedData, previousGroupedData, _h, data, previousPeriodData, _j, groupedData, previousGroupedData, _k, data, previousPeriodData, _l, quotes, previousQuotes, _m, groupedData, previousGroupedData, _o, data, previousPeriodData, _p, groupedData, previousGroupedData, _q, data, previousPeriodData, _r, rfqs, previousRfqs, _s, groupedData, previousGroupedData, _t, data, previousPeriodData, _u, groupedData, previousGroupedData, _v, data, previousPeriodData;
        var _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_23) {
            switch (_23.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales"
                    })];
                case 1:
                    _c = _23.sent(), client = _c.client, companyId = _c.companyId;
                    locale = (0, utils_1.getPreferenceHeaders)(request).locale;
                    monthName = function (dateKey) {
                        return new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2000, Number(dateKey.split("-")[1]) - 1));
                    };
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    start = String(searchParams.get("start"));
                    end = String(searchParams.get("end"));
                    customerId = searchParams.get("customerId");
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
                    kpi = sales_models_1.KPIs.find(function (k) { return k.key === key; });
                    if (!kpi)
                        return [2 /*return*/, {
                                data: [],
                                previousPeriodData: []
                            }];
                    _d = kpi.key;
                    switch (_d) {
                        case "salesFunnel": return [3 /*break*/, 2];
                        case "salesOrderRevenue": return [3 /*break*/, 4];
                        case "salesOrderCount": return [3 /*break*/, 4];
                        case "quoteCount": return [3 /*break*/, 6];
                        case "rfqCount": return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 10];
                case 2: return [4 /*yield*/, Promise.all([
                        getSalesOrdersQuery(client, {
                            companyId: companyId,
                            customerId: customerId,
                            start: start,
                            end: end
                        }),
                        getQuotesQuery(client, {
                            companyId: companyId,
                            customerId: customerId,
                            start: start,
                            end: end
                        }),
                        getRfqQuery(client, {
                            companyId: companyId,
                            customerId: customerId,
                            start: start,
                            end: end
                        }),
                        getSalesOrdersQuery(client, {
                            companyId: companyId,
                            customerId: customerId,
                            start: previousStartDate.toString(),
                            end: previousEndDate.toString()
                        })
                    ])];
                case 3:
                    _e = _23.sent(), salesOrders = _e[0], quotes = _e[1], rfqs = _e[2], previousSalesOrders = _e[3];
                    data = [
                        {
                            name: "RFQs",
                            value: (_w = rfqs.count) !== null && _w !== void 0 ? _w : 0
                        },
                        {
                            name: "Quotes",
                            value: (_x = quotes.count) !== null && _x !== void 0 ? _x : 0
                        },
                        {
                            name: "Sales Orders",
                            value: (_y = salesOrders.count) !== null && _y !== void 0 ? _y : 0
                        },
                        {
                            name: "Revenue",
                            value: (_0 = (_z = salesOrders.data) === null || _z === void 0 ? void 0 : _z.reduce(function (sum, order) { var _a; return sum + ((_a = order.orderTotal) !== null && _a !== void 0 ? _a : 0); }, 0)) !== null && _0 !== void 0 ? _0 : 0
                        }
                    ];
                    previousPeriodData = [
                        {
                            name: "Revenue",
                            value: (_2 = (_1 = previousSalesOrders.data) === null || _1 === void 0 ? void 0 : _1.reduce(function (sum, order) { var _a; return sum + ((_a = order.orderTotal) !== null && _a !== void 0 ? _a : 0); }, 0)) !== null && _2 !== void 0 ? _2 : 0
                        }
                    ];
                    return [2 /*return*/, {
                            data: data,
                            previousPeriodData: previousPeriodData
                        }];
                case 4: return [4 /*yield*/, Promise.all([
                        getSalesOrdersQuery(client, {
                            companyId: companyId,
                            customerId: customerId,
                            start: start,
                            end: end
                        }),
                        getSalesOrdersQuery(client, {
                            companyId: companyId,
                            customerId: customerId,
                            start: previousStartDate.toString(),
                            end: previousEndDate.toString()
                        })
                    ])];
                case 5:
                    _f = _23.sent(), salesOrders = _f[0], previousSalesOrders = _f[1];
                    if (daysBetween < 60) {
                        _g = [
                            (0, chart_1.groupDataByDay)((_3 = salesOrders.data) !== null && _3 !== void 0 ? _3 : [], {
                                start: start,
                                end: end,
                                groupBy: "orderDate"
                            }),
                            (0, chart_1.groupDataByDay)((_4 = previousSalesOrders.data) !== null && _4 !== void 0 ? _4 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "orderDate"
                            })
                        ], groupedData = _g[0], previousGroupedData = _g[1];
                        _h = [
                            groupedData,
                            previousGroupedData
                        ].map(function (data) {
                            return Object.entries(data)
                                .map(function (_a) {
                                var date = _a[0], d = _a[1];
                                return ({
                                    date: date,
                                    value: kpi.key === "salesOrderRevenue"
                                        ? d.reduce(function (sum, i) { var _a; return sum + ((_a = i.orderTotal) !== null && _a !== void 0 ? _a : 0); }, 0)
                                        : d.length
                                });
                            })
                                .sort(function (a, b) { return a.date.localeCompare(b.date); });
                        }), data = _h[0], previousPeriodData = _h[1];
                        return [2 /*return*/, {
                                data: data,
                                previousPeriodData: previousPeriodData
                            }];
                    }
                    else {
                        _j = [
                            (0, chart_1.groupDataByMonth)((_5 = salesOrders.data) !== null && _5 !== void 0 ? _5 : [], {
                                start: start,
                                end: end,
                                groupBy: "orderDate"
                            }),
                            (0, chart_1.groupDataByMonth)((_6 = previousSalesOrders.data) !== null && _6 !== void 0 ? _6 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "orderDate"
                            })
                        ], groupedData = _j[0], previousGroupedData = _j[1];
                        _k = [
                            groupedData,
                            previousGroupedData
                        ].map(function (data) {
                            return Object.entries(data)
                                .map(function (_a) {
                                var date = _a[0], d = _a[1];
                                return ({
                                    month: monthName(date),
                                    monthKey: date,
                                    value: kpi.key === "salesOrderRevenue"
                                        ? d.reduce(function (sum, i) { var _a; return sum + ((_a = i.orderTotal) !== null && _a !== void 0 ? _a : 0); }, 0)
                                        : d.length
                                });
                            })
                                .sort(function (a, b) { return a.monthKey.localeCompare(b.monthKey); });
                        }), data = _k[0], previousPeriodData = _k[1];
                        return [2 /*return*/, {
                                data: data,
                                previousPeriodData: previousPeriodData
                            }];
                    }
                    _23.label = 6;
                case 6: return [4 /*yield*/, Promise.all([
                        getQuotesQuery(client, {
                            companyId: companyId,
                            customerId: customerId,
                            start: start,
                            end: end
                        }),
                        getQuotesQuery(client, {
                            companyId: companyId,
                            customerId: customerId,
                            start: previousStartDate.toString(),
                            end: previousEndDate.toString()
                        })
                    ])];
                case 7:
                    _l = _23.sent(), quotes = _l[0], previousQuotes = _l[1];
                    if (daysBetween < 60) {
                        _m = [
                            (0, chart_1.groupDataByDay)((_8 = (_7 = quotes.data) === null || _7 === void 0 ? void 0 : _7.map(function (q) { return ({
                                createdAt: q.createdAt
                            }); })) !== null && _8 !== void 0 ? _8 : [], {
                                start: start,
                                end: end,
                                groupBy: "createdAt"
                            }),
                            (0, chart_1.groupDataByDay)((_10 = (_9 = previousQuotes.data) === null || _9 === void 0 ? void 0 : _9.map(function (q) { return ({
                                createdAt: q.createdAt
                            }); })) !== null && _10 !== void 0 ? _10 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "createdAt"
                            })
                        ], groupedData = _m[0], previousGroupedData = _m[1];
                        _o = [
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
                        }), data = _o[0], previousPeriodData = _o[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    else {
                        _p = [
                            (0, chart_1.groupDataByMonth)((_12 = (_11 = quotes.data) === null || _11 === void 0 ? void 0 : _11.map(function (q) { return ({
                                createdAt: q.createdAt
                            }); })) !== null && _12 !== void 0 ? _12 : [], {
                                start: start,
                                end: end,
                                groupBy: "createdAt"
                            }),
                            (0, chart_1.groupDataByMonth)((_14 = (_13 = previousQuotes.data) === null || _13 === void 0 ? void 0 : _13.map(function (q) { return ({
                                createdAt: q.createdAt
                            }); })) !== null && _14 !== void 0 ? _14 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "createdAt"
                            })
                        ], groupedData = _p[0], previousGroupedData = _p[1];
                        _q = [
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
                        }), data = _q[0], previousPeriodData = _q[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    _23.label = 8;
                case 8: return [4 /*yield*/, Promise.all([
                        getRfqQuery(client, {
                            companyId: companyId,
                            customerId: customerId,
                            start: start,
                            end: end
                        }),
                        getRfqQuery(client, {
                            companyId: companyId,
                            customerId: customerId,
                            start: previousStartDate.toString(),
                            end: previousEndDate.toString()
                        })
                    ])];
                case 9:
                    _r = _23.sent(), rfqs = _r[0], previousRfqs = _r[1];
                    if (daysBetween < 60) {
                        _s = [
                            (0, chart_1.groupDataByDay)((_16 = (_15 = rfqs.data) === null || _15 === void 0 ? void 0 : _15.map(function (r) { return ({
                                createdAt: r.createdAt
                            }); })) !== null && _16 !== void 0 ? _16 : [], {
                                start: start,
                                end: end,
                                groupBy: "createdAt"
                            }),
                            (0, chart_1.groupDataByDay)((_18 = (_17 = previousRfqs.data) === null || _17 === void 0 ? void 0 : _17.map(function (r) { return ({
                                createdAt: r.createdAt
                            }); })) !== null && _18 !== void 0 ? _18 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "createdAt"
                            })
                        ], groupedData = _s[0], previousGroupedData = _s[1];
                        _t = [
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
                        }), data = _t[0], previousPeriodData = _t[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    else {
                        _u = [
                            (0, chart_1.groupDataByMonth)((_20 = (_19 = rfqs.data) === null || _19 === void 0 ? void 0 : _19.map(function (r) { return ({
                                createdAt: r.createdAt
                            }); })) !== null && _20 !== void 0 ? _20 : [], {
                                start: start,
                                end: end,
                                groupBy: "createdAt"
                            }),
                            (0, chart_1.groupDataByMonth)((_22 = (_21 = previousRfqs.data) === null || _21 === void 0 ? void 0 : _21.map(function (r) { return ({
                                createdAt: r.createdAt
                            }); })) !== null && _22 !== void 0 ? _22 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "createdAt"
                            })
                        ], groupedData = _u[0], previousGroupedData = _u[1];
                        _v = [
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
                        }), data = _v[0], previousPeriodData = _v[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    _23.label = 10;
                case 10: throw new Error("Invalid KPI key: ".concat(key));
            }
        });
    });
}
function getSalesOrdersQuery(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var endWithTime, query;
        var companyId = _b.companyId, customerId = _b.customerId, start = _b.start, end = _b.end;
        return __generator(this, function (_c) {
            endWithTime = end.includes("T") ? end : "".concat(end, "T23:59:59");
            query = client
                .from("salesOrders")
                .select("orderTotal, orderDate", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .in("status", [
                "In Progress",
                "Needs Approval",
                "To Ship and Invoice",
                "To Ship",
                "To Invoice",
                "Confirmed",
                "Completed",
                "Invoiced"
            ])
                .gte("orderDate", start)
                .lte("orderDate", endWithTime);
            if (customerId) {
                query = query.eq("customerId", customerId);
            }
            query = query.order("orderDate", { ascending: false });
            return [2 /*return*/, query];
        });
    });
}
function getQuotesQuery(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var endWithTime, query;
        var companyId = _b.companyId, customerId = _b.customerId, start = _b.start, end = _b.end;
        return __generator(this, function (_c) {
            endWithTime = end.includes("T") ? end : "".concat(end, "T23:59:59");
            query = client
                .from("quote")
                .select("createdAt", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .in("status", ["Sent", "Ordered", "Partial", "Lost", "Expired"])
                .gte("createdAt", start)
                .lte("createdAt", endWithTime);
            if (customerId) {
                query = query.eq("customerId", customerId);
            }
            query = query.order("createdAt", { ascending: false });
            return [2 /*return*/, query];
        });
    });
}
function getRfqQuery(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var endWithTime, query;
        var companyId = _b.companyId, customerId = _b.customerId, start = _b.start, end = _b.end;
        return __generator(this, function (_c) {
            endWithTime = end.includes("T") ? end : "".concat(end, "T23:59:59");
            query = client
                .from("salesRfq")
                .select("createdAt", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .in("status", ["Ready for Quote", "Quoted", "Closed"])
                .gte("createdAt", start)
                .lte("createdAt", endWithTime);
            if (customerId) {
                query = query.eq("customerId", customerId);
            }
            query = query.order("createdAt", { ascending: false });
            return [2 /*return*/, query];
        });
    });
}
