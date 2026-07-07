import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { getStyleColors } from "~/modules/items";
import { StyleColorsTable } from "~/modules/items/ui/StyleColors";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Colors`,
  to: path.to.styleColors
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const styleColors = await getStyleColors(client, companyId, {
    limit,
    offset,
    sorts,
    search,
    filters
  });

  if (styleColors.error) {
    console.error(styleColors.error);
    throw redirect(
      path.to.items,
      await flash(request, error(null, "Error loading style colors"))
    );
  }

  return {
    styleColors: styleColors.data ?? [],
    count: styleColors.count ?? 0
  };
}

export default function StyleColorsRoute() {
  const { styleColors, count } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <StyleColorsTable data={styleColors} count={count} />
      <Outlet />
    </VStack>
  );
}
