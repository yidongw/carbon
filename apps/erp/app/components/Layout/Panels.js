"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePanels = usePanels;
exports.PanelProvider = PanelProvider;
exports.ResizablePanels = ResizablePanels;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var PanelContext = (0, react_2.createContext)({
    hasExplorer: false,
    // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
    setHasExplorer: function () { },
    isExplorerCollapsed: false,
    isPropertiesCollapsed: false,
    // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
    toggleExplorer: function () { },
    // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
    toggleProperties: function () { },
    // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
    setIsExplorerCollapsed: function () { },
    // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
    setIsPropertiesCollapsed: function () { }
});
function usePanels() {
    var context = (0, react_2.useContext)(PanelContext);
    if (!context) {
        throw new Error("usePanels must be used within a PanelProvider");
    }
    return context;
}
function PanelProvider(_a) {
    var children = _a.children;
    var isMobile = (0, react_1.useIsMobile)();
    var _b = (0, react_2.useState)(false), hasExplorer = _b[0], setHasExplorer = _b[1];
    var _c = (0, react_2.useState)(false), isExplorerCollapsed = _c[0], setIsExplorerCollapsed = _c[1];
    var _d = (0, react_2.useState)(false), isPropertiesCollapsed = _d[0], setIsPropertiesCollapsed = _d[1];
    // Collapse panels synchronously before first paint based on viewport width.
    // useIsomorphicLayoutEffect (useLayoutEffect on client) fires before the browser
    // paints, so the user never sees the uncollapsed flash from SSR's false defaults.
    (0, react_1.useIsomorphicLayoutEffect)(function () {
        if (typeof window === "undefined")
            return;
        if (window.innerWidth < 768) {
            setIsExplorerCollapsed(true);
            setIsPropertiesCollapsed(true);
        }
        else if (window.innerWidth < 1024) {
            setIsPropertiesCollapsed(true);
        }
    }, []);
    // Keep panels collapsed when resizing down to mobile
    (0, react_2.useEffect)(function () {
        if (isMobile) {
            setIsExplorerCollapsed(true);
            setIsPropertiesCollapsed(true);
        }
    }, [isMobile]);
    var value = {
        hasExplorer: hasExplorer,
        setHasExplorer: setHasExplorer,
        isExplorerCollapsed: isExplorerCollapsed,
        isPropertiesCollapsed: isPropertiesCollapsed,
        toggleExplorer: function () { return setIsExplorerCollapsed(function (prev) { return !prev; }); },
        toggleProperties: function () { return setIsPropertiesCollapsed(function (prev) { return !prev; }); },
        setIsExplorerCollapsed: setIsExplorerCollapsed,
        setIsPropertiesCollapsed: setIsPropertiesCollapsed
    };
    return (<PanelContext.Provider value={value}>{children}</PanelContext.Provider>);
}
function ResizablePanels(_a) {
    var explorer = _a.explorer, content = _a.content, properties = _a.properties;
    var isMobile = (0, react_1.useIsMobile)();
    var _b = usePanels(), isExplorerCollapsed = _b.isExplorerCollapsed, isPropertiesCollapsed = _b.isPropertiesCollapsed, setIsExplorerCollapsed = _b.setIsExplorerCollapsed, setIsPropertiesCollapsed = _b.setIsPropertiesCollapsed, setHasExplorer = _b.setHasExplorer;
    var panelRef = (0, react_2.useRef)(null);
    (0, react_2.useEffect)(function () {
        setHasExplorer(!!explorer);
    }, [explorer, setHasExplorer]);
    (0, react_1.useIsomorphicLayoutEffect)(function () {
        var _a, _b;
        if (isMobile || !explorer)
            return;
        if (isExplorerCollapsed) {
            (_a = panelRef.current) === null || _a === void 0 ? void 0 : _a.collapse();
        }
        else {
            (_b = panelRef.current) === null || _b === void 0 ? void 0 : _b.expand();
        }
    }, [isExplorerCollapsed, explorer, isMobile]);
    if (isMobile) {
        return (<div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">{content}</div>

        {/* Explorer drawer — slides in from the left */}
        {explorer && !isExplorerCollapsed && (<>
            <div className="fixed inset-0 top-[49px] bg-black/50 z-40 touch-none" onClick={function () { return setIsExplorerCollapsed(true); }}/>
            <div className="fixed top-[49px] bottom-0 left-0 w-4/5 max-w-sm bg-card z-50 overflow-hidden shadow-xl flex flex-col">
              <div className="h-full overflow-y-auto overflow-x-hidden overscroll-contain w-full min-w-0">
                {explorer}
              </div>
            </div>
          </>)}

        {/* Properties drawer — slides in from the right */}
        {properties && !isPropertiesCollapsed && (<>
            <div className="fixed inset-0 top-[49px] bg-black/50 z-40 touch-none" onClick={function () { return setIsPropertiesCollapsed(true); }}/>
            {/* Outer wrapper clips horizontal overflow from fixed-width property
                    panels (e.g. w-96). Inner wrapper provides the h-full scroll
                    context that properties components rely on. */}
            <div className="fixed top-[49px] bottom-0 right-0 w-4/5 max-w-sm z-50 shadow-xl overflow-hidden">
              <div className="h-full overflow-y-auto overflow-x-hidden overscroll-contain w-full min-w-0">
                {properties}
              </div>
            </div>
          </>)}
      </div>);
    }
    return (<react_1.ResizablePanelGroup direction="horizontal">
      {explorer && (<>
          <react_1.ResizablePanel ref={panelRef} order={1} minSize={10} className="bg-card shadow-lg overflow-hidden" collapsible defaultSize={isExplorerCollapsed ? 0 : 20} collapsedSize={0} onCollapse={function () { return setIsExplorerCollapsed(true); }} onExpand={function () { return setIsExplorerCollapsed(false); }}>
            {!isExplorerCollapsed && (<div className="h-full overflow-y-auto overflow-x-hidden overscroll-contain">
                {explorer}
              </div>)}
          </react_1.ResizablePanel>
          <react_1.ResizableHandle withHandle/>
        </>)}
      <react_1.ResizablePanel order={2} className="z-1 relative min-h-0 min-w-0 h-full">
        <div className="flex h-full min-h-0 min-w-0 overflow-hidden w-full">
          <div className="flex min-h-0 min-w-0 h-full flex-1 flex-col overflow-hidden">
            {content}
          </div>
          {!isPropertiesCollapsed && properties && (<div className="w-96 max-w-[min(24rem,40%)] min-w-[280px] shrink-0 h-full overflow-hidden border-l border-border">
              {properties}
            </div>)}
        </div>
      </react_1.ResizablePanel>
    </react_1.ResizablePanelGroup>);
}
