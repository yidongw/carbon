import { requirePermissions } from "@carbon/auth/auth.server";
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

// Per-piece care-label (水洗唛) checklist + print metadata. Barcodes are NOT
// pre-rendered here — a 1000+ piece bundle would time out / OOM shipping PNG
// data URLs. The client draws Code128 from `code` at print time.
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

  const labels: CareLabelData[] = (rfidCodes.data ?? []).map((row) => ({
    code: row.code,
    sequence: row.sequence,
    styleReadableId,
    attributeLines
  }));

  return data({ labels }, { headers: { "Cache-Control": "no-store" } });
}
