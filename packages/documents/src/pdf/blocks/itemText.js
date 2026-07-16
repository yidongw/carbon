"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemTextOverflowStyle = itemTextOverflowStyle;
/**
 * Style for the line-item title/description text. With `truncate`, clamp to a
 * single line with an ellipsis; with `wrap` (default), let it flow onto new
 * lines (which grows the row height). Shared by every document's LineItemsBlock.
 */
function itemTextOverflowStyle(options) {
    return (options === null || options === void 0 ? void 0 : options.textOverflow) === "truncate"
        ? { maxLines: 1, textOverflow: "ellipsis" }
        : {};
}
