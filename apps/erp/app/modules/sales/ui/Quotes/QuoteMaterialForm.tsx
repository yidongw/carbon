import { useCarbon } from "@carbon/auth";
import { ValidatedForm } from "@carbon/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Copy,
  toast,
  VStack
} from "@carbon/react";
import { getItemReadableId } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useCallback, useEffect, useState } from "react";
import { useFetcher, useLocation, useNavigate, useParams } from "react-router";
import type { z } from "zod";
import {
  DefaultMethodType,
  Hidden,
  InputControlled,
  Item,
  NumberControlled,
  Select,
  Submit,
  UnitOfMeasure
} from "~/components/Form";
import { usePermissions, useUrlParams, useUser } from "~/hooks";
import { lookupBuyPrice as lookupBuyPriceAsync } from "~/modules/items";
import { QuantityWithVariantsQuantity } from "~/modules/production/ui/Jobs/QuantityWithVariantsQuantity";
import {
  toVariantsQuantityValue,
  useVariantsQuantityModal
} from "~/modules/production/ui/Jobs/VariantsQuantityModal";
import type { Row } from "~/modules/production/ui/Jobs/variantsQuantityShared";
import {
  getOverlaySuccessVariantTable,
  isVariantsQuantityOverlaySuccess
} from "~/modules/production/variantsQuantityOverlay";
import type { MethodItemType, MethodType } from "~/modules/shared";
import { useItems } from "~/stores";
import { path } from "~/utils/path";
import type { quoteOperationValidator } from "../../sales.models";
import { quoteMaterialValidator } from "../../sales.models";

type QuoteMaterialFormProps = {
  initialValues: z.infer<typeof quoteMaterialValidator> & {
    quoteMaterialMakeMethodId: string | null;
    item?: { replenishmentSystem: string | null } | null;
  };
  operations: z.infer<typeof quoteOperationValidator>[];
};

