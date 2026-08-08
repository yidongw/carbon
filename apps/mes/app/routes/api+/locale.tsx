import { assertIsPost } from "@carbon/auth";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { setLocale } from "~/services/locale.server";

/** Set the UI language cookie (mirrors the ERP /api/locale endpoint). */
export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const formData = await request.formData();
  const locale = String(formData.get("locale") ?? "");

  if (!locale) {
    return data({ ok: false }, { status: 400 });
  }

  const localeCookies = setLocale(locale, request);
  return data(
    { ok: true },
    {
      headers: localeCookies.map(
        (value) => ["Set-Cookie", value] as [string, string]
      )
    }
  );
}
