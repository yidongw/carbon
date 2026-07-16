"use client";
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
exports.toggleVariants = exports.Toggle = void 0;
var TogglePrimitive = require("@radix-ui/react-toggle");
var class_variance_authority_1 = require("class-variance-authority");
var react_1 = require("react");
var cn_1 = require("./utils/cn");
var toggleVariants = (0, class_variance_authority_1.cva)("inline-flex items-center justify-center rounded-md text-sm font-medium transition-[color,box-shadow] hover:bg-primary/60 hover:data-[state=on]:bg-primary hover:text-primary-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground", {
    variants: {
        variant: {
            default: "bg-transparent",
            outline: "border border-input bg-transparent hover:bg-primary/80 hover:text-primary-foreground"
        },
        size: {
            default: "h-10 px-3",
            sm: "h-8 px-2.5",
            lg: "h-11 px-5"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
exports.toggleVariants = toggleVariants;
var Toggle = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, variant = _a.variant, size = _a.size, props = __rest(_a, ["className", "variant", "size"]);
    return (<TogglePrimitive.Root ref={ref} className={(0, cn_1.cn)(toggleVariants({ variant: variant, size: size, className: className }))} {...props}/>);
});
exports.Toggle = Toggle;
Toggle.displayName = TogglePrimitive.Root.displayName;
