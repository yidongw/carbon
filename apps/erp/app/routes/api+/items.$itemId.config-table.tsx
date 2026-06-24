import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { getConfigurationParameters } from "~/modules/items";
import type { ConfigurationParameter } from "~/modules/items/types";
import type { ConfigReferenceSource } from "~/modules/production/configParamsTableColumns";
import {
  getConfigReferenceSourceForOperation,
  resolveJobIdForOperation
} from "~/modules/production/configTableOverlay.server";

export type ItemConfigTableOverlayLoaderData = {
  parameters: ConfigurationParameter[];
  itemReadableId: string | null;
  /**
   * DB-resolved reference source for the selected operation (pickups / reported
   * configs) used to compute click-to-fill hints. The client builds the actual
   * reference context + editor rows from this + its in-memory inputs — only ids
   * are sent here, never the draft configuration or sibling configs.
   */
  referenceSource: ConfigReferenceSource | null;
};

export async function loader({
  request,
  params
}: LoaderFunctionArgs): Promise<ItemConfigTableOverlayLoaderData | null> {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    bypassRls: true
  });

  const { itemId } = params;
  if (!itemId) return null;

  const { parameters } = await getConfigurationParameters(
    client,
    itemId,
    companyId
  );
  if (parameters.length === 0) return null;

  const item = await client
    .from("item")
    .select("readableIdWithRevision")
    .eq("id", itemId)
    .eq("companyId", companyId)
    .maybeSingle();

  const url = new URL(request.url);
  const jobOperationId = url.searchParams.get("jobOperationId") ?? undefined;
  const reportKind =
    url.searchParams.get("reportKind") === "pickup"
      ? "pickup"
      : "productionQuantity";

  // Resolve the job from the operation when the caller didn't pass jobId.
  const jobId = jobOperationId
    ? await resolveJobIdForOperation(
        client,
        companyId,
        jobOperationId,
        url.searchParams.get("jobId") ?? undefined
      )
    : undefined;

  const referenceSource =
    jobId && jobOperationId
      ? await getConfigReferenceSourceForOperation(client, {
          jobId,
          jobOperationId,
          companyId,
          reportKind
        })
      : null;

  return {
    parameters,
    itemReadableId: item.data?.readableIdWithRevision ?? null,
    referenceSource
  };
}
