import {
  Button,
  Checkbox,
  Combobox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ProgressRing,
  toast
} from "@carbon/react";
import { getLabelSizeLabel, labelSizes } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LuBluetooth,
  LuCheck,
  LuMonitor,
  LuPrinter,
  LuSettings2
} from "react-icons/lu";
import { useBluetoothLabelPrinter } from "~/hooks/useBluetoothLabelPrinter";
import type { CareLabelData } from "~/utils/labelBitmap";
import {
  canvasToTsplLabel,
  drawCareLabelCanvas,
  readLabelDensity,
  readLabelThreshold,
  writeLabelDensity,
  writeLabelThreshold
} from "~/utils/labelBitmap";
import { path } from "~/utils/path";

type PrintCareLabelsModalProps = {
  bundleWorkOrderId: string;
  onClose: () => void;
};

const BLUETOOTH = "bluetooth";
const BROWSER = "browser";

const careSizeOptions = labelSizes
  .filter((s) => s.id.startsWith("careLabel"))
  .map((s) => ({ value: s.id, label: getLabelSizeLabel(s) }));

const densityOptions = [8, 9, 10, 11, 12, 13, 14, 15].map((d) => ({
  value: String(d),
  label: String(d)
}));
const thresholdOptions = [120, 130, 140, 150, 160, 170, 180].map((v) => ({
  value: String(v),
  label: String(v)
}));

