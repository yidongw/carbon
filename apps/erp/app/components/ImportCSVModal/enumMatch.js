"use strict";
// Pure matching helpers for the CSV import enum-mapping step. Extracted so the
// auto-match logic is unit-testable without a DOM. An option may carry
// `aliases` — additional identifiers (e.g. a supplier's readableId) that resolve
// to the same value as the visible label.
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
exports.buildOptionLookup = buildOptionLookup;
exports.matchCsvValue = matchCsvValue;
exports.toMatchableOption = toMatchableOption;
var normalize = function (value) { return value.toLowerCase().trim(); };
// Build a normalized lookup of every match key (label + aliases) -> option
// value. Earlier options win on collision so results are deterministic.
function buildOptionLookup(options) {
    var _a;
    var lookup = new Map();
    for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
        var option = options_1[_i];
        for (var _b = 0, _c = __spreadArray([option.label], ((_a = option.aliases) !== null && _a !== void 0 ? _a : []), true); _b < _c.length; _b++) {
            var key = _c[_b];
            var normalized = normalize(key);
            if (normalized === "")
                continue;
            if (!lookup.has(normalized))
                lookup.set(normalized, option.value);
        }
    }
    return lookup;
}
// Resolve a CSV cell value to an option value, or undefined when no key matches.
function matchCsvValue(lookup, csvValue) {
    return lookup.get(normalize(csvValue));
}
// Derive a MatchableOption from a fetched list item. Employees (items with an
// email) match by email ONLY — their names are not unique, so name must not be
// a match key. For suppliers and other no-email lookups, the label is the
// readableId when the company displays readable IDs (else the name), and the
// other identifier(s) become aliases so auto-match resolves by either.
function toMatchableOption(item, showReadableId) {
    if (item.email) {
        return { label: item.email, value: item.id };
    }
    var label = showReadableId && item.readableId ? item.readableId : item.name;
    var aliases = [item.readableId, item.name].filter(function (alias) { return !!alias && alias !== label; });
    return { label: label, value: item.id, aliases: aliases };
}
