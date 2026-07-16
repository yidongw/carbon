"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMovingCellRef = useMovingCellRef;
var react_1 = require("react");
var dom_1 = require("~/utils/dom");
// https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_roving_tabindex
function useMovingCellRef(isSelected) {
    // https://www.w3.org/TR/wai-aria-practices-1.1/#gridNav_focus
    var _a = (0, react_1.useState)(false), isChildFocused = _a[0], setIsChildFocused = _a[1];
    if (isChildFocused && !isSelected) {
        setIsChildFocused(false);
    }
    var ref = (0, react_1.useCallback)(function (cell) {
        if (cell === null)
            return;
        (0, dom_1.scrollIntoView)(cell);
        if (cell.contains(document.activeElement))
            return;
        cell.focus({ preventScroll: true });
    }, []);
    function onFocus(event) {
        if (event.target !== event.currentTarget) {
            setIsChildFocused(true);
        }
    }
    var isFocused = isSelected && !isChildFocused;
    return {
        ref: isSelected ? ref : undefined,
        tabIndex: isFocused ? 0 : -1,
        onFocus: isSelected ? onFocus : undefined
    };
}
