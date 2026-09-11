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

// --- Per-device Bluetooth printer tuning (localStorage) ---------------------
// These belong to the physical printer connected to this terminal, so they live
// in localStorage and are edited on the "This Device" settings page — not in the
// print dialog. DENSITY = burn darkness; THRESHOLD = how much of each glyph edge
// prints (lower = thinner).
const DENSITY_KEY = "btLabelDensity";
const THRESHOLD_KEY = "btLabelThreshold";
export const DEFAULT_DENSITY = 11;
export const DEFAULT_THRESHOLD = 150;

export function readLabelDensity(): number {
  if (typeof window === "undefined") return DEFAULT_DENSITY;
  const v = Number(localStorage.getItem(DENSITY_KEY));
  return Number.isFinite(v) && v >= 1 && v <= 15 ? v : DEFAULT_DENSITY;
}
export function writeLabelDensity(v: number): void {
  try {
    localStorage.setItem(DENSITY_KEY, String(v));
  } catch {
    /* ignore */
  }
}
export function readLabelThreshold(): number {
  if (typeof window === "undefined") return DEFAULT_THRESHOLD;
  const v = Number(localStorage.getItem(THRESHOLD_KEY));
  return Number.isFinite(v) && v >= 60 && v <= 240 ? v : DEFAULT_THRESHOLD;
}
export function writeLabelThreshold(v: number): void {
  try {
    localStorage.setItem(THRESHOLD_KEY, String(v));
  } catch {
    /* ignore */
  }
}

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

  // 款号 gets its own full-width row up top (style names can be long), then two
  // columns below: left = attributes + 数量, right = 客户/车间/扎号/总扎/总裁.
  // Color/size come as localized name/value pairs in attributeLines
  // (attributeLabel is a single-line fallback).
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
  const styleValue = present(label.styleReadableId)
    ? String(label.styleReadableId)
    : "";
  const leftRows = toRows([...attrFields, ["数量: ", label.quantity]]);
  const rightRows = toRows([
    ["客户: ", label.customerName],
    ["车间: ", label.workCenterName],
    ["扎号: ", label.sequence],
    ["总扎: ", label.totalBundles],
    ["总裁: ", label.totalCut]
  ]);

  const colRows = Math.max(1, leftRows.length, rightRows.length);
  const totalRows = colRows + (styleValue ? 1 : 0);
  const fieldsBudget = contentH * 0.52;
  const rowH = fieldsBudget / totalRows;
  const fontPx = Math.max(14, Math.min(26, Math.floor(rowH * 0.66)));

  const colGap = Math.round(1.5 * DOTS_PER_MM);
  const colW = (W - 2 * padX - colGap) / 2;

  // Plain bold fill — no stroke pass. Thermal dot-gain already fattens strokes,
  // so an extra stroke merges dense CJK (黑/颜) into blobs; darkness is tuned by
  // the TSPL DENSITY knob instead of by fattening the glyphs.
  let colTop = topPad;
  if (styleValue) {
    const key = "款号: ";
    ctx.font = `bold ${fontPx}px ${CJK_FONT}`;
    ctx.fillText(key, padX, topPad);
    const kw = ctx.measureText(key).width;
    // The value spans the whole width; a very long name shrinks to fit.
    ctx.fillText(styleValue, padX + kw, topPad, W - padX - kw - padX);
    colTop = topPad + rowH;
  }

  const drawColumn = (rows: Array<[string, string]>, x: number) => {
    let y = colTop;
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

export type CareLabelData = {
  /** The garment piece's unique RFID code (also encoded in the barcode). */
  code: string;
  /** Piece sequence within the bundle (1-based). */
  sequence?: number | null;
  /** 款号 — parent style readable id. */
  styleReadableId?: string | null;
  /** Variant attributes (颜色/尺码/…) as localized name/value pairs. */
  attributeLines?: Array<{ name: string; value: string }> | null;
  /**
   * Optional pre-rendered Code128 PNG. Prefer omitting — `drawCareLabelCanvas`
   * draws Code128 bars directly from `code` so large bundles don't download
   * thousands of data URLs, and print doesn't depend on a dynamic barcode lib.
   */
  barcodeDataUrl?: string;
};

// Code128 patterns (11 modules each). Index = code value 0..106.
// Source: ISO/IEC 15417 Code 128; used for Code-B (ASCII 32–127).
const CODE128_PATTERNS: readonly string[] = [
  "11011001100",
  "11001101100",
  "11001100110",
  "10010011000",
  "10010001100",
  "10001001100",
  "10011001000",
  "10011000100",
  "10001100100",
  "11001001000",
  "11001000100",
  "11000100100",
  "10110011100",
  "10011011100",
  "10011001110",
  "10111001100",
  "10011101100",
  "10011100110",
  "11001110010",
  "11001011100",
  "11001001110",
  "11011100100",
  "11001110100",
  "11101101110",
  "11101001100",
  "11100101100",
  "11100100110",
  "11101100100",
  "11100110100",
  "11100110010",
  "11011011000",
  "11011000110",
  "11000110110",
  "10100011000",
  "10001011000",
  "10001000110",
  "10110001000",
  "10001101000",
  "10001100010",
  "11010001000",
  "11000101000",
  "11000100010",
  "10110111000",
  "10110001110",
  "10001101110",
  "10111011000",
  "10111000110",
  "10001110110",
  "11101110110",
  "11010001110",
  "11000101110",
  "11011101000",
  "11011100010",
  "11011101110",
  "11101011000",
  "11101000110",
  "11100010110",
  "11101101000",
  "11101100010",
  "11100011010",
  "11101111010",
  "11001000010",
  "11110001010",
  "10100110000",
  "10100001100",
  "10010110000",
  "10010000110",
  "10000101100",
  "10000100110",
  "10110010000",
  "10110000100",
  "10011010000",
  "10011000010",
  "10000110100",
  "10000110010",
  "11000010010",
  "11001010000",
  "11110111010",
  "11000010100",
  "10001111010",
  "10100111100",
  "10010111100",
  "10010011110",
  "10111100100",
  "10011110100",
  "10011110010",
  "11110100100",
  "11110010100",
  "11110010010",
  "11011011110",
  "11011110110",
  "11110110110",
  "10101111000",
  "10100011110",
  "10001011110",
  "10111101000",
  "10111100010",
  "11110101000",
  "11110100010",
  "10111011110",
  "10111101110",
  "11101011110",
  "11110101110",
  "11010000100",
  "11010010000",
  "11010011100",
  "11000111010"
];

/**
 * Draw Code128-B bars directly onto the canvas (no PNG / no dynamic import).
 * Integer module widths keep bars crisp for TSPL thresholding and browser print.
 */
function drawCode128B(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  const codes: number[] = [104]; // Start Code B
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c < 32 || c > 127) {
      throw new Error(`Code128-B cannot encode char ${c}`);
    }
    codes.push(c - 32);
  }
  let checksum = codes[0]!;
  for (let i = 1; i < codes.length; i++) {
    checksum += codes[i]! * i;
  }
  codes.push(checksum % 103);
  codes.push(106); // Stop

  let modules = "";
  for (const code of codes) {
    const pat = CODE128_PATTERNS[code];
    if (!pat) throw new Error(`Missing Code128 pattern for ${code}`);
    modules += pat;
  }
  modules += "11"; // termination bar

  const moduleW = Math.max(1, Math.floor(w / modules.length));
  const totalW = moduleW * modules.length;
  let dx = x + Math.floor((w - totalW) / 2);
  ctx.fillStyle = "#000";
  for (let i = 0; i < modules.length; i++) {
    if (modules[i] === "1") {
      ctx.fillRect(dx, y, moduleW, h);
    }
    dx += moduleW;
  }
}

