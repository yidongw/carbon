import { useCarbon } from "@carbon/auth";
import { ValidatedForm } from "@carbon/form";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Combobox,
  HStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import type { z } from "zod";
import {
  CustomFormFields,
  Hidden,
  Number,
  Select as SelectForm,
  Submit
} from "~/components/Form";
import { usePermissions, useUser } from "~/hooks";
import { QuantityWithVariantsQuantity } from "~/modules/production/ui/Jobs/QuantityWithVariantsQuantity";
import { useLineVariantQuantities } from "~/modules/shared";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";
import {
  itemPlanningValidator,
  itemReorderingPolicies
} from "../../items.models";
import { ItemReorderPolicy } from "./ItemReorderPolicy";

type ItemPlanningFormProps = {
  initialValues: z.infer<typeof itemPlanningValidator>;
  locations: ListItem[];
  type: "Part" | "Material" | "Tool" | "Consumable" | "Style";
};

const ItemPlanningForm = ({
  initialValues,
  locations,
  type
}: ItemPlanningFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const { carbon } = useCarbon();
  const { company } = useUser();

  const locationOptions = locations.map((location) => ({
    label: location.name,
    value: location.id
  }));

  const [policy, setPolicy] = useState(initialValues.reorderingPolicy);
  const [hasVariantAttributes, setHasVariantAttributes] = useState(
    !!initialValues.variantQuantities
  );

  const {
    variantsQuantityTotal,
    hasVariantsQuantity,
    isMissingVariantQty,
    hiddenVariantQuantitiesValue,
    openVariantsQuantity,
    variantsQuantityModalNode
  } = useLineVariantQuantities({
    initialVariantQuantities: initialValues.variantQuantities,
    hasVariantAttributes,
    itemId: initialValues.itemId,
    // Parent planning is the mix surface even when updating an existing row.
    isEditing: false
  });

  useEffect(() => {
    let cancelled = false;
    if (!carbon || !initialValues.itemId) return;

    void Promise.all([
      carbon
        .from("itemAttributeSelection")
        .select("attributeValueId")
        .eq("itemId", initialValues.itemId)
        .eq("companyId", company.id)
        .limit(1),
      carbon
        .from("itemVariant")
        .select("variantItemId")
        .eq("parentItemId", initialValues.itemId)
        .eq("companyId", company.id)
        .limit(1)
    ]).then(([selections, variants]) => {
      if (cancelled) return;
      setHasVariantAttributes(
        (selections.data?.length ?? 0) > 0 || (variants.data?.length ?? 0) > 0
      );
    });

    return () => {
      cancelled = true;
    };
  }, [carbon, company.id, initialValues.itemId]);

  return (
    <Card>
      <ValidatedForm
        method="post"
        validator={itemPlanningValidator}
        defaultValues={initialValues}
      >
        <HStack className="w-full justify-between items-start">
          <CardHeader>
            <CardTitle>
              <Trans>Planning</Trans>
            </CardTitle>
            {hasVariantsQuantity && (
              <CardDescription>
                <Trans>
                  Mix ratios split safety stock, reorder point, reorder
                  quantity, and max inventory across variant SKUs. Policy and
                  lot size stay the same.
                </Trans>
              </CardDescription>
            )}
          </CardHeader>
          <CardAction>
            <Combobox
              size="sm"
              value={initialValues.locationId}
              options={locationOptions}
              onChange={(selected) => {
                // hard refresh because initialValues update has no effect otherwise
                window.location.href = window.location.href = getLocationPath(
                  initialValues.itemId,
                  selected,
                  type
                );
              }}
            />
          </CardAction>
        </HStack>
        <CardContent>
          <Hidden name="itemId" />
          <Hidden name="locationId" />
          <Hidden
            name="variantQuantities"
            value={hiddenVariantQuantitiesValue}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
            <SelectForm
              name="reorderingPolicy"
              label={t`Reordering Policy`}
              options={itemReorderingPolicies.map((policy) => ({
                label: <ItemReorderPolicy reorderingPolicy={policy} />,
                value: policy
              }))}
              onChange={(selected) => {
                // @ts-ignore
                setPolicy(selected?.value || "Manual Reorder");
              }}
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
                helperText={t`Mix ratios split stock targets across SKUs on save. Policy and lot size copy as-is.`}
              />
            ) : null}
            {policy === "Maximum Quantity" && (
              <>
                <Number
                  name="reorderPoint"
                  label={t`Reorder Point`}
                  minValue={0}
                />
                <Number
                  name="maximumInventoryQuantity"
                  label={t`Maximum Inventory Quantity`}
                  minValue={0}
                />
              </>
            )}

            {policy === "Demand-Based Reorder" && (
              <>
                <Number
                  name="demandAccumulationPeriod"
                  label={t`Accumulation Period (Weeks)`}
                  minValue={0}
                />
                <Number
                  name="demandAccumulationSafetyStock"
                  label={t`Safety Stock`}
                  minValue={0}
                />
              </>
            )}
            {policy === "Fixed Reorder Quantity" && (
              <>
                <Number
                  name="reorderPoint"
                  label={t`Reorder Point`}
                  minValue={0}
                />
                <Number
                  name="reorderQuantity"
                  label={t`Reorder Quantity`}
                  minValue={0}
                />
              </>
            )}
            {policy !== "Fixed Reorder Quantity" && (
              <>
                <Number
                  name="orderMultiple"
                  label={t`Order Multiple`}
                  minValue={0}
                />
                <Number
                  name="minimumOrderQuantity"
                  label={t`Minimum Order Quantity`}
                  minValue={0}
                />
                <Number
                  name="maximumOrderQuantity"
                  label={t`Maximum Order Quantity`}
                  minValue={0}
                />
              </>
            )}
            {/* <Boolean name="critical" label={t`Critical`} /> */}

            <CustomFormFields table="itemPlanning" />
          </div>
        </CardContent>
        <CardFooter>
          <Submit
            isDisabled={
              !permissions.can("update", "parts") || isMissingVariantQty
            }
          >
            <Trans>Save</Trans>
          </Submit>
        </CardFooter>
      </ValidatedForm>
      {variantsQuantityModalNode}
    </Card>
  );
};

export default ItemPlanningForm;

function getLocationPath(
  itemId: string,
  locationId: string,
  type: "Part" | "Material" | "Tool" | "Consumable" | "Style"
) {
  switch (type) {
    case "Part":
      return `${path.to.partPlanning(itemId)}?location=${locationId}`;
    case "Material":
      return `${path.to.materialPlanning(itemId)}?location=${locationId}`;
    case "Tool":
      return `${path.to.toolPlanning(itemId)}?location=${locationId}`;
    case "Consumable":
      return `${path.to.consumablePlanning(itemId)}?location=${locationId}`;
    case "Style":
      return `${path.to.stylePlanning(itemId)}?location=${locationId}`;
    default:
      throw new Error(`Invalid item type: ${type}`);
  }
}
