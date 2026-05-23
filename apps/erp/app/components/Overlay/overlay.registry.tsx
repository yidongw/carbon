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
              processId?: string | null;
              operationType?: string | null;
              defaultActorKind?: "employee" | "supplier";
              seededActor?: {
                actorKind: "employee" | "supplier";
                employeeId: string;
                supplierProcessId: string;
                supplierId: string;
                lockActorSelection: boolean;
              };
            }
          | undefined;
        if (!data) return null;
        const seeded = data.seededActor;
        return {
          initialValues: {
            jobOperationId: data.jobOperationId,
            quantity: 0,
            notes: "",
            employeeId: seeded?.employeeId ?? "",
            actorKind: seeded?.actorKind ?? data.defaultActorKind ?? "employee",
            supplierProcessId: seeded?.supplierProcessId ?? ""
          },
          operationOptions: data.operationOptions ?? [],
          configurationParameters: data.configurationParameters ?? null,
          itemId: data.itemId ?? null,
          processId: data.processId ?? null,
          operationType: data.operationType ?? null,
          defaultActorKind:
            seeded?.actorKind ?? data.defaultActorKind ?? "employee",
          lockActorSelection: seeded?.lockActorSelection ?? false,
          supplierId: seeded?.supplierId ?? ""
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
              processId?: string | null;
              operationType?: string | null;
              defaultActorKind?: "employee" | "supplier";
              seededActor?: {
                actorKind: "employee" | "supplier";
                employeeId: string;
                supplierProcessId: string;
                supplierId: string;
                lockActorSelection: boolean;
              };
            }
          | undefined;
        if (!data) return null;

        const seeded = data.seededActor;
        return {
          initialValues: {
            jobOperationId: data.jobOperationId,
            notes: "",
            employeeId: seeded?.employeeId ?? "",
            actorKind: seeded?.actorKind ?? data.defaultActorKind ?? "employee",
            supplierProcessId: seeded?.supplierProcessId ?? "",
            supplierId: seeded?.supplierId ?? "",
            lines: [{ type: "Production" as const, quantity: 0 }]
          },
          operationOptions: data.operationOptions ?? [],
          configurationParameters: data.configurationParameters ?? null,
          itemId: data.itemId ?? null,
          processId: data.processId ?? null,
          operationType: data.operationType ?? null,
          defaultActorKind:
            seeded?.actorKind ?? data.defaultActorKind ?? "employee",
          lockActorSelection: seeded?.lockActorSelection ?? false
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
              mode:
                | "supplier-report"
                | "employee-report"
                | "supplier-line"
                | "employee-line";
              supplierReport?: {
                id: string;
                jobOperationId: string;
                supplierProcessId: string;
                supplierProcess?: { id: string; supplierId: string } | null;
                notes: string | null;
                activeLines: {
                  type: "Production" | "Scrap" | "Rework";
                  quantity: number;
                  scrapReasonId: string | null;
                  notes: string | null;
                  configuration?: unknown;
                }[];
              };
              employeeReport?: {
                id: string;
                jobOperationId: string;
                employeeId: string;
                notes: string | null;
                activeLines: {
                  type: "Production" | "Scrap" | "Rework";
                  quantity: number;
                  scrapReasonId: string | null;
                  notes: string | null;
                  configuration?: unknown;
                }[];
              };
              productionQuantity: {
                id: string;
                type: "Production" | "Scrap" | "Rework";
                jobOperationId: string | null;
                quantity: number | null;
                scrapReasonId: string | null;
                notes: string | null;
                employeeId?: string | null;
                supplierProcessId?: string | null;
                supplierProcess?: { id: string; supplierId: string } | null;
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
              processId?: string | null;
              operationType?: string | null;
            }
          | undefined;
        if (!data) return null;

        const shared = {
          operationOptions: data.operationOptions ?? [],
          configurationParameters: data.configurationParameters ?? null,
          itemId: data.itemId ?? null,
          processId: data.processId ?? null,
          operationType: data.operationType ?? null
        };

        if (data.mode === "supplier-report" && data.supplierReport) {
          const report = data.supplierReport;
          return {
            ...shared,
            initialValues: {
              jobOperationId: report.jobOperationId,
              actorKind: "supplier" as const,
              supplierProcessId: report.supplierProcessId,
              supplierId: report.supplierProcess?.supplierId ?? "",
              notes: report.notes ?? "",
              lines: report.activeLines.map((line) => ({
                type: line.type,
                quantity: line.quantity,
                scrapReasonId: line.scrapReasonId ?? undefined,
                notes: line.notes ?? undefined,
                configuration: line.configuration ?? undefined
              }))
            },
            defaultActorKind: "supplier" as const
          };
        }

        if (data.mode === "employee-report" && data.employeeReport) {
          const report = data.employeeReport;
          return {
            ...shared,
            initialValues: {
              jobOperationId: report.jobOperationId,
              actorKind: "employee" as const,
              employeeId: report.employeeId,
              notes: report.notes ?? "",
              lines: report.activeLines.map((line) => ({
                type: line.type,
                quantity: line.quantity,
                scrapReasonId: line.scrapReasonId ?? undefined,
                notes: line.notes ?? undefined,
                configuration: line.configuration ?? undefined
              }))
            },
            defaultActorKind: "employee" as const
          };
        }

        const pq = data.productionQuantity;
        if (!pq) return null;

        const isSupplierLine = data.mode === "supplier-line";
        const supplierProcess =
          isSupplierLine && pq.supplierProcess
            ? Array.isArray(pq.supplierProcess)
              ? pq.supplierProcess[0]
              : pq.supplierProcess
            : undefined;

        return {
          ...shared,
          initialValues: {
            id: pq.id,
            type: pq.type ?? "Scrap",
            jobOperationId: pq.jobOperationId ?? "",
            quantity: pq.quantity ?? 0,
            scrapReasonId: pq.scrapReasonId ?? "",
            notes: pq.notes ?? "",
            employeeId:
              isSupplierLine || !pq.employeeId ? "" : (pq.employeeId ?? ""),
            actorKind: isSupplierLine
              ? ("supplier" as const)
              : ("employee" as const),
            supplierProcessId: isSupplierLine
              ? (pq.supplierProcessId ?? "")
              : "",
            supplierId: isSupplierLine
              ? (supplierProcess?.supplierId ?? "")
              : "",
            configuration: pq.configuration ?? undefined
          },
          defaultActorKind: (isSupplierLine ? "supplier" : "employee") as
            | "employee"
            | "supplier"
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
          referenceByRowIndex: data.referenceByRowIndex,
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
