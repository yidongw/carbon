import { renderToStream } from "@react-pdf/renderer";
import type { BundleTicketLabel } from "./BundleTicketPDF";
import BundleTicketPDF from "./BundleTicketPDF";
import { ensureCJKFont } from "./fonts";

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (d: Uint8Array) => chunks.push(d));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

/** Tag page size in points (width × height). Defaults to 40×80mm portrait. */
export type BundleTicketPageSize = { width: number; height: number };

const MM_TO_PT = 72 / 25.4;

export const DEFAULT_BUNDLE_TAG_SIZE: BundleTicketPageSize = {
  width: 40 * MM_TO_PT,
  height: 80 * MM_TO_PT
};

/**
 * Convert a label size (inches) to a portrait tag page size in points. Portrait
 * = the taller dimension is the page height, so even a landscape media (2×1)
 * yields a usable portrait tag.
 */
export function tagPageSizeFromInches(
  widthIn: number,
  heightIn: number
): BundleTicketPageSize {
  const a = widthIn * 72;
  const b = heightIn * 72;
  return { width: Math.min(a, b), height: Math.max(a, b) };
}

async function render(
  labels: BundleTicketLabel[],
  fontFamily: string,
  pageSize: BundleTicketPageSize
): Promise<Buffer> {
  const stream = await renderToStream(
    <BundleTicketPDF
      labels={labels}
      fontFamily={fontFamily}
      pageWidth={pageSize.width}
      pageHeight={pageSize.height}
    />
  );
  return streamToBuffer(stream);
}

/**
 * Render bundle tickets to a PDF Buffer with Chinese support, degrading safely:
 * if the CJK font can't be resolved or fails to embed, re-render with Helvetica
 * (Latin renders, CJK shows as boxes) rather than throwing — so a print/label
 * route never 500s on a font problem. One ticket per page at `pageSize`
 * (defaults to a 40×80mm portrait tag).
 */
export async function renderBundleTicketsToBuffer(
  labels: BundleTicketLabel[],
  pageSize: BundleTicketPageSize = DEFAULT_BUNDLE_TAG_SIZE
): Promise<Buffer> {
  const fontFamily = await ensureCJKFont();
  try {
    return await render(labels, fontFamily, pageSize);
  } catch (err) {
    if (fontFamily === "Helvetica") throw err;
    console.error("Bundle ticket CJK render failed; falling back:", err);
    return render(labels, "Helvetica", pageSize);
  }
}
