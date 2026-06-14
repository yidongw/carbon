import { assertIsPost, notFound } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import type { ActionFunctionArgs } from "react-router";
import { deleteTemplateConfigurationRule } from "~/modules/items";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    delete: "parts"
  });

  const { templateId, field } = params;
  if (!templateId) throw new Error("Could not find templateId");
  if (!field) throw notFound("field not found");

  const remove = await deleteTemplateConfigurationRule(
    client,
    field,
    templateId
  );

  if (remove.error) {
    return {
      success: false,
      error: "Failed to delete configuration rule"
    };
  }

  return {
    success: true
  };
}
