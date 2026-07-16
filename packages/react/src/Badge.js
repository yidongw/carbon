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
exports.badgeVariants = exports.BadgeCloseButton = exports.Badge = void 0;
var class_variance_authority_1 = require("class-variance-authority");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var cn_1 = require("./utils/cn");
var badgeVariants = (0, class_variance_authority_1.cva)("inline-flex items-center rounded-md px-2 min-h-[1.25rem] font-medium transition-[color,box-shadow] border focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 font-bold text-[11px] uppercase truncate tracking-tight whitespace-nowrap", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow:sm dark:shadow hover:bg-primary/80",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "bg-destructive text-destructive-foreground shadow:sm dark:shadow hover:bg-destructive/80",
            outline: "text-foreground border border-border",
            green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-500/20",
            yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-400 border-yellow-500/20",
            orange: "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-400 border-orange-500/20",
            red: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400 border-red-500/20",
            blue: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400 border-blue-500/20",
            gray: "bg-[#e3e2e080] text-[#32302c] dark:bg-[#373737] dark:text-white hover:bg-[#e3e2e0] dark:hover:bg-[#5a5a5a] ",
            purple: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-400 border-violet-500/20"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
exports.badgeVariants = badgeVariants;
var Badge = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, variant = _a.variant, props = __rest(_a, ["className", "variant"]);
    return (<div ref={ref} className={(0, cn_1.cn)(badgeVariants({ variant: variant }), "min-w-0", className)} {...props}/>);
});
exports.Badge = Badge;
Badge.displayName = "Badge";
var BadgeCloseButton = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<button className={(0, cn_1.cn)("relative ml-1 rounded-full outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 text-muted-foreground hover:text-foreground flex-shrink-0 before:absolute before:-inset-2 before:content-['']", className)} {...props}>
    <lu_1.LuX className="h-3 w-3"/>
  </button>);
});
exports.BadgeCloseButton = BadgeCloseButton;
BadgeCloseButton.displayName = "BadgeCloseButton";
