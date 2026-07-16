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
exports.Heading = void 0;
var class_variance_authority_1 = require("class-variance-authority");
var react_1 = require("react");
var cn_1 = require("./utils/cn");
var headingVariants = (0, class_variance_authority_1.cva)("font-semibold font-headline leading-none tracking-tight text-foreground text-balance", {
    variants: {
        size: {
            display: "md:text-[44px] text-[36px]",
            h1: "md:text-3xl text-2xl",
            h2: "md:text-2xl text-xl",
            h3: "md:text-xl text-base",
            h4: "md:text-base text-sm"
        },
        noOfLines: {
            1: "line-clamp-1",
            2: "line-clamp-2",
            3: "line-clamp-3",
            4: "line-clamp-4",
            5: "line-clamp-5",
            6: "line-clamp-6",
            7: "line-clamp-7",
            8: "line-clamp-8",
            9: "line-clamp-9",
            10: "line-clamp-10"
        }
    },
    defaultVariants: {
        size: "h2"
    }
});
var Heading = (0, react_1.forwardRef)(function (_a, ref) {
    var _b = _a.as, as = _b === void 0 ? "h2" : _b, className = _a.className, noOfLines = _a.noOfLines, size = _a.size, children = _a.children, props = __rest(_a, ["as", "className", "noOfLines", "size", "children"]);
    var Component = as;
    return (<Component className={(0, cn_1.cn)(headingVariants({
            size: size,
            noOfLines: noOfLines,
            className: className
        }))} ref={ref} {...props}>
        {children}
      </Component>);
});
exports.Heading = Heading;
Heading.displayName = "Heading";
