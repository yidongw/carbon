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
exports.getMasterCuttingProgress = getMasterCuttingProgress;
exports.getMasterProcessBreakdown = getMasterProcessBreakdown;
exports.getMasterCuttingOperationId = getMasterCuttingOperationId;
exports.getMasterWorkOrders = getMasterWorkOrders;
exports.getMasterWorkOrder = getMasterWorkOrder;
exports.insertMasterWorkOrder = insertMasterWorkOrder;
var styleMethod_service_1 = require("~/modules/items/styleMethod.service");
var query_1 = require("~/utils/query");
var jobConfiguration_1 = require("./jobConfiguration");
var production_service_1 = require("./production.service");
/**
 * Per master work order: how much of the plan has been cut (the cutting
 * operation's completed quantity) and what remains, plus the remaining
 * quantity per color/size cell. Batched for a page of masters.
 */
function getMasterCuttingProgress(client, masters, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, jobIds, _a, ops, jobs, opsByJob, _i, _b, op, list, configByJob, _c, _d, job, cuttingOpByJob, _e, opsByJob_1, _f, jobId, jobOps, cutting, cuttingOpIds, reportedConfigsByOp, pq, _g, _h, row, list, _j, masters_1, master, cuttingOp, reported, plan, remaining, planConfig, remainingConfiguration;
        var _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    result = {};
                    jobIds = masters
                        .map(function (m) { return m.jobId; })
                        .filter(function (id) { return Boolean(id); });
                    if (jobIds.length === 0)
                        return [2 /*return*/, result];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("jobOperation")
                                .select("id, jobId, tags, customFields, order, quantityComplete")
                                .in("jobId", jobIds)
                                .eq("companyId", companyId)
                                .order("order", { ascending: true }),
                            client
                                .from("job")
                                .select("id, configuration")
                                .in("id", jobIds)
                                .eq("companyId", companyId)
                        ])];
                case 1:
                    _a = _u.sent(), ops = _a[0], jobs = _a[1];
                    opsByJob = new Map();
                    for (_i = 0, _b = (_k = ops.data) !== null && _k !== void 0 ? _k : []; _i < _b.length; _i++) {
                        op = _b[_i];
                        if (!op.jobId)
                            continue;
                        list = opsByJob.get(op.jobId);
                        if (list)
                            list.push(op);
                        else
                            opsByJob.set(op.jobId, [op]);
                    }
                    configByJob = new Map();
                    for (_c = 0, _d = (_l = jobs.data) !== null && _l !== void 0 ? _l : []; _c < _d.length; _c++) {
                        job = _d[_c];
                        configByJob.set(job.id, job.configuration);
                    }
                    cuttingOpByJob = new Map();
                    for (_e = 0, opsByJob_1 = opsByJob; _e < opsByJob_1.length; _e++) {
                        _f = opsByJob_1[_e], jobId = _f[0], jobOps = _f[1];
                        cutting = (_m = jobOps.find(function (op) {
                            var _a;
                            return (0, styleMethod_service_1.isStyleCuttingOperation)({
                                tags: (_a = op.tags) !== null && _a !== void 0 ? _a : [],
                                customFields: op.customFields
                            });
                        })) !== null && _m !== void 0 ? _m : jobOps[0];
                        if (cutting) {
                            cuttingOpByJob.set(jobId, {
                                id: cutting.id,
                                quantityComplete: Number(cutting.quantityComplete) || 0
                            });
                        }
                    }
                    cuttingOpIds = __spreadArray([], cuttingOpByJob.values(), true).map(function (c) { return c.id; });
                    reportedConfigsByOp = new Map();
                    if (!(cuttingOpIds.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("productionQuantity")
                            .select("jobOperationId, configuration")
                            .in("jobOperationId", cuttingOpIds)
                            .eq("companyId", companyId)
                            .eq("type", "Production")
                            .is("invalidatedAt", null)];
                case 2:
                    pq = _u.sent();
                    for (_g = 0, _h = (_o = pq.data) !== null && _o !== void 0 ? _o : []; _g < _h.length; _g++) {
                        row = _h[_g];
                        if (!row.jobOperationId)
                            continue;
                        list = reportedConfigsByOp.get(row.jobOperationId);
                        if (list)
                            list.push(row.configuration);
                        else
                            reportedConfigsByOp.set(row.jobOperationId, [row.configuration]);
                    }
                    _u.label = 3;
                case 3:
                    for (_j = 0, masters_1 = masters; _j < masters_1.length; _j++) {
                        master = masters_1[_j];
                        if (!master.id || !master.jobId)
                            continue;
                        cuttingOp = cuttingOpByJob.get(master.jobId);
                        reported = (_p = cuttingOp === null || cuttingOp === void 0 ? void 0 : cuttingOp.quantityComplete) !== null && _p !== void 0 ? _p : 0;
                        plan = (_q = master.quantity) !== null && _q !== void 0 ? _q : 0;
                        remaining = Math.max(0, plan - reported);
                        planConfig = (_r = configByJob.get(master.jobId)) !== null && _r !== void 0 ? _r : null;
                        remainingConfiguration = cuttingOp
                            ? (0, jobConfiguration_1.computeConfigRemaining)(planConfig, (_s = reportedConfigsByOp.get(cuttingOp.id)) !== null && _s !== void 0 ? _s : [])
                            : { configTable: [], configTablePrimaryKeys: [] };
                        result[master.id] = {
                            jobId: master.jobId,
                            itemId: master.itemId,
                            cuttingOperationId: (_t = cuttingOp === null || cuttingOp === void 0 ? void 0 : cuttingOp.id) !== null && _t !== void 0 ? _t : null,
                            reported: reported,
                            remaining: remaining,
                            remainingConfiguration: remainingConfiguration
                        };
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
/**
 * The Master Work Order's processes: one row per distinct operation, taken from
 * the master job's own operations (so they show even before any bundle exists),
 * with the plan quantity, and each bundle (assignee, reported/remaining
 * quantity, timestamps, status) rolled up as expandable children.
 */
function getMasterProcessBreakdown(client, masterWorkOrderId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var master, masterJobId, masterJob, masterQuantity, masterOps, masterOpsData, cuttingOpId, order, byDescription, ensureProcess, _i, masterOpsData_1, op, process, bundles, jobIds, ops, _a, _loop_1, _b, _c, op;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        return __generator(this, function (_z) {
            switch (_z.label) {
                case 0: return [4 /*yield*/, client
                        .from("masterWorkOrder")
                        .select("jobId")
                        .eq("id", masterWorkOrderId)
                        .eq("companyId", companyId)
                        .single()];
                case 1:
                    master = _z.sent();
                    if (master.error || !((_d = master.data) === null || _d === void 0 ? void 0 : _d.jobId))
                        return [2 /*return*/, []];
                    masterJobId = master.data.jobId;
                    return [4 /*yield*/, client
                            .from("job")
                            .select("quantity")
                            .eq("id", masterJobId)
                            .single()];
                case 2:
                    masterJob = _z.sent();
                    masterQuantity = Number((_f = (_e = masterJob.data) === null || _e === void 0 ? void 0 : _e.quantity) !== null && _f !== void 0 ? _f : 0);
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("id, description, quantityComplete, assignee, tags, customFields")
                            .eq("jobId", masterJobId)
                            .eq("companyId", companyId)
                            .order("order", { ascending: true })];
                case 3:
                    masterOps = _z.sent();
                    if (masterOps.error)
                        return [2 /*return*/, []];
                    masterOpsData = (_g = masterOps.data) !== null && _g !== void 0 ? _g : [];
                    cuttingOpId = (_l = (_j = (_h = masterOpsData.find(function (op) {
                        var _a;
                        return (0, styleMethod_service_1.isStyleCuttingOperation)({
                            tags: (_a = op.tags) !== null && _a !== void 0 ? _a : [],
                            customFields: op.customFields
                        });
                    })) === null || _h === void 0 ? void 0 : _h.id) !== null && _j !== void 0 ? _j : (_k = masterOpsData[0]) === null || _k === void 0 ? void 0 : _k.id) !== null && _l !== void 0 ? _l : null;
                    order = [];
                    byDescription = new Map();
                    ensureProcess = function (description) {
                        var process = byDescription.get(description);
                        if (!process) {
                            order.push(description);
                            process = {
                                description: description,
                                isCutting: false,
                                bundleCount: 0,
                                quantity: masterQuantity,
                                reportedQuantity: 0,
                                assignee: null,
                                bundles: []
                            };
                            byDescription.set(description, process);
                        }
                        return process;
                    };
                    for (_i = 0, masterOpsData_1 = masterOpsData; _i < masterOpsData_1.length; _i++) {
                        op = masterOpsData_1[_i];
                        process = ensureProcess((_m = op.description) !== null && _m !== void 0 ? _m : "—");
                        process.reportedQuantity += Number((_o = op.quantityComplete) !== null && _o !== void 0 ? _o : 0);
                        if (op.assignee)
                            process.assignee = op.assignee;
                        if (cuttingOpId && op.id === cuttingOpId) {
                            process.isCutting = true;
                        }
                    }
                    return [4 /*yield*/, client
                            .from("bundleWorkOrders")
                            .select("id, jobId, jobReadableId, colorCode, colorName, sizeCode, status, quantity, reportedQuantity, assignee, assignedAt, lastReportedAt")
                            .eq("masterWorkOrderId", masterWorkOrderId)
                            .eq("companyId", companyId)
                            .order("sequence", { ascending: true })];
                case 4:
                    bundles = _z.sent();
                    jobIds = ((_p = bundles.data) !== null && _p !== void 0 ? _p : [])
                        .map(function (b) { return b.jobId; })
                        .filter(Boolean);
                    if (!jobIds.length) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("jobId, description, quantityComplete, status")
                            .in("jobId", jobIds)
                            .eq("companyId", companyId)
                            .order("order", { ascending: true })];
                case 5:
                    _a = _z.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _a = null;
                    _z.label = 7;
                case 7:
                    ops = _a;
                    if (ops === null || ops === void 0 ? void 0 : ops.error)
                        return [2 /*return*/, order.map(function (d) { return byDescription.get(d); })];
                    _loop_1 = function (op) {
                        var description = (_r = op.description) !== null && _r !== void 0 ? _r : "—";
                        var bundle = ((_s = bundles.data) !== null && _s !== void 0 ? _s : []).find(function (b) { return b.jobId === op.jobId; });
                        if (!bundle)
                            return "continue";
                        var process = ensureProcess(description);
                        var quantity = Number((_t = bundle.quantity) !== null && _t !== void 0 ? _t : 0);
                        // Reported comes from the bundle operation's completed count (the stored
                        // bundleWorkOrder.reportedQuantity isn't maintained), so it reflects the
                        // actual production reports filed against the bundle.
                        var reported = Number((_u = op.quantityComplete) !== null && _u !== void 0 ? _u : 0);
                        process.bundleCount += 1;
                        process.reportedQuantity += reported;
                        process.bundles.push({
                            bundleWorkOrderId: (_v = bundle.id) !== null && _v !== void 0 ? _v : "",
                            jobReadableId: (_w = bundle.jobReadableId) !== null && _w !== void 0 ? _w : "",
                            colorCode: bundle.colorCode,
                            colorName: (_x = bundle.colorName) !== null && _x !== void 0 ? _x : null,
                            sizeCode: bundle.sizeCode,
                            operationStatus: (_y = op.status) !== null && _y !== void 0 ? _y : null,
                            quantity: quantity,
                            reportedQuantity: reported,
                            remainingQuantity: Math.max(0, quantity - reported),
                            assignee: bundle.assignee,
                            assignedAt: bundle.assignedAt,
                            lastReportedAt: bundle.lastReportedAt
                        });
                    };
                    for (_b = 0, _c = (_q = ops === null || ops === void 0 ? void 0 : ops.data) !== null && _q !== void 0 ? _q : []; _b < _c.length; _b++) {
                        op = _c[_b];
                        _loop_1(op);
                    }
                    return [2 /*return*/, order.map(function (d) { return byDescription.get(d); })];
            }
        });
    });
}
/**
 * The jobOperation a Master Work Order's cutting is reported against — the
 * operation tagged as style cutting, falling back to the first operation.
 */
