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
exports.buildConfigEditorRows = buildConfigEditorRows;
exports.ConfigParamsTableLocalModal = ConfigParamsTableLocalModal;
exports.toConfigTableValue = toConfigTableValue;
exports.useConfigTableModal = useConfigTableModal;
exports.ConfigParamsTableModal = ConfigParamsTableModal;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Enumerable_1 = require("~/components/Enumerable");
var Shape_1 = require("~/components/Form/Shape");
var configParamsTableColumns_1 = require("~/modules/production/configParamsTableColumns");
var configTableOverlay_1 = require("~/modules/production/configTableOverlay");
var path_1 = require("~/utils/path");
var configTableShared_1 = require("./configTableShared");
/** Flat editor columns: every list param as a descriptor + one Quantities cell. */
function buildFlatColumns(parameters, quantityLabel) {
    var cols = parameters
        .filter(function (p) { return p.dataType === "list"; })
        .map(function (p) {
        var _a;
        return ({
            key: p.key,
            label: p.label,
            type: "list",
            options: (_a = p.listOptions) !== null && _a !== void 0 ? _a : [],
            // Fixed by the add button — not editable in the row.
            readOnly: true
        });
    });
    cols.push({ key: "Quantities", label: quantityLabel, type: "quantity" });
    return cols;
}
/** Explode merged/matrix rows into one flat row per non-zero color/size cell. */
function matrixRowsToFlatRows(rows, primaryParam, primaryKeys, parameters) {
    var _a;
    var descriptorKeys = parameters
        .filter(function (p) { return p.dataType === "list" && p.key !== (primaryParam === null || primaryParam === void 0 ? void 0 : primaryParam.key); })
        .map(function (p) { return p.key; });
    var flat = [];
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var mr = rows_1[_i];
        for (var _b = 0, primaryKeys_1 = primaryKeys; _b < primaryKeys_1.length; _b++) {
            var pk = primaryKeys_1[_b];
            var qty = Number(mr[pk]) || 0;
            if (qty <= 0)
                continue;
            var row = { Quantities: qty };
            if (primaryParam)
                row[primaryParam.key] = pk;
            for (var _c = 0, descriptorKeys_1 = descriptorKeys; _c < descriptorKeys_1.length; _c++) {
                var dk = descriptorKeys_1[_c];
                row[dk] = (_a = mr[dk]) !== null && _a !== void 0 ? _a : "";
            }
            flat.push(row);
        }
    }
    return flat;
}
/** Merge flat rows back into the standard (matrix) config table shape. */
function flatRowsToMergedConfig(flatRows, parameters, primaryParam, primaryKeys, columns) {
    var _a, _b;
    if (!primaryParam) {
        var total = flatRows.reduce(function (s, r) { return s + (Number(r.Quantities) || 0); }, 0);
        return {
            configTable: [{ Quantities: total }],
            configTablePrimaryKeys: ["Quantities"]
        };
    }
    var descriptorKeys = parameters
        .filter(function (p) { return p.dataType === "list" && p.key !== primaryParam.key; })
        .map(function (p) { return p.key; });
    var matrixRows = [];
    for (var _i = 0, flatRows_1 = flatRows; _i < flatRows_1.length; _i++) {
        var fr = flatRows_1[_i];
        var primaryValue = String((_a = fr[primaryParam.key]) !== null && _a !== void 0 ? _a : "");
        if (!primaryKeys.includes(primaryValue))
            continue;
        var row = Object.fromEntries(primaryKeys.map(function (k) { return [k, 0]; }));
        for (var _c = 0, descriptorKeys_2 = descriptorKeys; _c < descriptorKeys_2.length; _c++) {
            var dk = descriptorKeys_2[_c];
            row[dk] = (_b = fr[dk]) !== null && _b !== void 0 ? _b : "";
        }
        row[primaryValue] = Number(fr.Quantities) || 0;
        matrixRows.push(row);
    }
    return {
        configTable: (0, configTableShared_1.mergeRows)(matrixRows, columns),
        configTablePrimaryKeys: primaryKeys
    };
}
function ConfigParamsTableModal(_a) {
    var _b, _c, _d, _e, _f, _g;
    var parameters = _a.parameters, initialRows = _a.initialRows, referenceByRowIndex = _a.referenceByRowIndex, splitMode = _a.splitMode, jobDisplayId = _a.jobDisplayId, optionLabels = _a.optionLabels, isEditingReport = _a.isEditingReport, onDismiss = _a.onDismiss, formAction = _a.action, fetcher = _a.fetcher, confirmMode = _a.confirmMode, onConfirmSuccess = _a.onConfirmSuccess;
    var t = (0, macro_1.useLingui)().t;
    // `"none"` is a read-only view: cells are disabled and the only button closes.
    var readOnly = confirmMode === "none";
    var flat = Boolean(splitMode);
    var materialShapeOptions = (0, Shape_1.useShape)();
    var materialOptions = materialShapeOptions.map(function (shape) { return ({
        label: <Enumerable_1.Enumerable value={shape.label}/>,
        value: shape.value
    }); });
    var _h = (0, configTableShared_1.buildColumns)(parameters, t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quantities"], ["Quantities"])))), primaryParam = _h.primaryParam, primaryKeys = _h.primaryKeys, columns = _h.columns;
    // In flat mode the grid uses one row per color/size (multiple allowed) with a
    // single Quantities column; the stored config is still merged on submit.
    var flatColumns = buildFlatColumns(parameters, t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Quantities"], ["Quantities"]))));
    var gridColumns = flat ? flatColumns : columns;
    var gridPrimaryKeys = flat ? ["Quantities"] : primaryKeys;
    var _j = (0, react_2.useState)(function () {
        if (flat) {
            var seed = initialRows && initialRows.length > 0
                ? matrixRowsToFlatRows(initialRows, primaryParam, primaryKeys, parameters)
                : [];
            return seed.length > 0
                ? seed.map(function (row) { return (0, configTableShared_1.normalizeRow)(row, flatColumns); })
                : [(0, configTableShared_1.makeDefaultRow)(flatColumns)];
        }
        if (initialRows && initialRows.length > 0) {
            return initialRows.map(function (row) { return (0, configTableShared_1.normalizeRow)(row, columns); });
        }
        return (0, configTableShared_1.getInitialRows)(parameters, primaryParam, columns);
    }), rows = _j[0], setRows = _j[1];
    var _k = (0, react_2.useState)(new Set()), invalidCells = _k[0], setInvalidCells = _k[1];
    var _l = (0, react_2.useState)(""), validationError = _l[0], setValidationError = _l[1];
    var hasReferences = !flat && ((_b = referenceByRowIndex === null || referenceByRowIndex === void 0 ? void 0 : referenceByRowIndex.length) !== null && _b !== void 0 ? _b : 0) > 0;
    var total = (0, configTableShared_1.computeTotal)(rows, gridPrimaryKeys);
    // When editing an existing report, measure the change against the report's
    // original total (its saved config = `initialRows`) rather than the plan.
    var baselineTotal = (0, react_2.useMemo)(function () {
        if (!isEditingReport)
            return 0;
        var sum = 0;
        for (var _i = 0, _a = initialRows !== null && initialRows !== void 0 ? initialRows : []; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, primaryKeys_2 = primaryKeys; _b < primaryKeys_2.length; _b++) {
                var key = primaryKeys_2[_b];
                sum += Number(row[key]) || 0;
            }
        }
        return sum;
    }, [isEditingReport, initialRows, primaryKeys]);
    var delta = total - baselineTotal;
    var addRow = function () { return setRows(function (prev) { return __spreadArray(__spreadArray([], prev, true), [(0, configTableShared_1.makeDefaultRow)(gridColumns)], false); }); };
    var deleteRow = function (index) {
        return setRows(function (prev) { return prev.filter(function (_, i) { return i !== index; }); });
    };
    var updateCell = function (rowIndex, colKey, value) {
        setRows(function (prev) {
            return prev.map(function (row, i) {
                var _a;
                return (i === rowIndex ? __assign(__assign({}, row), (_a = {}, _a[colKey] = value, _a)) : row);
            });
        });
        setInvalidCells(function (prev) {
            var next = new Set(prev);
            next.delete((0, configTableShared_1.getCellKey)(rowIndex, colKey));
            return next;
        });
        setValidationError("");
    };
    // Flat (report) mode: per-color/size plan caps from the config-param reference,
    // so we can offer a button per plannable cell and warn if a cell's entered
    // quantity exceeds its plan.
    var colorKey = (_d = (_c = parameters.find(function (p) { return p.key === "color"; })) === null || _c === void 0 ? void 0 : _c.key) !== null && _d !== void 0 ? _d : "color";
    var sizeKey = (_f = (_e = parameters.find(function (p) { return p.key === "size"; })) === null || _e === void 0 ? void 0 : _e.key) !== null && _f !== void 0 ? _f : "size";
    var cellKeyOf = function (color, size) {
        return "".concat(String(color !== null && color !== void 0 ? color : ""), "|").concat(String(size !== null && size !== void 0 ? size : ""));
    };
    var planCells = [];
    if (flat) {
        var descriptorKeys_3 = parameters
            .filter(function (p) { return p.dataType === "list" && p.key !== (primaryParam === null || primaryParam === void 0 ? void 0 : primaryParam.key); })
            .map(function (p) { return p.key; });
        (initialRows !== null && initialRows !== void 0 ? initialRows : []).forEach(function (row, i) {
            var _a, _b, _c, _d;
            var refs = (_a = referenceByRowIndex === null || referenceByRowIndex === void 0 ? void 0 : referenceByRowIndex[i]) !== null && _a !== void 0 ? _a : {};
            for (var _i = 0, primaryKeys_3 = primaryKeys; _i < primaryKeys_3.length; _i++) {
                var pk = primaryKeys_3[_i];
                var cap = Number(refs[pk]) || 0;
                if (cap <= 0)
                    continue;
                var cellRow = {};
                if (primaryParam)
                    cellRow[primaryParam.key] = pk;
                for (var _e = 0, descriptorKeys_4 = descriptorKeys_3; _e < descriptorKeys_4.length; _e++) {
                    var dk = descriptorKeys_4[_e];
                    cellRow[dk] = (_b = row[dk]) !== null && _b !== void 0 ? _b : "";
                }
                planCells.push({
                    colorCode: String((_c = cellRow[colorKey]) !== null && _c !== void 0 ? _c : ""),
                    sizeCode: String((_d = cellRow[sizeKey]) !== null && _d !== void 0 ? _d : ""),
                    cap: cap
                });
            }
        });
    }
    var enteredByCell = new Map();
    for (var _i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
        var r = rows_2[_i];
        var k = cellKeyOf(r[colorKey], r[sizeKey]);
        enteredByCell.set(k, ((_g = enteredByCell.get(k)) !== null && _g !== void 0 ? _g : 0) + (Number(r.Quantities) || 0));
    }
    var capByCell = new Map(planCells.map(function (c) { return [cellKeyOf(c.colorCode, c.sizeCode), c.cap]; }));
    var remainingForCell = function (c) { var _a; return c.cap - ((_a = enteredByCell.get(cellKeyOf(c.colorCode, c.sizeCode))) !== null && _a !== void 0 ? _a : 0); };
    var addableCells = planCells.filter(function (c) { return remainingForCell(c) > 0; });
    var totalPlan = planCells.reduce(function (s, c) { return s + c.cap; }, 0);
    var planRemaining = totalPlan - total;
    var overPlan = false;
    for (var _m = 0, enteredByCell_1 = enteredByCell; _m < enteredByCell_1.length; _m++) {
        var _o = enteredByCell_1[_m], k = _o[0], entered = _o[1];
        var cap = capByCell.get(k);
        if (cap !== undefined && entered > cap)
            overPlan = true;
    }
    // Over the plan either per-cell (a color/size exceeds its own cap) or in total
    // (the grand total exceeds the plan — e.g. reporting more once every cell's
    // remaining is already 0, so there are no positive per-cell caps to trip).
    // Editing a report shouldn't be gated on the plan "remaining" — the report's
    // own quantity already counts against it, so the calc is always "over".
    var exceedsPlan = !isEditingReport && (overPlan || planRemaining < 0);
    // Mark the quantity cell red for every row whose color/size aggregate exceeds
    // its plan (same as Split Batch).
    var overCellKeys = new Set();
    if (flat) {
        rows.forEach(function (r, i) {
            var _a;
            var k = cellKeyOf(r[colorKey], r[sizeKey]);
            var cap = capByCell.get(k);
            if (cap !== undefined && ((_a = enteredByCell.get(k)) !== null && _a !== void 0 ? _a : 0) > cap) {
                overCellKeys.add((0, configTableShared_1.getCellKey)(i, "Quantities"));
            }
        });
    }
    var gridInvalidCells = overCellKeys.size > 0
        ? new Set(__spreadArray(__spreadArray([], invalidCells, true), overCellKeys, true))
        : invalidCells;
    var addCellRow = function (c) {
        return setRows(function (prev) {
            var _a;
            return __spreadArray(__spreadArray([], prev, true), [
                (0, configTableShared_1.normalizeRow)((_a = {},
                    _a[colorKey] = c.colorCode,
                    _a[sizeKey] = c.sizeCode,
                    _a.Quantities = Math.max(0, remainingForCell(c)),
                    _a), gridColumns)
            ], false);
        });
    };
    var handleSubmit = function () {
        var _a, _b, _c, _d;
        // Can't confirm while the report exceeds its config-param plan.
        if (flat && exceedsPlan)
            return;
        var normalizedRows = rows.map(function (row) { return (0, configTableShared_1.normalizeRow)(row, gridColumns); });
        var populatedRows = normalizedRows
            .map(function (row, rowIndex) { return ({ row: row, rowIndex: rowIndex }); })
            .filter(function (_a) {
            var row = _a.row;
            return (0, configTableShared_1.hasValue)(row, gridColumns);
        });
        var nextInvalidCells = new Set();
        for (var _i = 0, populatedRows_1 = populatedRows; _i < populatedRows_1.length; _i++) {
            var _e = populatedRows_1[_i], row = _e.row, rowIndex = _e.rowIndex;
            for (var _f = 0, gridColumns_1 = gridColumns; _f < gridColumns_1.length; _f++) {
                var column = gridColumns_1[_f];
                if (!(0, configTableShared_1.validateCell)(row, column, materialOptions, false)) {
                    nextInvalidCells.add((0, configTableShared_1.getCellKey)(rowIndex, column.key));
                }
            }
        }
        if (nextInvalidCells.size > 0) {
            setInvalidCells(nextInvalidCells);
            setValidationError(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Some cells have invalid values. Fix the highlighted cells before saving."], ["Some cells have invalid values. Fix the highlighted cells before saving."]))));
            return;
        }
        setInvalidCells(new Set());
        setValidationError("");
        var rowsToSave = populatedRows.map(function (_a) {
            var row = _a.row;
            return row;
        });
        var configuration;
        if (flat) {
            // Store the merged config (unchanged downstream) + the raw rows so a master
            // WO cutting report can prefill one bundle per row in Split Batch.
            var merged = flatRowsToMergedConfig(rowsToSave, parameters, primaryParam, primaryKeys, columns);
            var colorKey_1 = (_b = (_a = parameters.find(function (p) { return p.key === "color"; })) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : "color";
            var sizeKey_1 = (_d = (_c = parameters.find(function (p) { return p.key === "size"; })) === null || _c === void 0 ? void 0 : _c.key) !== null && _d !== void 0 ? _d : "size";
            configuration = __assign(__assign({}, merged), { splitRows: rowsToSave.map(function (r) {
                    var _a, _b;
                    return ({
                        colorCode: String((_a = r[colorKey_1]) !== null && _a !== void 0 ? _a : "") || null,
                        sizeCode: String((_b = r[sizeKey_1]) !== null && _b !== void 0 ? _b : "") || null,
                        quantity: Number(r.Quantities) || 0
                    });
                }) });
        }
        else {
            configuration = {
                configTable: (0, configTableShared_1.mergeRows)(rowsToSave, columns),
                configTablePrimaryKeys: primaryKeys
            };
        }
        if (confirmMode === "client") {
            onConfirmSuccess((0, configTableOverlay_1.buildConfigTableActionResponse)(configuration));
            return;
        }
        if (!formAction || !fetcher)
            return;
        var formData = new FormData();
        formData.append("configuration", JSON.stringify(configuration));
        fetcher.submit(formData, { method: "post", action: formAction });
    };
    var tableSection = (<>
      <configTableShared_1.EditableConfigGrid columns={gridColumns} rows={rows} invalidCells={gridInvalidCells} referenceByRowIndex={flat ? undefined : referenceByRowIndex} hasReferences={hasReferences} allowNegative={false} mode="delta" baselineFor={function () { return 0; }} materialOptions={materialOptions} updateCell={updateCell} deleteRow={deleteRow} optionLabels={optionLabels} readOnly={readOnly}/>
      {validationError && (<div className="text-sm text-destructive">{validationError}</div>)}
      <react_1.HStack className="mt-4 items-start justify-between">
        {readOnly ? (<span />) : flat ? (
        // Flat mode never offers a generic "add row" — you can only add a row
        // for a specific plannable color/size (and nothing once every cell's
        // remaining is used up).
        <div className="flex flex-wrap gap-2">
            {addableCells.map(function (c) { return (<react_1.Button key={cellKeyOf(c.colorCode, c.sizeCode)} type="button" variant="secondary" size="sm" leftIcon={<lu_1.LuPlus />} onClick={function () { return addCellRow(c); }}>
                {c.sizeCode || "—"} ·{" "}
                {(optionLabels === null || optionLabels === void 0 ? void 0 : optionLabels[c.colorCode]) || c.colorCode || "—"} ·{" "}
                <span className="tabular-nums">{remainingForCell(c)}</span>
              </react_1.Button>); })}
          </div>) : (<react_1.Button type="button" variant="secondary" size="sm" onClick={addRow} leftIcon={<lu_1.LuPlus />}>
            <macro_1.Trans>Add Row</macro_1.Trans>
          </react_1.Button>)}
        <span className="shrink-0 text-sm text-muted-foreground">
          <macro_1.Trans>Total</macro_1.Trans>:{" "}
          <strong className="text-foreground">{total}</strong>
        </span>
      </react_1.HStack>
    </>);
    var footer = readOnly ? (<react_1.HStack className="justify-end">
      <react_1.Button type="button" variant="primary" onClick={onDismiss}>
        <macro_1.Trans>Close</macro_1.Trans>
      </react_1.Button>
    </react_1.HStack>) : (<react_1.HStack className="justify-between">
      {flat && isEditingReport ? (<react_1.HStack spacing={3} className="text-sm text-muted-foreground">
          <span>
            <macro_1.Trans>Delta</macro_1.Trans>:{" "}
            <strong className={delta < 0
                ? "tabular-nums text-red-500"
                : "tabular-nums text-foreground"}>
              {delta > 0 ? "+".concat(delta) : delta}
            </strong>
          </span>
        </react_1.HStack>) : flat ? (<react_1.HStack spacing={3} className="text-sm text-muted-foreground">
          <span>
            <macro_1.Trans>Remaining</macro_1.Trans>:{" "}
            <strong className={planRemaining < 0
                ? "tabular-nums text-red-500"
                : "tabular-nums text-foreground"}>
              {planRemaining}
            </strong>
          </span>
          {exceedsPlan ? (<span className="text-amber-600 dark:text-amber-500">
              <macro_1.Trans>Exceeds plan</macro_1.Trans>
            </span>) : null}
        </react_1.HStack>) : (<span />)}
      <react_1.HStack className="gap-2">
        <react_1.Button type="button" variant="ghost" onClick={onDismiss}>
          <macro_1.Trans>Cancel</macro_1.Trans>
        </react_1.Button>
        <react_1.Button type="button" variant="primary" isLoading={fetcher ? fetcher.state !== "idle" : false} isDisabled={(fetcher ? fetcher.state !== "idle" : false) ||
            (flat && exceedsPlan)} onClick={handleSubmit}>
          <macro_1.Trans>Confirm</macro_1.Trans>
        </react_1.Button>
      </react_1.HStack>
    </react_1.HStack>);
    return (<div className={configTableShared_1.configParamsModalShellClassName}>
      <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
        <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
          <macro_1.Trans>Configuration Parameters</macro_1.Trans>
        </h3>
        {jobDisplayId ? (<p className="mt-1 text-sm text-muted-foreground">{jobDisplayId}</p>) : null}
      </div>
      <div className={configTableShared_1.configParamsModalBodyClassName}>{tableSection}</div>
      <div className="shrink-0 border-t border-border px-6 py-4">{footer}</div>
    </div>);
}
function extractConfigTable(configuration) {
    if (!configuration ||
        typeof configuration !== "object" ||
        Array.isArray(configuration)) {
        return undefined;
    }
    var table = configuration.configTable;
    return Array.isArray(table) ? table : undefined;
}
/**
 * Compute editor rows + click-to-fill hints (client-side) from the raw inputs:
 * the fetched `parameters`, the in-memory draft `configuration`, and (when there
 * are reference hints) a fully-built `referenceContext`. Shared by the local
 * modal and the table-cell overlay render.
 */
function buildConfigEditorRows(_a) {
    var parameters = _a.parameters, configuration = _a.configuration, referenceContext = _a.referenceContext, _b = _a.prefillFromReference, prefillFromReference = _b === void 0 ? false : _b;
    var configTable = extractConfigTable(configuration);
    if (!referenceContext)
        return { initialRows: configTable };
    var editor = (0, configParamsTableColumns_1.buildConfigTableEditorState)({
        parameters: parameters,
        defaultQuantityLabel: "Quantities",
        currentConfiguration: configTable !== undefined ? { configTable: configTable } : undefined,
        referenceContext: referenceContext,
        prefillFromReference: prefillFromReference
    });
    return {
        initialRows: editor.rows,
        referenceByRowIndex: editor.referenceByRowIndex
    };
}
/** Endpoint URL carrying only the fetch keys (ids) — never the draft config. */
function configSourceUrl(itemId, keys) {
    var base = path_1.path.to.api.itemConfigTable(itemId);
    var params = new URLSearchParams();
    if (keys.jobId)
        params.set("jobId", keys.jobId);
    if (keys.jobOperationId)
        params.set("jobOperationId", keys.jobOperationId);
    if (keys.reportKind)
        params.set("reportKind", keys.reportKind);
    var query = params.toString();
    return query ? "".concat(base, "?").concat(query) : base;
}
/**
 * Local (non-overlay) config-table editor. A parent form owns the open state and
 * gets the edited config via `onConfirm`.
 *
 * Clean fetch/pass split: only fetch keys (`itemId` + `jobId`/`jobOperationId`/
 * `reportKind`) go to the loader, which returns `parameters` + the DB-resolved
 * `referenceSource`. The in-memory draft `configuration` is a prop, and the
 * parent supplies `buildReferenceContext(source)` (it owns the in-memory
 * reference inputs). Editor rows + hints are computed here, client-side.
 */
function ConfigParamsTableLocalModal(_a) {
    var _b, _c;
    var open = _a.open, onClose = _a.onClose, onConfirm = _a.onConfirm, itemId = _a.itemId, jobId = _a.jobId, jobOperationId = _a.jobOperationId, reportKind = _a.reportKind, configuration = _a.configuration, buildReferenceContext = _a.buildReferenceContext, _d = _a.prefillFromReference, prefillFromReference = _d === void 0 ? false : _d, _e = _a.splitMode, splitMode = _e === void 0 ? false : _e, jobDisplayId = _a.jobDisplayId, isEditingReport = _a.isEditingReport;
    var fetcher = (0, react_router_1.useFetcher)();
    var load = (0, react_2.useRef)(fetcher.load);
    load.current = fetcher.load;
    (0, react_2.useEffect)(function () {
        if (!open || !itemId)
            return;
        void load.current(configSourceUrl(itemId, { jobId: jobId, jobOperationId: jobOperationId, reportKind: reportKind }));
    }, [open, itemId, jobId, jobOperationId, reportKind]);
    if (!open)
        return null;
    var data = fetcher.data;
    var isLoading = data === undefined && fetcher.state !== "idle";
    var referenceContext = data
        ? buildReferenceContext === null || buildReferenceContext === void 0 ? void 0 : buildReferenceContext(data.referenceSource)
        : undefined;
    var _f = ((_b = data === null || data === void 0 ? void 0 : data.parameters) === null || _b === void 0 ? void 0 : _b.length)
        ? buildConfigEditorRows({
            parameters: data.parameters,
            configuration: configuration,
            referenceContext: referenceContext,
            prefillFromReference: prefillFromReference
        })
        : {}, initialRows = _f.initialRows, referenceByRowIndex = _f.referenceByRowIndex;
    return (<react_1.Modal open onOpenChange={function (next) {
            if (!next)
                onClose();
        }}>
      <react_1.ModalContent className={configTableShared_1.configParamsModalContentClassName}>
        {((_c = data === null || data === void 0 ? void 0 : data.parameters) === null || _c === void 0 ? void 0 : _c.length) ? (<ConfigParamsTableModal parameters={data.parameters} initialRows={initialRows} referenceByRowIndex={referenceByRowIndex} splitMode={splitMode} jobDisplayId={jobDisplayId !== null && jobDisplayId !== void 0 ? jobDisplayId : data.itemReadableId} isEditingReport={isEditingReport} confirmMode="client" onConfirmSuccess={onConfirm} onDismiss={onClose}/>) : (<div className="flex min-h-[200px] items-center justify-center p-6">
            <react_1.Loading isLoading={isLoading}/>
          </div>)}
      </react_1.ModalContent>
    </react_1.Modal>);
}
/**
 * Build the editor's `configuration` input from the current table rows, falling
 * back to a saved/initial configuration when nothing has been edited yet.
 */
function toConfigTableValue(rows, primaryKeys, fallback) {
    return rows && primaryKeys.length > 0
        ? { configTable: rows, configTablePrimaryKeys: primaryKeys }
        : fallback;
}
/**
 * Manage a single local config-table editor. Call `open(request)` to show it;
 * render `node`. Handles open state, the success check, and closing — so callers
 * just describe what to fetch/pass and what to do on confirm.
 */
function useConfigTableModal() {
    var _a = (0, react_2.useState)(null), request = _a[0], setRequest = _a[1];
    var open = (0, react_2.useCallback)(function (next) { return setRequest(next); }, []);
    var close = (0, react_2.useCallback)(function () { return setRequest(null); }, []);
    var node = request ? (<ConfigParamsTableLocalModal open onClose={close} onConfirm={function (data) {
            if ((0, configTableOverlay_1.isConfigTableOverlaySuccess)(data))
                request.onConfirm(data);
            close();
        }} itemId={request.itemId} jobId={request.jobId} jobOperationId={request.jobOperationId} reportKind={request.reportKind} configuration={request.configuration} buildReferenceContext={request.buildReferenceContext} prefillFromReference={request.prefillFromReference} splitMode={request.splitMode} jobDisplayId={request.jobDisplayId} isEditingReport={request.isEditingReport}/>) : null;
    return { open: open, node: node };
}
exports.default = ConfigParamsTableModal;
var templateObject_1, templateObject_2, templateObject_3;
