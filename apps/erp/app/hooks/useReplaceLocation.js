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
exports.useReplaceLocation = useReplaceLocation;
var react_1 = require("@carbon/react");
var react_2 = require("react");
function useReplaceLocation() {
    var optimisticLocation = (0, react_1.useOptimisticLocation)();
    var _a = (0, react_2.useState)(optimisticLocation), location = _a[0], setLocation = _a[1];
    var replaceLocation = (0, react_2.useCallback)(function (location) {
        var fullPath = location.pathname + location.search + location.hash;
        //replace the URL in the browser
        history.replaceState(null, "", fullPath);
        //update the state (new object in case the same location ref was modified)
        var newLocation = __assign({}, location);
        setLocation(newLocation);
    }, []);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var replaceSearchParam = (0, react_2.useCallback)(function (key, value) {
        var searchParams = new URLSearchParams(location.search);
        if (value) {
            searchParams.set(key, value);
        }
        else {
            searchParams.delete(key);
        }
        replaceLocation(__assign(__assign({}, optimisticLocation), { search: "?" + searchParams.toString() }));
    }, [optimisticLocation, replaceLocation]);
    return { location: location, replaceLocation: replaceLocation, replaceSearchParam: replaceSearchParam };
}
