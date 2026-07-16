"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSearchSources = void 0;
exports.WebSearchButton = WebSearchButton;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var store_1 = require("./lib/store");
function extractDomainFromUrl(url) {
    try {
        var urlObj = new URL(url);
        return urlObj.hostname.replace(/^www\./, "");
    }
    catch (_a) {
        return "";
    }
}
var WebSearchSources = function (_a) {
    var providedSources = _a.sources, _b = _a.showSourceCount, showSourceCount = _b === void 0 ? true : _b, className = _a.className;
    var _c = (0, react_2.useState)([]), animatedSources = _c[0], setAnimatedSources = _c[1];
    // Animate in sources as they become available
    (0, react_2.useEffect)(function () {
        if (!(providedSources === null || providedSources === void 0 ? void 0 : providedSources.length)) {
            setAnimatedSources([]);
            return;
        }
        // Add sources one by one with a delay
        providedSources.forEach(function (source, index) {
            setTimeout(function () {
                setAnimatedSources(function (prev) {
                    // Only add if not already present
                    if (prev.some(function (s) { return s.url === source.url; })) {
                        return prev;
                    }
                    return __spreadArray(__spreadArray([], prev, true), [source], false);
                });
            }, index * 150); // 150ms delay between each source
        });
    }, [providedSources]);
    if (!(providedSources === null || providedSources === void 0 ? void 0 : providedSources.length)) {
        return null;
    }
    return (<framer_motion_1.motion.div className={(0, react_1.cn)("mt-3", className)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <react_1.TooltipProvider>
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-2">
            <framer_motion_1.AnimatePresence mode="popLayout">
              {animatedSources.map(function (source, index) { return (<WebSearchSourceAvatar key={source.url} source={source} zIndex={animatedSources.length - index} index={index}/>); })}
            </framer_motion_1.AnimatePresence>
          </div>
          <framer_motion_1.motion.div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-full" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <span className="text-xs text-muted-foreground font-medium">
              <macro_1.Trans>Sources</macro_1.Trans>
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <framer_motion_1.motion.span className="text-xs text-muted-foreground" key={animatedSources.length} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
              {animatedSources.length}
            </framer_motion_1.motion.span>
          </framer_motion_1.motion.div>
        </div>
      </react_1.TooltipProvider>
    </framer_motion_1.motion.div>);
};
exports.WebSearchSources = WebSearchSources;
var WebSearchSourceAvatar = function (_a) {
    var source = _a.source, _b = _a.zIndex, zIndex = _b === void 0 ? 0 : _b, _c = _a.index, index = _c === void 0 ? 0 : _c;
    var domain = source.domain || extractDomainFromUrl(source.url || "");
    return (<react_1.Tooltip delayDuration={100}>
      <react_1.TooltipTrigger asChild>
        <framer_motion_1.motion.div className="inline-flex cursor-pointer" style={{ zIndex: zIndex }} initial={{ opacity: 0, scale: 0, x: -20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0, x: -20 }} transition={{
            duration: 0.4,
            delay: index * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 20
        }} whileHover={{
            scale: 1.1,
            transition: { duration: 0.2 }
        }} whileTap={{ scale: 0.95 }} onClick={function () {
            return window.open(source.url, "_blank", "noopener,noreferrer");
        }}>
          <react_1.Avatar className="h-5 w-5 cursor-pointer border-2 border-background shadow-sm" src={"https://img.logo.dev/".concat(domain, "?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&size=64&retina=true")} name={domain.split(".")[0]}/>
        </framer_motion_1.motion.div>
      </react_1.TooltipTrigger>
      <react_1.TooltipContent side="top" className="max-w-xs">
        <div className="space-y-1">
          <p className="font-medium text-sm">{source.title}</p>
          <p className="text-xs text-muted-foreground">{domain}</p>
        </div>
      </react_1.TooltipContent>
    </react_1.Tooltip>);
};
function WebSearchButton() {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, store_1.useChatStore)(), isWebSearch = _a.isWebSearch, setIsWebSearch = _a.setIsWebSearch;
    return (<react_1.IconButton type="button" variant={isWebSearch ? "primary" : "ghost"} icon={<lu_1.LuGlobe />} onClick={function () { return setIsWebSearch(!isWebSearch); }} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Web Search"], ["Web Search"])))}/>);
}
var templateObject_1;
