import { useCarbon } from "@carbon/auth";
import { TextArea, ValidatedForm } from "@carbon/form";
import {
  Badge,
  Button,
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
import { getItemReadableId } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuTrash } from "react-icons/lu";
import { Link, useFetcher, useParams } from "react-router";
import type { z } from "zod";
import { MethodIcon, MethodItemTypeIcon } from "~/components";
import { ConfiguratorModal } from "~/components/Configurator/ConfiguratorForm";
import {
  ArrayNumeric,
  CustomFormFields,
  Hidden,
  InputControlled,
  Item,
  Number,
  Select,
  SelectControlled,
  Submit
} from "~/components/Form";
import { QuoteLineStatusIcon } from "~/components/Icons";
import {
  usePercentFormatter,
  usePermissions,
  useRouteData,
  useUser
} from "~/hooks";
import type {
  ConfigurationParameter,
  ConfigurationParameterGroup
} from "~/modules/items/types";
import { getLinkToItemDetails } from "~/modules/items/ui/Item/ItemForm";
import { QuantityWithVariantsQuantity } from "~/modules/production/ui/Jobs/QuantityWithVariantsQuantity";
import { methodType, useLineVariantQuantities } from "~/modules/shared";
import type { MethodItemType } from "~/modules/shared/types";
import type { action } from "~/routes/x+/quote+/$quoteId.new";
import { useItems } from "~/stores";
import { path } from "~/utils/path";
import {
  isQuoteLocked,
  quoteLineStatusType,
  quoteLineValidator
} from "../../sales.models";
import type { Quotation, QuotationLine } from "../../types";
import DeleteQuoteLine from "./DeleteQuoteLine";

type QuoteLineFormProps = {
  initialValues: z.infer<typeof quoteLineValidator> & {
    itemType?: MethodItemType;
  };
  type?: "card" | "modal";
  onClose?: () => void;
};

