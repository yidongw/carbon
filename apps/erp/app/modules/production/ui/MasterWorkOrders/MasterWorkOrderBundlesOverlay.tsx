import { Button, HStack } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { useState } from "react";
import { LuPrinter, LuScissors } from "react-icons/lu";
import { useRevalidator } from "react-router";
import { overlay, useOverlay } from "~/components/Overlay";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions } from "~/hooks";
import type { BundleWorkOrder } from "~/modules/production";
import {
  variantsQuantityModalBodyClassName,
  variantsQuantityModalShellClassName
} from "../Jobs/variantsQuantityShared";
import BundleWorkOrdersTable from "./BundleWorkOrdersTable";
import PrintBundleTicketsModal from "./PrintBundleTicketsModal";

export type MasterWorkOrderBundlesOverlayProps = {
  bundleWorkOrders: BundleWorkOrder[];
  count: number;
  masterDisplayId?: string | null;
  masterWorkOrderId: string;
  remainingToSplit: number;
} & Pick<OverlayFormInjectedProps, "onDismiss">;

/**
 * Read-only modal showing a master work order's bundles — the same table as the
 * details page's Bundle Work Orders tab, opened from the Master Work Orders list.
 * When some cut pieces aren't in a bundle yet, a "Split remaining" button opens
 * the split-batch overlay to bundle them.
 */
export default function MasterWorkOrderBundlesOverlay({
  bundleWorkOrders,
  count,
  masterDisplayId,
  masterWorkOrderId,
  remainingToSplit,
  onDismiss
}: MasterWorkOrderBundlesOverlayProps) {
  // The table's own Print button lives in its header toolbar, which is hidden
  // here (withHeader={false}). Surface the same flow from the overlay footer;
  // the modal's per-bundle checklist stands in for row selection.
  const [printOpen, setPrintOpen] = useState(false);
  const permissions = usePermissions();
  const { openOverlay } = useOverlay();
  const { revalidate } = useRevalidator();
  const canSplit =
    permissions.can("update", "production") && remainingToSplit > 0;

  return (
    <div className={variantsQuantityModalShellClassName}>
      <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
        <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
          <Trans>Bundle Work Orders</Trans>
        </h3>
        {masterDisplayId ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {masterDisplayId}
          </p>
        ) : null}
      </div>
      <div className={variantsQuantityModalBodyClassName}>
        <div className="h-[65vh] w-[85vw] max-w-full">
          <BundleWorkOrdersTable
            data={bundleWorkOrders}
            count={count}
            withHeader={false}
          />
        </div>
      </div>
      <div className="shrink-0 border-t border-border px-6 py-4">
        <HStack className="justify-between">
          <div>
            {canSplit ? (
              <Button
                type="button"
                variant="secondary"
                leftIcon={<LuScissors />}
                onClick={() =>
                  openOverlay(
                    overlay.to.masterWorkOrderSplitBatch({ masterWorkOrderId }),
                    { onCreated: revalidate }
                  )
                }
              >
                <Trans>Split remaining ({remainingToSplit})</Trans>
              </Button>
            ) : null}
          </div>
          <HStack className="justify-end">
            <Button
              type="button"
              variant="secondary"
              leftIcon={<LuPrinter />}
              onClick={() => setPrintOpen(true)}
              isDisabled={bundleWorkOrders.length === 0}
            >
              <Trans>Print Tickets</Trans>
            </Button>
            <Button type="button" variant="primary" onClick={onDismiss}>
              <Trans>Close</Trans>
            </Button>
          </HStack>
        </HStack>
      </div>
      {printOpen ? (
        <PrintBundleTicketsModal
          bundles={bundleWorkOrders}
          onClose={() => setPrintOpen(false)}
        />
      ) : null}
    </div>
  );
}
