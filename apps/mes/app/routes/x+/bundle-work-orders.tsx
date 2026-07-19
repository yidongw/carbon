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
import { LuPrinter, LuTriangleAlert, LuX } from "react-icons/lu";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData, useNavigate } from "react-router";
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
import { useLocalizeColor, useUrlParams } from "~/hooks";
import { getBundleWorkOrdersList } from "~/services/bundle.service";
import { usePeople } from "~/stores";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId } = await requirePermissions(request, {});
  const serviceRole = getCarbonServiceRole();

  const masterWorkOrderId =
    new URL(request.url).searchParams.get("masterWorkOrderId") ?? undefined;

  const bundles = await getBundleWorkOrdersList(
    serviceRole,
    companyId,
    masterWorkOrderId
  );
  if (bundles.error) {
    console.error("getBundleWorkOrdersList error:", bundles.error);
  }

  const bundleData = bundles.data ?? [];
  const masterIds = [
    ...new Set(bundleData.map((b) => b.masterWorkOrderId).filter(Boolean))
  ] as string[];

  const masterWOs =
    masterIds.length > 0
      ? await serviceRole
          .from("masterWorkOrders")
          .select("id, jobReadableId")
          .in("id", masterIds)
      : { data: [] as Array<{ id: string; jobReadableId: string | null }> };

  const masterWOMap: Record<string, string> = {};
  for (const m of masterWOs.data ?? []) {
    if (m.id && m.jobReadableId) masterWOMap[m.id] = m.jobReadableId;
  }

  return { bundles: bundleData, masterWorkOrderId, masterWOMap };
}

