"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useThrottle;
var react_1 = require("react");
/**
 * A function that you call with a throttle delay, the function will be called at most once per delay
 *
 * @param fn The function to throttle
 * @param delay In ms
 * @param executeOnUnmount Whether to execute the pending function when component unmounts
 */
function useThrottle(fn, delay, executeOnUnmount) {
    if (executeOnUnmount === void 0) { executeOnUnmount = false; }
    var timeout = (0, react_1.useRef)();
    var lastArgs = (0, react_1.useRef)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        return function () {
            if (executeOnUnmount && timeout.current && lastArgs.current) {
                clearTimeout(timeout.current);
                fn.apply(void 0, lastArgs.current);
            }
            else if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, [executeOnUnmount]);
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        lastArgs.current = args;
        if (timeout.current) {
            return;
        }
        timeout.current = setTimeout(function () {
            if (lastArgs.current) {
                fn.apply(void 0, lastArgs.current);
            }
            timeout.current = undefined;
        }, delay);
    };
}
