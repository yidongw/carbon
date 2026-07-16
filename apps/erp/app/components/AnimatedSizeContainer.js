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
exports.AnimatedSizeContainer = void 0;
var react_1 = require("@carbon/react");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var react_use_measure_1 = require("react-use-measure");
/**
 * A container with animated width and height (each optional) based on children dimensions
 */
var AnimatedSizeContainer = (0, react_2.forwardRef)(function (_a, forwardedRef) {
    var _b, _c;
    var _d = _a.width, width = _d === void 0 ? false : _d, _e = _a.height, height = _e === void 0 ? false : _e, className = _a.className, transition = _a.transition, children = _a.children, rest = __rest(_a, ["width", "height", "className", "transition", "children"]);
    var _f = (0, react_use_measure_1.default)(), containerRef = _f[0], bounds = _f[1];
    return (<framer_motion_1.motion.div ref={forwardedRef} className={(0, react_1.cn)("overflow-hidden p-1", className)} animate={{
            width: width ? ((_b = bounds === null || bounds === void 0 ? void 0 : bounds.width) !== null && _b !== void 0 ? _b : "auto") : "auto",
            height: height ? ((_c = bounds === null || bounds === void 0 ? void 0 : bounds.height) !== null && _c !== void 0 ? _c : "auto") : "auto"
        }} transition={transition !== null && transition !== void 0 ? transition : { type: "spring", duration: 0.3 }} {...rest}>
        <div ref={containerRef} className={(0, react_1.cn)(height && "h-max", width && "w-max")}>
          {children}
        </div>
      </framer_motion_1.motion.div>);
});
exports.AnimatedSizeContainer = AnimatedSizeContainer;
AnimatedSizeContainer.displayName = "AnimatedSizeContainer";
