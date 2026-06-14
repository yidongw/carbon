import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { getConfigurationParameters } from "~/modules/items";
import type { ConfigurationParameter } from "~/modules/items/types";
import { parseInitialConfigurationFromRequest } from "~/modules/production/configTableOverlay.server";

export type ItemConfigTableOverlayLoaderData = {
  parameters: ConfigurationParameter[];
  initialRows?: Record<string, string | number | boolean>[];
  itemReadableId: string | null;
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

  return {
    parameters,
    initialRows: parseInitialConfigurationFromRequest(request),
    itemReadableId: item.data?.readableIdWithRevision ?? null
  };
}
