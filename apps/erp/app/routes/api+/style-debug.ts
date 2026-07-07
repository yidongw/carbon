import { requirePermissions } from "@carbon/auth/auth.server";
import { validator } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { styleValidator } from "~/modules/items";
import { upsertStyle } from "~/modules/items/style.server";
import { setCustomFields } from "~/utils/form";

export async function action({ request }: ActionFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const formData = await request.formData();
  const validation = await validator(styleValidator).validate(formData);
  if (validation.error) {
    return data(
      {
        ok: false,
        kind: "validation",
        error: validation.error
      },
      { status: 400 }
    );
  }

  const result = await upsertStyle(client, {
    ...validation.data,
    companyId,
    customFields: setCustomFields(formData),
    createdBy: userId
  });

  const error =
    result.error && typeof result.error === "object"
      ? {
          type: result.error.constructor?.name ?? typeof result.error,
          keys: Object.keys(result.error),
          message: "message" in result.error ? result.error.message : undefined,
          detail: "detail" in result.error ? result.error.detail : undefined,
          code: "code" in result.error ? result.error.code : undefined
        }
      : result.error;

  return data({
    ok: !result.error,
    data: result.data ?? null,
    error
  });
}
