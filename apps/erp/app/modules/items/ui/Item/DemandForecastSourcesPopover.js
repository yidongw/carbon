"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandForecastSourcesPopover = DemandForecastSourcesPopover;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function DemandForecastSourcesPopover(_a) {
    var sources = _a.sources, forecastQuantity = _a.forecastQuantity, forecastMethod = _a.forecastMethod, children = _a.children;
    var numberFormatter = (0, i18n_1.useNumberFormatter)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    // Non-MRP forecasts (manual / statistical / ml) have no traceable sources.
    if (forecastMethod !== "mrp") {
        return (<react_1.Popover>
        <react_1.PopoverTrigger asChild>{children}</react_1.PopoverTrigger>
        <react_1.PopoverContent className="w-80">
          <div className="flex flex-col gap-2 p-2">
            <div className="text-sm font-medium">
              <macro_1.Trans>Demand Forecast</macro_1.Trans>
            </div>
            <div className="text-xs text-muted-foreground">
              <macro_1.Trans>
                Forecast method:{" "}
                <span className="font-mono">{forecastMethod !== null && forecastMethod !== void 0 ? forecastMethod : "unknown"}</span>
                . This row was not derived from active jobs, so no parent
                sources are available.
              </macro_1.Trans>
            </div>
            <div className="text-sm">
              <macro_1.Trans>
                Quantity: {numberFormatter.format(forecastQuantity)}
              </macro_1.Trans>
            </div>
          </div>
        </react_1.PopoverContent>
      </react_1.Popover>);
    }
    if (sources.length === 0) {
        return (<react_1.Popover>
        <react_1.PopoverTrigger asChild>{children}</react_1.PopoverTrigger>
        <react_1.PopoverContent className="w-80">
          <div className="flex flex-col gap-2 p-2">
            <div className="text-sm font-medium">
              <macro_1.Trans>Demand Forecast</macro_1.Trans>
            </div>
            <div className="text-xs text-muted-foreground">
              <macro_1.Trans>
                No parent sources recorded yet. Click Recalculate on the
                planning page to refresh attribution.
              </macro_1.Trans>
            </div>
          </div>
        </react_1.PopoverContent>
      </react_1.Popover>);
    }
    return (<react_1.Popover>
      <react_1.PopoverTrigger asChild>{children}</react_1.PopoverTrigger>
      <react_1.PopoverContent className="w-xl max-h-112 overflow-y-auto pointer-events-auto" onWheel={function (e) { return e.stopPropagation(); }}>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">
            <macro_1.Trans>Demand Forecast — Driven by</macro_1.Trans>
          </div>
          <div className="text-xs text-muted-foreground">
            <macro_1.Trans>
              Demand forecast = BOM-exploded demand from open sales orders,
              active jobs, and production projections.
            </macro_1.Trans>
          </div>
          <react_1.Table>
            <react_1.Thead>
              <react_1.Tr>
                <react_1.Th>
                  <macro_1.Trans>Source</macro_1.Trans>
                </react_1.Th>
                <react_1.Th>
                  <macro_1.Trans>Parent Item</macro_1.Trans>
                </react_1.Th>
                <react_1.Th>
                  <macro_1.Trans>Due</macro_1.Trans>
                </react_1.Th>
                <react_1.Th className="text-right">
                  <macro_1.Trans>Qty</macro_1.Trans>
                </react_1.Th>
              </react_1.Tr>
            </react_1.Thead>
            <react_1.Tbody>
              {sources.map(function (s, i) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            // Pick the date that matters for each source type:
            //   Job Material   → the job's due date
            //   Sales Order    → the SO line's promised date
            //   Demand Projection → the projection's period start
            var sourceDate = s.sourceType === "Job Material"
                ? (_a = s.job) === null || _a === void 0 ? void 0 : _a.dueDate
                : s.sourceType === "Sales Order"
                    ? (_b = s.salesOrderLine) === null || _b === void 0 ? void 0 : _b.promisedDate
                    : s.sourceType === "Demand Projection"
                        ? (_d = (_c = s.demandProjection) === null || _c === void 0 ? void 0 : _c.period) === null || _d === void 0 ? void 0 : _d.startDate
                        : null;
            return (<react_1.Tr key={i}>
                    <react_1.Td>
                      {s.sourceType === "Job Material" && s.job ? (<react_router_1.Link to={path_1.path.to.job(s.job.id)} className="text-primary hover:underline">
                          {s.job.jobId}
                        </react_router_1.Link>) : s.sourceType === "Sales Order" &&
                    ((_e = s.salesOrderLine) === null || _e === void 0 ? void 0 : _e.salesOrder) ? (<react_router_1.Link to={path_1.path.to.salesOrder(s.salesOrderLine.salesOrder.id)} className="text-primary hover:underline">
                          {s.salesOrderLine.salesOrder.salesOrderId}
                        </react_router_1.Link>) : s.sourceType === "Demand Projection" &&
                    s.demandProjection ? (s.parentItemId && s.locationId ? (<react_router_1.Link to={path_1.path.to.demandProjection(s.parentItemId, s.locationId)} className="text-primary hover:underline" title={(_f = s.demandProjection.notes) !== null && _f !== void 0 ? _f : undefined}>
                            <macro_1.Trans>Projection</macro_1.Trans>
                            {/* <span className="ml-1 text-xs text-muted-foreground font-mono">
                    {s.demandProjection.forecastMethod ?? "manual"}
                  </span> */}
                          </react_router_1.Link>) : (<span className="text-sm text-foreground" title={(_g = s.demandProjection.notes) !== null && _g !== void 0 ? _g : undefined}>
                            <macro_1.Trans>Projection</macro_1.Trans>
                            <span className="ml-1 text-xs text-muted-foreground font-mono">
                              {(_h = s.demandProjection.forecastMethod) !== null && _h !== void 0 ? _h : "manual"}
                            </span>
                          </span>)) : (<span className="text-muted-foreground">—</span>)}
                    </react_1.Td>
                    <react_1.Td>
                      {s.parentItem ? (<span title={s.parentItem.name}>
                          {s.parentItem.readableId}
                        </span>) : (<span className="text-muted-foreground">—</span>)}
                    </react_1.Td>
                    <react_1.Td>
                      {sourceDate ? (formatDate(sourceDate)) : (<span className="text-muted-foreground">—</span>)}
                    </react_1.Td>
                    <react_1.Td className="text-right">
                      {numberFormatter.format(s.quantity)}
                    </react_1.Td>
                  </react_1.Tr>);
        })}
            </react_1.Tbody>
          </react_1.Table>
        </div>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
