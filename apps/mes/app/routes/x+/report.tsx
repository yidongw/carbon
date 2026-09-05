import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { localizeVariantAttributeLabel } from "@carbon/database/style-reference";
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
  Tr
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo, useState } from "react";
import { LuCheck, LuScanLine, LuTriangleAlert } from "react-icons/lu";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { BundleScanPanel } from "~/components/BundleScanPanel";
import EmployeeAvatar from "~/components/EmployeeAvatar";
import {
  ActiveFilters,
  type ColumnFilter,
  Filter,
  useFilters
} from "~/components/Filter";
import { MarkReworkFixedModal } from "~/components/JobOperation/components/MarkReworkFixedModal";
import {
  type ReportableOperation,
  ReportQuantityModal
} from "~/components/JobOperation/components/ReportQuantityModal";
import SearchFilter from "~/components/SearchFilter";
import { TopbarActions } from "~/components/TopbarActions";
import { useUrlParams } from "~/hooks";
import { getAssignedOperationsForReport } from "~/services/operations.service";
import { usePeople } from "~/stores";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId, userId } = await requirePermissions(request, {});
  const serviceRole = getCarbonServiceRole();

  // Managers (production_update) can reclassify rework back into production.
  let canManageProduction = false;
  try {
    await requirePermissions(request, { update: "production" });
    canManageProduction = true;
  } catch {
    canManageProduction = false;
  }

  const operations = await getAssignedOperationsForReport(
    serviceRole,
    companyId
  );
  if (operations.error) {
    console.error("getAssignedOperationsForReport error:", operations.error);
  }

  return { operations: operations.data ?? [], userId, canManageProduction };
}

type ReportOperation = NonNullable<
  Awaited<ReturnType<typeof getAssignedOperationsForReport>>["data"]
>[number] & { assignedAt: string | null };

