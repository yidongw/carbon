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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.validateProductionQuantityLines = validateProductionQuantityLines;
exports.validateProductionQuantityRemaining = validateProductionQuantityRemaining;
exports.createProductionQuantityReport = createProductionQuantityReport;
exports.replaceProductionQuantityReportLines = replaceProductionQuantityReportLines;
exports.listProductionQuantityReportsForOperation = listProductionQuantityReportsForOperation;
exports.listProductionQuantityReportLines = listProductionQuantityReportLines;
exports.getProductionQuantityReportWithLines = getProductionQuantityReportWithLines;
exports.resolveProductionQuantityCanAutoApprove = resolveProductionQuantityCanAutoApprove;
exports.getOperationQuantitySummary = getOperationQuantitySummary;
exports.deleteProductionQuantityReport = deleteProductionQuantityReport;
exports.invalidateProductionQuantity = invalidateProductionQuantity;
exports.syncProductionQuantityReportApproval = syncProductionQuantityReportApproval;
var shared_1 = require("~/modules/shared");
var bundleWorkOrder_service_1 = require("./bundleWorkOrder.service");
var jobConfiguration_1 = require("./jobConfiguration");
var masterWorkOrder_service_1 = require("./masterWorkOrder.service");
var productionQuantityList_service_1 = require("./productionQuantityList.service");
/**
 * Split a line's `configuration` into the config to store (merged, unchanged
 * downstream) and any raw cut rows the editor tucked under `splitRows` (kept
 * only for a master WO cutting report → masterWorkOrderSplitRow).
 */
function splitConfigAndRows(configuration) {
    if (!configuration ||
        typeof configuration !== "object" ||
        Array.isArray(configuration)) {
        return { config: configuration !== null && configuration !== void 0 ? configuration : null, rows: [] };
    }
    var _a = configuration, splitRows = _a.splitRows, config = __rest(_a, ["splitRows"]);
    var rows = Array.isArray(splitRows)
        ? splitRows.map(function (r) {
            var _a, _b;
            var row = (r !== null && r !== void 0 ? r : {});
            return {
                colorCode: ((_a = row.colorCode) !== null && _a !== void 0 ? _a : null),
                sizeCode: ((_b = row.sizeCode) !== null && _b !== void 0 ? _b : null),
                quantity: Number(row.quantity) || 0
            };
        })
        : [];
    return { config: config, rows: rows };
}
/**
 * When a report is the master WO's cutting operation, persist the Production
 * line's raw cut rows so Split Batch can prefill one bundle per row.
 */
function storeMasterCuttingSplitRows(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var master, cuttingOpId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("masterWorkOrder")
                        .select("id")
                        .eq("jobId", args.jobId)
                        .eq("companyId", args.companyId)
                        .maybeSingle()];
                case 1:
                    master = _b.sent();
                    if (!((_a = master.data) === null || _a === void 0 ? void 0 : _a.id))
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, masterWorkOrder_service_1.getMasterCuttingOperationId)(client, args.jobId, args.companyId)];
                case 2:
                    cuttingOpId = _b.sent();
                    if (!cuttingOpId || cuttingOpId !== args.jobOperationId)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, bundleWorkOrder_service_1.replaceMasterCuttingSplitRows)(client, {
                            masterWorkOrderId: master.data.id,
                            productionQuantityReportId: args.productionQuantityReportId,
                            companyId: args.companyId,
                            createdBy: args.userId,
                            rows: args.rows
                        })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function sumLineQuantity(lines) {
    return lines.reduce(function (sum, line) { return sum + line.quantity; }, 0);
}
function validateProductionQuantityLines(lines) {
    var types = lines.map(function (l) { return l.type; });
    if (types.length !== new Set(types).size) {
        return {
            error: new Error("Each quantity line must have a distinct type (Production, Rework, or Scrap)")
        };
    }
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line.quantity <= 0) {
            return {
                error: new Error("Each line must have a quantity greater than zero")
            };
        }
        if (line.type !== "Scrap") {
            line.scrapReasonId = undefined;
        }
        if (line.configuration) {
            var configTotal = (0, jobConfiguration_1.computeJobConfigTableTotal)(line.configuration);
            if (configTotal > 0 && Math.abs(configTotal - line.quantity) > 0.0001) {
                return {
                    error: new Error("Line quantity (".concat(line.quantity, ") must match configuration total (").concat(configTotal, ")"))
                };
            }
        }
    }
    return { error: null };
}
/**
 * Guard a production report against over-reporting: (1) a config-param job's
 * reported (produced) quantities can't exceed the planned quantity for any
 * color/size cell, and (2) an operation's total reported quantity — completed +
 * scrapped + reworked — can't exceed its target quantity. Both mean "remaining
 * can't go negative".
 */
