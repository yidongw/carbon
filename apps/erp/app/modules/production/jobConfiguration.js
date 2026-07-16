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
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyConfigAdjustment = applyConfigAdjustment;
exports.sumConfigTables = sumConfigTables;
exports.computeConfigRemaining = computeConfigRemaining;
exports.reportsExceedConfigPlan = reportsExceedConfigPlan;
exports.computeJobConfigTableTotal = computeJobConfigTableTotal;
function getPrimaryKeys(configuration) {
    var cfg = typeof configuration === "object" &&
        configuration !== null &&
        !Array.isArray(configuration)
        ? configuration
        : null;
    var raw = cfg === null || cfg === void 0 ? void 0 : cfg.configTablePrimaryKeys;
    var keys = Array.isArray(raw)
        ? raw.filter(function (k) { return typeof k === "string"; })
        : [];
    return keys;
}
function getConfigTable(configuration) {
    var cfg = typeof configuration === "object" &&
        configuration !== null &&
        !Array.isArray(configuration)
        ? configuration
        : null;
    var table = cfg === null || cfg === void 0 ? void 0 : cfg.configTable;
    return Array.isArray(table) ? table : [];
}
/** Signature for matching rows by their non-quantity (descriptor) columns. */
function descriptorSignature(row, primaryKeys) {
    var keys = Object.keys(row)
        .filter(function (key) { return !primaryKeys.includes(key); })
        .sort();
    return JSON.stringify(keys.map(function (key) { var _a; return [key, String((_a = row[key]) !== null && _a !== void 0 ? _a : "").trim()]; }));
}
/**
 * Merges a signed `adjustment` config table into the `current` config table, matching
 * rows by their descriptor (non-quantity) columns and summing quantity columns.
 * All-zero rows are dropped. Flags when the result would go negative for any cell.
 */
function applyConfigAdjustment(current, adjustment) {
    var adjustmentKeys = getPrimaryKeys(adjustment);
    var currentKeys = getPrimaryKeys(current);
    var primaryKeys = adjustmentKeys.length > 0
        ? adjustmentKeys
        : currentKeys.length > 0
            ? currentKeys
            : ["Quantities"];
    var rowsBySignature = new Map();
    var order = [];
    var upsert = function (row, add) {
        var signature = descriptorSignature(row, primaryKeys);
        var existing = rowsBySignature.get(signature);
        if (!existing) {
            var clone = __assign({}, row);
            for (var _i = 0, primaryKeys_3 = primaryKeys; _i < primaryKeys_3.length; _i++) {
                var key = primaryKeys_3[_i];
                clone[key] = Number(row[key]) || 0;
            }
            rowsBySignature.set(signature, clone);
            order.push(signature);
            return;
        }
        if (add) {
            for (var _a = 0, primaryKeys_4 = primaryKeys; _a < primaryKeys_4.length; _a++) {
                var key = primaryKeys_4[_a];
                existing[key] = (Number(existing[key]) || 0) + (Number(row[key]) || 0);
            }
        }
    };
    for (var _i = 0, _a = getConfigTable(current); _i < _a.length; _i++) {
        var row = _a[_i];
        upsert(row, true);
    }
    var deltaTotal = 0;
    for (var _b = 0, _c = getConfigTable(adjustment); _b < _c.length; _b++) {
        var row = _c[_b];
        for (var _d = 0, primaryKeys_1 = primaryKeys; _d < primaryKeys_1.length; _d++) {
            var key = primaryKeys_1[_d];
            deltaTotal += Number(row[key]) || 0;
        }
        upsert(row, true);
    }
    var hasNegative = false;
    var mergedRows = [];
    for (var _e = 0, order_1 = order; _e < order_1.length; _e++) {
        var signature = order_1[_e];
        var row = rowsBySignature.get(signature);
        if (!row)
            continue;
        var allZero = true;
        for (var _f = 0, primaryKeys_2 = primaryKeys; _f < primaryKeys_2.length; _f++) {
            var key = primaryKeys_2[_f];
            var value = Number(row[key]) || 0;
            row[key] = value;
            if (value < 0)
                hasNegative = true;
            if (value !== 0)
                allZero = false;
        }
        if (!allZero)
            mergedRows.push(row);
    }
    var configuration = {
        configTable: mergedRows,
        configTablePrimaryKeys: primaryKeys
    };
    return {
        configuration: configuration,
        total: computeJobConfigTableTotal(configuration),
        deltaTotal: deltaTotal,
        hasNegative: hasNegative
    };
}
/**
 * Folds many config tables into one by descriptor, summing quantity columns.
 * Used to total reported production quantities per operation for display.
 */
