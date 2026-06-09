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
};

const Row = <T extends object>({
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
    prev.className === next.className
) as typeof Row;

export default MemoizedRow;
