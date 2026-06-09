import { requirePermissions } from "@carbon/auth/auth.server";
import { msg } from "@lingui/core/macro";
import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from "react-router";
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

const layoutCache = new Map<
  string,
  { data: Awaited<ReturnType<typeof loader>>; ts: number }
>();

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const key = "part_layout";
  const hit = layoutCache.get(key);
  if (hit && Date.now() - hit.ts < 5 * 60_000) {
    serverLoader<typeof loader>().then((d) =>
      layoutCache.set(key, { data: d, ts: Date.now() })
    );
    return hit.data;
  }
  const data = await serverLoader<typeof loader>();
  layoutCache.set(key, { data, ts: Date.now() });
  return data;
}
clientLoader.hydrate = true;

export default function PartRoute() {
  return <Outlet />;
}
