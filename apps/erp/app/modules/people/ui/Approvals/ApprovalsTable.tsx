import { Avatar, Badge, Button, HStack, toast, VStack } from "@carbon/react";
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
  LuUser
} from "react-icons/lu";
import type { FetcherWithComponents } from "react-router";
import { useFetcher, useRevalidator } from "react-router";
import { Table } from "~/components";
import type {
  ProductionPayApprovalRequestStatus,
  ProductionPayApprovalStatus
} from "~/modules/people/people.models";
import type { ProductionQuantityReportWithLines } from "~/modules/production/productionQuantityReport.service";
import { ProductionQuantityDispositionDrawer } from "~/modules/production/ui/Jobs/ProductionQuantityDispositionDrawer";
import { path } from "~/utils/path";
import SalaryPeriodPicker from "../Salary/SalaryPeriodPicker";
import {
  formatDateTime,
  getEmployeeName,
  getItemName,
  getItemReadableIdWithRevision,
  getJobReadableId,
  getProcessName
} from "../Salary/salaryDetail.utils";

export type PayApprovalRow = {
  approvalRequestId?: string;
  reportId?: string;
  approvalStatus?: ProductionPayApprovalRequestStatus;
  canApprove?: boolean;
  id: string;
  quantity: number | null;
  createdAt: string | null;
  employeeId: string | null;
  paymentYear: number | null;
  paymentMonth: number | null;
  invalidatedAt: string | null;
  employee?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
  jobOperation?: unknown;
};

type ApprovalEmployeeOption = {
  id: string;
  name: string | null;
  avatarUrl?: string | null;
};

type ApprovalsTableProps = {
  data: PayApprovalRow[];
  count: number;
  status: ProductionPayApprovalStatus | "all";
  year: number;
  month: number;
  employees: ApprovalEmployeeOption[];
  onPeriodChange: (year: number, month: number) => void;
  /** POST target for approve/reject (current route URL with pay-period query params). */
  submitAction: string;
  /** When true, omits page chrome for use inside another layout (e.g. accounting payments). */
  embedded?: boolean;
};

type ApprovalActionFetcherData = {
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

function ApprovalRowActions({
  requestId,
  reportId,
  submitAction,
  fetcher,
  onReject
}: {
  requestId: string;
  reportId: string;
  submitAction: string;
  fetcher: FetcherWithComponents<ApprovalActionFetcherData>;
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

function rowStatus(row: PayApprovalRow): "Pending" | "Approved" | "Rejected" {
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

const ApprovalsTable = memo(
  ({
    data,
    count,
    status,
    year,
    month,
    onPeriodChange,
    employees,
    submitAction,
    embedded = false
  }: ApprovalsTableProps) => {
    const { t } = useLingui();
    const fetcher = useFetcher<ApprovalActionFetcherData>();
    const correctionFetcher = useFetcher<ApprovalActionFetcherData>();
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

    const openRejectCorrection = useCallback((target: RejectCorrectionTarget) => {
      pendingRejectTargetRef.current = target;
      setRejectCorrection(null);
      void reportFetcher.load(path.to.quantityReviewReport(target.reportId));
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

    const columns = useMemo<ColumnDef<PayApprovalRow>[]>(() => {
      const cols: ColumnDef<PayApprovalRow>[] = [
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
          cell: ({ row }) => (
            <HStack className="items-center gap-2">
              <Avatar
                className="size-7"
                src={row.original.employee?.avatarUrl ?? undefined}
                name={getEmployeeName(row.original.employee)}
              />
              <span className="text-sm font-medium">
                {getEmployeeName(row.original.employee)}
              </span>
            </HStack>
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
          id: "job",
          header: t`Job`,
          cell: ({ row }) => (
            <span className="font-mono text-sm font-medium">
              {getJobReadableId(row.original)}
            </span>
          )
        },
        {
          id: "item",
          header: t`Item`,
          cell: ({ row }) => (
            <VStack spacing={0}>
              <span className="text-sm font-medium">
                {getItemReadableIdWithRevision(row.original)}
              </span>
              <div className="w-full truncate text-muted-foreground text-xs">
                {getItemName(row.original) || "—"}
              </div>
            </VStack>
          ),
          meta: {
            icon: <AiOutlinePartition />
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
            <span className="tabular-nums">{row.original.quantity}</span>
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
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {formatDateTime(row.original.createdAt)}
            </span>
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
            const requestId =
              row.original.approvalRequestId ?? row.original.id;
            const reportId = row.original.reportId ?? row.original.id;
            const showActions =
              row.original.canApprove &&
              rowStatus(row.original) === "Pending";

            if (!showActions) return null;

            return (
              <ApprovalRowActions
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
    }, [employees, fetcher, openRejectCorrection, status, submitAction, t]);

    return (
      <>
      <Table<PayApprovalRow>
        data={data}
        count={count}
        columns={columns}
        table="productionPayApproval"
        primaryAction={
          !embedded && (status === "pending" || status === "all") ? (
            <SalaryPeriodPicker
              year={year}
              month={month}
              onChange={onPeriodChange}
            />
          ) : undefined
        }
        withSearch={!embedded}
        withPagination
        title={embedded ? undefined : t`Quantity Review`}
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

ApprovalsTable.displayName = "ApprovalsTable";
export default ApprovalsTable;
