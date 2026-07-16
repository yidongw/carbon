"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInViewClass = useInViewClass;
var react_1 = require("react");
function useInViewClass(threshold) {
    if (threshold === void 0) { threshold = 0.12; }
    var ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var el = ref.current;
        if (!el)
            return;
        var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) {
                if (e.isIntersecting)
                    el.classList.add("in");
            });
        }, { threshold: threshold });
        io.observe(el);
        return function () { return io.disconnect(); };
    }, [threshold]);
    return ref;
}
