"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationQuantitySummaryView = OperationQuantitySummaryView;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var configParamsTableColumns_1 = require("~/modules/production/configParamsTableColumns");
var ConfigQuantityBreakdown_1 = require("./ConfigQuantityBreakdown");
function formatTotal(value) {
    return Number.isInteger(value)
        ? String(value)
        : value.toLocaleString(undefined, { maximumFractionDigits: 4 });
}
function useConfigParts(configurations, configurationParameters) {
    var t = (0, macro_1.useLingui)().t;
    return (0, react_2.useMemo)(function () {
        if (!configurations.length || !(configurationParameters === null || configurationParameters === void 0 ? void 0 : configurationParameters.length)) {
            return [];
        }
        var columns = (0, configParamsTableColumns_1.buildConfigColumns)(configurationParameters, t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quantities"], ["Quantities"])))).columns;
        var merged = (0, configParamsTableColumns_1.mergeConfigTableRows)(configurations.flatMap(function (config) { return (0, configParamsTableColumns_1.getConfigTableRows)(config); }), columns);
        return merged
            .map(function (row) { return (0, configParamsTableColumns_1.getConfigRowDisplayPart)(row, columns); })
            .filter(function (part) { return part.descriptor || part.quantities.length > 0; });
    }, [configurations, configurationParameters, t]);
}
function OperationTotalBadge(_a) {
    var label = _a.label, variant = _a.variant, total = _a.total, parts = _a.parts;
    var _b = (0, react_2.useState)(false), open = _b[0], setOpen = _b[1];
    var hasBreakdown = parts.length > 0;
    var badge = (<react_1.Badge variant={variant} className="cursor-default gap-1.5 normal-case tracking-normal">
      {label}
      <span className="tabular-nums">{formatTotal(total)}</span>
    </react_1.Badge>);
    if (!hasBreakdown) {
        return badge;
    }
    return (<react_1.Popover open={open} onOpenChange={setOpen}>
      <react_1.PopoverTrigger asChild>
        <button type="button" className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" onMouseEnter={function () { return setOpen(true); }} onMouseLeave={function () { return setOpen(false); }}>
          {badge}
        </button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent align="start" className="w-auto max-w-sm p-3" onMouseEnter={function () { return setOpen(true); }} onMouseLeave={function () { return setOpen(false); }}>
        <ConfigQuantityBreakdown_1.ConfigQuantityBreakdown parts={parts}/>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
function OperationQuantitySummaryView(_a) {
    var _b, _c, _d;
    var summary = _a.summary, configurationParameters = _a.configurationParameters;
    var productionParts = useConfigParts((_b = summary === null || summary === void 0 ? void 0 : summary.productionConfigurations) !== null && _b !== void 0 ? _b : [], configurationParameters);
    var scrapParts = useConfigParts((_c = summary === null || summary === void 0 ? void 0 : summary.scrapConfigurations) !== null && _c !== void 0 ? _c : [], configurationParameters);
    var reworkParts = useConfigParts((_d = summary === null || summary === void 0 ? void 0 : summary.reworkConfigurations) !== null && _d !== void 0 ? _d : [], configurationParameters);
    if (!summary)
        return null;
    var hasTotals = summary.production > 0 || summary.scrap > 0 || summary.rework > 0;
    if (!hasTotals)
        return null;
    return (<react_1.HStack className="flex-wrap gap-2">
      {summary.production > 0 ? (<OperationTotalBadge label={<macro_1.Trans>Production</macro_1.Trans>} variant="green" total={summary.production} parts={productionParts}/>) : null}
      {summary.rework > 0 ? (<OperationTotalBadge label={<macro_1.Trans>Rework</macro_1.Trans>} variant="orange" total={summary.rework} parts={reworkParts}/>) : null}
      {summary.scrap > 0 ? (<OperationTotalBadge label={<macro_1.Trans>Scrap</macro_1.Trans>} variant="red" total={summary.scrap} parts={scrapParts}/>) : null}
    </react_1.HStack>);
}
var templateObject_1;
