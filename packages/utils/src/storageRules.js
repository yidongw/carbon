"use strict";
// Storage Rules evaluator. AST → JIT-compiled closure with LRU cache.
// Used server-side on transactions (receipt, shipment, stock transfer,
// inventory adjustment, place, pick, operation start/finish, material
// issue/receive) to enforce per-entity validation/guideline rules.
//
// Each rule binds to a single `TargetType` (`item` or `workCenter`). The field
// registry lives in `./field-registry`.
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
exports.getFieldSurfaceNotes = exports.getFieldsForTargetTypeAndSurfaces = exports.isFieldAvailableOnSurfaces = exports.SURFACE_CONTEXT_AVAILABILITY = exports.toItemRuleFilter = exports.itemRuleAppliesToItem = exports.evaluateRules = exports.interpolateMessage = exports.__storageRulesCacheSize = exports.__resetStorageRulesCache = exports.compileWithCache = exports.compileRule = exports.buildResolver = exports.SURFACES_BY_TARGET_TYPE = exports.TRANSACTION_SURFACES = exports.TARGET_TYPES = void 0;
var field_registry_1 = require("./field-registry");
/**
 * Which entity a rule applies to. Drives the field registry slice the
 * builder shows the author, and the assignment table the loader joins.
 * Mirrors the Postgres ENUM `storageRuleTargetType`.
 */
exports.TARGET_TYPES = ["item", "workCenter"];
/**
 * Transaction surfaces a rule may opt into. Mirrors the Postgres ENUM
 * `transactionSurface`. After `bun run db:types` regenerates the database
 * types, tighten this to:
 *
 *   import type { Database } from "@carbon/database";
 *   ...as const satisfies readonly Database["public"]["Enums"]["transactionSurface"][];
 *
 * The runtime array stays the source of truth for the validator's `z.enum`.
 */
exports.TRANSACTION_SURFACES = [
    "receipt",
    "shipment",
    "stockTransfer",
    "warehouseTransfer",
    "inventoryAdjustment",
    "place",
    "pick",
    "operationStart",
    "operationFinish",
    "materialIssue",
    "materialReceive"
];
/**
 * Which surfaces are valid for each target type. The form validator narrows
 * a rule's `surfaces` array against this map; the evaluator skips surfaces
 * a rule didn't subscribe to.
 *
 * Item rules own every inventory/storage surface — including `place`/`pick`
 * (bin-level guards that used to live on the now-removed `storageUnit` target).
 * They reference bin context via the `storageUnit.*` fields in the registry.
 */
