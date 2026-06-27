import { Badge, Button, HStack, IconButton, toast } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import {
  LuBriefcase,
  LuCalendar,
  LuCircleCheck,
  LuCircleX,
  LuHash,
  LuPlus,
  LuUser
} from "react-icons/lu";
import type { FetcherWithComponents } from "react-router";
import { useFetcher, useRevalidator } from "react-router";
import { overlay, useOverlay } from "~/components/Overlay";
import { Table } from "~/components";
import type {
  ProductionQuantityListRow,
  ProductionQuantityPayStatus
} from "~/modules/production/productionQuantityList.models";
import SalaryPeriodPicker from "~/modules/people/ui/Salary/SalaryPeriodPicker";
import { getProcessName } from "~/modules/production/productionQuantityDisplay.utils";
import type { ProductionQuantityReportWithLines } from "~/modules/production/productionQuantityReport.service";
import { ProductionQuantityDispositionDrawer } from "~/modules/production/ui/Jobs/ProductionQuantityDispositionDrawer";
import { ProductionQuantityReportReporter } from "~/modules/production/ui/Jobs/ProductionQuantityReportReporter";
import { useProductionQuantityReportCreatedAtSave } from "~/modules/production/ui/useEditableCreatedAt";
import { EditableCreatedAtCell } from "~/modules/production/ui/EditableCreatedAtCell";
import {
  ProductionQuantityTableItemCell,
  ProductionQuantityTableJobCell,
  ProductionQuantityTableQuantityCell
} from "~/modules/production/ui/ProductionQuantityTableCells";
import { path } from "~/utils/path";

export type ProductionQuantityTableRow = ProductionQuantityListRow & {
  canApprove?: boolean;
};

type ProductionQuantityEmployeeFilter = {
  id: string;
  name: string | null;
  avatarUrl?: string | null;
};

type ProductionQuantityFilterOption = {
  id: string;
  label: string;
};

export type ProductionQuantitiesTableProps = {
  data: ProductionQuantityTableRow[];
  count: number;
  status: ProductionQuantityPayStatus | "all";
  year: number;
  month: number;
  employees: ProductionQuantityEmployeeFilter[];
  jobs?: ProductionQuantityFilterOption[];
  items?: ProductionQuantityFilterOption[];
  onPeriodChange: (year: number, month: number) => void;
  /** POST target for approve/reject (current route URL with pay-period query params). */
  submitAction: string;
  /** When true, show the new production quantity action beside the pay period picker. */
  showCreateAction?: boolean;
  /** Table title override. */
  title?: string;
  /** When true, omits page chrome for use inside another layout. */
  embedded?: boolean;
  configurableItemIds?: string[];
};

type ProductionQuantityActionData = {
  ok?: boolean;
  error?: string;
  report?: ProductionQuantityReportWithLines;
};

type RejectCorrectionTarget = {
  approvalRequestId: string;
  reportId: string;
};

type RejectCorrectionContext = {
  target: RejectCorrectionTarget;
  report: ProductionQuantityReportWithLines;
  configurationParameters?: ReportLoaderData["configurationParameters"];
  itemId?: string | null;
};

type ReportLoaderData = {
  report: ProductionQuantityReportWithLines;
  itemId?: string | null;
  configurationParameters?: Array<{
    key: string;
    label: string;
    dataType: string;
    listOptions?: string[] | null;
  }> | null;
  error?: string;
};

