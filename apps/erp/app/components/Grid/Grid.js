"use strict";
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
var react_table_1 = require("@tanstack/react-table");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("./components");
var utils_2 = require("./utils");
var Grid = function (_a) {
    var _b = _a.canEdit, canEdit = _b === void 0 ? true : _b, columns = _a.columns, _c = _a.contained, contained = _c === void 0 ? true : _c, data = _a.data, editableComponents = _a.editableComponents, defaultColumnOrder = _a.defaultColumnOrder, defaultColumnVisibility = _a.defaultColumnVisibility, _d = _a.withSimpleSorting, withSimpleSorting = _d === void 0 ? true : _d, onDataChange = _a.onDataChange, onEditRow = _a.onEditRow, onNewRow = _a.onNewRow;
    var tableContainerRef = (0, react_2.useRef)(null);
    /* Data for Optimistic Updates */
    var _e = (0, react_2.useState)(data), internalData = _e[0], setInternalData = _e[1];
    (0, react_2.useEffect)(function () {
        setInternalData(data);
    }, [data]);
    /* Column Visibility */
    var _f = (0, react_2.useState)(defaultColumnVisibility !== null && defaultColumnVisibility !== void 0 ? defaultColumnVisibility : {}), columnVisibility = _f[0], setColumnVisibility = _f[1];
    /* Column Ordering */
    var _g = (0, react_2.useState)(defaultColumnOrder !== null && defaultColumnOrder !== void 0 ? defaultColumnOrder : []), columnOrder = _g[0], setColumnOrder = _g[1];
    var table = (0, react_table_1.useReactTable)({
        data: internalData,
        columns: columns,
        state: {
            columnVisibility: columnVisibility,
            columnOrder: columnOrder
        },
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        meta: {
            // These are not part of the standard API, but are accessible via table.options.meta
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
                    onDataChange === null || onDataChange === void 0 ? void 0 : onDataChange(newData);
                    return newData;
                });
            }
        }
    });
    var _h = (0, react_2.useState)(false), isEditing = _h[0], setIsEditing = _h[1];
    var _j = (0, react_2.useState)(null), selectedCell = _j[0], setSelectedCell = _j[1];
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
        var tableColumns = __spreadArray(__spreadArray([], table.getLeftVisibleLeafColumns(), true), table.getCenterVisibleLeafColumns(), true);
        var column = tableColumns[selectedColumn];
        if (!column)
            return false;
        var accessorKey = (0, utils_2.getAccessorKey)(column.columnDef);
        return (accessorKey && editableComponents && accessorKey in editableComponents);
    }, [table, editableComponents]);
    var onCellClick = (0, react_2.useCallback)(function (row, column) {
        // ignore row select checkbox column
        if ((selectedCell === null || selectedCell === void 0 ? void 0 : selectedCell.row) === row &&
            (selectedCell === null || selectedCell === void 0 ? void 0 : selectedCell.column) === column &&
            isColumnEditable(column)) {
            setIsEditing(true);
            return;
        }
        // ignore row select checkbox column
        if (column === -1)
            return;
        setIsEditing(false);
        onSelectedCellChange({ row: row, column: column });
    }, [selectedCell, isColumnEditable, onSelectedCellChange]);
    var onCellUpdate = (0, react_2.useCallback)(function (rowIndex) { return function (updates) {
        var _a, _b;
        return ((_a = table.options.meta) === null || _a === void 0 ? void 0 : _a.updateData)
            ? (_b = table.options.meta) === null || _b === void 0 ? void 0 : _b.updateData(rowIndex, updates)
            : undefined;
    }; }, [table]);
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
        var lastColumn = table.getVisibleLeafColumns().length - 1;
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
            if (canEdit &&
                !isEditing &&
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
            // Commit any in-flight edit before navigating. Editors (NumberField,
            // DatePicker, etc.) commit their value on blur — without this, Tab's
            // preventDefault keeps focus on the input until it unmounts and the
            // onChange never fires, silently dropping the typed value.
            if (isEditing &&
                document.activeElement instanceof HTMLElement &&
                document.activeElement !== document.body) {
                document.activeElement.blur();
            }
            setSelectedCell({
                row: y1,
                column: x1
            });
            // On Tab, carry edit mode into the next editable cell so typing
            // continues naturally. Otherwise (Enter) drop out of edit mode.
            if (isEditing) {
                var carryEdit = Boolean(canEdit && code === "Tab" && isColumnEditable(x1));
                setIsEditing(carryEdit);
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
    }, [canEdit, isColumnEditable, isEditing, selectedCell, table]);
    // reset the selected cell when the table data changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        setSelectedCell(null);
    }, [columnOrder, columnVisibility]);
    (0, react_1.useMount)(function () {
        setColumnOrder(table.getAllLeafColumns().map(function (column) { return column.id; }));
    });
    var rows = table.getRowModel().rows;
    return (<react_1.VStack spacing={0} className="h-full w-full">
      <div className={(0, react_1.cn)("w-full h-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent", contained ? "" : "relative")} ref={tableContainerRef} onKeyDown={onKeyDown}>
        <react_1.Table full={contained} className={(0, react_1.cn)(!contained && "border w-full")}>
          <react_1.Thead className="sticky top-0 z-10">
            {table.getHeaderGroups().map(function (headerGroup) { return (<react_1.Tr key={headerGroup.id} className="h-10">
                {headerGroup.headers.map(function (header) {
                var accessorKey = (0, utils_2.getAccessorKey)(header.column.columnDef);
                var sortable = withSimpleSorting &&
                    accessorKey &&
                    !accessorKey.endsWith(".id") &&
                    header.column.columnDef.enableSorting !== false;
                return (<react_1.Th key={header.id} colSpan={header.colSpan} className={(0, react_1.cn)("border-r border-border px-4 py-3 whitespace-nowrap text-sm", sortable && "cursor-pointer")} style={{
                        width: header.getSize()
                    }}>
                      {header.isPlaceholder ? null : (<div className="flex justify-start items-center text-xs text-zinc-500">
                          {(0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext())}
                        </div>)}
                    </react_1.Th>);
            })}
              </react_1.Tr>); })}
          </react_1.Thead>
          <react_1.Tbody>
            {rows.map(function (row) {
            return (<components_1.Row key={row.id} editableComponents={canEdit ? editableComponents : {}} isEditing={isEditing} selectedCell={selectedCell} row={row} rowIsSelected={(selectedCell === null || selectedCell === void 0 ? void 0 : selectedCell.row) === row.index} onCellClick={onCellClick} onCellUpdate={onCellUpdate} onEditRow={onEditRow}/>);
        })}
            {rows.length === 0 && !onNewRow && (<react_1.Tr className="h-10 hover:bg-muted/50">
                <react_1.Td colSpan={24}>
                  <p className="text-muted-foreground text-center w-full">
                    <macro_1.Trans>No Data</macro_1.Trans>
                  </p>
                </react_1.Td>
              </react_1.Tr>)}
            {onNewRow && (<react_1.Tr onClick={onNewRow} className="cursor-pointer h-10 hover:bg-muted/50 border-t">
                <react_1.Td colSpan={24}>
                  <react_1.HStack className="items-center h-6">
                    <lu_1.LuCirclePlus className="text-muted-foreground h-4 w-4"/>
                    <span>
                      <macro_1.Trans>New</macro_1.Trans>
                    </span>
                  </react_1.HStack>
                </react_1.Td>
              </react_1.Tr>)}
          </react_1.Tbody>
        </react_1.Table>
      </div>
    </react_1.VStack>);
};
exports.default = Grid;
