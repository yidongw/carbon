import { Menubar, Skeleton, VStack } from "@carbon/react";
import { ExplorerSkeleton } from "~/components/Skeletons";
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
