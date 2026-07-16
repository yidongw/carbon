"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var PickingItemCard_1 = require("./PickingItemCard");
var UNASSIGNED = "__unassigned__";
var PickingKanban = (0, react_2.memo)(function (_a) {
    var data = _a.data, displaySettings = _a.displaySettings, selectedIds = _a.selectedIds, onToggle = _a.onToggle;
    // Group operations into work-center columns (cards = ops needing picking).
    var columns = (0, react_2.useMemo)(function () {
        var _a, _b;
        var byWorkCenter = new Map();
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var item = data_1[_i];
            var key = (_a = item.workCenterId) !== null && _a !== void 0 ? _a : UNASSIGNED;
            if (!byWorkCenter.has(key)) {
                byWorkCenter.set(key, {
                    id: key,
                    title: (_b = item.workCenterName) !== null && _b !== void 0 ? _b : "Unassigned",
                    items: []
                });
            }
            byWorkCenter.get(key).items.push(item);
        }
        return Array.from(byWorkCenter.values()).sort(function (a, b) {
            return a.title.localeCompare(b.title);
        });
    }, [data]);
    if (data.length === 0) {
        return (<div className="flex flex-1 py-24 justify-center items-center w-full">
          <p className="text-muted-foreground">
            <macro_1.Trans>No operations require picking at this location</macro_1.Trans>
          </p>
        </div>);
    }
    return (<div className="flex flex-col flex-1 min-h-0">
        <react_1.ScrollArea className="flex-1">
          <div className="flex gap-0 items-start flex-row justify-start">
            {columns.map(function (column) { return (<div key={column.id} className="w-[350px] max-w-full flex flex-col flex-shrink-0 bg-card/30 border-r border-border h-[calc(100dvh-var(--header-height)*2)]">
                <div className="p-4 w-full font-semibold text-left flex flex-row items-center gap-2 sticky top-0 z-1 border-b border-border bg-card">
                  <react_1.PulsingDot inactive className="mt-1"/>
                  <div className="flex flex-col flex-grow">
                    <span className="truncate">{column.title}</span>
                    <span className="text-muted-foreground text-xs font-normal">
                      {column.items.length}{" "}
                      {column.items.length === 1 ? "operation" : "operations"}
                    </span>
                  </div>
                </div>

                <react_1.ScrollArea className="flex-grow">
                  <div className="flex flex-col gap-2 p-2">
                    {column.items.map(function (item) { return (<PickingItemCard_1.PickingItemCard key={item.jobOperationId} item={item} isSelected={selectedIds.has(item.jobOperationId)} onToggle={onToggle} displaySettings={displaySettings}/>); })}
                  </div>
                  <react_1.ScrollBar orientation="horizontal"/>
                </react_1.ScrollArea>
              </div>); })}
          </div>
          <react_1.ScrollBar orientation="horizontal"/>
        </react_1.ScrollArea>
      </div>);
});
PickingKanban.displayName = "PickingKanban";
exports.default = PickingKanban;
