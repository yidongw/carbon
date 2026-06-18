import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { InviteLinksTable } from "~/modules/users";
import { getInviteLinks } from "~/modules/users/invite-links.service";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Invite Links`,
  to: path.to.peopleInviteLinks
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "users",
    role: "employee",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const inviteLinks = await getInviteLinks(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  if (inviteLinks.error) {
    throw redirect(
      path.to.people,
      await flash(request, error(inviteLinks.error, "Failed to load invite links"))
    );
  }

  return {
    inviteLinks: inviteLinks.data ?? [],
    count: inviteLinks.count ?? 0
  };
}

export default function Route() {
  const { inviteLinks, count } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <InviteLinksTable data={inviteLinks} count={count} />
      <Outlet />
    </VStack>
  );
}
