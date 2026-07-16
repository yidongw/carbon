"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUrlParams = useUrlParams;
var react_1 = require("react");
var react_router_1 = require("react-router");
function useUrlParams() {
    var submit = (0, react_router_1.useSubmit)();
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var setSearchParams = (0, react_1.useCallback)(function (params) {
        Object.entries(params).forEach(function (_a) {
            var name = _a[0], value = _a[1];
            if (value === undefined || value === null || value === "") {
                searchParams.delete(name);
                return;
            }
            if (Array.isArray(value)) {
                if (value.length === 0) {
                    searchParams.delete(name);
                }
                else {
                    value.forEach(function (v, i) {
                        if (i === 0) {
                            searchParams.set(name, v.toString());
                        }
                        else {
                            searchParams.append(name, v.toString());
                        }
                    });
                }
                return;
            }
            searchParams.set(name, value.toString());
        });
        submit(searchParams);
    }, [submit, searchParams]);
    return [searchParams, setSearchParams];
}
