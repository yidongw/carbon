import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { localizeVariantAttributeLabel } from "@carbon/database/style-reference";
import {
  Button,
  Heading,
  SidebarTrigger,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useCallback, useMemo } from "react";
import { LuScanLine, LuTriangleAlert } from "react-icons/lu";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import { BundleScanPanel } from "~/components/BundleScanPanel";
import {
  ActiveFilters,
  type ColumnFilter,
  Filter,
  useFilters
} from "~/components/Filter";
import { JobStatus } from "~/components/JobStatus";
import SearchFilter from "~/components/SearchFilter";
import { TopbarActions } from "~/components/TopbarActions";
import { useUrlParams } from "~/hooks";
import { getUnassignedBundleWorkOrders } from "~/services/bundle.service";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId } = await requirePermissions(request, {});
  const serviceRole = getCarbonServiceRole();

  const bundles = await getUnassignedBundleWorkOrders(serviceRole, companyId);
  if (bundles.error) {
    console.error("getUnassignedBundleWorkOrders error:", bundles.error);
  }

  return {
    bundles: (bundles.data ?? []).filter((b): b is typeof b & { id: string } =>
      Boolean(b.id)
    )
  };
}

// The loader filters to rows with a non-null id, so id is a string here.
type UnassignedBundle = NonNullable<
  Awaited<ReturnType<typeof getUnassignedBundleWorkOrders>>["data"]
>[number] & { id: string };

export default function PickupRoute() {
  const { t, i18n } = useLingui();
  const { bundles } = useLoaderData<typeof loader>();
  const [params, setParams] = useUrlParams();
  const { urlFiltersParams, hasFilters } = useFilters();
  const navigate = useNavigate();

  const searchTerm = params.get("search") ?? "";
  const rows = bundles as UnassignedBundle[];

  // Scanning is the primary way in: a worker scans a bundle ticket to take the
  // job (see BundleScanPanel). The table of unclaimed bundles only appears once
  // a style filter or search narrows things down — we never dump every open
  // bundle on the page.
  const goToPickup = useCallback(
    (id: string) => navigate(`${path.to.bundle(id)}?intent=pickup`),
    [navigate]
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
        accessorKey: "styleReadableId",
        header: t`Style`,
        filter: { type: "static", options: styleOptions }
      }
    ],
    [styleOptions, t]
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
            <Trans>Pickup Bundle Job</Trans>
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
          <BundleScanPanel intent="pickup" />
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
                      <span className="font-medium text-foreground">
                        {row.jobReadableId ?? row.id}
                      </span>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {row.styleReadableId ?? "—"}
                      </p>
                    </div>
                    <JobStatus status={row.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {row.attributeLabel && (
                      <span>
                        {localizeVariantAttributeLabel(
                          row.attributeLabel ?? "",
                          i18n.locale
                        )}
                      </span>
                    )}
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
                  </div>
                  <Button className="w-full" onClick={() => goToPickup(row.id)}>
                    <Trans>Pick up</Trans>
                  </Button>
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
                      <Trans>Quantity</Trans>
                    </Th>
                    <Th>
                      <Trans>Processes</Trans>
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
                      <Td className="font-medium text-foreground">
                        {row.jobReadableId ?? row.id}
                      </Td>
                      <Td>{row.styleReadableId ?? "—"}</Td>
                      <Td className="text-muted-foreground">
                        {localizeVariantAttributeLabel(
                          row.attributeLabel ?? "",
                          i18n.locale
                        ) || "—"}
                      </Td>
                      <Td className="text-muted-foreground tabular-nums">
                        {row.quantity ?? "—"}
                      </Td>
                      <Td className="text-muted-foreground tabular-nums">
                        {row.processCount ?? "—"}
                      </Td>
                      <Td>
                        <JobStatus status={row.status} />
                      </Td>
                      <Td className="text-right">
                        <Button size="sm" onClick={() => goToPickup(row.id)}>
                          <Trans>Pick up</Trans>
                        </Button>
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
              {t`No results`}
            </span>
            <Button onClick={clearAll}>
              <Trans>Clear Filters</Trans>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
