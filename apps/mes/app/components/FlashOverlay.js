"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flashOverlay = void 0;
exports.FlashOverlay = FlashOverlay;
var react_1 = require("react");
var FlashOverlayManager = /** @class */ (function () {
    function FlashOverlayManager() {
        this.listeners = new Set();
    }
    FlashOverlayManager.prototype.flash = function (variant) {
        // biome-ignore lint/suspicious/useIterableCallbackReturn: suppressed due to migration
        this.listeners.forEach(function (listener) { return listener(variant); });
    };
    FlashOverlayManager.prototype.subscribe = function (listener) {
        var _this = this;
        this.listeners.add(listener);
        return function () { return _this.listeners.delete(listener); };
    };
    return FlashOverlayManager;
}());
exports.flashOverlay = new FlashOverlayManager();
function FlashOverlay() {
    var _a = (0, react_1.useState)(null), activeVariant = _a[0], setActiveVariant = _a[1];
    var _b = (0, react_1.useState)(false), isVisible = _b[0], setIsVisible = _b[1];
    var audioRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var timer = null;
        var unsubscribe = exports.flashOverlay.subscribe(function (variant) {
            setActiveVariant(variant);
            setIsVisible(true);
            // Play victory sound for success
            if (variant === "success") {
                if (!audioRef.current) {
                    audioRef.current = new Audio("/victory.mp3");
                }
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(function () {
                    // Ignore errors if audio can't play
                });
            }
            if (timer)
                clearTimeout(timer);
            timer = setTimeout(function () {
                setIsVisible(false);
                setActiveVariant(null);
            }, 300);
        });
        return function () {
            if (timer)
                clearTimeout(timer);
            unsubscribe();
        };
    }, []);
    if (!activeVariant)
        return null;
    var gradientColor = activeVariant === "success" ? "34, 197, 94" : "239, 68, 68";
    return (<div className={"fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ".concat(isVisible ? "opacity-100" : "opacity-0")} style={{
            background: "radial-gradient(circle, transparent 20%, rgba(".concat(gradientColor, ", 0.6) 100%)")
        }}/>);
}
