"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNProgress = useNProgress;
var nprogress_1 = require("nprogress");
var react_1 = require("react");
var react_router_1 = require("react-router");
function useNProgress() {
    var transition = (0, react_router_1.useNavigation)();
    (0, react_1.useEffect)(function () {
        try {
            if ((transition.state === "loading" || transition.state === "submitting") &&
                !nprogress_1.default.isStarted()) {
                nprogress_1.default.start();
            }
            else if (nprogress_1.default.isStarted()) {
                nprogress_1.default.done();
            }
        }
        catch (_a) {
            // NProgress DOM manipulation can fail transiently; ignore to avoid crashing the app
        }
    }, [transition.state]);
}
