import {
  Badge,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  toast,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import {
  LuBriefcase,
  LuCalendar,
  LuCircleCheck,
  LuCircleX,
  LuCog,
  LuHash,
  LuPlus,
  LuUser
} from "react-icons/lu";
import type { FetcherWithComponents } from "react-router";
import {
  useFetcher,
  useNavigate,
  useRevalidator,
  useSearchParams
} from "react-router";
import { Table } from "~/components";
import { overlay, useOverlay } from "~/components/Overlay";
import { getProcessName } from "~/modules/production/productionQuantityDisplay.utils";
import type {
  ProductionQuantityListRow,
  ProductionQuantityPayStatus
} from "~/modules/production/productionQuantityList.models";
import type { ProductionQuantityReportWithLines } from "~/modules/production/productionQuantityReport.service";
import { EditableCreatedAtCell } from "~/modules/production/ui/EditableCreatedAtCell";
import { ProductionQuantityDispositionDrawer } from "~/modules/production/ui/Jobs/ProductionQuantityDispositionDrawer";
import { ProductionQuantityReportReporter } from "~/modules/production/ui/Jobs/ProductionQuantityReportReporter";
import {
  ProductionQuantityTableItemCell,
  ProductionQuantityTableJobCell,
  ProductionQuantityTableQuantityCell
} from "~/modules/production/ui/ProductionQuantityTableCells";
import { useProductionQuantityReportCreatedAtSave } from "~/modules/production/ui/useEditableCreatedAt";
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
  employees: ProductionQuantityEmployeeFilter[];
  jobs?: ProductionQuantityFilterOption[];
  items?: ProductionQuantityFilterOption[];
  operations?: ProductionQuantityFilterOption[];
  /** POST target for approve/reject (current route URL). */
  submitAction: string;
  /** Count of pending-approval records (no payment month). Used for badge on the filter shortcut. */
  pendingCount?: number;
  /** When true, show the new production quantity action. */
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
  variantQuantityParameters?: ReportLoaderData["variantQuantityParameters"];
  itemId?: string | null;
};

type ReportLoaderData = {
  report: ProductionQuantityReportWithLines;
  itemId?: string | null;
  variantQuantityParameters?: Array<{
    key: string;
    label: string;
    dataType: string;
    listOptions?: string[] | null;
  }> | null;
  error?: string;
};

type ApproveTarget = { requestId: string; reportId: string };

function ProductionQuantityApprovalActions({
  requestId,
  reportId,
  fetcher,
  onApprove,
  onReject
}: {
  requestId: string;
  reportId: string;
  fetcher: FetcherWithComponents<ProductionQuantityActionData>;
  onApprove: (target: ApproveTarget) => void;
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
      <Button
        type="button"
        size="sm"
        variant="primary"
        leftIcon={<LuCircleCheck />}
        isDisabled={isBusy}
        isLoading={isThisRow && pendingIntent === "approve"}
        onClick={() => onApprove({ requestId, reportId })}
      >
        <Trans>Approve</Trans>
      </Button>
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
    if (
      row.approvalStatus === "Rejected" ||
      row.approvalStatus === "Cancelled"
    ) {
      return "Rejected";
    }
  }
  if (row.invalidatedAt) return "Rejected";
  if (row.paymentYear != null) return "Approved";
  return "Pending";
}

const PENDING_FILTER = "approvalStatus:eq:Pending";

function DateRangeFilter({
  searchParams,
  navigate,
  close
}: {
  searchParams: URLSearchParams;
  navigate: (to: string) => void;
  close: () => void;
}) {
  const { t } = useLingui();
  const betweenParam = searchParams
    .getAll("filter")
    .find((f) => f.startsWith("createdAt:between:"));
  const parts = betweenParam
    ? betweenParam.slice("createdAt:between:".length).split("|")
    : [];
  const [from, setFrom] = useState(parts[0] ?? "");
  const [to, setTo] = useState(parts[1] ?? "");

  const buildParams = (addFilter: boolean) => {
    const next = new URLSearchParams(searchParams);
    const rest = next
      .getAll("filter")
      .filter((f) => !f.startsWith("createdAt:between:"));
    next.delete("filter");
    for (const f of rest) next.append("filter", f);
    if (addFilter && (from || to))
      next.append("filter", `createdAt:between:${from}|${to}`);
    next.delete("offset");
    navigate(`?${next.toString()}`);
    close();
  };

  const apply = () => buildParams(true);
  const clear = () => buildParams(false);

  return (
    <VStack spacing={2} className="p-2 min-w-[200px]">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{t`From`}</p>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
        />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{t`To`}</p>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
        />
      </div>
      <HStack spacing={1}>
        <Button size="sm" variant="primary" onClick={apply}>
          <Trans>Apply</Trans>
        </Button>
        <Button size="sm" variant="ghost" onClick={clear}>
          <Trans>Clear</Trans>
        </Button>
      </HStack>
    </VStack>
  );
}