function ProductionQuantityApprovalActions({
  requestId,
  reportId,
  submitAction,
  fetcher,
  onReject
}: {
  requestId: string;
  reportId: string;
  submitAction: string;
  fetcher: FetcherWithComponents<ProductionQuantityActionData>;
  onReject: (target: RejectCorrectionTarget) => void;
}) {
  const pendingId = fetcher.formData?.get("approvalRequestId");
  const pendingIntent = fetcher.formData?.get("intent");
  const isBusy = fetcher.state !== "idle";
  const isThisRow = isBusy && pendingId === requestId;

  return (
    <HStack
      spacing={1}
      className="justify-end"
      data-prevent-row-nav
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <fetcher.Form method="post" action={submitAction}>
        <input type="hidden" name="intent" value="approve" />
        <input type="hidden" name="approvalRequestId" value={requestId} />
        <Button
          type="submit"
          size="sm"
          variant="primary"
          leftIcon={<LuCircleCheck />}
          isDisabled={isBusy}
          isLoading={isThisRow && pendingIntent === "approve"}
        >
          <Trans>Approve</Trans>
        </Button>
      </fetcher.Form>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        leftIcon={<LuCircleX />}
        isDisabled={isBusy}
        isLoading={isThisRow && pendingIntent === "rejectWithCorrection"}
        onClick={() => onReject({ approvalRequestId: requestId, reportId })}
      >
        <Trans>Reject</Trans>
      </Button>
    </HStack>
  );
}

function rowStatus(
  row: ProductionQuantityTableRow
): "Pending" | "Approved" | "Rejected" {
  if (row.approvalStatus) {
    if (row.approvalStatus === "Pending") return "Pending";
    if (row.approvalStatus === "Approved") return "Approved";
    if (row.approvalStatus === "Rejected" || row.approvalStatus === "Cancelled") {
      return "Rejected";
    }
  }
  if (row.invalidatedAt) return "Rejected";
  if (row.paymentYear != null) return "Approved";
  return "Pending";
}

