"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useHydrated;
var react_1 = require("react");
var useMount_1 = require("./useMount");
var hydrating = true;
/**
 * Return a boolean indicating if the JS has been hydrated already.
 * When doing Server-Side Rendering, the result will always be false.
 * When doing Client-Side Rendering, the result will always be false on the
 * first render and true from then on. Even if a new component renders it will
 * always start with true.
 *
 * Example: Disable a button that needs JS to work.
 * ```tsx
 * const hydrated = useHydrated();
 * return (
 *   <button type="button" isDisabled={!hydrated} onClick={doSomethingCustom}>
 *     Click me
 *   </button>
 * );
 * ```
 */
function useHydrated() {
    var _a = (0, react_1.useState)(function () { return !hydrating; }), hydrated = _a[0], setHydrated = _a[1];
    (0, useMount_1.default)(function () {
        hydrating = false;
        setHydrated(true);
    });
    return hydrated;
}
