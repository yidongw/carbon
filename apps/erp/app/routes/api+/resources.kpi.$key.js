"use strict";
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
var auth_server_1 = require("@carbon/auth/auth.server");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var resources_models_1 = require("~/modules/resources/resources.models");
var chart_1 = require("~/utils/chart");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, locale, monthName, url, searchParams, start, end, workCenterId, startDate, endDate, daysBetween, previousEndDate, previousStartDate, interval, key, kpi, _d, _e, dispatches, previousDispatches, _f, groupedData, previousGroupedData, _g, data, previousPeriodData, _h, groupedData, previousGroupedData, _j, data, previousPeriodData, _k, productionEvents, failures, previousProductionEvents, previousFailures, _l, groupedEvents, previousGroupedEvents, _m, groupedFailures, previousGroupedFailures, calculateMtbfByDay, data, previousPeriodData, _o, groupedEvents, previousGroupedEvents, _p, groupedFailures, previousGroupedFailures, calculateMtbfByMonth, data, previousPeriodData, _q, items, previousItems, _r, groupedData, previousGroupedData, _s, data, previousPeriodData, _t, groupedData, previousGroupedData, _u, data, previousPeriodData, _v, dispatches, previousDispatches, countByWorkCenter, data, previousPeriodData, _w, items, previousItems, _x, groupedData, previousGroupedData, _y, data, previousPeriodData, _z, groupedData, previousGroupedData, _0, data, previousPeriodData;
        var _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_23) {
            switch (_23.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "resources"
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
                    workCenterId = searchParams.get("workCenterId");
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
                    kpi = resources_models_1.MaintenanceKPIs.find(function (k) { return k.key === key; });
                    if (!kpi)
                        return [2 /*return*/, {
                                data: [],
                                previousPeriodData: []
                            }];
                    _d = kpi.key;
                    switch (_d) {
                        case "mttr": return [3 /*break*/, 2];
                        case "mtbf": return [3 /*break*/, 4];
                        case "sparePartCost": return [3 /*break*/, 6];
                        case "worstPerformingMachines": return [3 /*break*/, 8];
                        case "sparePartConsumption": return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 12];
                case 2: return [4 /*yield*/, Promise.all([
                        getCompletedDispatchesQuery(client, {
                            companyId: companyId,
                            workCenterId: workCenterId,
                            start: start,
                            end: end
                        }),
                        getCompletedDispatchesQuery(client, {
                            companyId: companyId,
                            workCenterId: workCenterId,
                            start: previousStartDate.toString(),
                            end: previousEndDate.toString()
                        })
                    ])];
                case 3:
                    _e = _23.sent(), dispatches = _e[0], previousDispatches = _e[1];
                    if (daysBetween < 60) {
                        _f = [
                            (0, chart_1.groupDataByDay)((_1 = dispatches.data) !== null && _1 !== void 0 ? _1 : [], {
                                start: start,
                                end: end,
                                groupBy: "completedAt"
                            }),
                            (0, chart_1.groupDataByDay)((_2 = previousDispatches.data) !== null && _2 !== void 0 ? _2 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "completedAt"
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
                                    value: d.length > 0
                                        ? d.reduce(function (sum, i) { var _a; return sum + ((_a = i.duration) !== null && _a !== void 0 ? _a : 0); }, 0) / d.length
                                        : 0
                                });
                            })
                                .sort(function (a, b) { return a.date.localeCompare(b.date); });
                        }), data = _g[0], previousPeriodData = _g[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    else {
                        _h = [
                            (0, chart_1.groupDataByMonth)((_3 = dispatches.data) !== null && _3 !== void 0 ? _3 : [], {
                                start: start,
                                end: end,
                                groupBy: "completedAt"
                            }),
                            (0, chart_1.groupDataByMonth)((_4 = previousDispatches.data) !== null && _4 !== void 0 ? _4 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "completedAt"
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
                                    value: d.length > 0
                                        ? d.reduce(function (sum, i) { var _a; return sum + ((_a = i.duration) !== null && _a !== void 0 ? _a : 0); }, 0) / d.length
                                        : 0
                                });
                            })
                                .sort(function (a, b) { return a.monthKey.localeCompare(b.monthKey); });
                        }), data = _j[0], previousPeriodData = _j[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    _23.label = 4;
                case 4: return [4 /*yield*/, Promise.all([
                        getProductionEventsQuery(client, {
                            companyId: companyId,
                            workCenterId: workCenterId,
                            start: start,
                            end: end
                        }),
                        getReactiveDispatchesQuery(client, {
                            companyId: companyId,
                            workCenterId: workCenterId,
                            start: start,
                            end: end
                        }),
                        getProductionEventsQuery(client, {
                            companyId: companyId,
                            workCenterId: workCenterId,
                            start: previousStartDate.toString(),
                            end: previousEndDate.toString()
                        }),
                        getReactiveDispatchesQuery(client, {
                            companyId: companyId,
                            workCenterId: workCenterId,
                            start: previousStartDate.toString(),
                            end: previousEndDate.toString()
                        })
                    ])];
                case 5:
                    _k = _23.sent(), productionEvents = _k[0], failures = _k[1], previousProductionEvents = _k[2], previousFailures = _k[3];
                    if (daysBetween < 60) {
                        _l = [
                            (0, chart_1.groupDataByDay)((_5 = productionEvents.data) !== null && _5 !== void 0 ? _5 : [], {
                                start: start,
                                end: end,
                                groupBy: "startTime"
                            }),
                            (0, chart_1.groupDataByDay)((_6 = previousProductionEvents.data) !== null && _6 !== void 0 ? _6 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "startTime"
                            })
                        ], groupedEvents = _l[0], previousGroupedEvents = _l[1];
                        _m = [
                            (0, chart_1.groupDataByDay)((_7 = failures.data) !== null && _7 !== void 0 ? _7 : [], {
                                start: start,
                                end: end,
                                groupBy: "createdAt"
                            }),
                            (0, chart_1.groupDataByDay)((_8 = previousFailures.data) !== null && _8 !== void 0 ? _8 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "createdAt"
                            })
                        ], groupedFailures = _m[0], previousGroupedFailures = _m[1];
                        calculateMtbfByDay = function (events, failures) {
                            var allDates = new Set(__spreadArray(__spreadArray([], Object.keys(events), true), Object.keys(failures), true));
                            return Array.from(allDates)
                                .map(function (date) {
                                var _a, _b;
                                var dayEvents = (_a = events[date]) !== null && _a !== void 0 ? _a : [];
                                var dayFailures = (_b = failures[date]) !== null && _b !== void 0 ? _b : [];
                                var operatingTime = dayEvents.reduce(function (sum, e) { var _a; return sum + ((_a = e.duration) !== null && _a !== void 0 ? _a : 0); }, 0);
                                var failureCount = dayFailures.length;
                                return {
                                    date: date,
                                    value: failureCount > 0 ? operatingTime / failureCount : 0
                                };
                            })
                                .sort(function (a, b) { return a.date.localeCompare(b.date); });
                        };
                        data = calculateMtbfByDay(groupedEvents, groupedFailures);
                        previousPeriodData = calculateMtbfByDay(previousGroupedEvents, previousGroupedFailures);
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    else {
                        _o = [
                            (0, chart_1.groupDataByMonth)((_9 = productionEvents.data) !== null && _9 !== void 0 ? _9 : [], {
                                start: start,
                                end: end,
                                groupBy: "startTime"
                            }),
                            (0, chart_1.groupDataByMonth)((_10 = previousProductionEvents.data) !== null && _10 !== void 0 ? _10 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "startTime"
                            })
                        ], groupedEvents = _o[0], previousGroupedEvents = _o[1];
                        _p = [
                            (0, chart_1.groupDataByMonth)((_11 = failures.data) !== null && _11 !== void 0 ? _11 : [], {
                                start: start,
                                end: end,
                                groupBy: "createdAt"
                            }),
                            (0, chart_1.groupDataByMonth)((_12 = previousFailures.data) !== null && _12 !== void 0 ? _12 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "createdAt"
                            })
                        ], groupedFailures = _p[0], previousGroupedFailures = _p[1];
                        calculateMtbfByMonth = function (events, failures) {
                            var allMonths = new Set(__spreadArray(__spreadArray([], Object.keys(events), true), Object.keys(failures), true));
                            return Array.from(allMonths)
                                .map(function (monthKey) {
                                var _a, _b;
                                var monthEvents = (_a = events[monthKey]) !== null && _a !== void 0 ? _a : [];
                                var monthFailures = (_b = failures[monthKey]) !== null && _b !== void 0 ? _b : [];
                                var operatingTime = monthEvents.reduce(function (sum, e) { var _a; return sum + ((_a = e.duration) !== null && _a !== void 0 ? _a : 0); }, 0);
                                var failureCount = monthFailures.length;
                                return {
                                    month: monthName(monthKey),
                                    monthKey: monthKey,
                                    value: failureCount > 0 ? operatingTime / failureCount : 0
                                };
                            })
                                .sort(function (a, b) { return a.monthKey.localeCompare(b.monthKey); });
                        };
                        data = calculateMtbfByMonth(groupedEvents, groupedFailures);
                        previousPeriodData = calculateMtbfByMonth(previousGroupedEvents, previousGroupedFailures);
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    _23.label = 6;
                case 6: return [4 /*yield*/, Promise.all([
                        getDispatchItemsQuery(client, {
                            companyId: companyId,
                            workCenterId: workCenterId,
                            start: start,
                            end: end
                        }),
                        getDispatchItemsQuery(client, {
                            companyId: companyId,
                            workCenterId: workCenterId,
                            start: previousStartDate.toString(),
                            end: previousEndDate.toString()
                        })
                    ])];
                case 7:
                    _q = _23.sent(), items = _q[0], previousItems = _q[1];
                    if (daysBetween < 60) {
                        _r = [
                            (0, chart_1.groupDataByDay)((_13 = items.data) !== null && _13 !== void 0 ? _13 : [], {
                                start: start,
                                end: end,
                                groupBy: "completedAt"
                            }),
                            (0, chart_1.groupDataByDay)((_14 = previousItems.data) !== null && _14 !== void 0 ? _14 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "completedAt"
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
                                    value: d.reduce(function (sum, i) { var _a; return sum + ((_a = i.totalCost) !== null && _a !== void 0 ? _a : 0); }, 0)
                                });
                            })
                                .sort(function (a, b) { return a.date.localeCompare(b.date); });
                        }), data = _s[0], previousPeriodData = _s[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    else {
                        _t = [
                            (0, chart_1.groupDataByMonth)((_15 = items.data) !== null && _15 !== void 0 ? _15 : [], {
                                start: start,
                                end: end,
                                groupBy: "completedAt"
                            }),
                            (0, chart_1.groupDataByMonth)((_16 = previousItems.data) !== null && _16 !== void 0 ? _16 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "completedAt"
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
                                    value: d.reduce(function (sum, i) { var _a; return sum + ((_a = i.totalCost) !== null && _a !== void 0 ? _a : 0); }, 0)
                                });
                            })
                                .sort(function (a, b) { return a.monthKey.localeCompare(b.monthKey); });
                        }), data = _u[0], previousPeriodData = _u[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    _23.label = 8;
                case 8: return [4 /*yield*/, Promise.all([
                        getReactiveDispatchesByWorkCenterQuery(client, {
                            companyId: companyId,
                            start: start,
                            end: end
                        }),
                        getReactiveDispatchesByWorkCenterQuery(client, {
                            companyId: companyId,
                            start: previousStartDate.toString(),
                            end: previousEndDate.toString()
                        })
                    ])];
                case 9:
                    _v = _23.sent(), dispatches = _v[0], previousDispatches = _v[1];
                    countByWorkCenter = function (data) {
                        var counts = {};
                        data.forEach(function (d) {
                            var _a;
                            if (!d.workCenterId || !((_a = d.workCenter) === null || _a === void 0 ? void 0 : _a.name))
                                return;
                            if (!counts[d.workCenterId]) {
                                counts[d.workCenterId] = { name: d.workCenter.name, count: 0 };
                            }
                            counts[d.workCenterId].count++;
                        });
                        return Object.values(counts)
                            .map(function (c) { return ({ name: c.name, value: c.count }); })
                            .sort(function (a, b) { return b.value - a.value; })
                            .slice(0, 10); // Top 10 worst performers
                    };
                    data = countByWorkCenter((_17 = dispatches.data) !== null && _17 !== void 0 ? _17 : []);
                    previousPeriodData = countByWorkCenter((_18 = previousDispatches.data) !== null && _18 !== void 0 ? _18 : []);
                    return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                case 10: return [4 /*yield*/, Promise.all([
                        getDispatchItemsQuery(client, {
                            companyId: companyId,
                            workCenterId: workCenterId,
                            start: start,
                            end: end
                        }),
                        getDispatchItemsQuery(client, {
                            companyId: companyId,
                            workCenterId: workCenterId,
                            start: previousStartDate.toString(),
                            end: previousEndDate.toString()
                        })
                    ])];
                case 11:
                    _w = _23.sent(), items = _w[0], previousItems = _w[1];
                    if (daysBetween < 60) {
                        _x = [
                            (0, chart_1.groupDataByDay)((_19 = items.data) !== null && _19 !== void 0 ? _19 : [], {
                                start: start,
                                end: end,
                                groupBy: "completedAt"
                            }),
                            (0, chart_1.groupDataByDay)((_20 = previousItems.data) !== null && _20 !== void 0 ? _20 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "completedAt"
                            })
                        ], groupedData = _x[0], previousGroupedData = _x[1];
                        _y = [
                            groupedData,
                            previousGroupedData
                        ].map(function (data) {
                            return Object.entries(data)
                                .map(function (_a) {
                                var date = _a[0], d = _a[1];
                                return ({
                                    date: date,
                                    value: d.reduce(function (sum, i) { var _a; return sum + ((_a = i.quantity) !== null && _a !== void 0 ? _a : 0); }, 0)
                                });
                            })
                                .sort(function (a, b) { return a.date.localeCompare(b.date); });
                        }), data = _y[0], previousPeriodData = _y[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    else {
                        _z = [
                            (0, chart_1.groupDataByMonth)((_21 = items.data) !== null && _21 !== void 0 ? _21 : [], {
                                start: start,
                                end: end,
                                groupBy: "completedAt"
                            }),
                            (0, chart_1.groupDataByMonth)((_22 = previousItems.data) !== null && _22 !== void 0 ? _22 : [], {
                                start: previousStartDate.toString(),
                                end: previousEndDate.toString(),
                                groupBy: "completedAt"
                            })
                        ], groupedData = _z[0], previousGroupedData = _z[1];
                        _0 = [
                            groupedData,
                            previousGroupedData
                        ].map(function (data) {
                            return Object.entries(data)
                                .map(function (_a) {
                                var date = _a[0], d = _a[1];
                                return ({
                                    month: monthName(date),
                                    monthKey: date,
                                    value: d.reduce(function (sum, i) { var _a; return sum + ((_a = i.quantity) !== null && _a !== void 0 ? _a : 0); }, 0)
                                });
                            })
                                .sort(function (a, b) { return a.monthKey.localeCompare(b.monthKey); });
                        }), data = _0[0], previousPeriodData = _0[1];
                        return [2 /*return*/, { data: data, previousPeriodData: previousPeriodData }];
                    }
                    _23.label = 12;
                case 12: throw new Error("Invalid KPI key: ".concat(key));
            }
        });
    });
}
function getCompletedDispatchesQuery(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var endWithTime, query;
        var companyId = _b.companyId, workCenterId = _b.workCenterId, start = _b.start, end = _b.end;
        return __generator(this, function (_c) {
            endWithTime = end.includes("T") ? end : "".concat(end, "T23:59:59");
            query = client
                .from("maintenanceDispatch")
                .select("id, duration, completedAt")
                .eq("companyId", companyId)
                .eq("status", "Completed")
                .not("completedAt", "is", null)
                .gte("completedAt", start)
                .lte("completedAt", endWithTime);
            if (workCenterId) {
                query = query.eq("workCenterId", workCenterId);
            }
            return [2 /*return*/, query.order("completedAt", { ascending: false })];
        });
    });
}
function getReactiveDispatchesQuery(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var endWithTime, query;
        var companyId = _b.companyId, workCenterId = _b.workCenterId, start = _b.start, end = _b.end;
        return __generator(this, function (_c) {
            endWithTime = end.includes("T") ? end : "".concat(end, "T23:59:59");
            query = client
                .from("maintenanceDispatch")
                .select("id, workCenterId, createdAt")
                .eq("companyId", companyId)
                .eq("source", "Reactive")
                .gte("createdAt", start)
                .lte("createdAt", endWithTime);
            if (workCenterId) {
                query = query.eq("workCenterId", workCenterId);
            }
            return [2 /*return*/, query.order("createdAt", { ascending: true })];
        });
    });
}
function getProductionEventsQuery(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var endWithTime, query;
        var companyId = _b.companyId, workCenterId = _b.workCenterId, start = _b.start, end = _b.end;
        return __generator(this, function (_c) {
            endWithTime = end.includes("T") ? end : "".concat(end, "T23:59:59");
            query = client
                .from("productionEvent")
                .select("id, duration, workCenterId, startTime")
                .eq("companyId", companyId)
                .not("endTime", "is", null)
                .gte("startTime", start)
                .lte("startTime", endWithTime);
            if (workCenterId) {
                query = query.eq("workCenterId", workCenterId);
            }
            return [2 /*return*/, query];
        });
    });
}
function getReactiveDispatchesByWorkCenterQuery(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var endWithTime;
        var companyId = _b.companyId, start = _b.start, end = _b.end;
        return __generator(this, function (_c) {
            endWithTime = end.includes("T") ? end : "".concat(end, "T23:59:59");
            return [2 /*return*/, client
                    .from("maintenanceDispatch")
                    .select("id, workCenterId, workCenter:workCenterId(name), createdAt")
                    .eq("companyId", companyId)
                    .eq("source", "Reactive")
                    .not("workCenterId", "is", null)
                    .gte("createdAt", start)
                    .lte("createdAt", endWithTime)
                    .order("createdAt", { ascending: false })];
        });
    });
}
function getDispatchItemsQuery(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var endWithTime, query, result, filtered, flattenedData;
        var _c, _d;
        var companyId = _b.companyId, workCenterId = _b.workCenterId, start = _b.start, end = _b.end;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    endWithTime = end.includes("T") ? end : "".concat(end, "T23:59:59");
                    query = client
                        .from("maintenanceDispatchItem")
                        .select("\n      id,\n      quantity,\n      totalCost,\n      maintenanceDispatch:maintenanceDispatchId(\n        id,\n        workCenterId,\n        completedAt\n      )\n    ")
                        .eq("companyId", companyId);
                    return [4 /*yield*/, query];
                case 1:
                    result = _e.sent();
                    filtered = (_d = (_c = result.data) === null || _c === void 0 ? void 0 : _c.filter(function (item) {
                        var dispatch = item.maintenanceDispatch;
                        if (!(dispatch === null || dispatch === void 0 ? void 0 : dispatch.completedAt))
                            return false;
                        if (dispatch.completedAt < start || dispatch.completedAt > endWithTime)
                            return false;
                        if (workCenterId && dispatch.workCenterId !== workCenterId)
                            return false;
                        return true;
                    })) !== null && _d !== void 0 ? _d : [];
                    flattenedData = filtered.map(function (item) {
                        var _a;
                        return (__assign(__assign({}, item), { completedAt: (_a = item.maintenanceDispatch) === null || _a === void 0 ? void 0 : _a.completedAt }));
                    });
                    return [2 /*return*/, { data: flattenedData }];
            }
        });
    });
}
