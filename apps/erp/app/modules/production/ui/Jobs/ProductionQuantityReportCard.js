"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionQuantityReportCard = ProductionQuantityReportCard;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
var ProductionQuantityLineBreakdown_1 = require("./ProductionQuantityLineBreakdown");
var ProductionQuantityReportCardHeader_1 = require("./ProductionQuantityReportCardHeader");
function ProductionQuantityReportCard(_a) {
    var report = _a.report, configurationParameters = _a.configurationParameters, canEdit = _a.canEdit, onEdit = _a.onEdit, onHistory = _a.onHistory;
    var t = (0, macro_1.useLingui)().t;
    var formatDateTime = (0, hooks_1.useDateFormatter)().formatDateTime;
    var headerActions = (<react_1.HStack className="shrink-0 items-center gap-1">
      {report.hasHistory ? (<react_1.Button type="button" variant="ghost" size="sm" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["View history"], ["View history"])))} onClick={onHistory} className="transition-transform active:scale-[0.96]">
          <lu_1.LuHistory className="h-4 w-4"/>
        </react_1.Button>) : null}
      {canEdit ? (<react_1.Button type="button" variant="ghost" size="sm" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Edit report"], ["Edit report"])))} onClick={onEdit} className="transition-transform active:scale-[0.96]">
          <lu_1.LuPencil className="h-4 w-4"/>
        </react_1.Button>) : null}
    </react_1.HStack>);
    var quantitySummary = report.hasHistory ? (<macro_1.Trans>
      Originally reported{" "}
      <span className="tabular-nums">{report.originalQuantity}</span> units
    </macro_1.Trans>) : (<macro_1.Trans>
      Reported <span className="tabular-nums">{report.originalQuantity}</span>{" "}
      units
    </macro_1.Trans>);
    return (<div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/30 p-3 dark:bg-muted/20">
      <div>
        <ProductionQuantityReportCardHeader_1.ProductionQuantityReportCardHeader employeeId={report.employeeId} createdBy={report.createdBy} summary={quantitySummary} timestamp={formatDateTime(report.createdAt)} actions={headerActions}/>
      </div>

      <div className="flex flex-col gap-2">
        {report.activeLines.map(function (line) { return (<ProductionQuantityLineBreakdown_1.ProductionQuantityLineBreakdown key={line.id} line={line} configurationParameters={configurationParameters}/>); })}
        {report.notes ? (<p className="break-words text-sm leading-relaxed text-muted-foreground">
            {report.notes}
          </p>) : null}
      </div>
    </div>);
}
var templateObject_1, templateObject_2;
