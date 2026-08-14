import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import type { StockOverviewItem } from "~/modules/inventory";
import { StockOverviewTable } from "~/modules/inventory";
import { getStockOverview } from "~/modules/inventory/stockOverview.server";
import { getGenericQueryFilters } from "~/utils/query";

// Numeric columns the table can sort by (in-memory, since rows are computed).
const NUMERIC_SORT: Record<string, (i: StockOverviewItem) => number> = {
  onHand: (i) => i.onHand,
  toSend: (i) => i.toSend,
  toReceive: (i) => i.toReceive,
  inTransit: (i) => i.inTransit,
  total: (i) => i.total
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "inventory",
    bypassRls: true
  });

  const searchParams = new URL(request.url).searchParams;
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const { items } = await getStockOverview(client, companyId);

  let rows = search
    ? items.filter(
        (i) =>
          i.readableIdWithRevision.toLowerCase().includes(search) ||
          i.name.toLowerCase().includes(search)
      )
    : items;

  // Default sort: most on-hand first; otherwise honor the table's sort param.
  const sort = sorts?.[0];
  const numeric = sort ? NUMERIC_SORT[sort.sortBy] : undefined;
  rows = [...rows].sort((a, b) => {
    if (!sort) return b.onHand - a.onHand;
    if (numeric) {
      const diff = numeric(a) - numeric(b);
      return sort.sortAsc ? diff : -diff;
    }
    const cmp = a.readableIdWithRevision.localeCompare(
      b.readableIdWithRevision
    );
    return sort.sortAsc ? cmp : -cmp;
  });

  return {
    items: rows.slice(offset, offset + limit),
    count: rows.length
  };
}

export default function StockOverviewRoute() {
  const { items, count } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <StockOverviewTable data={items} count={count} />
    </VStack>
  );
}
