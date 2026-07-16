"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BundleWorkOrderProcessesOverlay;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var configTableShared_1 = require("../Jobs/configTableShared");
var JobOperationsTable_1 = require("../Jobs/JobOperationsTable");
/**
 * Read-only modal showing a bundle work order's processes — the same table as
 * the details page's Processes tab, opened from the Bundle Work Orders list.
 */
function BundleWorkOrderProcessesOverlay(_a) {
    var operations = _a.operations, count = _a.count, jobId = _a.jobId, jobStatus = _a.jobStatus, bundleDisplayId = _a.bundleDisplayId, onDismiss = _a.onDismiss;
    var t = (0, macro_1.useLingui)().t;
    return (<div className={configTableShared_1.configParamsModalShellClassName}>
      <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
        <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
          <macro_1.Trans>Processes</macro_1.Trans>
        </h3>
        {bundleDisplayId ? (<p className="mt-1 text-sm text-muted-foreground">
            {bundleDisplayId}
          </p>) : null}
      </div>
      <div className={configTableShared_1.configParamsModalBodyClassName}>
        <div className="h-[65vh] w-[80vw] max-w-full">
          <JobOperationsTable_1.default data={operations} count={count} jobId={jobId} isPaused={jobStatus === "Paused"} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Processes"], ["Processes"])))} disableNavigation disableInlineEditing hideMes showAssignee withHeader={false}/>
        </div>
      </div>
      <div className="shrink-0 border-t border-border px-6 py-4">
        <react_1.HStack className="justify-end">
          <react_1.Button type="button" variant="primary" onClick={onDismiss}>
            <macro_1.Trans>Close</macro_1.Trans>
          </react_1.Button>
        </react_1.HStack>
      </div>
    </div>);
}
var templateObject_1;
