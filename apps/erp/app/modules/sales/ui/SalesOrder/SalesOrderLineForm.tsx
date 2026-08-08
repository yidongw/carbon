import { useCarbon } from "@carbon/auth";

import { Combobox, ValidatedForm } from "@carbon/form";
import {
  Badge,
  CardAction,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Label,
  ModalBody,
  ModalCard,
  ModalCardBody,
  ModalCardContent,
  ModalCardDescription,
  ModalCardFooter,
  ModalCardHeader,
  ModalCardProvider,
  ModalCardTitle,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useDebounce,
  useDisclosure,
  useMount,
  VStack
} from "@carbon/react";
import { getItemReadableId } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useCallback, useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  LuBox,
  LuChevronRight,
  LuLandmark,
  LuPlus,
  LuTrash,
  LuTruck
} from "react-icons/lu";
import { useParams } from "react-router";
import type { z } from "zod";
import { MethodIcon } from "~/components";
import {
  CustomFormFields,
  DatePicker,
  Hidden,
  InputControlled,
  Item,
  Location,
  Number,
  NumberControlled,
  SelectControlled,
  StorageUnit,
  Submit
} from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import {
  useCurrencyFormatter,
  usePercentFormatter,
  usePermissions,
  useRouteData,
  useUser
} from "~/hooks";
import { getDefaultStorageUnitForJob } from "~/modules/inventory/inventory.service";
import { isConfigTableOverlaySuccess } from "~/modules/production/configTableOverlay";
import {
  toConfigTableValue,
  useConfigTableModal
} from "~/modules/production/ui/Jobs/ConfigParamsTableModal";
import type { Row } from "~/modules/production/ui/Jobs/configTableShared";
import { QuantityWithConfigTable } from "~/modules/production/ui/Jobs/QuantityWithConfigTable";
import { methodType } from "~/modules/shared";
import { useItems } from "~/stores";
import { path } from "~/utils/path";
import {
  isSalesOrderLocked,
  salesOrderLineValidator
} from "../../sales.models";
import type {
  PriceTraceStep,
  SalesOrder,
  SalesOrderLine,
  SalesOrderLineType
} from "../../types";
import { PriceTracePopover } from "../Pricing/PriceTracePopover";
import DeleteSalesOrderLine from "./DeleteSalesOrderLine";

export type SalesOrderLineFormInitialValues = z.infer<
  typeof salesOrderLineValidator
> & {
  assetReadableId?: string;
  assetName?: string;
};

type SalesOrderLineFormProps = {
  initialValues: SalesOrderLineFormInitialValues;
  type?: "card" | "modal";
  onClose?: () => void;
} & Partial<Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">>;

function parseInitialConfig(raw: unknown): {
  rows: Row[] | null;
  primaryKeys: string[];
  total: number;
} {
  if (!raw) return { rows: null, primaryKeys: [], total: 0 };
  try {
    const parsed = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("configTable" in parsed)
    ) {
      return { rows: null, primaryKeys: [], total: 0 };
    }
    const config = parsed as {
      configTable?: Row[];
      configTablePrimaryKeys?: string[];
    };
    const rows = Array.isArray(config.configTable) ? config.configTable : null;
    const primaryKeys = Array.isArray(config.configTablePrimaryKeys)
      ? config.configTablePrimaryKeys.filter(
          (k): k is string => typeof k === "string"
        )
      : [];
    let total = 0;
    if (rows) {
      for (const row of rows) {
        for (const key of primaryKeys) {
          total += globalThis.Number(row[key]) || 0;
        }
      }
    }
    return { rows, primaryKeys, total };
  } catch {
    return { rows: null, primaryKeys: [], total: 0 };
  }
}

