import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Label,
  toast,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { FetcherWithComponents } from "react-router";
import { useFetcher } from "react-router";
import { useOverlay } from "~/components/Overlay";
import type { ProductionQuantityReportWithLines } from "~/modules/production/productionQuantityReport.service";
import { path } from "~/utils/path";
import {
  type EditableProductionQuantityLine,
  normalizeUniqueLineTypes,
  ProductionQuantityLinesEditor
} from "./ProductionQuantityLinesEditor";

type ConfigurationParameter = {
  key: string;
  label: string;
  dataType: string;
  listOptions?: string[] | null;
};

function lineFromActive(
  line: ProductionQuantityReportWithLines["activeLines"][number]
): EditableProductionQuantityLine {
  return {
    key: line.id,
    type: line.type,
    quantity: line.quantity,
    scrapReasonId: line.scrapReasonId ?? undefined,
    notes: line.notes ?? undefined,
    configuration: line.configuration ?? undefined
  };
}

export function ProductionQuantityDispositionDrawer({
  report,
  configurationParameters,
  itemId,
  open,
  onClose,
  onSaved,
  saveAction,
  title,
  saveMethod = "PATCH",
  getSaveBody,
  fetcher: externalFetcher
}: {
  report: ProductionQuantityReportWithLines;
  configurationParameters?: ConfigurationParameter[] | null;
  itemId?: string | null;
  open: boolean;
  onClose: () => void;
  onSaved: (report: ProductionQuantityReportWithLines) => void;
  /** Defaults to the production quantity report lines API. */
  saveAction?: string;
  title?: ReactNode;
  saveMethod?: "PATCH" | "POST";
  /** When set, builds the request body (e.g. quantity-review reject-with-correction). */
  getSaveBody?: (payload: {
    notes: string | undefined;
    lines: Array<{
      type: string;
      quantity: number;
      scrapReasonId?: string;
      notes?: string;
      configuration?: unknown;
    }>;
  }) => BodyInit;
  /** When provided, submits through this fetcher (e.g. quantity-review table actions). */
  fetcher?: FetcherWithComponents<{
    report?: ProductionQuantityReportWithLines;
    error?: string;
    ok?: boolean;
  }>;
}) {
  const { t } = useLingui();
  const internalFetcher = useFetcher<{
    report?: ProductionQuantityReportWithLines;
    error?: string;
    ok?: boolean;
  }>();
  const fetcher = externalFetcher ?? internalFetcher;
  const { instances: overlayInstances } = useOverlay();
  const [lines, setLines] = useState<EditableProductionQuantityLine[]>([]);
  const [notes, setNotes] = useState(report.notes ?? "");

  useEffect(() => {
    if (!open) return;
    setLines(
      normalizeUniqueLineTypes(report.activeLines.map(lineFromActive))
    );
    setNotes(report.notes ?? "");
  }, [open, report]);

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    // Ignore stale fetcher results from unrelated actions (e.g. approve on the same fetcher).
    if (externalFetcher && fetcher.formData == null) return;
    if (fetcher.data.error) {
      toast.error(fetcher.data.error);
      return;
    }
    if (fetcher.data.report || fetcher.data.ok) {
      if (!externalFetcher) {
        toast.success(t`Quantity report updated`);
      }
      if (fetcher.data.report) {
        onSaved(fetcher.data.report);
      } else {
        onSaved(report);
      }
      onClose();
    }
  }, [externalFetcher, fetcher.state, fetcher.data, fetcher.formData, onClose, onSaved, report, t]);

  const save = () => {
    const zeroQuantityLine = lines.find((line) => line.quantity <= 0);
    if (zeroQuantityLine) {
      toast.error(
        t`Each line must have a quantity greater than zero (${zeroQuantityLine.type})`
      );
      return;
    }

    const lineTotal = lines.reduce((sum, line) => sum + line.quantity, 0);
    if (Math.abs(lineTotal - report.originalQuantity) > 0.0001) {
      toast.warning(
        t`Active line total (${lineTotal}) differs from originally reported (${report.originalQuantity}). Saving anyway.`
      );
    }

    const payload = {
      notes: notes || undefined,
      lines: lines.map(({ key: _key, ...line }) => ({
        ...line,
        scrapReasonId: line.type === "Scrap" ? line.scrapReasonId : undefined
      }))
    };

    const body = getSaveBody?.(payload) ?? JSON.stringify(payload);
    const encType =
      body instanceof FormData ? undefined : ("application/json" as const);

    void fetcher.submit(body, {
      method: saveMethod,
      action: saveAction ?? path.to.api.quantityReportLines(report.id),
      ...(encType ? { encType } : {})
    });
  };

  const isSaving = fetcher.state !== "idle";
  const canSave = lines.length > 0 && lines.every((line) => line.quantity > 0);

  const preventDismissWhileOverlayOpen = (event: Event) => {
    if (overlayInstances.length > 0) {
      event.preventDefault();
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && overlayInstances.length === 0) {
          onClose();
        }
      }}
    >
      <DrawerContent
        className="flex w-full max-w-lg flex-col sm:max-w-lg"
        onPointerDownOutside={preventDismissWhileOverlayOpen}
        onInteractOutside={preventDismissWhileOverlayOpen}
      >
        <DrawerHeader>
          <DrawerTitle>{title ?? <Trans>Disposition</Trans>}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="flex w-full min-w-0 flex-col items-stretch gap-4">
          <VStack className="w-full gap-1">
            <Label>{t`Notes`}</Label>
            <textarea
              className="min-h-[4rem] w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </VStack>

          <ProductionQuantityLinesEditor
            lines={lines}
            setLines={setLines}
            configurationParameters={configurationParameters}
            itemId={itemId}
            configReferenceContext={{
              originalConfiguration: report.originalConfiguration
            }}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            <Trans>Cancel</Trans>
          </Button>
          <Button
            type="button"
            onClick={save}
            isLoading={isSaving}
            isDisabled={!canSave}
          >
            <Trans>Save</Trans>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
