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
exports.AlertTitle = exports.AlertDescription = exports.Alert = void 0;
var class_variance_authority_1 = require("class-variance-authority");
var react_1 = require("react");
var cn_1 = require("./utils/cn");
var alertVariants = (0, class_variance_authority_1.cva)("relative flex flex-col gap-1.5 w-full rounded-lg border p-3 transition-colors [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-[10px] [&>svg]:text-foreground dark:inset-ring dark:inset-ring-white/5", {
    variants: {
        variant: {
            default: "bg-background text-foreground",
            success: "bg-gradient-fade border-emerald-600/70 from-emerald-600/20 text-emerald-700 [&>svg]:text-emerald-600 dark:text-emerald-100 dark:from-emerald-600/20 dark:border-emerald-500/30 dark:[&>svg]:text-emerald-400",
            info: "bg-gradient-fade border-blue-500/70 from-blue-500/20 text-blue-800 [&>svg]:text-blue-600 dark:text-blue-100 dark:from-blue-500/20 dark:border-blue-500/30 dark:[&>svg]:text-blue-400",
            warning: "bg-gradient-fade border-amber-500/70 from-amber-500/20 text-amber-800 [&>svg]:text-amber-600 dark:text-amber-100 dark:from-amber-500/20 dark:border-amber-500/30 dark:[&>svg]:text-amber-400",
            destructive: "bg-gradient-fade border-red-500/70 from-red-500/20 text-destructive [&>svg]:text-destructive dark:text-red-100 dark:from-red-500/20 dark:border-red-500/30 dark:[&>svg]:text-red-400"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
var Alert = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, variant = _a.variant, props = __rest(_a, ["className", "variant"]);
    return (<div ref={ref} role="alert" className={(0, cn_1.cn)(alertVariants({ variant: variant }), className)} {...props}/>);
});
exports.Alert = Alert;
Alert.displayName = "Alert";
var AlertTitle = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<h5 ref={ref} className={(0, cn_1.cn)("font-medium leading-none text-sm", className)} {...props}/>);
});
exports.AlertTitle = AlertTitle;
AlertTitle.displayName = "AlertTitle";
var AlertDescription = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} className={(0, cn_1.cn)("text-xs [&_p]:leading-relaxed", className)} {...props}/>);
});
exports.AlertDescription = AlertDescription;
AlertDescription.displayName = "AlertDescription";
