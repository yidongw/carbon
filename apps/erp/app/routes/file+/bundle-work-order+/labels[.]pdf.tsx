import { requirePermissions } from "@carbon/auth/auth.server";
import {
  renderBundleTicketsToBuffer,
  tagPageSizeFromInches
} from "@carbon/documents/pdf";
import { contentDisposition, labelSizes } from "@carbon/utils";
import type { LoaderFunctionArgs } from "react-router";
import { getBundleTicketLabels } from "~/modules/production";
import { getCompany } from "~/modules/settings";

const DEFAULT_TAG_ID = "bundleTag40x80mm";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production"
  });

  const url = new URL(request.url);
  const idsParam = url.searchParams.get("ids");
  if (!idsParam) {
    return new Response("No bundle work order IDs provided", { status: 400 });
  }

  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (ids.length === 0) {
    return new Response("No valid bundle work order IDs provided", {
      status: 400
    });
  }

  const size =
    labelSizes.find((s) => s.id === url.searchParams.get("labelSize")) ??
    labelSizes.find((s) => s.id === DEFAULT_TAG_ID);
  const pageSize = tagPageSizeFromInches(
    size?.width ?? 1.5748,
    size?.height ?? 3.1496
  );

  const [company, labels] = await Promise.all([
    getCompany(client, companyId),
    getBundleTicketLabels(client, companyId, ids)
  ]);

  if (labels.length === 0) {
    return new Response("No valid bundle work orders found", { status: 404 });
  }

  const showBorder = url.searchParams.get("border") === "1";
  const body = await renderBundleTicketsToBuffer(labels, pageSize, showBorder);

  const companyName = company.data?.name ?? "Carbon";
  const headers = new Headers({
    "Content-Type": "application/pdf",
    // Don't cache — the label layout/fonts change often during setup and a
    // stale cached PDF looks like "nothing changed" after a redeploy.
    "Cache-Control": "no-store, must-revalidate",
    "Content-Disposition": contentDisposition(
      `${companyName} - Bundle Tickets.pdf`
    )
  });

  return new Response(new Uint8Array(body), { status: 200, headers });
}
