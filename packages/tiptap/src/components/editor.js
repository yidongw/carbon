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
exports.EditorContent = exports.EditorRoot = void 0;
var react_1 = require("@tiptap/react");
var jotai_1 = require("jotai");
var react_2 = require("react");
var tunnel_rat_1 = require("tunnel-rat");
var store_1 = require("../utils/store");
var editor_command_1 = require("./editor-command");
var EditorRoot = function (_a) {
    var children = _a.children;
    var tunnelInstance = (0, react_2.useRef)((0, tunnel_rat_1.default)()).current;
    return (<jotai_1.Provider store={store_1.novelStore}>
      <editor_command_1.EditorCommandTunnelContext.Provider value={tunnelInstance}>
        {children}
      </editor_command_1.EditorCommandTunnelContext.Provider>
    </jotai_1.Provider>);
};
exports.EditorRoot = EditorRoot;
exports.EditorContent = (0, react_2.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, initialContent = _a.initialContent, rest = __rest(_a, ["className", "children", "initialContent"]);
    return (<div ref={ref} className={className}>
      {/* immediatelyRender false: avoid SSR hydration mismatch (overridable). */}
      <react_1.EditorProvider immediatelyRender={false} {...rest} content={initialContent}>
        {children}
      </react_1.EditorProvider>
    </div>);
});
exports.EditorContent.displayName = "EditorContent";
