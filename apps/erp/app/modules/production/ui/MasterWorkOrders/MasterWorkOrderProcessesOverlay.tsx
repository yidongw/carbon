import { Button, HStack } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import type { MasterProcess } from "~/modules/production";
import {
  variantsQuantityModalBodyClassName,
  variantsQuantityModalShellClassName
} from "../Jobs/configTableShared";
import MasterProcessesTable from "./MasterProcessesTable";

export type MasterWorkOrderProcessesOverlayProps = {
  processes: MasterProcess[];
  masterDisplayId?: string | null;
} & Pick<OverlayFormInjectedProps, "onDismiss">;

/**
 * Read-only modal showing a master work order's processes — the same table as
 * the details page's Processes tab, opened from the Master Work Orders list.
 */
export default function MasterWorkOrderProcessesOverlay({
  processes,
  masterDisplayId,
  onDismiss
}: MasterWorkOrderProcessesOverlayProps) {
  return (
    <div className={variantsQuantityModalShellClassName}>
      <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
        <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
          <Trans>Processes</Trans>
        </h3>
        {masterDisplayId ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {masterDisplayId}
          </p>
        ) : null}
      </div>
      <div className={variantsQuantityModalBodyClassName}>
        <div className="h-[65vh] w-[80vw] max-w-full">
          <MasterProcessesTable data={processes} withHeader={false} />
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
