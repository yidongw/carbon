"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TruncatedTooltipText = TruncatedTooltipText;
var react_1 = require("react");
var Tooltip_1 = require("./Tooltip");
var cn_1 = require("./utils/cn");
var isTextTruncated = function (element) {
    return element.scrollWidth > element.clientWidth ||
        element.scrollHeight > element.clientHeight;
};
function TruncatedTooltipText(_a) {
    var children = _a.children, tooltip = _a.tooltip, className = _a.className, contentClassName = _a.contentClassName, _b = _a.enabled, enabled = _b === void 0 ? true : _b;
    var triggerRef = (0, react_1.useRef)(null);
    var _c = (0, react_1.useState)(false), isTruncated = _c[0], setIsTruncated = _c[1];
    var measureTruncation = (0, react_1.useCallback)(function () {
        if (!enabled || !tooltip || !triggerRef.current) {
            setIsTruncated(false);
            return;
        }
        setIsTruncated(isTextTruncated(triggerRef.current));
    }, [enabled, tooltip]);
    (0, react_1.useEffect)(function () {
        measureTruncation();
        if (!triggerRef.current || typeof ResizeObserver === "undefined")
            return;
        var observer = new ResizeObserver(function () {
            measureTruncation();
        });
        observer.observe(triggerRef.current);
        return function () { return observer.disconnect(); };
    }, [measureTruncation]);
    if (!enabled || !tooltip) {
        return <span className={className}>{children}</span>;
    }
    return (<Tooltip_1.Tooltip>
      <Tooltip_1.TooltipTrigger asChild>
        <span ref={triggerRef} className={(0, cn_1.cn)("min-w-0", className)} onMouseEnter={measureTruncation} onFocus={measureTruncation}>
          {children}
        </span>
      </Tooltip_1.TooltipTrigger>
      {isTruncated ? (<Tooltip_1.TooltipContent side="top" align="start" sideOffset={6} className={(0, cn_1.cn)("max-w-[min(560px,calc(100vw-2rem))] whitespace-normal break-words border-border/80 bg-card/95 text-card-foreground shadow-xl backdrop-blur-sm", contentClassName)}>
          {tooltip}
        </Tooltip_1.TooltipContent>) : null}
    </Tooltip_1.Tooltip>);
}
