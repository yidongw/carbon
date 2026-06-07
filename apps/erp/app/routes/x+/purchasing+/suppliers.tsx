import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getSuppliers } from "~/modules/purchasing";
import { SuppliersTable } from "~/modules/purchasing/ui/Supplier";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Suppliers`,
  to: path.to.suppliers
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "purchasing",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  // Tags are small/cheap — keep them blocking so filters render immediately.
  const tags = await getTagsList(client, companyId, "supplier");

  // Defer the heavy suppliers query: the page navigates instantly and renders
  // a table skeleton while the rows stream in.
  const suppliers = getSuppliers(client, companyId, {
    search,
    type,
    status,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    suppliers,
    tags: tags.data ?? []
  };
}

export default function PurchasingSuppliersRoute() {
  const { suppliers, tags } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={suppliers}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load suppliers.</Trans>
            </div>
          }
        >
          {(suppliers) => (
            <SuppliersTable
              data={suppliers.data ?? []}
              count={suppliers.count ?? 0}
              tags={tags}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
