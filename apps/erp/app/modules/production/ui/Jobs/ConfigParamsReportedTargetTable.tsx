import {
  cn,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Tr
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ReactNode } from "react";
import {
  buildConfigColumns,
  type ConfigColumn,
  type ReportedTargetRow
} from "~/modules/production/configParamsTableColumns";

function getColumnWidthClass(column: ConfigColumn): string {
  switch (column.type) {
    case "quantity":
      return "w-[10rem] min-w-[10rem] max-w-[10rem]";
    case "numeric":
    case "boolean":
      return "w-[8rem] min-w-[8rem] max-w-[8rem]";
    case "list":
    case "material":
      return "w-[9rem] min-w-[9rem] max-w-[9rem]";
    default:
      return "w-[10rem] min-w-[10rem] max-w-[10rem]";
  }
}

function fmt(n: number) {
  return Number.isInteger(n)
    ? String(n)
    : n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function QuantityTooltip({
  label,
  description,
  value,
  target,
  showDelta = true,
  children
}: {
  label: string;
  description: string;
  value: number;
  target: number;
  showDelta?: boolean;
  children: ReactNode;
}) {
  const { t } = useLingui();
  let delta: string | null = null;

  if (showDelta && target > 0) {
    const diff = value - target;
    if (diff === 0) delta = t`On target`;
    else if (diff > 0) delta = t`${fmt(diff)} over goal`;
    else delta = t`${fmt(Math.abs(diff))} short of goal`;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-default underline decoration-dotted decoration-muted-foreground/40 underline-offset-2">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        <p className="font-medium">{label}</p>
        <p className="text-muted-foreground">{description}</p>
        {delta ? (
          <p
            className={cn(
              value > target && "text-amber-600 dark:text-amber-400",
              value < target && "text-muted-foreground",
              value === target && "text-emerald-600 dark:text-emerald-400"
            )}
          >
            {delta}
          </p>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}

function QuantityTripletCell({
  reported,
  pickup,
  target
}: {
  reported: number;
  pickup: number;
  target: number;
}) {
  const { t } = useLingui();

  return (
    <span className="inline-flex items-baseline gap-0.5">
      <QuantityTooltip
        label={t`Completed quantity`}
        description={t`Quantity finished and reported for this operation.`}
        value={reported}
        target={target}
      >
        <span className="text-emerald-500">{fmt(reported)}</span>
      </QuantityTooltip>
      <span className="text-muted-foreground/50 text-xs">/</span>
      <QuantityTooltip
        label={t`Assigned quantity`}
        description={t`Quantity assigned or picked up for this operation.`}
        value={pickup}
        target={target}
      >
        <span className={pickup > 0 ? "text-blue-600" : "text-muted-foreground"}>
          {fmt(pickup)}
        </span>
      </QuantityTooltip>
      <span className="text-muted-foreground/50 text-xs">/</span>
      <QuantityTooltip
        label={t`Target quantity`}
        description={t`Goal quantity for this configuration.`}
        value={target}
        target={target}
        showDelta={false}
      >
        <span className="text-muted-foreground">{fmt(target)}</span>
      </QuantityTooltip>
    </span>
  );
}

type ConfigParamsReportedTargetTableProps = {
  rows: ReportedTargetRow[];
  parameters: Parameters<typeof buildConfigColumns>[0];
};

export function ConfigParamsReportedTargetTable({
  rows,
  parameters
}: ConfigParamsReportedTargetTableProps) {
  const { t } = useLingui();
  const { columns } = buildConfigColumns(parameters, t`Quantities`);

  return (
    <div className="max-w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
      <Table className="w-auto min-w-max table-fixed">
        <Thead>
          <Tr>
            {columns.map((col) => (
              <Th
                key={col.key}
                className={cn(
                  "px-3 text-xs whitespace-nowrap",
                  getColumnWidthClass(col)
                )}
              >
                {col.label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.length === 0 ? (
            <Tr>
              <Td
                colSpan={columns.length}
                className="px-3 py-6 text-center text-sm text-muted-foreground"
              >
                <Trans>No configuration quantities recorded yet.</Trans>
              </Td>
            </Tr>
          ) : (
            rows.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {columns.map((col) => (
                  <Td
                    key={col.key}
                    className={cn(
                      "px-3 py-2 text-sm tabular-nums",
                      getColumnWidthClass(col),
                      col.type === "quantity" && "font-medium"
                    )}
                  >
                    {col.type === "quantity" ? (
                      <QuantityTripletCell
                        reported={row.cells[col.key]?.reported ?? 0}
                        pickup={row.cells[col.key]?.pickup ?? 0}
                        target={row.cells[col.key]?.target ?? 0}
                      />
                    ) : (
                      String(row[col.key] ?? "")
                    )}
                  </Td>
                ))}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </div>
  );
}
