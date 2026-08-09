import type { Json } from "@carbon/database";
import { useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { ItemVariantsQuantityInput } from "~/modules/production/ui/Jobs/ItemVariantsQuantityInput";
import { useVariantsQuantityModal } from "~/modules/production/ui/Jobs/VariantsQuantityModal";
import type { Row } from "~/modules/production/ui/Jobs/variantsQuantityShared";
import {
  getOverlaySuccessVariantTable,
  isVariantsQuantityOverlaySuccess,
  parseInitialVariantsQuantity
} from "~/modules/production/variantsQuantityOverlay";
import { openStyleVariantsQuantityWithInventory } from "./openStyleVariantsQuantityWithInventory";

type StyleLineQuantityInputProps = {
  lineId: string;
  itemId: string;
  value: number;
  variantQuantities?: Json | null;
  /** From-location for inventory variants quantity hints / max caps. Omit on receipts. */
  locationId?: string | null;
  /** Optional bin — scopes inventory hints to that storage unit. */
  storageUnitId?: string | null;
  /** Source SO/PO/job Style plan — preferred over inventory for ship/receive hints. */
  orderVariantQuantities?: Json | null;
  /** Sibling Style line variant quantities (same doc) so remaining caps subtract them. */
  otherLineVariantQuantities?: unknown[];
  /** Hard cap on confirmed grid total (selected source remaining qty). */
  maxTotal?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  /** Match surrounding controls — TransferForm uses `md` (h-10) like SelectTrigger. */
  size?: "sm" | "md" | "lg";
  className?: string;
  onQuantityChange: (args: {
    lineId: string;
    quantity: number;
    variantQuantities: Json | null;
  }) => void;
};

/**
 * Inline shipped/received quantity for Style lines — click opens the variants quantity
 * config modal (same control as production quantity / transfer line forms).
 * When `locationId` is set, cells show on-hand inventory hints (variant SKU
 * breakdown) and Confirm is blocked if any combo exceeds available stock —
 * unless the breakdown is empty, in which case only `maxTotal` caps the total.
 */
export function StyleLineQuantityInput({
  lineId,
  itemId,
  value,
  variantQuantities,
  locationId,
  storageUnitId,
  orderVariantQuantities,
  otherLineVariantQuantities,
  maxTotal,
  isDisabled = false,
  isReadOnly = false,
  size = "sm",
  className,
  onQuantityChange
}: StyleLineQuantityInputProps) {
  const { t } = useLingui();
  const variantsQuantityModal = useVariantsQuantityModal();
  const initialVariantsQuantity =
    parseInitialVariantsQuantity(variantQuantities);
  const [variantsQuantityRows, setVariantsQuantityRows] = useState<
    Row[] | null
  >(initialVariantsQuantity.rows);
  const [variantsQuantityTotal, setVariantsQuantityTotal] = useState(
    initialVariantsQuantity.total
  );
  const [quantity, setQuantity] = useState(value);
  const [opening, setOpening] = useState(false);

  const applyConfig = (data: unknown) => {
    if (!isVariantsQuantityOverlaySuccess(data)) return;
    setVariantsQuantityRows(getOverlaySuccessVariantTable(data));
    setVariantsQuantityTotal(data.total);
    const nextQty = data.total > 0 ? data.total : quantity;
    if (data.total > 0) setQuantity(data.total);
    onQuantityChange({
      lineId,
      quantity: nextQty,
      // Persist combo rows only (valuesKey + Quantities).
      variantQuantities: {
        variantTable: getOverlaySuccessVariantTable(data)
      }
    });
  };

  const openVariantsQuantity = async () => {
    if (!itemId || isDisabled || opening) return;
    setOpening(true);
    try {
      await openStyleVariantsQuantityWithInventory({
        variantsQuantityModal,
        itemId,
        locationId,
        storageUnitId,
        orderVariantQuantities,
        variantsQuantityRows,
        otherLineVariantQuantities,
        maxTotal,
        onConfirm: applyConfig
      });
    } finally {
      setOpening(false);
    }
  };

  return (
    <>
      <div className={className}>
        <ItemVariantsQuantityInput
          id={`style-qty-${lineId}`}
          hideLabel
          value={quantity}
          onChange={setQuantity}
          minValue={0}
          size={size}
          isDisabled={isDisabled || opening}
          isReadOnly={isReadOnly || variantsQuantityTotal > 0}
          hasVariantsQuantity
          onOpenVariantsQuantity={openVariantsQuantity}
          variantsQuantityTotal={variantsQuantityTotal}
          openVariantsQuantityAccessibilityLabel={t`Edit variant quantities`}
        />
      </div>
      {variantsQuantityModal.node}
    </>
  );
}