// assignedAt is a full timestamp (timestamptz).
function formatDateTime(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

const OP_STATUS_COLORS: Record<
  string,
  "gray" | "yellow" | "blue" | "orange" | "green" | "red"
> = {
  Todo: "gray",
  Ready: "blue",
  Waiting: "yellow",
  "In Progress": "blue",
  Paused: "orange",
  Done: "green",
  Canceled: "red"
};

function OperationStatus({ status }: { status: string | null }) {
  if (!status) return null;
  return <Status color={OP_STATUS_COLORS[status] ?? "gray"}>{status}</Status>;
}

/** The displayed target for an operation (target quantity, else operation quantity). */
function operationTarget(row: ReportOperation) {
  return row.targetQuantity > 0 ? row.targetQuantity : row.operationQuantity;
}

export default function ReportRoute() {
  const { t, i18n } = useLingui();
  const { operations, userId, canManageProduction } =
    useLoaderData<typeof loader>();
  const [params, setParams] = useUrlParams();
  const [people] = usePeople();
  const { urlFiltersParams, hasFilters } = useFilters();

  const searchTerm = params.get("search") ?? "";
  const rows = operations as ReportOperation[];

  const [reportRow, setReportRow] = useState<ReportOperation | null>(null);
  const [fixRow, setFixRow] = useState<ReportOperation | null>(null);

  const assigneeOptions = useMemo(() => {
    const ids = new Set(rows.map((r) => r.assignee).filter(Boolean));
    return people
      .filter((p) => ids.has(p.id))
      .map((p) => ({ label: p.name, value: p.id }));
  }, [rows, people]);

  const statusOptions = useMemo(
    () =>
      Array.from(
        new Set(rows.map((r) => r.operationStatus).filter(Boolean))
      ).map((s) => ({ label: s as string, value: s as string })),
    [rows]
  );

  const styleOptions = useMemo(
    () =>
      Array.from(
        new Set(rows.map((r) => r.styleReadableId).filter(Boolean))
      ).map((s) => ({ label: s as string, value: s as string })),
    [rows]
  );

  const filters = useMemo<ColumnFilter[]>(
    () => [
      {
        accessorKey: "assignee",
        header: t`Assignee`,
        filter: { type: "static", options: assigneeOptions }
      },
      {
        accessorKey: "operationStatus",
        header: t`Status`,
        filter: { type: "static", options: statusOptions }
      },
      {
        accessorKey: "styleReadableId",
        header: t`Style`,
        filter: { type: "static", options: styleOptions }
      }
    ],
    [assigneeOptions, statusOptions, styleOptions, t]
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

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matches =
          row.jobReadableId?.toLowerCase().includes(term) ||
          row.readableIdWithRevision?.toLowerCase().includes(term) ||
          row.itemName?.toLowerCase().includes(term) ||
          row.description?.toLowerCase().includes(term);
        if (!matches) return false;
      }
      for (const [key, values] of Object.entries(activeFilterMap)) {
        const value = String(
          (row as unknown as Record<string, unknown>)[key] ?? ""
        );
        if (!values.has(value)) return false;
      }
      return true;
    });
  }, [rows, searchTerm, activeFilterMap]);

  const isFiltering = hasFilters || searchTerm.length > 0;
  const clearAll = () => setParams({ filter: undefined, search: undefined });

  const modalOperation: ReportableOperation | null = reportRow
    ? {
        id: reportRow.id,
        processId: reportRow.processId,
        description: reportRow.description,
        itemReadableId: reportRow.itemReadableId,
        operationQuantity: reportRow.operationQuantity,
        targetQuantity: reportRow.targetQuantity,
        quantityComplete: reportRow.quantityComplete,
        quantityReworked: reportRow.quantityReworked,
        quantityScrapped: reportRow.quantityScrapped,
        operationStatus: reportRow.operationStatus
      }
    : null;

  return (
    <div className="flex flex-col flex-1 min-h-0 h-svh overflow-hidden">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <SidebarTrigger className="md:hidden" />
          <Heading size="h4">
            <Trans>Report Quantities</Trans>
          </Heading>
        </div>
        <div className="ml-auto flex items-center gap-2 px-2">
          {isFiltering && (
            <Button
              variant="secondary"
              leftIcon={<LuScanLine />}
              onClick={clearAll}
            >
              <Trans>Scan</Trans>
            </Button>
          )}
          <TopbarActions />
        </div>
      </header>

      <div className="flex items-center gap-2 border-b bg-background px-4 py-2">
        <Filter filters={filters} />
        <SearchFilter
          param="search"
          placeholder={t`Search by bundle or style`}
        />
      </div>
      {hasFilters && (
        <div className="flex items-center gap-2 border-b bg-card px-4 py-1.5">
          <ActiveFilters filters={filters} />
        </div>
      )}

      <main className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
        {!isFiltering ? (
          <BundleScanPanel intent="report" />
        ) : filtered.length > 0 ? (
          <>
            {/* Mobile card view */}
            <div className="md:hidden flex flex-col gap-3 p-3">
              {filtered.map((row) => (
                <div
                  key={row.id}
                  className="rounded-lg border bg-card p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        to={path.to.jobDag(row.jobId ?? "")}
                        className="font-medium text-foreground hover:underline"
                      >
                        {row.jobReadableId ?? row.id}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {row.styleReadableId ?? "—"}
                        {row.description && (
                          <span className="ml-1 text-xs">
                            · {row.description}
                          </span>
                        )}
                      </p>
                    </div>
                    <OperationStatus status={row.operationStatus} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {row.attributeLabel && (
                      <span>
                        {localizeVariantAttributeLabel(
                          row.attributeLabel,
                          i18n.locale
                        )}
                      </span>
                    )}
                    <span className="tabular-nums">
                      {t`Qty`}: {row.quantityComplete} / {operationTarget(row)}
                    </span>
                    {Number(row.quantityReworked) > 0 && (
                      <span className="tabular-nums text-amber-600 dark:text-amber-500">
                        {t`Rework`}: {Number(row.quantityReworked)}
                      </span>
                    )}
                    {Number(row.quantityScrapped) > 0 && (
                      <span className="tabular-nums text-red-600 dark:text-red-500">
                        {t`Scrap`}: {Number(row.quantityScrapped)}
                      </span>
                    )}
                    {row.assignedAt && (
                      <span>
                        {t`Assigned`}: {formatDateTime(row.assignedAt)}
                      </span>
                    )}
                    <span className="ml-auto">
                      <EmployeeAvatar employeeId={row.assignee} />
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {canManageProduction &&
                      Number(row.quantityReworked) > 0 && (
                        <Button
                          className="flex-1"
                          variant="secondary"
                          leftIcon={<LuCheck />}
                          onClick={() => setFixRow(row)}
                        >
                          <Trans>Mark fixed</Trans>
                        </Button>
                      )}
                    <Button
                      className="flex-1"
                      onClick={() => setReportRow(row)}
                    >
                      <Trans>Report</Trans>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden md:block overflow-x-auto p-4">
              <Table>
                <Thead>
                  <Tr>
                    <Th>
                      <Trans>Bundle</Trans>
                    </Th>
                    <Th>
                      <Trans>Style</Trans>
                    </Th>
                    <Th>
                      <Trans>Attributes</Trans>
                    </Th>
                    <Th>
                      <Trans>Process</Trans>
                    </Th>
                    <Th>
                      <Trans>Progress</Trans>
                    </Th>
                    <Th>
                      <Trans>Rework</Trans>
                    </Th>
                    <Th>
                      <Trans>Scrap</Trans>
                    </Th>
                    <Th>
                      <Trans>Assignee</Trans>
                    </Th>
                    <Th>
                      <Trans>Assigned At</Trans>
                    </Th>
                    <Th>
                      <Trans>Status</Trans>
                    </Th>
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {filtered.map((row) => (
                    <Tr key={row.id}>
                      <Td>
                        <Link
                          to={path.to.jobDag(row.jobId ?? "")}
                          className="font-medium text-foreground hover:underline"
                        >
                          {row.jobReadableId ?? row.id}
                        </Link>
                      </Td>
                      <Td>{row.styleReadableId ?? "—"}</Td>
                      <Td className="text-muted-foreground">
                        {localizeVariantAttributeLabel(
                          row.attributeLabel,
                          i18n.locale
                        ) || "—"}
                      </Td>
                      <Td>{row.description ?? "—"}</Td>
                      <Td className="text-muted-foreground tabular-nums">
                        {row.quantityComplete} / {operationTarget(row)}
                      </Td>
                      <Td className="tabular-nums">
                        {Number(row.quantityReworked) > 0 ? (
                          <span className="text-amber-600 dark:text-amber-500">
                            {Number(row.quantityReworked)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </Td>
                      <Td className="tabular-nums">
                        {Number(row.quantityScrapped) > 0 ? (
                          <span className="text-red-600 dark:text-red-500">
                            {Number(row.quantityScrapped)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </Td>
                      <Td>
                        <EmployeeAvatar employeeId={row.assignee} />
                      </Td>
                      <Td className="text-muted-foreground">
                        {formatDateTime(row.assignedAt)}
                      </Td>
                      <Td>
                        <OperationStatus status={row.operationStatus} />
                      </Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canManageProduction &&
                            Number(row.quantityReworked) > 0 && (
                              <Button
                                size="sm"
                                variant="secondary"
                                leftIcon={<LuCheck />}
                                onClick={() => setFixRow(row)}
                              >
                                <Trans>Mark fixed</Trans>
                              </Button>
                            )}
                          <Button size="sm" onClick={() => setReportRow(row)}>
                            <Trans>Report</Trans>
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
              <LuTriangleAlert className="h-6 w-6" />
            </div>
            <span className="text-xs font-mono font-light text-foreground uppercase">
              {isFiltering ? t`No results` : t`No assigned operations`}
            </span>
            {isFiltering && (
              <Button onClick={clearAll}>
                <Trans>Clear Filters</Trans>
              </Button>
            )}
          </div>
        )}
      </main>

      {reportRow && modalOperation && (
        <ReportQuantityModal
          operation={modalOperation}
          bundle={{ attributeLabel: reportRow.attributeLabel }}
          defaultEmployeeId={reportRow.assignee ?? userId}
          onClose={() => setReportRow(null)}
        />
      )}

      {fixRow && (
        <MarkReworkFixedModal
          jobOperationId={fixRow.id}
          reworkQuantity={Number(fixRow.quantityReworked)}
          onClose={() => setFixRow(null)}
        />
      )}
    </div>
  );
}
