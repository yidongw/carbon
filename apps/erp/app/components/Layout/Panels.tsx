import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  useIsMobile,
  useIsomorphicLayoutEffect
} from "@carbon/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

interface PanelContextType {
  hasExplorer: boolean;
  setHasExplorer: (v: boolean) => void;
  isExplorerCollapsed: boolean;
  isPropertiesCollapsed: boolean;
  toggleExplorer: () => void;
  toggleProperties: () => void;
  setIsExplorerCollapsed: (collapsed: boolean) => void;
  setIsPropertiesCollapsed: (collapsed: boolean) => void;
  // Desired explorer width in px, requested by the explorer content so the
  // panel can auto-size to fit its longest line (capped). null = no request.
  requestedExplorerWidth: number | null;
  setRequestedExplorerWidth: (v: number | null) => void;
}

const PanelContext = createContext<PanelContextType>({
  hasExplorer: false,
  // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
  setHasExplorer: () => {},
  isExplorerCollapsed: false,
  isPropertiesCollapsed: false,
  // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
  toggleExplorer: () => {},
  // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
  toggleProperties: () => {},
  // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
  setIsExplorerCollapsed: () => {},
  // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
  setIsPropertiesCollapsed: () => {},
  requestedExplorerWidth: null,
  // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
  setRequestedExplorerWidth: () => {}
});

export function usePanels() {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error("usePanels must be used within a PanelProvider");
  }
  return context;
}

interface PanelProviderProps {
  children: React.ReactNode;
}

export function PanelProvider({ children }: PanelProviderProps) {
  const isMobile = useIsMobile();

  const [hasExplorer, setHasExplorer] = useState(false);
  const [isExplorerCollapsed, setIsExplorerCollapsed] = useState(false);
  const [isPropertiesCollapsed, setIsPropertiesCollapsed] = useState(false);
  const [requestedExplorerWidth, setRequestedExplorerWidth] = useState<
    number | null
  >(null);

  // Collapse panels synchronously before first paint based on viewport width.
  // useIsomorphicLayoutEffect (useLayoutEffect on client) fires before the browser
  // paints, so the user never sees the uncollapsed flash from SSR's false defaults.
  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) {
      setIsExplorerCollapsed(true);
      setIsPropertiesCollapsed(true);
    } else if (window.innerWidth < 1024) {
      setIsPropertiesCollapsed(true);
    }
  }, []);

  // Keep panels collapsed when resizing down to mobile
  useEffect(() => {
    if (isMobile) {
      setIsExplorerCollapsed(true);
      setIsPropertiesCollapsed(true);
    }
  }, [isMobile]);

  const value = {
    hasExplorer,
    setHasExplorer,
    isExplorerCollapsed,
    isPropertiesCollapsed,
    toggleExplorer: () => setIsExplorerCollapsed((prev) => !prev),
    toggleProperties: () => setIsPropertiesCollapsed((prev) => !prev),
    setIsExplorerCollapsed,
    setIsPropertiesCollapsed,
    requestedExplorerWidth,
    setRequestedExplorerWidth
  };

  return (
    <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
  );
}

interface ResizablePanelsProps {
  explorer?: React.ReactNode;
  content: React.ReactNode;
  properties?: React.ReactNode;
}

