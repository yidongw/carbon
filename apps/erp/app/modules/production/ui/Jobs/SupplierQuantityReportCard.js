"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierQuantityReportCard = SupplierQuantityReportCard;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var ProductionQuantityLineBreakdown_1 = require("./ProductionQuantityLineBreakdown");
var SupplierQuantityReportCardHeader_1 = require("./SupplierQuantityReportCardHeader");
function SupplierQuantityReportCard(_a) {
    var _b, _c, _d, _e;
    var report = _a.report, configurationParameters = _a.configurationParameters, canEdit = _a.canEdit, onEdit = _a.onEdit, onHistory = _a.onHistory, onCreatePo = _a.onCreatePo, isCreatingPo = _a.isCreatingPo;
    var t = (0, macro_1.useLingui)().t;
    var formatDateTime = (0, hooks_1.useDateFormatter)().formatDateTime;
    var permissions = (0, hooks_1.usePermissions)();
    var supplierId = (_b = report.supplierProcess) === null || _b === void 0 ? void 0 : _b.supplierId;
    var snapshot = report.subcontractSnapshot;
    var unitPrice = (_c = snapshot === null || snapshot === void 0 ? void 0 : snapshot.operationUnitCost) !== null && _c !== void 0 ? _c : 0;
    var minCost = (_d = snapshot === null || snapshot === void 0 ? void 0 : snapshot.operationMinimumCost) !== null && _d !== void 0 ? _d : 0;
    var purchaseOrderId = (_e = report.purchaseOrderLine) === null || _e === void 0 ? void 0 : _e.purchaseOrderId;
    var headerActions = (<react_1.HStack className="shrink-0 items-center gap-1">
      {report.hasHistory ? (<react_1.Button type="button" variant="ghost" size="sm" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["View history"], ["View history"])))} onClick={onHistory} className="transition-transform active:scale-[0.96]">
          <lu_1.LuHistory className="h-4 w-4"/>
        </react_1.Button>) : null}
      {canEdit ? (<react_1.Button type="button" variant="ghost" size="sm" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Edit report"], ["Edit report"])))} onClick={onEdit} className="transition-transform active:scale-[0.96]">
          <lu_1.LuPencil className="h-4 w-4"/>
        </react_1.Button>) : null}
      {!report.purchaseOrderLineId &&
            permissions.can("create", "purchasing") ? (<react_1.Button type="button" variant="secondary" size="sm" isLoading={isCreatingPo} onClick={onCreatePo} className="transition-transform active:scale-[0.96]">
          <macro_1.Trans>Create PO</macro_1.Trans>
        </react_1.Button>) : null}
      {purchaseOrderId ? (<react_1.Button type="button" variant="ghost" size="sm" asChild className="transition-transform active:scale-[0.96]">
          <react_router_1.Link to={path_1.path.to.purchaseOrder(purchaseOrderId)} target="_blank">
            <lu_1.LuExternalLink className="h-4 w-4"/>
          </react_router_1.Link>
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
      <SupplierQuantityReportCardHeader_1.SupplierQuantityReportCardHeader supplierId={supplierId} createdBy={report.createdBy} summary={quantitySummary} timestamp={formatDateTime(report.createdAt)} actions={headerActions}/>

      {snapshot ? (<p className="text-xs text-muted-foreground">
          <macro_1.Trans>
            PO pricing: min <span className="tabular-nums">{minCost}</span>,
            unit <span className="tabular-nums">{unitPrice}</span> (snapshotted)
          </macro_1.Trans>
        </p>) : null}

      <div className="flex flex-col gap-2">
        {report.activeLines.map(function (line) { return (<ProductionQuantityLineBreakdown_1.ProductionQuantityLineBreakdown key={line.id} line={line} configurationParameters={configurationParameters}/>); })}
        {report.notes ? (<p className="break-words text-sm leading-relaxed text-muted-foreground">
            {report.notes}
          </p>) : null}
      </div>
    </div>);
}
var templateObject_1, templateObject_2;
