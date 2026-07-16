"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaveScrollRail = WaveScrollRail;
var react_1 = require("react");
var N = 46;
function WaveScrollRail() {
    var railRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var rail = railRef.current;
        if (!rail)
            return;
        var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
        var dashes = [];
        for (var i = 0; i < N; i++) {
            var d = document.createElement("div");
            d.className = "dash";
            rail.appendChild(d);
            dashes.push(d);
        }
        var crest = 0;
        var hoverT = null;
        var scrubbing = false;
        var raf = 0;
        var t0 = performance.now();
        var fracAt = function (clientY) {
            var r = rail.getBoundingClientRect();
            return Math.max(0, Math.min(1, (clientY - r.top) / r.height));
        };
        var scrollP = function () {
            var h = document.documentElement.scrollHeight - window.innerHeight;
            return h > 0 ? Math.max(0, Math.min(1, window.scrollY / h)) : 0;
        };
        var scrollToFrac = function (t, behavior) {
            var h = document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo({ top: t * h, behavior: behavior });
        };
        // Click jumps (smooth); dragging scrubs (instant follow).
        var onDown = function (e) {
            scrubbing = true;
            rail.setPointerCapture(e.pointerId);
            hoverT = fracAt(e.clientY);
            scrollToFrac(hoverT, "smooth");
        };
        var onMove = function (e) {
            hoverT = fracAt(e.clientY);
            if (scrubbing)
                scrollToFrac(hoverT, "auto");
        };
        var onUp = function (e) {
            var _a;
            scrubbing = false;
            (_a = rail.releasePointerCapture) === null || _a === void 0 ? void 0 : _a.call(rail, e.pointerId);
        };
        var onLeave = function () {
            if (!scrubbing)
                hoverT = null;
        };
        rail.addEventListener("pointerdown", onDown);
        rail.addEventListener("pointermove", onMove);
        rail.addEventListener("pointerup", onUp);
        rail.addEventListener("pointerleave", onLeave);
        var frame = function (now) {
            var time = (now - t0) / 1000;
            var target = hoverT != null ? hoverT : scrollP();
            crest += (target - crest) * 0.12;
            var p = scrollP();
            for (var i = 0; i < N; i++) {
                var tt = i / (N - 1);
                var dd = tt - crest;
                var env = Math.exp(-(dd * dd) * 55);
                var ripple = RM
                    ? 0
                    : 0.5 + 0.5 * Math.sin(time * 2 - tt * Math.PI * 7);
                var w = 5 + env * 15 + ripple * env * 3 + ripple * 1;
                var d = dashes[i];
                var passed = tt <= p + 0.002;
                d.style.width = "".concat(w.toFixed(1), "px");
                d.style.background =
                    env > 0.5
                        ? "var(--acc)"
                        : passed
                            ? "hsl(var(--foreground))"
                            : "hsl(var(--border))";
                d.style.opacity = String((passed ? 0.7 : 0.45) + 0.3 * env);
            }
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        return function () {
            cancelAnimationFrame(raf);
            rail.removeEventListener("pointerdown", onDown);
            rail.removeEventListener("pointermove", onMove);
            rail.removeEventListener("pointerup", onUp);
            rail.removeEventListener("pointerleave", onLeave);
            for (var _i = 0, dashes_1 = dashes; _i < dashes_1.length; _i++) {
                var d = dashes_1[_i];
                d.remove();
            }
        };
    }, []);
    return <div className="waverail" ref={railRef} aria-hidden="true"/>;
}
