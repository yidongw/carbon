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
import type { ConfigurationParameter } from "~/modules/items/types";
import type {
  JobOperationSupplierQuantityLine,
  JobOperationSupplierQuantityReportWithLines
} from "~/modules/production/jobOperationSupplierQuantityReport.service";
import { path } from "~/utils/path";
import {
  type EditableProductionQuantityLine,
  normalizeUniqueLineTypes,
  ProductionQuantityLinesEditor
} from "./ProductionQuantityLinesEditor";

function lineFromActive(
  line: JobOperationSupplierQuantityLine
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

export function SupplierQuantityDispositionDrawer({
  report,
  configurationParameters,
  itemId,
  open,
  onClose,
  onSaved
}: {
  report: JobOperationSupplierQuantityReportWithLines;
  configurationParameters?: ConfigurationParameter[] | null;
  itemId?: string | null;
  open: boolean;
  onClose: () => void;
  onSaved: (report: JobOperationSupplierQuantityReportWithLines) => void;
}) {
  const { t } = useLingui();
  const fetcher = useFetcher<{
    report?: JobOperationSupplierQuantityReportWithLines;
    error?: string;
  }>();
  const [lines, setLines] = useState<EditableProductionQuantityLine[]>([]);
  const [notes, setNotes] = useState(report.notes ?? "");

  useEffect(() => {
    if (!open) return;
    setLines(normalizeUniqueLineTypes(report.activeLines.map(lineFromActive)));
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

  const handleSave = () => {
    const activeLines = lines.filter((l) => l.quantity > 0);
    if (activeLines.length === 0) {
      toast.error(t`Add at least one line with quantity greater than zero`);
      return;
    }

    fetcher.submit(
      JSON.stringify({
        notes: notes.trim() ? notes : null,
        lines: activeLines.map(({ key: _k, ...line }) => line)
      }),
      {
        method: "PATCH",
        encType: "application/json",
        action: path.to.api.supplierQuantityReportLines(report.id)
      }
    );
  };

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Edit supplier quantity report</Trans>
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
              isDisabled={fetcher.state !== "idle"}
            />
        </DrawerBody>
        <DrawerFooter>
          <Button
            variant="solid"
            onClick={onClose}
            className="transition-transform active:scale-[0.96]"
          >
            <Trans>Cancel</Trans>
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={fetcher.state !== "idle"}
            className="transition-transform active:scale-[0.96]"
          >
            <Trans>Save</Trans>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
