"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RowActionsContainer;
var react_1 = require("@carbon/react");
/**
 * Wraps row-level action UI (menus, inline buttons) so that clicks inside it
 * don't bubble up to the row's navigation handler.
 */
function RowActionsContainer(_a) {
    var children = _a.children, className = _a.className;
    return (<div className={(0, react_1.cn)("flex justify-end", className)} data-prevent-row-nav onPointerDown={function (event) { return event.stopPropagation(); }} onClick={function (event) { return event.stopPropagation(); }}>
      {children}
    </div>);
}
