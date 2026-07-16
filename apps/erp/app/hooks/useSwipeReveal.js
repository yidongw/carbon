"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SWIPE_OPEN_OFFSET = void 0;
exports.useSwipeReveal = useSwipeReveal;
var react_1 = require("react");
var DEFAULT_SWIPE_OPEN_OFFSET = 80;
exports.DEFAULT_SWIPE_OPEN_OFFSET = DEFAULT_SWIPE_OPEN_OFFSET;
var SWIPE_COMMIT_RATIO = 0.35;
var SWIPE_AXIS_THRESHOLD = 8;
function useSwipeReveal(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.openOffset, openOffset = _c === void 0 ? DEFAULT_SWIPE_OPEN_OFFSET : _c, onOpen = _b.onOpen;
    var _d = (0, react_1.useState)(0), offset = _d[0], setOffset = _d[1];
    var _e = (0, react_1.useState)(false), isDragging = _e[0], setIsDragging = _e[1];
    var touchStart = (0, react_1.useRef)(null);
    var startOffset = (0, react_1.useRef)(0);
    var isHorizontalSwipe = (0, react_1.useRef)(false);
    var didSwipe = (0, react_1.useRef)(false);
    var close = (0, react_1.useCallback)(function () {
        setIsDragging(false);
        setOffset(0);
    }, []);
    var onTouchStart = (0, react_1.useCallback)(function (event) {
        var touch = event.touches[0];
        if (!touch)
            return;
        touchStart.current = { x: touch.clientX, y: touch.clientY };
        startOffset.current = 0;
        isHorizontalSwipe.current = false;
        didSwipe.current = false;
        setIsDragging(false);
    }, []);
    var onTouchMove = (0, react_1.useCallback)(function (event) {
        var touch = event.touches[0];
        var start = touchStart.current;
        if (!touch || !start)
            return;
        var deltaX = touch.clientX - start.x;
        var deltaY = touch.clientY - start.y;
        if (!isHorizontalSwipe.current) {
            if (Math.abs(deltaX) < SWIPE_AXIS_THRESHOLD &&
                Math.abs(deltaY) < SWIPE_AXIS_THRESHOLD) {
                return;
            }
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                touchStart.current = null;
                return;
            }
            isHorizontalSwipe.current = true;
            setIsDragging(true);
        }
        didSwipe.current = true;
        var nextOffset = Math.max(-openOffset, Math.min(0, startOffset.current + deltaX));
        setOffset(nextOffset);
    }, [openOffset]);
    var onTouchEnd = (0, react_1.useCallback)(function () {
        setIsDragging(false);
        if (!isHorizontalSwipe.current) {
            touchStart.current = null;
            return;
        }
        setOffset(function (current) {
            if (Math.abs(current) > openOffset * SWIPE_COMMIT_RATIO) {
                onOpen === null || onOpen === void 0 ? void 0 : onOpen();
            }
            return 0;
        });
        touchStart.current = null;
        isHorizontalSwipe.current = false;
    }, [onOpen, openOffset]);
    var onTouchCancel = (0, react_1.useCallback)(function () {
        touchStart.current = null;
        isHorizontalSwipe.current = false;
        didSwipe.current = false;
        setIsDragging(false);
        setOffset(0);
    }, []);
    return {
        close: close,
        didSwipe: didSwipe,
        isDragging: isDragging,
        offset: offset,
        onTouchCancel: onTouchCancel,
        onTouchEnd: onTouchEnd,
        onTouchMove: onTouchMove,
        onTouchStart: onTouchStart
    };
}
