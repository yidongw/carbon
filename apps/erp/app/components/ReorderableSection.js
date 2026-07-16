"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.useReorderableOrder = useReorderableOrder;
exports.ReorderableSectionGroup = ReorderableSectionGroup;
exports.ReorderableSection = ReorderableSection;
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
/** Nearest vertically-scrollable ancestor, falling back to the page scroller. */
function findScrollContainer(element) {
    var _a;
    var current = (_a = element === null || element === void 0 ? void 0 : element.parentElement) !== null && _a !== void 0 ? _a : null;
    while (current) {
        var overflowY = window.getComputedStyle(current).overflowY;
        if ((overflowY === "auto" || overflowY === "scroll") &&
            current.scrollHeight > current.clientHeight) {
            return current;
        }
        current = current.parentElement;
    }
    return document.scrollingElement;
}
// How close (px) to an edge before auto-scroll kicks in, and the max px/frame.
var AUTO_SCROLL_THRESHOLD = 100;
var AUTO_SCROLL_MAX_SPEED = 22;
/**
 * While a section is being dragged, scrolls the surrounding container when the
 * pointer nears its top or bottom edge — faster the closer to the edge.
 *
 * framer-motion drives both the dragged item's position AND its reorder
 * detection from the pointer (it only re-checks order on pointer move, using the
 * drag transform value). A custom scroll container is invisible to it, so we
 * hide the real pointer moves (capture phase, before framer's window listener)
 * and relay a single synthetic stream shifted down by the scroll offset.
 * Shifting the pointer by the scroll keeps the card under the cursor, and
 * relaying it every frame makes framer re-run reorder while the list scrolls so
 * the other cards open/close the gap.
 *
 * Returns a `start` callback to invoke on drag start; it cleans itself up on
 * pointer up / cancel / unmount.
 */
function useDragAutoScroll() {
    var frameRef = (0, react_1.useRef)(null);
    var containerRef = (0, react_1.useRef)(null);
    var pointerRef = (0, react_1.useRef)(null);
    var pointerMetaRef = (0, react_1.useRef)({
        pointerId: 1,
        pointerType: "mouse",
        isPrimary: true
    });
    // Total scroll applied since drag start; framer's pointer is shifted by this.
    var scrollOffsetRef = (0, react_1.useRef)(0);
    // True while we re-dispatch our own synthetic pointer event so the capture
    // interceptor lets it through to framer instead of swallowing it.
    var dispatchingRef = (0, react_1.useRef)(false);
    var interceptPointerMove = (0, react_1.useCallback)(function (event) {
        if (dispatchingRef.current)
            return;
        pointerRef.current = { x: event.clientX, y: event.clientY };
        event.stopImmediatePropagation();
    }, []);
    var relayToFramer = (0, react_1.useCallback)(function () {
        var pointer = pointerRef.current;
        if (!pointer)
            return;
        var meta = pointerMetaRef.current;
        dispatchingRef.current = true;
        window.dispatchEvent(new PointerEvent("pointermove", {
            clientX: pointer.x,
            clientY: pointer.y + scrollOffsetRef.current,
            pointerId: meta.pointerId,
            pointerType: meta.pointerType,
            isPrimary: meta.isPrimary,
            buttons: 1,
            bubbles: true,
            cancelable: true
        }));
        dispatchingRef.current = false;
    }, []);
    var stop = (0, react_1.useCallback)(function () {
        containerRef.current = null;
        pointerRef.current = null;
        scrollOffsetRef.current = 0;
        if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }
        window.removeEventListener("pointermove", interceptPointerMove, true);
        window.removeEventListener("pointerup", stop);
        window.removeEventListener("pointercancel", stop);
    }, [interceptPointerMove]);
    var tick = (0, react_1.useCallback)(function () {
        var container = containerRef.current;
        var pointer = pointerRef.current;
        if (container && pointer) {
            var rect = container.getBoundingClientRect();
            // Clamp the edges to the visible viewport: the container can extend past
            // the bottom of the screen (e.g. `h-[calc(100dvh-49px)]`), and the pointer
            // can only ever reach the visible edge — so measure proximity from there.
            var visibleTop = Math.max(rect.top, 0);
            var visibleBottom = Math.min(rect.bottom, window.innerHeight);
            var fromTop = pointer.y - visibleTop;
            var fromBottom = visibleBottom - pointer.y;
            var before = container.scrollTop;
            if (fromTop < AUTO_SCROLL_THRESHOLD) {
                var intensity = Math.min(1, (AUTO_SCROLL_THRESHOLD - fromTop) / AUTO_SCROLL_THRESHOLD);
                container.scrollTop -= AUTO_SCROLL_MAX_SPEED * intensity;
            }
            else if (fromBottom < AUTO_SCROLL_THRESHOLD) {
                var intensity = Math.min(1, (AUTO_SCROLL_THRESHOLD - fromBottom) / AUTO_SCROLL_THRESHOLD);
                container.scrollTop += AUTO_SCROLL_MAX_SPEED * intensity;
            }
            scrollOffsetRef.current += container.scrollTop - before;
            relayToFramer();
        }
        frameRef.current = requestAnimationFrame(tick);
    }, [relayToFramer]);
    var start = (0, react_1.useCallback)(function (event) {
        pointerRef.current = { x: event.clientX, y: event.clientY };
        pointerMetaRef.current = {
            pointerId: event.pointerId,
            pointerType: event.pointerType,
            isPrimary: event.isPrimary
        };
        scrollOffsetRef.current = 0;
        containerRef.current = findScrollContainer(event.currentTarget);
        // Capture phase so we run before framer's own window pointermove listener.
        window.addEventListener("pointermove", interceptPointerMove, true);
        window.addEventListener("pointerup", stop);
        window.addEventListener("pointercancel", stop);
        if (frameRef.current === null) {
            frameRef.current = requestAnimationFrame(tick);
        }
    }, [interceptPointerMove, stop, tick]);
    (0, react_1.useEffect)(function () { return stop; }, [stop]);
    return start;
}
/**
 * Remembers a reorderable list's order in localStorage. Starts from the default
 * order on the server (and first client render) to avoid hydration mismatches,
 * then loads any saved order after mount. Ids that aren't in the saved order are
 * appended so newly-added sections never disappear, and ids that are no longer
 * known are dropped.
 */
