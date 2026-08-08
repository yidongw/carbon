import { assertIsPost } from "@carbon/auth";
import { validator } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";

import { accountLanguageValidator } from "~/modules/account";
import { setLocale } from "~/services/locale.server";

/**
 * Public endpoint to set the UI language cookie (same cookie as profile).
 * Used on the login page before the user is authenticated.
 */
export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const validation = await validator(accountLanguageValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return data({ ok: false }, { status: 400 });
  }

  const localeCookies = setLocale(validation.data.locale, request);
  return data(
    { ok: true },
    {
      headers: localeCookies.map(
        (value) => ["Set-Cookie", value] as [string, string]
      )
    }
  );
}