const ProductionQuantitiesTable = memo(
  ({
    data,
    count,
    status,
    year,
    month,
    onPeriodChange,
    employees,
    jobs = [],
    items = [],
    submitAction,
    showCreateAction = false,
    title,
    embedded = false,
    configurableItemIds = []
  }: ProductionQuantitiesTableProps) => {
    const { t } = useLingui();
    const { openOverlay } = useOverlay();
    const configurableItemIdSet = useMemo(
      () => new Set(configurableItemIds),
      [configurableItemIds]
    );
    const { saveCreatedAt, canEdit } = useProductionQuantityReportCreatedAtSave();
    const fetcher = useFetcher<ProductionQuantityActionData>();
    const correctionFetcher = useFetcher<ProductionQuantityActionData>();
    const reportFetcher = useFetcher<ReportLoaderData>();
    const revalidator = useRevalidator();
    const handledApproveRef = useRef<unknown>(undefined);
    const handledCorrectionRef = useRef<unknown>(undefined);
    const pendingRejectTargetRef = useRef<RejectCorrectionTarget | null>(null);
    const [rejectCorrection, setRejectCorrection] =
      useState<RejectCorrectionContext | null>(null);

    const closeRejectCorrection = useCallback(() => {
      pendingRejectTargetRef.current = null;
      setRejectCorrection(null);
    }, []);

    const openNewQuantity = useCallback(() => {
      openOverlay(overlay.to.newProductionQuantity(), {
        onCreated: () => revalidator.revalidate()
      });
    }, [openOverlay, revalidator]);

    const openRejectCorrection = useCallback((target: RejectCorrectionTarget) => {
      pendingRejectTargetRef.current = target;
      setRejectCorrection(null);
      void reportFetcher.load(path.to.productionQuantityReport(target.reportId));
    }, [reportFetcher]);

    useEffect(() => {
      if (reportFetcher.state !== "idle") return;

      if (reportFetcher.data?.error) {
        toast.error(reportFetcher.data.error);
        pendingRejectTargetRef.current = null;
        return;
      }

      const loadedReport = reportFetcher.data?.report;
      const target = pendingRejectTargetRef.current;
      if (!loadedReport || !target || loadedReport.id !== target.reportId) {
        return;
      }

      setRejectCorrection({
        target,
        report: loadedReport,
        configurationParameters: reportFetcher.data?.configurationParameters,
        itemId: reportFetcher.data?.itemId ?? null
      });
    }, [reportFetcher.state, reportFetcher.data]);

    useEffect(() => {
      if (fetcher.state !== "idle" || fetcher.data === undefined) return;
      if (handledApproveRef.current === fetcher.data) return;
      handledApproveRef.current = fetcher.data;

      if (fetcher.data.error) {
        toast.error(fetcher.data.error);
        return;
      }
      if (fetcher.data.ok) {
        toast.success(t`Saved`);
        revalidator.revalidate();
      }
    }, [fetcher.data, fetcher.state, revalidator, t]);

    useEffect(() => {
      if (correctionFetcher.state !== "idle" || correctionFetcher.data === undefined) {
        return;
      }
      if (handledCorrectionRef.current === correctionFetcher.data) return;
      handledCorrectionRef.current = correctionFetcher.data;

      if (correctionFetcher.data.error) {
        toast.error(correctionFetcher.data.error);
        return;
      }
      if (correctionFetcher.data.ok) {
        toast.success(t`Saved`);
        closeRejectCorrection();
        revalidator.revalidate();
      }
    }, [
      closeRejectCorrection,
      correctionFetcher.data,
      correctionFetcher.state,
      revalidator,
      t
    ]);

    const columns = useMemo<ColumnDef<ProductionQuantityTableRow>[]>(() => {
      const cols: ColumnDef<ProductionQuantityTableRow>[] = [
        {
          id: "type",
          header: t`Type`,
          cell: () => (
            <Badge variant="secondary">
              <Trans>Production</Trans>
            </Badge>
          ),
          meta: { icon: <LuBriefcase /> }
        },
        {
          accessorKey: "employeeId",
          header: t`Employee`,
          cell: ({ row }) =>
            row.original.employeeId ? (
              <ProductionQuantityReportReporter
                employeeId={row.original.employeeId}
                createdBy={row.original.createdBy}
              />
            ) : (
              "—"
            ),
          meta: {
            icon: <LuUser />,
            pluralHeader: t`Employees`,
            filter: {
              type: "static" as const,
              options: employees.map((employee) => ({
                value: employee.id,
                label: employee.name?.trim() || employee.id
              })),
              isArray: false
            }
          }
        },
        {
          accessorKey: "jobId",
          header: t`Job`,
          cell: ({ row }) => (
            <ProductionQuantityTableJobCell row={row.original} />
          ),
          meta: {
            icon: <LuBriefcase />,
            pluralHeader: t`Jobs`,
            filter: jobs.length
              ? {
                  type: "static" as const,
                  options: jobs.map((job) => ({
                    value: job.id,
                    label: job.label
                  })),
                  isArray: false
                }
              : undefined
          }
        },
        {
          accessorKey: "itemId",
          header: t`Item`,
          cell: ({ row }) => (
            <ProductionQuantityTableItemCell row={row.original} />
          ),
          meta: {
            icon: <AiOutlinePartition />,
            pluralHeader: t`Items`,
            filter: items.length
              ? {
                  type: "static" as const,
                  options: items.map((item) => ({
                    value: item.id,
                    label: item.label
                  })),
                  isArray: false
                }
              : undefined
          }
        },
        {
          id: "operation",
          header: t`Operation`,
          cell: ({ row }) => (
            <div className="text-sm">
              {getProcessName(row.original) ?? "—"}
            </div>
          )
        },
        {
          accessorKey: "quantity",
          header: t`Qty`,
          cell: ({ row }) => (
            <ProductionQuantityTableQuantityCell
              row={row.original}
              configurableItemIds={configurableItemIdSet}
              reportKind="productionQuantity"
            />
          ),
          meta: {
            icon: <LuHash />,
            renderTotal: true
          }
        },
        {
          accessorKey: "createdAt",
          header: t`Submitted`,
          cell: ({ row }) => (
            <EditableCreatedAtCell
              createdAt={row.original.createdAt}
              row={row.original}
              onSave={saveCreatedAt}
              canEdit={canEdit}
            />
          ),
          meta: { icon: <LuCalendar /> }
        },
        {
          id: "approvalStatus",
          accessorKey: "approvalStatus",
          accessorFn: (row) => rowStatus(row),
          header: t`Status`,
          cell: ({ row }) => {
            const s = rowStatus(row.original);
            const variant =
              s === "Approved" ? "green" : s === "Rejected" ? "red" : "secondary";
            return <Badge variant={variant}>{s}</Badge>;
          },
          meta: {
            filter: {
              type: "static" as const,
              options: [
                {
                  value: "Pending",
                  label: <Badge variant="secondary">Pending</Badge>
                },
                {
                  value: "Approved",
                  label: <Badge variant="green">Approved</Badge>
                },
                {
                  value: "Rejected",
                  label: <Badge variant="red">Rejected</Badge>
                }
              ],
              isArray: false
            }
          }
        }
      ];

      if (status === "pending" || status === "all") {
        cols.push({
          id: "actions",
          header: () => <span className="sr-only">{t`Actions`}</span>,
          cell: ({ row }) => {
            const requestId = row.original.approvalRequestId;
            const reportId = row.original.reportId ?? row.original.id;
            const showActions =
              requestId &&
              row.original.canApprove &&
              rowStatus(row.original) === "Pending";

            if (!showActions) return null;

            return (
              <ProductionQuantityApprovalActions
                requestId={requestId}
                reportId={reportId}
                submitAction={submitAction}
                fetcher={fetcher}
                onReject={openRejectCorrection}
              />
            );
          },
          meta: {
            cellClassName: "overflow-visible max-w-none whitespace-normal"
          }
        });
      }

      return cols;
    }, [
      canEdit,
      configurableItemIdSet,
      employees,
      fetcher,
      items,
      jobs,
      openRejectCorrection,
      saveCreatedAt,
      status,
      submitAction,
      t
    ]);

    return (
      <>
        <Table<ProductionQuantityTableRow>
          data={data}
          count={count}
          columns={columns}
          table="productionPayApproval"
          primaryAction={
            !embedded && (status === "pending" || status === "all") ? (
              <HStack>
                {showCreateAction ? (
                  <Button
                    type="button"
                    variant="primary"
                    leftIcon={<LuPlus />}
                    onClick={openNewQuantity}
                  >
                    <Trans>Process Completion</Trans>
                  </Button>
                ) : null}
                <SalaryPeriodPicker
                  year={year}
                  month={month}
                  onChange={onPeriodChange}
                />
              </HStack>
            ) : showCreateAction ? (
              <Button
                type="button"
                variant="primary"
                leftIcon={<LuPlus />}
                onClick={openNewQuantity}
              >
                <Trans>Process Completion</Trans>
              </Button>
            ) : undefined
          }
          withSearch={!embedded}
          withPagination
          title={embedded ? undefined : (title ?? t`Process Completions`)}
        />
        {rejectCorrection ? (
          <ProductionQuantityDispositionDrawer
            report={rejectCorrection.report}
            configurationParameters={rejectCorrection.configurationParameters}
            itemId={rejectCorrection.itemId}
            open
            onClose={closeRejectCorrection}
            onSaved={() => {
              closeRejectCorrection();
              revalidator.revalidate();
            }}
            saveAction={submitAction}
            saveMethod="POST"
            title={<Trans>Correct quantities</Trans>}
            getSaveBody={(payload) => {
              const formData = new FormData();
              formData.set("intent", "rejectWithCorrection");
              formData.set(
                "approvalRequestId",
                rejectCorrection.target.approvalRequestId
              );
              formData.set("lines", JSON.stringify(payload.lines));
              if (payload.notes) {
                formData.set("notes", payload.notes);
              }
              return formData;
            }}
            fetcher={correctionFetcher}
          />
        ) : null}
      </>
    );
  }
);

ProductionQuantitiesTable.displayName = "ProductionQuantitiesTable";
export default ProductionQuantitiesTable;
