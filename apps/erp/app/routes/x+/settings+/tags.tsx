import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, Outlet, redirect, useLoaderData } from "react-router";
import { TagsTable } from "~/modules/settings/ui/Tags";
import { getTags } from "~/modules/shared";
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
  const ids = formData.getAll("ids") as string[];
  const table = formData.get("table") as string;
  const value = formData.getAll("value");

  // Every taggable table stores its tags on a row matched by its own `id` PK.
  // The caller (<TagsCell tagKey=...>) is responsible for sending the value that
  // matches that PK — readableId for item extension tables, id for everything
  // else — since the list view's `id` differs from the write PK for item tables.
  const result = await client
    // @ts-expect-error - `table` is a dynamic, caller-supplied table name
    .from(table)
    .update(
      {
        tags: value,
        updatedBy: userId,
        updatedAt: new Date().toISOString()
      },
      // Ask PostgREST for the affected-row count instead of `.select()`ing the
      // rows — selecting across a dynamic table name blows up type inference,
      // and count is all we need to detect a no-op write.
      { count: "exact" }
    )
    .in("id", ids);

  // A 0-row update means the submitted id matched no row in `table` — almost
  // always a wrong `tagKey` at the call site. Treat it like an error instead of
  // silently dropping the write (the failure mode that hid the styles tags bug).
  if (result.error || !result.count) {
    console.error("Failed to update tags", { table, ids, error: result.error });
    return data(
      { success: false },
      await flash(
        request,
        error(result.error ?? "no matching row", "Failed to update tags")
      )
    );
  }

  return data({ success: true });
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
