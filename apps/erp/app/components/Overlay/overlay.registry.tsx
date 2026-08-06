import type { TransferItem } from "~/modules/inventory/ui/Transfers/TransferForm";
import { buildConfigEditorRows } from "~/modules/production/ui/Jobs/ConfigParamsTableModal";
import type { PurchaseOrderLineInitialValues } from "~/modules/purchasing/ui/PurchaseOrder/PurchaseOrderLineForm";
import type { SalesOrderLineFormInitialValues } from "~/modules/sales/ui/SalesOrder/SalesOrderLineForm";
import type { ItemConfigTableOverlayLoaderData } from "~/routes/api+/items.$itemId.config-table";
import type { BundleWorkOrderProcessesOverlayLoaderData } from "~/routes/api+/production.bundle-work-orders.$bundleWorkOrderId.processes";
import type { JobBillOfProcessOverlayLoaderData } from "~/routes/api+/production.jobs.$jobId.bill-of-process";
import type { JobConfigTableOverlayLoaderData } from "~/routes/api+/production.jobs.$jobId.config-table";
import type { MasterWorkOrderBundlesOverlayLoaderData } from "~/routes/api+/production.master-work-orders.$masterWorkOrderId.bundles";
import type { MasterWorkOrderProcessesOverlayLoaderData } from "~/routes/api+/production.master-work-orders.$masterWorkOrderId.processes";
import type { MasterWorkOrderSplitBatchLoaderData } from "~/routes/api+/production.master-work-orders.$masterWorkOrderId.split-batch";
import { renderLazyOverlay } from "./renderLazyOverlay";
import type { OverlayRegistryEntry } from "./types";

