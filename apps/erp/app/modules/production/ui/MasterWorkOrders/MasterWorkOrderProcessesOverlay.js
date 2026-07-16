"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MasterWorkOrderProcessesOverlay;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var configTableShared_1 = require("../Jobs/configTableShared");
var MasterProcessesTable_1 = require("./MasterProcessesTable");
/**
 * Read-only modal showing a master work order's processes — the same table as
 * the details page's Processes tab, opened from the Master Work Orders list.
 */
function MasterWorkOrderProcessesOverlay(_a) {
    var processes = _a.processes, masterDisplayId = _a.masterDisplayId, onDismiss = _a.onDismiss;
    return (<div className={configTableShared_1.configParamsModalShellClassName}>
      <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
        <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
          <macro_1.Trans>Processes</macro_1.Trans>
        </h3>
        {masterDisplayId ? (<p className="mt-1 text-sm text-muted-foreground">
            {masterDisplayId}
          </p>) : null}
      </div>
      <div className={configTableShared_1.configParamsModalBodyClassName}>
        <div className="h-[65vh] w-[80vw] max-w-full">
          <MasterProcessesTable_1.default data={processes} withHeader={false}/>
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
