"use client";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.flowsOf = flowsOf;
exports.chaptersInFlow = chaptersInFlow;
exports.GuideProvider = GuideProvider;
exports.useGuide = useGuide;
/**
 * GuideProvider owns the editorial reader's active-chapter/section state and all
 * scroll orchestration, so BOTH the header and the sidebar switch chapters with
 * pure client state — no Next route navigation, no remount, no flash.
 *
 * Chapter content is authored in MDX; the server passes down a serializable
 * `chapters` list (slug/title/label + the section items derived from each file's
 * table of contents) plus the rendered bodies. Section anchors are the heading ids
 * Fumadocs' rehype-slug already injected, so the rail, scrollspy, and deep links all
 * key off the same id.
 *
 * Chapter changes animate via the View Transitions API; reduced-motion users get an
 * instant swap. The URL is kept in sync silently via history.replaceState.
 */
var react_1 = require("react");
var react_dom_1 = require("react-dom");
/** Distinct flows in reading order, each with the global index of its first chapter.
 *  `chapters` is already sorted by (flowIndex, index), so each flow is contiguous. */
function flowsOf(chapters) {
    var out = [];
    chapters.forEach(function (c, i) {
        if (!out.some(function (f) { return f.slug === c.flow; }))
            out.push({ slug: c.flow, name: c.flowName, firstIndex: i });
    });
    return out;
}
/** The chapters belonging to one flow, each paired with its global index. */
function chaptersInFlow(chapters, flow) {
    return chapters
        .map(function (chapter, index) { return ({ chapter: chapter, index: index }); })
        .filter(function (x) { return x.chapter.flow === flow; });
}
var Ctx = (0, react_1.createContext)(null);
function GuideProvider(_a) {
    var chapters = _a.chapters, initialSlug = _a.initialSlug, children = _a.children;
    var initialChapter = Math.max(0, chapters.findIndex(function (c) { return c.slug === initialSlug; }));
    var _b = (0, react_1.useState)({ chapter: initialChapter, item: 0 }), active = _b[0], setActive = _b[1];
    var activeRef = (0, react_1.useRef)(active);
    activeRef.current = active;
    var scrollElRef = (0, react_1.useRef)(null);
    var isUserScrolling = (0, react_1.useRef)(false);
    var guardTimer = (0, react_1.useRef)(null);
    var registerScrollEl = (0, react_1.useCallback)(function (el) {
        scrollElRef.current = el;
    }, []);
    var scrollToAnchor = (0, react_1.useCallback)(function (id, smooth) {
        var el = scrollElRef.current;
        if (!el || !id)
            return;
        var target = el.querySelector("#".concat(CSS.escape(id)));
        if (!(target instanceof HTMLElement))
            return;
        var top = target.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - 32;
        el.scrollTo({ top: Math.max(0, top), behavior: smooth ? "smooth" : "auto" });
    }, []);
    var goTo = (0, react_1.useCallback)(function (pos) {
        var _a, _b, _c;
        var chapter = chapters[pos.chapter];
        if (!chapter)
            return;
        var prev = activeRef.current;
        var isNewChapter = pos.chapter !== prev.chapter;
        var anchor = (_b = (_a = chapter.items[pos.item]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
        // Suppress the scrollspy while we drive the scroll programmatically.
        isUserScrolling.current = true;
        if (guardTimer.current)
            clearTimeout(guardTimer.current);
        guardTimer.current = setTimeout(function () {
            isUserScrolling.current = false;
        }, 700);
        if (!isNewChapter) {
            // Same chapter — just glide to the section, no transition.
            setActive(pos);
            requestAnimationFrame(function () { return scrollToAnchor(anchor, true); });
            return;
        }
        // New chapter — swap content + jump to its top inside a view transition.
        var apply = function () {
            (0, react_dom_1.flushSync)(function () { return setActive(pos); });
            scrollToAnchor(anchor, false);
        };
        var reduce = typeof window !== "undefined" &&
            ((_c = window.matchMedia) === null || _c === void 0 ? void 0 : _c.call(window, "(prefers-reduced-motion: reduce)").matches);
        var doc = document;
        if (!reduce && typeof doc.startViewTransition === "function") {
            doc.startViewTransition(apply);
        }
        else {
            apply();
        }
        window.history.replaceState(null, "", "/guides/".concat(chapter.slug));
    }, [chapters, scrollToAnchor]);
    // Scrollspy: update the active section as the reader scrolls.
    (0, react_1.useEffect)(function () {
        var el = scrollElRef.current;
        if (!el)
            return;
        var handleScroll = function () {
            if (isUserScrolling.current)
                return;
            var rect = el.getBoundingClientRect();
            var threshold = rect.top + rect.height * 0.4;
            var chapter = chapters[activeRef.current.chapter];
            if (!chapter)
                return;
            var closestItem = 0;
            for (var i = 0; i < chapter.items.length; i++) {
                var heading = el.querySelector("#".concat(CSS.escape(chapter.items[i].id)));
                if (heading instanceof HTMLElement && heading.getBoundingClientRect().top <= threshold) {
                    closestItem = i;
                }
            }
            setActive(function (p) { return (p.item === closestItem ? p : __assign(__assign({}, p), { item: closestItem })); });
        };
        el.addEventListener("scroll", handleScroll, { passive: true });
        return function () { return el.removeEventListener("scroll", handleScroll); };
    }, [chapters, active.chapter]);
    return (<Ctx.Provider value={{ active: active, goTo: goTo, registerScrollEl: registerScrollEl, chapters: chapters }}>{children}</Ctx.Provider>);
}
function useGuide() {
    var ctx = (0, react_1.useContext)(Ctx);
    if (!ctx)
        throw new Error("useGuide must be used within a GuideProvider");
    return ctx;
}
