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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_table_1 = require("@tanstack/react-table");
var react_2 = require("react");
var hooks_1 = require("~/hooks");
var utils_1 = require("../utils");
var Cell = function (_a) {
    var cell = _a.cell, columnIndex = _a.columnIndex, editableComponents = _a.editableComponents, editedCells = _a.editedCells, isEditing = _a.isEditing, isEditMode = _a.isEditMode, isSelected = _a.isSelected, getPinnedStyles = _a.getPinnedStyles, onClick = _a.onClick, onUpdate = _a.onUpdate, onFinishEditing = _a.onFinishEditing, table = _a.table;
    var _b = (0, hooks_1.useMovingCellRef)(isSelected), ref = _b.ref, tabIndex = _b.tabIndex, onFocus = _b.onFocus;
    var _c = (0, react_2.useState)(false), hasError = _c[0], setHasError = _c[1];
    var accessorKey = (0, utils_1.getAccessorKey)(cell.column.columnDef);
    var wasEdited = !!editedCells && !!accessorKey && editedCells.includes(accessorKey);
    var hasEditableTableCellComponent = accessorKey !== undefined &&
        editableComponents &&
        accessorKey in editableComponents;
    var editableCell = hasEditableTableCellComponent
        ? editableComponents[accessorKey]
        : null;
    var isPinned = cell.column.getIsPinned();
    var cellClassName = typeof cell.column.columnDef.meta === "object" &&
        cell.column.columnDef.meta !== null &&
        "cellClassName" in cell.column.columnDef.meta
        ? cell.column.columnDef.meta.cellClassName
        : undefined;
    return (<react_1.Td className={(0, react_1.cn)("relative py-2 whitespace-nowrap text-sm outline-none max-w-[30dvw] truncate", cell.column.id === "Select" ? "px-2" : "px-4", cellClassName, wasEdited && "bg-yellow-100 dark:bg-yellow-900", isEditMode && !hasEditableTableCellComponent && "bg-muted/50", isEditMode && "border-border border-r", hasError && "ring-inset ring-2 ring-red-500", isSelected && "!ring-inset !ring-2 !ring-ring", isSelected && hasEditableTableCellComponent && "!bg-background", isPinned && "bg-card transition-[left] duration-200")} ref={ref} style={__assign(__assign({}, getPinnedStyles(cell.column)), { width: cell.column.getSize(), margin: 0, borderSpacing: 0 })} data-row={cell.row.index} data-column={columnIndex} tabIndex={tabIndex} onClick={onClick} onFocus={onFocus}>
      {isSelected && isEditing && hasEditableTableCellComponent ? (<div className="mx-[-0.65rem] my-[-0.25rem]">
          {hasEditableTableCellComponent
                ? (0, react_table_1.flexRender)(editableCell, {
                    accessorKey: accessorKey,
                    value: cell.renderValue(),
                    row: cell.row.original,
                    onUpdate: onUpdate
                        ? onUpdate
                        : function () { return console.error("No update function provided"); },
                    onError: function () {
                        setHasError(true);
                    },
                    onFinishEditing: onFinishEditing
                })
                : null}
        </div>) : (<div ref={ref}>
          {(0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext())}
        </div>)}
    </react_1.Td>);
};
// Cells re-render based on their own value, not row identity. Multi-field
// cells should subscribe to all fields they read (e.g. via the column
// accessor's `id` returning a derived value). Also compare row.original so
// index-stable cell ids do not show stale data when rows are inserted or
// reordered.
var MemoizedCell = (0, react_2.memo)(Cell, function (prev, next) {
    return prev.cell.id === next.cell.id &&
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
        prev.getPinnedStyles === next.getPinnedStyles;
});
exports.default = MemoizedCell;
