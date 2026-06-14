import { cn, Table, Tbody, Td, Th, Thead, Tr } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  buildConfigColumns,
  type ConfigColumn,
  type ReportedTargetRow
} from "~/modules/production/configParamsTableColumns";

function getColumnWidthClass(column: ConfigColumn): string {
  switch (column.type) {
    case "quantity":
      return "w-[7rem] min-w-[7rem] max-w-[7rem]";
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

function formatQuantityPair(reported: number, target: number) {
  const format = (n: number) =>
    Number.isInteger(n)
      ? String(n)
      : n.toLocaleString(undefined, { maximumFractionDigits: 4 });
  return `${format(reported)} / ${format(target)}`;
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
                      <span>
                        {formatQuantityPair(
                          row.cells[col.key]?.reported ?? 0,
                          row.cells[col.key]?.target ?? 0
                        )}
                      </span>
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
