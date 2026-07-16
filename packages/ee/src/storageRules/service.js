"use strict";
// Cross-app DB queries for Storage Rules. Both ERP (admin UI, item/storage
// surfaces) and MES (workCenter surfaces) import from here.
//
// ERP-only admin CRUD (list/upsert/delete) stays in the ERP module — it
// depends on ERP request-utils (GenericQueryFilters, sanitize) that don't
// belong in the EE package.
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
exports.getActiveRulesForTargets = getActiveRulesForTargets;
exports.getRuleAssignmentsForTarget = getRuleAssignmentsForTarget;
exports.getStorageRulesList = getStorageRulesList;
exports.assignStorageRule = assignStorageRule;
exports.unassignStorageRule = unassignStorageRule;
var database_1 = require("@carbon/database");
var utils_1 = require("@carbon/utils");
var context_1 = require("./context");
// Nullable filter columns appended to broadcast selects for item-target rules.
var ITEM_RULE_FILTER_COLUMNS = "filteredItemTypes, filteredItemGroupIds, filteredItemMatchAll";
var assignmentTableFor = function (targetType) {
    switch (targetType) {
        case "item":
            return "storageRuleItemAssignment";
        case "workCenter":
            return "storageRuleWorkCenterAssignment";
    }
};
var targetIdColumnFor = function (targetType) {
    switch (targetType) {
        case "item":
            return "itemId";
        case "workCenter":
            return "workCenterId";
    }
};
/**
 * Loads active rules applicable to a set of targets of one targetType.
 *
 * `data` keys are targetIds (explicit-assignment rules only).
 * `broadcasts` carries rules that fire beyond explicit assignments — caller
 * merges them into every line:
 *   - item targets: EVERY active item rule broadcasts, then the caller gates it
 *     per line via the rule's `filteredItem*` filters (see `broadcastFilters`);
 *     empty filters = every item.
 *   - workCenter targets: rules with `appliesToAll = TRUE` only.
 *
 * `broadcastFilters` maps ruleId → item type/group filter (item targets only).
 *
 * Two round-trips: explicit-assignments + broadcast. Broadcast fetch always
 * runs, even when `targetIds` is empty, so a request with no explicit target
 * still sees broadcasts.
 */
