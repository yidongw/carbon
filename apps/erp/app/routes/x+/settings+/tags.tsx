import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { getTags } from "~/modules/shared";
import { TagsTable } from "~/modules/settings/ui/Tags";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Tags`,
  to: path.to.tags
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {});

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const tags = await getTags(client, companyId, {
    limit,
    offset,
    sorts,
    search,
    filters
  });

  if (tags.error) {
    throw redirect(
      path.to.settings,
      await flash(request, error(tags.error, "Error loading tags"))
    );
  }

  return {
    tags: tags.data ?? [],
    count: tags.count ?? 0
  };
}

export async function action({ request }: ActionFunctionArgs) {
  // Applies a record's tag selection (called by the inline <Tags> field across
  // the app). Distinct from the management page above, which is GET-only.
  const { client, userId } = await requirePermissions(request, {});

  const formData = await request.formData();
  const ids = formData.getAll("ids");
  const table = formData.get("table");
  const value = formData.getAll("value");

  const result = await client
    // @ts-expect-error
    .from(table as string)
    .update({
      tags: value,
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    })
    .in(getIdField(table as string), ids as string[]);

  if (result.error) {
    console.error(result.error);
  }

  return result;
}

function getIdField(table: string) {
  switch (table) {
    case "part":
    case "tool":
    case "material":
    case "consumable":
    case "service":
    case "fixture":
    case "job":
    case "jobOperation":
    case "methodOperation":
    case "quoteOperation":
    default:
      return "id";
  }
}

export default function TagsRoute() {
  const { tags, count } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <TagsTable data={tags} count={count ?? 0} />
      <Outlet />
    </VStack>
  );
}
