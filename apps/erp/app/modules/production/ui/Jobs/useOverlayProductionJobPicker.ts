import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { ConfigReferenceSource } from "../../configParamsTableColumns";

export type ProductionJobPickerLoaderData = {
  jobId: string;
  jobOperationId: string;
  operationOptions: { label: string; value: string }[];
  configurationParameters?:
    | {
        key: string;
        label: string;
        dataType: string;
        listOptions?: string[] | null;
      }[]
    | null;
  configReferenceSource?: ConfigReferenceSource | null;
  itemId?: string | null;
  processId?: string | null;
  operationType?: string | null;
  defaultActorKind?: "employee" | "supplier";
  lockActorSelection?: boolean;
  supplierId?: string;
  seededActor?: {
    actorKind: "employee" | "supplier";
    employeeId: string;
    supplierProcessId: string;
    supplierId: string;
    lockActorSelection: boolean;
  } | null;
};

type UseOverlayProductionJobPickerArgs = {
  isOverlay: boolean;
  loaderPath: string;
  jobIdProp?: string | null;
  initialJobId?: string;
  operationOptions?: { label: string; value: string }[];
  configurationParameters?: ProductionJobPickerLoaderData["configurationParameters"];
  configReferenceSource?: ConfigReferenceSource | null;
  itemId?: string | null;
  processId?: string | null;
  operationType?: string | null;
  defaultActorKind?: "employee" | "supplier";
  lockActorSelection?: boolean;
  supplierId?: string;
};

/**
 * In overlay mode, job selection must stay local — navigating would revalidate the
 * list page and leave operation options stale. Refetch the create-route loader when
 * the user picks a different job.
 */
export function useOverlayProductionJobPicker({
  isOverlay,
  loaderPath,
  jobIdProp,
  initialJobId,
  operationOptions = [],
  configurationParameters,
  configReferenceSource,
  itemId,
  processId,
  operationType,
  defaultActorKind,
  lockActorSelection,
  supplierId
}: UseOverlayProductionJobPickerArgs) {
  const seededJobId = jobIdProp?.trim() || initialJobId?.trim() || "";
  const [overlayJobId, setOverlayJobIdState] = useState(seededJobId);
  const userChangedJob = useRef(false);
  const cascadeFetcher = useFetcher<ProductionJobPickerLoaderData>();
  const loadCascade = useRef(cascadeFetcher.load);
  loadCascade.current = cascadeFetcher.load;

  useEffect(() => {
    if (!isOverlay || !overlayJobId) return;
    if (!userChangedJob.current && overlayJobId === seededJobId) return;

    const params = new URLSearchParams({ overlay: "true", jobId: overlayJobId });
    void loadCascade.current(`${loaderPath}?${params.toString()}`);
  }, [isOverlay, overlayJobId, seededJobId, loaderPath]);

  const setOverlayJobId = (nextJobId: string) => {
    userChangedJob.current = true;
    setOverlayJobIdState(nextJobId);
  };

  const cascadeData =
    isOverlay && userChangedJob.current ? cascadeFetcher.data : undefined;
  const isCascadeLoading =
    isOverlay &&
    userChangedJob.current &&
    cascadeFetcher.state !== "idle" &&
    !cascadeData;

  return {
    overlayJobId,
    setOverlayJobId,
    isCascadeLoading,
    operationOptions: cascadeData?.operationOptions ?? operationOptions,
    configurationParameters:
      cascadeData?.configurationParameters ?? configurationParameters,
    configReferenceSource:
      cascadeData?.configReferenceSource ?? configReferenceSource,
    itemId: cascadeData?.itemId ?? itemId,
    processId: cascadeData?.processId ?? processId,
    operationType: cascadeData?.operationType ?? operationType,
    defaultActorKind: cascadeData?.defaultActorKind ?? defaultActorKind,
    lockActorSelection:
      cascadeData?.lockActorSelection ?? lockActorSelection ?? false,
    supplierId:
      cascadeData?.supplierId ??
      cascadeData?.seededActor?.supplierId ??
      supplierId,
    seededActor: cascadeData?.seededActor
  };
}
