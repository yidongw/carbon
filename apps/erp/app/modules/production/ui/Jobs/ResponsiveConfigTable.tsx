import { cn, Table, Tbody, Td, Th, Thead, Tr } from "@carbon/react";
import type { ReactNode } from "react";
import type { Column, Row } from "./configTableShared";
import { getColumnWidthClass } from "./configTableShared";

function isZeroOrEmpty(value: string | number | boolean | undefined): boolean {
  if (value === undefined) return true;

  const stringValue = String(value).trim();
  if (stringValue === "") return true;

  return Number(stringValue) === 0;
}

function visibleFieldsForVerticalReadOnly(
  rows: Row[],
  columns: Column[]
): Column[] {
  return columns.filter((col) =>
    rows.some((row) => !isZeroOrEmpty(row[col.key]))
  );
}

const stickyLabelClass =
  "sticky left-0 z-10 bg-background px-3 py-1.5 text-xs font-medium whitespace-nowrap border-r border-border shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_8px_-4px_rgba(0,0,0,0.35)]";

type ResponsiveConfigTableProps = {
  columns: Column[];
  rows: Row[];
  hasReferences: boolean;
  /** When true, zero-value field rows are hidden in the vertical mobile layout. */
  hideZeroValuesInVertical?: boolean;
  renderCell: (
    column: Column,
    row: Row,
    rowIndex: number
  ) => ReactNode;
  renderRowActions?: (rowIndex: number) => ReactNode;
};

/**
 * Config-table layout that renders a horizontal table on md+ screens and a
 * transposed table on smaller viewports (field labels in a sticky left column,
 * values scrolling horizontally to the right).
 */
export function ResponsiveConfigTable({
  columns,
  rows,
  hasReferences,
  hideZeroValuesInVertical = false,
  renderCell,
  renderRowActions
}: ResponsiveConfigTableProps) {
  if (rows.length === 0) return null;

  const fieldRows = hideZeroValuesInVertical
    ? visibleFieldsForVerticalReadOnly(rows, columns)
    : columns;

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
                    getColumnWidthClass(col, hasReferences)
                  )}
                >
                  {col.label}
                </Th>
              ))}
              {renderRowActions ? (
                <Th className="px-3 w-10 min-w-10 max-w-10" />
              ) : null}
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {columns.map((col) => (
                  <Td
                    key={col.key}
                    className={cn(
                      "px-3 py-1.5",
                      getColumnWidthClass(col, hasReferences)
                    )}
                  >
                    {renderCell(col, row, rowIndex)}
                  </Td>
                ))}
                {renderRowActions ? (
                  <Td className="px-3 py-1.5 w-10 min-w-10 max-w-10">
                    {renderRowActions(rowIndex)}
                  </Td>
                ) : null}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      <div className="max-w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent md:hidden">
        <Table className="w-auto min-w-max table-fixed">
          <Tbody>
            {fieldRows.map((col) => (
              <Tr key={col.key}>
                <Th className={cn(stickyLabelClass, "min-w-[5rem] max-w-[8rem]")}>
                  {col.label}
                </Th>
                {rows.map((row, rowIndex) => (
                  <Td
                    key={rowIndex}
                    className={cn(
                      "px-3 py-1.5",
                      getColumnWidthClass(col, hasReferences)
                    )}
                  >
                    {renderCell(col, row, rowIndex)}
                  </Td>
                ))}
              </Tr>
            ))}
            {renderRowActions ? (
              <Tr>
                <Th className={cn(stickyLabelClass, "min-w-[5rem]")} />
                {rows.map((_, rowIndex) => (
                  <Td
                    key={rowIndex}
                    className="px-3 py-1.5 w-10 min-w-10 max-w-10"
                  >
                    {renderRowActions(rowIndex)}
                  </Td>
                ))}
              </Tr>
            ) : null}
          </Tbody>
        </Table>
      </div>
    </>
  );
}
