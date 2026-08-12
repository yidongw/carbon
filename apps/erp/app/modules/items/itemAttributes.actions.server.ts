import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import {
  parseAttributeValueSelectionsFromFormData,
  syncItemVariantsFromSelections,
  validateAttributeSelectionForCreate
} from "./itemAttribute.service";

type Db = SupabaseClient<Database>;

/**
 * Shared action for every `<itemType>+/$itemId.attributes.tsx` route: reads the
 * set + values from the form and syncs variant SKUs, redirecting back to the
 * item. All item types behave identically here, so they differ only by the
 * detail path they return to.
 */
export async function itemAttributesAction(
  { request, params }: ActionFunctionArgs,
  itemPath: (id: string) => string
) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const formData = await request.formData();
  const attributeSetId = String(formData.get("attributeSetId") ?? "").trim();
  if (!attributeSetId) {
    throw redirect(
      itemPath(itemId),
      await flash(request, error(null, "Attribute set is required"))
    );
  }

  const selections = parseAttributeValueSelectionsFromFormData(formData);
  const sync = await syncItemVariantsFromSelections(client, {
    itemId,
    companyId,
    userId,
    attributeSetId,
    selections
  });

  if (sync.error) {
    return data(
      { success: false },
      await flash(request, error(sync.error, "Failed to update attributes"))
    );
  }

  throw redirect(
    itemPath(itemId),
    await flash(request, success("Updated attributes"))
  );
}

/**
 * Parse + validate the create form's attribute selection. The attribute set is
 * optional, but if one is chosen every attribute of it must have a value (see
 * validateAttributeSelectionForCreate). Returns the parsed selection plus the
 * first field error, if any, so the caller can surface it as a `validationError`
 * with its own repopulate data.
 */
export async function parseAndValidateItemAttributesForCreate(
  client: Db,
  args: { formData: FormData; itemType: string; companyId: string }
): Promise<{
  attributeSetId: string;
  selections: Record<string, string[]>;
  attributeError: { field: string; message: string } | null;
}> {
  const attributeSetId = String(args.formData.get("attributeSetId") ?? "");
  const selections = parseAttributeValueSelectionsFromFormData(args.formData);
  const attributeError = await validateAttributeSelectionForCreate(client, {
    itemType: args.itemType,
    companyId: args.companyId,
    attributeSetId,
    selections
  });
  return { attributeSetId, selections, attributeError };
}

/**
 * Generate variant SKUs for a freshly created item from its attribute selection,
 * rolling the item back if the sync fails so nothing partial is ever persisted.
 * No-op when no set was chosen (the set is optional). The caller shapes the
 * error response (modal vs. redirect).
 */
export async function syncItemAttributesOnCreate(
  client: Db,
  args: {
    itemId: string;
    companyId: string;
    userId: string;
    attributeSetId: string;
    selections: Record<string, string[]>;
  }
): Promise<{ error: Error | null }> {
  if (!args.attributeSetId) return { error: null };

  const sync = await syncItemVariantsFromSelections(client, {
    itemId: args.itemId,
    companyId: args.companyId,
    userId: args.userId,
    attributeSetId: args.attributeSetId,
    selections: args.selections,
    isCreate: true
  });

  if (sync.error) {
    await (client as any)
      .from("item")
      .delete()
      .eq("id", args.itemId)
      .eq("companyId", args.companyId);
    return { error: sync.error };
  }

  return { error: null };
}
