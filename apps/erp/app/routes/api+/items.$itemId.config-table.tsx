import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { getConfigurationParameters } from "~/modules/items";
import type { ConfigurationParameter } from "~/modules/items/types";
import type { ConfigTableReferenceContext } from "~/modules/production/configParamsTableColumns";
import {
  parseReferenceContextFromRequest,
  resolveConfigTableReferenceContext
} from "~/modules/production/configTableOverlay.server";

export type ItemConfigTableOverlayLoaderData = {
  parameters: ConfigurationParameter[];
  /**
   * Reference context resolved against the DB (from the `referenceContext`
   * query param). The draft `configuration` is NOT loaded here — it's parent
   * data passed to the overlay via props; the row/editor state is built
   * client-side in the overlay registry from `parameters` + this + that config.
   */
  referenceContext?: ConfigTableReferenceContext;
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

  const parsedReferenceContext = parseReferenceContextFromRequest(request);
  const referenceContext = parsedReferenceContext
    ? await resolveConfigTableReferenceContext(
        client,
        companyId,
        parsedReferenceContext
      )
    : undefined;

  return {
    parameters,
    referenceContext,
    itemReadableId: item.data?.readableIdWithRevision ?? null
  };
}
