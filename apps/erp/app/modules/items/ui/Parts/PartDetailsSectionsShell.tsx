import { Menubar, Skeleton, VStack } from "@carbon/react";
import type { ReactNode } from "react";
import { ExplorerSkeleton, PartContentSkeleton } from "~/components/Skeletons";
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

function PartPanelsLayoutShell({
  explorer,
  content,
  properties
}: {
  explorer: ReactNode;
  content: ReactNode;
  properties: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden w-full">
      <div className="flex w-72 flex-shrink-0 flex-col overflow-y-auto border-r bg-card shadow-lg">
        {explorer}
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {content}
      </div>
      <div className="flex w-80 flex-shrink-0 flex-col overflow-y-auto border-l bg-card">
        {properties}
      </div>
    </div>
  );
}

export function PartPageHydrateFallback() {
  return (
    <div className="flex h-[calc(100dvh-49px)] min-h-0 flex-col overflow-hidden w-full">
      <div className="flex h-[50px] flex-shrink-0 items-center border-b bg-card px-4">
        <Skeleton className="h-6 w-24" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
      <PartPanelsLayoutShell
        explorer={
          <div className="p-2">
            <Skeleton className="mb-2 h-8 w-full" />
            <UsedInSkeleton />
          </div>
        }
        content={<PartDetailsPageShell />}
        properties={
          <div className="w-full p-4">
            <PartContentSkeleton />
          </div>
        }
      />
    </div>
  );
}
