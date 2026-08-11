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
import { useLingui } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import { useFetcher, useLocation, useNavigate, useParams } from "react-router";
import type { z } from "zod";
import {
  DefaultMethodType,
  Hidden,
  InputControlled,
  Item,
  Number,
  NumberControlled,
  Select,
  Submit,
  UnitOfMeasure
} from "~/components/Form";
import { usePermissions, useRouteData, useUrlParams, useUser } from "~/hooks";
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
import type { jobOperationValidator } from "../../production.models";
import { isJobLocked, jobMaterialValidator } from "../../production.models";
import type { Job } from "../../types";

type JobMaterialFormProps = {
  initialValues: z.infer<typeof jobMaterialValidator> & {
    jobMaterialMakeMethodId: string | null;
  };
  operations: z.infer<typeof jobOperationValidator>[];
};

const JobMaterialForm = ({
  initialValues,
  operations
}: JobMaterialFormProps) => {
  const fetcher = useFetcher<{ id: string; methodType: MethodType }>();
  const { t } = useLingui();
  const { carbon } = useCarbon();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const { company } = useUser();

  const { jobId, materialId } = useParams();
  if (!jobId) throw new Error("jobId not found");
  if (!materialId) throw new Error("materialId not found");

  const jobData = useRouteData<{ job: Job }>(path.to.job(jobId));

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
    itemReplenishmentSystem: "Buy",
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

    setItemData((d) => ({
      ...d,
      itemId,
      description: item.data?.name ?? "",
      unitCost: itemCost.data?.unitCost ?? 0,
      unitOfMeasureCode: item.data?.unitOfMeasureCode ?? "EA",
      methodType: item.data?.defaultMethodType ?? "Purchase to Order",
      itemReplenishmentSystem: item.data?.replenishmentSystem ?? "Buy",
      hasVariantAttributes,
      quantity: hasVariantAttributes ? 0 : d.quantity || 1
    }));

    if (item.data?.type) {
      setItemType(item.data.type as MethodItemType);
    }
  };

  const [, setSearchParams] = useUrlParams();

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    const newPath = path.to.jobMakeMethod(
      jobId,
      initialValues.jobMakeMethodId!
    );

    setSearchParams({ materialId: initialValues.id ?? null });
    navigate(newPath);
  }, [
    fetcher.data,
    initialValues,
    initialValues.id,
    initialValues.methodType,
    initialValues.jobMaterialMakeMethodId,
    jobId,
    location.pathname,
    navigate
  ]);

  const isDisabled = isJobLocked(jobData?.job?.status);

  const [items] = useItems();
  const itemReadableId = getItemReadableId(items, itemData.itemId);

  return (
    <>
      <Card>
        <ValidatedForm
          method="post"
          action={path.to.jobMaterial(jobId, initialValues?.id!)}
          defaultValues={initialValues}
          fetcher={fetcher}
          validator={jobMaterialValidator}
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
            <Hidden name="jobMakeMethodId" />
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
                  locationId={jobData?.job?.locationId ?? undefined}
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
                  name="jobOperationId"
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
                    onChange={(value) =>
                      setItemData((d) => ({ ...d, quantity: value }))
                    }
                    hasVariantsQuantity={hasVariantsQuantity}
                    onOpenVariantsQuantity={openVariantsQuantity}
                    variantsQuantityTotal={variantsQuantityTotal}
                    isReadOnly={variantsQuantityTotal > 0}
                  />
                ) : (
                  <Number name="quantity" label={t`Quantity per Parent`} />
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
                isDisabled ||
                !permissions.can("update", "production") ||
                (hasVariantsQuantity && !(itemData.quantity > 0))
              }
            >
              Save
            </Submit>
          </CardFooter>
        </ValidatedForm>
      </Card>
      {variantsQuantityModal.node}
    </>
  );
};

export default JobMaterialForm;
