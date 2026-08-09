import {
  buildInventoryVariantsQuantityReferenceContext,
  EMPTY_VARIANT_QUANTITIES,
  type VariantQuantitiesPayload
} from "~/modules/inventory/styleInventoryConfig";
import type { useVariantsQuantityModal } from "~/modules/production/ui/Jobs/VariantsQuantityModal";
import type { Row } from "~/modules/production/ui/Jobs/variantsQuantityShared";
import { path } from "~/utils/path";

async function loadInventoryVariantQuantities(
  itemId: string,
  locationId: string,
  storageUnitId?: string | null
): Promise<VariantQuantitiesPayload | null> {
  try {
    const res = await fetch(
      path.to.api.styleOnHand(itemId, locationId, storageUnitId)
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      variantQuantities?: VariantQuantitiesPayload | null;
    };
    return data.variantQuantities ?? null;
  } catch {
    return null;
  }
}

/**
 * Open the Style config modal with variants quantity / combo hints + max caps.
 * Prefer `orderVariantQuantities` (SO/PO/job plan) when present so ship/receive
 * shows what was ordered; otherwise load on-hand inventory (including Style
 * variant child ledgers). Cap total with `maxTotal` when the selected transfer
 * source quantity is known.
 *
 * When on-hand has no combo breakdown, hints are 0 and per-cell caps are not
 * enforced (user can still assign variants quantity up to `maxTotal`).
 */
export async function openStyleVariantsQuantityWithInventory({
  variantsQuantityModal,
  itemId,
  locationId,
  storageUnitId,
  orderVariantQuantities,
  variantsQuantityRows,
  otherLineVariantQuantities = [],
  maxTotal,
  onConfirm
}: {
  variantsQuantityModal: ReturnType<typeof useVariantsQuantityModal>;
  itemId: string;
  locationId?: string | null;
  storageUnitId?: string | null;
  orderVariantQuantities?: unknown;
  variantsQuantityRows: Row[] | null;
  otherLineVariantQuantities?: unknown[];
  /** Hard cap on confirmed grid total (selected source remaining qty). */
  maxTotal?: number;
  onConfirm: (data: unknown) => void;
}) {
  let inventoryVariantQuantities: VariantQuantitiesPayload | null = null;
  let enforceReferenceCaps = true;

  if (!orderVariantQuantities && locationId) {
    inventoryVariantQuantities =
      (await loadInventoryVariantQuantities(
        itemId,
        locationId,
        storageUnitId
      )) ?? EMPTY_VARIANT_QUANTITIES;
    // Empty tagged/variant breakdown → 0 hints; don't block typing into cells.
    enforceReferenceCaps =
      (inventoryVariantQuantities.configTable?.length ?? 0) > 0;
  }

  const referenceVariantQuantities =
    (orderVariantQuantities as VariantQuantitiesPayload | null | undefined) ??
    inventoryVariantQuantities;

  variantsQuantityModal.open({
    itemId,
    // Combo rows only — modal derives quantity keys from item parameters.
    configuration: variantsQuantityRows
      ? { configTable: variantsQuantityRows }
      : undefined,
    maxTotal,
    enforceReferenceCaps,
    buildReferenceContext: referenceVariantQuantities
      ? () =>
          buildInventoryVariantsQuantityReferenceContext({
            variantQuantities: referenceVariantQuantities,
            otherLineVariantQuantities
          })
      : undefined,
    onConfirm
  });
}
