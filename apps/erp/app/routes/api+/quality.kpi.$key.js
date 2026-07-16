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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
var auth_server_1 = require("@carbon/auth/auth.server");
var quality_models_1 = require("~/modules/quality/quality.models");
var settings_1 = require("~/modules/settings");
// --- ISO Week Helpers ---
function getISOWeekYear(date) {
    var d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return { year: d.getUTCFullYear(), week: week };
}
function formatWeekKey(year, week) {
    return "".concat(year, "-W").concat(String(week).padStart(2, "0"));
}
function weekKeyFromDate(dateStr) {
    var _a = getISOWeekYear(new Date(dateStr)), year = _a.year, week = _a.week;
    return formatWeekKey(year, week);
}
function generateWeekKeys(startDate, endDate) {
    var keys = [];
    var current = new Date(startDate);
    current.setDate(current.getDate() - ((current.getDay() + 6) % 7));
    while (current <= endDate) {
        var _a = getISOWeekYear(current), year = _a.year, week = _a.week;
        keys.push(formatWeekKey(year, week));
        current.setDate(current.getDate() + 7);
    }
    return keys;
}
var PRIORITY_ORDER = ["Critical", "High", "Medium", "Low"];
// --- Loader ---
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, url, searchParams, start, end, issueTypeId, key, kpi, _d, _e, issuesResult, settingsResult, issues, endDate, startDate, allWeekKeys, weekMap_1, _i, allWeekKeys_1, k, startKey, _f, issues_1, issue, openKey, closeKey, data, totalClosed, issues, counts, _g, _h, issue, _j, issues, types, counts, _k, _l, issue, typeName, sorted, total_1, cumulative_1, data, _m, issues, types, grid, _o, _p, issue, typeName, data, issues, grid_1, _q, PRIORITY_ORDER_1, p, _r, _s, issue, data, issues, issueIds, supplierIssues, counts, _t, _u, si, supplier, data, query, issues, now, grid_2, _v, PRIORITY_ORDER_2, p, _w, _x, issue, weeksOpen, bucket, data, issues, total, count, _y, _z, issue, days;
        var _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_15) {
            switch (_15.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "quality"
                    })];
                case 1:
                    _c = _15.sent(), client = _c.client, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    start = searchParams.get("start");
                    end = searchParams.get("end");
                    issueTypeId = searchParams.get("issueTypeId");
                    key = params.key;
                    if (!key || !start || !end)
                        return [2 /*return*/, { data: [], previousPeriodData: [] }];
                    kpi = quality_models_1.QualityKPIs.find(function (k) { return k.key === key; });
                    // Allow avgDaysToClose as a special key
                    if (!kpi && key !== "avgDaysToClose")
                        return [2 /*return*/, { data: [], previousPeriodData: [] }];
                    _d = key;
                    switch (_d) {
                        case "weeklyTracking": return [3 /*break*/, 2];
                        case "statusDistribution": return [3 /*break*/, 4];
                        case "paretoByType": return [3 /*break*/, 6];
                        case "ncrsByType": return [3 /*break*/, 8];
                        case "sourceAnalysis": return [3 /*break*/, 10];
                        case "supplierQuality": return [3 /*break*/, 12];
                        case "weeksOpen": return [3 /*break*/, 15];
                        case "avgDaysToClose": return [3 /*break*/, 17];
                    }
                    return [3 /*break*/, 19];
                case 2: return [4 /*yield*/, Promise.all([
                        getIssuesQuery(client, { companyId: companyId, issueTypeId: issueTypeId }),
                        (0, settings_1.getCompanySettings)(client, companyId)
                    ])];
                case 3:
                    _e = _15.sent(), issuesResult = _e[0], settingsResult = _e[1];
                    issues = (_0 = issuesResult.data) !== null && _0 !== void 0 ? _0 : [];
                    endDate = new Date(end);
                    startDate = new Date(start);
                    allWeekKeys = generateWeekKeys(startDate, endDate);
                    weekMap_1 = new Map();
                    for (_i = 0, allWeekKeys_1 = allWeekKeys; _i < allWeekKeys_1.length; _i++) {
                        k = allWeekKeys_1[_i];
                        weekMap_1.set(k, { opened: 0, closed: 0 });
                    }
                    startKey = allWeekKeys[0];
                    for (_f = 0, issues_1 = issues; _f < issues_1.length; _f++) {
                        issue = issues_1[_f];
                        if (!issue.openDate)
                            continue;
                        openKey = weekKeyFromDate(issue.openDate);
                        if (weekMap_1.has(openKey)) {
                            weekMap_1.get(openKey).opened++;
                        }
                        if (issue.closeDate) {
                            closeKey = weekKeyFromDate(issue.closeDate);
                            if (closeKey >= startKey && weekMap_1.has(closeKey)) {
                                weekMap_1.get(closeKey).closed++;
                            }
                        }
                    }
                    data = allWeekKeys.map(function (week) {
                        var entry = weekMap_1.get(week);
                        return {
                            week: week,
                            opened: entry.opened,
                            closed: entry.closed
                        };
                    });
                    totalClosed = data.reduce(function (sum, d) { return sum + d.closed; }, 0);
                    return [2 /*return*/, {
                            data: data,
                            previousPeriodData: [],
                            meta: {
                                qualityIssueTarget: (_2 = (_1 = settingsResult.data) === null || _1 === void 0 ? void 0 : _1.qualityIssueTarget) !== null && _2 !== void 0 ? _2 : 20,
                                totalClosed: totalClosed
                            }
                        }];
                case 4: return [4 /*yield*/, getFilteredIssuesQuery(client, {
                        companyId: companyId,
                        start: start,
                        end: end,
                        issueTypeId: issueTypeId
                    })];
                case 5:
                    issues = _15.sent();
                    counts = {
                        Registered: 0,
                        "In Progress": 0,
                        Closed: 0
                    };
                    for (_g = 0, _h = (_3 = issues.data) !== null && _3 !== void 0 ? _3 : []; _g < _h.length; _g++) {
                        issue = _h[_g];
                        if (issue.status && counts[issue.status] !== undefined) {
                            counts[issue.status]++;
                        }
                    }
                    return [2 /*return*/, {
                            data: [
                                {
                                    name: "Registered",
                                    value: counts.Registered,
                                    fill: "hsl(var(--chart-5))"
                                },
                                {
                                    name: "In Progress",
                                    value: counts["In Progress"],
                                    fill: "hsl(var(--chart-1))"
                                },
                                {
                                    name: "Closed",
                                    value: counts.Closed,
                                    fill: "hsl(var(--success))"
                                }
                            ],
                            previousPeriodData: []
                        }];
                case 6: return [4 /*yield*/, Promise.all([
                        getFilteredIssuesQuery(client, {
                            companyId: companyId,
                            start: start,
                            end: end,
                            issueTypeId: issueTypeId
                        }),
                        getIssueTypesMap(client, companyId)
                    ])];
                case 7:
                    _j = _15.sent(), issues = _j[0], types = _j[1];
                    counts = {};
                    for (_k = 0, _l = (_4 = issues.data) !== null && _4 !== void 0 ? _4 : []; _k < _l.length; _k++) {
                        issue = _l[_k];
                        typeName = (_6 = types.get((_5 = issue.nonConformanceTypeId) !== null && _5 !== void 0 ? _5 : "")) !== null && _6 !== void 0 ? _6 : "Unknown";
                        counts[typeName] = (counts[typeName] || 0) + 1;
                    }
                    sorted = Object.entries(counts)
                        .map(function (_a) {
                        var type = _a[0], count = _a[1];
                        return ({ type: type, count: count });
                    })
                        .sort(function (a, b) { return b.count - a.count; });
                    total_1 = sorted.reduce(function (sum, d) { return sum + d.count; }, 0);
                    cumulative_1 = 0;
                    data = sorted.map(function (d) {
                        cumulative_1 += d.count;
                        return __assign(__assign({}, d), { cumulative: total_1 > 0 ? Math.round((cumulative_1 / total_1) * 100) : 0 });
                    });
                    return [2 /*return*/, { data: data, previousPeriodData: [] }];
                case 8: return [4 /*yield*/, Promise.all([
                        getFilteredIssuesQuery(client, {
                            companyId: companyId,
                            start: start,
                            end: end,
                            issueTypeId: issueTypeId
                        }),
                        getIssueTypesMap(client, companyId)
                    ])];
                case 9:
                    _m = _15.sent(), issues = _m[0], types = _m[1];
                    grid = {};
                    for (_o = 0, _p = (_7 = issues.data) !== null && _7 !== void 0 ? _7 : []; _o < _p.length; _o++) {
                        issue = _p[_o];
                        typeName = (_9 = types.get((_8 = issue.nonConformanceTypeId) !== null && _8 !== void 0 ? _8 : "")) !== null && _9 !== void 0 ? _9 : "Unknown";
                        if (!grid[typeName]) {
                            grid[typeName] = { Critical: 0, High: 0, Medium: 0, Low: 0 };
                        }
                        if (issue.priority) {
                            grid[typeName][issue.priority]++;
                        }
                    }
                    data = Object.entries(grid)
                        .sort(function (_a, _b) {
                        var a = _a[1];
                        var b = _b[1];
                        var totalA = a.Critical + a.High + a.Medium + a.Low;
                        var totalB = b.Critical + b.High + b.Medium + b.Low;
                        return totalB - totalA;
                    })
                        .map(function (_a) {
                        var type = _a[0], counts = _a[1];
                        return (__assign({ type: type }, counts));
                    });
                    return [2 /*return*/, { data: data, previousPeriodData: [] }];
                case 10: return [4 /*yield*/, getFilteredIssuesQuery(client, {
                        companyId: companyId,
                        start: start,
                        end: end,
                        issueTypeId: issueTypeId
                    })];
                case 11:
                    issues = _15.sent();
                    grid_1 = {};
                    for (_q = 0, PRIORITY_ORDER_1 = PRIORITY_ORDER; _q < PRIORITY_ORDER_1.length; _q++) {
                        p = PRIORITY_ORDER_1[_q];
                        grid_1[p] = { Internal: 0, External: 0 };
                    }
                    for (_r = 0, _s = (_10 = issues.data) !== null && _10 !== void 0 ? _10 : []; _r < _s.length; _r++) {
                        issue = _s[_r];
                        if (!issue.priority || !issue.source)
                            continue;
                        if (grid_1[issue.priority]) {
                            grid_1[issue.priority][issue.source]++;
                        }
                    }
                    data = PRIORITY_ORDER.map(function (priority) { return (__assign({ priority: priority }, grid_1[priority])); });
                    return [2 /*return*/, { data: data, previousPeriodData: [] }];
                case 12: return [4 /*yield*/, getFilteredIssuesQuery(client, {
                        companyId: companyId,
                        start: start,
                        end: end,
                        issueTypeId: issueTypeId
                    })];
                case 13:
                    issues = _15.sent();
                    issueIds = ((_11 = issues.data) !== null && _11 !== void 0 ? _11 : []).map(function (i) { return i.id; });
                    if (issueIds.length === 0) {
                        return [2 /*return*/, { data: [], previousPeriodData: [] }];
                    }
                    return [4 /*yield*/, client
                            .from("nonConformanceSupplier")
                            .select("nonConformanceId, supplier:supplier(id, name)")
                            .eq("companyId", companyId)
                            .in("nonConformanceId", issueIds)];
                case 14:
                    supplierIssues = _15.sent();
                    counts = {};
                    for (_t = 0, _u = (_12 = supplierIssues.data) !== null && _12 !== void 0 ? _12 : []; _t < _u.length; _t++) {
                        si = _u[_t];
                        supplier = si.supplier;
                        if (!supplier)
                            continue;
                        if (!counts[supplier.id]) {
                            counts[supplier.id] = { name: supplier.name, count: 0 };
                        }
                        counts[supplier.id].count++;
                    }
                    data = Object.values(counts)
                        .sort(function (a, b) { return b.count - a.count; })
                        .slice(0, 10);
                    return [2 /*return*/, { data: data, previousPeriodData: [] }];
                case 15:
                    query = client
                        .from("issues")
                        .select("id, openDate, priority, status")
                        .eq("companyId", companyId)
                        .in("status", ["Registered", "In Progress"]);
                    if (issueTypeId) {
                        query = query.eq("nonConformanceTypeId", issueTypeId);
                    }
                    return [4 /*yield*/, query];
                case 16:
                    issues = _15.sent();
                    now = Date.now();
                    grid_2 = {};
                    for (_v = 0, PRIORITY_ORDER_2 = PRIORITY_ORDER; _v < PRIORITY_ORDER_2.length; _v++) {
                        p = PRIORITY_ORDER_2[_v];
                        grid_2[p] = {
                            "0-4 weeks": 0,
                            "5-8 weeks": 0,
                            "9-12 weeks": 0,
                            "13+ weeks": 0
                        };
                    }
                    for (_w = 0, _x = (_13 = issues.data) !== null && _13 !== void 0 ? _13 : []; _w < _x.length; _w++) {
                        issue = _x[_w];
                        if (!issue.openDate || !issue.priority)
                            continue;
                        weeksOpen = Math.floor((now - new Date(issue.openDate).getTime()) / (7 * 24 * 60 * 60 * 1000));
                        bucket = void 0;
                        if (weeksOpen <= 4)
                            bucket = "0-4 weeks";
                        else if (weeksOpen <= 8)
                            bucket = "5-8 weeks";
                        else if (weeksOpen <= 12)
                            bucket = "9-12 weeks";
                        else
                            bucket = "13+ weeks";
                        if (grid_2[issue.priority]) {
                            grid_2[issue.priority][bucket]++;
                        }
                    }
                    data = PRIORITY_ORDER.map(function (criticality) { return (__assign({ criticality: criticality }, grid_2[criticality])); });
                    return [2 /*return*/, { data: data, previousPeriodData: [] }];
                case 17: return [4 /*yield*/, getFilteredIssuesQuery(client, {
                        companyId: companyId,
                        start: start,
                        end: end,
                        issueTypeId: issueTypeId
                    })];
                case 18:
                    issues = _15.sent();
                    total = 0;
                    count = 0;
                    for (_y = 0, _z = (_14 = issues.data) !== null && _14 !== void 0 ? _14 : []; _y < _z.length; _y++) {
                        issue = _z[_y];
                        if (issue.status !== "Closed" || !issue.openDate || !issue.closeDate)
                            continue;
                        days = Math.floor((new Date(issue.closeDate).getTime() -
                            new Date(issue.openDate).getTime()) /
                            (24 * 60 * 60 * 1000));
                        if (days >= 0) {
                            total += days;
                            count++;
                        }
                    }
                    return [2 /*return*/, {
                            data: [{ value: count > 0 ? Math.round(total / count) : null }],
                            previousPeriodData: []
                        }];
                case 19: return [2 /*return*/, { data: [], previousPeriodData: [] }];
            }
        });
    });
}
// --- Query Helpers ---
function getIssuesQuery(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var query;
        var companyId = _b.companyId, issueTypeId = _b.issueTypeId;
        return __generator(this, function (_c) {
            query = client
                .from("issues")
                .select("id, status, priority, source, openDate, closeDate, nonConformanceTypeId, containmentStatus, createdAt")
                .eq("companyId", companyId);
            if (issueTypeId) {
                query = query.eq("nonConformanceTypeId", issueTypeId);
            }
            return [2 /*return*/, query];
        });
    });
}
function getFilteredIssuesQuery(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var query;
        var companyId = _b.companyId, start = _b.start, end = _b.end, issueTypeId = _b.issueTypeId;
        return __generator(this, function (_c) {
            query = client
                .from("issues")
                .select("id, status, priority, source, openDate, closeDate, nonConformanceTypeId, containmentStatus, createdAt")
                .eq("companyId", companyId)
                .gte("openDate", start)
                .lte("openDate", end);
            if (issueTypeId) {
                query = query.eq("nonConformanceTypeId", issueTypeId);
            }
            return [2 /*return*/, query];
        });
    });
}
function getIssueTypesMap(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, map, _i, _a, t;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("nonConformanceType")
                        .select("id, name")
                        .eq("companyId", companyId)];
                case 1:
                    result = _c.sent();
                    map = new Map();
                    for (_i = 0, _a = (_b = result.data) !== null && _b !== void 0 ? _b : []; _i < _a.length; _i++) {
                        t = _a[_i];
                        map.set(t.id, t.name);
                    }
                    return [2 /*return*/, map];
            }
        });
    });
}
