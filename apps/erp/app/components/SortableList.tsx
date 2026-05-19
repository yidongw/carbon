"use client";

import { Checkbox, cn, HStack } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { LayoutGroup, motion, Reorder, useDragControls } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { LuPlus, LuTable, LuTrash } from "react-icons/lu";
import Empty from "./Empty";

export interface Item {
  checked: boolean;
  details?: ReactNode;
  footer?: ReactNode;
  id: string;
  isTemporary?: boolean;
  order?: "With Previous" | "After Previous";
  title: ReactNode;
  /** Filled strip between the main block and footer (e.g. operation quantity progress). */
  quantityProgress?: {
    complete: number;
    pickup: number;
    target: number;
    onAddQuantity?: () => void;
    onAddPickup?: () => void;
    onOpenConfigTable?: () => void;
  } | null;
}

interface SortableItem<T> extends Item {
  data: T;
}

interface SortableListItemProps<T> {
  item: SortableItem<T>;
  items: SortableItem<T>[];
  order: number;
  onSelectItem: (id: string) => void;
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  renderExtra?: (item: SortableItem<T>) => React.ReactNode;
  isExpanded?: boolean;
  isHighlighted?: boolean;
  className?: string;
  handleDrag: () => void;
  isReadOnly?: boolean;
}

