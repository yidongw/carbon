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
exports.handle = void 0;
exports.loader = loader;
exports.default = ScheduleRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Location_1 = require("~/components/Form/Location");
var Filter_1 = require("~/components/Table/components/Filter");
var hooks_1 = require("~/hooks");
var production_1 = require("~/modules/production");
var DateKanban_1 = require("~/modules/production/ui/Schedule/Kanban/DateKanban");
var ScheuleNavigation_1 = require("~/modules/production/ui/Schedule/Kanban/ScheuleNavigation");
var resources_1 = require("~/modules/resources");
var shared_1 = require("~/modules/shared");
var users_server_1 = require("~/modules/users/users.server");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Schedule"], ["Schedule"]))),
    to: path_1.path.to.scheduleDates,
    module: "production"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, url, searchParams, search, filterParam, view, dateParam, timezone, currentDate, selectedSalesOrderIds, selectedTags, selectedAssignee, _i, filterParam_1, filter, _d, key, operator, value, locationId, userDefaults, _e, _f, locations, _g, _h, startDate, endDate, weekStart, weekEnd, monthStart, monthEnd, lastWeekStart, lastWeekEnd, _j, jobs, unscheduledJobs, tags, _k, _l, _m, _o, filteredJobs, filteredUnscheduledJobs, columns, todayDate, weekStart, i, day, isToday, monthStart, monthEnd, currentWeekStart, currentWeekEnd, isTodayInWeek, weekStartDate, weekEndDate, nextMonth, nextMonthName, scheduledItems, unscheduledItems, allJobs;
        var _p, _q, _r, _s, _t, _u, _v, _w;
        var request = _b.request;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        bypassRls: true
                    })];
                case 1:
                    _c = _x.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    filterParam = searchParams.getAll("filter");
                    view = (_p = searchParams.get("view")) !== null && _p !== void 0 ? _p : "week";
                    dateParam = searchParams.get("date");
                    timezone = (0, date_1.getLocalTimeZone)();
                    currentDate = dateParam
                        ? (0, date_1.parseDate)(dateParam)
                        : (0, date_1.toCalendarDate)((0, date_1.now)(timezone));
                    selectedSalesOrderIds = [];
                    selectedTags = [];
                    selectedAssignee = [];
                    if (filterParam) {
                        for (_i = 0, filterParam_1 = filterParam; _i < filterParam_1.length; _i++) {
                            filter = filterParam_1[_i];
                            _d = filter.split(":"), key = _d[0], operator = _d[1], value = _d[2];
                            if (key === "salesOrderId") {
                                if (operator === "in") {
                                    selectedSalesOrderIds = value.split(",");
                                }
                                else if (operator === "eq") {
                                    selectedSalesOrderIds = [value];
                                }
                            }
                            else if (key === "tag") {
                                if (operator === "in") {
                                    selectedTags = value.split(",");
                                }
                                else if (operator === "eq") {
                                    selectedTags = [value];
                                }
                            }
                            else if (key === "assignee") {
                                if (operator === "in") {
                                    selectedAssignee = value.split(",");
                                }
                                else if (operator === "eq") {
                                    selectedAssignee = [value];
                                }
                            }
                        }
                    }
                    locationId = searchParams.get("location");
                    if (!!locationId) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, users_server_1.getUserDefaults)(client, userId, companyId)];
                case 2:
                    userDefaults = _x.sent();
                    if (!userDefaults.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.productionDashboard];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(userDefaults.error, "Failed to load default location"))];
                case 3: throw _e.apply(void 0, _f.concat([_x.sent()]));
                case 4:
                    locationId = (_r = (_q = userDefaults.data) === null || _q === void 0 ? void 0 : _q.locationId) !== null && _r !== void 0 ? _r : null;
                    _x.label = 5;
                case 5:
                    if (!!locationId) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, resources_1.getLocationsList)(client, companyId)];
                case 6:
                    locations = _x.sent();
                    if (!(locations.error || !((_s = locations.data) === null || _s === void 0 ? void 0 : _s.length))) return [3 /*break*/, 8];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.productionDashboard];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(locations.error, "Failed to load any locations"))];
                case 7: throw _g.apply(void 0, _h.concat([_x.sent()]));
                case 8:
                    locationId = (_t = locations.data) === null || _t === void 0 ? void 0 : _t[0].id;
                    _x.label = 9;
                case 9:
                    if (view === "week") {
                        weekStart = (0, date_1.startOfWeek)(currentDate, "en-GB");
                        weekEnd = (0, date_1.endOfWeek)(currentDate, "en-GB");
                        startDate = weekStart.toString();
                        endDate = weekEnd.toString();
                    }
                    else {
                        monthStart = (0, date_1.startOfMonth)(currentDate);
                        monthEnd = (0, date_1.endOfMonth)(currentDate);
                        lastWeekStart = monthStart;
                        while (lastWeekStart.compare(monthEnd) <= 0) {
                            lastWeekStart = lastWeekStart.add({ weeks: 1 });
                        }
                        // Go back one week to get the last week that starts within the month
                        lastWeekStart = lastWeekStart.add({ weeks: -1 });
                        lastWeekEnd = lastWeekStart.add({ days: 6 });
                        startDate = monthStart.toString();
                        endDate = lastWeekEnd.toString();
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getJobsByDateRange)(client, locationId !== null && locationId !== void 0 ? locationId : "", startDate, endDate),
                            (0, production_1.getUnscheduledJobs)(client, locationId !== null && locationId !== void 0 ? locationId : ""),
                            (0, shared_1.getTagsList)(client, companyId, "job")
                        ])];
                case 10:
                    _j = _x.sent(), jobs = _j[0], unscheduledJobs = _j[1], tags = _j[2];
                    if (!jobs.error) return [3 /*break*/, 12];
                    console.error(jobs.error);
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.scheduleOperation];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(jobs.error, "Failed to fetch jobs"))];
                case 11: throw _k.apply(void 0, _l.concat([_x.sent()]));
                case 12:
                    if (!unscheduledJobs.error) return [3 /*break*/, 14];
                    console.error(unscheduledJobs.error);
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.scheduleOperation];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(unscheduledJobs.error, "Failed to fetch unscheduled jobs"))];
                case 13: throw _m.apply(void 0, _o.concat([_x.sent()]));
                case 14:
                    filteredJobs = (_u = jobs.data) !== null && _u !== void 0 ? _u : [];
                    filteredUnscheduledJobs = (_v = unscheduledJobs.data) !== null && _v !== void 0 ? _v : [];
                    if (selectedSalesOrderIds.length) {
                        filteredJobs = filteredJobs.filter(function (job) {
                            return selectedSalesOrderIds.includes(job.salesOrderId);
                        });
                        filteredUnscheduledJobs = filteredUnscheduledJobs.filter(function (job) {
                            return selectedSalesOrderIds.includes(job.salesOrderId);
                        });
                    }
                    if (selectedTags.length) {
                        filteredJobs = filteredJobs.filter(function (job) {
                            if (job.tags) {
                                return selectedTags.some(function (tag) { return job.tags.includes(tag); });
                            }
                            return false;
                        });
                        filteredUnscheduledJobs = filteredUnscheduledJobs.filter(function (job) {
                            if (job.tags) {
                                return selectedTags.some(function (tag) { return job.tags.includes(tag); });
                            }
                            return false;
                        });
                    }
                    if (selectedAssignee.length) {
                        filteredJobs = filteredJobs.filter(function (job) {
                            return selectedAssignee.includes(job.assignee);
                        });
                        filteredUnscheduledJobs = filteredUnscheduledJobs.filter(function (job) {
                            return selectedAssignee.includes(job.assignee);
                        });
                    }
                    if (search) {
                        filteredJobs = filteredJobs.filter(function (job) {
                            var _a, _b, _c;
                            return job.jobId.toLowerCase().includes(search.toLowerCase()) ||
                                ((_a = job.itemReadableId) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search.toLowerCase())) ||
                                ((_b = job.customerName) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(search.toLowerCase())) ||
                                ((_c = job.itemDescription) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(search.toLowerCase()));
                        });
                        filteredUnscheduledJobs = filteredUnscheduledJobs.filter(function (job) {
                            var _a, _b, _c;
                            return job.jobId.toLowerCase().includes(search.toLowerCase()) ||
                                ((_a = job.itemReadableId) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search.toLowerCase())) ||
                                ((_b = job.customerName) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(search.toLowerCase())) ||
                                ((_c = job.itemDescription) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(search.toLowerCase()));
                        });
                    }
                    columns = [];
                    todayDate = (0, date_1.toCalendarDate)((0, date_1.now)(timezone));
                    // Always add Unscheduled column first
                    columns.push({
                        id: "unscheduled",
                        title: "Unscheduled",
                        type: [],
                        active: false
                    });
                    if (view === "week") {
                        weekStart = (0, date_1.startOfWeek)(currentDate, "en-GB");
                        // Create 7 columns for days of the week (Mon-Sun) + 1 for "Next Week"
                        for (i = 0; i < 7; i++) {
                            day = weekStart.add({ days: i });
                            isToday = day.compare(todayDate) === 0;
                            columns.push({
                                id: day.toString(),
                                title: day.toDate(timezone).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric"
                                }),
                                type: [],
                                active: isToday
                            });
                        }
                        // Add "Next Week" column
                        columns.push({
                            id: "next-week",
                            title: "Next Week",
                            type: [],
                            active: false
                        });
                    }
                    else {
                        monthStart = (0, date_1.startOfMonth)(currentDate);
                        monthEnd = (0, date_1.endOfMonth)(currentDate);
                        currentWeekStart = monthStart;
                        // Continue while we're still in the month
                        while (currentWeekStart.compare(monthEnd) <= 0) {
                            currentWeekEnd = currentWeekStart.add({ days: 6 });
                            isTodayInWeek = todayDate.compare(currentWeekStart) >= 0 &&
                                todayDate.compare(currentWeekEnd) <= 0;
                            weekStartDate = currentWeekStart.toDate(timezone);
                            weekEndDate = currentWeekEnd.toDate(timezone);
                            columns.push({
                                id: currentWeekStart.toString(),
                                title: "".concat(weekStartDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric"
                                }), " - ").concat(weekEndDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric"
                                })),
                                type: [],
                                active: isTodayInWeek
                            });
                            // Move to the next week (7 days later)
                            currentWeekStart = currentWeekStart.add({ weeks: 1 });
                        }
                        nextMonth = monthEnd.add({ days: 1 });
                        nextMonthName = nextMonth
                            .toDate(timezone)
                            .toLocaleDateString("en-US", {
                            month: "long"
                        });
                        columns.push({
                            id: "next-month",
                            title: nextMonthName,
                            type: [],
                            active: false
                        });
                    }
                    scheduledItems = filteredJobs.map(function (job) {
                        var _a, _b, _c;
                        // Determine which column this item belongs to
                        var columnId = view === "week" ? "next-week" : "next-month";
                        if (job.dueDate) {
                            var dueDate = (0, date_1.parseDate)(job.dueDate.split("T")[0]);
                            if (view === "week") {
                                var weekStart = (0, date_1.startOfWeek)(currentDate, "en-GB"); // en-GB uses Monday as first day
                                var weekEnd = (0, date_1.endOfWeek)(currentDate, "en-GB");
                                if (dueDate.compare(weekStart) >= 0 && dueDate.compare(weekEnd) <= 0) {
                                    columnId = dueDate.toString();
                                }
                            }
                            else {
                                var monthStart = (0, date_1.startOfMonth)(currentDate);
                                var monthEnd = (0, date_1.endOfMonth)(currentDate);
                                if (dueDate.compare(monthStart) >= 0 &&
                                    dueDate.compare(monthEnd) <= 0) {
                                    // Find which week column this date belongs to
                                    // Weeks start on the 1st, 8th, 15th, 22nd, etc.
                                    var weekStart = monthStart;
                                    while (weekStart.compare(monthEnd) <= 0) {
                                        var weekEnd = weekStart.add({ days: 6 });
                                        if (dueDate.compare(weekStart) >= 0 &&
                                            dueDate.compare(weekEnd) <= 0) {
                                            columnId = weekStart.toString();
                                            break;
                                        }
                                        weekStart = weekStart.add({ weeks: 1 });
                                    }
                                }
                            }
                        }
                        return {
                            id: job.id,
                            columnId: columnId,
                            columnType: "", // Jobs don't have a specific process type
                            priority: (_a = job.priority) !== null && _a !== void 0 ? _a : 0,
                            title: job.jobId,
                            link: path_1.path.to.jobMethod(job.id, job.jobMakeMethodId),
                            subtitle: (_b = job.itemReadableId) !== null && _b !== void 0 ? _b : "",
                            assignee: job.assignee,
                            tags: job.tags,
                            description: job.itemDescription,
                            dueDate: job.dueDate,
                            completedDate: job.completedDate,
                            duration: 0, // Jobs don't have duration, only operations do
                            jobId: job.id,
                            jobMakeMethodId: job.jobMakeMethodId,
                            jobReadableId: job.jobId,
                            itemReadableId: (_c = job.itemReadableId) !== null && _c !== void 0 ? _c : "",
                            itemDescription: job.itemDescription,
                            progress: job.completedOperationCount / Math.max(job.operationCount, 1),
                            deadlineType: job.deadlineType,
                            customerId: job.customerId,
                            quantity: job.quantity,
                            quantityCompleted: job.quantityComplete,
                            quantityScrapped: 0,
                            salesOrderReadableId: job.salesOrderReadableId,
                            salesOrderId: job.salesOrderId,
                            salesOrderLineId: job.salesOrderLineId,
                            status: job.status,
                            setupDuration: 0,
                            laborDuration: 0,
                            machineDuration: 0,
                            thumbnailPath: job.thumbnailPath,
                            hasConflict: job.hasConflict
                        };
                    });
                    unscheduledItems = filteredUnscheduledJobs.map(function (job) {
                        var _a, _b, _c;
                        return ({
                            id: job.id,
                            columnId: "unscheduled",
                            columnType: "",
                            priority: (_a = job.priority) !== null && _a !== void 0 ? _a : 0,
                            title: job.jobId,
                            link: path_1.path.to.jobMethod(job.id, job.jobMakeMethodId),
                            subtitle: (_b = job.itemReadableId) !== null && _b !== void 0 ? _b : "",
                            assignee: job.assignee,
                            tags: job.tags,
                            description: job.itemDescription,
                            dueDate: job.dueDate,
                            completedDate: job.completedDate,
                            duration: 0,
                            jobId: job.id,
                            jobReadableId: job.jobId,
                            jobMakeMethodId: job.jobMakeMethodId,
                            itemReadableId: (_c = job.itemReadableId) !== null && _c !== void 0 ? _c : "",
                            itemDescription: job.itemDescription,
                            progress: job.completedOperationCount / Math.max(job.operationCount, 1),
                            deadlineType: job.deadlineType,
                            customerId: job.customerId,
                            quantity: job.quantity,
                            quantityCompleted: job.quantityComplete,
                            quantityScrapped: 0,
                            salesOrderReadableId: job.salesOrderReadableId,
                            salesOrderId: job.salesOrderId,
                            salesOrderLineId: job.salesOrderLineId,
                            status: job.status,
                            setupDuration: 0,
                            laborDuration: 0,
                            machineDuration: 0,
                            thumbnailPath: job.thumbnailPath,
                            hasConflict: job.hasConflict
                        });
                    });
                    allJobs = __spreadArray(__spreadArray([], filteredJobs, true), filteredUnscheduledJobs, true);
                    return [2 /*return*/, {
                            columns: columns,
                            items: __spreadArray(__spreadArray([], unscheduledItems, true), scheduledItems, true),
                            salesOrders: Object.entries(allJobs.reduce(function (acc, job) {
                                if (job.salesOrderId) {
                                    acc[job.salesOrderId] = job.salesOrderReadableId;
                                }
                                return acc;
                            }, {})).map(function (_a) {
                                var id = _a[0], readableId = _a[1];
                                return ({ id: id, readableId: readableId });
                            }),
                            availableTags: Object.entries(allJobs.reduce(function (acc, job) {
                                if (job.tags) {
                                    // biome-ignore lint/suspicious/useIterableCallbackReturn: suppressed due to migration
                                    job.tags.forEach(function (tag) { return (acc[tag] = true); });
                                }
                                return acc;
                            }, {})).map(function (_a) {
                                var tag = _a[0];
                                return tag;
                            }),
                            tags: (_w = tags.data) !== null && _w !== void 0 ? _w : [],
                            locationId: locationId,
                            view: view,
                            currentDate: currentDate.toString()
                        }];
            }
        });
    });
}
var defaultDisplaySettings = {
    showDuration: true,
    showCustomer: true,
    showDescription: true,
    showDueDate: true,
    showEmployee: true,
    showProgress: true,
    showQuantity: true,
    showStatus: true,
    showSalesOrder: true,
    showThumbnail: true
};
var DISPLAY_SETTINGS_KEY = "kanban-schedule-dates-display-settings";
function DateKanbanSchedule() {
    var t = (0, macro_2.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var _a = (0, react_router_1.useLoaderData)(), loaderColumns = _a.columns, initialItems = _a.items, salesOrders = _a.salesOrders, availableTags = _a.availableTags, tags = _a.tags, locationId = _a.locationId, view = _a.view, currentDate = _a.currentDate;
    var timezone = (0, date_1.getLocalTimeZone)();
    // Reformat column titles using user locale
    var columns = (0, react_2.useMemo)(function () {
        return loaderColumns.map(function (col) {
            // Skip non-date columns
            if (["unscheduled", "next-week", "next-month"].includes(col.id)) {
                if (col.id === "next-month") {
                    // Reformat the month name with locale
                    var monthStart = (0, date_1.startOfMonth)((0, date_1.parseDate)(currentDate));
                    var nextMonth = (0, date_1.endOfMonth)(monthStart).add({ days: 1 });
                    return __assign(__assign({}, col), { title: nextMonth
                            .toDate(timezone)
                            .toLocaleDateString(locale, { month: "long" }) });
                }
                return col;
            }
            // Try to parse the column ID as a date
            try {
                var date = (0, date_1.parseDate)(col.id);
                if (view === "week") {
                    return __assign(__assign({}, col), { title: date.toDate(timezone).toLocaleDateString(locale, {
                            weekday: "short",
                            month: "short",
                            day: "numeric"
                        }) });
                }
                else {
                    // Month view - columns represent week ranges
                    var weekEnd = date.add({ days: 6 });
                    return __assign(__assign({}, col), { title: "".concat(date.toDate(timezone).toLocaleDateString(locale, {
                            month: "short",
                            day: "numeric"
                        }), " - ").concat(weekEnd.toDate(timezone).toLocaleDateString(locale, {
                            month: "short",
                            day: "numeric"
                        })) });
                }
            }
            catch (_a) {
                return col;
            }
        });
    }, [loaderColumns, locale, view, currentDate, timezone]);
    var locations = (0, Location_1.useLocations)();
    var navigate = (0, react_router_1.useNavigate)();
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var _b = (0, react_2.useState)(initialItems), items = _b[0], setItems = _b[1];
    var _c = (0, react_1.useLocalStorage)(DISPLAY_SETTINGS_KEY, defaultDisplaySettings), displaySettings = _c[0], setDisplaySettings = _c[1];
    (0, react_2.useEffect)(function () {
        setItems(initialItems);
    }, [initialItems]);
    var sortItems = (0, react_2.useCallback)(function (items) {
        return __spreadArray([], items, true).sort(function (a, b) { return a.priority - b.priority; });
    }, []);
    (0, react_2.useEffect)(function () {
        setItems(function (prevItems) { return sortItems(prevItems); });
    }, [sortItems]);
    var people = (0, stores_1.usePeople)()[0];
    var params = (0, hooks_1.useUrlParams)()[0];
    var currentFilters = params.getAll("filter").filter(Boolean);
    var filters = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "salesOrderId",
                header: "Sales Order",
                filter: {
                    type: "static",
                    options: salesOrders.map(function (so) { return ({
                        label: so.readableId,
                        value: so.id
                    }); })
                }
            },
            {
                accessorKey: "assignee",
                header: "Assignee",
                filter: {
                    type: "static",
                    options: people.map(function (p) { return ({
                        label: p.name,
                        value: p.id
                    }); })
                }
            },
            {
                accessorKey: "tag",
                header: "Tag",
                filter: {
                    type: "static",
                    options: availableTags.map(function (tag) { return ({
                        label: tag,
                        value: tag
                    }); })
                }
            }
        ];
    }, [salesOrders, people, availableTags]);
    var parsedDate = (0, date_1.parseDate)(currentDate);
    var todayDate = (0, date_1.toCalendarDate)((0, date_1.now)(timezone));
    var getDateSpanLabel = (0, react_2.useCallback)(function (date, viewType) {
        var tz = (0, date_1.getLocalTimeZone)();
        if (viewType === "week") {
            var weekStart = (0, date_1.startOfWeek)(date, "en-GB");
            var weekEnd = (0, date_1.endOfWeek)(date, "en-GB");
            return "".concat(weekStart.toDate(tz).toLocaleDateString(locale, {
                month: "short",
                day: "numeric"
            }), " - ").concat(weekEnd.toDate(tz).toLocaleDateString(locale, {
                month: "short",
                day: "numeric"
            }));
        }
        else {
            return date.toDate(tz).toLocaleDateString(locale, {
                month: "short",
                year: "numeric"
            });
        }
    }, [locale]);
    var getSpanStartDate = (0, react_2.useCallback)(function (date, viewType) {
        if (viewType === "week") {
            return (0, date_1.startOfWeek)(date, "en-GB");
        }
        else {
            return (0, date_1.startOfMonth)(date);
        }
    }, []);
    var currentDateSpanLabel = (0, react_2.useMemo)(function () { return getDateSpanLabel(parsedDate, view); }, [parsedDate, view, getDateSpanLabel]);
    var dateSpanOptions = (0, react_2.useMemo)(function () {
        var spans = [];
        var todaySpanStart = getSpanStartDate(todayDate, view);
        // Add up to 4 previous spans (only if they are not in the past)
        for (var i = 4; i >= 1; i--) {
            var prevDate = view === "week"
                ? parsedDate.add({ weeks: -i })
                : parsedDate.add({ months: -i });
            var prevSpanStart = getSpanStartDate(prevDate, view);
            // Only add if the span start is not before today's span start
            if (prevSpanStart.compare(todaySpanStart) >= 0) {
                spans.push({
                    date: prevDate.toString(),
                    label: getDateSpanLabel(prevDate, view)
                });
            }
        }
        // Add current span
        spans.push({
            date: parsedDate.toString(),
            label: currentDateSpanLabel
        });
        // Add next 4 spans
        for (var i = 1; i <= 4; i++) {
            var nextDate = view === "week"
                ? parsedDate.add({ weeks: i })
                : parsedDate.add({ months: i });
            spans.push({
                date: nextDate.toString(),
                label: getDateSpanLabel(nextDate, view)
            });
        }
        return spans;
    }, [
        parsedDate,
        view,
        todayDate,
        getDateSpanLabel,
        getSpanStartDate,
        currentDateSpanLabel
    ]);
    var navigateToDate = function (dateStr) {
        var newParams = new URLSearchParams(searchParams);
        newParams.set("date", dateStr);
        navigate("?".concat(newParams.toString()));
    };
    var navigateDate = function (direction) {
        var newDate = view === "week"
            ? parsedDate.add({ weeks: direction === "next" ? 1 : -1 })
            : parsedDate.add({ months: direction === "next" ? 1 : -1 });
        var newParams = new URLSearchParams(searchParams);
        newParams.set("date", newDate.toString());
        navigate("?".concat(newParams.toString()));
    };
    var goToToday = function () {
        var newParams = new URLSearchParams(searchParams);
        newParams.delete("date"); // Removing date param will default to today
        navigate("?".concat(newParams.toString()));
    };
    return (<div className="flex flex-col h-full max-h-full overflow-auto relative">
      <react_1.HStack className="px-4 py-2 flex justify-between bg-card border-b border-border">
        <react_1.HStack>
          <ScheuleNavigation_1.ScheduleNavigation />
          <components_1.SearchFilter param="search" size="sm" placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Search"], ["Search"])))}/>
          <Filter_1.Filter filters={filters}/>
        </react_1.HStack>

        <react_1.HStack>
          <react_1.HStack>
            <react_1.Button variant="secondary" onClick={goToToday}>
              <macro_2.Trans>Today</macro_2.Trans>
            </react_1.Button>
            <react_1.IconButton variant="secondary" onClick={function () { return navigateDate("prev"); }} icon={<lu_1.LuChevronLeft />} aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Previous Date"], ["Previous Date"])))}/>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.Button variant="secondary" className="min-w-[140px]">
                  {currentDateSpanLabel}
                </react_1.Button>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent>
                <react_1.DropdownMenuRadioGroup value={parsedDate.toString()} onValueChange={navigateToDate}>
                  {dateSpanOptions.map(function (span) { return (<react_1.DropdownMenuRadioItem key={span.date} value={span.date}>
                      {span.label}
                    </react_1.DropdownMenuRadioItem>); })}
                </react_1.DropdownMenuRadioGroup>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
            <react_1.IconButton variant="secondary" onClick={function () { return navigateDate("next"); }} icon={<lu_1.LuChevronRight />} aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Next Date"], ["Next Date"])))}/>
          </react_1.HStack>

          <react_1.Popover>
            <react_1.PopoverTrigger asChild>
              <react_1.IconButton aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Settings"], ["Settings"])))} icon={<lu_1.LuSettings2 />} variant="secondary" className="border-dashed border-border"/>
            </react_1.PopoverTrigger>
            <react_1.PopoverContent className="w-64">
              <react_1.VStack spacing={3}>
                <span className="text-xs font-medium text-muted-foreground">
                  <macro_2.Trans>Location</macro_2.Trans>
                </span>
                <div className="w-full">
                  <react_1.Combobox asButton size="sm" value={locationId !== null && locationId !== void 0 ? locationId : undefined} options={locations} onChange={function (selected) {
            var newParams = new URLSearchParams(searchParams);
            newParams.set("location", selected);
            window.location.href = "".concat(path_1.path.to.scheduleDates, "?").concat(newParams.toString());
        }}/>
                </div>
                <react_1.Separator />
                <span className="text-xs font-medium text-muted-foreground">
                  <macro_2.Trans>Display Settings</macro_2.Trans>
                </span>
                <react_1.VStack>
                  {[
            { key: "showCustomer", label: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Customer"], ["Customer"]))) },
            { key: "showDueDate", label: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Due Date"], ["Due Date"]))) },
            { key: "showDuration", label: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Duration"], ["Duration"]))) },
            { key: "showProgress", label: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Progress"], ["Progress"]))) },
            { key: "showQuantity", label: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Quantity"], ["Quantity"]))) },
            { key: "showStatus", label: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Status"], ["Status"]))) },
            { key: "showSalesOrder", label: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Sales Order"], ["Sales Order"]))) },
            { key: "showThumbnail", label: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Thumbnail"], ["Thumbnail"]))) }
        ].map(function (_a) {
            var key = _a.key, label = _a.label;
            return (<react_1.Switch key={key} variant="small" label={label} checked={displaySettings[key]} onCheckedChange={function (checked) {
                    return setDisplaySettings(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[key] = checked, _a)));
                    });
                }}/>);
        })}
                </react_1.VStack>
              </react_1.VStack>
            </react_1.PopoverContent>
          </react_1.Popover>
        </react_1.HStack>
      </react_1.HStack>
      {currentFilters.length > 0 && (<react_1.HStack className="px-4 py-1.5 justify-between bg-card border-b border-border w-full">
          <react_1.HStack>
            <Filter_1.ActiveFilters filters={filters}/>
          </react_1.HStack>
        </react_1.HStack>)}
      <div className="flex flex-grow h-full items-stretch overflow-hidden relative">
        <div className="flex flex-1 min-h-0 w-full relative">
          <DateKanban_1.DateKanban columns={columns} items={items} progressByItemId={{}} tags={tags} showCustomer={displaySettings.showCustomer} showDescription={displaySettings.showDescription} showDueDate={displaySettings.showDueDate} showDuration={displaySettings.showDuration} showEmployee={displaySettings.showEmployee} showProgress={displaySettings.showProgress} showQuantity={displaySettings.showQuantity} showStatus={displaySettings.showStatus} showSalesOrder={displaySettings.showSalesOrder} showThumbnail={displaySettings.showThumbnail}/>
        </div>
      </div>
    </div>);
}
function ScheduleRoute() {
    return (<react_1.ClientOnly fallback={<div className="flex h-full w-full items-center justify-center">
          <react_1.Spinner className="h-8 w-8"/>
        </div>}>
      {function () { return <DateKanbanSchedule />; }}
    </react_1.ClientOnly>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
