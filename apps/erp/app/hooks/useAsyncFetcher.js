"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAsyncFetcher = useAsyncFetcher;
var react_query_1 = require("@tanstack/react-query");
var react_1 = require("react");
var react_router_1 = require("react-router");
function useAsyncFetcher(options) {
    var onStateChange = (options === null || options === void 0 ? void 0 : options.onStateChange) || react_query_1.noop;
    var fetcher = (0, react_router_1.useFetcher)({
        key: options === null || options === void 0 ? void 0 : options.key
    });
    var instance = (0, react_1.useRef)();
    if (!instance.current) {
        instance.current = Promise.withResolvers();
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var submit = (0, react_1.useCallback)(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        fetcher.submit.apply(fetcher, args);
        return instance.current.promise;
    }, [fetcher, instance]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var load = (0, react_1.useCallback)(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        fetcher.load.apply(fetcher, args);
        return instance.current.promise;
    }, [fetcher, instance]);
    (0, react_1.useEffect)(function () {
        var _a;
        onStateChange(fetcher.state);
        if (fetcher.state === "idle") {
            if (fetcher.data) {
                (_a = instance.current) === null || _a === void 0 ? void 0 : _a.resolve(fetcher.data);
                instance.current = Promise.withResolvers();
            }
        }
    }, [fetcher.state, fetcher.data, onStateChange]);
    return __assign(__assign({}, fetcher), { data: fetcher.data, submit: submit, load: load });
}
