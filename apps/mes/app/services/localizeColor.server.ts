import { resolveLanguage } from "@carbon/locale";
import { setupI18n } from "@lingui/core";
import { STANDARD_COLOR_MESSAGES } from "~/utils/standardColorMessages";
import { loadLinguiCatalogForRequest } from "./lingui.server";

/**
 * Server-side counterpart to useLocalizeColor: translate a standard color code
 * via the MES lingui catalog for the request locale. Custom names pass through.
 *
 * Uses a request-local i18n instance (never the global singleton) loaded from
 * the compiled mes.mjs catalog — same hashed message IDs as `msg\`Red\`` /
 * `t\`Red\`` in client code.
 */
export async function localizeColorForLocale(
  color: string | null | undefined,
  locale: string | null | undefined,
  request?: Request
): Promise<string | null | undefined> {
  if (!color) return color;
  const code = color.trim().toUpperCase();
  const descriptor = STANDARD_COLOR_MESSAGES[code];
  if (!descriptor) return color;

  const language = resolveLanguage(locale);
  const catalog = await loadLinguiCatalogForRequest(
    request ?? new Request("http://localhost"),
    language
  );
  const i18n = setupI18n();
  i18n.load(language, catalog);
  i18n.activate(language);
  return i18n._(descriptor);
}
