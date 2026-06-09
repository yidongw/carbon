import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Table as TableBase,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useEscape,
  useMount,
  VStack
} from "@carbon/react";
import { clamp } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useNumberFormatter } from "@react-aria/i18n";
import type {
  Column,
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  Table as ReactTable,
  RowData,
  RowSelectionState
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  LuArrowDown,
  LuArrowUp,
  LuArrowUpDown,
  LuChevronDown,
  LuChevronRight,
  LuHash,
  LuSigma,
  LuTrendingUpDown,
  LuTriangleAlert
} from "react-icons/lu";
import { useLocation, useNavigation } from "react-router";
import { useSpinDelay } from "spin-delay";
import type {
  EditableTableCellComponent,
  Position
} from "~/components/Editable";
import { useSavedViews } from "~/hooks/useSavedViews";
import type { fieldMappings } from "~/modules/shared";
import {
  IndeterminateCheckbox,
  Pagination,
  Row,
  RowActionMenu,
  TableCardRow,
  TableHeader,
  usePagination,
  useSort
} from "./components";
import type { ColumnFilter } from "./components/Filter/types";
import { useFilters } from "./components/Filter/useFilters";
import type { ColumnSizeMap } from "./types";
import { getAccessorKey, updateNestedProperty } from "./utils";

interface TableProps<T extends object> {
  columns: ColumnDef<T>[];
  count?: number;
  compact?: boolean;
  data: T[];
  defaultFeaturedColumns?: string[];
  defaultColumnOrder?: string[];
  defaultColumnPinning?: ColumnPinningState;
  defaultColumnVisibility?: Record<string, boolean>;
  editableComponents?: Record<string, EditableTableCellComponent<T>>;
  importCSV?: {
    table: keyof typeof fieldMappings;
    label: string;
  }[];
  primaryAction?: ReactNode;
  table?: string;
  title?: string;
  withInlineEditing?: boolean;
  withPagination?: boolean;
  withSavedView?: boolean;
  withSearch?: boolean;
  withSelectableRows?: boolean;
  withSimpleSorting?: boolean;
  onSelectedRowsChange?: (selectedRows: T[]) => void;
  renderActions?: (selectedRows: T[]) => ReactNode;
  renderContextMenu?: (row: T) => JSX.Element | null;
  renderExpandedRow?: (row: T) => ReactNode;
  getRowHref?: (row: T) => string | undefined;
  rowClassName?: (row: Row<T>) => string | undefined;
}

type AggregateFunction = "sum" | "average" | "min" | "max" | "median" | "count";

interface AggregateFunctionOption {
  value: AggregateFunction;
  label: string;
  icon: ReactElement;
}

const aggregateFunctions: AggregateFunctionOption[] = [
  { value: "sum", label: "Sum", icon: <LuSigma /> },
  { value: "average", label: "Average", icon: <LuTrendingUpDown /> },
  { value: "min", label: "Min", icon: <LuArrowDown /> },
  { value: "max", label: "Max", icon: <LuArrowUp /> },
  { value: "median", label: "Median", icon: <LuArrowUpDown /> },
  { value: "count", label: "Count", icon: <LuHash /> }
];

function numeric(v: unknown): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function aggregateForCol<TData extends RowData>(
  table: ReactTable<TData>,
  columnId: string,
  aggregateFn: AggregateFunction = "sum"
): number {
  const rows = table.getFilteredRowModel().rows;

  const values = rows
    .map((r) => numeric(r.getValue(columnId)))
    .filter((v): v is number => v !== null);

  if (!values.length) return 0;

  switch (aggregateFn) {
    case "sum":
      return values.reduce((a, b) => a + b, 0);
    case "average":
      return values.reduce((a, b) => a + b, 0) / values.length;
    case "min":
      return Math.min(...values);
    case "max":
      return Math.max(...values);
    case "median": {
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    }
    case "count":
      return values.length;
    default:
      return values.reduce((a, b) => a + b, 0);
  }
}

interface AggregateSelectorProps {
  value: number;
  aggregateFunction: AggregateFunction;
  onAggregateFunctionChange: (fn: AggregateFunction) => void;
  formatter?: (
    val: number | bigint | `${number}` | "Infinity" | "-Infinity" | "+Infinity"
  ) => string;
}

