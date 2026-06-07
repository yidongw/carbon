import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getSuggestions, SuggestionsTable } from "~/modules/resources";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Suggestions`,
  to: path.to.suggestions
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const tags = await getTagsList(client, companyId, "suggestion");

  const suggestions = getSuggestions(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    suggestions,
    tags: tags.data ?? []
  };
}

export default function SuggestionsRoute() {
  const { suggestions, tags } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={suggestions}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load suggestions.</Trans>
            </div>
          }
        >
          {(suggestions) => (
            <SuggestionsTable
              data={suggestions.data ?? []}
              tags={tags}
              count={suggestions.count ?? 0}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