const ProductionQuantitiesTable = memo(
  ({
    data,
    count,
    status,
    employees,
    jobs = [],
    items = [],
    operations = [],
    submitAction,
    pendingCount,
    showCreateAction = false,
    title,
    embedded = false,
    configurableItemIds = []
  }: ProductionQuantitiesTableProps) => {
    const { t } = useLingui();
    const { openOverlay } = useOverlay();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const configurableItemIdSet = useMemo(
      () => new Set(configurableItemIds),
      [configurableItemIds]
    );
    const { saveCreatedAt, canEdit } =
      useProductionQuantityReportCreatedAtSave();
    const fetcher = useFetcher<ProductionQuantityActionData>();
    const correctionFetcher = useFetcher<ProductionQuantityActionData>();
    const reportFetcher = useFetcher<ReportLoaderData>();
    const revalidator = useRevalidator();
    const handledApproveRef = useRef<unknown>(undefined);
    const handledCorrectionRef = useRef<unknown>(undefined);
    const pendingRejectTargetRef = useRef<RejectCorrectionTarget | null>(null);
    const [rejectCorrection, setRejectCorrection] =
      useState<RejectCorrectionContext | null>(null);
    const [pendingApprove, setPendingApprove] = useState<ApproveTarget | null>(
      null
    );

    const closeRejectCorrection = useCallback(() => {
      pendingRejectTargetRef.current = null;
      setRejectCorrection(null);
    }, []);

    const openNewQuantity = useCallback(() => {
      openOverlay(overlay.to.newProductionQuantity(), {
        onCreated: () => revalidator.revalidate()
      });
    }, [openOverlay, revalidator]);

    const openRejectCorrection = useCallback(
      (target: RejectCorrectionTarget) => {
        pendingRejectTargetRef.current = target;
        setRejectCorrection(null);
        void reportFetcher.load(
          path.to.productionQuantityReport(target.reportId)
        );
      },
      [reportFetcher]
    );

    const openApprove = useCallback((target: ApproveTarget) => {
      setPendingApprove(target);
    }, []);

    const confirmApprove = useCallback(() => {
      if (!pendingApprove) return;
      const formData = new FormData();
      formData.set("intent", "approve");
      formData.set("approvalRequestId", pendingApprove.requestId);
      fetcher.submit(formData, { method: "post", action: submitAction });
      setPendingApprove(null);
    }, [fetcher, pendingApprove, submitAction]);

    const isPendingFilterActive = searchParams
      .getAll("filter")
      .includes(PENDING_FILTER);

    const togglePendingFilter = useCallback(() => {
      const next = new URLSearchParams(searchParams);
      const existing = next
        .getAll("filter")
        .filter((f) => f !== PENDING_FILTER);
      if (!isPendingFilterActive) existing.push(PENDING_FILTER);
      next.delete("filter");
      for (const f of existing) next.append("filter", f);
      next.delete("offset");
      navigate(`?${next.toString()}`);
    }, [isPendingFilterActive, navigate, searchParams]);

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
        variantQuantityParameters:
          reportFetcher.data?.variantQuantityParameters,
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
      if (
        correctionFetcher.state !== "idle" ||
        correctionFetcher.data === undefined
      ) {
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
          accessorKey: "processId",
          header: t`Operation`,
          cell: ({ row }) => (
            <div className="text-sm">{getProcessName(row.original) ?? "—"}</div>
          ),
          meta: {
            icon: <LuCog />,
            pluralHeader: t`Operations`,
            filter: operations.length
              ? {
                  type: "static" as const,
                  options: operations.map((op) => ({
                    value: op.id,
                    label: op.label
                  })),
                  isArray: false
                }
              : undefined
          }
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
          header: t`Reported`,
          cell: ({ row }) => (
            <EditableCreatedAtCell
              createdAt={row.original.createdAt}
              row={row.original}
              onSave={saveCreatedAt}
              canEdit={canEdit}
            />
          ),
          meta: {
            icon: <LuCalendar />,
            filter: {
              type: "custom" as const,
              render: ({ close }) => (
                <DateRangeFilter
                  searchParams={searchParams}
                  navigate={navigate}
                  close={close}
                />
              ),
              getLabel: (value) => {
                const [from, to] = value.split("|");
                return [from, to].filter(Boolean).join(" – ");
              }
            }
          }
        },
        {
          id: "approvalStatus",
          accessorKey: "approvalStatus",
          accessorFn: (row) => rowStatus(row),
          header: t`Status`,
          cell: ({ row }) => {
            const s = rowStatus(row.original);
            const variant =
              s === "Approved"
                ? "green"
                : s === "Rejected"
                  ? "red"
                  : "secondary";
            return <Badge variant={variant}>{s}</Badge>;
          },
          meta: {
            icon: <LuCircleCheck />,
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
                fetcher={fetcher}
                onApprove={openApprove}
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
      navigate,
      openApprove,
      openRejectCorrection,
      operations,
      saveCreatedAt,
      searchParams,
      status,
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
            !embedded && showCreateAction ? (
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
          filterActions={
            !embedded ? (
              <Button
                type="button"
                variant={isPendingFilterActive ? "primary" : "secondary"}
                onClick={togglePendingFilter}
              >
                <Trans>Pending</Trans>
                {pendingCount != null && pendingCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold leading-none min-w-[1.25rem] h-5 px-1 pointer-events-none">
                    {pendingCount}
                  </span>
                )}
              </Button>
            ) : undefined
          }
          withSearch={!embedded}
          withPagination
          title={embedded ? undefined : (title ?? t`Process Completions`)}
        />
        <Modal
          open={pendingApprove != null}
          onOpenChange={(open) => {
            if (!open) setPendingApprove(null);
          }}
        >
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                <Trans>Confirm Approval</Trans>
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-muted-foreground">
                <Trans>
                  Are you sure you want to approve this production completion?
                </Trans>
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="secondary"
                onClick={() => setPendingApprove(null)}
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button
                variant="primary"
                leftIcon={<LuCircleCheck />}
                onClick={confirmApprove}
              >
                <Trans>Approve</Trans>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {rejectCorrection ? (
          <ProductionQuantityDispositionDrawer
            report={rejectCorrection.report}
            variantQuantityParameters={
              rejectCorrection.variantQuantityParameters
            }
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
