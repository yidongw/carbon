"use client";
import { useCarbon } from "@carbon/auth";
import type { Database } from "@carbon/database";
import { ValidatedForm } from "@carbon/form";
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
  useDisclosure,
  useThrottle,
  VStack
} from "@carbon/react";
import { getItemReadableId } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { nanoid } from "nanoid";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  LuArrowLeft,
  LuChevronDown,
  LuChevronRight,
  LuCog,
  LuExternalLink,
  LuGitPullRequest,
  LuGitPullRequestCreate,
  LuGitPullRequestCreateArrow,
  LuLock,
  LuSettings2,
  LuSquareFunction,
  LuTruck,
  LuX
} from "react-icons/lu";
import { Link, useFetcher, useFetchers, useSearchParams } from "react-router";
import type { z } from "zod";
import {
  MethodIcon,
  MethodItemTypeIcon,
  SourcingTypeIcon,
  TrackingTypeIcon
} from "~/components";
import { ConfigurationEditor } from "~/components/Configurator/ConfigurationEditor";
import type { Configuration } from "~/components/Configurator/types";
import {
  DefaultMethodType,
  Hidden,
  Item,
  Location,
  Number,
  Select,
  StorageUnit,
  Submit,
  UnitOfMeasure
} from "~/components/Form";
import { useStorageUnits } from "~/components/Form/StorageUnit";
import { useUnitOfMeasure } from "~/components/Form/UnitOfMeasure";
import type {
  Item as SortableItem,
  SortableItemRenderProps
} from "~/components/SortableList";
import { SortableList, SortableListItem } from "~/components/SortableList";
import { usePermissions, useUser } from "~/hooks";
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
import type {
  MethodItemType,
  MethodType,
  SourcingType
} from "~/modules/shared";
import {
  defaultLineQuantity,
  methodType,
  shouldShowVariantQuantityGrid,
  sourcingType
} from "~/modules/shared";
import type { Item as ItemType } from "~/stores";
import { useItems } from "~/stores";
import type { ConfigurationRuleBindings } from "../../configurationRuleBindings";
import type { methodOperationValidator } from "../../items.models";
import { methodMaterialValidator } from "../../items.models";
import type { MethodBindings } from "../../methodBindings";
import type {
  ConfigurationParameter,
  ConfigurationRule,
  MakeMethod
} from "../../types";
import { getLinkToItemDetails } from "./ItemForm";

type Material = z.infer<typeof methodMaterialValidator> & {
  description: string;
  item: {
    name: string;
    readableIdWithRevision?: string | null;
    itemTrackingType: Database["public"]["Enums"]["itemTrackingType"];
    replenishmentSystem: string | null;
    defaultMethodType: Database["public"]["Enums"]["methodType"];
    sourcingType: Database["public"]["Enums"]["sourcingType"];
  };
};

type Operation = z.infer<typeof methodOperationValidator>;

type ItemWithData = SortableItem & {
  data: Material;
};

type BillOfMaterialProps = {
  methodBindings: MethodBindings;
  configurable?: boolean;
  makeMethod: MakeMethod;
  materials: Material[];
  operations: Operation[];
  parameters?: ConfigurationParameter[];
  configurationRules?: ConfigurationRule[];
  replenishmentSystem?: string;
  configurationRuleBindings: ConfigurationRuleBindings;
};

type OrderState = {
  [key: string]: number;
};

type CheckedState = {
  [key: string]: boolean;
};

type TemporaryItems = {
  [key: string]: Material;
};

const initialMethodMaterial: Omit<Material, "makeMethodId" | "order"> & {
  description: string;
} = {
  itemId: "",
  // @ts-expect-error
  itemType: "Item" as const,
  methodType: "Purchase to Order" as const,
  sourcingType: "Specified" as const,
  description: "",
  quantity: 1,
  unitOfMeasureCode: "EA",
  storageUnitIds: {}
};

