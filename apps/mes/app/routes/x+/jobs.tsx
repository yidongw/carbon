import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import {
  Button,
  Heading,
  SidebarTrigger,
  Status,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo, useState } from "react";
import { LuPrinter, LuTriangleAlert } from "react-icons/lu";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import EmployeeAvatar from "~/components/EmployeeAvatar";
import {
  ActiveFilters,
  type ColumnFilter,
  Filter,
  useFilters
} from "~/components/Filter";
import {
  type PrintableBundle,
  PrintTicketsModal
} from "~/components/PrintTicketsModal";
import SearchFilter from "~/components/SearchFilter";
import { TopbarActions } from "~/components/TopbarActions";
import { userContext } from "~/context";
import { useUrlParams } from "~/hooks";
import {
  getOpenJobs,
  getTrackedEntitiesByJobMakeMethodIds
} from "~/services/operations.service";
import { usePeople } from "~/stores";
import { path } from "~/utils/path";

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { companyId } = await requirePermissions(request, {});
  const serviceRole = getCarbonServiceRole();
  const locationId = context.get(userContext)?.locationId;

  const jobs = await getOpenJobs(serviceRole, { companyId, locationId });

  if (jobs.error) {
    console.error("getOpenJobs error:", jobs.error);
  }

  const jobMakeMethodIds = (jobs.data ?? []).reduce<string[]>((acc, job) => {
    if (job.jobMakeMethodId) acc.push(job.jobMakeMethodId);
    return acc;
  }, []);

  const trackedEntities = await getTrackedEntitiesByJobMakeMethodIds(
    serviceRole,
    jobMakeMethodIds,
    companyId
  );

  // Each garment bundle is its own job — map jobId -> bundle so rows can print
  // their bundle ticket.
  const jobIds = (jobs.data ?? [])
    .map((j) => j.id)
    .filter((id): id is string => Boolean(id));
  const bundlesRes = jobIds.length
    ? await serviceRole
        .from("bundleWorkOrders")
        .select(
          "id, jobId, jobReadableId, colorCode, colorName, sizeCode, quantity, locationId"
        )
        .eq("companyId", companyId)
        .in("jobId", jobIds)
    : { data: [] as Array<Record<string, unknown>> };
  const bundleByJobId: Record<string, PrintableBundle> = {};
  for (const b of (bundlesRes.data ?? []) as Array<
    PrintableBundle & { jobId: string | null }
  >) {
    if (b.jobId) bundleByJobId[b.jobId] = b;
  }

  return {
    jobs: jobs.data ?? [],
    trackedEntities,
    bundleByJobId
  };
}

type Job = {
  id: string;
  jobId: string;
  status: string;
  itemReadableIdWithRevision: string | null;
  name: string | null;
  quantity: number | null;
  quantityComplete: number | null;
  dueDate: string | null;
  deadlineType: string | null;
  assignee: string | null;
  jobMakeMethodId: string | null;
};

const STATUS_COLORS: Record<
  string,
  "gray" | "yellow" | "blue" | "orange" | "green" | "red"
> = {
  Draft: "gray",
  Planned: "yellow",
  Ready: "blue",
  "In Progress": "blue",
  Paused: "orange",
  Completed: "green",
  Closed: "gray",
  Cancelled: "red"
};

