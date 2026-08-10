import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { localizeVariantAttributeLabel } from "@carbon/database/style-reference";
import {
  Button,
  Heading,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
import { useMemo } from "react";
import { LuTable2, LuTriangleAlert } from "react-icons/lu";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import EmployeeAvatar from "~/components/EmployeeAvatar";
import {
  ActiveFilters,
  type ColumnFilter,
  Filter,
  useFilters
} from "~/components/Filter";
import SearchFilter from "~/components/SearchFilter";
import { TopbarActions } from "~/components/TopbarActions";
import { useUrlParams } from "~/hooks";
import { getMasterWorkOrdersList } from "~/services/bundle.service";
import { usePeople } from "~/stores";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId } = await requirePermissions(request, {});
  const serviceRole = getCarbonServiceRole();

  const masters = await getMasterWorkOrdersList(serviceRole, companyId);
  if (masters.error) {
    console.error("getMasterWorkOrdersList error:", masters.error);
  }

  const masterIds = (masters.data ?? [])
    .map((m) => m.id)
    .filter(Boolean) as string[];

  const bundleStats =
    masterIds.length > 0
      ? await serviceRole
          .from("bundleWorkOrders")
          .select(
            "masterWorkOrderId, quantityComplete, processCount, attributeLabel, attributeValues, valuesKey, quantity"
          )
          .in("masterWorkOrderId", masterIds)
          .eq("companyId", companyId)
          .order("attributeLabel", { ascending: true })
      : {
          data: [] as Array<{
            masterWorkOrderId: string | null;
            quantityComplete: number | null;
            processCount: number | null;
            attributeLabel: string | null;
            attributeValues: Record<string, string> | null;
            valuesKey: string | null;
            quantity: number | null;
          }>
        };

  type AttrBreakdownRow = {
    valuesKey: string;
    attributeLabel: string;
    quantity: number;
    reportedQuantity: number;
  };

  const statsMap: Record<
    string,
    {
      bundleCount: number;
      processCount: number;
      reportedQuantity: number;
      breakdown: AttrBreakdownRow[];
    }
  > = {};

  for (const b of bundleStats.data ?? []) {
    if (!b.masterWorkOrderId) continue;
    const s = statsMap[b.masterWorkOrderId] ?? {
      bundleCount: 0,
      processCount: 0,
      reportedQuantity: 0,
      breakdown: [] as AttrBreakdownRow[]
    };
    s.bundleCount += 1;
    s.processCount = b.processCount ?? s.processCount;
    // Reported/produced = units past the bundle job's final operation
    // (job.quantityComplete), not a denormalized bundle counter.
    s.reportedQuantity += b.quantityComplete ?? 0;
    const valuesKey = b.valuesKey ?? b.attributeLabel ?? "";
    if (valuesKey) {
      const existing = s.breakdown.find((r) => r.valuesKey === valuesKey);
      if (existing) {
        existing.quantity += b.quantity ?? 0;
        existing.reportedQuantity += b.quantityComplete ?? 0;
      } else {
        s.breakdown.push({
          valuesKey,
          attributeLabel: b.attributeLabel ?? valuesKey,
          quantity: b.quantity ?? 0,
          reportedQuantity: b.quantityComplete ?? 0
        });
      }
    }
    statsMap[b.masterWorkOrderId] = s;
  }

  return { masters: masters.data ?? [], statsMap };
}

