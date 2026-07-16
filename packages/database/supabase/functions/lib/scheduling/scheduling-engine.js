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
exports.SchedulingEngine = void 0;
var assembly_handler_ts_1 = require("./assembly-handler.ts");
var date_calculator_ts_1 = require("./date-calculator.ts");
var dependency_manager_ts_1 = require("./dependency-manager.ts");
var material_manager_ts_1 = require("./material-manager.ts");
var priority_calculator_ts_1 = require("./priority-calculator.ts");
var work_center_selector_ts_1 = require("./work-center-selector.ts");
/**
 * Unified Scheduling Engine
 * Orchestrates all scheduling operations for both initial scheduling and rescheduling
 */
var SchedulingEngine = /** @class */ (function () {
    function SchedulingEngine(options) {
        this.job = null;
        this.operations = [];
        this.dependencies = [];
        this.scheduledOperations = new Map();
        this.affectedWorkCenters = new Set();
        this.assemblyDepth = 0;
        this.conflictsDetected = 0;
        this.workCenterSelector = null;
        this.client = options.client;
        this.db = options.db;
        this.jobId = options.jobId;
        this.companyId = options.companyId;
        this.userId = options.userId;
        this.direction = options.direction;
        this.mode = options.mode;
        this.assemblyHandler = new assembly_handler_ts_1.AssemblyHandler(this.client, this.db, this.companyId);
        this.materialManager = new material_manager_ts_1.MaterialManager(this.db, this.companyId);
    }
    /**
     * Initialize the engine - load job, operations, and dependencies
     */
    SchedulingEngine.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var job, _a, deps, operationsByJobMakeMethodId, materialIds, assemblyTree;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.db
                            .selectFrom("job")
                            .select(["id", "dueDate", "deadlineType", "locationId", "priority"])
                            .where("id", "=", this.jobId)
                            .executeTakeFirst()];
                    case 1:
                        job = _b.sent();
                        if (!job) {
                            throw new Error("Job ".concat(this.jobId, " not found"));
                        }
                        this.job = job;
                        if (!job.locationId) return [3 /*break*/, 3];
                        this.workCenterSelector = new work_center_selector_ts_1.WorkCenterSelector(this.db, this.companyId, job.locationId);
                        return [4 /*yield*/, this.workCenterSelector.initialize()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        // Load operations
                        _a = this;
                        return [4 /*yield*/, this.db
                                .selectFrom("jobOperation")
                                .selectAll()
                                .where("jobId", "=", this.jobId)
                                .where("status", "not in", ["Done", "Canceled"])
                                .orderBy("order")
                                .execute()];
                    case 4:
                        // Load operations
                        _a.operations = (_b.sent());
                        if (!(this.mode === "reschedule")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.db
                                .selectFrom("jobOperationDependency")
                                .selectAll()
                                .where("jobId", "=", this.jobId)
                                .execute()];
                    case 5:
                        deps = _b.sent();
                        this.dependencies = deps.map(function (d) { return ({
                            operationId: d.operationId,
                            dependsOnId: d.dependsOnId,
                            jobId: d.jobId,
                        }); });
                        _b.label = 6;
                    case 6: 
                    // Initialize material manager
                    return [4 /*yield*/, this.materialManager.initialize(this.jobId)];
                    case 7:
                        // Initialize material manager
                        _b.sent();
                        if (!(this.operations.length > 0)) return [3 /*break*/, 9];
                        operationsByJobMakeMethodId = this.operations.reduce(function (acc, op) {
                            if (!acc[op.jobMakeMethodId]) {
                                acc[op.jobMakeMethodId] = [];
                            }
                            acc[op.jobMakeMethodId].push(op);
                            return acc;
                        }, {});
                        materialIds = this.materialManager.getMaterialIds();
                        return [4 /*yield*/, this.materialManager.assignOperationsToMaterials(materialIds, operationsByJobMakeMethodId)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [4 /*yield*/, this.assemblyHandler.buildAssemblyTree(this.jobId)];
                    case 10:
                        assemblyTree = _b.sent();
                        if (assemblyTree) {
                            this.assemblyDepth = this.assemblyHandler.getAssemblyDepth(assemblyTree);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create operation dependencies based on assembly structure.
     * Loads ALL operations (including Done) to build the complete DAG.
     */
    SchedulingEngine.prototype.createDependencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allOperations, assemblyTree, makeMethodIds, jobMaterials, jobMakeMethodToOperationId, _i, jobMaterials_1, m, operationsByMethod, _a, allOperations_1, op, makeMethodDeps, allDependencies, _b, allOperations_2, op, _c, makeMethodDeps_1, methodDep, methodOps, sortedOps, lastOperation, parentOperation, parentOps, sortedParentOps, deps, methodDeps, _d, methodDeps_1, _e, opId, deps, existing, _f, deps_1, depId, reworkOpIds, deleteQuery, records, _g, records_1, record, _h, allDependencies_1, _j, opId, deps, reworkDeps, _k, reworkDeps_1, d;
            var _l, _m, _o, _p;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0: return [4 /*yield*/, this.db
                            .selectFrom("jobOperation")
                            .selectAll()
                            .where("jobId", "=", this.jobId)
                            .orderBy("order")
                            .execute()];
                    case 1:
                        allOperations = (_q.sent());
                        return [4 /*yield*/, this.assemblyHandler.buildAssemblyTree(this.jobId)];
                    case 2:
                        assemblyTree = _q.sent();
                        if (!assemblyTree) {
                            console.warn("No assembly tree found for job", this.jobId);
                            return [2 /*return*/];
                        }
                        makeMethodIds = this.assemblyHandler.getAllJobMakeMethodIds(assemblyTree);
                        return [4 /*yield*/, this.db
                                .selectFrom("jobMaterialWithMakeMethodId")
                                .selectAll()
                                .where("jobMakeMethodId", "in", makeMethodIds)
                                .execute()];
                    case 3:
                        jobMaterials = _q.sent();
                        jobMakeMethodToOperationId = {};
                        for (_i = 0, jobMaterials_1 = jobMaterials; _i < jobMaterials_1.length; _i++) {
                            m = jobMaterials_1[_i];
                            if (m.jobMaterialMakeMethodId) {
                                jobMakeMethodToOperationId[m.jobMaterialMakeMethodId] =
                                    m.jobOperationId;
                            }
                        }
                        operationsByMethod = new Map();
                        for (_a = 0, allOperations_1 = allOperations; _a < allOperations_1.length; _a++) {
                            op = allOperations_1[_a];
                            if (op.jobMakeMethodId && !op.reworkId) {
                                if (!operationsByMethod.has(op.jobMakeMethodId)) {
                                    operationsByMethod.set(op.jobMakeMethodId, []);
                                }
                                operationsByMethod.get(op.jobMakeMethodId).push(op);
                            }
                        }
                        makeMethodDeps = (0, assembly_handler_ts_1.buildMakeMethodDependencies)(assemblyTree);
                        allDependencies = new Map();
                        // Initialize all non-rework operations
                        for (_b = 0, allOperations_2 = allOperations; _b < allOperations_2.length; _b++) {
                            op = allOperations_2[_b];
                            if (op.id && !op.reworkId) {
                                allDependencies.set(op.id, new Set());
                            }
                        }
                        // Process each make method's operations
                        for (_c = 0, makeMethodDeps_1 = makeMethodDeps; _c < makeMethodDeps_1.length; _c++) {
                            methodDep = makeMethodDeps_1[_c];
                            methodOps = (_l = operationsByMethod.get(methodDep.id)) !== null && _l !== void 0 ? _l : [];
                            sortedOps = __spreadArray([], methodOps, true).sort(function (a, b) { var _a, _b; return ((_a = a.order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.order) !== null && _b !== void 0 ? _b : 0); });
                            lastOperation = sortedOps[sortedOps.length - 1];
                            // If this method has a parent, link last op to parent's consuming operation
                            if (methodDep.id && methodDep.parentId !== null) {
                                parentOperation = jobMakeMethodToOperationId[methodDep.id];
                                // If no specific operation was set, default to the first operation of the parent
                                if (!parentOperation && methodDep.parentId) {
                                    parentOps = (_m = operationsByMethod.get(methodDep.parentId)) !== null && _m !== void 0 ? _m : [];
                                    sortedParentOps = __spreadArray([], parentOps, true).sort(function (a, b) { var _a, _b; return ((_a = a.order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.order) !== null && _b !== void 0 ? _b : 0); });
                                    parentOperation = (_p = (_o = sortedParentOps[0]) === null || _o === void 0 ? void 0 : _o.id) !== null && _p !== void 0 ? _p : null;
                                }
                                if (parentOperation && (lastOperation === null || lastOperation === void 0 ? void 0 : lastOperation.id)) {
                                    deps = allDependencies.get(parentOperation);
                                    if (deps) {
                                        deps.add(lastOperation.id);
                                    }
                                }
                            }
                            methodDeps = (0, dependency_manager_ts_1.buildOperationDependencies)(methodOps);
                            for (_d = 0, methodDeps_1 = methodDeps; _d < methodDeps_1.length; _d++) {
                                _e = methodDeps_1[_d], opId = _e[0], deps = _e[1];
                                existing = allDependencies.get(opId);
                                if (existing) {
                                    for (_f = 0, deps_1 = deps; _f < deps_1.length; _f++) {
                                        depId = deps_1[_f];
                                        existing.add(depId);
                                    }
                                }
                            }
                        }
                        reworkOpIds = allOperations
                            .filter(function (op) { return op.reworkId; })
                            .map(function (op) { return op.id; });
                        deleteQuery = this.db
                            .deleteFrom("jobOperationDependency")
                            .where("jobId", "=", this.jobId);
                        if (reworkOpIds.length > 0) {
                            deleteQuery = deleteQuery
                                .where("operationId", "not in", reworkOpIds)
                                .where("dependsOnId", "not in", reworkOpIds);
                        }
                        return [4 /*yield*/, deleteQuery.execute()];
                    case 4:
                        _q.sent();
                        records = (0, dependency_manager_ts_1.dependenciesToRecords)(allDependencies, this.jobId, this.companyId);
                        if (!(records.length > 0)) return [3 /*break*/, 8];
                        _g = 0, records_1 = records;
                        _q.label = 5;
                    case 5:
                        if (!(_g < records_1.length)) return [3 /*break*/, 8];
                        record = records_1[_g];
                        return [4 /*yield*/, this.db
                                .insertInto("jobOperationDependency")
                                .values(record)
                                .execute()];
                    case 6:
                        _q.sent();
                        _q.label = 7;
                    case 7:
                        _g++;
                        return [3 /*break*/, 5];
                    case 8:
                        _h = 0, allDependencies_1 = allDependencies;
                        _q.label = 9;
                    case 9:
                        if (!(_h < allDependencies_1.length)) return [3 /*break*/, 12];
                        _j = allDependencies_1[_h], opId = _j[0], deps = _j[1];
                        if (!(deps.size === 0)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.db
                                .updateTable("jobOperation")
                                .set({ status: "Ready" })
                                .where("id", "=", opId)
                                .execute()];
                    case 10:
                        _q.sent();
                        _q.label = 11;
                    case 11:
                        _h++;
                        return [3 /*break*/, 9];
                    case 12:
                        // Store dependencies for date calculation (non-rework edges rebuilt above)
                        this.dependencies = records.map(function (r) { return ({
                            operationId: r.operationId,
                            dependsOnId: r.dependsOnId,
                            jobId: r.jobId,
                        }); });
                        if (!(reworkOpIds.length > 0)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.db
                                .selectFrom("jobOperationDependency")
                                .selectAll()
                                .where("jobId", "=", this.jobId)
                                .where(function (eb) {
                                return eb.or([
                                    eb("operationId", "in", reworkOpIds),
                                    eb("dependsOnId", "in", reworkOpIds),
                                ]);
                            })
                                .execute()];
                    case 13:
                        reworkDeps = _q.sent();
                        for (_k = 0, reworkDeps_1 = reworkDeps; _k < reworkDeps_1.length; _k++) {
                            d = reworkDeps_1[_k];
                            this.dependencies.push({
                                operationId: d.operationId,
                                dependsOnId: d.dependsOnId,
                                jobId: d.jobId,
                            });
                        }
                        _q.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Calculate dates for all operations
     */
    SchedulingEngine.prototype.calculateDates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var graph, anchorDate, _i, _a, op;
            var _b, _c;
            return __generator(this, function (_d) {
                graph = new dependency_manager_ts_1.DependencyGraphImpl(this.operations, this.dependencies);
                anchorDate = this.direction === "backward" ? (_c = (_b = this.job) === null || _b === void 0 ? void 0 : _b.dueDate) !== null && _c !== void 0 ? _c : null : null;
                // Calculate dates
                this.scheduledOperations = (0, date_calculator_ts_1.calculateOperationDates)(this.operations, graph, anchorDate, this.direction);
                // Count conflicts
                this.conflictsDetected = 0;
                for (_i = 0, _a = this.scheduledOperations.values(); _i < _a.length; _i++) {
                    op = _a[_i];
                    if (op.hasConflict) {
                        this.conflictsDetected++;
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Select work centers for all operations
     */
    SchedulingEngine.prototype.selectWorkCenters = function () {
        return __awaiter(this, void 0, void 0, function () {
            var operations, selections, _i, _a, selection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.workCenterSelector) {
                            console.warn("Work center selector not initialized");
                            return [2 /*return*/];
                        }
                        operations = Array.from(this.scheduledOperations.values());
                        return [4 /*yield*/, this.workCenterSelector.selectWorkCentersForOperations(operations)];
                    case 1:
                        selections = _b.sent();
                        // Apply selections
                        this.scheduledOperations = (0, work_center_selector_ts_1.applyWorkCenterSelections)(this.scheduledOperations, selections);
                        // Track affected work centers
                        for (_i = 0, _a = selections.values(); _i < _a.length; _i++) {
                            selection = _a[_i];
                            if (selection.workCenterId) {
                                this.affectedWorkCenters.add(selection.workCenterId);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Calculate priorities for all operations grouped by work center
     */
    SchedulingEngine.prototype.calculatePriorities = function () {
        return __awaiter(this, void 0, void 0, function () {
            var workCenterIds, opsWithInfo, _i, _a, op, priorities_1, allWcOps, dbOpIds, mergedOps, _b, _c, op, priorities;
            var _this = this;
            var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        workCenterIds = Array.from(this.affectedWorkCenters);
                        if (workCenterIds.length === 0) {
                            opsWithInfo = [];
                            for (_i = 0, _a = this.scheduledOperations.values(); _i < _a.length; _i++) {
                                op = _a[_i];
                                opsWithInfo.push((0, priority_calculator_ts_1.toOperationWithJobInfo)(op, (_e = (_d = this.job) === null || _d === void 0 ? void 0 : _d.priority) !== null && _e !== void 0 ? _e : null, (_g = (_f = this.job) === null || _f === void 0 ? void 0 : _f.deadlineType) !== null && _g !== void 0 ? _g : null));
                            }
                            priorities_1 = (0, priority_calculator_ts_1.calculatePrioritiesByWorkCenter)(opsWithInfo);
                            this.scheduledOperations = (0, priority_calculator_ts_1.applyPriorities)(this.scheduledOperations, priorities_1);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.db
                                .selectFrom("jobOperation as jo")
                                .innerJoin("job as j", "j.id", "jo.jobId")
                                .select([
                                "jo.id",
                                "jo.dueDate",
                                "jo.startDate",
                                "jo.priority",
                                "j.deadlineType",
                                "j.priority as jobPriority",
                                "jo.workCenterId",
                            ])
                                .where("jo.workCenterId", "in", workCenterIds)
                                .where("jo.status", "not in", ["Done", "Canceled"])
                                .execute()];
                    case 1:
                        allWcOps = _q.sent();
                        dbOpIds = new Set(allWcOps.map(function (op) { return op.id; }).filter(Boolean));
                        mergedOps = allWcOps
                            .filter(function (wcOp) { return wcOp.id; })
                            .map(function (wcOp) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                            var scheduled = _this.scheduledOperations.get(wcOp.id);
                            if (scheduled) {
                                // This is an operation from current job that was already in DB
                                // (reschedule case) - use the newly calculated dates
                                return {
                                    id: scheduled.id,
                                    dueDate: (_a = scheduled.dueDate) !== null && _a !== void 0 ? _a : null,
                                    startDate: (_b = scheduled.startDate) !== null && _b !== void 0 ? _b : null,
                                    priority: scheduled.priority,
                                    deadlineType: (_c = wcOp.deadlineType) !== null && _c !== void 0 ? _c : "No Deadline",
                                    jobPriority: (_d = wcOp.jobPriority) !== null && _d !== void 0 ? _d : 99,
                                    workCenterId: (_e = scheduled.workCenterId) !== null && _e !== void 0 ? _e : null,
                                };
                            }
                            // Operation from another job - use DB data
                            return {
                                id: wcOp.id,
                                dueDate: (_f = wcOp.dueDate) !== null && _f !== void 0 ? _f : null,
                                startDate: (_g = wcOp.startDate) !== null && _g !== void 0 ? _g : null,
                                priority: (_h = wcOp.priority) !== null && _h !== void 0 ? _h : 1,
                                deadlineType: (_j = wcOp.deadlineType) !== null && _j !== void 0 ? _j : "No Deadline",
                                jobPriority: (_k = wcOp.jobPriority) !== null && _k !== void 0 ? _k : 99,
                                workCenterId: (_l = wcOp.workCenterId) !== null && _l !== void 0 ? _l : null,
                            };
                        });
                        // Add current job's scheduled operations that aren't in DB yet
                        // (their workCenterId was just assigned in memory)
                        for (_b = 0, _c = this.scheduledOperations.values(); _b < _c.length; _b++) {
                            op = _c[_b];
                            if (!dbOpIds.has(op.id) && op.workCenterId) {
                                mergedOps.push({
                                    id: op.id,
                                    dueDate: (_h = op.dueDate) !== null && _h !== void 0 ? _h : null,
                                    startDate: (_j = op.startDate) !== null && _j !== void 0 ? _j : null,
                                    priority: op.priority,
                                    deadlineType: (_m = (_k = op.deadlineType) !== null && _k !== void 0 ? _k : (_l = this.job) === null || _l === void 0 ? void 0 : _l.deadlineType) !== null && _m !== void 0 ? _m : "No Deadline",
                                    jobPriority: (_p = (_o = this.job) === null || _o === void 0 ? void 0 : _o.priority) !== null && _p !== void 0 ? _p : 99,
                                    workCenterId: op.workCenterId,
                                });
                            }
                        }
                        priorities = (0, priority_calculator_ts_1.calculatePrioritiesByWorkCenter)(mergedOps);
                        // Apply to our scheduled operations
                        this.scheduledOperations = (0, priority_calculator_ts_1.applyPriorities)(this.scheduledOperations, priorities);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Assign unlinked materials to the first operation of their make method
     */
    SchedulingEngine.prototype.assignMaterials = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allOperations, assemblyTree, makeMethodIds, materials, operationsByMethod, _i, allOperations_3, op, _a, materials_1, material, methodOps, sortedOps, firstOp;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.db
                            .selectFrom("jobOperation")
                            .selectAll()
                            .where("jobId", "=", this.jobId)
                            .orderBy("order")
                            .execute()];
                    case 1:
                        allOperations = (_c.sent());
                        return [4 /*yield*/, this.assemblyHandler.buildAssemblyTree(this.jobId)];
                    case 2:
                        assemblyTree = _c.sent();
                        if (!assemblyTree) {
                            return [2 /*return*/];
                        }
                        makeMethodIds = this.assemblyHandler.getAllJobMakeMethodIds(assemblyTree);
                        return [4 /*yield*/, this.db
                                .selectFrom("jobMaterial")
                                .select(["id", "jobMakeMethodId"])
                                .where("jobMakeMethodId", "in", makeMethodIds)
                                .where("methodType", "=", "Make to Order")
                                .where("jobOperationId", "is", null)
                                .execute()];
                    case 3:
                        materials = _c.sent();
                        operationsByMethod = new Map();
                        for (_i = 0, allOperations_3 = allOperations; _i < allOperations_3.length; _i++) {
                            op = allOperations_3[_i];
                            if (op.jobMakeMethodId && !op.reworkId) {
                                if (!operationsByMethod.has(op.jobMakeMethodId)) {
                                    operationsByMethod.set(op.jobMakeMethodId, []);
                                }
                                operationsByMethod.get(op.jobMakeMethodId).push(op);
                            }
                        }
                        _a = 0, materials_1 = materials;
                        _c.label = 4;
                    case 4:
                        if (!(_a < materials_1.length)) return [3 /*break*/, 7];
                        material = materials_1[_a];
                        if (!material.jobMakeMethodId)
                            return [3 /*break*/, 6];
                        methodOps = (_b = operationsByMethod.get(material.jobMakeMethodId)) !== null && _b !== void 0 ? _b : [];
                        sortedOps = __spreadArray([], methodOps, true).sort(function (a, b) { var _a, _b; return ((_a = a.order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.order) !== null && _b !== void 0 ? _b : 0); });
                        firstOp = sortedOps[0];
                        if (!(firstOp === null || firstOp === void 0 ? void 0 : firstOp.id)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.db
                                .updateTable("jobMaterial")
                                .set({ jobOperationId: firstOp.id })
                                .where("id", "=", material.id)
                                .execute()];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        _a++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Persist all changes to the database
     */
    SchedulingEngine.prototype.persistChanges = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, _i, _a, op;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _loop_1 = function (op) {
                            var originalOp, isManuallyScheduled;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        originalOp = this_1.operations.find(function (o) { return o.id === op.id; });
                                        isManuallyScheduled = (_b = originalOp === null || originalOp === void 0 ? void 0 : originalOp.manuallyScheduled) !== null && _b !== void 0 ? _b : false;
                                        if (!isManuallyScheduled) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this_1.db
                                                .updateTable("jobOperation")
                                                .set({
                                                startDate: op.startDate,
                                                priority: (_c = op.priority) !== null && _c !== void 0 ? _c : undefined,
                                                workCenterId: op.workCenterId,
                                                hasConflict: op.hasConflict,
                                                conflictReason: op.conflictReason,
                                                updatedAt: new Date().toISOString(),
                                                updatedBy: this_1.userId,
                                            })
                                                .where("id", "=", op.id)
                                                .execute()];
                                    case 1:
                                        _f.sent();
                                        return [3 /*break*/, 4];
                                    case 2: return [4 /*yield*/, this_1.db
                                            .updateTable("jobOperation")
                                            .set({
                                            startDate: op.startDate,
                                            dueDate: op.dueDate,
                                            priority: (_d = op.priority) !== null && _d !== void 0 ? _d : undefined,
                                            workCenterId: op.workCenterId,
                                            hasConflict: op.hasConflict,
                                            conflictReason: op.conflictReason,
                                            updatedAt: new Date().toISOString(),
                                            updatedBy: this_1.userId,
                                        })
                                            .where("id", "=", op.id)
                                            .execute()];
                                    case 3:
                                        _f.sent();
                                        _f.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = this.scheduledOperations.values();
                        _e.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        op = _a[_i];
                        return [5 /*yield**/, _loop_1(op)];
                    case 2:
                        _e.sent();
                        _e.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (!(this.mode === "initial")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.db
                                .updateTable("job")
                                .set({ status: "Ready" })
                                .where("id", "=", this.jobId)
                                .execute()];
                    case 5:
                        _e.sent();
                        _e.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the scheduling result
     */
    SchedulingEngine.prototype.getResult = function () {
        return {
            success: true,
            operationsScheduled: this.scheduledOperations.size,
            conflictsDetected: this.conflictsDetected,
            workCentersAffected: Array.from(this.affectedWorkCenters),
            assemblyDepth: this.assemblyDepth,
        };
    };
    /**
     * Run the full scheduling process
     */
    SchedulingEngine.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        // Assign materials BEFORE creating dependencies
                        // Dependencies require jobMaterial.jobOperationId to be set
                        // to link subassembly operations to parent operations
                        return [4 /*yield*/, this.assignMaterials()];
                    case 2:
                        // Assign materials BEFORE creating dependencies
                        // Dependencies require jobMaterial.jobOperationId to be set
                        // to link subassembly operations to parent operations
                        _a.sent();
                        return [4 /*yield*/, this.createDependencies()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.calculateDates()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.selectWorkCenters()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.calculatePriorities()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.persistChanges()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, this.getResult()];
                }
            });
        });
    };
    return SchedulingEngine;
}());
exports.SchedulingEngine = SchedulingEngine;
