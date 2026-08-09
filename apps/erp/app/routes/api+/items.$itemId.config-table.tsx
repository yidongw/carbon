import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import {
  getAttributeValueNames,
  getQuantityGridParameters
} from "~/modules/items";
import type { ConfigurationParameter } from "~/modules/items/types";
import {
  getConfigReferenceSourceForOperation,
  getReportedConfigurationById,
  resolveJobIdForOperation
} from "~/modules/production/configTableOverlay.server";
import type { ConfigReferenceSource } from "~/modules/production/variantsQuantityTableColumns";
import { buildAttributeValueNames } from "~/modules/shared/styleConfigDisplay";

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
  /**
   * Saved configuration for a single reported row, fetched by `recordId` only
   * for the deep-link case. In-app the overlay receives this via props instead,
   * so this stays `null` for the common path.
   */
  configuration: unknown;
  /** Color code -> color name, so the config table can show names not codes. */
  attributeValueNames: Record<string, string>;
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

  const { parameters } = await getQuantityGridParameters(
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

  // Map attribute-value code -> name so the config table displays names, not
  // codes (all attributes, not just Color).
  const attributeValueNameRows = await getAttributeValueNames(
    client,
    companyId
  );
  const attributeValueNames = buildAttributeValueNames(
    attributeValueNameRows.data ?? []
  );

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

  // Deep-link fallback: rebuild a read-only view's saved config from its id.
  const recordId = url.searchParams.get("recordId") ?? undefined;
  const configuration = recordId
    ? await getReportedConfigurationById(client, {
        recordId,
        reportKind,
        companyId
      })
    : null;

  return {
    parameters,
    itemReadableId: item.data?.readableIdWithRevision ?? null,
    referenceSource,
    configuration,
    attributeValueNames
  };
}