const AggregateSelector = ({
  value,
  aggregateFunction,
  onAggregateFunctionChange,
  formatter
}: AggregateSelectorProps) => {
  const numberFormatter = useNumberFormatter();
  const currentFunction = aggregateFunctions.find(
    (fn) => fn.value === aggregateFunction
  );

  const formattedValue =
    aggregateFunction === "count" || !formatter
      ? numberFormatter.format(value)
      : formatter(value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-start items-center gap-2 cursor-pointer">
          <span className="text-muted-foreground">{currentFunction?.icon}</span>
          <span className="font-medium">{formattedValue}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value={aggregateFunction}>
          {aggregateFunctions.map((fn) => (
            <DropdownMenuRadioItem
              key={fn.value}
              value={fn.value}
              onClick={() => onAggregateFunctionChange(fn.value)}
            >
              <DropdownMenuIcon icon={fn.icon} />
              {fn.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Table = <T extends object>({
  data,
  columns,
  compact = false,
  count = 0,
  defaultFeaturedColumns,
  defaultColumnOrder,
  defaultColumnPinning,
  defaultColumnVisibility,
  editableComponents,
  importCSV,
  primaryAction,
  table: tableName,
  title,
  withInlineEditing = false,
  withPagination = true,
  withSavedView = false,
  withSearch = true,
  withSelectableRows = false,
  withSimpleSorting = true,
  onSelectedRowsChange,
  renderActions,
  renderContextMenu,
  renderExpandedRow,
  getRowHref,
  rowClassName
}: TableProps<T>) => {
  const { i18n } = useLingui();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const translateLabel = useCallback((value: string) => i18n._(value), [i18n]);

  const { currentView, view } = useSavedViews();

  /* Expandable Rows */
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRowExpanded = useCallback((rowIndex: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
  }, []);

  /* Data for Optimistic Updates */
  const [internalData, setInternalData] = useState<T[]>(data);
  useEffect(() => {
    setInternalData(data);
  }, [data]);

  /* Clear row selection when data changes */
  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (withSelectableRows) {
      setRowSelection({});
    }
  }, [data.length, withSelectableRows]);

  /* Selectable Rows */
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  /* Pagination */
  const pagination = usePagination(count, setRowSelection);

  /* Column Visibility */
  const [columnVisibility, setColumnVisibility] = useState(
    currentView?.columnVisibility ?? defaultColumnVisibility ?? {}
  );

  /* Column Ordering */
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    currentView?.columnOrder ?? defaultColumnOrder ?? []
  );

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(() => {
    const left: string[] = [];
    const right: string[] = [];
    if (renderExpandedRow) {
      left.push("Expand");
    }
    if (withSelectableRows) {
      left.push("Select");
    }
    if (renderContextMenu) {
      right.push("Actions");
    }

    if (currentView?.columnPinning) {
      return currentView.columnPinning;
    }
    if (
      defaultColumnPinning &&
      "left" in defaultColumnPinning &&
      Array.isArray(defaultColumnPinning.left)
    ) {
      left.push(...defaultColumnPinning.left);
    }

    if (
      defaultColumnPinning &&
      "right" in defaultColumnPinning &&
      Array.isArray(defaultColumnPinning.right)
    ) {
      right.push(...defaultColumnPinning.right);
    }

    return {
      left,
      right
    };
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (currentView) {
      setColumnVisibility(currentView.columnVisibility);
      setColumnOrder(currentView.columnOrder);
      setColumnPinning(currentView.columnPinning);
    } else {
      setColumnVisibility(defaultColumnVisibility ?? {});
      setColumnOrder(defaultColumnOrder ?? []);
      setColumnPinning(() => {
        const left: string[] = [];
        const right: string[] = [];
        if (renderExpandedRow) {
          left.push("Expand");
        }
        if (withSelectableRows) {
          left.push("Select");
        }
        if (renderContextMenu) {
          right.push("Actions");
        }

        if (
          defaultColumnPinning &&
          "left" in defaultColumnPinning &&
          Array.isArray(defaultColumnPinning.left)
        ) {
          left.push(...defaultColumnPinning.left);
        }

        if (
          defaultColumnPinning &&
          "right" in defaultColumnPinning &&
          Array.isArray(defaultColumnPinning.right)
        ) {
          right.push(...defaultColumnPinning.right);
        }

        return {
          left,
          right
        };
      });
    }
  }, [view]);

  /* Featured Columns (card right) */
  const [featuredColumns, setFeaturedColumns] = useState<Set<string>>(
    () => new Set(defaultFeaturedColumns ?? [])
  );

  // Tracks the in-flight columnPinning.left so that multiple onReorder calls
  // within the same JS tick (framer-motion fires once per crossed boundary)
  // each build on the previous call's result rather than a stale closure.
  const pinnedLeftRef = useRef<string[]>(columnPinning.left ?? []);
  pinnedLeftRef.current = columnPinning.left ?? [];

  const handlePinnedReorder = useCallback((newUserLeft: string[]) => {
    const userSet = new Set(newUserLeft);
    const systemPinned = pinnedLeftRef.current.filter((id) => !userSet.has(id));
    const fullLeft = [...systemPinned, ...newUserLeft];
    pinnedLeftRef.current = fullLeft;
    setColumnPinning((prev) => ({ ...prev, left: fullLeft }));
  }, []);

  /* Sorting */
  const { isSorted, toggleSortByAscending, toggleSortByDescending } = useSort();

  const columnAccessors = useMemo(
    () =>
      columns.reduce<Record<string, string>>((acc, column) => {
        const accessorKey: string | undefined = getAccessorKey(column);
        if (accessorKey?.includes("_"))
          throw new Error(
            `Invalid accessorKey ${accessorKey}. Cannot contain '_'`
          );
        if (accessorKey && column.header && typeof column.header === "string") {
          return {
            ...acc,
            [accessorKey]: translateLabel(column.header)
          };
        }
        return acc;
      }, {}),
    [columns, translateLabel]
  );

  const internalColumns = useMemo(() => {
    let result: ColumnDef<T>[] = [];
    if (renderExpandedRow) {
      result.push(
        ...getExpandColumn<T>(expandedRows, toggleRowExpanded, translateLabel)
      );
    }
    if (withSelectableRows) {
      result.push(...getRowSelectionColumn<T>());
    }
    result.push(...columns);
    if (renderContextMenu) {
      result.push(...getActionColumn<T>(renderContextMenu, translateLabel));
    }
    return result;
  }, [
    columns,
    renderContextMenu,
    withSelectableRows,
    renderExpandedRow,
    expandedRows,
    toggleRowExpanded,
    translateLabel
  ]);

  const table = useReactTable({
    data: internalData,
    columns: internalColumns,
    state: {
      columnVisibility,
      columnOrder,
      columnPinning,
      rowSelection
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      // These are not part of the standard API, but are accessible via table.options.meta
      editableComponents,
      updateData: (rowIndex, updates) => {
        setInternalData((previousData) => {
          const newData = previousData.map((row, index) => {
            if (index === rowIndex) {
              return Object.entries(updates).reduce(
                (newRow, [columnId, value]) => {
                  if (columnId.includes("_") && !(columnId in newRow)) {
                    updateNestedProperty(newRow, columnId, value);
                    return newRow;
                  } else {
                    return {
                      ...newRow,
                      [columnId]: value
                    };
                  }
                },
                row
              );
            }
            return row;
          });

          return newData;
        });
      }
    }
  });

  const selectedRows = withSelectableRows
    ? table.getSelectedRowModel().flatRows.map((row) => row.original)
    : [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (typeof onSelectedRowsChange === "function") {
      onSelectedRowsChange(selectedRows);
    }
  }, [rowSelection, onSelectedRowsChange]);

  const [editMode, setEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCell, setSelectedCell] = useState<Position>(null);

  /* Aggregate Functions */
  const [columnAggregates, setColumnAggregates] = useState<
    Record<string, AggregateFunction>
  >({});

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  const focusOnSelectedCell = useCallback(() => {
    if (selectedCell == null) return;
    const cell = tableContainerRef.current?.querySelector(
      `[data-row="${selectedCell.row}"][data-column="${selectedCell.column}"]`
    ) as HTMLDivElement;
    if (cell) cell.focus();
  }, [selectedCell, tableContainerRef]);

  useEscape(() => {
    setIsEditing(false);
    focusOnSelectedCell();
  });

  const onSelectedCellChange = useCallback(
    (position: Position) => {
      if (
        selectedCell == null ||
        position == null ||
        selectedCell.row !== position?.row ||
        selectedCell.column !== position.column
      )
        setSelectedCell(position);
    },
    [selectedCell]
  );

  const isColumnEditable = useCallback(
    (selectedColumn: number) => {
      if (!withInlineEditing) return false;

      const tableColumns = [
        ...table.getLeftVisibleLeafColumns(),
        ...table.getCenterVisibleLeafColumns()
      ];

      const column =
        tableColumns[withSelectableRows ? selectedColumn + 1 : selectedColumn];
      if (!column) return false;

      const accessorKey = getAccessorKey(column.columnDef);
      return (
        accessorKey && editableComponents && accessorKey in editableComponents
      );
    },
    [table, editableComponents, withInlineEditing, withSelectableRows]
  );

  const onCellClick = useCallback(
    (row: number, column: number) => {
      // ignore row select checkbox column
      if (
        selectedCell?.row === row &&
        selectedCell?.column === column &&
        isColumnEditable(column)
      ) {
        setIsEditing(true);
        return;
      }
      // ignore row select checkbox column
      if (column === -1) return;
      setIsEditing(false);
      onSelectedCellChange({ row, column });
    },
    [selectedCell, isColumnEditable, onSelectedCellChange]
  );

  const onCellUpdate = useCallback(
    (rowIndex: number) => (updates: Record<string, unknown>) =>
      table.options.meta?.updateData
        ? table.options.meta?.updateData(rowIndex, updates)
        : undefined,
    [table]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!selectedCell) return;

      const { code, shiftKey } = event;

      const commandCodes: {
        [key: string]: [number, number];
      } = {
        Tab: [0, 1],
        Enter: [1, 0]
      };

      const navigationCodes: {
        [key: string]: [number, number];
      } = {
        ArrowRight: [0, 1],
        ArrowLeft: [0, -1],
        ArrowDown: [1, 0],
        ArrowUp: [-1, 0]
      };

      const lastRow = table.getRowModel().rows.length - 1;
      const lastColumn =
        table.getVisibleLeafColumns().length - 1 - (withSelectableRows ? 1 : 0);

      const navigate = (
        delta: [number, number],
        tabWrap = false
      ): [number, number] => {
        const x0 = selectedCell?.column || 0;
        const y0 = selectedCell?.row || 0;

        let x1 = x0 + delta[1];
        let y1 = y0 + delta[0];

        if (tabWrap) {
          if (delta[1] > 0) {
            // wrap to the next row if we're on the last column
            if (x1 > lastColumn) {
              x1 = 0;
              y1 += 1;
            }
            // don't wrap to the next row if we're on the last row
            if (y1 > lastRow) {
              x1 = x0;
              y1 = y0;
            }
          } else {
            // reverse tab wrap
            if (x1 < 0) {
              x1 = lastColumn;
              y1 -= 1;
            }

            if (y1 < 0) {
              x1 = x0;
              y1 = y0;
            }
          }
        } else {
          x1 = clamp(x1, 0, lastColumn);
        }

        y1 = clamp(y1, 0, lastRow);

        return [x1, y1];
      };

      if (code in commandCodes) {
        event.preventDefault();

        if (
          !isEditing &&
          code === "Enter" &&
          !shiftKey &&
          isColumnEditable(selectedCell.column)
        ) {
          setIsEditing(true);
          return;
        }

        let direction = commandCodes[code];
        if (shiftKey) direction = [-direction[0], -direction[1]];
        const [x1, y1] = navigate(direction, code === "Tab");
        setSelectedCell({
          row: y1,
          column: x1
        });
        if (isEditing) {
          setIsEditing(false);
        }
      } else if (code in navigationCodes) {
        // arrow key navigation should't work if we're editing
        if (isEditing) return;
        event.preventDefault();
        const [x1, y1] = navigate(navigationCodes[code], code === "Tab");
        setIsEditing(false);
        setSelectedCell({
          row: y1,
          column: x1
        });
        // any other key (besides shift) activates editing
        // if the column is editable and a cell is selected
      } else if (
        !["ShiftLeft", "ShiftRight"].includes(code) &&
        !isEditing &&
        selectedCell &&
        isColumnEditable(selectedCell.column)
      ) {
        setIsEditing(true);
      }
    },
    [
      isColumnEditable,
      isEditing,
      selectedCell,
      setSelectedCell,
      table,
      withSelectableRows
    ]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (selectedCell) setSelectedCell(null);
  }, [editMode, pagination.pageIndex, pagination.pageSize]);

  useMount(() => {
    setColumnOrder(table.getAllLeafColumns().map((column) => column.id));
  });

  const filters = useMemo(
    () =>
      columns.reduce<ColumnFilter[]>((acc, column) => {
        if (
          column.meta?.filter &&
          column.header &&
          typeof column.header === "string"
        ) {
          const filter: ColumnFilter = {
            accessorKey: getAccessorKey(column) ?? column.id!,
            header: column.header,
            pluralHeader: column.meta.pluralHeader,
            filter: column.meta.filter,
            icon: column.meta.icon
          };
          return [...acc, filter];
        }
        return acc;
      }, []),
    [columns]
  );

  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();

  const tableRef = useRef<HTMLTableElement>(null);

  // Getter for the nested table wrapper element
  const getTableWrapperEl = useCallback(
    () => tableRef.current?.parentElement as HTMLDivElement | undefined,
    []
  );
  const getHeaderElSelector = (id: string) => `#header-${id}`;

  const pinnedColumnsKey = visibleColumns.reduce<string>(
    (acc, col) => (col.getIsPinned() ? `${acc}:${col.id}` : acc),
    ""
  );
  const [columnSizeMap, setColumnSizeMap] = useState<ColumnSizeMap>(new Map());

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    const calculateColumnWidths = () => {
      const tableWrapperEl = getTableWrapperEl();
      // Skip if container has no width — DOM is not ready or table is hidden.
      // Writing all-zero widths would collapse every sticky column to left:0.
      if (!tableWrapperEl || tableWrapperEl.clientWidth === 0) return;

      const columnWidths: ColumnSizeMap = new Map();
      let leftPinnedWidth = 0;

      // First pass - calculate widths
      table.getHeaderGroups().forEach(({ headers }) => {
        headers.forEach((header) => {
          if (header.id.includes(">>")) return;
          const headerEl = tableWrapperEl.querySelector(
            getHeaderElSelector(header.id)
          );
          const width = headerEl?.clientWidth ?? 0;

          if (header.column.getIsPinned() === "left") {
            columnWidths.set(header.id, {
              width,
              startX: leftPinnedWidth
            });
            leftPinnedWidth += width;
          } else {
            columnWidths.set(header.id, {
              width,
              startX: 0 // Will be calculated in second pass
            });
          }
        });
      });

      // Second pass - calculate non-pinned positions
      let currentX = leftPinnedWidth;
      table.getHeaderGroups().forEach(({ headers }) => {
        headers.forEach((header) => {
          if (!header.column.getIsPinned()) {
            columnWidths.set(header.id, {
              width: columnWidths.get(header.id)?.width ?? 0,
              startX: currentX
            });
            currentX += columnWidths.get(header.id)?.width ?? 0;
          }
        });
      });

      setColumnSizeMap((previous) => {
        if (previous.size !== columnWidths.size) return columnWidths;
        for (const [id, size] of columnWidths) {
          const prev = previous.get(id);
          if (
            !prev ||
            Math.abs(prev.width - size.width) > 1 ||
            Math.abs(prev.startX - size.startX) > 1
          ) {
            return columnWidths;
          }
        }
        return previous;
      });
    };

    // Initial calculation
    calculateColumnWidths();

    // Debounce resize — immediate updates remount row menus (e.g. ActionMenu).
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const scheduleCalculate = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculateColumnWidths, 100);
    };

    const tableWrapper = getTableWrapperEl();
    if (tableWrapper) {
      const resizeObserver = new ResizeObserver(scheduleCalculate);
      resizeObserver.observe(tableWrapper);
      return () => {
        clearTimeout(resizeTimer);
        resizeObserver.disconnect();
      };
    }
  }, [
    getTableWrapperEl,
    table,
    visibleColumns,
    pinnedColumnsKey,
    columnOrder,
    withSelectableRows
  ]);
  // const lastLeftPinnedColumn = table
  //   .getLeftVisibleLeafColumns()
  //   .findLast((c) => c.getIsPinned() === "left");

  const getPinnedStyles = useCallback(
    (column: Column<T>): CSSProperties => {
      const isPinned = column.getIsPinned();
      if (!isPinned) return {};

      // Right-pinned user columns are card-only — no sticky on the desktop table.
      // Only system columns (Actions) remain sticky on the right.
      if (isPinned === "right" && column.id !== "Actions") return {};

      let startX = 0;
      if (isPinned === "left") {
        for (const id of columnPinning.left ?? []) {
          if (id === column.id) break;
          startX += columnSizeMap.get(id)?.width ?? 0;
        }
      }

      return {
        position: "sticky",
        left: isPinned === "left" ? startX : undefined,
        right: isPinned === "right" ? 0 : undefined,
        zIndex: 2,
        maxWidth: isPinned === "right" ? 60 : undefined
      };
    },
    [columnPinning.left, columnSizeMap]
  );

  const location = useLocation();
  const navigation = useNavigation();
  const { hasFilters, clearFilters } = useFilters();
  const isRevalidatingCurrentRoute = useSpinDelay(
    navigation.state === "loading" &&
      navigation.location?.pathname === location.pathname,
    { delay: 300 }
  );

  return (
    <VStack
      key={view ?? tableName ?? ""}
      spacing={0}
      className={cn(
        "h-full bg-card",
        !compact && "flex flex-col w-full px-0 md:px-4 lg:px-6"
      )}
    >
      <TableHeader
        featuredColumns={featuredColumns}
        columnAccessors={columnAccessors}
        columnOrder={columnOrder}
        columnPinning={columnPinning}
        columnVisibility={columnVisibility}
        columns={table.getAllLeafColumns()}
        compact={compact}
        data={data}
        editMode={editMode}
        filters={filters}
        importCSV={importCSV}
        pagination={pagination}
        primaryAction={primaryAction}
        renderActions={renderActions}
        selectedRows={selectedRows}
        setFeaturedColumns={setFeaturedColumns}
        onPinnedReorder={handlePinnedReorder}
        setColumnOrder={setColumnOrder}
        setEditMode={setEditMode}
        table={tableName}
        title={title}
        withInlineEditing={withInlineEditing}
        withPagination={withPagination}
        withSavedView={withSavedView}
        withSearch={withSearch}
        withSelectableRows={withSelectableRows}
      />

      {/* Mobile card view */}
      <div className="md:hidden w-full flex-1 min-h-0 overflow-y-auto">
        {rows.length === 0 ? (
          <div className="flex flex-col w-full h-full items-center justify-center gap-4 py-16">
            <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
              <LuTriangleAlert className="h-6 w-6 flex-shrink-0" />
            </div>
            <span className="text-xs font-mono font-light text-foreground uppercase">
              {hasFilters ? (
                <Trans>No results found</Trans>
              ) : (
                <Trans>No data exists</Trans>
              )}
            </span>
            {hasFilters ? (
              <Button variant="secondary" onClick={clearFilters}>
                <Trans>Remove Filters</Trans>
              </Button>
            ) : (
              primaryAction
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 px-3 py-2">
            {rows.map((row) => (
              <TableCardRow
                key={row.id}
                row={row}
                pinnedColumns={table.getLeftVisibleLeafColumns()}
                centerColumns={table.getCenterVisibleLeafColumns()}
                featuredColumns={featuredColumns}
                getRowHref={getRowHref}
                renderContextMenu={renderContextMenu}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop table view */}
      <div
        id="table-container"
        className={cn(
          // contain:inline-size caps this scroll container's width to the grid
          // track instead of letting the wide table expand the min-width:auto
          // flex/grid ancestor chain (which kills horizontal scrolling).
          "hidden md:block w-full h-full overflow-x-auto [contain:inline-size] [scrollbar-gutter:stable] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent"
        )}
        ref={tableContainerRef}
        onKeyDown={editMode ? onKeyDown : undefined}
      >
        <div className="flex max-w-full h-full">
          {rows.length === 0 ? (
            isRevalidatingCurrentRoute ? (
              <div className="flex h-full w-full items-start justify-center">
                <TableBase full className="w-full">
                  <Thead>
                    <Tr>
                      {Array.from({ length: 7 }).map((_, colIndex) => (
                        <Th
                          key={colIndex}
                          className={cn(
                            "h-[44px] w-[200px] bg-card",
                            colIndex === 0 && "border-r border-border"
                          )}
                        >
                          <div className="h-8" />
                        </Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Array.from({ length: 30 }).map((_, rowIndex) => (
                      <Tr key={rowIndex}>
                        {Array.from({ length: 7 }).map((_, colIndex) => (
                          <Td
                            key={colIndex}
                            className={cn(
                              "h-[44px] w-[200px]",
                              colIndex === 0 && "border-r border-border"
                            )}
                          >
                            <div className="h-6 w-full bg-gradient-to-r from-foreground/10 to-foreground/10 rounded animate-pulse" />
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </Tbody>
                </TableBase>
              </div>
            ) : hasFilters ? (
              <div className="flex flex-col w-full h-full items-center justify-center gap-4">
                <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background -mt-[10dvh]">
                  <LuTriangleAlert className="h-6 w-6 flex-shrink-0" />
                </div>
                <span className="text-xs font-mono font-light text-foreground uppercase">
                  <Trans>No results found</Trans>
                </span>
                <Button variant="secondary" onClick={clearFilters}>
                  <Trans>Remove Filters</Trans>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col w-full h-full items-center justify-center gap-4">
                <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background -mt-[10dvh]">
                  <LuTriangleAlert className="h-6 w-6 flex-shrink-0" />
                </div>
                <span className="text-xs font-mono font-light text-foreground uppercase">
                  <Trans>No data exists</Trans>
                </span>
                {primaryAction}
              </div>
            )
          ) : (
            <TableBase
              ref={tableRef}
              full
              className="relative border-collapse border-spacing-0"
            >
              <Thead className="sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id} className="h-10">
                    {headerGroup.headers.map((header) => {
                      const accessorKey = getAccessorKey(
                        header.column.columnDef
                      );

                      const sortable =
                        withSimpleSorting &&
                        accessorKey &&
                        !accessorKey.endsWith(".id") &&
                        header.column.columnDef.enableSorting !== false;
                      const sorted = isSorted(accessorKey ?? "");

                      return (
                        <Th
                          key={header.id}
                          colSpan={header.colSpan}
                          id={`header-${header.id}`}
                          className={cn(
                            "px-4 py-3 whitespace-nowrap bg-card",
                            editMode && "border-r-1 border-border",
                            sortable && "cursor-pointer"
                          )}
                          style={{
                            ...getPinnedStyles(header.column),
                            width: header.getSize()
                          }}
                        >
                          {!header.isPlaceholder &&
                            (sortable ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <div className="flex justify-start items-center gap-2">
                                    {header.column.columnDef.meta?.icon}
                                    {typeof header.column.columnDef.header ===
                                    "string"
                                      ? translateLabel(
                                          header.column.columnDef.header
                                        )
                                      : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                    <span>
                                      {sorted ? (
                                        sorted === -1 ? (
                                          <LuArrowDown
                                            aria-label="sorted descending"
                                            className="text-primary"
                                          />
                                        ) : (
                                          <LuArrowUp
                                            aria-label="sorted ascending"
                                            className="text-primary"
                                          />
                                        )
                                      ) : null}
                                    </span>
                                  </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuRadioGroup
                                    value={sorted?.toString()}
                                  >
                                    <DropdownMenuRadioItem
                                      onClick={() =>
                                        toggleSortByAscending(accessorKey!)
                                      }
                                      value="1"
                                    >
                                      <DropdownMenuIcon icon={<LuArrowUp />} />
                                      <Trans>Sort Ascending</Trans>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem
                                      onClick={() =>
                                        toggleSortByDescending(accessorKey!)
                                      }
                                      value="-1"
                                    >
                                      <DropdownMenuIcon
                                        icon={<LuArrowDown />}
                                      />
                                      <Trans>Sort Descending</Trans>
                                    </DropdownMenuRadioItem>
                                  </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              <div className="flex justify-start items-center gap-2">
                                {header.column.columnDef.meta?.icon}
                                {typeof header.column.columnDef.header ===
                                "string"
                                  ? translateLabel(
                                      header.column.columnDef.header
                                    )
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </div>
                            ))}
                        </Th>
                      );
                    })}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {rows.map((row) => {
                  const isRowExpanded =
                    renderExpandedRow && expandedRows[row.index];
                  const handleRowClick = renderExpandedRow
                    ? () => toggleRowExpanded(row.index)
                    : undefined;
                  // Desktop rows use the Actions column ActionMenu (dropdown) only.
                  // Do not wrap the row in ContextMenu — nesting dropdown inside
                  // ContextMenuTrigger causes the menu to flash closed on open.
                  const rowContent = (
                    <Row
                      key={row.id}
                      editableComponents={editableComponents}
                      isEditing={isEditing}
                      isEditMode={editMode}
                      isRowSelected={
                        row.index in rowSelection && !!rowSelection[row.index]
                      }
                      pinnedColumns={pinnedColumnsKey}
                      selectedCell={selectedCell}
                      row={row}
                      rowIsSelected={selectedCell?.row === row.index}
                      getPinnedStyles={getPinnedStyles}
                      onCellClick={onCellClick}
                      onCellUpdate={onCellUpdate}
                      onClick={handleRowClick}
                      className={cn(
                        renderExpandedRow ? "cursor-pointer" : undefined,
                        rowClassName?.(row)
                      ) || undefined}
                    />
                  );

                  return (
                    <Fragment key={row.id}>
                      {rowContent}
                      {isRowExpanded && (
                        <Tr>
                          <Td
                            colSpan={visibleColumns.length}
                            className="p-0 bg-muted/20 border-b border-border"
                          >
                            {renderExpandedRow(row.original)}
                          </Td>
                        </Tr>
                      )}
                    </Fragment>
                  );
                })}
                {table.getFooterGroups().map((footerGroup) => (
                  <Tr key={footerGroup.id} className="h-10">
                    {footerGroup.headers.map((footer) => {
                      const aggregateFn =
                        columnAggregates[footer.column.id] ?? "sum";
                      const total = aggregateForCol(
                        table,
                        footer.column.id,
                        aggregateFn
                      );
                      return (
                        <Th
                          key={footer.id}
                          colSpan={footer.colSpan}
                          id={`header-${footer.id}`}
                          className={cn(
                            "px-4 py-3 whitespace-nowrap bg-card",
                            editMode && "border-r-1 border-border"
                          )}
                          style={{
                            ...getPinnedStyles(footer.column),
                            width: footer.getSize()
                          }}
                        >
                          {!footer.isPlaceholder &&
                            footer.column.columnDef.meta?.renderTotal && (
                              <AggregateSelector
                                value={total}
                                aggregateFunction={aggregateFn}
                                onAggregateFunctionChange={(fn) => {
                                  setColumnAggregates((prev) => ({
                                    ...prev,
                                    [footer.column.id]: fn
                                  }));
                                }}
                                formatter={
                                  footer.column.columnDef.meta?.formatter
                                }
                              />
                            )}
                        </Th>
                      );
                    })}
                  </Tr>
                ))}
              </Tbody>
            </TableBase>
          )}
        </div>
      </div>
      {withPagination && <Pagination {...pagination} />}
    </VStack>
  );
};

function getRowSelectionColumn<T>(): ColumnDef<T>[] {
  return [
    {
      id: "Select",
      size: 50,
      enablePinning: true,
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler()
          }}
        />
      ),
      cell: ({ row }) => (
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler()
          }}
        />
      )
    }
  ];
}

function getActionColumn<T>(
  renderContextMenu: (item: T) => JSX.Element | null,
  translateLabel: (value: string) => string
): ColumnDef<T>[] {
  return [
    {
      id: "Actions",
      header: () => (
        <span className="sr-only">{translateLabel("Actions")}</span>
      ),
      cell: ({ row }) => (
        <RowActionMenu
          rowKey={row.id}
          row={row.original}
          renderContextMenu={renderContextMenu}
        />
      ),
      size: 60,
      meta: {
        cellClassName: "transition-none"
      }
    }
  ];
}

function getExpandColumn<T>(
  expandedRows: Record<number, boolean>,
  toggleRowExpanded: (rowIndex: number) => void,
  translateLabel: (value: string) => string
): ColumnDef<T>[] {
  return [
    {
      id: "Expand",
      size: 40,
      enablePinning: true,
      header: () => <span className="sr-only">{translateLabel("Expand")}</span>,
      cell: ({ row }) => {
        const isExpanded = expandedRows[row.index] ?? false;
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleRowExpanded(row.index);
            }}
            className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
            aria-label={
              isExpanded
                ? translateLabel("Collapse row")
                : translateLabel("Expand row")
            }
          >
            {isExpanded ? (
              <LuChevronDown className="size-4" />
            ) : (
              <LuChevronRight className="size-4" />
            )}
          </button>
        );
      }
    }
  ];
}

export default Table;