exports.SURFACES_BY_TARGET_TYPE = {
    item: [
        "receipt",
        "shipment",
        "stockTransfer",
        "warehouseTransfer",
        "inventoryAdjustment",
        "place",
        "pick"
    ],
    workCenter: [
        "operationStart",
        "operationFinish",
        "materialIssue",
        "materialReceive"
    ]
};
var ROOT_KEYS = new Set([
    "item",
    "shelf",
    "storageUnit",
    "workCenter",
    "operation",
    "transaction"
]);
var buildResolver = function (path) {
    var segments = path.split(".");
    if (segments.length < 2 || !ROOT_KEYS.has(segments[0])) {
        return function () { return undefined; };
    }
    return function (ctx) {
        var cur = ctx[segments[0]];
        for (var i = 1; i < segments.length; i++) {
            if (cur == null || typeof cur !== "object")
                return undefined;
            cur = cur[segments[i]];
        }
        return cur;
    };
};
exports.buildResolver = buildResolver;
// ---------------------------------------------------------------------------
// Operator implementations (pure)
// ---------------------------------------------------------------------------
var isNullish = function (v) { return v === null || v === undefined; };
var eqAnyArrayLeft = function (l, r) {
    for (var i = 0; i < l.length; i++)
        if (l[i] === r)
            return true;
    return false;
};
var inAnyArrayLeft = function (l, r) {
    for (var i = 0; i < l.length; i++)
        if (r.includes(l[i]))
            return true;
    return false;
};
var operatorFns = {
    eq: function (l, r) { return (Array.isArray(l) ? eqAnyArrayLeft(l, r) : l === r); },
    neq: function (l, r) { return (Array.isArray(l) ? !eqAnyArrayLeft(l, r) : l !== r); },
    in: function (l, r) {
        return Array.isArray(r) &&
            (Array.isArray(l) ? inAnyArrayLeft(l, r) : r.includes(l));
    },
    notIn: function (l, r) {
        return Array.isArray(r) &&
            (Array.isArray(l) ? !inAnyArrayLeft(l, r) : !r.includes(l));
    },
    isSet: function (l) { return (Array.isArray(l) ? l.length > 0 : !isNullish(l) && l !== ""); },
    isNotSet: function (l) {
        return Array.isArray(l) ? l.length === 0 : isNullish(l) || l === "";
    },
    gt: function (l, r) { return typeof l === "number" && typeof r === "number" && l > r; },
    lt: function (l, r) { return typeof l === "number" && typeof r === "number" && l < r; }
};
// ---------------------------------------------------------------------------
// Compiler
// ---------------------------------------------------------------------------
var compileCondition = function (cond) {
    var resolve = (0, exports.buildResolver)(cond.field);
    var op = operatorFns[cond.op];
    if (!op)
        return function () { return false; };
    var value = cond.value;
    return function (ctx) { return op(resolve(ctx), value); };
};
var compilePredicate = function (ast) {
    if (!ast || !Array.isArray(ast.conditions))
        return function () { return false; };
    var kind = ast.kind;
    if (kind !== "all" && kind !== "any" && kind !== "none")
        return function () { return false; };
    if (ast.conditions.length === 0) {
        return kind === "all" || kind === "none" ? function () { return true; } : function () { return false; };
    }
    var fns = ast.conditions.map(compileCondition);
    if (kind === "all") {
        return function (ctx) {
            for (var i = 0; i < fns.length; i++) {
                if (!fns[i](ctx))
                    return false;
            }
            return true;
        };
    }
    if (kind === "any") {
        return function (ctx) {
            for (var i = 0; i < fns.length; i++) {
                if (fns[i](ctx))
                    return true;
            }
            return false;
        };
    }
    return function (ctx) {
        for (var i = 0; i < fns.length; i++) {
            if (fns[i](ctx))
                return false;
        }
        return true;
    };
};
var defaultSurfacesFor = function (targetType) { return exports.SURFACES_BY_TARGET_TYPE[targetType]; };
var compileRule = function (row) { return ({
    id: row.id,
    targetType: row.targetType,
    severity: row.severity,
    rawMessage: row.message,
    surfaces: row.surfaces && row.surfaces.length > 0
        ? row.surfaces
        : __spreadArray([], defaultSurfacesFor(row.targetType), true),
    conditions: row.conditionAst && Array.isArray(row.conditionAst.conditions)
        ? row.conditionAst.conditions
        : [],
    requiredFieldChecks: (row.conditionAst &&
        Array.isArray(row.conditionAst.conditions)
        ? row.conditionAst.conditions
        : [])
        .filter(function (c) { return c.op !== "isSet" && c.op !== "isNotSet"; })
        .map(function (c) { return ({ field: c.field, resolve: (0, exports.buildResolver)(c.field) }); }),
    predicate: compilePredicate(row.conditionAst)
}); };
exports.compileRule = compileRule;
// ---------------------------------------------------------------------------
// LRU cache (process-scoped, FIFO eviction at cap)
// ---------------------------------------------------------------------------
var CACHE_CAP = 256;
var cache = new Map();
var fnv1a = function (s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h.toString(36);
};
var cacheKey = function (row) {
    var _a, _b;
    // Hash bits that drive compilation output, including targetType so two
    // rules with identical AST but different targets cannot collide.
    var contentHash = fnv1a("".concat(row.targetType, "|").concat(row.message, "|").concat(JSON.stringify(row.conditionAst), "|").concat(((_a = row.surfaces) !== null && _a !== void 0 ? _a : []).join(",")));
    return "".concat(row.id, ":").concat((_b = row.updatedAt) !== null && _b !== void 0 ? _b : "", ":").concat(contentHash);
};
var compileWithCache = function (row) {
    var key = cacheKey(row);
    var hit = cache.get(key);
    if (hit) {
        cache.delete(key);
        cache.set(key, hit);
        return hit;
    }
    var compiled = (0, exports.compileRule)(row);
    cache.set(key, compiled);
    if (cache.size > CACHE_CAP) {
        var oldest = cache.keys().next().value;
        if (oldest !== undefined)
            cache.delete(oldest);
    }
    return compiled;
};
exports.compileWithCache = compileWithCache;
var __resetStorageRulesCache = function () {
    cache.clear();
};
exports.__resetStorageRulesCache = __resetStorageRulesCache;
var __storageRulesCacheSize = function () { return cache.size; };
exports.__storageRulesCacheSize = __storageRulesCacheSize;
// ---------------------------------------------------------------------------
// Message interpolation
// ---------------------------------------------------------------------------
var TOKEN_RE = /\{(condition\[\d+\]\.(?:field|operator|value|name)|[a-zA-Z_][\w.]*)\}/g;
var CONDITION_TOKEN_RE = /^condition\[(\d+)\]\.(field|operator|value|name)$/;
var OPERATOR_LABELS = {
    eq: "equals",
    neq: "not equals",
    in: "is one of",
    notIn: "is none of",
    isSet: "is set",
    isNotSet: "is not set",
    gt: "greater than",
    lt: "less than"
};
var formatConditionValue = function (value) {
    if (value == null || value === "")
        return "—";
    if (Array.isArray(value)) {
        if (value.length === 0)
            return "—";
        return value.map(function (v) { return String(v); }).join(", ");
    }
    return String(value);
};
var interpolateMessage = function (template, ctx, options) {
    if (options === void 0) { options = {}; }
    var conditions = options.conditions, resolveConditionValue = options.resolveConditionValue;
    return template.replace(TOKEN_RE, function (_match, raw) {
        var _a, _b, _c;
        var condMatch = CONDITION_TOKEN_RE.exec(raw);
        if (condMatch) {
            var idx = Number(condMatch[1]);
            var prop = condMatch[2];
            var cond = conditions === null || conditions === void 0 ? void 0 : conditions[idx];
            if (!cond)
                return "—";
            switch (prop) {
                case "field":
                    return (_b = (_a = (0, field_registry_1.getFieldDef)(cond.field)) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : cond.field;
                case "operator":
                    return (_c = OPERATOR_LABELS[cond.op]) !== null && _c !== void 0 ? _c : cond.op;
                case "value":
                    // Raw stored id / input value, no label resolution. Use `.name`
                    // for the human-readable label.
                    if (cond.op === "isSet" || cond.op === "isNotSet")
                        return "—";
                    return formatConditionValue(cond.value);
                case "name":
                    // Human-readable label for the value (e.g. id → name via the
                    // field's value-options loader). Falls back to the raw value when
                    // no resolver is supplied or the id has no matching label.
                    if (cond.op === "isSet" || cond.op === "isNotSet")
                        return "—";
                    if (resolveConditionValue) {
                        var resolved = resolveConditionValue(cond, idx);
                        if (resolved !== undefined)
                            return resolved;
                    }
                    return formatConditionValue(cond.value);
            }
        }
        var value = (0, exports.buildResolver)(raw)(ctx);
        if (value == null || value === "")
            return "—";
        return String(value);
    });
};
exports.interpolateMessage = interpolateMessage;
var findFirstMissingRequiredField = function (rule, ctx) {
    var checks = rule.requiredFieldChecks;
    for (var i = 0; i < checks.length; i++) {
        var c = checks[i];
        var value = c.resolve(ctx);
        if (value === null ||
            value === undefined ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)) {
            return c.field;
        }
    }
    return null;
};
var buildRequiredFieldMessage = function (_rule, fieldPath) {
    var _a, _b;
    var label = (_b = (_a = (0, field_registry_1.getFieldDef)(fieldPath)) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : fieldPath;
    return "".concat(label, " is required");
};
var evaluateRules = function (rules, ctx, surface, opts) {
    var out = [];
    var resolveConditionValue = opts === null || opts === void 0 ? void 0 : opts.resolveConditionValue;
    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (!rule.surfaces.includes(surface))
            continue;
        var missing = findFirstMissingRequiredField(rule, ctx);
        if (missing !== null) {
            out.push({
                ruleId: rule.id,
                severity: rule.severity,
                message: buildRequiredFieldMessage(rule, missing)
            });
            continue;
        }
        if (rule.predicate(ctx))
            continue;
        out.push({
            ruleId: rule.id,
            severity: rule.severity,
            message: (0, exports.interpolateMessage)(rule.rawMessage, ctx, {
                conditions: rule.conditions,
                resolveConditionValue: resolveConditionValue
            })
        });
    }
    return out;
};
exports.evaluateRules = evaluateRules;
var itemRuleAppliesToItem = function (item, f) {
    var _a, _b;
    var types = (_a = f.filteredItemTypes) !== null && _a !== void 0 ? _a : [];
    var groups = (_b = f.filteredItemGroupIds) !== null && _b !== void 0 ? _b : [];
    if (types.length === 0 && groups.length === 0)
        return true; // empty = all
    // `null` = dimension not constrained; it drops out of the combination so a
    // single set dimension behaves identically under OR and AND.
    var typeMatch = types.length ? types.includes(item.type) : null;
    var groupMatch = groups.length
        ? item.itemPostingGroupId != null &&
            groups.includes(item.itemPostingGroupId)
        : null;
    return f.filteredItemMatchAll
        ? (typeMatch !== null && typeMatch !== void 0 ? typeMatch : true) && (groupMatch !== null && groupMatch !== void 0 ? groupMatch : true)
        : (typeMatch !== null && typeMatch !== void 0 ? typeMatch : false) || (groupMatch !== null && groupMatch !== void 0 ? groupMatch : false);
};
exports.itemRuleAppliesToItem = itemRuleAppliesToItem;
/** Normalize a raw `storageRule` row's nullable filter columns into a filter. */
var toItemRuleFilter = function (row) {
    var _a, _b, _c;
    return ({
        filteredItemTypes: (_a = row.filteredItemTypes) !== null && _a !== void 0 ? _a : [],
        filteredItemGroupIds: (_b = row.filteredItemGroupIds) !== null && _b !== void 0 ? _b : [],
        filteredItemMatchAll: (_c = row.filteredItemMatchAll) !== null && _c !== void 0 ? _c : false
    });
};
exports.toItemRuleFilter = toItemRuleFilter;
// ---------------------------------------------------------------------------
// Per-surface context availability — single source of truth for "which field
// may a rule reference given the surfaces it subscribes to"
// ---------------------------------------------------------------------------
//
// Declares which root `FieldContext`s the evaluator STRUCTURALLY builds in
// `RuleContext` for each surface. "Structurally" = the evaluator constructs that
// root context for the surface at all; whether a given line's value is null is a
// separate, allowed concern handled by `isSet`/`isNotSet` (see `nullable`). This
// turns the prose in `STORAGE_UNIT_NOTES` / "Not populated" into enforced data so
// the builder/validator can never offer or accept a field that won't resolve.
//
// Note `"storage"` is the `FieldContext` value; it maps to the `storageUnit`
// RuleContext root key.
//
// Locked by the anti-drift test in `packages/ee/src/storageRules/server.test.ts`,
// which asserts the ctx `evaluateLinesForSurface` builds for each surface
// populates exactly these contexts.
exports.SURFACE_CONTEXT_AVAILABILITY = {
    receipt: ["item", "storage", "transaction"],
    shipment: ["item", "storage", "transaction"],
    stockTransfer: ["item", "storage", "transaction"],
    warehouseTransfer: ["item", "storage", "transaction"],
    inventoryAdjustment: ["item", "storage", "transaction"],
    place: ["item", "storage", "transaction"],
    pick: ["item", "storage", "transaction"],
    operationStart: ["workCenter", "operation", "transaction"],
    operationFinish: ["workCenter", "operation", "transaction"],
    materialIssue: ["workCenter", "operation", "transaction"],
    materialReceive: ["workCenter", "operation", "transaction"]
};
/**
 * A field resolves for a rule iff its context is structurally available on
 * EVERY surface the rule subscribes to. Empty surfaces → defer to targetType
 * only (caller hasn't picked surfaces yet).
 */