const QuoteMaterialForm = ({
  initialValues,
  operations
}: QuoteMaterialFormProps) => {
  const { t } = useLingui();
  const fetcher = useFetcher<{ id: string; methodType: MethodType }>();
  const { carbon } = useCarbon();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const { company } = useUser();

  const { quoteId, lineId, materialId } = useParams();
  if (!quoteId) throw new Error("quoteId not found");
  if (!lineId) throw new Error("lineId not found");
  if (!materialId) throw new Error("materialId not found");

  const [itemType, setItemType] = useState<MethodItemType>(
    initialValues.itemType
  );
  const [itemData, setItemData] = useState<{
    itemId: string;
    methodType: MethodType;
    description: string;
    unitCost: number;
    unitOfMeasureCode: string;
    quantity: number;
    itemReplenishmentSystem: string;
    hasVariantAttributes: boolean;
  }>({
    itemId: initialValues.itemId ?? "",
    methodType: initialValues.methodType ?? "Pull from Inventory",
    description: initialValues.description ?? "",
    unitCost: initialValues.unitCost ?? 0,
    unitOfMeasureCode: initialValues.unitOfMeasureCode ?? "EA",
    quantity: initialValues.quantity ?? 1,
    itemReplenishmentSystem: initialValues.item?.replenishmentSystem ?? "Buy",
    hasVariantAttributes: false
  });
  const variantsQuantityModal = useVariantsQuantityModal();
  const [variantsQuantityRows, setVariantsQuantityRows] = useState<
    Row[] | null
  >(null);
  const [variantsQuantityTotal, setVariantsQuantityTotal] = useState(0);
  const hasVariantsQuantity =
    itemData.hasVariantAttributes && Boolean(itemData.itemId);

  const applyVariantsQuantity = (data: unknown) => {
    if (!isVariantsQuantityOverlaySuccess(data)) return;
    setVariantsQuantityRows(getOverlaySuccessVariantTable(data));
    setVariantsQuantityTotal(data.total);
    setItemData((d) => ({ ...d, quantity: data.total }));
  };

  const openVariantsQuantity = () => {
    if (!itemData.itemId) return;
    variantsQuantityModal.open({
      itemId: itemData.itemId,
      variantQuantities: toVariantsQuantityValue(variantsQuantityRows),
      onConfirm: applyVariantsQuantity
    });
  };

  const onTypeChange = (value: MethodItemType | "Item") => {
    if (value === itemType) return;
    setItemType(value as MethodItemType);
    setVariantsQuantityRows(null);
    setVariantsQuantityTotal(0);
    setItemData({
      itemId: "",
      methodType: "" as "Pull from Inventory",
      quantity: 1,
      description: "",
      unitCost: 0,
      unitOfMeasureCode: "EA",
      itemReplenishmentSystem: "Buy",
      hasVariantAttributes: false
    });
  };

  const lookupBuyPrice = useCallback(
    async (itemId: string, qty: number, fallbackCost: number) => {
      return lookupBuyPriceAsync(carbon, itemId, qty, fallbackCost);
    },
    [carbon]
  );

  const onItemChange = async (itemId: string) => {
    if (!carbon) return;

    const [item, itemCost, variantAttributes] = await Promise.all([
      carbon
        .from("item")
        .select(
          "name, readableIdWithRevision, type, unitOfMeasureCode, defaultMethodType, replenishmentSystem"
        )
        .eq("id", itemId)
        .single(),
      carbon.from("itemCost").select("unitCost").eq("itemId", itemId).single(),
      carbon
        .from("itemAttributeSelection")
        .select("attributeValueId")
        .eq("itemId", itemId)
        .eq("companyId", company.id)
        .limit(1)
    ]);

    if (item.error) {
      toast.error(t`Failed to load item details`);
      return;
    }

    const hasVariantAttributes = (variantAttributes?.data?.length ?? 0) > 0;
    setVariantsQuantityRows(null);
    setVariantsQuantityTotal(0);

    let unitCost = itemCost.data?.unitCost ?? 0;
    const isBuyPart = item.data?.defaultMethodType === "Purchase to Order";
    const nextQuantity = hasVariantAttributes ? 0 : (itemData.quantity ?? 1);

    if (isBuyPart && nextQuantity > 0) {
      unitCost = await lookupBuyPrice(itemId, nextQuantity, unitCost);
    }

    setItemData((d) => ({
      ...d,
      itemId,
      description: item.data?.name ?? "",
      unitCost,
      unitOfMeasureCode: item.data?.unitOfMeasureCode ?? "EA",
      methodType: item.data?.defaultMethodType ?? "Purchase to Order",
      itemReplenishmentSystem: item.data?.replenishmentSystem ?? "Buy",
      hasVariantAttributes,
      quantity: nextQuantity
    }));

    if (item.data?.type) {
      setItemType(item.data.type as MethodItemType);
    }
  };

  const onQuantityChange = useCallback(
    async (newQty: number) => {
      setItemData((d) => ({ ...d, quantity: newQty }));

      if (itemData.methodType !== "Purchase to Order" || !itemData.itemId)
        return;
      if (!carbon) return;

      const itemCost = await carbon
        .from("itemCost")
        .select("unitCost")
        .eq("itemId", itemData.itemId)
        .single();

      const fallbackCost = itemCost.data?.unitCost ?? 0;
      const unitCost = await lookupBuyPrice(
        itemData.itemId,
        newQty,
        fallbackCost
      );

      setItemData((d) => ({ ...d, unitCost }));
    },
    [carbon, itemData.methodType, itemData.itemId, lookupBuyPrice]
  );

  const [, setSearchParams] = useUrlParams();

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    const newPath = path.to.quoteLineMakeMethod(
      quoteId,
      lineId,
      initialValues.quoteMaterialMakeMethodId!
    );

    setSearchParams({ materialId: initialValues.id ?? null });
    navigate(newPath);
  }, [
    fetcher.data,
    initialValues,
    initialValues.id,
    initialValues.methodType,
    initialValues.quoteMaterialMakeMethodId,
    lineId,
    location.pathname,
    navigate,
    quoteId
  ]);

  const [items] = useItems();
  const itemReadableId = getItemReadableId(items, itemData.itemId);

  return (
    <>
      <Card>
        <ValidatedForm
          method="post"
          action={path.to.quoteMaterial(quoteId, lineId, initialValues?.id!)}
          defaultValues={initialValues}
          fetcher={fetcher}
          validator={quoteMaterialValidator}
        >
          <CardHeader>
            <CardTitle className="line-clamp-2">
              {itemData.description}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              {itemReadableId} <Copy text={itemReadableId ?? ""} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Hidden name="quoteMakeMethodId" />

            {itemData.methodType === "Make to Order" && (
              <Hidden name="unitCost" value={itemData.unitCost} />
            )}
            <Hidden name="order" />
            <Hidden
              name="variantQuantities"
              value={
                variantsQuantityRows
                  ? JSON.stringify({ variantTable: variantsQuantityRows })
                  : ""
              }
            />
            <VStack className="pt-4">
              <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                <Item
                  name="itemId"
                  label={itemType}
                  type={itemType}
                  includeInactive
                  onChange={(value) => {
                    onItemChange(value?.value as string);
                  }}
                  onTypeChange={onTypeChange}
                />
                <InputControlled
                  name="description"
                  label={t`Description`}
                  value={itemData.description}
                  onChange={(newValue) => {
                    setItemData((d) => ({ ...d, description: newValue }));
                  }}
                />
                <Select
                  name="quoteOperationId"
                  label={t`Operation`}
                  isClearable
                  options={operations.map((o) => ({
                    value: o.id!,
                    label: o.description
                  }))}
                />

                <DefaultMethodType
                  name="methodType"
                  label={t`Method Type`}
                  value={itemData.methodType}
                  replenishmentSystem={itemData.itemReplenishmentSystem}
                />
                {hasVariantsQuantity ? (
                  <QuantityWithVariantsQuantity
                    name="quantity"
                    label={t`Quantity per Parent`}
                    value={itemData.quantity}
                    onChange={onQuantityChange}
                    hasVariantsQuantity={hasVariantsQuantity}
                    onOpenVariantsQuantity={openVariantsQuantity}
                    variantsQuantityTotal={variantsQuantityTotal}
                    isReadOnly={variantsQuantityTotal > 0}
                  />
                ) : (
                  <NumberControlled
                    name="quantity"
                    label={t`Quantity per Parent`}
                    value={itemData.quantity}
                    onChange={onQuantityChange}
                  />
                )}
                <UnitOfMeasure
                  name="unitOfMeasureCode"
                  value={itemData.unitOfMeasureCode}
                  onChange={(newValue) =>
                    setItemData((d) => ({
                      ...d,
                      unitOfMeasureCode: newValue?.value ?? "EA"
                    }))
                  }
                />
                {itemData.methodType !== "Make to Order" && (
                  <NumberControlled
                    name="unitCost"
                    label={t`Unit Cost`}
                    value={itemData.unitCost}
                    minValue={0}
                  />
                )}
              </div>
            </VStack>
          </CardContent>
          <CardFooter>
            <Submit
              isDisabled={
                !permissions.can("update", "sales") ||
                (hasVariantsQuantity && !(itemData.quantity > 0))
              }
            >
              <Trans>Save</Trans>
            </Submit>
          </CardFooter>
        </ValidatedForm>
      </Card>
      {variantsQuantityModal.node}
    </>
  );
};

export default QuoteMaterialForm;
