"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_table_1 = require("@tanstack/react-table");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var spin_delay_1 = require("spin-delay");
var useSavedViews_1 = require("~/hooks/useSavedViews");
var components_1 = require("./components");
var useFilters_1 = require("./components/Filter/useFilters");
var utils_2 = require("./utils");
var aggregateFunctions = [
    { value: "sum", label: "Sum", icon: <lu_1.LuSigma /> },
    { value: "average", label: "Average", icon: <lu_1.LuTrendingUpDown /> },
    { value: "min", label: "Min", icon: <lu_1.LuArrowDown /> },
    { value: "max", label: "Max", icon: <lu_1.LuArrowUp /> },
    { value: "median", label: "Median", icon: <lu_1.LuArrowUpDown /> },
    { value: "count", label: "Count", icon: <lu_1.LuHash /> }
];
function numeric(v) {
    if (v == null)
        return null;
    var n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
}
function aggregateForCol(table, columnId, aggregateFn) {
    if (aggregateFn === void 0) { aggregateFn = "sum"; }
    var rows = table.getFilteredRowModel().rows;
    var values = rows
        .map(function (r) { return numeric(r.getValue(columnId)); })
        .filter(function (v) { return v !== null; });
    if (!values.length)
        return 0;
    switch (aggregateFn) {
        case "sum":
            return values.reduce(function (a, b) { return a + b; }, 0);
        case "average":
            return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
        case "min":
            return Math.min.apply(Math, values);
        case "max":
            return Math.max.apply(Math, values);
        case "median": {
            var sorted = __spreadArray([], values, true).sort(function (a, b) { return a - b; });
            var mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 === 0
                ? (sorted[mid - 1] + sorted[mid]) / 2
                : sorted[mid];
        }
        case "count":
            return values.length;
        default:
            return values.reduce(function (a, b) { return a + b; }, 0);
    }
}
var AggregateSelector = function (_a) {
    var value = _a.value, aggregateFunction = _a.aggregateFunction, onAggregateFunctionChange = _a.onAggregateFunctionChange, formatter = _a.formatter;
    var numberFormatter = (0, i18n_1.useNumberFormatter)();
    var currentFunction = aggregateFunctions.find(function (fn) { return fn.value === aggregateFunction; });
    var formattedValue = aggregateFunction === "count" || !formatter
        ? numberFormatter.format(value)
        : formatter(value);
    return (<react_1.DropdownMenu>
      <react_1.DropdownMenuTrigger asChild>
        <div className="flex justify-start items-center gap-2 cursor-pointer">
          <span className="text-muted-foreground">{currentFunction === null || currentFunction === void 0 ? void 0 : currentFunction.icon}</span>
          <span className="font-medium">{formattedValue}</span>
        </div>
      </react_1.DropdownMenuTrigger>
      <react_1.DropdownMenuContent align="start">
        <react_1.DropdownMenuRadioGroup value={aggregateFunction}>
          {aggregateFunctions.map(function (fn) { return (<react_1.DropdownMenuRadioItem key={fn.value} value={fn.value} onClick={function () { return onAggregateFunctionChange(fn.value); }}>
              <react_1.DropdownMenuIcon icon={fn.icon}/>
              {fn.label}
            </react_1.DropdownMenuRadioItem>); })}
        </react_1.DropdownMenuRadioGroup>
      </react_1.DropdownMenuContent>
    </react_1.DropdownMenu>);
};
var Table = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var data = _a.data, columns = _a.columns, _k = _a.compact, compact = _k === void 0 ? false : _k, _l = _a.count, count = _l === void 0 ? 0 : _l, defaultFeaturedColumns = _a.defaultFeaturedColumns, defaultColumnOrder = _a.defaultColumnOrder, defaultColumnPinning = _a.defaultColumnPinning, defaultColumnVisibility = _a.defaultColumnVisibility, editableComponents = _a.editableComponents, importCSV = _a.importCSV, primaryAction = _a.primaryAction, filterActions = _a.filterActions, tableName = _a.table, title = _a.title, _m = _a.withHeader, withHeader = _m === void 0 ? true : _m, _o = _a.withInlineEditing, withInlineEditing = _o === void 0 ? false : _o, _p = _a.withPagination, withPagination = _p === void 0 ? true : _p, _q = _a.withSavedView, withSavedView = _q === void 0 ? false : _q, _r = _a.withSearch, withSearch = _r === void 0 ? true : _r, _s = _a.withSelectableRows, withSelectableRows = _s === void 0 ? false : _s, _t = _a.withSimpleSorting, withSimpleSorting = _t === void 0 ? true : _t, sort = _a.sort, getRowId = _a.getRowId, controlledRowSelection = _a.rowSelection, onRowSelectionChange = _a.onRowSelectionChange, onSelectedRowsChange = _a.onSelectedRowsChange, renderActions = _a.renderActions, renderContextMenu = _a.renderContextMenu, renderExpandedRow = _a.renderExpandedRow, getRowCanExpand = _a.getRowCanExpand, getRowHref = _a.getRowHref;
    var _u = (0, macro_1.useLingui)(), i18n = _u.i18n, t = _u.t;
    var tableContainerRef = (0, react_2.useRef)(null);
    var translateLabel = (0, react_2.useCallback)(function (value) { return i18n._(value); }, [i18n]);
    var _v = (0, useSavedViews_1.useSavedViews)(), currentView = _v.currentView, view = _v.view;
    /* Expandable Rows */
    var _w = (0, react_2.useState)({}), expandedRows = _w[0], setExpandedRows = _w[1];
    var toggleRowExpanded = (0, react_2.useCallback)(function (rowIndex) {
        setExpandedRows(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[rowIndex] = !prev[rowIndex], _a)));
        });
    }, []);
    /* Data for Optimistic Updates */
    var _x = (0, react_2.useState)(data), internalData = _x[0], setInternalData = _x[1];
    (0, react_2.useEffect)(function () {
        setInternalData(data);
    }, [data]);
    /* Selectable Rows */
    var _y = (0, react_2.useState)({}), internalRowSelection = _y[0], setInternalRowSelection = _y[1];
    var isSelectionControlled = controlledRowSelection !== undefined;
    var rowSelection = isSelectionControlled
        ? controlledRowSelection
        : internalRowSelection;
    var setRowSelection = onRowSelectionChange !== null && onRowSelectionChange !== void 0 ? onRowSelectionChange : setInternalRowSelection;
    /* Clear row selection when data changes. Skip when rows have stable ids
       (getRowId) or selection is controlled — the selection survives data
       reshapes like tree expansion in those cases. */
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (withSelectableRows && !getRowId && !isSelectionControlled) {
            setRowSelection({});
        }
    }, [data.length, withSelectableRows]);
    /* Pagination */
    var pagination = (0, components_1.usePagination)(count, setRowSelection);
    /* Column Visibility */
    var _z = (0, react_2.useState)((_c = (_b = currentView === null || currentView === void 0 ? void 0 : currentView.columnVisibility) !== null && _b !== void 0 ? _b : defaultColumnVisibility) !== null && _c !== void 0 ? _c : {}), columnVisibility = _z[0], setColumnVisibility = _z[1];
    /* Column Ordering */
    var _0 = (0, react_2.useState)((_e = (_d = currentView === null || currentView === void 0 ? void 0 : currentView.columnOrder) !== null && _d !== void 0 ? _d : defaultColumnOrder) !== null && _e !== void 0 ? _e : []), columnOrder = _0[0], setColumnOrder = _0[1];
    var _1 = (0, react_2.useState)(function () {
        var left = [];
        var right = [];
        if (renderExpandedRow) {
            left.push("Expand");
        }
        if (withSelectableRows) {
            left.push("Select");
        }
        if (renderContextMenu) {
            right.push("Actions");
        }
        if (currentView === null || currentView === void 0 ? void 0 : currentView.columnPinning) {
            return currentView.columnPinning;
        }
        if (defaultColumnPinning &&
            "left" in defaultColumnPinning &&
            Array.isArray(defaultColumnPinning.left)) {
            left.push.apply(left, defaultColumnPinning.left);
        }
        if (defaultColumnPinning &&
            "right" in defaultColumnPinning &&
            Array.isArray(defaultColumnPinning.right)) {
            right.push.apply(right, defaultColumnPinning.right);
        }
        return {
            left: left,
            right: right
        };
    }), columnPinning = _1[0], setColumnPinning = _1[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (currentView) {
            setColumnVisibility(currentView.columnVisibility);
            setColumnOrder(currentView.columnOrder);
            setColumnPinning(currentView.columnPinning);
        }
        else {
            setColumnVisibility(defaultColumnVisibility !== null && defaultColumnVisibility !== void 0 ? defaultColumnVisibility : {});
            setColumnOrder(defaultColumnOrder !== null && defaultColumnOrder !== void 0 ? defaultColumnOrder : []);
            setColumnPinning(function () {
                var left = [];
                var right = [];
                if (renderExpandedRow) {
                    left.push("Expand");
                }
                if (withSelectableRows) {
                    left.push("Select");
                }
                if (renderContextMenu) {
                    right.push("Actions");
                }
                if (defaultColumnPinning &&
                    "left" in defaultColumnPinning &&
                    Array.isArray(defaultColumnPinning.left)) {
                    left.push.apply(left, defaultColumnPinning.left);
                }
                if (defaultColumnPinning &&
                    "right" in defaultColumnPinning &&
                    Array.isArray(defaultColumnPinning.right)) {
                    right.push.apply(right, defaultColumnPinning.right);
                }
                return {
                    left: left,
                    right: right
                };
            });
        }
    }, [view]);
    /* Featured Columns (card right) */
    var _2 = (0, react_2.useState)(function () { return new Set(defaultFeaturedColumns !== null && defaultFeaturedColumns !== void 0 ? defaultFeaturedColumns : []); }), featuredColumns = _2[0], setFeaturedColumns = _2[1];
    // Tracks the in-flight columnPinning.left so that multiple onReorder calls
    // within the same JS tick (framer-motion fires once per crossed boundary)
    // each build on the previous call's result rather than a stale closure.
    var pinnedLeftRef = (0, react_2.useRef)((_f = columnPinning.left) !== null && _f !== void 0 ? _f : []);
    pinnedLeftRef.current = (_g = columnPinning.left) !== null && _g !== void 0 ? _g : [];
    var handlePinnedReorder = (0, react_2.useCallback)(function (newUserLeft) {
        var userSet = new Set(newUserLeft);
        var systemPinned = pinnedLeftRef.current.filter(function (id) { return !userSet.has(id); });
        var fullLeft = __spreadArray(__spreadArray([], systemPinned, true), newUserLeft, true);
        pinnedLeftRef.current = fullLeft;
        setColumnPinning(function (prev) { return (__assign(__assign({}, prev), { left: fullLeft })); });
    }, []);
    /* Sorting */
    var _3 = (0, components_1.useSort)(), isSorted = _3.isSorted, toggleSortByAscending = _3.toggleSortByAscending, toggleSortByDescending = _3.toggleSortByDescending;
    var columnAccessors = (0, react_2.useMemo)(function () {
        return columns.reduce(function (acc, column) {
            var _a;
            var accessorKey = (0, utils_2.getAccessorKey)(column);
            if (accessorKey === null || accessorKey === void 0 ? void 0 : accessorKey.includes("_"))
                throw new Error("Invalid accessorKey ".concat(accessorKey, ". Cannot contain '_'"));
            if (accessorKey && column.header && typeof column.header === "string") {
                return __assign(__assign({}, acc), (_a = {}, _a[accessorKey] = translateLabel(column.header), _a));
            }
            return acc;
        }, {});
    }, [columns, translateLabel]);
    var internalColumns = (0, react_2.useMemo)(function () {
        var result = [];
        if (renderExpandedRow) {
            result.push.apply(result, getExpandColumn(expandedRows, toggleRowExpanded, translateLabel, getRowCanExpand));
        }
        if (withSelectableRows) {
            result.push.apply(result, getRowSelectionColumn());
        }
        result.push.apply(result, columns);
        if (renderContextMenu) {
            result.push.apply(result, getActionColumn(renderContextMenu, translateLabel));
        }
        return result;
    }, [
        columns,
        renderContextMenu,
        withSelectableRows,
        renderExpandedRow,
        getRowCanExpand,
        expandedRows,
        toggleRowExpanded,
        translateLabel
    ]);
    var table = (0, react_table_1.useReactTable)({
        data: internalData,
        columns: internalColumns,
        getRowId: function (row, index) {
            if (row && typeof row === "object" && "id" in row && row.id != null) {
                return String(row.id);
            }
            return String(index);
        },
        state: {
            columnVisibility: columnVisibility,
            columnOrder: columnOrder,
            columnPinning: columnPinning,
            rowSelection: rowSelection
        },
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
        onColumnPinningChange: setColumnPinning,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        meta: {
            // These are not part of the standard API, but are accessible via table.options.meta
            expandedRows: expandedRows,
            editableComponents: editableComponents,
            updateData: function (rowIndex, updates) {
                setInternalData(function (previousData) {
                    var newData = previousData.map(function (row, index) {
                        if (index === rowIndex) {
                            return Object.entries(updates).reduce(function (newRow, _a) {
                                var _b;
                                var columnId = _a[0], value = _a[1];
                                if (columnId.includes("_") && !(columnId in newRow)) {
                                    (0, utils_2.updateNestedProperty)(newRow, columnId, value);
                                    return newRow;
                                }
                                else {
                                    return __assign(__assign({}, newRow), (_b = {}, _b[columnId] = value, _b));
                                }
                            }, row);
                        }
                        return row;
                    });
                    return newData;
                });
            }
        }
    });
    var selectedRows = withSelectableRows
        ? table.getSelectedRowModel().flatRows.map(function (row) { return row.original; })
        : [];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (typeof onSelectedRowsChange === "function") {
            onSelectedRowsChange(selectedRows);
        }
    }, [rowSelection, onSelectedRowsChange]);
    var _4 = (0, react_2.useState)(false), editMode = _4[0], setEditMode = _4[1];
    var _5 = (0, react_2.useState)(false), isEditing = _5[0], setIsEditing = _5[1];
    var _6 = (0, react_2.useState)(null), selectedCell = _6[0], setSelectedCell = _6[1];
    /* Aggregate Functions */
    var _7 = (0, react_2.useState)({}), columnAggregates = _7[0], setColumnAggregates = _7[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var focusOnSelectedCell = (0, react_2.useCallback)(function () {
        var _a;
        if (selectedCell == null)
            return;
        var cell = (_a = tableContainerRef.current) === null || _a === void 0 ? void 0 : _a.querySelector("[data-row=\"".concat(selectedCell.row, "\"][data-column=\"").concat(selectedCell.column, "\"]"));
        if (cell)
            cell.focus();
    }, [selectedCell, tableContainerRef]);
    (0, react_1.useEscape)(function () {
        setIsEditing(false);
        focusOnSelectedCell();
    });
    var onSelectedCellChange = (0, react_2.useCallback)(function (position) {
        if (selectedCell == null ||
            position == null ||
            selectedCell.row !== (position === null || position === void 0 ? void 0 : position.row) ||
            selectedCell.column !== position.column)
            setSelectedCell(position);
    }, [selectedCell]);
    var isColumnEditable = (0, react_2.useCallback)(function (selectedColumn) {
        if (!withInlineEditing)
            return false;
        var tableColumns = __spreadArray(__spreadArray([], table.getLeftVisibleLeafColumns(), true), table.getCenterVisibleLeafColumns(), true);
        // `selectedColumn` is the index into the row's visible cells, which already
        // includes the (left-pinned) Select checkbox column. `tableColumns` is built
        // the same way (left-pinned first), so the two indices line up directly — no
        // offset for withSelectableRows.
        var column = tableColumns[selectedColumn];
        if (!column)
            return false;
        var accessorKey = (0, utils_2.getAccessorKey)(column.columnDef);
        return (accessorKey && editableComponents && accessorKey in editableComponents);
    }, [table, editableComponents, withInlineEditing]);
    var onCellClick = (0, react_2.useCallback)(function (row, column) {
        // ignore row select checkbox column
        if (column === -1)
            return;
        if ((selectedCell === null || selectedCell === void 0 ? void 0 : selectedCell.row) === row &&
            (selectedCell === null || selectedCell === void 0 ? void 0 : selectedCell.column) === column &&
            isColumnEditable(column)) {
            setIsEditing(true);
            return;
        }
        setIsEditing(false);
        onSelectedCellChange({ row: row, column: column });
    }, [selectedCell, isColumnEditable, onSelectedCellChange]);
    var finishEditing = (0, react_2.useCallback)(function () { return setIsEditing(false); }, []);
    var onCellUpdate = (0, react_2.useCallback)(function (rowIndex) { return function (updates) {
        var _a, _b;
        return ((_a = table.options.meta) === null || _a === void 0 ? void 0 : _a.updateData)
            ? (_b = table.options.meta) === null || _b === void 0 ? void 0 : _b.updateData(rowIndex, updates)
            : undefined;
    }; }, [table]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onKeyDown = (0, react_2.useCallback)(function (event) {
        if (!selectedCell)
            return;
        var code = event.code, shiftKey = event.shiftKey;
        var commandCodes = {
            Tab: [0, 1],
            Enter: [1, 0]
        };
        var navigationCodes = {
            ArrowRight: [0, 1],
            ArrowLeft: [0, -1],
            ArrowDown: [1, 0],
            ArrowUp: [-1, 0]
        };
        var lastRow = table.getRowModel().rows.length - 1;
        var lastColumn = table.getVisibleLeafColumns().length - 1 - (withSelectableRows ? 1 : 0);
        var navigate = function (delta, tabWrap) {
            if (tabWrap === void 0) { tabWrap = false; }
            var x0 = (selectedCell === null || selectedCell === void 0 ? void 0 : selectedCell.column) || 0;
            var y0 = (selectedCell === null || selectedCell === void 0 ? void 0 : selectedCell.row) || 0;
            var x1 = x0 + delta[1];
            var y1 = y0 + delta[0];
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
                }
                else {
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
            }
            else {
                x1 = (0, utils_1.clamp)(x1, 0, lastColumn);
            }
            y1 = (0, utils_1.clamp)(y1, 0, lastRow);
            return [x1, y1];
        };
        if (code in commandCodes) {
            event.preventDefault();
            if (!isEditing &&
                code === "Enter" &&
                !shiftKey &&
                isColumnEditable(selectedCell.column)) {
                setIsEditing(true);
                return;
            }
            var direction = commandCodes[code];
            if (shiftKey)
                direction = [-direction[0], -direction[1]];
            var _a = navigate(direction, code === "Tab"), x1 = _a[0], y1 = _a[1];
            setSelectedCell({
                row: y1,
                column: x1
            });
            if (isEditing) {
                setIsEditing(false);
            }
        }
        else if (code in navigationCodes) {
            // arrow key navigation should't work if we're editing
            if (isEditing)
                return;
            event.preventDefault();
            var _b = navigate(navigationCodes[code], code === "Tab"), x1 = _b[0], y1 = _b[1];
            setIsEditing(false);
            setSelectedCell({
                row: y1,
                column: x1
            });
            // any other key (besides shift) activates editing
            // if the column is editable and a cell is selected
        }
        else if (!["ShiftLeft", "ShiftRight"].includes(code) &&
            !isEditing &&
            selectedCell &&
            isColumnEditable(selectedCell.column)) {
            setIsEditing(true);
        }
    }, [
        isColumnEditable,
        isEditing,
        selectedCell,
        setSelectedCell,
        table,
        withSelectableRows
    ]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (selectedCell)
            setSelectedCell(null);
    }, [editMode, pagination.pageIndex, pagination.pageSize]);
    (0, react_1.useMount)(function () {
        setColumnOrder(table.getAllLeafColumns().map(function (column) { return column.id; }));
    });
    var filters = (0, react_2.useMemo)(function () {
        return columns.reduce(function (acc, column) {
            var _a, _b;
            if (((_a = column.meta) === null || _a === void 0 ? void 0 : _a.filter) &&
                column.header &&
                typeof column.header === "string") {
                var filter = {
                    accessorKey: (_b = (0, utils_2.getAccessorKey)(column)) !== null && _b !== void 0 ? _b : column.id,
                    header: column.header,
                    pluralHeader: column.meta.pluralHeader,
                    filter: column.meta.filter,
                    icon: column.meta.icon
                };
                return __spreadArray(__spreadArray([], acc, true), [filter], false);
            }
            return acc;
        }, []);
    }, [columns]);
    var rows = table.getRowModel().rows;
    var visibleColumns = table.getVisibleLeafColumns();
    var tableRef = (0, react_2.useRef)(null);
    // Getter for the nested table wrapper element
    var getTableWrapperEl = (0, react_2.useCallback)(function () { var _a; return (_a = tableRef.current) === null || _a === void 0 ? void 0 : _a.parentElement; }, []);
    var getHeaderElSelector = function (id) { return "#header-".concat(id); };
    var pinnedColumnsKey = visibleColumns.reduce(function (acc, col) { return (col.getIsPinned() ? "".concat(acc, ":").concat(col.id) : acc); }, "");
    var _8 = (0, react_2.useState)(new Map()), columnSizeMap = _8[0], setColumnSizeMap = _8[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var calculateColumnWidths = function () {
            var tableWrapperEl = getTableWrapperEl();
            // Skip if container has no width — DOM is not ready or table is hidden.
            // Writing all-zero widths would collapse every sticky column to left:0.
            if (!tableWrapperEl || tableWrapperEl.clientWidth === 0)
                return;
            var columnWidths = new Map();
            var leftPinnedWidth = 0;
            // First pass - calculate widths
            table.getHeaderGroups().forEach(function (_a) {
                var headers = _a.headers;
                headers.forEach(function (header) {
                    var _a;
                    if (header.id.includes(">>"))
                        return;
                    var headerEl = tableWrapperEl.querySelector(getHeaderElSelector(header.id));
                    var width = (_a = headerEl === null || headerEl === void 0 ? void 0 : headerEl.clientWidth) !== null && _a !== void 0 ? _a : 0;
                    if (header.column.getIsPinned() === "left") {
                        columnWidths.set(header.id, {
                            width: width,
                            startX: leftPinnedWidth
                        });
                        leftPinnedWidth += width;
                    }
                    else {
                        columnWidths.set(header.id, {
                            width: width,
                            startX: 0 // Will be calculated in second pass
                        });
                    }
                });
            });
            // Second pass - calculate non-pinned positions
            var currentX = leftPinnedWidth;
            table.getHeaderGroups().forEach(function (_a) {
                var headers = _a.headers;
                headers.forEach(function (header) {
                    var _a, _b, _c, _d;
                    if (!header.column.getIsPinned()) {
                        columnWidths.set(header.id, {
                            width: (_b = (_a = columnWidths.get(header.id)) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0,
                            startX: currentX
                        });
                        currentX += (_d = (_c = columnWidths.get(header.id)) === null || _c === void 0 ? void 0 : _c.width) !== null && _d !== void 0 ? _d : 0;
                    }
                });
            });
            setColumnSizeMap(function (previous) {
                if (previous.size !== columnWidths.size)
                    return columnWidths;
                for (var _i = 0, columnWidths_1 = columnWidths; _i < columnWidths_1.length; _i++) {
                    var _a = columnWidths_1[_i], id = _a[0], size = _a[1];
                    var prev = previous.get(id);
                    if (!prev ||
                        Math.abs(prev.width - size.width) > 1 ||
                        Math.abs(prev.startX - size.startX) > 1) {
                        return columnWidths;
                    }
                }
                return previous;
            });
        };
        // Initial calculation
        calculateColumnWidths();
        // Debounce resize — immediate updates remount row menus (e.g. ActionMenu).
        var resizeTimer;
        var scheduleCalculate = function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(calculateColumnWidths, 100);
        };
        var tableWrapper = getTableWrapperEl();
        if (tableWrapper) {
            var resizeObserver_1 = new ResizeObserver(scheduleCalculate);
            resizeObserver_1.observe(tableWrapper);
            // Also observe the table itself: internal layout changes (e.g. tree
            // expansion adding rows/widening columns) resize the table without
            // resizing the wrapper, which would leave pinned offsets stale.
            if (tableRef.current) {
                resizeObserver_1.observe(tableRef.current);
            }
            return function () {
                clearTimeout(resizeTimer);
                resizeObserver_1.disconnect();
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
    var getPinnedStyles = (0, react_2.useCallback)(function (column) {
        var _a, _b, _c;
        var isPinned = column.getIsPinned();
        if (!isPinned)
            return {};
        // Right-pinned user columns are card-only — no sticky on the desktop table.
        // Only system columns (Actions) remain sticky on the right.
        if (isPinned === "right" && column.id !== "Actions")
            return {};
        var startX = 0;
        if (isPinned === "left") {
            for (var _i = 0, _d = (_a = columnPinning.left) !== null && _a !== void 0 ? _a : []; _i < _d.length; _i++) {
                var id = _d[_i];
                if (id === column.id)
                    break;
                startX += (_c = (_b = columnSizeMap.get(id)) === null || _b === void 0 ? void 0 : _b.width) !== null && _c !== void 0 ? _c : 0;
            }
        }
        return {
            position: "sticky",
            left: isPinned === "left" ? startX : undefined,
            right: isPinned === "right" ? 0 : undefined,
            zIndex: 2,
            maxWidth: isPinned === "right" ? 60 : undefined
        };
    }, [columnPinning.left, columnSizeMap]);
    var location = (0, react_router_1.useLocation)();
    var navigation = (0, react_router_1.useNavigation)();
    var _9 = (0, useFilters_1.useFilters)(), hasFilters = _9.hasFilters, clearFilters = _9.clearFilters;
    var isRevalidatingCurrentRoute = (0, spin_delay_1.useSpinDelay)(navigation.state === "loading" &&
        ((_h = navigation.location) === null || _h === void 0 ? void 0 : _h.pathname) === location.pathname, { delay: 300 });
    return (<react_1.VStack key={(_j = view !== null && view !== void 0 ? view : tableName) !== null && _j !== void 0 ? _j : ""} spacing={0} className={(0, react_1.cn)("h-full bg-card", !compact && "flex flex-col w-full px-0 md:px-4 lg:px-6")}>
      {withHeader && (<components_1.TableHeader featuredColumns={featuredColumns} columnAccessors={columnAccessors} columnOrder={columnOrder} columnPinning={columnPinning} columnVisibility={columnVisibility} columns={table.getAllLeafColumns()} compact={compact} data={data} editMode={editMode} filters={filters} importCSV={importCSV} pagination={pagination} primaryAction={primaryAction} renderActions={renderActions} selectedRows={selectedRows} setFeaturedColumns={setFeaturedColumns} onPinnedReorder={handlePinnedReorder} setColumnOrder={setColumnOrder} setEditMode={setEditMode} table={tableName} title={title} withInlineEditing={withInlineEditing} withPagination={withPagination} withSavedView={withSavedView} withSearch={withSearch} withSelectableRows={withSelectableRows} sort={sort} filterActions={filterActions}/>)}

      {/* Mobile card view */}
      <div className="md:hidden w-full flex-1 min-h-0 overflow-y-auto">
        {rows.length === 0 ? (<div className="flex flex-col w-full h-full items-center justify-center gap-4 py-16">
            <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
              <lu_1.LuTriangleAlert className="h-6 w-6 flex-shrink-0"/>
            </div>
            <span className="text-xs font-mono font-light text-foreground uppercase">
              {hasFilters ? (<macro_1.Trans>No results found</macro_1.Trans>) : (<macro_1.Trans>No data exists</macro_1.Trans>)}
            </span>
            {hasFilters ? (<react_1.Button variant="secondary" onClick={clearFilters}>
                <macro_1.Trans>Remove Filters</macro_1.Trans>
              </react_1.Button>) : (primaryAction)}
          </div>) : (<div className="flex flex-col gap-3 px-3 py-2">
            {rows.map(function (row) {
                var _a;
                var card = (<components_1.TableCardRow row={row} pinnedColumns={table.getLeftVisibleLeafColumns()} centerColumns={table.getCenterVisibleLeafColumns()} featuredColumns={featuredColumns} getRowHref={renderExpandedRow ? undefined : getRowHref} renderContextMenu={renderContextMenu}/>);
                var canExpandRow = !getRowCanExpand || getRowCanExpand(row.original);
                if (!renderExpandedRow || !canExpandRow) {
                    return <react_2.Fragment key={row.id}>{card}</react_2.Fragment>;
                }
                var isRowExpanded = (_a = expandedRows[row.index]) !== null && _a !== void 0 ? _a : false;
                return (<div key={row.id} className="rounded-lg overflow-hidden border border-border">
                  <div role="button" tabIndex={0} onClick={function () { return toggleRowExpanded(row.index); }} onKeyDown={function (e) {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleRowExpanded(row.index);
                        }
                    }} aria-expanded={isRowExpanded} className="w-full flex items-stretch text-left cursor-pointer">
                    <span className="flex items-center px-2 text-muted-foreground">
                      {isRowExpanded ? (<lu_1.LuChevronDown className="size-4"/>) : (<lu_1.LuChevronRight className="size-4"/>)}
                    </span>
                    <span className="flex-1 min-w-0">{card}</span>
                  </div>
                  {isRowExpanded && (<div className="border-t border-border bg-muted/20">
                      {renderExpandedRow(row.original)}
                    </div>)}
                </div>);
            })}
          </div>)}
      </div>

      {/* Desktop table view */}
      <div id="table-container" className={(0, react_1.cn)(
        // contain:inline-size caps this scroll container's width to the grid
        // track instead of letting the wide table expand the min-width:auto
        // flex/grid ancestor chain (which kills horizontal scrolling).
        "hidden md:block w-full h-full overflow-x-auto [contain:inline-size] [scrollbar-gutter:stable] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent")} ref={tableContainerRef} onKeyDown={editMode ? onKeyDown : undefined}>
        <div className="flex max-w-full h-full">
          {rows.length === 0 ? (isRevalidatingCurrentRoute ? (<div className="flex h-full w-full items-start justify-center">
                <react_1.Table full className="w-full">
                  <react_1.Thead>
                    <react_1.Tr>
                      {Array.from({ length: 7 }).map(function (_, colIndex) { return (<react_1.Th key={colIndex} className={(0, react_1.cn)("h-[44px] w-[200px] bg-card", colIndex === 0 && "border-r border-border")}>
                          <div className="h-8"/>
                        </react_1.Th>); })}
                    </react_1.Tr>
                  </react_1.Thead>
                  <react_1.Tbody>
                    {Array.from({ length: 30 }).map(function (_, rowIndex) { return (<react_1.Tr key={rowIndex}>
                        {Array.from({ length: 7 }).map(function (_, colIndex) { return (<react_1.Td key={colIndex} className={(0, react_1.cn)("h-[44px] w-[200px]", colIndex === 0 && "border-r border-border")}>
                            <div className="h-6 w-full bg-gradient-to-r from-foreground/10 to-foreground/10 rounded animate-pulse"/>
                          </react_1.Td>); })}
                      </react_1.Tr>); })}
                  </react_1.Tbody>
                </react_1.Table>
              </div>) : hasFilters ? (<div className="flex flex-col w-full h-full items-center justify-center gap-4">
                <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background -mt-[10dvh]">
                  <lu_1.LuTriangleAlert className="h-6 w-6 flex-shrink-0"/>
                </div>
                <span className="text-xs font-mono font-light text-foreground uppercase">
                  <macro_1.Trans>No results found</macro_1.Trans>
                </span>
                <react_1.Button variant="secondary" onClick={clearFilters}>
                  <macro_1.Trans>Remove Filters</macro_1.Trans>
                </react_1.Button>
              </div>) : (<div className="flex flex-col w-full h-full items-center justify-center gap-4">
                <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background -mt-[10dvh]">
                  <lu_1.LuTriangleAlert className="h-6 w-6 flex-shrink-0"/>
                </div>
                <span className="text-xs font-mono font-light text-foreground uppercase">
                  <macro_1.Trans>No data exists</macro_1.Trans>
                </span>
                {primaryAction}
              </div>)) : (<react_1.Table ref={tableRef} full className="relative border-collapse border-spacing-0">
              <react_1.Thead className="sticky top-0 z-10">
                {table.getHeaderGroups().map(function (headerGroup) { return (<react_1.Tr key={headerGroup.id} className="h-10">
                    {headerGroup.headers.map(function (header) {
                    var _a, _b;
                    var accessorKey = (0, utils_2.getAccessorKey)(header.column.columnDef);
                    var sortable = withSimpleSorting &&
                        accessorKey &&
                        !accessorKey.endsWith(".id") &&
                        header.column.columnDef.enableSorting !== false;
                    var sorted = isSorted(accessorKey !== null && accessorKey !== void 0 ? accessorKey : "");
                    return (<react_1.Th key={header.id} colSpan={header.colSpan} id={"header-".concat(header.id)} className={(0, react_1.cn)("py-3 whitespace-nowrap bg-card", header.column.id === "Select" ? "px-2" : "px-4", editMode && "border-r-1 border-border", sortable && "cursor-pointer")} style={__assign(__assign({}, getPinnedStyles(header.column)), { width: header.getSize() })}>
                          {!header.isPlaceholder &&
                            (sortable ? (<react_1.DropdownMenu>
                                <react_1.DropdownMenuTrigger asChild>
                                  <div className="group flex justify-start items-center gap-2">
                                    {(_a = header.column.columnDef.meta) === null || _a === void 0 ? void 0 : _a.icon}
                                    {typeof header.column.columnDef.header ===
                                    "string"
                                    ? translateLabel(header.column.columnDef.header)
                                    : (0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext())}
                                    <span className="inline-flex items-center">
                                      {sorted ? (sorted === -1 ? (<lu_1.LuArrowDown aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["sorted descending"], ["sorted descending"])))} className="text-primary"/>) : (<lu_1.LuArrowUp aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["sorted ascending"], ["sorted ascending"])))} className="text-primary"/>)) : (<lu_1.LuArrowUpDown aria-hidden="true" className="text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100"/>)}
                                    </span>
                                  </div>
                                </react_1.DropdownMenuTrigger>
                                <react_1.DropdownMenuContent align="start">
                                  <react_1.DropdownMenuRadioGroup value={sorted === null || sorted === void 0 ? void 0 : sorted.toString()}>
                                    <react_1.DropdownMenuRadioItem onClick={function () {
                                    return toggleSortByAscending(accessorKey);
                                }} value="1">
                                      <react_1.DropdownMenuIcon icon={<lu_1.LuArrowUp />}/>
                                      <macro_1.Trans>Sort Ascending</macro_1.Trans>
                                    </react_1.DropdownMenuRadioItem>
                                    <react_1.DropdownMenuRadioItem onClick={function () {
                                    return toggleSortByDescending(accessorKey);
                                }} value="-1">
                                      <react_1.DropdownMenuIcon icon={<lu_1.LuArrowDown />}/>
                                      <macro_1.Trans>Sort Descending</macro_1.Trans>
                                    </react_1.DropdownMenuRadioItem>
                                  </react_1.DropdownMenuRadioGroup>
                                </react_1.DropdownMenuContent>
                              </react_1.DropdownMenu>) : (<div className="flex justify-start items-center gap-2">
                                {(_b = header.column.columnDef.meta) === null || _b === void 0 ? void 0 : _b.icon}
                                {typeof header.column.columnDef.header ===
                                    "string"
                                    ? translateLabel(header.column.columnDef.header)
                                    : (0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext())}
                              </div>))}
                        </react_1.Th>);
                })}
                  </react_1.Tr>); })}
              </react_1.Thead>
              <react_1.Tbody>
                {rows.map(function (row) {
                var canExpandRow = !!renderExpandedRow &&
                    (!getRowCanExpand || getRowCanExpand(row.original));
                var isRowExpanded = canExpandRow && expandedRows[row.index];
                var handleRowClick = canExpandRow
                    ? function () { return toggleRowExpanded(row.index); }
                    : undefined;
                // Desktop rows use the Actions column ActionMenu (dropdown) only.
                // Do not wrap the row in ContextMenu — nesting dropdown inside
                // ContextMenuTrigger causes the menu to flash closed on open.
                var rowContent = (<components_1.Row key={row.id} columns={columns} editableComponents={editableComponents} isEditing={isEditing} isEditMode={editMode} isRowExpanded={!!isRowExpanded} isRowSelected={row.index in rowSelection && !!rowSelection[row.index]} pinnedColumns={pinnedColumnsKey} selectedCell={selectedCell} row={row} rowIsSelected={(selectedCell === null || selectedCell === void 0 ? void 0 : selectedCell.row) === row.index} getPinnedStyles={getPinnedStyles} onCellClick={onCellClick} onCellUpdate={onCellUpdate} onFinishEditing={finishEditing} onClick={handleRowClick} className={canExpandRow ? "cursor-pointer" : undefined}/>);
                return (<react_2.Fragment key={row.id}>
                      {rowContent}
                      {isRowExpanded && (<react_1.Tr>
                          <react_1.Td colSpan={visibleColumns.length} className="p-0 bg-muted/20 border-b border-border">
                            {renderExpandedRow(row.original)}
                          </react_1.Td>
                        </react_1.Tr>)}
                    </react_2.Fragment>);
            })}
                {table.getFooterGroups().map(function (footerGroup) { return (<react_1.Tr key={footerGroup.id} className="h-10">
                    {footerGroup.headers.map(function (footer) {
                    var _a, _b, _c;
                    var aggregateFn = (_a = columnAggregates[footer.column.id]) !== null && _a !== void 0 ? _a : "sum";
                    var total = aggregateForCol(table, footer.column.id, aggregateFn);
                    return (<react_1.Th key={footer.id} colSpan={footer.colSpan} id={"header-".concat(footer.id)} className={(0, react_1.cn)("px-4 py-3 whitespace-nowrap bg-card", editMode && "border-r-1 border-border")} style={__assign(__assign({}, getPinnedStyles(footer.column)), { width: footer.getSize() })}>
                          {!footer.isPlaceholder &&
                            ((_b = footer.column.columnDef.meta) === null || _b === void 0 ? void 0 : _b.renderTotal) && (<AggregateSelector value={total} aggregateFunction={aggregateFn} onAggregateFunctionChange={function (fn) {
                                setColumnAggregates(function (prev) {
                                    var _a;
                                    return (__assign(__assign({}, prev), (_a = {}, _a[footer.column.id] = fn, _a)));
                                });
                            }} formatter={(_c = footer.column.columnDef.meta) === null || _c === void 0 ? void 0 : _c.formatter}/>)}
                        </react_1.Th>);
                })}
                  </react_1.Tr>); })}
              </react_1.Tbody>
            </react_1.Table>)}
        </div>
      </div>
      {withPagination && <components_1.Pagination {...pagination}/>}
    </react_1.VStack>);
};
function getRowSelectionColumn() {
    return [
        {
            id: "Select",
            // width:1 + whitespace-nowrap = shrink-to-fit. A fixed pixel width
            // inflates on w-full auto-layout tables because leftover space is
            // distributed proportionally to specified column widths.
            size: 1,
            minSize: 1,
            enablePinning: true,
            header: function (_a) {
                var table = _a.table;
                return (<components_1.IndeterminateCheckbox {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler()
                }}/>);
            },
            cell: function (_a) {
                var row = _a.row;
                return (<components_1.IndeterminateCheckbox {...{
                    checked: row.getIsSelected(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler()
                }}/>);
            }
        }
    ];
}
function getActionColumn(renderContextMenu, translateLabel) {
    return [
        {
            id: "Actions",
            header: function () { return (<span className="sr-only">{translateLabel("Actions")}</span>); },
            cell: function (_a) {
                var row = _a.row;
                return (<components_1.RowActionMenu rowKey={row.id} row={row.original} renderContextMenu={renderContextMenu}/>);
            },
            size: 60,
            meta: {
                cellClassName: "transition-none"
            }
        }
    ];
}
function getExpandColumn(expandedRows, toggleRowExpanded, translateLabel, getRowCanExpand) {
    return [
        {
            id: "Expand",
            size: 40,
            enablePinning: true,
            header: function () { return <span className="sr-only">{translateLabel("Expand")}</span>; },
            cell: function (_a) {
                var _b, _c, _d;
                var row = _a.row, table = _a.table;
                // Rows the predicate rejects show no chevron and aren't expandable.
                if (getRowCanExpand && !getRowCanExpand(row.original)) {
                    return null;
                }
                // Read the live expansion state from meta (refreshed each render) so the
                // chevron reflects the current state even though react-table may serve a
                // cached cell closure for the stable "Expand" column id.
                var liveExpandedRows = (_c = (_b = table.options.meta) === null || _b === void 0 ? void 0 : _b.expandedRows) !== null && _c !== void 0 ? _c : expandedRows;
                var isExpanded = (_d = liveExpandedRows[row.index]) !== null && _d !== void 0 ? _d : false;
                return (<button type="button" onClick={function (e) {
                        e.stopPropagation();
                        toggleRowExpanded(row.index);
                    }} className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground" aria-label={isExpanded
                        ? translateLabel("Collapse row")
                        : translateLabel("Expand row")}>
            {isExpanded ? (<lu_1.LuChevronDown className="size-4"/>) : (<lu_1.LuChevronRight className="size-4"/>)}
          </button>);
            }
        }
    ];
}
exports.default = Table;
var templateObject_1, templateObject_2;
