"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionQuantityLineBreakdown = ProductionQuantityLineBreakdown;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var configParamsTableColumns_1 = require("~/modules/production/configParamsTableColumns");
var ConfigQuantityBreakdown_1 = require("./ConfigQuantityBreakdown");
function getProductionQuantityBadgeVariant(type) {
    switch (type) {
        case "Production":
            return "green";
        case "Rework":
            return "orange";
        default:
            return "red";
    }
}
function ProductionQuantityLineBreakdown(_a) {
    var _b;
    var line = _a.line, configurationParameters = _a.configurationParameters;
    var t = (0, macro_1.useLingui)().t;
    var parts = (configurationParameters === null || configurationParameters === void 0 ? void 0 : configurationParameters.length) && line.configuration
        ? (0, configParamsTableColumns_1.getConfigRowDisplayParts)(line.configuration, configurationParameters, t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quantities"], ["Quantities"]))))
        : [];
    return (<div className="rounded-md border border-border/60 bg-background px-3 py-2">
      <react_1.HStack className="mb-1 flex-wrap items-center gap-2">
        <react_1.Badge variant={getProductionQuantityBadgeVariant(line.type)} className="shrink-0 leading-none">
          {line.type}
        </react_1.Badge>
        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-xs leading-none shadow-sm tabular-nums">
          <span className="font-medium text-muted-foreground">
            <macro_1.Trans>Total</macro_1.Trans>
          </span>
          <span className="font-semibold text-foreground tabular-nums">
            {Number.isInteger(line.quantity)
            ? String(line.quantity)
            : line.quantity.toLocaleString(undefined, {
                maximumFractionDigits: 4
            })}
          </span>
        </span>
        {line.type === "Scrap" && ((_b = line.scrapReason) === null || _b === void 0 ? void 0 : _b.name) ? (<span className="text-xs leading-5 text-muted-foreground">
            {line.scrapReason.name}
          </span>) : null}
      </react_1.HStack>
      {parts.length > 0 ? <ConfigQuantityBreakdown_1.ConfigQuantityBreakdown parts={parts}/> : null}
    </div>);
}
var templateObject_1;
