import { cn, Table, Tbody, Td, Th, Thead, Tr } from "@carbon/react";
import type { ReactNode } from "react";
import type { Column, Row } from "./configTableShared";
import { getColumnWidthClass as defaultGetColumnWidthClass } from "./configTableShared";

export type ResponsiveConfigTableColumn = {
  key: string;
  label: string;
};

type ResponsiveConfigTableProps<
  TColumn extends ResponsiveConfigTableColumn,
  TRow
> = {
  columns: TColumn[];
  rows: TRow[];
  hasReferences?: boolean;
  /** When true, zero-value field rows are hidden in the vertical mobile layout. */
  hideZeroValuesInVertical?: boolean;
  /** Used with hideZeroValuesInVertical to decide if a column row should show. */
  isFieldEmpty?: (row: TRow, column: TColumn) => boolean;
  getColumnWidthClass?: (
    column: TColumn,
    hasReferences: boolean
  ) => string;
  getCellClassName?: (column: TColumn, hasReferences: boolean) => string;
  renderCell: (
    column: TColumn,
    row: TRow,
    rowIndex: number
  ) => ReactNode;
  renderRowActions?: (rowIndex: number) => ReactNode;
};

function isZeroOrEmpty(value: string | number | boolean | undefined): boolean {
  if (value === undefined) return true;

  const stringValue = String(value).trim();
  if (stringValue === "") return true;

  return Number(stringValue) === 0;
}

function defaultIsFieldEmpty(row: Row, column: Column): boolean {
  return isZeroOrEmpty(row[column.key]);
}

function visibleFieldsForVerticalReadOnly<
  TColumn extends ResponsiveConfigTableColumn,
  TRow
>(
  rows: TRow[],
  columns: TColumn[],
  isFieldEmpty: (row: TRow, column: TColumn) => boolean
): TColumn[] {
  return columns.filter((col) =>
    rows.some((row) => !isFieldEmpty(row, col))
  );
}

const stickyLabelClass =
  "sticky left-0 z-10 bg-background px-3 py-1.5 text-xs font-medium whitespace-nowrap border-r border-border shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_8px_-4px_rgba(0,0,0,0.35)]";

/**
 * Config-table layout that renders a horizontal table on md+ screens and a
 * transposed table on smaller viewports (field labels in a sticky left column,
 * values scrolling horizontally to the right).
 */
export function ResponsiveConfigTable<
  TColumn extends ResponsiveConfigTableColumn,
  TRow
>({
  columns,
  rows,
  hasReferences = false,
  hideZeroValuesInVertical = false,
  isFieldEmpty,
  getColumnWidthClass = defaultGetColumnWidthClass as (
    column: TColumn,
    hasReferences: boolean
  ) => string,
  getCellClassName,
  renderCell,
  renderRowActions
}: ResponsiveConfigTableProps<TColumn, TRow>) {
  if (rows.length === 0) return null;

  const resolveFieldEmpty =
    isFieldEmpty ??
    (defaultIsFieldEmpty as (row: TRow, column: TColumn) => boolean);

  const fieldRows = hideZeroValuesInVertical
    ? visibleFieldsForVerticalReadOnly(rows, columns, resolveFieldEmpty)
    : columns;

  const cellClassName = (col: TColumn) =>
    getCellClassName
      ? getCellClassName(col, hasReferences)
      : cn("px-3 py-1.5", getColumnWidthClass(col, hasReferences));

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
                  <Td key={col.key} className={cellClassName(col)}>
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
                  <Td key={rowIndex} className={cellClassName(col)}>
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
