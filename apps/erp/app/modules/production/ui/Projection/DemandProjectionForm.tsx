import { useCarbon } from "@carbon/auth";
import { ValidatedForm } from "@carbon/form";
import {
  CardDescription,
  CardTitle,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  HStack,
  toast,
  VStack
} from "@carbon/react";
import { getLocalTimeZone, startOfWeek, today } from "@internationalized/date";
import { useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import type { z } from "zod";
import { Hidden, Item, Location, Number, Submit } from "~/components/Form";
import { usePermissions, useUser } from "~/hooks";
import { QuantityWithVariantsQuantity } from "~/modules/production/ui/Jobs/QuantityWithVariantsQuantity";
import { useLineVariantQuantities } from "~/modules/shared";
import type { MethodItemType } from "~/modules/shared/types";
import { path } from "~/utils/path";
import { demandProjectionValidator } from "../../production.models";

type LoaderData = {
  periods?: Array<{ id: string; name: string }>;
  initialValues?: z.infer<typeof demandProjectionValidator>;
};

type DemandProjectionsFormProps = {
  initialValues?: z.infer<typeof demandProjectionValidator>;
  isEditing?: boolean;
  onClose: () => void;
};

const DemandProjectionsForm = ({
  initialValues: propInitialValues,
  isEditing = false,
  onClose
}: DemandProjectionsFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const { carbon } = useCarbon();
  const { company } = useUser();
  const fetcher = useFetcher<{ id: string }>();
  const loaderData = useLoaderData<LoaderData>();
  const periods = loaderData?.periods ?? [];
  const initialValues = loaderData?.initialValues ??
    propInitialValues ?? {
      itemId: "",
      locationId: "",
      ...Object.fromEntries(
        Array.from({ length: 52 }, (_, i) => [`week${i}`, 0])
      )
    };

  const [itemType, setItemType] = useState<MethodItemType | "Item">("Part");
  const [itemId, setItemId] = useState<string>(initialValues.itemId || "");
  // Do not call `Boolean(...)` here — keep clear of any @carbon/form Boolean import.
  const [hasVariantAttributes, setHasVariantAttributes] = useState(
    !!initialValues.variantQuantities
  );

  const {
    variantsQuantityTotal,
    hasVariantsQuantity,
    isMissingVariantQty,
    hiddenVariantQuantitiesValue,
    openVariantsQuantity,
    clearVariantsQuantity,
    variantsQuantityModalNode
  } = useLineVariantQuantities({
    initialVariantQuantities: initialValues.variantQuantities,
    hasVariantAttributes,
    itemId,
    // Style mix is create-only; editing existing SKU projections stays per-item.
    isEditing
  });

  const isDisabled = isEditing
    ? !permissions.can("update", "production")
    : !permissions.can("create", "production");

  // Generate week labels based on periods
  const startDate = startOfWeek(today(getLocalTimeZone()), "en-US");
  const weekLabels = Array.from({ length: 52 }, (_, i) => {
    const weekDate = startDate.add({ weeks: i });
    return `Week ${i + 1} (${weekDate.month}/${weekDate.day})`;
  });

  const onItemChange = async (value: { value: string } | null) => {
    if (!carbon || !value) {
      setItemId("");
      setHasVariantAttributes(false);
      clearVariantsQuantity();
      return;
    }

    setItemId(value.value);
    clearVariantsQuantity();

    const [item, variantAttributes] = await Promise.all([
      carbon
        .from("item")
        .select("type")
        .eq("id", value.value)
        .eq("companyId", company.id)
        .single(),
      carbon
        .from("itemAttributeSelection")
        .select("attributeValueId")
        .eq("itemId", value.value)
        .eq("companyId", company.id)
        .limit(1)
    ]);

    if (item.error) {
      toast.error(t`Failed to load item details`);
      return;
    }

    if (item.data?.type) {
      setItemType(item.data.type as MethodItemType);
    }
    setHasVariantAttributes((variantAttributes?.data?.length ?? 0) > 0);
  };

  return (
    <>
      <Drawer
        open
        onOpenChange={(open) => {
          if (!open) onClose?.();
        }}
      >
        <DrawerContent>
          <ValidatedForm
            validator={demandProjectionValidator}
            method="post"
            action={
              isEditing
                ? path.to.demandProjection(
                    initialValues.itemId!,
                    initialValues.locationId!
                  )
                : path.to.newDemandProjection
            }
            defaultValues={initialValues}
            fetcher={fetcher}
            className="flex flex-col h-full"
          >
            <DrawerHeader>
              <CardTitle>
                {isEditing ? "Edit" : "New"} Production Projection
              </CardTitle>
              <CardDescription>
                Set demand projection values for each week
              </CardDescription>
            </DrawerHeader>
            <DrawerBody>
              <div>
                {/* Hidden fields for periods */}
                {periods?.map((period, index) => (
                  <Hidden
                    key={period.id}
                    name={`periods[${index}]`}
                    value={period.id}
                  />
                ))}
              </div>
              <Hidden
                name="variantQuantities"
                value={hiddenVariantQuantitiesValue}
              />
              <VStack spacing={4}>
                <Item
                  name="itemId"
                  label={t`Item`}
                  type={itemType}
                  replenishmentSystem="Make"
                  isReadOnly={isEditing}
                  locationId={initialValues.locationId || undefined}
                  onTypeChange={(nextType) => {
                    setItemType(nextType);
                    setItemId("");
                    setHasVariantAttributes(false);
                    clearVariantsQuantity();
                  }}
                  onChange={onItemChange}
                />
                <Location
                  name="locationId"
                  label={t`Location`}
                  isReadOnly={isEditing}
                />

                {hasVariantsQuantity ? (
                  <QuantityWithVariantsQuantity
                    name="variantMixTotal"
                    label={t`Variant mix`}
                    value={variantsQuantityTotal}
                    onChange={() => {
                      // Mix totals come from the variant grid only.
                    }}
                    hasVariantsQuantity={hasVariantsQuantity}
                    onOpenVariantsQuantity={openVariantsQuantity}
                    variantsQuantityTotal={variantsQuantityTotal}
                    isReadOnly
                    helperText={t`Mix ratios are applied proportionally to each week's total on save.`}
                  />
                ) : null}

                {weekLabels.map((label, index) => (
                  <Number
                    key={index}
                    name={`week${index}`}
                    label={label}
                    minValue={0}
                  />
                ))}
              </VStack>
            </DrawerBody>

            <DrawerFooter>
              <HStack className="justify-end">
                <Submit
                  isLoading={fetcher.state !== "idle"}
                  isDisabled={
                    fetcher.state !== "idle" ||
                    isDisabled ||
                    isMissingVariantQty
                  }
                >
                  {isEditing ? "Update" : "Create"} Projection
                </Submit>
              </HStack>
            </DrawerFooter>
          </ValidatedForm>
        </DrawerContent>
      </Drawer>
      {variantsQuantityModalNode}
    </>
  );
};

export default DemandProjectionsForm;
