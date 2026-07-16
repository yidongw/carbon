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
exports.Progress = void 0;
var ProgressPrimitive = require("@radix-ui/react-progress");
var react_1 = require("react");
var cn_1 = require("./utils/cn");
var Progress = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, indicatorClassName = _a.indicatorClassName, numerator = _a.numerator, denominator = _a.denominator, value = _a.value, props = __rest(_a, ["className", "indicatorClassName", "numerator", "denominator", "value"]);
    return (<ProgressPrimitive.Root ref={ref} className={(0, cn_1.cn)("relative h-4 w-full overflow-hidden rounded-full bg-muted min-w-[120px]", className)} {...props}>
      <ProgressPrimitive.Indicator className={(0, cn_1.cn)("h-full w-full flex-1 bg-emerald-500 transition-transform", indicatorClassName)} style={{ transform: "translateX(-".concat(100 - (value || 0), "%)") }}/>
      {numerator !== undefined && denominator !== undefined && (<span className="absolute text-[9px] tabular-nums text-foreground right-2 top-1/2 transform -translate-y-1/2">
          {numerator} of {denominator}
        </span>)}
    </ProgressPrimitive.Root>);
});
exports.Progress = Progress;
Progress.displayName = ProgressPrimitive.Root.displayName;
