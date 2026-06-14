import {
  Card,
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  cn,
  Menu,
  Separator,
  VStack
} from "@carbon/react";
import type { Cell, Column, Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
  isValidElement,
  type JSX,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode
} from "react";
import { useNavigate } from "react-router";

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

function FieldChip({ header, icon, children, variant }: FieldChipProps) {
  if (variant === "featured") {
    return (
      <div
        className={cn(
          "flex min-w-0 flex-col gap-1.5 rounded-lg border border-primary/25",
          "bg-white px-3 py-2.5 shadow-sm dark:border-primary/30 dark:bg-card"
        )}
      >
        <div className="flex items-center gap-1.5">
          {icon && <FieldIcon size="md">{icon}</FieldIcon>}
          <span className="text-sm font-medium text-foreground">
            {header}
          </span>
        </div>
        <div className="min-w-0 text-base font-medium leading-snug text-foreground [&_.tabular-nums]:tabular-nums">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-lg",
        "border border-border/50 bg-muted/30 px-2 py-1 text-xs leading-snug"
      )}
    >
      {icon && <FieldIcon>{icon}</FieldIcon>}
      <span className="text-muted-foreground">{header}</span>
      <span className="min-w-0 font-medium text-foreground">{children}</span>
    </div>
  );
}

function renderFieldColumn<T extends object>(
  row: Row<T>,
  column: Column<T, unknown>,
  cell: Cell<T, unknown>,
  variant: "featured" | "metadata"
) {
  const header =
    typeof column.columnDef.header === "string"
      ? column.columnDef.header
      : null;
  if (!header) return null;

  const rendered = flexRender(column.columnDef.cell, cell.getContext());
  if (!hasCellDisplayValue(row, cell, rendered)) return null;

  return (
    <FieldChip
      key={column.id}
      header={header}
      icon={column.columnDef.meta?.icon}
      variant={variant}
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
  const navigate = useNavigate();
  const rowHref = getRowHref?.(row.original);
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
      return renderFieldColumn(row, column, cell, "featured");
    })
    .filter(Boolean);

  const metadataNodes = userCenter
    .map((column) => {
      const cell = cellMap[column.id];
      if (!cell) return null;
      return renderFieldColumn(row, column, cell, "metadata");
    })
    .filter(Boolean);

  const hasPinned = cardLeft.length > 0 || featuredNodes.length > 0;
  const hasUnpinned = metadataNodes.length > 0;

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
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

  const cardContent = (
    <Card
      role={rowHref ? "button" : undefined}
      tabIndex={rowHref ? 0 : undefined}
      onClick={rowHref ? handleCardClick : undefined}
      onKeyDown={rowHref ? handleCardKeyDown : undefined}
      className={cn(
        "w-full overflow-hidden border-0",
        "bg-primary/[0.04] dark:bg-primary/10",
        "transition-[box-shadow,transform,background-color] duration-200 ease-out",
        rowHref && "cursor-pointer",
        "hover:-translate-y-0.5 hover:bg-primary/10 hover:shadow-lg",
        "hover:ring-2 hover:ring-primary/25 dark:hover:bg-primary/15",
        "active:translate-y-0 active:scale-[0.996]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      )}
    >
      {hasPinned && (
        <div className="flex items-start justify-between gap-3 p-3.5">
          {cardLeft.length > 0 && (
            <VStack spacing={1} className="min-w-0 flex-1">
              {cardLeft.map((column) => {
                const cell = cellMap[column.id];
                if (!cell) return null;
                return (
                  <div key={column.id} className="min-w-0 w-full">
                    {flexRender(column.columnDef.cell, cell.getContext())}
                  </div>
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

  if (!renderContextMenu) return cardContent;

  return (
    <Menu type="context">
      <ContextMenu>
        <ContextMenuTrigger asChild>{cardContent}</ContextMenuTrigger>
        <ContextMenuContent className="w-128">
          {renderContextMenu(row.original)}
        </ContextMenuContent>
      </ContextMenu>
    </Menu>
  );
}

export default TableCardRow;
