import { requirePermissions } from "@carbon/auth/auth.server";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Outlet } from "react-router";
import { getUnitOfMeasuresList } from "~/modules/items";
import { getLocationsList } from "~/modules/resources";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Part" }];
};

export const handle: Handle = {
  breadcrumb: msg`Items`,
  to: path.to.items,
  module: "items"
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts"
  });

  const [locations, unitOfMeasures] = await Promise.all([
    getLocationsList(client, companyId).then((r) => r?.data ?? []),
    getUnitOfMeasuresList(client, companyId).then((r) => r?.data ?? [])
  ]);

  return { locations, unitOfMeasures };
}

export default function PartRoute() {
  return <Outlet />;
}
