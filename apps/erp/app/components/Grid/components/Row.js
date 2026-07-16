"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var Cell_1 = require("./Cell");
var Row = function (_a) {
    var editableComponents = _a.editableComponents, editedCells = _a.editedCells, isEditing = _a.isEditing, row = _a.row, _b = _a.rowIsClickable, rowIsClickable = _b === void 0 ? false : _b, rowIsSelected = _a.rowIsSelected, rowRef = _a.rowRef, selectedCell = _a.selectedCell, onCellClick = _a.onCellClick, onCellUpdate = _a.onCellUpdate;
    var onUpdate = onCellUpdate(row.index);
    return (<react_1.Tr key={row.id} ref={rowRef} className={(0, react_1.cn)(rowIsClickable && "cursor-pointer")}>
      {row.getVisibleCells().map(function (cell, columnIndex) {
            var isSelected = (selectedCell === null || selectedCell === void 0 ? void 0 : selectedCell.row) === cell.row.index &&
                (selectedCell === null || selectedCell === void 0 ? void 0 : selectedCell.column) === columnIndex;
            return (<Cell_1.default key={cell.id} cell={cell} columnIndex={columnIndex} 
            // @ts-ignore
            editableComponents={editableComponents} editedCells={editedCells} isSelected={isSelected} isEditing={isEditing} onClick={function () { return onCellClick(cell.row.index, columnIndex); }} onUpdate={onUpdate}/>);
        })}
    </react_1.Tr>);
};
var MemoizedRow = (0, react_2.memo)(Row, function (prev, next) {
    var _a, _b, _c, _d;
    return next.rowIsSelected === false &&
        prev.rowIsSelected === false &&
        ((_a = next.selectedCell) === null || _a === void 0 ? void 0 : _a.row) === prev.row.index &&
        next.row.index === ((_b = prev.selectedCell) === null || _b === void 0 ? void 0 : _b.row) &&
        ((_c = next.selectedCell) === null || _c === void 0 ? void 0 : _c.column) === ((_d = prev.selectedCell) === null || _d === void 0 ? void 0 : _d.column) &&
        next.isEditing === prev.isEditing;
});
// props are equal if:
// - the row is not the selected row
exports.default = MemoizedRow;
