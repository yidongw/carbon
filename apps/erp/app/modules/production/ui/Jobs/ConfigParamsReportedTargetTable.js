"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigParamsReportedTargetTable = ConfigParamsReportedTargetTable;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var configParamsTableColumns_1 = require("~/modules/production/configParamsTableColumns");
var ResponsiveConfigTable_1 = require("./ResponsiveConfigTable");
function getColumnWidthClass(column) {
    switch (column.type) {
        case "quantity":
            return "w-[10rem] min-w-[10rem] max-w-[10rem]";
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
function fmt(n) {
    return Number.isInteger(n)
        ? String(n)
        : n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}
function QuantityTooltip(_a) {
    var label = _a.label, description = _a.description, value = _a.value, target = _a.target, _b = _a.showDelta, showDelta = _b === void 0 ? true : _b, children = _a.children;
    var t = (0, macro_1.useLingui)().t;
    var delta = null;
    if (showDelta && target > 0) {
        var diff = value - target;
        if (diff === 0)
            delta = t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["On target"], ["On target"])));
        else if (diff > 0)
            delta = t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", " over goal"], ["", " over goal"])), fmt(diff));
        else
            delta = t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["", " short of goal"], ["", " short of goal"])), fmt(Math.abs(diff)));
    }
    var _c = (0, react_2.useState)(false), open = _c[0], setOpen = _c[1];
    return (<react_1.Popover open={open} onOpenChange={setOpen} modal={false}>
      <react_1.PopoverTrigger asChild>
        <button type="button" className="cursor-default underline decoration-dotted decoration-muted-foreground/40 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm" onMouseEnter={function () { return setOpen(true); }} onMouseLeave={function () { return setOpen(false); }}>
          {children}
        </button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent align="start" className="max-w-xs p-3 text-xs" onMouseEnter={function () { return setOpen(true); }} onMouseLeave={function () { return setOpen(false); }} onOpenAutoFocus={function (event) { return event.preventDefault(); }}>
        <p className="font-medium">{label}</p>
        <p className="text-muted-foreground">{description}</p>
        {delta ? (<p className={(0, react_1.cn)(value > target && "text-amber-600 dark:text-amber-400", value < target && "text-muted-foreground", value === target && "text-emerald-600 dark:text-emerald-400")}>
            {delta}
          </p>) : null}
      </react_1.PopoverContent>
    </react_1.Popover>);
}
function QuantityTripletCell(_a) {
    var reported = _a.reported, pickup = _a.pickup, target = _a.target;
    var t = (0, macro_1.useLingui)().t;
    return (<span className="inline-flex items-baseline gap-0.5">
      <QuantityTooltip label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Completed quantity"], ["Completed quantity"])))} description={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quantity finished and reported for this operation."], ["Quantity finished and reported for this operation."])))} value={reported} target={target}>
        <span className="text-emerald-500">{fmt(reported)}</span>
      </QuantityTooltip>
      <span className="text-muted-foreground/50 text-xs">/</span>
      <QuantityTooltip label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Assigned quantity"], ["Assigned quantity"])))} description={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Quantity assigned or picked up for this operation."], ["Quantity assigned or picked up for this operation."])))} value={pickup} target={target}>
        <span className={pickup > 0 ? "text-blue-600" : "text-muted-foreground"}>
          {fmt(pickup)}
        </span>
      </QuantityTooltip>
      <span className="text-muted-foreground/50 text-xs">/</span>
      <QuantityTooltip label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Target quantity"], ["Target quantity"])))} description={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Goal quantity for this configuration."], ["Goal quantity for this configuration."])))} value={target} target={target} showDelta={false}>
        <span className="text-muted-foreground">{fmt(target)}</span>
      </QuantityTooltip>
    </span>);
}
function renderReportedTargetCell(col, row) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (col.type === "quantity") {
        return (<QuantityTripletCell reported={(_b = (_a = row.cells[col.key]) === null || _a === void 0 ? void 0 : _a.reported) !== null && _b !== void 0 ? _b : 0} pickup={(_d = (_c = row.cells[col.key]) === null || _c === void 0 ? void 0 : _c.pickup) !== null && _d !== void 0 ? _d : 0} target={(_f = (_e = row.cells[col.key]) === null || _e === void 0 ? void 0 : _e.target) !== null && _f !== void 0 ? _f : 0}/>);
    }
    return String((_g = row[col.key]) !== null && _g !== void 0 ? _g : "");
}
function ConfigParamsReportedTargetTable(_a) {
    var rows = _a.rows, parameters = _a.parameters;
    var t = (0, macro_1.useLingui)().t;
    var columns = (0, configParamsTableColumns_1.buildConfigColumns)(parameters, t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Quantities"], ["Quantities"])))).columns;
    if (rows.length === 0) {
        return (<p className="px-3 py-6 text-center text-sm text-muted-foreground">
        <macro_1.Trans>No configuration quantities recorded yet.</macro_1.Trans>
      </p>);
    }
    return (<ResponsiveConfigTable_1.ResponsiveConfigTable columns={columns} rows={rows} getColumnWidthClass={function (col) { return getColumnWidthClass(col); }} getCellClassName={function (col) {
            return (0, react_1.cn)("px-3 py-2 text-sm tabular-nums", getColumnWidthClass(col), col.type === "quantity" && "font-medium");
        }} renderCell={function (col, row) { return renderReportedTargetCell(col, row); }}/>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
