"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var RowActionsContainer_1 = require("./RowActionsContainer");
function RowActionMenu(_a) {
    var row = _a.row, renderContextMenu = _a.renderContextMenu;
    var content = renderContextMenu(row);
    if (!content)
        return null;
    return (<RowActionsContainer_1.default>
      <react_1.ActionMenu>{content}</react_1.ActionMenu>
    </RowActionsContainer_1.default>);
}
exports.default = (0, react_2.memo)(RowActionMenu, function (prev, next) {
    return (prev.rowKey === next.rowKey &&
        prev.row === next.row &&
        prev.renderContextMenu === next.renderContextMenu);
});
