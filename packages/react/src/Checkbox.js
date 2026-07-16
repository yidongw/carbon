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
exports.Checkbox = void 0;
var CheckboxPrimitive = require("@radix-ui/react-checkbox");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var cn_1 = require("./utils/cn");
var Checkbox = (0, react_1.forwardRef)(function (_a, ref) {
    var isChecked = _a.isChecked, isIndeterminate = _a.isIndeterminate, className = _a.className, props = __rest(_a, ["isChecked", "isIndeterminate", "className"]);
    return (<CheckboxPrimitive.Root ref={ref} className={(0, cn_1.cn)("peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary", isIndeterminate && "bg-primary text-primary-foreground", className)} {...props} checked={typeof isChecked === "boolean" ? isChecked : props.checked}>
    <CheckboxPrimitive.Indicator className={(0, cn_1.cn)("grid place-content-center text-current transition-none")}>
      {isIndeterminate ? (<lu_1.LuMinus className="w-4 h-4"/>) : (<lu_1.LuCheck className="w-4 h-4"/>)}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>);
});
exports.Checkbox = Checkbox;
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
