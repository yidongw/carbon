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
exports.fetchLineageSubgraph = fetchLineageSubgraph;
exports.fetchJobStepRecords = fetchJobStepRecords;
exports.fetchContainmentsForEntities = fetchContainmentsForEntities;
exports.fetchJobScopedLineage = fetchJobScopedLineage;
exports.toGraphData = toGraphData;
var constants_1 = require("./ui/Traceability/constants");
var MAX_ENTITIES = 200;
function newLineageState() {
    return {
        entities: new Map(),
        activities: new Map(),
        inputs: new Map(),
        outputs: new Map(),
        visited: new Set()
    };
}
function expandActivitySiblings(client, state, activityIds) {
    return __awaiter(this, void 0, void 0, function () {
        var entities, activities, inputs, outputs, newActivityIds, fetched, _i, _a, row, _b, siblingInputs, siblingOutputs, siblingEntityIds, _c, _d, row, key, _e, _f, row, key, remainingCapacity, idsToFetch, fetched, _g, _h, row;
        var _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    entities = state.entities, activities = state.activities, inputs = state.inputs, outputs = state.outputs;
                    newActivityIds = activityIds.filter(function (id) { return !activities.has(id); });
                    if (!(newActivityIds.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client
                            .from("trackedActivity")
                            .select("*")
                            .in("id", newActivityIds)];
                case 1:
                    fetched = _o.sent();
                    for (_i = 0, _a = (_j = fetched.data) !== null && _j !== void 0 ? _j : []; _i < _a.length; _i++) {
                        row = _a[_i];
                        activities.set(row.id, row);
                    }
                    _o.label = 2;
                case 2: return [4 /*yield*/, Promise.all([
                        client
                            .from("trackedActivityInput")
                            .select("*")
                            .in("trackedActivityId", activityIds),
                        client
                            .from("trackedActivityOutput")
                            .select("*")
                            .in("trackedActivityId", activityIds)
                    ])];
                case 3:
                    _b = _o.sent(), siblingInputs = _b[0], siblingOutputs = _b[1];
                    siblingEntityIds = new Set();
                    for (_c = 0, _d = (_k = siblingInputs.data) !== null && _k !== void 0 ? _k : []; _c < _d.length; _c++) {
                        row = _d[_c];
                        key = "".concat(row.trackedActivityId, ":").concat(row.trackedEntityId);
                        if (!inputs.has(key)) {
                            inputs.set(key, {
                                trackedActivityId: row.trackedActivityId,
                                trackedEntityId: row.trackedEntityId,
                                quantity: row.quantity
                            });
                        }
                        if (!entities.has(row.trackedEntityId)) {
                            siblingEntityIds.add(row.trackedEntityId);
                        }
                    }
                    for (_e = 0, _f = (_l = siblingOutputs.data) !== null && _l !== void 0 ? _l : []; _e < _f.length; _e++) {
                        row = _f[_e];
                        key = "".concat(row.trackedActivityId, ":").concat(row.trackedEntityId);
                        if (!outputs.has(key)) {
                            outputs.set(key, {
                                trackedActivityId: row.trackedActivityId,
                                trackedEntityId: row.trackedEntityId,
                                quantity: row.quantity
                            });
                        }
                        if (!entities.has(row.trackedEntityId)) {
                            siblingEntityIds.add(row.trackedEntityId);
                        }
                    }
                    if (!(siblingEntityIds.size > 0)) return [3 /*break*/, 5];
                    remainingCapacity = MAX_ENTITIES - entities.size;
                    idsToFetch = Array.from(siblingEntityIds).slice(0, remainingCapacity);
                    if (!(idsToFetch.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("*")
                            .in("id", idsToFetch)];
                case 4:
                    fetched = _o.sent();
                    for (_g = 0, _h = (_m = fetched.data) !== null && _m !== void 0 ? _m : []; _g < _h.length; _g++) {
                        row = _h[_g];
                        entities.set(row.id, row);
                    }
                    _o.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Surface "event" activities (e.g. Pick, Transfer) that reference entities
 * already in the graph. The genealogy BFS only follows input→output
 * transformations (consume/produce/split), so input-only or output-only events
 * — a pick relocating a lot, say — would otherwise be invisible. These render as
 * activity nodes attached to their entity (no new genealogy edges).
 */
function expandEntityActivities(client, state) {
    return __awaiter(this, void 0, void 0, function () {
        var entityIds, _a, ins, outs, activityIds, _i, _b, row, _c, _d, row;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    entityIds = Array.from(state.entities.keys());
                    if (entityIds.length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("trackedActivityInput")
                                .select("trackedActivityId")
                                .in("trackedEntityId", entityIds),
                            client
                                .from("trackedActivityOutput")
                                .select("trackedActivityId")
                                .in("trackedEntityId", entityIds)
                        ])];
                case 1:
                    _a = _g.sent(), ins = _a[0], outs = _a[1];
                    activityIds = new Set();
                    for (_i = 0, _b = (_e = ins.data) !== null && _e !== void 0 ? _e : []; _i < _b.length; _i++) {
                        row = _b[_i];
                        if (!state.activities.has(row.trackedActivityId))
                            activityIds.add(row.trackedActivityId);
                    }
                    for (_c = 0, _d = (_f = outs.data) !== null && _f !== void 0 ? _f : []; _c < _d.length; _c++) {
                        row = _d[_c];
                        if (!state.activities.has(row.trackedActivityId))
                            activityIds.add(row.trackedActivityId);
                    }
                    if (!(activityIds.size > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, expandActivitySiblings(client, state, Array.from(activityIds))];
                case 2:
                    _g.sent();
                    _g.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function runLineageBfs(client, state, initialFrontier, direction, safeDepth) {
    return __awaiter(this, void 0, void 0, function () {
        var entities, inputs, outputs, visited, frontier, _loop_1, hop, state_1;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    entities = state.entities, inputs = state.inputs, outputs = state.outputs, visited = state.visited;
                    frontier = initialFrontier.filter(function (id) {
                        if (visited.has(id))
                            return true;
                        visited.add(id);
                        return true;
                    });
                    _loop_1 = function (hop) {
                        var calls, descendantsBatch, ancestorsBatch, nextFrontier, newEntityIds, activityIds, i, row, outputKey, inputKey, i, row, inputKey, outputKey, remainingCapacity, idsToFetch, fetched, _i, _c, row;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (frontier.length === 0)
                                        return [2 /*return*/, "break"];
                                    if (entities.size >= MAX_ENTITIES)
                                        return [2 /*return*/, "break"];
                                    calls = [];
                                    descendantsBatch = [];
                                    ancestorsBatch = [];
                                    if (direction === "down" || direction === "both") {
                                        calls.push((function () { return __awaiter(_this, void 0, void 0, function () {
                                            var res;
                                            var _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0: return [4 /*yield*/, client.rpc("get_direct_descendants_of_tracked_entities_strict", { p_tracked_entity_ids: frontier })];
                                                    case 1:
                                                        res = _b.sent();
                                                        descendantsBatch = ((_a = res.data) !== null && _a !== void 0 ? _a : []);
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })());
                                    }
                                    if (direction === "up" || direction === "both") {
                                        calls.push((function () { return __awaiter(_this, void 0, void 0, function () {
                                            var res;
                                            var _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0: return [4 /*yield*/, client.rpc("get_direct_ancestors_of_tracked_entities_strict", { p_tracked_entity_ids: frontier })];
                                                    case 1:
                                                        res = _b.sent();
                                                        ancestorsBatch = ((_a = res.data) !== null && _a !== void 0 ? _a : []);
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })());
                                    }
                                    return [4 /*yield*/, Promise.all(calls)];
                                case 1:
                                    _d.sent();
                                    nextFrontier = new Set();
                                    newEntityIds = new Set();
                                    activityIds = new Set();
                                    for (i = 0; i < descendantsBatch.length; i++) {
                                        row = descendantsBatch[i];
                                        if (!(row === null || row === void 0 ? void 0 : row.id))
                                            continue;
                                        activityIds.add(row.trackedActivityId);
                                        outputKey = "".concat(row.trackedActivityId, ":").concat(row.sourceEntityId);
                                        if (!outputs.has(outputKey)) {
                                            outputs.set(outputKey, {
                                                trackedActivityId: row.trackedActivityId,
                                                trackedEntityId: row.sourceEntityId,
                                                quantity: row.quantity
                                            });
                                        }
                                        if (!visited.has(row.id)) {
                                            visited.add(row.id);
                                            newEntityIds.add(row.id);
                                            nextFrontier.add(row.id);
                                        }
                                        inputKey = "".concat(row.trackedActivityId, ":").concat(row.id);
                                        if (!inputs.has(inputKey)) {
                                            inputs.set(inputKey, {
                                                trackedActivityId: row.trackedActivityId,
                                                trackedEntityId: row.id,
                                                quantity: row.quantity
                                            });
                                        }
                                    }
                                    for (i = 0; i < ancestorsBatch.length; i++) {
                                        row = ancestorsBatch[i];
                                        if (!(row === null || row === void 0 ? void 0 : row.id))
                                            continue;
                                        activityIds.add(row.trackedActivityId);
                                        inputKey = "".concat(row.trackedActivityId, ":").concat(row.sourceEntityId);
                                        if (!inputs.has(inputKey)) {
                                            inputs.set(inputKey, {
                                                trackedActivityId: row.trackedActivityId,
                                                trackedEntityId: row.sourceEntityId,
                                                quantity: row.quantity
                                            });
                                        }
                                        if (!visited.has(row.id)) {
                                            visited.add(row.id);
                                            newEntityIds.add(row.id);
                                            nextFrontier.add(row.id);
                                        }
                                        outputKey = "".concat(row.trackedActivityId, ":").concat(row.id);
                                        if (!outputs.has(outputKey)) {
                                            outputs.set(outputKey, {
                                                trackedActivityId: row.trackedActivityId,
                                                trackedEntityId: row.id,
                                                quantity: row.quantity
                                            });
                                        }
                                    }
                                    if (!(newEntityIds.size > 0)) return [3 /*break*/, 3];
                                    remainingCapacity = MAX_ENTITIES - entities.size;
                                    idsToFetch = Array.from(newEntityIds).slice(0, remainingCapacity);
                                    return [4 /*yield*/, client
                                            .from("trackedEntity")
                                            .select("*")
                                            .in("id", idsToFetch)];
                                case 2:
                                    fetched = _d.sent();
                                    for (_i = 0, _c = (_a = fetched.data) !== null && _a !== void 0 ? _a : []; _i < _c.length; _i++) {
                                        row = _c[_i];
                                        entities.set(row.id, row);
                                    }
                                    _d.label = 3;
                                case 3:
                                    if (!(activityIds.size > 0)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, expandActivitySiblings(client, state, Array.from(activityIds))];
                                case 4:
                                    _d.sent();
                                    _d.label = 5;
                                case 5:
                                    frontier = Array.from(nextFrontier);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    hop = 0;
                    _b.label = 1;
                case 1:
                    if (!(hop < safeDepth)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(hop)];
                case 2:
                    state_1 = _b.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 4];
                    _b.label = 3;
                case 3:
                    hop++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchLineageSubgraph(client_1, rootEntityId_1, depth_1) {
    return __awaiter(this, arguments, void 0, function (client, rootEntityId, depth, direction) {
        var safeDepth, rootEntity, state;
        if (direction === void 0) { direction = "both"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    safeDepth = (0, constants_1.clampDepth)(depth);
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("*")
                            .eq("id", rootEntityId)
                            .maybeSingle()];
                case 1:
                    rootEntity = _a.sent();
                    state = newLineageState();
                    if (rootEntity.data)
                        state.entities.set(rootEntity.data.id, rootEntity.data);
                    return [4 /*yield*/, runLineageBfs(client, state, [rootEntityId], direction, safeDepth)];
                case 2:
                    _a.sent();
                    // Attach event activities (Pick/Transfer/etc.) for the entities in the graph
                    // so location moves like picking show up, not just genealogy transformations.
                    return [4 /*yield*/, expandEntityActivities(client, state)];
                case 3:
                    // Attach event activities (Pick/Transfer/etc.) for the entities in the graph
                    // so location moves like picking show up, not just genealogy transformations.
                    _a.sent();
                    return [2 /*return*/, {
                            entities: Array.from(state.entities.values()),
                            inputs: Array.from(state.inputs.values()),
                            outputs: Array.from(state.outputs.values()),
                            activities: Array.from(state.activities.values())
                        }];
            }
        });
    });
}
function fetchJobStepRecords(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.rpc("get_job_operation_step_records", {
                        p_job_id: jobId
                    })];
                case 1:
                    res = _a.sent();
                    if (!res.data)
                        return [2 /*return*/, []];
                    return [2 /*return*/, res.data.map(function (r) { return ({
                            id: r.id,
                            jobOperationStepId: r.jobOperationStepId,
                            index: r.index,
                            type: r.type,
                            name: r.name,
                            value: r.value,
                            numericValue: r.numericValue,
                            booleanValue: r.booleanValue,
                            userValue: r.userValue,
                            unitOfMeasureCode: r.unitOfMeasureCode,
                            minValue: r.minValue,
                            maxValue: r.maxValue,
                            operationId: r.operationId,
                            operationDescription: r.operationDescription,
                            itemId: r.itemId,
                            itemReadableId: r.itemReadableId,
                            createdAt: r.createdAt,
                            createdBy: r.createdBy
                        }); })];
            }
        });
    });
}
function fetchContainmentsForEntities(client, entityIds) {
    return __awaiter(this, void 0, void 0, function () {
        var res, containments, _i, _a, row, issue, status_1;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (entityIds.length === 0)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, client
                            .from("nonConformanceTrackedEntity")
                            .select("trackedEntityId,\n       nonConformanceId,\n       issue:issues!inner(id, status, priority, containmentStatus)")
                            .in("trackedEntityId", entityIds)
                            .in("issue.containmentStatus", ["Contained", "Uncontained"])];
                case 1:
                    res = _f.sent();
                    containments = [];
                    for (_i = 0, _a = (_b = res.data) !== null && _b !== void 0 ? _b : []; _i < _a.length; _i++) {
                        row = _a[_i];
                        issue = row.issue;
                        if (!issue)
                            continue;
                        status_1 = issue.containmentStatus;
                        if (status_1 !== "Contained" && status_1 !== "Uncontained")
                            continue;
                        containments.push({
                            id: (_c = issue.id) !== null && _c !== void 0 ? _c : row.nonConformanceId,
                            readableId: row.nonConformanceId,
                            containmentStatus: status_1,
                            status: (_d = issue.status) !== null && _d !== void 0 ? _d : "",
                            priority: (_e = issue.priority) !== null && _e !== void 0 ? _e : null,
                            trackedEntityId: row.trackedEntityId
                        });
                    }
                    return [2 /*return*/, containments];
            }
        });
    });
}
function fetchJobScopedLineage(client, jobId, depth) {
    return __awaiter(this, void 0, void 0, function () {
        var safeDepth, _a, seedEntitiesRes, seedActivitiesRes, state, _i, _b, row, _c, _d, row, containments;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    safeDepth = (0, constants_1.clampDepth)(depth);
                    return [4 /*yield*/, Promise.all([
                            client.from("trackedEntity").select("*").eq("attributes->>Job", jobId),
                            client.from("trackedActivity").select("*").eq("attributes->>Job", jobId)
                        ])];
                case 1:
                    _a = _g.sent(), seedEntitiesRes = _a[0], seedActivitiesRes = _a[1];
                    state = newLineageState();
                    for (_i = 0, _b = ((_e = seedEntitiesRes.data) !== null && _e !== void 0 ? _e : []); _i < _b.length; _i++) {
                        row = _b[_i];
                        state.entities.set(row.id, row);
                    }
                    for (_c = 0, _d = ((_f = seedActivitiesRes.data) !== null && _f !== void 0 ? _f : []); _c < _d.length; _c++) {
                        row = _d[_c];
                        state.activities.set(row.id, row);
                    }
                    if (!(state.activities.size > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, expandActivitySiblings(client, state, Array.from(state.activities.keys()))];
                case 2:
                    _g.sent();
                    _g.label = 3;
                case 3:
                    if (!(state.entities.size > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, runLineageBfs(client, state, Array.from(state.entities.keys()), "both", safeDepth)];
                case 4:
                    _g.sent();
                    _g.label = 5;
                case 5: return [4 /*yield*/, fetchContainmentsForEntities(client, Array.from(state.entities.keys()))];
                case 6:
                    containments = _g.sent();
                    return [2 /*return*/, {
                            entities: Array.from(state.entities.values()),
                            inputs: Array.from(state.inputs.values()),
                            outputs: Array.from(state.outputs.values()),
                            activities: Array.from(state.activities.values()),
                            containments: containments
                        }];
            }
        });
    });
}
function toGraphData(payload) {
    var nodes = __spreadArray(__spreadArray([], payload.entities.map(function (entity) { return ({
        id: entity.id,
        type: "entity",
        data: entity,
        parentId: null
    }); }), true), payload.activities.map(function (activity) { return ({
        id: activity.id,
        type: "activity",
        data: activity,
        parentId: null
    }); }), true);
    var links = __spreadArray(__spreadArray([], payload.inputs.map(function (input) { return ({
        source: input.trackedEntityId,
        target: input.trackedActivityId,
        type: "input",
        quantity: input.quantity
    }); }), true), payload.outputs.map(function (output) { return ({
        source: output.trackedActivityId,
        target: output.trackedEntityId,
        type: "output",
        quantity: output.quantity
    }); }), true);
    return { nodes: nodes, links: links };
}
