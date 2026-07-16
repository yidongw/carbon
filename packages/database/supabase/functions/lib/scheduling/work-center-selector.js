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
exports.WorkCenterSelector = void 0;
exports.applyWorkCenterSelections = applyWorkCenterSelections;
var duration_calculator_ts_1 = require("./duration-calculator.ts");
/**
 * Work Center Selector
 * Handles work center selection based on load balancing
 */
var WorkCenterSelector = /** @class */ (function () {
    function WorkCenterSelector(db, companyId, locationId) {
        this.workCentersByProcess = new Map();
        this.activeWorkCenters = new Set();
        // Track in-memory load from operations assigned in current scheduling run
        this.inMemoryLoadByWorkCenter = new Map();
        this.db = db;
        this.companyId = companyId;
        this.locationId = locationId;
    }
    /**
     * Add load for an operation assigned in memory (not yet persisted)
     */
    WorkCenterSelector.prototype.addInMemoryLoad = function (workCenterId, hours) {
        var _a;
        var currentLoad = (_a = this.inMemoryLoadByWorkCenter.get(workCenterId)) !== null && _a !== void 0 ? _a : 0;
        this.inMemoryLoadByWorkCenter.set(workCenterId, currentLoad + hours);
    };
    /**
     * Get total in-memory load for a work center
     */
    WorkCenterSelector.prototype.getInMemoryLoad = function (workCenterId) {
        var _a;
        return (_a = this.inMemoryLoadByWorkCenter.get(workCenterId)) !== null && _a !== void 0 ? _a : 0;
    };
    /**
     * Reset in-memory load tracking (call before a new scheduling run)
     */
    WorkCenterSelector.prototype.resetInMemoryLoad = function () {
        this.inMemoryLoadByWorkCenter.clear();
    };
    /**
     * Initialize work center data
     */
    WorkCenterSelector.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var processes, workCenters, _i, workCenters_1, wc, _a, processes_1, process, validWorkCenters;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.db
                            .selectFrom("processes")
                            .select(["id", "workCenters"])
                            .where("companyId", "=", this.companyId)
                            .execute()];
                    case 1:
                        processes = _b.sent();
                        return [4 /*yield*/, this.db
                                .selectFrom("workCenter")
                                .select(["id", "locationId"])
                                .where("locationId", "=", this.locationId)
                                .where("companyId", "=", this.companyId)
                                .where("active", "=", true)
                                .execute()];
                    case 2:
                        workCenters = _b.sent();
                        // Build set of active work center IDs
                        for (_i = 0, workCenters_1 = workCenters; _i < workCenters_1.length; _i++) {
                            wc = workCenters_1[_i];
                            if (wc.id) {
                                this.activeWorkCenters.add(wc.id);
                            }
                        }
                        // Build process to work centers map (only include active work centers at this location)
                        for (_a = 0, processes_1 = processes; _a < processes_1.length; _a++) {
                            process = processes_1[_a];
                            if (process.workCenters && process.id) {
                                validWorkCenters = process.workCenters.filter(function (wcId) {
                                    return _this.activeWorkCenters.has(wcId);
                                });
                                this.workCentersByProcess.set(process.id, validWorkCenters);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get work centers that support a given process
     */
    WorkCenterSelector.prototype.getWorkCentersForProcess = function (processId) {
        var _a;
        return (_a = this.workCentersByProcess.get(processId)) !== null && _a !== void 0 ? _a : [];
    };
    /**
     * Check if a work center is valid (exists and is active at this location)
     */
    WorkCenterSelector.prototype.isValidWorkCenter = function (workCenterId) {
        return this.activeWorkCenters.has(workCenterId);
    };
    /**
     * Calculate total load (in hours) on a work center up to a given date
     */
    WorkCenterSelector.prototype.calculateLoadBeforeDate = function (workCenterId, beforeDate) {
        return __awaiter(this, void 0, void 0, function () {
            var operations, totalHours, _i, operations_1, op;
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, this.db
                            .selectFrom("jobOperation")
                            .select([
                            "setupTime",
                            "setupUnit",
                            "laborTime",
                            "laborUnit",
                            "machineTime",
                            "machineUnit",
                            "operationQuantity",
                        ])
                            .where("workCenterId", "=", workCenterId)
                            .where("companyId", "=", this.companyId)
                            .where("status", "not in", ["Done", "Canceled"])
                            .where(function (eb) {
                            return eb.or([
                                eb("startDate", "<=", beforeDate),
                                eb("startDate", "is", null),
                            ]);
                        })
                            .execute()];
                    case 1:
                        operations = _h.sent();
                        totalHours = 0;
                        for (_i = 0, operations_1 = operations; _i < operations_1.length; _i++) {
                            op = operations_1[_i];
                            totalHours += (0, duration_calculator_ts_1.calculateDurationHours)({
                                jobId: "", // Not needed for duration calculation
                                processId: null,
                                setupTime: (_a = op.setupTime) !== null && _a !== void 0 ? _a : undefined,
                                setupUnit: (_b = op.setupUnit) !== null && _b !== void 0 ? _b : undefined,
                                laborTime: (_c = op.laborTime) !== null && _c !== void 0 ? _c : undefined,
                                laborUnit: (_d = op.laborUnit) !== null && _d !== void 0 ? _d : undefined,
                                machineTime: (_e = op.machineTime) !== null && _e !== void 0 ? _e : undefined,
                                machineUnit: (_f = op.machineUnit) !== null && _f !== void 0 ? _f : undefined,
                                operationQuantity: (_g = op.operationQuantity) !== null && _g !== void 0 ? _g : undefined,
                            });
                        }
                        return [2 /*return*/, totalHours];
                }
            });
        });
    };
    /**
     * Get load information for all work centers supporting a process
     */
    WorkCenterSelector.prototype.getLoadForProcessWorkCenters = function (processId, beforeDate) {
        return __awaiter(this, void 0, void 0, function () {
            var workCenters, loads, _i, workCenters_2, wcId, totalHours, count;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        workCenters = this.getWorkCentersForProcess(processId);
                        loads = [];
                        _i = 0, workCenters_2 = workCenters;
                        _b.label = 1;
                    case 1:
                        if (!(_i < workCenters_2.length)) return [3 /*break*/, 5];
                        wcId = workCenters_2[_i];
                        return [4 /*yield*/, this.calculateLoadBeforeDate(wcId, beforeDate)];
                    case 2:
                        totalHours = _b.sent();
                        return [4 /*yield*/, this.db
                                .selectFrom("jobOperation")
                                .select(function (eb) { return eb.fn.count("id").as("count"); })
                                .where("workCenterId", "=", wcId)
                                .where("companyId", "=", this.companyId)
                                .where("status", "not in", ["Done", "Canceled"])
                                .where(function (eb) {
                                return eb.or([
                                    eb("startDate", "<=", beforeDate),
                                    eb("startDate", "is", null),
                                ]);
                            })
                                .executeTakeFirst()];
                    case 3:
                        count = _b.sent();
                        loads.push({
                            workCenterId: wcId,
                            totalHours: totalHours,
                            operationCount: (_a = count === null || count === void 0 ? void 0 : count.count) !== null && _a !== void 0 ? _a : 0,
                        });
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, loads];
                }
            });
        });
    };
    /**
     * Select the optimal work center for an operation based on load balancing
     * Selects the work center with the least load before the operation's start date
     * Includes both database load and in-memory load from current scheduling run
     */
    WorkCenterSelector.prototype.selectWorkCenter = function (processId, scheduledStartDate) {
        return __awaiter(this, void 0, void 0, function () {
            var workCenters, beforeDate, selectedWorkCenter, lowestLoad, _i, workCenters_3, wcId, dbLoad, inMemoryLoad, totalLoad;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!processId) {
                            return [2 /*return*/, {
                                    workCenterId: null,
                                    priority: 0,
                                    error: "No process ID provided",
                                }];
                        }
                        workCenters = this.getWorkCentersForProcess(processId);
                        if (workCenters.length === 0) {
                            return [2 /*return*/, {
                                    workCenterId: null,
                                    priority: 0,
                                    error: "No work centers found for process ".concat(processId),
                                }];
                        }
                        beforeDate = scheduledStartDate || new Date().toISOString().split("T")[0];
                        selectedWorkCenter = null;
                        lowestLoad = Infinity;
                        _i = 0, workCenters_3 = workCenters;
                        _a.label = 1;
                    case 1:
                        if (!(_i < workCenters_3.length)) return [3 /*break*/, 4];
                        wcId = workCenters_3[_i];
                        return [4 /*yield*/, this.calculateLoadBeforeDate(wcId, beforeDate)];
                    case 2:
                        dbLoad = _a.sent();
                        inMemoryLoad = this.getInMemoryLoad(wcId);
                        totalLoad = dbLoad + inMemoryLoad;
                        if (totalLoad < lowestLoad) {
                            lowestLoad = totalLoad;
                            selectedWorkCenter = wcId;
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (!selectedWorkCenter) {
                            return [2 /*return*/, {
                                    workCenterId: null,
                                    priority: 0,
                                    error: "No work center selected after evaluation",
                                }];
                        }
                        return [2 /*return*/, {
                                workCenterId: selectedWorkCenter,
                                priority: 0, // Priority will be calculated separately
                                load: lowestLoad,
                            }];
                }
            });
        });
    };
    /**
     * Select work centers for multiple operations
     * Re-evaluates all work center assignments based on scheduled dates
     * Tracks in-memory load to ensure proper load balancing within same scheduling run
     */
    WorkCenterSelector.prototype.selectWorkCentersForOperations = function (operations) {
        return __awaiter(this, void 0, void 0, function () {
            var selections, sorted, _i, sorted_1, op, selection, opDuration;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        selections = new Map();
                        // Reset in-memory load tracking for this scheduling run
                        this.resetInMemoryLoad();
                        sorted = __spreadArray([], operations, true).sort(function (a, b) {
                            if (!a.startDate && !b.startDate)
                                return 0;
                            if (!a.startDate)
                                return 1;
                            if (!b.startDate)
                                return -1;
                            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                        });
                        _i = 0, sorted_1 = sorted;
                        _b.label = 1;
                    case 1:
                        if (!(_i < sorted_1.length)) return [3 /*break*/, 4];
                        op = sorted_1[_i];
                        // Skip outside operations (they don't need work center assignment)
                        if (op.operationType === "Outside") {
                            return [3 /*break*/, 3];
                        }
                        return [4 /*yield*/, this.selectWorkCenter(op.processId, op.startDate)];
                    case 2:
                        selection = _b.sent();
                        selections.set(op.id, selection);
                        // Track this operation's load in memory for subsequent selections
                        if (selection.workCenterId) {
                            opDuration = (_a = op.durationHours) !== null && _a !== void 0 ? _a : (0, duration_calculator_ts_1.calculateDurationHours)(op);
                            this.addInMemoryLoad(selection.workCenterId, opDuration);
                        }
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, selections];
                }
            });
        });
    };
    return WorkCenterSelector;
}());
exports.WorkCenterSelector = WorkCenterSelector;
/**
 * Apply work center selections to scheduled operations
 */
function applyWorkCenterSelections(operations, selections) {
    var result = new Map();
    for (var _i = 0, operations_2 = operations; _i < operations_2.length; _i++) {
        var _a = operations_2[_i], opId = _a[0], op = _a[1];
        var selection = selections.get(opId);
        if (selection === null || selection === void 0 ? void 0 : selection.workCenterId) {
            result.set(opId, __assign(__assign({}, op), { workCenterId: selection.workCenterId }));
        }
        else {
            result.set(opId, op);
        }
    }
    return result;
}
