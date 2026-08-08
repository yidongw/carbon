import { Button, HStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import type { JobOperation } from "~/modules/production";
import {
  variantsQuantityModalBodyClassName,
  variantsQuantityModalShellClassName
} from "../Jobs/configTableShared";
import JobOperationsTable from "../Jobs/JobOperationsTable";

export type BundleWorkOrderProcessesOverlayProps = {
  operations: JobOperation[];
  count: number;
  jobId: string;
  jobStatus?: string;
  bundleDisplayId?: string | null;
} & Pick<OverlayFormInjectedProps, "onDismiss">;

/**
 * Read-only modal showing a bundle work order's processes — the same table as
 * the details page's Processes tab, opened from the Bundle Work Orders list.
 */
export default function BundleWorkOrderProcessesOverlay({
  operations,
  count,
  jobId,
  jobStatus,
  bundleDisplayId,
  onDismiss
}: BundleWorkOrderProcessesOverlayProps) {
  const { t } = useLingui();

  return (
    <div className={variantsQuantityModalShellClassName}>
      <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
        <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
          <Trans>Processes</Trans>
        </h3>
        {bundleDisplayId ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {bundleDisplayId}
          </p>
        ) : null}
      </div>
      <div className={variantsQuantityModalBodyClassName}>
        <div className="h-[65vh] w-[80vw] max-w-full">
          <JobOperationsTable
            data={operations}
            count={count}
            jobId={jobId}
            isPaused={jobStatus === "Paused"}
            title={t`Processes`}
            disableNavigation
            disableInlineEditing
            hideMes
            showAssignee
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
