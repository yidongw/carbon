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
exports.useOptimisticDocumentDrag = useOptimisticDocumentDrag;
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
function useOptimisticDocumentDrag() {
    var rfqId = (0, react_router_1.useParams)().rfqId;
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        return fetcher.formAction === path_1.path.to.salesRfqDrag(rfqId);
    })
        .reduce(function (acc, fetcher) {
        var _a;
        var payload = (_a = fetcher === null || fetcher === void 0 ? void 0 : fetcher.formData) === null || _a === void 0 ? void 0 : _a.get("payload");
        if (payload) {
            try {
                var parsedPayload = sales_models_1.salesRfqDragValidator.parse(JSON.parse(payload));
                return __spreadArray(__spreadArray([], acc, true), [parsedPayload], false);
            }
            catch (_b) {
                // nothing
            }
        }
        return acc;
    }, []);
}
