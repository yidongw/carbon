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
exports.useLineOrderEditMode = useLineOrderEditMode;
var sortable_1 = require("@dnd-kit/sortable");
var react_1 = require("react");
var react_router_1 = require("react-router");
/**
 * Edit-mode state for drag-to-reorder line lists.
 *
 * Owns the draft order while the user reorders, debounceless save via a
 * react-router fetcher, Esc to cancel, and a `submittedRef` guard so a
 * leftover `fetcher.data.success` from a prior save doesn't auto-close a
 * fresh re-entry to edit mode.
 */
function useLineOrderEditMode(_a) {
    var actionPath = _a.actionPath, lines = _a.lines, _b = _a.getSortOrder, getSortOrder = _b === void 0 ? defaultGetSortOrder : _b;
    var fetcher = (0, react_router_1.useFetcher)();
    var _c = (0, react_1.useState)(false), isEditing = _c[0], setIsEditing = _c[1];
    var _d = (0, react_1.useState)([]), draft = _d[0], setDraft = _d[1];
    var _e = (0, react_1.useState)(null), activeId = _e[0], setActiveId = _e[1];
    var submittedRef = (0, react_1.useRef)(false);
    var isSaving = fetcher.state !== "idle";
    var original = (0, react_1.useMemo)(function () { return __spreadArray([], lines, true).sort(function (a, b) { return getSortOrder(a) - getSortOrder(b); }); }, [lines, getSortOrder]);
    var isDirty = (0, react_1.useMemo)(function () {
        if (draft.length !== original.length)
            return false;
        return draft.some(function (d, i) { var _a; return d.id !== ((_a = original[i]) === null || _a === void 0 ? void 0 : _a.id); });
    }, [draft, original]);
    var enterEditMode = (0, react_1.useCallback)(function () {
        setDraft(original.map(function (l) { return (__assign({}, l)); }));
        setIsEditing(true);
    }, [original]);
    var cancelEditMode = (0, react_1.useCallback)(function () {
        setDraft([]);
        setActiveId(null);
        setIsEditing(false);
    }, []);
    var handleDragStart = (0, react_1.useCallback)(function (event) {
        setActiveId(String(event.active.id));
    }, []);
    var handleDragEnd = (0, react_1.useCallback)(function (event) {
        setActiveId(null);
        var active = event.active, over = event.over;
        if (!over || active.id === over.id)
            return;
        setDraft(function (prev) {
            var oldIndex = prev.findIndex(function (l) { return l.id === active.id; });
            var newIndex = prev.findIndex(function (l) { return l.id === over.id; });
            if (oldIndex === -1 || newIndex === -1)
                return prev;
            return (0, sortable_1.arrayMove)(prev, oldIndex, newIndex);
        });
    }, []);
    var save = (0, react_1.useCallback)(function () {
        if (!isDirty)
            return;
        var updates = {};
        draft.forEach(function (line, index) {
            if (line.id)
                updates[line.id] = index + 1;
        });
        var formData = new FormData();
        formData.append("updates", JSON.stringify(updates));
        submittedRef.current = true;
        fetcher.submit(formData, { method: "post", action: actionPath });
    }, [actionPath, draft, fetcher, isDirty]);
    // Close edit mode once OUR save resolves. The ref makes sure we ignore
    // fetcher.data left over from a previous submission when re-entering edit mode.
    (0, react_1.useEffect)(function () {
        var _a;
        if (submittedRef.current &&
            fetcher.state === "idle" &&
            ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success)) {
            submittedRef.current = false;
            setDraft([]);
            setActiveId(null);
            setIsEditing(false);
        }
    }, [fetcher.data, fetcher.state]);
    // Esc cancels edit mode.
    (0, react_1.useEffect)(function () {
        if (!isEditing)
            return;
        var onKey = function (e) {
            if (e.key === "Escape")
                cancelEditMode();
        };
        document.addEventListener("keydown", onKey);
        return function () { return document.removeEventListener("keydown", onKey); };
    }, [isEditing, cancelEditMode]);
    var activeLine = (0, react_1.useMemo)(function () { var _a; return (activeId ? ((_a = draft.find(function (l) { return l.id === activeId; })) !== null && _a !== void 0 ? _a : null) : null); }, [activeId, draft]);
    return {
        isEditing: isEditing,
        isSaving: isSaving,
        isDirty: isDirty,
        draft: draft,
        activeLine: activeLine,
        enterEditMode: enterEditMode,
        cancelEditMode: cancelEditMode,
        handleDragStart: handleDragStart,
        handleDragEnd: handleDragEnd,
        save: save
    };
}
function defaultGetSortOrder(line) {
    var _a;
    return (_a = line.sortOrder) !== null && _a !== void 0 ? _a : 0;
}
