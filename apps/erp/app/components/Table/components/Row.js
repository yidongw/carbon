"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var Cell_1 = require("./Cell");
var Row = function (_a) {
    var _columns = _a.columns, editableComponents = _a.editableComponents, editedCells = _a.editedCells, isEditing = _a.isEditing, isEditMode = _a.isEditMode, _b = _a.isFrozenColumn, isFrozenColumn = _b === void 0 ? false : _b, _isRowExpanded = _a.isRowExpanded, _c = _a.isRowSelected, isRowSelected = _c === void 0 ? false : _c, pinnedColumns = _a.pinnedColumns, row = _a.row, rowIsSelected = _a.rowIsSelected, selectedCell = _a.selectedCell, getPinnedStyles = _a.getPinnedStyles, onCellClick = _a.onCellClick, onCellUpdate = _a.onCellUpdate, onFinishEditing = _a.onFinishEditing, className = _a.className, props = __rest(_a, ["columns", "editableComponents", "editedCells", "isEditing", "isEditMode", "isFrozenColumn", "isRowExpanded", "isRowSelected", "pinnedColumns", "row", "rowIsSelected", "selectedCell", "getPinnedStyles", "onCellClick", "onCellUpdate", "onFinishEditing", "className"]);
    var onUpdate = isEditMode ? onCellUpdate(row.index) : undefined;
    return (<react_1.Tr key={row.id} className={(0, react_1.cn)("border-b border-border transition-colors", isFrozenColumn && "bg-card", className)} {...props}>
      {row.getVisibleCells().map(function (cell, columnIndex) {
            var isSelected = (selectedCell === null || selectedCell === void 0 ? void 0 : selectedCell.row) === cell.row.index &&
                (selectedCell === null || selectedCell === void 0 ? void 0 : selectedCell.column) === columnIndex;
            return (<Cell_1.default key={cell.id} cell={cell} cellRenderer={cell.column.columnDef.cell} columnIndex={columnIndex} 
            // @ts-ignore
            editableComponents={editableComponents} editedCells={editedCells} isRowSelected={isRowSelected} isSelected={isSelected} isEditing={isEditing} isEditMode={isEditMode} pinnedColumns={pinnedColumns} getPinnedStyles={getPinnedStyles} onClick={isEditMode
                    ? function () { return onCellClick(cell.row.index, columnIndex); }
                    : undefined} onUpdate={onUpdate} onFinishEditing={onFinishEditing}/>);
        })}
    </react_1.Tr>);
};
var MemoizedRow = (0, react_2.memo)(Row, function (prev, next) {
    var _a, _b, _c, _d;
    return prev.row.id === next.row.id &&
        prev.row.original === next.row.original &&
        prev.isRowSelected === next.isRowSelected &&
        prev.rowIsSelected === next.rowIsSelected &&
        prev.isEditing === next.isEditing &&
        prev.isEditMode === next.isEditMode &&
        prev.isRowExpanded === next.isRowExpanded &&
        ((_a = prev.selectedCell) === null || _a === void 0 ? void 0 : _a.row) === ((_b = next.selectedCell) === null || _b === void 0 ? void 0 : _b.row) &&
        ((_c = prev.selectedCell) === null || _c === void 0 ? void 0 : _c.column) === ((_d = next.selectedCell) === null || _d === void 0 ? void 0 : _d.column) &&
        prev.pinnedColumns === next.pinnedColumns &&
        // getPinnedStyles identity changes when columnPinning/columnSizeMap update
        // (it's a useCallback keyed on them). Without this, rows keep the styles
        // from the first render — when columnSizeMap was still empty — so pinned
        // body cells stick at left:0 and cover the checkbox column.
        prev.getPinnedStyles === next.getPinnedStyles &&
        // Re-render when the columns rebuild (e.g. async option lists loaded) so
        // cells pick up their new renderers.
        prev.columns === next.columns;
});
exports.default = MemoizedRow;
