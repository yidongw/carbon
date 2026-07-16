import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import {
  getMasterProcessBreakdown,
  getMasterWorkOrder,
  type MasterProcess
} from "~/modules/production";

export type MasterWorkOrderProcessesOverlayLoaderData = {
  processes: MasterProcess[];
  masterDisplayId: string | null;
};

export async function loader({
  request,
  params
}: LoaderFunctionArgs): Promise<MasterWorkOrderProcessesOverlayLoaderData | null> {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { masterWorkOrderId } = params;
  if (!masterWorkOrderId) return null;

  const [master, processes] = await Promise.all([
    getMasterWorkOrder(client, masterWorkOrderId, companyId),
    getMasterProcessBreakdown(client, masterWorkOrderId, companyId)
  ]);

  return {
    processes,
    masterDisplayId: master.data?.jobReadableId ?? null
  };
}
