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
var useResizeObserver_1 = require("~/hooks/useResizeObserver");
/**
 * A container with animated width and height (each optional) based on children dimensions
 */
var AnimatedSizeContainer = (0, react_2.forwardRef)(function (_a, forwardedRef) {
    var _b, _c, _d, _e;
    var _f = _a.width, width = _f === void 0 ? false : _f, _g = _a.height, height = _g === void 0 ? false : _g, className = _a.className, transition = _a.transition, children = _a.children, rest = __rest(_a, ["width", "height", "className", "transition", "children"]);
    var containerRef = (0, react_2.useRef)(null);
    var resizeObserverEntry = (0, useResizeObserver_1.useResizeObserver)(containerRef);
    return (<framer_motion_1.motion.div ref={forwardedRef} className={(0, react_1.cn)("overflow-hidden", className)} animate={{
            width: width
                ? ((_c = (_b = resizeObserverEntry === null || resizeObserverEntry === void 0 ? void 0 : resizeObserverEntry.contentRect) === null || _b === void 0 ? void 0 : _b.width) !== null && _c !== void 0 ? _c : "auto")
                : "auto",
            height: height
                ? ((_e = (_d = resizeObserverEntry === null || resizeObserverEntry === void 0 ? void 0 : resizeObserverEntry.contentRect) === null || _d === void 0 ? void 0 : _d.height) !== null && _e !== void 0 ? _e : "auto")
                : "auto"
        }} transition={transition !== null && transition !== void 0 ? transition : { type: "spring", duration: 0.3 }} {...rest}>
        <div ref={containerRef} className={(0, react_1.cn)(height && "h-max", width && "w-max")}>
          {children}
        </div>
      </framer_motion_1.motion.div>);
});
exports.AnimatedSizeContainer = AnimatedSizeContainer;
AnimatedSizeContainer.displayName = "AnimatedSizeContainer";