type BundleWorkOrder = {
  id: string | null;
  jobId: string | null;
  jobReadableId: string | null;
  readableIdWithRevision: string | null;
  itemName: string | null;
  colorCode: string | null;
  colorName: string | null;
  sizeCode: string | null;
  sequence: number | null;
  quantity: number | null;
  status: string | null;
  assignee: string | null;
  assignedAt: string | null;
  masterWorkOrderId: string | null;
  processCount: number | null;
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

export default function BundleWorkOrdersRoute() {
  const { t } = useLingui();
  const { bundles, masterWorkOrderId, masterWOMap } =
    useLoaderData<typeof loader>();
  const [params, setParams] = useUrlParams();
  const [people] = usePeople();
  const localizeColor = useLocalizeColor();
  const { urlFiltersParams, hasFilters } = useFilters();
  const navigate = useNavigate();

  const searchTerm = params.get("search") ?? "";
  const rows = bundles as BundleWorkOrder[];

  const statusOptions = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.status).filter(Boolean))).map(
        (s) => ({
          label: s === "Ready" ? "Released" : (s as string),
          value: s as string
        })
      ),
    [rows]
  );

  const assigneeOptions = useMemo(() => {
    const ids = new Set(rows.map((r) => r.assignee).filter(Boolean));
    return people
      .filter((p) => ids.has(p.id))
      .map((p) => ({ label: p.name, value: p.id }));
  }, [rows, people]);

  const colorOptions = useMemo(() => {
    const codes = new Set(rows.map((r) => r.colorCode).filter(Boolean));
    return Array.from(codes).map((code) => {
      const row = rows.find((r) => r.colorCode === code);
      return {
        label: localizeColor(row?.colorName || code),
        value: code as string
      };
    });
  }, [rows, localizeColor]);

  const sizeOptions = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.sizeCode).filter(Boolean))).map(
        (s) => ({ label: s as string, value: s as string })
      ),
    [rows]
  );

  const styleOptions = useMemo(
    () =>
      Array.from(
        new Set(rows.map((r) => r.readableIdWithRevision).filter(Boolean))
      ).map((s) => ({ label: s as string, value: s as string })),
    [rows]
  );

  const masterWOOptions = useMemo(
    () =>
      Array.from(
        new Set(rows.map((r) => r.masterWorkOrderId).filter(Boolean))
      ).map((id) => ({
        label: masterWOMap[id as string] ?? (id as string),
        value: id as string
      })),
    [rows, masterWOMap]
  );

  const filters = useMemo<ColumnFilter[]>(
    () => [
      {
        accessorKey: "masterWorkOrderId",
        header: t`Master Order`,
        filter: { type: "static", options: masterWOOptions }
      },
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
        accessorKey: "readableIdWithRevision",
        header: t`Style`,
        filter: { type: "static", options: styleOptions }
      },
      {
        accessorKey: "colorCode",
        header: t`Color`,
        filter: { type: "static", options: colorOptions }
      },
      {
        accessorKey: "sizeCode",
        header: t`Size`,
        filter: { type: "static", options: sizeOptions }
      }
    ],
    [
      masterWOOptions,
      statusOptions,
      assigneeOptions,
      styleOptions,
      colorOptions,
      sizeOptions,
      t
    ]
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
          row.itemName?.toLowerCase().includes(term);
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

  const [printOpen, setPrintOpen] = useState(false);
  const printableBundles = useMemo<PrintableBundle[]>(
    () =>
      filtered
        .filter((r): r is BundleWorkOrder & { id: string } => Boolean(r.id))
        .map((r) => ({
          id: r.id,
          jobReadableId: r.jobReadableId,
          colorCode: r.colorCode,
          colorName: r.colorName,
          sizeCode: r.sizeCode,
          quantity: r.quantity,
          locationId: null
        })),
    [filtered]
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 h-svh overflow-hidden">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <SidebarTrigger className="md:hidden" />
          <Heading size="h4">
            <Trans>Bundle Work Orders</Trans>
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

      <div className="flex items-center gap-2 border-b bg-background px-4 py-2">
        <Filter filters={filters} />
        <SearchFilter
          param="search"
          placeholder={t`Search by bundle or style`}
        />
      </div>
      {(hasFilters || masterWorkOrderId) && (
        <div className="flex items-center gap-2 border-b bg-card px-4 py-1.5">
          {masterWorkOrderId && (
            <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-0.5 text-xs font-medium">
              <Trans>Master Order</Trans>:{" "}
              {masterWOMap[masterWorkOrderId] ?? masterWorkOrderId}
              <button
                type="button"
                onClick={() => navigate(path.to.bundleWorkOrders)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                aria-label={t`Clear master order filter`}
              >
                <LuX className="h-3 w-3" />
              </button>
            </span>
          )}
          {hasFilters && <ActiveFilters filters={filters} />}
        </div>
      )}

      <main className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
        {filtered.length > 0 ? (
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
                      {row.id ? (
                        <Link
                          to={path.to.jobDag(row.jobId ?? "")}
                          className="font-medium text-foreground hover:underline"
                        >
                          {row.jobReadableId ?? row.id}
                        </Link>
                      ) : (
                        <span className="font-medium">
                          {row.jobReadableId ?? "—"}
                        </span>
                      )}
                      {row.masterWorkOrderId && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <Trans>Master Order</Trans>:{" "}
                          {masterWOMap[row.masterWorkOrderId] ??
                            row.masterWorkOrderId}
                        </p>
                      )}
                    </div>
                    <JobStatus status={row.status} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{row.readableIdWithRevision ?? "—"}</span>
                    {row.itemName && (
                      <span className="ml-1 text-xs">· {row.itemName}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {row.colorName && (
                      <span>{localizeColor(row.colorName)}</span>
                    )}
                    {row.sizeCode && <span>{row.sizeCode}</span>}
                    {row.quantity != null && (
                      <span className="tabular-nums">
                        {t`Qty`}: {row.quantity}
                      </span>
                    )}
                    {row.processCount != null && (
                      <span className="tabular-nums">
                        {t`Processes`}: {row.processCount}
                      </span>
                    )}
                    <span className="ml-auto">
                      <EmployeeAvatar employeeId={row.assignee} />
                    </span>
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
                      <Trans>Master Order</Trans>
                    </Th>
                    <Th>
                      <Trans>Style</Trans>
                    </Th>
                    <Th>
                      <Trans>Color</Trans>
                    </Th>
                    <Th>
                      <Trans>Size</Trans>
                    </Th>
                    <Th>
                      <Trans>Quantity</Trans>
                    </Th>
                    <Th>
                      <Trans>Processes</Trans>
                    </Th>
                    <Th>
                      <Trans>Assignee</Trans>
                    </Th>
                    <Th>
                      <Trans>Status</Trans>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filtered.map((row) => (
                    <Tr key={row.id}>
                      <Td>
                        {row.id ? (
                          <Link
                            to={path.to.jobDag(row.jobId ?? "")}
                            className="font-medium text-foreground hover:underline"
                          >
                            {row.jobReadableId ?? row.id}
                          </Link>
                        ) : (
                          (row.jobReadableId ?? "—")
                        )}
                      </Td>
                      <Td className="text-muted-foreground">
                        {row.masterWorkOrderId
                          ? (masterWOMap[row.masterWorkOrderId] ??
                            row.masterWorkOrderId)
                          : "—"}
                      </Td>
                      <Td>
                        <VStack spacing={0}>
                          <span>{row.readableIdWithRevision ?? "—"}</span>
                          {row.itemName && (
                            <span className="text-xs text-muted-foreground">
                              {row.itemName}
                            </span>
                          )}
                        </VStack>
                      </Td>
                      <Td className="text-muted-foreground">
                        {localizeColor(row.colorName || row.colorCode) || "—"}
                      </Td>
                      <Td className="text-muted-foreground">
                        {row.sizeCode ?? "—"}
                      </Td>
                      <Td className="text-muted-foreground tabular-nums">
                        {row.quantity ?? "—"}
                      </Td>
                      <Td className="text-muted-foreground tabular-nums">
                        {row.processCount ?? "—"}
                      </Td>
                      <Td>
                        <EmployeeAvatar employeeId={row.assignee} />
                      </Td>
                      <Td>
                        <JobStatus status={row.status} />
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
              {isFiltering ? t`No results` : t`No bundle work orders`}
            </span>
            {isFiltering && (
              <Button onClick={clearAll}>
                <Trans>Clear Filters</Trans>
              </Button>
            )}
          </div>
        )}
      </main>
      {printOpen && (
        <PrintTicketsModal
          bundles={printableBundles}
          onClose={() => setPrintOpen(false)}
        />
      )}
    </div>
  );
}