const SalesOrderLineForm = ({
  initialValues,
  type = "card",
  onClose,
  onDismiss,
  fetcher,
  action
}: SalesOrderLineFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const { carbon } = useCarbon();
  const { company } = useUser();
  const { orderId } = useParams();
  const isOverlay = Boolean(onDismiss && fetcher && action);
  const dismiss = onDismiss ?? onClose;

  if (!orderId && !initialValues.salesOrderId) {
    throw new Error("orderId not found");
  }
  const resolvedOrderId = orderId ?? initialValues.salesOrderId;

  const routeData = useRouteData<{
    salesOrder: SalesOrder;
  }>(path.to.salesOrder(resolvedOrderId));

  const isLocked = isSalesOrderLocked(routeData?.salesOrder?.status);
  const isEditable = !isLocked;

  const baseCurrency = company?.baseCurrencyCode ?? "USD";

  const [lineType, setLineType] = useState(initialValues.salesOrderLineType);
  const [locationId, setLocationId] = useState(initialValues.locationId ?? "");
  const [saleQuantity, setSaleQuantity] = useState(
    initialValues.saleQuantity ?? 1
  );
  const [itemData, setItemData] = useState<{
    itemId: string;
    methodType: string;
    description: string;
    unitPrice: number;
    uom: string;
    storageUnitId: string;
    modelUploadId: string | null;
    priceListId: string | null;
    priceListName: string | null;
    priceTrace: PriceTraceStep[] | null;
  }>({
    itemId: initialValues.itemId ?? "",
    description: initialValues.description ?? "",
    methodType: initialValues.methodType ?? "",
    unitPrice: initialValues.unitPrice ?? 0,
    uom: initialValues.unitOfMeasureCode ?? "",
    storageUnitId: initialValues.storageUnitId ?? "",
    modelUploadId: initialValues.modelUploadId ?? null,
    priceListId:
      (initialValues as { priceListId?: string | null }).priceListId ?? null,
    priceListName: null,
    priceTrace:
      (initialValues as { priceTrace?: PriceTraceStep[] | null }).priceTrace ??
      null
  });

  const isEditing = initialValues.id !== undefined;
  const isFixedAsset = initialValues.salesOrderLineType === "Fixed Asset";
  const [activeTab, setActiveTab] = useState<"item" | "asset">(
    isFixedAsset ? "asset" : "item"
  );

  const configModal = useConfigTableModal();
  const [items] = useItems();
  const initialConfig = parseInitialConfig(initialValues.configuration);
  const [configTableRows, setConfigTableRows] = useState<Row[] | null>(
    initialConfig.rows
  );
  const [configTablePrimaryKeys, setConfigTablePrimaryKeys] = useState<
    string[]
  >(initialConfig.primaryKeys);
  const [configTableTotal, setConfigTableTotal] = useState(initialConfig.total);
  // True when the selected item carries Color/Size attribute selections (a
  // Consumable with a Fabric/Trim color set) — set on item select. Styles are
  // covered by isStyleLine without waiting on the fetch.
  const [hasVariantAttributes, setHasVariantAttributes] = useState(false);

  // Prefer the selected item's real type over the picker filter. Choosing a
  // Style under "All Items" leaves lineType as Part/Item, but the grid still
  // applies — match PO line behavior (set type from the item on select).
  const selectedItemType =
    items.find((i) => i.id === itemData.itemId)?.type ?? lineType;
  const isStyleLine = selectedItemType === "Style" || lineType === "Style";
  // Any item with variant attributes uses the per-variant quantity grid.
  const isConfigurableLine = isStyleLine || hasVariantAttributes;

  // Configurable items use the config-quantity grid when adding/editing a
  // parent. Variant SKU lines (no stored configuration) use plain quantity.
  const hasConfigurationParameters =
    isConfigurableLine &&
    Boolean(itemData.itemId) &&
    !(isEditing && !initialValues.configuration);

  // A Style parent line's quantity comes from the color×size grid.
  // Variant SKU lines use plain quantity and are not blocked here.
  const isMissingStyleQuantity =
    hasConfigurationParameters && !(saleQuantity > 0);

  const applyConfig = (data: unknown) => {
    if (!isConfigTableOverlaySuccess(data)) return;
    setConfigTableRows(data.configuration.configTable);
    setConfigTablePrimaryKeys(data.primaryKeys);
    setConfigTableTotal(data.total);
    // Always mirror the grid total — a zero confirm must wipe a prior quantity.
    onQuantityChange(data.total);
  };

  const openConfigTable = () => {
    if (!itemData.itemId) return;
    configModal.open({
      itemId: itemData.itemId,
      configuration: toConfigTableValue(
        configTableRows,
        configTablePrimaryKeys
      ),
      onConfirm: applyConfig
    });
  };

  const clearConfig = () => {
    setConfigTableRows(null);
    setConfigTablePrimaryKeys([]);
    setConfigTableTotal(0);
  };

  const [assetOptions, setAssetOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [assetData, setAssetData] = useState<{
    assetId: string;
    description: string;
    saleQuantity: number;
    unitPrice: number;
    taxPercent: number;
    shippingCost: number;
    addOnCost: number;
    nonTaxableAddOnCost: number;
  }>({
    assetId: initialValues.assetId ?? "",
    description: initialValues.description ?? "",
    saleQuantity: initialValues.saleQuantity ?? 1,
    unitPrice: initialValues.unitPrice ?? 0,
    taxPercent: initialValues.taxPercent ?? 0,
    shippingCost: initialValues.shippingCost ?? 0,
    addOnCost: initialValues.addOnCost ?? 0,
    nonTaxableAddOnCost: initialValues.nonTaxableAddOnCost ?? 0
  });

  useMount(() => {
    if (!carbon || !company.id) return;
    (async () => {
      const assets = await carbon
        .from("fixedAsset")
        .select("id, fixedAssetId, name")
        .eq("companyId", company.id)
        .in("status", ["Active", "Fully Depreciated"])
        .order("fixedAssetId");
      const options = (assets.data ?? []).map((a) => ({
        value: a.id,
        label: `${a.fixedAssetId} — ${a.name}`
      }));
      if (
        initialValues.assetId &&
        !options.some((o) => o.value === initialValues.assetId)
      ) {
        const current = await carbon
          .from("fixedAsset")
          .select("id, fixedAssetId, name")
          .eq("id", initialValues.assetId)
          .single();
        if (current.data) {
          options.unshift({
            value: current.data.id,
            label: `${current.data.fixedAssetId} — ${current.data.name}`
          });
        }
      }
      setAssetOptions(options);
    })();
  });

  const pricingRuleId = (initialValues as { priceListId?: string | null })
    .priceListId;

  useEffect(() => {
    if (!pricingRuleId || !carbon) return;
    carbon
      .from("pricingRule")
      .select("name")
      .eq("id", pricingRuleId)
      .single()
      .then(({ data }) => {
        if (data?.name) {
          setItemData((d) => ({ ...d, priceListName: data.name }));
        }
      });
  }, [pricingRuleId, carbon]);

  const onTypeChange = (t: SalesOrderLineType) => {
    // @ts-ignore
    setLineType(t);
    clearConfig();
    const nextQty = t === "Style" ? 0 : 1;
    setSaleQuantity(nextQty);
    setItemData((d) => ({
      itemId: "",
      description: "",
      unitPrice: 0,
      methodType: "",
      uom: "EA",
      storageUnitId: "",
      modelUploadId: null,
      priceListId: null,
      priceListName: null,
      priceTrace: null
    }));
  };

  const currencyFormatter = useCurrencyFormatter();
  const percentFormatter = usePercentFormatter();

  const resolvePrice = useCallback(
    async (itemId: string, quantity: number) => {
      const customerId = routeData?.salesOrder?.customerId;
      if (!customerId) return null;

      try {
        const response = await fetch(path.to.api.salesResolvePrice, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId, itemId, quantity })
        });
        if (response.ok) {
          const result = await response.json();
          return {
            finalPrice: result.finalPrice as number,
            priceListId: null as string | null,
            priceListName: "Pricing Rules" as string | null,
            trace: result.trace ?? null
          };
        }
      } catch {
        // Fall back to itemUnitSalePrice on any error
      }
      return null;
    },
    [routeData?.salesOrder?.customerId]
  );

  const debouncedQuantityResolve = useDebounce(async (qty: number) => {
    if (!itemData.itemId) {
      return;
    }
    const result = await resolvePrice(itemData.itemId, qty);
    if (result) {
      setItemData((d) => ({
        ...d,
        unitPrice: result.finalPrice,
        priceListId: result.priceListId,
        priceListName: result.priceListName,
        priceTrace: result.trace
      }));
    }
  }, 400);

  const onQuantityChange = (qty: number) => {
    setSaleQuantity(qty);
    debouncedQuantityResolve(qty);
  };

  // Configurable-item membership can arrive after the first selection (the API
  // list loads on mount). Force quantity to 0 once we know a grid is required
  // and nothing has been configured yet — otherwise a default 1 can stick.
  // Existing lines keep their saved quantity: zeroing it here would misreport
  // what's on the order (Save stays blocked until the grid is filled anyway).
  useEffect(() => {
    if (
      !isEditing &&
      hasConfigurationParameters &&
      configTableTotal <= 0 &&
      saleQuantity !== 0
    ) {
      setSaleQuantity(0);
    }
  }, [isEditing, hasConfigurationParameters, configTableTotal, saleQuantity]);

  const onChange = async (itemId: string) => {
    if (!itemId) return;
    if (!carbon || !company.id) return;
    clearConfig();
    setHasVariantAttributes(false);
    // Adopt the item before enriching it: the lookups below take several round
    // trips, and the quantity control (grid trigger for configurable styles)
    // keys off the selected item, so it must swap on selection, not on arrival.
    // Method / description / UOM come from the preloaded items store — no need
    // to wait on the item query just to fill those fields.
    const storeItem = items.find((i) => i.id === itemId);
    const storeType = storeItem?.type;
    setItemData((d) => ({
      ...d,
      itemId,
      description: storeItem?.name ?? "",
      // Prefer store default; never keep the previous item's Method.
      methodType: storeItem?.defaultMethodType ?? "",
      uom: storeItem?.unitOfMeasureCode ?? "EA"
    }));
    // Sync line type from the item so "All Items" → Style still gets the grid
    // and submits salesOrderLineType=Style (not the filter's "Item"/Part).
    if (storeType) {
      setLineType(storeType as SalesOrderLineType);
    }
    // Styles always get quantity from the color×size grid — start at 0.
    const isStyle = storeType === "Style" || lineType === "Style";
    const quantityForItem = isStyle ? 0 : saleQuantity || 1;
    if (isStyle || quantityForItem !== saleQuantity) {
      onQuantityChange(quantityForItem);
    }
    const [item, price, variantAttributes] = await Promise.all([
      carbon
        .from("item")
        .select(
          "name, readableIdWithRevision, defaultMethodType, unitOfMeasureCode, modelUploadId, type"
        )
        .eq("id", itemId)
        .eq("companyId", company.id)
        .single(),
      carbon
        .from("itemUnitSalePrice")
        .select("unitSalePrice")
        .eq("itemId", itemId)
        .eq("companyId", company.id)
        .maybeSingle(),
      // Any item with attribute selections (Style, Consumable fabric/trim, …)
      // gets the config grid — not limited to Color/Size system attrs.
      carbon
        .from("itemAttributeSelection")
        // Composite PK — no `id` column; select a real column.
        .select("attributeValueId")
        .eq("itemId", itemId)
        .eq("companyId", company.id)
        .limit(1)
    ]);

    if (item.data?.type) {
      setLineType(item.data.type as SalesOrderLineType);
    }

    // Any item carrying variant attributes is grid-driven: flag it and zero the
    // quantity (the grid total fills it in). Styles are already handled above.
    const itemHasVariantAttributes =
      item.data?.type === "Style" || (variantAttributes?.data?.length ?? 0) > 0;
    setHasVariantAttributes(itemHasVariantAttributes);
    if (itemHasVariantAttributes && !isStyle) {
      onQuantityChange(0);
    }

    // Get default storage unit or storage unit with highest quantity
    const defaultStorageUnitId = locationId
      ? await getDefaultStorageUnitForJob(
          carbon,
          itemId,
          locationId,
          company.id
        )
      : null;

    let resolvedPrice = price.data?.unitSalePrice ?? 0;
    let priceListId: string | null = null;

    const result = await resolvePrice(itemId, quantityForItem);
    if (result) {
      resolvedPrice = result.finalPrice;
      priceListId = result.priceListId;
    }

    setItemData({
      itemId,
      description: item.data?.name ?? storeItem?.name ?? "",
      methodType:
        item.data?.defaultMethodType ?? storeItem?.defaultMethodType ?? "",
      unitPrice: resolvedPrice,
      uom: item.data?.unitOfMeasureCode ?? storeItem?.unitOfMeasureCode ?? "EA",
      storageUnitId: defaultStorageUnitId ?? "",
      modelUploadId: item.data?.modelUploadId ?? null,
      priceListId,
      priceListName: result?.priceListName ?? null,
      priceTrace: result?.trace ?? null
    });
  };

  const onLocationChange = async (newLocation: { value: string } | null) => {
    if (!carbon) throw new Error("carbon is not defined");
    if (typeof newLocation?.value !== "string")
      throw new Error("locationId is not a string");

    setLocationId(newLocation.value);
    if (!itemData.itemId) return;

    // Get default storage unit or storage unit with highest quantity for the new location
    const defaultStorageUnitId = await getDefaultStorageUnitForJob(
      carbon,
      itemData.itemId,
      newLocation.value,
      company.id
    );

    setItemData((d) => ({
      ...d,
      storageUnitId: defaultStorageUnitId ?? ""
    }));
  };

  const costsDisclosure = useDisclosure();
  const assetCostsDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const formAction =
    action ??
    (isEditing
      ? path.to.salesOrderLine(resolvedOrderId, initialValues.id!)
      : path.to.newSalesOrderLine(resolvedOrderId));

  const Header = isOverlay ? ModalHeader : ModalCardHeader;
  const Title = isOverlay ? ModalTitle : ModalCardTitle;
  const Description = isOverlay ? ModalDescription : ModalCardDescription;
  const Body = isOverlay ? ModalBody : ModalCardBody;
  const Footer = isOverlay ? ModalFooter : ModalCardFooter;

  const form = (
    <ValidatedForm
      defaultValues={initialValues}
      validator={salesOrderLineValidator}
      method="post"
      action={formAction}
      fetcher={fetcher}
      className={cn(
        "w-full",
        // Overlay ModalContent is overflow-hidden; pin an explicit max-h on the
        // form (same as PO line) so Body can scroll when the viewport is short.
        isOverlay && "flex min-h-0 max-h-[85vh] flex-1 flex-col"
      )}
      isDisabled={isEditing && isLocked}
      onSubmit={() => {
        if (type === "modal") onClose?.();
      }}
    >
      <Header
        className={cn(
          "flex-row items-start justify-between gap-6",
          (type === "modal" || isOverlay) && "pr-20",
          isOverlay && "shrink-0"
        )}
      >
        <div className="min-w-0 space-y-1.5">
          <Title
            className={cn(
              isEditing &&
                !isFixedAsset &&
                !itemData?.itemId &&
                "text-muted-foreground"
            )}
          >
            {isEditing
              ? isFixedAsset
                ? initialValues.assetReadableId || t`Fixed Asset`
                : getItemReadableId(items, itemData?.itemId) || "..."
              : t`New Sales Order Line`}
          </Title>
          <Description>
            {isEditing ? (
              <div className="flex flex-col items-start gap-1">
                <span>
                  {isFixedAsset
                    ? initialValues.assetName || assetData.description
                    : itemData?.description}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-2">
                    {initialValues?.saleQuantity}
                    {!isFixedAsset && <MethodIcon type={itemData.methodType} />}
                  </Badge>
                  <Badge variant="green">
                    {currencyFormatter.format(initialValues?.unitPrice ?? 0)}{" "}
                    {initialValues?.unitOfMeasureCode}
                  </Badge>
                  {initialValues?.taxPercent > 0 ? (
                    <Badge variant="red">
                      {percentFormatter.format(initialValues?.taxPercent)}{" "}
                      <Trans>Tax</Trans>
                    </Badge>
                  ) : null}
                </div>
              </div>
            ) : (
              <Trans>
                A sales order line contains order details for a particular item
              </Trans>
            )}
          </Description>
        </div>
        <div className="flex shrink-0 items-center">
          {!isEditing && (
            <TabsList>
              <TabsTrigger value="item">
                <LuBox className="mr-1" />
                <Trans>Item</Trans>
              </TabsTrigger>
              <TabsTrigger value="asset">
                <LuLandmark className="mr-1" />
                <Trans>Asset</Trans>
              </TabsTrigger>
            </TabsList>
          )}
          {isEditing && permissions.can("update", "sales") && !isLocked && (
            <CardAction>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    icon={<BsThreeDotsVertical />}
                    aria-label={t`More`}
                    variant="ghost"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    destructive
                    onClick={deleteDisclosure.onOpen}
                  >
                    <DropdownMenuIcon icon={<LuTrash />} />
                    <Trans>Delete Line</Trans>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          )}
        </div>
      </Header>
      <Body className={cn(isOverlay && "mb-0 min-h-0 flex-1 overflow-y-auto")}>
        <Hidden name="id" />
        <Hidden name="salesOrderId" />

        <TabsContent value="item">
          {!isEditing && (
            <Hidden name="description" value={itemData?.description ?? ""} />
          )}
          <Hidden
            name="modelUploadId"
            value={itemData?.modelUploadId ?? undefined}
          />
          <Hidden
            name="priceListId"
            value={itemData?.priceListId ?? undefined}
          />
          <Hidden
            name="priceTrace"
            value={
              itemData?.priceTrace
                ? JSON.stringify(itemData.priceTrace)
                : undefined
            }
          />
          <Hidden name="unitOfMeasureCode" value={itemData.uom} />
          <Hidden
            name="configuration"
            value={
              configTableRows
                ? JSON.stringify({
                    configTable: configTableRows,
                    configTablePrimaryKeys
                  })
                : ""
            }
          />
          <VStack>
            <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
              <Item
                name="itemId"
                label={lineType}
                type={lineType as "Part"}
                typeFieldName="salesOrderLineType"
                value={itemData.itemId}
                locationId={locationId}
                onChange={(value) => {
                  onChange(value?.value as string);
                }}
                onTypeChange={onTypeChange}
              />

              {isEditing && (
                <InputControlled
                  name="description"
                  label={t`Short Description`}
                  onChange={(value) => {
                    setItemData((d) => ({
                      ...d,
                      description: value
                    }));
                  }}
                  value={itemData.description}
                />
              )}

              {lineType !== "Comment" && (
                <>
                  <SelectControlled
                    name="methodType"
                    label={t`Method`}
                    // The schema marks methodType optional so Fixed Asset lines
                    // can skip it, but every item line requires one — don't
                    // advertise it as optional (or offer a clear button) there.
                    isOptional={lineType === "Fixed Asset"}
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
                  {isConfigurableLine ? (
                    <QuantityWithConfigTable
                      name="saleQuantity"
                      label={t`Quantity`}
                      value={saleQuantity}
                      onChange={onQuantityChange}
                      hasConfigurationParameters={hasConfigurationParameters}
                      onOpenConfigTable={
                        hasConfigurationParameters ? openConfigTable : undefined
                      }
                      configTableTotal={configTableTotal}
                      // Grid-backed configs are never typed by hand — quantity
                      // only comes from confirmed per-variant totals.
                      isReadOnly={hasConfigurationParameters}
                      minValue={0}
                    />
                  ) : (
                    <NumberControlled
                      name="saleQuantity"
                      label={t`Quantity`}
                      value={saleQuantity}
                      onChange={onQuantityChange}
                    />
                  )}
                  <div className="flex flex-col gap-y-2 w-full">
                    <div className="flex items-center justify-between min-h-[16px]">
                      <span className="text-xs font-medium text-muted-foreground">
                        {t`Unit Price`}
                      </span>
                      <PriceTracePopover
                        trace={itemData.priceTrace}
                        currencyCode={baseCurrency}
                      />
                    </div>
                    <NumberControlled
                      name="unitPrice"
                      value={itemData.unitPrice}
                      formatOptions={{
                        style: "currency",
                        currency: baseCurrency
                      }}
                      onChange={(value) =>
                        setItemData((d) => ({
                          ...d,
                          unitPrice: value
                        }))
                      }
                    />
                  </div>
                  <DatePicker name="promisedDate" label={t`Promised Date`} />
                  {[
                    "Style",
                    "Part",
                    "Material",
                    "Service",
                    "Tool",
                    "Consumable"
                  ].includes(lineType) && (
                    <Location
                      name="locationId"
                      label={t`Shipping Location`}
                      onChange={onLocationChange}
                    />
                  )}
                  {[
                    "Style",
                    "Part",
                    "Material",
                    "Tool",
                    "Fixture",
                    "Consumable"
                  ].includes(lineType) && (
                    <StorageUnit
                      name="storageUnitId"
                      label={t`Storage Unit`}
                      locationId={locationId}
                      itemId={itemData.itemId}
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
                  )}
                </>
              )}
              <CustomFormFields table="salesOrderLine" />
            </div>

            {lineType !== "Comment" && (
              <div className="w-full">
                <div className="w-full border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 mt-4">
                  <HStack
                    className="w-full justify-between cursor-pointer"
                    onClick={costsDisclosure.onToggle}
                  >
                    <Label>
                      <Trans>Tax &amp; Additional Costs</Trans>
                    </Label>
                    <HStack>
                      {(initialValues?.taxPercent ?? 0) > 0 && (
                        <Badge variant="red">
                          {percentFormatter.format(
                            initialValues?.taxPercent ?? 0
                          )}{" "}
                          <Trans>Tax</Trans>
                        </Badge>
                      )}
                      {(initialValues?.shippingCost ?? 0) > 0 && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <LuTruck />
                          <span>
                            {currencyFormatter.format(
                              initialValues?.shippingCost ?? 0
                            )}
                          </span>
                        </Badge>
                      )}
                      {(initialValues?.addOnCost ?? 0) > 0 ||
                        ((initialValues?.nonTaxableAddOnCost ?? 0) > 0 && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <LuPlus />
                            <span>
                              {currencyFormatter.format(
                                (initialValues?.addOnCost ?? 0) +
                                  (initialValues?.nonTaxableAddOnCost ?? 0)
                              )}{" "}
                              <Trans>Add-On</Trans>
                            </span>
                          </Badge>
                        ))}

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
                        className={`transition-transform ${
                          costsDisclosure.isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </HStack>
                  </HStack>
                  <div
                    className={`grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ${
                      costsDisclosure.isOpen ? "" : "hidden"
                    }`}
                  >
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
                    <Number
                      name="shippingCost"
                      label={t`Shipping Cost`}
                      minValue={0}
                      formatOptions={{
                        style: "currency",
                        currency: baseCurrency
                      }}
                    />
                    <Number
                      name="addOnCost"
                      label={t`Add-On Cost`}
                      formatOptions={{
                        style: "currency",
                        currency: baseCurrency
                      }}
                    />
                    <Number
                      name="nonTaxableAddOnCost"
                      label={t`Non-Taxable Add-On Cost`}
                      formatOptions={{
                        style: "currency",
                        currency: baseCurrency
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </VStack>
        </TabsContent>

        {activeTab === "asset" && (
          <>
            <Hidden name="salesOrderLineType" value="Fixed Asset" />
            <Hidden name="description" value={assetData.description} />
            <VStack>
              <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                <Combobox
                  name="assetId"
                  label={t`Fixed Asset`}
                  isOptional={false}
                  options={assetOptions}
                  value={assetData.assetId}
                  onChange={(selected) => {
                    setAssetData((d) => ({
                      ...d,
                      assetId: (selected?.value as string) ?? ""
                    }));
                  }}
                />
                <Location
                  name="locationId"
                  label={t`Shipping Location`}
                  onChange={onLocationChange}
                />
                <FormControl>
                  <FormLabel>
                    <Trans>Description</Trans>
                  </FormLabel>
                  <Input
                    value={assetData.description}
                    onChange={(e) =>
                      setAssetData((d) => ({
                        ...d,
                        description: e.target.value
                      }))
                    }
                  />
                </FormControl>
                <DatePicker name="promisedDate" label={t`Promised Date`} />
                <NumberControlled
                  name="saleQuantity"
                  label={t`Quantity`}
                  isOptional={false}
                  isDisabled
                  value={1}
                  onChange={() => undefined}
                />
                <NumberControlled
                  name="unitPrice"
                  label={t`Unit Price`}
                  isOptional={false}
                  value={assetData.unitPrice}
                  formatOptions={{
                    style: "currency",
                    currency: baseCurrency
                  }}
                  onChange={(value) =>
                    setAssetData((d) => ({
                      ...d,
                      unitPrice: value
                    }))
                  }
                />
                <CustomFormFields table="salesOrderLine" />
              </div>

              <div className="h-4" />

              <div className="w-full border border-border rounded-md shadow-sm p-4 flex flex-col gap-4">
                <HStack
                  className="w-full justify-between cursor-pointer"
                  onClick={assetCostsDisclosure.onToggle}
                >
                  <Label>
                    <Trans>Tax &amp; Additional Costs</Trans>
                  </Label>
                  <HStack>
                    {assetData.taxPercent > 0 && (
                      <Badge variant="red">
                        {percentFormatter.format(assetData.taxPercent)}{" "}
                        <Trans>Tax</Trans>
                      </Badge>
                    )}
                    {assetData.shippingCost > 0 && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <LuTruck />
                        <span>
                          {currencyFormatter.format(assetData.shippingCost)}
                        </span>
                      </Badge>
                    )}
                    <IconButton
                      icon={<LuChevronRight />}
                      aria-label={
                        assetCostsDisclosure.isOpen
                          ? t`Collapse Costs`
                          : t`Expand Costs`
                      }
                      variant="ghost"
                      size="md"
                      onClick={(e) => {
                        e.stopPropagation();
                        assetCostsDisclosure.onToggle();
                      }}
                      className={`transition-transform ${assetCostsDisclosure.isOpen ? "rotate-90" : ""}`}
                    />
                  </HStack>
                </HStack>
                <div
                  className={`grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ${
                    assetCostsDisclosure.isOpen ? "" : "hidden"
                  }`}
                >
                  <NumberControlled
                    name="taxPercent"
                    label={t`Tax Percent`}
                    value={assetData.taxPercent}
                    minValue={0}
                    maxValue={1}
                    step={0.0001}
                    formatOptions={{
                      style: "percent",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2
                    }}
                    onChange={(value) =>
                      setAssetData((d) => ({
                        ...d,
                        taxPercent: value
                      }))
                    }
                  />
                  <NumberControlled
                    name="shippingCost"
                    label={t`Shipping Cost`}
                    value={assetData.shippingCost}
                    minValue={0}
                    formatOptions={{
                      style: "currency",
                      currency: baseCurrency
                    }}
                    onChange={(value) =>
                      setAssetData((d) => ({
                        ...d,
                        shippingCost: value
                      }))
                    }
                  />
                  <NumberControlled
                    name="addOnCost"
                    label={t`Add-On Cost`}
                    value={assetData.addOnCost}
                    formatOptions={{
                      style: "currency",
                      currency: baseCurrency
                    }}
                    onChange={(value) =>
                      setAssetData((d) => ({
                        ...d,
                        addOnCost: value
                      }))
                    }
                  />
                  <NumberControlled
                    name="nonTaxableAddOnCost"
                    label={t`Non-Taxable Add-On Cost`}
                    value={assetData.nonTaxableAddOnCost}
                    formatOptions={{
                      style: "currency",
                      currency: baseCurrency
                    }}
                    onChange={(value) =>
                      setAssetData((d) => ({
                        ...d,
                        nonTaxableAddOnCost: value
                      }))
                    }
                  />
                </div>
              </div>
            </VStack>
          </>
        )}
      </Body>
      <Footer className={cn(isOverlay && "shrink-0")}>
        <Submit
          isDisabled={
            !isEditable ||
            isMissingStyleQuantity ||
            (isEditing
              ? !permissions.can("update", "sales")
              : !permissions.can("create", "sales"))
          }
        >
          <Trans>Save</Trans>
        </Submit>
      </Footer>
    </ValidatedForm>
  );

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "item" | "asset")}
        className={cn(
          "w-full",
          isOverlay && "flex min-h-0 max-h-[85vh] w-[56rem] max-w-full flex-col"
        )}
      >
        {isOverlay ? (
          form
        ) : (
          <ModalCardProvider type={type}>
            <ModalCard
              onClose={dismiss}
              isCollapsible={isEditing}
              defaultCollapsed={false}
            >
              <ModalCardContent size="xxlarge">{form}</ModalCardContent>
            </ModalCard>
          </ModalCardProvider>
        )}
      </Tabs>
      {configModal.node}
      {isEditing && deleteDisclosure.isOpen && (
        <DeleteSalesOrderLine
          line={initialValues as SalesOrderLine}
          onCancel={deleteDisclosure.onClose}
        />
      )}
    </>
  );
};

export default SalesOrderLineForm;
