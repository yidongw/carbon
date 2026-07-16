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
exports.resolveProductionQuantityPayScope = resolveProductionQuantityPayScope;
exports.resolveProductionQuantityPayStatus = resolveProductionQuantityPayStatus;
exports.getProductionQuantityReportFilterOptions = getProductionQuantityReportFilterOptions;
exports.getProductionQuantityPayLines = getProductionQuantityPayLines;
exports.getProductionQuantityListRows = getProductionQuantityListRows;
exports.getProductionQuantityReportPayRows = getProductionQuantityReportPayRows;
exports.ensureProductionQuantityApprovalRequest = ensureProductionQuantityApprovalRequest;
exports.computeProductionQuantityReportEarnedAmount = computeProductionQuantityReportEarnedAmount;
exports.getEmployeeSalaryCompletions = getEmployeeSalaryCompletions;
exports.getPendingSalaryCompletions = getPendingSalaryCompletions;
exports.rejectProductionQuantity = rejectProductionQuantity;
exports.approveProductionQuantity = approveProductionQuantity;
var shared_service_1 = require("~/modules/shared/shared.service");
var query_1 = require("~/utils/query");
var employeeSalaryCompletionSelect = "\n  id, quantity, createdAt, paymentYear, paymentMonth,\n  jobOperation!inner(id, description, insideUnitCost, jobId,\n    process:processId(name),\n    job:jobId(jobId)\n  )\n";
var employeePendingSalaryCompletionSelect = "\n  id, quantity, createdAt,\n  jobOperation!inner(id, description, insideUnitCost, jobId,\n    process:processId(name),\n    job:jobId(jobId)\n  )\n";
var productionPayApprovalSelect = "\n  id, quantity, createdAt, employeeId, createdBy, paymentYear, paymentMonth, invalidatedAt, reportId, configuration,\n  employee:user!productionQuantity_employeeId_fkey(id, firstName, lastName, fullName, avatarUrl),\n  jobOperation!inner(id, description, insideUnitCost, jobId,\n    process:processId(name),\n    job:jobId(id, jobId, item:itemId(id, readableIdWithRevision, name))\n  )\n";
var productionPayApprovalReportSelect = "\n  id, employeeId, createdBy, originalQuantity, jobOperationId,\n  employee:user!productionQuantityReport_employeeId_fkey(id, firstName, lastName, fullName, avatarUrl),\n  jobOperation!inner(id, description, insideUnitCost, jobId,\n    process:processId(name),\n    job:jobId(id, jobId, item:itemId(id, readableIdWithRevision, name))\n  )\n";
var productionQuantityReportListSelect = "\n  id, employeeId, createdBy, originalQuantity, jobOperationId, createdAt, notes,\n  employee:user!productionQuantityReport_employeeId_fkey(id, firstName, lastName, fullName, avatarUrl),\n  jobOperation!inner(id, description, insideUnitCost, jobId,\n    process:processId(name),\n    job:jobId(id, jobId, item:itemId(id, readableIdWithRevision, name))\n  )\n";
function deriveLinePayStatus(lines) {
    if (lines.length === 0)
        return "pending";
    var active = lines.filter(function (line) { return !line.invalidatedAt; });
    if (active.length === 0)
        return "rejected";
    if (active.some(function (line) { return line.paymentYear != null; }))
        return "approved";
    return "pending";
}
function getItemIdFromJobOperation(jobOperation) {
    var jo = Array.isArray(jobOperation) ? jobOperation[0] : jobOperation;
    if (!jo || typeof jo !== "object" || !("job" in jo))
        return null;
    var job = Array.isArray(jo.job) ? jo.job[0] : jo.job;
    if (!job || typeof job !== "object" || !("item" in job))
        return null;
    var item = Array.isArray(job.item) ? job.item[0] : job.item;
    if (!item || typeof item !== "object" || !("id" in item))
        return null;
    return typeof item.id === "string" ? item.id : null;
}
function getJobIdFromJobOperation(jobOperation) {
    var jo = Array.isArray(jobOperation) ? jobOperation[0] : jobOperation;
    if (!jo || typeof jo !== "object" || !("job" in jo))
        return null;
    var job = Array.isArray(jo.job) ? jo.job[0] : jo.job;
    if (!job || typeof job !== "object" || !("id" in job))
        return null;
    return typeof job.id === "string" ? job.id : null;
}
function scopeWantsStatus(scope, status) {
    if (scope.mode === "all")
        return true;
    if (scope.mode === "single")
        return scope.status === status;
    return scope.statuses.includes(status);
}
function getProductionQuantityReportIdsForScope(client, companyId, scope, enrichmentClient) {
    return __awaiter(this, void 0, void 0, function () {
        var db, ids, latestApprovalByReport, approvalStatuses, requests, _i, _a, req, _b, latestApprovalByReport_1, _c, reportId, status_1, bucket, _d, lineRows, lineRowsError, linesByReport, _e, _f, line, bucket, _g, linesByReport_1, _h, reportId, lines, bucket;
        var _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    if (scope.mode === "all")
                        return [2 /*return*/, null];
                    db = enrichmentClient !== null && enrichmentClient !== void 0 ? enrichmentClient : client;
                    ids = new Set();
                    latestApprovalByReport = new Map();
                    approvalStatuses = [];
                    if (scopeWantsStatus(scope, "pending"))
                        approvalStatuses.push("Pending");
                    if (scopeWantsStatus(scope, "approved"))
                        approvalStatuses.push("Approved");
                    if (scopeWantsStatus(scope, "rejected")) {
                        approvalStatuses.push("Rejected", "Cancelled");
                    }
                    if (!(approvalStatuses.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, db
                            .from("approvalRequest")
                            .select("documentId, status, requestedAt")
                            .eq("companyId", companyId)
                            .eq("documentType", "productionQuantityReport")
                            .in("status", approvalStatuses)
                            .order("requestedAt", { ascending: false })];
                case 1:
                    requests = (_k.sent()).data;
                    for (_i = 0, _a = requests !== null && requests !== void 0 ? requests : []; _i < _a.length; _i++) {
                        req = _a[_i];
                        if (!latestApprovalByReport.has(req.documentId)) {
                            latestApprovalByReport.set(req.documentId, req.status);
                        }
                    }
                    for (_b = 0, latestApprovalByReport_1 = latestApprovalByReport; _b < latestApprovalByReport_1.length; _b++) {
                        _c = latestApprovalByReport_1[_b], reportId = _c[0], status_1 = _c[1];
                        bucket = status_1 === "Pending"
                            ? "pending"
                            : status_1 === "Approved"
                                ? "approved"
                                : "rejected";
                        if (scopeWantsStatus(scope, bucket)) {
                            ids.add(reportId);
                        }
                    }
                    _k.label = 2;
                case 2: return [4 /*yield*/, db
                        .from("productionQuantity")
                        .select("reportId, paymentYear, invalidatedAt")
                        .eq("companyId", companyId)
                        .eq("type", "Production")
                        .is("invalidatedAt", null)
                        .not("reportId", "is", null)];
                case 3:
                    _d = _k.sent(), lineRows = _d.data, lineRowsError = _d.error;
                    if (!lineRowsError) {
                        linesByReport = new Map();
                        for (_e = 0, _f = lineRows !== null && lineRows !== void 0 ? lineRows : []; _e < _f.length; _e++) {
                            line = _f[_e];
                            if (!line.reportId)
                                continue;
                            bucket = (_j = linesByReport.get(line.reportId)) !== null && _j !== void 0 ? _j : [];
                            bucket.push({
                                paymentYear: line.paymentYear,
                                invalidatedAt: line.invalidatedAt
                            });
                            linesByReport.set(line.reportId, bucket);
                        }
                        for (_g = 0, linesByReport_1 = linesByReport; _g < linesByReport_1.length; _g++) {
                            _h = linesByReport_1[_g], reportId = _h[0], lines = _h[1];
                            if (latestApprovalByReport.has(reportId))
                                continue;
                            bucket = deriveLinePayStatus(lines);
                            if (scopeWantsStatus(scope, bucket)) {
                                ids.add(reportId);
                            }
                        }
                    }
                    return [2 /*return*/, ids];
            }
        });
    });
}
function getActiveProductionQuantityReportIds(client, companyId, enrichmentClient) {
    return __awaiter(this, void 0, void 0, function () {
        var db, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    db = enrichmentClient !== null && enrichmentClient !== void 0 ? enrichmentClient : client;
                    return [4 /*yield*/, db
                            .from("productionQuantity")
                            .select("reportId")
                            .eq("companyId", companyId)
                            .eq("type", "Production")
                            .is("invalidatedAt", null)
                            .not("reportId", "is", null)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        return [2 /*return*/, { data: null, error: error }];
                    }
                    return [2 /*return*/, {
                            data: new Set((data !== null && data !== void 0 ? data : [])
                                .map(function (row) { return row.reportId; })
                                .filter(function (id) { return Boolean(id); })),
                            error: null
                        }];
            }
        });
    });
}
function normalizeProductionQuantityPayStatus(value) {
    var normalized = value.trim().toLowerCase();
    if (normalized === "pending")
        return "pending";
    if (normalized === "approved")
        return "approved";
    if (normalized === "rejected")
        return "rejected";
    return null;
}
function resolveProductionQuantityPayScope(filters) {
    var _a;
    var statusFilters = (_a = filters === null || filters === void 0 ? void 0 : filters.filter(function (f) { return f.column === "approvalStatus"; })) !== null && _a !== void 0 ? _a : [];
    if (statusFilters.length === 0) {
        return { mode: "all" };
    }
    var statuses = new Set();
    for (var _i = 0, statusFilters_1 = statusFilters; _i < statusFilters_1.length; _i++) {
        var statusFilter = statusFilters_1[_i];
        if (!statusFilter.value)
            continue;
        var values = statusFilter.operator === "in" || statusFilter.operator === "contains"
            ? statusFilter.value
                .split(",")
                .map(function (v) { return v.trim(); })
                .filter(Boolean)
            : [statusFilter.value];
        for (var _b = 0, values_1 = values; _b < values_1.length; _b++) {
            var value = values_1[_b];
            var normalized = normalizeProductionQuantityPayStatus(value);
            if (normalized)
                statuses.add(normalized);
        }
    }
    var list = __spreadArray([], statuses, true);
    if (list.length === 0 || list.length >= 3) {
        return { mode: "all" };
    }
    if (list.length === 1) {
        return { mode: "single", status: list[0] };
    }
    return { mode: "multiple", statuses: list };
}
/** @deprecated Use resolveProductionQuantityPayScope */
function resolveProductionQuantityPayStatus(filters) {
    var scope = resolveProductionQuantityPayScope(filters);
    if (scope.mode === "single")
        return scope.status;
    return "all";
}
function applyProductionQuantityPayScope(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
query, scope) {
    if (scope.mode === "all") {
        return query;
    }
    if (scope.mode === "single") {
        switch (scope.status) {
            case "pending":
                return query.is("paymentYear", null).is("invalidatedAt", null);
            case "approved":
                return query.not("paymentYear", "is", null).is("invalidatedAt", null);
            case "rejected":
                return query.not("invalidatedAt", "is", null);
        }
    }
    var hasPending = scope.statuses.includes("pending");
    var hasApproved = scope.statuses.includes("approved");
    var hasRejected = scope.statuses.includes("rejected");
    // Avoid PostgREST `.or()` when a single predicate covers the pair (also keeps
    // the query compatible with a separate search `.or()` on related tables).
    if (hasPending && hasApproved && !hasRejected) {
        return query.is("invalidatedAt", null);
    }
    if (hasPending && hasRejected && !hasApproved) {
        return query.or("and(paymentYear.is.null,invalidatedAt.is.null),not.invalidatedAt.is.null");
    }
    if (hasApproved && hasRejected && !hasPending) {
        return query.or("and(paymentYear.not.is.null,invalidatedAt.is.null),not.invalidatedAt.is.null");
    }
    return query;
}
function getEmployeeIdsMatchingSearch(client, companyId, term) {
    return __awaiter(this, void 0, void 0, function () {
        var pattern;
        return __generator(this, function (_a) {
            pattern = "%".concat(term, "%");
            return [2 /*return*/, client
                    .from("employeeSummary")
                    .select("id")
                    .eq("companyId", companyId)
                    .or("fullName.ilike.".concat(pattern, ",firstName.ilike.").concat(pattern, ",lastName.ilike.").concat(pattern))];
        });
    });
}
function getEmployeeIdsFromFilters(filters) {
    return getFilterValuesFromFilters(filters, "employeeId");
}
function getFilterValuesFromFilters(filters, column) {
    if (!(filters === null || filters === void 0 ? void 0 : filters.length))
        return null;
    var ids = new Set();
    for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
        var filter = filters_1[_i];
        if (filter.column !== column || !filter.value)
            continue;
        if (filter.operator === "eq") {
            ids.add(filter.value);
        }
        else if (filter.operator === "in" || filter.operator === "contains") {
            for (var _a = 0, _b = filter.value.split(","); _a < _b.length; _a++) {
                var id = _b[_a];
                var trimmed = id.trim();
                if (trimmed)
                    ids.add(trimmed);
            }
        }
    }
    return ids.size > 0 ? __spreadArray([], ids, true) : null;
}
function getProductionQuantityReportFilterOptions(client, companyId, enrichmentClient) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, activeReportIds, activeReportIdsError, _b, data, error, jobsMap, itemsMap, operationsMap, _i, _c, row, job, item, itemRow, label, joRaw, jo, proc, sortByLabel;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, getActiveProductionQuantityReportIds(client, companyId, enrichmentClient)];
                case 1:
                    _a = _g.sent(), activeReportIds = _a.data, activeReportIdsError = _a.error;
                    if (activeReportIdsError) {
                        return [2 /*return*/, {
                                jobs: [],
                                items: [],
                                error: activeReportIdsError
                            }];
                    }
                    if (!activeReportIds || activeReportIds.size === 0) {
                        return [2 /*return*/, {
                                jobs: [],
                                items: [],
                                error: null
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("productionQuantityReport")
                            .select("jobId, job:jobId(id, jobId, item:itemId(id, readableIdWithRevision, name)), jobOperation!inner(id, process:processId(id, name))")
                            .eq("companyId", companyId)
                            .in("id", __spreadArray([], activeReportIds, true))];
                case 2:
                    _b = _g.sent(), data = _b.data, error = _b.error;
                    if (error) {
                        return [2 /*return*/, {
                                jobs: [],
                                items: [],
                                operations: [],
                                error: error
                            }];
                    }
                    jobsMap = new Map();
                    itemsMap = new Map();
                    operationsMap = new Map();
                    for (_i = 0, _c = data !== null && data !== void 0 ? data : []; _i < _c.length; _i++) {
                        row = _c[_i];
                        job = Array.isArray(row.job) ? row.job[0] : row.job;
                        if ((job === null || job === void 0 ? void 0 : job.id) && job.jobId) {
                            jobsMap.set(job.id, { id: job.id, label: job.jobId });
                        }
                        item = job === null || job === void 0 ? void 0 : job.item;
                        itemRow = Array.isArray(item) ? item[0] : item;
                        if (itemRow === null || itemRow === void 0 ? void 0 : itemRow.id) {
                            label = ((_d = itemRow.readableIdWithRevision) === null || _d === void 0 ? void 0 : _d.trim()) ||
                                ((_e = itemRow.name) === null || _e === void 0 ? void 0 : _e.trim()) ||
                                itemRow.id;
                            itemsMap.set(itemRow.id, { id: itemRow.id, label: label });
                        }
                        joRaw = row.jobOperation;
                        jo = (Array.isArray(joRaw) ? ((_f = joRaw[0]) !== null && _f !== void 0 ? _f : null) : joRaw);
                        if (jo) {
                            proc = Array.isArray(jo.process) ? jo.process[0] : jo.process;
                            if ((proc === null || proc === void 0 ? void 0 : proc.id) && proc.name) {
                                operationsMap.set(proc.id, { id: proc.id, label: proc.name });
                            }
                        }
                    }
                    sortByLabel = function (a, b) { return a.label.localeCompare(b.label); };
                    return [2 /*return*/, {
                            jobs: __spreadArray([], jobsMap.values(), true).sort(sortByLabel),
                            items: __spreadArray([], itemsMap.values(), true).sort(sortByLabel),
                            operations: __spreadArray([], operationsMap.values(), true).sort(sortByLabel),
                            error: null
                        }];
            }
        });
    });
}
function getProductionQuantityReportIdsForEmployees(client, companyId, employeeIds) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (employeeIds.length === 0) {
                        return [2 /*return*/, { data: [], error: null }];
                    }
                    return [4 /*yield*/, client
                            .from("productionQuantityReport")
                            .select("id")
                            .eq("companyId", companyId)
                            .in("employeeId", employeeIds)];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        return [2 /*return*/, { data: null, error: error }];
                    }
                    return [2 /*return*/, { data: (_b = data === null || data === void 0 ? void 0 : data.map(function (row) { return row.id; })) !== null && _b !== void 0 ? _b : [], error: null }];
            }
        });
    });
}
function getProductionQuantityPayLines(client, companyId, scope, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query, term, _a, employees, searchError, employeeIds, dbFilters;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    query = client
                        .from("productionQuantity")
                        .select(productionPayApprovalSelect, { count: "exact" })
                        .eq("companyId", companyId)
                        .eq("type", "Production");
                    query = applyProductionQuantityPayScope(query, scope);
                    if (!(args === null || args === void 0 ? void 0 : args.search)) return [3 /*break*/, 2];
                    term = args.search.trim();
                    if (!term) return [3 /*break*/, 2];
                    return [4 /*yield*/, getEmployeeIdsMatchingSearch(client, companyId, term)];
                case 1:
                    _a = _d.sent(), employees = _a.data, searchError = _a.error;
                    if (searchError) {
                        return [2 /*return*/, {
                                data: null,
                                error: searchError,
                                count: null,
                                status: 0,
                                statusText: ""
                            }];
                    }
                    employeeIds = (_b = employees === null || employees === void 0 ? void 0 : employees.map(function (row) { return row.id; }).filter(function (id) { return id != null; })) !== null && _b !== void 0 ? _b : [];
                    if (employeeIds.length === 0) {
                        return [2 /*return*/, {
                                data: [],
                                error: null,
                                count: 0,
                                status: 200,
                                statusText: "OK"
                            }];
                    }
                    query = query.in("employeeId", employeeIds);
                    _d.label = 2;
                case 2:
                    if (args) {
                        dbFilters = (_c = args.filters) === null || _c === void 0 ? void 0 : _c.filter(function (f) { return f.column !== "approvalStatus"; });
                        query = (0, query_1.setGenericQueryFilters)(query, __assign(__assign({}, args), { filters: dbFilters }), [
                            { column: "createdAt", ascending: false }
                        ]);
                    }
                    else {
                        query = query.order("createdAt", { ascending: false });
                    }
                    return [2 /*return*/, query];
            }
        });
    });
}
function mapScopeToApprovalRequestStatuses(scope) {
    if (scope.mode === "all") {
        return ["Pending", "Approved", "Rejected"];
    }
    if (scope.mode === "single") {
        switch (scope.status) {
            case "pending":
                return ["Pending"];
            case "approved":
                return ["Approved"];
            case "rejected":
                return ["Rejected"];
        }
    }
    var statuses = [];
    if (scope.statuses.includes("pending"))
        statuses.push("Pending");
    if (scope.statuses.includes("approved"))
        statuses.push("Approved");
    if (scope.statuses.includes("rejected"))
        statuses.push("Rejected");
    return statuses.length > 0 ? statuses : null;
}
function getProductionQuantityListRows(client, companyId, scope, args, enrichmentClient) {
    return __awaiter(this, void 0, void 0, function () {
        var statuses, query, filteredDocumentIds, filterEmployeeIds, reportsForEmployees, term, _a, employees, searchError, employeeIds, reportsForSearch, searchReportIds_1, dbFilters, requests, list, reportIds, linesClient, _b, lines, linesError, linesByReport, _i, _c, line, bucket, missingReportIds, reportFallbackById, _d, reports, reportsError, _e, _f, report, rows, _g, list_1, req, reportLines, fallback, primary, totalQty, paymentYear, paymentMonth;
        var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
        return __generator(this, function (_5) {
            switch (_5.label) {
                case 0:
                    statuses = mapScopeToApprovalRequestStatuses(scope);
                    query = client
                        .from("approvalRequest")
                        .select("*", { count: "exact" })
                        .eq("companyId", companyId)
                        .eq("documentType", "productionQuantityReport");
                    if (statuses) {
                        query = query.in("status", statuses);
                    }
                    filteredDocumentIds = null;
                    filterEmployeeIds = getEmployeeIdsFromFilters(args === null || args === void 0 ? void 0 : args.filters);
                    if (!filterEmployeeIds) return [3 /*break*/, 2];
                    return [4 /*yield*/, getProductionQuantityReportIdsForEmployees(client, companyId, filterEmployeeIds)];
                case 1:
                    reportsForEmployees = _5.sent();
                    if (reportsForEmployees.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: reportsForEmployees.error,
                                count: null,
                                status: 0,
                                statusText: ""
                            }];
                    }
                    filteredDocumentIds = reportsForEmployees.data;
                    if (filteredDocumentIds.length === 0) {
                        return [2 /*return*/, { data: [], error: null, count: 0, status: 200, statusText: "OK" }];
                    }
                    _5.label = 2;
                case 2:
                    if (!(args === null || args === void 0 ? void 0 : args.search)) return [3 /*break*/, 5];
                    term = args.search.trim();
                    if (!term) return [3 /*break*/, 5];
                    return [4 /*yield*/, getEmployeeIdsMatchingSearch(client, companyId, term)];
                case 3:
                    _a = _5.sent(), employees = _a.data, searchError = _a.error;
                    if (searchError) {
                        return [2 /*return*/, {
                                data: null,
                                error: searchError,
                                count: null,
                                status: 0,
                                statusText: ""
                            }];
                    }
                    employeeIds = (_h = employees === null || employees === void 0 ? void 0 : employees.map(function (row) { return row.id; }).filter(function (id) { return id != null; })) !== null && _h !== void 0 ? _h : [];
                    if (employeeIds.length === 0) {
                        return [2 /*return*/, {
                                data: [],
                                error: null,
                                count: 0,
                                status: 200,
                                statusText: "OK"
                            }];
                    }
                    return [4 /*yield*/, getProductionQuantityReportIdsForEmployees(client, companyId, employeeIds)];
                case 4:
                    reportsForSearch = _5.sent();
                    if (reportsForSearch.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: reportsForSearch.error,
                                count: null,
                                status: 0,
                                statusText: ""
                            }];
                    }
                    searchReportIds_1 = reportsForSearch.data;
                    if (searchReportIds_1.length === 0) {
                        return [2 /*return*/, {
                                data: [],
                                error: null,
                                count: 0,
                                status: 200,
                                statusText: "OK"
                            }];
                    }
                    filteredDocumentIds =
                        filteredDocumentIds === null
                            ? searchReportIds_1
                            : filteredDocumentIds.filter(function (id) { return searchReportIds_1.includes(id); });
                    if (filteredDocumentIds.length === 0) {
                        return [2 /*return*/, {
                                data: [],
                                error: null,
                                count: 0,
                                status: 200,
                                statusText: "OK"
                            }];
                    }
                    _5.label = 5;
                case 5:
                    if (filteredDocumentIds) {
                        query = query.in("documentId", filteredDocumentIds);
                    }
                    dbFilters = (_j = args === null || args === void 0 ? void 0 : args.filters) === null || _j === void 0 ? void 0 : _j.filter(function (f) { return f.column !== "approvalStatus" && f.column !== "employeeId"; });
                    if (args) {
                        query = (0, query_1.setGenericQueryFilters)(query, __assign(__assign({}, args), { filters: dbFilters }), [
                            { column: "requestedAt", ascending: false }
                        ]);
                    }
                    else {
                        query = query.order("requestedAt", { ascending: false });
                    }
                    return [4 /*yield*/, query];
                case 6:
                    requests = _5.sent();
                    if (requests.error) {
                        return [2 /*return*/, requests];
                    }
                    list = (_k = requests.data) !== null && _k !== void 0 ? _k : [];
                    if (list.length === 0) {
                        return [2 /*return*/, {
                                data: [],
                                error: null,
                                count: (_l = requests.count) !== null && _l !== void 0 ? _l : 0,
                                status: requests.status,
                                statusText: requests.statusText
                            }];
                    }
                    reportIds = list.map(function (r) { return r.documentId; });
                    linesClient = enrichmentClient !== null && enrichmentClient !== void 0 ? enrichmentClient : client;
                    return [4 /*yield*/, linesClient
                            .from("productionQuantity")
                            .select(productionPayApprovalSelect)
                            .in("reportId", reportIds)
                            .eq("companyId", companyId)
                            .eq("type", "Production")
                            .is("invalidatedAt", null)];
                case 7:
                    _b = _5.sent(), lines = _b.data, linesError = _b.error;
                    if (linesError) {
                        return [2 /*return*/, {
                                data: null,
                                error: linesError,
                                count: null,
                                status: 0,
                                statusText: ""
                            }];
                    }
                    linesByReport = new Map();
                    for (_i = 0, _c = lines !== null && lines !== void 0 ? lines : []; _i < _c.length; _i++) {
                        line = _c[_i];
                        if (!line.reportId)
                            continue;
                        bucket = (_m = linesByReport.get(line.reportId)) !== null && _m !== void 0 ? _m : [];
                        bucket.push(line);
                        linesByReport.set(line.reportId, bucket);
                    }
                    missingReportIds = reportIds.filter(function (id) { return !linesByReport.has(id); });
                    reportFallbackById = new Map();
                    if (!(missingReportIds.length > 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, linesClient
                            .from("productionQuantityReport")
                            .select(productionPayApprovalReportSelect)
                            .in("id", missingReportIds)
                            .eq("companyId", companyId)];
                case 8:
                    _d = _5.sent(), reports = _d.data, reportsError = _d.error;
                    if (reportsError) {
                        return [2 /*return*/, {
                                data: null,
                                error: reportsError,
                                count: null,
                                status: 0,
                                statusText: ""
                            }];
                    }
                    for (_e = 0, _f = reports !== null && reports !== void 0 ? reports : []; _e < _f.length; _e++) {
                        report = _f[_e];
                        reportFallbackById.set(report.id, {
                            employeeId: report.employeeId,
                            createdBy: report.createdBy,
                            quantity: (_o = report.originalQuantity) !== null && _o !== void 0 ? _o : 0,
                            employee: report.employee,
                            jobOperation: report.jobOperation
                        });
                    }
                    _5.label = 9;
                case 9:
                    rows = [];
                    for (_g = 0, list_1 = list; _g < list_1.length; _g++) {
                        req = list_1[_g];
                        reportLines = (_p = linesByReport.get(req.documentId)) !== null && _p !== void 0 ? _p : [];
                        fallback = reportFallbackById.get(req.documentId);
                        primary = reportLines[0];
                        totalQty = reportLines.length > 0
                            ? reportLines.reduce(function (sum, l) { var _a; return sum + ((_a = l.quantity) !== null && _a !== void 0 ? _a : 0); }, 0)
                            : ((_q = fallback === null || fallback === void 0 ? void 0 : fallback.quantity) !== null && _q !== void 0 ? _q : 0);
                        paymentYear = (_r = primary === null || primary === void 0 ? void 0 : primary.paymentYear) !== null && _r !== void 0 ? _r : null;
                        paymentMonth = (_s = primary === null || primary === void 0 ? void 0 : primary.paymentMonth) !== null && _s !== void 0 ? _s : null;
                        rows.push({
                            approvalRequestId: req.id,
                            reportId: req.documentId,
                            approvalStatus: req.status,
                            amount: (_t = req.amount) !== null && _t !== void 0 ? _t : null,
                            requestedBy: (_u = req.requestedBy) !== null && _u !== void 0 ? _u : null,
                            id: req.id,
                            quantity: totalQty,
                            createdAt: (_w = (_v = req.requestedAt) !== null && _v !== void 0 ? _v : primary === null || primary === void 0 ? void 0 : primary.createdAt) !== null && _w !== void 0 ? _w : null,
                            employeeId: (_y = (_x = primary === null || primary === void 0 ? void 0 : primary.employeeId) !== null && _x !== void 0 ? _x : fallback === null || fallback === void 0 ? void 0 : fallback.employeeId) !== null && _y !== void 0 ? _y : null,
                            createdBy: (_0 = (_z = primary === null || primary === void 0 ? void 0 : primary.createdBy) !== null && _z !== void 0 ? _z : fallback === null || fallback === void 0 ? void 0 : fallback.createdBy) !== null && _0 !== void 0 ? _0 : null,
                            paymentYear: paymentYear,
                            paymentMonth: paymentMonth,
                            invalidatedAt: (_1 = primary === null || primary === void 0 ? void 0 : primary.invalidatedAt) !== null && _1 !== void 0 ? _1 : null,
                            employee: (_3 = (_2 = primary === null || primary === void 0 ? void 0 : primary.employee) !== null && _2 !== void 0 ? _2 : fallback === null || fallback === void 0 ? void 0 : fallback.employee) !== null && _3 !== void 0 ? _3 : null,
                            jobOperation: (_4 = primary === null || primary === void 0 ? void 0 : primary.jobOperation) !== null && _4 !== void 0 ? _4 : fallback === null || fallback === void 0 ? void 0 : fallback.jobOperation
                        });
                    }
                    return [2 /*return*/, {
                            data: rows,
                            error: null,
                            count: requests.count,
                            status: requests.status,
                            statusText: requests.statusText
                        }];
            }
        });
    });
}
/** Lists all production quantity reports with approval + line enrichment. */
function getProductionQuantityReportPayRows(client, companyId, scope, args, enrichmentClient) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, activeReportIds, activeReportIdsError, scopeReportIds, reportIdFilter, query, filterEmployeeIds, filterJobIds, filterItemIds, resolvedJobIds, _b, jobsForItems, jobsForItemsError, itemJobIds_1, filterProcessIds, createdAtBetween, _c, from, to, term, pattern, _d, employees, searchError, employeeIds, conditions, dbFilters, reports, reportList, reportIds, linesClient, _e, _f, approvals, approvalsError, _g, lines, linesError, latestApprovalByReport, _i, _h, approval, linesByReport, _j, _k, line, bucket, rows, _l, reportList_1, report, approval, reportLines, primary, totalQty, paymentYear, paymentMonth, lineStatus, approvalStatus, jobOperation;
        var _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
        return __generator(this, function (_11) {
            switch (_11.label) {
                case 0: return [4 /*yield*/, getActiveProductionQuantityReportIds(client, companyId, enrichmentClient)];
                case 1:
                    _a = _11.sent(), activeReportIds = _a.data, activeReportIdsError = _a.error;
                    if (activeReportIdsError) {
                        return [2 /*return*/, {
                                data: null,
                                error: activeReportIdsError,
                                count: null,
                                status: 0,
                                statusText: ""
                            }];
                    }
                    if (!activeReportIds || activeReportIds.size === 0) {
                        return [2 /*return*/, {
                                data: [],
                                error: null,
                                count: 0,
                                status: 200,
                                statusText: "OK"
                            }];
                    }
                    return [4 /*yield*/, getProductionQuantityReportIdsForScope(client, companyId, scope, enrichmentClient)];
                case 2:
                    scopeReportIds = _11.sent();
                    reportIdFilter = scopeReportIds
                        ? __spreadArray([], scopeReportIds, true).filter(function (id) { return activeReportIds.has(id); })
                        : __spreadArray([], activeReportIds, true);
                    if (reportIdFilter.length === 0) {
                        return [2 /*return*/, {
                                data: [],
                                error: null,
                                count: 0,
                                status: 200,
                                statusText: "OK"
                            }];
                    }
                    query = client
                        .from("productionQuantityReport")
                        .select(productionQuantityReportListSelect, { count: "exact" })
                        .eq("companyId", companyId)
                        .in("id", reportIdFilter);
                    filterEmployeeIds = getEmployeeIdsFromFilters(args === null || args === void 0 ? void 0 : args.filters);
                    if (filterEmployeeIds) {
                        query = query.in("employeeId", filterEmployeeIds);
                    }
                    filterJobIds = getFilterValuesFromFilters(args === null || args === void 0 ? void 0 : args.filters, "jobId");
                    filterItemIds = getFilterValuesFromFilters(args === null || args === void 0 ? void 0 : args.filters, "itemId");
                    resolvedJobIds = filterJobIds;
                    if (!filterItemIds) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("job")
                            .select("id")
                            .eq("companyId", companyId)
                            .in("itemId", filterItemIds)];
                case 3:
                    _b = _11.sent(), jobsForItems = _b.data, jobsForItemsError = _b.error;
                    if (jobsForItemsError) {
                        return [2 /*return*/, {
                                data: null,
                                error: jobsForItemsError,
                                count: null,
                                status: 0,
                                statusText: ""
                            }];
                    }
                    itemJobIds_1 = (_m = jobsForItems === null || jobsForItems === void 0 ? void 0 : jobsForItems.map(function (job) { return job.id; })) !== null && _m !== void 0 ? _m : [];
                    if (itemJobIds_1.length === 0) {
                        return [2 /*return*/, {
                                data: [],
                                error: null,
                                count: 0,
                                status: 200,
                                statusText: "OK"
                            }];
                    }
                    resolvedJobIds = resolvedJobIds
                        ? resolvedJobIds.filter(function (id) { return itemJobIds_1.includes(id); })
                        : itemJobIds_1;
                    if (resolvedJobIds.length === 0) {
                        return [2 /*return*/, {
                                data: [],
                                error: null,
                                count: 0,
                                status: 200,
                                statusText: "OK"
                            }];
                    }
                    _11.label = 4;
                case 4:
                    if (resolvedJobIds) {
                        query = query.in("jobId", resolvedJobIds);
                    }
                    filterProcessIds = getFilterValuesFromFilters(args === null || args === void 0 ? void 0 : args.filters, "processId");
                    if (filterProcessIds) {
                        if (filterProcessIds.length === 1) {
                            query = query.eq("jobOperation.processId", filterProcessIds[0]);
                        }
                        else {
                            query = query.in("jobOperation.processId", filterProcessIds);
                        }
                    }
                    createdAtBetween = (_o = args === null || args === void 0 ? void 0 : args.filters) === null || _o === void 0 ? void 0 : _o.find(function (f) { return f.column === "createdAt" && f.operator === "between"; });
                    if (createdAtBetween === null || createdAtBetween === void 0 ? void 0 : createdAtBetween.value) {
                        _c = createdAtBetween.value.split("|"), from = _c[0], to = _c[1];
                        if (from)
                            query = query.gte("createdAt", "".concat(from, "T00:00:00.000Z"));
                        if (to)
                            query = query.lte("createdAt", "".concat(to, "T23:59:59.999Z"));
                    }
                    if (!(args === null || args === void 0 ? void 0 : args.search)) return [3 /*break*/, 6];
                    term = args.search.trim();
                    if (!term) return [3 /*break*/, 6];
                    pattern = "%".concat(term, "%");
                    return [4 /*yield*/, getEmployeeIdsMatchingSearch(client, companyId, term)];
                case 5:
                    _d = _11.sent(), employees = _d.data, searchError = _d.error;
                    if (searchError) {
                        return [2 /*return*/, {
                                data: null,
                                error: searchError,
                                count: null,
                                status: 0,
                                statusText: ""
                            }];
                    }
                    employeeIds = (_p = employees === null || employees === void 0 ? void 0 : employees.map(function (row) { return row.id; }).filter(function (id) { return id != null; })) !== null && _p !== void 0 ? _p : [];
                    conditions = [
                        "notes.ilike.".concat(pattern),
                        "jobOperation.description.ilike.".concat(pattern)
                    ];
                    if (employeeIds.length > 0) {
                        conditions.push("employeeId.in.(".concat(employeeIds.join(","), ")"));
                    }
                    query = query.or(conditions.join(","));
                    _11.label = 6;
                case 6:
                    dbFilters = (_q = args === null || args === void 0 ? void 0 : args.filters) === null || _q === void 0 ? void 0 : _q.filter(function (f) {
                        return f.column !== "approvalStatus" &&
                            f.column !== "employeeId" &&
                            f.column !== "jobId" &&
                            f.column !== "itemId" &&
                            f.column !== "processId" &&
                            !(f.column === "createdAt" && f.operator === "between");
                    });
                    if (args) {
                        query = (0, query_1.setGenericQueryFilters)(query, __assign(__assign({}, args), { filters: dbFilters }), [
                            { column: "createdAt", ascending: false }
                        ]);
                    }
                    else {
                        query = query.order("createdAt", { ascending: false });
                    }
                    return [4 /*yield*/, query];
                case 7:
                    reports = _11.sent();
                    if (reports.error) {
                        return [2 /*return*/, reports];
                    }
                    reportList = (_r = reports.data) !== null && _r !== void 0 ? _r : [];
                    if (reportList.length === 0) {
                        return [2 /*return*/, {
                                data: [],
                                error: null,
                                count: (_s = reports.count) !== null && _s !== void 0 ? _s : 0,
                                status: reports.status,
                                statusText: reports.statusText
                            }];
                    }
                    reportIds = reportList.map(function (report) { return report.id; });
                    linesClient = enrichmentClient !== null && enrichmentClient !== void 0 ? enrichmentClient : client;
                    return [4 /*yield*/, Promise.all([
                            linesClient
                                .from("approvalRequest")
                                .select("id, documentId, status, amount, requestedBy, requestedAt")
                                .eq("companyId", companyId)
                                .eq("documentType", "productionQuantityReport")
                                .in("documentId", reportIds)
                                .order("requestedAt", { ascending: false }),
                            linesClient
                                .from("productionQuantity")
                                .select(productionPayApprovalSelect)
                                .in("reportId", reportIds)
                                .eq("companyId", companyId)
                                .eq("type", "Production")
                                .is("invalidatedAt", null)
                        ])];
                case 8:
                    _e = _11.sent(), _f = _e[0], approvals = _f.data, approvalsError = _f.error, _g = _e[1], lines = _g.data, linesError = _g.error;
                    if (approvalsError) {
                        return [2 /*return*/, {
                                data: null,
                                error: approvalsError,
                                count: null,
                                status: 0,
                                statusText: ""
                            }];
                    }
                    if (linesError) {
                        return [2 /*return*/, {
                                data: null,
                                error: linesError,
                                count: null,
                                status: 0,
                                statusText: ""
                            }];
                    }
                    latestApprovalByReport = new Map();
                    for (_i = 0, _h = approvals !== null && approvals !== void 0 ? approvals : []; _i < _h.length; _i++) {
                        approval = _h[_i];
                        if (!latestApprovalByReport.has(approval.documentId)) {
                            latestApprovalByReport.set(approval.documentId, approval);
                        }
                    }
                    linesByReport = new Map();
                    for (_j = 0, _k = lines !== null && lines !== void 0 ? lines : []; _j < _k.length; _j++) {
                        line = _k[_j];
                        if (!line.reportId)
                            continue;
                        bucket = (_t = linesByReport.get(line.reportId)) !== null && _t !== void 0 ? _t : [];
                        bucket.push(line);
                        linesByReport.set(line.reportId, bucket);
                    }
                    rows = [];
                    for (_l = 0, reportList_1 = reportList; _l < reportList_1.length; _l++) {
                        report = reportList_1[_l];
                        approval = latestApprovalByReport.get(report.id);
                        reportLines = (_u = linesByReport.get(report.id)) !== null && _u !== void 0 ? _u : [];
                        primary = reportLines[0];
                        totalQty = reportLines.length > 0
                            ? reportLines.reduce(function (sum, line) { var _a; return sum + ((_a = line.quantity) !== null && _a !== void 0 ? _a : 0); }, 0)
                            : ((_v = report.originalQuantity) !== null && _v !== void 0 ? _v : 0);
                        paymentYear = (_w = primary === null || primary === void 0 ? void 0 : primary.paymentYear) !== null && _w !== void 0 ? _w : null;
                        paymentMonth = (_x = primary === null || primary === void 0 ? void 0 : primary.paymentMonth) !== null && _x !== void 0 ? _x : null;
                        lineStatus = deriveLinePayStatus(reportLines.map(function (line) { return ({
                            paymentYear: line.paymentYear,
                            invalidatedAt: line.invalidatedAt
                        }); }));
                        approvalStatus = (_y = approval === null || approval === void 0 ? void 0 : approval.status) !== null && _y !== void 0 ? _y : (lineStatus === "pending"
                            ? "Pending"
                            : lineStatus === "approved"
                                ? "Approved"
                                : "Rejected");
                        jobOperation = (_z = primary === null || primary === void 0 ? void 0 : primary.jobOperation) !== null && _z !== void 0 ? _z : report.jobOperation;
                        rows.push({
                            approvalRequestId: approval === null || approval === void 0 ? void 0 : approval.id,
                            reportId: report.id,
                            approvalStatus: approvalStatus,
                            amount: (_0 = approval === null || approval === void 0 ? void 0 : approval.amount) !== null && _0 !== void 0 ? _0 : null,
                            requestedBy: (_1 = approval === null || approval === void 0 ? void 0 : approval.requestedBy) !== null && _1 !== void 0 ? _1 : null,
                            id: (_2 = approval === null || approval === void 0 ? void 0 : approval.id) !== null && _2 !== void 0 ? _2 : report.id,
                            quantity: totalQty,
                            createdAt: report.createdAt,
                            employeeId: (_4 = (_3 = primary === null || primary === void 0 ? void 0 : primary.employeeId) !== null && _3 !== void 0 ? _3 : report.employeeId) !== null && _4 !== void 0 ? _4 : null,
                            createdBy: (_6 = (_5 = primary === null || primary === void 0 ? void 0 : primary.createdBy) !== null && _5 !== void 0 ? _5 : report.createdBy) !== null && _6 !== void 0 ? _6 : null,
                            jobId: getJobIdFromJobOperation(jobOperation),
                            itemId: getItemIdFromJobOperation(jobOperation),
                            paymentYear: paymentYear,
                            paymentMonth: paymentMonth,
                            invalidatedAt: (_7 = primary === null || primary === void 0 ? void 0 : primary.invalidatedAt) !== null && _7 !== void 0 ? _7 : null,
                            configuration: (_8 = primary === null || primary === void 0 ? void 0 : primary.configuration) !== null && _8 !== void 0 ? _8 : null,
                            employee: (_10 = (_9 = primary === null || primary === void 0 ? void 0 : primary.employee) !== null && _9 !== void 0 ? _9 : report.employee) !== null && _10 !== void 0 ? _10 : null,
                            jobOperation: jobOperation
                        });
                    }
                    return [2 /*return*/, {
                            data: rows,
                            error: null,
                            count: reports.count,
                            status: reports.status,
                            statusText: reports.statusText
                        }];
            }
        });
    });
}
function ensureProductionQuantityApprovalRequest(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var reportId, companyId, requestedBy, _a, pending, pendingError, amount;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reportId = args.reportId, companyId = args.companyId, requestedBy = args.requestedBy;
                    return [4 /*yield*/, client
                            .from("approvalRequest")
                            .select("id")
                            .eq("companyId", companyId)
                            .eq("documentType", "productionQuantityReport")
                            .eq("documentId", reportId)
                            .eq("status", "Pending")
                            .order("requestedAt", { ascending: false })
                            .limit(1)
                            .maybeSingle()];
                case 1:
                    _a = _b.sent(), pending = _a.data, pendingError = _a.error;
                    if (pendingError) {
                        return [2 /*return*/, { data: null, error: pendingError }];
                    }
                    if (pending === null || pending === void 0 ? void 0 : pending.id) {
                        return [2 /*return*/, { data: { id: pending.id }, error: null }];
                    }
                    return [4 /*yield*/, computeProductionQuantityReportEarnedAmount(client, reportId, companyId)];
                case 2:
                    amount = _b.sent();
                    return [2 /*return*/, (0, shared_service_1.requestProductionPayApproval)(client, {
                            reportId: reportId,
                            companyId: companyId,
                            requestedBy: requestedBy,
                            amount: amount
                        })];
            }
        });
    });
}
function computeProductionQuantityReportEarnedAmount(client, reportId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, lines, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("productionQuantity")
                        .select("quantity, jobOperation!inner(insideUnitCost)")
                        .eq("reportId", reportId)
                        .eq("companyId", companyId)
                        .is("invalidatedAt", null)];
                case 1:
                    _a = _b.sent(), lines = _a.data, error = _a.error;
                    if (error || !lines)
                        return [2 /*return*/, 0];
                    return [2 /*return*/, lines.reduce(function (sum, line) {
                            var _a, _b;
                            var jo = line.jobOperation;
                            var unitCost = (_a = jo === null || jo === void 0 ? void 0 : jo.insideUnitCost) !== null && _a !== void 0 ? _a : 0;
                            return sum + ((_b = line.quantity) !== null && _b !== void 0 ? _b : 0) * unitCost;
                        }, 0)];
            }
        });
    });
}
/** Production quantities assigned to an employee's pay period (salary detail). */
function getEmployeeSalaryCompletions(client, employeeId, companyId, year, month) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionQuantity")
                    .select(employeeSalaryCompletionSelect)
                    .eq("employeeId", employeeId)
                    .eq("companyId", companyId)
                    .eq("type", "Production")
                    .eq("paymentYear", year)
                    .eq("paymentMonth", month)
                    .is("invalidatedAt", null)
                    .order("createdAt", { ascending: false })];
        });
    });
}
/** Pending production quantities for an employee (salary detail approval). */
function getPendingSalaryCompletions(client, employeeId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionQuantity")
                    .select(employeePendingSalaryCompletionSelect)
                    .eq("employeeId", employeeId)
                    .eq("companyId", companyId)
                    .eq("type", "Production")
                    .is("paymentYear", null)
                    .is("invalidatedAt", null)
                    .order("createdAt", { ascending: false })];
        });
    });
}
function rejectProductionQuantity(client, productionQuantityId, updatedBy) {
    return __awaiter(this, void 0, void 0, function () {
        var now;
        return __generator(this, function (_a) {
            now = new Date().toISOString();
            return [2 /*return*/, client
                    .from("productionQuantity")
                    .update({
                    invalidatedAt: now,
                    invalidatedBy: updatedBy,
                    updatedBy: updatedBy,
                    updatedAt: now
                })
                    .eq("id", productionQuantityId)
                    .is("paymentYear", null)
                    .is("invalidatedAt", null)
                    .select("id")
                    .single()];
        });
    });
}
function approveProductionQuantity(client, productionQuantityId, year, month, updatedBy) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionQuantity")
                    .update({
                    paymentYear: year,
                    paymentMonth: month,
                    updatedBy: updatedBy,
                    updatedAt: new Date().toISOString()
                })
                    .eq("id", productionQuantityId)
                    .select("id")
                    .single()];
        });
    });
}
