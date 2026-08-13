import { useCarbon } from "@carbon/auth";
import { ValidatedForm } from "@carbon/form";
import {
  Badge,
  CardAction,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  ModalCard,
  ModalCardBody,
  ModalCardContent,
  ModalCardDescription,
  ModalCardFooter,
  ModalCardHeader,
  ModalCardProvider,
  ModalCardTitle,
  toast,
  useDisclosure,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuTrash } from "react-icons/lu";
import { useFetcher, useParams } from "react-router";
import type { z } from "zod";
import {
  ArrayNumeric,
  ConversionFactor,
  CustomFormFields,
  Hidden,
  InputControlled,
  Item,
  Submit,
  UnitOfMeasure
} from "~/components/Form";
import { usePermissions, useRouteData, useUser } from "~/hooks";
import { QuantityWithVariantsQuantity } from "~/modules/production/ui/Jobs/QuantityWithVariantsQuantity";
import { useLineVariantQuantities } from "~/modules/shared";
import type { MethodItemType } from "~/modules/shared/types";
import type { action } from "~/routes/x+/purchasing-rfq+/$rfqId.$lineId.details";
import { path } from "~/utils/path";
import {
  isRfqLocked,
  purchasingRfqLineValidator
} from "../../purchasing.models";
import type { PurchasingRFQ, PurchasingRFQLine } from "../../types";
import DeletePurchasingRFQLine from "./DeletePurchasingRFQLine";

type PurchasingRFQLineFormProps = {
  initialValues: z.infer<typeof purchasingRfqLineValidator> & {
    itemType: MethodItemType;
  };
  type?: "card" | "modal";
  onClose?: () => void;
};

