import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import {
  Button,
  cn,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  SidebarTrigger,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LuBadgeCheck,
  LuCheck,
  LuMinus,
  LuPlus,
  LuTriangleAlert,
  LuX
} from "react-icons/lu";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Link, redirect, useFetcher, useLoaderData } from "react-router";
import EmployeeAvatar from "~/components/EmployeeAvatar";
import type { ColumnFilter } from "~/components/Filter";
import { ActiveFilters, Filter, useFilters } from "~/components/Filter";
import SearchFilter from "~/components/SearchFilter";
import { TopbarActions } from "~/components/TopbarActions";
import { useUrlParams } from "~/hooks";
import {
  approveProductionQuantity,
  getPendingProductionQuantities,
  insertReworkQuantity,
  insertScrapQuantity,
  invalidateProductionQuantity
} from "~/services/operations.service";
import {
  canApproveProductionReports,
  isMesOnlyEmployee
} from "~/services/people.service";
import { usePeople } from "~/stores";
import { path } from "~/utils/path";

/** Non-negative integer from a form value; anything invalid becomes 0. */
function toCount(value: FormDataEntryValue | null): number {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId, userId } = await requirePermissions(request, {});

  const serviceRole = getCarbonServiceRole();

  // Workers can see the list, but only managers may approve/disapprove: the
  // buttons are hidden here and the action route rejects them.
  const canApprove = await canApproveProductionReports(
    request,
    serviceRole,
    userId,
    companyId
  );

  // A deep link from the operation page ("待审批" card) arrives as
  // ?jobOperationId=X. Translate it into the page's own job + process filters so
  // it appears as normal, clearable filter chips (handled by dev's Filter UI)
  // rather than a one-off banner.
  const jobOperationId =
    new URL(request.url).searchParams.get("jobOperationId") ?? undefined;
  if (jobOperationId) {
    const op = await serviceRole
      .from("jobOperation")
      .select("jobId, process:processId(name)")
      .eq("id", jobOperationId)
      .eq("companyId", companyId)
      .maybeSingle();
    const filters = new URLSearchParams();
    if (op.data?.jobId) filters.append("filter", `jobId:eq:${op.data.jobId}`);
    const processName = (
      op.data as { process?: { name?: string | null } } | null
    )?.process?.name;
    if (processName) filters.append("filter", `process:eq:${processName}`);
    const qs = filters.toString();
    return redirect(
      qs ? `${path.to.productionReports}?${qs}` : path.to.productionReports
    );
  }

  const reports = await getPendingProductionQuantities(serviceRole, companyId);

  if (reports.error) {
    console.error("getPendingProductionQuantities error:", reports.error);
  }

  // Resolve labels for any active job/process filters so their chips render
  // even when no pending reports match (the filter options are otherwise
  // derived from the rows, which are empty then). Process values are already
  // the readable name; jobId values are the internal id → look up the job.
  const filterParams = new URL(request.url).searchParams.getAll("filter");
  const jobIds = new Set<string>();
  const processNames = new Set<string>();
  for (const f of filterParams) {
    const [key, op, value] = f.split(":");
    if (!value) continue;
    const values = op === "in" ? value.split(",") : [value];
    if (key === "jobId") for (const v of values) jobIds.add(v);
    if (key === "process") for (const v of values) processNames.add(v);
  }

  let jobFilterOptions: { value: string; label: string }[] = [];
  if (jobIds.size > 0) {
    const jobs = await serviceRole
      .from("job")
      .select("id, jobId")
      .eq("companyId", companyId)
      .in("id", Array.from(jobIds));
    jobFilterOptions = (jobs.data ?? []).map((j) => ({
      value: j.id,
      label: j.jobId ?? j.id
    }));
  }
  const processFilterOptions = Array.from(processNames).map((n) => ({
    value: n,
    label: n
  }));

  return {
    reports: reports.data ?? [],
    canApprove,
    filterOptions: { jobId: jobFilterOptions, process: processFilterOptions }
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const { companyId, userId } = await requirePermissions(request, {
    update: "production"
  });
  const serviceRole = getCarbonServiceRole();

  // Mirror the loader's visibility rule server-side: "MES only" shop-floor
  // workers can view but not approve/disapprove (production_update alone can't
  // gate them — every MES worker has it by default).
  if (await isMesOnlyEmployee(serviceRole, userId, companyId)) {
    return { success: false };
  }

  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = String(formData.get("id") ?? "");
  if (!id) return { success: false };

  if (intent === "approve") {
    const now = new Date();
    // Optionally correct the quantity while approving.
    const raw = Number(formData.get("quantity"));
    const quantity =
      Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : undefined;
    const res = await approveProductionQuantity(serviceRole, {
      id,
      companyId,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      userId,
      quantity
    });
    return { success: !res.error };
  }

  if (intent === "disapprove") {
    // The manager corrects the good count and accounts for the shortfall as
    // rework / scrap (the rest is simply left unfinished).
    const completed = toCount(formData.get("completed"));
    const rework = toCount(formData.get("rework"));
    const scrap = toCount(formData.get("scrap"));
    const jobOperationId = String(formData.get("jobOperationId") ?? "");
    const employeeId =
      String(formData.get("employeeId") ?? "").trim() || userId;
    const now = new Date();

    // The corrected good count → approve the original row at that quantity;
    // nothing good left → invalidate it.
    if (completed > 0) {
      const res = await approveProductionQuantity(serviceRole, {
        id,
        companyId,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        userId,
        quantity: completed
      });
      if (res.error) return { success: false };
    } else {
      const res = await invalidateProductionQuantity(serviceRole, {
        id,
        companyId,
        userId,
        quantity: 0
      });
      if (res.error) return { success: false };
    }

    // The shortfall reasons become their own rework / scrap rows (defect
    // tracking; not part of the payroll "pending" scope).
    if (rework > 0 && jobOperationId) {
      await insertReworkQuantity(serviceRole, {
        jobOperationId,
        quantity: rework,
        companyId,
        createdBy: userId,
        employeeId
      });
    }
    if (scrap > 0 && jobOperationId) {
      await insertScrapQuantity(serviceRole, {
        jobOperationId,
        quantity: scrap,
        companyId,
        createdBy: userId,
        employeeId
      });
    }

    return { success: true };
  }

  return { success: false };
}