export function ResizablePanels({
  explorer,
  content,
  properties
}: ResizablePanelsProps) {
  const isMobile = useIsMobile();
  const {
    isExplorerCollapsed,
    isPropertiesCollapsed,
    setIsExplorerCollapsed,
    setIsPropertiesCollapsed,
    setHasExplorer,
    requestedExplorerWidth
  } = usePanels();
  const panelRef = useRef<ImperativePanelHandle>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const appliedWidthRef = useRef<number | null>(null);

  useEffect(() => {
    setHasExplorer(!!explorer);
  }, [explorer, setHasExplorer]);

  useIsomorphicLayoutEffect(() => {
    if (isMobile || !explorer) return;
    if (isExplorerCollapsed) {
      panelRef.current?.collapse();
    } else {
      panelRef.current?.expand();
    }
  }, [isExplorerCollapsed, explorer, isMobile]);

  // Auto-size the explorer to fit the widest line its content reported, capped
  // so a long description can't take over the screen. Re-applies whenever the
  // requested width changes (e.g. navigating to different content); a manual
  // drag doesn't change that value, so it won't fight the user mid-page.
  useEffect(() => {
    if (isMobile || !explorer || isExplorerCollapsed) return;
    if (requestedExplorerWidth == null) return;
    if (appliedWidthRef.current === requestedExplorerWidth) return;
    const groupWidth = groupRef.current?.clientWidth ?? 0;
    if (groupWidth <= 0) return;
    // Floor so short BoM lines can't shrink the panel below the width its
    // header (tabs, search) needs; cap so long descriptions can't take over.
    const EXPLORER_MIN_PX = 300;
    const EXPLORER_MAX_PERCENT = 45;
    const minPercent = (EXPLORER_MIN_PX / groupWidth) * 100;
    const percent = Math.min(
      EXPLORER_MAX_PERCENT,
      Math.max(minPercent, (requestedExplorerWidth / groupWidth) * 100)
    );
    panelRef.current?.resize(percent);
    appliedWidthRef.current = requestedExplorerWidth;
  }, [requestedExplorerWidth, isExplorerCollapsed, isMobile, explorer]);

  if (isMobile) {
    return (
      <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">{content}</div>

        {/* Explorer drawer — slides in from the left */}
        {explorer && !isExplorerCollapsed && (
          <>
            <div
              className="fixed inset-0 top-[49px] bg-black/50 z-40 touch-none"
              onClick={() => setIsExplorerCollapsed(true)}
            />
            <div className="fixed top-[49px] bottom-0 left-0 w-4/5 max-w-sm bg-card z-50 overflow-hidden shadow-xl flex flex-col">
              <div className="h-full overflow-y-auto overflow-x-hidden overscroll-contain w-full min-w-0">
                {explorer}
              </div>
            </div>
          </>
        )}

        {/* Properties drawer — slides in from the right */}
        {properties && !isPropertiesCollapsed && (
          <>
            <div
              className="fixed inset-0 top-[49px] bg-black/50 z-40 touch-none"
              onClick={() => setIsPropertiesCollapsed(true)}
            />
            {/* Outer wrapper clips horizontal overflow from fixed-width property
                panels (e.g. w-96). Inner wrapper provides the h-full scroll
                context that properties components rely on. */}
            <div className="fixed top-[49px] bottom-0 right-0 w-4/5 max-w-sm z-50 shadow-xl overflow-hidden">
              <div className="h-full overflow-y-auto overflow-x-hidden overscroll-contain w-full min-w-0">
                {properties}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div ref={groupRef} className="h-full w-full min-h-0 min-w-0">
      <ResizablePanelGroup direction="horizontal">
        {explorer && (
          <>
            <ResizablePanel
              ref={panelRef}
              order={1}
              minSize={10}
              className="bg-card shadow-lg overflow-hidden"
              collapsible
              defaultSize={isExplorerCollapsed ? 0 : 25}
              collapsedSize={0}
              onCollapse={() => setIsExplorerCollapsed(true)}
              onExpand={() => setIsExplorerCollapsed(false)}
            >
              {!isExplorerCollapsed && (
                <div className="h-full overflow-y-auto overflow-x-hidden overscroll-contain">
                  {explorer}
                </div>
              )}
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}
        <ResizablePanel
          order={2}
          className="z-1 relative min-h-0 min-w-0 h-full"
        >
          <div className="flex h-full min-h-0 min-w-0 overflow-hidden w-full">
            <div className="flex min-h-0 min-w-0 h-full flex-1 flex-col overflow-hidden">
              {content}
            </div>
            {!isPropertiesCollapsed && properties && (
              <div className="w-96 max-w-[min(24rem,40%)] min-w-[280px] shrink-0 h-full overflow-hidden border-l border-border">
                {properties}
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
