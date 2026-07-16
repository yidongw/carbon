"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterEmpty = void 0;
exports.chunkArray = chunkArray;
exports.pluckUnique = pluckUnique;
exports.indexBy = indexBy;
exports.indexByMapped = indexByMapped;
/**
 * A utility function to filter out null and undefined values from an array.
 *
 * Indexed loop instead of `.reduce` to avoid the per-call closure
 * allocation and keep the load IC at `arr[i]` monomorphic.
 */
var filterEmpty = function (arr) {
    var out = [];
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        var item = arr[i];
        if (item !== null && item !== undefined)
            out.push(item);
    }
    return out;
};
exports.filterEmpty = filterEmpty;
// Chunk
function chunkArray(array, chunkSize) {
    var chunks = [];
    var len = array.length;
    for (var i = 0; i < len; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}
/**
 * Project rows to a value, drop null/undefined, dedupe. Common when
 * collecting foreign-key ids out of a result set to feed an `IN (...)`
 * query.
 *
 *   pluckUnique(rows, (r) => r.trackedEntityId)
 *
 * Replaces:
 *   Array.from(new Set(rows.map((r) => r.x).filter((v): v is T => !!v)))
 *
 * Hot-path notes (V8): always accepts a real array (callers normalize at
 * boundary), iterates with an indexed loop for a monomorphic load IC and
 * to skip iterator-protocol allocation, and keeps the output array packed
 * by only pushing non-null/undefined `U` values.
 */
function pluckUnique(rows, selector) {
    var out = [];
    if (rows === null || rows === undefined)
        return out;
    var len = rows.length;
    if (len === 0)
        return out;
    var seen = new Set();
    for (var i = 0; i < len; i++) {
        var value = selector(rows[i]);
        if (value === null || value === undefined)
            continue;
        if (seen.has(value))
            continue;
        seen.add(value);
        out.push(value);
    }
    return out;
}
/**
 * Build a `Map<K, T>` from an array, keyed by `getKey(row)`. Last write
 * wins on duplicate keys. Designed for the common pattern of:
 *
 *   const byId = new Map(rows.map((r) => [r.id, r]));
 *
 * Indexed loop, no iterator protocol — the `.map` form allocates
 * intermediate tuple arrays we don't need.
 */
function indexBy(rows, getKey) {
    var out = new Map();
    if (rows === null || rows === undefined)
        return out;
    var len = rows.length;
    for (var i = 0; i < len; i++) {
        var row = rows[i];
        out.set(getKey(row), row);
    }
    return out;
}
/**
 * Same as `indexBy` but lets the caller transform the value while
 * indexing — useful for normalising rows into a synthetic shape (e.g.
 * flattening a `string[]` column into the first element under a different
 * key) without an extra `.map` pass.
 */
function indexByMapped(rows, getKey, getValue) {
    var out = new Map();
    if (rows === null || rows === undefined)
        return out;
    var len = rows.length;
    for (var i = 0; i < len; i++) {
        var row = rows[i];
        out.set(getKey(row), getValue(row));
    }
    return out;
}
