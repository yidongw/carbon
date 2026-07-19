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
import { useCallback, useMemo, useState } from "react";
import { LuCheck, LuMonitor, LuPrinter } from "react-icons/lu";
import { usePrinting } from "~/hooks";
import type { BundleWorkOrder } from "~/modules/production";
import { path } from "~/utils/path";

type PrintBundleTicketsModalProps = {
  bundles: BundleWorkOrder[];
  onClose: () => void;
};

// Destination for the single Print button: the browser's own print dialog, or
// a configured print-server route id.
const BROWSER = "browser";

const tagSizeOptions = labelSizes
  .filter((s) => s.id.startsWith("bundleTag"))
  .map((s) => ({ value: s.id, label: getLabelSizeLabel(s) }));

const PrintBundleTicketsModal = ({
  bundles,
  onClose
}: PrintBundleTicketsModalProps) => {
  const { t } = useLingui();
  const { printerRoutes } = usePrinting();

  const printable = useMemo(
    () => bundles.filter((b) => Boolean(b.id)),
    [bundles]
  );

  // Everything shown is pre-checked; the worker unchecks what they don't want.
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(printable.map((b) => b.id!))
  );
  const [tagSize, setTagSize] = useState<string>("bundleTag40x80mm");

  // Browser printing is the default; print servers are opt-in alternatives.
  const [destination, setDestination] = useState<string>(BROWSER);
  const [isPrinting, setIsPrinting] = useState(false);

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

  // Print straight from the browser: open a print-sized HTML page (one tag per
  // page) and let the browser's print dialog target the tag printer — works
  // with any OS printer, including a Bluetooth-paired one, no print server.
  const handlePrintBrowser = useCallback(() => {
    if (checkedIds.length === 0) return;
    window.open(
      path.to.file.bundleWorkOrderLabelsHtml(checkedIds, {
        labelSize: tagSize
      }),
      "_blank"
    );
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
    if (destination === BROWSER) handlePrintBrowser();
    else handleSendToPrinter(destination);
  }, [checkedIds, destination, handlePrintBrowser, handleSendToPrinter]);

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
                        {[b.colorName || b.colorCode, b.sizeCode]
                          .filter(Boolean)
                          .join(" · ")}
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
          <div className="flex gap-2">
            <Button
              variant="primary"
              leftIcon={<LuPrinter />}
              disabled={checkedIds.length === 0 || isPrinting}
              onClick={handlePrint}
            >
              <Trans>Print ({checkedIds.length})</Trans>
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
