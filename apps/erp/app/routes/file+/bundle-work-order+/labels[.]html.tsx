import { requirePermissions } from "@carbon/auth/auth.server";
import { generateQRCode } from "@carbon/documents/qr";
import { labelSizes } from "@carbon/utils";
import type { LoaderFunctionArgs } from "react-router";
import { getBundleTicketLabels } from "~/modules/production";

const DEFAULT_TAG_ID = "bundleTag40x80mm";
const HOLE_RESERVE_MM = 14;

function esc(value: unknown): string {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[c] as string
  );
}

/**
 * Printable HTML for garment bundle tags — one tag per page sized to the media
 * (default 40×80mm), meant to be printed straight from the browser to the tag
 * printer (Chrome print dialog → the OS printer, incl. Bluetooth). Chinese
 * renders from the system font; QR is an inline PNG data URI. Auto-opens the
 * print dialog on load.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production"
  });

  const url = new URL(request.url);
  const idsParam = url.searchParams.get("ids");
  if (!idsParam) return new Response("No IDs provided", { status: 400 });

  const ids = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (ids.length === 0) return new Response("No valid IDs", { status: 400 });

  const size =
    labelSizes.find((s) => s.id === url.searchParams.get("labelSize")) ??
    labelSizes.find((s) => s.id === DEFAULT_TAG_ID);
  const widthMm = Math.round((size?.width ?? 1.5748) * 25.4);
  const heightMm = Math.round((size?.height ?? 3.1496) * 25.4);
  const autoPrint = url.searchParams.get("print") !== "0";

  const labels = await getBundleTicketLabels(client, companyId, ids);
  if (labels.length === 0) {
    return new Response("No bundle work orders found", { status: 404 });
  }

  const qrByIndex = await Promise.all(
    labels.map((l) => generateQRCode(l.bundleUrl, 36))
  );

  const field = (label: string, value: unknown) =>
    value === null || value === undefined || value === ""
      ? ""
      : `<div class="row"><span class="k">${esc(label)}</span><span class="v">${esc(value)}</span></div>`;

  const tags = labels
    .map((l, i) => {
      const fields = [
        field("款号:", l.styleReadableId),
        field("客户:", l.customerName),
        field("颜色:", l.colorName),
        field("尺码:", l.sizeCode),
        field("数量:", l.quantity),
        field("车间:", l.workCenterName),
        field("扎号:", l.sequence),
        field("总扎:", l.totalBundles),
        field("总裁:", l.totalCut)
      ].join("");
      return `<div class="tag">
        <div class="fields">${fields}</div>
        <div class="qr">
          <img src="${qrByIndex[i]}" alt="QR" />
          <div class="id">${esc(l.readableId || l.id)}</div>
        </div>
      </div>`;
    })
    .join("");

  const html = `<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8" />
<title>Bundle Tickets</title>
<style>
  @page { size: ${widthMm}mm ${heightMm}mm; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { font-family: "Noto Sans SC","Microsoft YaHei","PingFang SC","Hiragino Sans GB","Heiti SC",sans-serif; }
  .tag {
    width: ${widthMm}mm; height: ${heightMm}mm;
    padding: 2mm 2mm 2mm; padding-top: ${HOLE_RESERVE_MM}mm;
    display: flex; flex-direction: column; justify-content: space-between;
    page-break-after: always; overflow: hidden;
  }
  .tag:last-child { page-break-after: auto; }
  .row { display: flex; gap: 1mm; line-height: 1.2; margin-bottom: 0.4mm; }
  .k { color: #555; font-size: 7pt; white-space: nowrap; }
  .v { font-weight: 700; font-size: 8pt; word-break: break-all; }
  .qr { display: flex; flex-direction: column; align-items: center; }
  .qr img { width: 60%; max-width: 30mm; height: auto; image-rendering: pixelated; }
  .id { font-size: 6pt; color: #7d7d7d; text-align: center; }
  @media screen {
    body { background: #eee; padding: 10mm; }
    .tag { background: #fff; margin: 0 auto 6mm; box-shadow: 0 1px 4px rgba(0,0,0,.2); }
  }
</style>
</head>
<body>
${tags}
${autoPrint ? "<script>window.addEventListener('load',function(){setTimeout(function(){window.print();},300);});</script>" : ""}
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}
