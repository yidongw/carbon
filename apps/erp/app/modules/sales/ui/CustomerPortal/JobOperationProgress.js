"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobOperationProgress = JobOperationProgress;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var path_1 = require("~/utils/path");
function operationVariant(op) {
    if (op.status === "Done")
        return "green";
    if (op.status === "In Progress")
        return "orange";
    return "gray";
}
function OperationPill(_a) {
    var operation = _a.operation, className = _a.className;
    return (<react_1.Badge variant={operationVariant(operation)} className={(0, react_1.cn)("rounded-full text-[10px] max-w-[140px]", className)} title={operation.description}>
      {operation.description}
    </react_1.Badge>);
}
function JobOperationProgress(_a) {
    var customerId = _a.customerId, jobOperations = _a.jobOperations, jobOperationAttachments = _a.jobOperationAttachments;
    var sorted = (0, react_2.useMemo)(function () { return __spreadArray([], jobOperations, true).sort(function (a, b) { return a.order - b.order; }); }, [jobOperations]);
    if (sorted.length === 0)
        return null;
    var firstUnfinished = sorted.findIndex(function (op) { return op.status !== "Done"; });
    var activeIdx = firstUnfinished === -1 ? sorted.length - 1 : firstUnfinished;
    var shouldCollapse = sorted.length > 4;
    var visibleIndices = shouldCollapse
        ? __spreadArray([], new Set([0, activeIdx, sorted.length - 1]), true).sort(function (a, b) { return a - b; })
        : sorted.map(function (_, i) { return i; });
    return (<react_1.Tooltip delayDuration={150}>
      <react_1.TooltipTrigger asChild>
        <div className="flex items-center gap-1.5 cursor-default">
          {visibleIndices.map(function (idx, i) {
            var hasGapBefore = i > 0 && idx - visibleIndices[i - 1] > 1;
            return (<react_2.Fragment key={sorted[idx].id}>
                {hasGapBefore && (<span aria-hidden="true" className="text-muted-foreground text-xs select-none leading-none">
                    ···
                  </span>)}
                <OperationPill operation={sorted[idx]}/>
              </react_2.Fragment>);
        })}
        </div>
      </react_1.TooltipTrigger>
      <react_1.TooltipContent align="start" className="w-96 p-2">
        <div className="text-[11px] font-medium text-muted-foreground px-2 py-1 uppercase tracking-wide">
          Operations
        </div>
        <react_1.Separator className="mb-1"/>
        <div className="flex flex-col gap-0.5 max-h-80 overflow-y-auto">
          {sorted.map(function (op) {
            var _a;
            var attachments = (_a = jobOperationAttachments[op.id]) !== null && _a !== void 0 ? _a : [];
            return (<div key={op.id} className="flex items-center justify-between gap-3 px-2 py-1.5 rounded-md hover:bg-muted/50">
                <div className="flex items-center gap-2 min-w-0">
                  <OperationPill operation={op} className="max-w-[120px]"/>
                  <span className="text-xs truncate font-medium">
                    {op.description}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {op.quantityComplete}/{op.operationQuantity}
                  </span>
                  {attachments.length > 0 && (<div className="flex items-center gap-1">
                      {attachments.map(function (attachment) {
                        var fileName = attachment.split("/").pop();
                        return (<a key={attachment} href={path_1.path.to.externalCustomerFile(customerId, attachment)} target="_blank" rel="noreferrer" title={fileName} className="text-muted-foreground hover:text-foreground">
                            <lu_1.LuPaperclip className="size-3"/>
                          </a>);
                    })}
                    </div>)}
                </div>
              </div>);
        })}
        </div>
      </react_1.TooltipContent>
    </react_1.Tooltip>);
}