// Fields the care label reserves space for but the system doesn't store yet —
// printed as an empty labeled line so the physical label has a place for them
// (filled by a woven/pre-printed base or a later data source). See the RFID
// feature scope: composition/wash-care/origin are out of the current model.
const CARE_PLACEHOLDER_FIELDS = ["成分", "洗涤", "产地"] as const;

/**
 * Draw one garment care label (水洗唛) onto an offscreen canvas at printer-dot
 * resolution: 款号 + 颜色/尺码, then reserved placeholder lines for
 * 成分/洗涤/产地, then the 1D Code128 barcode (of the RFID code) with the code
 * text below. One label per garment piece.
 */
export async function drawCareLabelCanvas(
  label: CareLabelData,
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
  const topPad = Math.round(2 * DOTS_PER_MM);
  const fontPx = Math.max(14, Math.min(22, Math.round(H * 0.045)));
  const rowH = Math.round(fontPx * 1.5);
  const contentW = W - 2 * padX;

  // Header rows: 款号 + each variant attribute (颜色/尺码/…).
  const headerRows: Array<[string, string]> = [];
  if (present(label.styleReadableId)) {
    headerRows.push(["款号: ", String(label.styleReadableId)]);
  }
  for (const line of label.attributeLines ?? []) {
    if (present(line.value))
      headerRows.push([`${line.name}: `, String(line.value)]);
  }

  let y = topPad;
  const drawKeyValue = (key: string, value: string) => {
    ctx.font = `bold ${fontPx}px ${CJK_FONT}`;
    ctx.fillText(key, padX, y);
    const kw = ctx.measureText(key).width;
    ctx.fillText(value, padX + kw, y, Math.max(8, contentW - kw));
    y += rowH;
  };
  for (const [k, v] of headerRows) drawKeyValue(k, v);

  // Reserved placeholder lines — labeled key with a light underline for the
  // (currently unstored) 成分/洗涤/产地 values.
  y += Math.round(fontPx * 0.3);
  for (const field of CARE_PLACEHOLDER_FIELDS) {
    const key = `${field}: `;
    ctx.font = `${fontPx}px ${CJK_FONT}`;
    ctx.fillText(key, padX, y);
    const kw = ctx.measureText(key).width;
    const lineY = y + fontPx - 2;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX + kw, lineY);
    ctx.lineTo(W - padX, lineY);
    ctx.stroke();
    y += rowH;
  }

  // 1D Code128 barcode (of the RFID code) drawn across the full width, with the
  // code text below — sized for a linear scanner, not a QR reader.
  const idFont = Math.max(13, Math.floor(fontPx * 0.7));
  const bcTop = y + Math.round(fontPx * 0.3);
  const bcAreaH = H - topPad - bcTop; // space left below the fields
  const bcW = contentW; // full printable width → widest possible bars
  const bcH = Math.max(
    24,
    Math.min(Math.round(H * 0.22), bcAreaH - idFont - 8)
  );
  const bcX = padX;
  const bcY = bcTop + Math.max(0, (bcAreaH - idFont - 6 - bcH) / 2);
  try {
    if (label.barcodeDataUrl) {
      const img = await loadImage(label.barcodeDataUrl);
      // Smooth so downscaling averages thin bars; TSPL re-binarizes after.
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, bcX, bcY, bcW, bcH);
    } else {
      // Draw bars directly — no dynamic bwip import (was failing silently and
      // leaving care labels with only the human-readable code text).
      ctx.imageSmoothingEnabled = false;
      drawCode128B(ctx, String(label.code), bcX, bcY, bcW, bcH);
    }
  } catch (err) {
    console.error("care-label barcode failed", err);
  }

  ctx.font = `${idFont}px ${CJK_FONT}`;
  ctx.textAlign = "center";
  ctx.fillText(String(label.code), W / 2, bcY + bcH + 4, W - 2 * padX);

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
  const threshold = opts.threshold ?? DEFAULT_THRESHOLD;
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
      `DENSITY ${opts.density ?? DEFAULT_DENSITY}\r\n` +
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
