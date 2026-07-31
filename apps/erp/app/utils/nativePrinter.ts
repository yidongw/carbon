// Client-side bridge to the native Xprinter Capacitor plugin.
//
// When the Carbon ERP runs inside the Jilio iOS shell (see /mobile), the native
// layer exposes a plugin at window.Capacitor.Plugins.Xprinter that talks to the
// label printer over BLE. On the plain web (Safari/Chrome) none of this exists —
// callers must gate on isNativeApp() first.

type XprinterPlugin = {
  isAvailable(): Promise<{ available: boolean }>;
  startScan(): Promise<void>;
  stopScan(): Promise<void>;
  connect(options: { id: string }): Promise<{ ok: boolean; name?: string }>;
  disconnect(): Promise<void>;
  getStatus(): Promise<{ code: number; message: string }>;
  printRaw(options: { base64: string; packageSize?: number }): Promise<{
    ok: boolean;
  }>;
  addListener(
    event: "deviceFound" | "disconnected" | "bluetoothState",
    cb: (data: any) => void
  ): Promise<{ remove: () => void }> | { remove: () => void };
};

type Capacitor = {
  isNativePlatform?: () => boolean;
  Plugins?: { Xprinter?: XprinterPlugin };
};

function cap(): Capacitor | undefined {
  return typeof window !== "undefined" ? (window as any).Capacitor : undefined;
}

export function isNativeApp(): boolean {
  const c = cap();
  return !!c?.isNativePlatform?.() && !!c.Plugins?.Xprinter;
}

export function xprinter(): XprinterPlugin {
  const p = cap()?.Plugins?.Xprinter;
  if (!p) throw new Error("Xprinter native plugin unavailable");
  return p;
}

export type FoundDevice = { id: string; name: string; rssi: number };

/** Listen for scan results. Returns an unsubscribe fn. */
export async function onDeviceFound(
  cb: (d: FoundDevice) => void
): Promise<() => void> {
  const handle = await xprinter().addListener("deviceFound", cb);
  return () => handle.remove();
}

// --- TSPL label composition -------------------------------------------------
// The XP-D361B is a label printer; it speaks TSPL (plain ASCII commands). We
// build the command string here and hand the bytes to the native plugin, so the
// printable content is fully controlled from the web layer (OTA-updatable).

export type TsplTextLine = {
  x: number;
  y: number;
  font?: string; // TSPL internal font id, e.g. "1".."5"
  content: string;
  xRatio?: number;
  yRatio?: number;
};

export type TsplLabel = {
  widthMm: number;
  heightMm: number;
  gapMm?: number;
  density?: number; // 0..15
  speed?: number;
  copies?: number;
  texts?: TsplTextLine[];
  qrcode?: { x: number; y: number; content: string; cell?: number };
};

export function buildTsplLabel(label: TsplLabel): string {
  const gap = label.gapMm ?? 2;
  const lines: string[] = [
    `SIZE ${label.widthMm} mm,${label.heightMm} mm`,
    `GAP ${gap} mm,0 mm`,
    `DENSITY ${label.density ?? 8}`,
    `SPEED ${label.speed ?? 4}`,
    `DIRECTION 1`,
    `CLS`
  ];
  for (const t of label.texts ?? []) {
    const esc = t.content.replace(/"/g, '\\"');
    lines.push(
      `TEXT ${t.x},${t.y},"${t.font ?? "3"}",0,${t.xRatio ?? 1},${t.yRatio ?? 1},"${esc}"`
    );
  }
  if (label.qrcode) {
    const q = label.qrcode;
    const esc = q.content.replace(/"/g, '\\"');
    lines.push(`QRCODE ${q.x},${q.y},L,${q.cell ?? 5},A,0,"${esc}"`);
  }
  lines.push(`PRINT 1,${label.copies ?? 1}`);
  return lines.join("\r\n") + "\r\n";
}

/** Latin1 string -> base64 (TSPL is ASCII, so byte-per-char is correct). */
export function toBase64(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; i++)
    out += String.fromCharCode(s.charCodeAt(i) & 0xff);
  return btoa(out);
}

/** Compose a TSPL label and send it to the connected printer. */
export async function printLabel(label: TsplLabel): Promise<void> {
  const tspl = buildTsplLabel(label);
  await xprinter().printRaw({ base64: toBase64(tspl) });
}

/** A small self-test label used by the /print-test page. */
export function testLabel(): TsplLabel {
  return {
    widthMm: 40,
    heightMm: 30,
    gapMm: 2,
    texts: [
      { x: 20, y: 20, font: "4", content: "Jilio OK" },
      { x: 20, y: 70, font: "2", content: "XP-D361B native test" }
    ],
    qrcode: { x: 20, y: 110, content: "https://app.jilio.xyz", cell: 4 }
  };
}