function getMasterCuttingOperationId(client, jobId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var operations, cutting;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobOperation")
                        .select("id, tags, customFields, order")
                        .eq("jobId", jobId)
                        .eq("companyId", companyId)
                        .order("order", { ascending: true })];
                case 1:
                    operations = _e.sent();
                    if (operations.error || !((_a = operations.data) === null || _a === void 0 ? void 0 : _a.length))
                        return [2 /*return*/, null];
                    cutting = operations.data.find(function (op) {
                        var _a;
                        return (0, styleMethod_service_1.isStyleCuttingOperation)({
                            tags: (_a = op.tags) !== null && _a !== void 0 ? _a : [],
                            customFields: op.customFields
                        });
                    });
                    return [2 /*return*/, (_d = (_b = cutting === null || cutting === void 0 ? void 0 : cutting.id) !== null && _b !== void 0 ? _b : (_c = operations.data[0]) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : null];
            }
        });
    });
}
/**
 * Paginated list of master work orders, joined to their backing job + style item
 * via the `masterWorkOrders` view. Mirrors the `getJobs` pattern so the list UI
 * reuses the generic query-filter machinery.
 */
function getMasterWorkOrders(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("masterWorkOrders")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("jobReadableId.ilike.%".concat(args.search, "%,itemName.ilike.%").concat(args.search, "%,readableIdWithRevision.ilike.%").concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "createdAt", ascending: false }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getMasterWorkOrder(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("masterWorkOrders")
                    .select("*")
                    .eq("id", id)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
/**
 * Create a master work order for a Style item. The backing job is created
 * through the existing `insertJob` path (get-method + recalculate), and the
 * master work order row wraps it 1:1.
 */
function insertMasterWorkOrder(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var job, masterOps, nonCuttingIds, masterWorkOrder;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, production_service_1.insertJob)(client, {
                        itemId: input.itemId,
                        quantity: input.quantity,
                        companyId: input.companyId,
                        createdBy: input.createdBy,
                        locationId: input.locationId,
                        dueDate: input.dueDate,
                        deadlineType: input.deadlineType,
                        configuration: input.configuration
                    })];
                case 1:
                    job = _b.sent();
                    if (job.error || !job.data) {
                        return [2 /*return*/, { data: null, error: job.error }];
                    }
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("id, processId, order, tags, customFields")
                            .eq("jobId", job.data.id)
                            .eq("companyId", input.companyId)];
                case 2:
                    masterOps = _b.sent();
                    if (!(masterOps.data && masterOps.data.length > 0)) return [3 /*break*/, 4];
                    nonCuttingIds = (0, styleMethod_service_1.getParentJobNonCuttingOperationIdsToDelete)({
                        operations: masterOps.data
                    });
                    if (!(nonCuttingIds.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .delete()
                            .in("id", nonCuttingIds)
                            .eq("companyId", input.companyId)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [4 /*yield*/, client
                        .from("masterWorkOrder")
                        .insert({
                        jobId: job.data.id,
                        companyId: input.companyId,
                        createdBy: input.createdBy,
                        colorSize: (_a = input.colorSize) !== null && _a !== void 0 ? _a : null
                    })
                        .select("id, jobId")
                        .single()];
                case 5:
                    masterWorkOrder = _b.sent();
                    return [2 /*return*/, masterWorkOrder];
            }
        });
    });
}
