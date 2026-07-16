"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTags = useTags;
var react_1 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function useTags(_a) {
    var id = _a.id, table = _a.table;
    var fetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateTags = (0, react_1.useCallback)(function (value) {
        if (!id)
            return;
        var formData = new FormData();
        formData.append("ids", id);
        formData.append("table", table);
        value.forEach(function (v) {
            formData.append("value", v);
        });
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.tags
        });
    }, [id, table]);
    return { onUpdateTags: onUpdateTags };
}
