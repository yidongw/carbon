"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientOnly = void 0;
var hooks_1 = require("./hooks");
/**
 * Render the children only after the JS has loaded client-side. Use an optional
 * fallback component if the JS is not yet loaded.
 *
 * Example: Render a Chart component if JS loads, renders a simple FakeChart
 * component server-side or if there is no JS. The FakeChart can have only the
 * UI without the behavior or be a loading spinner or skeleton.
 * ```tsx
 * return (
 *   <ClientOnly fallback={<FakeChart />}>
 *     {() => <Chart />}
 *   </ClientOnly>
 * );
 * ```
 */
var ClientOnly = function (_a) {
    var children = _a.children, _b = _a.fallback, fallback = _b === void 0 ? null : _b;
    return (0, hooks_1.useHydrated)() ? <>{children()}</> : <>{fallback}</>;
};
exports.ClientOnly = ClientOnly;
