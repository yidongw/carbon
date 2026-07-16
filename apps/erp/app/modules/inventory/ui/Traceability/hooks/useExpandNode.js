"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExpandNode = useExpandNode;
var react_1 = require("react");
var react_router_1 = require("react-router");
function useExpandNode(onResult) {
    var fetcher = (0, react_router_1.useFetcher)();
    var pendingOriginRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (fetcher.state === "idle" && fetcher.data && pendingOriginRef.current) {
            onResult(fetcher.data, pendingOriginRef.current);
            pendingOriginRef.current = null;
        }
    }, [fetcher.state, fetcher.data, onResult]);
    var expand = (0, react_1.useCallback)(function (entityId, direction, depth) {
        if (direction === void 0) { direction = "both"; }
        if (depth === void 0) { depth = 1; }
        pendingOriginRef.current = entityId;
        var params = new URLSearchParams({
            trackedEntityId: entityId,
            direction: direction,
            depth: String(depth)
        });
        fetcher.load("/api/traceability/expand?".concat(params.toString()));
    }, [fetcher]);
    return { expand: expand, isLoading: fetcher.state !== "idle" };
}
