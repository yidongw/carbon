import { useCarbon } from "@carbon/auth";
import {
  Combobox,
  DatePicker,
  InputControlled,
  ValidatedForm
} from "@carbon/form";
import {
  Badge,
  Button,
  cn,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Label,
  ModalCard,
  ModalCardBody,
  ModalCardContent,
  ModalCardDescription,
  ModalCardFooter,
  ModalCardHeader,
  ModalCardProvider,
  ModalCardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useDisclosure,
  useMount,
  VStack
} from "@carbon/react";
import { getItemReadableId } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import { LuBox, LuChevronRight, LuLandmark, LuReceipt } from "react-icons/lu";
import { useParams } from "react-router";
import type { z } from "zod";
import {
  Account,
  ConversionFactor,
  CostCenter,
  CustomFormFields,
  Hidden,
  Item,
  Location,
  NumberControlled,
  StorageUnit,
  Submit,
  UnitOfMeasure
} from "~/components/Form";
import {
  useCurrencyFormatter,
  usePercentFormatter,
  usePermissions,
  useRouteData,
  useUser
} from "~/hooks";
import type { PurchaseInvoice } from "~/modules/invoicing";
import { purchaseInvoiceLineValidator } from "~/modules/invoicing";
import { getSupplierPartPriceBreaks } from "~/modules/items";
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
import {
  defaultLineQuantity,
  isMissingVariantQuantity,
  type MethodItemType,
  resolveSupplierPrice,
  shouldShowVariantQuantityGrid
} from "~/modules/shared";
import { useItems } from "~/stores";
import { path } from "~/utils/path";

type PurchaseInvoiceLineFormProps = {
  initialValues: z.infer<typeof purchaseInvoiceLineValidator> & {
    taxPercent?: number;
    assetReadableId?: string;
    assetName?: string;
  };
  type?: "card" | "modal";
  onClose?: () => void;
};

function parseInitialVariantTable(raw: unknown): {
  rows: Row[] | null;
  total: number;
} {
  if (!raw) return { rows: null, total: 0 };
  try {
    const parsed = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("variantTable" in parsed)
    ) {
      return { rows: null, total: 0 };
    }
    const parsedVariantTable = parsed as {
      variantTable?: Row[];
    };
    const rows = Array.isArray(parsedVariantTable.variantTable)
      ? parsedVariantTable.variantTable
      : null;
    // Combo-only: each row carries a single `Quantities` value.
    let total = 0;
    if (rows) {
      for (const row of rows) {
        total += Number(row.Quantities) || 0;
      }
    }
    return { rows, total };
  } catch {
    return { rows: null, total: 0 };
  }
}

