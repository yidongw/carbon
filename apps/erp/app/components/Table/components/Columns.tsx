import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  HStack,
  IconButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { Column, ColumnOrderState } from "@tanstack/react-table";
import { Reorder, useDragControls } from "framer-motion";
import {
  LuColumns2,
  LuEye,
  LuEyeOff,
  LuGripVertical,
  LuPin,
  LuPinOff,
  LuStar,
  LuStarOff
} from "react-icons/lu";

type ColumnsProps<T> = {
  columns: Column<T, unknown>[];
  columnOrder: ColumnOrderState;
  featuredColumns: Set<string>;
  onPinnedReorder: (newLeft: string[]) => void;
  withSelectableRows: boolean;
  setColumnOrder: (newOrder: ColumnOrderState) => void;
  setFeaturedColumns: (cols: Set<string>) => void;
};

const Columns = <T extends object>({
  columns,
  columnOrder,
  featuredColumns,
  onPinnedReorder,
  withSelectableRows,
  setColumnOrder,
  setFeaturedColumns
}: ColumnsProps<T>) => {
  // Only pass toggleable IDs to Framer Motion so its position tracking is not
  // thrown off by non-rendered system columns (Select, Actions, Expand).
  const draggableOrder = columnOrder.filter((id) => {
    const col = columns.find((c) => c.id === id);
    return col && isColumnToggable(col);
  });

  const handleReorder = (newToggleableOrder: string[]) => {
    const pinnedIds = new Set(
      columns
        .filter((col) => isColumnToggable(col) && col.getIsPinned())
        .map((col) => col.id)
    );

    // Pinned columns stay first; non-pinned columns are freely reorderable —
    // no forced featured→regular grouping during drag.
    const pinned = newToggleableOrder.filter((id) => pinnedIds.has(id));
    const nonPinned = newToggleableOrder.filter((id) => !pinnedIds.has(id));
    const corrected = [...pinned, ...nonPinned];

    // A featured column keeps featured status only if it stays within the
    // first F non-pinned positions (F = current non-pinned featured count).
    // Dragging it past that zone drops it from the featured set.
    const nonPinnedFeatured = new Set(
      [...featuredColumns].filter((id) => !pinnedIds.has(id))
    );
    const F = nonPinnedFeatured.size;
    const newNonPinnedFeatured = new Set(
      nonPinned.slice(0, F).filter((id) => nonPinnedFeatured.has(id))
    );
    if (newNonPinnedFeatured.size !== nonPinnedFeatured.size) {
      const pinnedFeatured = [...featuredColumns].filter((id) =>
        pinnedIds.has(id)
      );
      setFeaturedColumns(new Set([...pinnedFeatured, ...newNonPinnedFeatured]));
    }

    setColumnOrder(mergeWithNonToggleable(corrected, columnOrder, columns));
    const newLeft = corrected.filter((id) => pinnedIds.has(id));
    if (newLeft.length > 0) onPinnedReorder(newLeft);
  };

  const { t } = useLingui();

  return (
    <Drawer>
      <DrawerTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton
              aria-label={t`Columns`}
              title={t`Columns`}
              variant="ghost"
              icon={<LuColumns2 />}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              <Trans>Column visibility and order</Trans>
            </p>
          </TooltipContent>
        </Tooltip>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Edit column visibility</Trans>
          </DrawerTitle>
          <DrawerDescription>
            <Trans>Hide, pin and reorder columns</Trans>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <Reorder.Group
            axis="y"
            values={draggableOrder}
            onReorder={handleReorder}
            className="w-full space-y-2"
          >
            {/* Render in draggableOrder sequence so Framer Motion's values and
                children are always in the same order — getAllLeafColumns() order
                can diverge from columnOrder after pinning changes. */}
            {draggableOrder.map((columnId) => {
              const column = columns.find((c) => c.id === columnId);
              if (!column) return null;

              const isPinned = !!column.getIsPinned();
              const isFeatured = featuredColumns.has(column.id) && !isPinned;

              const currentPinnedIds = new Set(
                columns
                  .filter((c) => isColumnToggable(c) && c.getIsPinned())
                  .map((c) => c.id)
              );

              const applyNewOrder = (
                newPinnedIds: Set<string>,
                newFeaturedIds: Set<string>
              ) => {
                const corrected = reorderByGroups(
                  draggableOrder,
                  newPinnedIds,
                  newFeaturedIds
                );
                setColumnOrder(
                  mergeWithNonToggleable(corrected, columnOrder, columns)
                );
              };

              const togglePin = () => {
                if (isPinned) {
                  const newPinnedIds = new Set(
                    [...currentPinnedIds].filter((id) => id !== column.id)
                  );
                  column.pin(false);
                  applyNewOrder(newPinnedIds, featuredColumns);
                } else {
                  const newFeatured = isFeatured
                    ? new Set(
                        [...featuredColumns].filter((id) => id !== column.id)
                      )
                    : featuredColumns;
                  if (isFeatured) setFeaturedColumns(newFeatured);
                  const newPinnedIds = new Set([
                    ...currentPinnedIds,
                    column.id
                  ]);
                  column.pin("left");
                  if (!column.getIsVisible()) column.toggleVisibility(true);
                  applyNewOrder(newPinnedIds, newFeatured);
                }
              };

              const toggleFeatured = () => {
                if (isFeatured) {
                  const newFeatured = new Set(
                    [...featuredColumns].filter((id) => id !== column.id)
                  );
                  setFeaturedColumns(newFeatured);
                  applyNewOrder(currentPinnedIds, newFeatured);
                } else {
                  const newFeatured = new Set([
                    ...featuredColumns,
                    column.id
                  ]);
                  const newPinnedIds = isPinned
                    ? new Set(
                        [...currentPinnedIds].filter((id) => id !== column.id)
                      )
                    : currentPinnedIds;
                  if (isPinned) column.pin(false);
                  setFeaturedColumns(newFeatured);
                  applyNewOrder(newPinnedIds, newFeatured);
                }
              };

              return (
                <ColumnRow
                  key={column.id}
                  column={column}
                  isPinned={isPinned}
                  isFeatured={isFeatured}
                  onTogglePin={togglePin}
                  onToggleFeatured={toggleFeatured}
                  onToggleVisibility={() => column.toggleVisibility()}
                />
              );
            })}
          </Reorder.Group>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

interface ColumnRowProps<T> {
  column: Column<T, unknown>;
  isPinned: boolean;
  isFeatured: boolean;
  onTogglePin: () => void;
  onToggleFeatured: () => void;
  onToggleVisibility: () => void;
}

function ColumnRow<T extends object>({
  column,
  isPinned,
  isFeatured,
  onTogglePin,
  onToggleFeatured,
  onToggleVisibility
}: ColumnRowProps<T>) {
  const dragControls = useDragControls();
  const { t } = useLingui();

  return (
    <Reorder.Item
      value={column.id}
      dragControls={dragControls}
      dragListener={false}
      className="w-full rounded-lg"
    >
      <HStack className="w-full">
        <IconButton
          aria-label={t`Drag handle`}
          icon={<LuGripVertical />}
          variant="ghost"
          className="cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
          style={{ touchAction: "none" }}
        />
        <span className="text-sm flex-grow flex items-center gap-2">
          {column.columnDef.meta?.icon}
          <>{column.columnDef.header as string}</>
        </span>

        <IconButton
          aria-label={isPinned ? t`Unpin column` : t`Pin column`}
          icon={
            isPinned ? (
              <LuPin className="text-primary" />
            ) : (
              <LuPinOff />
            )
          }
          onClick={onTogglePin}
          variant="ghost"
        />

        <IconButton
          aria-label={
            isFeatured ? t`Remove from card right` : t`Show on card right`
          }
          icon={
            isFeatured ? (
              <LuStar className="text-primary" />
            ) : (
              <LuStarOff />
            )
          }
          onClick={onToggleFeatured}
          variant="ghost"
          className="md:hidden"
        />

        <IconButton
          aria-label={t`Toggle visibility`}
          icon={column.getIsVisible() ? <LuEye /> : <LuEyeOff />}
          onClick={onToggleVisibility}
          variant="ghost"
          disabled={isPinned}
        />
      </HStack>
    </Reorder.Item>
  );
}

// Groups toggleable IDs: pinned → featured → regular.
function reorderByGroups(
  toggleableOrder: string[],
  pinnedIds: Set<string>,
  featuredIds: Set<string>
): string[] {
  const pinned = toggleableOrder.filter((id) => pinnedIds.has(id));
  const featured = toggleableOrder.filter(
    (id) => featuredIds.has(id) && !pinnedIds.has(id)
  );
  const regular = toggleableOrder.filter(
    (id) => !pinnedIds.has(id) && !featuredIds.has(id)
  );
  return [...pinned, ...featured, ...regular];
}

// Merges a corrected toggleable order back into the full columnOrder,
// keeping non-toggleable system columns (Select, Actions, Expand) in place.
function mergeWithNonToggleable<T>(
  newToggleableOrder: string[],
  currentColumnOrder: string[],
  columns: Column<T, unknown>[]
): string[] {
  let idx = 0;
  return currentColumnOrder.map((id) => {
    const col = columns.find((c) => c.id === id);
    if (col && isColumnToggable(col)) {
      return newToggleableOrder[idx++] ?? id;
    }
    return id;
  });
}

function isColumnToggable<T>(column: Column<T, unknown>): boolean {
  return (
    column.columnDef.id !== "select" &&
    typeof column.columnDef.header === "string" &&
    column.columnDef.header !== ""
  );
}

export default Columns;
