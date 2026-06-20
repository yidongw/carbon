import { assertIsPost } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { validator } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import {
  templateConfigurationParameterValidator,
  upsertTemplateConfigurationParameter
} from "~/modules/items";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { templateId } = params;
  if (!templateId) throw new Error("Could not find templateId");

  const formData = await request.formData();
  const validation = await validator(
    templateConfigurationParameterValidator
  ).validate(formData);

  if (validation.error) {
    return {
      success: false,
      error: "Invalid form data"
    };
  }

  const { listOptions, ...d } = validation.data;

  const upsert = await upsertTemplateConfigurationParameter(client, {
    ...d,
    listOptions: d.dataType === "list" ? listOptions : undefined,
    companyId,
    userId
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