const PurchaseInvoiceLineForm = ({
  initialValues,
  type,
  onClose
}: PurchaseInvoiceLineFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const { carbon } = useCarbon();

  const [items] = useItems();
  const { company, defaults } = useUser();
  const { invoiceId } = useParams();

  if (!invoiceId) throw new Error("invoiceId not found");

  const routeData = useRouteData<{
    purchaseInvoice: PurchaseInvoice;
  }>(path.to.purchaseInvoice(invoiceId));

  const isEditable = ["Draft"].includes(
    routeData?.purchaseInvoice?.status ?? ""
  );

  const [itemType, setItemType] = useState<MethodItemType>(
    initialValues.invoiceLineType as MethodItemType
  );
  const [locationId, setLocationId] = useState(defaults.locationId ?? "");
  const [itemData, setItemData] = useState<{
    itemId: string;
    description: string;
    quantity: number;
    supplierUnitPrice: number;
    supplierShippingCost: number;
    purchaseUom: string;
    inventoryUom: string;
    conversionFactor: number;
    storageUnitId: string | null;
    minimumOrderQuantity?: number;
    taxAmount: number;
    taxPercent: number;
    priceBreaks: Array<{ quantity: number; unitPrice: number }>;
    fallbackUnitPrice: number;
    hasVariantAttributes: boolean;
  }>({
    itemId: initialValues.itemId ?? "",
    description: initialValues.description ?? "",
    quantity: initialValues.quantity ?? 1,
    supplierUnitPrice: initialValues.supplierUnitPrice ?? 0,
    supplierShippingCost: initialValues.supplierShippingCost ?? 0,
    purchaseUom: initialValues.purchaseUnitOfMeasureCode ?? "",
    inventoryUom: initialValues.inventoryUnitOfMeasureCode ?? "",
    conversionFactor: initialValues.conversionFactor ?? 1,
    storageUnitId: initialValues.storageUnitId ?? "",
    minimumOrderQuantity: undefined,
    taxAmount: initialValues.supplierTaxAmount ?? 0,
    taxPercent: initialValues.taxPercent ?? 0,
    priceBreaks: [],
    fallbackUnitPrice: initialValues.supplierUnitPrice ?? 0,
    hasVariantAttributes: Boolean(initialValues.variantQuantities)
  });

  // update tax amount when quantity or unit price changes
  useEffect(() => {
    const subtotal =
      itemData.supplierUnitPrice * itemData.quantity +
      itemData.supplierShippingCost;
    if (itemData.taxPercent !== 0) {
      setItemData((d) => ({
        ...d,
        taxAmount: subtotal * itemData.taxPercent
      }));
    }
  }, [
    itemData.supplierUnitPrice,
    itemData.quantity,
    itemData.supplierShippingCost,
    itemData.taxPercent
  ]);

  const isEditing = initialValues.id !== undefined;
  const isGLAccount = initialValues.invoiceLineType === "G/L Account";
  const isFixedAsset = initialValues.invoiceLineType === "Fixed Asset";
  const [activeTab, setActiveTab] = useState<"item" | "gl-account" | "asset">(
    isFixedAsset ? "asset" : isGLAccount ? "gl-account" : "item"
  );

  const variantsQuantityModal = useVariantsQuantityModal();
  const initialConfig = parseInitialVariantTable(
    initialValues.variantQuantities
  );
  const [variantsQuantityRows, setVariantsQuantityRows] = useState<
    Row[] | null
  >(initialConfig.rows);
  const [variantsQuantityTotal, setVariantsQuantityTotal] = useState(
    initialConfig.total
  );

  // Items with variant attributes use the config-quantity grid when adding a
  // parent line — Styles always, Consumables with a color set. The expanded
  // variant SKU lines (no stored configuration) use plain quantity.
  const hasVariantsQuantity = shouldShowVariantQuantityGrid({
    hasVariantAttributes: itemData.hasVariantAttributes,
    itemId: itemData.itemId,
    isEditing,
    variantQuantities: initialValues.variantQuantities
  });

  const isMissingVariantQty = isMissingVariantQuantity(
    hasVariantsQuantity,
    itemData.quantity
  );

  const onQuantityChange = (value: number) => {
    const exchangeRate = routeData?.purchaseInvoice?.exchangeRate ?? 1;
    setItemData((d) => ({
      ...d,
      quantity: value,
      supplierUnitPrice: resolveSupplierPrice(
        d.priceBreaks,
        value,
        d.fallbackUnitPrice,
        exchangeRate
      )
    }));
  };

  const applyConfig = (data: unknown) => {
    if (!isVariantsQuantityOverlaySuccess(data)) return;
    setVariantsQuantityRows(getOverlaySuccessVariantTable(data));
    setVariantsQuantityTotal(data.total);
    onQuantityChange(data.total);
  };

  const openVariantsQuantity = () => {
    if (!itemData.itemId) return;
    variantsQuantityModal.open({
      itemId: itemData.itemId,
      variantQuantities: toVariantsQuantityValue(variantsQuantityRows),
      onConfirm: applyConfig
    });
  };

  const clearConfig = () => {
    setVariantsQuantityRows(null);
    setVariantsQuantityTotal(0);
  };

  const [assetOptions, setAssetOptions] = useState<
    { value: string; label: string; locationId: string | null }[]
  >([]);

  useMount(() => {
    (async () => {
      const assets = await carbon
        .from("fixedAsset")
        .select("id, fixedAssetId, name, locationId")
        .eq("companyId", company.id)
        .eq("status", "Draft")
        .order("fixedAssetId");
      const options = (assets.data ?? []).map((a) => ({
        value: a.id,
        label: `${a.fixedAssetId} — ${a.name}`,
        locationId: a.locationId
      }));
      if (
        initialValues.assetId &&
        !options.some((o) => o.value === initialValues.assetId)
      ) {
        const current = await carbon
          .from("fixedAsset")
          .select("id, fixedAssetId, name, locationId")
          .eq("id", initialValues.assetId)
          .single();
        if (current.data) {
          options.unshift({
            value: current.data.id,
            label: `${current.data.fixedAssetId} — ${current.data.name}`,
            locationId: current.data.locationId
          });
        }
      }
      setAssetOptions(options);
    })();
  });

  const costsDisclosure = useDisclosure();
  const indirectCostsDisclosure = useDisclosure();

  const [indirectData, setIndirectData] = useState<{
    accountId: string;
    assetId: string;
    costCenterId: string;
    description: string;
    quantity: number;
    requiredDate: string | null;
    supplierUnitPrice: number;
    supplierShippingCost: number;
    taxAmount: number;
    taxPercent: number;
  }>({
    accountId: initialValues.accountId ?? "",
    assetId: initialValues.assetId ?? "",
    costCenterId: initialValues.costCenterId ?? "",
    description: initialValues.description ?? "",
    quantity: initialValues.quantity ?? 1,
    requiredDate: initialValues.requiredDate ?? null,
    supplierUnitPrice: initialValues.supplierUnitPrice ?? 0,
    supplierShippingCost: initialValues.supplierShippingCost ?? 0,
    taxAmount: initialValues.supplierTaxAmount ?? 0,
    taxPercent: initialValues.taxPercent ?? 0
  });

  useEffect(() => {
    const subtotal =
      indirectData.supplierUnitPrice * indirectData.quantity +
      indirectData.supplierShippingCost;
    if (indirectData.taxPercent !== 0) {
      setIndirectData((d) => ({
        ...d,
        taxAmount: subtotal * indirectData.taxPercent
      }));
    }
  }, [
    indirectData.supplierUnitPrice,
    indirectData.quantity,
    indirectData.supplierShippingCost,
    indirectData.taxPercent
  ]);

  // Load price breaks
  useMount(() => {
    if (!isEditing || !initialValues.itemId) return;
    const supplierId = routeData?.purchaseInvoice?.supplierId;
    if (!supplierId) return;

    (async () => {
      const supplierPart = await carbon
        .from("supplierPart")
        .select("id")
        .eq("itemId", initialValues.itemId!)
        .eq("companyId", company.id)
        .eq("supplierId", supplierId)
        .maybeSingle();

      if (supplierPart?.data?.id) {
        const breaks = await getSupplierPartPriceBreaks(
          carbon,
          supplierPart.data.id
        );
        setItemData((d) => ({ ...d, priceBreaks: breaks }));
      }
    })();
  });

  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  const currencyFormatter = useCurrencyFormatter();
  const percentFormatter = usePercentFormatter();

  const onTypeChange = (t: MethodItemType | "Item") => {
    if (t === itemType) return;
    setItemType(t as MethodItemType);
    clearConfig();
    setItemData({
      itemId: "",
      description: "",
      quantity: defaultLineQuantity(false),
      supplierUnitPrice: 0,
      supplierShippingCost: 0,
      inventoryUom: "",
      purchaseUom: "",
      conversionFactor: 1,
      storageUnitId: "",
      minimumOrderQuantity: undefined,
      taxAmount: 0,
      taxPercent: 0,
      priceBreaks: [],
      fallbackUnitPrice: 0,
      hasVariantAttributes: false
    });
  };

  const onItemChange = async (itemId: string) => {
    if (!carbon) throw new Error("Jilio client not found");
    clearConfig();
    switch (itemType) {
      // @ts-expect-error
      case "Item":
      case "Consumable":
      case "Material":
      case "Part":
      case "Style":
      case "Tool":
      // @ts-expect-error
      case "Service":
      // @ts-expect-error
      case "Fixture":
        const [item, supplierPart, inventory, variantAttributes] =
          await Promise.all([
            carbon
              .from("item")
              .select(
                "name, readableIdWithRevision, type, unitOfMeasureCode, itemCost(unitCost), itemReplenishment(purchasingUnitOfMeasureCode, conversionFactor, leadTime)"
              )
              .eq("id", itemId)
              .eq("companyId", company.id)
              .single(),
            carbon
              .from("supplierPart")
              .select("*")
              .eq("itemId", itemId)
              .eq("companyId", company.id)
              .eq("supplierId", routeData?.purchaseInvoice.supplierId!)
              .maybeSingle(),
            carbon
              .from("pickMethod")
              .select("defaultStorageUnitId")
              .eq("itemId", itemId)
              .eq("companyId", company.id)
              .eq("locationId", locationId!)
              .maybeSingle(),
            // Any item with Color/Size attribute selections (Style always; a
            // Consumable with a Fabric/Trim color set) gets the config grid.
            carbon
              .from("itemAttributeSelection")
              .select("attributeValueId")
              .eq("itemId", itemId)
              .eq("companyId", company.id)
              .limit(1)
          ]);

        const itemCost = item?.data?.itemCost?.[0];
        const itemReplenishment = item?.data?.itemReplenishment;
        const exchangeRate = routeData?.purchaseInvoice?.exchangeRate ?? 1;
        const minOrderQty = supplierPart?.data?.minimumOrderQuantity ?? 1;
        const hasVariantAttributes = (variantAttributes?.data?.length ?? 0) > 0;
        const initialQty = defaultLineQuantity(
          hasVariantAttributes,
          minOrderQty
        );
        const baseFallback =
          (supplierPart?.data?.unitPrice ?? itemCost?.unitCost ?? 0) /
          exchangeRate;

        const breaks = supplierPart?.data?.id
          ? await getSupplierPartPriceBreaks(carbon, supplierPart.data.id)
          : [];
        const resolvedPrice = resolveSupplierPrice(
          breaks,
          initialQty || 1,
          baseFallback,
          exchangeRate
        );

        setItemData({
          itemId: itemId,
          description: item.data?.name ?? "",
          quantity: initialQty,
          supplierUnitPrice: resolvedPrice,
          supplierShippingCost: 0,
          purchaseUom:
            supplierPart?.data?.supplierUnitOfMeasureCode ??
            itemReplenishment?.purchasingUnitOfMeasureCode ??
            item.data?.unitOfMeasureCode ??
            "EA",
          inventoryUom: item.data?.unitOfMeasureCode ?? "EA",
          conversionFactor:
            supplierPart?.data?.conversionFactor ??
            itemReplenishment?.conversionFactor ??
            1,
          storageUnitId: inventory.data?.defaultStorageUnitId ?? null,
          minimumOrderQuantity: minOrderQty,
          taxAmount: 0,
          taxPercent: 0,
          priceBreaks: breaks,
          fallbackUnitPrice: baseFallback,
          hasVariantAttributes
        });

        if (item.data?.type) {
          setItemType(item.data.type as MethodItemType);
        }

        break;
      default:
        throw new Error(
          `Invalid invoice line type: ${itemType} is not implemented`
        );
    }
  };

  const onLocationChange = async (newLocation: { value: string } | null) => {
    if (!carbon) throw new Error("carbon is not defined");
    if (typeof newLocation?.value !== "string")
      throw new Error("locationId is not a string");

    setLocationId(newLocation.value);
    if (!itemData.itemId) return;
    const storageUnit = await carbon
      .from("pickMethod")
      .select("defaultStorageUnitId")
      .eq("itemId", itemData.itemId)
      .eq("companyId", company.id)
      .eq("locationId", newLocation.value)
      .maybeSingle();

    setItemData((d) => ({
      ...d,
      storageUnitId: storageUnit?.data?.defaultStorageUnitId ?? ""
    }));
  };

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={(v) =>
          setActiveTab(v as "item" | "gl-account" | "asset")
        }
        className="w-full"
      >
        <ModalCardProvider type={type}>
          <ModalCard
            onClose={onClose}
            defaultCollapsed={false}
            isCollapsible={isEditing}
          >
            <ModalCardContent size="xxlarge">
              <ValidatedForm
                defaultValues={initialValues}
                validator={purchaseInvoiceLineValidator}
                method="post"
                action={
                  isEditing
                    ? path.to.purchaseInvoiceLine(invoiceId, initialValues.id!)
                    : path.to.newPurchaseInvoiceLine(invoiceId)
                }
                className="w-full"
                isDisabled={!isEditable}
                onSubmit={() => {
                  if (type === "modal") onClose?.();
                }}
              >
                <HStack
                  className={cn(
                    "w-full justify-between items-start",
                    type === "modal" && "pr-16"
                  )}
                >
                  <ModalCardHeader className="flex flex-1">
                    <ModalCardTitle
                      className={cn(
                        isEditing &&
                          !isGLAccount &&
                          !isFixedAsset &&
                          !itemData?.itemId &&
                          "text-muted-foreground"
                      )}
                    >
                      {isEditing
                        ? isFixedAsset
                          ? initialValues.assetReadableId || "Fixed Asset"
                          : isGLAccount
                            ? indirectData.description || "G/L Account"
                            : (getItemReadableId(items, itemData?.itemId) ??
                              "...")
                        : "New Purchase Invoice Line"}
                    </ModalCardTitle>
                    <ModalCardDescription>
                      {isEditing ? (
                        <div className="flex flex-col items-start gap-1">
                          <span>
                            {isFixedAsset
                              ? initialValues.assetName ||
                                indirectData.description
                              : isGLAccount
                                ? "G/L Account"
                                : itemData?.description}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {initialValues?.quantity}
                            </Badge>
                            <Badge variant="green">
                              {currencyFormatter.format(
                                (initialValues?.supplierUnitPrice ?? 0) +
                                  (initialValues?.supplierShippingCost ?? 0)
                              )}{" "}
                              {initialValues?.purchaseUnitOfMeasureCode}
                            </Badge>
                            {(initialValues?.taxPercent ?? 0) > 0 ? (
                              <Badge variant="red">
                                {percentFormatter.format(
                                  initialValues?.taxPercent ?? 0
                                )}{" "}
                                Tax
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        "A purchase invoice line contains invoice details for a particular item"
                      )}
                    </ModalCardDescription>
                  </ModalCardHeader>
                  <div className="flex-shrink-0">
                    {!isEditing && (
                      <TabsList>
                        <TabsTrigger value="item">
                          <LuBox className="mr-1" />
                          <Trans>Item</Trans>
                        </TabsTrigger>
                        <TabsTrigger value="gl-account">
                          <LuReceipt className="mr-1" />
                          <Trans>GL Account</Trans>
                        </TabsTrigger>
                        <TabsTrigger value="asset">
                          <LuLandmark className="mr-1" />
                          <Trans>Asset</Trans>
                        </TabsTrigger>
                      </TabsList>
                    )}
                  </div>
                </HStack>
                <ModalCardBody>
                  <Hidden name="id" />
                  <Hidden name="invoiceId" />
                  <Hidden
                    name="exchangeRate"
                    value={routeData?.purchaseInvoice?.exchangeRate ?? 1}
                  />

                  <TabsContent value="item">
                    <Hidden name="invoiceLineType" value={itemType} />
                    {activeTab === "item" && (
                      <Hidden name="description" value={itemData.description} />
                    )}
                    <Hidden
                      name="inventoryUnitOfMeasureCode"
                      value={itemData?.inventoryUom}
                    />
                    {/* Outside the grid: Hidden wraps FormControl and would occupy a cell. */}
                    <Hidden
                      name="variantQuantities"
                      value={
                        variantsQuantityRows
                          ? JSON.stringify({
                              variantTable: variantsQuantityRows
                            })
                          : ""
                      }
                    />
                    <VStack>
                      <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                        <Item
                          name="itemId"
                          label={itemType}
                          // @ts-ignore
                          type={itemType}
                          locationId={locationId}
                          // Styles are replenished by Make but still bought as
                          // finished garments — don't filter them out.
                          replenishmentSystem={
                            itemType === "Style" ? undefined : "Buy"
                          }
                          onChange={(value) => {
                            onItemChange(value?.value as string);
                          }}
                          onTypeChange={onTypeChange}
                        />

                        <FormControl className="col-span-2">
                          <FormLabel isOptional>
                            <Trans>Description</Trans>
                          </FormLabel>
                          <Input
                            value={itemData.description}
                            onChange={(e) =>
                              setItemData((d) => ({
                                ...d,
                                description: e.target.value
                              }))
                            }
                          />
                        </FormControl>

                        {[
                          "Item",
                          "Part",
                          "Style",
                          "Material",
                          "Tool",
                          "Consumable",
                          "Service",
                          "Fixture"
                        ].includes(itemType) && (
                          <>
                            {itemData.hasVariantAttributes ? (
                              <QuantityWithVariantsQuantity
                                minValue={itemData.minimumOrderQuantity}
                                name="quantity"
                                label={t`Quantity`}
                                value={itemData.quantity}
                                onChange={onQuantityChange}
                                hasVariantsQuantity={hasVariantsQuantity}
                                onOpenVariantsQuantity={
                                  hasVariantsQuantity
                                    ? openVariantsQuantity
                                    : undefined
                                }
                                variantsQuantityTotal={variantsQuantityTotal}
                                isReadOnly={hasVariantsQuantity}
                              />
                            ) : (
                              <NumberControlled
                                minValue={itemData.minimumOrderQuantity}
                                name="quantity"
                                label={t`Quantity`}
                                value={itemData.quantity}
                                onChange={onQuantityChange}
                              />
                            )}

                            <UnitOfMeasure
                              name="purchaseUnitOfMeasureCode"
                              label={t`Unit of Measure`}
                              value={itemData.purchaseUom}
                              onChange={(newValue) => {
                                if (newValue) {
                                  setItemData((d) => ({
                                    ...d,
                                    purchaseUom: newValue?.value as string
                                  }));
                                }
                              }}
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

                            <NumberControlled
                              name="supplierUnitPrice"
                              label={t`Supplier Unit Price`}
                              value={itemData.supplierUnitPrice}
                              formatOptions={{
                                style: "currency",
                                currency:
                                  routeData?.purchaseInvoice?.currencyCode ??
                                  company.baseCurrencyCode
                              }}
                              onChange={(value) =>
                                setItemData((d) => ({
                                  ...d,
                                  supplierUnitPrice: value
                                }))
                              }
                            />

                            <Location
                              name="locationId"
                              label={t`Delivery Location`}
                              value={locationId}
                              onChange={onLocationChange}
                            />
                            <StorageUnit
                              name="storageUnitId"
                              label={t`Storage Unit`}
                              locationId={locationId}
                              value={itemData.storageUnitId ?? undefined}
                              onChange={(newValue) => {
                                if (newValue) {
                                  setItemData((d) => ({
                                    ...d,
                                    storageUnitId: newValue?.id
                                  }));
                                }
                              }}
                            />
                          </>
                        )}
                        <CustomFormFields table="purchaseInvoiceLine" />
                      </div>

                      <div className="w-full border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 mt-4">
                        <HStack
                          className="w-full justify-between cursor-pointer"
                          onClick={costsDisclosure.onToggle}
                        >
                          <Label>
                            <Trans>Tax &amp; Shipping</Trans>
                          </Label>
                          <HStack>
                            {itemData.taxPercent > 0 && (
                              <Badge variant="red">
                                {percentFormatter.format(itemData.taxPercent)}{" "}
                                <Trans>Tax</Trans>
                              </Badge>
                            )}
                            {itemData.supplierShippingCost > 0 && (
                              <Badge variant="secondary">
                                {currencyFormatter.format(
                                  itemData.supplierShippingCost
                                )}
                              </Badge>
                            )}
                            <IconButton
                              icon={<LuChevronRight />}
                              aria-label={
                                costsDisclosure.isOpen
                                  ? t`Collapse Costs`
                                  : t`Expand Costs`
                              }
                              variant="ghost"
                              size="md"
                              onClick={(e) => {
                                e.stopPropagation();
                                costsDisclosure.onToggle();
                              }}
                              className={`transition-transform ${costsDisclosure.isOpen ? "rotate-90" : ""}`}
                            />
                          </HStack>
                        </HStack>
                        <div
                          className={`grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ${
                            costsDisclosure.isOpen ? "" : "hidden"
                          }`}
                        >
                          <NumberControlled
                            name="supplierShippingCost"
                            label={t`Shipping`}
                            value={itemData.supplierShippingCost}
                            minValue={0}
                            formatOptions={{
                              style: "currency",
                              currency:
                                routeData?.purchaseInvoice?.currencyCode ??
                                company.baseCurrencyCode
                            }}
                            onChange={(value) =>
                              setItemData((d) => ({
                                ...d,
                                supplierShippingCost: value
                              }))
                            }
                          />
                          <NumberControlled
                            name="supplierTaxAmount"
                            label={t`Tax Amount`}
                            value={itemData.taxAmount}
                            formatOptions={{
                              style: "currency",
                              currency:
                                routeData?.purchaseInvoice?.currencyCode ??
                                company.baseCurrencyCode
                            }}
                            onChange={(value) => {
                              const subtotal =
                                itemData.supplierUnitPrice * itemData.quantity +
                                itemData.supplierShippingCost;
                              setItemData((d) => ({
                                ...d,
                                taxAmount: value,
                                taxPercent: subtotal > 0 ? value / subtotal : 0
                              }));
                            }}
                          />
                          <NumberControlled
                            name="taxPercent"
                            label={t`Tax Percent`}
                            value={itemData.taxPercent}
                            minValue={0}
                            maxValue={1}
                            step={0.0001}
                            formatOptions={{
                              style: "percent",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2
                            }}
                            onChange={(value) => {
                              const subtotal =
                                itemData.supplierUnitPrice * itemData.quantity +
                                itemData.supplierShippingCost;
                              setItemData((d) => ({
                                ...d,
                                taxPercent: value,
                                taxAmount: subtotal * value
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </VStack>
                  </TabsContent>

                  {(activeTab === "gl-account" || activeTab === "asset") && (
                    <>
                      <Hidden
                        name="invoiceLineType"
                        value={
                          activeTab === "asset" ? "Fixed Asset" : "G/L Account"
                        }
                      />

                      <VStack>
                        <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                          {activeTab === "gl-account" ? (
                            <>
                              <Account
                                name="accountId"
                                label={t`GL Account`}
                                classes={["Expense"]}
                                isOptional={false}
                              />
                              <CostCenter
                                name="costCenterId"
                                label={t`Cost Center`}
                                isOptional
                              />
                            </>
                          ) : (
                            <>
                              <Combobox
                                name="assetId"
                                label={t`Fixed Asset`}
                                isOptional={false}
                                options={assetOptions}
                                value={indirectData.assetId}
                                onChange={(selected) => {
                                  setIndirectData((d) => ({
                                    ...d,
                                    assetId: (selected?.value as string) ?? ""
                                  }));
                                  const asset = assetOptions.find(
                                    (o) => o.value === selected?.value
                                  );
                                  if (asset?.locationId && !locationId) {
                                    setLocationId(asset.locationId);
                                  }
                                }}
                              />
                              <Location
                                name="locationId"
                                label={t`Location`}
                                value={locationId}
                                onChange={(newLocation) => {
                                  setLocationId(newLocation?.value ?? "");
                                }}
                              />
                            </>
                          )}
                          <InputControlled
                            className={
                              activeTab === "asset"
                                ? "col-span-1"
                                : "col-span-3"
                            }
                            label={t`Description`}
                            name="description"
                            value={indirectData.description}
                            isOptional={false}
                            onChange={(newValue) =>
                              setIndirectData((d) => ({
                                ...d,
                                description: newValue
                              }))
                            }
                          />
                          <DatePicker
                            name="requiredDate"
                            label={t`Required Date`}
                            value={indirectData.requiredDate ?? undefined}
                            onChange={(date) => {
                              setIndirectData((d) => ({
                                ...d,
                                requiredDate: date
                              }));
                            }}
                          />
                          <NumberControlled
                            name="quantity"
                            label={t`Quantity`}
                            isOptional={false}
                            isDisabled={activeTab === "asset"}
                            value={
                              activeTab === "asset" ? 1 : indirectData.quantity
                            }
                            onChange={(value) =>
                              setIndirectData((d) => ({
                                ...d,
                                quantity: value
                              }))
                            }
                          />
                          <NumberControlled
                            name="supplierUnitPrice"
                            label={t`Unit Price`}
                            isOptional={false}
                            value={indirectData.supplierUnitPrice}
                            formatOptions={{
                              style: "currency",
                              currency:
                                routeData?.purchaseInvoice?.currencyCode ??
                                company.baseCurrencyCode
                            }}
                            onChange={(value) =>
                              setIndirectData((d) => ({
                                ...d,
                                supplierUnitPrice: value
                              }))
                            }
                          />
                          <CustomFormFields table="purchaseInvoiceLine" />
                        </div>

                        <div className="h-4" />

                        <div className="w-full border border-border rounded-md shadow-sm p-4 flex flex-col gap-4">
                          <HStack
                            className="w-full justify-between cursor-pointer"
                            onClick={indirectCostsDisclosure.onToggle}
                          >
                            <Label>
                              <Trans>Tax &amp; Shipping</Trans>
                            </Label>
                            <HStack>
                              {indirectData.taxPercent > 0 && (
                                <Badge variant="red">
                                  {percentFormatter.format(
                                    indirectData.taxPercent
                                  )}{" "}
                                  <Trans>Tax</Trans>
                                </Badge>
                              )}
                              {indirectData.supplierShippingCost > 0 && (
                                <Badge variant="secondary">
                                  {currencyFormatter.format(
                                    indirectData.supplierShippingCost
                                  )}
                                </Badge>
                              )}
                              <IconButton
                                icon={<LuChevronRight />}
                                aria-label={
                                  indirectCostsDisclosure.isOpen
                                    ? t`Collapse Costs`
                                    : t`Expand Costs`
                                }
                                variant="ghost"
                                size="md"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  indirectCostsDisclosure.onToggle();
                                }}
                                className={`transition-transform ${indirectCostsDisclosure.isOpen ? "rotate-90" : ""}`}
                              />
                            </HStack>
                          </HStack>
                          <div
                            className={`grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ${
                              indirectCostsDisclosure.isOpen ? "" : "hidden"
                            }`}
                          >
                            <NumberControlled
                              name="supplierShippingCost"
                              label={t`Shipping`}
                              minValue={0}
                              value={indirectData.supplierShippingCost}
                              formatOptions={{
                                style: "currency",
                                currency:
                                  routeData?.purchaseInvoice?.currencyCode ??
                                  company.baseCurrencyCode
                              }}
                              onChange={(value) =>
                                setIndirectData((d) => ({
                                  ...d,
                                  supplierShippingCost: value
                                }))
                              }
                            />
                            <NumberControlled
                              name="supplierTaxAmount"
                              label={t`Tax Amount`}
                              value={indirectData.taxAmount}
                              formatOptions={{
                                style: "currency",
                                currency:
                                  routeData?.purchaseInvoice?.currencyCode ??
                                  company.baseCurrencyCode
                              }}
                              onChange={(value) => {
                                const subtotal =
                                  indirectData.supplierUnitPrice *
                                    indirectData.quantity +
                                  indirectData.supplierShippingCost;
                                setIndirectData((d) => ({
                                  ...d,
                                  taxAmount: value,
                                  taxPercent:
                                    subtotal > 0 ? value / subtotal : 0
                                }));
                              }}
                            />
                            <NumberControlled
                              name="taxPercent"
                              label={t`Tax Percent`}
                              value={indirectData.taxPercent}
                              minValue={0}
                              maxValue={1}
                              step={0.0001}
                              formatOptions={{
                                style: "percent",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2
                              }}
                              onChange={(value) => {
                                const subtotal =
                                  indirectData.supplierUnitPrice *
                                    indirectData.quantity +
                                  indirectData.supplierShippingCost;
                                setIndirectData((d) => ({
                                  ...d,
                                  taxPercent: value,
                                  taxAmount: subtotal * value
                                }));
                              }}
                            />
                          </div>
                        </div>
                      </VStack>
                    </>
                  )}
                </ModalCardBody>
                <ModalCardFooter>
                  <HStack className="justify-end gap-2">
                    {onClose && (
                      <Button variant="ghost" onClick={onClose}>
                        <Trans>Cancel</Trans>
                      </Button>
                    )}
                    <Submit
                      isDisabled={
                        isDisabled || !isEditable || isMissingVariantQty
                      }
                      withBlocker={false}
                    >
                      <Trans>Save</Trans>
                    </Submit>
                  </HStack>
                </ModalCardFooter>
              </ValidatedForm>
            </ModalCardContent>
          </ModalCard>
        </ModalCardProvider>
      </Tabs>
      {variantsQuantityModal.node}
    </>
  );
};

export default PurchaseInvoiceLineForm;
