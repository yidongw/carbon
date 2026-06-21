import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { getConfigurationParameters } from "~/modules/items";
import type { ConfigurationParameter } from "~/modules/items/types";
import { buildConfigTableEditorState } from "~/modules/production/configParamsTableColumns";
import {
  parseInitialConfigurationFromRequest,
  parseReferenceContextFromRequest
} from "~/modules/production/configTableOverlay.server";

export type ItemConfigTableOverlayLoaderData = {
  parameters: ConfigurationParameter[];
  initialRows?: Record<string, string | number | boolean>[];
  referenceByRowIndex?: Array<Record<string, number>>;
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

  const referenceContext = parseReferenceContextFromRequest(request);
  console.log('[SERVER CONFIG TABLE] Parsed referenceContext:', {
    hasContext: !!referenceContext,
    employeeId: referenceContext?.employeeId,
    hasPickupsByEmployee: !!referenceContext?.pickupsByEmployee,
    pickupsCount: referenceContext?.pickupsByEmployee ? Object.keys(referenceContext.pickupsByEmployee).length : 0,
    mode: referenceContext?.mode
  });
  const initialRowsFromRequest = parseInitialConfigurationFromRequest(request);
  const currentConfiguration =
    initialRowsFromRequest !== undefined
      ? { configTable: initialRowsFromRequest }
      : undefined;

  let initialRows = initialRowsFromRequest;
  let referenceByRowIndex: Array<Record<string, number>> | undefined;

  if (referenceContext) {
    const editorState = buildConfigTableEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentConfiguration,
      referenceContext
    });
    initialRows = editorState.rows;
    referenceByRowIndex = editorState.referenceByRowIndex;
  }

  const debugInfo = referenceContext ? `EmpID=${referenceContext.employeeId || 'NONE'} Pickups=${referenceContext.pickupsByEmployee ? Object.keys(referenceContext.pickupsByEmployee).length : 0}` : 'NO-REF-CTX';

  return {
    parameters,
    initialRows,
    referenceByRowIndex,
    itemReadableId: `${debugInfo} | ${item.data?.readableIdWithRevision ?? 'Item'}`
  };
}