const BillOfMaterial = ({
  methodBindings,
  configurable = false,
  configurationRules,
  makeMethod,
  materials: initialMaterials,
  operations,
  parameters,
  replenishmentSystem,
  configurationRuleBindings
}: BillOfMaterialProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const isReadOnly =
    permissions.can("update", "parts") === false ||
    makeMethod.status !== "Draft";

  const addItemButtonRef = useRef<HTMLButtonElement>(null);

  const [items] = useItems();
  const fetcher = useFetcher<{}>();
  const [searchParams] = useSearchParams();

  const makeMethodId = makeMethod.id;

  // The selected/open material is the single source of truth for both the
  // highlight and the expansion state. Seed it from the URL (SSR-safe, restores
  // on reload/deep-link) and mirror changes back via `syncMaterialIdToUrl`.
  const [selectedItemId, setSelectedItemId] = useState<string | null>(() =>
    searchParams.get("materialId")
  );
  const [temporaryItems, setTemporaryItems] = useState<TemporaryItems>({});
  const [checkedState, setCheckedState] = useState<CheckedState>({});
  const [orderState, setOrderState] = useState<OrderState>(() => {
    return initialMaterials.reduce((acc, material) => {
      acc[material.id!] = material.order;
      return acc;
    }, {} as OrderState);
  });

  const materialsById = new Map<string, Material>();

  // Add initial materials to map
  initialMaterials.forEach((material) => {
    if (!material.id) return;
    materialsById.set(material.id, material);
  });

  const pendingMaterials = usePendingMaterials(methodBindings);

  // Replace existing materials with pending ones
  pendingMaterials.forEach((pendingMaterial) => {
    if (!pendingMaterial.id) {
      materialsById.set("temporary", {
        ...pendingMaterial,
        description: "",
        item: {
          name: "",
          itemTrackingType: "Inventory",
          replenishmentSystem: "Buy and Make",
          defaultMethodType:
            pendingMaterial.methodType ?? "Pull from Inventory",
          sourcingType: pendingMaterial.sourcingType ?? "Specified"
        }
      });
    } else {
      materialsById.set(pendingMaterial.id, {
        ...materialsById.get(pendingMaterial.id)!,
        ...pendingMaterial
      });
    }
  });

  // Add temporary items
  Object.entries(temporaryItems).forEach(([id, material]) => {
    materialsById.set(id, material);
  });

  const rulesByField = new Map(
    configurationRules?.map((rule) => [rule.field, rule]) ?? []
  );

  const materials = makeItems(
    items,
    Array.from(materialsById.values()),
    orderState,
    checkedState,
    rulesByField,
    replenishmentSystem
  ).sort((a, b) => a.data.order - b.data.order);

  const onToggleItem = (id: string) => {
    if (isReadOnly) return;
    setCheckedState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Mirror the selected material into the URL with the History API instead of a
  // router navigation. Like the overlay system, this avoids revalidating the
  // page's loaders (and the top progress bar), so open/close is instant while
  // still keeping the state deep-linkable and restorable on reload.
  const syncMaterialIdToUrl = useCallback((id: string | null) => {
    const search = new URLSearchParams(window.location.search);
    if (id) {
      search.set("materialId", id);
    } else {
      search.delete("materialId");
    }
    const query = search.toString();
    const url =
      window.location.pathname +
      (query ? `?${query}` : "") +
      window.location.hash;
    window.history.replaceState(window.history.state, "", url);
  }, []);

  const onAddItem = () => {
    if (isReadOnly) return;
    const materialId = nanoid();
    setSelectedItemId(materialId);
    syncMaterialIdToUrl(materialId);

    let newOrder = 1;
    if (materials.length) {
      newOrder = Math.max(...materials.map((item) => item.data.order)) + 1;
    }

    const newMaterial: Material = {
      ...initialMethodMaterial,
      id: materialId,
      order: newOrder,
      makeMethodId
    };

    setTemporaryItems((prev) => ({
      ...prev,
      [materialId]: newMaterial
    }));

    setOrderState((prev) => ({
      ...prev,
      [materialId]: newOrder
    }));
  };

  const onRemoveItem = async (id: string) => {
    if (isReadOnly) return;

    // Check if this is a temporary item (exists in temporaryItems state)
    if (temporaryItems[id]) {
      setTemporaryItems((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    } else {
      fetcher.submit(new FormData(), {
        method: "post",
        action: methodBindings.urls.deleteMethodMaterial(id)
      });
    }

    setSelectedItemId(null);
    setOrderState((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const updateSortOrder = useThrottle((updates: Record<string, number>) => {
    let formData = new FormData();
    formData.append("updates", JSON.stringify(updates));
    fetcher.submit(formData, {
      method: "post",
      action: methodBindings.urls.methodMaterialsOrder
    });
  }, 1000);

  const onReorder = (items: ItemWithData[]) => {
    if (isReadOnly) return;

    // Create new order state
    const newOrderState = items.reduce<OrderState>((acc, item, index) => {
      acc[item.id] = index + 1;
      return acc;
    }, {});

    // Update order state immediately
    setOrderState(newOrderState);

    // Only send non-temporary items to the server
    const updates = Object.entries(newOrderState).reduce<
      Record<string, number>
    >((acc, [id, order]) => {
      if (!temporaryItems[id]) {
        acc[id] = order;
      }
      return acc;
    }, {});

    if (Object.keys(updates).length > 0) {
      updateSortOrder(updates);
    }
  };

  const onCloseOnDrag = useCallback(() => {
    setCheckedState((prev) => {
      const newState = { ...prev };
      let changed = false;

      materials.forEach((material) => {
        if (material.checked) {
          newState[material.id] = false;
          changed = true;
        }
      });

      return changed ? newState : prev;
    });
  }, [materials]);

  const renderListItem = ({
    item,
    items,
    order,
    onToggleItem,
    onRemoveItem
  }: SortableItemRenderProps<ItemWithData>) => {
    const isOpen = item.id === selectedItemId;
    const onSelectItem = (id: string | null) => {
      setSelectedItemId(id);
      syncMaterialIdToUrl(id);
    };

    return (
      <SortableListItem<Material>
        isReadOnly={isReadOnly}
        item={item}
        items={items}
        order={order}
        key={item.id}
        isExpanded={isOpen}
        isHighlighted={item.id === selectedItemId}
        onSelectItem={onSelectItem}
        onToggleItem={onToggleItem}
        onRemoveItem={onRemoveItem}
        handleDrag={onCloseOnDrag}
        className="my-2 "
        renderExtra={(item) => (
          <div key={`${isOpen}`}>
            <motion.button
              layout
              onClick={
                isOpen
                  ? () => {
                      onSelectItem(null);
                    }
                  : () => {
                      onSelectItem(item.id);
                    }
              }
              key="collapse"
              className={cn("absolute right-3 top-3 z-10")}
            >
              {isOpen ? (
                <motion.span
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    type: "spring",
                    duration: 1.95
                  }}
                >
                  <LuX className="h-5 w-5 text-foreground" />
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    type: "spring",
                    duration: 0.95
                  }}
                >
                  <LuSettings2 className="stroke-1 h-5 w-5 text-foreground/80 hover:stroke-primary/70" />
                </motion.span>
              )}
            </motion.button>

            <LayoutGroup id={`${item.id}`}>
              <AnimatePresence mode="popLayout">
                {isOpen ? (
                  <motion.div className="flex w-full flex-col ">
                    <div className=" w-full p-2">
                      <motion.div
                        initial={{
                          y: 0,
                          opacity: 0,
                          filter: "blur(4px)"
                        }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          filter: "blur(0px)"
                        }}
                        transition={{
                          type: "spring",
                          duration: 0.15
                        }}
                        layout
                        className="w-full "
                      >
                        <motion.div
                          initial={{ opacity: 0, filter: "blur(4px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.75,
                            delay: 0.15
                          }}
                        >
                          <MaterialForm
                            methodBindings={methodBindings}
                            configurable={configurable}
                            isReadOnly={isReadOnly}
                            item={item}
                            methodOperations={operations}
                            orderState={orderState}
                            temporaryItems={temporaryItems}
                            rulesByField={rulesByField}
                            onConfigure={onConfigure}
                            replenishmentSystem={replenishmentSystem}
                            setOrderState={setOrderState}
                            setSelectedItemId={setSelectedItemId}
                            setTemporaryItems={setTemporaryItems}
                            onSubmit={() => {
                              setSelectedItemId(null);
                              addItemButtonRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "nearest",
                                inline: "center"
                              });
                            }}
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </LayoutGroup>
          </div>
        )}
      />
    );
  };

  const configuratorDisclosure = useDisclosure();
  const [configuration, setConfiguration] = useState<Configuration | null>(
    null
  );

  const onConfigure = (configuration: Configuration) => {
    flushSync(() => {
      setConfiguration(configuration);
    });
    configuratorDisclosure.onOpen();
  };

  return (
    <Card>
      <HStack className="justify-between">
        <CardHeader>
          <CardTitle className="flex flex-row items-center gap-2">
            <Trans>Bill of Material</Trans> {isReadOnly && <LuLock />}
          </CardTitle>
        </CardHeader>

        <CardAction>
          <div className="flex items-center gap-2">
            <Button
              ref={addItemButtonRef}
              variant="secondary"
              isDisabled={isReadOnly}
              onClick={onAddItem}
            >
              <Trans>Add Item</Trans>
            </Button>
            {configurable && materials.length > 0 && (
              <IconButton
                icon={<LuSquareFunction />}
                aria-label={t`Configure`}
                variant="ghost"
                className={cn(
                  rulesByField.has(
                    `billOfMaterial:${makeMethodId}:${selectedItemId}`
                  ) && "text-emerald-500 hover:text-emerald-500"
                )}
                onClick={() =>
                  onConfigure({
                    label: t`Bill of Material`,
                    field: `billOfMaterial:${makeMethodId}:${selectedItemId}`,
                    code: rulesByField.get(
                      `billOfMaterial:${makeMethodId}:${selectedItemId}`
                    )?.code,
                    returnType: {
                      type: "list",
                      listOptions: materials
                        .map(
                          (m) => getItemReadableId(items, m.data.itemId) ?? ""
                        )
                        .filter((i) => !!i)
                    }
                  })
                }
              />
            )}
          </div>
        </CardAction>
      </HStack>
      <CardContent>
        <SortableList
          isReadOnly={isReadOnly}
          items={materials}
          onReorder={onReorder}
          onToggleItem={onToggleItem}
          onRemoveItem={onRemoveItem}
          renderItem={renderListItem}
        />
      </CardContent>
      {configuratorDisclosure.isOpen && configuration && (
        <ConfigurationEditor
          configuration={configuration}
          open={configuratorDisclosure.isOpen}
          parameters={parameters ?? []}
          onClose={configuratorDisclosure.onClose}
          configurationRuleBindings={configurationRuleBindings}
        />
      )}
    </Card>
  );
};

export default BillOfMaterial;

function MaterialForm({
  methodBindings,
  configurable,
  isReadOnly,
  item,
  methodOperations,
  temporaryItems,
  rulesByField,
  onConfigure,
  replenishmentSystem,
  setOrderState,
  setSelectedItemId,
  setTemporaryItems,
  onSubmit
}: {
  methodBindings: MethodBindings;
  configurable: boolean;
  isReadOnly: boolean;
  item: ItemWithData;
  methodOperations: Operation[];
  orderState: OrderState;
  temporaryItems: TemporaryItems;
  rulesByField: Map<string, ConfigurationRule>;
  replenishmentSystem?: string;
  setSelectedItemId: Dispatch<SetStateAction<string | null>>;
  setTemporaryItems: Dispatch<SetStateAction<TemporaryItems>>;
  setOrderState: Dispatch<SetStateAction<OrderState>>;
  onConfigure: (configuration: Configuration) => void;
  onSubmit: () => void;
}) {
  const { t } = useLingui();
  const { carbon } = useCarbon();
  const methodMaterialFetcher = useFetcher<{
    id: string;
    success: boolean;
    message: string;
  }>();
  const { company, defaults } = useUser();
  const [locationId, setLocationId] = useState<string | undefined>(
    defaults.locationId ?? undefined
  );

  const storageUnits = useStorageUnits(locationId);

  useEffect(() => {
    if (defaults.locationId) {
      setLocationId(defaults.locationId);
    }
  }, [defaults.locationId]);

  const unitOfMeasures = useUnitOfMeasure();

  const sourceDisclosure = useDisclosure({
    defaultIsOpen: true
  });
  const sourcingDisclosure = useDisclosure();
  const backflushDisclosure = useDisclosure();

  useEffect(() => {
    // Remove from temporary items after successful submission
    if (methodMaterialFetcher.data && methodMaterialFetcher.data.id) {
      // Clear temporary item after successful save
      setTemporaryItems((prev) => {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      });

      if (methodMaterialFetcher.data.success) {
        toast.success(methodMaterialFetcher.data.message);
      }
      onSubmit();
    }
  }, [item.id, methodMaterialFetcher.data, setTemporaryItems, onSubmit]);

  const [itemType, setItemType] = useState<MethodItemType>(item.data.itemType);
  const [itemData, setItemData] = useState<{
    itemId: string;
    methodType: MethodType;
    sourcingType: SourcingType;
    description: string;
    unitOfMeasureCode: string;
    methodOperationId: string | undefined;
    quantity: number;
    kit: boolean;
    storageUnitIds: Record<string, string>;
    requiresBatchTracking: boolean;
    requiresSerialTracking: boolean;
    itemReplenishmentSystem: string;
    hasVariantAttributes: boolean;
  }>({
    itemId: item.data.itemId ?? "",
    methodType: item.data.methodType ?? "Pull from Inventory",
    sourcingType: item.data.sourcingType ?? "Specified",
    description: item.data.description ?? "",
    unitOfMeasureCode: item.data.unitOfMeasureCode ?? "EA",
    methodOperationId: item.data.methodOperationId ?? undefined,
    quantity: item.data.quantity ?? 1,
    kit: item.data.kit ?? false,
    storageUnitIds: item.data.storageUnitIds ?? {},
    requiresBatchTracking: item.data.item?.itemTrackingType === "Batch",
    requiresSerialTracking: item.data.item?.itemTrackingType === "Serial",
    itemReplenishmentSystem:
      item.data.item?.replenishmentSystem ?? replenishmentSystem ?? "Buy",
    hasVariantAttributes: false
  });
  const variantsQuantityModal = useVariantsQuantityModal();
  const [variantsQuantityRows, setVariantsQuantityRows] = useState<
    Row[] | null
  >(null);
  const [variantsQuantityTotal, setVariantsQuantityTotal] = useState(0);
  const hasVariantsQuantity = shouldShowVariantQuantityGrid({
    hasVariantAttributes: itemData.hasVariantAttributes,
    itemId: itemData.itemId,
    isEditing: false,
    variantQuantities: null
  });

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
      sourcingType: "Specified",
      quantity: 1,
      description: "",
      unitOfMeasureCode: "EA",
      kit: false,
      storageUnitIds: {},
      methodOperationId: undefined,
      requiresBatchTracking: false,
      requiresSerialTracking: false,
      itemReplenishmentSystem: replenishmentSystem ?? "Buy",
      hasVariantAttributes: false
    });
  };

  const onItemChange = async (itemId: string) => {
    if (!carbon) return;
    if (
      methodBindings.bomItemBlacklistId &&
      itemId === methodBindings.bomItemBlacklistId
    ) {
      toast.error(t`An item cannot be added to itself.`);
      return;
    }

    const [itemResult, variantAttributes] = await Promise.all([
      carbon
        .from("item")
        .select(
          "name, readableIdWithRevision, type, unitOfMeasureCode, defaultMethodType, sourcingType, replenishmentSystem, itemTrackingType"
        )
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

    if (itemResult.error) {
      toast.error(t`Failed to load item details`);
      return;
    }

    const hasVariantAttributes = (variantAttributes?.data?.length ?? 0) > 0;
    setVariantsQuantityRows(null);
    setVariantsQuantityTotal(0);

    // Method type and sourcing are item-level properties; mirror them here so
    // the read-only display matches the item the moment it's selected.
    setItemData((d) => ({
      ...d,
      itemId,
      description: itemResult.data?.name ?? "",
      unitOfMeasureCode: itemResult.data?.unitOfMeasureCode ?? "EA",
      methodType: itemResult.data?.defaultMethodType ?? "Pull from Inventory",
      sourcingType: itemResult.data?.sourcingType ?? "Specified",
      kit: false,
      requiresBatchTracking: itemResult.data?.itemTrackingType === "Batch",
      requiresSerialTracking: itemResult.data?.itemTrackingType === "Serial",
      itemReplenishmentSystem: itemResult.data?.replenishmentSystem ?? "Buy",
      hasVariantAttributes,
      // Attribute parents take qty from the grid — leave 0 until confirmed.
      quantity: defaultLineQuantity(hasVariantAttributes, d.quantity || 1)
    }));
    if (itemResult.data?.type) {
      setItemType(itemResult.data.type as MethodItemType);
    }
  };

  const key = (field: string) => getFieldKey(field, item.id);

  const isTracked =
    itemData.requiresBatchTracking || itemData.requiresSerialTracking;

  return (
    <>
      <ValidatedForm
        action={
          temporaryItems[item.id]
            ? methodBindings.urls.newMethodMaterial
            : methodBindings.urls.methodMaterial(item.id!)
        }
        method="post"
        defaultValues={{
          ...item.data
        }}
        validator={methodMaterialValidator}
        className="w-full flex flex-col gap-y-4"
        fetcher={methodMaterialFetcher}
      >
        <div>
          <Hidden name="id" />
          <Hidden name="makeMethodId" />
          <Hidden name="order" />
          <Hidden name="kit" value={itemData.kit.toString()} />
          <Hidden
            name="storageUnitIds"
            value={JSON.stringify(itemData.storageUnitIds)}
          />
          <Hidden
            name="variantQuantities"
            value={
              variantsQuantityRows
                ? JSON.stringify({ variantTable: variantsQuantityRows })
                : ""
            }
          />
          {/* methodType and sourcingType are item-level properties; the fields
            above are read-only mirrors. They're still submitted to satisfy
            methodMaterialValidator, but upsertMethodMaterial re-derives both
            from the component item, so the submitted values are display-only —
            don't treat them as the source of truth. */}
          {itemData.itemReplenishmentSystem !== "Buy and Make" && (
            <Hidden name="sourcingType" value={itemData.sourcingType} />
          )}
        </div>

        <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
          <Item
            blacklist={
              methodBindings.bomItemBlacklistId
                ? [methodBindings.bomItemBlacklistId]
                : []
            }
            name="itemId"
            label={itemType}
            includeInactive
            type={itemType}
            validItemTypes={["Consumable", "Material", "Part", "Style"]}
            isConfigured={rulesByField.has(key("itemId"))}
            onChange={(value) => {
              onItemChange(value?.value as string);
            }}
            onConfigure={
              configurable && !temporaryItems[item.id]
                ? () =>
                    onConfigure({
                      label: t`Part`,
                      field: key("itemId"),
                      code: rulesByField.get(key("itemId"))?.code,
                      defaultValue: itemData.itemId,
                      returnType: {
                        type: "text",
                        helperText:
                          "the unique item identifier of the item (not the part number). you can get the item id from the key icon in the properties panel."
                      }
                    })
                : undefined
            }
            onTypeChange={onTypeChange}
          />
          {hasVariantsQuantity ? (
            <QuantityWithVariantsQuantity
              name="quantity"
              label={t`Quantity`}
              value={itemData.quantity}
              onChange={(value) =>
                setItemData((d) => ({ ...d, quantity: value }))
              }
              hasVariantsQuantity={hasVariantsQuantity}
              onOpenVariantsQuantity={openVariantsQuantity}
              variantsQuantityTotal={variantsQuantityTotal}
              isReadOnly={variantsQuantityTotal > 0}
              isConfigured={rulesByField.has(key("quantity"))}
              onConfigure={
                configurable && !temporaryItems[item.id]
                  ? () =>
                      onConfigure({
                        label: t`Quantity`,
                        field: key("quantity"),
                        code: rulesByField.get(key("quantity"))?.code,
                        defaultValue: itemData.quantity,
                        returnType: { type: "numeric" }
                      })
                  : undefined
              }
            />
          ) : (
            <Number
              name="quantity"
              label={t`Quantity`}
              isConfigured={rulesByField.has(key("quantity"))}
              onConfigure={
                configurable && !temporaryItems[item.id]
                  ? () =>
                      onConfigure({
                        label: t`Quantity`,
                        field: key("quantity"),
                        code: rulesByField.get(key("quantity"))?.code,
                        defaultValue: itemData.quantity,
                        returnType: { type: "numeric" }
                      })
                  : undefined
              }
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
            isReadOnly={true}
            isConfigured={rulesByField.has(key("unitOfMeasureCode"))}
            onConfigure={
              configurable && !temporaryItems[item.id]
                ? () =>
                    onConfigure({
                      label: t`Unit of Measure`,
                      field: key("unitOfMeasureCode"),
                      code: rulesByField.get(key("unitOfMeasureCode"))?.code,
                      defaultValue: itemData.unitOfMeasureCode,
                      returnType: {
                        type: "enum",
                        listOptions: unitOfMeasures.map((u) => u.value)
                      }
                    })
                : undefined
            }
          />
        </div>
        {itemData.itemReplenishmentSystem === "Buy and Make" && (
          <div className="border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 w-full">
            <HStack
              className="w-full justify-between cursor-pointer"
              onClick={sourcingDisclosure.onToggle}
            >
              <HStack>
                <LuTruck className="text-foreground" />
                <Label>Sourcing</Label>
              </HStack>
              <HStack>
                <Badge variant="secondary">
                  <SourcingTypeIcon
                    type={itemData.sourcingType}
                    className="size-3 mr-1"
                  />
                  {itemData.sourcingType}
                </Badge>
                <IconButton
                  icon={<LuChevronRight />}
                  aria-label={
                    sourcingDisclosure.isOpen
                      ? "Collapse Sourcing"
                      : "Expand Sourcing"
                  }
                  variant="ghost"
                  size="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    sourcingDisclosure.onToggle();
                  }}
                  className={`transition-transform ${
                    sourcingDisclosure.isOpen ? "rotate-90" : ""
                  }`}
                />
              </HStack>
            </HStack>
            <div
              className={`grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ${
                sourcingDisclosure.isOpen ? "" : "hidden"
              }`}
            >
              {/* Read-only: sourcing is set at the item level (Properties
                sidebar) and mirrored here. */}
              <Select
                name="sourcingType"
                label={t`Sourcing Type`}
                value={itemData.sourcingType}
                isReadOnly
                options={sourcingType.map((s) => ({
                  value: s,
                  label: (
                    <span className="flex items-center gap-2">
                      <SourcingTypeIcon type={s} />
                      {s}
                    </span>
                  )
                }))}
              />
            </div>
          </div>
        )}

        <div className="border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 w-full">
          <HStack
            className="w-full justify-between cursor-pointer"
            onClick={sourceDisclosure.onToggle}
          >
            <HStack>
              {itemData.methodType === "Make to Order" ? (
                <>
                  <LuGitPullRequestCreate />
                  <Label>
                    <Trans>Finish To</Trans>
                  </Label>
                </>
              ) : (
                <>
                  <LuGitPullRequest />
                  <Label>
                    <Trans>Pull From</Trans>
                  </Label>
                </>
              )}
            </HStack>
            <HStack>
              <Badge variant="secondary">
                <MethodIcon
                  type={itemData.methodType}
                  className="size-3 mr-1"
                />
                {itemData.methodType === "Purchase to Order"
                  ? t`Purchase to Order`
                  : itemData.methodType === "Pull from Inventory"
                    ? t`Pull from Inventory`
                    : t`Make to Order`}
              </Badge>
              <LuArrowLeft
                className={cn(
                  itemData.methodType !== "Pull from Inventory"
                    ? "rotate-180"
                    : ""
                )}
              />
              <Badge variant="secondary">
                <LuGitPullRequest className="size-3 mr-1" />
                {storageUnits.options?.find(
                  (s) => s.value === itemData.storageUnitIds[locationId ?? ""]
                )?.label ??
                  (itemData.methodType === "Make to Order"
                    ? t`WIP`
                    : t`Default Storage Unit`)}
              </Badge>
              <IconButton
                icon={<LuChevronRight />}
                aria-label={
                  sourceDisclosure.isOpen ? "Collapse Source" : "Expand Source"
                }
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  sourceDisclosure.onToggle();
                }}
                className={`transition-transform ${
                  sourceDisclosure.isOpen ? "rotate-90" : ""
                }`}
              />
            </HStack>
          </HStack>
          <div
            className={`grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ${
              sourceDisclosure.isOpen ? "" : "hidden"
            }`}
          >
            {/* Read-only: method type is the item's default method type
              (Properties sidebar) and mirrored here. */}
            <DefaultMethodType
              name="methodType"
              label={t`Method Type`}
              value={itemData.methodType}
              isReadOnly
              isConfigured={rulesByField.has(key("methodType"))}
              onConfigure={
                configurable && !temporaryItems[item.id]
                  ? () =>
                      onConfigure({
                        label: t`Method Type`,
                        field: key("methodType"),
                        code: rulesByField.get(key("methodType"))?.code,
                        defaultValue: itemData.methodType,
                        returnType: {
                          type: "enum",
                          listOptions: methodType
                        }
                      })
                  : undefined
              }
              replenishmentSystem={itemData.itemReplenishmentSystem}
            />
            <Location
              name="locationId"
              label={t`Location`}
              value={locationId}
              onChange={(value) => {
                setLocationId(value?.value as string);
              }}
            />
            <StorageUnit
              name="storageUnitId"
              label={t`Storage Unit`}
              value={itemData.storageUnitIds[locationId ?? ""]}
              locationId={locationId}
              onChange={(value) => {
                setItemData((d) => ({
                  ...d,
                  storageUnitIds: {
                    ...d.storageUnitIds,
                    [locationId ?? ""]: value?.id ?? ""
                  }
                }));
              }}
              isOptional
            />
          </div>
        </div>

        <div className="border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 w-full">
          <HStack
            className="w-full justify-between cursor-pointer"
            onClick={backflushDisclosure.onToggle}
          >
            <HStack>
              <LuGitPullRequestCreateArrow />
              <Label>{isTracked ? t`Operation` : t`Backflush`}</Label>
            </HStack>
            <HStack>
              <Badge
                variant={
                  methodOperations.length > 0 ? "secondary" : "destructive"
                }
              >
                <LuCog className="size-3 mr-1" />
                {itemData.methodOperationId
                  ? methodOperations.find(
                      (o) => o.id === itemData.methodOperationId
                    )?.description || t`Selected Operation`
                  : t`First Operation`}
              </Badge>
              <IconButton
                icon={<LuChevronRight />}
                aria-label={
                  backflushDisclosure.isOpen
                    ? "Collapse Operation"
                    : "Expand Operation"
                }
                variant="ghost"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  backflushDisclosure.onToggle();
                }}
                className={`transition-transform ${
                  backflushDisclosure.isOpen ? "rotate-90" : ""
                }`}
              />
            </HStack>
          </HStack>
          <div
            className={`grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ${
              backflushDisclosure.isOpen ? "" : "hidden"
            }`}
          >
            <Select
              name="methodOperationId"
              label={t`Operation`}
              isOptional
              options={methodOperations.map((o) => ({
                value: o.id!,
                label: o.description
              }))}
              onChange={(value) => {
                setItemData((d) => ({
                  ...d,
                  methodOperationId: value?.value
                }));
              }}
            />
          </div>
        </div>

        <motion.div
          className="flex flex-1 items-center justify-end w-full"
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            type: "spring",
            bounce: 0,
            duration: 0.55
          }}
        >
          <motion.div
            layout
            className="flex items-center justify-between gap-2 w-full"
          >
            {itemData.methodType === "Make to Order" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    leftIcon={
                      <MethodIcon type={"Make to Order"} isKit={itemData.kit} />
                    }
                    variant="secondary"
                    size="sm"
                    rightIcon={<LuChevronDown />}
                  >
                    {itemData.kit ? t`Kit` : t`Subassembly`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={itemData.kit ? "Kit" : "Subassembly"}
                    onValueChange={(value) => {
                      setItemData((d) => ({
                        ...d,
                        kit: value === "Kit"
                      }));
                    }}
                  >
                    <DropdownMenuRadioItem value="Subassembly">
                      <Trans>Subassembly</Trans>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Kit">
                      <Trans>Kit</Trans>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Submit
                isDisabled={
                  isReadOnly ||
                  methodMaterialFetcher.state !== "idle" ||
                  (hasVariantsQuantity && !(itemData.quantity > 0))
                }
                isLoading={methodMaterialFetcher.state === "submitting"}
              >
                <Trans>Save</Trans>
              </Submit>
            </div>
          </motion.div>
        </motion.div>
      </ValidatedForm>
      {variantsQuantityModal.node}
    </>
  );
}

