import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { path } from "~/utils/path";

export async function loader({ params }: LoaderFunctionArgs) {
  const { masterWorkOrderId } = params;
  if (!masterWorkOrderId) throw new Error("Could not find masterWorkOrderId");
  throw redirect(path.to.masterWorkOrderBundleWorkOrders(masterWorkOrderId));
}
