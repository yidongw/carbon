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
var date_1 = require("@internationalized/date");
var production_models_1 = require("~/modules/production/production.models");
var duration_1 = require("~/utils/duration");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, url, searchParams, start, end, startDate, endDate, currentDate, daysBetween, previousEnd, previousStart, interval, key, kpi, _d, _e, workCenters_1, productionEvents, previousProductionEvents, _f, groupedEvents, previousGroupedEvents, _g, data, previousPeriodData, jobs, _h, jobOperations, productionEvents, jobOperationsByJobId, productionEventsByJobId, data, _i, _j, job, jobId, operations, estimatedTime, events, actualTime, _k, jobs, previousJobs, _l, data, previousPeriodData;
        var _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production"
                    })];
                case 1:
                    _c = _x.sent(), client = _c.client, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    start = String(searchParams.get("start"));
                    end = String(searchParams.get("end"));
                    startDate = (0, date_1.toCalendarDateTime)((0, date_1.parseDateTime)(start));
                    endDate = (0, date_1.toCalendarDateTime)((0, date_1.parseDateTime)(end));
                    currentDate = (0, date_1.toCalendarDateTime)((0, date_1.now)("UTC"));
                    daysBetween = endDate.compare(startDate);
                    previousEnd = startDate;
                    previousStart = startDate.add({ days: -daysBetween });
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
                    kpi = production_models_1.KPIs.find(function (k) { return k.key === key; });
                    if (!kpi)
                        return [2 /*return*/, {
                                data: [],
                                previousPeriodData: []
                            }];
                    _d = kpi.key;
                    switch (_d) {
                        case "utilization": return [3 /*break*/, 2];
                        case "estimatesVsActuals": return [3 /*break*/, 4];
                        case "completionTime": return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 2: return [4 /*yield*/, Promise.all([
                        client
                            .from("workCenter")
                            .select("id, name")
                            .eq("companyId", companyId)
                            .eq("active", true),
                        client
                            .from("productionEvent")
                            .select("startTime, endTime, workCenterId")
                            .eq("companyId", companyId)
                            .gte("startTime", start)
                            .or("endTime.lte.".concat(end, ",endTime.is.null"))
                            .order("startTime", { ascending: false })
                            .order("endTime", { ascending: false }),
                        client
                            .from("productionEvent")
                            .select("startTime, endTime, workCenterId")
                            .eq("companyId", companyId)
                            .gte("startTime", previousStart.toString())
                            .or("endTime.lte.".concat(previousEnd.toString(), ",endTime.is.null"))
                            .order("startTime", { ascending: false })
                            .order("endTime", { ascending: false })
                    ])];
                case 3:
                    _e = _x.sent(), workCenters_1 = _e[0], productionEvents = _e[1], previousProductionEvents = _e[2];
                    _f = [
                        (_m = productionEvents.data) !== null && _m !== void 0 ? _m : [],
                        (_o = previousProductionEvents.data) !== null && _o !== void 0 ? _o : []
                    ].map(function (events) {
                        return events.reduce(function (acc, event) {
                            if (!event.workCenterId)
                                return acc;
                            if (!acc[event.workCenterId]) {
                                acc[event.workCenterId] = [];
                            }
                            acc[event.workCenterId].push(__assign(__assign({}, event), { workCenterId: event.workCenterId, endTime: event.endTime === null ? currentDate.toString() : event.endTime }));
                            return acc;
                        }, {});
                    }), groupedEvents = _f[0], previousGroupedEvents = _f[1];
                    _g = [
                        groupedEvents,
                        previousGroupedEvents
                    ].map(function (events) {
                        return Object.entries(events)
                            .map(function (_a) {
                            var _b;
                            var workCenterId = _a[0], events = _a[1];
                            var workCenter = (_b = workCenters_1.data) === null || _b === void 0 ? void 0 : _b.find(function (wc) { return wc.id === workCenterId; });
                            if (!workCenter)
                                return { key: workCenterId, value: 0 };
                            // Sort events by start time, then end time if start times are equal
                            var sortedEvents = __spreadArray([], events, true).sort(function (a, b) {
                                var aStart = new Date(a.startTime).getTime();
                                var bStart = new Date(b.startTime).getTime();
                                if (aStart !== bStart)
                                    return aStart - bStart;
                                return (new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
                            });
                            var totalTime = 0;
                            var lastEndTime = null;
                            // Calculate non-overlapping time
                            for (var _i = 0, sortedEvents_1 = sortedEvents; _i < sortedEvents_1.length; _i++) {
                                var event_1 = sortedEvents_1[_i];
                                var startTime = new Date(event_1.startTime).getTime();
                                var endTime = new Date(event_1.endTime).getTime();
                                if (lastEndTime === null) {
                                    totalTime += endTime - startTime;
                                }
                                else {
                                    // If this event starts after the last end time, add the full duration
                                    if (startTime > lastEndTime) {
                                        totalTime += endTime - startTime;
                                    }
                                    // If this event overlaps but ends later, add the non-overlapping portion
                                    else if (endTime > lastEndTime) {
                                        totalTime += endTime - lastEndTime;
                                    }
                                    // If this event is completely contained within the last event, skip it
                                }
                                // Update lastEndTime if this event ends later
                                if (lastEndTime === null || endTime > lastEndTime) {
                                    lastEndTime = endTime;
                                }
                            }
                            return {
                                key: workCenter.name,
                                value: totalTime
                            };
                        })
                            .sort(function (a, b) { return b.value - a.value; });
                    }), data = _g[0], previousPeriodData = _g[1];
                    return [2 /*return*/, {
                            data: data,
                            previousPeriodData: previousPeriodData
                        }];
                case 4: return [4 /*yield*/, client
                        .from("job")
                        .select("id, jobId, customerId, estimatedTime, actualTime, completedDate")
                        .eq("companyId", companyId)
                        .gte("completedDate", start)
                        .lte("completedDate", end)
                        .not("completedDate", "is", null)];
                case 5:
                    jobs = _x.sent();
                    if (jobs.error || !jobs.data || jobs.data.length === 0) {
                        return [2 /*return*/, {
                                data: [],
                                previousPeriodData: []
                            }];
                    }
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("jobOperation")
                                .select("*")
                                .in("jobId", (_q = (_p = jobs.data) === null || _p === void 0 ? void 0 : _p.map(function (job) { return job.id; })) !== null && _q !== void 0 ? _q : []),
                            client
                                .from("productionEvent")
                                .select("*, ...jobOperation(jobId)")
                                .eq("companyId", companyId)
                                .in("jobOperation.jobId", (_s = (_r = jobs.data) === null || _r === void 0 ? void 0 : _r.map(function (job) { return job.id; })) !== null && _s !== void 0 ? _s : [])
                        ])];
                case 6:
                    _h = _x.sent(), jobOperations = _h[0], productionEvents = _h[1];
                    jobOperationsByJobId = (_t = jobOperations.data) === null || _t === void 0 ? void 0 : _t.reduce(function (acc, operation) {
                        if (!acc[operation.jobId]) {
                            acc[operation.jobId] = [];
                        }
                        acc[operation.jobId].push(operation);
                        return acc;
                    }, {});
                    productionEventsByJobId = (_u = productionEvents.data) === null || _u === void 0 ? void 0 : _u.reduce(function (acc, event) {
                        if (!acc[event.jobId]) {
                            acc[event.jobId] = [];
                        }
                        acc[event.jobId].push(event);
                        return acc;
                    }, {});
                    data = [];
                    // Calculate totals for each job
                    for (_i = 0, _j = jobs.data; _i < _j.length; _i++) {
                        job = _j[_i];
                        jobId = job.id;
                        operations = (jobOperationsByJobId === null || jobOperationsByJobId === void 0 ? void 0 : jobOperationsByJobId[jobId]) || [];
                        estimatedTime = operations.reduce(function (total, operation) {
                            var withDurations = (0, duration_1.makeDurations)(operation);
                            return total + withDurations.duration;
                        }, 0);
                        events = (productionEventsByJobId === null || productionEventsByJobId === void 0 ? void 0 : productionEventsByJobId[jobId]) || [];
                        actualTime = events.reduce(function (total, event) {
                            var startTime = new Date(event.startTime).getTime();
                            var endTime = event.endTime
                                ? new Date(event.endTime).getTime()
                                : new Date().getTime();
                            return total + (endTime - startTime);
                        }, 0);
                        data.push({
                            key: job.jobId,
                            actual: actualTime,
                            estimate: estimatedTime,
                            difference: estimatedTime === 0
                                ? 0
                                : (actualTime - estimatedTime) / estimatedTime
                        });
                    }
                    return [2 /*return*/, {
                            data: data.sort(function (a, b) { return a.difference - b.difference; }),
                            previousPeriodData: []
                        }];
                case 7: return [4 /*yield*/, Promise.all([
                        client
                            .from("job")
                            .select("id, jobId, secondsToComplete")
                            .eq("companyId", companyId)
                            .gte("completedDate", start)
                            .lte("completedDate", end)
                            .not("completedDate", "is", null)
                            .not("releasedDate", "is", null),
                        client
                            .from("job")
                            .select("id, jobId, secondsToComplete")
                            .eq("companyId", companyId)
                            .gte("completedDate", previousStart.toString())
                            .lte("completedDate", previousEnd.toString())
                            .not("completedDate", "is", null)
                            .not("releasedDate", "is", null)
                    ])];
                case 8:
                    _k = _x.sent(), jobs = _k[0], previousJobs = _k[1];
                    _l = [
                        (_v = jobs.data) !== null && _v !== void 0 ? _v : [],
                        (_w = previousJobs.data) !== null && _w !== void 0 ? _w : []
                    ].map(function (jobs) {
                        return jobs
                            .map(function (job) {
                            var _a;
                            return ({
                                key: job.jobId,
                                value: ((_a = job.secondsToComplete) !== null && _a !== void 0 ? _a : 0) * 1000
                            });
                        })
                            .sort(function (a, b) { return b.value - a.value; });
                    }), data = _l[0], previousPeriodData = _l[1];
                    return [2 /*return*/, {
                            data: data,
                            previousPeriodData: previousPeriodData
                        }];
                case 9: throw new Error("Invalid KPI key: ".concat(key));
            }
        });
    });
}
