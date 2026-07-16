"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProbeBoundary = useProbeBoundary;
var react_1 = require("react");
var constants_1 = require("../constants");
function useProbeBoundary(_a) {
    var payload = _a.payload, boundaryByNode = _a.boundaryByNode, markExpandable = _a.markExpandable, markExhausted = _a.markExhausted, probeCacheRef = _a.probeCacheRef, probedRef = _a.probedRef;
    (0, react_1.useEffect)(function () {
        var cancelled = false;
        var candidates = payload.entities.filter(function (e) {
            if (probedRef.current.has(e.id))
                return false;
            var hasIn = boundaryByNode.incoming.has(e.id);
            var hasOut = boundaryByNode.outgoing.has(e.id);
            return !hasIn || !hasOut;
        });
        if (candidates.length === 0)
            return;
        var knownEntityIds = new Set(payload.entities.map(function (e) { return e.id; }));
        var knownActivityIds = new Set(payload.activities.map(function (a) { return a.id; }));
        var _loop_1 = function (ent) {
            probedRef.current.add(ent.id);
            var params = new URLSearchParams({
                trackedEntityId: ent.id,
                direction: "both",
                depth: "1"
            });
            fetch("".concat(constants_1.TRACE_API.expand, "?").concat(params.toString()))
                .then(function (r) { return r.json(); })
                .then(function (res) {
                if (cancelled)
                    return;
                var hasNew = res.entities.some(function (e) { return !knownEntityIds.has(e.id); }) ||
                    res.activities.some(function (a) { return !knownActivityIds.has(a.id); });
                if (hasNew) {
                    probeCacheRef.current.set(ent.id, res);
                    markExpandable(ent.id);
                }
                else {
                    markExhausted(ent.id);
                }
            })
                .catch(function () {
                // probe fail = silently leave indicator off
            });
        };
        for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            var ent = candidates_1[_i];
            _loop_1(ent);
        }
        return function () {
            cancelled = true;
        };
    }, [
        payload,
        boundaryByNode,
        markExpandable,
        markExhausted,
        probeCacheRef,
        probedRef
    ]);
}
