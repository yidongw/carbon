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
exports.EditorCommandEmpty = exports.EditorCommandItem = void 0;
var react_1 = require("@tiptap/react");
var cmdk_1 = require("cmdk");
var jotai_1 = require("jotai");
var react_2 = require("react");
var atoms_1 = require("../utils/atoms");
exports.EditorCommandItem = (0, react_2.forwardRef)(function (_a, ref) {
    var children = _a.children, onCommand = _a.onCommand, rest = __rest(_a, ["children", "onCommand"]);
    var editor = (0, react_1.useCurrentEditor)().editor;
    var range = (0, jotai_1.useAtomValue)(atoms_1.rangeAtom);
    if (!editor || !range)
        return null;
    return (<cmdk_1.CommandItem ref={ref} {...rest} onSelect={function () { return onCommand({ editor: editor, range: range }); }}>
      {children}
    </cmdk_1.CommandItem>);
});
exports.EditorCommandItem.displayName = "EditorCommandItem";
exports.EditorCommandEmpty = cmdk_1.CommandEmpty;
exports.default = exports.EditorCommandItem;
