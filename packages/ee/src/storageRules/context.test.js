"use strict";
// Anti-drift contract test. Locks the registry (what the builder offers) to the
// runtime code path (what `buildLineContext` actually populates) per surface.
//
// If someone adds a field to FIELD_REGISTRY without populating it in
// `buildLineContext`/the server SELECTs, or renames a ctx key (e.g. the
// `storageTypeIds` → `storageTypeId` mapping), or edits
// SURFACE_CONTEXT_AVAILABILITY out of sync — one of these assertions fails.
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
var utils_1 = require("@carbon/utils");
var vitest_1 = require("vitest");
var context_1 = require("./context");
// Fully-populated rows mirroring the shape `evaluateLinesForSurface` builds
// AFTER its post-query flattening (itemPostingGroupId off itemCost; storageTypeId
// unioned from storageTypeIds). Every registry-referenced key is present.
var ITEM_ROW = {
    id: "ITEM-1",
    type: "Part",
    replenishmentSystem: "Buy",
    itemTrackingType: "Inventory",
    itemPostingGroupId: "ipg_1"
};
var STORAGE_ROW = {
    id: "su_1",
    storageTypeId: ["st_1"],
    locationId: "loc_1",
    warehouseId: "wh_1",
    name: "Bin A"
};
var WORKCENTER_ROW = { id: "wc_1", locationId: "loc_1", active: true };
// FieldContext value → RuleContext root key (only "storage" differs).
var ctxRootKeyFor = function (context) {
    return context === "storage" ? "storageUnit" : context;
};
// targetTypes a surface belongs to (item surfaces vs workCenter surfaces).
var targetTypesForSurface = function (surface) {
    return utils_1.TARGET_TYPES.filter(function (tt) { return utils_1.SURFACES_BY_TARGET_TYPE[tt].includes(surface); });
};
// Build a representative line carrying exactly the ids the availability map says
// the surface populates — mirroring what real trigger call sites pass.
var lineForSurface = function (surface) {
    var contexts = utils_1.SURFACE_CONTEXT_AVAILABILITY[surface];
    return {
        lineId: "line_1",
        quantity: 5,
        locationId: "loc_1",
        itemId: contexts.includes("item") ? ITEM_ROW.id : null,
        storageUnitId: contexts.includes("storage") ? STORAGE_ROW.id : null,
        workCenterId: contexts.includes("workCenter") ? WORKCENTER_ROW.id : null,
        operation: contexts.includes("operation")
            ? {
                id: "op_1",
                itemId: ITEM_ROW.id,
                quantity: 5,
                workInstructionId: "wi_1"
            }
            : undefined
    };
};
var ctxFor = function (surface) {
    return (0, context_1.buildLineContext)({
        line: lineForSurface(surface),
        surface: surface,
        userId: "user_1",
        item: ITEM_ROW,
        storageUnit: STORAGE_ROW,
        workCenter: WORKCENTER_ROW
    });
};
(0, vitest_1.describe)("registry ↔ runtime ctx contract", function () {
    var _loop_1 = function (surface) {
        (0, vitest_1.it)("every field offered on \"".concat(surface, "\" resolves in the runtime ctx"), function () {
            var ctx = ctxFor(surface);
            var offered = new Map();
            for (var _i = 0, _a = targetTypesForSurface(surface); _i < _a.length; _i++) {
                var tt = _a[_i];
                for (var _b = 0, _c = (0, utils_1.getFieldsForTargetTypeAndSurfaces)(tt, [surface]); _b < _c.length; _b++) {
                    var f = _c[_b];
                    offered.set(f.path, (0, utils_1.buildResolver)(f.path));
                }
            }
            (0, vitest_1.expect)(offered.size).toBeGreaterThan(0);
            for (var _d = 0, offered_1 = offered; _d < offered_1.length; _d++) {
                var _e = offered_1[_d], path = _e[0], resolve = _e[1];
                (0, vitest_1.expect)(resolve(ctx), "\"".concat(path, "\" offered on \"").concat(surface, "\" but resolved to undefined")).not.toBeUndefined();
            }
        });
        (0, vitest_1.it)("ctx for \"".concat(surface, "\" populates exactly the declared contexts"), function () {
            var ctx = ctxFor(surface);
            for (var _i = 0, _a = utils_1.SURFACE_CONTEXT_AVAILABILITY[surface]; _i < _a.length; _i++) {
                var context = _a[_i];
                (0, vitest_1.expect)(ctx[ctxRootKeyFor(context)], "context \"".concat(context, "\" declared available on \"").concat(surface, "\" but not built")).not.toBeUndefined();
            }
        });
    };
    for (var _i = 0, TRANSACTION_SURFACES_1 = utils_1.TRANSACTION_SURFACES; _i < TRANSACTION_SURFACES_1.length; _i++) {
        var surface = TRANSACTION_SURFACES_1[_i];
        _loop_1(surface);
    }
});
(0, vitest_1.describe)("registry coverage by availability map", function () {
    // Every registry field's context must be declared available on every surface
    // of its valid targetType(s) — otherwise the builder could offer a field the
    // map silently excludes (or, worse, a field with no surface at all).
    (0, vitest_1.it)("every field is available on at least one surface of its targetType", function () {
        var _loop_2 = function (f) {
            var targets = f.targetType === "shared"
                ? __spreadArray([], utils_1.TARGET_TYPES, true) : Array.isArray(f.targetType)
                ? __spreadArray([], f.targetType, true) : [f.targetType];
            var surfaces = new Set();
            for (var _a = 0, targets_1 = targets; _a < targets_1.length; _a++) {
                var tt = targets_1[_a];
                for (var _b = 0, _c = utils_1.SURFACES_BY_TARGET_TYPE[tt]; _b < _c.length; _b++) {
                    var s = _c[_b];
                    surfaces.add(s);
                }
            }
            var covered = Array.from(surfaces).some(function (s) {
                return utils_1.SURFACE_CONTEXT_AVAILABILITY[s].includes(f.context);
            });
            (0, vitest_1.expect)(covered, "field \"".concat(f.path, "\" (context \"").concat(f.context, "\") is offered on no surface")).toBe(true);
        };
        for (var _i = 0, FIELD_REGISTRY_1 = utils_1.FIELD_REGISTRY; _i < FIELD_REGISTRY_1.length; _i++) {
            var f = FIELD_REGISTRY_1[_i];
            _loop_2(f);
        }
    });
});
