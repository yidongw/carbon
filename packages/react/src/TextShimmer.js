"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextShimmer = void 0;
var framer_motion_1 = require("framer-motion");
var react_1 = require("react");
var cn_1 = require("./utils/cn");
function TextShimmerComponent(_a) {
    var children = _a.children, _b = _a.as, Component = _b === void 0 ? "p" : _b, className = _a.className, _c = _a.duration, duration = _c === void 0 ? 2 : _c, _d = _a.spread, spread = _d === void 0 ? 2 : _d;
    var MotionComponent = framer_motion_1.motion.create(Component);
    var dynamicSpread = (0, react_1.useMemo)(function () {
        return children.length * spread;
    }, [children, spread]);
    return (<MotionComponent className={(0, cn_1.cn)("relative inline-block bg-[length:250%_100%,auto] bg-clip-text", "text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]", "[background-repeat:no-repeat,padding-box] [--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]", "dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]", className)} initial={{ backgroundPosition: "100% center" }} animate={{ backgroundPosition: "0% center" }} transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: duration,
            ease: "linear"
        }} style={{
            "--spread": "".concat(dynamicSpread, "px"),
            backgroundImage: "var(--bg), linear-gradient(var(--base-color), var(--base-color))"
        }}>
      {children}
    </MotionComponent>);
}
exports.TextShimmer = (0, react_1.memo)(TextShimmerComponent);