const QuoteLineForm = ({
  initialValues,
  type,
  onClose
}: QuoteLineFormProps) => {
  const { t } = useLingui();
  const fetcher = useFetcher<typeof action>();
  const permissions = usePermissions();
  const { company } = useUser();
  const { carbon } = useCarbon();

  const { quoteId } = useParams();

  if (!quoteId) throw new Error("quoteId not found");

  const [items] = useItems();
  const routeData = useRouteData<{
    quote: Quotation;
  }>(path.to.quote(quoteId));

  const isLocked = isQuoteLocked(routeData?.quote?.status);
  const isEditable = !isLocked;

  const isEditing = initialValues.id !== undefined;

  const [itemType, setItemType] = useState<MethodItemType>(
    initialValues.itemType ?? "Part"
  );
  const [itemData, setItemData] = useState<{
    customerPartId: string;
    customerPartRevision: string;
    description: string;
    itemId: string;
    methodType: string;
    modelUploadId: string | null;
    uom: string;
    hasVariantAttributes: boolean;
  }>({
    customerPartId: initialValues.customerPartId ?? "",
    customerPartRevision: initialValues.customerPartRevision ?? "",
    itemId: initialValues.itemId ?? "",
    description: initialValues.description ?? "",
    methodType: initialValues.methodType ?? "",
    uom: initialValues.unitOfMeasureCode ?? "",
    modelUploadId: initialValues.modelUploadId ?? null,
    // Editing a parent with a stored grid stays configurable until item change
    // re-fetches the underlying attribute selections.
    hasVariantAttributes: Boolean(initialValues.variantQuantities)
  });

  const {
    variantsQuantityTotal,
    hasVariantsQuantity,
    isMissingVariantQty,
    hiddenVariantQuantitiesValue,
    openVariantsQuantity,
    clearVariantsQuantity
  } = useLineVariantQuantities({
    initialVariantQuantities: initialValues.variantQuantities,
    hasVariantAttributes: itemData.hasVariantAttributes,
    itemId: itemData.itemId,
    isEditing
  });

  const configurationDisclosure = useDisclosure();
  const [requiresConfiguration, setRequiresConfiguration] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [configurationParameters, setConfigurationParameters] = useState<{
    parameters: ConfigurationParameter[];
    groups: ConfigurationParameterGroup[];
  } | null>(null);
  const [configurationValues, setConfigurationValues] = useState<
    Record<string, any> | ""
  >("");

  const percentFormatter = usePercentFormatter();

  const onCustomerPartChange = async (customerPartId: string) => {
    if (!carbon || !routeData?.quote?.customerId) return;

    const customerPart = await carbon
      .from("customerPartToItem")
      .select("itemId")
      .eq("customerPartId", customerPartId)
      .eq("customerPartRevision", itemData.customerPartRevision ?? "")
      .eq("customerId", routeData?.quote?.customerId!)
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
    if (!carbon || !routeData?.quote?.customerId || !itemData.customerPartId)
      return;

    const customerPart = await carbon
      .from("customerPartToItem")
      .select("itemId")
      .eq("customerPartId", itemData.customerPartId)
      .eq("customerPartRevision", customerPartRevision ?? "")
      .eq("customerId", routeData?.quote?.customerId!)
      .maybeSingle();

    if (customerPart.error) {
      toast.error(t`Failed to load customer part details`);
      return;
    }

    if (customerPart.data && customerPart.data.itemId && !itemData.itemId) {
      onItemChange(customerPart.data.itemId);
    }
  };

  const onItemChange = async (itemId: string) => {
    if (!carbon) return;
    clearVariantsQuantity();

    const [item, customerPart, itemReplenishment, variantAttributes] =
      await Promise.all([
        carbon
          .from("item")
          .select(
            "name, readableIdWithRevision, type, defaultMethodType, unitOfMeasureCode, modelUploadId"
          )
          .eq("id", itemId)
          .eq("companyId", company.id)
          .single(),
        carbon
          .from("customerPartToItem")
          .select("customerPartId, customerPartRevision")
          .eq("itemId", itemId)
          .eq("customerId", routeData?.quote?.customerId!)
          .maybeSingle(),
        carbon
          .from("itemReplenishment")
          .select("requiresConfiguration")
          .eq("itemId", itemId)
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
      methodType: item.data?.defaultMethodType ?? "",
      uom: item.data?.unitOfMeasureCode ?? "",
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

    // Part method configurator — skip for Style/attribute parents (qty grid).
    if (hasVariantAttributes) {
      setRequiresConfiguration(false);
      setConfigurationParameters(null);
      setIsConfigured(false);
      setConfigurationValues("");
      return;
    }

    if (itemReplenishment.data?.requiresConfiguration) {
      setRequiresConfiguration(true);
      setIsConfigured(false);
      const [parameters, groups] = await Promise.all([
        carbon
          .from("configurationParameter")
          .select("*")
          .eq("itemId", itemId)
          .eq("companyId", company.id),
        carbon
          .from("configurationParameterGroup")
          .select("*")
          .eq("itemId", itemId)
          .eq("companyId", company.id)
      ]);

      if (parameters.error || groups.error) {
        toast.error(t`Failed to load configuration parameters`);
        return;
      }

      setConfigurationParameters({
        parameters: parameters.data ?? [],
        groups: groups.data ?? []
      });
    } else {
      setRequiresConfiguration(false);
      setConfigurationParameters(null);
    }
  };

  const deleteDisclosure = useDisclosure();

  return (
    <>
      <ModalCardProvider type={type}>
        <ModalCard
          onClose={onClose}
          defaultCollapsed={false}
          isCollapsible={isEditing}
        >
          <ModalCardContent size="xxlarge">
            <ValidatedForm
              fetcher={fetcher}
              defaultValues={initialValues}
              validator={quoteLineValidator}
              method="post"
              action={
                isEditing
                  ? path.to.quoteLine(quoteId, initialValues.id!)
                  : path.to.newQuoteLine(quoteId)
              }
              className="w-full"
              isDisabled={isEditing && isLocked}
              onSuccess={type === "modal" ? onClose : undefined}
            >
              <HStack className="w-full justify-between items-start">
                <ModalCardHeader>
                  <ModalCardTitle>
                    {isEditing ? (
                      (getItemReadableId(items, itemData?.itemId) ?? (
                        <Trans>Quote Line</Trans>
                      ))
                    ) : (
                      <Trans>New Quote Line</Trans>
                    )}
                  </ModalCardTitle>
                  <ModalCardDescription>
                    {isEditing ? (
                      <div className="flex flex-col items-start gap-1">
                        <span>{itemData?.description}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <MethodIcon type={itemData.methodType} />
                            {initialValues?.quantity.join(", ")}
                          </Badge>
                          {initialValues?.taxPercent > 0 ? (
                            <Badge variant="red">
                              {percentFormatter.format(
                                initialValues?.taxPercent
                              )}{" "}
                              <Trans>Tax</Trans>
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <Trans>
                        A quote line contains pricing and lead times for a
                        particular part
                      </Trans>
                    )}
                  </ModalCardDescription>
                </ModalCardHeader>
                {isEditing && permissions.can("update", "sales") && (
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
                        {!isLocked && (
                          <DropdownMenuItem
                            destructive
                            onClick={deleteDisclosure.onOpen}
                          >
                            <DropdownMenuIcon icon={<LuTrash />} />
                            <Trans>Delete Line</Trans>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link
                            to={getLinkToItemDetails(
                              itemType,
                              itemData.itemId!
                            )}
                          >
                            <DropdownMenuIcon
                              icon={<MethodItemTypeIcon type={itemType} />}
                            />
                            <Trans>View Item Master</Trans>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardAction>
                )}
              </HStack>
              <ModalCardBody>
                <Hidden name="id" />
                <Hidden name="quoteId" />
                <Hidden name="itemType" value={itemType} />
                <Hidden name="unitOfMeasureCode" value={itemData?.uom} />
                <Hidden
                  name="modelUploadId"
                  value={itemData?.modelUploadId ?? undefined}
                />
                {/* Outside the grid: Hidden wraps FormControl and would occupy a cell. */}
                {itemData.hasVariantAttributes && (
                  <Hidden
                    name="variantQuantities"
                    value={hiddenVariantQuantitiesValue}
                  />
                )}
                {!isEditing &&
                  requiresConfiguration &&
                  !hasVariantsQuantity && (
                    <Hidden
                      name="configuration"
                      value={JSON.stringify(configurationValues)}
                    />
                  )}
                <VStack>
                  <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                    <div className="col-span-1 lg:col-span-2 grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-2 auto-rows-min">
                      <Item
                        autoFocus
                        name="itemId"
                        label={itemType}
                        type={itemType}
                        value={itemData.itemId}
                        includeInactive
                        locationId={routeData?.quote?.locationId ?? undefined}
                        onChange={(value) => {
                          onItemChange(value?.value as string);
                        }}
                        onTypeChange={(nextType) => {
                          clearVariantsQuantity();
                          setItemType(nextType as MethodItemType);
                          setRequiresConfiguration(false);
                          setConfigurationParameters(null);
                          setIsConfigured(false);
                          setConfigurationValues("");
                          setItemData({
                            ...itemData,
                            itemId: "",
                            description: "",
                            methodType: "",
                            uom: "",
                            modelUploadId: null,
                            customerPartId: "",
                            customerPartRevision: "",
                            hasVariantAttributes: false
                          });
                        }}
                      />

                      <InputControlled
                        name="description"
                        label={t`Short Description`}
                        value={itemData.description}
                      />

                      <SelectControlled
                        name="methodType"
                        label={t`Method`}
                        options={
                          methodType.map((m) => ({
                            label: (
                              <span className="flex items-center gap-2">
                                <MethodIcon type={m} />
                                {m === "Purchase to Order"
                                  ? t`Purchase to Order`
                                  : m === "Pull from Inventory"
                                    ? t`Pull from Inventory`
                                    : t`Make to Order`}
                              </span>
                            ),
                            value: m
                          })) ?? []
                        }
                        value={itemData.methodType}
                        onChange={(newValue) => {
                          if (newValue)
                            setItemData((d) => ({
                              ...d,
                              methodType: newValue?.value
                            }));
                        }}
                      />

                      <Select
                        name="status"
                        label={t`Line Status`}
                        options={quoteLineStatusType.map((s) => ({
                          label: (
                            <span className="flex items-center gap-2">
                              <QuoteLineStatusIcon status={s} />
                              {s}
                            </span>
                          ),
                          value: s
                        }))}
                      />

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
                      <Number
                        name="taxPercent"
                        label={t`Tax Percent`}
                        minValue={0}
                        maxValue={1}
                        step={0.0001}
                        formatOptions={{
                          style: "percent",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2
                        }}
                      />

                      <CustomFormFields table="quoteLine" />
                      {initialValues.status === "No Quote" && (
                        <TextArea
                          name="noQuoteReason"
                          label={t`No Quote Reason`}
                        />
                      )}
                    </div>
                    <div className="flex w-full min-w-0 flex-col gap-y-4">
                      {hasVariantsQuantity ? (
                        // Validator expects quantity as an array (price
                        // breaks). For Style parents, submit a single tier
                        // equal to the grid total; convert expands later.
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
                          isDisabled={!isEditable}
                        />
                      ) : (
                        <ArrayNumeric
                          name="quantity"
                          label={t`Quantity`}
                          defaults={[1, 25, 50, 100]}
                          isDisabled={!isEditable}
                        />
                      )}
                    </div>
                  </div>
                </VStack>
              </ModalCardBody>
              <ModalCardFooter>
                {!isEditing && (
                  <Button variant="secondary" onClick={onClose}>
                    <Trans>Cancel</Trans>
                  </Button>
                )}
                {!isEditing &&
                  requiresConfiguration &&
                  !hasVariantsQuantity && (
                    <Button
                      variant={isConfigured ? "secondary" : "primary"}
                      isLoading={fetcher.state !== "idle"}
                      type="button"
                      isDisabled={
                        !isEditable ||
                        (isEditing
                          ? !permissions.can("update", "sales")
                          : !permissions.can("create", "sales"))
                      }
                      onClick={() => {
                        configurationDisclosure.onOpen();
                      }}
                    >
                      <Trans>Configure</Trans>
                    </Button>
                  )}

                <Submit
                  isLoading={fetcher.state !== "idle"}
                  isDisabled={
                    isMissingVariantQty ||
                    (requiresConfiguration &&
                      !isConfigured &&
                      !hasVariantsQuantity) ||
                    !isEditable ||
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
      {isEditing && deleteDisclosure.isOpen && (
        <DeleteQuoteLine
          line={initialValues as QuotationLine}
          onCancel={deleteDisclosure.onClose}
        />
      )}
      {requiresConfiguration &&
        !hasVariantsQuantity &&
        configurationDisclosure.isOpen &&
        configurationParameters && (
          <ConfiguratorModal
            open
            initialValues={configurationValues || {}}
            groups={configurationParameters.groups ?? []}
            parameters={configurationParameters.parameters ?? []}
            onClose={configurationDisclosure.onClose}
            onSubmit={(config: Record<string, any>) => {
              setConfigurationValues(config);
              setIsConfigured(true);
              configurationDisclosure.onClose();
            }}
          />
        )}
    </>
  );
};

export default QuoteLineForm;
