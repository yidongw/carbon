"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnyVisible = useAnyVisible;
var react_1 = require("react");
/**
 * Returns `true` when at least one element matching `selector` inside
 * `containerRef` is intersecting the viewport.
 *
 * Returns `false` when disabled, when the container is missing, or when no
 * matched elements exist.
 */
function useAnyVisible(_a) {
    var containerRef = _a.containerRef, selector = _a.selector, _b = _a.enabled, enabled = _b === void 0 ? true : _b, _c = _a.threshold, threshold = _c === void 0 ? 0.1 : _c, _d = _a.deps, deps = _d === void 0 ? [] : _d;
    var _e = (0, react_1.useState)(false), anyVisible = _e[0], setAnyVisible = _e[1];
    (0, react_1.useEffect)(function () {
        if (!enabled) {
            setAnyVisible(false);
            return;
        }
        var root = containerRef.current;
        if (!root)
            return;
        var targets = root.querySelectorAll(selector);
        if (targets.length === 0) {
            setAnyVisible(false);
            return;
        }
        var visible = new Set();
        var obs = new IntersectionObserver(function (entries) {
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var e = entries_1[_i];
                if (e.isIntersecting)
                    visible.add(e.target);
                else
                    visible.delete(e.target);
            }
            setAnyVisible(visible.size > 0);
        }, { threshold: threshold });
        targets.forEach(function (t) {
            obs.observe(t);
        });
        return function () { return obs.disconnect(); };
    }, __spreadArray([enabled, selector, threshold, containerRef], deps, true));
    return anyVisible;
}
