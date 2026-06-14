import type { ConfigRowDisplayPart } from "~/modules/production/configParamsTableColumns";

function formatQuantityValue(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function ConfigQuantityValue({ value }: { value: number }) {
  return (
    <span className="inline-flex min-w-[1.35rem] items-center justify-center rounded-md border border-border bg-background px-1.5 py-0.5 text-xs font-bold tabular-nums text-foreground shadow-sm">
      {formatQuantityValue(value)}
    </span>
  );
}

type ConfigQuantityBreakdownProps = {
  parts: ConfigRowDisplayPart[];
};

export function ConfigQuantityBreakdown({ parts }: ConfigQuantityBreakdownProps) {
  if (parts.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-border bg-muted px-2.5 py-2">
      {parts.map((part, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm leading-snug"
        >
          {part.descriptor ? (
            <span className="font-medium text-foreground">{part.descriptor}</span>
          ) : null}
          {part.quantities.map((q, index) => (
            <span key={index} className="inline-flex items-center gap-1">
              {index > 0 ? (
                <span className="text-foreground/30" aria-hidden>
                  ,
                </span>
              ) : null}
              {q.label ? (
                <span className="font-medium text-foreground/80">{q.label}</span>
              ) : null}
              <ConfigQuantityValue value={q.value} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
