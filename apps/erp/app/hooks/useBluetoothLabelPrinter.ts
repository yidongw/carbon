// Global Web Bluetooth connection to a BLE label printer (e.g. Xprinter
// XP-D361B), shared across the whole app via a singleton store so the
// connection survives navigation and any component can read the live status.
//
// Desktop Chrome/Edge support Web Bluetooth (iOS Safari does not). We keep a
// single connected device + its writable GATT characteristic in module scope
// and expose connect/reconnect/disconnect/sendBytes. The chosen device is
// remembered so we can silently re-attach on the next visit via
// navigator.bluetooth.getDevices() — no chooser prompt.
//
// Web Bluetooth types aren't in the DOM lib here, so `any` is used deliberately.
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "btLabelPrinter";

// Declared up-front so the browser lets us reach these GATT services after an
// acceptAllDevices pick. Same list the /print-test diagnostic uses.
const OPTIONAL_SERVICES = [
  "000018f0-0000-1000-8000-00805f9b34fb",
  "0000ff00-0000-1000-8000-00805f9b34fb",
  "0000ffe0-0000-1000-8000-00805f9b34fb",
  "0000ffb0-0000-1000-8000-00805f9b34fb",
  "0000ae30-0000-1000-8000-00805f9b34fb",
  "49535343-fe7d-4ae5-8fa9-9fafd205e455",
  "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
  "battery_service",
  "device_information"
];

export type BtStatus =
  | "unsupported"
  | "disconnected"
  | "connecting"
  | "connected";

type Snap = { status: BtStatus; deviceName: string | null };

let snap: Snap = { status: "disconnected", deviceName: null };
let device: any = null;
let writeChar: any = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());
const set = (patch: Partial<Snap>) => {
  snap = { ...snap, ...patch };
  emit();
};

const bt = (): any | undefined =>
  typeof navigator !== "undefined" ? (navigator as any).bluetooth : undefined;

function onDisconnected() {
  writeChar = null;
  set({ status: "disconnected" });
}

async function findWritable(server: any): Promise<any> {
  const services = await server.getPrimaryServices();
  for (const s of services) {
    let chars: any[] = [];
    try {
      chars = await s.getCharacteristics();
    } catch {
      continue;
    }
    for (const c of chars) {
      const p = c.properties || {};
      if (p.write || p.writeWithoutResponse) return c;
    }
  }
  return null;
}

async function attach(dev: any): Promise<boolean> {
  device = dev;
  dev.addEventListener?.("gattserverdisconnected", onDisconnected);
  const server = await dev.gatt.connect();
  const ch = await findWritable(server);
  if (!ch) {
    set({ status: "disconnected" });
    return false;
  }
  writeChar = ch;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: dev.name ?? "" }));
  } catch {
    /* ignore */
  }
  set({ status: "connected", deviceName: dev.name || "打印机" });
  return true;
}

/** Prompt the chooser and connect. Must run from a user gesture. */
async function connect(): Promise<boolean> {
  const b = bt();
  if (!b) return false;
  set({ status: "connecting" });
  try {
    const dev = await b.requestDevice({
      acceptAllDevices: true,
      optionalServices: OPTIONAL_SERVICES
    });
    return await attach(dev);
  } catch {
    set({ status: writeChar ? "connected" : "disconnected" });
    return false;
  }
}

/** Silent reconnect (no chooser) to the last device. Safe to call on mount. */
async function reconnect(): Promise<boolean> {
  const b = bt();
  if (!b) return false;
  if (writeChar && device?.gatt?.connected) {
    set({ status: "connected" });
    return true;
  }
  set({ status: "connecting" });
  try {
    if (device?.gatt) {
      const server = await device.gatt.connect();
      const ch = await findWritable(server);
      if (ch) {
        writeChar = ch;
        set({ status: "connected", deviceName: device.name || "打印机" });
        return true;
      }
    }
    if (b.getDevices) {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      const devs = await b.getDevices();
      const match =
        devs.find((d: any) => saved?.name && d.name === saved.name) ?? devs[0];
      if (match) return await attach(match);
    }
  } catch {
    /* fall through */
  }
  set({ status: "disconnected" });
  return false;
}

async function disconnect(): Promise<void> {
  try {
    device?.gatt?.disconnect?.();
  } catch {
    /* ignore */
  }
  writeChar = null;
  device = null;
  set({ status: "disconnected", deviceName: null });
}

/**
 * Write raw bytes to the printer, chunked for BLE. A small pace between chunks
 * avoids overflowing the printer's receive buffer (writeWithoutResponse gives
 * no real backpressure).
 */
async function sendBytes(
  bytes: Uint8Array,
  onProgress?: (sent: number, total: number) => void
): Promise<void> {
  const ch = writeChar;
  if (!ch) throw new Error("打印机未连接");
  const noResp = !!(
    ch.properties?.writeWithoutResponse && ch.writeValueWithoutResponse
  );
  // Start with a large packet for speed; if the negotiated BLE MTU can't take
  // it the first write throws, so drop to a safe size and carry on. A short
  // pause every few packets keeps the printer's receive buffer from overrunning.
  let chunkSize = 512;
  let sent = 0;
  let since = 0;
  while (sent < bytes.length) {
    const chunk = bytes.slice(sent, sent + chunkSize);
    try {
      if (noResp) await ch.writeValueWithoutResponse(chunk);
      else await ch.writeValue(chunk);
    } catch (e) {
      if (chunkSize > 180) {
        chunkSize = 180;
        continue;
      }
      throw e;
    }
    sent += chunk.length;
    onProgress?.(sent, bytes.length);
    if (++since >= 8) {
      since = 0;
      await new Promise((r) => setTimeout(r, 4));
    }
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
const getSnapshot = () => snap;
const getServerSnapshot = (): Snap => ({
  status: "disconnected",
  deviceName: null
});

export function useBluetoothLabelPrinter() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const supported =
    typeof navigator !== "undefined" && !!(navigator as any).bluetooth;
  return {
    supported,
    status: supported ? s.status : ("unsupported" as BtStatus),
    deviceName: s.deviceName,
    isConnected: s.status === "connected",
    connect,
    reconnect,
    disconnect,
    sendBytes
  };
}
