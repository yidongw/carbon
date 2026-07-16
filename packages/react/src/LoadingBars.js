"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingBars = LoadingBars;
// Bar heights trace a hexagon silhouette: short at the ends, tallest in the
// middle. Each bar shimmers between `min` and `peak`, with a staggered delay so
// a wave travels across while the hexagon stays visible the whole time.
var BARS = [
    { peak: 24, min: 11 },
    { peak: 47, min: 21 },
    { peak: 70, min: 32 },
    { peak: 80, min: 36 },
    { peak: 70, min: 32 },
    { peak: 47, min: 21 },
    { peak: 24, min: 11 }
];
function LoadingBars() {
    return (<div className="flex items-center justify-center gap-[3px] h-20">
      {BARS.map(function (bar, i) { return (<div key={i} className="w-[9px] rounded-[2px] bg-primary" style={{
                height: bar.min,
                animationName: "loading-bars",
                animationDuration: "1.2s",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: "".concat(i * 0.1, "s"),
                "--peak": "".concat(bar.peak, "px"),
                "--min": "".concat(bar.min, "px")
            }}/>); })}
      <style>
        {"@keyframes loading-bars {\n              0%, 100% { height: var(--min); opacity: 0.4; }\n              50% { height: var(--peak); opacity: 1; }\n            }"}
      </style>
    </div>);
}
