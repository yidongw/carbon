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
exports.Switch = void 0;
var SwitchPrimitives = require("@radix-ui/react-switch");
var react_1 = require("react");
var cn_1 = require("./utils/cn");
var variations = {
    large: {
        container: "gap-x-2 rounded-md px-1 py-0.5",
        root: "h-6 w-11 p-0.5",
        thumb: "size-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        text: "text-sm"
    },
    small: {
        container: "gap-x-2 rounded px-0.5 py-0.5",
        root: "h-4 w-7 p-0.5",
        thumb: "size-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0",
        text: "text-xs"
    }
};
var Switch = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, label = _a.label, variant = _a.variant, props = __rest(_a, ["className", "label", "variant"]);
    var _b = variations[variant !== null && variant !== void 0 ? variant : "large"], container = _b.container, root = _b.root, thumb = _b.thumb, text = _b.text;
    return (<SwitchPrimitives.Root className={(0, cn_1.cn)("group flex items-center transition-colors focus-visible:outline-none", container, className)} {...props} ref={ref}>
      <div className={(0, cn_1.cn)("inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-all outline-none group-focus-visible:border-ring group-focus-visible:ring-[3px] group-focus-visible:ring-ring/50 group-disabled:cursor-not-allowed group-disabled:opacity-50 group-data-[state=checked]:bg-primary group-data-[state=unchecked]:bg-input dark:group-data-[state=unchecked]:bg-input/80", root)}>
        <SwitchPrimitives.Thumb className={(0, cn_1.cn)("pointer-events-none block rounded-full bg-background shadow-sm ring-1 ring-black/5 transition-transform duration-200 ease-out dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground", thumb)}/>
      </div>
      {label ? (<div className={(0, cn_1.cn)("cursor-pointer select-none whitespace-nowrap", text)}>
          {label}
        </div>) : null}
    </SwitchPrimitives.Root>);
});
exports.Switch = Switch;
Switch.displayName = SwitchPrimitives.Root.displayName;
