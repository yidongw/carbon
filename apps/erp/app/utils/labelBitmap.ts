// Render a garment bundle label (Chinese text + QR) to a 1-bit raster and wrap
// it in TSPL for direct Bluetooth printing on a label printer (XP-D361B).
//
// Why a bitmap and not TSPL TEXT: TSPL's built-in fonts can't print Chinese, so
// we draw the whole label on a canvas (browser CJK font + the QR image) and
// send it as a TSPL `BITMAP`. The result looks like the PDF layout but prints
// instantly over BLE with no PDF/print-dialog.
//
// Printer resolution is 203 dpi = 8 dots/mm.

export const DOTS_PER_MM = 8;

export type BundleLabelData = {
  id: string;
  readableId?: string | null;
  /** 款号 — parent style readable id. */
  styleReadableId?: string | null;
  /** Variant attributes (颜色/尺码/…) as localized name/value pairs. */
  attributeLines?: Array<{ name: string; value: string }> | null;
  /** Single-line attribute summary when attributeLines is empty. */
  attributeLabel?: string | null;
  quantity?: number | null;
  workCenterName?: string | null;
  sequence?: number | null;
  totalBundles?: number | null;
  totalCut?: number | null;
  customerName?: string | null;
  /** PNG data URL of the QR (from the labels.json route). */
  qrDataUrl: string;
};

const CJK_FONT =
  '"Microsoft YaHei","PingFang SC","Noto Sans SC","Hiragino Sans GB",sans-serif';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const present = (v: unknown) => v !== null && v !== undefined && v !== "";

/**
 * Draw one bundle label onto an offscreen canvas at printer-dot resolution.
 * Single stacked column of fields, then the QR + readable id centered below,
 * with a fixed blank strip at the bottom reserved for the hang hole / tear-off.
 */
export async function drawBundleLabelCanvas(
  label: BundleLabelData,
  widthMm: number,
  heightMm: number,
  rotate180 = false
): Promise<HTMLCanvasElement> {
  const W = Math.round(widthMm * DOTS_PER_MM);
  const H = Math.round(heightMm * DOTS_PER_MM);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D 不可用");

  // These tags hang hole-end-first, so the printer's leading edge is the tail;
  // rotate the whole label 180° so it reads upright coming off the printer.
  if (rotate180) {
    ctx.translate(W, H);
    ctx.rotate(Math.PI);
  }

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#000";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  const padX = Math.round(2 * DOTS_PER_MM);
  const topPad = Math.round(3 * DOTS_PER_MM);
  const holeReserve = Math.round(16 * DOTS_PER_MM);
  const contentBottom = H - holeReserve;
  const contentH = contentBottom - topPad;

  // Two columns, mirroring the PDF ticket: left = 款号 + attributes + 数量,
  // right = 客户/车间/扎号/总扎/总裁. Color/size come as localized name/value
  // pairs in attributeLines (with attributeLabel as a single-line fallback).
  const attrFields: Array<[string, unknown]> =
    label.attributeLines && label.attributeLines.length > 0
      ? label.attributeLines.map((l) => [`${l.name}: `, l.value])
      : label.attributeLabel
        ? [["", label.attributeLabel]]
        : [];
  const toRows = (fields: Array<[string, unknown]>) =>
    fields
      .filter(([, v]) => present(v))
      .map(([k, v]) => [k, String(v)] as [string, string]);
  const leftRows = toRows([
    ["款号: ", label.styleReadableId],
    ...attrFields,
    ["数量: ", label.quantity]
  ]);
  const rightRows = toRows([
    ["客户: ", label.customerName],
    ["车间: ", label.workCenterName],
    ["扎号: ", label.sequence],
    ["总扎: ", label.totalBundles],
    ["总裁: ", label.totalCut]
  ]);

  const maxRows = Math.max(1, leftRows.length, rightRows.length);
  const fieldsBudget = contentH * 0.52;
  const rowH = fieldsBudget / maxRows;
  const fontPx = Math.max(14, Math.min(26, Math.floor(rowH * 0.66)));

  const colGap = Math.round(1.5 * DOTS_PER_MM);
  const colW = (W - 2 * padX - colGap) / 2;
  // Plain bold fill — no stroke pass. Thermal dot-gain already fattens strokes,
  // so an extra stroke merges dense CJK (黑/颜) into blobs. Darkness is tuned by
  // the TSPL DENSITY knob instead of by fattening the glyphs.
  const drawColumn = (rows: Array<[string, string]>, x: number) => {
    let y = topPad;
    for (const [k, v] of rows) {
      ctx.font = `bold ${fontPx}px ${CJK_FONT}`;
      ctx.fillText(k, x, y);
      const kw = ctx.measureText(k).width;
      ctx.fillText(v, x + kw, y, Math.max(8, colW - kw));
      y += rowH;
    }
  };
  drawColumn(leftRows, padX);
  drawColumn(rightRows, padX + colW + colGap);

  // QR + id centered in the space left below the fields, above the hole strip.
  const qrTop = topPad + fieldsBudget;
  const qrAreaH = H - holeReserve - qrTop;
  const idFont = Math.max(14, Math.floor(fontPx * 0.62));
  const qrSize = Math.max(
    32,
    Math.min(W * 0.55, qrAreaH - idFont - 10 * (DOTS_PER_MM / 8))
  );
  const qrX = (W - qrSize) / 2;
  const qrY = qrTop + Math.max(0, (qrAreaH - idFont - 6 - qrSize) / 2);
  try {
    const img = await loadImage(label.qrDataUrl);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
  } catch {
    /* no QR — still print the fields */
  }

  const idText = String(label.readableId || label.id);
  ctx.font = `${idFont}px ${CJK_FONT}`;
  ctx.textAlign = "center";
  ctx.fillText(idText, W / 2, qrY + qrSize + 4, W - 2 * padX);

  return canvas;
}