function getActiveRulesForTargets(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var out, broadcastFilters, ruleCols, isItem, broadcastCols, table, idCol, broadcastBase, _a, explicit, broadcast, _i, _b, r, row, targetId, node, bucket, broadcasts, _c, broadcasts_1, row;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    out = new Map();
                    broadcastFilters = new Map();
                    ruleCols = "id, targetType, severity, message, conditionAst, surfaces, updatedAt, active";
                    isItem = args.targetType === "item";
                    broadcastCols = isItem
                        ? "".concat(ruleCols, ", ").concat(ITEM_RULE_FILTER_COLUMNS)
                        : ruleCols;
                    table = assignmentTableFor(args.targetType);
                    idCol = targetIdColumnFor(args.targetType);
                    broadcastBase = client
                        .from("storageRule")
                        .select(broadcastCols)
                        .eq("companyId", args.companyId)
                        .eq("targetType", args.targetType)
                        .eq("active", true);
                    return [4 /*yield*/, Promise.all([
                            args.targetIds.length > 0
                                ? client
                                    .from(table)
                                    .select("".concat(idCol, ", storageRule:ruleId(").concat(ruleCols, ")"))
                                    .in(idCol, args.targetIds)
                                    .eq("companyId", args.companyId)
                                : Promise.resolve({ data: [], error: null }),
                            // Item rules all broadcast (filtered per item); non-item only when appliesToAll.
                            isItem ? broadcastBase : broadcastBase.eq("appliesToAll", true)
                        ])];
                case 1:
                    _a = _f.sent(), explicit = _a[0], broadcast = _a[1];
                    if (explicit.error)
                        return [2 /*return*/, {
                                data: out,
                                broadcasts: [],
                                broadcastFilters: broadcastFilters,
                                error: explicit.error
                            }];
                    if (broadcast.error)
                        return [2 /*return*/, {
                                data: out,
                                broadcasts: [],
                                broadcastFilters: broadcastFilters,
                                error: broadcast.error
                            }];
                    for (_i = 0, _b = (_d = explicit.data) !== null && _d !== void 0 ? _d : []; _i < _b.length; _i++) {
                        r = _b[_i];
                        row = r;
                        targetId = row[idCol];
                        node = Array.isArray(row.storageRule)
                            ? row.storageRule[0]
                            : row.storageRule;
                        if (!node || node.active === false)
                            continue;
                        if (node.targetType !== args.targetType)
                            continue;
                        bucket = out.get(targetId);
                        if (bucket)
                            bucket.push(node);
                        else
                            out.set(targetId, [node]);
                    }
                    broadcasts = ((_e = broadcast.data) !== null && _e !== void 0 ? _e : []);
                    if (isItem) {
                        for (_c = 0, broadcasts_1 = broadcasts; _c < broadcasts_1.length; _c++) {
                            row = broadcasts_1[_c];
                            broadcastFilters.set(row.id, (0, utils_1.toItemRuleFilter)(row));
                        }
                    }
                    return [2 /*return*/, { data: out, broadcasts: broadcasts, broadcastFilters: broadcastFilters, error: null }];
            }
        });
    });
}
function getRuleAssignmentsForTarget(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var table, idCol, lookupIds, isItem, baseBroadcastCols, broadcastCols, broadcastBase, _a, res, broadcastsRes, itemCtxRes, itemCtx, byRuleId, _i, _b, r, row, ownerId, node, candidate, _c, _d, b, label, filter, filterless;
        var _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    table = assignmentTableFor(args.targetType);
                    idCol = targetIdColumnFor(args.targetType);
                    lookupIds = [args.targetId];
                    isItem = args.targetType === "item";
                    baseBroadcastCols = "id, name, targetType, severity, message, active, surfaces, appliesToAll, createdAt";
                    broadcastCols = isItem
                        ? "".concat(baseBroadcastCols, ", ").concat(ITEM_RULE_FILTER_COLUMNS)
                        : baseBroadcastCols;
                    broadcastBase = client
                        .from("storageRule")
                        .select(broadcastCols)
                        .eq("companyId", args.companyId)
                        .eq("targetType", args.targetType);
                    return [4 /*yield*/, Promise.all([
                            client
                                .from(table)
                                .select("".concat(idCol, ", ruleId, createdAt, storageRule:ruleId(id, name, targetType, severity, message, active, surfaces, appliesToAll)"))
                                .in(idCol, lookupIds)
                                .eq("companyId", args.companyId),
                            isItem ? broadcastBase : broadcastBase.eq("appliesToAll", true),
                            // Item type/group for this target so we can gate item broadcasts the same
                            // way the evaluator does.
                            isItem
                                ? client
                                    .from("item")
                                    .select("type, itemCost(itemPostingGroupId)")
                                    .eq("id", args.targetId)
                                    .eq("companyId", args.companyId)
                                    .maybeSingle()
                                : Promise.resolve({ data: null, error: null })
                        ])];
                case 1:
                    _a = _m.sent(), res = _a[0], broadcastsRes = _a[1], itemCtxRes = _a[2];
                    if (res.error)
                        return [2 /*return*/, { data: [], error: res.error }];
                    if (broadcastsRes.error)
                        return [2 /*return*/, { data: [], error: broadcastsRes.error }];
                    if (itemCtxRes.error)
                        return [2 /*return*/, { data: [], error: itemCtxRes.error }];
                    itemCtx = (function () {
                        var row = itemCtxRes.data;
                        if (!row)
                            return null;
                        return {
                            type: row.type,
                            itemPostingGroupId: (0, context_1.itemPostingGroupIdFromEmbed)(row.itemCost)
                        };
                    })();
                    byRuleId = new Map();
                    for (_i = 0, _b = (_e = res.data) !== null && _e !== void 0 ? _e : []; _i < _b.length; _i++) {
                        r = _b[_i];
                        row = r;
                        ownerId = row[idCol];
                        node = Array.isArray(row.storageRule)
                            ? row.storageRule[0]
                            : row.storageRule;
                        if (!node)
                            continue;
                        candidate = {
                            ownerId: ownerId,
                            ruleId: row.ruleId,
                            createdAt: (_f = row.createdAt) !== null && _f !== void 0 ? _f : null,
                            storageRule: node,
                            inheritedFromId: null,
                            inheritedFromName: null
                        };
                        if (!byRuleId.has(candidate.ruleId)) {
                            byRuleId.set(candidate.ruleId, candidate);
                        }
                    }
                    // Append broadcasts as synthetic rows. Sentinel `__all__` ownerId distinguishes
                    // them from real assignment rows; UI keys off `inheritedFromId === "__all__"`
                    // or the rule's `appliesToAll` flag to render the "Applies to all" badge and
                    // suppress unassign. Skip when already present as an explicit row (shouldn't
                    // happen in practice — broadcast rules can't be assigned — but be defensive).
                    // `as unknown as`: dynamic select → PostgREST `GenericStringError` row type.
                    for (_c = 0, _d = ((_g = broadcastsRes.data) !== null && _g !== void 0 ? _g : []); _c < _d.length; _c++) {
                        b = _d[_c];
                        if (b.active === false)
                            continue;
                        if (byRuleId.has(b.id))
                            continue;
                        label = "Applies to all";
                        if (isItem) {
                            filter = (0, utils_1.toItemRuleFilter)(b);
                            if (itemCtx && !(0, utils_1.itemRuleAppliesToItem)(itemCtx, filter))
                                continue;
                            filterless = ((_j = (_h = filter.filteredItemTypes) === null || _h === void 0 ? void 0 : _h.length) !== null && _j !== void 0 ? _j : 0) === 0 &&
                                ((_l = (_k = filter.filteredItemGroupIds) === null || _k === void 0 ? void 0 : _k.length) !== null && _l !== void 0 ? _l : 0) === 0;
                            label = filterless ? "All items" : "Matches item filters";
                        }
                        byRuleId.set(b.id, {
                            ownerId: "__all__",
                            ruleId: b.id,
                            createdAt: b.createdAt,
                            storageRule: {
                                id: b.id,
                                name: b.name,
                                targetType: b.targetType,
                                severity: b.severity,
                                message: b.message,
                                active: b.active,
                                surfaces: b.surfaces,
                                appliesToAll: b.appliesToAll
                            },
                            inheritedFromId: "__all__",
                            inheritedFromName: label
                        });
                    }
                    return [2 /*return*/, { data: Array.from(byRuleId.values()), error: null }];
            }
        });
    });
}
function getStorageRulesList(client, companyId, targetType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "storageRule", "id, name, targetType, severity, active, appliesToAll, surfaces", function (query) {
                    var q = query.eq("companyId", companyId).order("name");
                    if (targetType)
                        q = q.eq("targetType", targetType);
                    return q;
                })];
        });
    });
}
function assignStorageRule(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var table, idCol, ruleRes;
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    table = assignmentTableFor(args.targetType);
                    idCol = targetIdColumnFor(args.targetType);
                    return [4 /*yield*/, client
                            .from("storageRule")
                            .select("id, targetType")
                            .eq("id", args.ruleId)
                            .eq("companyId", args.companyId)
                            .single()];
                case 1:
                    ruleRes = _c.sent();
                    if (ruleRes.error || !ruleRes.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_b = ruleRes.error) !== null && _b !== void 0 ? _b : new Error("Rule not found")
                            }];
                    }
                    if (ruleRes.data.targetType !== args.targetType) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Rule targetType \"".concat(ruleRes.data.targetType, "\" does not match \"").concat(args.targetType, "\""))
                            }];
                    }
                    return [2 /*return*/, client
                            .from(table)
                            .insert((_a = {},
                            _a[idCol] = args.targetId,
                            _a.ruleId = args.ruleId,
                            _a.companyId = args.companyId,
                            _a.createdBy = args.userId,
                            _a))
                            .select("".concat(idCol, ", ruleId"))
                            .single()];
            }
        });
    });
}
function unassignStorageRule(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var table, idCol;
        return __generator(this, function (_a) {
            table = assignmentTableFor(args.targetType);
            idCol = targetIdColumnFor(args.targetType);
            return [2 /*return*/, client
                    .from(table)
                    .delete()
                    .eq(idCol, args.targetId)
                    .eq("ruleId", args.ruleId)];
        });
    });
}
