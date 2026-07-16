"use client";
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarouselPrevious = exports.CarouselNext = exports.CarouselItem = exports.CarouselContent = exports.Carousel = void 0;
var embla_carousel_react_1 = require("embla-carousel-react");
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var IconButton_1 = require("./IconButton");
var cn_1 = require("./utils/cn");
var CarouselContext = (0, react_1.createContext)(null);
function useCarousel() {
    var context = (0, react_1.useContext)(CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }
    return context;
}
var Carousel = (0, react_1.forwardRef)(function (_a, ref) {
    var _b = _a.orientation, orientation = _b === void 0 ? "horizontal" : _b, opts = _a.opts, setApi = _a.setApi, plugins = _a.plugins, className = _a.className, children = _a.children, props = __rest(_a, ["orientation", "opts", "setApi", "plugins", "className", "children"]);
    var _c = (0, embla_carousel_react_1.default)(__assign(__assign({}, opts), { axis: orientation === "horizontal" ? "x" : "y" }), plugins), carouselRef = _c[0], api = _c[1];
    var _d = (0, react_1.useState)(false), canScrollPrev = _d[0], setCanScrollPrev = _d[1];
    var _e = (0, react_1.useState)(false), canScrollNext = _e[0], setCanScrollNext = _e[1];
    var onSelect = (0, react_1.useCallback)(function (api) {
        if (!api) {
            return;
        }
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
    }, []);
    var scrollPrev = (0, react_1.useCallback)(function () {
        api === null || api === void 0 ? void 0 : api.scrollPrev();
    }, [api]);
    var scrollNext = (0, react_1.useCallback)(function () {
        api === null || api === void 0 ? void 0 : api.scrollNext();
    }, [api]);
    var handleKeyDown = (0, react_1.useCallback)(function (event) {
        if (event.key === "LuArrowLeft") {
            event.preventDefault();
            scrollPrev();
        }
        else if (event.key === "LuArrowRight") {
            event.preventDefault();
            scrollNext();
        }
    }, [scrollPrev, scrollNext]);
    (0, react_1.useEffect)(function () {
        if (!api || !setApi) {
            return;
        }
        setApi(api);
    }, [api, setApi]);
    (0, react_1.useEffect)(function () {
        if (!api) {
            return;
        }
        onSelect(api);
        api.on("reInit", onSelect);
        api.on("select", onSelect);
        return function () {
            api === null || api === void 0 ? void 0 : api.off("select", onSelect);
        };
    }, [api, onSelect]);
    return (<CarouselContext.Provider value={{
            carouselRef: carouselRef,
            api: api,
            opts: opts,
            orientation: orientation || ((opts === null || opts === void 0 ? void 0 : opts.axis) === "y" ? "vertical" : "horizontal"),
            scrollPrev: scrollPrev,
            scrollNext: scrollNext,
            canScrollPrev: canScrollPrev,
            canScrollNext: canScrollNext
        }}>
        <div ref={ref} onKeyDownCapture={handleKeyDown} className={(0, cn_1.cn)("relative", className)} role="region" aria-roledescription="carousel" {...props}>
          {children}
        </div>
      </CarouselContext.Provider>);
});
exports.Carousel = Carousel;
Carousel.displayName = "Carousel";
var CarouselContent = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var _b = useCarousel(), carouselRef = _b.carouselRef, orientation = _b.orientation;
    return (<div ref={carouselRef} className="overflow-hidden">
      <div ref={ref} className={(0, cn_1.cn)("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)} {...props}/>
    </div>);
});
exports.CarouselContent = CarouselContent;
CarouselContent.displayName = "CarouselContent";
var CarouselItem = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var orientation = useCarousel().orientation;
    return (<div ref={ref} role="group" aria-roledescription="slide" className={(0, cn_1.cn)("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)} {...props}/>);
});
exports.CarouselItem = CarouselItem;
CarouselItem.displayName = "CarouselItem";
var CarouselPrevious = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, _b = _a.variant, variant = _b === void 0 ? "secondary" : _b, _c = _a.size, size = _c === void 0 ? "md" : _c, props = __rest(_a, ["className", "variant", "size"]);
    var t = (0, macro_1.useLingui)().t;
    var _d = useCarousel(), scrollPrev = _d.scrollPrev, canScrollPrev = _d.canScrollPrev;
    return (<IconButton_1.IconButton ref={ref} variant={variant} size={size} className={(0, cn_1.cn)("h-8 w-8 rounded-full before:rounded-full", className)} disabled={!canScrollPrev} onClick={scrollPrev} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Previous slide"], ["Previous slide"])))} icon={<lu_1.LuArrowLeft />} {...props}/>);
});
exports.CarouselPrevious = CarouselPrevious;
CarouselPrevious.displayName = "CarouselPrevious";
var CarouselNext = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, _b = _a.variant, variant = _b === void 0 ? "secondary" : _b, _c = _a.size, size = _c === void 0 ? "md" : _c, props = __rest(_a, ["className", "variant", "size"]);
    var t = (0, macro_1.useLingui)().t;
    var _d = useCarousel(), scrollNext = _d.scrollNext, canScrollNext = _d.canScrollNext;
    return (<IconButton_1.IconButton ref={ref} variant={variant} size={size} className={(0, cn_1.cn)("h-8 w-8 rounded-full before:rounded-full", className)} disabled={!canScrollNext} onClick={scrollNext} aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Next slide"], ["Next slide"])))} icon={<lu_1.LuArrowRight />} {...props}/>);
});
exports.CarouselNext = CarouselNext;
CarouselNext.displayName = "CarouselNext";
var templateObject_1, templateObject_2;
