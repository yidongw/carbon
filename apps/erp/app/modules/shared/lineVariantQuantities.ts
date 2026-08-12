import { useState } from "react";
import {
  toVariantsQuantityValue,
  useVariantsQuantityModal
} from "~/modules/production/ui/Jobs/VariantsQuantityModal";
import type { Row } from "~/modules/production/ui/Jobs/variantsQuantityShared";
import {
  getOverlaySuccessVariantTable,
  isVariantsQuantityOverlaySuccess,
  parseInitialVariantsQuantity
} from "~/modules/production/variantsQuantityOverlay";
import {
  isMissingVariantQuantity,
  shouldShowVariantQuantityGrid
} from "./variantQuantityLine";

type CreateInitialLineVariantQuantitiesStateArgs = {
  initialVariantQuantities: unknown;
  hasVariantAttributes: boolean;
  itemId: string | null | undefined;
  isEditing: boolean;
};

export function createInitialLineVariantQuantitiesState(
  args: CreateInitialLineVariantQuantitiesStateArgs
) {
  const initialConfig = parseInitialVariantsQuantity(
    args.initialVariantQuantities
  );
  const hasVariantsQuantity = shouldShowVariantQuantityGrid({
    hasVariantAttributes: args.hasVariantAttributes,
    itemId: args.itemId,
    isEditing: args.isEditing,
    variantQuantities: args.initialVariantQuantities
  });

  return {
    rows: initialConfig.rows as Row[] | null,
    total: initialConfig.total,
    hasVariantsQuantity,
    isMissingVariantQty: isMissingVariantQuantity(
      hasVariantsQuantity,
      initialConfig.total
    )
  };
}

export function buildLineVariantQuantitiesHiddenValue(rows: Row[] | null) {
  return rows
    ? JSON.stringify({
        variantTable: rows
      })
    : "";
}

type UseLineVariantQuantitiesArgs = {
  initialVariantQuantities: unknown;
  hasVariantAttributes: boolean;
  itemId: string | null | undefined;
  isEditing: boolean;
};

export function useLineVariantQuantities(args: UseLineVariantQuantitiesArgs) {
  const variantsQuantityModal = useVariantsQuantityModal();
  const initialState = createInitialLineVariantQuantitiesState(args);
  const [variantsQuantityRows, setVariantsQuantityRows] = useState<
    Row[] | null
  >(initialState.rows);
  const [variantsQuantityTotal, setVariantsQuantityTotal] = useState(
    initialState.total
  );

  const hasVariantsQuantity = shouldShowVariantQuantityGrid({
    hasVariantAttributes: args.hasVariantAttributes,
    itemId: args.itemId,
    isEditing: args.isEditing,
    variantQuantities: args.initialVariantQuantities
  });

  const isMissingVariantQty = isMissingVariantQuantity(
    hasVariantsQuantity,
    variantsQuantityTotal
  );

  const applyVariantQuantities = (data: unknown) => {
    if (!isVariantsQuantityOverlaySuccess(data)) return;
    setVariantsQuantityRows(getOverlaySuccessVariantTable(data) as Row[]);
    setVariantsQuantityTotal(data.total);
  };

  const openVariantsQuantity = () => {
    if (!args.itemId) return;
    variantsQuantityModal.open({
      itemId: args.itemId,
      variantQuantities: toVariantsQuantityValue(variantsQuantityRows),
      onConfirm: applyVariantQuantities
    });
  };

  const clearVariantsQuantity = () => {
    setVariantsQuantityRows(null);
    setVariantsQuantityTotal(0);
  };

  return {
    variantsQuantityRows,
    variantsQuantityTotal,
    hasVariantsQuantity,
    isMissingVariantQty,
    hiddenVariantQuantitiesValue:
      buildLineVariantQuantitiesHiddenValue(variantsQuantityRows),
    openVariantsQuantity,
    clearVariantsQuantity,
    variantsQuantityModalNode: variantsQuantityModal.node
  };
}
