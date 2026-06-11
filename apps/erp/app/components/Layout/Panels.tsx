import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useIsMobile
} from "@carbon/react";
import { Trans } from "@lingui/react/macro";
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
  const isMobile = useIsMobile();
  const panelRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    setHasExplorer(!!explorer);
  }, [explorer, setHasExplorer]);

  useEffect(() => {
    if (!explorer || isMobile) return;
    if (isExplorerCollapsed) {
      panelRef.current?.collapse();
    } else {
      panelRef.current?.expand();
    }
  }, [isExplorerCollapsed, explorer, isMobile]);

  if (isMobile) {
    const mainContent = properties ? (
      <Tabs defaultValue="details" className="flex h-full w-full flex-col">
        <div className="flex-shrink-0 border-b border-border px-2 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="properties" className="flex-1">
              <Trans>Properties</Trans>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex-1">
              <Trans>Details</Trans>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="properties"
          className="m-0 flex-1 min-h-0 overflow-y-auto [&>*]:!w-full [&>*]:!border-l-0"
        >
          {properties}
        </TabsContent>
        <TabsContent
          value="details"
          className="m-0 flex-1 min-h-0 overflow-hidden [&>*]:!h-full"
        >
          {content}
        </TabsContent>
      </Tabs>
    ) : (
      content
    );

    return (
      <div className="relative h-full w-full overflow-hidden">
        {explorer && !isExplorerCollapsed && (
          <div className="absolute inset-0 z-50 overflow-y-auto bg-card shadow-lg">
            {explorer}
          </div>
        )}
        {mainContent}
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
