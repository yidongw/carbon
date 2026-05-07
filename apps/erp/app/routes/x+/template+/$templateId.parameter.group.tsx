import { assertIsPost } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { validator } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import {
  configurationParameterGroupValidator,
  upsertTemplateConfigurationParameterGroup
} from "~/modules/items";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId } = await requirePermissions(request, {
    update: "parts"
  });

  const { templateId } = params;
  if (!templateId) throw new Error("Could not find templateId");

  const formData = await request.formData();
  const validation = await validator(
    configurationParameterGroupValidator
  ).validate(formData);

  if (validation.error) {
    return {
      success: false,
      error: "Invalid form data"
    };
  }

  const upsert = await upsertTemplateConfigurationParameterGroup(client, {
    ...validation.data,
    templateId,
    companyId
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
