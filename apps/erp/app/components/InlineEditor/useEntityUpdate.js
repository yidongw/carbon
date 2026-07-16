"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEntityUpdate = useEntityUpdate;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
/**
 * Returns an `onUpdate(id, field, value)` that submits a single-field edit to a
 * module's bulk-update action (one row id), so all cascade logic runs server-side
 * and loaders revalidate. Errors surface via toast, matching the detail panels.
 *
 * Pass a module-scope config constant so its identity is stable across renders.
 */
function useEntityUpdate(_a) {
    var action = _a.action, idKey = _a.idKey;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error)
            react_1.toast.error(fetcher.data.error.message);
    }, [fetcher.data]);
    return (0, react_2.useCallback)(function (id, field, value) {
        var formData = new FormData();
        formData.append(idKey, id);
        formData.append("field", field);
        formData.append("value", value !== null && value !== void 0 ? value : "");
        fetcher.submit(formData, { method: "post", action: action });
    }, [fetcher, action, idKey]);
}
