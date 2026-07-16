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
var react_1 = require("@carbon/react");
var react_2 = require("react");
var Container = (0, react_2.forwardRef)(function (_a, ref) {
    var width = _a.width, children = _a.children, className = _a.className, props = __rest(_a, ["width", "children", "className"]);
    return (<div ref={ref} {...props} className={(0, react_1.cn)("inline-block relative w-full", className)} style={{ maxWidth: width }}>
      {children}
    </div>);
});
Container.displayName = "Container";
exports.default = Container;