var isFieldAvailableOnSurfaces = function (def, surfaces) {
    return surfaces.length === 0 ||
        surfaces.every(function (s) { var _a; return (_a = exports.SURFACE_CONTEXT_AVAILABILITY[s]) === null || _a === void 0 ? void 0 : _a.includes(def.context); });
};
exports.isFieldAvailableOnSurfaces = isFieldAvailableOnSurfaces;
/**
 * Registry subset a rule of the given `targetType` may reference when it
 * subscribes to `surfaces`. Narrows `getFieldsForTargetType` by per-surface
 * context availability. Builder field picker filters through this.
 */
var getFieldsForTargetTypeAndSurfaces = function (targetType, surfaces) {
    return (0, field_registry_1.getFieldsForTargetType)(targetType).filter(function (f) {
        return (0, exports.isFieldAvailableOnSurfaces)(f, surfaces);
    });
};
exports.getFieldsForTargetTypeAndSurfaces = getFieldsForTargetTypeAndSurfaces;
// ---------------------------------------------------------------------------
// Per-surface field semantics
// ---------------------------------------------------------------------------
//
// Some fields carry different meaning depending on which surface fires the
// rule. `transaction.quantity` is the prime example — it's the line qty on a
// receipt, the planned op qty on `operationStart`, the scan delta on
// `operationFinish`, etc. Surface this so rule authors don't write predicates
// that work on one surface and silently misfire on another.
var TRANSACTION_QUANTITY_NOTES = {
    receipt: "Quantity received on this receipt line.",
    shipment: "Quantity shipped on this shipment line.",
    stockTransfer: "Quantity moved on this stock-transfer line.",
    warehouseTransfer: "Quantity moved on this warehouse-transfer line.",
    inventoryAdjustment: "Signed delta applied by this adjustment.",
    place: "Quantity placed into the storage unit (= receipt line qty).",
    pick: "Quantity taken from the storage unit (= shipment line qty).",
    operationStart: "Planned operation quantity (full target, not a delta this scan).",
    operationFinish: "Quantity completed by this scan (a delta, not cumulative).",
    materialIssue: "Material quantity consumed by this issue.",
    materialReceive: "Material quantity returned to stock."
};
// StorageUnit fields shift meaning between source bin (pick / shipment) and
// destination bin (place / receipt / transfer). On operation surfaces they
// aren't populated at all.
var STORAGE_UNIT_NOTES = {
    receipt: "Destination bin (where receiving line lands).",
    shipment: "Source bin (where shipped line was picked from).",
    stockTransfer: "Destination bin (TO storage unit).",
    warehouseTransfer: "Destination bin (TO storage unit).",
    inventoryAdjustment: "Bin the adjustment applies to (may be unset).",
    place: "Destination bin (mirrors receipt).",
    pick: "Source bin (mirrors shipment).",
    operationStart: "Not populated.",
    operationFinish: "Not populated.",
    materialIssue: "Not populated.",
    materialReceive: "Not populated."
};
var SURFACE_FIELD_NOTES = {
    "transaction.quantity": TRANSACTION_QUANTITY_NOTES,
    "storageUnit.id": STORAGE_UNIT_NOTES,
    "storageUnit.locationId": STORAGE_UNIT_NOTES,
    "storageUnit.storageTypeId": STORAGE_UNIT_NOTES
};
/**
 * Per-surface note for a given field path. Returns `undefined` when the field
 * carries the same meaning across every surface it applies to (no clarification
 * needed). Returns a partial map keyed by surface otherwise.
 *
 * Builder UI renders these under the field selector when the user picks a
 * field whose semantics shift between surfaces.
 */
var getFieldSurfaceNotes = function (path) {
    return SURFACE_FIELD_NOTES[path];
};
exports.getFieldSurfaceNotes = getFieldSurfaceNotes;
