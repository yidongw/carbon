import { useLingui } from "@lingui/react/macro";
import { useEffect, useRef, useState } from "react";
import { LuScanLine } from "react-icons/lu";

type QRScannerProps = {
  /** Called once with the decoded text when a QR code is read. */
  onDecode: (text: string) => void;
};

type ScannerControls = { stop: () => void };

type ScanStatus = "starting" | "scanning" | "unavailable";

/**
 * In-app camera QR scanner. Uses `@zxing/browser` (dynamically imported so it
 * never runs during SSR) against the rear camera. Degrades gracefully when the
 * camera is unavailable or permission is denied — the caller shows a manual
 * fallback alongside.
 */
export function QRScanner({ onDecode }: QRScannerProps) {
  const { t } = useLingui();
  const videoRef = useRef<HTMLVideoElement>(null);
  const decodedRef = useRef(false);
  const [status, setStatus] = useState<ScanStatus>("starting");

  useEffect(() => {
    let controls: ScannerControls | null = null;
    let cancelled = false;
    decodedRef.current = false;

    (async () => {
      try {
        const { BrowserQRCodeReader } = await import("@zxing/browser");
        if (cancelled || !videoRef.current) return;
        const reader = new BrowserQRCodeReader();
        setStatus("scanning");
        controls = await reader.decodeFromConstraints(
          { video: { facingMode: "environment" } },
          videoRef.current,
          (result, _err, ctrl) => {
            if (result && !decodedRef.current) {
              decodedRef.current = true;
              ctrl.stop();
              onDecode(result.getText());
            }
          }
        );
      } catch {
        if (!cancelled) setStatus("unavailable");
      }
    })();

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [onDecode]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-black">
        {/* biome-ignore lint/a11y/useMediaCaption: live camera preview has no captions */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
        />
        {status !== "unavailable" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="size-2/3 rounded-lg border-2 border-white/70" />
          </div>
        )}
      </div>
      {status === "scanning" && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <LuScanLine className="size-4" />
          {t`Point the camera at the bundle ticket QR code`}
        </p>
      )}
      {status === "unavailable" && (
        <p className="text-sm text-muted-foreground">
          {t`Camera unavailable — use manual selection below.`}
        </p>
      )}
    </div>
  );
}

/**
 * Extract a bundle work order id from scanned QR text. Accepts the full MES URL
 * the ticket encodes (`.../x/bundle/{id}`) or a bare `bwo_…` id. Returns null
 * for anything else (a foreign QR code), so the caller can warn the worker.
 */
export function parseBundleScan(text: string): string | null {
  const trimmed = text.trim();
  const urlMatch = trimmed.match(/\/x\/bundle\/([^/?#\s]+)/);
  if (urlMatch?.[1]) return decodeURIComponent(urlMatch[1]);
  if (/^bwo_[A-Za-z0-9]+$/.test(trimmed)) return trimmed;
  return null;
}
