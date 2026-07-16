"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScrollPosition = void 0;
var react_1 = require("react");
/**
 * A hook to track the scroll position of an element
 * @param {HTMLDivElement | (() => HTMLDivElement | undefined) | undefined} element - The element or an element getter to track the scroll position of
 * @returns {UseScrollPositionResult}
 */
var useScrollPosition = function (element) {
    var _a = (0, react_1.useState)(false), canScrollLeft = _a[0], setCanScrollLeft = _a[1];
    var _b = (0, react_1.useState)(false), canScrollRight = _b[0], setCanScrollRight = _b[1];
    (0, react_1.useEffect)(function () {
        var el = typeof element === "function" ? element() : element;
        if (el) {
            // Set initial scroll state
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth);
        }
        var scrollListener = function (e) {
            var _a;
            var _b = ((_a = e.target) !== null && _a !== void 0 ? _a : {}), scrollLeft = _b.scrollLeft, scrollWidth = _b.scrollWidth, clientWidth = _b.clientWidth;
            // Set updated scroll state
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        };
        var resizeListener = function () {
            if (el) {
                var scrollLeft = el.scrollLeft, scrollWidth = el.scrollWidth, clientWidth = el.clientWidth;
                // Set updated scroll state
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
            }
        };
        // Handle scrolling
        el === null || el === void 0 ? void 0 : el.addEventListener("scroll", scrollListener);
        // Handle window resizing
        window.addEventListener("resize", resizeListener);
        return function () {
            el === null || el === void 0 ? void 0 : el.removeEventListener("scroll", scrollListener);
            window.removeEventListener("resize", resizeListener);
        };
    }, [element]);
    return {
        canScrollLeft: canScrollLeft,
        canScrollRight: canScrollRight
    };
};
exports.useScrollPosition = useScrollPosition;
