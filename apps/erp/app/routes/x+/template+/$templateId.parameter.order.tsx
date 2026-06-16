import { assertIsPost } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { validator } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import {
  configurationParameterOrderValidator,
  updateTemplateConfigurationParameterOrder
} from "~/modules/items";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { templateId } = params;
  if (!templateId) throw new Error("Could not find templateId");

  const formData = await request.formData();
  const validation = await validator(
    configurationParameterOrderValidator
  ).validate(formData);

  if (validation.error) {
    console.error(validation.error);
    return {
      success: false,
      error: "Invalid form data"
    };
  }

  let groupId =
    validation.data.configurationParameterGroupId == "null"
      ? null
      : (validation.data.configurationParameterGroupId ?? null);

  if (groupId === null) {
    const { data: ungrouped } = await client
      .from("templateConfigurationParameterGroup")
      .select("id")
      .eq("templateId", templateId)
      .eq("isUngrouped", true)
      .maybeSingle();
    groupId = ungrouped?.id ?? null;
  }

  const upsert = await updateTemplateConfigurationParameterOrder(client, {
    ...validation.data,
    configurationParameterGroupId: groupId,
    updatedBy: userId
  });

  if (upsert.error) {
    console.error(upsert.error);
    return {
      success: false,
      error: upsert.error.message
    };
  }

  return {
    success: true
  };
}