const ascii = (s: string): number[] => {
  const out: number[] = [];
  for (let i = 0; i < s.length; i++) out.push(s.charCodeAt(i) & 0xff);
  return out;
};

export type TsplOptions = {
  widthMm: number;
  heightMm: number;
  density?: number; // 0..15, higher = darker
  speed?: number;
  gapMm?: number;
  threshold?: number; // 0..255 luminance cutoff for black
};

/**
 * Convert a drawn label canvas into a TSPL byte stream (SIZE/GAP/BITMAP/PRINT).
 * Bit convention: 0 = black (printed), 1 = white — the common TSPL `BITMAP`
 * encoding. Trailing all-white rows are cropped so we don't stream the blank
 * hole strip over BLE.
 */
export function canvasToTsplLabel(
  canvas: HTMLCanvasElement,
  opts: TsplOptions
): Uint8Array {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D 不可用");
  const { data } = ctx.getImageData(0, 0, W, H);

  const bytesPerRow = Math.ceil(W / 8);
  // Lower threshold keeps only the solid core of each stroke black, so dense
  // CJK stays legible after thermal dot-gain fattens it.
  const threshold = opts.threshold ?? 150;
  const mono = new Uint8Array(bytesPerRow * H).fill(0xff); // 1 = white
  let lastBlackRow = 0;

  for (let py = 0; py < H; py++) {
    let rowHasBlack = false;
    for (let px = 0; px < W; px++) {
      const i = (py * W + px) * 4;
      const alpha = data[i + 3];
      const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      if (alpha > 20 && lum < threshold) {
        rowHasBlack = true;
        const byteIndex = py * bytesPerRow + (px >> 3);
        mono[byteIndex] &= ~(0x80 >> (px & 7)); // clear bit -> 0 = black
      }
    }
    if (rowHasBlack) lastBlackRow = py;
  }

  const outH = Math.min(H, lastBlackRow + 8);
  const bmp = mono.subarray(0, bytesPerRow * outH);

  const header = ascii(
    `SIZE ${opts.widthMm} mm,${opts.heightMm} mm\r\n` +
      `GAP ${opts.gapMm ?? 2} mm,0 mm\r\n` +
      `DENSITY ${opts.density ?? 12}\r\n` +
      `SPEED ${opts.speed ?? 4}\r\n` +
      `DIRECTION 1\r\n` +
      `REFERENCE 0,0\r\n` +
      `CLS\r\n` +
      `BITMAP 0,0,${bytesPerRow},${outH},0,`
  );
  const footer = ascii(`\r\nPRINT 1,1\r\n`);

  const out = new Uint8Array(header.length + bmp.length + footer.length);
  out.set(header, 0);
  out.set(bmp, header.length);
  out.set(footer, header.length + bmp.length);
  return out;
}
