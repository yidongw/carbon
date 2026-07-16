"use strict";
// Server-side storage-rules evaluator. Cross-app entry point — ERP
// (item surfaces) and MES (workCenter surfaces) both call
// `evaluateLinesForSurface`.
//
// All functions here are server-only. Never import from a client module.
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
exports.dedupeViolations = exports.isBlocked = exports.isStorageRulesEnabledForCompany = void 0;
exports.getStorageRulesDataForTarget = getStorageRulesDataForTarget;
exports.evaluateLinesForSurface = evaluateLinesForSurface;
var utils_1 = require("@carbon/utils");
var plan_server_1 = require("../plan.server");
var context_1 = require("./context");
var service_1 = require("./service");
// ---------------------------------------------------------------------------
// Plan gate
// ---------------------------------------------------------------------------
var isStorageRulesEnabledForCompany = function (client, companyId) {
    return (0, plan_server_1.companyHasPlan)(client, companyId, { feature: "STORAGE_RULES" });
};
exports.isStorageRulesEnabledForCompany = isStorageRulesEnabledForCompany;
// ---------------------------------------------------------------------------
// Block decision
// ---------------------------------------------------------------------------
/** Any error blocks unconditionally. Warns block until acknowledged. */
var isBlocked = function (violations, acknowledged) {
    for (var i = 0; i < violations.length; i++) {
        if (violations[i].severity === "error")
            return true;
    }
    return violations.length > 0 && !acknowledged;
};
exports.isBlocked = isBlocked;
/**
 * Collapse violations by `ruleId + message`. Call when accumulating results
 * from multiple `evaluateLinesForSurface` invocations (e.g. item pass +
 * storageUnit pass on the same receipt).
 */
