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
exports.EditorBubbleItem = void 0;
var react_slot_1 = require("@radix-ui/react-slot");
var react_1 = require("@tiptap/react");
var react_2 = require("react");
exports.EditorBubbleItem = (0, react_2.forwardRef)(function (_a, ref) {
    var children = _a.children, asChild = _a.asChild, onSelect = _a.onSelect, rest = __rest(_a, ["children", "asChild", "onSelect"]);
    var editor = (0, react_1.useCurrentEditor)().editor;
    var Comp = asChild ? react_slot_1.Slot : "div";
    if (!editor)
        return null;
    return (<Comp ref={ref} {...rest} onClick={function () { return onSelect === null || onSelect === void 0 ? void 0 : onSelect(editor); }}>
      {children}
    </Comp>);
});
exports.EditorBubbleItem.displayName = "EditorBubbleItem";
exports.default = exports.EditorBubbleItem;
