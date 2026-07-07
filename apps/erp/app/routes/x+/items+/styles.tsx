import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { getItemPostingGroupsList, getStyles } from "~/modules/items";
import { StylesTable } from "~/modules/items/ui/Styles";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { useRealtime } from "../../../hooks";

export const handle: Handle = {
  breadcrumb: msg`Styles`,
  to: path.to.styles
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [styles, tags, itemPostingGroups] = await Promise.all([
    getStyles(client, companyId, {
      search,
      limit,
      offset,
      sorts,
      filters
    }),
    getTagsList(client, companyId, "style"),
    getItemPostingGroupsList(client, companyId)
  ]);

  if (styles.error) {
    redirect(
      path.to.authenticatedRoot,
      await flash(request, error(styles.error, "Failed to fetch styles"))
    );
  }

  return {
    count: styles.count ?? 0,
    styles: styles.data ?? [],
    tags: tags.data ?? [],
    itemPostingGroups: itemPostingGroups.data ?? []
  };
}

export default function StylesSearchRoute() {
  const { count, styles, tags, itemPostingGroups } =
    useLoaderData<typeof loader>();

  useRealtime("style");

  return (
    <VStack spacing={0} className="h-full">
      <StylesTable
        data={styles}
        count={count}
        tags={tags}
        itemPostingGroups={itemPostingGroups}
      />
      <Outlet />
    </VStack>
  );
}
