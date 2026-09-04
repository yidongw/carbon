import { requirePermissions } from "@carbon/auth/auth.server";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { PanelProvider, ResizablePanels } from "~/components/Layout";
import {
  getJob,
  getMasterCuttingOperationId,
  getMasterWorkOrder,
  getTrackedEntitiesByJobId
} from "~/modules/production";
import { JobProperties } from "~/modules/production/ui/Jobs";
import MasterWorkOrderHeader from "~/modules/production/ui/MasterWorkOrders/MasterWorkOrderHeader";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Master Work Orders`,
  to: path.to.masterWorkOrders,
  module: "production"
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { masterWorkOrderId } = params;
  if (!masterWorkOrderId) throw new Error("Could not find masterWorkOrderId");

  const masterWorkOrder = await getMasterWorkOrder(
    client,
    masterWorkOrderId,
    companyId
  );
  if (masterWorkOrder.error || !masterWorkOrder.data) {
    throw redirect(path.to.masterWorkOrders);
  }

  const jobId = masterWorkOrder.data.jobId ?? "";
  const [cuttingOperationId, job, tags] = await Promise.all([
    jobId ? getMasterCuttingOperationId(client, jobId, companyId) : null,
    jobId ? getJob(client, jobId) : null,
    getTagsList(client, companyId, "job")
  ]);

  return {
    masterWorkOrder: masterWorkOrder.data,
    jobId,
    cuttingOperationId,
    // Shape the backing job as the job route's data so JobProperties can render.
    job: job?.data ?? null,
    tags: tags.data ?? [],
    trackedEntities: jobId
      ? getTrackedEntitiesByJobId(client, jobId)
      : undefined
  };
}

export default function MasterWorkOrderLayoutRoute() {
  const { masterWorkOrder, jobId, job, tags, trackedEntities } =
    useLoaderData<typeof loader>();
  const remarks = masterWorkOrder.remarks?.trim()
    ? masterWorkOrder.remarks
    : "";

  return (
    <PanelProvider>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <MasterWorkOrderHeader />
        <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
          <div className="flex flex-1 min-h-0 h-full overflow-hidden">
            <ResizablePanels
              content={<Outlet />}
              properties={
                job ? (
                  <JobProperties
                    jobId={jobId}
                    validItemTypes={["Part", "Tool", "Style"]}
                    readOnlyItem
                    extraProperties={
                      remarks ? (
                        <div className="flex flex-col gap-0.5 w-full">
                          <span className="text-xs text-muted-foreground">
                            <Trans>Remarks</Trans>
                          </span>
                          <span className="text-sm font-medium whitespace-pre-wrap">
                            {remarks}
                          </span>
                        </div>
                      ) : undefined
                    }
                    routeData={{
                      // biome-ignore lint/suspicious/noExplicitAny: job view -> Job
                      job: job as any,
                      tags,
                      // biome-ignore lint/suspicious/noExplicitAny: deferred
                      trackedEntities: trackedEntities as any
                    }}
                  />
                ) : null
              }
            />
          </div>
        </div>
      </div>
    </PanelProvider>
  );
}
