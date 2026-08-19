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
  styleReadableId?: string | null;
  colorName?: string | null;
  sizeCode?: string | null;
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
  heightMm: number
): Promise<HTMLCanvasElement> {
  const W = Math.round(widthMm * DOTS_PER_MM);
  const H = Math.round(heightMm * DOTS_PER_MM);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D 不可用");

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#000";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  const padX = Math.round(2 * DOTS_PER_MM);
  const topPad = Math.round(3 * DOTS_PER_MM);
  const holeReserve = Math.round(16 * DOTS_PER_MM);
  const contentH = H - topPad - holeReserve;

  const rows: Array<[string, string]> = (
    [
      ["款号", label.styleReadableId],
      ["客户", label.customerName],
      ["颜色", label.colorName],
      ["尺码", label.sizeCode],
      ["数量", label.quantity],
      ["车间", label.workCenterName],
      ["扎号", label.sequence],
      ["总扎", label.totalBundles],
      ["总裁", label.totalCut]
    ] as Array<[string, unknown]>
  )
    .filter(([, v]) => present(v))
    .map(([k, v]) => [k, String(v)] as [string, string]);

  const n = Math.max(1, rows.length);
  const fieldsBudget = contentH * 0.55;
  const rowH = fieldsBudget / n;
  const fontPx = Math.max(16, Math.min(34, Math.floor(rowH * 0.72)));

  let y = topPad;
  for (const [k, v] of rows) {
    const keyText = `${k}: `;
    ctx.font = `${fontPx}px ${CJK_FONT}`;
    ctx.fillText(keyText, padX, y);
    const kw = ctx.measureText(keyText).width;
    ctx.font = `bold ${fontPx}px ${CJK_FONT}`;
    ctx.fillText(v, padX + kw, y, W - padX - kw - padX);
    y += rowH;
  }

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
  const threshold = opts.threshold ?? 160;
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
      `DENSITY ${opts.density ?? 10}\r\n` +
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
