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
exports.VStack = void 0;
var class_variance_authority_1 = require("class-variance-authority");
var react_1 = require("react");
var cn_1 = require("./utils/cn");
var vStackVariants = (0, class_variance_authority_1.cva)("flex flex-col w-full items-start", {
    variants: {
        spacing: {
            0: "space-y-0",
            1: "space-y-1",
            2: "space-y-2",
            3: "space-y-3",
            4: "space-y-4",
            8: "space-y-8"
        }
    },
    defaultVariants: {
        spacing: 2
    }
});
var VStack = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, spacing = _a.spacing, props = __rest(_a, ["className", "children", "spacing"]);
    return (<div className={(0, cn_1.cn)(vStackVariants({
            spacing: spacing,
            className: className
        }))} ref={ref} {...props}>
        {children}
      </div>);
});
exports.VStack = VStack;
VStack.displayName = "VStack";
