import { Button, HStack } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import type { BundleWorkOrder } from "~/modules/production";
import {
  configParamsModalBodyClassName,
  configParamsModalShellClassName
} from "../Jobs/configTableShared";
import BundleWorkOrdersTable from "./BundleWorkOrdersTable";

export type MasterWorkOrderBundlesOverlayProps = {
  bundleWorkOrders: BundleWorkOrder[];
  count: number;
  masterDisplayId?: string | null;
} & Pick<OverlayFormInjectedProps, "onDismiss">;

/**
 * Read-only modal showing a master work order's bundles — the same table as the
 * details page's Bundle Work Orders tab, opened from the Master Work Orders list.
 */
export default function MasterWorkOrderBundlesOverlay({
  bundleWorkOrders,
  count,
  masterDisplayId,
  onDismiss
}: MasterWorkOrderBundlesOverlayProps) {
  return (
    <div className={configParamsModalShellClassName}>
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
      <div className={configParamsModalBodyClassName}>
        <div className="h-[65vh] w-[85vw] max-w-full">
          <BundleWorkOrdersTable
            data={bundleWorkOrders}
            count={count}
            withHeader={false}
          />
        </div>
      </div>
      <div className="shrink-0 border-t border-border px-6 py-4">
        <HStack className="justify-end">
          <Button type="button" variant="primary" onClick={onDismiss}>
            <Trans>Close</Trans>
          </Button>
        </HStack>
      </div>
    </div>
  );
}
