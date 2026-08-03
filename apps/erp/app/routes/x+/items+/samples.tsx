import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { getStyleSamples } from "~/modules/items";
import { SamplesTable } from "~/modules/items/ui/Samples";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { useRealtime } from "../../../hooks";

export const handle: Handle = {
  breadcrumb: msg`Samples`,
  to: path.to.samples
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

  const samples = await getStyleSamples(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  if (samples.error) {
    redirect(
      path.to.authenticatedRoot,
      await flash(request, error(samples.error, "Failed to fetch samples"))
    );
  }

  return {
    count: samples.count ?? 0,
    samples: samples.data ?? []
  };
}

export default function SamplesSearchRoute() {
  const { count, samples } = useLoaderData<typeof loader>();

  useRealtime("style");

  return (
    <VStack spacing={0} className="h-full">
      <SamplesTable data={samples} count={count} />
      <Outlet />
    </VStack>
  );
}
