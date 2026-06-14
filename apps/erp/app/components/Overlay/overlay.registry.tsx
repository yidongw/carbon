import type { ItemConfigTableOverlayLoaderData } from "~/routes/api+/items.$itemId.config-table";
import type { JobBillOfProcessOverlayLoaderData } from "~/routes/api+/production.jobs.$jobId.bill-of-process";
import type { JobConfigTableOverlayLoaderData } from "~/routes/api+/production.jobs.$jobId.config-table";
import { renderLazyOverlay } from "./renderLazyOverlay";
import type { OverlayRegistryEntry } from "./types";

export const overlayRegistry = {
  newJobPickup: {
    type: "drawer",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | {
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
              itemId?: string | null;
            }
          | undefined;
        if (!data) return null;
        return {
          initialValues: {
            jobOperationId: data.jobOperationId,
            quantity: 0,
            notes: "",
            employeeId: ""
          },
          operationOptions: data.operationOptions ?? [],
          configurationParameters: data.configurationParameters ?? null,
          itemId: data.itemId ?? null
        };
      },
      () => import("~/modules/production/ui/Jobs/PickupForm")
    )
  },
  newJobProductionQuantity: {
    type: "drawer",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | {
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
              itemId?: string | null;
            }
          | undefined;
        if (!data) return null;

        return {
          initialValues: {
            type: "Production" as const,
            jobOperationId: data.jobOperationId,
            quantity: 0,
            scrapReasonId: "",
            notes: "",
            employeeId: ""
          },
          operationOptions: data.operationOptions ?? [],
          configurationParameters: data.configurationParameters ?? null,
          itemId: data.itemId ?? null
        };
      },
      () => import("~/modules/production/ui/Jobs/ProductionQuantityForm")
    )
  },
  editJobProductionQuantity: {
    type: "drawer",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | {
              productionQuantity: {
                id: string;
                type: "Production" | "Scrap" | "Rework";
                jobOperationId: string | null;
                quantity: number | null;
                scrapReasonId: string | null;
                notes: string | null;
                createdBy: string | null;
                configuration?: unknown;
              } | null;
              operationOptions: { label: string; value: string }[];
              configurationParameters?:
                | {
                    key: string;
                    label: string;
                    dataType: string;
                    listOptions?: string[] | null;
                  }[]
                | null;
              itemId?: string | null;
            }
          | undefined;
        const productionQuantity = data?.productionQuantity;
        if (!productionQuantity) return null;

        return {
          initialValues: {
            id: productionQuantity.id,
            type: productionQuantity.type ?? "Scrap",
            jobOperationId: productionQuantity.jobOperationId ?? "",
            quantity: productionQuantity.quantity ?? 0,
            scrapReasonId: productionQuantity.scrapReasonId ?? "",
            notes: productionQuantity.notes ?? "",
            createdBy: productionQuantity.createdBy ?? "",
            configuration: productionQuantity.configuration ?? undefined
          },
          operationOptions: data.operationOptions ?? [],
          configurationParameters: data.configurationParameters ?? null,
          itemId: data.itemId ?? null
        };
      },
      () => import("~/modules/production/ui/Jobs/ProductionQuantityForm")
    )
  },
  jobBillOfProcessPreview: {
    type: "modal",
    render: renderLazyOverlay(
      (ctx) =>
        (ctx.loaderData as JobBillOfProcessOverlayLoaderData | undefined)
          ?.billOfProcess ?? null,
      () => import("~/modules/production/ui/Jobs/JobBillOfProcess")
    )
  },
  jobConfigTable: {
    type: "modal",
    confirmMode: "server",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | JobConfigTableOverlayLoaderData
          | null
          | undefined;
        if (!data?.parameters?.length) return null;
        return {
          parameters: data.parameters,
          initialRows: data.initialRows,
          jobDisplayId: data.jobDisplayId
        };
      },
      () => import("~/modules/production/ui/Jobs/ConfigParamsTableModal")
    )
  },
  itemConfigTable: {
    type: "modal",
    confirmMode: "client",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | ItemConfigTableOverlayLoaderData
          | null
          | undefined;
        if (!data?.parameters?.length) return null;
        return {
          parameters: data.parameters,
          initialRows: data.initialRows,
          jobDisplayId: data.itemReadableId
        };
      },
      () => import("~/modules/production/ui/Jobs/ConfigParamsTableModal")
    )
  }
} as const satisfies Record<string, OverlayRegistryEntry>;

export type OverlayId = keyof typeof overlayRegistry;

export function getOverlayRegistryEntry(
  id: OverlayId
): OverlayRegistryEntry | undefined {
  return overlayRegistry[id];
}
