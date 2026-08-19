import { localizeVariantAttributeLabel } from "@carbon/database/style-reference";
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
  toast
} from "@carbon/react";
import { getLabelSizeLabel, labelSizes } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LuBluetooth, LuCheck, LuMonitor, LuPrinter } from "react-icons/lu";
import { usePrinting } from "~/hooks";
import { useBluetoothLabelPrinter } from "~/hooks/useBluetoothLabelPrinter";
import type { BundleWorkOrder } from "~/modules/production";
import type { BundleLabelData } from "~/utils/labelBitmap";
import { canvasToTsplLabel, drawBundleLabelCanvas } from "~/utils/labelBitmap";
import { path } from "~/utils/path";

type PrintBundleTicketsModalProps = {
  bundles: BundleWorkOrder[];
  onClose: () => void;
};

// Destination for the single Print button: a directly-connected Bluetooth label
// printer, the browser's own PDF/print dialog, or a configured print-server id.
const BLUETOOTH = "bluetooth";
const BROWSER = "browser";

const tagSizeOptions = labelSizes
  .filter((s) => s.id.startsWith("bundleTag"))
  .map((s) => ({ value: s.id, label: getLabelSizeLabel(s) }));

const PrintBundleTicketsModal = ({
  bundles,
  onClose
}: PrintBundleTicketsModalProps) => {
  const { t, i18n } = useLingui();
  const { printerRoutes } = usePrinting();
  const bt = useBluetoothLabelPrinter();

  const printable = useMemo(
    () => bundles.filter((b) => Boolean(b.id)),
    [bundles]
  );

  // Everything shown is pre-checked; the worker unchecks what they don't want.
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(printable.map((b) => b.id!))
  );
  const [tagSize, setTagSize] = useState<string>("bundleTag40x80mm");

  // Bluetooth is the default when the browser supports it (fastest — prints
  // straight to the label printer); otherwise fall back to the browser PDF.
  const [destination, setDestination] = useState<string>(
    bt.supported ? BLUETOOTH : BROWSER
  );
  const [isPrinting, setIsPrinting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  // Silently re-attach to the last printer when the modal opens, so the status
  // shows green (and Print just works) without a chooser prompt.
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
  const heightMm = Math.round((size?.height ?? 3.1496) * 25.4);

  const checkedIds = useMemo(
    () => printable.filter((b) => checked.has(b.id!)).map((b) => b.id!),
    [printable, checked]
  );

  const allChecked =
    checkedIds.length === printable.length && printable.length > 0;

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setChecked((prev) =>
      prev.size === printable.length
        ? new Set<string>()
        : new Set(printable.map((b) => b.id!))
    );
  }, [printable]);

  const bundleById = useMemo(
    () => new Map(printable.map((b) => [b.id!, b])),
    [printable]
  );

  // Direct Bluetooth print: fetch the full label data (+ QR), render each label
  // to a bitmap, and stream it as TSPL to the connected printer. No PDF, no
  // print dialog. Requires an already-connected printer (connect via the row
  // button — requestDevice needs its own user gesture and can't run after the
  // async work here).
  const handlePrintBluetooth = useCallback(async () => {
    if (checkedIds.length === 0) return;
    if (!bt.isConnected) {
      const ok = await bt.reconnect();
      if (!ok) {
        toast.error(t`Connect the Bluetooth printer first`);
        return;
      }
    }
    setIsPrinting(true);
    try {
      const res = await fetch(
        path.to.file.bundleWorkOrderLabelsJson(checkedIds)
      );
      if (!res.ok) throw new Error(t`Failed to load label data`);
      const { labels } = (await res.json()) as { labels: BundleLabelData[] };
      const byId = new Map(labels.map((l) => [l.id, l]));
      const ordered = checkedIds
        .map((id) => byId.get(id))
        .filter((l): l is BundleLabelData => Boolean(l));

      let failed = 0;
      for (let i = 0; i < ordered.length; i++) {
        setProgress(t`Printing ${i + 1}/${ordered.length}`);
        try {
          const canvas = await drawBundleLabelCanvas(
            ordered[i],
            widthMm,
            heightMm
          );
          const bytes = canvasToTsplLabel(canvas, { widthMm, heightMm });
          await bt.sendBytes(bytes);
          // Let the printer finish this label before streaming the next.
          await new Promise((r) => setTimeout(r, 250));
        } catch {
          failed++;
        }
      }
      if (failed > 0) {
        toast.error(t`${failed} of ${ordered.length} labels failed`);
      } else {
        toast.success(t`Printed ${ordered.length} labels`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t`Print failed`);
    } finally {
      setIsPrinting(false);
      setProgress(null);
      onClose();
    }
  }, [checkedIds, bt, widthMm, heightMm, onClose, t]);

  // Print straight from the browser: open the server-generated PDF, sized
  // exactly to the tag (one ticket per page), in a new tab; print from the
  // viewer (Cmd/Ctrl+P).
  const handlePrintBrowser = useCallback(() => {
    if (checkedIds.length === 0) return;
    const url = path.to.file.bundleWorkOrderLabelsPdf(checkedIds, {
      labelSize: tagSize
    });
    window.open(url, "_blank");
    onClose();
  }, [checkedIds, tagSize, onClose]);

  // Optional: push to a configured print server (ProxyBox) instead. Raw fetch
  // (not a fetcher) so parallel submissions don't abort each other.
  const handleSendToPrinter = useCallback(
    async (printerRouteId: string) => {
      if (checkedIds.length === 0 || !printerRouteId) return;
      setIsPrinting(true);
      try {
        const results = await Promise.allSettled(
          checkedIds.map((id) =>
            fetch(path.to.manualPrint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sourceDocument: "BundleWorkOrder",
                sourceDocumentId: id,
                locationId: bundleById.get(id)?.locationId ?? undefined,
                printerRouteId
              })
            })
          )
        );
        const failed = results.filter(
          (r) => r.status === "rejected" || !r.value.ok
        ).length;
        if (failed > 0) {
          toast.error(t`${failed} of ${checkedIds.length} tickets failed`);
        } else {
          toast.success(t`Queued ${checkedIds.length} tickets for printing`);
        }
      } finally {
        setIsPrinting(false);
        onClose();
      }
    },
    [checkedIds, bundleById, onClose, t]
  );

  // Single Print button routes to whichever destination is selected.
  const handlePrint = useCallback(() => {
    if (checkedIds.length === 0) return;
    if (destination === BLUETOOTH) void handlePrintBluetooth();
    else if (destination === BROWSER) handlePrintBrowser();
    else void handleSendToPrinter(destination);
  }, [
    checkedIds,
    destination,
    handlePrintBluetooth,
    handlePrintBrowser,
    handleSendToPrinter
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
            <Trans>Print Bundle Tickets</Trans>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-muted-foreground"
                onClick={toggleAll}
              >
                <Checkbox isChecked={allChecked} />
                <Trans>Select all ({printable.length})</Trans>
              </button>
              <div className="flex flex-col gap-1 max-h-[280px] overflow-y-auto">
                {printable.map((b) => (
                  <button
                    type="button"
                    key={b.id}
                    className="flex items-center gap-3 rounded-lg border border-border p-2 text-left hover:bg-muted"
                    onClick={() => toggle(b.id!)}
                  >
                    <Checkbox isChecked={checked.has(b.id!)} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">
                        {b.jobReadableId}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {localizeVariantAttributeLabel(
                          (b as { attributeLabel?: string | null })
                            .attributeLabel,
                          i18n.locale
                        ) || ""}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                      {t`Qty`} {b.quantity ?? 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">
                <Trans>Tag size</Trans>
              </span>
              <Combobox
                options={tagSizeOptions}
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
              {printerRoutes.map((route) => (
                <button
                  type="button"
                  key={route.id}
                  className={`flex items-center gap-3 rounded-lg border p-2 text-left transition-colors ${
                    destination === route.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted"
                  }`}
                  onClick={() => setDestination(route.id)}
                >
                  <LuPrinter className="size-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">{route.name}</span>
                    <span className="text-xs text-muted-foreground ml-2 uppercase">
                      {route.format}
                    </span>
                  </div>
                  {destination === route.id && (
                    <LuCheck className="size-4 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              leftIcon={<LuPrinter />}
              isLoading={isPrinting}
              disabled={checkedIds.length === 0 || isPrinting}
              onClick={handlePrint}
            >
              {progress ?? t`Print (${checkedIds.length})`}
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

export default PrintBundleTicketsModal;
