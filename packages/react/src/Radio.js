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
exports.RadioGroupItem = exports.RadioGroup = void 0;
var RadioGroupPrimitive = require("@radix-ui/react-radio-group");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var cn_1 = require("./utils/cn");
var RadioGroup = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<RadioGroupPrimitive.Root className={(0, cn_1.cn)("grid gap-2", className)} {...props} ref={ref}/>);
});
exports.RadioGroup = RadioGroup;
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
var RadioGroupItem = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<RadioGroupPrimitive.Item ref={ref} className={(0, cn_1.cn)("aspect-square size-4 shrink-0 rounded-full border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:text-primary dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-primary-foreground", className)} {...props}>
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <lu_1.LuCircle className="h-2.5 w-2.5 fill-current text-current"/>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>);
});
exports.RadioGroupItem = RadioGroupItem;
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
