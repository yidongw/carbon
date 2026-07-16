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
exports.Textarea = void 0;
var class_variance_authority_1 = require("class-variance-authority");
var react_1 = require("react");
var cn_1 = require("./utils/cn");
var textareaVariants = (0, class_variance_authority_1.cva)("flex min-h-[2lh] max-h-[10lh] w-full border border-input bg-transparent shadow-xs transition-[color,box-shadow] placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 read-only:bg-muted read-only:cursor-not-allowed dark:aria-invalid:ring-destructive/40", {
    variants: {
        size: {
            sm: "rounded-md px-3 py-1 text-sm",
            md: "rounded-md px-3 py-2 text-sm",
            lg: "rounded-lg px-4 py-3 text-base"
        }
    },
    defaultVariants: {
        size: "md"
    }
});
var Textarea = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, size = _a.size, props = __rest(_a, ["className", "size"]);
    return (<textarea className={(0, cn_1.cn)(textareaVariants({ size: size }), className)} ref={ref} {...props}/>);
});
exports.Textarea = Textarea;
Textarea.displayName = "Textarea";
