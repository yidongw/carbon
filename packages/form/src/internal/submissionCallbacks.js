"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubmitComplete = useSubmitComplete;
var react_1 = require("react");
function useSubmitComplete(isSubmitting, callback) {
    var isPending = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (isSubmitting) {
            isPending.current = true;
        }
        if (!isSubmitting && isPending.current) {
            isPending.current = false;
            callback();
        }
    });
}
