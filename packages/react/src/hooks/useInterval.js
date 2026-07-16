"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInterval = useInterval;
var react_1 = require("react");
var useIsomorphicLayoutEffect_1 = require("./useIsomorphicLayoutEffect");
/**
 * Custom hook that creates an interval that invokes a callback function at a specified delay using the [`setInterval API`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval).
 * @param {() => void} callback - The function to be invoked at each interval.
 * @param {number | null} delay - The time, in milliseconds, between each invocation of the callback. Use `null` to clear the interval.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-interval)
 * @example
 * ```tsx
 * const handleInterval = () => {
 *   // Code to be executed at each interval
 * };
 * useInterval(handleInterval, 1000);
 * ```
 */
function useInterval(callback, delay) {
    var savedCallback = (0, react_1.useRef)(callback);
    // Remember the latest callback if it changes.
    (0, useIsomorphicLayoutEffect_1.useIsomorphicLayoutEffect)(function () {
        savedCallback.current = callback;
    }, [callback]);
    // Set up the interval.
    (0, react_1.useEffect)(function () {
        // Don't schedule if no delay is specified.
        // Note: 0 is a valid value for delay.
        if (delay === null) {
            return;
        }
        var id = setInterval(function () {
            savedCallback.current();
        }, delay);
        return function () {
            clearInterval(id);
        };
    }, [delay]);
}
