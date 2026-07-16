"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useMount;
var react_1 = require("react");
function useMount(callback) {
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        callback();
    }, []);
}
