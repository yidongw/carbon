import { cn, Tr } from "@carbon/react";
import type { Column, Row as RowType } from "@tanstack/react-table";
import type { ComponentProps, CSSProperties } from "react";
import { memo } from "react";
import type {
  EditableTableCellComponent,
  Position
} from "~/components/Editable";
import Cell from "./Cell";

type RowProps<T> = ComponentProps<typeof Tr> & {
  // The table's columns reference, captured at render time. When the columns
  // useMemo rebuilds (e.g. async option lists loaded), this ref changes so the
  // memoized row re-renders and its cells pick up the new renderers.
  columns?: unknown;
  editableComponents?: Record<string, EditableTableCellComponent<T> | object>;
  editedCells?: string[];
  isEditing: boolean;
  isEditMode: boolean;
  isFrozenColumn?: boolean;
  isRowSelected?: boolean;
  pinnedColumns: string;
  selectedCell: Position;
  row: RowType<T>;
  rowIsSelected: boolean;
  getPinnedStyles: (column: Column<any, unknown>) => CSSProperties;
  onCellClick: (row: number, column: number) => void;
  onCellUpdate: (row: number) => (updates: Record<string, unknown>) => void;
  onFinishEditing?: () => void;
};

const Row = <T extends object>({
  columns: _columns,
  editableComponents,
  editedCells,
  isEditing,
  isEditMode,
  isFrozenColumn = false,
  isRowSelected = false,
  pinnedColumns,
  row,
  rowIsSelected,
  selectedCell,
  getPinnedStyles,
  onCellClick,
  onCellUpdate,
  onFinishEditing,
  className,
  ...props
}: RowProps<T>) => {
  const onUpdate = isEditMode ? onCellUpdate(row.index) : undefined;

  return (
    <Tr
      key={row.id}
      className={cn(
        "border-b border-border transition-colors",
        isFrozenColumn && "bg-card",
        className
      )}
      {...props}
    >
      {row.getVisibleCells().map((cell, columnIndex) => {
        const isSelected =
          selectedCell?.row === cell.row.index &&
          selectedCell?.column === columnIndex;

        return (
          <Cell<T>
            key={cell.id}
            cell={cell}
            cellRenderer={cell.column.columnDef.cell}
            columnIndex={columnIndex}
            // @ts-ignore
            editableComponents={editableComponents}
            editedCells={editedCells}
            isRowSelected={isRowSelected}
            isSelected={isSelected}
            isEditing={isEditing}
            isEditMode={isEditMode}
            pinnedColumns={pinnedColumns}
            getPinnedStyles={getPinnedStyles}
            onClick={
              isEditMode
                ? () => onCellClick(cell.row.index, columnIndex)
                : undefined
            }
            onUpdate={onUpdate}
            onFinishEditing={onFinishEditing}
          />
        );
      })}
    </Tr>
  );
};

const MemoizedRow = memo(
  Row,
  (prev, next) =>
    prev.row.id === next.row.id &&
    prev.row.original === next.row.original &&
    prev.isRowSelected === next.isRowSelected &&
    prev.rowIsSelected === next.rowIsSelected &&
    prev.isEditing === next.isEditing &&
    prev.isEditMode === next.isEditMode &&
    prev.selectedCell?.row === next.selectedCell?.row &&
    prev.selectedCell?.column === next.selectedCell?.column &&
    prev.pinnedColumns === next.pinnedColumns &&
    // getPinnedStyles identity changes when columnPinning/columnSizeMap update
    // (it's a useCallback keyed on them). Without this, rows keep the styles
    // from the first render — when columnSizeMap was still empty — so pinned
    // body cells stick at left:0 and cover the checkbox column.
    prev.getPinnedStyles === next.getPinnedStyles &&
    // Re-render when the columns rebuild (e.g. async option lists loaded) so
    // cells pick up their new renderers.
    prev.columns === next.columns
) as typeof Row;

export default MemoizedRow;
