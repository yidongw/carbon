import { requirePermissions } from "@carbon/auth/auth.server";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { deleteTemplateMethodOperationTool } from "~/modules/items";

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "parts"
  });

  const { id } = params;
  if (!id) {
    return data(
      { error: "Tool ID is required" },
      {
        status: 400
      }
    );
  }

  const { error } = await deleteTemplateMethodOperationTool(client, id);

  if (error) {
    return data(
      { success: false, error: error.message },
      {
        status: 400
      }
    );
  }

  return { success: true };
}