export const overlayRegistry = {
  newTransfer: {
    type: "modal",
    confirmMode: "server",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | {
              fromLocationId: string;
              itemsByLocation: Record<string, TransferItem[]>;
              mode: "stock" | "warehouse";
              partnerLocationIds: string[];
            }
          | undefined;
        if (!data) return null;
        return {
          fromLocationId: data.fromLocationId,
          itemsByLocation: data.itemsByLocation,
          mode: data.mode,
          partnerLocationIds: data.partnerLocationIds
        };
      },
      () => import("~/modules/inventory/ui/Transfers/TransferForm")
    )
  },
  newMasterWorkOrder: {
    type: "drawer",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | {
              initialValues: {
                itemId: string;
                quantity: number;
                locationId: string;
                dueDate: string;
                deadlineType:
                  | "ASAP"
                  | "Hard Deadline"
                  | "Soft Deadline"
                  | "No Deadline";
              };
            }
          | undefined;
        if (!data) return null;
        return { initialValues: data.initialValues };
      },
      () =>
        import("~/modules/production/ui/MasterWorkOrders/MasterWorkOrderForm")
    )
  },
  newSalesOrderLine: {
    type: "modal",
    confirmMode: "server",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | {
              initialValues: SalesOrderLineFormInitialValues;
            }
          | undefined;
        if (!data) return null;
        return { initialValues: data.initialValues };
      },
      () => import("~/modules/sales/ui/SalesOrder/SalesOrderLineForm")
    )
  },
  newEmployee: {
    type: "drawer",
    render: renderLazyOverlay(
      // The form self-loads employee types and seeds location from the session, so
      // the loader only gates permissions; any (non-undefined) data means "render".
      (ctx) => (ctx.loaderData ? {} : null),
      () => import("~/modules/users/ui/Employees/CreateEmployeeForm")
    )
  },
  newPurchaseOrderLine: {
    type: "modal",
    confirmMode: "server",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | { initialValues: PurchaseOrderLineInitialValues }
          | undefined;
        if (!data) return null;
        return { initialValues: data.initialValues, type: "overlay" as const };
      },
      () =>
        import("~/modules/purchasing/ui/PurchaseOrder/PurchaseOrderLineForm")
    )
  },
  newStyleSample: {
    type: "modal",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | {
              styleId: string;
              styleDisplayId: string;
              colorOptions: { value: string; label: string }[];
              sizeOptions: { value: string; label: string }[];
              defaultColorIds: string[];
              defaultSize: string;
              defaultLocationId: string;
            }
          | undefined;
        if (!data) return null;
        return {
          styleId: data.styleId,
          styleDisplayId: data.styleDisplayId,
          colorOptions: data.colorOptions,
          sizeOptions: data.sizeOptions,
          defaultColorIds: data.defaultColorIds,
          defaultSize: data.defaultSize,
          defaultLocationId: data.defaultLocationId
        };
      },
      () => import("~/modules/items/ui/Samples/CreateStyleSampleForm")
    )
  },
  editInvite: {
    type: "drawer",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | {
              userId: string;
              email: string | null;
              phone: string | null;
              employeeTypeId: string;
            }
          | undefined;
        if (!data) return null;
        return {
          userId: data.userId,
          initialValues: {
            email: data.email ?? undefined,
            phone: data.phone ?? undefined,
            employeeType: data.employeeTypeId
          }
        };
      },
      () => import("~/modules/users/ui/Employees/EditInviteForm")
    )
  },
  newProductionQuantity: {
    type: "drawer",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | {
              jobId: string;
              jobOperationId: string;
              jobOptions: { label: string; value: string }[];
              operationOptions: { label: string; value: string }[];
              configurationParameters?:
                | {
                    key: string;
                    label: string;
                    dataType: string;
                    listOptions?: string[] | null;
                  }[]
                | null;
              configReferenceSource?: {
                jobConfiguration: unknown;
                reportedConfigurations: unknown[];
              } | null;
              itemId?: string | null;
              remainingByOperationId?: Record<string, number>;
              processId?: string | null;
              operationType?: string | null;
              defaultActorKind?: "employee" | "supplier";
              lockActorSelection?: boolean;
              lockJobSelection?: boolean;
              lockOperationSelection?: boolean;
              seededActor?: {
                actorKind: "employee" | "supplier";
                employeeId: string;
                supplierProcessId: string;
                supplierId: string;
                lockActorSelection: boolean;
              } | null;
            }
          | undefined;
        if (!data) return null;
        const seeded = data.seededActor;
        return {
          jobOptions: data.jobOptions,
          jobId: data.jobId,
          lockJobSelection: data.lockJobSelection ?? false,
          lockOperationSelection: data.lockOperationSelection ?? false,
          initialValues: {
            jobOperationId: data.jobOperationId,
            actorKind: seeded?.actorKind ?? data.defaultActorKind ?? "employee",
            employeeId: seeded?.employeeId,
            supplierProcessId: seeded?.supplierProcessId,
            supplierId: seeded?.supplierId,
            notes: "",
            lines: [
              {
                type: "Production" as const,
                quantity:
                  data.remainingByOperationId?.[data.jobOperationId] ?? 0
              }
            ]
          },
          remainingByOperationId: data.remainingByOperationId ?? {},
          operationOptions: data.operationOptions ?? [],
          configurationParameters: data.configurationParameters ?? null,
          configReferenceSource: data.configReferenceSource ?? null,
          itemId: data.itemId ?? null,
          processId: data.processId ?? null,
          operationType: data.operationType ?? null,
          defaultActorKind: data.defaultActorKind ?? "employee",
          lockActorSelection: data.lockActorSelection ?? false
        };
      },
      () => import("~/modules/production/ui/Jobs/ProductionQuantityForm")
    )
  },
  newJobProductionQuantity: {
    type: "drawer",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | {
              jobId: string;
              jobOption?: { label: string; value: string };
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
              configReferenceSource?: {
                jobConfiguration: unknown;
                reportedConfigurations: unknown[];
              } | null;
              itemId?: string | null;
              remainingByOperationId?: Record<string, number>;
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
          jobId: data.jobId,
          jobOptions: data.jobOption ? [data.jobOption] : undefined,
          initialValues: {
            jobOperationId: data.jobOperationId,
            notes: "",
            employeeId: seeded?.employeeId ?? "",
            actorKind: seeded?.actorKind ?? data.defaultActorKind ?? "employee",
            supplierProcessId: seeded?.supplierProcessId ?? "",
            supplierId: seeded?.supplierId ?? "",
            lines: [
              {
                type: "Production" as const,
                quantity:
                  data.remainingByOperationId?.[data.jobOperationId] ?? 0
              }
            ]
          },
          remainingByOperationId: data.remainingByOperationId ?? {},
          operationOptions: data.operationOptions ?? [],
          configurationParameters: data.configurationParameters ?? null,
          configReferenceSource: data.configReferenceSource ?? null,
          itemId: data.itemId ?? null,
          processId: data.processId ?? null,
          operationType: data.operationType ?? null,
          defaultActorKind:
            seeded?.actorKind ?? data.defaultActorKind ?? "employee",
          lockJobSelection: Boolean(data.jobOption),
          lockActorSelection: seeded?.lockActorSelection ?? false,
          lockOperationSelection: Boolean(data.jobOperationId)
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
              configReferenceSource?: {
                jobConfiguration: unknown;
                reportedConfigurations: unknown[];
              } | null;
              itemId?: string | null;
              processId?: string | null;
              operationType?: string | null;
            }
          | undefined;
        if (!data) return null;

        const shared = {
          operationOptions: data.operationOptions ?? [],
          configurationParameters: data.configurationParameters ?? null,
          configReferenceSource: data.configReferenceSource ?? null,
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
  newTag: {
    type: "drawer",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | { table?: string; lockTable?: boolean }
          | undefined;
        if (!data) return null;
        const { name } = ctx.props as { name?: string };
        return {
          initialValues: {
            name: name ?? "",
            table: data.table ?? ""
          },
          lockTable: data.lockTable ?? false
        };
      },
      () => import("~/modules/settings/ui/Tags/TagForm")
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
          jobDisplayId: data.jobDisplayId,
          history: data.history,
          optionLabels: data.colorNames
        };
      },
      () => import("~/modules/production/ui/Jobs/JobConfigQuantities")
    )
  },
  itemConfigTable: {
    type: "modal",
    // Read-only view: its only button dismisses (never POSTs). Url-addressable
    // like the rest — config rides props in-app, with a server-fetched fallback
    // for deep links.
    confirmMode: "none",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | ItemConfigTableOverlayLoaderData
          | null
          | undefined;
        if (!data?.parameters?.length) return null;
        // Config comes via props in-app; on a deep link props is empty, so fall
        // back to the row's saved config fetched by the loader.
        const { configuration: fromProps } = ctx.props as {
          configuration?: unknown;
        };
        const configuration =
          fromProps !== undefined ? fromProps : data.configuration;
        const { initialRows, referenceByRowIndex } = buildConfigEditorRows({
          parameters: data.parameters,
          configuration
        });
        return {
          parameters: data.parameters,
          initialRows,
          referenceByRowIndex,
          jobDisplayId: data.itemReadableId,
          optionLabels: data.colorNames
        };
      },
      () => import("~/modules/production/ui/Jobs/ConfigParamsTableModal")
    )
  },
  masterWorkOrderBundles: {
    type: "modal",
    // Read-only view of a master work order's bundles; its only button dismisses.
    confirmMode: "none",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | MasterWorkOrderBundlesOverlayLoaderData
          | null
          | undefined;
        if (!data) return null;
        return {
          bundleWorkOrders: data.bundleWorkOrders,
          count: data.count,
          masterDisplayId: data.masterDisplayId
        };
      },
      () =>
        import(
          "~/modules/production/ui/MasterWorkOrders/MasterWorkOrderBundlesOverlay"
        )
    )
  },
  masterWorkOrderProcesses: {
    type: "modal",
    confirmMode: "none",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | MasterWorkOrderProcessesOverlayLoaderData
          | null
          | undefined;
        if (!data) return null;
        return {
          processes: data.processes,
          masterDisplayId: data.masterDisplayId
        };
      },
      () =>
        import(
          "~/modules/production/ui/MasterWorkOrders/MasterWorkOrderProcessesOverlay"
        )
    )
  },
  bundleWorkOrderProcesses: {
    type: "modal",
    confirmMode: "none",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | BundleWorkOrderProcessesOverlayLoaderData
          | null
          | undefined;
        if (!data) return null;
        return {
          operations: data.operations,
          count: data.count,
          jobId: data.jobId,
          jobStatus: data.jobStatus,
          bundleDisplayId: data.bundleDisplayId
        };
      },
      () =>
        import(
          "~/modules/production/ui/MasterWorkOrders/BundleWorkOrderProcessesOverlay"
        )
    )
  },
  masterWorkOrderSplitBatch: {
    type: "modal",
    // The Confirm button POSTs the reviewed split to the route action.
    confirmMode: "server",
    render: renderLazyOverlay(
      (ctx) => {
        const data = ctx.loaderData as
          | MasterWorkOrderSplitBatchLoaderData
          | null
          | undefined;
        if (!data) return null;
        return {
          colorAxis: data.colorAxis,
          sizeAxis: data.sizeAxis,
          cells: data.cells,
          existingBundles: data.existingBundles,
          splitRows: data.splitRows,
          masterDisplayId: data.masterDisplayId
        };
      },
      () => import("~/modules/production/ui/MasterWorkOrders/SplitBatchOverlay")
    )
  }
} as const satisfies Record<string, OverlayRegistryEntry>;

export type OverlayId = keyof typeof overlayRegistry;

export function getOverlayRegistryEntry(
  id: OverlayId
): OverlayRegistryEntry | undefined {
  return overlayRegistry[id];
}