function makeItems(
  items: ItemType[],
  materials: Material[],
  orderState: OrderState,
  checkedState: CheckedState,
  rulesByField?: Map<string, ConfigurationRule>,
  replenishmentSystem?: string
): ItemWithData[] {
  return materials.map((material) => {
    const order = material.id
      ? (orderState[material.id] ?? material.order)
      : material.order;
    const checked = material.id ? (checkedState[material.id] ?? false) : false;
    return makeItem(
      items,
      material,
      order,
      checked,
      rulesByField,
      replenishmentSystem
    );
  });
}

function materialHasRules(
  materialId: string,
  rulesByField?: Map<string, ConfigurationRule>
): boolean {
  if (!rulesByField) return false;
  const fields = ["itemId", "quantity", "unitOfMeasureCode", "methodType"];
  return fields.some((field) =>
    rulesByField.has(getFieldKey(field, materialId))
  );
}

function makeItem(
  items: ItemType[],
  material: Material,
  order: number,
  checked: boolean,
  rulesByField?: Map<string, ConfigurationRule>,
  replenishmentSystem?: string
): ItemWithData {
  const hasRules = material.id
    ? materialHasRules(material.id, rulesByField)
    : false;

  return {
    id: material.id!,
    title: (
      <VStack spacing={0} className="py-1 cursor-pointer">
        {material?.description && (
          <span className="font-semibold truncate">{material.description}</span>
        )}
        <div className="flex items-center gap-2 group">
          <h3 className="text-xs text-muted-foreground truncate">
            {getItemReadableId(items, material.itemId) ??
              material.item?.readableIdWithRevision ??
              material.description ??
              ""}
          </h3>
          {hasRules && (
            <LuSquareFunction className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          )}
          {material.itemId && material.itemType && (
            <Link
              to={getLinkToItemDetails(material.itemType, material.itemId)}
              onClick={(e) => e.stopPropagation()}
            >
              <LuExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100" />
            </Link>
          )}
        </div>
      </VStack>
    ),
    checked,
    details: (
      <HStack spacing={2}>
        {["Batch", "Serial"].includes(
          material.item?.itemTrackingType ?? ""
        ) && (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary">
                <TrackingTypeIcon
                  type={material.item?.itemTrackingType ?? ""}
                />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {material.item.itemTrackingType === "Inventory" ? (
                <Trans>Inventory Tracking</Trans>
              ) : material.item.itemTrackingType === "Non-Inventory" ? (
                <Trans>Non-Inventory Tracking</Trans>
              ) : material.item.itemTrackingType === "Serial" ? (
                <Trans>Serial Tracking</Trans>
              ) : (
                <Trans>Batch Tracking</Trans>
              )}
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary">
              <MethodIcon type={material.methodType} isKit={material.kit} />
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {material.methodType === "Purchase to Order" ? (
              <Trans>Purchase to Order</Trans>
            ) : material.methodType === "Pull from Inventory" ? (
              <Trans>Pull from Inventory</Trans>
            ) : (
              <Trans>Make to Order</Trans>
            )}
          </TooltipContent>
        </Tooltip>

        {replenishmentSystem === "Buy and Make" && (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary">
                <SourcingTypeIcon type={material.sourcingType} />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{material.sourcingType}</TooltipContent>
          </Tooltip>
        )}

        <Badge variant="secondary">{material.quantity}</Badge>

        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary">
              <MethodItemTypeIcon type={material.itemType} />
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {material.itemType === "Consumable" ? (
              <Trans>Consumable</Trans>
            ) : material.itemType === "Material" ? (
              <Trans>Material</Trans>
            ) : (
              <Trans>Part</Trans>
            )}
          </TooltipContent>
        </Tooltip>
      </HStack>
    ),
    data: {
      ...material,
      order
    }
  };
}

function getFieldKey(field: string, itemId: string) {
  return `${field}:${itemId}`;
}

const usePendingMaterials = (methodBindings: MethodBindings) => {
  type PendingItem = ReturnType<typeof useFetchers>[number] & {
    formData: FormData;
  };

  return useFetchers()
    .filter((fetcher): fetcher is PendingItem => {
      return (
        (fetcher.formAction === methodBindings.urls.newMethodMaterial ||
          fetcher.formAction?.includes("/methods/material/")) ??
        false
      );
    })
    .reduce<z.infer<typeof methodMaterialValidator>[]>((acc, fetcher) => {
      const formData = fetcher.formData;
      const material = methodMaterialValidator.safeParse(
        Object.fromEntries(formData)
      );

      if (material.success) {
        return [...acc, material.data];
      }
      return acc;
    }, []);
};