type PendingReport = {
  id: string;
  quantity: number;
  type: string;
  createdAt: string;
  employeeId: string | null;
  jobOperationId: string | null;
  jobOperation: {
    id: string;
    description: string | null;
    jobId: string;
    process: { name: string | null } | null;
    job: {
      id: string;
      jobId: string;
      item: {
        readableIdWithRevision: string | null;
        name: string | null;
      } | null;
    } | null;
  } | null;
};

function formatDateTime(value: string) {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/** Confirmation modal for approving / disapproving a single report. Disapprove
 * additionally lets the manager correct the recorded quantity. */
function ApprovalModal({
  report,
  mode,
  employeeName,
  onClose
}: {
  report: PendingReport;
  mode: "approve" | "disapprove";
  employeeName: string;
  onClose: () => void;
}) {
  const { t } = useLingui();
  const fetcher = useFetcher<typeof action>();
  const submitted = useRef(false);
  const isSubmitting = fetcher.state !== "idle";

  // The reported quantity is the ceiling; the manager keeps the good count and
  // allocates the shortfall to rework / scrap (the rest is left unfinished).
  const total = report.quantity;
  const [completed, setCompleted] = useState(total);
  const [rework, setRework] = useState(0);
  const [scrap, setScrap] = useState(0);

  const clamp = (n: number, max: number) =>
    Math.max(0, Math.min(max, Number.isFinite(n) ? Math.floor(n) : 0));
  const shortfall = total - completed;
  const notFinished = Math.max(0, shortfall - rework - scrap);

  const updateCompleted = (n: number) => {
    const c = clamp(n, total);
    setCompleted(c);
    const nextShortfall = total - c;
    if (rework + scrap > nextShortfall) {
      const r = Math.min(rework, nextShortfall);
      setRework(r);
      setScrap(Math.min(scrap, nextShortfall - r));
    }
  };

  useEffect(() => {
    if (submitted.current && fetcher.state === "idle") {
      onClose();
    }
  }, [fetcher.state, onClose]);

  const op = report.jobOperation;
  const item = op?.job?.item;
  const isApprove = mode === "approve";

  return (
    <Modal open onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <fetcher.Form
          method="post"
          onSubmit={() => {
            submitted.current = true;
          }}
        >
          <input type="hidden" name="id" value={report.id} />
          <input type="hidden" name="intent" value={mode} />
          {!isApprove && (
            <>
              <input
                type="hidden"
                name="jobOperationId"
                value={report.jobOperationId ?? ""}
              />
              <input
                type="hidden"
                name="employeeId"
                value={report.employeeId ?? ""}
              />
              <input type="hidden" name="completed" value={completed} />
              <input type="hidden" name="rework" value={rework} />
              <input type="hidden" name="scrap" value={scrap} />
            </>
          )}
          <ModalHeader>
            <ModalTitle>
              {isApprove ? t`Approve report` : t`Disapprove report`}
            </ModalTitle>
            <ModalDescription>
              {isApprove ? (
                <Trans>Approve this reported production quantity.</Trans>
              ) : (
                <Trans>
                  Keep the completed quantity and give a reason for the rest.
                </Trans>
              )}
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <VStack spacing={2} className="text-sm">
                <HStack className="justify-between w-full">
                  <span className="text-muted-foreground">
                    <Trans>Employee</Trans>
                  </span>
                  <span className="font-medium">{employeeName}</span>
                </HStack>
                <HStack className="justify-between w-full">
                  <span className="text-muted-foreground">
                    <Trans>Job</Trans>
                  </span>
                  <span className="font-medium">{op?.job?.jobId ?? "—"}</span>
                </HStack>
                <HStack className="justify-between w-full">
                  <span className="text-muted-foreground">
                    <Trans>Item</Trans>
                  </span>
                  <span className="font-medium">
                    {item?.readableIdWithRevision ?? "—"}
                  </span>
                </HStack>
                <HStack className="justify-between w-full">
                  <span className="text-muted-foreground">
                    <Trans>Process</Trans>
                  </span>
                  <span className="font-medium">
                    {op?.process?.name ?? "—"}
                  </span>
                </HStack>
              </VStack>

              {isApprove ? (
                <HStack className="justify-between w-full text-sm">
                  <span className="text-muted-foreground">
                    <Trans>Quantity</Trans>
                  </span>
                  <span className="font-medium tabular-nums">
                    {report.quantity}
                  </span>
                </HStack>
              ) : (
                <div className="flex w-full flex-col gap-4 rounded-lg border border-border p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium">
                        <Trans>Completed</Trans>
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        / {total}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconButton
                        aria-label={t`Decrease`}
                        icon={<LuMinus />}
                        variant="secondary"
                        size="lg"
                        onClick={() => updateCompleted(completed - 1)}
                        isDisabled={completed <= 0}
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={total}
                        value={completed}
                        onChange={(e) =>
                          updateCompleted(Number.parseInt(e.target.value, 10))
                        }
                        className={cn(
                          reasonInputClass,
                          "flex-1 text-center text-2xl font-semibold"
                        )}
                      />
                      <IconButton
                        aria-label={t`Increase`}
                        icon={<LuPlus />}
                        variant="secondary"
                        size="lg"
                        onClick={() => updateCompleted(completed + 1)}
                        isDisabled={completed >= total}
                      />
                    </div>
                  </div>

                  {shortfall > 0 && (
                    <div className="flex flex-col gap-3 border-t border-border pt-4">
                      <span className="text-xs text-muted-foreground">
                        {t`Reason for the remaining ${shortfall}`}
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <ReasonField
                          label={t`Rework`}
                          value={rework}
                          onChange={(n) =>
                            setRework(clamp(n, shortfall - scrap))
                          }
                        />
                        <ReasonField
                          label={t`Scrap`}
                          value={scrap}
                          onChange={(n) =>
                            setScrap(clamp(n, shortfall - rework))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          <Trans>Not finished yet</Trans>
                        </span>
                        <span className="font-medium tabular-nums">
                          {notFinished}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={onClose} type="button">
              <Trans>Cancel</Trans>
            </Button>
            <Button
              type="submit"
              variant={isApprove ? "primary" : "destructive"}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
              leftIcon={isApprove ? <LuCheck /> : <LuX />}
            >
              {isApprove ? <Trans>Approve</Trans> : <Trans>Disapprove</Trans>}
            </Button>
          </ModalFooter>
        </fetcher.Form>
      </ModalContent>
    </Modal>
  );
}

// Match the shared @carbon/react Input styling (border, shadow, focus ring).
const reasonInputClass =
  "min-w-0 rounded-lg border border-input bg-background shadow-xs px-3 py-2 text-lg tabular-nums outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

function ReasonField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value === 0 ? "" : value}
        placeholder="0"
        onChange={(e) => onChange(Number.parseInt(e.target.value, 10) || 0)}
        className={cn(reasonInputClass, "w-full")}
      />
    </label>
  );
}

export default function ProductionReportsRoute() {
  const { t } = useLingui();
  const { reports, canApprove, filterOptions } = useLoaderData<typeof loader>();
  const rows = reports as PendingReport[];
  const [people] = usePeople();
  const [params] = useUrlParams();
  const { hasFilters, clearFilters } = useFilters();

  const [modal, setModal] = useState<{
    report: PendingReport;
    mode: "approve" | "disapprove";
  } | null>(null);

  const employeeName = useCallback(
    (employeeId: string | null) => {
      if (!employeeId) return "—";
      return people.find((p) => p.id === employeeId)?.name ?? employeeId;
    },
    [people]
  );

  // Filter options derived from the pending reports currently in view.
  const employeeOptions = useMemo(() => {
    const ids = new Set(
      rows.map((r) => r.employeeId).filter((id): id is string => Boolean(id))
    );
    return Array.from(ids).map((id) => ({
      label: employeeName(id),
      value: id
    }));
  }, [rows, employeeName]);

  const processOptions = useMemo(() => {
    // Seed with loader-resolved options so an active filter chip labels even
    // when no rows match, then add whatever the current rows contribute.
    const map = new Map<string, string>();
    for (const o of filterOptions.process) map.set(o.value, o.label);
    for (const r of rows) {
      const n = r.jobOperation?.process?.name;
      if (n) map.set(n, n);
    }
    return Array.from(map.entries()).map(([value, label]) => ({
      label,
      value
    }));
  }, [rows, filterOptions]);

  const jobOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const o of filterOptions.jobId) seen.set(o.value, o.label);
    for (const r of rows) {
      const job = r.jobOperation?.job;
      if (job?.id) seen.set(job.id, job.jobId);
    }
    return Array.from(seen.entries()).map(([value, label]) => ({
      label,
      value
    }));
  }, [rows, filterOptions]);

  const itemOptions = useMemo(() => {
    const names = new Set(
      rows
        .map((r) => r.jobOperation?.job?.item?.readableIdWithRevision)
        .filter((n): n is string => Boolean(n))
    );
    return Array.from(names).map((n) => ({ label: n, value: n }));
  }, [rows]);

  const filters = useMemo<ColumnFilter[]>(
    () => [
      {
        accessorKey: "employeeId",
        header: t`Employee`,
        pluralHeader: t`Employees`,
        filter: { type: "static", options: employeeOptions }
      },
      {
        accessorKey: "jobId",
        header: t`Job`,
        pluralHeader: t`Jobs`,
        filter: { type: "static", options: jobOptions }
      },
      {
        accessorKey: "item",
        header: t`Item`,
        pluralHeader: t`Items`,
        filter: { type: "static", options: itemOptions }
      },
      {
        accessorKey: "process",
        header: t`Process`,
        pluralHeader: t`Processes`,
        filter: { type: "static", options: processOptions }
      }
    ],
    [employeeOptions, jobOptions, itemOptions, processOptions, t]
  );

  // Client-side filtering off the same URL params the Filter/Search UI writes.
  const search = (params.get("search") ?? "").toLowerCase();
  const currentFilters = params.getAll("filter").filter(Boolean);

  const selected = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const f of currentFilters) {
      const [key, operator, value] = f.split(":");
      if (!key || !value) continue;
      const values = operator === "in" ? value.split(",") : [value];
      map[key] = new Set(values);
    }
    return map;
  }, [currentFilters]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (selected.employeeId && !selected.employeeId.has(r.employeeId ?? "")) {
        return false;
      }
      if (
        selected.jobId &&
        !selected.jobId.has(r.jobOperation?.job?.id ?? "")
      ) {
        return false;
      }
      if (
        selected.item &&
        !selected.item.has(
          r.jobOperation?.job?.item?.readableIdWithRevision ?? ""
        )
      ) {
        return false;
      }
      if (
        selected.process &&
        !selected.process.has(r.jobOperation?.process?.name ?? "")
      ) {
        return false;
      }
      if (search) {
        const haystack = [
          employeeName(r.employeeId),
          r.jobOperation?.job?.jobId,
          r.jobOperation?.job?.item?.readableIdWithRevision,
          r.jobOperation?.job?.item?.name,
          r.jobOperation?.process?.name
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  }, [rows, selected, search, employeeName]);

  const isFiltering = hasFilters || search.length > 0;

  return (
    <div className="flex flex-col flex-1 min-h-0 h-svh overflow-hidden">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <SidebarTrigger className="md:hidden" />
          <Heading size="h4">
            <Trans>Report Approvals</Trans>
          </Heading>
        </div>
        <div className="ml-auto flex items-center px-2">
          <TopbarActions />
        </div>
      </header>

      <div className="flex items-center gap-2 border-b bg-background px-4 py-2">
        <Filter filters={filters} />
        <SearchFilter
          param="search"
          className="w-full text-sm"
          placeholder={t`Search by employee or job`}
        />
      </div>
      {currentFilters.length > 0 && (
        <div className="flex items-center border-b bg-card px-4 py-1.5">
          <ActiveFilters filters={filters} />
        </div>
      )}

      <main className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
        <div className="p-4">
          {filteredRows.length > 0 ? (
            <Table>
              <Thead>
                <Tr>
                  <Th>
                    <Trans>Employee</Trans>
                  </Th>
                  <Th>
                    <Trans>Job</Trans>
                  </Th>
                  <Th>
                    <Trans>Item</Trans>
                  </Th>
                  <Th>
                    <Trans>Process</Trans>
                  </Th>
                  <Th>
                    <Trans>Quantity</Trans>
                  </Th>
                  <Th>
                    <Trans>Reported</Trans>
                  </Th>
                  {canApprove && (
                    <Th>
                      <Trans>Actions</Trans>
                    </Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {filteredRows.map((report) => {
                  const op = report.jobOperation;
                  const job = op?.job;
                  const item = job?.item;
                  return (
                    <Tr key={report.id}>
                      <Td>
                        <EmployeeAvatar employeeId={report.employeeId} />
                      </Td>
                      <Td>
                        {job ? (
                          <Link
                            to={path.to.jobDag(job.id)}
                            className="font-medium text-foreground hover:underline"
                          >
                            {job.jobId}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </Td>
                      <Td>
                        <VStack spacing={0}>
                          <span>{item?.readableIdWithRevision ?? "—"}</span>
                          {item?.name && (
                            <span className="text-xs text-muted-foreground">
                              {item.name}
                            </span>
                          )}
                        </VStack>
                      </Td>
                      <Td className="text-muted-foreground">
                        {op?.process?.name ?? "—"}
                      </Td>
                      <Td className="font-medium tabular-nums">
                        {report.quantity}
                      </Td>
                      <Td className="text-muted-foreground">
                        {formatDateTime(report.createdAt)}
                      </Td>
                      {canApprove && (
                        <Td>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              leftIcon={<LuCheck />}
                              onClick={() =>
                                setModal({ report, mode: "approve" })
                              }
                            >
                              <Trans>Approve</Trans>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              leftIcon={<LuX />}
                              onClick={() =>
                                setModal({ report, mode: "disapprove" })
                              }
                            >
                              <Trans>Disapprove</Trans>
                            </Button>
                          </div>
                        </Td>
                      )}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
                {isFiltering ? (
                  <LuTriangleAlert className="h-6 w-6" />
                ) : (
                  <LuBadgeCheck className="h-6 w-6" />
                )}
              </div>
              <span className="text-xs font-mono font-light text-foreground uppercase">
                {isFiltering
                  ? t`No results found`
                  : t`No reports awaiting approval`}
              </span>
              {isFiltering && (
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  <Trans>Clear filters</Trans>
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {modal && canApprove && (
        <ApprovalModal
          report={modal.report}
          mode={modal.mode}
          employeeName={employeeName(modal.report.employeeId)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