function JobStatus({ status }: { status: string | null }) {
  if (!status) return null;
  const color = STATUS_COLORS[status] ?? "gray";
  return (
    <Status color={color}>{status === "Ready" ? "Released" : status}</Status>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value + "T00:00:00");
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export default function JobsRoute() {
  const { t } = useLingui();
  const { jobs, trackedEntities, bundleByJobId } =
    useLoaderData<typeof loader>();
  const [printOpen, setPrintOpen] = useState(false);
  const [params, setParams] = useUrlParams();
  const [people] = usePeople();
  const { urlFiltersParams, hasFilters } = useFilters();

  const searchTerm = params.get("search") ?? "";

  const statusOptions = useMemo(
    () =>
      Array.from(
        new Set((jobs as Job[]).map((j) => j.status).filter(Boolean))
      ).map((s) => ({
        label: s === "Ready" ? "Released" : (s as string),
        value: s as string
      })),
    [jobs]
  );

  const assigneeOptions = useMemo(() => {
    const ids = new Set((jobs as Job[]).map((j) => j.assignee).filter(Boolean));
    return people
      .filter((p) => ids.has(p.id))
      .map((p) => ({ label: p.name, value: p.id }));
  }, [jobs, people]);

  const deadlineOptions = useMemo(
    () =>
      Array.from(
        new Set((jobs as Job[]).map((j) => j.deadlineType).filter(Boolean))
      ).map((d) => ({ label: d as string, value: d as string })),
    [jobs]
  );

  const filters = useMemo<ColumnFilter[]>(
    () => [
      {
        accessorKey: "status",
        header: t`Status`,
        filter: { type: "static", options: statusOptions }
      },
      {
        accessorKey: "assignee",
        header: t`Assignee`,
        filter: { type: "static", options: assigneeOptions }
      },
      {
        accessorKey: "deadlineType",
        header: t`Deadline`,
        filter: { type: "static", options: deadlineOptions }
      }
    ],
    [statusOptions, assigneeOptions, deadlineOptions, t]
  );

  const activeFilterMap = useMemo(() => {
    const m: Record<string, Set<string>> = {};
    for (const f of urlFiltersParams) {
      const [key, , value] = f.split(":");
      if (!key || !value) continue;
      m[key] = new Set(value.split(","));
    }
    return m;
  }, [urlFiltersParams]);

  const filteredJobs = useMemo(() => {
    return (jobs as Job[]).filter((job) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matches =
          job.jobId?.toLowerCase().includes(term) ||
          job.itemReadableIdWithRevision?.toLowerCase().includes(term) ||
          job.name?.toLowerCase().includes(term);
        if (!matches) return false;
      }
      for (const [key, values] of Object.entries(activeFilterMap)) {
        const value = String(
          (job as unknown as Record<string, unknown>)[key] ?? ""
        );
        if (!values.has(value)) return false;
      }
      return true;
    });
  }, [jobs, searchTerm, activeFilterMap]);

  const isFiltering = hasFilters || searchTerm.length > 0;
  const clearAll = () => setParams({ filter: undefined, search: undefined });

  // Bundle tickets printable for the currently-shown jobs.
  const printableBundles = useMemo(
    () =>
      filteredJobs
        .map((j) => bundleByJobId[j.id])
        .filter((b): b is PrintableBundle => Boolean(b)),
    [filteredJobs, bundleByJobId]
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 h-svh overflow-hidden">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <SidebarTrigger className="md:hidden" />
          <Heading size="h4">
            <Trans>Open Jobs</Trans>
          </Heading>
        </div>
        <div className="ml-auto flex items-center gap-2 px-2">
          <Button
            variant="secondary"
            leftIcon={<LuPrinter />}
            onClick={() => setPrintOpen(true)}
            isDisabled={printableBundles.length === 0}
          >
            <Trans>Print Tickets</Trans>
          </Button>
          <TopbarActions />
        </div>
      </header>

      {printOpen && (
        <PrintTicketsModal
          bundles={printableBundles}
          onClose={() => setPrintOpen(false)}
        />
      )}

      <div className="flex items-center gap-2 border-b bg-background px-4 py-2">
        <Filter filters={filters} />
        <SearchFilter
          param="search"
          placeholder={t`Search by job or item ID`}
        />
      </div>
      {hasFilters && (
        <div className="flex items-center border-b bg-card px-4 py-1.5">
          <ActiveFilters filters={filters} />
        </div>
      )}

      <main className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
        {filteredJobs.length > 0 ? (
          <>
            {/* Mobile card view */}
            <div className="md:hidden flex flex-col gap-3 p-3">
              {filteredJobs.map((job) => {
                const trackingId = job.jobMakeMethodId
                  ? trackedEntities[job.jobMakeMethodId]
                  : null;
                return (
                  <div
                    key={job.id}
                    className="rounded-lg border bg-card p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={path.to.jobDag(job.id)}
                        className="font-medium text-foreground hover:underline min-w-0"
                      >
                        {job.jobId}
                      </Link>
                      <JobStatus status={job.status} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>{job.itemReadableIdWithRevision ?? "—"}</span>
                      {job.name && (
                        <span className="ml-1 text-xs">· {job.name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {job.quantity != null && (
                        <span className="tabular-nums">
                          {t`Qty`}: {job.quantity}
                        </span>
                      )}
                      {trackingId && <span>{trackingId}</span>}
                      {job.dueDate && <span>{formatDate(job.dueDate)}</span>}
                      {job.deadlineType && <span>{job.deadlineType}</span>}
                      <span className="ml-auto">
                        <EmployeeAvatar employeeId={job.assignee} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Desktop table view */}
            <div className="hidden md:block overflow-x-auto p-4">
              <Table>
                <Thead>
                  <Tr>
                    <Th>
                      <Trans>Job</Trans>
                    </Th>
                    <Th>
                      <Trans>Item</Trans>
                    </Th>
                    <Th>
                      <Trans>Quantity</Trans>
                    </Th>
                    <Th>
                      <Trans>Tracking</Trans>
                    </Th>
                    <Th>
                      <Trans>Assignee</Trans>
                    </Th>
                    <Th>
                      <Trans>Due Date</Trans>
                    </Th>
                    <Th>
                      <Trans>Deadline</Trans>
                    </Th>
                    <Th>
                      <Trans>Status</Trans>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredJobs.map((job) => {
                    const trackingId = job.jobMakeMethodId
                      ? trackedEntities[job.jobMakeMethodId]
                      : null;

                    return (
                      <Tr key={job.id}>
                        <Td>
                          <Link
                            to={path.to.jobDag(job.id)}
                            className="font-medium text-foreground hover:underline"
                          >
                            {job.jobId}
                          </Link>
                        </Td>
                        <Td>
                          <VStack spacing={0}>
                            <span>{job.itemReadableIdWithRevision ?? "—"}</span>
                            {job.name && (
                              <span className="text-xs text-muted-foreground">
                                {job.name}
                              </span>
                            )}
                          </VStack>
                        </Td>
                        <Td className="text-muted-foreground">
                          {job.quantity ?? "—"}
                        </Td>
                        <Td className="text-muted-foreground">
                          {trackingId ?? "—"}
                        </Td>
                        <Td>
                          <EmployeeAvatar employeeId={job.assignee} />
                        </Td>
                        <Td className="text-muted-foreground">
                          {formatDate(job.dueDate)}
                        </Td>
                        <Td className="text-muted-foreground">
                          {job.deadlineType ?? "—"}
                        </Td>
                        <Td>
                          <JobStatus status={job.status} />
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </div>
          </>
        ) : isFiltering ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
              <LuTriangleAlert className="h-6 w-6" />
            </div>
            <span className="text-xs font-mono font-light text-foreground uppercase">
              <Trans>No results</Trans>
            </span>
            <Button onClick={clearAll}>
              <Trans>Clear Filters</Trans>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
              <LuTriangleAlert className="h-6 w-6" />
            </div>
            <span className="text-xs font-mono font-light text-foreground uppercase">
              <Trans>No open jobs</Trans>
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
