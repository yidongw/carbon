import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import {
  renderBundleTicketsToBuffer,
  tagPageSizeFromInches
} from "@carbon/documents/pdf";
import { buildBundleTicketItem } from "@carbon/jobs";
import { localeCookieName } from "@carbon/locale";
import { labelSizes } from "@carbon/utils";
import * as cookie from "cookie";
import type { LoaderFunctionArgs } from "react-router";
import { localizeColorForLocale } from "~/services/localizeColor.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId } = await requirePermissions(request, {});
  const serviceRole = getCarbonServiceRole();

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

  // Only render tickets for bundles that belong to this company.
  const { data: allowed } = await serviceRole
    .from("bundleWorkOrders")
    .select("id")
    .eq("companyId", companyId)
    .in("id", ids);
  const allowedIds = new Set((allowed ?? []).map((b) => b.id));
  const safeIds = ids.filter((id) => allowedIds.has(id));

  const items = await Promise.all(
    safeIds.map((id) => buildBundleTicketItem(serviceRole, id))
  );
  const built = items.filter((i): i is NonNullable<typeof i> => Boolean(i));

  if (built.length === 0) {
    return new Response("No valid bundle work orders found", { status: 404 });
  }

  // Localize the color to the user's language for the printed tag.
  const locale =
    cookie.parse(request.headers.get("Cookie") ?? "")[localeCookieName] ??
    undefined;
  const labels = await Promise.all(
    built.map(async (label) => ({
      ...label,
      attributeLines: await Promise.all(
        (label.attributeLines ?? []).map(async (line) => ({
          ...line,
          value:
            line.name === "Color" || line.name === "颜色"
              ? ((await localizeColorForLocale(line.value, locale, request)) ??
                line.value)
              : line.value
        }))
      )
    }))
  );

  // Optional tag size (LabelSize dimensions are inches).
  const labelSizeId = url.searchParams.get("labelSize") ?? undefined;
  const size = labelSizeId
    ? labelSizes.find((s) => s.id === labelSizeId)
    : undefined;
  const pageSize = size
    ? tagPageSizeFromInches(size.width, size.height)
    : undefined;

  const body = await renderBundleTicketsToBuffer(labels, pageSize);

  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="Bundle Tickets.pdf"`
  });
  return new Response(new Uint8Array(body), { status: 200, headers });
}
