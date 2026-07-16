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
exports.buildConfigColumns = buildConfigColumns;
exports.mergeConfigTableRows = mergeConfigTableRows;
exports.hasConfigRowValue = hasConfigRowValue;
exports.getConfigTableRows = getConfigTableRows;
exports.formatConfigRowLabel = formatConfigRowLabel;
exports.formatConfigRowLabels = formatConfigRowLabels;
exports.getConfigRowDisplayPart = getConfigRowDisplayPart;
exports.getConfigRowDisplayParts = getConfigRowDisplayParts;
exports.buildReportedTargetRows = buildReportedTargetRows;
exports.buildConfigTableEditorState = buildConfigTableEditorState;
exports.fillValueFromReference = fillValueFromReference;
exports.buildJobRemainingReferenceContext = buildJobRemainingReferenceContext;
exports.buildProductionConfigTableReferenceContext = buildProductionConfigTableReferenceContext;
function buildConfigColumns(parameters, defaultQuantityLabel) {
    var _a, _b;
    var primaryParam = (_a = parameters.find(function (p) { return p.dataType === "list"; })) !== null && _a !== void 0 ? _a : null;
    var otherParams = parameters.filter(function (p) { return p !== primaryParam; });
    var columns = [];
    var primaryKeys = [];
    if (primaryParam &&
        primaryParam.listOptions &&
        primaryParam.listOptions.length > 0) {
        for (var _i = 0, _c = primaryParam.listOptions; _i < _c.length; _i++) {
            var option = _c[_i];
            columns.push({ key: option, label: option, type: "quantity" });
            primaryKeys.push(option);
        }
    }
    else {
        columns.push({
            key: "Quantities",
            label: defaultQuantityLabel,
            type: "quantity"
        });
        primaryKeys.push("Quantities");
    }
    for (var _d = 0, otherParams_1 = otherParams; _d < otherParams_1.length; _d++) {
        var param = otherParams_1[_d];
        columns.push({
            key: param.key,
            label: param.label,
            type: param.dataType,
            options: (_b = param.listOptions) !== null && _b !== void 0 ? _b : []
        });
    }
    return { primaryParam: primaryParam, primaryKeys: primaryKeys, columns: columns };
}
function getMergeKey(row, columns) {
    var descriptorColumns = columns.filter(function (col) { return col.type !== "quantity"; });
    if (descriptorColumns.length === 0) {
        return "__all__";
    }
    return JSON.stringify(descriptorColumns.map(function (col) { var _a; return String((_a = row[col.key]) !== null && _a !== void 0 ? _a : "").trim(); }));
}
function mergeConfigTableRows(rows, columns) {
    var rowsByKey = new Map();
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        var key = getMergeKey(row, columns);
        var existingRow = rowsByKey.get(key);
        if (!existingRow) {
            rowsByKey.set(key, __assign({}, row));
            continue;
        }
        for (var _a = 0, columns_1 = columns; _a < columns_1.length; _a++) {
            var col = columns_1[_a];
            if (col.type !== "quantity")
                continue;
            existingRow[col.key] =
                (Number(existingRow[col.key]) || 0) + (Number(row[col.key]) || 0);
        }
    }
    return Array.from(rowsByKey.values());
}
function isZeroOrEmpty(value) {
    if (value === undefined)
        return true;
    var stringValue = String(value).trim();
    if (stringValue === "")
        return true;
    return Number(stringValue) === 0;
}
function hasConfigRowValue(row, columns) {
    var quantityColumns = columns.filter(function (col) { return col.type === "quantity"; });
    if (quantityColumns.length > 0) {
        return quantityColumns.some(function (col) { return !isZeroOrEmpty(row[col.key]); });
    }
    return columns.some(function (col) { return !isZeroOrEmpty(row[col.key]); });
}
function getConfigTableRows(configuration) {
    if (configuration === null ||
        configuration === undefined ||
        typeof configuration !== "object" ||
        Array.isArray(configuration)) {
        return [];
    }
    var configTable = configuration.configTable;
    if (!Array.isArray(configTable))
        return [];
    return configTable;
}
function formatConfigRowLabel(row, columns) {
    var descriptorColumns = columns.filter(function (col) { return col.type !== "quantity"; });
    var quantityColumns = columns.filter(function (col) { return col.type === "quantity"; });
    var descriptorParts = descriptorColumns
        .map(function (col) { var _a; return String((_a = row[col.key]) !== null && _a !== void 0 ? _a : "").trim(); })
        .filter(Boolean);
    if (quantityColumns.length === 0) {
        return descriptorParts.join(", ");
    }
    if (quantityColumns.length === 1) {
        var qty = Number(row[quantityColumns[0].key]) || 0;
        if (descriptorParts.length === 0) {
            return String(qty);
        }
        return "".concat(descriptorParts.join(", "), " ").concat(qty);
    }
    var quantityParts = quantityColumns
        .map(function (col) {
        var qty = Number(row[col.key]) || 0;
        if (isZeroOrEmpty(row[col.key]))
            return null;
        return "".concat(col.label, " ").concat(qty);
    })
        .filter(function (part) { return part != null; });
    if (descriptorParts.length === 0) {
        return quantityParts.join(", ");
    }
    return "".concat(descriptorParts.join(", "), " ").concat(quantityParts.join(", "));
}
function formatConfigRowLabels(configuration, parameters, defaultQuantityLabel) {
    var columns = buildConfigColumns(parameters, defaultQuantityLabel).columns;
    var rows = getConfigTableRows(configuration);
    return rows
        .filter(function (row) { return hasConfigRowValue(row, columns); })
        .map(function (row) { return formatConfigRowLabel(row, columns); });
}
function getConfigRowDisplayPart(row, columns) {
    var descriptorColumns = columns.filter(function (col) { return col.type !== "quantity"; });
    var quantityColumns = columns.filter(function (col) { return col.type === "quantity"; });
    var descriptor = descriptorColumns
        .map(function (col) { var _a; return String((_a = row[col.key]) !== null && _a !== void 0 ? _a : "").trim(); })
        .filter(Boolean)
        .join(", ") || null;
    var quantities = quantityColumns
        .map(function (col) {
        var value = Number(row[col.key]) || 0;
        if (isZeroOrEmpty(row[col.key]))
            return null;
        return {
            label: quantityColumns.length === 1 ? "" : col.label,
            value: value
        };
    })
        .filter(function (q) { return q != null; });
    return { descriptor: descriptor, quantities: quantities };
}
function getConfigRowDisplayParts(configuration, parameters, defaultQuantityLabel) {
    var columns = buildConfigColumns(parameters, defaultQuantityLabel).columns;
    var rows = getConfigTableRows(configuration);
    return rows
        .filter(function (row) { return hasConfigRowValue(row, columns); })
        .map(function (row) { return getConfigRowDisplayPart(row, columns); });
}
function buildReportedTargetRows(_a) {
    var targetConfiguration = _a.targetConfiguration, reportedConfigurations = _a.reportedConfigurations, _b = _a.pickupConfigurations, pickupConfigurations = _b === void 0 ? [] : _b, parameters = _a.parameters, defaultQuantityLabel = _a.defaultQuantityLabel;
    var columns = buildConfigColumns(parameters, defaultQuantityLabel).columns;
    var targetRows = mergeConfigTableRows(getConfigTableRows(targetConfiguration), columns);
    var reportedRows = mergeConfigTableRows(reportedConfigurations.flatMap(function (config) { return getConfigTableRows(config); }), columns);
    var pickupRows = mergeConfigTableRows(pickupConfigurations.flatMap(function (config) { return getConfigTableRows(config); }), columns);
    var targetByKey = new Map(targetRows.map(function (row) { return [getMergeKey(row, columns), row]; }));
    var reportedByKey = new Map(reportedRows.map(function (row) { return [getMergeKey(row, columns), row]; }));
    var pickupByKey = new Map(pickupRows.map(function (row) { return [getMergeKey(row, columns), row]; }));
    var keys = new Set(__spreadArray(__spreadArray(__spreadArray([], targetByKey.keys(), true), reportedByKey.keys(), true), pickupByKey.keys(), true));
    return Array.from(keys).map(function (key) {
        var _a, _b;
        var targetRow = targetByKey.get(key);
        var reportedRow = reportedByKey.get(key);
        var pickupRow = pickupByKey.get(key);
        var baseRow = __assign({}, ((_b = (_a = targetRow !== null && targetRow !== void 0 ? targetRow : reportedRow) !== null && _a !== void 0 ? _a : pickupRow) !== null && _b !== void 0 ? _b : {}));
        var cells = {};
        for (var _i = 0, columns_2 = columns; _i < columns_2.length; _i++) {
            var col = columns_2[_i];
            if (col.type !== "quantity")
                continue;
            cells[col.key] = {
                reported: Number(reportedRow === null || reportedRow === void 0 ? void 0 : reportedRow[col.key]) || 0,
                pickup: Number(pickupRow === null || pickupRow === void 0 ? void 0 : pickupRow[col.key]) || 0,
                target: Number(targetRow === null || targetRow === void 0 ? void 0 : targetRow[col.key]) || 0
            };
        }
        return __assign(__assign({}, baseRow), { cells: cells });
    });
}
function buildConfigTableEditorState(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var parameters = _a.parameters, defaultQuantityLabel = _a.defaultQuantityLabel, currentConfiguration = _a.currentConfiguration, referenceContext = _a.referenceContext, _m = _a.prefillFromReference, prefillFromReference = _m === void 0 ? false : _m;
    var columns = buildConfigColumns(parameters, defaultQuantityLabel).columns;
    if (!referenceContext) {
        var currentRows_1 = mergeConfigTableRows(getConfigTableRows(currentConfiguration), columns);
        return {
            rows: currentRows_1.length > 0 ? currentRows_1 : [],
            referenceByRowIndex: []
        };
    }
    var originalRows = mergeConfigTableRows(getConfigTableRows(referenceContext.originalConfiguration), columns);
    var currentRows = mergeConfigTableRows(getConfigTableRows(currentConfiguration), columns);
    var otherRows = mergeConfigTableRows(referenceContext.otherLineConfigurations.flatMap(function (config) {
        return getConfigTableRows(config);
    }), columns);
    var originalByKey = new Map(originalRows.map(function (row) { return [getMergeKey(row, columns), row]; }));
    var currentByKey = new Map(currentRows.map(function (row) { return [getMergeKey(row, columns), row]; }));
    var otherByKey = new Map(otherRows.map(function (row) { return [getMergeKey(row, columns), row]; }));
    var employeePickups = referenceContext.employeeId && referenceContext.pickupsByEmployee
        ? ((_b = referenceContext.pickupsByEmployee[referenceContext.employeeId]) !== null && _b !== void 0 ? _b : [])
        : [];
    var usePickupHints = employeePickups.length > 0;
    var pickupRows = usePickupHints
        ? mergeConfigTableRows(employeePickups.flatMap(function (pickup) {
            return getConfigTableRows(pickup.configuration);
        }), columns)
        : [];
    var employeeProducedRows = usePickupHints
        ? mergeConfigTableRows(((_c = referenceContext.employeeReportedConfigurations) !== null && _c !== void 0 ? _c : []).flatMap(function (config) { return getConfigTableRows(config); }), columns)
        : [];
    var employeeProducedByKey = new Map(employeeProducedRows.map(function (row) { return [getMergeKey(row, columns), row]; }));
    var orderedKeys = __spreadArray(__spreadArray(__spreadArray([], originalRows.map(function (row) { return getMergeKey(row, columns); }), true), currentRows
        .map(function (row) { return getMergeKey(row, columns); })
        .filter(function (key) { return !originalByKey.has(key); }), true), pickupRows
        .map(function (row) { return getMergeKey(row, columns); })
        .filter(function (key) {
        return !originalByKey.has(key) &&
            !currentRows.some(function (row) { return getMergeKey(row, columns) === key; });
    }), true);
    var rows = [];
    var referenceByRowIndex = [];
    for (var _i = 0, orderedKeys_1 = orderedKeys; _i < orderedKeys_1.length; _i++) {
        var key = orderedKeys_1[_i];
        var template = (_e = (_d = originalByKey.get(key)) !== null && _d !== void 0 ? _d : currentByKey.get(key)) !== null && _e !== void 0 ? _e : {};
        var current = currentByKey.get(key);
        var row = __assign({}, template);
        for (var _o = 0, columns_3 = columns; _o < columns_3.length; _o++) {
            var col = columns_3[_o];
            if (col.type !== "quantity" && current && current[col.key] !== undefined) {
                row[col.key] = (_g = (_f = current[col.key]) !== null && _f !== void 0 ? _f : row[col.key]) !== null && _g !== void 0 ? _g : "";
            }
        }
        var refs = {};
        for (var _p = 0, columns_4 = columns; _p < columns_4.length; _p++) {
            var col = columns_4[_p];
            if (col.type !== "quantity")
                continue;
            if (usePickupHints) {
                var pickupQty = 0;
                for (var _q = 0, employeePickups_1 = employeePickups; _q < employeePickups_1.length; _q++) {
                    var pickup = employeePickups_1[_q];
                    for (var _r = 0, _s = getConfigTableRows(pickup.configuration); _r < _s.length; _r++) {
                        var pickupRow = _s[_r];
                        if (getMergeKey(pickupRow, columns) === key) {
                            pickupQty += Number(pickupRow[col.key]) || 0;
                        }
                    }
                }
                var producedQty = Number((_h = employeeProducedByKey.get(key)) === null || _h === void 0 ? void 0 : _h[col.key]) || 0;
                refs[col.key] = Math.max(0, pickupQty - producedQty);
            }
            else {
                // Default behavior: job target - already produced
                var originalQty = Number((_j = originalByKey.get(key)) === null || _j === void 0 ? void 0 : _j[col.key]) || 0;
                var otherQty = Number((_k = otherByKey.get(key)) === null || _k === void 0 ? void 0 : _k[col.key]) || 0;
                refs[col.key] =
                    referenceContext.mode === "original"
                        ? originalQty
                        : originalQty - otherQty;
            }
        }
        // Set editable quantity cells: keep any current draft value, otherwise fall
        // back to the reference (remaining) when prefilling is requested, else 0.
        for (var _t = 0, columns_5 = columns; _t < columns_5.length; _t++) {
            var col = columns_5[_t];
            if (col.type !== "quantity")
                continue;
            var currentQty = Number(current === null || current === void 0 ? void 0 : current[col.key]) || 0;
            row[col.key] =
                prefillFromReference && current === undefined
                    ? fillValueFromReference((_l = refs[col.key]) !== null && _l !== void 0 ? _l : 0)
                    : currentQty;
        }
        rows.push(row);
        referenceByRowIndex.push(refs);
    }
    return { rows: rows, referenceByRowIndex: referenceByRowIndex };
}
function fillValueFromReference(referenceValue) {
    return Math.max(0, referenceValue);
}
/** Hint quantities = job required − already reported (per config row/column).
 * When employeeId is provided, uses pickup-based hints (pickup - produced) instead. */
