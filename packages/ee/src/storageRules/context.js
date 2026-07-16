"use strict";
// Pure RuleContext assembly for storage-rules evaluation. Deliberately
// side-effect-free (no auth/env/DB imports) so the registry↔code-path contract
// can be unit-tested without booting the server environment. `server.ts` owns
// the DB I/O and calls `buildLineContext` with the rows it loaded.
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLineContext = exports.itemPostingGroupIdFromEmbed = void 0;
/**
 * `itemPostingGroupId` lives on the 1:1 `itemCost` row, which PostgREST embeds
 * as a (typed one-to-many) array. Pull the value off the embed regardless of
 * array/object shape. Returns null when absent — callers coalesce to undefined
 * if their context prefers it.
 */
var itemPostingGroupIdFromEmbed = function (itemCost) {
    var _a;
    var cost = Array.isArray(itemCost) ? itemCost[0] : itemCost;
    return ((_a = cost === null || cost === void 0 ? void 0 : cost.itemPostingGroupId) !== null && _a !== void 0 ? _a : null);
};
exports.itemPostingGroupIdFromEmbed = itemPostingGroupIdFromEmbed;
/**
 * Assemble the `RuleContext` for a single line. Pure — so the registry↔code-path
 * contract (which root contexts get populated per surface) can be unit-tested
 * without a DB client. See the anti-drift test in `server.test.ts` and
 * `SURFACE_CONTEXT_AVAILABILITY` in `@carbon/utils`.
 *
 * `item`/`storageUnit`/`workCenter` are the rows loaded from the DB (or
 * undefined when the lookup missed); the id-only fallback keeps token
 * interpolation working when a join didn't materialize (RLS, late insert).
 */
var buildLineContext = function (args) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var line = args.line, surface = args.surface, userId = args.userId;
    var storageUnit = line.storageUnitId
        ? ((_a = args.storageUnit) !== null && _a !== void 0 ? _a : { id: line.storageUnitId })
        : undefined;
    return {
        item: line.itemId ? ((_b = args.item) !== null && _b !== void 0 ? _b : { id: line.itemId }) : undefined,
        storageUnit: storageUnit,
        workCenter: line.workCenterId
            ? ((_c = args.workCenter) !== null && _c !== void 0 ? _c : { id: line.workCenterId })
            : undefined,
        operation: line.operation
            ? {
                id: (_d = line.operation.id) !== null && _d !== void 0 ? _d : undefined,
                itemId: (_e = line.operation.itemId) !== null && _e !== void 0 ? _e : undefined,
                quantity: (_f = line.operation.quantity) !== null && _f !== void 0 ? _f : undefined,
                workInstructionId: (_g = line.operation.workInstructionId) !== null && _g !== void 0 ? _g : undefined
            }
            : undefined,
        transaction: {
            kind: surface,
            locationId: (_j = (_h = line.locationId) !== null && _h !== void 0 ? _h : storageUnit === null || storageUnit === void 0 ? void 0 : storageUnit.locationId) !== null && _j !== void 0 ? _j : null,
            quantity: line.quantity,
            userId: userId
        }
    };
};
exports.buildLineContext = buildLineContext;
