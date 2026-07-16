"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectionAwareTabs = DirectionAwareTabs;
var react_1 = require("@carbon/react");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var react_use_measure_1 = require("react-use-measure");
function DirectionAwareTabs(_a) {
    var _b, _c;
    var tabs = _a.tabs, className = _a.className, rounded = _a.rounded, onChange = _a.onChange, initialTabId = _a.initialTabId, tabsListClassName = _a.tabsListClassName, tabClassName = _a.tabClassName;
    var fallbackTabId = (_c = (_b = tabs[0]) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : 0;
    var _d = (0, react_2.useState)(tabs.some(function (tab) { return tab.id === initialTabId; })
        ? (initialTabId !== null && initialTabId !== void 0 ? initialTabId : fallbackTabId)
        : fallbackTabId), activeTab = _d[0], setActiveTab = _d[1];
    var _e = (0, react_2.useState)(0), direction = _e[0], setDirection = _e[1];
    var _f = (0, react_2.useState)(false), isAnimating = _f[0], setIsAnimating = _f[1];
    var _g = (0, react_use_measure_1.default)(), ref = _g[0], bounds = _g[1];
    (0, react_2.useEffect)(function () {
        var nextTabId = tabs.some(function (tab) { return tab.id === initialTabId; })
            ? (initialTabId !== null && initialTabId !== void 0 ? initialTabId : fallbackTabId)
            : fallbackTabId;
        setActiveTab(function (currentTab) {
            return tabs.some(function (tab) { return tab.id === currentTab; }) ? currentTab : nextTabId;
        });
    }, [fallbackTabId, initialTabId, tabs]);
    var content = (0, react_2.useMemo)(function () {
        var _a;
        var activeTabContent = (_a = tabs.find(function (tab) { return tab.id === activeTab; })) === null || _a === void 0 ? void 0 : _a.content;
        return activeTabContent || null;
    }, [activeTab, tabs]);
    var handleTabClick = function (newTabId) {
        if (newTabId !== activeTab && !isAnimating) {
            var newDirection = newTabId > activeTab ? 1 : -1;
            setDirection(newDirection);
            setActiveTab(newTabId);
            onChange === null || onChange === void 0 ? void 0 : onChange();
        }
    };
    var variants = {
        initial: function (direction) { return ({
            x: 300 * direction,
            opacity: 0,
            filter: "blur(4px)"
        }); },
        active: {
            x: 0,
            opacity: 1,
            filter: "blur(0px)"
        },
        exit: function (direction) { return ({
            x: -300 * direction,
            opacity: 0,
            filter: "blur(4px)"
        }); }
    };
    return (<framer_motion_1.motion.div initial={{
            opacity: 0,
            filter: "blur(4px)"
        }} animate={{
            opacity: 1,
            filter: "blur(0px)"
        }} transition={{ duration: 0.2, delay: 0.3 }} className="flex flex-col items-center w-full">
      <div className={(0, react_1.cn)("flex w-auto flex-wrap gap-1 rounded-lg cursor-pointer bg-muted p-1 shadow-inner", className, tabsListClassName, rounded)}>
        {tabs.map(function (tab) { return (<button key={tab.id} disabled={tab.disabled} onClick={function () { return handleTabClick(tab.id); }} className={(0, react_1.cn)("relative flex flex-initial items-center justify-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium text-foreground/80 transition focus-visible:outline-1 focus-visible:outline-none focus-visible:ring-2 ring-ring ring-offset-ring", activeTab === tab.id
                ? "text-foreground"
                : "hover:text-foreground/60 text-foreground/80", rounded, tab.disabled && "cursor-not-allowed opacity-50", tabClassName)} style={{ WebkitTapHighlightColor: "transparent" }}>
            {activeTab === tab.id && (<framer_motion_1.motion.span layoutId="bubble" className="absolute inset-0 z-10 bg-background text-foreground rounded-md border" transition={{ type: "spring", bounce: 0, duration: 0.4 }}/>)}
            <span className="z-20 min-w-0 text-center">{tab.label}</span>
          </button>); })}
      </div>
      <framer_motion_1.MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0 }}>
        <framer_motion_1.motion.div className="relative mx-auto h-full w-full min-w-0 overflow-hidden" initial={false} animate={{ height: bounds.height }}>
          <div className="min-w-0 p-1" ref={ref}>
            <framer_motion_1.AnimatePresence custom={direction} mode="popLayout" onExitComplete={function () { return setIsAnimating(false); }}>
              <framer_motion_1.motion.div className="min-w-0" key={activeTab} variants={variants} initial="initial" animate="active" exit="exit" custom={direction} onAnimationStart={function () { return setIsAnimating(true); }} onAnimationComplete={function () { return setIsAnimating(false); }}>
                {content}
              </framer_motion_1.motion.div>
            </framer_motion_1.AnimatePresence>
          </div>
        </framer_motion_1.motion.div>
      </framer_motion_1.MotionConfig>
    </framer_motion_1.motion.div>);
}
