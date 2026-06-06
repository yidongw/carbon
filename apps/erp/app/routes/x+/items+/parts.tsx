import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getParts } from "~/modules/items";
import { PartsTable } from "~/modules/items/ui/Parts";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { useRealtime } from "../../../hooks";

export const handle: Handle = {
  breadcrumb: msg`Parts`,
  to: path.to.parts
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const supplierId = searchParams.get("supplierId");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  // Tags are small/cheap — keep them blocking so filters render immediately.
  const tags = await getTagsList(client, companyId, "part");

  // Defer the heavy parts query: the page navigates instantly and renders a
  // table skeleton while the rows stream in. (Permissions are already enforced
  // above; getParts is scoped to companyId, so there is no per-row auth to await.)
  const parts = getParts(client, companyId, {
    search,
    supplierId,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    parts,
    tags: tags.data ?? []
  };
}

export default function PartsSearchRoute() {
  const { parts, tags } = useLoaderData<typeof loader>();

  useRealtime("part");

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={parts}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load parts.</Trans>
            </div>
          }
        >
          {(parts) => (
            <PartsTable
              data={parts.data ?? []}
              count={parts.count ?? 0}
              tags={tags}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