const PrintCareLabelsModal = ({
  bundleWorkOrderId,
  onClose
}: PrintCareLabelsModalProps) => {
  const { t } = useLingui();
  const bt = useBluetoothLabelPrinter();

  // One care label per garment piece (one RFID code = one label). Codes are
  // company-unique, so `code` is the stable checklist key.
  const [labels, setLabels] = useState<CareLabelData[] | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [tagSize, setTagSize] = useState<string>("careLabel40x60mm");
  const [density, setDensity] = useState<number>(() => readLabelDensity());
  const [threshold, setThreshold] = useState<number>(() =>
    readLabelThreshold()
  );
  const [showBtSettings, setShowBtSettings] = useState(false);
  const changeDensity = useCallback((v: number) => {
    setDensity(v);
    writeLabelDensity(v);
  }, []);
  const changeThreshold = useCallback((v: number) => {
    setThreshold(v);
    writeLabelThreshold(v);
  }, []);

  const [destination, setDestination] = useState<string>(
    bt.supported ? BLUETOOTH : BROWSER
  );
  const [isPrinting, setIsPrinting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [printFrac, setPrintFrac] = useState(0);

  const bytesCache = useRef<Map<string, Uint8Array>>(new Map());

  // Silently re-attach to the last printer when the modal opens.
  useEffect(() => {
    if (bt.supported && bt.status === "disconnected") {
      void bt.reconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const size = useMemo(
    () => labelSizes.find((s) => s.id === tagSize),
    [tagSize]
  );
  const widthMm = Math.round((size?.width ?? 1.5748) * 25.4);
  const heightMm = Math.round((size?.height ?? 2.3622) * 25.4);

  // Fetch per-piece label data (+ QR of each code) once when the modal opens.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          path.to.file.bundleWorkOrderCareLabelsJson(bundleWorkOrderId)
        );
        if (!res.ok) return;
        const { labels: arr } = (await res.json()) as {
          labels: CareLabelData[];
        };
        if (!cancelled) {
          setLabels(arr);
          setChecked(new Set(arr.map((l) => l.code)));
        }
      } catch {
        /* leave the list empty; the button stays disabled */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bundleWorkOrderId]);

  const checkedLabels = useMemo(
    () => (labels ?? []).filter((l) => checked.has(l.code)),
    [labels, checked]
  );

  const allChecked =
    labels != null &&
    labels.length > 0 &&
    checkedLabels.length === labels.length;

  const toggle = useCallback((code: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setChecked((prev) =>
      prev.size === (labels?.length ?? 0)
        ? new Set<string>()
        : new Set((labels ?? []).map((l) => l.code))
    );
  }, [labels]);

  const buildBytes = useCallback(
    async (label: CareLabelData): Promise<Uint8Array> => {
      const key = `${label.code}|${tagSize}|${density}|${threshold}`;
      const cached = bytesCache.current.get(key);
      if (cached) return cached;
      const canvas = await drawCareLabelCanvas(label, widthMm, heightMm);
      const bytes = canvasToTsplLabel(canvas, {
        widthMm,
        heightMm,
        density,
        threshold
      });
      bytesCache.current.set(key, bytes);
      return bytes;
    },
    [tagSize, density, threshold, widthMm, heightMm]
  );

  // Direct Bluetooth print: render each label to a bitmap and stream it as TSPL.
  const handlePrintBluetooth = useCallback(async () => {
    if (checkedLabels.length === 0) return;
    if (!bt.isConnected) {
      const ok = await bt.reconnect();
      if (!ok) {
        toast.error(t`Connect the Bluetooth printer first`);
        return;
      }
    }
    setIsPrinting(true);
    setPrintFrac(0);
    try {
      let failed = 0;
      const total = checkedLabels.length;
      for (let i = 0; i < total; i++) {
        const label = checkedLabels[i];
        setProgress(t`Printing ${i + 1}/${total}`);
        try {
          const bytes = await buildBytes(label);
          await bt.sendBytes(bytes, (s, tot) => {
            setPrintFrac((i + s / tot) / total);
          });
          setPrintFrac((i + 1) / total);
          await new Promise((r) => setTimeout(r, 120));
        } catch {
          failed++;
        }
      }
      if (failed > 0) {
        toast.error(t`${failed} of ${total} labels failed`);
      } else {
        toast.success(t`Printed ${total} labels`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t`Print failed`);
    } finally {
      setIsPrinting(false);
      setProgress(null);
      onClose();
    }
  }, [checkedLabels, bt, buildBytes, onClose, t]);

  // Browser fallback: draw each label to a PNG and open a print window sized
  // exactly to the label (one per page). No server route needed.
  const handlePrintBrowser = useCallback(async () => {
    if (checkedLabels.length === 0) return;
    setIsPrinting(true);
    try {
      const images: string[] = [];
      for (const label of checkedLabels) {
        const canvas = await drawCareLabelCanvas(label, widthMm, heightMm);
        images.push(canvas.toDataURL("image/png"));
      }
      const win = window.open("", "_blank");
      if (!win) {
        toast.error(t`Allow pop-ups to print from the browser`);
        return;
      }
      const pages = images
        .map(
          (src) =>
            `<div class="page"><img src="${src}" width="${widthMm}mm" height="${heightMm}mm"/></div>`
        )
        .join("");
      win.document.write(
        `<!doctype html><html><head><meta charset="utf-8"/><title>${t`Care Labels`}</title>` +
          `<style>@page{size:${widthMm}mm ${heightMm}mm;margin:0}` +
          `html,body{margin:0;padding:0}` +
          `.page{page-break-after:always;width:${widthMm}mm;height:${heightMm}mm}` +
          `img{display:block}</style></head><body onload="window.focus();window.print()">` +
          `${pages}</body></html>`
      );
      win.document.close();
    } finally {
      setIsPrinting(false);
      onClose();
    }
  }, [checkedLabels, widthMm, heightMm, onClose, t]);

  const handlePrint = useCallback(() => {
    if (isPrinting || checkedLabels.length === 0) return;
    if (destination === BLUETOOTH) void handlePrintBluetooth();
    else void handlePrintBrowser();
  }, [
    isPrinting,
    checkedLabels,
    destination,
    handlePrintBluetooth,
    handlePrintBrowser
  ]);

  const statusDot =
    bt.status === "connected"
      ? "bg-emerald-500"
      : bt.status === "connecting"
        ? "bg-amber-500"
        : "bg-red-500";
  const statusText =
    bt.status === "connected"
      ? t`Connected` + (bt.deviceName ? ` · ${bt.deviceName}` : "")
      : bt.status === "connecting"
        ? t`Connecting…`
        : t`Not connected`;

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <Trans>Print Care Labels</Trans>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-muted-foreground"
                onClick={toggleAll}
                disabled={!labels || labels.length === 0}
              >
                <Checkbox isChecked={allChecked} />
                <Trans>Select all ({labels?.length ?? 0})</Trans>
              </button>
              <div className="flex flex-col gap-1 max-h-[280px] overflow-y-auto">
                {(labels ?? []).map((l) => (
                  <button
                    type="button"
                    key={l.code}
                    className="flex items-center gap-3 rounded-lg border border-border p-2 text-left hover:bg-muted"
                    onClick={() => toggle(l.code)}
                  >
                    <Checkbox isChecked={checked.has(l.code)} />
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0 w-8">
                      #{l.sequence ?? "—"}
                    </span>
                    <span className="text-sm font-mono flex-1 min-w-0 truncate">
                      {l.code}
                    </span>
                  </button>
                ))}
                {labels != null && labels.length === 0 ? (
                  <span className="text-sm text-muted-foreground p-2">
                    <Trans>
                      No RFID codes yet. Generate codes first, then print.
                    </Trans>
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">
                <Trans>Label size</Trans>
              </span>
              <Combobox
                options={careSizeOptions}
                value={tagSize}
                onChange={(v) => v && setTagSize(v)}
              />
            </div>

            <div className="flex flex-col gap-1 border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">
                <Trans>Print to</Trans>
              </span>

              {bt.supported && (
                <div
                  role="button"
                  tabIndex={0}
                  className={`flex items-center gap-3 rounded-lg border p-2 text-left transition-colors cursor-pointer ${
                    destination === BLUETOOTH
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted"
                  }`}
                  onClick={() => setDestination(BLUETOOTH)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setDestination(BLUETOOTH);
                  }}
                >
                  <LuBluetooth className="size-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">
                      <Trans>Bluetooth printer</Trans>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span
                        className={`inline-block size-2 rounded-full ${statusDot}`}
                      />
                      {statusText}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={t`Printer settings`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBtSettings((s) => !s);
                    }}
                  >
                    <LuSettings2 className="size-4" />
                  </Button>
                  {bt.isConnected ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        void bt.disconnect();
                      }}
                    >
                      <Trans>Disconnect</Trans>
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      isLoading={bt.status === "connecting"}
                      onClick={(e) => {
                        e.stopPropagation();
                        void bt.connect();
                      }}
                    >
                      <Trans>Connect</Trans>
                    </Button>
                  )}
                  {destination === BLUETOOTH && (
                    <LuCheck className="size-4 text-primary shrink-0" />
                  )}
                </div>
              )}

              {bt.supported && showBtSettings && (
                <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium">
                      <Trans>Print darkness</Trans>
                    </span>
                    <Combobox
                      options={densityOptions}
                      value={String(density)}
                      onChange={(v) => v && changeDensity(Number(v))}
                    />
                    <span className="text-[11px] text-muted-foreground">
                      <Trans>Higher = darker. Default 11.</Trans>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium">
                      <Trans>Stroke thinness</Trans>
                    </span>
                    <Combobox
                      options={thresholdOptions}
                      value={String(threshold)}
                      onChange={(v) => v && changeThreshold(Number(v))}
                    />
                    <span className="text-[11px] text-muted-foreground">
                      <Trans>
                        Lower = thinner (dense Chinese stays legible). Default
                        150.
                      </Trans>
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                className={`flex items-center gap-3 rounded-lg border p-2 text-left transition-colors ${
                  destination === BROWSER
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted"
                }`}
                onClick={() => setDestination(BROWSER)}
              >
                <LuMonitor className="size-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">
                    <Trans>Browser</Trans>
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    <Trans>Print from this device</Trans>
                  </span>
                </div>
                {destination === BROWSER && (
                  <LuCheck className="size-4 text-primary shrink-0" />
                )}
              </button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              leftIcon={
                isPrinting ? <ProgressRing value={printFrac} /> : <LuPrinter />
              }
              disabled={checkedLabels.length === 0 || isPrinting}
              onClick={handlePrint}
            >
              {progress ?? t`Print (${checkedLabels.length})`}
            </Button>
            <Button variant="solid" onClick={onClose}>
              <Trans>Cancel</Trans>
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PrintCareLabelsModal;
