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
exports.useMousePosition = void 0;
exports.MousePositionProvider = MousePositionProvider;
exports.Root = Root;
exports.Row = Row;
exports.Point = Point;
exports.Span = Span;
exports.EquallyDistribute = EquallyDistribute;
exports.FollowCursor = FollowCursor;
var utils_1 = require("@carbon/utils");
var react_1 = require("react");
var MousePositionContext = (0, react_1.createContext)(undefined);
function MousePositionProvider(_a) {
    var children = _a.children;
    var ref = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(undefined), position = _b[0], setPosition = _b[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var handleMouseMove = (0, react_1.useCallback)(function (e) {
        if (!ref.current) {
            setPosition(undefined);
            return;
        }
        var _a = ref.current.getBoundingClientRect(), top = _a.top, left = _a.left, width = _a.width, height = _a.height;
        var x = (e.clientX - left) / width;
        var y = (e.clientY - top) / height;
        if (x < 0 || x > 1 || y < 0 || y > 1) {
            setPosition(undefined);
            return;
        }
        setPosition({ x: x, y: y });
    }, [ref.current]);
    return (<div ref={ref} onMouseEnter={handleMouseMove} onMouseLeave={function () { return setPosition(undefined); }} onMouseMove={handleMouseMove} style={{ width: "100%", height: "100%" }}>
      <MousePositionContext.Provider value={position}>
        {children}
      </MousePositionContext.Provider>
    </div>);
}
var useMousePosition = function () {
    return (0, react_1.useContext)(MousePositionContext);
};
exports.useMousePosition = useMousePosition;
var TimelineContext = (0, react_1.createContext)({});
function useTimeline() {
    return (0, react_1.useContext)(TimelineContext);
}
/** The main element that determines the dimensions for all sub-elements */
function Root(_a) {
    var _b = _a.startMs, startMs = _b === void 0 ? 0 : _b, durationMs = _a.durationMs, scale = _a.scale, minWidth = _a.minWidth, maxWidth = _a.maxWidth, children = _a.children, className = _a.className;
    var pixelWidth = calculatePixelWidth(minWidth, maxWidth, scale);
    return (<TimelineContext.Provider value={{ startMs: startMs, durationMs: durationMs }}>
      <div className={className} style={{
            position: "relative",
            width: "".concat(pixelWidth, "px")
        }}>
        <MousePositionProvider>{children}</MousePositionProvider>
      </div>
    </TimelineContext.Provider>);
}
/** This simply acts as a container, with position relative.
 *  This allows you to nest "Rows" and put heights on them */
function Row(_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<div {...props} className={className} style={__assign(__assign({}, props.style), { position: "relative" })}>
      {children}
    </div>);
}
/** A point in time, it has no duration */
function Point(_a) {
    var ms = _a.ms, className = _a.className, children = _a.children;
    var _b = useTimeline(), startMs = _b.startMs, durationMs = _b.durationMs;
    var position = (0, utils_1.inverseLerp)(startMs, startMs + durationMs, ms);
    return (<div className={className} style={{
            position: "absolute",
            left: "".concat(position * 100, "%")
        }}>
      {children && children(ms)}
    </div>);
}
/** As span of time with a start and duration */
function Span(_a) {
    var startMs = _a.startMs, durationMs = _a.durationMs, className = _a.className, children = _a.children;
    var _b = useTimeline(), rootStartMs = _b.startMs, rootDurationMs = _b.durationMs;
    var position = (0, utils_1.inverseLerp)(rootStartMs, rootStartMs + rootDurationMs, startMs);
    var width = (0, utils_1.inverseLerp)(rootStartMs, rootStartMs + rootDurationMs, startMs + durationMs) - position;
    return (<div className={className} style={{
            position: "absolute",
            left: "".concat(position * 100, "%"),
            width: "".concat(width * 100, "%")
        }}>
      {children}
    </div>);
}
/** Render a child equally distributed across the duration */
function EquallyDistribute(_a) {
    var count = _a.count, children = _a.children;
    var _b = useTimeline(), startMs = _b.startMs, durationMs = _b.durationMs;
    return (<>
      {Array.from({ length: count }).map(function (_, index) {
            var ms = startMs + (durationMs / (count - 1)) * index;
            return <react_1.Fragment key={index}>{children(ms, index)}</react_1.Fragment>;
        })}
    </>);
}
/** Renders a child that follows the cursor */
function FollowCursor(_a) {
    var children = _a.children;
    var _b = useTimeline(), startMs = _b.startMs, durationMs = _b.durationMs;
    var relativeMousePosition = (0, exports.useMousePosition)();
    var ms = (relativeMousePosition === null || relativeMousePosition === void 0 ? void 0 : relativeMousePosition.x)
        ? (0, utils_1.lerp)(startMs, startMs + durationMs, relativeMousePosition.x)
        : undefined;
    if (ms === undefined)
        return null;
    return (<div style={{
            position: "absolute",
            top: 0,
            left: relativeMousePosition ? "".concat((relativeMousePosition === null || relativeMousePosition === void 0 ? void 0 : relativeMousePosition.x) * 100, "%") : 0,
            height: "100%",
            pointerEvents: "none"
        }}>
      {children(ms)}
    </div>);
}
/** Gives the total width of the root */
function calculatePixelWidth(minWidth, maxWidth, scale) {
    return (0, utils_1.lerp)(minWidth, maxWidth, scale);
}
