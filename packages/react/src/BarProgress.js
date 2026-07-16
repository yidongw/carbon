"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarProgress = BarProgress;
var react_1 = require("react");
var cn_1 = require("./utils/cn");
var BAR_WIDTH = 2;
var BAR_HEIGHT = 14;
var BAR_GAP = 3;
/**
 * Interpolates between two [r,g,b] colors at a given ratio (0-1).
 */
function lerpColor(a, b, t) {
    var r = Math.round(a[0] + (b[0] - a[0]) * t);
    var g = Math.round(a[1] + (b[1] - a[1]) * t);
    var bl = Math.round(a[2] + (b[2] - a[2]) * t);
    return "rgb(".concat(r, ",").concat(g, ",").concat(bl, ")");
}
// red -> yellow -> green
var GRADIENT_STOPS = [
    { pos: 0, color: [239, 68, 68] }, // red-500
    { pos: 0.5, color: [234, 179, 8] }, // yellow-500
    { pos: 0.8, color: [34, 197, 94] }, // green-500
    { pos: 1, color: [34, 197, 94] } // green-500
];
// green -> yellow -> red (inverted)
var GRADIENT_STOPS_INVERTED = [
    { pos: 0, color: [34, 197, 94] }, // green-500
    { pos: 0.2, color: [34, 197, 94] }, // green-500
    { pos: 0.5, color: [234, 179, 8] }, // yellow-500
    { pos: 0.8, color: [239, 68, 68] }, // red-500
    { pos: 1, color: [239, 68, 68] } // red-500
];
function getGradientColor(ratio, stops) {
    var clamped = Math.min(Math.max(ratio, 0), 1);
    for (var i = 0; i < stops.length - 1; i++) {
        var curr = stops[i];
        var next = stops[i + 1];
        if (clamped >= curr.pos && clamped <= next.pos) {
            var t = (clamped - curr.pos) / (next.pos - curr.pos);
            return lerpColor(curr.color, next.color, t);
        }
    }
    return lerpColor(stops[0].color, stops[0].color, 0);
}
function BarProgress(_a) {
    var progress = _a.progress, _b = _a.max, max = _b === void 0 ? 100 : _b, label = _a.label, value = _a.value, _c = _a.gradient, gradient = _c === void 0 ? false : _c, _d = _a.invertGradient, invertGradient = _d === void 0 ? false : _d, segments = _a.segments, _e = _a.barHeight, barHeight = _e === void 0 ? BAR_HEIGHT : _e, className = _a.className, _f = _a.activeClassName, activeClassName = _f === void 0 ? "bg-emerald-500" : _f, _g = _a.inactiveClassName, inactiveClassName = _g === void 0 ? "bg-foreground/15" : _g;
    var containerRef = (0, react_1.useRef)(null);
    // Start with a placeholder count so bars are visible on first paint (avoids flash on remount).
    var _h = (0, react_1.useState)(1), barCount = _h[0], setBarCount = _h[1];
    var calculateBars = (0, react_1.useCallback)(function () {
        if (!containerRef.current)
            return;
        var width = containerRef.current.clientWidth;
        // Total width per bar = BAR_WIDTH + BAR_GAP, minus one trailing gap
        // width = bars * BAR_WIDTH + (bars - 1) * BAR_GAP
        // width = bars * (BAR_WIDTH + BAR_GAP) - BAR_GAP
        // bars = floor((width + BAR_GAP) / (BAR_WIDTH + BAR_GAP))
        var count = Math.max(Math.floor((width + BAR_GAP) / (BAR_WIDTH + BAR_GAP)), 1);
        setBarCount(function (prev) { return (prev === count ? prev : count); });
    }, []);
    (0, react_1.useLayoutEffect)(function () {
        var el = containerRef.current;
        if (!el)
            return;
        calculateBars();
        var observer = new ResizeObserver(calculateBars);
        observer.observe(el);
        return function () { return observer.disconnect(); };
    }, [calculateBars]);
    var clampedProgress = Math.min(Math.max(progress, 0), max);
    var percentage = (clampedProgress / max) * 100;
    var activeBars = Math.round((clampedProgress / max) * barCount);
    var hasHeader = label || value;
    var getBarClassName = function (i) {
        if (segments && barCount > 0) {
            var cumulative = 0;
            for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
                var seg = segments_1[_i];
                var segBars = Math.round((seg.value / max) * barCount);
                cumulative += segBars;
                if (i < cumulative)
                    return seg.className;
            }
            return inactiveClassName;
        }
        var isActive = i < activeBars;
        if (gradient && isActive)
            return "";
        if (isActive)
            return activeClassName;
        return inactiveClassName;
    };
    var getBarStyle = function (i) {
        if (segments)
            return undefined;
        var isActive = i < activeBars;
        if (isActive && gradient && barCount > 0) {
            return {
                backgroundColor: getGradientColor(i / (barCount - 1 || 1), invertGradient ? GRADIENT_STOPS_INVERTED : GRADIENT_STOPS)
            };
        }
        return undefined;
    };
    return (<div className={(0, cn_1.cn)("w-full", className)}>
      {hasHeader && (<div className="mb-0.5 flex items-baseline justify-between">
          {label ? (<span className="text-sm font-medium text-foreground">{label}</span>) : (<div />)}
          {value && (<span className="text-xs font-mono tabular-nums text-muted-foreground">
              {value}
            </span>)}
        </div>)}
      <div ref={containerRef} role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={max} aria-label={label !== null && label !== void 0 ? label : "Progress"} className="flex w-full items-center gap-[3px]">
        {barCount > 0 &&
            Array.from({ length: barCount }, function (_, i) { return (<span key={i} aria-hidden="true" className={(0, cn_1.cn)("shrink-0 rounded-[2px] transition-colors duration-200", getBarClassName(i))} style={__assign({ width: BAR_WIDTH, height: barHeight }, getBarStyle(i))}/>); })}
        <span className="sr-only">{Math.round(percentage)}%</span>
      </div>
    </div>);
}
