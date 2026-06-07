import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getTools } from "~/modules/items";
import { ToolsTable } from "~/modules/items/ui/Tools";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Tools`,
  to: path.to.tools
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
  const tags = await getTagsList(client, companyId, "tool");

  // Defer the heavy tools query: the page navigates instantly and renders a
  // table skeleton while the rows stream in.
  const tools = getTools(client, companyId, {
    search,
    supplierId,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    tools,
    tags: tags.data ?? []
  };
}

export default function ToolsSearchRoute() {
  const { tools, tags } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={tools}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load tools.</Trans>
            </div>
          }
        >
          {(tools) => (
            <ToolsTable
              data={tools.data ?? []}
              count={tools.count ?? 0}
              tags={tags}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
