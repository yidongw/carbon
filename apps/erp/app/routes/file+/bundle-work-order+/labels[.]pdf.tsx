import { requirePermissions } from "@carbon/auth/auth.server";
import { renderBundleTicketsToBuffer } from "@carbon/documents/pdf";
import type { LoaderFunctionArgs } from "react-router";
import { getBundleTicketLabels } from "~/modules/production";
import { getCompany } from "~/modules/settings";

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

  const [company, labels] = await Promise.all([
    getCompany(client, companyId),
    getBundleTicketLabels(client, companyId, ids)
  ]);

  if (labels.length === 0) {
    return new Response("No valid bundle work orders found", { status: 404 });
  }

  const body = await renderBundleTicketsToBuffer(labels);

  const companyName = company.data?.name ?? "Carbon";
  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="${companyName} - Bundle Tickets.pdf"`
  });

  return new Response(new Uint8Array(body), { status: 200, headers });
}
