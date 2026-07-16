"use strict";
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
exports.OverlayProvider = OverlayProvider;
exports.useOverlay = useOverlay;
var react_1 = require("react");
var react_router_1 = require("react-router");
var overlay_1 = require("./overlay");
var overlay_registry_1 = require("./overlay.registry");
var OverlayContext = (0, react_1.createContext)(null);
function createInstanceId() {
    return crypto.randomUUID();
}
function createInstance(target, options, urlSynced) {
    var _a;
    if (!(0, overlay_registry_1.getOverlayRegistryEntry)(target.id))
        return null;
    return {
        id: createInstanceId(),
        overlayId: target.id,
        url: target.url,
        onCreated: options === null || options === void 0 ? void 0 : options.onCreated,
        onSuccess: options === null || options === void 0 ? void 0 : options.onSuccess,
        urlSynced: urlSynced,
        token: urlSynced ? ((_a = (0, overlay_1.overlayToken)(target)) !== null && _a !== void 0 ? _a : undefined) : undefined,
        props: target.props
    };
}
/** Live page search params — overlay state lives in the URL, not the router. */
function currentSearch() {
    return new URLSearchParams(window.location.search);
}
/**
 * Mirror the open url-synced overlays in the URL via `history.replaceState` —
 * deliberately NOT `navigate()` (which would revalidate the page's loaders) and
 * NOT `pushState` (which desyncs React Router's back/forward index). We rewrite
 * the *current* entry in place, preserving React Router's history state, so only
 * the URL changes and RR stays consistent.
 *
 * The open instances are the source of truth: this writes exactly their tokens.
 */
function writeOverlayTokens(tokens) {
    var next = (0, overlay_1.paramsWithOverlayTokens)(currentSearch(), tokens);
    var search = (0, overlay_1.serializeSearch)(next);
    var url = window.location.pathname +
        (search ? "?".concat(search) : "") +
        window.location.hash;
    window.history.replaceState(window.history.state, "", url);
}
function OverlayProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)([]), instances = _b[0], setInstances = _b[1];
    var location = (0, react_router_1.useLocation)();
    // Ref so callbacks/effects always read the latest instances without re-binding.
    var instancesRef = (0, react_1.useRef)(instances);
    instancesRef.current = instances;
    var syncedTokens = (0, react_1.useCallback)(function (list) {
        return list.filter(function (i) { return i.urlSynced && i.token; }).map(function (i) { return i.token; });
    }, []);
    var openOverlay = (0, react_1.useCallback)(function (target, options) {
        var urlSynced = (0, overlay_1.isUrlOverlay)(target.id);
        var instance = createInstance(target, options, urlSynced);
        if (!instance)
            return null;
        var prev = instancesRef.current;
        var withoutSame = prev.filter(function (i) { return i.overlayId !== target.id || i.url !== target.url; });
        var nextInstances = __spreadArray(__spreadArray([], withoutSame, true), [instance], false);
        // Keep the ref authoritative synchronously so an open immediately followed
        // by a close in the same tick (e.g. chaining a second overlay from an
        // onCreated callback) composes instead of overwriting each other.
        instancesRef.current = nextInstances;
        setInstances(nextInstances);
        if (urlSynced)
            writeOverlayTokens(syncedTokens(nextInstances));
        return instance.id;
    }, [syncedTokens]);
    var closeOverlay = (0, react_1.useCallback)(function (id) {
        var instance = instancesRef.current.find(function (i) { return i.id === id; });
        var nextInstances = instancesRef.current.filter(function (i) { return i.id !== id; });
        instancesRef.current = nextInstances;
        setInstances(nextInstances);
        // Closing is the only thing that removes an overlay's URL token.
        if (instance === null || instance === void 0 ? void 0 : instance.urlSynced)
            writeOverlayTokens(syncedTokens(nextInstances));
    }, [syncedTokens]);
    var closeAll = (0, react_1.useCallback)(function () {
        var hadUrlSynced = instancesRef.current.some(function (i) { return i.urlSynced; });
        instancesRef.current = [];
        setInstances([]);
        if (hadUrlSynced)
            writeOverlayTokens([]);
    }, []);
    // Reconcile on React Router navigations (and mount). The open instances are
    // the source of truth, so we never close here:
    //   - open any URL token that has no instance yet (deep links / shared URLs);
    //   - re-assert the open overlays' tokens onto the URL, since a navigation may
    //     have rebuilt the query and dropped them. Only an explicit close removes.
    var reconcile = (0, react_1.useCallback)(function () {
        var search = currentSearch();
        var urlTargets = (0, overlay_1.overlayStackFromParams)(search);
        var existing = instancesRef.current;
        var existingUrls = new Set(existing.filter(function (i) { return i.urlSynced; }).map(function (i) { return i.url; }));
        var opened = urlTargets
            .filter(function (t) { return !existingUrls.has(t.url); })
            .map(function (t) { return createInstance(t, undefined, true); })
            .filter(function (i) { return i != null; });
        if (opened.length > 0)
            setInstances(function (prev) { return __spreadArray(__spreadArray([], prev, true), opened, true); });
        var wantTokens = syncedTokens(__spreadArray(__spreadArray([], existing.filter(function (i) { return i.urlSynced; }), true), opened, true));
        var haveTokens = search.getAll(overlay_1.OVERLAY_PARAM);
        var inSync = wantTokens.length === haveTokens.length &&
            wantTokens.every(function (t) { return haveTokens.includes(t); });
        if (!inSync)
            writeOverlayTokens(wantTokens);
    }, [syncedTokens]);
    (0, react_1.useEffect)(function () {
        reconcile();
    }, [location, reconcile]);
    var value = (0, react_1.useMemo)(function () { return ({ instances: instances, openOverlay: openOverlay, closeOverlay: closeOverlay, closeAll: closeAll }); }, [instances, openOverlay, closeOverlay, closeAll]);
    return (<OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>);
}
function useOverlay() {
    var ctx = (0, react_1.useContext)(OverlayContext);
    if (!ctx) {
        throw new Error("useOverlay must be used within OverlayProvider");
    }
    return ctx;
}
