"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResizeObserver = useResizeObserver;
var react_1 = require("react");
function useResizeObserver(elementRef) {
    var _a = (0, react_1.useState)(), entry = _a[0], setEntry = _a[1];
    var updateEntry = function (_a) {
        var entry = _a[0];
        setEntry(entry);
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        var node = elementRef === null || elementRef === void 0 ? void 0 : elementRef.current;
        if (!node)
            return;
        var observer = new ResizeObserver(updateEntry);
        observer.observe(node);
        return function () { return observer.disconnect(); };
    }, [elementRef]);
    return entry;
}
