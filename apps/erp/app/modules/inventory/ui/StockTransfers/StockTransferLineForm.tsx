import { ValidatedForm } from "@carbon/form";
import {
  HStack,
  ModalDrawer,
  ModalDrawerBody,
  ModalDrawerContent,
  ModalDrawerFooter,
  ModalDrawerHeader,
  ModalDrawerProvider,
  ModalDrawerTitle,
  toast,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useFetcher, useParams } from "react-router";
import type { z } from "zod";
import { Hidden, Item, Number, StorageUnit, Submit } from "~/components/Form";
import { useConfigurableItems } from "~/components/Form/Item";
import { usePermissions, useRouteData } from "~/hooks";
import {
  isStockTransferLocked,
  type StockTransfer,
  stockTransferLineValidator
} from "~/modules/inventory";
import { QuantityWithVariantsQuantity } from "~/modules/production/ui/Jobs/QuantityWithVariantsQuantity";
import { useVariantsQuantityModal } from "~/modules/production/ui/Jobs/VariantsQuantityModal";
import type { Row } from "~/modules/production/ui/Jobs/variantsQuantityShared";
import {
  getOverlaySuccessVariantTable,
  isVariantsQuantityOverlaySuccess,
  parseInitialVariantsQuantity
} from "~/modules/production/variantsQuantityOverlay";
import type { MethodItemType } from "~/modules/shared/types";
import { useItems } from "~/stores/items";
import { path } from "~/utils/path";
import { openStyleVariantsQuantityWithInventory } from "../openStyleVariantsQuantityWithInventory";

type StockTransferLineFormProps = {
  initialValues: z.infer<typeof stockTransferLineValidator> & {
    variantQuantities?: string | null;
  };
  locationId: string;
  type?: "modal" | "drawer";
  open?: boolean;
  onClose: (data?: { id: string; name: string }) => void;
};