type MasterWorkOrder = {
  id: string | null;
  jobReadableId: string | null;
  readableIdWithRevision: string | null;
  itemName: string | null;
  quantity: number | null;
  status: string | null;
  assignee: string | null;
  dueDate: string | null;
  deadlineType: string | null;
  salesOrderReadableId: string | null;
  locationName: string | null;
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
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export default function MasterWorkOrdersRoute() {
  const { t, i18n } = useLingui();
  const { masters, statsMap } = useLoaderData<typeof loader>();
  const [params, setParams] = useUrlParams();
  const [people] = usePeople();
  const { urlFiltersParams, hasFilters } = useFilters();

  const searchTerm = params.get("search") ?? "";
  const rows = masters as MasterWorkOrder[];

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
      }
    ],
    [statusOptions, assigneeOptions, t]
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

  return (
    <div className="flex flex-col flex-1 min-h-0 h-svh overflow-hidden">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <SidebarTrigger className="md:hidden" />
          <Heading size="h4">
            <Trans>Master Work Orders</Trans>
          </Heading>
        </div>
        <div className="ml-auto flex items-center px-2">
          <TopbarActions />
        </div>
      </header>

      <div className="flex items-center gap-2 border-b bg-background px-4 py-2">
        <Filter filters={filters} />
        <SearchFilter param="search" placeholder={t`Search by WO or style`} />
      </div>
      {hasFilters && (
        <div className="flex items-center border-b bg-card px-4 py-1.5">
          <ActiveFilters filters={filters} />
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
                          to={path.to.bundleWorkOrdersForMaster(row.id)}
                          className="font-medium text-foreground hover:underline"
                        >
                          {row.jobReadableId ?? row.id}
                        </Link>
                      ) : (
                        <span className="font-medium">
                          {row.jobReadableId ?? "—"}
                        </span>
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
                    {row.id && statsMap[row.id] && (
                      <>
                        <span className="tabular-nums">
                          {t`Bundles`}: {statsMap[row.id].bundleCount}
                        </span>
                        <span className="tabular-nums">
                          {t`Processes`}: {statsMap[row.id].processCount}
                        </span>
                      </>
                    )}
                    <span>{formatDate(row.dueDate)}</span>
                    <span className="ml-auto">
                      <EmployeeAvatar employeeId={row.assignee} />
                    </span>
                  </div>
                  {row.id && statsMap[row.id]?.breakdown.length ? (
                    <table className="w-full text-xs tabular-nums border-t pt-1 mt-1">
                      <thead>
                        <tr className="text-muted-foreground">
                          <th className="text-left font-normal py-0.5 pr-2">
                            <Trans>Attributes</Trans>
                          </th>
                          <th className="text-right font-normal py-0.5 pr-2">
                            <Trans>Quantity</Trans>
                          </th>
                          <th className="text-right font-normal py-0.5 pr-2">
                            <Trans>Reported</Trans>
                          </th>
                          <th className="text-right font-normal py-0.5">
                            <Trans>Remaining</Trans>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {statsMap[row.id].breakdown.map((b) => (
                          <tr key={b.valuesKey}>
                            <td className="text-muted-foreground py-0.5 pr-2 truncate max-w-[120px]">
                              {localizeVariantAttributeLabel(
                                b.attributeLabel,
                                i18n.locale
                              )}
                            </td>
                            <td className="text-right py-0.5 pr-2">
                              {b.quantity}
                            </td>
                            <td className="text-right py-0.5 pr-2">
                              {b.reportedQuantity}
                            </td>
                            <td className="text-right py-0.5">
                              {Math.max(0, b.quantity - b.reportedQuantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden md:block overflow-x-auto p-4">
              <Table>
                <Thead>
                  <Tr>
                    <Th>
                      <Trans>Work Order</Trans>
                    </Th>
                    <Th>
                      <Trans>Style</Trans>
                    </Th>
                    <Th>
                      <Trans>Bundles</Trans>
                    </Th>
                    <Th>
                      <Trans>Processes</Trans>
                    </Th>
                    <Th>
                      <Trans>Quantity</Trans>
                    </Th>
                    <Th>
                      <Trans>Reported</Trans>
                    </Th>
                    <Th>
                      <Trans>Remaining</Trans>
                    </Th>
                    <Th>
                      <Trans>Assignee</Trans>
                    </Th>
                    <Th>
                      <Trans>Due Date</Trans>
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
                            to={path.to.bundleWorkOrdersForMaster(row.id)}
                            className="font-medium text-foreground hover:underline"
                          >
                            {row.jobReadableId ?? row.id}
                          </Link>
                        ) : (
                          (row.jobReadableId ?? "—")
                        )}
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
                      <Td className="text-muted-foreground tabular-nums">
                        {row.id ? (statsMap[row.id]?.bundleCount ?? "—") : "—"}
                      </Td>
                      <Td className="text-muted-foreground tabular-nums">
                        {row.id ? (statsMap[row.id]?.processCount ?? "—") : "—"}
                      </Td>
                      <Td>
                        {row.id && statsMap[row.id] ? (
                          <div className="flex items-center gap-1 tabular-nums">
                            <span>
                              {statsMap[row.id].breakdown.reduce(
                                (sum, b) => sum + b.quantity,
                                0
                              ) ||
                                (row.quantity ?? "—")}
                            </span>
                            {statsMap[row.id].breakdown.length > 0 && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <LuTable2 className="h-3.5 w-3.5" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-2"
                                  align="start"
                                >
                                  <table className="text-xs tabular-nums">
                                    <tbody>
                                      {statsMap[row.id].breakdown.map((b) => (
                                        <tr key={b.valuesKey}>
                                          <td className="text-muted-foreground pr-2 py-0.5 max-w-[72px] truncate">
                                            {localizeVariantAttributeLabel(
                                              b.attributeLabel,
                                              i18n.locale
                                            )}
                                          </td>
                                          <td className="text-right py-0.5">
                                            {b.quantity}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            {row.quantity ?? "—"}
                          </span>
                        )}
                      </Td>
                      <Td>
                        {row.id && statsMap[row.id] ? (
                          <div className="flex items-center gap-1 tabular-nums">
                            <span>{statsMap[row.id].reportedQuantity}</span>
                            {statsMap[row.id].breakdown.length > 0 && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <LuTable2 className="h-3.5 w-3.5" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-2"
                                  align="start"
                                >
                                  <table className="text-xs tabular-nums">
                                    <tbody>
                                      {statsMap[row.id].breakdown.map((b) => (
                                        <tr key={b.valuesKey}>
                                          <td className="text-muted-foreground pr-2 py-0.5 max-w-[72px] truncate">
                                            {localizeVariantAttributeLabel(
                                              b.attributeLabel,
                                              i18n.locale
                                            )}
                                          </td>
                                          <td className="text-right py-0.5">
                                            {b.reportedQuantity}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </Td>
                      <Td>
                        {row.id && statsMap[row.id] ? (
                          <div className="flex items-center gap-1 tabular-nums">
                            <span>
                              {statsMap[row.id].breakdown.reduce(
                                (sum, b) =>
                                  sum +
                                  Math.max(0, b.quantity - b.reportedQuantity),
                                0
                              )}
                            </span>
                            {statsMap[row.id].breakdown.length > 0 && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <LuTable2 className="h-3.5 w-3.5" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-2"
                                  align="start"
                                >
                                  <table className="text-xs tabular-nums">
                                    <tbody>
                                      {statsMap[row.id].breakdown.map((b) => (
                                        <tr key={b.valuesKey}>
                                          <td className="text-muted-foreground pr-2 py-0.5 max-w-[72px] truncate">
                                            {localizeVariantAttributeLabel(
                                              b.attributeLabel,
                                              i18n.locale
                                            )}
                                          </td>
                                          <td className="text-right py-0.5">
                                            {Math.max(
                                              0,
                                              b.quantity - b.reportedQuantity
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </Td>
                      <Td>
                        <EmployeeAvatar employeeId={row.assignee} />
                      </Td>
                      <Td className="text-muted-foreground">
                        {formatDate(row.dueDate)}
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
              {isFiltering ? t`No results` : t`No master work orders`}
            </span>
            {isFiltering && (
              <Button onClick={clearAll}>
                <Trans>Clear Filters</Trans>
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
