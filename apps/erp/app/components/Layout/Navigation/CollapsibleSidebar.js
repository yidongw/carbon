"use strict";
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
exports.CollapsibleSidebar = exports.CollapsibleSidebarTrigger = void 0;
exports.useCollapsibleSidebar = useCollapsibleSidebar;
exports.CollapsibleSidebarProvider = CollapsibleSidebarProvider;
var react_1 = require("@carbon/react");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var ui_1 = require("~/stores/ui");
var CollapsibleSidebarContext = (0, react_2.createContext)(undefined);
function useCollapsibleSidebar() {
    var context = (0, react_2.useContext)(CollapsibleSidebarContext);
    if (!context) {
        // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
        return { hasSidebar: false, isOpen: false, onToggle: function () { } };
    }
    return context;
}
function CollapsibleSidebarProvider(_a) {
    var children = _a.children;
    var isMobile = (0, react_1.useIsMobile)();
    var isSidebarOpen = (0, ui_1.useUIStore)(function (state) { return state.isSidebarOpen; });
    var setSidebarOpen = (0, ui_1.useUIStore)(function (state) { return state.setSidebarOpen; });
    var toggleSidebar = (0, ui_1.useUIStore)(function (state) { return state.toggleSidebar; });
    (0, react_2.useEffect)(function () {
        if (isMobile) {
            setSidebarOpen(false);
        }
        else {
            setSidebarOpen(true);
        }
    }, [isMobile, setSidebarOpen]);
    return (<CollapsibleSidebarContext.Provider value={{
            hasSidebar: true,
            isOpen: isSidebarOpen,
            onToggle: toggleSidebar
        }}>
      {children}
    </CollapsibleSidebarContext.Provider>);
}
exports.CollapsibleSidebarTrigger = (0, react_2.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var _b = useCollapsibleSidebar(), isOpen = _b.isOpen, onToggle = _b.onToggle, hasSidebar = _b.hasSidebar;
    if (!hasSidebar)
        return null;
    return (<react_1.IconButton variant="ghost" ref={ref} onClick={onToggle} {...props} aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"} icon={<lu_1.LuPanelLeft />} className={(0, react_1.cn)("-ml-1", className)}/>);
});
exports.CollapsibleSidebarTrigger.displayName = "CollapsibleSidebarTrigger";
// ease-out-quart: feels snappy and responsive for sidebar expand/collapse
var easeOutQuart = [0.165, 0.84, 0.44, 1];
var CollapsibleSidebar = function (_a) {
    var children = _a.children, _b = _a.width, width = _b === void 0 ? 180 : _b;
    var isOpen = useCollapsibleSidebar().isOpen;
    var shouldReduceMotion = (0, framer_motion_1.useReducedMotion)();
    var variants = (0, react_2.useMemo)(function () {
        return {
            visible: {
                width: width,
                opacity: 1
            },
            hidden: {
                width: 0,
                opacity: 0
            }
        };
    }, [width]);
    return (<framer_motion_1.motion.div animate={isOpen ? "visible" : "hidden"} initial={shouldReduceMotion ? false : variants.visible} transition={shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: 0.2,
                ease: easeOutQuart,
                opacity: { duration: 0.15 }
            }} variants={variants} className="relative flex h-full min-h-0">
      <div className="h-full w-full overflow-hidden bg-card border-r border-border">
        {isOpen ? children : null}
      </div>
    </framer_motion_1.motion.div>);
};
exports.CollapsibleSidebar = CollapsibleSidebar;
