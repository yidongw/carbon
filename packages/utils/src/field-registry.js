"use strict";
// Field resolver registry — single source of truth for the rule-builder UI and
// the evaluator's field paths. Split out of `storageRules.ts` to keep that file
// focused on evaluation/compilation. Depends on `storageRules` only for the core
// `Operator` / `TargetType` types (type-only — no runtime cycle).
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldDef = exports.getFieldsForTargetType = exports.FIELD_REGISTRY = exports.isOperatorAllowed = exports.availableOperators = void 0;
var PRESENCE_OPS = new Set(["isSet", "isNotSet"]);
var SCALAR_OPS = ["eq", "neq", "isSet", "isNotSet"];
var ENUM_OPS = ["eq", "neq", "in", "notIn", "isSet", "isNotSet"];
var ID_OPS = ["eq", "neq", "in", "notIn", "isSet", "isNotSet"];
var NUMBER_OPS = ["eq", "neq", "gt", "lt", "isSet", "isNotSet"];
var BOOL_OPS = ["eq", "neq"];
var availableOperators = function (def) {
    return def.nullable === false
        ? def.operators.filter(function (op) { return !PRESENCE_OPS.has(op); })
        : def.operators;
};
exports.availableOperators = availableOperators;
var isOperatorAllowed = function (def, op) {
    return (0, exports.availableOperators)(def).includes(op);
};
exports.isOperatorAllowed = isOperatorAllowed;
var fields = {
    database: function (args) {
        var _a;
        return ({
            path: "".concat((_a = args.ctxKey) !== null && _a !== void 0 ? _a : args.table, ".").concat(args.column),
            label: args.label,
            type: args.type,
            operators: args.operators,
            context: args.context,
            targetType: args.targetType,
            valueOptionsLoader: args.valueOptionsLoader,
            nullable: args.nullable,
            description: args.description
        });
    },
    synthetic: function (args) { return ({
        path: args.path,
        label: args.label,
        type: args.type,
        operators: args.operators,
        context: args.context,
        targetType: args.targetType,
        valueOptionsLoader: args.valueOptionsLoader,
        nullable: args.nullable,
        description: args.derivedFrom
    }); }
};
// FIELD_REGISTRY holds ONLY fields the evaluator guarantees in ctx for every
// surface within a given targetType. Fields that may be null or are only
// populated for a subset of surfaces are intentionally excluded — rule
// authors should never write a predicate that silently no-ops on some surface.
//
// The `storageUnit.*` fields belong to item-target rules (they own the
// `place`/`pick` bin guards). The storageUnit ctx may be undefined when
// `line.storageUnitId` is null (inventoryAdjustment without a bin,
// warehouseTransfer with no destination yet); we mark such fields
// `nullable: true` so `availableOperators` exposes `isSet`/`isNotSet` and
// authors can guard explicitly.
//
// Dropped vs. earlier drafts (kept here as audit trail):
//   - shelf.locationId         → `shelf` is not a RuleContext root key
//   - transaction.locationId   → sometimes null per surface
//   - operation.itemId         → null at operationStart (no item bound yet)
//   - operation.workInstructionId → may be null on operations
//
// Re-added: `item.itemPostingGroupId` — the evaluator now embeds the 1:1
// `itemCost` row and flattens its `itemPostingGroupId` onto the item ctx, so
// the value is guaranteed for every item-target surface (all carry an itemId).
exports.FIELD_REGISTRY = [
    // ── Item context (item target) ────────────────────────────────────────────
    // Every item-target surface carries a `line.itemId`, so the evaluator loads
    // item ctx and these fields resolve. Item DB columns are NOT NULL so no
    // nullable change.
    fields.database({
        table: "item",
        column: "type",
        nullable: false,
        label: "Item type",
        type: "enum",
        operators: ENUM_OPS,
        context: "item",
        targetType: "item",
        valueOptionsLoader: "itemTypes"
    }),
    fields.database({
        table: "item",
        column: "replenishmentSystem",
        nullable: false,
        label: "Replenishment system",
        type: "enum",
        operators: ENUM_OPS,
        context: "item",
        targetType: "item",
        valueOptionsLoader: "replenishmentSystems"
    }),
    fields.database({
        table: "item",
        column: "itemTrackingType",
        nullable: false,
        label: "Item tracking type",
        type: "enum",
        operators: ENUM_OPS,
        context: "item",
        targetType: "item",
        valueOptionsLoader: "itemTrackingTypes"
    }),
    // Posting group lives on the 1:1 `itemCost` row, not `item`. The evaluator
    // embeds it (see server.ts item SELECT) and flattens it onto the item ctx.
    // Nullable because an item may have no posting group assigned.
    fields.synthetic({
        path: "item.itemPostingGroupId",
        derivedFrom: "The item's posting group (from its itemCost row).",
        nullable: true,
        label: "Item group",
        type: "id",
        operators: ID_OPS,
        context: "item",
        targetType: "item",
        valueOptionsLoader: "itemPostingGroups"
    }),
    // ── StorageUnit context (item target) ─────────────────────────────────────
    // Loaded by the evaluator when `line.storageUnitId` is set. `nullable: true`
    // on every entry so item rules can guard with `isSet`/`isNotSet`.
    fields.synthetic({
        path: "storageUnit.id",
        derivedFrom: "The bin chosen on this transaction line.",
        nullable: true,
        label: "Storage unit",
        // `"storageUnit"` triggers the hierarchical drill-down picker in the
        // rule-builder UI (Location → drilldown) — no flat options list. The
        // loader is used only by the evaluator's `{condition[n].name}` resolver
        // to map the stored bin UUID back to its display name in messages.
        type: "storageUnit",
        // Drill picker selects a single bin — `in`/`notIn` would require a
        // multi-select UI that doesn't exist. Restrict to scalar ops.
        operators: SCALAR_OPS,
        context: "storage",
        targetType: "item",
        valueOptionsLoader: "storageUnits"
    }),
    fields.synthetic({
        path: "storageUnit.storageTypeId",
        derivedFrom: "The bin's primary storage type (e.g. cold, hazmat, dry).",
        nullable: true,
        label: "Storage type",
        type: "id",
        operators: ID_OPS,
        context: "storage",
        targetType: "item",
        valueOptionsLoader: "storageTypes"
    }),
    // Useful for `appliesToAll` rules that want to scope by physical location —
    // e.g. "block pick from any unit in the quarantine warehouse". Declared as
    // synthetic (not database) so `nullable: true` overrides the DB NOT NULL —
    // ctx itself can be undefined for item-target rules when `line.storageUnitId`
    // is null.
    fields.synthetic({
        path: "storageUnit.locationId",
        derivedFrom: "Physical location (warehouse or site) holding the chosen bin.",
        nullable: true,
        label: "Storage unit location",
        type: "id",
        operators: ID_OPS,
        context: "storage",
        targetType: "item",
        valueOptionsLoader: "locations"
    }),
    // ── WorkCenter target ─────────────────────────────────────────────────────
    // workCenter is the target — always loaded by the evaluator.
    fields.database({
        table: "workCenter",
        column: "locationId",
        nullable: true,
        label: "Work center location",
        type: "id",
        operators: ID_OPS,
        context: "workCenter",
        targetType: "workCenter",
        valueOptionsLoader: "locations"
    }),
    fields.database({
        table: "workCenter",
        column: "active",
        nullable: false,
        label: "Work center active",
        type: "enum",
        operators: BOOL_OPS,
        context: "workCenter",
        targetType: "workCenter"
    }),
    // ── Transaction (shared across all targets) ───────────────────────────────
    // transaction.quantity is set by every trigger handler. No other transaction
    // field is guaranteed across all surfaces.
    fields.synthetic({
        path: "transaction.quantity",
        derivedFrom: "Quantity moved or applied by this transaction. Meaning shifts per surface — see per-surface notes below.",
        nullable: false,
        label: "Transaction quantity",
        type: "number",
        operators: NUMBER_OPS,
        context: "transaction",
        targetType: "shared"
    })
];
/**
 * Subset of the registry visible to a rule of a given `targetType`. Includes
 * all fields explicitly declared for that target plus the `shared` set, plus
 * any field whose `targetType` is an array containing the requested target.
 * Builder UI filters its field dropdown through this helper.
 */
var getFieldsForTargetType = function (targetType) {
    return exports.FIELD_REGISTRY.filter(function (f) {
        if (f.targetType === "shared")
            return true;
        if (Array.isArray(f.targetType))
            return f.targetType.includes(targetType);
        return f.targetType === targetType;
    });
};
exports.getFieldsForTargetType = getFieldsForTargetType;
var getFieldDef = function (path) {
    // Custom fields are dynamic — accept any item.customFields.* path.
    if (path.startsWith("item.customFields.")) {
        return {
            path: path,
            label: path.slice("item.customFields.".length),
            type: "string",
            operators: SCALAR_OPS,
            context: "item",
            targetType: "item",
            description: "Custom field on the item record."
        };
    }
    return exports.FIELD_REGISTRY.find(function (f) { return f.path === path; });
};
exports.getFieldDef = getFieldDef;
