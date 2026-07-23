import { getLogger } from "@carbon/logger";
import { cn, Td } from "@carbon/react";
import type { Cell as CellType, Column } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import type { CSSProperties } from "react";
import { memo, useState } from "react";
import { LuPencil } from "react-icons/lu";
import type { EditableTableCellComponent } from "~/components/Editable";
import { useMovingCellRef } from "~/hooks";
import { getAccessorKey } from "../utils";

const logger = getLogger("erp", "cell");

type CellProps<T> = {
  cell: CellType<T, unknown>;
  columnIndex: number;
  // The column's cell renderer, captured at render time. TanStack reuses the
  // `cell` object across renders, so reading columnDef.cell off it can't detect a
  // renderer change; comparing this captured prop can.
  cellRenderer?: unknown;
  editableComponents?: Record<string, EditableTableCellComponent<T>>;
  editedCells?: string[];
  isEditing: boolean;
  isEditMode: boolean;
  isRowSelected: boolean;
  isSelected: boolean;
  pinnedColumns: string;
  getPinnedStyles: (column: Column<any, unknown>) => CSSProperties;
  onClick?: () => void;
  onUpdate?: (updates: Record<string, unknown>) => void;
  onFinishEditing?: () => void;
  table: any;
};

const Cell = <T extends object>({
  cell,
  columnIndex,
  editableComponents,
  editedCells,
  isEditing,
  isEditMode,
  isSelected,
  getPinnedStyles,
  onClick,
  onUpdate,
  onFinishEditing,
  table
}: CellProps<T>) => {
  const { ref, tabIndex, onFocus } = useMovingCellRef(isSelected);
  const [hasError, setHasError] = useState(false);
  const accessorKey = getAccessorKey(cell.column.columnDef);

  const wasEdited =
    !!editedCells && !!accessorKey && editedCells.includes(accessorKey);

  const hasEditableTableCellComponent =
    accessorKey !== undefined &&
    editableComponents &&
    accessorKey in editableComponents;

  const editableCell = hasEditableTableCellComponent
    ? editableComponents[accessorKey]
    : null;

  const isPinned = cell.column.getIsPinned();
  const cellClassName =
    typeof cell.column.columnDef.meta === "object" &&
    cell.column.columnDef.meta !== null &&
    "cellClassName" in cell.column.columnDef.meta
      ? (cell.column.columnDef.meta.cellClassName as string | undefined)
      : undefined;

  // Inline-editable cells render as plain text until clicked; surface a subtle
  // pencil on hover so users can tell the value is editable.
  const showEditAffordance =
    isEditMode && hasEditableTableCellComponent && !isSelected;

  return (
    <Td
      className={cn(
        "group/cell relative py-2 whitespace-nowrap text-sm outline-none max-w-[30dvw] truncate",
        cell.column.id === "Select" ? "px-2" : "px-4",
        cellClassName,
        wasEdited && "bg-yellow-100 dark:bg-yellow-900",
        isEditMode && !hasEditableTableCellComponent && "bg-muted/50",
        isEditMode && "border-border border-r",
        hasError && "ring-inset ring-2 ring-red-500",
        // Selection is always visible (Excel-like), or keyboard navigation
        // has no landmark. Editable cells get the full-strength ring +
        // background; read-only cells a muted ring so the selection doesn't
        // signal "you can type here".
        isSelected && "!ring-inset !ring-2",
        isSelected &&
          (hasEditableTableCellComponent ? "!ring-ring" : "!ring-ring/40"),
        isSelected && hasEditableTableCellComponent && "!bg-background",
        isPinned && "bg-card transition-[left] duration-200"
      )}
      ref={ref}
      style={{
        ...getPinnedStyles(cell.column),
        width: cell.column.getSize(),
        margin: 0,
        borderSpacing: 0
      }}
      data-row={cell.row.index}
      data-column={columnIndex}
      tabIndex={tabIndex}
      onClick={onClick}
      onFocus={onFocus}
    >
      {isSelected && isEditing && hasEditableTableCellComponent ? (
        <div className="mx-[-0.65rem] my-[-0.25rem]">
          {hasEditableTableCellComponent
            ? flexRender(editableCell, {
                accessorKey,
                value: cell.renderValue(),
                row: cell.row.original,
                onUpdate: onUpdate
                  ? onUpdate
                  : () => logger.error("No update function provided"),
                onError: () => {
                  setHasError(true);
                },
                onFinishEditing
              })
            : null}
        </div>
      ) : (
        <div ref={ref}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
          {showEditAffordance && (
            <LuPencil
              aria-hidden
              className="pointer-events-none absolute right-1.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover/cell:opacity-60"
            />
          )}
        </div>
      )}
    </Td>
  );
};

// Cells re-render based on their own value, not row identity. Multi-field
// cells should subscribe to all fields they read (e.g. via the column
// accessor's `id` returning a derived value). Also compare row.original so
// index-stable cell ids do not show stale data when rows are inserted or
// reordered.
const MemoizedCell = memo(
  Cell,
  (prev, next) =>
    prev.cell.id === next.cell.id &&
    next.isRowSelected === prev.isRowSelected &&
    next.isSelected === prev.isSelected &&
    next.isEditing === prev.isEditing &&
    next.isEditMode === prev.isEditMode &&
    next.cell.getValue() === prev.cell.getValue() &&
    prev.cell.row.original === next.cell.row.original &&
    // Re-render when the column's cell renderer changes. Renderers built in a
    // columns useMemo capture async data (e.g. option lists loaded after mount);
    // without this the cell keeps its first render and shows stale/empty options.
    prev.cellRenderer === next.cellRenderer &&
    next.pinnedColumns === prev.pinnedColumns &&
    next.columnIndex === prev.columnIndex &&
    // getPinnedStyles is applied to the Td below; its identity changes when
    // columnPinning/columnSizeMap update (it's a useCallback keyed on them).
    // Without this the cell keeps the styles from the first render — when
    // columnSizeMap was still empty — so pinned cells stick at left:0 and
    // cover the checkbox column once widths are measured.
    prev.getPinnedStyles === next.getPinnedStyles
) as typeof Cell;

export default MemoizedCell;
