import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  useIsMobile
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
  setIsPropertiesCollapsed: () => {}
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
  const isBrowser = typeof window !== "undefined";
  const isMobile = useIsMobile();

  const [hasExplorer, setHasExplorer] = useState(false);
  const [isExplorerCollapsed, setIsExplorerCollapsed] = useState(
    isBrowser ? isMobile : false
  );
  const [isPropertiesCollapsed, setIsPropertiesCollapsed] = useState(
    isBrowser ? window.innerWidth < 1024 : false
  );

  const value = {
    hasExplorer,
    setHasExplorer,
    isExplorerCollapsed,
    isPropertiesCollapsed,
    toggleExplorer: () => setIsExplorerCollapsed((prev) => !prev),
    toggleProperties: () => setIsPropertiesCollapsed((prev) => !prev),
    setIsExplorerCollapsed,
    setIsPropertiesCollapsed
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (isMobile) {
      setIsExplorerCollapsed(true);
      setIsPropertiesCollapsed(true);
    }
  }, [isBrowser, isMobile]);

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
  const { isExplorerCollapsed, isPropertiesCollapsed, setIsExplorerCollapsed, setHasExplorer } =
    usePanels();
  const panelRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    setHasExplorer(!!explorer);
  }, [explorer, setHasExplorer]);

  useEffect(() => {
    if (!explorer) return;
    if (isExplorerCollapsed) {
      panelRef.current?.collapse();
    } else {
      panelRef.current?.expand();
    }
  }, [isExplorerCollapsed, explorer]);

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-0">
      {explorer && (
        <>
          <ResizablePanel
            ref={panelRef}
            order={1}
            minSize={10}
            className="min-w-0 bg-card shadow-lg"
            collapsible
            defaultSize={isExplorerCollapsed ? 0 : 20}
            collapsedSize={0}
            onCollapse={() => setIsExplorerCollapsed(true)}
            onExpand={() => setIsExplorerCollapsed(false)}
          >
            {!isExplorerCollapsed && (
              <div className="h-full min-h-0 min-w-0 overflow-hidden [&>*]:h-full [&>*]:min-h-0">
                {explorer}
              </div>
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />
        </>
      )}
      <ResizablePanel order={2} className="relative z-1 min-w-0">
        <div className="flex h-[calc(100dvh-99px)] w-full min-w-0 overflow-hidden">
          <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{content}</div>
          {!isPropertiesCollapsed && properties ? (
            <div className="h-full w-[min(100%,24rem)] max-w-[28rem] shrink-0 overflow-hidden border-l border-border [&>*]:!h-full [&>*]:!w-full [&>*]:!max-w-full [&>*]:!min-w-0 [&>*]:!overflow-x-hidden [&>*]:overscroll-y-contain">
              {properties}
            </div>
          ) : null}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
