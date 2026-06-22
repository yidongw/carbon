import { cn, HStack, IconButton, VStack } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { MouseEvent } from "react";
import { LuTable } from "react-icons/lu";
import { Hyperlink } from "~/components";
import { overlay, useOverlay } from "~/components/Overlay";
import {
  getItemInternalId,
  getItemName,
  getItemReadableIdWithRevision,
  getJobInternalId,
  getJobReadableId,
  hasConfigurationTable,
  type ProductionQuantityJobOperationRow
} from "~/modules/production/productionQuantityDisplay.utils";
import { path } from "~/utils/path";

export type ProductionQuantityTableRowLike = ProductionQuantityJobOperationRow & {
  jobId?: string | null;
  itemId?: string | null;
  configuration?: unknown;
};

function stopRowNavigation(event: MouseEvent) {
  event.stopPropagation();
}

export function ProductionQuantityTableJobCell({
  row
}: {
  row: ProductionQuantityTableRowLike;
}) {
  const jobInternalId = getJobInternalId(row);
  const label = getJobReadableId(row);

  if (!jobInternalId) {
    return <span className="font-mono text-sm font-medium">{label}</span>;
  }

  return (
    <Hyperlink
      to={path.to.job(jobInternalId)}
      className="font-mono text-sm font-medium"
      onClick={stopRowNavigation}
    >
      {label}
    </Hyperlink>
  );
}

export function ProductionQuantityTableItemCell({
  row
}: {
  row: ProductionQuantityTableRowLike;
}) {
  const itemInternalId = getItemInternalId(row);
  const readableId = getItemReadableIdWithRevision(row);
  const name = getItemName(row) || "—";

  const content = (
    <VStack spacing={0}>
      <span className="text-sm font-medium">{readableId}</span>
      <div className="w-full truncate text-muted-foreground text-xs">{name}</div>
    </VStack>
  );

  if (!itemInternalId) {
    return content;
  }

  return (
    <Hyperlink to={path.to.part(itemInternalId)} onClick={stopRowNavigation}>
      {content}
    </Hyperlink>
  );
}

export function ProductionQuantityTableQuantityCell({
  row,
  configurableItemIds
}: {
  row: ProductionQuantityTableRowLike;
  configurableItemIds?: Set<string>;
}) {
  const { t } = useLingui();
  const { openOverlay } = useOverlay();
  const itemId = getItemInternalId(row);
  const quantity = row.quantity ?? 0;
  const showConfiguredQuantityUi =
    hasConfigurationTable(row.configuration) ||
    Boolean(itemId && configurableItemIds?.has(itemId));

  const openConfigTable = (event: MouseEvent) => {
    event.stopPropagation();
    if (!itemId) return;
    openOverlay(
      overlay.to.itemConfigTable(
        itemId,
        row.configuration !== undefined && row.configuration !== null
          ? { configuration: row.configuration }
          : undefined
      )
    );
  };

  if (!showConfiguredQuantityUi) {
    return <span className="tabular-nums">{quantity}</span>;
  }

  return (
    <HStack spacing={1} className="justify-end">
      <span className="tabular-nums">{quantity}</span>
      <IconButton
        type="button"
        icon={<LuTable size="1em" strokeWidth={3} />}
        aria-label={t`View configuration parameters`}
        size="sm"
        variant="secondary"
        className={cn(
          hasConfigurationTable(row.configuration) &&
            "text-emerald-500 hover:text-emerald-500"
        )}
        onClick={openConfigTable}
      />
    </HStack>
  );
}
