"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useIsMobile;
var react_1 = require("react");
var MOBILE_BREAKPOINT = 768;
// useLayoutEffect on the client (fires before paint, no flash),
// useEffect on the server (avoids SSR warning from useLayoutEffect).
var useBrowserLayoutEffect = typeof window !== "undefined" ? react_1.useLayoutEffect : react_1.useEffect;
function useIsMobile() {
    var _a = (0, react_1.useState)(undefined), isMobile = _a[0], setIsMobile = _a[1];
    useBrowserLayoutEffect(function () {
        var mql = window.matchMedia("(max-width: ".concat(MOBILE_BREAKPOINT - 1, "px)"));
        var onChange = function () {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return function () { return mql.removeEventListener("change", onChange); };
    }, []);
    return !!isMobile;
}
