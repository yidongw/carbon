"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScrollSpy = useScrollSpy;
var react_1 = require("react");
function useScrollSpy(ids, offset) {
    if (offset === void 0) { offset = 150; }
    var _a = (0, react_1.useState)(0), activeIndex = _a[0], setActiveIndex = _a[1];
    (0, react_1.useEffect)(function () {
        var onScroll = function () {
            var idx = 0;
            ids.forEach(function (id, i) {
                var el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top < offset)
                    idx = i;
            });
            setActiveIndex(idx);
        };
        onScroll();
        document.addEventListener("scroll", onScroll, { passive: true });
        return function () { return document.removeEventListener("scroll", onScroll); };
    }, [ids, offset]);
    return activeIndex;
}
