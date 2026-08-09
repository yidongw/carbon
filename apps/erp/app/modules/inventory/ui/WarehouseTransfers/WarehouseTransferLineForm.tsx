import { ValidatedForm } from "@carbon/form";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  toast,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import { useFetcher, useParams } from "react-router";
import { z } from "zod";
import { zfd } from "zod-form-data";
import {
  CustomFormFields,
  Hidden,
  Item,
  Number,
  StorageUnit,
  Submit,
  TextArea
} from "~/components/Form";
import { useConfigurableItems } from "~/components/Form/Item";
import { usePermissions } from "~/hooks";
import { QuantityWithVariantsQuantity } from "~/modules/production/ui/Jobs/QuantityWithVariantsQuantity";
import { useVariantsQuantityModal } from "~/modules/production/ui/Jobs/VariantsQuantityModal";
import type { Row } from "~/modules/production/ui/Jobs/variantsQuantityShared";
import {
  isVariantsQuantityOverlaySuccess,
  parseInitialVariantsQuantity
} from "~/modules/production/variantsQuantityOverlay";
import type { MethodItemType } from "~/modules/shared/types";
import { useItems } from "~/stores/items";
import { path } from "~/utils/path";
import { isWarehouseTransferLocked } from "../../inventory.models";
import type { WarehouseTransfer } from "../../types";
import { openStyleVariantsQuantityWithInventory } from "../openStyleVariantsQuantityWithInventory";

const warehouseTransferLineFormValidator = z.discriminatedUnion("type", [
  z.object({
    id: zfd.text(z.string().optional()),
    type: z.literal("create"),
    transferId: z.string().min(1),
    fromLocationId: z.string().min(1),
    toLocationId: z.string().min(1),
    itemId: z.string().min(1),
    quantity: zfd.numeric(z.number().min(0.0001)),
    fromStorageUnitId: zfd.text(z.string().optional()),
    toStorageUnitId: zfd.text(z.string().optional()),
    notes: zfd.text(z.string().optional()),
    variantQuantities: zfd.text(z.string().optional())
  }),
  z.object({
    type: z.literal("update"),
    id: z.string().min(1),
    transferId: z.string().min(1),
    itemId: z.string().min(1),
    fromLocationId: z.string().min(1),
    toLocationId: z.string().min(1),
    quantity: zfd.numeric(z.number().min(0.0001)),
    fromStorageUnitId: zfd.text(z.string().optional()),
    toStorageUnitId: zfd.text(z.string().optional()),
    notes: zfd.text(z.string().optional()),
    variantQuantities: zfd.text(z.string().optional())
  })
]);

type WarehouseTransferLineFormProps = {
  initialValues: z.infer<typeof warehouseTransferLineFormValidator> & {
    variantQuantities?: string | null;
  };
  warehouseTransfer: WarehouseTransfer;
  onClose: () => void;
};

const WarehouseTransferLineForm = ({
  initialValues,
  warehouseTransfer,
  onClose
}: WarehouseTransferLineFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const { transferId } = useParams();

  if (!transferId) {
    throw new Error("transferId is required");
  }

  const [itemId, setItemId] = useState<string>(
    initialValues.type === "update" ? initialValues.itemId : ""
  );
  const [quantity, setQuantity] = useState<number>(initialValues.quantity ?? 1);
  const [fromStorageUnitId, setFromStorageUnitId] = useState<string>(
    initialValues.fromStorageUnitId ?? ""
  );

  const [items] = useItems();
  const configurableItemIds = useConfigurableItems();
  const [itemType, setItemType] = useState<MethodItemType>(
    // @ts-expect-error - Service
    items.find((item) => item.id === initialValues.itemId)?.type ?? "Item"
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
    setVariantsQuantityRows(data.configuration.configTable);
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
        locationId: warehouseTransfer.fromLocationId,
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
    Boolean(itemId) && configurableItemIds.includes(itemId);
  const hasVariantsQuantity =
    isConfigurableParent && !(isEditing && !initialValues.variantQuantities);
  const isLocked = isWarehouseTransferLocked(warehouseTransfer.status);
  const isDisabled =
    isLocked ||
    (isEditing
      ? !permissions.can("update", "inventory")
      : !permissions.can("create", "inventory"));

  const action = initialValues.id
    ? path.to.warehouseTransferLine(transferId, initialValues.id)
    : path.to.newWarehouseTransferLine(transferId);

  const fetcher = useFetcher<{ success: boolean; message: string }>();

  useEffect(() => {
    if (fetcher.data?.success === false) {
      toast.error(fetcher.data.message);
    }
  }, [fetcher.data?.success, fetcher.data?.message]);

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          defaultValues={initialValues}
          validator={warehouseTransferLineFormValidator}
          method="post"
          action={action}
          className="flex flex-col h-full"
          fetcher={fetcher}
          isDisabled={isDisabled}
        >
          <DrawerHeader>
            <DrawerTitle>
              {isEditing ? t`Edit Transfer Line` : t`New Transfer Line`}
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <Hidden name="transferId" />
            <Hidden name="fromLocationId" />
            <Hidden name="toLocationId" />
            <Hidden name="type" value={isEditing ? "update" : "create"} />
            <Hidden
              name="variantQuantities"
              value={
                variantsQuantityRows
                  ? JSON.stringify({ configTable: variantsQuantityRows })
                  : ""
              }
            />

            <VStack spacing={4}>
              <Item
                name="itemId"
                label={t`Item`}
                type={itemType}
                locationId={warehouseTransfer.fromLocationId}
                onTypeChange={(nextType) => {
                  setItemType(nextType as MethodItemType);
                  clearConfig();
                  setItemId("");
                }}
                value={itemId}
                onChange={(value) => {
                  clearConfig();
                  const nextId = (value?.value as string) ?? "";
                  setItemId(nextId);
                  setQuantity(
                    nextId && configurableItemIds.includes(nextId) ? 0 : 1
                  );
                }}
              />
              {isConfigurableParent ? (
                <QuantityWithVariantsQuantity
                  name="quantity"
                  label={t`Quantity`}
                  minValue={0.0001}
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
                  minValue={0.0001}
                  step={0.0001}
                />
              )}
              <StorageUnit
                name="fromStorageUnitId"
                label={t`From Storage Unit`}
                itemId={itemId ?? undefined}
                locationId={warehouseTransfer.fromLocationId}
                value={fromStorageUnitId || null}
                onChange={(unit) => {
                  setFromStorageUnitId(unit?.id ?? "");
                }}
              />
              <StorageUnit
                name="toStorageUnitId"
                label={t`To Storage Unit`}
                itemId={itemId ?? undefined}
                locationId={warehouseTransfer.toLocationId}
              />
              <TextArea name="notes" label={t`Notes`} rows={3} />
              <CustomFormFields table="warehouseTransferLine" />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit
                isDisabled={isDisabled || fetcher.state !== "idle"}
                isLoading={fetcher.state !== "idle"}
                withBlocker={false}
              >
                Save
              </Submit>
              <Button size="md" variant="solid" onClick={onClose}>
                <Trans>Cancel</Trans>
              </Button>
            </HStack>
          </DrawerFooter>
        </ValidatedForm>
      </DrawerContent>
      {variantsQuantityModal.node}
    </Drawer>
  );
};

export default WarehouseTransferLineForm;
