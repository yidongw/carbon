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
exports.ResourceManager = void 0;
var ResourceManager = /** @class */ (function () {
    function ResourceManager(db, companyId) {
        this.db = db;
        this.companyId = companyId;
        this.job = null;
        this.activeJobs = [];
        this.operationsByWorkCenter = new Map();
        this.workCentersByProcess = new Map();
        this.durationsByWorkCenter = new Map();
    }
    ResourceManager.prototype.initialize = function (jobId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, job, jobs, _b, processes, workCenters, operations;
            var _this = this;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!this.db) {
                            throw new Error("Database connection is not initialized");
                        }
                        return [4 /*yield*/, Promise.all([
                                this.db
                                    .selectFrom("job")
                                    .select(["id", "dueDate", "deadlineType", "locationId"])
                                    .where("id", "=", jobId)
                                    .executeTakeFirst(),
                                this.db
                                    .selectFrom("job")
                                    .select(["id", "dueDate", "deadlineType", "locationId"])
                                    .where("companyId", "=", this.companyId)
                                    .where("status", "in", ["Ready", "In Progress", "Paused"])
                                    .where("id", "!=", jobId)
                                    .execute(),
                            ])];
                    case 1:
                        _a = _e.sent(), job = _a[0], jobs = _a[1];
                        if (job) {
                            this.job = job;
                        }
                        // ignore jobs that aren't at the same location
                        this.activeJobs = jobs === null || jobs === void 0 ? void 0 : jobs.reduce(function (acc, j) {
                            var _a;
                            if (j.id && j.locationId === ((_a = _this.job) === null || _a === void 0 ? void 0 : _a.locationId)) {
                                acc.push(j.id);
                            }
                            return acc;
                        }, []);
                        return [4 /*yield*/, Promise.all([
                                this.db
                                    .selectFrom("processes")
                                    .select(["id", "workCenters"])
                                    .where("companyId", "=", this.companyId)
                                    .execute(),
                                this.db
                                    .selectFrom("workCenter")
                                    .select(["id", "locationId"])
                                    .where("locationId", "=", (_c = this.job) === null || _c === void 0 ? void 0 : _c.locationId)
                                    .where("companyId", "=", this.companyId)
                                    .where("active", "=", true)
                                    .execute(),
                            ])];
                    case 2:
                        _b = _e.sent(), processes = _b[0], workCenters = _b[1];
                        operations = [];
                        if (!(this.activeJobs.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.db
                                .selectFrom("jobOperation")
                                .innerJoin("job", "jobOperation.jobId", "job.id")
                                .select([
                                "jobOperation.id",
                                "jobOperation.jobId",
                                "jobOperation.processId",
                                "jobOperation.workCenterId",
                                "jobOperation.status",
                                "jobOperation.laborTime",
                                "jobOperation.laborUnit",
                                "jobOperation.machineTime",
                                "jobOperation.machineUnit",
                                "jobOperation.setupTime",
                                "jobOperation.setupUnit",
                                "jobOperation.operationQuantity",
                                "jobOperation.priority",
                                "job.dueDate",
                                "job.deadlineType",
                            ])
                                .where("jobOperation.jobId", "in", this.activeJobs)
                                .where("job.companyId", "=", this.companyId)
                                .execute()];
                    case 3:
                        operations = _e.sent();
                        _e.label = 4;
                    case 4:
                        this.operationsByWorkCenter = new Map();
                        (_d = operations === null || operations === void 0 ? void 0 : operations.map(function (op) { return getDurations(op); })) === null || _d === void 0 ? void 0 : _d.forEach(function (operation) {
                            var _a, _b, _c, _d;
                            if (!_this.operationsByWorkCenter.has((_a = operation.workCenterId) !== null && _a !== void 0 ? _a : null)) {
                                _this.operationsByWorkCenter.set((_b = operation.workCenterId) !== null && _b !== void 0 ? _b : null, []);
                            }
                            (_d = _this.operationsByWorkCenter
                                .get((_c = operation.workCenterId) !== null && _c !== void 0 ? _c : null)) === null || _d === void 0 ? void 0 : _d.push(operation);
                        });
                        // Sort each array in operationsByWorkCenter by priority
                        this.operationsByWorkCenter.forEach(function (operations, workCenterId) {
                            _this.operationsByWorkCenter.set(workCenterId, operations.sort(function (a, b) { var _a, _b; return Number((_a = a.priority) !== null && _a !== void 0 ? _a : 0) - Number((_b = b.priority) !== null && _b !== void 0 ? _b : 0); }));
                        });
                        // Initialize workCentersByProcess map
                        this.workCentersByProcess = new Map();
                        // Populate workCentersByProcess map
                        processes === null || processes === void 0 ? void 0 : processes.forEach(function (process) {
                            if (process.workCenters) {
                                // only consider work centers at this location
                                var workCenterIds = process.workCenters.filter(function (wcId) {
                                    return workCenters === null || workCenters === void 0 ? void 0 : workCenters.some(function (w) { return w.id === wcId; });
                                });
                                _this.workCentersByProcess.set(process.id, workCenterIds);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ResourceManager.prototype.getJob = function () {
        return this.job;
    };
    ResourceManager.prototype.getPriorityByWorkCenterId = function (workCenterId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        var deadlineType = (_b = (_a = this.job) === null || _a === void 0 ? void 0 : _a.deadlineType) !== null && _b !== void 0 ? _b : "No Deadline";
        var dueDate = (_d = (_c = this.job) === null || _c === void 0 ? void 0 : _c.dueDate) !== null && _d !== void 0 ? _d : "";
        var operations = this.operationsByWorkCenter.get(workCenterId) || [];
        var priorityBefore = 0;
        var priorityAfter;
        if (operations.length === 0) {
            // If there are no operations, set priorityBefore to 0 and priorityAfter to undefined
            return { workCenter: workCenterId, priority: 1 };
        }
        // Iterate backwards over the operations until we find the first operation that matches the deadline type
        for (var i = operations.length - 1; i >= 0; i--) {
            var currentOp = operations[i];
            if (deadlineType === "ASAP") {
                if (currentOp.deadlineType === "ASAP") {
                    priorityBefore = Number((_e = currentOp.priority) !== null && _e !== void 0 ? _e : 0);
                    priorityAfter = Number((_g = (_f = operations[i + 1]) === null || _f === void 0 ? void 0 : _f.priority) !== null && _g !== void 0 ? _g : priorityBefore + 1);
                    return {
                        workCenter: workCenterId,
                        priority: Number(priorityBefore + priorityAfter) / 2,
                    };
                }
            }
            else if (deadlineType === "Hard Deadline") {
                if (currentOp.deadlineType === "ASAP" ||
                    (currentOp.deadlineType === "Hard Deadline" &&
                        currentOp.dueDate &&
                        currentOp.dueDate <= dueDate) ||
                    (currentOp.deadlineType === "Soft Deadline" &&
                        currentOp.dueDate &&
                        currentOp.dueDate < dueDate)) {
                    priorityBefore = Number((_h = currentOp.priority) !== null && _h !== void 0 ? _h : 0);
                    priorityAfter = Number((_k = (_j = operations[i + 1]) === null || _j === void 0 ? void 0 : _j.priority) !== null && _k !== void 0 ? _k : priorityBefore + 1);
                    return {
                        workCenter: workCenterId,
                        priority: Number(priorityBefore + priorityAfter) / 2,
                    };
                }
            }
            else if (deadlineType === "Soft Deadline") {
                if (currentOp.deadlineType === "ASAP" ||
                    (currentOp.deadlineType === "Hard Deadline" &&
                        currentOp.dueDate &&
                        currentOp.dueDate <= dueDate) ||
                    (currentOp.deadlineType === "Soft Deadline" &&
                        currentOp.dueDate &&
                        currentOp.dueDate <= dueDate)) {
                    priorityBefore = Number((_l = currentOp.priority) !== null && _l !== void 0 ? _l : 0);
                    priorityAfter = Number((_o = (_m = operations[i + 1]) === null || _m === void 0 ? void 0 : _m.priority) !== null && _o !== void 0 ? _o : priorityBefore + 1);
                    return {
                        workCenter: workCenterId,
                        priority: Number(priorityBefore + priorityAfter) / 2,
                    };
                }
            }
            else if (deadlineType === "No Deadline") {
                return {
                    workCenter: workCenterId,
                    priority: Number((_q = (_p = operations[operations.length - 1]) === null || _p === void 0 ? void 0 : _p.priority) !== null && _q !== void 0 ? _q : 0) + 1,
                };
            }
        }
        if (priorityBefore === 0 &&
            priorityAfter === undefined &&
            deadlineType !== "ASAP") {
            console.error("No priority found for work center", workCenterId);
            return {
                workCenter: workCenterId,
                priority: Number((_s = (_r = operations[operations.length - 1]) === null || _r === void 0 ? void 0 : _r.priority) !== null && _s !== void 0 ? _s : 0) + 1,
            };
        }
        return {
            workCenter: workCenterId,
            priority: 0,
        };
    };
    ResourceManager.prototype.getDurationByWorkCenterIdAndPriority = function (workCenterId, priority) {
        var operations = this.operationsByWorkCenter.get(workCenterId) || [];
        var duration = 0;
        operations.forEach(function (operation) {
            if (operation.priority && operation.priority < priority) {
                duration += operation.duration;
            }
            else {
                return duration;
            }
        });
        return duration;
    };
    ResourceManager.prototype.getWorkCenterAndPriorityByProcessId = function (processId) {
        var _a, _b;
        var workCenters = (_a = this.workCentersByProcess.get(processId)) !== null && _a !== void 0 ? _a : [];
        if (workCenters.length === 0) {
            console.error("No work centers found for process", processId);
            return {
                workCenter: null,
                priority: 0,
            };
        }
        var selectedWorkCenter = null;
        var lowestDuration = Infinity;
        var selectedPriority = 0;
        // Find work center with lowest total duration including current durations
        for (var _i = 0, workCenters_1 = workCenters; _i < workCenters_1.length; _i++) {
            var workCenter = workCenters_1[_i];
            var priority = this.getPriorityByWorkCenterId(workCenter).priority;
            var currentDuration = (_b = this.durationsByWorkCenter.get(workCenter)) !== null && _b !== void 0 ? _b : 0;
            var queuedDuration = this.getDurationByWorkCenterIdAndPriority(workCenter, priority);
            var totalDuration = currentDuration + queuedDuration;
            if (totalDuration < lowestDuration) {
                lowestDuration = totalDuration;
                selectedWorkCenter = workCenter;
                selectedPriority = priority;
            }
        }
        if (!selectedWorkCenter) {
            console.error("No work center selected after evaluation");
            return {
                workCenter: null,
                priority: 0,
            };
        }
        return {
            workCenter: selectedWorkCenter,
            priority: selectedPriority,
        };
    };
    ResourceManager.prototype.hasWorkCenter = function (workCenterId) {
        return this.operationsByWorkCenter.has(workCenterId);
    };
    ResourceManager.prototype.addOperationToWorkCenter = function (workCenterId, operation) {
        var _a, _b, _c, _d, _e;
        if (!this.operationsByWorkCenter.has(workCenterId)) {
            this.operationsByWorkCenter.set(workCenterId, []);
        }
        var operationWithDurations = getDurations(__assign(__assign({}, operation), { deadlineType: (_b = (_a = this.job) === null || _a === void 0 ? void 0 : _a.deadlineType) !== null && _b !== void 0 ? _b : "No Deadline", dueDate: (_d = (_c = this.job) === null || _c === void 0 ? void 0 : _c.dueDate) !== null && _d !== void 0 ? _d : "" }));
        var operations = this.operationsByWorkCenter.get(workCenterId);
        if (operations) {
            operations.push(operationWithDurations);
            operations.sort(function (a, b) { var _a, _b; return Number((_a = a.priority) !== null && _a !== void 0 ? _a : 0) - Number((_b = b.priority) !== null && _b !== void 0 ? _b : 0); });
            this.operationsByWorkCenter.set(workCenterId, operations);
        }
        // Update the duration for the work center
        var currentDuration = (_e = this.durationsByWorkCenter.get(workCenterId)) !== null && _e !== void 0 ? _e : 0;
        var newDuration = currentDuration + operationWithDurations.duration;
        this.durationsByWorkCenter.set(workCenterId, newDuration);
    };
    return ResourceManager;
}());
exports.ResourceManager = ResourceManager;
function getDurations(operation) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20;
    var setupDuration = 0;
    var laborDuration = 0;
    var machineDuration = 0;
    if (!operation.operationQuantity) {
        return __assign(__assign({}, operation), { setupTime: (_a = operation.setupTime) !== null && _a !== void 0 ? _a : 0, laborTime: (_c = (_b = operation.laborTime) !== null && _b !== void 0 ? _b : 0) !== null && _c !== void 0 ? _c : 0, machineTime: (_d = operation.machineTime) !== null && _d !== void 0 ? _d : 0, operationQuantity: 0, duration: 0, setupDuration: 0, laborDuration: 0, machineDuration: 0 });
    }
    // Calculate setup duration
    switch (operation.setupUnit) {
        case "Total Hours":
            setupDuration = ((_e = operation.setupTime) !== null && _e !== void 0 ? _e : 0) * 3600000; // Convert hours to milliseconds
            break;
        case "Total Minutes":
            setupDuration = ((_f = operation.setupTime) !== null && _f !== void 0 ? _f : 0) * 60000; // Convert minutes to milliseconds
            break;
        case "Hours/Piece":
            setupDuration =
                ((_g = operation.setupTime) !== null && _g !== void 0 ? _g : 0) * operation.operationQuantity * 3600000;
            break;
        case "Hours/100 Pieces":
            setupDuration =
                (((_h = operation.setupTime) !== null && _h !== void 0 ? _h : 0) / 100) *
                    operation.operationQuantity *
                    3600000;
            break;
        case "Hours/1000 Pieces":
            setupDuration =
                (((_j = operation.setupTime) !== null && _j !== void 0 ? _j : 0) / 1000) *
                    operation.operationQuantity *
                    3600000;
            break;
        case "Minutes/Piece":
            setupDuration =
                ((_k = operation.setupTime) !== null && _k !== void 0 ? _k : 0) * operation.operationQuantity * 60000;
            break;
        case "Minutes/100 Pieces":
            setupDuration =
                (((_l = operation.setupTime) !== null && _l !== void 0 ? _l : 0) / 100) *
                    operation.operationQuantity *
                    60000;
            break;
        case "Minutes/1000 Pieces":
            setupDuration =
                (((_m = operation.setupTime) !== null && _m !== void 0 ? _m : 0) / 1000) *
                    operation.operationQuantity *
                    60000;
            break;
        case "Pieces/Hour":
            setupDuration =
                (operation.operationQuantity / ((_o = operation.setupTime) !== null && _o !== void 0 ? _o : 0)) * 3600000;
            break;
        case "Pieces/Minute":
            setupDuration =
                (operation.operationQuantity / ((_p = operation.setupTime) !== null && _p !== void 0 ? _p : 0)) * 60000;
            break;
        case "Seconds/Piece":
            setupDuration =
                ((_q = operation.setupTime) !== null && _q !== void 0 ? _q : 0) * operation.operationQuantity * 1000;
            break;
    }
    // Calculate labor duration
    switch (operation.laborUnit) {
        case "Hours/Piece":
            laborDuration =
                (_s = ((_r = operation.laborTime) !== null && _r !== void 0 ? _r : 0) * operation.operationQuantity * 3600000) !== null && _s !== void 0 ? _s : 0;
            break;
        case "Hours/100 Pieces":
            laborDuration =
                (_u = (((_t = operation.laborTime) !== null && _t !== void 0 ? _t : 0) / 100) *
                    operation.operationQuantity *
                    3600000) !== null && _u !== void 0 ? _u : 0;
            break;
        case "Hours/1000 Pieces":
            laborDuration =
                (_w = (((_v = operation.laborTime) !== null && _v !== void 0 ? _v : 0) / 1000) *
                    operation.operationQuantity *
                    3600000) !== null && _w !== void 0 ? _w : 0;
            break;
        case "Minutes/Piece":
            laborDuration =
                (_y = ((_x = operation.laborTime) !== null && _x !== void 0 ? _x : 0) * operation.operationQuantity * 60000) !== null && _y !== void 0 ? _y : 0;
            break;
        case "Minutes/100 Pieces":
            laborDuration =
                (_0 = (((_z = operation.laborTime) !== null && _z !== void 0 ? _z : 0) / 100) *
                    operation.operationQuantity *
                    60000) !== null && _0 !== void 0 ? _0 : 0;
            break;
        case "Minutes/1000 Pieces":
            laborDuration =
                (_2 = (((_1 = operation.laborTime) !== null && _1 !== void 0 ? _1 : 0) / 1000) *
                    operation.operationQuantity *
                    60000) !== null && _2 !== void 0 ? _2 : 0;
            break;
        case "Pieces/Hour":
            laborDuration =
                (_4 = (operation.operationQuantity / ((_3 = operation.laborTime) !== null && _3 !== void 0 ? _3 : 0)) * 3600000) !== null && _4 !== void 0 ? _4 : 0;
            break;
        case "Pieces/Minute":
            laborDuration =
                (_6 = (operation.operationQuantity / ((_5 = operation.laborTime) !== null && _5 !== void 0 ? _5 : 0)) * 60000) !== null && _6 !== void 0 ? _6 : 0;
            break;
        case "Seconds/Piece":
            laborDuration =
                (_8 = ((_7 = operation.laborTime) !== null && _7 !== void 0 ? _7 : 0) * operation.operationQuantity * 1000) !== null && _8 !== void 0 ? _8 : 0;
            break;
    }
    // Calculate machine duration
    switch (operation.machineUnit) {
        case "Hours/Piece":
            machineDuration =
                ((_9 = operation.machineTime) !== null && _9 !== void 0 ? _9 : 0) * operation.operationQuantity * 3600000;
            break;
        case "Hours/100 Pieces":
            machineDuration =
                (((_10 = operation.machineTime) !== null && _10 !== void 0 ? _10 : 0) / 100) *
                    operation.operationQuantity *
                    3600000;
            break;
        case "Hours/1000 Pieces":
            machineDuration =
                (((_11 = operation.machineTime) !== null && _11 !== void 0 ? _11 : 0) / 1000) *
                    operation.operationQuantity *
                    3600000;
            break;
        case "Minutes/Piece":
            machineDuration =
                ((_12 = operation.machineTime) !== null && _12 !== void 0 ? _12 : 0) * operation.operationQuantity * 60000;
            break;
        case "Minutes/100 Pieces":
            machineDuration =
                (((_13 = operation.machineTime) !== null && _13 !== void 0 ? _13 : 0) / 100) *
                    operation.operationQuantity *
                    60000;
            break;
        case "Minutes/1000 Pieces":
            machineDuration =
                (((_14 = operation.machineTime) !== null && _14 !== void 0 ? _14 : 0) / 1000) *
                    operation.operationQuantity *
                    60000;
            break;
        case "Pieces/Hour":
            machineDuration =
                (operation.operationQuantity / ((_15 = operation.machineTime) !== null && _15 !== void 0 ? _15 : 0)) * 3600000;
            break;
        case "Pieces/Minute":
            machineDuration =
                (operation.operationQuantity / ((_16 = operation.machineTime) !== null && _16 !== void 0 ? _16 : 0)) * 60000;
            break;
        case "Seconds/Piece":
            machineDuration =
                ((_17 = operation.machineTime) !== null && _17 !== void 0 ? _17 : 0) * operation.operationQuantity * 1000;
            break;
    }
    var totalDuration = setupDuration + laborDuration + machineDuration;
    return __assign(__assign({}, operation), { setupTime: (_18 = operation.setupTime) !== null && _18 !== void 0 ? _18 : 0, laborTime: (_19 = operation.laborTime) !== null && _19 !== void 0 ? _19 : 0, machineTime: (_20 = operation.machineTime) !== null && _20 !== void 0 ? _20 : 0, duration: totalDuration, setupDuration: setupDuration, laborDuration: laborDuration, machineDuration: machineDuration });
}
