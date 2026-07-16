"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTraceabilityStore = void 0;
var zustand_1 = require("zustand");
var middleware_1 = require("zustand/middleware");
var constants_1 = require("./constants");
exports.useTraceabilityStore = (0, zustand_1.create)()((0, middleware_1.persist)(function (set) { return ({
    rootId: null,
    isolate: false,
    expansions: new Map(),
    expandable: new Set(),
    exhausted: new Set(),
    excludedIds: new Set(),
    additionalRootIds: new Set(),
    direction: "TB",
    view: "graph",
    spacing: constants_1.SPACING.default,
    reset: function (rootId) {
        return set({
            rootId: rootId,
            isolate: false,
            expansions: new Map(),
            expandable: new Set(),
            exhausted: new Set(),
            excludedIds: new Set(),
            additionalRootIds: new Set()
        });
    },
    setIsolate: function (next) { return set({ isolate: next }); },
    toggleAdditionalRoot: function (id) {
        return set(function (s) {
            var next = new Set(s.additionalRootIds);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return { additionalRootIds: next };
        });
    },
    clearAdditionalRoots: function () { return set({ additionalRootIds: new Set() }); },
    addExpansion: function (originId, payload) {
        return set(function (s) {
            var next = new Map(s.expansions);
            next.set(originId, payload);
            return { expansions: next };
        });
    },
    removeExpansion: function (originId) {
        return set(function (s) {
            if (!s.expansions.has(originId))
                return {};
            var next = new Map(s.expansions);
            next.delete(originId);
            return { expansions: next };
        });
    },
    resetExpansions: function () { return set({ expansions: new Map() }); },
    markExpandable: function (id) {
        return set(function (s) {
            if (s.expandable.has(id))
                return {};
            var next = new Set(s.expandable);
            next.add(id);
            return { expandable: next };
        });
    },
    markExhausted: function (id) {
        return set(function (s) {
            if (s.exhausted.has(id))
                return {};
            var next = new Set(s.exhausted);
            next.add(id);
            return { exhausted: next };
        });
    },
    toggleExcluded: function (id) {
        return set(function (s) {
            var next = new Set(s.excludedIds);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return { excludedIds: next };
        });
    },
    clearExcluded: function () { return set({ excludedIds: new Set() }); },
    setDirection: function (next) { return set({ direction: next }); },
    setView: function (next) { return set({ view: next }); },
    setSpacing: function (next) { return set({ spacing: (0, constants_1.clampSpacing)(next) }); }
}); }, {
    name: "traceability:prefs:v1",
    storage: (0, middleware_1.createJSONStorage)(function () { return localStorage; }),
    partialize: function (s) { return ({
        direction: s.direction,
        view: s.view,
        spacing: s.spacing
    }); }
}));