function validateProductionQuantityRemaining(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var newTotal, newProductionLines, _a, operation, existing, job, existingRows, target, reportedSoFar, remaining, planned, reportedConfigs;
        var _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    if (args.lines.length === 0)
                        return [2 /*return*/, { error: null }];
                    newTotal = args.lines.reduce(function (sum, l) { return sum + (Number(l.quantity) || 0); }, 0);
                    newProductionLines = args.lines.filter(function (l) { return l.type === "Production"; });
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("jobOperation")
                                .select("targetQuantity, operationQuantity")
                                .eq("id", args.jobOperationId)
                                .eq("companyId", args.companyId)
                                .single(),
                            client
                                .from("productionQuantity")
                                .select("quantity, type, configuration")
                                .eq("jobOperationId", args.jobOperationId)
                                .eq("companyId", args.companyId)
                                .is("invalidatedAt", null),
                            client
                                .from("job")
                                .select("configuration")
                                .eq("id", args.jobId)
                                .eq("companyId", args.companyId)
                                .single()
                        ])];
                case 1:
                    _a = _j.sent(), operation = _a[0], existing = _a[1], job = _a[2];
                    existingRows = (_b = existing.data) !== null && _b !== void 0 ? _b : [];
                    target = (_f = (_d = (_c = operation.data) === null || _c === void 0 ? void 0 : _c.targetQuantity) !== null && _d !== void 0 ? _d : (_e = operation.data) === null || _e === void 0 ? void 0 : _e.operationQuantity) !== null && _f !== void 0 ? _f : null;
                    if (target != null) {
                        reportedSoFar = existingRows.reduce(function (sum, r) { return sum + (Number(r.quantity) || 0); }, 0);
                        if (reportedSoFar + newTotal > target + 0.0001) {
                            remaining = Math.max(0, target - reportedSoFar);
                            return [2 /*return*/, {
                                    error: new Error("Reported quantity (completed + scrapped + reworked) exceeds the remaining ".concat(remaining, " for this operation."))
                                }];
                        }
                    }
                    planned = (_h = (_g = job.data) === null || _g === void 0 ? void 0 : _g.configuration) !== null && _h !== void 0 ? _h : null;
                    reportedConfigs = __spreadArray(__spreadArray([], existingRows
                        .filter(function (r) { return r.type === "Production"; })
                        .map(function (r) { return r.configuration; }), true), newProductionLines.map(function (l) { var _a; return (_a = l.configuration) !== null && _a !== void 0 ? _a : null; }), true);
                    if ((0, jobConfiguration_1.reportsExceedConfigPlan)(planned, reportedConfigs)) {
                        return [2 /*return*/, {
                                error: new Error("Reported quantity exceeds the remaining planned quantity for one or more color/size cells.")
                            }];
                    }
                    return [2 /*return*/, { error: null }];
            }
        });
    });
}
function createProductionQuantityReport(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var lineValidation, remainingCheck, originalQuantity, prepared, originalConfiguration, _a, report, reportError, lineRows, _b, lines, linesError, assignedAt, productionRows;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    lineValidation = validateProductionQuantityLines(args.lines);
                    if (lineValidation.error) {
                        return [2 /*return*/, { data: null, error: lineValidation.error }];
                    }
                    return [4 /*yield*/, validateProductionQuantityRemaining(client, {
                            companyId: args.companyId,
                            jobId: args.jobId,
                            jobOperationId: args.jobOperationId,
                            lines: args.lines
                        })];
                case 1:
                    remainingCheck = _g.sent();
                    if (remainingCheck.error) {
                        return [2 /*return*/, { data: null, error: remainingCheck.error }];
                    }
                    originalQuantity = sumLineQuantity(args.lines);
                    prepared = args.lines.map(function (line) { return (__assign({ line: line }, splitConfigAndRows(line.configuration))); });
                    originalConfiguration = (_d = (_c = prepared[0]) === null || _c === void 0 ? void 0 : _c.config) !== null && _d !== void 0 ? _d : null;
                    return [4 /*yield*/, client
                            .from("productionQuantityReport")
                            .insert({
                            companyId: args.companyId,
                            jobId: args.jobId,
                            jobOperationId: args.jobOperationId,
                            employeeId: args.employeeId,
                            originalQuantity: originalQuantity,
                            originalConfiguration: originalConfiguration,
                            notes: (_e = args.notes) !== null && _e !== void 0 ? _e : null,
                            createdBy: args.userId
                        })
                            .select("*")
                            .single()];
                case 2:
                    _a = _g.sent(), report = _a.data, reportError = _a.error;
                    if (reportError || !report) {
                        return [2 /*return*/, { data: null, error: reportError }];
                    }
                    lineRows = prepared.map(function (_a) {
                        var _b, _c, _d, _e;
                        var line = _a.line, config = _a.config;
                        return ({
                            companyId: args.companyId,
                            jobOperationId: args.jobOperationId,
                            reportId: report.id,
                            type: line.type,
                            quantity: line.quantity,
                            configuration: (config !== null && config !== void 0 ? config : null),
                            scrapReasonId: line.type === "Scrap" ? ((_b = line.scrapReasonId) !== null && _b !== void 0 ? _b : null) : null,
                            notes: (_c = line.notes) !== null && _c !== void 0 ? _c : null,
                            createdBy: args.userId,
                            employeeId: args.employeeId,
                            paymentYear: (_d = args.paymentYear) !== null && _d !== void 0 ? _d : null,
                            paymentMonth: (_e = args.paymentMonth) !== null && _e !== void 0 ? _e : null
                        });
                    });
                    return [4 /*yield*/, client
                            .from("productionQuantity")
                            .insert(lineRows)
                            .select("*, scrapReason(name)")];
                case 3:
                    _b = _g.sent(), lines = _b.data, linesError = _b.error;
                    if (linesError) {
                        return [2 /*return*/, { data: null, error: linesError }];
                    }
                    if (!args.employeeId) return [3 /*break*/, 6];
                    assignedAt = new Date().toISOString();
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .update({
                            assignee: args.employeeId,
                            assignedAt: assignedAt,
                            updatedBy: args.userId,
                            updatedAt: assignedAt
                        })
                            .eq("id", args.jobOperationId)
                            .eq("companyId", args.companyId)];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, client
                            .from("job")
                            .update({
                            assignee: args.employeeId,
                            assignedAt: assignedAt,
                            updatedBy: args.userId,
                            updatedAt: assignedAt
                        })
                            .eq("id", args.jobId)
                            .eq("companyId", args.companyId)];
                case 5:
                    _g.sent();
                    _g.label = 6;
                case 6:
                    productionRows = (_f = prepared.find(function (p) { return p.line.type === "Production"; })) === null || _f === void 0 ? void 0 : _f.rows;
                    if (!(productionRows && productionRows.length > 0)) return [3 /*break*/, 8];
                    return [4 /*yield*/, storeMasterCuttingSplitRows(client, {
                            companyId: args.companyId,
                            jobId: args.jobId,
                            jobOperationId: args.jobOperationId,
                            userId: args.userId,
                            productionQuantityReportId: report.id,
                            rows: productionRows
                        })];
                case 7:
                    _g.sent();
                    _g.label = 8;
                case 8: return [2 /*return*/, {
                        data: __assign(__assign({}, report), { activeLines: lines !== null && lines !== void 0 ? lines : [], hasHistory: false }),
                        error: null
                    }];
            }
        });
    });
}
function replaceProductionQuantityReportLines(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var lineValidation, now, _a, activeLines, activeError, invalidateError, report, prepared, lineRows, _b, newLines, insertError, productionRows, historyCount;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    lineValidation = validateProductionQuantityLines(args.lines);
                    if (lineValidation.error) {
                        return [2 /*return*/, { data: null, error: lineValidation.error }];
                    }
                    now = new Date().toISOString();
                    return [4 /*yield*/, client
                            .from("productionQuantity")
                            .select("id")
                            .eq("reportId", args.reportId)
                            .eq("companyId", args.companyId)
                            .is("invalidatedAt", null)];
                case 1:
                    _a = _d.sent(), activeLines = _a.data, activeError = _a.error;
                    if (activeError) {
                        return [2 /*return*/, { data: null, error: activeError }];
                    }
                    if (!(activeLines && activeLines.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("productionQuantity")
                            .update({
                            invalidatedAt: now,
                            invalidatedBy: args.userId,
                            updatedBy: args.userId,
                            updatedAt: now
                        })
                            .eq("reportId", args.reportId)
                            .eq("companyId", args.companyId)
                            .is("invalidatedAt", null)];
                case 2:
                    invalidateError = (_d.sent()).error;
                    if (invalidateError) {
                        return [2 /*return*/, { data: null, error: invalidateError }];
                    }
                    _d.label = 3;
                case 3: return [4 /*yield*/, client
                        .from("productionQuantityReport")
                        .select("*")
                        .eq("id", args.reportId)
                        .eq("companyId", args.companyId)
                        .single()];
                case 4:
                    report = _d.sent();
                    if (report.error || !report.data) {
                        return [2 /*return*/, { data: null, error: report.error }];
                    }
                    if (!(args.notes !== undefined)) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("productionQuantityReport")
                            .update({
                            notes: args.notes,
                            updatedBy: args.userId,
                            updatedAt: now
                        })
                            .eq("id", args.reportId)];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6:
                    prepared = args.lines.map(function (line) { return (__assign({ line: line }, splitConfigAndRows(line.configuration))); });
                    lineRows = prepared.map(function (_a) {
                        var _b, _c, _d, _e;
                        var line = _a.line, config = _a.config;
                        return ({
                            companyId: args.companyId,
                            jobOperationId: report.data.jobOperationId,
                            reportId: args.reportId,
                            type: line.type,
                            quantity: line.quantity,
                            configuration: (config !== null && config !== void 0 ? config : null),
                            scrapReasonId: line.type === "Scrap" ? ((_b = line.scrapReasonId) !== null && _b !== void 0 ? _b : null) : null,
                            notes: (_c = line.notes) !== null && _c !== void 0 ? _c : null,
                            createdBy: args.userId,
                            // The credited employee always comes from the report itself; only createdBy
                            // becomes the editor. Editing lines never reassigns the report's employee.
                            employeeId: report.data.employeeId,
                            paymentYear: (_d = args.paymentYear) !== null && _d !== void 0 ? _d : null,
                            paymentMonth: (_e = args.paymentMonth) !== null && _e !== void 0 ? _e : null
                        });
                    });
                    return [4 /*yield*/, client
                            .from("productionQuantity")
                            .insert(lineRows)
                            .select("*, scrapReason(name)")];
                case 7:
                    _b = _d.sent(), newLines = _b.data, insertError = _b.error;
                    if (insertError) {
                        return [2 /*return*/, { data: null, error: insertError }];
                    }
                    productionRows = (_c = prepared.find(function (p) { return p.line.type === "Production"; })) === null || _c === void 0 ? void 0 : _c.rows;
                    if (!productionRows) return [3 /*break*/, 9];
                    return [4 /*yield*/, storeMasterCuttingSplitRows(client, {
                            companyId: args.companyId,
                            jobId: report.data.jobId,
                            jobOperationId: report.data.jobOperationId,
                            userId: args.userId,
                            productionQuantityReportId: args.reportId,
                            rows: productionRows
                        })];
                case 8:
                    _d.sent();
                    _d.label = 9;
                case 9: return [4 /*yield*/, client
                        .from("productionQuantity")
                        .select("id", { count: "exact", head: true })
                        .eq("reportId", args.reportId)
                        .not("invalidatedAt", "is", null)];
                case 10:
                    historyCount = (_d.sent()).count;
                    return [2 /*return*/, {
                            data: __assign(__assign({}, report.data), { activeLines: newLines !== null && newLines !== void 0 ? newLines : [], hasHistory: (historyCount !== null && historyCount !== void 0 ? historyCount : 0) > 0 }),
                            error: null
                        }];
            }
        });
    });
}
function listProductionQuantityReportsForOperation(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var page, pageSize, offset, _a, reports, error, count, reportIds, _b, lines, linesError, activeByReport, hasHistoryByReport, _i, _c, line, list, result;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    page = (_d = args.page) !== null && _d !== void 0 ? _d : 1;
                    pageSize = (_e = args.pageSize) !== null && _e !== void 0 ? _e : 20;
                    offset = (page - 1) * pageSize;
                    return [4 /*yield*/, client
                            .from("productionQuantityReport")
                            .select("*", { count: "exact" })
                            .eq("jobOperationId", args.jobOperationId)
                            .eq("companyId", args.companyId)
                            .order("createdAt", { ascending: true })
                            .range(offset, offset + pageSize - 1)];
                case 1:
                    _a = _g.sent(), reports = _a.data, error = _a.error, count = _a.count;
                    if (error) {
                        return [2 /*return*/, { data: null, error: error, count: 0, hasMore: false }];
                    }
                    reportIds = (reports !== null && reports !== void 0 ? reports : []).map(function (r) { return r.id; });
                    if (reportIds.length === 0) {
                        return [2 /*return*/, {
                                data: [],
                                error: null,
                                count: count !== null && count !== void 0 ? count : 0,
                                hasMore: false
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("productionQuantity")
                            .select("*, scrapReason(name)")
                            .eq("companyId", args.companyId)
                            .in("reportId", reportIds)
                            .order("createdAt", { ascending: true })];
                case 2:
                    _b = _g.sent(), lines = _b.data, linesError = _b.error;
                    if (linesError) {
                        return [2 /*return*/, { data: null, error: linesError, count: 0, hasMore: false }];
                    }
                    activeByReport = new Map();
                    hasHistoryByReport = new Map();
                    for (_i = 0, _c = lines !== null && lines !== void 0 ? lines : []; _i < _c.length; _i++) {
                        line = _c[_i];
                        if (line.invalidatedAt) {
                            hasHistoryByReport.set(line.reportId, true);
                            continue;
                        }
                        list = (_f = activeByReport.get(line.reportId)) !== null && _f !== void 0 ? _f : [];
                        list.push(line);
                        activeByReport.set(line.reportId, list);
                    }
                    result = (reports !== null && reports !== void 0 ? reports : []).map(function (report) {
                        var _a, _b;
                        return (__assign(__assign({}, report), { activeLines: (_a = activeByReport.get(report.id)) !== null && _a !== void 0 ? _a : [], hasHistory: (_b = hasHistoryByReport.get(report.id)) !== null && _b !== void 0 ? _b : false }));
                    });
                    return [2 /*return*/, {
                            data: result,
                            error: null,
                            count: count !== null && count !== void 0 ? count : 0,
                            hasMore: count !== null && offset + pageSize < count
                        }];
            }
        });
    });
}
function listProductionQuantityReportLines(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("productionQuantity")
                .select("*, scrapReason(name)")
                .eq("reportId", args.reportId)
                .eq("companyId", args.companyId)
                .order("createdAt", { ascending: true });
            if (!args.includeInvalidated) {
                query = query.is("invalidatedAt", null);
            }
            return [2 /*return*/, query];
        });
    });
}
function getProductionQuantityReportWithLines(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, report, reportError, _b, activeLines, linesError, historyCount;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("productionQuantityReport")
                        .select("*")
                        .eq("id", args.reportId)
                        .eq("companyId", args.companyId)
                        .single()];
                case 1:
                    _a = _c.sent(), report = _a.data, reportError = _a.error;
                    if (reportError || !report) {
                        return [2 /*return*/, { data: null, error: reportError }];
                    }
                    return [4 /*yield*/, listProductionQuantityReportLines(client, {
                            reportId: args.reportId,
                            companyId: args.companyId
                        })];
                case 2:
                    _b = _c.sent(), activeLines = _b.data, linesError = _b.error;
                    if (linesError) {
                        return [2 /*return*/, { data: null, error: linesError }];
                    }
                    return [4 /*yield*/, client
                            .from("productionQuantity")
                            .select("id", { count: "exact", head: true })
                            .eq("reportId", args.reportId)
                            .eq("companyId", args.companyId)
                            .not("invalidatedAt", "is", null)];
                case 3:
                    historyCount = (_c.sent()).count;
                    return [2 /*return*/, {
                            data: __assign(__assign({}, report), { activeLines: (activeLines !== null && activeLines !== void 0 ? activeLines : []), hasHistory: (historyCount !== null && historyCount !== void 0 ? historyCount : 0) > 0 }),
                            error: null
                        }];
            }
        });
    });
}
/** True when user is in an approver group (e.g. Admin or Quantity Review) for production pay. */
function resolveProductionQuantityCanAutoApprove(client, companyId, userId, amount) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, shared_1.canApproveRequest)(client, {
                    amount: amount !== null && amount !== void 0 ? amount : 0,
                    documentType: "productionQuantityReport",
                    companyId: companyId
                }, userId)];
        });
    });
}
function accumulateConfigBreakdown(lines, totals) {
    for (var _i = 0, _a = lines !== null && lines !== void 0 ? lines : []; _i < _a.length; _i++) {
        var line = _a[_i];
        if (!line.configuration)
            continue;
        switch (line.type) {
            case "Production":
                totals.productionConfigurations.push(line.configuration);
                break;
            case "Scrap":
                totals.scrapConfigurations.push(line.configuration);
                break;
            case "Rework":
                totals.reworkConfigurations.push(line.configuration);
                break;
            default:
                break;
        }
    }
}
function getOperationQuantitySummary(client, jobOperationId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, employeeLines, employeeError, _c, supplierLines, supplierError, _d, jobOperation, operationError, totals;
        var _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("productionQuantity")
                            .select("type, quantity, configuration")
                            .eq("jobOperationId", jobOperationId)
                            .eq("companyId", companyId)
                            .is("invalidatedAt", null),
                        client
                            .from("jobOperationSupplierQuantity")
                            .select("type, quantity, configuration")
                            .eq("jobOperationId", jobOperationId)
                            .eq("companyId", companyId)
                            .is("invalidatedAt", null),
                        client
                            .from("jobOperation")
                            .select("quantityComplete, quantityScrapped, quantityReworked")
                            .eq("id", jobOperationId)
                            .eq("companyId", companyId)
                            .single()
                    ])];
                case 1:
                    _a = _j.sent(), _b = _a[0], employeeLines = _b.data, employeeError = _b.error, _c = _a[1], supplierLines = _c.data, supplierError = _c.error, _d = _a[2], jobOperation = _d.data, operationError = _d.error;
                    if (employeeError || supplierError || operationError) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_e = employeeError !== null && employeeError !== void 0 ? employeeError : supplierError) !== null && _e !== void 0 ? _e : operationError
                            }];
                    }
                    totals = {
                        production: (_f = jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.quantityComplete) !== null && _f !== void 0 ? _f : 0,
                        scrap: (_g = jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.quantityScrapped) !== null && _g !== void 0 ? _g : 0,
                        rework: (_h = jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.quantityReworked) !== null && _h !== void 0 ? _h : 0,
                        productionConfigurations: [],
                        scrapConfigurations: [],
                        reworkConfigurations: []
                    };
                    // Headline totals come from jobOperation rollups; config breakdown unions active lines.
                    accumulateConfigBreakdown(employeeLines, totals);
                    accumulateConfigBreakdown(supplierLines, totals);
                    return [2 /*return*/, {
                            data: {
                                production: totals.production,
                                scrap: totals.scrap,
                                rework: totals.rework,
                                productionConfigurations: totals.productionConfigurations,
                                scrapConfigurations: totals.scrapConfigurations,
                                reworkConfigurations: totals.reworkConfigurations
                            },
                            error: null
                        }];
            }
        });
    });
}
/**
 * Hard-deletes a production quantity report and its entire history.
 *
 * Deleting the `productionQuantityReport` row cascades to all of its
 * `productionQuantity` lines (FK `reportId` is ON DELETE CASCADE), which in
 * turn cascades to their operation notes. `approvalRequest.documentId` is a
 * soft reference (no FK), so any approval requests for the report are removed
 * first to avoid orphaning them.
 *
 * NOTE: `productionQuantityReport` has no DELETE RLS policy, so callers must
 * pass a service-role client.
 */
