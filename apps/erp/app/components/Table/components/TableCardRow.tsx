import {
  Card,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Menu,
  Separator,
  VStack
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { Cell, Column, Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
  isValidElement,
  type JSX,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode
} from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useSwipeReveal } from "~/hooks/useSwipeReveal";
import { CardFieldChip, CardFieldChipBody } from "./CardFieldChip";

const SYSTEM_COLUMN_IDS = new Set(["Select", "Actions", "Expand"]);

interface TableCardRowProps<T extends object> {
  row: Row<T>;
  pinnedColumns: Column<T, unknown>[];
  centerColumns: Column<T, unknown>[];
  featuredColumns: Set<string>;
  getRowHref?: (row: T) => string | undefined;
  renderContextMenu?: (row: T) => JSX.Element | null;
}

const ROW_NAV_IGNORE_SELECTOR =
  "a, button, input, select, textarea, [role='button'], [data-prevent-row-nav]";

function shouldIgnoreRowNavigation(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    Boolean(target.closest(ROW_NAV_IGNORE_SELECTOR))
  );
}

function isEmptyRawValue(value: unknown): boolean {
  if (value == null || value === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

function hasAccessor<T extends object>(column: Column<T, unknown>): boolean {
  const def = column.columnDef as {
    accessorKey?: unknown;
    accessorFn?: unknown;
  };
  return def.accessorKey != null || def.accessorFn != null;
}

function isPlaceholderDisplay(rendered: ReactNode): boolean {
  if (rendered == null || rendered === false) return true;
  if (typeof rendered === "string") {
    const text = rendered.trim();
    return text === "" || text === "—" || text === "-";
  }
  if (typeof rendered === "number") return false;
  if (isValidElement(rendered) && rendered.type === "span") {
    const children = (rendered.props as { children?: ReactNode }).children;
    if (children === "—" || children === "-") return true;
    if (typeof children === "string") {
      const text = children.trim();
      return text === "" || text === "—" || text === "-";
    }
  }
  return false;
}

function getCellRawValue<T extends object>(
  row: Row<T>,
  cell: Cell<T, unknown>
): unknown {
  try {
    const fromCell = cell.getValue();
    if (fromCell !== undefined) return fromCell;
  } catch {
    // columns without accessor may throw
  }
  return (row.original as Record<string, unknown>)[cell.column.id];
}

function hasCellDisplayValue<T extends object>(
  row: Row<T>,
  cell: Cell<T, unknown>,
  rendered: ReactNode
): boolean {
  if (cell.column.columnDef.meta?.isEmpty?.(row.original)) return false;
  if (isPlaceholderDisplay(rendered)) return false;

  const raw = getCellRawValue(row, cell);
  if (hasAccessor(cell.column) || cell.column.id in row.original) {
    if (isEmptyRawValue(raw)) return false;
  }

  return true;
}

function FieldIcon({
  children,
  size = "sm"
}: {
  children: ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "flex-shrink-0 text-muted-foreground",
        size === "md"
          ? "[&>svg]:h-4 [&>svg]:w-4"
          : "[&>svg]:h-3.5 [&>svg]:w-3.5"
      )}
    >
      {children}
    </span>
  );
}

interface FieldChipProps {
  header: string;
  icon?: ReactNode;
  children: ReactNode;
  variant: "featured" | "metadata";
}

