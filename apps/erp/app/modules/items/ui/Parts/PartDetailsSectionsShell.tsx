import { Menubar, Skeleton, VStack } from "@carbon/react";
import { ExplorerSkeleton, PartContentSkeleton } from "~/components/Skeletons";
import { PanelProvider, ResizablePanels } from "~/components/Layout";
import { UsedInSkeleton } from "~/modules/items/ui/Item/UsedIn";

export function PartDetailsSectionsShell() {
  return (
    <>
      <Menubar />
      <ExplorerSkeleton />
      <ExplorerSkeleton />
      <ExplorerSkeleton />
      <div className="p-4">
        <Skeleton className="h-48 w-full" />
      </div>
      <ExplorerSkeleton />
    </>
  );
}

export function PartDetailsPageShell() {
  return (
    <VStack spacing={2} className="p-2">
      <div className="p-4">
        <Skeleton className="mb-2 h-6 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
      <PartDetailsSectionsShell />
    </VStack>
  );
}

export function PartPageHydrateFallback() {
  return (
    <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
      <div className="flex h-[50px] flex-shrink-0 items-center border-b bg-card px-4">
        <Skeleton className="h-6 w-24" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
      <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
        <PanelProvider>
          <ResizablePanels
            explorer={
              <div className="p-2">
                <Skeleton className="mb-2 h-8 w-full" />
                <UsedInSkeleton />
              </div>
            }
            content={<PartDetailsPageShell />}
            properties={
              <div className="w-80 border-l p-4">
                <PartContentSkeleton />
              </div>
            }
          />
        </PanelProvider>
      </div>
    </div>
  );
}