function deleteProductionQuantityReport(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var approvalError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("approvalRequest")
                        .delete()
                        .eq("documentType", "productionQuantityReport")
                        .eq("documentId", args.reportId)
                        .eq("companyId", args.companyId)];
                case 1:
                    approvalError = (_a.sent()).error;
                    if (approvalError) {
                        return [2 /*return*/, { data: null, error: approvalError }];
                    }
                    return [2 /*return*/, client
                            .from("productionQuantityReport")
                            .delete()
                            .eq("id", args.reportId)
                            .eq("companyId", args.companyId)];
            }
        });
    });
}
function invalidateProductionQuantity(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var now;
        return __generator(this, function (_a) {
            now = new Date().toISOString();
            return [2 /*return*/, client
                    .from("productionQuantity")
                    .update({
                    invalidatedAt: now,
                    invalidatedBy: args.userId,
                    updatedBy: args.userId,
                    updatedAt: now
                })
                    .eq("id", args.productionQuantityId)
                    .eq("companyId", args.companyId)
                    .is("invalidatedAt", null)];
        });
    });
}
/** After create or revise: auto-approve clears requests; otherwise supersede + request when rules require. */
function syncProductionQuantityReportApproval(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var reportId, companyId, userId, canAutoApprove, paymentYear, paymentMonth, amount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reportId = args.reportId, companyId = args.companyId, userId = args.userId, canAutoApprove = args.canAutoApprove, paymentYear = args.paymentYear, paymentMonth = args.paymentMonth;
                    if (!(canAutoApprove && paymentYear != null && paymentMonth != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, shared_1.cancelApprovalRequestsForDocument)(client, "productionQuantityReport", reportId, userId, "Auto-approved")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, (0, productionQuantityList_service_1.computeProductionQuantityReportEarnedAmount)(client, reportId, companyId)];
                case 3:
                    amount = _a.sent();
                    return [4 /*yield*/, (0, shared_1.requestProductionPayApproval)(client, {
                            reportId: reportId,
                            companyId: companyId,
                            requestedBy: userId,
                            amount: amount
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
