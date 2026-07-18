import { requirePermissions } from "@carbon/auth/auth.server";
import { generateQRCodeBuffer } from "@carbon/documents/qr";
import { MES_URL } from "@carbon/env";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { getBundleWorkOrder } from "~/modules/production";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production"
  });

  const { id } = params;
  if (!id) throw new Error("Could not find bundle work order id");

  const bundle = await getBundleWorkOrder(client, id, companyId);
  if (bundle.error || !bundle.data) {
    return data({ error: "Not found" }, { status: 404 });
  }

  // The QR encodes the MES scan-landing URL, not the ERP origin.
  const bundleUrl = `${MES_URL ?? ""}/x/bundle/${id}`;
  const buffer = await generateQRCodeBuffer(bundleUrl, 36);

  // @ts-ignore
  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