var dedupeViolations = function (violations) {
    var seen = new Set();
    var out = [];
    for (var i = 0; i < violations.length; i++) {
        var v = violations[i];
        var key = "".concat(v.ruleId, "\0").concat(v.message);
        if (seen.has(key))
            continue;
        seen.add(key);
        out.push(v);
    }
    return out;
};
exports.dedupeViolations = dedupeViolations;
function getStorageRulesDataForTarget(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, assignmentsRes, libraryRes, assignments, _i, _b, row, joined, rule;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (0, service_1.getRuleAssignmentsForTarget)(client, args),
                        (0, service_1.getStorageRulesList)(client, args.companyId, args.targetType)
                    ])];
                case 1:
                    _a = _e.sent(), assignmentsRes = _a[0], libraryRes = _a[1];
                    assignments = [];
                    for (_i = 0, _b = (_c = assignmentsRes.data) !== null && _c !== void 0 ? _c : []; _i < _b.length; _i++) {
                        row = _b[_i];
                        joined = row.storageRule;
                        rule = Array.isArray(joined) ? joined[0] : joined;
                        if (!rule)
                            continue;
                        assignments.push({
                            ruleId: row.ruleId,
                            rule: rule,
                            inheritedFromId: row.inheritedFromId,
                            inheritedFromName: row.inheritedFromName
                        });
                    }
                    return [2 /*return*/, { assignments: assignments, library: (_d = libraryRes.data) !== null && _d !== void 0 ? _d : [] }];
            }
        });
    });
}
// ---------------------------------------------------------------------------
// Compile
// ---------------------------------------------------------------------------
function loadCompiledRulesForTargets(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var byTarget, _a, data, broadcasts, broadcastFilters, _i, data_1, _b, targetId, rows, compiled, i, row, compiledBroadcasts, i, row;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    byTarget = new Map();
                    return [4 /*yield*/, (0, service_1.getActiveRulesForTargets)(client, args)];
                case 1:
                    _a = _c.sent(), data = _a.data, broadcasts = _a.broadcasts, broadcastFilters = _a.broadcastFilters;
                    for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                        _b = data_1[_i], targetId = _b[0], rows = _b[1];
                        compiled = new Array(rows.length);
                        for (i = 0; i < rows.length; i++) {
                            row = rows[i];
                            compiled[i] = (0, utils_1.compileWithCache)(__assign(__assign({}, row), { conditionAst: row.conditionAst }));
                        }
                        byTarget.set(targetId, compiled);
                    }
                    compiledBroadcasts = new Array(broadcasts.length);
                    for (i = 0; i < broadcasts.length; i++) {
                        row = broadcasts[i];
                        compiledBroadcasts[i] = (0, utils_1.compileWithCache)(__assign(__assign({}, row), { conditionAst: row.conditionAst }));
                    }
                    return [2 /*return*/, { byTarget: byTarget, broadcasts: compiledBroadcasts, broadcastFilters: broadcastFilters }];
            }
        });
    });
}
// Inline-table loaders. Each pulls (id, name) for one entity type scoped by
// company. No ERP-app-utils dependency — keeps this file portable across apps.
var LOADERS = {
    locations: function (c, id) { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, c
                        .from("location")
                        .select("id, name")
                        .eq("companyId", id)];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, (data !== null && data !== void 0 ? data : [])];
            }
        });
    }); },
    storageTypes: function (c, id) { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, c
                        .from("storageType")
                        .select("id, name")
                        .eq("companyId", id)];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, (data !== null && data !== void 0 ? data : [])];
            }
        });
    }); },
    storageUnits: function (c, id) { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, c
                        .from("storageUnit")
                        .select("id, name")
                        .eq("companyId", id)];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, (data !== null && data !== void 0 ? data : [])];
            }
        });
    }); },
    itemPostingGroups: function (c, id) { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, c
                        .from("itemPostingGroup")
                        .select("id, name")
                        .eq("companyId", id)];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, (data !== null && data !== void 0 ? data : [])];
            }
        });
    }); },
    // Static enums — value is already the label.
    itemTypes: null,
    replenishmentSystems: null,
    itemTrackingTypes: null
};
var EMPTY_RESOLVER = function () { return undefined; };
function buildConditionValueResolver(client, companyId, conditions) {
    return __awaiter(this, void 0, void 0, function () {
        var byLoader, _i, conditions_1, cond, def, bucket, _a, _b, v, labels;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    byLoader = new Map();
                    for (_i = 0, conditions_1 = conditions; _i < conditions_1.length; _i++) {
                        cond = conditions_1[_i];
                        def = (0, utils_1.getFieldDef)(cond.field);
                        if (!(def === null || def === void 0 ? void 0 : def.valueOptionsLoader))
                            continue;
                        if (def.type !== "id" && def.type !== "storageUnit")
                            continue;
                        if (LOADERS[def.valueOptionsLoader] === null)
                            continue;
                        if (cond.value == null)
                            continue;
                        bucket = byLoader.get(def.valueOptionsLoader);
                        if (!bucket) {
                            bucket = new Set();
                            byLoader.set(def.valueOptionsLoader, bucket);
                        }
                        if (Array.isArray(cond.value)) {
                            for (_a = 0, _b = cond.value; _a < _b.length; _a++) {
                                v = _b[_a];
                                bucket.add(String(v));
                            }
                        }
                        else {
                            bucket.add(String(cond.value));
                        }
                    }
                    if (byLoader.size === 0)
                        return [2 /*return*/, EMPTY_RESOLVER];
                    labels = new Map();
                    return [4 /*yield*/, Promise.all(Array.from(byLoader.keys()).map(function (loader) { return __awaiter(_this, void 0, void 0, function () {
                            var fn, rows, map, _i, rows_1, r;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        fn = LOADERS[loader];
                                        return [4 /*yield*/, fn(client, companyId)];
                                    case 1:
                                        rows = _a.sent();
                                        map = new Map();
                                        for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                            r = rows_1[_i];
                                            map.set(r.id, r.name);
                                        }
                                        labels.set(loader, map);
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _c.sent();
                    return [2 /*return*/, function (cond) {
                            var _a, _b;
                            if (cond.value == null)
                                return undefined;
                            var def = (0, utils_1.getFieldDef)(cond.field);
                            var map = (def === null || def === void 0 ? void 0 : def.valueOptionsLoader)
                                ? labels.get(def.valueOptionsLoader)
                                : undefined;
                            if (Array.isArray(cond.value)) {
                                if (cond.value.length === 0)
                                    return "—";
                                var out = [];
                                for (var _i = 0, _c = cond.value; _i < _c.length; _i++) {
                                    var v = _c[_i];
                                    var s_1 = String(v);
                                    out.push((_a = map === null || map === void 0 ? void 0 : map.get(s_1)) !== null && _a !== void 0 ? _a : s_1);
                                }
                                return out.join(", ");
                            }
                            var s = String(cond.value);
                            return (_b = map === null || map === void 0 ? void 0 : map.get(s)) !== null && _b !== void 0 ? _b : s;
                        }];
            }
        });
    });
}
var EMPTY_RESULT = {
    violations: [],
    ruleNames: {}
};
var lineTargetIdFor = function (line, targetType) {
    var _a, _b;
    switch (targetType) {
        case "item":
            return (_a = line.itemId) !== null && _a !== void 0 ? _a : null;
        case "workCenter":
            return (_b = line.workCenterId) !== null && _b !== void 0 ? _b : null;
    }
};
function evaluateLinesForSurface(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var targetIds, itemIds, storageUnitIds, workCenterIds, _i, lines_1, line, tid, ancestorsByBin, storageTypesByBin, ids_2, ancestorsRes, ancestorIds, _c, _d, row, chain, _e, chain_1, a, _f, ids_1, id, missing, ancestorRowsRes, _g, _h, row, _j, itemsRes, storageUnitsRes, workCentersRes, compiled, compiledByTarget, broadcastCompiled, broadcastFilters, itemsById, _k, _l, it, row, readable, itemCost, rest, unitsById, _m, _o, u, row, binId, chain, unionedTypes, _p, chain_2, ancestorId, ownTypes, _q, ownTypes_1, t, wcById, _r, _s, w, row, resolveConditionValue, violations, _t, lines_2, line, targetId, seen, compiledForLine, rules, _u, rules_1, r, itemForLine, _v, broadcastCompiled_1, r, filter, ctx, ruleViolations, i, deduped, violatedIds, i, namedRules, ruleNames, _w, _x, r;
        var _y, _z, _0, _1, _2, _3, _4, _5, _6;
        var client = _b.client, companyId = _b.companyId, userId = _b.userId, targetType = _b.targetType, surface = _b.surface, lines = _b.lines;
        return __generator(this, function (_7) {
            switch (_7.label) {
                case 0:
                    if (lines.length === 0)
                        return [2 /*return*/, EMPTY_RESULT];
                    return [4 /*yield*/, (0, exports.isStorageRulesEnabledForCompany)(client, companyId)];
                case 1:
                    if (!(_7.sent()))
                        return [2 /*return*/, EMPTY_RESULT];
                    targetIds = new Set();
                    itemIds = new Set();
                    storageUnitIds = new Set();
                    workCenterIds = new Set();
                    for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                        line = lines_1[_i];
                        tid = lineTargetIdFor(line, targetType);
                        if (tid)
                            targetIds.add(tid);
                        if (line.itemId)
                            itemIds.add(line.itemId);
                        if (line.storageUnitId)
                            storageUnitIds.add(line.storageUnitId);
                        if (line.workCenterId)
                            workCenterIds.add(line.workCenterId);
                        if ((_y = line.operation) === null || _y === void 0 ? void 0 : _y.itemId)
                            itemIds.add(line.operation.itemId);
                    }
                    ancestorsByBin = new Map();
                    storageTypesByBin = new Map();
                    if (!(storageUnitIds.size > 0)) return [3 /*break*/, 4];
                    ids_2 = Array.from(storageUnitIds);
                    return [4 /*yield*/, client
                            .from("storageUnits_recursive")
                            .select("id, ancestorPath, storageTypeIds")
                            .in("id", ids_2)
                            .eq("companyId", companyId)];
                case 2:
                    ancestorsRes = _7.sent();
                    ancestorIds = new Set();
                    for (_c = 0, _d = ((_z = ancestorsRes.data) !== null && _z !== void 0 ? _z : []); _c < _d.length; _c++) {
                        row = _d[_c];
                        chain = row.ancestorPath && row.ancestorPath.length > 0
                            ? row.ancestorPath
                            : [row.id];
                        ancestorsByBin.set(row.id, chain);
                        if (row.storageTypeIds)
                            storageTypesByBin.set(row.id, row.storageTypeIds);
                        for (_e = 0, chain_1 = chain; _e < chain_1.length; _e++) {
                            a = chain_1[_e];
                            ancestorIds.add(a);
                        }
                    }
                    for (_f = 0, ids_1 = ids_2; _f < ids_1.length; _f++) {
                        id = ids_1[_f];
                        if (!ancestorsByBin.has(id))
                            ancestorsByBin.set(id, [id]);
                    }
                    missing = Array.from(ancestorIds).filter(function (id) { return !storageTypesByBin.has(id) && !ids_2.includes(id); });
                    if (!(missing.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("storageUnits_recursive")
                            .select("id, storageTypeIds")
                            .in("id", missing)
                            .eq("companyId", companyId)];
                case 3:
                    ancestorRowsRes = _7.sent();
                    for (_g = 0, _h = ((_0 = ancestorRowsRes.data) !== null && _0 !== void 0 ? _0 : []); _g < _h.length; _g++) {
                        row = _h[_g];
                        if (row.storageTypeIds)
                            storageTypesByBin.set(row.id, row.storageTypeIds);
                    }
                    _7.label = 4;
                case 4: return [4 /*yield*/, Promise.all([
                        itemIds.size > 0
                            ? client
                                .from("item")
                                // `itemPostingGroupId` lives on the 1:1 `itemCost` row — embed it
                                // so the `item.itemPostingGroupId` rule field resolves.
                                .select("id, type, replenishmentSystem, itemTrackingType, name, readableId, itemCost(itemPostingGroupId)")
                                .in("id", Array.from(itemIds))
                            : Promise.resolve({ data: [], error: null }),
                        storageUnitIds.size > 0
                            ? client
                                .from("storageUnit")
                                .select("id, storageTypeIds, warehouseId, name, locationId")
                                .in("id", Array.from(storageUnitIds))
                            : Promise.resolve({ data: [], error: null }),
                        workCenterIds.size > 0
                            ? client
                                .from("workCenter")
                                .select("id, locationId, active, name")
                                .in("id", Array.from(workCenterIds))
                            : Promise.resolve({ data: [], error: null }),
                        loadCompiledRulesForTargets(client, {
                            targetType: targetType,
                            targetIds: Array.from(targetIds),
                            companyId: companyId
                        })
                    ])];
                case 5:
                    _j = _7.sent(), itemsRes = _j[0], storageUnitsRes = _j[1], workCentersRes = _j[2], compiled = _j[3];
                    compiledByTarget = compiled.byTarget;
                    broadcastCompiled = compiled.broadcasts;
                    broadcastFilters = compiled.broadcastFilters;
                    // If neither explicit assignments nor broadcasts exist, nothing can fire.
                    if (compiledByTarget.size === 0 && broadcastCompiled.length === 0)
                        return [2 /*return*/, EMPTY_RESULT];
                    itemsById = new Map();
                    for (_k = 0, _l = (_1 = itemsRes.data) !== null && _1 !== void 0 ? _1 : []; _k < _l.length; _k++) {
                        it = _l[_k];
                        row = it;
                        readable = row.readableId;
                        itemCost = row.itemCost, rest = __rest(row, ["itemCost"]);
                        itemsById.set(row.id, __assign(__assign({}, rest), { id: readable !== null && readable !== void 0 ? readable : row.id, itemPostingGroupId: (_2 = (0, context_1.itemPostingGroupIdFromEmbed)(itemCost)) !== null && _2 !== void 0 ? _2 : undefined }));
                    }
                    unitsById = new Map();
                    for (_m = 0, _o = (_3 = storageUnitsRes.data) !== null && _3 !== void 0 ? _3 : []; _m < _o.length; _m++) {
                        u = _o[_m];
                        row = u;
                        binId = row.id;
                        chain = (_4 = ancestorsByBin.get(binId)) !== null && _4 !== void 0 ? _4 : [binId];
                        unionedTypes = new Set();
                        for (_p = 0, chain_2 = chain; _p < chain_2.length; _p++) {
                            ancestorId = chain_2[_p];
                            ownTypes = ancestorId === binId
                                ? row.storageTypeIds
                                : storageTypesByBin.get(ancestorId);
                            if (ownTypes)
                                for (_q = 0, ownTypes_1 = ownTypes; _q < ownTypes_1.length; _q++) {
                                    t = ownTypes_1[_q];
                                    unionedTypes.add(t);
                                }
                        }
                        unitsById.set(binId, __assign(__assign({}, row), { storageTypeId: unionedTypes.size > 0 ? Array.from(unionedTypes) : undefined }));
                    }
                    wcById = new Map();
                    for (_r = 0, _s = (_5 = workCentersRes.data) !== null && _5 !== void 0 ? _5 : []; _r < _s.length; _r++) {
                        w = _s[_r];
                        row = w;
                        wcById.set(row.id, __assign({}, row));
                    }
                    return [4 /*yield*/, buildConditionValueResolver(client, companyId, iterateConditions(compiledByTarget, broadcastCompiled))];
                case 6:
                    resolveConditionValue = _7.sent();
                    violations = [];
                    for (_t = 0, lines_2 = lines; _t < lines_2.length; _t++) {
                        line = lines_2[_t];
                        targetId = lineTargetIdFor(line, targetType);
                        seen = new Set();
                        compiledForLine = [];
                        if (targetId) {
                            rules = compiledByTarget.get(targetId);
                            if (rules) {
                                for (_u = 0, rules_1 = rules; _u < rules_1.length; _u++) {
                                    r = rules_1[_u];
                                    if (seen.has(r.id))
                                        continue;
                                    seen.add(r.id);
                                    compiledForLine.push(r);
                                }
                            }
                        }
                        itemForLine = targetType === "item" && line.itemId
                            ? itemsById.get(line.itemId)
                            : undefined;
                        for (_v = 0, broadcastCompiled_1 = broadcastCompiled; _v < broadcastCompiled_1.length; _v++) {
                            r = broadcastCompiled_1[_v];
                            if (seen.has(r.id))
                                continue;
                            if (targetType === "item") {
                                if (!itemForLine)
                                    continue;
                                filter = (_6 = broadcastFilters.get(r.id)) !== null && _6 !== void 0 ? _6 : {};
                                if (!(0, utils_1.itemRuleAppliesToItem)(itemForLine, filter))
                                    continue;
                            }
                            seen.add(r.id);
                            compiledForLine.push(r);
                        }
                        if (compiledForLine.length === 0)
                            continue;
                        ctx = (0, context_1.buildLineContext)({
                            line: line,
                            surface: surface,
                            userId: userId,
                            item: line.itemId ? itemsById.get(line.itemId) : undefined,
                            storageUnit: line.storageUnitId
                                ? unitsById.get(line.storageUnitId)
                                : undefined,
                            workCenter: line.workCenterId ? wcById.get(line.workCenterId) : undefined
                        });
                        ruleViolations = (0, utils_1.evaluateRules)(compiledForLine, ctx, surface, {
                            resolveConditionValue: resolveConditionValue
                        });
                        for (i = 0; i < ruleViolations.length; i++) {
                            violations.push(ruleViolations[i]);
                        }
                    }
                    deduped = (0, exports.dedupeViolations)(violations);
                    if (deduped.length === 0) {
                        return [2 /*return*/, { violations: deduped, ruleNames: {} }];
                    }
                    violatedIds = new Set();
                    for (i = 0; i < deduped.length; i++)
                        violatedIds.add(deduped[i].ruleId);
                    return [4 /*yield*/, client
                            .from("storageRule")
                            .select("id, name")
                            .in("id", Array.from(violatedIds))
                            .eq("companyId", companyId)];
                case 7:
                    namedRules = (_7.sent()).data;
                    ruleNames = {};
                    for (_w = 0, _x = namedRules !== null && namedRules !== void 0 ? namedRules : []; _w < _x.length; _w++) {
                        r = _x[_w];
                        ruleNames[r.id] = r.name;
                    }
                    return [2 /*return*/, { violations: deduped, ruleNames: ruleNames }];
            }
        });
    });
}
function iterateConditions(compiledByTarget, broadcasts) {
    var _i, _a, rules, i, rule, conds, j, i, conds, j;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _i = 0, _a = compiledByTarget.values();
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                rules = _a[_i];
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < rules.length)) return [3 /*break*/, 7];
                rule = rules[i];
                conds = rule.conditions;
                j = 0;
                _b.label = 3;
            case 3:
                if (!(j < conds.length)) return [3 /*break*/, 6];
                return [4 /*yield*/, conds[j]];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                j++;
                return [3 /*break*/, 3];
            case 6:
                i++;
                return [3 /*break*/, 2];
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8:
                i = 0;
                _b.label = 9;
            case 9:
                if (!(i < broadcasts.length)) return [3 /*break*/, 14];
                conds = broadcasts[i].conditions;
                j = 0;
                _b.label = 10;
            case 10:
                if (!(j < conds.length)) return [3 /*break*/, 13];
                return [4 /*yield*/, conds[j]];
            case 11:
                _b.sent();
                _b.label = 12;
            case 12:
                j++;
                return [3 /*break*/, 10];
            case 13:
                i++;
                return [3 /*break*/, 9];
            case 14: return [2 /*return*/];
        }
    });
}
