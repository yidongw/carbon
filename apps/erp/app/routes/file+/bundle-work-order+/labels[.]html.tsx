import { requirePermissions } from "@carbon/auth/auth.server";
import { generateQRCode } from "@carbon/documents/qr";
import { labelSizes } from "@carbon/utils";
import type { LoaderFunctionArgs } from "react-router";
import { getBundleTicketLabels } from "~/modules/production";

const DEFAULT_TAG_ID = "bundleTag40x80mm";
// The top margin scales with the tag; the bottom hole reserve is a FIXED
// physical height (the hang hole / tear-off is the same size on every stock),
// so it does not scale with the tag height.
const TOP_FRACTION = 0.0375; // small margin at the top (start end — no hole)
const HOLE_RESERVE_MM = 16; // blank reserve at the BOTTOM for the punch hole /
// tear-off line. The hole is at the tail end, so all content (incl. QR + id) is
// kept above this band.
const ROW_GAP_MM = 0.7;

/** Vertical layout bands (mm) derived from the label height. */
function tagLayout(heightMm: number) {
  return {
    topMm: +(heightMm * TOP_FRACTION).toFixed(2),
    holeMm: HOLE_RESERVE_MM
  };
}

/**
 * Size the text for one tag from its field count and the space available.
 * Tags carry a variable number of fields (6–9) and come in many sizes, so the
 * font scales with both: the field list targets ~58% of the printable height
 * and the QR flexes into the rest (see CSS). Deliberately conservative
 * (generous CJK line box) so the fields never overflow and push the QR out.
 */
function tagSizing(fieldCount: number, heightMm: number) {
  const n = Math.max(1, fieldCount);
  const { topMm, holeMm } = tagLayout(heightMm);
  const content = heightMm - topMm - holeMm;
  const fieldsBudgetMm = content * 0.55;
  const perRowMm = (fieldsBudgetMm - (n - 1) * ROW_GAP_MM) / n;
  // No hard minimum — small labels get proportionally smaller text so the QR
  // is never starved. Capped so large labels don't get comically big text.
  const valuePt = Math.min(13, perRowMm / 1.4 / 0.3528);
  return {
    valuePt: +valuePt.toFixed(1),
    keyPt: +(valuePt * 0.85).toFixed(1),
    idPt: +Math.max(5, valuePt * 0.62).toFixed(1)
  };
}

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
  const { topMm, holeMm } = tagLayout(heightMm);
  // QR size is capped by BOTH the label width and the printable height, so it
  // never balloons to full width on narrow tags nor crowds out the id; it's
  // centered in the space left below the fields.
  const contentMm = heightMm - topMm - holeMm;
  const qrMm = Math.min(
    +(widthMm * 0.6).toFixed(1),
    +(contentMm * 0.34).toFixed(1)
  );
  const autoPrint = url.searchParams.get("print") !== "0";
  // Diagnostic: `?border=1` outlines the page + printable area so you can see
  // where the print lands relative to the hole. Off by default.
  const showBorder = url.searchParams.get("border") === "1";

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
      const attrRows =
        l.attributeLines && l.attributeLines.length > 0
          ? l.attributeLines.map((line) => field(`${line.name}:`, line.value))
          : [field("颜色:", l.colorName), field("尺码:", l.sizeCode)];
      const rows = [
        field("款号:", l.styleReadableId),
        field("客户:", l.customerName),
        ...attrRows,
        field("数量:", l.quantity),
        field("车间:", l.workCenterName),
        field("扎号:", l.sequence),
        field("总扎:", l.totalBundles),
        field("总裁:", l.totalCut)
      ].filter(Boolean);
      const { valuePt, keyPt, idPt } = tagSizing(rows.length, heightMm);
      return `<div class="tag${showBorder ? " bordered" : ""}" style="--vpt:${valuePt}pt;--kpt:${keyPt}pt;--idpt:${idPt}pt;--qr:${qrMm}mm">
        <div class="fields">${rows.join("")}</div>
        <div class="qr">
          <div class="code"><img src="${qrByIndex[i]}" alt="QR" /></div>
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
    padding: ${topMm}mm 2mm ${holeMm}mm;
    display: flex; flex-direction: column; overflow: hidden;
  }
  /* Break before each tag except the first, so there is never a forced
     break after the last tag (which would emit a trailing blank page). */
  .tag + .tag { break-before: page; page-break-before: always; }
  /* Diagnostic guides. Outer dotted black line = the full ticket edge.
     Inner red dashed box = the printable area excluding the bottom hole strip,
     so you can check the hole reserve is placed correctly. */
  .tag.bordered { position: relative; border: 1.2mm dotted #000; }
  .tag.bordered::after {
    content: ""; position: absolute; left: 0; right: 0; top: 0;
    bottom: ${holeMm}mm;
    border: 0.6mm dashed #e00; pointer-events: none;
  }
  .fields { flex: 0 0 auto; display: flex; flex-direction: column; gap: ${ROW_GAP_MM}mm; }
  .row { display: flex; gap: 1.5mm; line-height: 1.13; align-items: baseline; }
  .k { color: #444; font-size: var(--kpt); white-space: nowrap; }
  .v { font-weight: 700; font-size: var(--vpt); word-break: break-all; }
  /* Fill the space below the fields and vertically center the QR + id block so
     the QR is a fixed proportional size (never full-width) and the id never
     touches the hole line. max-height keeps the QR inside if a long field list
     leaves little room. */
  .qr { flex: 1 1 0; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.6mm; }
  .code { min-height: 0; display: flex; }
  .code img { width: var(--qr); max-width: 100%; height: auto; max-height: 100%; image-rendering: pixelated; }
  .id { font-size: var(--idpt); color: #6b6b6b; text-align: center; word-break: break-all; }
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
