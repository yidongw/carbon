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
import type { action } from "~/routes/x+/sales-rfq+/$rfqId.$lineId.details";
import { path } from "~/utils/path";
import { isSalesRfqLocked, salesRfqLineValidator } from "../../sales.models";
import type { SalesRFQ, SalesRFQLine } from "../../types";
import DeleteSalesRFQLine from "./DeleteSalesRFQLine";

type SalesRFQLineFormProps = {
  initialValues: z.infer<typeof salesRfqLineValidator> & {
    itemType?: MethodItemType;
  };
  type?: "card" | "modal";
  onClose?: () => void;
};

const SalesRFQLineForm = ({
  initialValues,
  type,
  onClose
}: SalesRFQLineFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const { company } = useUser();
  const { carbon } = useCarbon();

  const { rfqId } = useParams();
  const fetcher = useFetcher<typeof action>();

  if (!rfqId) throw new Error("rfqId not found");

  const routeData = useRouteData<{
    rfqSummary: SalesRFQ;
  }>(path.to.salesRfq(rfqId));

  const isLocked = isSalesRfqLocked(routeData?.rfqSummary?.status);

  const isEditing = initialValues.id !== undefined;

  const [itemType, setItemType] = useState<MethodItemType>(
    initialValues.itemType ?? "Part"
  );
  const [itemData, setItemData] = useState<{
    customerPartId: string;
    customerPartRevision: string;
    itemId: string;
    description: string;
    unitOfMeasureCode: string;
    modelUploadId: string | null;
    hasVariantAttributes: boolean;
  }>({
    customerPartId: initialValues.customerPartId ?? "",
    customerPartRevision: initialValues.customerPartRevision ?? "",
    itemId: initialValues.itemId ?? "",
    description: initialValues.description ?? "",
    unitOfMeasureCode: initialValues.unitOfMeasureCode ?? "EA",
    modelUploadId: initialValues.modelUploadId ?? null,
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

  const onCustomerPartChange = async (customerPartId: string) => {
    if (!carbon || !routeData?.rfqSummary?.customerId) return;

    const customerPart = await carbon
      .from("customerPartToItem")
      .select("itemId")
      .eq("customerPartId", customerPartId)
      .eq("customerPartRevision", itemData.customerPartRevision ?? "")
      .eq("customerId", routeData?.rfqSummary?.customerId!)
      .maybeSingle();

    if (customerPart.error) {
      toast.error(t`Failed to load customer part details`);
      return;
    }

    if (customerPart.data && customerPart.data.itemId && !itemData.itemId) {
      onItemChange(customerPart.data.itemId);
    }
  };

  const onCustomerPartRevisionChange = async (customerPartRevision: string) => {
    if (
      !carbon ||
      !routeData?.rfqSummary?.customerId ||
      !itemData.customerPartId
    )
      return;

    const customerPart = await carbon
      .from("customerPartToItem")
      .select("itemId")
      .eq("customerPartId", itemData.customerPartId)
      .eq("customerPartRevision", customerPartRevision ?? "")
      .eq("customerId", routeData?.rfqSummary?.customerId!)
      .maybeSingle();

    if (customerPart.error) {
      toast.error("Failed to load customer part details");
      return;
    }

    if (customerPart.data && customerPart.data.itemId && !itemData.itemId) {
      onItemChange(customerPart.data.itemId);
    }
  };

  const onItemChange = async (itemId: string) => {
    if (!carbon) return;
    clearVariantsQuantity();

    const [item, customerPart, variantAttributes] = await Promise.all([
      carbon
        .from("item")
        .select("name, unitOfMeasureCode, modelUploadId, type")
        .eq("id", itemId)
        .eq("companyId", company.id)
        .single(),
      carbon
        .from("customerPartToItem")
        .select("customerPartId, customerPartRevision")
        .eq("itemId", itemId)
        .eq("customerId", routeData?.rfqSummary?.customerId!)
        .maybeSingle(),
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
      description: item.data?.name ?? "",
      unitOfMeasureCode: item.data?.unitOfMeasureCode ?? "EA",
      modelUploadId: item.data?.modelUploadId ?? null,
      hasVariantAttributes
    };

    if (customerPart.data && !itemData.customerPartId) {
      newItemData.customerPartId = customerPart.data.customerPartId;
      newItemData.customerPartRevision =
        customerPart.data.customerPartRevision ?? "";
    }

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
              validator={salesRfqLineValidator}
              method="post"
              action={
                isEditing
                  ? path.to.salesRfqLine(rfqId, initialValues.id!)
                  : path.to.newSalesRFQLine(rfqId)
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
                      ? `${itemData?.customerPartId}${
                          itemData?.customerPartRevision
                            ? `.${itemData?.customerPartRevision}`
                            : ""
                        }`
                      : "New RFQ Line"}
                  </ModalCardTitle>
                  <ModalCardDescription>
                    {isEditing ? (
                      <div className="flex flex-col items-start gap-1">
                        <span>{itemData?.description}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {initialValues?.quantity.join(", ")}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      "An RFQ line contains part and quantity information about the requested item"
                    )}
                  </ModalCardDescription>
                </ModalCardHeader>
                {isEditing &&
                  permissions.can("update", "sales") &&
                  !isLocked && (
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
                            Delete Line
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardAction>
                  )}
              </HStack>
              <ModalCardBody>
                <Hidden name="id" />
                <Hidden name="salesRfqId" />
                <Hidden name="order" />
                <Hidden
                  name="modelUploadId"
                  value={itemData.modelUploadId ?? undefined}
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
                      <InputControlled
                        name="customerPartId"
                        label={t`Customer Part Number`}
                        value={itemData.customerPartId}
                        onChange={(newValue) => {
                          setItemData((d) => ({
                            ...d,
                            customerPartId: newValue
                          }));
                        }}
                        onBlur={(e) => onCustomerPartChange(e.target.value)}
                        autoFocus
                      />
                      <InputControlled
                        name="customerPartRevision"
                        label={t`Customer Part Revision`}
                        value={itemData.customerPartRevision}
                        onChange={(newValue) => {
                          setItemData((d) => ({
                            ...d,
                            customerPartRevision: newValue
                          }));
                        }}
                        onBlur={(e) =>
                          onCustomerPartRevisionChange(e.target.value)
                        }
                      />
                      <Item
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
                        onTypeChange={(nextType) => {
                          clearVariantsQuantity();
                          setItemType(nextType as MethodItemType);
                          setItemData({
                            ...itemData,
                            itemId: "",
                            description: "",
                            unitOfMeasureCode: "EA",
                            modelUploadId: null,
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
                        name="unitOfMeasureCode"
                        value={itemData.unitOfMeasureCode}
                        onChange={(newValue) =>
                          setItemData((d) => ({
                            ...d,
                            unitOfMeasureCode: newValue?.value ?? "EA"
                          }))
                        }
                      />

                      <CustomFormFields table="salesRfqLine" />
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
                    isMissingVariantQty ||
                    isLocked ||
                    (isEditing
                      ? !permissions.can("update", "sales")
                      : !permissions.can("create", "sales"))
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
        <DeleteSalesRFQLine
          line={initialValues as SalesRFQLine}
          onCancel={deleteDisclosure.onClose}
        />
      )}
    </>
  );
};

export default SalesRFQLineForm;
