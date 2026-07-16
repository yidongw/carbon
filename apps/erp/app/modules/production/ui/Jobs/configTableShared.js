"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.jobConfigQuantitiesModalBodyClassName = exports.jobConfigQuantitiesModalShellClassName = exports.configParamsModalBodyClassName = exports.configParamsModalShellClassName = exports.configParamsModalContentClassName = void 0;
exports.buildColumns = buildColumns;
exports.makeDefaultRow = makeDefaultRow;
exports.getInitialRows = getInitialRows;
exports.zeroQuantities = zeroQuantities;
exports.computeTotal = computeTotal;
exports.normalizeNumberInputValue = normalizeNumberInputValue;
exports.normalizeRow = normalizeRow;
exports.hasValue = hasValue;
exports.getMergeKey = getMergeKey;
exports.mergeRows = mergeRows;
exports.getColumnWidthClass = getColumnWidthClass;
exports.getCellKey = getCellKey;
exports.validateCell = validateCell;
exports.formatSignedTotal = formatSignedTotal;
exports.ReadOnlyConfigTable = ReadOnlyConfigTable;
exports.EditableConfigGrid = EditableConfigGrid;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var configParamsTableColumns_1 = require("~/modules/production/configParamsTableColumns");
var ResponsiveConfigTable_1 = require("./ResponsiveConfigTable");
function buildColumns(parameters, defaultQuantityLabel) {
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
function makeDefaultRow(columns) {
    return Object.fromEntries(columns.map(function (col) {
        var _a, _b;
        return [
            col.key,
            col.type === "quantity"
                ? 0
                : col.type === "list"
                    ? ((_b = (_a = col.options) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "")
                    : ""
        ];
    }));
}
function getInitialRows(parameters, primaryParam, columns) {
    var _a;
    var nonPrimaryListParams = parameters.filter(function (p) {
        var _a, _b;
        return p !== primaryParam &&
            p.dataType === "list" &&
            ((_b = (_a = p.listOptions) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0;
    });
    if (nonPrimaryListParams.length === 0) {
        return [makeDefaultRow(columns)];
    }
    var firstListParam = nonPrimaryListParams[0];
    return ((_a = firstListParam.listOptions) !== null && _a !== void 0 ? _a : []).map(function (option) {
        var _a;
        return (__assign(__assign({}, makeDefaultRow(columns)), (_a = {}, _a[firstListParam.key] = option, _a)));
    });
}
/** Copy a row but reset all quantity columns to 0 (keeps descriptor columns). */
function zeroQuantities(row, columns) {
    var next = __assign({}, row);
    for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
        var col = columns_1[_i];
        if (col.type === "quantity")
            next[col.key] = 0;
    }
    return next;
}
function computeTotal(rows, primaryKeys) {
    return rows.reduce(function (sum, row) {
        return sum +
            primaryKeys.reduce(function (rowSum, key) { return rowSum + (Number(row[key]) || 0); }, 0);
    }, 0);
}
function normalizeNumberInputValue(value) {
    if (value === "")
        return "";
    var parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : "";
}
function normalizeRow(row, columns) {
    return Object.fromEntries(columns.map(function (col) {
        var value = row[col.key];
        if (col.type === "quantity") {
            if (value === undefined || value === null || value === "") {
                return [col.key, 0];
            }
            var parsed = Number(value);
            return [col.key, Number.isFinite(parsed) ? parsed : 0];
        }
        if (col.type === "numeric") {
            if (value === undefined || value === null || value === "") {
                return [col.key, ""];
            }
            return [col.key, normalizeNumberInputValue(String(value))];
        }
        return [col.key, value !== null && value !== void 0 ? value : ""];
    }));
}
function isZeroOrEmpty(value) {
    if (value === undefined)
        return true;
    var stringValue = String(value).trim();
    if (stringValue === "")
        return true;
    return Number(stringValue) === 0;
}
function hasValue(row, columns) {
    var quantityColumns = columns.filter(function (col) { return col.type === "quantity"; });
    if (quantityColumns.length > 0) {
        return quantityColumns.some(function (col) { return !isZeroOrEmpty(row[col.key]); });
    }
    return columns.some(function (col) { return !isZeroOrEmpty(row[col.key]); });
}
function getMergeKey(row, columns) {
    var descriptorColumns = columns.filter(function (col) { return col.type !== "quantity"; });
    if (descriptorColumns.length === 0) {
        return "__all__";
    }
    return JSON.stringify(descriptorColumns.map(function (col) { var _a; return String((_a = row[col.key]) !== null && _a !== void 0 ? _a : "").trim(); }));
}
function mergeRows(rows, columns) {
    var rowsByKey = new Map();
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        var key = getMergeKey(row, columns);
        var existingRow = rowsByKey.get(key);
        if (!existingRow) {
            rowsByKey.set(key, __assign({}, row));
            continue;
        }
        for (var _a = 0, columns_2 = columns; _a < columns_2.length; _a++) {
            var col = columns_2[_a];
            if (col.type !== "quantity")
                continue;
            existingRow[col.key] =
                (Number(existingRow[col.key]) || 0) + (Number(row[col.key]) || 0);
        }
    }
    return Array.from(rowsByKey.values());
}
function getColumnWidthClass(column, hasReferences) {
    switch (column.type) {
        case "quantity":
            return hasReferences
                ? "w-[10rem] min-w-[10rem] max-w-[10rem]"
                : "w-[7rem] min-w-[7rem] max-w-[7rem]";
        case "numeric":
        case "boolean":
            return "w-[8rem] min-w-[8rem] max-w-[8rem]";
        case "list":
        case "material":
            return "w-[9rem] min-w-[9rem] max-w-[9rem]";
        default:
            return "w-[10rem] min-w-[10rem] max-w-[10rem]";
    }
}
function getCellKey(rowIndex, columnKey) {
    return "".concat(rowIndex, ":").concat(columnKey);
}
/** Modal shell shared by config-table overlays and the local editor modal. */
exports.configParamsModalContentClassName = (0, react_1.cn)("flex max-h-[92vh] w-fit min-w-[20rem] max-w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden p-0 pt-0", "sm:w-fit md:w-fit sm:max-w-[calc(100vw-1.5rem)]", "[&>button]:z-20");
exports.configParamsModalShellClassName = "flex min-h-0 w-max min-w-full max-w-[calc(100vw-1.5rem)] flex-1 flex-col";
exports.configParamsModalBodyClassName = "min-w-0 flex-1 overflow-x-auto overflow-y-auto px-6 py-4";
/** Job config overlay: keep a stable width while switching Delta/Total tabs. */
exports.jobConfigQuantitiesModalShellClassName = "flex min-h-0 w-max min-w-full max-w-full flex-1 flex-col";
exports.jobConfigQuantitiesModalBodyClassName = "min-w-0 flex-1 overflow-x-auto overflow-y-auto px-6 py-4";
function validateCell(row, column, materialOptions, allowNegative) {
    var _a;
    var value = row[column.key];
    var stringValue = String(value !== null && value !== void 0 ? value : "").trim();
    switch (column.type) {
        case "quantity": {
            if (value === "" || value === undefined || value === null)
                return true;
            var num = Number(value);
            return Number.isFinite(num) && (allowNegative || num >= 0);
        }
        case "numeric":
            return stringValue !== "" && Number.isFinite(Number(value));
        case "boolean":
            return ["true", "false"].includes(stringValue);
        case "list":
            return !!((_a = column.options) === null || _a === void 0 ? void 0 : _a.includes(stringValue));
        case "material":
            return materialOptions.some(function (option) { return option.value === stringValue; });
        default:
            return stringValue.length > 0;
    }
}
function formatReferenceValue(value) {
    return Number.isInteger(value)
        ? String(value)
        : value.toLocaleString(undefined, { maximumFractionDigits: 4 });
}
function formatSignedTotal(value) {
    return value > 0 ? "+".concat(value) : String(value);
}
function quantityCellMatchesReference(cellValue, referenceValue) {
    if (referenceValue === undefined)
        return true;
    var input = Number(cellValue) || 0;
    return Math.abs(input - referenceValue) <= 0.0001;
}
/** Read-only rendering of a config table (used for the current snapshot, history
 * rows, and reported-by-process rows). When `onQuantityClick` is set, quantity
 * cells become buttons that pull the value into the adjustment editor. */
function ReadOnlyConfigTable(_a) {
    var columns = _a.columns, rows = _a.rows, signed = _a.signed, onQuantityClick = _a.onQuantityClick, optionLabels = _a.optionLabels;
    return (<ResponsiveConfigTable_1.ResponsiveConfigTable columns={columns} rows={rows} hasReferences={false} hideZeroValuesInVertical renderCell={function (col, row) {
            var _a;
            var raw = row[col.key];
            var numeric = Number(raw) || 0;
            var label = String(raw !== null && raw !== void 0 ? raw : "");
            var display = col.type === "quantity"
                ? signed
                    ? formatSignedTotal(numeric)
                    : String(numeric)
                : ((_a = optionLabels === null || optionLabels === void 0 ? void 0 : optionLabels[label]) !== null && _a !== void 0 ? _a : label);
            var clickable = col.type === "quantity" && !!onQuantityClick;
            return clickable ? (<button type="button" onClick={function () { return onQuantityClick === null || onQuantityClick === void 0 ? void 0 : onQuantityClick(row, col.key, numeric); }} className="rounded px-1.5 py-0.5 text-sm tabular-nums text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            {display}
          </button>) : (<span className="text-sm tabular-nums">{display}</span>);
        }}/>);
}
/** The editable quantity grid shared by the item draft editor and the job
 * adjustment editor. In `mode === "total"` quantity inputs show current + delta
 * and convert the entered total back to a delta via `baselineFor`. */
function EditableConfigGrid(_a) {
    var columns = _a.columns, rows = _a.rows, invalidCells = _a.invalidCells, referenceByRowIndex = _a.referenceByRowIndex, hasReferences = _a.hasReferences, allowNegative = _a.allowNegative, mode = _a.mode, baselineFor = _a.baselineFor, materialOptions = _a.materialOptions, updateCell = _a.updateCell, deleteRow = _a.deleteRow, _b = _a.readOnly, readOnly = _b === void 0 ? false : _b, _c = _a.allowRowMutations, allowRowMutations = _c === void 0 ? true : _c, canDeleteRow = _a.canDeleteRow, optionLabels = _a.optionLabels;
    var t = (0, macro_1.useLingui)().t;
    var renderCell = function (col, row, rowIndex) {
        var _a, _b;
        var cellValue = row[col.key];
        // Read-only descriptor columns (e.g. size/color in the split editor) render
        // as plain text — the value is fixed by the add button.
        if (col.readOnly && col.type !== "quantity") {
            var raw = String(cellValue !== null && cellValue !== void 0 ? cellValue : "");
            return (<span className="px-1 text-sm font-medium">
          {(optionLabels === null || optionLabels === void 0 ? void 0 : optionLabels[raw]) || raw || "—"}
        </span>);
        }
        var referenceValue = col.type === "quantity"
            ? (_a = referenceByRowIndex === null || referenceByRowIndex === void 0 ? void 0 : referenceByRowIndex[rowIndex]) === null || _a === void 0 ? void 0 : _a[col.key]
            : undefined;
        var isInvalid = invalidCells.has(getCellKey(rowIndex, col.key));
        var referenceMismatch = referenceValue !== undefined &&
            !quantityCellMatchesReference(cellValue, referenceValue);
        var inputClassName = (0, react_1.cn)("w-full rounded border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring", col.type === "quantity" && "border-sky-300 dark:border-sky-700", col.type === "quantity" &&
            !referenceMismatch &&
            "bg-sky-50/30 dark:bg-sky-950/20", col.type === "quantity" &&
            referenceMismatch &&
            "bg-yellow-100 dark:bg-yellow-950/40", isInvalid &&
            "border-destructive focus:ring-destructive dark:border-destructive");
        var isTotalMode = mode === "total" && col.type === "quantity";
        var baseline = isTotalMode ? baselineFor(row, col.key) : 0;
        if (["quantity", "numeric"].includes(col.type)) {
            if (col.type === "quantity" && referenceValue !== undefined) {
                return (<div className="flex min-w-0 items-center gap-1">
            <input type="number" min={allowNegative ? undefined : 0} disabled={readOnly} value={typeof cellValue === "boolean" ? "" : (cellValue !== null && cellValue !== void 0 ? cellValue : "")} onFocus={function (e) { return e.currentTarget.select(); }} onChange={function (e) {
                        return updateCell(rowIndex, col.key, normalizeNumberInputValue(e.target.value));
                    }} onBlur={function (e) {
                        if (e.currentTarget.value === "") {
                            updateCell(rowIndex, col.key, 0);
                        }
                    }} className={(0, react_1.cn)(inputClassName, "min-w-0 flex-1")}/>
            {readOnly ? null : (<button type="button" className={(0, react_1.cn)("shrink-0 rounded px-1 py-0.5 text-xs tabular-nums transition-colors hover:bg-muted", referenceValue < 0
                            ? "text-destructive"
                            : "text-muted-foreground hover:text-foreground")} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Fill cell"], ["Fill cell"])))} onClick={function () {
                            return updateCell(rowIndex, col.key, (0, configParamsTableColumns_1.fillValueFromReference)(referenceValue));
                        }}>
                {formatReferenceValue(referenceValue)}
              </button>)}
          </div>);
            }
            return (<input type="number" min={col.type === "quantity" && !allowNegative ? 0 : undefined} disabled={readOnly} value={isTotalMode
                    ? cellValue === "" || cellValue === undefined
                        ? ""
                        : baseline + (Number(cellValue) || 0)
                    : typeof cellValue === "boolean"
                        ? ""
                        : (cellValue !== null && cellValue !== void 0 ? cellValue : "")} onFocus={function (e) { return e.currentTarget.select(); }} onChange={function (e) {
                    var next = normalizeNumberInputValue(e.target.value);
                    updateCell(rowIndex, col.key, isTotalMode && next !== "" ? next - baseline : next);
                }} onBlur={function (e) {
                    if (e.currentTarget.value === "") {
                        updateCell(rowIndex, col.key, 0);
                    }
                }} className={(0, react_1.cn)(inputClassName, "w-full min-w-0 max-w-full tabular-nums")}/>);
        }
        if (col.type === "list") {
            return (<select value={String(cellValue !== null && cellValue !== void 0 ? cellValue : "")} disabled={readOnly} onChange={function (e) { return updateCell(rowIndex, col.key, e.target.value); }} className={(0, react_1.cn)(inputClassName, "min-w-[80px]")}>
          {(_b = col.options) === null || _b === void 0 ? void 0 : _b.map(function (opt) {
                    var _a;
                    return (<option key={opt} value={opt}>
              {(_a = optionLabels === null || optionLabels === void 0 ? void 0 : optionLabels[opt]) !== null && _a !== void 0 ? _a : opt}
            </option>);
                })}
        </select>);
        }
        if (col.type === "boolean") {
            return (<select value={String(cellValue !== null && cellValue !== void 0 ? cellValue : "")} disabled={readOnly} onChange={function (e) { return updateCell(rowIndex, col.key, e.target.value); }} className={(0, react_1.cn)(inputClassName, "min-w-[80px]")}>
          <option value=""/>
          <option value="true">{t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["True"], ["True"])))}</option>
          <option value="false">{t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["False"], ["False"])))}</option>
        </select>);
        }
        if (col.type === "material") {
            return (<react_1.Combobox value={String(cellValue !== null && cellValue !== void 0 ? cellValue : "")} options={materialOptions} isClearable isReadOnly={readOnly} onChange={function (value) { return updateCell(rowIndex, col.key, value); }} className={(0, react_1.cn)(inputClassName, "min-w-[80px]")}/>);
        }
        return (<input type="text" value={String(cellValue !== null && cellValue !== void 0 ? cellValue : "")} disabled={readOnly} onChange={function (e) { return updateCell(rowIndex, col.key, e.target.value); }} className={(0, react_1.cn)(inputClassName, "min-w-[80px]")}/>);
    };
    return (<ResponsiveConfigTable_1.ResponsiveConfigTable columns={columns} rows={rows} hasReferences={hasReferences} hideZeroValuesInVertical={readOnly} renderCell={renderCell} renderRowActions={readOnly
            ? undefined
            : function (rowIndex) {
                if (!allowRowMutations && !(canDeleteRow === null || canDeleteRow === void 0 ? void 0 : canDeleteRow(rowIndex))) {
                    return null;
                }
                return (<react_1.IconButton icon={<lu_1.LuTrash2 />} aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Delete row"], ["Delete row"])))} variant="ghost" size="sm" onClick={function () { return deleteRow(rowIndex); }}/>);
            }}/>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
