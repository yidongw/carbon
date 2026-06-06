import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getMaterials } from "~/modules/items";
import { MaterialsTable } from "~/modules/items/ui/Materials";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Materials`,
  to: path.to.materials
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
  const tags = await getTagsList(client, companyId, "material");

  // Defer the heavy materials query: the page navigates instantly and renders
  // a table skeleton while the rows stream in.
  const materials = getMaterials(client, companyId, {
    search,
    supplierId,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    materials,
    tags: tags.data ?? []
  };
}

export default function MaterialsSearchRoute() {
  const { materials, tags } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={materials}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load materials.</Trans>
            </div>
          }
        >
          {(materials) => (
            <MaterialsTable
              data={materials.data ?? []}
              count={materials.count ?? 0}
              tags={tags}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