function sumConfigTables(configs, primaryKeys) {
    var configuration = {
        configTable: [],
        configTablePrimaryKeys: primaryKeys
    };
    for (var _i = 0, configs_1 = configs; _i < configs_1.length; _i++) {
        var config = configs_1[_i];
        configuration = applyConfigAdjustment(configuration, config).configuration;
    }
    return { configuration: configuration, total: computeJobConfigTableTotal(configuration) };
}
/**
 * The remaining config table: `planned - sum(reportedConfigs)` per cell, floored
 * at 0. Returns an empty table when there's no plan structure.
 */
function computeConfigRemaining(planned, reportedConfigs) {
    var primaryKeys = getPrimaryKeys(planned);
    if (primaryKeys.length === 0 || getConfigTable(planned).length === 0) {
        return { configTable: [], configTablePrimaryKeys: primaryKeys };
    }
    var reported = sumConfigTables(reportedConfigs, primaryKeys).configuration;
    var negated = {
        configTable: reported.configTable.map(function (row) {
            var clone = __assign({}, row);
            for (var _i = 0, primaryKeys_5 = primaryKeys; _i < primaryKeys_5.length; _i++) {
                var key = primaryKeys_5[_i];
                clone[key] = -(Number(row[key]) || 0);
            }
            return clone;
        }),
        configTablePrimaryKeys: primaryKeys
    };
    var merged = applyConfigAdjustment(planned, negated).configuration;
    return {
        configTable: merged.configTable.map(function (row) {
            var clone = __assign({}, row);
            for (var _i = 0, primaryKeys_6 = primaryKeys; _i < primaryKeys_6.length; _i++) {
                var key = primaryKeys_6[_i];
                clone[key] = Math.max(0, Number(row[key]) || 0);
            }
            return clone;
        }),
        configTablePrimaryKeys: primaryKeys
    };
}
/**
 * True when the summed `reportedConfigs` would exceed the `planned` config for
 * any cell — i.e. `planned - sum(reported)` goes negative. No-op (returns false)
 * when there's no plan structure or nothing reported, so non-config-param jobs
 * are unaffected.
 */
function reportsExceedConfigPlan(planned, reportedConfigs) {
    var primaryKeys = getPrimaryKeys(planned);
    if (primaryKeys.length === 0)
        return false;
    if (getConfigTable(planned).length === 0)
        return false;
    var reported = sumConfigTables(reportedConfigs, primaryKeys).configuration;
    if (reported.configTable.length === 0)
        return false;
    var negated = {
        configTable: reported.configTable.map(function (row) {
            var clone = __assign({}, row);
            for (var _i = 0, primaryKeys_7 = primaryKeys; _i < primaryKeys_7.length; _i++) {
                var key = primaryKeys_7[_i];
                clone[key] = -(Number(row[key]) || 0);
            }
            return clone;
        }),
        configTablePrimaryKeys: primaryKeys
    };
    return applyConfigAdjustment(planned, negated).hasNegative;
}
/**
 * Sums quantity columns across `configuration.configTable` (same rules as the job sidebar).
 * Uses `configTablePrimaryKeys` when set; otherwise counts the single default `Quantities` column.
 */
function computeJobConfigTableTotal(configuration) {
    if (configuration === null || configuration === undefined)
        return 0;
    var cfg = typeof configuration === "object" && !Array.isArray(configuration)
        ? configuration
        : null;
    if (!cfg)
        return 0;
    var table = cfg.configTable;
    if (!Array.isArray(table) || table.length === 0)
        return 0;
    var primaryKeysRaw = cfg.configTablePrimaryKeys;
    var primaryKeys = Array.isArray(primaryKeysRaw)
        ? primaryKeysRaw.filter(function (k) { return typeof k === "string"; })
        : ["Quantities"];
    return table.reduce(function (sum, row) {
        if (typeof row !== "object" || row === null)
            return sum;
        var r = row;
        return (sum +
            primaryKeys.reduce(function (rowSum, key) { return rowSum + (Number(r[key]) || 0); }, 0));
    }, 0);
}
