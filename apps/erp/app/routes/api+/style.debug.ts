import { requirePermissions } from "@carbon/auth/auth.server";
import { validator } from "@carbon/form";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { styleValidator } from "~/modules/items";
import { upsertStyle } from "~/modules/items/style.server";

function serializeError(error: unknown) {
  if (error && typeof error === "object") {
    return {
      type: error.constructor?.name ?? typeof error,
      keys: Object.keys(error),
      message: "message" in error ? error.message : undefined,
      detail: "detail" in error ? error.detail : undefined,
      code: "code" in error ? error.code : undefined
    };
  }

  return error;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const url = new URL(request.url);
  const validation = await validator(styleValidator).validate(
    Object.fromEntries(url.searchParams)
  );

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
    createdBy: userId
  });

  return data({
    ok: !result.error,
    data: result.data ?? null,
    error: serializeError(result.error)
  });
}
