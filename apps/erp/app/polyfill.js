if (typeof DOMMatrix === "undefined") {
    // @ts-expect-error -- stub for SSR; d3-interpolate uses DOMMatrix for SVG transforms
    globalThis.DOMMatrix = /** @class */ (function () {
        function DOMMatrix() {
            return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
        }
        return DOMMatrix;
    }());
}
if (typeof Promise.withResolvers === "undefined") {
    Promise.withResolvers = function () {
        var resolve;
        var reject;
        var promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        return { promise: promise, resolve: resolve, reject: reject };
    };
}
