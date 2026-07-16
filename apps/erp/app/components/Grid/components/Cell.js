"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_table_1 = require("@tanstack/react-table");
var react_2 = require("react");
var hooks_1 = require("~/hooks");
var utils_1 = require("../utils");
var Cell = function (_a) {
    var cell = _a.cell, columnIndex = _a.columnIndex, editableComponents = _a.editableComponents, editedCells = _a.editedCells, isEditing = _a.isEditing, isSelected = _a.isSelected, onClick = _a.onClick, onUpdate = _a.onUpdate;
    var _b = (0, hooks_1.useMovingCellRef)(isSelected), ref = _b.ref, tabIndex = _b.tabIndex, onFocus = _b.onFocus;
    var _c = (0, react_2.useState)(false), hasError = _c[0], setHasError = _c[1];
    var accessorKey = (0, utils_1.getAccessorKey)(cell.column.columnDef);
    var wasEdited = !!editedCells && !!accessorKey && editedCells.includes(accessorKey);
    var hasEditableTableCellComponent = accessorKey !== undefined &&
        editableComponents &&
        accessorKey in editableComponents;
    var editableCell = hasEditableTableCellComponent
        ? editableComponents === null || editableComponents === void 0 ? void 0 : editableComponents[accessorKey]
        : null;
    return (<react_1.Td className={(0, react_1.cn)("relative border-r border-border px-4 py-2 whitespace-nowrap text-sm outline-none", wasEdited && "bg-yellow-100 dark:bg-yellow-900", !hasEditableTableCellComponent && "bg-muted/50", hasError && "ring-inset ring-2 ring-red-500", isSelected && "!ring-inset !ring-2 !ring-ring", isSelected && hasEditableTableCellComponent && "!bg-background")} ref={ref} data-row={cell.row.index} data-column={columnIndex} tabIndex={tabIndex} onClick={onClick} onFocus={onFocus}>
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
                    }
                })
                : null}
        </div>) : (<div ref={ref}>
          {(0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext())}
        </div>)}
    </react_1.Td>);
};
var MemoizedCell = (0, react_2.memo)(Cell, function (prev, next) {
    return next.isSelected === prev.isSelected &&
        next.isEditing === prev.isEditing &&
        next.cell.getValue() === prev.cell.getValue() &&
        next.cell.getContext() === prev.cell.getContext();
});
exports.default = MemoizedCell;
