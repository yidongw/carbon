import type { JobBillOfProcessOverlayLoaderData } from "~/routes/api+/production.jobs.$jobId.bill-of-process";
import { renderLazyOverlay } from "./renderLazyOverlay";
import type { OverlayRegistryEntry } from "./types";

export const overlayRegistry = {
  newJobProductionQuantity: {
    type: "drawer",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | {
              jobOperationId: string;
              operationOptions: { label: string; value: string }[];
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
            createdBy: ""
          },
          operationOptions: data.operationOptions ?? []
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
              } | null;
              operationOptions: { label: string; value: string }[];
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
            createdBy: productionQuantity.createdBy ?? ""
          },
          operationOptions: data.operationOptions ?? []
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
  }
} as const satisfies Record<string, OverlayRegistryEntry>;

export type OverlayId = keyof typeof overlayRegistry;

export function getOverlayRegistryEntry(
  id: OverlayId
): OverlayRegistryEntry | undefined {
  return overlayRegistry[id];
}
