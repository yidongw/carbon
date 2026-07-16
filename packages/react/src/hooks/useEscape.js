"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useEscape;
var react_1 = require("react");
function useEscape(callback) {
    (0, react_1.useEffect)(function () {
        var listener = function (e) {
            if (e.key === "Escape") {
                callback(e);
            }
        };
        document.addEventListener("keydown", listener);
        return function () {
            document.removeEventListener("keydown", listener);
        };
    }, [callback]);
}
