"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTracingGraphManager = useTracingGraphManager;
exports.useAsyncLayout = useAsyncLayout;
exports.useAsyncSelectionPath = useAsyncSelectionPath;
var react_1 = require("react");
var TracingGraphManager_1 = require("./TracingGraphManager");
function useTracingGraphManager() {
    var ref = (0, react_1.useRef)(null);
    if (!ref.current)
        ref.current = new TracingGraphManager_1.TracingGraphManager();
    (0, react_1.useEffect)(function () {
        var mgr = ref.current;
        mgr === null || mgr === void 0 ? void 0 : mgr.init();
        return function () { return mgr === null || mgr === void 0 ? void 0 : mgr.dispose(); };
    }, []);
    return ref.current;
}
function useAsyncLayout(manager, payload, direction, spacing, rejectIds, layoutVersion) {
    var _a = (0, react_1.useState)(null), result = _a[0], setResult = _a[1];
    var rejectIdsArray = (0, react_1.useMemo)(function () { return Array.from(rejectIds); }, [rejectIds]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: layoutVersion is a manual relayout trigger
    (0, react_1.useEffect)(function () {
        var cancelled = false;
        manager
            .layout({ payload: payload, direction: direction, spacing: spacing, rejectIds: rejectIdsArray })
            .then(function (r) {
            if (cancelled || r === null)
                return;
            setResult(r);
        });
        return function () {
            cancelled = true;
        };
    }, [manager, payload, direction, spacing, rejectIdsArray, layoutVersion]);
    return result;
}
function useAsyncSelectionPath(manager, edges, selectedIds, excludedIds, additionalRootIds) {
    var _a = (0, react_1.useState)(null), path = _a[0], setPath = _a[1];
    var excludedArray = (0, react_1.useMemo)(function () { return Array.from(excludedIds); }, [excludedIds]);
    var additionalArray = (0, react_1.useMemo)(function () { return Array.from(additionalRootIds); }, [additionalRootIds]);
    (0, react_1.useEffect)(function () {
        if (selectedIds.length === 0 && additionalArray.length === 0) {
            setPath(null);
            return;
        }
        var cancelled = false;
        manager
            .selection(edges, selectedIds, excludedArray, additionalArray)
            .then(function (r) {
            if (cancelled || r === null)
                return;
            setPath({
                nodeIds: new Set(r.pathNodeIds),
                edgeIds: new Set(r.pathEdgeIds)
            });
        });
        return function () {
            cancelled = true;
        };
    }, [manager, edges, selectedIds, excludedArray, additionalArray]);
    return path;
}
