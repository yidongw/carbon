"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSynced = useSynced;
var react_1 = require("react");
/**
 * Optimistic local state that resyncs whenever the row's server value changes
 * (revalidation or a server-side cascade).
 */
function useSynced(serverValue) {
    var _a = (0, react_1.useState)(serverValue), value = _a[0], setValue = _a[1];
    (0, react_1.useEffect)(function () {
        setValue(serverValue);
    }, [serverValue]);
    return [value, setValue];
}
