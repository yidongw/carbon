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
Object.defineProperty(exports, "__esModule", { value: true });
var server_ts_1 = require("https://deno.land/std@0.168.0/http/server.ts");
var nanoid_ts_1 = require("https://deno.land/x/nanoid@v3.0.0/nanoid.ts");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var database_ts_1 = require("../lib/database.ts");
var headers_ts_1 = require("../lib/headers.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
/**
 * Finds the shortest path from targetOperationId to triggeredAtOperationId
 * by walking backwards through the DAG from triggeredAt.
 * Returns operations in forward order (target → ... → triggeredAt).
 */
function findReworkPath(trx, jobId, targetOperationId, triggeredAtOperationId) {
    return __awaiter(this, void 0, void 0, function () {
        var dependencies, dependsOn, _i, dependencies_1, dep, existing, visited, parent, queue, current_1, _a, _b, predecessor, path, current;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, trx
                        .selectFrom("jobOperationDependency")
                        .select(["operationId", "dependsOnId"])
                        .where("jobId", "=", jobId)
                        .execute()];
                case 1:
                    dependencies = _e.sent();
                    dependsOn = new Map();
                    for (_i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
                        dep = dependencies_1[_i];
                        existing = (_c = dependsOn.get(dep.operationId)) !== null && _c !== void 0 ? _c : [];
                        existing.push(dep.dependsOnId);
                        dependsOn.set(dep.operationId, existing);
                    }
                    visited = new Set();
                    parent = new Map();
                    queue = [triggeredAtOperationId];
                    visited.add(triggeredAtOperationId);
                    while (queue.length > 0) {
                        current_1 = queue.shift();
                        if (current_1 === targetOperationId)
                            break;
                        for (_a = 0, _b = (_d = dependsOn.get(current_1)) !== null && _d !== void 0 ? _d : []; _a < _b.length; _a++) {
                            predecessor = _b[_a];
                            if (!visited.has(predecessor)) {
                                visited.add(predecessor);
                                parent.set(predecessor, current_1);
                                queue.push(predecessor);
                            }
                        }
                    }
                    if (!visited.has(targetOperationId)) {
                        throw new Error("No path found from target operation ".concat(targetOperationId, " to triggered operation ").concat(triggeredAtOperationId));
                    }
                    path = [];
                    current = targetOperationId;
                    while (current !== triggeredAtOperationId) {
                        path.push(current);
                        current = parent.get(current);
                    }
                    path.push(triggeredAtOperationId);
                    return [2 /*return*/, path];
            }
        });
    });
}
function triggerRework(trx, body) {
    return __awaiter(this, void 0, void 0, function () {
        var jobId, triggeredAtJobOperationId, targetJobOperationId, reason, quantity, trackedEntityIds, companyId, userId, operationPath, rework, activityId, isSerial, _i, trackedEntityIds_1, entityId, sourceOperations, pathIndex, _a, triggerOp, nextOp, triggerOrder, upperBound, gap, increment, clonedOps, clonedOperationIds, sourceToCloneMap, _b, allSteps, allTools, allParams, stepValues, toolValues, paramValues, dagEdges, i, downstreamDeps, lastReworkOpId, _c, downstreamDeps_1, dep;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    jobId = body.jobId, triggeredAtJobOperationId = body.triggeredAtJobOperationId, targetJobOperationId = body.targetJobOperationId, reason = body.reason, quantity = body.quantity, trackedEntityIds = body.trackedEntityIds, companyId = body.companyId, userId = body.userId;
                    return [4 /*yield*/, findReworkPath(trx, jobId, targetJobOperationId, triggeredAtJobOperationId)];
                case 1:
                    operationPath = _d.sent();
                    console.info("\uD83D\uDCCB Rework path: ".concat(operationPath.length, " operations to clone"));
                    return [4 /*yield*/, trx
                            .insertInto("rework")
                            .values({
                            jobId: jobId,
                            triggeredAtJobOperationId: triggeredAtJobOperationId,
                            targetJobOperationId: targetJobOperationId,
                            reason: reason,
                            quantity: quantity,
                            requestedById: userId,
                            companyId: companyId,
                        })
                            .returning(["id"])
                            .execute()];
                case 2:
                    rework = (_d.sent())[0];
                    if (!(trackedEntityIds && trackedEntityIds.length > 0)) return [3 /*break*/, 7];
                    activityId = (0, nanoid_ts_1.nanoid)();
                    return [4 /*yield*/, trx
                            .insertInto("trackedActivity")
                            .values({
                            id: activityId,
                            type: "Rework",
                            sourceDocument: "Rework",
                            sourceDocumentId: rework.id,
                            attributes: {
                                Job: jobId,
                                "Triggered At": triggeredAtJobOperationId,
                                Target: targetJobOperationId,
                                Reason: reason,
                                Quantity: quantity,
                            },
                            companyId: companyId,
                            createdBy: userId,
                        })
                            .execute()];
                case 3:
                    _d.sent();
                    isSerial = trackedEntityIds.length > 1 || quantity === 1;
                    _i = 0, trackedEntityIds_1 = trackedEntityIds;
                    _d.label = 4;
                case 4:
                    if (!(_i < trackedEntityIds_1.length)) return [3 /*break*/, 7];
                    entityId = trackedEntityIds_1[_i];
                    return [4 /*yield*/, trx
                            .insertInto("trackedActivityInput")
                            .values({
                            trackedActivityId: activityId,
                            trackedEntityId: entityId,
                            quantity: isSerial ? 1 : quantity,
                            companyId: companyId,
                            createdBy: userId,
                        })
                            .execute()];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [4 /*yield*/, trx
                        .selectFrom("jobOperation")
                        .selectAll()
                        .where("id", "in", operationPath)
                        .execute()];
                case 8:
                    sourceOperations = _d.sent();
                    pathIndex = new Map(operationPath.map(function (id, i) { return [id, i]; }));
                    sourceOperations.sort(function (a, b) { var _a, _b; return ((_a = pathIndex.get(a.id)) !== null && _a !== void 0 ? _a : 0) - ((_b = pathIndex.get(b.id)) !== null && _b !== void 0 ? _b : 0); });
                    return [4 /*yield*/, Promise.all([
                            trx
                                .selectFrom("jobOperation")
                                .select("order")
                                .where("id", "=", triggeredAtJobOperationId)
                                .executeTakeFirstOrThrow(),
                            trx
                                .selectFrom("jobOperation")
                                .select("order")
                                .where("jobId", "=", jobId)
                                .where("order", ">", trx
                                .selectFrom("jobOperation")
                                .select("order")
                                .where("id", "=", triggeredAtJobOperationId))
                                .orderBy("order", "asc")
                                .executeTakeFirst(),
                        ])];
                case 9:
                    _a = _d.sent(), triggerOp = _a[0], nextOp = _a[1];
                    triggerOrder = Number(triggerOp.order);
                    upperBound = (nextOp === null || nextOp === void 0 ? void 0 : nextOp.order) ? Number(nextOp.order) : triggerOrder + 1;
                    gap = upperBound - triggerOrder;
                    increment = gap / (sourceOperations.length + 1);
                    return [4 /*yield*/, trx
                            .insertInto("jobOperation")
                            .values(sourceOperations.map(function (sourceOp, i) { return ({
                            jobId: sourceOp.jobId,
                            jobMakeMethodId: sourceOp.jobMakeMethodId,
                            order: triggerOrder + increment * (i + 1),
                            processId: sourceOp.processId,
                            workCenterId: sourceOp.workCenterId,
                            description: sourceOp.description,
                            setupTime: sourceOp.setupTime,
                            setupUnit: sourceOp.setupUnit,
                            laborTime: sourceOp.laborTime,
                            laborUnit: sourceOp.laborUnit,
                            machineTime: sourceOp.machineTime,
                            machineUnit: sourceOp.machineUnit,
                            operationOrder: i === 0 ? "With Previous" : sourceOp.operationOrder,
                            laborRate: sourceOp.laborRate,
                            overheadRate: sourceOp.overheadRate,
                            machineRate: sourceOp.machineRate,
                            operationType: sourceOp.operationType,
                            operationMinimumCost: sourceOp.operationMinimumCost,
                            operationLeadTime: sourceOp.operationLeadTime,
                            operationUnitCost: sourceOp.operationUnitCost,
                            operationSupplierProcessId: sourceOp.operationSupplierProcessId,
                            workInstruction: sourceOp.workInstruction,
                            procedureId: sourceOp.procedureId,
                            operationQuantity: quantity,
                            targetQuantity: quantity,
                            tags: sourceOp.tags,
                            companyId: companyId,
                            createdBy: userId,
                            // @ts-expect-error - reworkId not in generated types until migration is applied
                            reworkId: rework.id,
                            status: i === 0 ? "Ready" : "Waiting",
                            customFields: sourceOp.customFields,
                        }); }))
                            .returning(["id"])
                            .execute()];
                case 10:
                    clonedOps = _d.sent();
                    clonedOperationIds = clonedOps.map(function (op) { return op.id; });
                    sourceToCloneMap = new Map();
                    sourceOperations.forEach(function (sourceOp, i) {
                        sourceToCloneMap.set(sourceOp.id, clonedOps[i].id);
                    });
                    console.info("\uD83D\uDD27 Cloned ".concat(clonedOperationIds.length, " operations"));
                    return [4 /*yield*/, Promise.all([
                            trx
                                .selectFrom("jobOperationStep")
                                .selectAll()
                                .where("operationId", "in", operationPath)
                                .execute(),
                            trx
                                .selectFrom("jobOperationTool")
                                .selectAll()
                                .where("operationId", "in", operationPath)
                                .execute(),
                            trx
                                .selectFrom("jobOperationParameter")
                                .selectAll()
                                .where("operationId", "in", operationPath)
                                .execute(),
                        ])];
                case 11:
                    _b = _d.sent(), allSteps = _b[0], allTools = _b[1], allParams = _b[2];
                    stepValues = allSteps.map(function (_a) {
                        var _id = _a.id, operationId = _a.operationId, _ca = _a.createdAt, _ua = _a.updatedAt, _ub = _a.updatedBy, step = __rest(_a, ["id", "operationId", "createdAt", "updatedAt", "updatedBy"]);
                        return (__assign(__assign({}, step), { operationId: sourceToCloneMap.get(operationId), createdBy: userId }));
                    });
                    toolValues = allTools.map(function (tool) { return ({
                        toolId: tool.toolId,
                        quantity: tool.quantity,
                        operationId: sourceToCloneMap.get(tool.operationId),
                        companyId: companyId,
                        createdBy: userId,
                    }); });
                    paramValues = allParams.map(function (param) { return ({
                        key: param.key,
                        value: param.value,
                        operationId: sourceToCloneMap.get(param.operationId),
                        companyId: companyId,
                        createdBy: userId,
                    }); });
                    return [4 /*yield*/, Promise.all([
                            stepValues.length > 0
                                ? trx.insertInto("jobOperationStep").values(stepValues).execute()
                                : null,
                            toolValues.length > 0
                                ? trx.insertInto("jobOperationTool").values(toolValues).execute()
                                : null,
                            paramValues.length > 0
                                ? trx.insertInto("jobOperationParameter").values(paramValues).execute()
                                : null,
                        ])];
                case 12:
                    _d.sent();
                    dagEdges = [];
                    // 7a. Each subsequent rework op depends on the previous
                    for (i = 1; i < clonedOperationIds.length; i++) {
                        dagEdges.push({
                            operationId: clonedOperationIds[i],
                            dependsOnId: clonedOperationIds[i - 1],
                            jobId: jobId,
                            companyId: companyId,
                        });
                    }
                    return [4 /*yield*/, trx
                            .selectFrom("jobOperationDependency")
                            .select(["operationId"])
                            .where("dependsOnId", "=", triggeredAtJobOperationId)
                            .where("operationId", "not in", clonedOperationIds)
                            .execute()];
                case 13:
                    downstreamDeps = _d.sent();
                    lastReworkOpId = clonedOperationIds[clonedOperationIds.length - 1];
                    for (_c = 0, downstreamDeps_1 = downstreamDeps; _c < downstreamDeps_1.length; _c++) {
                        dep = downstreamDeps_1[_c];
                        dagEdges.push({
                            operationId: dep.operationId,
                            dependsOnId: lastReworkOpId,
                            jobId: jobId,
                            companyId: companyId,
                        });
                    }
                    if (!(dagEdges.length > 0)) return [3 /*break*/, 15];
                    return [4 /*yield*/, trx
                            .insertInto("jobOperationDependency")
                            .values(dagEdges)
                            .execute()];
                case 14:
                    _d.sent();
                    _d.label = 15;
                case 15:
                    console.info("\uD83D\uDD17 DAG wired with ".concat(downstreamDeps.length, " downstream deps rewired"));
                    // 8. Record a productionQuantity entry for the rework
                    return [4 /*yield*/, trx
                            .insertInto("productionQuantity")
                            .values({
                            jobOperationId: triggeredAtJobOperationId,
                            type: "Rework",
                            quantity: quantity,
                            companyId: companyId,
                            createdBy: userId,
                        })
                            .execute()];
                case 16:
                    // 8. Record a productionQuantity entry for the rework
                    _d.sent();
                    return [2 /*return*/, {
                            reworkId: rework.id,
                            clonedOperationIds: clonedOperationIds,
                            operationsCloned: clonedOperationIds.length,
                        }];
            }
        });
    });
}
// Main handler
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var raw, parsed, body_1, result, supabaseUrl, serviceRoleKey, err_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                return [4 /*yield*/, req.json()];
            case 2:
                raw = _a.sent();
                parsed = npm_zod__3_24_1_1.default
                    .object({
                    jobId: npm_zod__3_24_1_1.default.string().min(1),
                    triggeredAtJobOperationId: npm_zod__3_24_1_1.default.string().min(1),
                    targetJobOperationId: npm_zod__3_24_1_1.default.string().min(1),
                    reason: npm_zod__3_24_1_1.default.string().min(1),
                    quantity: npm_zod__3_24_1_1.default.number().positive(),
                    trackedEntityIds: npm_zod__3_24_1_1.default.array(npm_zod__3_24_1_1.default.string()).optional(),
                    companyId: npm_zod__3_24_1_1.default.string().min(1),
                    userId: npm_zod__3_24_1_1.default.string().min(1),
                })
                    .safeParse(raw);
                if (!parsed.success) {
                    return [2 /*return*/, new Response(JSON.stringify({
                            success: false,
                            message: "Invalid request: ".concat(parsed.error.issues.map(function (i) { return i.message; }).join(", ")),
                        }), {
                            status: 400,
                            headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        })];
                }
                body_1 = parsed.data;
                console.info("\uD83D\uDD30 Starting rework for job ".concat(body_1.jobId, ": go back to ").concat(body_1.targetJobOperationId, " from ").concat(body_1.triggeredAtJobOperationId));
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, triggerRework(trx, body_1)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })];
            case 3:
                result = _a.sent();
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                supabaseUrl = Deno.env.get("SUPABASE_URL");
                serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
                return [4 /*yield*/, fetch("".concat(supabaseUrl, "/functions/v1/reschedule"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(serviceRoleKey),
                        },
                        body: JSON.stringify({
                            jobId: body_1.jobId,
                            companyId: body_1.companyId,
                            userId: body_1.userId,
                        }),
                    })];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                console.error("Failed to trigger reschedule after rework:", err_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/, new Response(JSON.stringify(__assign({ success: true }, result)), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                })];
            case 8:
                error_1 = _a.sent();
                console.error("\u274C Rework failed: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                return [2 /*return*/, new Response(JSON.stringify({
                        success: false,
                        message: error_1 instanceof Error ? error_1.message : String(error_1),
                    }), {
                        status: 500,
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 9: return [2 /*return*/];
        }
    });
}); });
