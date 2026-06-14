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
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
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
  onSaved
}: {
  report: ProductionQuantityReportWithLines;
  configurationParameters?: ConfigurationParameter[] | null;
  itemId?: string | null;
  open: boolean;
  onClose: () => void;
  onSaved: (report: ProductionQuantityReportWithLines) => void;
}) {
  const { t } = useLingui();
  const fetcher = useFetcher<{
    report?: ProductionQuantityReportWithLines;
    error?: string;
  }>();
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
    if (fetcher.data.error) {
      toast.error(fetcher.data.error);
      return;
    }
    if (fetcher.data.report) {
      toast.success(t`Quantity report updated`);
      onSaved(fetcher.data.report);
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose, onSaved, t]);

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

    void fetcher.submit(JSON.stringify(payload), {
      method: "PATCH",
      action: path.to.api.quantityReportLines(report.id),
      encType: "application/json"
    });
  };

  const isSaving = fetcher.state !== "idle";
  const canSave = lines.length > 0 && lines.every((line) => line.quantity > 0);

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="flex w-full max-w-lg flex-col sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Disposition</Trans>
          </DrawerTitle>
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
