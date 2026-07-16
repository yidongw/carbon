"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigQuantityValue = ConfigQuantityValue;
exports.ConfigQuantityBreakdown = ConfigQuantityBreakdown;
function formatQuantityValue(value) {
    return Number.isInteger(value)
        ? String(value)
        : value.toLocaleString(undefined, { maximumFractionDigits: 4 });
}
/** Same pill style as breakdown rows — use for standalone totals so styling matches. */
function ConfigQuantityValue(_a) {
    var value = _a.value;
    return (<span className="inline-flex min-w-[1.35rem] items-center justify-center rounded-md border border-border bg-background px-1.5 py-0.5 text-xs font-bold tabular-nums text-foreground shadow-sm">
      {formatQuantityValue(value)}
    </span>);
}
function ConfigQuantityBreakdown(_a) {
    var parts = _a.parts;
    if (parts.length === 0)
        return null;
    return (<div className="flex flex-col gap-1.5 rounded-md border border-border bg-muted px-2.5 py-2">
      {parts.map(function (part, rowIndex) { return (<div key={rowIndex} className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm leading-snug">
          {part.descriptor ? (<span className="font-medium text-foreground">
              {part.descriptor}
            </span>) : null}
          {part.quantities.map(function (q, index) { return (<span key={index} className="inline-flex items-center gap-1">
              {index > 0 ? (<span className="text-foreground/30" aria-hidden>
                  ,
                </span>) : null}
              {q.label ? (<span className="font-medium text-foreground/80">
                  {q.label}
                </span>) : null}
              <ConfigQuantityValue value={q.value}/>
            </span>); })}
        </div>); })}
    </div>);
}