function buildJobRemainingReferenceContext(source, options) {
    var _a, _b, _c, _d, _e;
    var exclude = new Set(((_a = options === null || options === void 0 ? void 0 : options.excludeConfigurations) !== null && _a !== void 0 ? _a : []).filter(function (config) { return config != null; }));
    var siblingLineConfigurations = ((_b = options === null || options === void 0 ? void 0 : options.siblingLineConfigurations) !== null && _b !== void 0 ? _b : []).filter(function (config) { return config != null && !exclude.has(config); });
    var employeeId = ((_c = options === null || options === void 0 ? void 0 : options.employeeId) === null || _c === void 0 ? void 0 : _c.trim()) || undefined;
    var employeeReportedConfigurations = employeeId
        ? __spreadArray(__spreadArray([], ((_e = (_d = source.reportedConfigurationsByEmployee) === null || _d === void 0 ? void 0 : _d[employeeId]) !== null && _e !== void 0 ? _e : []), true), siblingLineConfigurations, true).filter(function (config) { return config != null && !exclude.has(config); })
        : undefined;
    return {
        mode: "remaining",
        originalConfiguration: source.jobConfiguration,
        otherLineConfigurations: __spreadArray(__spreadArray([], source.reportedConfigurations, true), siblingLineConfigurations, true).filter(function (config) { return config != null && !exclude.has(config); }),
        employeeId: employeeId,
        pickupsByEmployee: source.pickupsByEmployee,
        employeeReportedConfigurations: employeeReportedConfigurations
    };
}
/** Build reference context for the item config-table overlay.
 * When job + operation ids are available, the server reloads pickup/reported data. */
function buildProductionConfigTableReferenceContext(_a) {
    var source = _a.source, employeeId = _a.employeeId, jobId = _a.jobId, jobOperationId = _a.jobOperationId, _b = _a.siblingLineConfigurations, siblingLineConfigurations = _b === void 0 ? [] : _b;
    var trimmedJobId = jobId === null || jobId === void 0 ? void 0 : jobId.trim();
    var trimmedJobOperationId = jobOperationId === null || jobOperationId === void 0 ? void 0 : jobOperationId.trim();
    var trimmedEmployeeId = (employeeId === null || employeeId === void 0 ? void 0 : employeeId.trim()) || undefined;
    if (trimmedJobOperationId) {
        return {
            mode: "remaining",
            originalConfiguration: null,
            otherLineConfigurations: [],
            employeeId: trimmedEmployeeId,
            jobId: trimmedJobId,
            jobOperationId: trimmedJobOperationId,
            siblingLineConfigurations: siblingLineConfigurations
        };
    }
    if (!source)
        return undefined;
    return buildJobRemainingReferenceContext(source, {
        employeeId: trimmedEmployeeId,
        siblingLineConfigurations: siblingLineConfigurations
    });
}
