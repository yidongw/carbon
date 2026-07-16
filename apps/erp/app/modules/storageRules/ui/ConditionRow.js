"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONDITION_GRID_CLASS = void 0;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var FieldCombobox_1 = require("./FieldCombobox");
var OperatorCombobox_1 = require("./OperatorCombobox");
var ValueInput_1 = require("./ValueInput");
// Pretty labels for per-surface notes. Mirrors SURFACE_META in SurfacesField
// but kept lean — only the title is shown.
var SURFACE_LABEL = {
    receipt: "Receipts",
    shipment: "Shipments",
    stockTransfer: "Stock transfers",
    warehouseTransfer: "Warehouse transfers",
    inventoryAdjustment: "Inventory adjustments",
    place: "Place",
    pick: "Pick",
    operationStart: "Operation start",
    operationFinish: "Operation finish",
    materialIssue: "Material issue",
    materialReceive: "Material receive"
};
var pickDefaultOp = function (ops) { var _a; return ops.includes("eq") ? "eq" : ((_a = ops[0]) !== null && _a !== void 0 ? _a : "eq"); };
exports.CONDITION_GRID_CLASS = "grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,1fr)]";
function ConditionRowImpl(_a) {
    var _b;
    var condition = _a.condition, index = _a.index, canRemove = _a.canRemove, onChange = _a.onChange, onRemove = _a.onRemove, optionsByLoader = _a.optionsByLoader, targetType = _a.targetType, surfaces = _a.surfaces;
    var t = (0, macro_1.useLingui)().t;
    var fieldDef = (0, react_2.useMemo)(function () { return (0, utils_1.getFieldDef)(condition.field); }, [condition.field]);
    // A field selected before the surfaces changed may no longer be populated on
    // the rule's current surfaces. Flag it so the author re-picks — mirrors the
    // save-time validator gate (storageRules.models.ts) client-side.
    var fieldUnavailable = (0, react_2.useMemo)(function () {
        return !!fieldDef &&
            !!surfaces &&
            surfaces.length > 0 &&
            !(0, utils_1.isFieldAvailableOnSurfaces)(fieldDef, surfaces);
    }, [fieldDef, surfaces]);
    var availableOps = (0, react_2.useMemo)(function () { return (fieldDef ? (0, utils_1.availableOperators)(fieldDef) : []); }, [fieldDef]);
    var valueOptions = (0, react_2.useMemo)(function () {
        return (fieldDef === null || fieldDef === void 0 ? void 0 : fieldDef.valueOptionsLoader)
            ? optionsByLoader[fieldDef.valueOptionsLoader]
            : undefined;
    }, [fieldDef, optionsByLoader]);
    // Per-surface semantic notes for ambiguous fields (e.g. transaction.quantity
    // means different things on operationStart vs operationFinish). Filter to
    // surfaces the rule actually fires on when the parent supplies them; fall
    // back to all surfaces valid for the targetType otherwise.
    var surfaceNotes = (0, react_2.useMemo)(function () {
        var all = (0, utils_1.getFieldSurfaceNotes)(condition.field);
        if (!all)
            return null;
        var scope = surfaces && surfaces.length > 0
            ? surfaces
            : targetType
                ? utils_1.SURFACES_BY_TARGET_TYPE[targetType]
                : [];
        var rows = [];
        for (var _i = 0, scope_1 = scope; _i < scope_1.length; _i++) {
            var s = scope_1[_i];
            var note = all[s];
            if (note)
                rows.push({ surface: s, note: note });
        }
        return rows.length > 0 ? rows : null;
    }, [condition.field, targetType, surfaces]);
    // Self-heal: stored op no longer in the field's allowed set (legacy data,
    // or the field's `nullable` flag flipped post-save). Patch down to a valid
    // op so the user can save the rule back clean.
    (0, react_2.useEffect)(function () {
        if (!fieldDef)
            return;
        if (availableOps.includes(condition.op))
            return;
        onChange(index, { op: pickDefaultOp(availableOps), value: undefined });
    }, [fieldDef, availableOps, condition.op, index, onChange]);
    return (<div className="flex w-full items-center gap-2">
      <div className={(0, react_1.cn)("group flex-1 min-w-0 rounded-lg border border-border bg-card p-3", "transition-colors hover:border-border/80")}>
        <div className={exports.CONDITION_GRID_CLASS}>
          <FieldCombobox_1.default value={condition.field} targetType={targetType} surfaces={surfaces} onChange={function (path) {
            var nextDef = (0, utils_1.getFieldDef)(path);
            var nextOps = nextDef ? (0, utils_1.availableOperators)(nextDef) : [];
            onChange(index, {
                field: path,
                op: pickDefaultOp(nextOps),
                value: undefined
            });
        }}/>

          <OperatorCombobox_1.default value={condition.op} onChange={function (op) {
            return onChange(index, { op: op, value: undefined });
        }} available={availableOps} disabled={!fieldDef}/>

          <ValueInput_1.default fieldDef={fieldDef} op={condition.op} value={condition.value} options={valueOptions} onChange={function (next) { return onChange(index, { value: next }); }}/>
        </div>

        {fieldUnavailable && (<p className="mt-2 text-xs font-medium leading-none text-destructive">
            {t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\"", "\" isn't available on the selected surface(s). Pick another field."], ["\"", "\" isn't available on the selected surface(s). Pick another field."])), (_b = fieldDef === null || fieldDef === void 0 ? void 0 : fieldDef.label) !== null && _b !== void 0 ? _b : condition.field)}
          </p>)}

        {surfaceNotes && (<details className="mt-2 group rounded-md border border-dashed border-border/70 bg-muted/30 px-2 py-1.5 text-xs text-muted-foreground">
            <summary className="cursor-pointer select-none text-[11px] font-medium uppercase tracking-wider text-muted-foreground/90 hover:text-foreground">
              {t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Value source by surface"], ["Value source by surface"])))}
            </summary>
            <ul className="mt-1.5 flex flex-col gap-1">
              {surfaceNotes.map(function (_a) {
                var surface = _a.surface, note = _a.note;
                return (<li key={surface} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-2">
                  <span className="font-medium text-foreground/80">
                    {SURFACE_LABEL[surface]}
                  </span>
                  <span className="leading-snug">{note}</span>
                </li>);
            })}
            </ul>
          </details>)}
      </div>

      <react_1.IconButton icon={<lu_1.LuX />} aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Remove condition"], ["Remove condition"])))} variant="ghost" size="sm" onClick={function () { return onRemove(index); }} isDisabled={!canRemove} className={(0, react_1.cn)("shrink-0", !canRemove && "opacity-0 pointer-events-none")}/>
    </div>);
}
exports.default = (0, react_2.memo)(ConditionRowImpl);
var templateObject_1, templateObject_2, templateObject_3;