function FieldChip({
  header,
  icon,
  children,
  variant,
  rowNav,
  rowNavLabel,
  onRowNav
}: FieldChipProps & {
  rowNav?: boolean;
  rowNavLabel?: string;
  onRowNav?: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  if (variant === "featured") {
    return (
      <CardFieldChip variant="featured">
        <CardFieldChipBody rowNav={rowNav} rowNavLabel={rowNavLabel} onRowNav={onRowNav}>
          <div className="flex items-center gap-1.5">
            {icon && <FieldIcon size="md">{icon}</FieldIcon>}
            <span className="card-action-label text-sm font-medium text-foreground">
              {header}
            </span>
          </div>
          <div className="min-w-0 text-base font-medium leading-snug text-foreground [&_.tabular-nums]:tabular-nums">
            {children}
          </div>
        </CardFieldChipBody>
      </CardFieldChip>
    );
  }

  return (
    <CardFieldChip variant="inline">
      <CardFieldChipBody rowNav={rowNav} rowNavLabel={rowNavLabel} onRowNav={onRowNav}>
        {icon && <FieldIcon>{icon}</FieldIcon>}
        <span className="card-action-label text-muted-foreground">{header}</span>
        <span className="min-w-0 font-medium text-foreground">{children}</span>
      </CardFieldChipBody>
    </CardFieldChip>
  );
}

function renderFieldColumn<T extends object>(
  row: Row<T>,
  column: Column<T, unknown>,
  cell: Cell<T, unknown>,
  variant: "featured" | "metadata",
  {
    rowHref,
    defaultRowNavLabel
  }: {
    rowHref?: string;
    defaultRowNavLabel: string;
  },
  onRowNav: (href: string) => (event: MouseEvent<HTMLButtonElement>) => void
) {
  const header =
    typeof column.columnDef.header === "string"
      ? column.columnDef.header
      : null;
  if (!header) return null;

  const rendered = flexRender(column.columnDef.cell, cell.getContext());
  if (!hasCellDisplayValue(row, cell, rendered)) return null;

  const isRowNav = Boolean(column.columnDef.meta?.cardRowNav && rowHref);
  const rowNavLabel =
    column.columnDef.meta?.cardRowNavLabel ?? defaultRowNavLabel;

  return (
    <FieldChip
      key={column.id}
      header={header}
      icon={column.columnDef.meta?.icon}
      variant={variant}
      rowNav={isRowNav}
      rowNavLabel={rowNavLabel}
      onRowNav={isRowNav && rowHref ? onRowNav(rowHref) : undefined}
    >
      {rendered}
    </FieldChip>
  );
}

function TableCardRow<T extends object>({
  row,
  pinnedColumns,
  centerColumns,
  featuredColumns,
  getRowHref,
  renderContextMenu
}: TableCardRowProps<T>) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const rowHref = getRowHref?.(row.original);
  const defaultRowNavLabel = t`Open`;
  const onRowNav = useCallback(
    (href: string) => (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      navigate(href);
    },
    [navigate]
  );
  const contextMenu = renderContextMenu?.(row.original);
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const {
    didSwipe,
    isDragging,
    offset: swipeOffset,
    onTouchCancel,
    onTouchEnd,
    onTouchMove,
    onTouchStart
  } = useSwipeReveal({ onOpen: openMenu });
  const cellMap = Object.fromEntries(
    row.getAllCells().map((cell) => [cell.column.id, cell])
  );

  const cardLeft = pinnedColumns.filter((c) => !SYSTEM_COLUMN_IDS.has(c.id));
  const cardRight = centerColumns.filter(
    (c) => !SYSTEM_COLUMN_IDS.has(c.id) && featuredColumns.has(c.id)
  );
  const userCenter = centerColumns.filter(
    (c) => !SYSTEM_COLUMN_IDS.has(c.id) && !featuredColumns.has(c.id)
  );

  const featuredNodes = cardRight
    .map((column) => {
      const cell = cellMap[column.id];
      if (!cell) return null;
      return renderFieldColumn(row, column, cell, "featured", {
        rowHref,
        defaultRowNavLabel
      }, onRowNav);
    })
    .filter(Boolean);

  const metadataNodes = userCenter
    .map((column) => {
      const cell = cellMap[column.id];
      if (!cell) return null;
      return renderFieldColumn(row, column, cell, "metadata", {
        rowHref,
        defaultRowNavLabel
      }, onRowNav);
    })
    .filter(Boolean);

  const hasPinned = cardLeft.length > 0 || featuredNodes.length > 0;
  const hasUnpinned = metadataNodes.length > 0;

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    if (!rowHref || shouldIgnoreRowNavigation(event.target)) return;
    navigate(rowHref);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!rowHref || shouldIgnoreRowNavigation(event.target)) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(rowHref);
    }
  };

  const card = (
    <Card
      role={rowHref ? "button" : undefined}
      tabIndex={rowHref ? 0 : undefined}
      onClick={rowHref ? handleCardClick : undefined}
      onKeyDown={rowHref ? handleCardKeyDown : undefined}
      className={cn(
        // Flat container — field chips are the clickable bits; the card highlights on
        // hover but keeps the default cursor. (Tapping a non-chip area still
        // navigates.)
        "w-full cursor-default overflow-hidden border-0 shadow-none",
        "bg-muted/50 dark:bg-card",
        "transition-colors duration-150 ease-out",
        "hover:bg-muted dark:hover:bg-muted/70",
        "active:bg-muted/90 dark:active:bg-muted/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      )}
    >
      {hasPinned && (
        <div className="flex items-start justify-between gap-3 p-3.5">
          {cardLeft.length > 0 && (
            <VStack spacing={1.5} className="min-w-0 flex-1">
              {cardLeft.map((column) => {
                const cell = cellMap[column.id];
                if (!cell) return null;
                const isRowNav = Boolean(
                  column.columnDef.meta?.cardRowNav && rowHref
                );
                const rowNavLabel =
                  column.columnDef.meta?.cardRowNavLabel ?? defaultRowNavLabel;
                return (
                  <CardFieldChip key={column.id} variant="pinned">
                    <CardFieldChipBody
                      rowNav={isRowNav}
                      rowNavLabel={rowNavLabel}
                      onRowNav={
                        isRowNav && rowHref ? onRowNav(rowHref) : undefined
                      }
                    >
                      {flexRender(column.columnDef.cell, cell.getContext())}
                    </CardFieldChipBody>
                  </CardFieldChip>
                );
              })}
            </VStack>
          )}

          {featuredNodes.length > 0 && (
            <div className="flex w-full max-w-[52%] flex-shrink-0 flex-col gap-2 min-w-0">
              {featuredNodes}
            </div>
          )}
        </div>
      )}

      {hasPinned && hasUnpinned && <Separator className="bg-border/50" />}

      {hasUnpinned && (
        <div
          className={cn(
            "flex flex-wrap gap-1.5 px-3.5 pb-3.5",
            hasPinned ? "pt-2.5" : "pt-3.5"
          )}
        >
          {metadataNodes}
        </div>
      )}

      {!hasPinned && !hasUnpinned && (
        <div className="p-3.5 text-xs text-muted-foreground">—</div>
      )}
    </Card>
  );

  if (!contextMenu) return card;

  return (
    <div className="relative overflow-hidden rounded-lg">
      <Menu type="dropdown">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 z-10 h-px w-px -translate-y-1/2 opacity-0"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {contextMenu}
          </DropdownMenuContent>
        </DropdownMenu>
      </Menu>
      <div
        className="relative touch-pan-y"
        onTouchCancel={onTouchCancel}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        onTouchStart={onTouchStart}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isDragging ? undefined : "transform 200ms ease-out"
        }}
      >
        {card}
      </div>
    </div>
  );
}

export default TableCardRow;
