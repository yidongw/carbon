import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  useIsMobile
} from "@carbon/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { LuPanelLeft, LuPanelRight, LuX } from "react-icons/lu";
import type { ImperativePanelHandle } from "react-resizable-panels";

interface PanelContextType {
  hasExplorer: boolean;
  setHasExplorer: (v: boolean) => void;
  hasProperties: boolean;
  setHasProperties: (v: boolean) => void;
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
  hasProperties: false,
  // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
  setHasProperties: () => {},
  isExplorerCollapsed: true,
  isPropertiesCollapsed: true,
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
  const [hasProperties, setHasProperties] = useState(false);
  const [isExplorerCollapsed, setIsExplorerCollapsed] = useState(
    isBrowser ? isMobile : false
  );
  const [isPropertiesCollapsed, setIsPropertiesCollapsed] = useState(
    isBrowser ? window.innerWidth < 1024 : false
  );

  const value = {
    hasExplorer,
    setHasExplorer,
    hasProperties,
    setHasProperties,
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
  const {
    isExplorerCollapsed,
    isPropertiesCollapsed,
    setIsExplorerCollapsed,
    setIsPropertiesCollapsed,
    setHasExplorer,
    setHasProperties
  } = usePanels();
  const isMobile = useIsMobile();
  const panelRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    setHasExplorer(!!explorer);
  }, [explorer, setHasExplorer]);

  useEffect(() => {
    setHasProperties(!!properties);
  }, [properties, setHasProperties]);

  useEffect(() => {
    if (!explorer || isMobile) return;
    if (isExplorerCollapsed) {
      panelRef.current?.collapse();
    } else {
      panelRef.current?.expand();
    }
  }, [isExplorerCollapsed, explorer, isMobile]);

  if (isMobile) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        {/* Explorer overlay when open */}
        {explorer && !isExplorerCollapsed && (
          <div className="absolute inset-0 z-50 flex flex-col bg-card shadow-lg">
            <div className="flex flex-shrink-0 items-center justify-end border-b border-border p-1">
              <button
                type="button"
                className="rounded-md p-1.5 hover:bg-muted"
                onClick={() => setIsExplorerCollapsed(true)}
              >
                <LuX className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{explorer}</div>
          </div>
        )}
        {/* Explorer toggle button on left edge */}
        {explorer && isExplorerCollapsed && (
          <button
            type="button"
            className="absolute left-0 top-1/2 z-40 -translate-y-1/2 rounded-r-md border border-l-0 border-border bg-card px-1 py-3 shadow-md hover:bg-muted"
            onClick={() => setIsExplorerCollapsed(false)}
          >
            <LuPanelLeft className="h-4 w-4" />
          </button>
        )}
        {/* Properties overlay when open */}
        {properties && !isPropertiesCollapsed && (
          <div className="absolute inset-0 z-50 flex flex-col bg-card shadow-lg">
            <div className="flex flex-shrink-0 items-center justify-start border-b border-border p-1">
              <button
                type="button"
                className="rounded-md p-1.5 hover:bg-muted"
                onClick={() => setIsPropertiesCollapsed(true)}
              >
                <LuX className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto [&>*]:!w-full [&>*]:!border-l-0">
              {properties}
            </div>
          </div>
        )}
        {/* Properties toggle button on right edge */}
        {properties && isPropertiesCollapsed && (
          <button
            type="button"
            className="absolute right-0 top-1/2 z-40 -translate-y-1/2 rounded-l-md border border-r-0 border-border bg-card px-1 py-3 shadow-md hover:bg-muted"
            onClick={() => setIsPropertiesCollapsed(false)}
          >
            <LuPanelRight className="h-4 w-4" />
          </button>
        )}
        {/* Main content */}
        {content}
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      {explorer && (
        <>
          <ResizablePanel
            ref={panelRef}
            order={1}
            minSize={10}
            className="bg-card shadow-lg"
            collapsible
            defaultSize={isExplorerCollapsed ? 0 : 20}
            collapsedSize={0}
            onCollapse={() => setIsExplorerCollapsed(true)}
            onExpand={() => setIsExplorerCollapsed(false)}
          >
            {!isExplorerCollapsed && explorer}
          </ResizablePanel>
          <ResizableHandle withHandle />
        </>
      )}
      <ResizablePanel order={2} className="z-1 relative">
        <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
          {content}
          {!isPropertiesCollapsed && properties}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
