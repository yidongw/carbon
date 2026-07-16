"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editableCell = editableCell;
var InlineEditCell_1 = require("./InlineEditCell");
/**
 * Turns an `EditableCellConfig` into a TanStack `cell` renderer, so a column becomes
 * editable by swapping its `cell` for `editableCell({...})` while keeping its header,
 * meta, and filters intact.
 */
function editableCell(config) {
    return function EditableCell(ctx) {
        return <InlineEditCell_1.InlineEditCell row={ctx.row.original} config={config}/>;
    };
}