function useReorderableOrder(storageKey, defaultOrder) {
    var _a = (0, react_1.useState)(function () { return __spreadArray([], defaultOrder, true); }), order = _a[0], setOrder = _a[1];
    (0, react_1.useEffect)(function () {
        var _a;
        try {
            var saved = JSON.parse((_a = localStorage.getItem(storageKey)) !== null && _a !== void 0 ? _a : "null");
            if (!Array.isArray(saved))
                return;
            var known_1 = saved.filter(function (id) {
                return defaultOrder.includes(id);
            });
            var merged = __spreadArray(__spreadArray([], known_1, true), defaultOrder.filter(function (id) { return !known_1.includes(id); }), true);
            setOrder(merged);
        }
        catch (_b) {
            // Ignore malformed storage and keep the default order.
        }
    }, [storageKey, defaultOrder]);
    var reorder = (0, react_1.useCallback)(function (next) {
        setOrder(next);
        try {
            localStorage.setItem(storageKey, JSON.stringify(next));
        }
        catch (_a) {
            // Storage may be unavailable (private mode); reorder still works in-session.
        }
    }, [storageKey]);
    return [order, reorder];
}
/**
 * A `Reorder.Group` configured for a vertical stack of {@link ReorderableSection}
 * cards. Pass the `order` array and an `onReorder` callback (e.g. from
 * {@link useReorderableOrder}).
 */
function ReorderableSectionGroup(_a) {
    var order = _a.order, onReorder = _a.onReorder, _b = _a.className, className = _b === void 0 ? "flex w-full flex-col gap-2" : _b, children = _a.children;
    return (<framer_motion_1.Reorder.Group as="div" axis="y" values={order} onReorder={onReorder} className={className}>
      {children}
    </framer_motion_1.Reorder.Group>);
}
/**
 * One draggable card within a {@link ReorderableSectionGroup}. Renders a grip
 * handle in the top-left of the card's header and supports edge auto-scroll
 * while dragging. When `children` renders nothing the wrapper collapses via
 * `:has(> .section-body:empty)`, so empty sections show no stray handle — make
 * sure the section renders `null`/nothing rather than an empty placeholder.
 */
function ReorderableSection(_a) {
    var id = _a.id, label = _a.label, children = _a.children;
    var t = (0, macro_1.useLingui)().t;
    var controls = (0, framer_motion_1.useDragControls)();
    var startAutoScroll = useDragAutoScroll();
    return (<framer_motion_1.Reorder.Item as="div" value={id} dragListener={false} dragControls={controls} className="group/section relative w-full [&:has(>.section-body:empty)]:hidden">
      <div className="section-body w-full">{children}</div>
      {/* The grip sits inside the card's existing header left padding (px-6),
            so it never reflows the title or body. It renders after the card so
            it shares the card's (auto) z-index while still sitting on top. */}
      <button type="button" aria-label={label} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Drag to reorder"], ["Drag to reorder"])))} onPointerDown={function (event) {
            // Register the auto-scroll interceptor before framer's own pointer
            // listener so it runs first and can relay shifted moves to framer.
            startAutoScroll(event);
            controls.start(event);
        }} style={{ touchAction: "none" }} className="absolute left-1 top-[14px] flex h-5 w-5 cursor-grab touch-none items-center justify-center rounded text-foreground/30 transition-colors hover:text-foreground/70 active:cursor-grabbing">
        <lu_1.LuGripVertical className="h-4 w-4"/>
      </button>
    </framer_motion_1.Reorder.Item>);
}
var templateObject_1;
