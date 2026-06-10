import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { getItemPostingGroupsList, getParts } from "~/modules/items";
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

  const [parts, tags, itemPostingGroups] = await Promise.all([
    getParts(client, companyId, {
      search,
      supplierId,
      limit,
      offset,
      sorts,
      filters
    }),
    getTagsList(client, companyId, "part"),
    getItemPostingGroupsList(client, companyId)
  ]);

  if (parts.error) {
    redirect(
      path.to.authenticatedRoot,
      await flash(request, error(parts.error, "Failed to fetch parts"))
    );
  }

  return {
    count: parts.count ?? 0,
    parts: parts.data ?? [],
    tags: tags.data ?? [],
    itemPostingGroups: itemPostingGroups.data ?? []
  };
}

export default function PartsSearchRoute() {
  const { count, parts, tags, itemPostingGroups } =
    useLoaderData<typeof loader>();

  useRealtime("part");

  return (
    <VStack spacing={0} className="h-full">
      <PartsTable
        data={parts}
        count={count}
        tags={tags}
        itemPostingGroups={itemPostingGroups}
      />
      <Outlet />
    </VStack>
  );
}
