"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierQuantityReportCardHeader = SupplierQuantityReportCardHeader;
var react_1 = require("@carbon/react");
var SupplierQuantityReportReporter_1 = require("./SupplierQuantityReportReporter");
function SupplierQuantityReportCardHeader(_a) {
    var supplierId = _a.supplierId, createdBy = _a.createdBy, summary = _a.summary, timestamp = _a.timestamp, actions = _a.actions;
    return (<>
      <div className="flex flex-col gap-2 sm:hidden">
        <react_1.HStack className="items-center justify-between gap-2">
          <SupplierQuantityReportReporter_1.SupplierQuantityReportReporter supplierId={supplierId} createdBy={createdBy}/>
          {actions}
        </react_1.HStack>
        <p className="text-sm font-medium leading-5 text-foreground">
          {summary}
        </p>
        <p className="text-xs tabular-nums leading-5 text-muted-foreground">
          {timestamp}
        </p>
      </div>

      <div className="hidden sm:block">
        <react_1.HStack className="items-center justify-between gap-2">
          <react_1.HStack className="min-w-0 flex-1 items-center gap-3">
            <SupplierQuantityReportReporter_1.SupplierQuantityReportReporter supplierId={supplierId} createdBy={createdBy}/>
            <react_1.HStack className="min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
              <p className="text-sm font-medium leading-5 text-foreground">
                {summary}
              </p>
              <p className="shrink-0 text-xs tabular-nums leading-5 text-muted-foreground">
                {timestamp}
              </p>
            </react_1.HStack>
          </react_1.HStack>
          {actions}
        </react_1.HStack>
      </div>
    </>);
}