const PurchasingRFQLineForm = ({
  initialValues,
  type,
  onClose
}: PurchasingRFQLineFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const { company } = useUser();
  const { carbon } = useCarbon();

  const { rfqId } = useParams();
  const fetcher = useFetcher<typeof action>();

  if (!rfqId) throw new Error("rfqId not found");

  const routeData = useRouteData<{
    rfqSummary: PurchasingRFQ;
  }>(path.to.purchasingRfq(rfqId));

  const isLocked = isRfqLocked(routeData?.rfqSummary?.status);

  const isEditing = initialValues.id !== undefined;

  const [itemType, setItemType] = useState<MethodItemType>(
    initialValues.itemType
  );
  const [itemData, setItemData] = useState<{
    itemId: string;
    itemReadableId: string;
    description: string;
    inventoryUom: string;
    purchaseUom: string;
    conversionFactor: number;
    hasVariantAttributes: boolean;
  }>({
    itemId: initialValues.itemId ?? "",
    itemReadableId: "",
    description: initialValues.description ?? "",
    inventoryUom: initialValues.inventoryUnitOfMeasureCode ?? "",
    purchaseUom: initialValues.purchaseUnitOfMeasureCode ?? "",
    conversionFactor: initialValues.conversionFactor ?? 1,
    hasVariantAttributes: !!initialValues.variantQuantities
  });

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
    hasVariantAttributes: itemData.hasVariantAttributes,
    itemId: itemData.itemId,
    isEditing
  });

  const onItemChange = async (itemId: string) => {
    if (!carbon) return;
    clearVariantsQuantity();

    const [item, variantAttributes] = await Promise.all([
      carbon
        .from("item")
        .select("name, readableIdWithRevision, type, unitOfMeasureCode")
        .eq("id", itemId)
        .eq("companyId", company.id)
        .single(),
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

    const newItemData = {
      ...itemData,
      itemId,
      itemReadableId: item.data?.readableIdWithRevision ?? "",
      description: item.data?.name ?? "",
      inventoryUom: item.data?.unitOfMeasureCode ?? "EA",
      purchaseUom: item.data?.unitOfMeasureCode ?? "EA",
      conversionFactor: 1,
      hasVariantAttributes
    };

    setItemData(newItemData);
    if (item.data?.type) {
      setItemType(item.data.type as MethodItemType);
    }
  };

  const deleteDisclosure = useDisclosure();

  return (
    <>
      <ModalCardProvider type={type}>
        <ModalCard
          onClose={onClose}
          isCollapsible={isEditing}
          defaultCollapsed={false}
        >
          <ModalCardContent>
            <ValidatedForm
              defaultValues={initialValues}
              validator={purchasingRfqLineValidator}
              method="post"
              action={
                isEditing
                  ? path.to.purchasingRfqLine(rfqId, initialValues.id!)
                  : path.to.newPurchasingRFQLine(rfqId)
              }
              className="w-full"
              fetcher={fetcher}
              isDisabled={isEditing && isLocked}
              onSuccess={type === "modal" ? onClose : undefined}
            >
              <HStack className="w-full justify-between items-start">
                <ModalCardHeader>
                  <ModalCardTitle>
                    {isEditing
                      ? itemData?.itemReadableId || "RFQ Line"
                      : "New RFQ Line"}
                  </ModalCardTitle>
                  <ModalCardDescription>
                    {isEditing ? (
                      <div className="flex flex-col items-start gap-1">
                        <span>{itemData?.description}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {initialValues?.quantity?.join(", ")}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      "An RFQ line contains part and quantity information about the requested item"
                    )}
                  </ModalCardDescription>
                </ModalCardHeader>
                {isEditing &&
                  !isLocked &&
                  permissions.can("update", "purchasing") && (
                    <CardAction className="pr-12">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton
                            icon={<BsThreeDotsVertical />}
                            aria-label={t`More`}
                            variant="ghost"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={deleteDisclosure.onOpen}>
                            <DropdownMenuIcon icon={<LuTrash />} />
                            <Trans>Delete Line</Trans>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardAction>
                  )}
              </HStack>
              <ModalCardBody>
                <Hidden name="id" />
                <Hidden name="purchasingRfqId" />
                <Hidden name="order" />
                <Hidden
                  name="inventoryUnitOfMeasureCode"
                  value={itemData?.inventoryUom}
                />
                {itemData.hasVariantAttributes && (
                  <Hidden
                    name="variantQuantities"
                    value={hiddenVariantQuantitiesValue}
                  />
                )}
                <VStack>
                  <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                    {/* Avoid col-span-2 on mobile — it opens an implicit 2nd track. */}
                    <div className="col-span-1 lg:col-span-2 grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-2 auto-rows-min">
                      <Item
                        autoFocus
                        name="itemId"
                        label={itemType}
                        type={itemType}
                        value={itemData.itemId}
                        includeInactive
                        locationId={
                          routeData?.rfqSummary?.locationId ?? undefined
                        }
                        onChange={(value) => {
                          onItemChange(value?.value as string);
                        }}
                        onTypeChange={(type) => {
                          clearVariantsQuantity();
                          setItemType(type as MethodItemType);
                          setItemData({
                            ...itemData,
                            itemId: "",
                            description: "",
                            inventoryUom: "",
                            purchaseUom: "",
                            conversionFactor: 1,
                            hasVariantAttributes: false
                          });
                        }}
                      />
                      <InputControlled
                        name="description"
                        label={t`Description`}
                        value={itemData.description}
                        isReadOnly={!!itemData.itemId}
                      />
                      <UnitOfMeasure
                        name="purchaseUnitOfMeasureCode"
                        label={t`Purchase Unit of Measure`}
                        value={itemData.purchaseUom}
                        onChange={(newValue) =>
                          setItemData((d) => ({
                            ...d,
                            purchaseUom: newValue?.value ?? "EA"
                          }))
                        }
                      />
                      <ConversionFactor
                        name="conversionFactor"
                        purchasingCode={itemData.purchaseUom}
                        inventoryCode={itemData.inventoryUom}
                        value={itemData.conversionFactor}
                        onChange={(value) => {
                          setItemData((d) => ({
                            ...d,
                            conversionFactor: value
                          }));
                        }}
                      />

                      <CustomFormFields table="purchasingRfqLine" />
                    </div>
                    <div className="flex w-full min-w-0 flex-col gap-y-4">
                      {hasVariantsQuantity ? (
                        <QuantityWithVariantsQuantity
                          name="quantity.0"
                          label={t`Quantity`}
                          value={variantsQuantityTotal}
                          onChange={() => {
                            // Read-only while totals are driven by variant rows.
                          }}
                          hasVariantsQuantity={hasVariantsQuantity}
                          onOpenVariantsQuantity={openVariantsQuantity}
                          variantsQuantityTotal={variantsQuantityTotal}
                          isReadOnly
                          isDisabled={isLocked}
                        />
                      ) : (
                        <ArrayNumeric
                          name="quantity"
                          label={t`Quantity`}
                          defaults={[1, 25, 50, 100]}
                          isDisabled={isLocked}
                        />
                      )}
                    </div>
                  </div>
                </VStack>
              </ModalCardBody>
              <ModalCardFooter>
                <Submit
                  isDisabled={
                    isLocked ||
                    isMissingVariantQty ||
                    (isEditing
                      ? !permissions.can("update", "purchasing")
                      : !permissions.can("create", "purchasing"))
                  }
                >
                  <Trans>Save</Trans>
                </Submit>
              </ModalCardFooter>
            </ValidatedForm>
          </ModalCardContent>
        </ModalCard>
      </ModalCardProvider>
      {variantsQuantityModalNode}
      {isEditing && deleteDisclosure.isOpen && (
        <DeletePurchasingRFQLine
          line={initialValues as PurchasingRFQLine}
          onCancel={deleteDisclosure.onClose}
        />
      )}
    </>
  );
};

export default PurchasingRFQLineForm;
