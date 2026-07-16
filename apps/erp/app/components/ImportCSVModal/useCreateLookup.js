"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateLookup = useCreateLookup;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
// Submits create-lookup batches and reports each created/existing id back via
// `onLinked`. `csvValues[i]` pairs with `names[i]` — they differ for the inline
// combobox create, where the user can type a corrected name for a CSV cell
// (e.g. CSV "Raw Matl" -> create "Raw Material").
function useCreateLookup(_a) {
    var lookup = _a.lookup, onLinked = _a.onLinked;
    var fetcher = (0, react_router_1.useFetcher)();
    var pendingCsvValuesRef = (0, react_2.useRef)(null);
    var create = function (csvValues, names) {
        if (!lookup || names.length === 0)
            return;
        pendingCsvValuesRef.current = csvValues;
        fetcher.submit({ lookup: lookup, names: names }, {
            method: "POST",
            action: path_1.path.to.api.createCsvLookup,
            encType: "application/json"
        });
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: respond to create result
    (0, react_2.useEffect)(function () {
        var data = fetcher.data;
        var pending = pendingCsvValuesRef.current;
        if (!data || pending === null)
            return;
        if ("results" in data && data.results) {
            var created_1 = [];
            var failures_1 = [];
            data.results.forEach(function (result, index) {
                var csvValue = pending[index];
                if (result.id && csvValue !== undefined) {
                    onLinked(csvValue, result.id, result.name);
                    created_1.push(result.name);
                }
                else if (result.error) {
                    failures_1.push(result.name);
                }
            });
            if (created_1.length === 1) {
                react_1.toast.success("Created \"".concat(created_1[0], "\""));
            }
            else if (created_1.length > 1) {
                react_1.toast.success("Created ".concat(created_1.length, " values"));
            }
            if (failures_1.length > 0) {
                react_1.toast.error("Could not create: ".concat(failures_1.join(", ")));
            }
            pendingCsvValuesRef.current = null;
        }
        else if ("error" in data && data.error) {
            react_1.toast.error(data.error);
            pendingCsvValuesRef.current = null;
        }
    }, [fetcher.data]);
    return { create: create, isCreating: fetcher.state !== "idle" };
}
