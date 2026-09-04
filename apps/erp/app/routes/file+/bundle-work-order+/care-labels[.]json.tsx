import { requirePermissions } from "@carbon/auth/auth.server";
import { generateQRCode } from "@carbon/documents/qr";
import { resolveLanguage } from "@carbon/locale";
import { getPreferenceHeaders } from "@carbon/utils";
import { setupI18n } from "@lingui/core";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { translateItemAttributeCatalogName } from "~/modules/items/itemAttributeDisplayName";
import {
  getBundleTicketLabels,
  getGarmentRfidCodes
} from "~/modules/production";
import { loadLinguiCatalogForRequest } from "~/services/lingui.server";
import type { CareLabelData } from "~/utils/labelBitmap";

// Per-piece care-label (水洗唛) data for direct Bluetooth printing: one label per
// garment piece, carrying its unique RFID code (QR + text). The bundle's
// 款号/颜色/尺码 are shared across every piece; the code/sequence are per-piece.
// The client draws each label to a canvas and streams it as a TSPL bitmap.
export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production"
  });

  const url = new URL(request.url);
  const bundleWorkOrderId = url.searchParams.get("bundleWorkOrderId");
  if (!bundleWorkOrderId) return data({ labels: [] as CareLabelData[] });

  // Localize printed attribute names/values into the reader's language.
  const { locale } = getPreferenceHeaders(request);
  const language = resolveLanguage(locale);
  const catalog = await loadLinguiCatalogForRequest(request, locale);
  const i18n = setupI18n();
  i18n.load(language, catalog);
  i18n.activate(language);

  // Bundle-level style + attributes (shared by every piece), then the per-piece
  // RFID codes minted for this bundle.
  const [ticketLabels, rfidCodes] = await Promise.all([
    getBundleTicketLabels(client, companyId, [bundleWorkOrderId], {
      locale,
      translateAttributeName: (name) =>
        translateItemAttributeCatalogName(name, i18n)
    }),
    getGarmentRfidCodes(client, bundleWorkOrderId, companyId)
  ]);

  const bundle = ticketLabels[0];
  const styleReadableId = bundle?.styleReadableId ?? null;
  const attributeLines = bundle?.attributeLines ?? [];

  const labels: CareLabelData[] = await Promise.all(
    (rfidCodes.data ?? []).map(async (row) => ({
      code: row.code,
      sequence: row.sequence,
      styleReadableId,
      attributeLines,
      qrDataUrl: await generateQRCode(row.code, 36)
    }))
  );

  return data({ labels }, { headers: { "Cache-Control": "no-store" } });
}
