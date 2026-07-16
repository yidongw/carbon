"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationProgress = NavigationProgress;
var react_1 = require("react");
var react_router_1 = require("react-router");
// Driven by React Router's useNavigation() — no external dependency.
// Renders the #nprogress .bar markup reusing styles/nprogress.css.
// Note: useNavigation() only reflects primary navigation, not background
// useFetcher loads, so silent autosaves/optimistic fetchers don't flash it.
function NavigationProgress() {
    var navigation = (0, react_router_1.useNavigation)();
    var active = navigation.state !== "idle";
    var _a = (0, react_1.useState)(false), visible = _a[0], setVisible = _a[1];
    var _b = (0, react_1.useState)(0), progress = _b[0], setProgress = _b[1]; // 0..100
    var trickle = (0, react_1.useRef)(null);
    var hide = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var clearTrickle = function () {
            if (trickle.current)
                clearInterval(trickle.current);
            trickle.current = null;
        };
        if (active) {
            if (hide.current)
                clearTimeout(hide.current);
            setVisible(true);
            // Jump in immediately, then trickle toward (but never reaching) 90%.
            setProgress(function (p) { return (p < 12 ? 12 : p); });
            clearTrickle();
            trickle.current = setInterval(function () {
                setProgress(function (p) { return (p >= 90 ? p : p + (90 - p) * 0.12); });
            }, 180);
        }
        else {
            clearTrickle();
            // Only "complete" if we actually started a bar.
            setVisible(function (wasVisible) {
                if (!wasVisible)
                    return false;
                setProgress(100);
                hide.current = setTimeout(function () {
                    setVisible(false);
                    setProgress(0);
                }, 240);
                return true;
            });
        }
        return clearTrickle;
    }, [active]);
    if (!visible)
        return null;
    var done = progress >= 100;
    return (<div id="nprogress" aria-hidden>
      <div className="bar" style={{
            transform: "translateX(".concat(progress - 100, "%)"),
            opacity: done ? 0 : 1,
            transition: done
                ? "transform 200ms ease, opacity 240ms ease 120ms"
                : "transform 200ms ease"
        }}/>
    </div>);
}
exports.default = NavigationProgress;