function SortableListItem<T>({
  item,
  items,
  order,
  onSelectItem,
  onToggleItem,
  onRemoveItem,
  renderExtra,
  handleDrag,
  isExpanded,
  isHighlighted,
  className,
  isReadOnly = false
}: SortableListItemProps<T>) {
  const { t } = useLingui();
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggable] = useState(!isExpanded && !isReadOnly);
  const dragControls = useDragControls();
  const itemRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (event: any) => {
    if (isExpanded || isReadOnly) return;
    flushSync(() => setIsDragging(true));
    dragControls.start(event, { snapToCursor: true });
    handleDrag();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Scroll into view when highlighted
  useEffect(() => {
    if (isHighlighted && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [isHighlighted]);

  return (
    <div className={cn("", className)} key={item.id} ref={itemRef}>
      <div className="flex w-full items-center">
        <Reorder.Item
          value={item}
          className={cn(
            "relative z-auto grow",
            "h-full rounded-md bg-muted/40",
            "border border-border rounded-lg ",
            !isExpanded && !isReadOnly && "cursor-grab",
            isHighlighted && "border-2 border-primary",
            item.checked && !isDragging ? "w-7/10" : "w-full"
          )}
          key={item.id}
          dragListener={!item.checked && !isExpanded && !isReadOnly}
          dragControls={dragControls}
          onDragEnd={handleDragEnd}
          style={
            isExpanded
              ? {
                  zIndex: 9999,
                  marginTop: 10,
                  marginBottom: 10,
                  position: "relative",
                  overflow: item.quantityProgress != null ? "visible" : "hidden"
                }
              : {
                  position: "relative",
                  overflow: item.quantityProgress != null ? "visible" : "hidden"
                }
          }
          whileDrag={{ zIndex: 9999 }}
        >
          <div
            className={cn(
              isExpanded ? "w-full" : "",
              "relative z-20 flex w-full min-w-0 flex-col"
            )}
          >
            <motion.div className="w-full px-3 pt-3" layout="position">
              <div
                className={cn(
                  "items-center justify-between w-full gap-2",
                  isExpanded && "flex flex-col flex-grow"
                )}
              >
                <div className="flex flex-col w-full">
                  <div className="flex w-full items-center gap-x-2 truncate pl-3">
                    {/* List Remove Actions */}
                    {!isReadOnly && (
                      <Checkbox
                        checked={item.checked}
                        id={`checkbox-${item.id}`}
                        aria-label={t`Mark to delete`}
                        onCheckedChange={() => onToggleItem(item.id)}
                        className="border-foreground/20 bg-background/30 data-[state=checked]:bg-background data-[state=checked]:text-red-200 flex flex-shrink-0 "
                      />
                    )}
                    {/* List Order */}
                    <p className="font-medium text-xs pl-1 text-foreground/50 flex flex-shrink-0">
                      {getParallelizedOrder(order, item, items)}
                    </p>

                    <div
                      key={`${item.checked}`}
                      className="px-1 flex flex-grow truncate"
                      role="button"
                    >
                      <HStack
                        className={cn(
                          "w-full justify-between pr-8",
                          !isReadOnly && "cursor-grab"
                        )}
                      >
                        {/* List Title */}
                        {typeof item.title === "string" ? (
                          <span
                            className={cn(
                              "flex font-medium text-sm md:text-base truncate hover:underline cursor-pointer",
                              item.checked ? "text-red-400" : "text-foreground"
                            )}
                            onClick={(e) => {
                              if (!isDragging) {
                                onSelectItem(item.id);
                              }
                            }}
                          >
                            {item.title}
                          </span>
                        ) : (
                          <div
                            onClick={(e) => {
                              if (!isDragging) {
                                onSelectItem(item.id);
                              }
                            }}
                            className={item.checked ? "text-red-400" : ""}
                          >
                            {item.title}
                          </div>
                        )}

                        {item.details && (
                          <div className="flex flex-shrink-0">
                            {item.details}
                          </div>
                        )}
                      </HStack>
                    </div>
                  </div>
                </div>

                {/* List Item Children */}
              </div>
            </motion.div>
            {item.quantityProgress != null && (
              <QuantityProgressStrip progress={item.quantityProgress} t={t} />
            )}
            {renderExtra && (
              <motion.div
                className={cn(
                  "w-full px-3",
                  item.quantityProgress == null && !item.footer && "pb-3"
                )}
                layout="position"
              >
                {renderExtra(item)}
              </motion.div>
            )}
            {item.footer && (
              <div
                className={cn(
                  "flex w-full items-center px-3 py-2",
                  (isExpanded || item.quantityProgress == null) &&
                    "border-t border-border"
                )}
              >
                {item.footer}
              </div>
            )}
          </div>
          {!isReadOnly && (
            <div
              onPointerDown={isDraggable ? handleDragStart : undefined}
              style={{ touchAction: "none" }}
            />
          )}
        </Reorder.Item>
        {/* List Delete Action Animation */}

        {!isReadOnly && item.checked ? (
          <div className="h-[1.5rem] w-3" />
        ) : null}

        {!isReadOnly && item.checked ? (
          <div className="inset-0 z-0 rounded-full bg-card border-border border dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)] dark:bg-[#161716]/50">
            <button
              className="inline-flex h-10 items-center justify-center space-nowrap rounded-md px-3 text-sm font-medium  transition-colors duration-150  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onRemoveItem(item.id)}
            >
              <LuTrash className="h-4 w-4 text-red-400 transition-colors duration-150 fill-red-400/60 " />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type SortableItemRenderProps<T extends Item> = {
  item: T;
  items: T[];
  order: number;
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
};

interface SortableListProps<T extends Item> {
  items: T[];
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onReorder: (items: T[]) => void;
  renderItem: (props: SortableItemRenderProps<T>) => React.ReactNode;
  isReadOnly?: boolean;
}

function SortableList<T extends Item>({
  items,
  onRemoveItem,
  onToggleItem,
  onReorder,
  renderItem,
  isReadOnly = false
}: SortableListProps<T>) {
  if (items && Array.isArray(items) && items.length > 0) {
    return (
      <LayoutGroup>
        <Reorder.Group
          axis="y"
          values={items}
          // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
          onReorder={isReadOnly ? () => {} : onReorder}
          className="flex flex-col"
        >
          {items?.map((item, index) =>
            renderItem({
              item,
              items,
              order: index,
              onToggleItem,
              onRemoveItem
            })
          )}
        </Reorder.Group>
      </LayoutGroup>
    );
  } else {
    return <Empty />;
  }
}

SortableList.displayName = "SortableList";

export { SortableList, SortableListItem };

function formatQuantityValue(value: number) {
  return Number.isInteger(value)
    ? value
    : value.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function getPercent(value: number, target: number) {
  if (target > 0) return Math.min(100, (value / target) * 100);
  return value > 0 ? 100 : 0;
}

function QuantityProgressStrip({
  progress,
  t
}: {
  progress: NonNullable<Item["quantityProgress"]>;
  t: ReturnType<typeof useLingui>["t"];
}) {
  const { complete, pickup, target, onAddQuantity, onAddPickup, onOpenConfigTable } = progress;
  const completePercent = getPercent(complete, target);
  const pickupPercent = Math.min(
    getPercent(pickup, target),
    100 - completePercent
  );
  const isOverTarget = target > 0 && complete > target;

  const iconButtonClass =
    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-foreground/80 transition-[transform,background-color] duration-150 hover:bg-muted hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  const indicator = (
    <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-border/70 bg-background px-2 py-0.5 shadow-sm">
      {/* Finished group */}
      {onAddQuantity ? (
        <button
          type="button"
          className="flex items-center gap-0.5 rounded transition-opacity duration-150 hover:opacity-70 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label={t`Add production quantity`}
          onClick={(event) => {
            event.stopPropagation();
            onAddQuantity();
          }}
        >
          <LuPlus className={cn("h-3.5 w-3.5 shrink-0", isOverTarget ? "text-amber-500" : "text-foreground/80")} strokeWidth={2.5} />
          <span className={cn("text-sm font-medium tabular-nums leading-none tracking-tight", isOverTarget ? "text-amber-500" : "text-foreground")}>
            {formatQuantityValue(complete)}
          </span>
        </button>
      ) : (
        <span className={cn("text-sm font-medium tabular-nums leading-none tracking-tight", isOverTarget ? "text-amber-500" : "text-foreground")}>
          {formatQuantityValue(complete)}
        </span>
      )}
      {/* Pickup group */}
      {onAddPickup ? (
        <button
          type="button"
          className="flex items-center gap-0.5 rounded transition-opacity duration-150 hover:opacity-70 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label={t`Add pickup`}
          onClick={(event) => {
            event.stopPropagation();
            onAddPickup();
          }}
        >
          <LuPlus className={cn("h-3.5 w-3.5 shrink-0", pickup > 0 ? "text-blue-600" : "text-foreground/80")} strokeWidth={2.5} />
          <span className={cn("text-sm font-medium tabular-nums leading-none tracking-tight", pickup > 0 ? "text-blue-600" : "text-muted-foreground")}>
            {formatQuantityValue(pickup)}
          </span>
        </button>
      ) : (
        <span className={cn("text-sm font-medium tabular-nums leading-none tracking-tight", pickup > 0 ? "text-blue-600" : "text-muted-foreground")}>
          {formatQuantityValue(pickup)}
        </span>
      )}
      {/* Target */}
      <span className="text-sm font-medium tabular-nums leading-none tracking-tight text-muted-foreground">
        {formatQuantityValue(target)}
      </span>
      {/* Config summary */}
      {onOpenConfigTable ? (
        <button
          type="button"
          className={iconButtonClass}
          aria-label={t`View configuration quantities`}
          onClick={(event) => {
            event.stopPropagation();
            onOpenConfigTable();
          }}
        >
          <LuTable className="h-3 w-3" strokeWidth={2.5} />
        </button>
      ) : null}
    </div>
  );

  const progressLine = (
    <div className="relative h-0.5 w-full overflow-hidden bg-muted-foreground/35">
      <div
        className={cn(
          "absolute inset-y-0 left-0 transition-[width] duration-300 ease-out",
          isOverTarget ? "bg-amber-500/90" : "bg-emerald-500"
        )}
        style={{ width: `${completePercent}%` }}
      />
      {pickupPercent > 0 && (
        <div
          className="absolute inset-y-0 bg-blue-600 transition-[width,left] duration-300 ease-out"
          style={{ left: `${completePercent}%`, width: `${pickupPercent}%` }}
        />
      )}
    </div>
  );

  return (
    <div
      className="w-full min-w-0 shrink-0"
      role="img"
      aria-label={t`Finished ${complete} of ${target} units, ${pickup} picked up`}
    >
      <div className="relative h-7 w-full">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          {progressLine}
        </div>
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          {indicator}
        </div>
      </div>
    </div>
  );
}

function getParallelizedOrder(index: number, item: Item, items: Item[]) {
  if (item?.order !== "With Previous") return index + 1;
  for (let i = index - 1; i >= 0; i--) {
    if (items[i].order !== "With Previous") {
      return i + 1;
    }
  }
  return 1;
}
