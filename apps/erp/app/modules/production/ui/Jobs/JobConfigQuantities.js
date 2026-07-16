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
exports.JobConfigQuantities = JobConfigQuantities;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Shape_1 = require("~/components/Form/Shape");
var hooks_1 = require("~/hooks");
var jobConfiguration_1 = require("~/modules/production/jobConfiguration");
var configTableShared_1 = require("./configTableShared");
function HistoryList(_a) {
    var history = _a.history, columns = _a.columns, optionLabels = _a.optionLabels;
    var formatDateTime = (0, hooks_1.useDateFormatter)().formatDateTime;
    var _b = (0, react_2.useState)(new Set()), expanded = _b[0], setExpanded = _b[1];
    var toggle = function (id) {
        return setExpanded(function (prev) {
            var next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    if (history.length === 0) {
        return (<p className="text-sm text-muted-foreground">
        <macro_1.Trans>No changes yet.</macro_1.Trans>
      </p>);
    }
    return (<div className="flex flex-col gap-1">
      {history.map(function (entry) {
            var _a;
            var isExpanded = expanded.has(entry.id);
            return (<div key={entry.id} className="rounded border border-border bg-card">
            <button type="button" onClick={function () { return toggle(entry.id); }} className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/50">
              <lu_1.LuChevronRight className={(0, react_1.cn)("shrink-0 text-muted-foreground transition-transform", isExpanded && "rotate-90")}/>
              <span className={(0, react_1.cn)("w-16 shrink-0 font-medium tabular-nums", entry.quantity < 0 ? "text-destructive" : "text-emerald-600")}>
                {(0, configTableShared_1.formatSignedTotal)(entry.quantity)}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                {entry.createdByName ? "".concat(entry.createdByName, " \u00B7 ") : ""}
                {formatDateTime(entry.createdAt)}
              </span>
            </button>
            {isExpanded ? (<div className="border-t border-border px-3 py-2">
                <configTableShared_1.ReadOnlyConfigTable columns={columns} rows={(_a = entry.configuration.configTable) !== null && _a !== void 0 ? _a : []} optionLabels={optionLabels} signed/>
              </div>) : null}
          </div>);
        })}
    </div>);
}
function JobConfigQuantities(_a) {
    var parameters = _a.parameters, initialRows = _a.initialRows, jobDisplayId = _a.jobDisplayId, history = _a.history, optionLabels = _a.optionLabels, onDismiss = _a.onDismiss, formAction = _a.action, fetcher = _a.fetcher;
    var t = (0, macro_1.useLingui)().t;
    var materialShapeOptions = (0, Shape_1.useShape)();
    var materialOptions = materialShapeOptions.map(function (shape) { return ({
        label: <Enumerable_1.Enumerable value={shape.label}/>,
        value: shape.value
    }); });
    var defaultQuantityLabel = t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quantities"], ["Quantities"])));
    var _b = (0, react_2.useMemo)(function () { return (0, configTableShared_1.buildColumns)(parameters, defaultQuantityLabel); }, [parameters, defaultQuantityLabel]), primaryParam = _b.primaryParam, primaryKeys = _b.primaryKeys, columns = _b.columns;
    var currentRows = (0, react_2.useMemo)(function () {
        return initialRows && initialRows.length > 0
            ? initialRows.map(function (row) { return (0, configTableShared_1.normalizeRow)(row, columns); })
            : [];
    }, [initialRows, columns]);
    var _c = (0, react_2.useState)(function () {
        return currentRows.length > 0
            ? currentRows.map(function (row) { return (0, configTableShared_1.zeroQuantities)(row, columns); })
            : (0, configTableShared_1.getInitialRows)(parameters, primaryParam, columns);
    }), rows = _c[0], setRows = _c[1];
    var initialRowKeysRef = (0, react_2.useRef)(null);
    if (initialRowKeysRef.current === null) {
        initialRowKeysRef.current = new Set(rows.map(function (row) { return (0, configTableShared_1.getMergeKey)(row, columns); }));
    }
    var _d = (0, react_2.useState)(new Set()), invalidCells = _d[0], setInvalidCells = _d[1];
    var _e = (0, react_2.useState)(""), validationError = _e[0], setValidationError = _e[1];
    // Delta = enter the change (default); Total = enter the target quantity.
    // Either way the underlying state stays the signed delta, so the two tabs
    // are just different views of the same pending edit and history keeps deltas.
    var _f = (0, react_2.useState)("delta"), mode = _f[0], setMode = _f[1];
    // Match an adjustment row to its current-quantity baseline by descriptor
    // columns, so Total view can show current+delta and clicks can compute deltas.
    var currentByKey = (0, react_2.useMemo)(function () {
        var map = new Map();
        for (var _i = 0, currentRows_1 = currentRows; _i < currentRows_1.length; _i++) {
            var row = currentRows_1[_i];
            map.set((0, configTableShared_1.getMergeKey)(row, columns), row);
        }
        return map;
    }, [currentRows, columns]);
    var baselineFor = function (row, colKey) {
        var current = currentByKey.get((0, configTableShared_1.getMergeKey)(row, columns));
        return current ? Number(current[colKey]) || 0 : 0;
    };
    var preview = (0, react_2.useMemo)(function () {
        return (0, jobConfiguration_1.applyConfigAdjustment)({ configTable: currentRows, configTablePrimaryKeys: primaryKeys }, { configTable: rows, configTablePrimaryKeys: primaryKeys });
    }, [currentRows, rows, primaryKeys]);
    var hasAdjustment = rows.some(function (row) {
        return primaryKeys.some(function (key) { return (Number(row[key]) || 0) !== 0; });
    });
    var deleteRow = function (index) {
        return setRows(function (prev) { return prev.filter(function (_, i) { return i !== index; }); });
    };
    var canDeleteRow = function (rowIndex) {
        var _a;
        var key = (0, configTableShared_1.getMergeKey)(rows[rowIndex], columns);
        return !((_a = initialRowKeysRef.current) === null || _a === void 0 ? void 0 : _a.has(key));
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
    // Clicking a process quantity targets that absolute value on the matching
    // adjustment row (by descriptor merge key): stored delta becomes
    // (value - current baseline) so both Delta and Total views agree.
    var handleSubmit = function () {
        var normalizedRows = rows.map(function (row) { return (0, configTableShared_1.normalizeRow)(row, columns); });
        var populatedRows = normalizedRows
            .map(function (row, rowIndex) { return ({ row: row, rowIndex: rowIndex }); })
            .filter(function (_a) {
            var row = _a.row;
            return (0, configTableShared_1.hasValue)(row, columns);
        });
        var nextInvalidCells = new Set();
        for (var _i = 0, populatedRows_1 = populatedRows; _i < populatedRows_1.length; _i++) {
            var _a = populatedRows_1[_i], row = _a.row, rowIndex = _a.rowIndex;
            for (var _b = 0, columns_1 = columns; _b < columns_1.length; _b++) {
                var column = columns_1[_b];
                if (!(0, configTableShared_1.validateCell)(row, column, materialOptions, true)) {
                    nextInvalidCells.add((0, configTableShared_1.getCellKey)(rowIndex, column.key));
                }
            }
        }
        if (nextInvalidCells.size > 0) {
            setInvalidCells(nextInvalidCells);
            setValidationError(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Some cells have invalid values. Fix the highlighted cells before saving."], ["Some cells have invalid values. Fix the highlighted cells before saving."]))));
            return;
        }
        setInvalidCells(new Set());
        setValidationError("");
        var rowsToSave = populatedRows.map(function (_a) {
            var row = _a.row;
            return row;
        });
        var mergedRows = (0, configTableShared_1.mergeRows)(rowsToSave, columns);
        if (mergedRows.length === 0) {
            setValidationError(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Enter an adjustment before saving."], ["Enter an adjustment before saving."]))));
            return;
        }
        if (preview.hasNegative) {
            setValidationError(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["This adjustment would take a quantity below zero."], ["This adjustment would take a quantity below zero."]))));
            return;
        }
        if (!formAction)
            return;
        var formData = new FormData();
        formData.append("adjustment", JSON.stringify({
            configTable: mergedRows,
            configTablePrimaryKeys: primaryKeys
        }));
        fetcher.submit(formData, { method: "post", action: formAction });
    };
    var confirmDisabled = fetcher.state !== "idle" || !hasAdjustment || preview.hasNegative;
    return (<div className={configTableShared_1.jobConfigQuantitiesModalShellClassName}>
      <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
        <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
          <macro_1.Trans>Configuration Parameters</macro_1.Trans>
        </h3>
        {jobDisplayId ? (<p className="mt-1 text-sm text-muted-foreground">{jobDisplayId}</p>) : null}
      </div>
      <div className={configTableShared_1.jobConfigQuantitiesModalBodyClassName}>
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">
                <macro_1.Trans>Current</macro_1.Trans>
              </h4>
              <span className="text-sm text-muted-foreground">
                <macro_1.Trans>Total</macro_1.Trans>:{" "}
                <strong className="text-foreground">
                  {(0, configTableShared_1.computeTotal)(currentRows, primaryKeys)}
                </strong>
              </span>
            </div>
            {currentRows.length > 0 ? (<configTableShared_1.ReadOnlyConfigTable columns={columns} rows={currentRows} optionLabels={optionLabels}/>) : (<p className="text-sm text-muted-foreground">
                <macro_1.Trans>No quantity recorded yet.</macro_1.Trans>
              </p>)}
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-medium text-foreground">
                <macro_1.Trans>Add or remove quantity</macro_1.Trans>
              </h4>
              <components_1.PillSegmentedControl value={mode} onChange={setMode} aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Adjustment input mode"], ["Adjustment input mode"])))} options={[
            { value: "delta", label: <macro_1.Trans>Delta</macro_1.Trans> },
            { value: "total", label: <macro_1.Trans>Total</macro_1.Trans> }
        ]}/>
            </div>
            <p className="text-xs text-muted-foreground">
              {mode === "delta" ? (<macro_1.Trans>
                  Enter a positive number to add or a negative number to
                  subtract.
                </macro_1.Trans>) : (<macro_1.Trans>Enter the target quantity for each size.</macro_1.Trans>)}
            </p>
            <configTableShared_1.EditableConfigGrid columns={columns} rows={rows} invalidCells={invalidCells} hasReferences={false} allowNegative mode={mode} baselineFor={baselineFor} materialOptions={materialOptions} updateCell={updateCell} deleteRow={deleteRow} allowRowMutations={false} canDeleteRow={canDeleteRow} optionLabels={optionLabels}/>
            {validationError && (<div className="text-sm text-destructive">{validationError}</div>)}
            <react_1.HStack className="mt-4 justify-end">
              <span className="text-sm text-muted-foreground">
                <macro_1.Trans>Adjustment</macro_1.Trans>:{" "}
                <strong className="text-foreground">
                  {(0, configTableShared_1.formatSignedTotal)(preview.deltaTotal)}
                </strong>
              </span>
            </react_1.HStack>
            <div className="flex items-center justify-end gap-2 text-sm">
              <span className="text-muted-foreground">
                <macro_1.Trans>New total</macro_1.Trans>:
              </span>
              <strong className={(0, react_1.cn)("tabular-nums", preview.hasNegative ? "text-destructive" : "text-foreground")}>
                {preview.total}
              </strong>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-foreground">
              <macro_1.Trans>History</macro_1.Trans>
            </h4>
            <HistoryList history={history !== null && history !== void 0 ? history : []} columns={columns} optionLabels={optionLabels}/>
          </section>
        </div>
      </div>
      <div className="shrink-0 border-t border-border px-6 py-4">
        <react_1.HStack className="justify-end gap-2">
          <react_1.Button type="button" variant="ghost" onClick={onDismiss}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <react_1.Button type="button" variant="primary" isLoading={fetcher.state !== "idle"} isDisabled={confirmDisabled} onClick={handleSubmit}>
            <macro_1.Trans>Confirm</macro_1.Trans>
          </react_1.Button>
        </react_1.HStack>
      </div>
    </div>);
}
exports.default = JobConfigQuantities;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