const StockTransferLineForm = ({
  initialValues,
  locationId,
  open = true,
  type = "drawer",
  onClose
}: StockTransferLineFormProps) => {
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  const permissions = usePermissions();
  const { t } = useLingui();
  const routeData = useRouteData<{
    stockTransfer: StockTransfer;
  }>(path.to.stockTransfer(id));
  const fetcher = useFetcher<PostgrestResponse<{ id: string }>>();
  const [items] = useItems();
  const configurableItemIds = useConfigurableItems();
  const [itemId, setItemId] = useState<string | null>(
    initialValues.itemId ?? null
  );
  const [quantity, setQuantity] = useState<number>(initialValues.quantity ?? 1);
  const [fromStorageUnitId, setFromStorageUnitId] = useState<string>(
    initialValues.fromStorageUnitId ?? ""
  );

  const [itemType, setItemType] = useState<MethodItemType | "Item">(() => {
    if (initialValues.itemId) {
      return (
        (items.find((item) => item.id === initialValues.itemId)
          ?.type as MethodItemType) ?? "Item"
      );
    }
    return "Item";
  });

  const [itemTrackingType, setItemTrackingType] = useState<string | null>(
    () => {
      if (initialValues.itemId) {
        return (
          items.find((item) => item.id === initialValues.itemId)
            ?.itemTrackingType ?? null
        );
      }
      return null;
    }
  );

  const variantsQuantityModal = useVariantsQuantityModal();
  const initialConfig = parseInitialVariantsQuantity(
    initialValues.variantQuantities
  );
  const [variantsQuantityRows, setVariantsQuantityRows] = useState<
    Row[] | null
  >(initialConfig.rows);
  const [variantsQuantityTotal, setVariantsQuantityTotal] = useState(
    initialConfig.total
  );
  const [openingConfig, setOpeningConfig] = useState(false);

  const clearConfig = () => {
    setVariantsQuantityRows(null);
    setVariantsQuantityTotal(0);
  };

  const applyConfig = (data: unknown) => {
    if (!isVariantsQuantityOverlaySuccess(data)) return;
    setVariantsQuantityRows(getOverlaySuccessVariantTable(data));
    setVariantsQuantityTotal(data.total);
    if (data.total > 0) setQuantity(data.total);
  };

  const openVariantsQuantity = async () => {
    if (!itemId || openingConfig) return;
    setOpeningConfig(true);
    try {
      // Sibling otherLineVariantQuantities omitted — line drawer edits one line.
      await openStyleVariantsQuantityWithInventory({
        variantsQuantityModal,
        itemId,
        locationId,
        storageUnitId: fromStorageUnitId || null,
        variantsQuantityRows,
        onConfirm: applyConfig
      });
    } finally {
      setOpeningConfig(false);
    }
  };

  const isEditing = initialValues.id !== undefined;
  // Configurable parent (any item with attrs / variants quantity) → qty grid.
  // Variant SKU lines (already expanded, no stored variant quantities) → plain qty.
  const isConfigurableParent =
    Boolean(itemId) && configurableItemIds.includes(itemId!);
  const hasVariantsQuantity =
    isConfigurableParent && !(isEditing && !initialValues.variantQuantities);

  const onTypeChange = (t: MethodItemType | "Item") => {
    setItemType(t);
    setItemId(null);
    clearConfig();
  };

  const onItemChange = (nextItemId: string) => {
    clearConfig();
    setItemId(nextItemId);
    const item = items.find((item) => item.id === nextItemId);
    const nextType = (item?.type as MethodItemType) ?? "Item";
    const trackingType = item?.itemTrackingType ?? null;
    setItemType(nextType);
    setItemTrackingType(trackingType);
    // Configurable parents start at 0 until the attribute grid is confirmed.
    setQuantity(configurableItemIds.includes(nextItemId) ? 0 : 1);
  };

  useEffect(() => {
    if (type !== "modal") return;

    if (fetcher.state === "loading" && fetcher.data?.data) {
      onClose?.();
      toast.success(t`Created stock transfer line`);
    } else if (fetcher.state === "idle" && fetcher.data?.error) {
      toast.error(
        t`Failed to create stock transfer line: ${fetcher.data.error.message}`
      );
    }
  }, [fetcher.data, fetcher.state, onClose, type, t]);

  const isLocked = isStockTransferLocked(routeData?.stockTransfer?.status);
  const isDisabled =
    isLocked ||
    (isEditing
      ? !permissions.can("update", "inventory")
      : !permissions.can("create", "inventory"));

  return (
    <ModalDrawerProvider type={type}>
      <ModalDrawer
        open={open}
        onOpenChange={(open) => {
          if (!open) onClose?.();
        }}
      >
        <ModalDrawerContent>
          <ValidatedForm
            validator={stockTransferLineValidator}
            method="post"
            action={
              isEditing
                ? path.to.stockTransferLine(id, initialValues.id!)
                : path.to.newStockTransferLine(id)
            }
            defaultValues={initialValues}
            fetcher={fetcher}
            className="flex flex-col h-full"
          >
            <ModalDrawerHeader>
              <ModalDrawerTitle>
                {isEditing ? t`Edit Line` : t`New Line`}
              </ModalDrawerTitle>
            </ModalDrawerHeader>
            <ModalDrawerBody>
              <Hidden name="id" />
              <Hidden name="stockTransferId" />
              <Hidden
                name="requiresSerialTracking"
                value={itemTrackingType === "Serial" ? "true" : "false"}
              />
              <Hidden
                name="requiresBatchTracking"
                value={itemTrackingType === "Batch" ? "true" : "false"}
              />
              <Hidden
                name="variantQuantities"
                value={
                  variantsQuantityRows
                    ? JSON.stringify({ variantTable: variantsQuantityRows })
                    : ""
                }
              />
              <VStack spacing={4}>
                <Item
                  name="itemId"
                  label={itemType}
                  // @ts-ignore
                  type={itemType}
                  locationId={locationId}
                  onTypeChange={onTypeChange}
                  onChange={(value) => {
                    onItemChange(value?.value as string);
                  }}
                  value={itemId ?? undefined}
                />
                {isConfigurableParent ? (
                  <QuantityWithVariantsQuantity
                    name="quantity"
                    label={t`Quantity`}
                    minValue={0}
                    value={quantity}
                    onChange={setQuantity}
                    hasVariantsQuantity={hasVariantsQuantity}
                    onOpenVariantsQuantity={
                      hasVariantsQuantity ? openVariantsQuantity : undefined
                    }
                    variantsQuantityTotal={variantsQuantityTotal}
                    isReadOnly={hasVariantsQuantity}
                  />
                ) : (
                  <Number
                    name="quantity"
                    label={t`Quantity`}
                    minValue={itemTrackingType === "Serial" ? 1 : 0}
                    maxValue={itemTrackingType === "Serial" ? 1 : undefined}
                    defaultValue={itemTrackingType === "Serial" ? 1 : undefined}
                  />
                )}
                <StorageUnit
                  name="fromStorageUnitId"
                  label={t`From Storage Unit`}
                  locationId={locationId}
                  itemId={itemId ?? undefined}
                  value={fromStorageUnitId || null}
                  onChange={(unit) => {
                    setFromStorageUnitId(unit?.id ?? "");
                  }}
                />
                <StorageUnit
                  name="toStorageUnitId"
                  label={t`To Storage Unit`}
                  locationId={locationId}
                  itemId={itemId ?? undefined}
                />
              </VStack>
            </ModalDrawerBody>
            <ModalDrawerFooter>
              <HStack>
                <Submit isDisabled={isDisabled}>
                  <Trans>Save</Trans>
                </Submit>
              </HStack>
            </ModalDrawerFooter>
          </ValidatedForm>
        </ModalDrawerContent>
        {variantsQuantityModal.node}
      </ModalDrawer>
    </ModalDrawerProvider>
  );
};

export default StockTransferLineForm;
