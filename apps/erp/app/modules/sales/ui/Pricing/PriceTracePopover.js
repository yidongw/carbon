"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceTracePopover = PriceTracePopover;
exports.DeltaPill = DeltaPill;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var useCurrencyFormatter_1 = require("~/hooks/useCurrencyFormatter");
var path_1 = require("~/utils/path");
var STEP_BADGE = {
    "Base Price": { label: "Base", variant: "gray" },
    Override: { label: "Override", variant: "yellow" },
    "Type Override": { label: "Type Override", variant: "blue" },
    "All Override": { label: "All Override", variant: "gray" },
    Discount: { label: "Discount", variant: "red" },
    Markup: { label: "Markup", variant: "green" },
    "Final Price": null
};
function PriceTracePopover(_a) {
    var trace = _a.trace, currencyCode = _a.currencyCode, children = _a.children;
    var t = (0, macro_1.useLingui)().t;
    var currencyFormatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)({ currency: currencyCode });
    var format = function (value) { return currencyFormatter.format(value); };
    var steps = Array.isArray(trace) ? trace : [];
    if (steps.length === 0) {
        return children ? <>{children}</> : null;
    }
    var trigger = children ? (<button type="button" className="cursor-help decoration-dotted underline-offset-2 hover:underline">
      {children}
    </button>) : (<button type="button" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["How this price was calculated"], ["How this price was calculated"])))} className="text-xxs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">
      <lu_1.LuCalculator className="size-3"/>
    </button>);
    return (<react_1.Popover>
      {children ? (<react_1.PopoverTrigger asChild>{trigger}</react_1.PopoverTrigger>) : (<react_1.Tooltip>
          <react_1.TooltipTrigger asChild>
            <react_1.PopoverTrigger asChild>{trigger}</react_1.PopoverTrigger>
          </react_1.TooltipTrigger>
          <react_1.TooltipContent>
            <macro_1.Trans>How this price was calculated</macro_1.Trans>
          </react_1.TooltipContent>
        </react_1.Tooltip>)}
      <react_1.PopoverContent align="end" sideOffset={8} className="max-w-[800px] p-0">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold">
            <macro_1.Trans>Pricing Trace</macro_1.Trans>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            <macro_1.Trans>How the resolved price was calculated.</macro_1.Trans>
          </p>
        </div>
        <div className="overflow-x-auto">
          <react_1.Table>
            <react_1.Thead>
              <react_1.Tr>
                <react_1.Th className="text-xs uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  <macro_1.Trans>Step</macro_1.Trans>
                </react_1.Th>
                <react_1.Th className="text-xs uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  <macro_1.Trans>Type</macro_1.Trans>
                </react_1.Th>
                <react_1.Th className="text-xs uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  <macro_1.Trans>Description</macro_1.Trans>
                </react_1.Th>
                <react_1.Th className="text-xs uppercase tracking-wide text-muted-foreground text-right whitespace-nowrap">
                  <macro_1.Trans>Change</macro_1.Trans>
                </react_1.Th>
                <react_1.Th className="text-xs uppercase tracking-wide text-muted-foreground text-right whitespace-nowrap">
                  <macro_1.Trans>Running Total</macro_1.Trans>
                </react_1.Th>
              </react_1.Tr>
            </react_1.Thead>
            <react_1.Tbody>
              {steps.map(function (step, i) {
            var isFinal = step.step === "Final Price";
            return (<react_1.Tr key={i} className={isFinal
                    ? "border-t border-border font-semibold"
                    : undefined}>
                    <react_1.Td className="text-sm whitespace-nowrap">{step.step}</react_1.Td>
                    <react_1.Td className="text-sm whitespace-nowrap">
                      <StepTypeBadge step={step}/>
                    </react_1.Td>
                    <react_1.Td className="text-sm text-muted-foreground max-w-[240px]" title={step.source}>
                      {step.ruleId ? (<react_router_1.Link to={path_1.path.to.pricingRule(step.ruleId)} target="_blank" rel="noreferrer" className="hover:text-foreground hover:underline decoration-dotted underline-offset-2 inline-flex items-center gap-1 max-w-full">
                          <span className="truncate">{step.source}</span>
                          <lu_1.LuExternalLink className="size-3 shrink-0"/>
                        </react_router_1.Link>) : (<span className="block truncate">{step.source}</span>)}
                    </react_1.Td>
                    <react_1.Td className="text-right whitespace-nowrap">
                      <DeltaPill value={step.adjustment} format={format}/>
                    </react_1.Td>
                    <react_1.Td className="text-right text-sm whitespace-nowrap">
                      {format(step.amount)}
                    </react_1.Td>
                  </react_1.Tr>);
        })}
            </react_1.Tbody>
          </react_1.Table>
        </div>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
function StepTypeBadge(_a) {
    var step = _a.step;
    var mapping = STEP_BADGE[step.step];
    if (mapping === null)
        return null;
    if (!mapping)
        return <react_1.Badge variant="gray">{step.step}</react_1.Badge>;
    return <react_1.Badge variant={mapping.variant}>{mapping.label}</react_1.Badge>;
}
function DeltaPill(_a) {
    var value = _a.value, format = _a.format;
    if (value === undefined || value === 0) {
        return <span className="text-sm text-muted-foreground">—</span>;
    }
    var isNegative = value < 0;
    var variant = isNegative ? "red" : "green";
    var sign = isNegative ? "" : "+";
    return (<react_1.Badge variant={variant}>
      {sign}
      {format(value)}
    </react_1.Badge>);
}
var templateObject_1;
