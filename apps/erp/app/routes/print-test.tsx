import { useCallback, useRef, useState } from "react";

// Standalone Web Bluetooth diagnostic page for thermal (ESC/POS) printers.
// No auth, no app chrome — meant to be opened on a phone (Android Chrome, or
// iOS via the Bluefy browser, since Safari does not implement Web Bluetooth).
//
// Reachable at /print-test on any preview / deployed URL. Web Bluetooth only
// works over HTTPS, which the preview URLs already provide.

export const meta = () => [{ title: "Bluetooth Printer Test" }];

// When using acceptAllDevices you must declare optionalServices up-front or the
// browser blocks access to the device's GATT services. These are the service
// UUIDs commonly exposed by cheap BLE thermal printers.
const OPTIONAL_SERVICES = [
  "000018f0-0000-1000-8000-00805f9b34fb", // very common thermal printer service
  "0000ff00-0000-1000-8000-00805f9b34fb",
  "0000ffe0-0000-1000-8000-00805f9b34fb", // HM-10 style UART
  "0000ffb0-0000-1000-8000-00805f9b34fb",
  "0000ae30-0000-1000-8000-00805f9b34fb",
  "49535343-fe7d-4ae5-8fa9-9fafd205e455", // Microchip/ISSC transparent UART
  "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
  "battery_service",
  "device_information"
];

type BleChar = any; // Web Bluetooth types aren't in the DOM lib here.

