import { Menubar, Skeleton, VStack } from "@carbon/react";
import { ExplorerSkeleton, PartContentSkeleton } from "~/components/Skeletons";
import { PanelProvider, ResizablePanels } from "~/components/Layout";
import { UsedInSkeleton } from "~/modules/items/ui/Item/UsedIn";
import { usePermissions } from "~/hooks";

export function PartDetailsSectionsShell() {
  const permissions = usePermissions();

  return (
    <>
      {permissions.is("employee") && (
        <>
          <Menubar />
          <ExplorerSkeleton />
          <ExplorerSkeleton />
        </>
      )}
      {permissions.is("employee") && (
        <>
          <ExplorerSkeleton />
          <div className="p-4">
            <Skeleton className="h-48 w-full" />
          </div>
          <ExplorerSkeleton />
        </>
      )}
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
  );
}
