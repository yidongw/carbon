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
exports.getSubcontractPricingPreview = getSubcontractPricingPreview;
exports.updateSubcontractSnapshotPricing = updateSubcontractSnapshotPricing;
exports.getOrCreateSubcontractSnapshot = getOrCreateSubcontractSnapshot;
exports.createJobOperationSupplierQuantityReport = createJobOperationSupplierQuantityReport;
exports.replaceJobOperationSupplierQuantityReportLines = replaceJobOperationSupplierQuantityReportLines;
exports.listJobOperationSupplierQuantityReportsForOperation = listJobOperationSupplierQuantityReportsForOperation;
exports.listJobOperationSupplierQuantityReportLines = listJobOperationSupplierQuantityReportLines;
exports.getJobOperationSupplierQuantities = getJobOperationSupplierQuantities;
exports.getJobOperationSupplierQuantityReport = getJobOperationSupplierQuantityReport;
exports.createOutsideProcessingPoFromSupplierReport = createOutsideProcessingPoFromSupplierReport;
exports.invalidateJobOperationSupplierQuantity = invalidateJobOperationSupplierQuantity;
var utils_1 = require("@carbon/utils");
var query_1 = require("~/utils/query");
var production_service_1 = require("./production.service");
var productionQuantityReport_service_1 = require("./productionQuantityReport.service");
function sumLineQuantity(lines) {
    return lines.reduce(function (sum, line) { return sum + line.quantity; }, 0);
}
function pricingValuesMatch(a, b) {
    var _a, _b;
    return (a.operationUnitCost === b.operationUnitCost &&
        a.operationMinimumCost === b.operationMinimumCost &&
        ((_a = a.operationLeadTime) !== null && _a !== void 0 ? _a : 0) === ((_b = b.operationLeadTime) !== null && _b !== void 0 ? _b : 0));
}
function snapshotToPreview(snapshot) {
    var _a, _b, _c;
    return {
        operationUnitCost: (_a = snapshot.operationUnitCost) !== null && _a !== void 0 ? _a : 0,
        operationMinimumCost: (_b = snapshot.operationMinimumCost) !== null && _b !== void 0 ? _b : 0,
        operationLeadTime: (_c = snapshot.operationLeadTime) !== null && _c !== void 0 ? _c : 0,
        source: "snapshot",
        snapshotId: snapshot.id
    };
}
function findPriorSubcontractSnapshotOnJob(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, jobOperations, jobOperationsError, jobOperationIds, _b, jobSnapshots, jobSnapshotsError;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobOperation")
                        .select("id")
                        .eq("jobId", args.jobId)
                        .eq("companyId", args.companyId)];
                case 1:
                    _a = _e.sent(), jobOperations = _a.data, jobOperationsError = _a.error;
                    if (jobOperationsError) {
                        return [2 /*return*/, null];
                    }
                    jobOperationIds = (_c = jobOperations === null || jobOperations === void 0 ? void 0 : jobOperations.map(function (row) { return row.id; }).filter(Boolean)) !== null && _c !== void 0 ? _c : [];
                    if (jobOperationIds.length === 0) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, client
                            .from("jobOperationSubcontractSnapshot")
                            .select("*, supplierProcess!inner(supplierId)")
                            .eq("companyId", args.companyId)
                            .in("jobOperationId", jobOperationIds)
                            .eq("supplierProcess.supplierId", args.supplierId)
                            .order("createdAt", { ascending: true })
                            .limit(1)];
                case 2:
                    _b = _e.sent(), jobSnapshots = _b.data, jobSnapshotsError = _b.error;
                    if (jobSnapshotsError) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, (_d = jobSnapshots === null || jobSnapshots === void 0 ? void 0 : jobSnapshots[0]) !== null && _d !== void 0 ? _d : null];
            }
        });
    });
}
function resolveSupplierProcessPricing(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, supplierProcess, spError, _c, jobOperation, joError;
        var _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("supplierProcess")
                            .select("minimumCost, unitCost, leadTime, supplierId")
                            .eq("id", args.supplierProcessId)
                            .eq("companyId", args.companyId)
                            .single(),
                        client
                            .from("jobOperation")
                            .select("operationMinimumCost, operationUnitCost, operationLeadTime")
                            .eq("id", args.jobOperationId)
                            .eq("companyId", args.companyId)
                            .single()
                    ])];
                case 1:
                    _a = _k.sent(), _b = _a[0], supplierProcess = _b.data, spError = _b.error, _c = _a[1], jobOperation = _c.data, joError = _c.error;
                    if (spError || !supplierProcess) {
                        return [2 /*return*/, {
                                data: null,
                                error: spError !== null && spError !== void 0 ? spError : new Error("Supplier process not found")
                            }];
                    }
                    if (joError || !jobOperation) {
                        return [2 /*return*/, {
                                data: null,
                                error: joError !== null && joError !== void 0 ? joError : new Error("Job operation not found")
                            }];
                    }
                    return [2 /*return*/, {
                            data: {
                                operationUnitCost: (_e = (_d = supplierProcess.unitCost) !== null && _d !== void 0 ? _d : jobOperation.operationUnitCost) !== null && _e !== void 0 ? _e : 0,
                                operationMinimumCost: (_g = (_f = supplierProcess.minimumCost) !== null && _f !== void 0 ? _f : jobOperation.operationMinimumCost) !== null && _g !== void 0 ? _g : 0,
                                operationLeadTime: (_j = (_h = supplierProcess.leadTime) !== null && _h !== void 0 ? _h : jobOperation.operationLeadTime) !== null && _j !== void 0 ? _j : 0,
                                supplierId: supplierProcess.supplierId
                            },
                            error: null
                        }];
            }
        });
    });
}
/** Read-only pricing for the quantity form (does not create a snapshot). */
function getSubcontractPricingPreview(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, exactSnapshot, exactError, resolved, priorOnJob;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobOperationSubcontractSnapshot")
                        .select("*")
                        .eq("jobOperationId", args.jobOperationId)
                        .eq("supplierProcessId", args.supplierProcessId)
                        .eq("companyId", args.companyId)
                        .maybeSingle()];
                case 1:
                    _a = _b.sent(), exactSnapshot = _a.data, exactError = _a.error;
                    if (exactError) {
                        return [2 /*return*/, { data: null, error: exactError }];
                    }
                    if (exactSnapshot) {
                        return [2 /*return*/, { data: snapshotToPreview(exactSnapshot), error: null }];
                    }
                    return [4 /*yield*/, resolveSupplierProcessPricing(client, {
                            companyId: args.companyId,
                            jobOperationId: args.jobOperationId,
                            supplierProcessId: args.supplierProcessId
                        })];
                case 2:
                    resolved = _b.sent();
                    if (resolved.error || !resolved.data) {
                        return [2 /*return*/, { data: null, error: resolved.error }];
                    }
                    return [4 /*yield*/, findPriorSubcontractSnapshotOnJob(client, {
                            companyId: args.companyId,
                            jobId: args.jobId,
                            supplierId: resolved.data.supplierId
                        })];
                case 3:
                    priorOnJob = _b.sent();
                    if (priorOnJob) {
                        return [2 /*return*/, { data: snapshotToPreview(priorOnJob), error: null }];
                    }
                    return [2 /*return*/, {
                            data: {
                                operationUnitCost: resolved.data.operationUnitCost,
                                operationMinimumCost: resolved.data.operationMinimumCost,
                                operationLeadTime: resolved.data.operationLeadTime,
                                source: "supplierProcess"
                            },
                            error: null
                        }];
            }
        });
    });
}
function updateSubcontractSnapshotPricing(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperationSubcontractSnapshot")
                    .update({
                    operationUnitCost: args.pricing.operationUnitCost,
                    operationMinimumCost: args.pricing.operationMinimumCost,
                    operationLeadTime: args.pricing.operationLeadTime
                })
                    .eq("id", args.snapshotId)
                    .eq("companyId", args.companyId)];
        });
    });
}
function getOrCreateSubcontractSnapshot(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, existing, existingError, _b, jobOperation, joError, resolved, operationMinimumCost, operationUnitCost, operationLeadTime, priorOnJob, _c, created, createError;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobOperationSubcontractSnapshot")
                        .select("*")
                        .eq("jobOperationId", args.jobOperationId)
                        .eq("supplierProcessId", args.supplierProcessId)
                        .eq("companyId", args.companyId)
                        .maybeSingle()];
                case 1:
                    _a = _g.sent(), existing = _a.data, existingError = _a.error;
                    if (existingError) {
                        return [2 /*return*/, { data: null, error: existingError }];
                    }
                    if (existing) {
                        return [2 /*return*/, { data: existing, error: null }];
                    }
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("jobId, operationMinimumCost, operationUnitCost, operationLeadTime")
                            .eq("id", args.jobOperationId)
                            .eq("companyId", args.companyId)
                            .single()];
                case 2:
                    _b = _g.sent(), jobOperation = _b.data, joError = _b.error;
                    if (joError || !(jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.jobId)) {
                        return [2 /*return*/, {
                                data: null,
                                error: joError !== null && joError !== void 0 ? joError : new Error("Job operation not found")
                            }];
                    }
                    return [4 /*yield*/, resolveSupplierProcessPricing(client, {
                            companyId: args.companyId,
                            jobOperationId: args.jobOperationId,
                            supplierProcessId: args.supplierProcessId
                        })];
                case 3:
                    resolved = _g.sent();
                    if (resolved.error || !resolved.data) {
                        return [2 /*return*/, { data: null, error: resolved.error }];
                    }
                    operationMinimumCost = resolved.data.operationMinimumCost;
                    operationUnitCost = resolved.data.operationUnitCost;
                    operationLeadTime = resolved.data.operationLeadTime;
                    return [4 /*yield*/, findPriorSubcontractSnapshotOnJob(client, {
                            companyId: args.companyId,
                            jobId: jobOperation.jobId,
                            supplierId: resolved.data.supplierId
                        })];
                case 4:
                    priorOnJob = _g.sent();
                    if (priorOnJob) {
                        operationMinimumCost =
                            (_d = priorOnJob.operationMinimumCost) !== null && _d !== void 0 ? _d : operationMinimumCost;
                        operationUnitCost = (_e = priorOnJob.operationUnitCost) !== null && _e !== void 0 ? _e : operationUnitCost;
                        operationLeadTime = (_f = priorOnJob.operationLeadTime) !== null && _f !== void 0 ? _f : operationLeadTime;
                    }
                    return [4 /*yield*/, client
                            .from("jobOperationSubcontractSnapshot")
                            .insert({
                            companyId: args.companyId,
                            jobOperationId: args.jobOperationId,
                            supplierProcessId: args.supplierProcessId,
                            operationMinimumCost: operationMinimumCost,
                            operationUnitCost: operationUnitCost,
                            operationLeadTime: operationLeadTime,
                            createdBy: args.userId
                        })
                            .select("*")
                            .single()];
                case 5:
                    _c = _g.sent(), created = _c.data, createError = _c.error;
                    return [2 /*return*/, { data: created, error: createError }];
            }
        });
    });
}
function createJobOperationSupplierQuantityReport(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var lineValidation, remainingCheck, operationValidation, snapshotResult, snapshot, updateError, originalQuantity, primaryLine, originalConfiguration, _a, report, reportError, lineRows, _b, lines, linesError;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    lineValidation = (0, productionQuantityReport_service_1.validateProductionQuantityLines)(args.lines);
                    if (lineValidation.error) {
                        return [2 /*return*/, { data: null, error: lineValidation.error }];
                    }
                    return [4 /*yield*/, (0, productionQuantityReport_service_1.validateProductionQuantityRemaining)(client, {
                            companyId: args.companyId,
                            jobId: args.jobId,
                            jobOperationId: args.jobOperationId,
                            lines: args.lines
                        })];
                case 1:
                    remainingCheck = _f.sent();
                    if (remainingCheck.error) {
                        return [2 /*return*/, { data: null, error: remainingCheck.error }];
                    }
                    return [4 /*yield*/, (0, production_service_1.assertSupplierQuantityAllowedForOperation)(client, args.jobOperationId, args.companyId)];
                case 2:
                    operationValidation = _f.sent();
                    if (operationValidation.error) {
                        return [2 /*return*/, { data: null, error: operationValidation.error }];
                    }
                    return [4 /*yield*/, getOrCreateSubcontractSnapshot(client, {
                            companyId: args.companyId,
                            jobOperationId: args.jobOperationId,
                            supplierProcessId: args.supplierProcessId,
                            userId: args.userId
                        })];
                case 3:
                    snapshotResult = _f.sent();
                    if (snapshotResult.error || !snapshotResult.data) {
                        return [2 /*return*/, { data: null, error: snapshotResult.error }];
                    }
                    snapshot = snapshotResult.data;
                    if (!(args.snapshotPricingEdited &&
                        args.snapshotPricing &&
                        !pricingValuesMatch(snapshot, args.snapshotPricing))) return [3 /*break*/, 5];
                    return [4 /*yield*/, updateSubcontractSnapshotPricing(client, {
                            snapshotId: snapshot.id,
                            companyId: args.companyId,
                            pricing: args.snapshotPricing
                        })];
                case 4:
                    updateError = (_f.sent()).error;
                    if (updateError) {
                        return [2 /*return*/, { data: null, error: updateError }];
                    }
                    snapshot = __assign(__assign({}, snapshot), { operationUnitCost: args.snapshotPricing.operationUnitCost, operationMinimumCost: args.snapshotPricing.operationMinimumCost, operationLeadTime: (_c = args.snapshotPricing.operationLeadTime) !== null && _c !== void 0 ? _c : snapshot.operationLeadTime });
                    _f.label = 5;
                case 5:
                    originalQuantity = sumLineQuantity(args.lines);
                    primaryLine = args.lines[0];
                    originalConfiguration = (_d = primaryLine === null || primaryLine === void 0 ? void 0 : primaryLine.configuration) !== null && _d !== void 0 ? _d : null;
                    return [4 /*yield*/, client
                            .from("jobOperationSupplierQuantityReport")
                            .insert({
                            companyId: args.companyId,
                            jobId: args.jobId,
                            jobOperationId: args.jobOperationId,
                            supplierProcessId: args.supplierProcessId,
                            subcontractSnapshotId: snapshot.id,
                            originalQuantity: originalQuantity,
                            originalConfiguration: originalConfiguration,
                            notes: (_e = args.notes) !== null && _e !== void 0 ? _e : null,
                            createdBy: args.userId
                        })
                            .select("*")
                            .single()];
                case 6:
                    _a = _f.sent(), report = _a.data, reportError = _a.error;
                    if (reportError || !report) {
                        return [2 /*return*/, { data: null, error: reportError }];
                    }
                    lineRows = args.lines.map(function (line) {
                        var _a, _b, _c;
                        return ({
                            companyId: args.companyId,
                            jobOperationId: args.jobOperationId,
                            reportId: report.id,
                            supplierProcessId: args.supplierProcessId,
                            type: line.type,
                            quantity: line.quantity,
                            configuration: ((_a = line.configuration) !== null && _a !== void 0 ? _a : null),
                            scrapReasonId: line.type === "Scrap" ? ((_b = line.scrapReasonId) !== null && _b !== void 0 ? _b : null) : null,
                            notes: (_c = line.notes) !== null && _c !== void 0 ? _c : null,
                            createdBy: args.userId
                        });
                    });
                    return [4 /*yield*/, client
                            .from("jobOperationSupplierQuantity")
                            .insert(lineRows)
                            .select("*, scrapReason(name)")];
                case 7:
                    _b = _f.sent(), lines = _b.data, linesError = _b.error;
                    if (linesError) {
                        return [2 /*return*/, { data: null, error: linesError }];
                    }
                    return [2 /*return*/, {
                            data: __assign(__assign({}, report), { activeLines: lines !== null && lines !== void 0 ? lines : [], hasHistory: false, subcontractSnapshot: snapshot }),
                            error: null
                        }];
            }
        });
    });
}
function replaceJobOperationSupplierQuantityReportLines(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var lineValidation, now, _a, activeLines, activeError, invalidateError, report, lineRows, _b, newLines, insertError, historyCount, snapshot;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    lineValidation = (0, productionQuantityReport_service_1.validateProductionQuantityLines)(args.lines);
                    if (lineValidation.error) {
                        return [2 /*return*/, { data: null, error: lineValidation.error }];
                    }
                    now = new Date().toISOString();
                    return [4 /*yield*/, client
                            .from("jobOperationSupplierQuantity")
                            .select("id")
                            .eq("reportId", args.reportId)
                            .eq("companyId", args.companyId)
                            .is("invalidatedAt", null)];
                case 1:
                    _a = _c.sent(), activeLines = _a.data, activeError = _a.error;
                    if (activeError) {
                        return [2 /*return*/, { data: null, error: activeError }];
                    }
                    if (!(activeLines && activeLines.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("jobOperationSupplierQuantity")
                            .update({
                            invalidatedAt: now,
                            invalidatedBy: args.userId
                        })
                            .eq("reportId", args.reportId)
                            .eq("companyId", args.companyId)
                            .is("invalidatedAt", null)];
                case 2:
                    invalidateError = (_c.sent()).error;
                    if (invalidateError) {
                        return [2 /*return*/, { data: null, error: invalidateError }];
                    }
                    _c.label = 3;
                case 3: return [4 /*yield*/, client
                        .from("jobOperationSupplierQuantityReport")
                        .select("*, subcontractSnapshot:jobOperationSubcontractSnapshot(*)")
                        .eq("id", args.reportId)
                        .eq("companyId", args.companyId)
                        .single()];
                case 4:
                    report = _c.sent();
                    if (report.error || !report.data) {
                        return [2 /*return*/, { data: null, error: report.error }];
                    }
                    if (!(args.notes !== undefined)) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("jobOperationSupplierQuantityReport")
                            .update({
                            notes: args.notes,
                            updatedBy: args.userId,
                            updatedAt: now
                        })
                            .eq("id", args.reportId)];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6:
                    lineRows = args.lines.map(function (line) {
                        var _a, _b, _c;
                        return ({
                            companyId: args.companyId,
                            jobOperationId: report.data.jobOperationId,
                            reportId: args.reportId,
                            supplierProcessId: report.data.supplierProcessId,
                            type: line.type,
                            quantity: line.quantity,
                            configuration: ((_a = line.configuration) !== null && _a !== void 0 ? _a : null),
                            scrapReasonId: line.type === "Scrap" ? ((_b = line.scrapReasonId) !== null && _b !== void 0 ? _b : null) : null,
                            notes: (_c = line.notes) !== null && _c !== void 0 ? _c : null,
                            createdBy: args.userId
                        });
                    });
                    return [4 /*yield*/, client
                            .from("jobOperationSupplierQuantity")
                            .insert(lineRows)
                            .select("*, scrapReason(name)")];
                case 7:
                    _b = _c.sent(), newLines = _b.data, insertError = _b.error;
                    if (insertError) {
                        return [2 /*return*/, { data: null, error: insertError }];
                    }
                    return [4 /*yield*/, client
                            .from("jobOperationSupplierQuantity")
                            .select("id", { count: "exact", head: true })
                            .eq("reportId", args.reportId)
                            .not("invalidatedAt", "is", null)];
                case 8:
                    historyCount = (_c.sent()).count;
                    snapshot = Array.isArray(report.data.subcontractSnapshot)
                        ? report.data.subcontractSnapshot[0]
                        : report.data.subcontractSnapshot;
                    return [2 /*return*/, {
                            data: __assign(__assign({}, report.data), { subcontractSnapshot: snapshot !== null && snapshot !== void 0 ? snapshot : undefined, activeLines: newLines !== null && newLines !== void 0 ? newLines : [], hasHistory: (historyCount !== null && historyCount !== void 0 ? historyCount : 0) > 0 }),
                            error: null
                        }];
            }
        });
    });
}
function listJobOperationSupplierQuantityReportsForOperation(client, args) {
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
                            .from("jobOperationSupplierQuantityReport")
                            .select("*, subcontractSnapshot:jobOperationSubcontractSnapshot(*), supplierProcess(id, supplierId, processId), purchaseOrderLine:purchaseOrderLine!jobOperationSupplierQuantityReport_purchaseOrderLineId_fkey(purchaseOrderId)", { count: "exact" })
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
                            .from("jobOperationSupplierQuantity")
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
                        var snapshot = Array.isArray(report.subcontractSnapshot)
                            ? report.subcontractSnapshot[0]
                            : report.subcontractSnapshot;
                        var supplierProcess = Array.isArray(report.supplierProcess)
                            ? report.supplierProcess[0]
                            : report.supplierProcess;
                        var purchaseOrderLine = Array.isArray(report.purchaseOrderLine)
                            ? report.purchaseOrderLine[0]
                            : report.purchaseOrderLine;
                        return __assign(__assign({}, report), { subcontractSnapshot: snapshot !== null && snapshot !== void 0 ? snapshot : undefined, supplierProcess: supplierProcess !== null && supplierProcess !== void 0 ? supplierProcess : undefined, purchaseOrderLine: purchaseOrderLine !== null && purchaseOrderLine !== void 0 ? purchaseOrderLine : undefined, activeLines: (_a = activeByReport.get(report.id)) !== null && _a !== void 0 ? _a : [], hasHistory: (_b = hasHistoryByReport.get(report.id)) !== null && _b !== void 0 ? _b : false });
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
function listJobOperationSupplierQuantityReportLines(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("jobOperationSupplierQuantity")
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
function getJobOperationSupplierQuantities(client, jobOperationIds, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (jobOperationIds.length === 0) {
                        return [2 /*return*/, { data: [], count: 0, error: null }];
                    }
                    query = client
                        .from("jobOperationSupplierQuantity")
                        .select("*,\n      jobOperation(description, jobMakeMethod(parentMaterialId, item(readableIdWithRevision))),\n      supplierProcess!jobOperationSupplierQuantity_supplierProcessId_fkey(id, supplierId, processId)", { count: "exact" })
                        .in("jobOperationId", jobOperationIds)
                        .eq("companyId", companyId)
                        .is("invalidatedAt", null);
                    if (args === null || args === void 0 ? void 0 : args.search) {
                        query = query.or("jobOperation.description.ilike.%".concat(args.search, "%"));
                    }
                    if (args) {
                        query = (0, query_1.setGenericQueryFilters)(query, args, [
                            { column: "createdAt", ascending: false }
                        ]);
                    }
                    return [4 /*yield*/, query];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getJobOperationSupplierQuantityReport(client, reportId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, report, error, _b, lines, linesError, activeLines, hasHistory, _i, _c, line, snapshot, supplierProcess;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobOperationSupplierQuantityReport")
                        .select("*, subcontractSnapshot:jobOperationSubcontractSnapshot(*), supplierProcess(id, supplierId, processId)")
                        .eq("id", reportId)
                        .eq("companyId", companyId)
                        .single()];
                case 1:
                    _a = _d.sent(), report = _a.data, error = _a.error;
                    if (error || !report) {
                        return [2 /*return*/, { data: null, error: error }];
                    }
                    return [4 /*yield*/, client
                            .from("jobOperationSupplierQuantity")
                            .select("*, scrapReason(name)")
                            .eq("reportId", reportId)
                            .eq("companyId", companyId)
                            .order("createdAt", { ascending: true })];
                case 2:
                    _b = _d.sent(), lines = _b.data, linesError = _b.error;
                    if (linesError) {
                        return [2 /*return*/, { data: null, error: linesError }];
                    }
                    activeLines = [];
                    hasHistory = false;
                    for (_i = 0, _c = lines !== null && lines !== void 0 ? lines : []; _i < _c.length; _i++) {
                        line = _c[_i];
                        if (line.invalidatedAt) {
                            hasHistory = true;
                        }
                        else {
                            activeLines.push(line);
                        }
                    }
                    snapshot = Array.isArray(report.subcontractSnapshot)
                        ? report.subcontractSnapshot[0]
                        : report.subcontractSnapshot;
                    supplierProcess = Array.isArray(report.supplierProcess)
                        ? report.supplierProcess[0]
                        : report.supplierProcess;
                    return [2 /*return*/, {
                            data: __assign(__assign({}, report), { subcontractSnapshot: snapshot !== null && snapshot !== void 0 ? snapshot : undefined, supplierProcess: supplierProcess !== null && supplierProcess !== void 0 ? supplierProcess : undefined, activeLines: activeLines, hasHistory: hasHistory }),
                            error: null
                        }];
            }
        });
    });
}
function createOutsideProcessingPoFromSupplierReport(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var reportResult, report, orphanedLine, relinkError, snapshot, productionQty, unitCost, minimumCost, _a, supplierProcess, spError, _b, job, jobError, _c, item, itemError, jobOperation, pricingLines, getNextSequence, _d, upsertPurchaseOrder, upsertPurchaseOrderLine, nextSequence, supplier, purchaseOrder, purchaseOrderId, purchaseOrderLineType, primaryLineId, _i, pricingLines_1, pricingLine, line, linkError;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0: return [4 /*yield*/, getJobOperationSupplierQuantityReport(client, args.reportId, args.companyId)];
                case 1:
                    reportResult = _t.sent();
                    if (reportResult.error || !reportResult.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_e = reportResult.error) !== null && _e !== void 0 ? _e : new Error("Report not found")
                            }];
                    }
                    report = reportResult.data;
                    if (report.purchaseOrderLineId) {
                        return [2 /*return*/, {
                                data: { purchaseOrderLineId: report.purchaseOrderLineId },
                                error: null
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("purchaseOrderLine")
                            .select("id, purchaseOrderId")
                            .eq("jobOperationSupplierQuantityReportId", report.id)
                            .eq("companyId", args.companyId)
                            .maybeSingle()];
                case 2:
                    orphanedLine = (_t.sent()).data;
                    if (!(orphanedLine === null || orphanedLine === void 0 ? void 0 : orphanedLine.id)) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("jobOperationSupplierQuantityReport")
                            .update({
                            purchaseOrderLineId: orphanedLine.id,
                            updatedBy: args.userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", report.id)
                            .eq("companyId", args.companyId)];
                case 3:
                    relinkError = (_t.sent()).error;
                    if (relinkError) {
                        return [2 /*return*/, { data: null, error: relinkError }];
                    }
                    return [2 /*return*/, {
                            data: {
                                purchaseOrderId: orphanedLine.purchaseOrderId,
                                purchaseOrderLineId: orphanedLine.id
                            },
                            error: null
                        }];
                case 4:
                    snapshot = report.subcontractSnapshot;
                    if (!snapshot) {
                        return [2 /*return*/, { data: null, error: new Error("Subcontract snapshot not found") }];
                    }
                    productionQty = report.activeLines
                        .filter(function (l) { return l.type === "Production"; })
                        .reduce(function (sum, l) { return sum + l.quantity; }, 0);
                    if (productionQty <= 0) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Report must include a Production quantity line")
                            }];
                    }
                    unitCost = (_f = snapshot.operationUnitCost) !== null && _f !== void 0 ? _f : 0;
                    minimumCost = (_g = snapshot.operationMinimumCost) !== null && _g !== void 0 ? _g : 0;
                    return [4 /*yield*/, client
                            .from("supplierProcess")
                            .select("supplierId")
                            .eq("id", report.supplierProcessId)
                            .eq("companyId", args.companyId)
                            .single()];
                case 5:
                    _a = _t.sent(), supplierProcess = _a.data, spError = _a.error;
                    if (spError || !(supplierProcess === null || supplierProcess === void 0 ? void 0 : supplierProcess.supplierId)) {
                        return [2 /*return*/, {
                                data: null,
                                error: spError !== null && spError !== void 0 ? spError : new Error("Supplier process not found")
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("job")
                            .select("id, jobId, itemId, locationId")
                            .eq("id", report.jobId)
                            .eq("companyId", args.companyId)
                            .single()];
                case 6:
                    _b = _t.sent(), job = _b.data, jobError = _b.error;
                    if (jobError || !(job === null || job === void 0 ? void 0 : job.itemId)) {
                        return [2 /*return*/, { data: null, error: jobError !== null && jobError !== void 0 ? jobError : new Error("Job not found") }];
                    }
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id, type, name, description, unitOfMeasureCode")
                            .eq("id", job.itemId)
                            .single()];
                case 7:
                    _c = _t.sent(), item = _c.data, itemError = _c.error;
                    if (itemError || !item) {
                        return [2 /*return*/, { data: null, error: itemError !== null && itemError !== void 0 ? itemError : new Error("Item not found") }];
                    }
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("description")
                            .eq("id", report.jobOperationId)
                            .single()];
                case 8:
                    jobOperation = (_t.sent()).data;
                    pricingLines = (0, utils_1.calculateOutsideProcessingPurchaseOrderLines)({
                        quantity: productionQty,
                        unitCost: unitCost,
                        minimumCost: minimumCost,
                        minimumCostDescription: "Minimum cost - ".concat((_j = (_h = jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.description) !== null && _h !== void 0 ? _h : item.name) !== null && _j !== void 0 ? _j : "Outside processing")
                    });
                    if (pricingLines.every(function (line) { return line.purchaseQuantity * line.supplierUnitPrice <= 0; })) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Snapshot minimum and unit costs cannot both be zero")
                            }];
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("~/modules/settings/settings.service"); })];
                case 9:
                    getNextSequence = (_t.sent()).getNextSequence;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("~/modules/purchasing/purchasing.service"); })];
                case 10:
                    _d = _t.sent(), upsertPurchaseOrder = _d.upsertPurchaseOrder, upsertPurchaseOrderLine = _d.upsertPurchaseOrderLine;
                    return [4 /*yield*/, getNextSequence(client, "purchaseOrder", args.companyId)];
                case 11:
                    nextSequence = _t.sent();
                    if (nextSequence.error || !nextSequence.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_k = nextSequence.error) !== null && _k !== void 0 ? _k : new Error("Failed to get PO sequence")
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("supplier")
                            .select("currencyCode")
                            .eq("id", supplierProcess.supplierId)
                            .single()];
                case 12:
                    supplier = (_t.sent()).data;
                    return [4 /*yield*/, upsertPurchaseOrder(client, {
                            purchaseOrderId: nextSequence.data,
                            supplierId: supplierProcess.supplierId,
                            companyId: args.companyId,
                            companyGroupId: args.companyGroupId,
                            createdBy: args.userId,
                            purchaseOrderType: "Outside Processing",
                            locationId: (_l = job.locationId) !== null && _l !== void 0 ? _l : "",
                            currencyCode: (_m = supplier === null || supplier === void 0 ? void 0 : supplier.currencyCode) !== null && _m !== void 0 ? _m : "USD",
                            status: "Draft",
                            jobId: job.id,
                            jobReadableId: job.jobId
                        })];
                case 13:
                    purchaseOrder = _t.sent();
                    if (purchaseOrder.error || !((_p = (_o = purchaseOrder.data) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.id)) {
                        return [2 /*return*/, { data: null, error: purchaseOrder.error }];
                    }
                    purchaseOrderId = purchaseOrder.data[0].id;
                    purchaseOrderLineType = (0, utils_1.toPurchaseOrderItemLineType)(item.type);
                    _i = 0, pricingLines_1 = pricingLines;
                    _t.label = 14;
                case 14:
                    if (!(_i < pricingLines_1.length)) return [3 /*break*/, 17];
                    pricingLine = pricingLines_1[_i];
                    return [4 /*yield*/, upsertPurchaseOrderLine(client, {
                            purchaseOrderId: purchaseOrderId,
                            purchaseOrderLineType: purchaseOrderLineType,
                            itemId: item.id,
                            description: pricingLine.isMinimumCostLine
                                ? pricingLine.description
                                : item.name || item.description || undefined,
                            purchaseQuantity: pricingLine.purchaseQuantity,
                            purchaseUnitOfMeasureCode: (_q = item.unitOfMeasureCode) !== null && _q !== void 0 ? _q : undefined,
                            inventoryUnitOfMeasureCode: (_r = item.unitOfMeasureCode) !== null && _r !== void 0 ? _r : undefined,
                            conversionFactor: 1,
                            supplierUnitPrice: pricingLine.supplierUnitPrice,
                            locationId: job.locationId,
                            jobId: job.id,
                            jobOperationId: pricingLine.isMinimumCostLine
                                ? undefined
                                : report.jobOperationId,
                            jobOperationSupplierQuantityReportId: pricingLine.isMinimumCostLine
                                ? undefined
                                : report.id,
                            companyId: args.companyId,
                            createdBy: args.userId
                        })];
                case 15:
                    line = _t.sent();
                    if (line.error || !((_s = line.data) === null || _s === void 0 ? void 0 : _s.id)) {
                        return [2 /*return*/, { data: null, error: line.error }];
                    }
                    if (!pricingLine.isMinimumCostLine) {
                        primaryLineId = line.data.id;
                    }
                    _t.label = 16;
                case 16:
                    _i++;
                    return [3 /*break*/, 14];
                case 17:
                    if (!primaryLineId) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Failed to create purchase order line")
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("jobOperationSupplierQuantityReport")
                            .update({
                            purchaseOrderLineId: primaryLineId,
                            updatedBy: args.userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", report.id)
                            .eq("companyId", args.companyId)];
                case 18:
                    linkError = (_t.sent()).error;
                    if (linkError) {
                        return [2 /*return*/, { data: null, error: linkError }];
                    }
                    return [2 /*return*/, {
                            data: {
                                purchaseOrderId: purchaseOrderId,
                                purchaseOrderLineId: primaryLineId
                            },
                            error: null
                        }];
            }
        });
    });
}
function invalidateJobOperationSupplierQuantity(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var now;
        return __generator(this, function (_a) {
            now = new Date().toISOString();
            return [2 /*return*/, client
                    .from("jobOperationSupplierQuantity")
                    .update({
                    invalidatedAt: now,
                    invalidatedBy: args.userId
                })
                    .eq("id", args.supplierQuantityId)
                    .eq("companyId", args.companyId)
                    .is("invalidatedAt", null)];
        });
    });
}
