import {
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState, type ReactNode } from "react";
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

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="cursor-default underline decoration-dotted decoration-muted-foreground/40 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="max-w-xs p-3 text-xs"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
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
      </PopoverContent>
    </Popover>
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

const stickyLabelClass =
  "sticky left-0 z-10 bg-background px-3 py-1.5 text-xs font-medium whitespace-nowrap border-r border-border shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_8px_-4px_rgba(0,0,0,0.35)]";

function renderReportedTargetCell(col: ConfigColumn, row: ReportedTargetRow) {
  if (col.type === "quantity") {
    return (
      <QuantityTripletCell
        reported={row.cells[col.key]?.reported ?? 0}
        pickup={row.cells[col.key]?.pickup ?? 0}
        target={row.cells[col.key]?.target ?? 0}
      />
    );
  }

  return String(row[col.key] ?? "");
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

  if (rows.length === 0) {
    return (
      <p className="px-3 py-6 text-center text-sm text-muted-foreground">
        <Trans>No configuration quantities recorded yet.</Trans>
      </p>
    );
  }

  const cellClassName = (col: ConfigColumn) =>
    cn(
      "px-3 py-2 text-sm tabular-nums",
      getColumnWidthClass(col),
      col.type === "quantity" && "font-medium"
    );

  return (
    <>
      <div className="hidden max-w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent md:block">
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
            {rows.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {columns.map((col) => (
                  <Td key={col.key} className={cellClassName(col)}>
                    {renderReportedTargetCell(col, row)}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      <div className="max-w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent md:hidden">
        <Table className="w-auto min-w-max table-fixed">
          <Tbody>
            {columns.map((col) => (
              <Tr key={col.key}>
                <Th
                  className={cn(stickyLabelClass, "min-w-[5rem] max-w-[8rem]")}
                >
                  {col.label}
                </Th>
                {rows.map((row, rowIndex) => (
                  <Td key={rowIndex} className={cellClassName(col)}>
                    {renderReportedTargetCell(col, row)}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </>
  );
}