export default function PrintTest() {
  const [lines, setLines] = useState<string[]>([]);
  const [deviceName, setDeviceName] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const writeCharRef = useRef<BleChar | null>(null);

  const log = useCallback((msg: string) => {
    setLines((prev) => [...prev, msg]);
    // eslint-disable-next-line no-console
    console.log("[print-test]", msg);
  }, []);

  const supported =
    typeof navigator !== "undefined" && "bluetooth" in navigator;

  const connect = useCallback(async () => {
    setLines([]);
    writeCharRef.current = null;
    setConnected(false);
    setBusy(true);
    try {
      const bt = (navigator as any).bluetooth;
      log("弹出设备选择框，选择你的打印机…");
      const device = await bt.requestDevice({
        acceptAllDevices: true,
        optionalServices: OPTIONAL_SERVICES
      });
      setDeviceName(device.name || device.id || "(未命名设备)");
      log(`选中: ${device.name || "(未命名)"}  id=${device.id}`);

      device.addEventListener?.("gattserverdisconnected", () => {
        setConnected(false);
        log("⚠️ 设备已断开");
      });

      log("正在连接 GATT…");
      const server = await device.gatt.connect();
      log("✅ GATT 已连接，正在枚举服务…");

      const services = await server.getPrimaryServices();
      log(`发现 ${services.length} 个服务`);

      let firstWritable: BleChar | null = null;
      for (const service of services) {
        log(`service: ${service.uuid}`);
        let chars: BleChar[] = [];
        try {
          chars = await service.getCharacteristics();
        } catch (e) {
          log(`  (无法读取特征: ${e})`);
          continue;
        }
        for (const c of chars) {
          const p = c.properties || {};
          const flags = [
            p.write && "write",
            p.writeWithoutResponse && "writeNoResp",
            p.notify && "notify",
            p.read && "read"
          ]
            .filter(Boolean)
            .join(",");
          log(`  char: ${c.uuid} [${flags || "?"}]`);
          if (!firstWritable && (p.write || p.writeWithoutResponse)) {
            firstWritable = c;
          }
        }
      }

      if (firstWritable) {
        writeCharRef.current = firstWritable;
        setConnected(true);
        log(`✅ 找到可写特征: ${firstWritable.uuid}`);
        log("现在可以点「打印测试小票」了。");
      } else {
        log("❌ 没找到可写特征，这台设备可能不是标准 ESC/POS BLE 打印机。");
      }
    } catch (e: any) {
      log(`错误: ${e?.message || e}`);
      if (e?.name === "NotFoundError") {
        log(
          "提示: 若列表里没有你的打印机 —— 先把打印机关机重开、并退出厂商 App(BLE 被连接时不广播)。"
        );
      }
    } finally {
      setBusy(false);
    }
  }, [log]);

  const printTest = useCallback(async () => {
    const ch = writeCharRef.current;
    if (!ch) {
      log("还没连接到可写特征。");
      return;
    }
    setBusy(true);
    try {
      const enc = new TextEncoder();
      const ESC = 0x1b;
      const GS = 0x1d;
      const bytes: number[] = [];
      bytes.push(ESC, 0x40); // init
      bytes.push(ESC, 0x61, 0x01); // center
      bytes.push(...enc.encode("Web Bluetooth OK\n"));
      bytes.push(ESC, 0x61, 0x00); // left
      bytes.push(...enc.encode("Carbon print-test page\n"));
      bytes.push(...enc.encode("Line 1234567890\n"));
      bytes.push(...enc.encode("--------------------------------\n"));
      bytes.push(0x0a, 0x0a, 0x0a); // feed
      bytes.push(GS, 0x56, 0x00); // cut (ignored if no cutter)

      const data = new Uint8Array(bytes);
      log(`发送 ${data.length} 字节…`);

      // BLE writes must be chunked (default MTU is small).
      const chunkSize = 100;
      const useNoResponse = ch.properties?.writeWithoutResponse;
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        if (useNoResponse && ch.writeValueWithoutResponse) {
          await ch.writeValueWithoutResponse(chunk);
        } else {
          await ch.writeValue(chunk);
        }
        await new Promise((r) => setTimeout(r, 30));
      }
      log("✅ 已发送。打印机应该出票了。");
    } catch (e: any) {
      log(`打印错误: ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  }, [log]);

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 560,
        margin: "0 auto",
        padding: 16,
        color: "#111",
        background: "#fff",
        minHeight: "100vh"
      }}
    >
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>蓝牙打印机测试</h1>
      <p style={{ fontSize: 13, color: "#555", marginTop: 0 }}>
        iOS 请用 <b>Bluefy</b> 浏览器打开本页；Android 用 Chrome。Safari 不支持
        Web Bluetooth。
      </p>

      {!supported && (
        <div
          style={{
            background: "#fde",
            border: "1px solid #f99",
            padding: 12,
            borderRadius: 8,
            fontSize: 14
          }}
        >
          ❌ 当前浏览器不支持 Web Bluetooth（navigator.bluetooth 不存在）。
          请改用 Bluefy(iOS) 或 Chrome(Android)。
        </div>
      )}

      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <button
          onClick={connect}
          disabled={!supported || busy}
          style={btnStyle(!supported || busy)}
        >
          {busy ? "…" : "扫描并连接"}
        </button>
        <button
          onClick={printTest}
          disabled={!connected || busy}
          style={btnStyle(!connected || busy)}
        >
          打印测试小票
        </button>
      </div>

      {deviceName && (
        <div style={{ fontSize: 14, marginBottom: 8 }}>
          设备: <b>{deviceName}</b> {connected ? "🟢 已连接" : "⚪️ 未就绪"}
        </div>
      )}

      <pre
        style={{
          background: "#0b0b0b",
          color: "#3fef7f",
          padding: 12,
          borderRadius: 8,
          fontSize: 12,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          minHeight: 200,
          maxHeight: "50vh",
          overflow: "auto"
        }}
      >
        {lines.length ? lines.join("\n") : "日志会显示在这里…"}
      </pre>

      <details style={{ fontSize: 13, color: "#555", marginTop: 12 }}>
        <summary>扫不到设备怎么办？</summary>
        <ol style={{ paddingLeft: 18 }}>
          <li>把打印机关机再开机（BLE 被连接时会停止广播，别人就扫不到）。</li>
          <li>完全退出厂商 App、并断开电脑上的蓝牙连接。</li>
          <li>
            确认打印机是 BLE，而不是只有经典蓝牙 SPP（后者 Web Bluetooth
            永远连不了）。
          </li>
        </ol>
      </details>
    </div>
  );
}

function btnStyle(disabled: boolean): React.CSSProperties {
  return {
    flex: 1,
    padding: "12px 16px",
    fontSize: 15,
    borderRadius: 8,
    border: "none",
    color: "#fff",
    background: disabled ? "#aaa" : "#2563eb",
    cursor: disabled ? "not-allowed" : "pointer"
  };
}
