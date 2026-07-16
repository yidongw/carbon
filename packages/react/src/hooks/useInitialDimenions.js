"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useInitialDimensions;
var react_1 = require("react");
function useInitialDimensions(ref) {
    var _a = (0, react_1.useState)(null), dimensions = _a[0], setDimensions = _a[1];
    (0, react_1.useEffect)(function () {
        if (ref.current) {
            setDimensions(ref.current.getBoundingClientRect());
        }
    }, [ref]);
    return dimensions;
}
