import { requirePermissions } from "@carbon/auth/auth.server";
import { generateQRCode } from "@carbon/documents/qr";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { getBundleTicketLabels } from "~/modules/production";

// Label data (+ QR as a PNG data URL) for direct Bluetooth printing. The client
// draws each label to a canvas and streams it as a TSPL bitmap to the BLE
// printer, so we hand it the same fields the PDF/HTML routes use plus a ready
// QR image (avoids a client-side QR dependency).
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

  const labels = await getBundleTicketLabels(client, companyId, ids);
  const withQr = await Promise.all(
    labels.map(async (l) => ({
      ...l,
      qrDataUrl: await generateQRCode(l.bundleUrl, 36)
    }))
  );

  return data({ labels: withQr }, { headers: { "Cache-Control": "no-store" } });
}
