"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollArea = ScrollArea;
var react_1 = require("react");
var TRACK_COLOR = [208, 209, 210];
var ACTIVE_COLOR = [0, 176, 255];
function ScrollArea(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? "" : _b, _c = _a.scrollbarOffset, scrollbarOffset = _c === void 0 ? 20 : _c, onScrollElement = _a.onScrollElement;
    var scrollRef = (0, react_1.useRef)(null);
    var trackRef = (0, react_1.useRef)(null);
    var _d = (0, react_1.useState)(0), thumbPos = _d[0], setThumbPos = _d[1];
    var _e = (0, react_1.useState)(0), dotCount = _e[0], setDotCount = _e[1];
    var _f = (0, react_1.useState)(null), hoverDot = _f[0], setHoverDot = _f[1];
    (0, react_1.useLayoutEffect)(function () {
        onScrollElement === null || onScrollElement === void 0 ? void 0 : onScrollElement(scrollRef.current);
        return function () { return onScrollElement === null || onScrollElement === void 0 ? void 0 : onScrollElement(null); };
    }, [onScrollElement]);
    var recalc = (0, react_1.useCallback)(function () {
        var el = scrollRef.current;
        var track = trackRef.current;
        if (!el || !track)
            return;
        var scrollTop = el.scrollTop, scrollHeight = el.scrollHeight, clientHeight = el.clientHeight;
        var dots = Math.floor(track.clientHeight / 7);
        setDotCount(dots);
        if (scrollHeight <= clientHeight) {
            setThumbPos(0);
        }
        else {
            setThumbPos(Math.round((scrollTop / (scrollHeight - clientHeight)) * (dots - 1)));
        }
    }, []);
    var scrollTo = (0, react_1.useCallback)(function (y) {
        var el = scrollRef.current;
        var track = trackRef.current;
        if (!el || !track)
            return;
        var rect = track.getBoundingClientRect();
        var pct = Math.max(0, Math.min(1, (y - rect.top) / rect.height));
        var max = el.scrollHeight - el.clientHeight;
        if (max <= 0)
            return;
        el.scrollTop = pct * max;
    }, []);
    var handlePointerDown = (0, react_1.useCallback)(function (e) {
        e.preventDefault();
        var target = e.currentTarget;
        target.setPointerCapture(e.pointerId);
        scrollTo(e.clientY);
        var onMove = function (ev) { return scrollTo(ev.clientY); };
        var onUp = function (ev) {
            target.releasePointerCapture(ev.pointerId);
            target.removeEventListener("pointermove", onMove);
            target.removeEventListener("pointerup", onUp);
            target.removeEventListener("pointercancel", onUp);
        };
        target.addEventListener("pointermove", onMove);
        target.addEventListener("pointerup", onUp);
        target.addEventListener("pointercancel", onUp);
    }, [scrollTo]);
    (0, react_1.useEffect)(function () {
        var el = scrollRef.current;
        if (!el)
            return;
        recalc();
        el.addEventListener("scroll", recalc, { passive: true });
        var observer = new ResizeObserver(recalc);
        observer.observe(el);
        return function () {
            el.removeEventListener("scroll", recalc);
            observer.disconnect();
        };
    }, [recalc]);
    var getDotIndex = (0, react_1.useCallback)(function (clientY) {
        var track = trackRef.current;
        if (!track || dotCount <= 0)
            return null;
        var rect = track.getBoundingClientRect();
        return Math.round(Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)) * (dotCount - 1));
    }, [dotCount]);
    return (<div className="flex-1 min-w-0 flex min-h-0 my-8">
      <div ref={scrollRef} className={"flex-1 min-w-0 min-h-0 overflow-y-auto scrollbar-none ".concat(className)} style={{ paddingRight: "".concat(scrollbarOffset, "px") }}>
        {children}
      </div>

      {/* Custom magnetic tick scrollbar */}
      <div className="shrink-0 hidden min-[1000px]:block">
        <div ref={trackRef} onPointerDown={handlePointerDown} onPointerMove={function (e) { return setHoverDot(getDotIndex(e.clientY)); }} onPointerLeave={function () { return setHoverDot(null); }} className="h-[80vh] flex flex-col items-end cursor-pointer touch-none" style={{ gap: "5px", width: 14 }}>
          {Array.from({ length: dotCount }).map(function (_, i) {
            var dist = Math.abs(i - thumbPos) / 3;
            var isNear = dist <= 1;
            var influence = isNear ? Math.pow(Math.cos((dist * Math.PI) / 2), 2) : 0;
            var isHovered = hoverDot === i;
            var lerp = function (a, b) { return Math.round(a + (b - a) * influence); };
            var color = isHovered
                ? "rgb(".concat(ACTIVE_COLOR[0], ", ").concat(ACTIVE_COLOR[1], ", ").concat(ACTIVE_COLOR[2], ")")
                : isNear
                    ? "rgb(".concat(lerp(TRACK_COLOR[0], ACTIVE_COLOR[0]), ", ").concat(lerp(TRACK_COLOR[1], ACTIVE_COLOR[1]), ", ").concat(lerp(TRACK_COLOR[2], ACTIVE_COLOR[2]), ")")
                    : "rgba(32, 32, 32, 0.16)";
            return (<span key={i} className="shrink-0 rounded-full" style={{
                    width: isHovered ? 14 : isNear ? 7 + 7 * influence : 7,
                    height: 2,
                    background: color,
                    transition: "background 120ms linear, width 120ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}/>);
        })}
        </div>
      </div>
    </div>);
}
