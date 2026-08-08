import { requirePermissions } from "@carbon/auth/auth.server";
import { localizeStyleColorNameByName } from "@carbon/database/style-reference";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { PanelProvider, ResizablePanels } from "~/components/Layout";
import { translateItemAttributeCatalogName } from "~/modules/items/itemAttributeDisplayName";
import {
  getBundleWorkOrder,
  getJob,
  getTrackedEntitiesByJobId
} from "~/modules/production";
import { JobProperties } from "~/modules/production/ui/Jobs";
import BundleWorkOrderHeader from "~/modules/production/ui/MasterWorkOrders/BundleWorkOrderHeader";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Bundle Work Orders`,
  to: path.to.bundleWorkOrders,
  module: "production"
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { bundleWorkOrderId } = params;
  if (!bundleWorkOrderId) throw new Error("Could not find bundleWorkOrderId");

  const bundleWorkOrder = await getBundleWorkOrder(
    client,
    bundleWorkOrderId,
    companyId
  );
  if (bundleWorkOrder.error || !bundleWorkOrder.data) {
    throw redirect(path.to.bundleWorkOrders);
  }

  const jobId = bundleWorkOrder.data.jobId ?? "";
  const [job, tags] = await Promise.all([
    jobId ? getJob(client, jobId) : null,
    getTagsList(client, companyId, "job")
  ]);

  return {
    bundleWorkOrder: bundleWorkOrder.data,
    jobId,
    job: job?.data ?? null,
    tags: tags.data ?? [],
    trackedEntities: jobId
      ? getTrackedEntitiesByJobId(client, jobId)
      : undefined
  };
}

function BundleField({
  label,
  value
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex flex-col gap-0.5 w-full">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

export default function BundleWorkOrderLayoutRoute() {
  const { bundleWorkOrder, jobId, job, tags, trackedEntities } =
    useLoaderData<typeof loader>();
  const { i18n } = useLingui();

  // The bundle's variant attributes (Color, Size, …) come from the generic
  // model now — one localized field per attribute, ordered Color-first/Size-last.
  const attributeValues =
    (bundleWorkOrder as { attributeValues?: Record<string, string> | null })
      .attributeValues ?? {};
  const attributeFields = Object.entries(attributeValues)
    .filter(([, value]) => value != null && String(value).length > 0)
    .sort(([a], [b]) => {
      const rank = (code: string) =>
        code === "Color" ? 0 : code === "Size" ? 1 : 2;
      const d = rank(a) - rank(b);
      return d !== 0 ? d : a.localeCompare(b);
    });

  return (
    <PanelProvider>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <BundleWorkOrderHeader />
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
                      attributeFields.length > 0 ? (
                        <>
                          {attributeFields.map(([code, value]) => (
                            <BundleField
                              key={code}
                              label={translateItemAttributeCatalogName(
                                code,
                                i18n
                              )}
                              value={
                                localizeStyleColorNameByName(
                                  String(value),
                                  i18n.locale
                                ) || String(value)
                              }
                            />
                          ))}
                        </>
                      ) : null
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
