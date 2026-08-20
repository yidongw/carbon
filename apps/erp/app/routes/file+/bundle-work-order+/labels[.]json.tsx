import { requirePermissions } from "@carbon/auth/auth.server";
import { generateQRCode } from "@carbon/documents/qr";
import { resolveLanguage } from "@carbon/locale";
import { getPreferenceHeaders } from "@carbon/utils";
import { setupI18n } from "@lingui/core";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { translateItemAttributeCatalogName } from "~/modules/items/itemAttributeDisplayName";
import { getBundleTicketLabels } from "~/modules/production";
import { loadLinguiCatalogForRequest } from "~/services/lingui.server";

// Label data (+ QR as a PNG data URL) for direct Bluetooth printing. The client
// draws each label to a canvas and streams it as a TSPL bitmap to the BLE
// printer. Mirrors the PDF route's attribute localization so color/size print
// in the reader's language (颜色: 黑色, 尺码: XL) — those live in attributeLines,
// not on colorName/sizeCode.
export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production"
  });

  const url = new URL(request.url);
  const idsParam = url.searchParams.get("ids");
  if (!idsParam) return data({ labels: [] });

  const ids = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (ids.length === 0) return data({ labels: [] });

  // Localize printed attribute names/values into the reader's language.
  const { locale } = getPreferenceHeaders(request);
  const language = resolveLanguage(locale);
  const catalog = await loadLinguiCatalogForRequest(request, locale);
  const i18n = setupI18n();
  i18n.load(language, catalog);
  i18n.activate(language);

  const labels = await getBundleTicketLabels(client, companyId, ids, {
    locale,
    translateAttributeName: (name) =>
      translateItemAttributeCatalogName(name, i18n)
  });

  const withQr = await Promise.all(
    labels.map(async (l) => ({
      ...l,
      qrDataUrl: await generateQRCode(l.bundleUrl, 36)
    }))
  );

  return data({ labels: withQr }, { headers: { "Cache-Control": "no-store" } });
}
