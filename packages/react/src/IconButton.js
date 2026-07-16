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
exports.IconButton = void 0;
var react_1 = require("react");
var Button_1 = require("./Button");
var cn_1 = require("./utils/cn");
/**
 * Icon sizes matching button sizes for visual consistency
 * Slightly smaller than text button icons for better proportions
 */
var iconSizes = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5"
};
/**
 * IconButton - A button variant optimized for icon-only usage
 *
 * Accessibility:
 * - aria-label is required to provide context for screen readers
 * - Icon is marked as aria-hidden since the label provides the meaning
 *
 * Animation:
 * - Inherits all animation improvements from Button component
 * - Uses same easing (ease-out) and timing (150ms)
 */
var IconButton = (0, react_1.forwardRef)(function (_a, ref) {
    var _b;
    var icon = _a.icon, ariaLabel = _a["aria-label"], _c = _a.isRound, isRound = _c === void 0 ? false : _c, children = _a.children, _d = _a.size, size = _d === void 0 ? "md" : _d, props = __rest(_a, ["icon", "aria-label", "isRound", "children", "size"]);
    // Support passing icon as prop or children
    var element = icon || children;
    var _children = (0, react_1.isValidElement)(element)
        ? (0, react_1.cloneElement)(element, {
            "aria-hidden": true,
            focusable: false,
            className: (0, cn_1.cn)(iconSizes[size !== null && size !== void 0 ? size : "md"], (_b = element.props) === null || _b === void 0 ? void 0 : _b.className)
        })
        : null;
    return (<Button_1.Button aria-label={ariaLabel} ref={ref} isIcon isRound={isRound} size={size} {...props}>
        {_children}
      </Button_1.Button>);
});
exports.IconButton = IconButton;
IconButton.displayName = "IconButton";
